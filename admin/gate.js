/* =====================================================================
   Members area entrance: sign-in logic.
   ---------------------------------------------------------------------
   The editor (Sveltia CMS) loads underneath the entrance. This script:
   - shows "Continue with GitHub" once the sign-in helper is set up
     (base_url in config.yml, see EDITORS.md), otherwise the token form;
   - checks an access token with GitHub BEFORE using it, so editors get a
     clear message (wrong token, missing permission, invitation not yet
     accepted, not a collaborator) instead of a generic failure;
   - then hands the token to the editor and removes the entrance.
   The token is only ever sent to api.github.com and is never stored here.
   Who may edit is decided by GitHub alone: collaborators with Write access.
   ===================================================================== */
(() => {
  const gate = document.getElementById("gate");
  if (!gate) return;
  const byId = (id) => document.getElementById(id);
  const status = byId("gStatus");
  const escHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const waitFor = async (test, ms, step = 150) => {
    for (const end = Date.now() + ms; Date.now() < end; await sleep(step)) { const v = test(); if (v) return v; }
    return test();
  };

  // status line: kind = "" (ok, green) | "warn" | "error" (html allowed, only our own text + escaped values)
  const say = (html, kind = "") => { status.innerHTML = html; status.className = "g-status" + (kind ? " " + kind : ""); };

  // which part of the card is visible: ready | oauth | token
  let oauthReady = false;
  const showPanel = (name) => {
    gate.querySelectorAll("[data-panel]").forEach((p) => (p.hidden = p.dataset.panel !== name));
    // switch links under the card (only when GitHub sign-in is set up)
    byId("gShowToken").hidden = !(oauthReady && name === "oauth");
    byId("gBackOauth").hidden = !(oauthReady && name === "token");
  };
  gate.addEventListener("click", (e) => {
    const t = e.target.closest("[data-show]");
    if (t) { showPanel(t.dataset.show); say(""); if (t.dataset.show === "token") byId("gToken").focus(); }
  });

  // ---------- stars ----------
  const sky = byId("gSky");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("i");
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 90}%;opacity:${(0.3 + Math.random() * 0.7).toFixed(2)};animation-delay:${(Math.random() * 4).toFixed(2)}s`;
    sky.appendChild(s);
  }

  // keep the editor in its dark theme (matches the site)
  const forceDark = () => document.querySelectorAll('[data-theme="light"]').forEach((el) => el.setAttribute("data-theme", "dark"));
  new MutationObserver(forceDark).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["data-theme"] });

  // ---------- reading the editor underneath ----------
  const editorButton = (re) => [...document.querySelectorAll("button")].find((b) => !gate.contains(b) && re.test(b.textContent));
  const signedIn = () => !!document.querySelector('[role="toolbar"][aria-label="Global"]'); // the editor's top bar exists only after sign-in
  const atSignInScreen = () => !!editorButton(/sign in|work with/i);
  // an error the editor shows on its own sign-in screen (e.g. "You don't have access to …")
  const editorError = () => {
    if (signedIn()) return "";
    const text = document.body.innerText.replace(gate.innerText, "");
    const m = text.match(/[^\n]*(have access|collaborator|invitation|could not|couldn[’']t|failed|error)[^\n]*/i);
    return m ? m[0].trim() : "";
  };

  // ---------- leaving the entrance ----------
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    gate.classList.add("gone");
    setTimeout(() => gate.remove(), 500);
    // signed out later? bring the entrance back instead of the editor's plain sign-in screen
    let wasIn = false;
    const back = setInterval(() => {
      if (signedIn()) wasIn = true;
      else if (wasIn && atSignInScreen()) { clearInterval(back); location.reload(); }
    }, 1500);
  };
  byId("gOpen").addEventListener("click", finish);

  // ---------- settings from config.yml ----------
  let REPO = "Aakashh-15/roboticsclub.iitg";
  const config = fetch("config.yml", { cache: "no-cache" })
    .then((r) => (r.ok ? r.text() : ""))
    .then((t) => {
      const repo = t.match(/^\s*repo:\s*["']?([\w.-]+\/[\w.-]+)/m);
      if (repo) REPO = repo[1];
      byId("gGuide").href = `https://github.com/${REPO}/blob/main/EDITORS.md`;
      return { oauth: /^\s*base_url:\s*\S+/m.test(t) };
    })
    .catch(() => ({ oauth: false }));

  const isLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  byId("gLocal").hidden = !isLocal;
  byId("gLocal").addEventListener("click", () => {
    const b = editorButton(/local repository/i);
    if (!b) return say("Local editing needs Chrome or Edge, and the editor must have finished loading.", "warn");
    b.click(); // same click, so the browser lets the folder picker open
    finish();
  });

  // ---------- first screen ----------
  (async () => {
    const { oauth } = await config;
    oauthReady = oauth;
    showPanel(oauth ? "oauth" : "token");
    if (!oauth) say("");
    // already signed in from an earlier visit?
    const state = await waitFor(() => (signedIn() ? "in" : atSignInScreen() ? "out" : ""), 15000, 250);
    if (state === "in") {
      showPanel("ready");
      byId("gOpen").focus();
    } else if (!state) {
      say("The editor is taking a while to load. Check your connection, or reload the page.", "warn");
    }
  })();

  // ---------- Continue with GitHub (needs the sign-in helper, see EDITORS.md) ----------
  byId("gGo").addEventListener("click", async () => {
    const b = editorButton(/sign in with\W*github/i);
    if (!b) return say("The editor is still loading. Try again in a moment.", "warn");
    b.click(); // same click, so the browser allows GitHub's sign-in window
    say("Finish signing in on GitHub's window…");
    const ok = await waitFor(() => signedIn() || editorError(), 180000, 400);
    if (signedIn()) return finish();
    explain(ok || "Sign-in didn't finish. If GitHub's window didn't open, allow pop-ups for this site and try again.");
  });

  // turn the editor's message into advice
  const explain = (msg) => {
    if (/have access|collaborator|invitation/i.test(msg)) return notAnEditor("");
    say(`<b>Couldn't sign in.</b> ${escHtml(msg)}`, "error");
  };
  const notAnEditor = (login, pending = false) => {
    const who = login ? `@${escHtml(login)}` : "Your GitHub account";
    const inv = `<a href="https://github.com/${REPO}/invitations" target="_blank" rel="noopener">accept the invitation</a>`;
    say(pending
      ? `<b>${who} has an invitation waiting.</b> Please ${inv}, then sign in again.`
      : `<b>${who} can't edit the website yet.</b> If the admin has added you, ${inv} first. Otherwise send your GitHub username to the website admin.`, "error");
  };

  // ---------- access token ----------
  const tokenInput = byId("gToken");
  byId("gEye").addEventListener("click", (e) => {
    const show = tokenInput.type === "password";
    tokenInput.type = show ? "text" : "password";
    e.currentTarget.textContent = show ? "Hide" : "Show";
    e.currentTarget.setAttribute("aria-pressed", String(show));
    e.currentTarget.setAttribute("aria-label", show ? "Hide token" : "Show token");
  });

  const goBtn = byId("gTokenGo");
  const busy = (on) => { goBtn.disabled = on; goBtn.textContent = on ? "Checking…" : "Sign in"; };

  byId("gTokenForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = tokenInput.value.trim();
    if (!token) { say("Paste your token first.", "warn"); return tokenInput.focus(); }
    busy(true);
    try { await tokenSignIn(token); } finally { busy(false); }
  });

  async function tokenSignIn(token) {
    if (!/^(ghp_|github_pat_|gho_)?[A-Za-z0-9_]{20,}$/.test(token)) {
      return say("<b>That doesn't look like a GitHub token.</b> It should start with <code>ghp_</code>. Copy it again from GitHub.", "error");
    }
    say("Checking your access with GitHub…");
    const gh = (path) => fetch("https://api.github.com" + path, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
      cache: "no-store",
      referrerPolicy: "no-referrer",
    });

    let r;
    try { r = await gh("/user"); } catch { return say("Couldn't reach GitHub. Check your internet connection and try again.", "error"); }
    if (r.status === 401) return say("<b>GitHub didn't accept this token.</b> It may be mistyped, expired or deleted. Create a new one with the link above.", "error");
    if (!r.ok) return say(`GitHub answered with an error (${r.status}). Try again in a minute.`, "error");
    const { login } = await r.json();
    const owner = REPO.split("/")[0];

    // fine-grained tokens can't reach a repository owned by someone else's personal account
    if (/^github_pat_/.test(token) && login.toLowerCase() !== owner.toLowerCase()) {
      return say("<b>This is a fine-grained token, which GitHub doesn't allow for collaborators.</b> Use the <b>Create a token on GitHub</b> link above (a classic token with <code>public_repo</code> ticked) and paste that one instead.", "error");
    }
    // classic tokens report their scopes: saving needs public_repo (or repo)
    const scopes = r.headers.get("x-oauth-scopes");
    if (scopes !== null && !scopes.split(/,\s*/).some((s) => s === "repo" || s === "public_repo")) {
      return say("<b>This token can only read, not save.</b> When creating it keep <code>public_repo</code> ticked. Create a new one with the link above.", "error");
    }

    const rr = await gh(`/repos/${REPO}`).catch(() => null);
    if (!rr || !rr.ok) return say(`Couldn't open the website's repository (${rr ? rr.status : "network error"}). Try again, or ask the website admin.`, "error");
    const repo = await rr.json();
    if (!repo.permissions || !repo.permissions.push) {
      // is an invitation waiting? (best effort: needs the token to list invitations)
      let pending = false;
      try {
        const inv = await gh("/user/repository_invitations");
        if (inv.ok) pending = (await inv.json()).some((i) => i.repository && i.repository.full_name.toLowerCase() === REPO.toLowerCase());
      } catch {}
      return notAnEditor(login, pending);
    }

    say(`Welcome, @${escHtml(login)}! Opening the editor…`);
    await handOver(token);
  }

  // give the checked token to the editor's own "Sign In Using Access Token" dialog
  async function handOver(token) {
    const open = editorButton(/access token/i);
    if (!open) return say("The editor is still loading. Wait a moment and press Sign in again.", "warn");
    document.body.classList.add("rc-signing");
    try {
      open.click();
      const input = await waitFor(() => document.querySelector("dialog[open] input"), 4000);
      if (!input) throw new Error("The editor's sign-in box didn't open.");
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, token);
      input.dispatchEvent(new Event("input", { bubbles: true }));
      const dialog = input.closest("dialog");
      const submit = await waitFor(() => [...dialog.querySelectorAll("button")].find((b) => /sign in/i.test(b.textContent) && !b.disabled), 3000);
      if (!submit) throw new Error("The editor didn't accept the token.");
      submit.click();
      tokenInput.value = "";
      const result = await waitFor(() => signedIn() || editorError(), 25000, 250);
      if (signedIn()) return finish();
      // still on the dialog? close it so the next try starts clean
      [...document.querySelectorAll("dialog[open] button")].find((b) => /cancel/i.test(b.textContent))?.click();
      explain(result || "The editor took too long to respond. Reload the page and try again.");
    } catch (err) {
      [...document.querySelectorAll("dialog[open] button")].find((b) => /cancel/i.test(b.textContent))?.click();
      say(`<b>Couldn't open the editor.</b> ${escHtml(err.message)} Reload the page and try again.`, "error");
    } finally {
      document.body.classList.remove("rc-signing");
    }
  }
})();
