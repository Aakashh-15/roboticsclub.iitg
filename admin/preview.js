/* =====================================================================
   Live website preview inside the site editor.
   ---------------------------------------------------------------------
   While you edit, the preview pane shows the real website page, using
   your UNSAVED changes. It refreshes about half a second after you stop
   typing. Nothing is published until you press Save.

   To change which page a section previews, edit PAGES below.
   ===================================================================== */
const PAGES = {
  //  editor file name → [content file it replaces, website page to show]
  timeline:      ["timeline",      "index.html#happening"],
  announcements: ["announcements", "index.html#happening"],
  flagship:      ["events",        "index.html#happening"],
  achievements:  ["achievements",  "achievements.html"],
  projects:      ["projects",      "projects.html"],
  team:          ["team",          "team.html"],
  gallery:       ["gallery",       "gallery.html"],
  resources:     ["resources",     "resources.html"],
  settings:      ["settings",      "index.html"],
};

// The website's root address, worked out from this script's own address (…/admin/preview.js).
// It must be absolute: the editor draws the preview inside a frame whose base is the domain
// root, so a relative "../team.html" would point at aakashh-15.github.io/team.html (a 404)
// instead of aakashh-15.github.io/roboticsclub.iitg/team.html.
const SITE_ROOT = new URL("../", (document.currentScript && document.currentScript.src) || location.href).href;

(() => {
  const CMS = window.CMS;
  if (!CMS || !window.createClass || !window.h) return;
  const h = window.h;

  // entry data as a plain object (works with both plain and Immutable-style entries)
  const draftOf = (entry) => {
    const e = entry && entry.toJS ? entry.toJS() : entry;
    return (e && e.data) || {};
  };
  // pictures uploaded in this session aren't on the site yet: swap in the editor's local copy
  const withLocalAssets = (value, getAsset) => {
    if (typeof value === "string") {
      if (/^images\/uploads\//.test(value) && getAsset) {
        try { const a = getAsset(value); const url = a && (a.url || (a.toString && a.toString())); if (url && url !== "[object Object]") return url; } catch {}
      }
      return value;
    }
    if (Array.isArray(value)) return value.map((v) => withLocalAssets(v, getAsset));
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withLocalAssets(v, getAsset)]));
    return value;
  };

  const makePreview = (name) => {
    const [file, page] = PAGES[name];
    const [path, hash] = page.split("#");
    const src = `${SITE_ROOT}${path}?cmsPreview=1${hash ? "#" + hash : ""}`;
    return window.createClass({
      componentDidMount() { this.push(true); },
      componentDidUpdate() { this.push(false); },
      componentWillUnmount() { clearTimeout(this.t); },
      push(first) {
        window.__rcPreviewDraft = { file, data: withLocalAssets(draftOf(this.props.entry), this.props.getAsset) };
        clearTimeout(this.t);
        this.t = setTimeout(() => {
          const f = this.frame;
          if (!f) return;
          try { first && f.contentWindow.location.href === "about:blank" ? (f.src = src) : f.contentWindow.location.reload(); }
          catch { f.src = src; }
        }, first ? 0 : 550);
      },
      render() {
        return h("div", { style: { display: "flex", flexDirection: "column", height: "calc(100vh - 140px)", minHeight: "520px", background: "#000", borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(157,134,255,.45)" } },
          h("div", { style: { display: "flex", alignItems: "center", gap: "10px", padding: "9px 14px", background: "linear-gradient(135deg,#7b5cfa,#4b33c7)", color: "#fff", font: "700 12px/1.2 Manrope, system-ui, sans-serif", letterSpacing: ".08em", textTransform: "uppercase" } },
            h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#6fe3a1" } }),
            "Live preview · not saved yet",
            h("a", { href: SITE_ROOT + page, target: "_blank", rel: "noopener", style: { marginLeft: "auto", color: "#fff", textTransform: "none", letterSpacing: 0, fontWeight: 600 } }, "Open live site ↗")),
          h("iframe", { ref: (el) => (this.frame = el), src, title: "Website preview", style: { flex: 1, width: "100%", border: 0, background: "#000" } }));
      },
    });
  };

  // dark page behind the preview box (otherwise a white strip shows under it)
  try { CMS.registerPreviewStyle("html, body { margin: 0; background: #000; }", { raw: true }); } catch {}
  Object.keys(PAGES).forEach((name) => CMS.registerPreviewTemplate(name, makePreview(name)));
})();
