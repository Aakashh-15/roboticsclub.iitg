/* Shared helpers + chrome behaviour (nav, progress, reveal). */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = matchMedia("(pointer: fine)").matches;

const initials = (name) =>
  name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

/* Image with graceful icon fallback. */
function media(image, icon = "bot", alt = "", cls = "") {
  const ico = ICONS[icon] || ICONS.bot;
  if (!image) return `<div class="media noimg ${cls}"><span class="media-ico">${ico}</span></div>`;
  return `<div class="media ${cls}"><img src="${esc(encodeURI(image))}" alt="${esc(alt)}" loading="lazy" decoding="async" data-fallback /><span class="media-ico">${ico}</span></div>`;
}
function wireFallbacks(root = document) {
  $$("img[data-fallback]", root).forEach((img) => {
    const fail = () => img.closest(".media")?.classList.add("noimg");
    if (img.complete && img.naturalWidth === 0) fail();
    img.addEventListener("error", fail, { once: true });
    img.addEventListener("load", () => img.closest(".media")?.classList.add("loaded"), { once: true });
  });
}

/* Team portrait. Looks for images/team/<name-slug>.jpg (or m.image);
   shows the member's initials until the photo exists. */
const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const TONES = ["purple", "pink", "yellow", "amber"];
function portrait(m, i = 0, cls = "") {
  const src = m.image || `images/team/${slug(m.name)}.jpg`;
  return `<div class="media portrait tone-${TONES[i % TONES.length]} ${cls}"><img src="${esc(src)}" alt="${esc(m.name)}" loading="lazy" decoding="async" data-fallback /><span class="media-ico initials">${esc(initials(m.name))}</span></div>`;
}

/* ---------- member ID card (popup) ----------
   Opened from the leadership grid (home) and the Team page.
   Shows whatever the member entry has: photo, role, department, year,
   email, LinkedIn. Falls back to the club email when none is set. */
