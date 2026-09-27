/* Shared helpers + chrome behaviour (nav, cursor, progress, reveal). */
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
      <div class="cursor" id="cursor" aria-hidden="true"></div>
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
              <li><a href="mailto:${esc(C.contact.email)}">${esc(C.contact.email)}</a></li>
              ${C.contact.socials.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)}</a></li>`).join("")}
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
      <h1 class="page-title reveal">${esc(d.title)} <span class="outline">${esc(d.outline || "")}</span></h1>
      ${d.sub ? `<p class="page-sub reveal">${esc(d.sub)}</p>` : ""}
    </div>
    <div class="mini-belt" aria-hidden="true"></div>`;
}

/* Chrome */
function initChrome() {
  renderChrome();
  renderPageHero();
  const nav = $("#nav");
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

  // custom cursor ring (fine pointers only)
  const cursor = $("#cursor");
  if (cursor && finePointer && !reduceMotion) {
    let x = -100, y = -100, cx = x, cy = y;
    addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; cursor.classList.add("on"); }, { passive: true });
    document.addEventListener("mouseleave", () => cursor.classList.remove("on"));
    document.addEventListener("mouseover", (e) => {
      cursor.classList.toggle("hover", !!e.target.closest("a, button, [data-hover], input, select, textarea, label"));
    });
    (function loop() {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    })();
  }

  // magnetic buttons
  if (finePointer && !reduceMotion) {
    document.addEventListener("mousemove", (e) => {
      $$(".magnetic").forEach((b) => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const near = Math.hypot(dx, dy) < 110;
        b.style.transform = near ? `translate(${dx * 0.18}px, ${dy * 0.25}px)` : "";
      });
    }, { passive: true });
  }

  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  // boot screen
  const boot = $("#boot");
  if (boot) {
    const done = () => { boot.classList.add("done"); document.body.classList.add("booted"); setTimeout(() => boot.remove(), 700); };
    if (reduceMotion || sessionStorageSafe("booted")) done();
    else setTimeout(done, 1100);
  } else document.body.classList.add("booted");
}

function sessionStorageSafe(key) {
  try {
    const seen = sessionStorage.getItem(key);
    sessionStorage.setItem(key, "1");
    return !!seen;
  } catch { return false; }
}
