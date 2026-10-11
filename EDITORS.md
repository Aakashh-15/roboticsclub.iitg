# Site editor guide

The website has a built-in editor for club members. You don't need to know any code: every
section of the site is a simple form, and pressing **Save** updates the website.

**Editor address:** `https://aakashh-15.github.io/roboticsclub.iitg/admin/`
(on your own computer while testing: `http://localhost:5173/admin/`)

---

## 1. Getting access

1. Create a free GitHub account at <https://github.com/signup> if you don't have one.
2. Ask the website admin to add you as a collaborator. They'll need your GitHub username.
3. **Accept the invitation**: open the email from GitHub, or go to
   <https://github.com/Aakashh-15/roboticsclub.iitg/invitations> while signed in to GitHub.
   Until you accept it, the editor will say you can't edit yet.
4. Click **Admin** in the website's top bar (or open the editor address) and sign in:
   - **Continue with GitHub** (once the admin has set it up, see below): GitHub's own sign-in
     window opens; enter your GitHub **username and password** there. GitHub remembers you next time.
   - **Access token** (what the sign-in page shows until then):
     1. Click **Create a token on GitHub** on the sign-in page. It opens GitHub's
        *New personal access token (classic)* page with **`public_repo`** already ticked.
     2. Pick an **Expiration** (e.g. 90 days), leave everything else as it is, and press **Generate token**.
     3. Copy the token (it starts with `ghp_`), paste it into the sign-in page and press **Sign in**.

     The sign-in page checks the token with GitHub first and tells you exactly what's wrong if it
     can't be used (mistyped/expired token, invitation not accepted yet, not added as a collaborator).
     Treat the token like a password: never share it. When it expires, just create a new one.

> **Why not a "fine-grained" token?** GitHub doesn't let fine-grained tokens edit a repository
> owned by someone else's personal account, so they don't work for collaborators. Use the classic
> token from the **Create a token on GitHub** link.

Access is removed simply by removing you as a collaborator on GitHub: from then on your token or
GitHub sign-in can no longer save anything, even if you still have the editor open.

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

> **Stuck? Click the yellow "? Help" button** in the bottom-right corner of the editor. It opens step-by-step
> instructions for the section you are in, plus every other topic. (Admins: the text lives in `admin/help.js`.)

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

**Adding editors:** repository → *Settings → Collaborators → Add people* → their GitHub username.
(On a personal repository every collaborator gets write access, which is what the editor needs.)
They must **accept the invitation** before they can sign in; pending invitations are listed on the
same page. Removing them there revokes editor access immediately.

**How access is protected:** the editor has no passwords of its own. GitHub decides who may save:
only the repository owner and its collaborators. Anyone else can open `/admin/` but cannot sign in
(the sign-in page checks this) and could never save anything. Every saved change is a commit under
the editor's own GitHub name, so it can be reviewed and undone in the repository's history.

**Troubleshooting sign-in**

| What the sign-in page says | What to do |
|---|---|
| *GitHub didn't accept this token* | The token is mistyped, expired or deleted. Create a new one. |
| *This is a fine-grained token…* | Create a classic token with the **Create a token on GitHub** link instead. |
| *This token can only read, not save* | The token was made without `public_repo`. Create a new one, keep it ticked. |
| *… has an invitation waiting* / *can't edit the website yet* | Accept the invitation, or ask the admin to add that GitHub username. |
| There is no **Continue with GitHub** button | It appears once the one-time setup above is done; until then use an access token. |

**Testing locally without any setup:** run `python -m http.server 5173`, open
`http://localhost:5173/admin/` in Chrome or Edge, and choose **Work with Local Repository**, then
select this folder. Edits are written straight to your local files; commit them with git as usual.
