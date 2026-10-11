/* =====================================================================
   Site editor instructions (the yellow "? Help" button).
   ---------------------------------------------------------------------
   To change the instructions, edit the text in HELP below. Each topic
   is plain HTML: <h3> headings, <ol>/<ul> lists, <p> text, <b> bold.
   The panel opens on the topic for the section the editor is showing.
   ===================================================================== */
const HELP = {
  start: {
    title: "How the editor works",
    html: `
      <h3>Finding things</h3>
      <ol>
        <li>The <b>left sidebar</b> lists the parts of the website: Events, Achievements, Projects, Team, Gallery, Resources, Site settings.</li>
        <li>Click one, then click the item on the right (e.g. <b>Dated events</b>) to open its form.</li>
        <li>The <b>search bar</b> at the top finds any text on the site.</li>
      </ol>
      <h3>Making a change</h3>
      <ol>
        <li>Inside a form, lists (events, team members…) show one row per item. Click a row to open it.</li>
        <li><b>Add</b> a new item with the <b>+ Add</b> button under the list.</li>
        <li><b>Remove</b> an item with its <b>⋯</b> menu → <b>Delete</b>. <b>Reorder</b> by dragging the handle on the left of a row.</li>
        <li>Press <b>Save</b> (top right) when you're done.</li>
      </ol>
      <h3>After Save</h3>
      <p>Your change is stored on GitHub under your name. An automatic check runs, and the live website updates within about a minute once publishing is on. If something is wrong, the site keeps the previous version and nothing breaks.</p>
      <div class="rc-help-tip"><b>Made a mistake?</b> Every saved version is kept on GitHub. Ask the website admin to restore it.</div>`,
  },
  timeline: {
    title: "Add or edit an event",
    html: `
      <h3>Add an event</h3>
      <ol>
        <li>Open <b>Events → Dated events</b>.</li>
        <li>Click <b>+ Add Event</b> at the bottom of the list.</li>
        <li>Fill in <b>Title</b> and <b>Start date</b>. Add an <b>End date</b> only if it runs over several days.</li>
        <li>Add <b>Time</b> (e.g. <code>7:30 PM</code>), <b>Venue</b> (e.g. <code>Core 5</code>) and a short <b>Description</b>.</li>
        <li>Drag the poster image onto <b>Poster</b>.</li>
        <li>Optional: <b>Highlights</b> (e.g. <code>Prize pool worth 20K</code>) and <b>Links</b> (e.g. a registration form).</li>
        <li>Press <b>Save</b>.</li>
      </ol>
      <h3>Where it shows up</h3>
      <ul>
        <li>The home page strip shows the <b>3 newest</b> events plus "Coming soon".</li>
        <li>The <b>calendar</b> shows every event on its date(s), including older ones.</li>
        <li>Clicking an event on the site opens a pop-up with all the details.</li>
      </ul>
      <div class="rc-help-tip"><b>Posters:</b> JPG or WebP, under ~300 KB. Shrink large images at squoosh.app first.</div>`,
  },
  announcements: {
    title: "Post an announcement",
    html: `
      <ol>
        <li>Open <b>Events → Announcements</b> → <b>+ Add Announcement</b>.</li>
        <li>Fill in <b>Title</b>, <b>Date</b>, <b>Type</b> (e.g. <code>Recruitment</code>) and the <b>Text</b>.</li>
        <li>For buttons (a form, a PDF), add rows under <b>Links / downloads</b>: button text + link.</li>
        <li>Tick <b>Also show on the home strip</b> if it should appear next to the events.</li>
        <li>Press <b>Save</b>.</li>
      </ol>
      <h3>Adding a PDF or file download</h3>
      <ol>
        <li>Open the announcement, then under <b>Links / downloads</b> click <b>+ Add</b>.</li>
        <li>Type the <b>Button text</b> visitors will see (e.g. <code>Problem statement</code>).</li>
        <li>In <b>Link or file</b>, click the box and choose <b>Upload</b>, then pick the PDF from your computer (or drag it in).</li>
        <li>Already uploaded before? Choose it from the list instead. For a website link, choose <b>Enter URL</b> and paste it.</li>
        <li>Check the <b>Preview</b> on the right: the button appears on the event's pop-up.</li>
        <li>Press <b>Save</b>. The file is uploaded together with your change.</li>
      </ol>
      <h3>Preview before saving</h3>
      <p>The <b>Preview</b> pane on the right shows the real website with your unsaved changes. It refreshes a moment after you stop typing. Use the <b>⇄</b> button between the panes to hide or show it.</p>
      <h3>Lists</h3>
      <p>Lists open <b>collapsed</b> (one line per item). Click a row to open it, or use <b>Expand All</b>.</p>
      <div class="rc-help-tip"><b>Placeholder</b> is for sample text that isn't real yet. Untick it (or delete the item) once the real details are in.</div>`,
  },
  flagship: {
    title: "Flagship (yearly) events",
    html: `
      <p>These are the recurring events in the moving "Flagship events" row on the home page (Orientation, ROBO101, workshops…). They have no dates.</p>
      <ol>
        <li>Open <b>Events → Flagship events</b>.</li>
        <li>Click a row to edit it, or <b>+ Add Flagship event</b>.</li>
        <li>Give it a <b>Title</b>, a one-line <b>Short description</b> and a <b>Photo</b>.</li>
        <li>No photo yet? Pick an <b>Icon</b> instead.</li>
        <li>Press <b>Save</b>.</li>
      </ol>`,
  },
  achievements: {
    title: "Add an achievement",
    html: `
      <ol>
        <li>Open <b>Achievements → Hall of fame</b> → <b>+ Add Achievement</b>.</li>
        <li><b>Drag it to the top</b> of the list (newest first).</li>
        <li>Fill in <b>Competition / event</b> and <b>Year</b>.</li>
        <li><b>Result (short):</b> <code>1st</code>, <code>2nd</code> or <code>3rd</code> give gold, silver and bronze. Anything else (<code>17th</code>, <code>Finalist</code>) shows in purple.</li>
        <li><b>Result (full):</b> e.g. <code>1st Position</code>, <code>17th of 36 teams</code>.</li>
        <li>Write a short <b>Description</b> and drag in a <b>Photo</b>.</li>
        <li>Optional: <b>Linked project id</b> adds a "View project" button (find the id in Projects, e.g. <code>agrobot</code>).</li>
        <li>Press <b>Save</b>.</li>
      </ol>
      <div class="rc-help-tip"><b>Where it shows:</b> the home page Hall of Fame and the Achievements photo collage. The first gold becomes the big tile.</div>`,
  },
  projects: {
    title: "Add or edit a project",
    html: `
      <ol>
        <li>Open <b>Projects → All projects</b> → <b>+ Add Project</b>.</li>
        <li><b>Title</b>, then a <b>Page id</b>: lowercase with dashes, e.g. <code>line-follower-v2</code>. It becomes the page address and must be unique.</li>
        <li><b>Group</b> is the filter button it appears under (e.g. <code>2026</code>, <code>Inter IIT</code>).</li>
        <li><b>Status</b>: e.g. <code>Active</code>, <code>Completed</code>, <code>1st Position</code>.</li>
        <li><b>Card text</b> is the short summary; <b>Full overview</b> is shown on the project's own page.</li>
        <li>Add a <b>Photo</b>, <b>Project lead</b>, <b>Mentors</b>. Optional: fact sheet, tech stack, roadmap, links.</li>
        <li>Press <b>Save</b>.</li>
      </ol>
      <div class="rc-help-tip"><b>Order matters:</b> the first project in the list is the big featured card. Drag rows to reorder.</div>`,
  },
  team: {
    title: "Update the team",
    html: `
      <ol>
        <li>Open <b>Team → Core team</b>.</li>
        <li>Click a member to edit, or <b>+ Add Member</b> for someone new.</li>
        <li><b>Full name</b> and <b>Role</b> (e.g. <code>Events Head</code>).</li>
        <li><b>LinkedIn profile</b>: paste the full link, e.g. <code>https://www.linkedin.com/in/username</code>. It becomes the button on their ID card.</li>
        <li>Drag a portrait photo onto <b>Photo</b>: 4:5, like 800 × 1000 px.</li>
        <li>Press <b>Save</b>.</li>
      </ol>
      <div class="rc-help-tip"><b>New academic year?</b> Edit the existing rows (names and roles) rather than deleting everything, and drag rows to set the display order.</div>`,
  },
  gallery: {
    title: "Add photos",
    html: `
      <ol>
        <li>Open <b>Gallery → Photos</b> → <b>+ Add Photo</b>.</li>
        <li>Drag the image onto <b>Photo</b>.</li>
        <li>Write a short <b>Caption</b> and a <b>Tag</b> (e.g. <code>Workshop</code>).</li>
        <li>Press <b>Save</b>.</li>
      </ol>
      <div class="rc-help-tip"><b>Size:</b> around 1600 px on the long side, under ~400 KB. Phone photos are usually much bigger, so shrink them first.</div>`,
  },
  resources: {
    title: "Resources and inventory",
    html: `
      <ol>
        <li>Open <b>Resources</b>. Each <b>Tab</b> is one tab on the Resources page.</li>
        <li>Open a tab and use <b>+ Add Item</b>: <b>Title</b>, <b>Description</b>, <b>Link or file</b> and <b>Kind</b> (e.g. <code>PDF</code>, <code>Docs</code>).</li>
        <li>In the <b>Inventory</b> tab, items need no link. Set <b>Availability</b> to Available, Limited or On request.</li>
        <li>Press <b>Save</b>.</li>
      </ol>`,
  },
  settings: {
    title: "Site settings",
    html: `
      <ul>
        <li><b>Tagline</b>: the sentence under the big home page heading.</li>
        <li><b>About section</b>: heading, paragraphs and the focus-area pills.</li>
        <li><b>About counters</b>: they count automatically. Only fill <b>Fixed number</b> to override.</li>
        <li><b>Contact</b>: the email, address and social links used on every page.</li>
      </ul>
      <div class="rc-help-tip"><b>Careful:</b> these appear on every page, so double-check spelling before saving.</div>`,
  },
  assets: {
    title: "Pictures and files",
    html: `
      <p>The <b>picture icon</b> at the top opens <b>Assets</b>: every uploaded image and file.</p>
      <ul>
        <li>Upload by dragging files in. Pictures dragged into a form are also stored here.</li>
        <li>Keep images small: under ~400 KB (posters under ~300 KB).</li>
        <li>Deleting a picture that's still used somewhere makes it disappear from the site.</li>
      </ul>`,
  },
};

