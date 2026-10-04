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

// Site editor preview (admin/preview.js): when this page runs inside the editor's preview
// pane, the draft being edited replaces the saved file, so changes show before saving.
const previewDraft = () => {
  try {
    if (!new URLSearchParams(location.search).has("cmsPreview")) return null;
    // the editor may nest the preview in its own frame: look in every parent window
    for (let w = window; w.parent !== w; ) { w = w.parent; if (w.__rcPreviewDraft) return w.__rcPreviewDraft; }
    return null;
  } catch { return null; }
};

if (typeof window !== "undefined") {
  const draft = previewDraft();
  if (draft) {
    // keep the reader's place when the preview refreshes after each edit
    const key = "rcPreviewScroll:" + location.pathname;
    addEventListener("pagehide", () => { try { sessionStorage.setItem(key, String(scrollY)); } catch {} });
    addEventListener("load", () => setTimeout(() => {
      try { const y = +sessionStorage.getItem(key); if (y) scrollTo(0, y); } catch {}
    }, 250));
  }
  window.CLUB_READY = Promise.all(
    CONTENT_FILES.map((name) =>
      fetch(`content/${name}.json`, { cache: "no-cache" }).then((r) => {
        if (!r.ok) throw new Error(`content/${name}.json: ${r.status}`);
        return r.json();
      })
    )
  )
    .then((files) => {
      const f = Object.fromEntries(CONTENT_FILES.map((n, i) => [n, files[i]]));
      if (draft && f[draft.file] !== undefined) f[draft.file] = draft.data; // unsaved edits
      return (window.CLUB = buildClub(f));
    })
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
