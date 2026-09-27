/* Page rendering + interactions.
   Shared by every page: each block only runs if its container exists. */
(() => {
  const C = window.CLUB;
  const SVGNS = "http://www.w3.org/2000/svg";
  const has = (sel) => !!$(sel);

  initChrome();

  /* ---------- simple binds ---------- */
  $$("[data-bind]").forEach((el) => {
    const v = el.dataset.bind.split(".").reduce((o, k) => o?.[k], C);
    if (v) el.textContent = v;
  });

  const today = new Date();
  const toDate = (d) => new Date(d + "T00:00:00");
  const anns = [...C.announcements].sort((a, b) => b.date.localeCompare(a.date));
  const statusClass = (s = "") =>
    /position|1st|2nd|3rd/i.test(s) ? "gold" : /active|ongoing/i.test(s) ? "live" : "";
  const medal = (t = "") => (/^1st/.test(t) ? "🥇 " : /^2nd/.test(t) ? "🥈 " : /^3rd/.test(t) ? "🥉 " : "");
  const tier = (r = "") => (/^1st/.test(r) ? "gold" : /^2nd/.test(r) ? "silver" : /^3rd/.test(r) ? "bronze" : "");

  function selectChip(container, btn) {
    $$(".chip, .tab", container).forEach((c) => {
      c.classList.toggle("on", c === btn);
      c.setAttribute("aria-selected", c === btn);
    });
  }

  /* ---------- about + stats (home) ---------- */
  if (has("#aboutBody")) {
    $("#aboutBody").innerHTML = C.about.body.map((p) => `<p>${esc(p)}</p>`).join("");
    $("#pillars").innerHTML = C.about.pillars.map((p) => `<span class="pill" data-hover>${esc(p)}</span>`).join("");

    const computed = {
      projects: C.projects.length,
      podiums: C.achievements.filter((a) => tier(a.rank)).length,
      events: C.events.length,
      team: C.team.length,
    };
    $("#stats").innerHTML = C.stats
      .map((s) => {
        const v = s.value ?? computed[s.key] ?? 0;
        return `<div class="stat"><strong data-count="${v}" data-suffix="${esc(s.suffix || "")}">0</strong><span>${esc(s.label)}</span></div>`;
      })
      .join("");
    const countObs = new IntersectionObserver((es) =>
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        countObs.unobserve(e.target);
        const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix;
        if (reduceMotion) return (el.textContent = end + suf);
        const t0 = performance.now(), dur = 1200;
        const tick = (t) => {
          const k = Math.min(1, (t - t0) / dur);
          el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + (k === 1 ? suf : "");
          if (k < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }), { threshold: 0.6 });
    $$("[data-count]").forEach((el) => countObs.observe(el));
  }

  /* ---------- announcement ticker ---------- */
  if (has("#ticker")) {
    $("#ticker").innerHTML = Array(2)
      .fill(anns.map((a) => `<span>${esc(a.type)} <b>✦</b> ${esc(a.title)}</span>`).join(""))
      .join("");
  }

  /* ---------- explore tiles (home) ---------- */
  if (has("#exploreGrid")) {
    const resCount = C.resources.reduce((n, r) => n + r.items.length, 0);
    const tiles = [
      ["projects.html", "Projects", `${C.projects.length} builds`, "From Mars rovers to Rubik's cube solvers. Deep-dive into every robot we've built.", "rover", "purple"],
      ["updates.html", "Updates", anns[0] ? "Latest" : "News", anns[0] ? anns[0].title : "Announcements and events.", "bulb", "yellow"],
      ["competitions.html", "Competitions", "Inter IIT & more", "Where our teams compete, and the podiums they've brought home.", "trophy", "pink"],
      ["team.html", "Team", `${C.team.length} core members`, "Meet the people who keep the lab, the projects and the events running.", "bot", "amber"],
      ["resources.html", "Resources", `${resCount} materials`, "Setup guides, tutorials, the club archive and the components you can borrow.", "chip", "purple"],
    ];
    $("#exploreGrid").innerHTML = tiles
      .map(([href, title, meta, desc, icon, tone], i) => `
        <a class="x-tile reveal x-${tone}${i === 0 ? " x-big" : ""}" href="${href}" data-tilt>
          <span class="x-ico">${ICONS[icon]}</span>
          <span class="x-meta">${esc(meta)}</span>
          <h3>${esc(title)}</h3>
          <p>${esc(desc)}</p>
          <span class="x-go">${ICONS.arrow}</span>
        </a>`)
      .join("");
  }

  /* ---------- projects ---------- */
  if (has("#projectGrid")) {
    const PAGE = 12;
    const groups = ["All", ...new Set(C.projects.map((p) => p.group))];
    let pFilter = "All", pShowAll = false;

    $("#projectFilters").innerHTML = groups
      .map((g, i) => `<button class="chip${i ? "" : " on"}" role="tab" aria-selected="${!i}" data-g="${esc(g)}">${esc(g)}<sup>${g === "All" ? C.projects.length : C.projects.filter((p) => p.group === g).length}</sup></button>`)
      .join("");

    const render = () => {
      const list = C.projects.filter((p) => pFilter === "All" || p.group === pFilter);
      // the featured first card spans two columns, so show one fewer to keep rows full
      const limit = pFilter === "All" ? PAGE - 1 : PAGE;
      const shown = pShowAll ? list : list.slice(0, limit);
      $("#projectGrid").innerHTML =
        shown
          .map((p, i) => `
          <a class="p-card reveal c-${p.color || "purple"}${i === 0 && pFilter === "All" ? " feature" : ""}" href="project.html?id=${encodeURIComponent(p.id)}" data-tilt>
            ${media(p.image, p.icon, p.title, "p-media")}
            <div class="p-body">
              <div class="p-meta">
                <span class="badge ${statusClass(p.status)}">${esc(p.status || "")}</span>
                <span class="p-event">${esc(p.event || p.subtitle || p.group)}</span>
              </div>
              <h3>${esc(p.title)}</h3>
              <p>${esc(p.summary)}</p>
              <span class="p-go">Deep dive <i>${ICONS.arrow}</i></span>
            </div>
          </a>`)
          .join("") +
        (list.length > limit
          ? `<button class="btn btn-outline more-btn" id="moreProjects">${pShowAll ? "Show fewer" : `Show all ${list.length} projects`}</button>`
          : "");
      wireFallbacks($("#projectGrid"));
      observeReveals($("#projectGrid"));
      $("#moreProjects")?.addEventListener("click", () => {
        pShowAll = !pShowAll;
        render();
        if (!pShowAll) $("#projectGrid").scrollIntoView({ behavior: "smooth" });
      });
    };
    $("#projectFilters").addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      selectChip($("#projectFilters"), b);
      pFilter = b.dataset.g; pShowAll = false;
      render();
    });
    render();
  }

  // 3D tilt on cards/tiles
  if (finePointer && !reduceMotion) {
    document.addEventListener("mousemove", (e) => {
      const card = e.target.closest?.("[data-tilt]");
      $$("[data-tilt].tilting").forEach((c) => c !== card && (c.classList.remove("tilting"), (c.style.transform = "")));
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      card.classList.add("tilting");
      card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
      card.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
      card.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    }, { passive: true });
  }

  /* ---------- announcements ---------- */
  if (has("#annList")) {
    const fmt = (d) => toDate(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const isNew = (d) => (today - toDate(d)) / 864e5 <= 21;
    const types = ["All", ...new Set(anns.map((a) => a.type))];
    let aFilter = "All";

    $("#annFilters").innerHTML = types
      .map((t, i) => `<button class="chip${i ? "" : " on"}" role="tab" aria-selected="${!i}" data-t="${esc(t)}">${esc(t)}</button>`)
      .join("");

    const linkRow = (links = []) =>
      links.length
        ? `<div class="ann-links">${links.map(([l, u]) => `<a class="btn btn-sm ${/\.pdf$/i.test(u) ? "btn-solid" : "btn-outline"}" href="${esc(u)}" ${/^https?:/.test(u) ? 'target="_blank" rel="noopener"' : "download"}>${/\.pdf$/i.test(u) ? `<i>${ICONS.download}</i>` : ""}${esc(l)}</a>`).join("")}</div>`
        : "";

    const render = () => {
      const list = anns.filter((a) => aFilter === "All" || a.type === aFilter);
      const pinned = list.find((a) => a.pinned) || list[0];
      const rest = list.filter((a) => a !== pinned);
      $("#annPinned").innerHTML = pinned
        ? `<article class="ann-pinned reveal">
            <div class="ann-top"><span class="badge live">${pinned.pinned ? "📌 Pinned" : esc(pinned.type)}</span>${isNew(pinned.date) ? '<span class="badge new">New</span>' : ""}<time>${fmt(pinned.date)}</time></div>
            <h3>${esc(pinned.title)}</h3>
            <p>${esc(pinned.body)}</p>
            ${linkRow(pinned.links)}
          </article>`
        : `<p class="muted">No announcements yet.</p>`;
      $("#annList").innerHTML = rest
        .map((a) => `
          <li class="ann-item reveal">
            <div class="ann-date"><strong>${toDate(a.date).getDate()}</strong><span>${toDate(a.date).toLocaleDateString("en-IN", { month: "short" })}</span></div>
            <div>
              <div class="ann-top"><span class="badge">${esc(a.type)}</span>${isNew(a.date) ? '<span class="badge new">New</span>' : ""}</div>
              <h4>${esc(a.title)}</h4>
              <p>${esc(a.body)}</p>
              ${linkRow(a.links)}
            </div>
          </li>`)
        .join("");
      observeReveals($("#annPinned").parentElement);
    };
    $("#annFilters").addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      selectChip($("#annFilters"), b);
      aFilter = b.dataset.t;
      render();
    });
    render();
  }

  /* ---------- events ---------- */
  if (has("#eventsRow")) {
    $("#eventsRow").innerHTML = C.events
      .map((ev) => `
        <article class="ev-card">
          ${media(ev.image, "bulb", ev.title, "ev-media")}
          <div class="ev-body"><h4>${esc(ev.title)}</h4><p>${esc(ev.desc)}</p></div>
        </article>`)
      .join("");
    wireFallbacks($("#eventsRow"));
    $$("[data-scroll]").forEach((b) =>
      b.addEventListener("click", () => $("#eventsRow").scrollBy({ left: +b.dataset.scroll * 340, behavior: "smooth" }))
    );
  }

  /* ---------- competitions ---------- */
  if (has("#compGrid")) {
    $("#compMarquee").innerHTML = Array(2)
      .fill(C.competitions.map((c) => `<span>${esc(c.name)}</span><b>✦</b>`).join(""))
      .join("");
    $("#compGrid").innerHTML = C.competitions
      .map((c, i) => `
        <article class="comp-card reveal">
          <span class="comp-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="badge">${esc(c.scope)}</span>
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.desc)}</p>
        </article>`)
      .join("");
  }

  /* ---------- achievements: full timeline ---------- */
  if (has("#timeline")) {
    $("#timeline").innerHTML = C.achievements
      .map((a) => `
        <li class="tl-item reveal">
          <div class="tl-year">${esc(a.year)}</div>
          <div class="tl-card">
            ${media(a.image, "trophy", a.event, "tl-media")}
            <div class="tl-body">
              <span class="badge ${tier(a.rank) ? "gold" : ""}">${medal(a.rank)}${esc(a.title)}</span>
              <h3>${esc(a.event)}</h3>
              <p>${esc(a.desc)}</p>
              ${a.project ? `<a class="text-link" href="project.html?id=${encodeURIComponent(a.project)}">See the project ${ICONS.arrow}</a>` : ""}
            </div>
          </div>
        </li>`)
      .join("");
    wireFallbacks($("#timeline"));
  }

  /* ---------- hall of fame showcase (home) ----------
     Featured card on the left, every achievement listed on the right.
     Hover/click a row to feature it; auto-rotates until someone interacts. */
  if (has("#hof")) {
    const A = C.achievements;
    const achvLink = (a) => (a.project ? `project.html?id=${encodeURIComponent(a.project)}` : a.link || "competitions.html#hall-of-fame");

    const tally = [
      ["🥇", A.filter((a) => tier(a.rank) === "gold").length, "Gold"],
      ["🥈", A.filter((a) => tier(a.rank) === "silver").length, "Silver"],
      ["🌍", A.filter((a) => /international/i.test(a.event)).length, "International finals"],
      ["✦", A.length, "Milestones"],
    ].filter(([, n]) => n > 0);
    $("#hofTally").innerHTML = tally
      .map(([ico, n, label]) => `<div class="hof-t"><span class="hof-t-ico">${ico}</span><strong data-count="${n}" data-suffix="">${n}</strong><span>${label}</span></div>`)
      .join("");

    $("#hofStage").innerHTML =
      A.map((a, i) => `
        <a class="hof-slide${i ? "" : " on"}" href="${achvLink(a)}" data-i="${i}" ${i ? 'aria-hidden="true" tabindex="-1"' : ""}>
          ${media(a.image, "trophy", a.event, "hof-media")}
          <div class="hof-copy">
            <div class="hof-top">
              <span class="hof-year">${esc(a.year)}</span>
              <span class="hof-medal ${tier(a.rank)}">${medal(a.rank).trim() || "✦"}</span>
            </div>
            <span class="badge ${tier(a.rank) ? "gold" : "live"}">${esc(a.event)}</span>
            <h3>${esc(a.title)}</h3>
            <p>${esc(a.desc)}</p>
            <span class="text-link">${a.project ? "See the project" : "Explore"} ${ICONS.arrow}</span>
          </div>
        </a>`).join("") + `<div class="hof-timer"><span></span></div>`;
    wireFallbacks($("#hofStage"));

    $("#hofList").innerHTML = A.map((a, i) => `
        <button class="hof-row${i ? "" : " on"}" role="tab" aria-selected="${!i}" data-i="${i}">
          <span class="hof-row-year">${esc(a.year)}</span>
          <span class="hof-rank ${tier(a.rank)}">${esc(a.rank || "✦")}</span>
          <span class="hof-row-text"><b>${esc(a.event)}</b><small>${esc(a.title)}</small></span>
        </button>`).join("") +
      `<a class="hof-row hof-more" href="competitions.html#hall-of-fame"><span>Full hall of fame</span>${ICONS.arrow}</a>`;

    let cur = 0, timer = null, stopped = reduceMotion;
    const DWELL = 5000;
    const show = (i) => {
      cur = (i + A.length) % A.length;
      $$("#hofStage .hof-slide").forEach((el, k) => {
        el.classList.toggle("on", k === cur);
        el.toggleAttribute("aria-hidden", k !== cur);
        el.tabIndex = k === cur ? 0 : -1;
      });
      $$("#hofList .hof-row[data-i]").forEach((el, k) => {
        el.classList.toggle("on", k === cur);
        el.setAttribute("aria-selected", k === cur);
      });
      restartTimer();
    };
    const restartTimer = () => {
      clearTimeout(timer);
      const bar = $("#hofStage .hof-timer span");
      bar.style.animation = "none"; void bar.offsetWidth;
      if (stopped) { bar.style.animation = "none"; return; }
      bar.style.animation = `hofTimer ${DWELL}ms linear forwards`;
      timer = setTimeout(() => show(cur + 1), DWELL);
    };
    const list = $("#hofList");
    list.addEventListener("click", (e) => {
      const r = e.target.closest(".hof-row[data-i]");
      if (!r) return;
      stopped = true;
      show(+r.dataset.i);
    });
    if (finePointer) list.addEventListener("mouseover", (e) => {
      const r = e.target.closest(".hof-row[data-i]");
      if (r && +r.dataset.i !== cur) show(+r.dataset.i);
    });
    list.addEventListener("keydown", (e) => {
      if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
      e.preventDefault(); stopped = true;
      show(cur + (e.key === "ArrowDown" ? 1 : -1));
      $$("#hofList .hof-row[data-i]")[cur].focus();
    });
    // pause while the pointer is over the showcase or it's off-screen
    const hof = $("#hof");
    let hovering = false, visible = false;
    const sync = () => {
      if (stopped) return;
      if (hovering || !visible) { clearTimeout(timer); $("#hofStage .hof-timer span").style.animationPlayState = "paused"; }
      else restartTimer();
    };
    hof.addEventListener("mouseenter", () => { hovering = true; sync(); });
    hof.addEventListener("mouseleave", () => { hovering = false; sync(); });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.3 }).observe(hof);
    $$("#hofTally [data-count]").forEach((el) => (el.textContent = "0"));
    const tObs = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      tObs.unobserve(e.target);
      const el = e.target, end = +el.dataset.count;
      let n = 0; const step = () => { el.textContent = ++n; if (n < end) setTimeout(step, 90); };
      reduceMotion || end === 0 ? (el.textContent = end) : step();
    }), { threshold: 0.6 });
    $$("#hofTally [data-count]").forEach((el) => tObs.observe(el));
  }

  /* ---------- team strip (home) ---------- */
  if (has("#crewTrack")) {
    const tones = ["purple", "pink", "yellow", "amber"];
    const chip = (m, i, dup) => `
      <a class="crew-m" href="team.html"${dup ? ' aria-hidden="true" tabindex="-1"' : ""}>
        <span class="avatar t-${tones[i % tones.length]}">${m.image ? `<img src="${esc(m.image)}" alt="" loading="lazy" />` : `<span>${esc(initials(m.name))}</span>`}</span>
        <span class="crew-txt"><b>${esc(m.name)}</b><small>${esc(m.role)}</small></span>
      </a>`;
    // rendered twice so the strip can loop seamlessly
    $("#crewTrack").innerHTML = C.team.map((m, i) => chip(m, i, false)).join("") + C.team.map((m, i) => chip(m, i, true)).join("");
  }

  /* ---------- team ---------- */
  if (has("#teamGrid")) {
    const tones = ["purple", "pink", "yellow", "amber"];
    $("#teamGrid").innerHTML = C.team
      .map((m, i) => `
        <article class="t-card reveal" tabindex="0" data-hover>
          <div class="t-inner">
            <div class="t-front">
              <div class="avatar t-${tones[i % tones.length]}">
                ${m.image ? `<img src="${esc(m.image)}" alt="${esc(m.name)}" loading="lazy" />` : `<span>${esc(initials(m.name))}</span>`}
              </div>
              <h3>${esc(m.name)}</h3>
              <p>${esc(m.role)}</p>
            </div>
            <div class="t-back t-${tones[i % tones.length]}">
              <p class="t-hi">Hi, I'm ${esc(m.name.split(" ").find((w) => w.length > 1) || m.name)}!</p>
              <p class="t-role">${esc(m.role)}</p>
              <div class="t-links">
                ${m.email ? `<a href="mailto:${esc(m.email)}" aria-label="Email ${esc(m.name)}">${ICONS.mail}</a>` : ""}
                ${m.linkedin ? `<a href="${esc(m.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ""}
                ${!m.email && !m.linkedin ? `<a href="index.html#contact">Get in touch</a>` : ""}
              </div>
            </div>
          </div>
        </article>`)
      .join("");
    $$("#teamGrid .t-card").forEach((c) => {
      c.addEventListener("click", (e) => { if (!e.target.closest("a")) c.classList.toggle("flip"); });
      c.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); c.classList.toggle("flip"); } });
    });
  }

  /* ---------- gallery + lightbox ---------- */
  if (has("#galleryGrid")) {
    const grid = $("#galleryGrid");
    const limit = +grid.dataset.limit || C.gallery.length;
    const G = C.gallery.slice(0, limit);
    // preview: one big tile + four small ones; full page: 10-item mosaic pattern
    const tileClass = (i) => (grid.dataset.limit ? (i === 0 ? "g-0" : "") : `g-${i % 10}`);
    grid.innerHTML = G.map((g, i) => `
        <button class="g-item reveal ${tileClass(i)}" data-i="${i}" aria-label="Open photo: ${esc(g.caption)}">
          ${media(g.image, g.icon || "bot", g.caption, "g-media")}
          <span class="g-cap"><b>${esc(g.tag || "")}</b>${esc(g.caption)}</span>
        </button>`).join("");
    wireFallbacks(grid);

    const lb = $("#lightbox");
    if (lb) {
      let li = 0, lastFocus = null;
      const show = (i) => {
        li = (i + G.length) % G.length;
        const g = G[li];
        $("#lbFigure").innerHTML = `${media(g.image, g.icon || "bot", g.caption, "lb-media")}<figcaption><b>${esc(g.tag || "")}</b> ${esc(g.caption)} <span>${li + 1} / ${G.length}</span></figcaption>`;
        wireFallbacks($("#lbFigure"));
      };
      const open = (i) => { lastFocus = document.activeElement; lb.hidden = false; document.body.classList.add("lb-open"); show(i); $("#lbClose").focus(); };
      const close = () => { lb.hidden = true; document.body.classList.remove("lb-open"); lastFocus?.focus(); };
      grid.addEventListener("click", (e) => { const b = e.target.closest(".g-item"); if (b) open(+b.dataset.i); });
      $("#lbClose").addEventListener("click", close);
      $("#lbPrev").addEventListener("click", () => show(li - 1));
      $("#lbNext").addEventListener("click", () => show(li + 1));
      lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
      addEventListener("keydown", (e) => {
        if (lb.hidden) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowLeft") show(li - 1);
        if (e.key === "ArrowRight") show(li + 1);
      });
    }
  }

  /* ---------- resources ---------- */
  if (has("#resGrid")) {
    let rTab = 0, rQuery = "";
    $("#resTabs").innerHTML = C.resources
      .map((r, i) => `<button class="tab${i ? "" : " on"}" role="tab" aria-selected="${!i}" data-i="${i}">${esc(r.tab)}<sup>${r.items.length}</sup></button>`)
      .join("");
    const kindIcon = (k) => (k === "PDF" ? ICONS.download : ICONS.arrow);
    const render = () => {
      const q = rQuery.trim().toLowerCase();
      const pool = q
        ? C.resources.flatMap((r) => r.items.map((it) => ({ ...it, _tab: r.tab, _inv: r.inventory })))
        : C.resources[rTab].items.map((it) => ({ ...it, _inv: C.resources[rTab].inventory }));
      const list = pool.filter((it) => !q || `${it.title} ${it.desc} ${it._tab || ""}`.toLowerCase().includes(q));
      $("#resGrid").innerHTML = list.length
        ? list
            .map((it) =>
              it._inv
                ? `<div class="res-card inv">
                    <div class="res-top"><span class="badge ${it.qty === "Available" ? "live" : it.qty === "Limited" ? "gold" : ""}">${esc(it.qty)}</span></div>
                    <h4>${esc(it.title)}</h4><p>${esc(it.desc)}</p>
                    <a class="text-link" href="mailto:${esc(C.contact.email)}?subject=${encodeURIComponent("Inventory request: " + it.title)}">Request ${ICONS.arrow}</a>
                  </div>`
                : `<a class="res-card" href="${esc(it.url)}" ${/^https?:/.test(it.url) ? 'target="_blank" rel="noopener"' : ""}>
                    <div class="res-top"><span class="badge">${esc(it.kind || "Link")}</span>${it._tab ? `<span class="res-tab">${esc(it._tab)}</span>` : ""}<i class="res-ico">${kindIcon(it.kind)}</i></div>
                    <h4>${esc(it.title)}</h4><p>${esc(it.desc)}</p>
                  </a>`
            )
            .join("")
        : `<p class="muted empty">Nothing matches “${esc(rQuery)}”. Try another keyword.</p>`;
    };
    $("#resTabs").addEventListener("click", (e) => {
      const b = e.target.closest(".tab");
      if (!b) return;
      rTab = +b.dataset.i;
      rQuery = ""; $("#resSearch").value = "";
      $("#resTabs").classList.remove("dim");
      selectChip($("#resTabs"), b);
      render();
    });
    $("#resSearch").addEventListener("input", (e) => {
      rQuery = e.target.value;
      $("#resTabs").classList.toggle("dim", !!rQuery.trim());
      render();
    });
    render();
  }

  /* ---------- contact (home) ---------- */
  if (has("#contactForm")) {
    const ct = C.contact;
    $("#contactList").innerHTML = `
      <li><i>${ICONS.mail}</i><a href="mailto:${esc(ct.email)}">${esc(ct.email)}</a></li>
      <li><i>${ICONS.pin}</i><span>${esc(ct.address)}</span></li>`;
    $("#socials").innerHTML = ct.socials
      .map(([n, u]) => `<a class="btn btn-outline btn-sm" href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} <i>${ICONS.arrow}</i></a>`)
      .join("");
    $("#contactForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target, note = $("#formNote");
      if (!f.checkValidity()) {
        f.classList.add("tried");
        note.textContent = "Please fill in your name, a valid email and a message.";
        note.classList.add("err");
        f.querySelector(":invalid")?.focus();
        return;
      }
      const d = Object.fromEntries(new FormData(f));
      const body = `${d.message}\n\n— ${d.name} (${d.email})`;
      location.href = `mailto:${ct.email}?subject=${encodeURIComponent(`[Website] ${d.topic} — ${d.name}`)}&body=${encodeURIComponent(body)}`;
      note.classList.remove("err");
      note.textContent = "Your email app should open with the message ready. Thanks for reaching out!";
    });
  }

  /* ---------- home nav: highlight About while it's on screen ---------- */
  if (has("#about") && has(".hero")) {
    const links = $$("#navLinks a");
    const homeLink = links.find((a) => a.getAttribute("href") === "index.html");
    const aboutLink = links.find((a) => a.getAttribute("href") === "index.html#about");
    new IntersectionObserver(([e]) => {
      aboutLink?.classList.toggle("active", e.isIntersecting);
      homeLink?.classList.toggle("active", !e.isIntersecting);
    }, { rootMargin: "-45% 0px -50% 0px" }).observe($("#about"));
  }

  observeReveals();

  /* =========================================================
     HERO ASSEMBLY LINE (home only)
     Bots ride the belt left→right; the gripper arm gives them
     eyes, the dispenser arm frosts them. Click one to make it hop.
     ========================================================= */
  if (!has("#factory")) return;
  const svg = $("#factory svg");
  const itemsG = $("#items"), ringsG = $("#rings"), sparksG = $("#sparks");
  const SPEED = 60, GAP = 215, N = 8, ARM1 = 790, ARM2 = 1120, RING = 110;

  ringsG.innerHTML = Array.from({ length: 16 }, (_, i) =>
    `<circle cx="${i * RING - 55}" cy="378" r="26" fill="var(--cream)"/><circle cx="${i * RING - 55}" cy="378" r="12" fill="none" stroke="var(--pink)" stroke-width="7"/>`
  ).join("");
  ringsG.style.animationDuration = `${RING / SPEED}s`;

  const sprinkleColors = ["var(--yellow)", "var(--purple)", "#FF8A4C", "#fff", "var(--purple)"];
  const sprinkles = [[-60, -66, 30], [-30, -80, -35], [0, -62, 60], [30, -78, 20], [58, -64, -40], [-10, -84, 80], [70, -54, 10]]
    .map(([x, y, r], i) => `<rect x="${x - 8}" y="${y - 3}" width="16" height="6" rx="3" fill="${sprinkleColors[i % sprinkleColors.length]}" transform="rotate(${r} ${x} ${y})"/>`)
    .join("");

  const bots = Array.from({ length: N }, (_, i) => {
    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("class", "bot");
    g.innerHTML = `
      <g class="bot-in">
        <ellipse cx="0" cy="-45" rx="96" ry="45" fill="var(--amber)"/>
        <ellipse cx="0" cy="-20" rx="92" ry="18" fill="#000" opacity=".08"/>
        <g class="b-frost">
          <path d="M-91 -50 C-91 -82 -50 -92 0 -92 C50 -92 91 -82 91 -50 C82 -40 70 -52 55 -43 C40 -34 28 -47 12 -39 C-6 -30 -20 -45 -38 -38 C-56 -31 -72 -44 -91 -50Z" fill="var(--pink)"/>
          ${sprinkles}
        </g>
        <g class="b-eyes">
          <line x1="0" y1="-90" x2="0" y2="-112" stroke="var(--purple)" stroke-width="5" stroke-linecap="round"/>
          <circle cx="0" cy="-116" r="7" fill="var(--yellow)"/>
          <circle cx="-30" cy="-68" r="8" fill="#111"/><circle cx="30" cy="-68" r="8" fill="#111"/>
          <circle cx="-27" cy="-71" r="2.6" fill="#fff"/><circle cx="33" cy="-71" r="2.6" fill="#fff"/>
        </g>
        <path d="M-32 -56 Q0 -42 32 -56" stroke="#111" stroke-width="6" fill="none" stroke-linecap="round"/>
      </g>`;
    itemsG.appendChild(g);
    const bot = { g, x: -110 + i * GAP, s: 0 };
    g.addEventListener("click", () => hop(bot));
    return bot;
  });

  const arm1Tool = $(".arm1-tool"), arm2Tool = $(".arm2-tool");
  const pulse = (el, cls) => { el.classList.remove(cls); void el.getBBox(); el.classList.add(cls); };

  function star(x, y, s, color = "#fff") {
    const p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", "M0 -22 C3 -4 4 -3 22 0 C4 3 3 4 0 22 C-3 4 -4 3 -22 0 C-4 -3 -3 -4 0 -22Z");
    p.setAttribute("fill", color);
    p.setAttribute("class", "burst");
    p.style.setProperty("--tx", `${x}px`); p.style.setProperty("--ty", `${y}px`); p.style.setProperty("--s", s);
    sparksG.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
  let hops = 0;
  function hop(bot) {
    bot.g.classList.remove("hop"); void bot.g.getBBox(); bot.g.classList.add("hop");
    const cols = ["#fff", "var(--yellow)", "var(--pink)", "var(--purple)"];
    for (let k = 0; k < 5; k++) star(bot.x + (Math.random() - 0.5) * 180, 330 - 60 - Math.random() * 110, 0.4 + Math.random() * 0.6, cols[k % 4]);
    hops++;
    const hint = $(".factory-hint");
    if (hint) hint.textContent = hops === 1 ? "wheee! ✦" : hops < 5 ? `${hops} happy bots` : hops < 10 ? `${hops} happy bots — keep going!` : `${hops} bots! you should join the club 🤖`;
  }

  function place(b) {
    b.g.setAttribute("transform", `translate(${b.x.toFixed(1)} 330)`);
    const s = b.x > ARM2 ? 2 : b.x > ARM1 ? 1 : 0;
    if (s !== b.s) {
      if (s > b.s) {
        if (s === 1) { pulse(arm1Tool, "stamp"); star(b.x + 40, 245, 0.7); }
        if (s === 2) { pulse(arm2Tool, "squirt"); star(b.x + 50, 260, 0.9); }
      }
      b.s = s;
      b.g.classList.toggle("s1", s >= 1);
      b.g.classList.toggle("s2", s >= 2);
    }
  }

  let last = 0, running = false;
  function frame(t) {
    if (!running) return;
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    bots.forEach((b) => {
      b.x += SPEED * dt;
      if (b.x > 1440 + 120) { b.x -= N * GAP; b.s = 0; b.g.classList.remove("s1", "s2"); }
      place(b);
    });
    requestAnimationFrame(frame);
  }
  bots.forEach(place);
  if (!reduceMotion) {
    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      svg.classList.toggle("paused", !running);
      if (running) { last = 0; requestAnimationFrame(frame); }
    }).observe(svg);

    // parallax on decorative shapes
    const decor = $("#decor");
    $("#factory").addEventListener("mousemove", (e) => {
      const r = svg.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      decor.style.transform = `translate(${dx * -24}px, ${dy * -16}px)`;
    });
  } else svg.classList.add("paused");
})();
