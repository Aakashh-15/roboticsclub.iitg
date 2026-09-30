/* =====================================================================
   ROBOTICS CLUB IIT GUWAHATI — CONTENT LOADER
   ---------------------------------------------------------------------
   All site content lives in content/*.json. Edit it through the site
   editor at /admin (no coding needed), or by hand in those files.

   This file loads the JSON and exposes it as window.CLUB. Pages wait for
   window.CLUB_READY before rendering.
   ===================================================================== */

// Turns the editor's {label, url} objects back into the [label, url]
// pairs the page code uses. Also exported for scripts/validate.mjs.
function buildClub(f) {
  const pairs = (arr, a, b) => (arr || []).map((o) => (Array.isArray(o) ? o : [o[a], o[b]]));
  const withLinks = (o) => (o.links ? { ...o, links: pairs(o.links, "label", "url") } : o);
  const list = (x, key = "items") => (x && x[key]) || [];
  return {
    ...f.settings,
    contact: { ...f.settings.contact, socials: pairs(f.settings.contact.socials, "name", "url") },
    projects: list(f.projects).map((p) => {
      const o = withLinks(p);
      if (o.specs) o.specs = pairs(o.specs, "label", "value");
      if (o.timeline) o.timeline = pairs(o.timeline, "phase", "detail");
      return o;
    }),
    announcements: list(f.announcements).map(withLinks),
    timeline: list(f.timeline).map(withLinks),
    events: list(f.events),
    achievements: list(f.achievements),
    team: list(f.team),
    gallery: list(f.gallery),
    resources: list(f.resources, "tabs"),
  };
}
const CONTENT_FILES = ["settings", "projects", "announcements", "timeline", "events", "achievements", "team", "gallery", "resources"];

if (typeof window !== "undefined") {
  window.CLUB_READY = Promise.all(
    CONTENT_FILES.map((name) =>
      fetch(`content/${name}.json`, { cache: "no-cache" }).then((r) => {
        if (!r.ok) throw new Error(`content/${name}.json: ${r.status}`);
        return r.json();
      })
    )
  )
    .then((files) => (window.CLUB = buildClub(Object.fromEntries(CONTENT_FILES.map((n, i) => [n, files[i]])))))
    .catch((err) => {
      console.error("Could not load site content:", err);
      document.addEventListener("DOMContentLoaded", () => {
        document.body.insertAdjacentHTML("afterbegin",
          '<p style="margin:0;padding:14px 20px;background:#b3261e;color:#fff;font:600 15px system-ui">Site content could not be loaded. If you opened this file directly, run a local server (see README).</p>');
      });
      throw err;
    });
}
if (typeof module !== "undefined") module.exports = { buildClub, CONTENT_FILES };
