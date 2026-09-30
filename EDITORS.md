# Site editor guide

The website has a built-in editor for club members. You don't need to know any code: every
section of the site is a simple form, and pressing **Save** updates the website.

**Editor address:** `https://aakashh-15.github.io/roboticsclub.iitg/admin/`
(on your own computer while testing: `http://localhost:5173/admin/`)

---

## 1. Getting access

1. Create a free GitHub account at <https://github.com/signup> if you don't have one.
2. Ask the website admin to add you as a collaborator. They'll need your GitHub username.
3. Accept the invitation email from GitHub.
4. Open the editor address and click **Sign In with GitHub**, using your GitHub username and password.

Access is removed simply by removing you as a collaborator on GitHub.

> **If "Sign In with GitHub" isn't set up yet**, use **Sign In Using Access Token**:
> on GitHub go to *Settings → Developer settings → Personal access tokens → Fine-grained tokens →
> Generate new token*, choose the `roboticsclub.iitg` repository, give it
> **Contents: Read and write** permission, and paste the token into the editor.
> Treat the token like a password and never share it.

## 2. What you can edit

| Editor section | What it changes on the site |
|---|---|
| **Events → Dated events** | Home page "Recent & upcoming" strip + event calendar + event pop-ups |
| **Events → Announcements** | Calendar entries (and the strip if "Also show on the home strip" is ticked) |
| **Events → Flagship events** | The moving "Flagship events" cards |
| **Achievements** | Home Hall of Fame + the Achievements photo collage |
| **Projects** | Projects page and each project's own page |
| **Team** | Club Leadership on the home page, the Team page and the LinkedIn ID cards |
| **Gallery** | Gallery page |
| **Resources** | Resources page tabs, links and the inventory list |
| **Site settings** | Banner tagline, About text, counters, contact email and social links |

The **design never changes**: you only edit text, dates, links and pictures, and the site lays
them out in the club's style automatically.

## 3. Everyday tasks

**Add an event (with poster)**
Events → Dated events → **Add Event** → fill in Title, Start date (and End date if it runs several
days), Time, Venue, Description → drag the poster onto **Poster** → **Save**.
It appears on the home strip (newest 3) and in the calendar.

**Post an announcement**
Events → Announcements → **Add Announcement** → Title, Date, Type, Text. Add buttons under
*Links / downloads* if needed → **Save**.

**Add an achievement**
Achievements → Hall of fame → **Add Achievement**, then drag it to the **top** of the list →
fill in Competition, Year, Result (short: `1st`, `2nd`, `17th`…), Result (full), Description, Photo → **Save**.

**Add or update a team member**
Team → Core team → click the person (or **Add Member**) → fill in LinkedIn and drag in a photo → **Save**.

**Remove something**
Open the list, click the **⋯ / trash** icon on the item → **Save**.

## 4. After you press Save

- Your change is saved to the club's GitHub repository with your name on it, so there's a full
  history and nothing is ever truly lost.
- An automatic check runs. If a date or link is wrong, the check fails and the live site keeps the
  previous version; ask the admin to look at the **Actions** tab.
- When publishing is switched on, the live site updates within about a minute.

## 5. Picture tips

- Posters and photos: JPG or WebP, around 1600 px on the long side, **under ~400 KB**.
- Team photos: portrait 4:5 (e.g. 800 × 1000), similar background for everyone.
- Large phone photos make the site slow; shrink them first (e.g. <https://squoosh.app>).

---

## For the admin: one-time setup of "Sign in with GitHub"

GitHub requires a tiny helper service to complete the sign-in. It's free and takes about 10 minutes.

1. **Create a Cloudflare account** (free) at <https://dash.cloudflare.com/sign-up>.
2. **Deploy the helper:** open <https://github.com/sveltia/sveltia-cms-auth> and click
   **Deploy to Cloudflare Workers**, then follow the prompts. Note the worker address, e.g.
   `https://sveltia-cms-auth.<your-name>.workers.dev`.
3. **Create a GitHub OAuth app:** GitHub → *Settings → Developer settings → OAuth Apps → New OAuth App*
   - Homepage URL: `https://aakashh-15.github.io/roboticsclub.iitg/`
   - Authorization callback URL: `<worker address>/callback`
   - Create it, then **Generate a new client secret**.
4. **Give the secrets to the helper:** Cloudflare → Workers → your worker → *Settings → Variables*
   - `GITHUB_CLIENT_ID` = the app's Client ID
   - `GITHUB_CLIENT_SECRET` = the client secret (mark it **Encrypt**)
   - `ALLOWED_DOMAINS` = `aakashh-15.github.io, localhost`
5. **Point the editor at it:** in `admin/config.yml`, uncomment `base_url:` and set it to the worker
   address. Commit and push.

**Adding editors:** repository → *Settings → Collaborators → Add people* → their GitHub username
(role: *Write*). Removing them there revokes editor access immediately.

**Testing locally without any setup:** run `python -m http.server 5173`, open
`http://localhost:5173/admin/` in Chrome or Edge, and choose **Work with Local Repository**, then
select this folder. Edits are written straight to your local files; commit them with git as usual.