/* ---------------- panel logic (no need to edit below) ---------------- */
(() => {
  // which help topic fits the current editor screen
  const topicFromRoute = () => {
    const h = decodeURIComponent(location.hash);
    if (/#\/assets/.test(h)) return "assets";
    const m = h.match(/collections\/([^/?]+)(?:\/entries\/([^/?]+))?/);
    if (!m) return "start";
    const [, col, file] = m;
    if (col === "events") return file === "announcements" ? "announcements" : file === "flagship" ? "flagship" : "timeline";
    return HELP[col] ? col : "start";
  };

  const btn = document.createElement("button");
  btn.className = "rc-help-btn";
  btn.type = "button";
  btn.innerHTML = "<b>?</b> Help";
  btn.setAttribute("aria-haspopup", "dialog");
  const dim = document.createElement("div");
  dim.className = "rc-help-dim";
  dim.hidden = true;
  const panel = document.createElement("aside");
  panel.className = "rc-help";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Editor instructions");
  panel.hidden = true;

  let current = "start";
  const render = (key) => {
    current = key;
    const t = HELP[key];
    panel.innerHTML = `
      <div class="rc-help-head"><div><span>Instructions</span><h2>${t.title}</h2></div><button class="rc-help-x" type="button" aria-label="Close">×</button></div>
      <div class="rc-help-body">${t.html}
        <div class="rc-help-topics"><p>All topics</p>${Object.entries(HELP).map(([k, v]) => `<button type="button" data-k="${k}" class="${k === key ? "on" : ""}">${v.title}</button>`).join("")}</div>
      </div>`;
    panel.querySelector(".rc-help-body").scrollTop = 0;
  };
  const open = () => {
    render(topicFromRoute());
    dim.hidden = panel.hidden = false;
    void panel.offsetWidth;
    dim.classList.add("open"); panel.classList.add("open");
    btn.classList.remove("pulse");
    try { localStorage.setItem("rcHelpSeen", "1"); } catch {}
    panel.querySelector(".rc-help-x").focus();
  };
  const close = () => {
    dim.classList.remove("open"); panel.classList.remove("open");
    setTimeout(() => { dim.hidden = panel.hidden = true; }, 350);
    btn.focus();
  };
  btn.addEventListener("click", () => (panel.classList.contains("open") ? close() : open()));
  dim.addEventListener("click", close);
  panel.addEventListener("click", (e) => {
    if (e.target.closest(".rc-help-x")) return close();
    const t = e.target.closest("[data-k]");
    if (t) render(t.dataset.k);
  });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && panel.classList.contains("open")) close(); });
  // follow the editor: switching section while the panel is open shows that section's help
  addEventListener("hashchange", () => { if (panel.classList.contains("open")) render(topicFromRoute()); });

  /* ---------- section screens: a description under each row + a tip card ----------
     Edit the text here. Rows are listed in the order they appear in the editor. */
  const SECTION_INFO = {
    events: {
      rows: [
        "Posters, dates and venues: the home page strip (3 newest) and the event calendar.",
        "News and notices with buttons/downloads. Every one appears in the calendar on its date.",
        "The yearly events in the moving “Flagship events” cards on the home page.",
      ],
      tip: ["timeline", "New event coming up? Open <b>Dated events</b> and click <b>+ Add Event</b>."],
    },
    achievements: { rows: ["Every result in the Hall of Fame and on the Achievements photo collage."], tip: ["achievements", "Won something? Add it at the <b>top</b> of the list, newest first."] },
    projects: { rows: ["All projects: the Projects page cards and each project's own page."], tip: ["projects", "Each project needs a unique <b>Page id</b>, e.g. <code>line-follower-v2</code>."] },
    team: { rows: ["Core team: Club Leadership on the home page, the Team page and the LinkedIn ID cards."], tip: ["team", "New tenure? Edit names and roles in place, then add LinkedIn links and photos."] },
    gallery: { rows: ["Photos on the Gallery page, with captions and tags."], tip: ["gallery", "Keep photos under ~400 KB so the site stays fast."] },
    resources: { rows: ["Resources page tabs: guides, links, downloads and the inventory list."], tip: ["resources", "Downloads: use <b>Link or file → Upload</b> inside an item."] },
    settings: { rows: ["Banner tagline, About text, counters, contact email and social links."], tip: ["settings", "These show on every page, so double-check spelling before saving."] },
  };
  const esc = (t) => t.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const rowCss = Object.entries(SECTION_INFO).map(([col, info]) => info.rows.map((text, i) =>
    `body[data-rc-col="${col}"] [role="grid"][aria-label="Files"] [role="row"]:nth-child(${i + 1})::after { content: "${esc(text)}"; }`).join("\n")).join("\n");
  const style = document.createElement("style");
  style.textContent = rowCss;
  document.head.appendChild(style);

  const syncSection = () => {
    const m = decodeURIComponent(location.hash).match(/collections\/([^/?]+)(\/entries)?/);
    const col = m && !m[2] ? m[1] : "";
    if (col) document.body.dataset.rcCol = col; else delete document.body.dataset.rcCol;
    // tip card below the rows of a section screen
    // placed straight after the rows (inside the scrolling list, so it's always in view)
    // (the editor keeps earlier screens in the page, hidden: use the one on screen)
    const list = [...document.querySelectorAll('[aria-label="File List"] [role="grid"][aria-label="Files"]')]
      .find((g) => g.getBoundingClientRect().width > 0);
    const info = SECTION_INFO[col];
    let card = document.querySelector(".rc-tip-card");
    if (!list || !info) { card?.remove(); return; }
    if (card && card.previousElementSibling === list && card.dataset.col === col) return;
    card?.remove();
    card = document.createElement("div");
    card.className = "rc-tip-card";
    card.dataset.col = col;
    card.innerHTML = `<span class="rc-tip-ico">?</span><div><b>Quick tip</b><p>${info.tip[1]}</p></div><button type="button">Step-by-step guide</button>`;
    card.querySelector("button").addEventListener("click", () => window.openEditorHelp(info.tip[0]));
    list.after(card);
  };
  addEventListener("hashchange", syncSection);
  let pending = 0;
  new MutationObserver(() => { cancelAnimationFrame(pending); pending = requestAnimationFrame(syncSection); })
    .observe(document.body, { childList: true, subtree: true });

  let seen = false;
  try { seen = !!localStorage.getItem("rcHelpSeen"); } catch {}
  if (!seen) btn.classList.add("pulse"); // draw attention the first time
  document.body.append(btn, dim, panel);
  window.openEditorHelp = (key) => { open(); if (key && HELP[key]) render(key); };
})();
