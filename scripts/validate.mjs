#!/usr/bin/env node
/*
 * Sanity-checks js/data.js before it goes live.
 * Run:  node scripts/validate.mjs     (also runs in CI on every push / PR)
 *
 * Catches the mistakes that are easy to make when editing content by hand:
 * syntax errors, duplicate project ids, achievements pointing at projects
 * that don't exist, malformed dates, missing local files, etc.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

// ---- load data.js exactly like the browser does ----
let C;
try {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(join(root, "js/data.js"), "utf8"), sandbox, { filename: "js/data.js" });
  C = sandbox.window.CLUB;
  if (!C) throw new Error("js/data.js did not define window.CLUB");
} catch (e) {
  console.error(`✖ js/data.js failed to load:\n  ${e.message}`);
  process.exit(1);
}

const isLocal = (u) => typeof u === "string" && !/^(https?:|mailto:|#)/.test(u);
const checkLocal = (u, where) => {
  if (!isLocal(u)) return;
  const path = u.split(/[?#]/)[0];
  if (path && !existsSync(join(root, decodeURI(path)))) err(`${where}: file not found → ${u}`);
};
const isoDate = /^\d{4}-\d{2}-\d{2}$/;

// ---- required top-level sections ----
for (const key of ["about", "projects", "announcements", "events", "competitions", "achievements", "team", "gallery", "resources", "contact"]) {
  if (C[key] == null) err(`missing top-level section: ${key}`);
}

// ---- projects ----
const ids = new Set();
(C.projects || []).forEach((p, i) => {
  const at = `projects[${i}]${p.id ? ` (${p.id})` : ""}`;
  if (!p.id) err(`${at}: missing id`);
  else if (!/^[a-z0-9-]+$/.test(p.id)) err(`${at}: id must be lowercase letters, numbers and dashes`);
  else if (ids.has(p.id)) err(`${at}: duplicate id "${p.id}"`);
  ids.add(p.id);
  if (!p.title) err(`${at}: missing title`);
  if (!p.summary) err(`${at}: missing summary`);
  if (!p.group) err(`${at}: missing group (used for the filter chips)`);
  checkLocal(p.image, at);
});

// ---- notices (news bar) ----
(C.notices || []).forEach((n, i) => {
  if (!n.text) err(`notices[${i}]: missing text`);
  checkLocal(n.link, `notices[${i}]`);
});

// ---- announcements ----
(C.announcements || []).forEach((a, i) => {
  const at = `announcements[${i}] "${a.title || "?"}"`;
  if (!isoDate.test(a.date || "")) err(`${at}: date must look like 2026-09-28`);
  if (!a.title || !a.body) err(`${at}: needs title and body`);
  (a.links || []).forEach(([label, url]) => checkLocal(url, `${at} link "${label}"`));
});
if ((C.announcements || []).filter((a) => a.pinned).length > 1) warn("more than one announcement is pinned; only the newest pinned one is featured");

// ---- timeline ----
(C.timeline || []).forEach((t, i) => {
  const at = `timeline[${i}] "${t.title || "?"}"`;
  if (!isoDate.test(t.start || "")) err(`${at}: start must look like 2026-06-29`);
  if (t.end && !isoDate.test(t.end)) err(`${at}: end must look like 2026-07-05`);
  if (t.end && t.start && t.end < t.start) err(`${at}: end is before start`);
  if (!t.title) err(`${at}: missing title`);
  checkLocal(t.image, at);
});

// ---- achievements ----
(C.achievements || []).forEach((a, i) => {
  const at = `achievements[${i}] "${a.event || "?"}"`;
  if (!a.year || !a.title || !a.event) err(`${at}: needs year, title and event`);
  if (a.project && !ids.has(a.project)) err(`${at}: project "${a.project}" does not match any project id`);
  checkLocal(a.image, at);
});

// ---- team ----
// same slug rule as portrait() in js/common.js
const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const names = new Set();
const noPhoto = [];
(C.team || []).forEach((m, i) => {
  const at = `team[${i}]`;
  if (!m.name || !m.role) err(`${at}: needs name and role`);
  if (names.has(m.name)) warn(`${at}: "${m.name}" appears twice`);
  names.add(m.name);
  if (m.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m.email)) err(`${at} (${m.name}): email looks invalid`);
  if (m.linkedin && !/^https:\/\/(www\.|[a-z]{2}\.)?linkedin\.com\//.test(m.linkedin)) err(`${at} (${m.name}): linkedin should be a full https://linkedin.com/in/... URL`);
  if (m.image) checkLocal(m.image, at);
  else if (m.name && !existsSync(join(root, "images/team", `${slug(m.name)}.jpg`))) noPhoto.push(`${slug(m.name)}.jpg`);
});
if (noPhoto.length) warn(`${noPhoto.length} team photo(s) missing in images/team/ (initials shown instead): ${noPhoto.join(", ")}`);

// ---- gallery / events ----
(C.gallery || []).forEach((g, i) => checkLocal(g.image, `gallery[${i}]`));
(C.events || []).forEach((e, i) => checkLocal(e.image, `events[${i}]`));

// ---- resources ----
(C.resources || []).forEach((tab, t) => {
  if (!tab.tab) err(`resources[${t}]: missing tab name`);
  (tab.items || []).forEach((it, i) => {
    const at = `resources "${tab.tab}"[${i}] "${it.title || "?"}"`;
    if (!it.title) err(`${at}: missing title`);
    if (!tab.inventory && !it.url) err(`${at}: missing url`);
    checkLocal(it.url, at);
  });
});

// ---- contact ----
if (!/^[^@\s]+@[^@\s]+$/.test(C.contact?.email || "")) err("contact.email looks invalid");

// ---- placeholders still in the data ----
const countSamples = (arr = []) => arr.filter((x) => x && x.sample).length;
const samples =
  countSamples(C.projects) + countSamples(C.announcements) + countSamples(C.competitions) +
  countSamples(C.achievements) + (C.resources || []).reduce((n, r) => n + countSamples(r.items), 0);
if (samples) warn(`${samples} entries are still marked sample: true (placeholders to replace)`);

// ---- report ----
warnings.forEach((w) => console.warn(`⚠ ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`✖ ${e}`));
  console.error(`\n${errors.length} problem(s) found in js/data.js`);
  process.exit(1);
}
console.log(`✔ data.js OK: ${C.projects.length} projects, ${C.announcements.length} announcements, ${C.achievements.length} achievements, ${C.team.length} team members`);