let idcLastFocus = null;
function openMemberCard(i) {
  const C = window.CLUB;
  const m = C.team[i];
  if (!m) return;
  closeMemberCard(true);
  idcLastFocus = document.activeElement;

  const details = [
    ["Department", m.department],
    ["Year", m.year],
    ["Email", m.email],
  ].filter(([, v]) => v);
  const contact = m.email || C.contact.email;
  const actions = `
    <a class="btn btn-solid btn-sm" href="mailto:${esc(contact)}?subject=${encodeURIComponent("Hello " + m.name.split(" ").find((w) => w.length > 1))}">${ICONS.mail}<span>${m.email ? "Email" : "Email the club"}</span></a>
    ${m.linkedin ? `<a class="btn btn-outline btn-sm" href="${esc(m.linkedin)}" target="_blank" rel="noopener">${ICONS.linkedin}<span>LinkedIn</span></a>` : ""}
    <button class="btn btn-outline btn-sm idc-copy" type="button" data-copy="${esc(contact)}">${ICONS.copy}<span>Copy email</span></button>`;

  const wrap = document.createElement("div");
  wrap.className = "idc-backdrop";
  wrap.innerHTML = `
    <div class="idc" role="dialog" aria-modal="true" aria-labelledby="idc-name">
      <div class="idc-head">
        <span class="idc-slot" aria-hidden="true"></span>
        <div class="idc-brand">
          <img src="images/logo.svg" alt="" />
          <span>ROBOTICS CLUB<small>IIT GUWAHATI</small></span>
        </div>
        <span class="idc-tag">Core Team<br />2026–27</span>
        <button class="idc-close" type="button" aria-label="Close">×</button>
      </div>
      ${portrait(m, i, "idc-photo")}
      <div class="idc-body">
        <h3 id="idc-name">${esc(m.name)}</h3>
        <span class="idc-role">${esc(m.role)}</span>
        ${m.about ? `<p class="idc-about">${esc(m.about)}</p>` : ""}
        ${details.length ? `<dl class="idc-details">${details.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
        ${!m.email ? `<p class="idc-note">Personal contact not listed. Messages go to <b>${esc(C.contact.email)}</b>.</p>` : ""}
        <div class="idc-actions">${actions}</div>
      </div>
      <div class="idc-foot" aria-hidden="true">
        <span class="idc-code"></span>
        <span>No. ${String(i + 1).padStart(2, "0")} / ${String(C.team.length).padStart(2, "0")}</span>
      </div>
    </div>`;
  document.body.appendChild(wrap);
  document.body.classList.add("lb-open");
  wireFallbacks(wrap);
  requestAnimationFrame(() => wrap.classList.add("open"));

  const card = $(".idc", wrap);
  $(".idc-close", wrap).addEventListener("click", () => closeMemberCard());
  wrap.addEventListener("click", (e) => { if (e.target === wrap) closeMemberCard(); });
  $(".idc-copy", wrap).addEventListener("click", async (e) => {
    const btn = e.currentTarget, label = $("span", btn);
    try { await navigator.clipboard.writeText(btn.dataset.copy); label.textContent = "Copied"; }
    catch { label.textContent = btn.dataset.copy; }
    setTimeout(() => (label.textContent = "Copy email"), 1800);
  });
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return closeMemberCard();
    if (e.key !== "Tab") return;
    // keep focus inside the card
    const f = $$("a, button", card);
    if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
  });
  $(".idc-actions a, .idc-actions button", wrap).focus({ preventScroll: true });
}
function closeMemberCard(instant = false) {
  const wrap = $(".idc-backdrop");
  if (!wrap) return;
  document.body.classList.remove("lb-open");
  if (instant) wrap.remove();
  else { wrap.classList.remove("open"); setTimeout(() => wrap.remove(), 250); }
  idcLastFocus?.focus?.({ preventScroll: true });
}
/* Any element with data-member="<index>" opens that member's card. */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-member]");
  if (t) { e.preventDefault(); openMemberCard(+t.dataset.member); }
});

/* ---------- poster viewer: any [data-poster="src"] opens the image full size ---------- */
function openPoster(src, title = "") {
  const wrap = document.createElement("div");
  wrap.className = "pv-backdrop";
  wrap.innerHTML = `
    <figure class="pv" role="dialog" aria-modal="true" aria-label="${esc(title || "Poster")}">
      <button class="idc-close pv-close" type="button" aria-label="Close">×</button>
      <img src="${esc(src)}" alt="${esc(title)}" />
      ${title ? `<figcaption>${esc(title)}</figcaption>` : ""}
    </figure>`;
  const last = document.activeElement;
  const close = () => { document.body.classList.remove("lb-open"); wrap.classList.remove("open"); setTimeout(() => wrap.remove(), 250); last?.focus?.({ preventScroll: true }); };
  document.body.appendChild(wrap);
  document.body.classList.add("lb-open");
  requestAnimationFrame(() => wrap.classList.add("open"));
  wrap.addEventListener("click", (e) => { if (e.target === wrap || e.target.closest(".pv-close")) close(); });
  wrap.addEventListener("keydown", (e) => { if (e.key === "Escape" || e.key === "Tab") { e.preventDefault(); if (e.key === "Escape") close(); } });
  $(".pv-close", wrap).focus();
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-poster]");
  if (t) { e.preventDefault(); openPoster(t.dataset.poster, t.dataset.title || ""); }
});

/* ---------- timeline helpers (home + updates page) ---------- */
const pad2 = (n) => String(n).padStart(2, "0");
const todayISO = (() => { const t = new Date(); return `${t.getFullYear()}-${pad2(t.getMonth() + 1)}-${pad2(t.getDate())}`; })();
const dOf = (iso) => new Date(iso + "T00:00:00");
function fmtRange(start, end) {
  const a = dOf(start), b = end ? dOf(end) : null;
  const day = (d) => d.getDate(), mon = (d) => d.toLocaleDateString("en-IN", { month: "short" });
  if (!b || end === start) return `${day(a)} ${mon(a)} ${a.getFullYear()}`;
  if (a.getFullYear() !== b.getFullYear()) return `${day(a)} ${mon(a)} ${a.getFullYear()} – ${day(b)} ${mon(b)} ${b.getFullYear()}`;
  if (a.getMonth() === b.getMonth()) return `${day(a)}–${day(b)} ${mon(a)} ${a.getFullYear()}`;
  return `${day(a)} ${mon(a)} – ${day(b)} ${mon(b)} ${b.getFullYear()}`;
}
/* Timeline entries + announcements flagged timeline: true, oldest first, with a status. */
function timelineItems() {
  const C = window.CLUB;
  const items = [
    ...(C.timeline || []).map((t) => ({ ...t, kind: "event" })),
    ...C.announcements.filter((a) => a.timeline).map((a) => ({
      kind: "update", start: a.date, title: a.title, type: a.type, desc: a.body, links: a.links, href: "updates.html#announcements",
    })),
  ];
  items.forEach((it) => {
    const end = it.end || it.start;
    it.status = it.start > todayISO ? "upcoming" : end >= todayISO ? "live" : "recent";
  });
  return items.sort((x, y) => x.start.localeCompare(y.start));
}
const STATUS_LABEL = { upcoming: "Upcoming", live: "Live now", recent: "Recent" };

/* Scroll-reveal */
const revealObs = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObs.unobserve(e.target);
      }
    }),
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
function observeReveals(root = document) {
  $$(".reveal:not(.in)", root).forEach((el, i) => {
    el.style.setProperty("--d", `${(i % 6) * 60}ms`);
    revealObs.observe(el);
  });
}

/* Brand icon for a social link, matched on its name in data.js ("GitHub", "Instagram", …). */
const socialKey = (name) => name.toLowerCase().replace(/[^a-z]/g, "");
const socialIcon = (name) => ICONS[socialKey(name)] || ICONS.arrow;

/* ---------- shared header + footer ----------
   Every page has <div id="site-header"></div> and <div id="site-footer"></div>;
   <body data-page="..."> marks the active nav item. */
const PAGES = [
  ["home", "Home", "index.html"],
  ["about", "About", "index.html#about"],
  ["projects", "Projects", "projects.html"],
  ["updates", "Updates", "updates.html"],
  ["competitions", "Competitions", "competitions.html"],
  ["team", "Team", "team.html"],
  ["gallery", "Gallery", "gallery.html"],
  ["resources", "Resources", "resources.html"],
];

function renderChrome() {
  const page = document.body.dataset.page || "home";
  const C = window.CLUB;
  const brand = `<img src="images/logo.svg" alt="" /><span class="brand-text">ROBOTICS CLUB.<small>IIT GUWAHATI</small></span>`;

  const header = $("#site-header");
  if (header) {
    header.outerHTML = `
      <div class="progress" id="progress"></div>
      <header class="nav" id="nav">
        <a href="index.html" class="brand" aria-label="Robotics Club IIT Guwahati — home">${brand}</a>
        <nav class="nav-links" id="navLinks" aria-label="Primary">
          ${PAGES.map(([id, label, href]) => `<a href="${href}"${id === page ? ' class="active" aria-current="page"' : ""}>${label}</a>`).join("")}
          <a href="index.html#contact" class="nav-cta-mobile">Contact Us</a>
        </nav>
        <a href="index.html#contact" class="btn btn-outline nav-cta">Contact Us</a>
        <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><span></span><span></span></button>
      </header>`;
  }

  const footer = $("#site-footer");
  if (footer) {
    footer.outerHTML = `
      <footer class="footer">
        <div class="container footer-grid">
          <div class="footer-about">
            <a href="index.html" class="brand">${brand}</a>
            <p class="muted">${esc(C.tagline)}</p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>${PAGES.slice(2).map(([, label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li><a class="f-social s-mail" href="mailto:${esc(C.contact.email)}"><i>${ICONS.mail}</i>${esc(C.contact.email)}</a></li>
              ${C.contact.socials.map(([n, u]) => `<li><a class="f-social s-${socialKey(n)}" href="${esc(u)}" target="_blank" rel="noopener"><i>${socialIcon(n)}</i>${esc(n)}</a></li>`).join("")}
            </ul>
          </div>
        </div>
        <div class="container footer-inner">
          <p class="muted">© <span id="year"></span> Robotics Club, IIT Guwahati. Built by the club, for the club.</p>
          <a href="#" class="to-top" aria-label="Back to top">↑</a>
        </div>
      </footer>`;
  }
}

/* Sub-page hero: <section class="page-hero" data-eyebrow data-title data-outline data-sub> */
function renderPageHero() {
  const h = $(".page-hero[data-title]");
  if (!h) return;
  const d = h.dataset;
  h.innerHTML = `
    <div class="container">
      <nav class="crumbs reveal" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><span>${esc(d.eyebrow)}</span></nav>
      <h1 class="page-title reveal">${esc(d.title.replace(/&amp;/g, "&"))} <span class="outline">${esc(d.outline || "")}</span></h1>
      ${d.sub ? `<p class="page-sub reveal">${esc(d.sub)}</p>` : ""}
    </div>
    <div class="mini-belt" aria-hidden="true"></div>`;
}

/* Chrome */
function initChrome() {
  renderChrome();
  renderPageHero();
  const nav = $("#nav");
  const setNavH = () => nav && document.documentElement.style.setProperty("--nav-h", `${nav.offsetHeight}px`);
  setNavH();
  addEventListener("resize", setNavH, { passive: true });
  const burger = $("#burger");
  const links = $("#navLinks");
  const progress = $("#progress");

  const onScroll = () => {
    const h = document.documentElement;
    const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    progress && (progress.style.transform = `scaleX(${p})`);
    nav?.classList.toggle("scrolled", h.scrollTop > 20);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  burger?.addEventListener("click", () => {
    const open = !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
  });
  links?.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      document.body.classList.remove("menu-open");
      burger?.setAttribute("aria-expanded", "false");
    }
  });

  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  document.body.classList.add("booted");
}
