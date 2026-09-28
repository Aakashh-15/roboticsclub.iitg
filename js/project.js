/* Project deep-dive page: project.html?id=<project id> */
(() => {
  const C = window.CLUB;
  initChrome();

  const id = new URLSearchParams(location.search).get("id");
  const list = C.projects;
  const idx = list.findIndex((p) => p.id === id);
  const root = $("#project");

  if (idx < 0) {
    root.innerHTML = `
      <section class="container pd-missing">
        <span class="eyebrow">Error 404</span>
        <h1 class="h2">Project <span class="outline">not found</span></h1>
        <p class="muted">The requested project could not be found. It may have been renamed or removed.</p>
        <a class="btn btn-solid" href="projects.html">Back to all projects</a>
      </section>`;
    return;
  }

  const p = list[idx];
  const prev = list[(idx - 1 + list.length) % list.length];
  const next = list[(idx + 1) % list.length];
  const accent = { purple: "var(--purple)", pink: "var(--pink)", yellow: "var(--yellow)" }[p.color] || "var(--purple)";
  document.title = `${p.title} · Robotics Club IIT Guwahati`;
  document.documentElement.style.setProperty("--accent", accent);

  const statusCls = /position/i.test(p.status) ? "gold" : /active|ongoing/i.test(p.status) ? "live" : "";
  const [first, ...rest] = p.title.split(" ");
  const titleHtml = rest.length ? `${esc(first)} <span class="outline">${esc(rest.join(" "))}</span>` : esc(p.title);

  const specs = [
    ...(p.event ? [["Showcased at", p.event]] : []),
    ["Category", p.group],
    ["Status", p.status],
    ...(p.specs || []),
  ];
  const people = [
    ...(p.lead ? [{ name: p.lead, role: "Project lead" }] : []),
    ...(p.mentors || []).map((m) => ({ name: m, role: "Mentor" })),
  ];
  const related = list.filter((q) => q !== p && q.group === p.group).slice(0, 3);

  root.innerHTML = `
    <section class="pd-hero container">
      <nav class="crumbs reveal" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span><a href="projects.html">Projects</a><span>/</span><span>${esc(p.title)}</span>
      </nav>
      <h1 class="pd-title reveal">${titleHtml}</h1>
      <p class="pd-sub reveal">${esc(p.summary)}</p>
      <div class="pd-tags reveal">
        <span class="badge ${statusCls}">${esc(p.status)}</span>
        ${p.event ? `<span class="badge">${esc(p.event)}</span>` : ""}
        ${p.subtitle ? `<span class="badge">${esc(p.subtitle)}</span>` : ""}
      </div>
      ${media(p.image, p.icon, p.title, "pd-cover reveal")}
    </section>

    <div class="container pd-grid">
      <div>
        <section class="reveal">
          <h2>Overview</h2>
          <p class="pd-lead">${esc(p.overview || p.summary)}</p>
        </section>
        ${p.highlights?.length ? `
        <section class="reveal">
          <h2>Highlights</h2>
          <ul class="pd-list">${p.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
        </section>` : ""}
        ${p.timeline?.length ? `
        <section class="reveal">
          <h2>Roadmap</h2>
          <ol class="pd-steps">${p.timeline.map(([a, b]) => `<li><div><b>${esc(a)}</b><span>${esc(b)}</span></div></li>`).join("")}</ol>
        </section>` : ""}
        ${p.links?.length ? `
        <section class="reveal">
          <h2>Links</h2>
          <div class="ann-links">${p.links.map(([l, u]) => `<a class="btn btn-outline btn-sm" href="${esc(u)}" target="_blank" rel="noopener">${esc(l)} <i>${ICONS.arrow}</i></a>`).join("")}</div>
        </section>` : ""}
        <p class="note reveal">Contributed to this project? Please send photographs, results or a technical write-up to
          <a class="text-link" href="mailto:${esc(C.contact.email)}?subject=${encodeURIComponent("Project page: " + p.title)}">${esc(C.contact.email)}</a> for inclusion on this page.</p>
      </div>

      <aside class="pd-aside">
        <div class="pd-box reveal">
          <h3>Fact sheet</h3>
          <dl class="pd-specs">${specs.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        </div>
        ${people.length ? `
        <div class="pd-box reveal">
          <h3>People</h3>
          <div class="pd-people">${people.map((m, i) => `
            <div class="pd-person">${portrait(m, i, "pd-face")}<div><b>${esc(m.name)}</b><small>${esc(m.role)}</small></div></div>`).join("")}
          </div>
        </div>` : ""}
        ${p.stack?.length ? `
        <div class="pd-box reveal">
          <h3>Tech stack</h3>
          <div class="pd-stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        </div>` : ""}
      </aside>
    </div>

    <section class="pd-more">
      <div class="container">
        ${related.length ? `
        <div class="sec-head reveal"><div><span class="eyebrow">More from ${esc(p.group)}</span><h2 class="h2">Keep <span class="outline">exploring</span></h2></div></div>
        <div class="project-grid">${related.map((q) => `
          <a class="p-card reveal c-${q.color || "purple"}" href="project.html?id=${encodeURIComponent(q.id)}">
            ${media(q.image, q.icon, q.title, "p-media")}
            <div class="p-body">
              <div class="p-meta"><span class="p-event">${esc(q.event || q.subtitle || q.group)}</span></div>
              <h3>${esc(q.title)}</h3>
              <p>${esc(q.summary)}</p>
              <span class="p-go">Deep dive <i>${ICONS.arrow}</i></span>
            </div>
          </a>`).join("")}
        </div>` : ""}
        <nav class="pd-nav" aria-label="Project navigation">
          <a href="project.html?id=${encodeURIComponent(prev.id)}"><small>← Previous</small><strong>${esc(prev.title)}</strong></a>
          <a href="project.html?id=${encodeURIComponent(next.id)}"><small>Next →</small><strong>${esc(next.title)}</strong></a>
        </nav>
      </div>
    </section>`;

  wireFallbacks(root);
  observeReveals(root);

  // arrow keys hop between projects
  addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea")) return;
    if (e.key === "ArrowLeft") location.href = `project.html?id=${encodeURIComponent(prev.id)}`;
    if (e.key === "ArrowRight") location.href = `project.html?id=${encodeURIComponent(next.id)}`;
  });
})();
