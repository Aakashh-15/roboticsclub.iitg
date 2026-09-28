# Contributing

Thanks for helping keep the club website up to date! Most changes are **content edits in
[`js/data.js`](js/data.js)** and need no HTML or CSS knowledge.

## Workflow

1. Create a branch: `git checkout -b add-inter-iit-2026-result`
2. Edit `js/data.js` (and add any images to `images/`).
3. Preview locally: `python -m http.server 5173` → <http://localhost:5173>
4. Check your edits: `node scripts/validate.mjs`
5. Commit, push and open a pull request. CI runs the same checks, and merging to `main` deploys.

## Recipes

### Add a project

Append to `projects` in `js/data.js`. The `id` becomes the page URL (`project.html?id=line-follower-v2`)
and must be unique, lowercase and use dashes.

```js
{
  id: "line-follower-v2",
  title: "Line Follower v2",
  subtitle: "PID-tuned racer",          // optional
  group: "2026",                        // filter chip on the Projects page
  status: "Ongoing",                    // "Active" / "Ongoing" / "Completed" / "1st Position" …
  icon: "rover",                        // rover | arm | drone | dog | swarm | mouse | gear | bulb | trophy | bot | chip
  color: "yellow",                      // purple | pink | yellow
  image: "images/projects/line-follower-v2.jpg",
  mentors: ["Name One", "Name Two"],    // optional
  lead: "Name",                         // optional
  summary: "One or two sentences shown on the card.",
  overview: "Longer paragraph for the deep-dive page.",   // optional
  highlights: ["Point one", "Point two"],                  // optional
  specs: [["Motor", "N20 1000 RPM"], ["MCU", "ESP32"]],    // optional
  stack: ["C++", "ESP32", "KiCad"],                        // optional
  timeline: [["Phase 1", "Chassis"], ["Phase 2", "PID tuning"]], // optional
  links: [["GitHub", "https://github.com/RCIITG/..."]],   // optional
},
```

The first project in the list is shown as the large featured card.

### Post an announcement

Add to `announcements`. Dates are `YYYY-MM-DD`. Posts from the last 21 days get a **New** badge;
`pinned: true` makes one the big featured card on the Updates page.

```js
{
  date: "2026-10-12",
  type: "Workshop",                     // becomes a filter chip
  title: "Arduino workshop for freshers",
  body: "Bring a laptop. Kits provided. Lecture Hall 2, 6 PM.",
  links: [["Register", "https://forms.gle/..."]],   // optional; PDFs in materials/ get a download icon
  pinned: false,
},
```

### Put an important message in the news bar

The bar at the bottom of the home page's first screen scrolls important notices first, then the
announcements (pinned first, recent ones marked **New**). Add a notice to `notices` in `js/data.js`
and delete it once it's no longer relevant:

```js
{ text: "ROBO101 registrations close on 10 October", tag: "Important", link: "updates.html" },
```

### Add an event to the timeline (recent & upcoming)

Dated events go in `timeline` in `js/data.js`. They appear on the home page timeline and on the
Updates page. The status is automatic: future dates show **Upcoming**, today falls in **Live now**,
and past dates show **Recent**. Put the poster in `images/events/` (WebP or JPG, under ~300 KB).

```js
{
  start: "2026-11-14", end: "2026-11-15",          // end optional for one-day events
  title: "Robowars", subtitle: "Techniche 2026",    // subtitle optional
  type: "Competition",
  host: "Robotics Club, IIT Guwahati",              // optional
  desc: "One or two sentences about the event.",
  highlights: ["Prize pool worth 50K", "Open to all colleges"],   // optional chips
  image: "images/events/robowars-2026.webp",        // optional poster (click to enlarge)
},
```

Add `timeline: true` to an announcement to also show it on the timeline. When nothing upcoming is
listed, the timeline ends with a "Next event to be announced" card linking to Instagram.

**Flagship events** (`events`) are the recurring, undated ones shown in the moving carousel.

### Record an achievement

Add to the **top** of `achievements` (newest first). `rank` drives the medal:
`"1st"` gold, `"2nd"` silver, `"3rd"` bronze; anything else shows as a plain badge.

```js
{
  year: "2026", rank: "1st", title: "1st Position", event: "Inter IIT Tech Meet 14.0",
  desc: "What the team built and why it won.",
  project: "line-follower-v2",          // optional: links to that project's page
  image: "images/achievements/interiit-14.jpg",
},
```

### Update the team

Edit `team`. Hovering a person's photo shows **Connect**, which opens their ID card with a
single **View LinkedIn profile** button. Optional fields are shown on the card when filled in.

```js
{
  name: "Full Name", role: "Secretary",
  linkedin: "https://www.linkedin.com/in/username",  // full https URL (the card's button)
  department: "Mechanical Engineering",              // optional
  year: "3rd year",                                  // optional
  about: "One line about their work in the club.",   // optional
},
```

**Photos:** save a portrait (4:5, e.g. 800×1000 px, JPG) as `images/team/<full-name>.jpg`, with the name
in lower case and spaces replaced by dashes, e.g. `B Gautam Rao` → `b-gautam-rao.jpg`. It appears automatically on
the home page, the Team page and any project where that person is lead/mentor. Until then, their
initials are shown. [`images/team/README.md`](images/team/README.md) lists the exact file names, and
`node scripts/validate.mjs` reports which photos are still missing.

### Add photos

Put the file in `images/gallery/` and add `{ image: "images/gallery/x.jpg", caption: "…", tag: "Workshop" }`
to `gallery`. The first five appear on the home page.

**Image tips:** use JPG or WebP, around 1600 px on the long edge and under 400 KB. Large phone photos
slow the site down a lot.

### Resources and inventory

Each tab in `resources` has `items`. Links need `url`; the Inventory tab (`inventory: true`) uses
`qty` (`"Available"`, `"Limited"`, `"On request"`) and shows a Request button that emails the club.

### Top-bar pages

Navigation links live in `PAGES` in `js/common.js`. New pages should copy the structure of
`team.html` (header/footer placeholders + the four script tags).

## Code style

- 2-space indentation, LF line endings (see `.editorconfig`).
- Keep it dependency-free: no frameworks or build tools.
- Test at phone width (≈375 px) and desktop before opening a PR.
