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

  /* ---------- recent & upcoming timeline ---------- */
  const igLink = (C.contact.socials.find(([n]) => /instagram/i.test(n)) || [])[1] || "#";
  const tbaItem = { kind: "tba", status: "upcoming", title: "Next event to be announced", desc: "Follow our Instagram for dates, registrations and posters as soon as they are out." };
  const tlAll = timelineItems();
  const tlCard = (it, big = false) => {
    const when = it.kind === "tba" ? "Coming soon" : fmtRange(it.start, it.end);
    const head = `<div class="tl-head"><span class="tl-status s-${it.status}">${STATUS_LABEL[it.status]}</span>${it.type ? `<span class="tl-type">${esc(it.type)}</span>` : ""}</div>`;
    const body = `
      ${head}
      <h4>${esc(it.title)}</h4>
      ${it.subtitle ? `<p class="tl-sub">${esc(it.subtitle)}</p>` : ""}
      ${it.time || it.venue ? `<p class="tl-meta">${[it.time, it.venue].filter(Boolean).map(esc).join(" · ")}</p>` : ""}
      ${big && it.host ? `<p class="tl-host">${esc(it.host)}</p>` : ""}
      <p class="tl-desc">${esc(it.desc || "")}</p>
      ${big && it.highlights?.length ? `<div class="tl-chips">${it.highlights.map((h) => `<span>${esc(h)}</span>`).join("")}</div>` : ""}`;
    if (it.kind === "tba") return { when, html: `<a class="tl-card tl-tba" href="${esc(igLink)}" target="_blank" rel="noopener"><div class="tl-body">${body}<span class="tl-more">Follow on Instagram ${ICONS.arrow}</span></div></a>` };
    if (it.image) return { when, html: `<button class="tl-card has-poster" type="button" data-poster="${esc(it.image)}" data-title="${esc(it.title + (it.subtitle ? " — " + it.subtitle : ""))}">${media(it.image, "trophy", it.title, "tl-poster")}<div class="tl-body">${body}<span class="tl-more">View poster ${ICONS.arrow}</span></div></button>` };
    const links = big && it.links?.length ? `<div class="ann-links">${it.links.map(([l, u]) => `<a class="btn btn-sm btn-outline" href="${esc(u)}">${esc(l)}</a>`).join("")}</div>` : "";
    return { when, html: big ? `<div class="tl-card"><div class="tl-body">${body}${links}</div></div>` : `<a class="tl-card" href="${esc(it.href || "updates.html")}"><div class="tl-body">${body}<span class="tl-more">Details ${ICONS.arrow}</span></div></a>` };
  };

  // home: horizontal timeline, oldest → newest, ending with what's next
  if (has("#tline")) {
    const upcoming = tlAll.filter((i) => i.status !== "recent");
    // four columns fit the page width: latest recent items + what's next
    const next = upcoming.length ? upcoming.slice(0, 2) : [tbaItem];
    const recent = tlAll.filter((i) => i.status === "recent").slice(-(4 - next.length));
    const list = [...recent, ...next];
    $("#tline").innerHTML = list.map((it) => {
      const c = tlCard(it);
      return `<div class="tl2-item s-${it.status} reveal"><span class="tl2-when">${esc(c.when)}</span><span class="tl2-node" aria-hidden="true"></span>${c.html}</div>`;
    }).join("");
    $("#tline").style.setProperty("--n", list.length);
    wireFallbacks($("#tline"));
    const row = $("#tline");
    requestAnimationFrame(() => { row.scrollLeft = row.scrollWidth; }); // start at "what's next"
  }

  // updates page: vertical timeline, upcoming first then most recent
  if (has("#tlineFull")) {
    const upcoming = tlAll.filter((i) => i.status !== "recent");
    const recent = tlAll.filter((i) => i.status === "recent").reverse();
    const list = [...(upcoming.length ? upcoming : [tbaItem]), ...recent];
    $("#tlineFull").innerHTML = list.map((it) => {
      const c = tlCard(it, true);
      return `<li class="tl3-item s-${it.status} reveal"><span class="tl3-when">${esc(c.when)}</span>${c.html}</li>`;
    }).join("");
    wireFallbacks($("#tlineFull"));
  }

  /* ---------- flagship events carousel (home) ----------
     Continuous right→left drift; pauses on hover/focus; toggle button stops it. */
  if (has("#flowTrack")) {
    const eventCard = (ev) => `
      <a class="flow-card flow-ev" href="updates.html#events">
        ${media(ev.image, ev.icon || "bulb", ev.title, "flow-media")}
        <div class="flow-ev-body">
          <span class="badge">Flagship event</span>
          <h3>${esc(ev.title)}</h3>
          <p>${esc(ev.desc)}</p>
        </div>
      </a>`;
    const set = C.events.map(eventCard).join("");
    // repeat so one copy is always wider than the screen, then double for a seamless loop
    const reps = Math.max(1, Math.ceil(8 / C.events.length));
    const half = set.repeat(reps);
    $("#flowTrack").innerHTML = half + half.replace(/<a class="flow-card/g, '<a tabindex="-1" aria-hidden="true" class="flow-card');
    $("#flowTrack").style.setProperty("--flow-duration", `${C.events.length * reps * 7}s`);
    wireFallbacks($("#flowTrack"));

    const flow = $("#flow"), toggle = $("#flowToggle");
    const setPaused = (p) => {
      flow.classList.toggle("stopped", p);
      toggle.setAttribute("aria-pressed", p);
      toggle.setAttribute("aria-label", p ? "Play the moving cards" : "Pause the moving cards");
    };
    toggle.addEventListener("click", () => setPaused(!flow.classList.contains("stopped")));
    if (reduceMotion) setPaused(true);
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
        <a class="x-tile reveal x-${tone}${i === 0 ? " x-big" : ""}" href="${href}">
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
          <a class="p-card reveal c-${p.color || "purple"}${i === 0 && pFilter === "All" ? " feature" : ""}" href="project.html?id=${encodeURIComponent(p.id)}">
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
            <div class="ann-top"><span class="badge live">${pinned.pinned ? "Pinned" : esc(pinned.type)}</span>${isNew(pinned.date) ? '<span class="badge new">New</span>' : ""}<time>${fmt(pinned.date)}</time></div>
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
          ${media(ev.image, ev.icon || "bulb", ev.title, "ev-media")}
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
          <div class="ach-card">
            ${media(a.image, "trophy", a.event, "ach-media")}
            <div class="ach-body">
              <span class="badge ${tier(a.rank) ? "gold" : ""}">${esc(a.title)}</span>
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

    $("#hofStage").innerHTML =
      A.map((a, i) => `
        <a class="hof-slide${i ? "" : " on"}" href="${achvLink(a)}" data-i="${i}" ${i ? 'aria-hidden="true" tabindex="-1"' : ""}>
          ${media(a.image, "trophy", a.event, "hof-media")}
          <div class="hof-copy">
            <div class="hof-top">
              <span class="hof-year">${esc(a.year)}</span>
              <span class="hof-medal ${tier(a.rank)}">${esc(a.rank || "")}</span>
            </div>
            <span class="badge ${tier(a.rank) ? "gold" : "live"}">${esc(a.event)}</span>
            <h3>${esc(a.title)}</h3>
            <p>${esc(a.desc)}</p>
            <span class="text-link">${a.project ? "View project" : "View details"} ${ICONS.arrow}</span>
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
  }

  /* ---------- leadership grid (home) ---------- */
  if (has("#leaders")) {
    $("#leaders").innerHTML = C.team
      .map((m, i) => `
        <button class="leader reveal" type="button" data-member="${i}" aria-label="${esc(m.name)}, ${esc(m.role)}: view LinkedIn">
          <span class="face">${portrait(m, i)}<span class="gti">${ICONS.linkedin}<span>Connect</span></span></span>
          <b>${esc(m.name)}</b>
          <span class="leader-role">${esc(m.role)}</span>
        </button>`)
      .join("");
    wireFallbacks($("#leaders"));
  }

  /* ---------- team page ---------- */
  if (has("#teamGrid")) {
    $("#teamGrid").innerHTML = C.team
      .map((m, i) => `
        <article class="member reveal">
          <button class="face" type="button" data-member="${i}" aria-label="${esc(m.name)}: view LinkedIn">${portrait(m, i)}<span class="gti">${ICONS.linkedin}<span>Connect</span></span></button>
          <div class="member-body">
            <h3>${esc(m.name)}</h3>
            <p>${esc(m.role)}</p>
            <button class="member-contact" type="button" data-member="${i}">Connect on LinkedIn ${ICONS.arrow}</button>
          </div>
        </article>`)
      .join("");
    wireFallbacks($("#teamGrid"));
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
      .map(([n, u]) => `<a class="btn btn-outline btn-sm social s-${socialKey(n)}" href="${esc(u)}" target="_blank" rel="noopener"><i>${socialIcon(n)}</i>${esc(n)}</a>`)
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
     HERO: MARS TRAVERSE (home only)
     The club's rover drives across endless dunes. When an alien
     shows up it brakes, swings the turret onto it, fires, and
     drives on. Click / tap the scene to fire manually.
     ========================================================= */
  if (!has("#mars")) return;
  const svg = $("#marsSvg");
  const W = 1440, H = 440, WHEEL_R = 17, WHEELBASE = 124;
  // The SVG is cropped to fit the screen ("slice"), so on narrow screens only the
  // middle of the 1440-wide scene is visible. Place the rover and the engagement
  // range relative to the visible part.
  let RX = 520, VIEW_L = 0, VIEW_W = W, VIEW_T = 0;
  const layout = () => {
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const scale = Math.max(r.width / W, r.height / H);
    VIEW_W = Math.min(W, r.width / scale);
    VIEW_L = (W - VIEW_W) / 2;
    VIEW_T = H - Math.min(H, r.height / scale); // rows cropped off the top on wide screens
    RX = VIEW_L + Math.max(120, VIEW_W * 0.3);
    // keep the sky (stars, planet, moon) anchored to the visible top edge
    const sky = `translate(0 ${VIEW_T.toFixed(1)})`;
    $("#marsStars").setAttribute("transform", sky);
    $("#mars .planet").setAttribute("transform", sky);
  };
  layout();
  addEventListener("resize", layout, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(layout).observe(svg);
  const node = (tag, attrs, parent) => {
    const n = document.createElementNS(SVGNS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  };

  // terrain height functions (world x -> svg y)
  const ground = (x) => 352 + 16 * Math.sin(x * 0.0042) + 9 * Math.sin(x * 0.011 + 1.3) + 4 * Math.sin(x * 0.027 + 2.1);
  const mid = (x) => 292 + 26 * Math.sin(x * 0.0031 + 0.5) + 12 * Math.sin(x * 0.0087 + 2);
  const far = (x) => 236 + 44 * Math.sin(x * 0.0018) + 18 * Math.sin(x * 0.0051 + 1);
  const pts = (fn, off, dy = 0) => {
    let p = "";
    for (let x = -20; x <= W + 20; x += 16) p += `${x} ${(fn(x + off) + dy).toFixed(1)} `;
    return p;
  };
  const fill = (p) => `M-20 ${H} L${p}L${W + 20} ${H} Z`;
  const L = { far: $("#layerFar"), mid: $("#layerMid"), ground: $("#layerGround"), b1: $("#layerBand1"), b2: $("#layerBand2"), edge: $("#groundEdge") };

  // stars
  for (let i = 0; i < 70; i++) {
    node("circle", { cx: (Math.random() * W).toFixed(0), cy: (Math.random() * 210).toFixed(0), r: (Math.random() * 1.3 + 0.4).toFixed(2), class: "star", style: `animation-delay:${(Math.random() * 4).toFixed(2)}s` }, $("#marsStars"));
  }

  // rocks and craters on the ground layer (recycled as they scroll off)
  const rocksG = $("#marsRocks");
  const rockShape = () => {
    const w = 8 + Math.random() * 22, h = 5 + Math.random() * 12;
    return Math.random() < 0.25
      ? `M${-w * 1.3} 3 Q0 ${h * 0.7} ${w * 1.3} 3 Q0 ${-h * 0.25} ${-w * 1.3} 3 Z`
      : `M${-w} 5 Q${-w * 0.8} ${-h} 0 ${-h} Q${w * 0.9} ${-h * 0.8} ${w} 5 Z`;
  };
  const rocks = Array.from({ length: 10 }, (_, i) => ({ n: node("path", { d: rockShape(), class: "rock" }, rocksG), wx: i * 170 + Math.random() * 120 }));

  // wheels
  const wheelsG = $("#roverWheels");
  const wheels = [-WHEELBASE / 2, 0, WHEELBASE / 2].map((off) => {
    const g = node("g", {}, wheelsG);
    g.innerHTML = `<circle r="${WHEEL_R}" fill="#1d1a33" stroke="#9d86ff" stroke-width="4"/><path d="M-11 0H11M-5.5 -9.5L5.5 9.5M-5.5 9.5L5.5 -9.5" stroke="#9d86ff" stroke-width="2.5"/><circle r="4.5" fill="#f7e34f"/>`;
    return { g, off, x: 0, y: 0 };
  });

  const rover = $("#rover"), barrel = $("#barrel"), fx = $("#marsFx"), aliensG = $("#marsAliens");
  const legRocker = $("#legRocker"), legFront = $("#legFront");

  const WALKER = `<g class="a-body">
      <path class="a-legs" d="M-8 -8 L-13 0 M8 -8 L13 0" stroke="#2f9e6c" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="0" cy="-28" rx="20" ry="22" fill="#6fe3a1"/>
      <path d="M-6 -48 L-12 -64 M6 -48 L12 -64" stroke="#6fe3a1" stroke-width="3"/>
      <circle cx="-12" cy="-66" r="4" fill="#f0a3d8"/><circle cx="12" cy="-66" r="4" fill="#f0a3d8"/>
      <circle cx="0" cy="-32" r="9" fill="#fff"/><circle cx="-3" cy="-32" r="4.2" fill="#111"/>
      <path d="M-8 -16 Q0 -11 8 -16" stroke="#1f6b4a" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
  const UFO = `<g class="a-body">
      <ellipse cx="0" cy="-8" rx="15" ry="14" fill="#6fe3a1"/>
      <circle cx="-5" cy="-10" r="3.5" fill="#111"/><circle cx="5" cy="-10" r="3.5" fill="#111"/>
      <path d="M-22 -2 A22 20 0 0 1 22 -2 Z" fill="#9d86ff" fill-opacity=".3" stroke="#9d86ff" stroke-width="2"/>
      <ellipse cx="0" cy="3" rx="48" ry="12" fill="#c6c6d0"/>
      <ellipse cx="0" cy="6" rx="32" ry="6" fill="#4b33c7"/>
      <circle class="a-light" cx="-32" cy="4" r="3.5" fill="#f7e34f"/><circle class="a-light" cx="0" cy="10" r="3.5" fill="#f7e34f"/><circle class="a-light" cx="32" cy="4" r="3.5" fill="#f7e34f"/></g>`;

  let aliens = [], particles = [];
  const spawnAlien = () => {
    const ufo = Math.random() < 0.35;
    const g = node("g", { class: "alien" + (ufo ? " ufo" : "") }, aliensG);
    g.innerHTML = ufo ? UFO : WALKER;
    aliens.push({ g, ufo, x: VIEW_L + VIEW_W + 90, y: 0, base: VIEW_T + 105 + Math.random() * 60, t: Math.random() * 6, alive: true });
  };
  const alienCenter = (a) => ({ x: a.x, y: a.ufo ? a.y - 4 : a.y - 30 });

  const addParticle = (p) => {
    if (particles.length > 90) { particles[0].n.remove(); particles.shift(); }
    particles.push(p);
  };
  const boom = (a) => {
    a.alive = false;
    a.g.classList.add("hit");
    setTimeout(() => a.g.remove(), 120);
    const c = alienCenter(a);
    const ring = node("circle", { cx: c.x, cy: c.y, r: 26, class: "shock" }, fx);
    setTimeout(() => ring.remove(), 520);
    const cols = ["#6fe3a1", "#6fe3a1", "#f0a3d8", "#f7e34f", "#ffffff"];
    for (let i = 0; i < 16; i++) {
      const s = 3 + Math.random() * 5;
      addParticle({
        n: node("rect", { width: s, height: s, fill: cols[i % cols.length] }, fx),
        x: c.x, y: c.y, vx: (Math.random() - 0.5) * 340, vy: -60 - Math.random() * 260, g: 620, life: 0.9, max: 0.9,
      });
    }
  };

  // rover state
  let scroll = 0, v = 0, state = "drive", timer = 0, spawnIn = 2.5, dustIn = 0, lastShot = 0, holdAim = 0;
  let aim = -0.12, aimTarget = -0.12, target = null;
  let body = { y: 0, a: 0 };
  const V_MAX = 95;

  const toWorld = (lx, ly) => ({
    x: RX + lx * Math.cos(body.a) - ly * Math.sin(body.a),
    y: body.y + lx * Math.sin(body.a) + ly * Math.cos(body.a),
  });
  const pivot = () => toWorld(52, -39); // barrel axis on the turret
  const aimAt = (p) => {
    const o = pivot();
    return Math.max(-1.45, Math.min(0.35, Math.atan2(p.y - o.y, p.x - o.x) - body.a));
  };
  const fire = (p) => {
    const o = pivot(), ang = body.a + aim;
    const m = { x: o.x + Math.cos(ang) * 50, y: o.y + Math.sin(ang) * 50 };
    const beam = node("g", { class: "laser" }, fx);
    node("line", { x1: m.x, y1: m.y, x2: p.x, y2: p.y, stroke: "#f0a3d8", "stroke-width": 7, "stroke-linecap": "round" }, beam);
    node("line", { x1: m.x, y1: m.y, x2: p.x, y2: p.y, stroke: "#ffffff", "stroke-width": 2.5, "stroke-linecap": "round" }, beam);
    node("circle", { cx: m.x, cy: m.y, r: 9, fill: "#f7e34f" }, beam);
    setTimeout(() => beam.remove(), 300);
    const hit = aliens.find((a) => { if (!a.alive) return false; const c = alienCenter(a); return Math.hypot(c.x - p.x, c.y - p.y) < 42; });
    if (hit) boom(hit);
    lastShot = performance.now();
  };

  function step(dt) {
    // --- behaviour ---
    if (state === "drive") {
      v = Math.min(V_MAX, v + 110 * dt);
      holdAim -= dt;
      if (holdAim <= 0) aimTarget = -0.12; // keep pointing at a manual shot for a moment
      spawnIn -= dt;
      if (spawnIn <= 0 && !aliens.some((a) => a.alive)) { spawnAlien(); spawnIn = 4 + Math.random() * 3.5; }
      const range = Math.min(VIEW_W * 0.55, 420);
      target = aliens.find((a) => a.alive && a.x < RX + (a.ufo ? range + 50 : range) && a.x > RX + 60);
      if (target) state = "aim";
    } else if (state === "aim") {
      v = Math.max(0, v - 230 * dt);
      if (!target.alive) { state = "cool"; timer = 0.4; }
      else {
        aimTarget = aimAt(alienCenter(target));
        if (v < 4 && Math.abs(aim - aimTarget) < 0.04) { fire(alienCenter(target)); state = "cool"; timer = 0.9; }
      }
    } else if (state === "cool") {
      v = Math.max(0, v - 230 * dt);
      timer -= dt;
      if (timer <= 0) { state = "drive"; target = null; }
    }
    aim += (aimTarget - aim) * Math.min(1, dt * 7);
    scroll += v * dt;

    // --- terrain ---
    const gp = pts(ground, scroll);
    L.far.setAttribute("d", fill(pts(far, scroll * 0.15)));
    L.mid.setAttribute("d", fill(pts(mid, scroll * 0.4)));
    L.ground.setAttribute("d", fill(gp));
    L.b1.setAttribute("d", fill(pts(ground, scroll, 34)));
    L.b2.setAttribute("d", fill(pts(ground, scroll, 66)));
    L.edge.setAttribute("d", "M" + gp);
    rocks.forEach((r) => {
      let sx = r.wx - scroll;
      if (sx < -60) { r.wx += 1700 + Math.random() * 150; r.n.setAttribute("d", rockShape()); sx = r.wx - scroll; }
      r.n.setAttribute("transform", `translate(${sx.toFixed(1)} ${(ground(r.wx) + 3).toFixed(1)})`);
    });

    // --- rover: wheels follow the ground, body tilts between front and back ---
    const spin = ((scroll / WHEEL_R) * 180) / Math.PI;
    wheels.forEach((w) => {
      w.x = RX + w.off;
      w.y = ground(w.x + scroll) - WHEEL_R;
      w.g.setAttribute("transform", `translate(${w.x} ${w.y.toFixed(1)}) rotate(${spin.toFixed(1)})`);
    });
    const [back, midW, front] = wheels;
    body.a = Math.atan2(front.y - back.y, front.x - back.x);
    body.y = (back.y + front.y) / 2 - 42;
    rover.setAttribute("transform", `translate(${RX} ${body.y.toFixed(1)}) rotate(${((body.a * 180) / Math.PI).toFixed(2)})`);
    const local = (w) => {
      const dx = w.x - RX, dy = w.y - body.y;
      return { x: dx * Math.cos(body.a) + dy * Math.sin(body.a), y: -dx * Math.sin(body.a) + dy * Math.cos(body.a) };
    };
    const lb = local(back), lm = local(midW), lf = local(front);
    const j = { x: (lb.x + lm.x) / 2, y: Math.min(lb.y, lm.y) - 16 };
    legRocker.setAttribute("d", `M${lb.x.toFixed(1)} ${lb.y.toFixed(1)} L${j.x.toFixed(1)} ${j.y.toFixed(1)} L${lm.x.toFixed(1)} ${lm.y.toFixed(1)} M${j.x.toFixed(1)} ${j.y.toFixed(1)} L-26 4`);
    legFront.setAttribute("d", `M${lf.x.toFixed(1)} ${lf.y.toFixed(1)} L${(lf.x - 14).toFixed(1)} ${(lf.y - 22).toFixed(1)} L34 4`);
    barrel.setAttribute("transform", `rotate(${((aim * 180) / Math.PI).toFixed(1)} 0 -7)`);

    // --- aliens ---
    aliens.forEach((a) => {
      if (!a.alive) return;
      a.t += dt;
      if (a.ufo) { a.x -= (v * 0.3 + 60) * dt; a.y = a.base + Math.sin(a.t * 2.2) * 9; }
      else { a.x -= (v + 24) * dt; a.y = ground(a.x + scroll) + 2; }
      a.g.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)})`);
      if (a.x < VIEW_L - 120) { a.alive = false; a.g.remove(); }
    });
    aliens = aliens.filter((a) => a.alive || a.g.isConnected);

    // --- dust + particles ---
    dustIn -= dt;
    if (v > 25 && dustIn <= 0) {
      dustIn = 0.06;
      addParticle({ n: node("circle", { r: 3, fill: "#f2be43", opacity: 0.7 }, fx), x: back.x - 12, y: back.y + WHEEL_R - 2, vx: -v * 0.35 - Math.random() * 30, vy: -18 - Math.random() * 26, g: 0, life: 0.8, max: 0.8, grow: 9 });
    }
    particles = particles.filter((p) => {
      p.life -= dt;
      if (p.life <= 0) { p.n.remove(); return false; }
      p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      const k = p.life / p.max;
      if (p.grow) { p.n.setAttribute("cx", p.x.toFixed(1)); p.n.setAttribute("cy", p.y.toFixed(1)); p.n.setAttribute("r", (3 + p.grow * (1 - k)).toFixed(1)); p.n.setAttribute("opacity", (0.6 * k).toFixed(2)); }
      else { p.n.setAttribute("x", p.x.toFixed(1)); p.n.setAttribute("y", p.y.toFixed(1)); p.n.setAttribute("opacity", k.toFixed(2)); }
      return true;
    });
  }

  // click / tap to fire at that point
  svg.addEventListener("click", (e) => {
    if (performance.now() - lastShot < 280) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    aim = aimTarget = aimAt(p);
    holdAim = 0.6;
    step(0);
    fire(p);
  });

  step(0);
  if (reduceMotion) {
    // still scene: an alien standing ahead of the rover
    spawnAlien(); aliens[0].ufo = false; aliens[0].g.innerHTML = WALKER; aliens[0].x = RX + VIEW_W * 0.4;
    step(0);
  } else {
    let last = 0, running = false;
    const frame = (t) => {
      if (!running) return;
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
      last = t;
      step(dt);
      requestAnimationFrame(frame);
    };
    new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) { last = 0; requestAnimationFrame(frame); }
    }).observe(svg);
  }
})();
