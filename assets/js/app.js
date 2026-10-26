/*
  Sanad Family Passport — demo app.
  A small single-page app with hash routes (#/passport, #/events, ...).
  There is no server: everything a visitor enters is saved in their own
  browser (localStorage), so the site runs as-is on GitHub Pages.
*/
(function () {
  "use strict";

  const D = window.SANAD;
  const STORE_KEY = "sanad-demo-v1";
  const domainById = Object.fromEntries(D.domains.map(d => [d.id, d]));
  const activityById = Object.fromEntries(D.activities.map(a => [a.id, a]));
  const eventById = Object.fromEntries(D.events.map(e => [e.id, e]));

  const main = document.getElementById("main");
  const modal = document.getElementById("modal");
  const toastEl = document.getElementById("toast");

  /* ---------- Saved state ---------- */

  function blankState() {
    return { family: null, logs: [], registrations: {}, stories: [], reviews: {} };
  }

  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(blankState(), JSON.parse(raw));
    } catch (e) { /* storage blocked: keep everything in memory */ }
    return blankState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      // Usually the browser's storage is full of photos: keep the data, drop the photos.
      state.logs.forEach(l => { l.photo = null; });
      state.stories.forEach(s => { s.photo = null; });
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e2) { /* memory only */ }
      showToast("This browser's storage is full, so photos weren't kept.");
    }
  }

  /* ---------- Helpers ---------- */

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ESC[c]);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const hoursLabel = n => n + (n === 1 ? " hour" : " hours");
  const truncate = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
  const familyLabel = name => (/family$/i.test(name) ? name : name + " family");

  function todayISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function parseDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function fmtDate(iso, opts) {
    return parseDate(iso).toLocaleDateString("en-GB", opts || { day: "numeric", month: "short", year: "numeric" });
  }

  function hashCode(str) {
    let h = 0;
    for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return Math.abs(h);
  }

  function field(form, name) {
    const el = form.elements.namedItem(name);
    return el && typeof el.value === "string" ? el.value.trim() : "";
  }

  function parseMembers(text) {
    return text.split(/[\n,،]+/).map(s => s.trim()).filter(Boolean).slice(0, 30);
  }

  const icon = {
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
  };

  /* ---------- Hours ---------- */

  // Approved ("done") and in-review ("pending") hours, per area and in total.
  function tally(logs) {
    const by = {};
    D.domains.forEach(d => { by[d.id] = { done: 0, pending: 0 }; });
    logs.forEach(l => {
      if (l.status === "rejected" || !by[l.domain]) return;
      by[l.domain][l.status === "verified" ? "done" : "pending"] += l.hours;
    });
    let done = 0, pending = 0;
    Object.values(by).forEach(v => { done += v.done; pending += v.pending; });
    return { by, done, pending, total: done + pending };
  }

  function makeLog(activity, extra) {
    return Object.assign({
      id: uid(),
      activityId: activity.id,
      domain: activity.domain,
      title: activity.name,
      hours: activity.hours,
      date: todayISO(),
      note: "",
      photo: null,
      fileName: "",
      members: [],
      status: "pending",
      submitted: todayISO()
    }, extra);
  }

  function passportNo(fam) {
    return "SND" + String(hashCode(fam.name + fam.issued) % 1000000).padStart(6, "0");
  }

  // The machine-readable lines at the bottom of a real passport page.
  function mrz(fam) {
    const clean = s => s.toUpperCase().replace(/[^A-Z]+/g, "<");
    const pad = s => (s + "<".repeat(44)).slice(0, 44);
    const issued = fam.issued.replace(/-/g, "").slice(2);
    const count = String(fam.members.length).padStart(2, "0");
    return pad("P<QAT" + clean(fam.name) + "<<FAMILY<PASSPORT") + "\n" +
      pad(passportNo(fam) + "<QAT" + issued + "<" + count + "<<SANAD<100<HOURS");
  }

  /* ---------- Routing ---------- */

  const routes = {
    "": viewHome,
    about: viewAbout,
    passport: viewPassport,
    challenges: viewChallenges,
    archive: viewArchive,
    events: viewEvents,
    admin: viewAdmin
  };

  const titles = {
    about: "About", passport: "Your passport", challenges: "Challenges",
    archive: "Family archive", events: "Events", admin: "Admin dashboard"
  };

  function currentRoute() {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    const page = Object.prototype.hasOwnProperty.call(routes, parts[0]) ? parts[0] : "";
    return { page, arg: parts[1] || "" };
  }

  function render(keepScroll) {
    const { page, arg } = currentRoute();
    main.innerHTML = routes[page](arg);
    updateChrome(page);
    if (!keepScroll) window.scrollTo(0, 0);
  }

  function updateChrome(page) {
    document.querySelectorAll("[data-nav]").forEach(a => {
      if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    const pill = document.getElementById("family-pill");
    if (state.family) {
      const t = tally(state.logs);
      pill.classList.remove("is-empty");
      pill.innerHTML = `<span>${esc(familyLabel(state.family.name))}</span><b>${t.total} h</b>`;
      pill.setAttribute("aria-label", `${familyLabel(state.family.name)} passport, ${t.total} of ${D.goalHours} hours`);
    } else {
      pill.classList.add("is-empty");
      pill.textContent = "Create passport";
      pill.removeAttribute("aria-label");
    }
    document.title = page ? titles[page] + " | Sanad" : "Sanad Family Passport";
  }

  /* ---------- Shared pieces ---------- */

  function pageHead(ar, title, text) {
    return `<section class="page-head wrap">
      <span class="ar" lang="ar" dir="rtl">${ar}</span>
      <h1>${esc(title)}</h1>
      ${text ? `<p>${text}</p>` : ""}
    </section>`;
  }

  function stampHTML(o) {
    const d = domainById[o.domain];
    const r = o.rot != null ? o.rot : (hashCode(o.date + o.domain + o.hours + (o.seed || "")) % 24) - 12;
    const date = o.pending ? "In review" : fmtDate(o.date, { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase();
    return `<div class="stamp${o.pending ? " is-pending" : ""}${o.cls ? " " + o.cls : ""}" data-domain="${d.id}" style="--r:${r}deg">
      <span class="stamp-area">${esc(d.short)}</span>
      <span class="stamp-hours">${o.hours}<small>h</small></span>
      <span class="stamp-date">${date}</span>
    </div>`;
  }

  function bookletHTML() {
    return `<div class="booklet">
      <p class="booklet-top"><span lang="ar" dir="rtl">مبادرة سند</span>Sanad initiative</p>
      <img src="assets/img/logo-gold.png" alt="">
      <p class="booklet-title"><strong>Family</strong>Passport</p>
      <span class="chip-mark"></span>
    </div>`;
  }

  function chip(domainId, text) {
    return `<span class="chip" data-domain="${domainId}">${esc(text || domainById[domainId].name)}</span>`;
  }

  function upcomingEvents() {
    const today = todayISO();
    const list = D.events.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    return list.length ? list : D.events.slice();
  }

  function eventRowHTML(e) {
    const d = parseDate(e.date);
    const reg = state.registrations[e.id];
    const taken = e.registered + (reg ? 1 : 0);
    const full = !reg && taken >= e.capacity;
    let side;
    if (reg) {
      side = `<span class="registered-note">${icon.check}Registered, ${reg.participants} ${reg.participants === 1 ? "person" : "people"}</span>
        <button class="link-btn" type="button" data-action="cancel-event" data-event="${e.id}">Cancel registration</button>`;
    } else if (full) {
      side = `<button class="btn btn-secondary btn-small" type="button" disabled>Event full</button>`;
    } else {
      side = `<button class="btn btn-primary btn-small" type="button" data-action="register-event" data-event="${e.id}">Register family</button>`;
    }
    return `<li class="event-row">
      <div class="date-block">
        <span class="day">${d.getDate()}</span>
        <span class="mon">${d.toLocaleDateString("en-GB", { month: "short" })}</span>
        <span class="wk">${d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
      </div>
      <div class="event-main">
        ${chip(e.domain)}
        <h3>${esc(e.title)}</h3>
        <div class="event-meta">
          <span>${icon.clock}${esc(e.time)}</span>
          <span>${icon.pin}${esc(e.location)}</span>
          <span>${hoursLabel(e.hours)} for your passport</span>
        </div>
        <p class="event-desc">${esc(e.description)}</p>
      </div>
      <div class="event-side">
        <div class="capacity">${taken} of ${e.capacity} families registered
          <div class="capacity-track"><div class="capacity-fill" style="width:${Math.min(100, taken / e.capacity * 100)}%"></div></div>
        </div>
        ${side}
      </div>
    </li>`;
  }

  /* ---------- Home ---------- */

  function viewHome() {
    const story = D.stories[0];
    return `
    <section class="hero">
      <div class="wrap hero-grid">
        <div>
          <p class="hero-ar" lang="ar" dir="rtl">جواز سند العائلي</p>
          <h1>100 hours that bring a family closer.</h1>
          <p class="lede">Sanad gives every family a digital passport. Do activities together across four areas of family and community life, collect a stamp for each one, and work towards 100 shared hours.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/passport">${state.family ? "Open your passport" : "Create your family passport"}</a>
            <a class="btn btn-secondary" href="#/challenges">Browse challenges</a>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          ${bookletHTML()}
          ${stampHTML({ domain: "kinship", hours: 3, date: "2026-10-02", rot: 14, cls: "hero-stamp stamp-in" })}
          ${stampHTML({ domain: "volunteering", hours: 5, date: "2026-10-09", rot: -12, cls: "hero-stamp two stamp-in" })}
        </div>
      </div>
    </section>

    <section class="section-tight">
      <div class="wrap">
        <div class="section-head">
          <div>
            <h2>Four areas, 25 hours each</h2>
            <p>Every challenge belongs to one area. A balanced passport has about 25 hours in each.</p>
          </div>
        </div>
        <div class="domain-grid">
          ${D.domains.map(d => `
            <a class="domain" data-domain="${d.id}" href="#/challenges/${d.id}">
              <span class="ar" lang="ar" dir="rtl">${d.ar}</span>
              <h3>${esc(d.name)}</h3>
              <p>${esc(d.blurb)}</p>
              <span class="domain-foot">${D.activities.filter(a => a.domain === d.id).length} challenges</span>
            </a>`).join("")}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head"><h2>How the passport works</h2></div>
        <ol class="steps">
          <li><h3>Create your passport</h3><p>Register your family and add everyone taking part, from grandparents to grandchildren.</p></li>
          <li><h3>Pick a challenge</h3><p>Choose from ${D.activities.length} shared activities, or sign up for a family event.</p></li>
          <li><h3>Submit proof</h3><p>Upload a photo or short video. The Sanad team reviews it and approves your hours.</p></li>
          <li><h3>Collect stamps</h3><p>Each activity adds a stamp to your passport. Families who reach 100 hours earn the Sanad badge.</p></li>
        </ol>
      </div>
    </section>

    <section class="band section">
      <div class="wrap band-grid">
        <blockquote>
          <p>“${esc(story.text[0])}”</p>
          <cite>${esc(story.teller)}, recorded by ${esc(story.recorder)}</cite>
        </blockquote>
        <div>
          <h2>Every grandparent has a story worth keeping</h2>
          <p>The family archive keeps our elders' memories for the next generation. Record a story with your grandparents and it counts towards your passport.</p>
          <a class="btn btn-primary" href="#/archive">Visit the family archive</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            <h2>Upcoming family events</h2>
            <p>Register as a family group. Hours are added once the organizers confirm you attended.</p>
          </div>
          <a class="btn btn-secondary btn-small" href="#/events">All events</a>
        </div>
        <ul class="event-list">${upcomingEvents().slice(0, 3).map(eventRowHTML).join("")}</ul>
      </div>
    </section>`;
  }

  /* ---------- About ---------- */

  function viewAbout() {
    return `
    ${pageHead("عن سند", "About Sanad", "A youth-led initiative that strengthens family bonds and social participation in Qatar through one shared goal: 100 hours of activities, done together.")}

    <section class="wrap section-tight">
      <div class="about-grid">
        <div class="prose">
          <p class="meaning"><span lang="ar">سند</span> means support: the person you lean on, and who leans on you.</p>
          <h2>The idea</h2>
          <p>Busy schedules and screens leave families less time together, and children grow up with fewer chances to hear their grandparents' stories. Sanad turns time together into a goal the whole family works towards.</p>
          <p>Each family receives a digital Sanad Family Passport. Together they complete challenges in four areas: kinship ties, national identity and heritage, volunteering and community, and health and skills. Every activity adds a stamp and hours to the passport, until the family reaches 100 hours.</p>
        </div>
        <div>
          <h2>Our goals</h2>
          <ul class="goal-list">
            <li><span>Strengthen the bond between generations through regular, meaningful time together.</span></li>
            <li><span>Root children in Qatari identity, heritage and values.</span></li>
            <li><span>Make volunteering and community service a family habit.</span></li>
            <li><span>Encourage active, screen-free time and new practical skills.</span></li>
            <li><span>Preserve our elders' memories in a family archive for future generations.</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="wrap section-tight">
      <div class="vision">
        <h2>Our vision</h2>
        <p>A society where every family is a sanad for its members and for its community.</p>
      </div>
    </section>

    <section class="wrap section-tight">
      <div class="section-head">
        <div>
          <h2>How we measure success</h2>
          <p>The admin dashboard follows these indicators as families take part.</p>
        </div>
        <a class="btn btn-secondary btn-small" href="#/admin">View the dashboard</a>
      </div>
      <div class="indicator-list">
        <div><b>Families taking part</b><span>Registered families and how many members join in.</span></div>
        <div><b>Shared hours</b><span>Approved hours, in total and in each of the four areas.</span></div>
        <div><b>Families reaching 100 hours</b><span>How many families complete their passport.</span></div>
        <div><b>Community reach</b><span>Event registrations, volunteering hours and stories added to the archive.</span></div>
      </div>
    </section>`;
  }

  /* ---------- Passport ---------- */

  function familyFieldsHTML(fam) {
    return `
      <div class="field">
        <label for="f-name">Family name</label>
        <input id="f-name" name="familyName" type="text" required autocomplete="family-name" placeholder="For example, Al-Kuwari" value="${esc(fam ? fam.name : "")}">
      </div>
      <div class="field">
        <label for="f-members">Who is taking part? <span class="hint">One name per line, or separated by commas</span></label>
        <textarea id="f-members" name="members" required placeholder="Grandmother Moza&#10;Ahmed&#10;Maryam">${esc(fam ? fam.members.join("\n") : "")}</textarea>
      </div>
      <p class="form-error" id="form-error" hidden></p>`;
  }

  function registerHTML() {
    return `
    ${pageHead("جواز سند العائلي", "Create your family passport", "Your passport records every activity your family completes together. Setting it up takes a minute.")}
    <section class="wrap">
      <div class="register-card">
        <form class="form" data-form="register" novalidate>
          ${familyFieldsHTML(null)}
          <div class="form-actions start"><button class="btn btn-primary" type="submit">Create passport</button></div>
        </form>
        <p class="sample-note">Presenting Sanad? <button class="link-btn" type="button" data-action="load-sample">Fill it with a sample family</button> to show a passport that already has stamps.</p>
      </div>
    </section>`;
  }

  function progressSentence(t) {
    if (t.total === 0) return "Your passport is ready. Complete a challenge to collect your first stamp.";
    if (t.done >= D.goalHours) return "You've reached 100 approved hours. Congratulations, you're a Sanad family.";
    const left = Math.max(0, D.goalHours - t.total);
    let s = left ? `${hoursLabel(left)} to go.` : "You've logged 100 hours.";
    if (t.pending) s += ` ${hoursLabel(t.pending)} ${t.pending === 1 ? "is" : "are"} waiting for the Sanad team to review.`;
    return s;
  }

  function idPageHTML(fam) {
    return `<div class="id-page">
      <div class="id-head"><p>Sanad family passport</p><p lang="ar" dir="rtl">جواز سند العائلي</p></div>
      <div class="id-body">
        <div class="id-photo"><div><img src="assets/img/logo.png" alt=""><span>${fam.members.length} members</span></div></div>
        <dl class="id-fields">
          <div><dt>Family name</dt><dd>${esc(fam.name)}</dd></div>
          <div><dt>Passport no.</dt><dd>${passportNo(fam)}</dd></div>
          <div class="wide"><dt>Members</dt><dd>${esc(fam.members.join(", "))}</dd></div>
          <div><dt>Issued</dt><dd>${fmtDate(fam.issued)}</dd></div>
          <div><dt>Goal</dt><dd>${D.goalHours} shared hours</dd></div>
        </dl>
      </div>
      <pre class="mrz" aria-hidden="true">${esc(mrz(fam))}</pre>
      <div class="id-actions">
        <button class="link-btn" type="button" data-action="edit-family">Edit family</button>
        <button class="link-btn" type="button" data-action="reset-family">Start over</button>
      </div>
    </div>`;
  }

  function progressPanelHTML(t) {
    // One cell per hour: approved hours first, grouped by area, then hours in review.
    const cells = [];
    D.domains.forEach(d => { for (let i = 0; i < t.by[d.id].done; i++) cells.push(`<span class="cell is-done" data-domain="${d.id}"></span>`); });
    D.domains.forEach(d => { for (let i = 0; i < t.by[d.id].pending; i++) cells.push(`<span class="cell is-pending" data-domain="${d.id}"></span>`); });
    const extra = Math.max(0, cells.length - D.goalHours);
    const shown = cells.slice(0, D.goalHours);
    while (shown.length < D.goalHours) shown.push('<span class="cell"></span>');

    const meters = D.domains.map(d => {
      const v = t.by[d.id];
      const done = Math.min(100, v.done / d.target * 100);
      const pending = Math.min(100 - done, v.pending / d.target * 100);
      return `<li data-domain="${d.id}">
        <div class="meter-label"><b>${esc(d.name)}</b><span>${v.done + v.pending} of ${d.target} h</span></div>
        <div class="meter-track"><div class="meter-fill" style="width:${done}%"></div><div class="meter-fill pending" style="width:${pending}%"></div></div>
      </li>`;
    }).join("");

    return `<div class="panel">
      <h2>Progress</h2>
      <div class="progress-head"><span class="big">${t.total}</span><span class="of">of ${D.goalHours} hours</span></div>
      <div class="hour-grid" role="img" aria-label="${t.done} approved hours and ${t.pending} hours in review, out of ${D.goalHours}">${shown.join("")}</div>
      <div class="grid-key">
        <span><i class="k-done"></i>Approved</span>
        <span><i class="k-pending"></i>In review</span>
        <span><i class="k-empty"></i>To go</span>
        ${extra ? `<span>Plus ${hoursLabel(extra)} beyond the goal</span>` : ""}
      </div>
      <ul class="meters">${meters}</ul>
    </div>`;
  }

  function badgesHTML(t) {
    const milestones = [
      { at: 10, name: "First steps" },
      { at: 25, name: "Quarter way" },
      { at: 50, name: "Halfway" },
      { at: 75, name: "Almost there" },
      { at: 100, name: "Sanad family" }
    ].map(m => ({ medal: m.at, name: m.name, earned: t.done >= m.at, left: m.at - t.done }));
    const areas = D.domains.map(d => ({
      medal: `<span lang="ar">${d.ar.split(" ")[0]}</span>`,
      name: d.short + " complete",
      earned: t.by[d.id].done >= d.target,
      left: d.target - t.by[d.id].done
    }));
    const item = b => `<li class="badge${b.earned ? " is-earned" : ""}">
      <div class="medal">${b.medal}</div>
      <b>${esc(b.name)}</b>
      <span>${b.earned ? "Earned" : hoursLabel(b.left) + " to go"}</span>
    </li>`;
    return `<div class="panel">
      <h2>Badges</h2>
      <p class="panel-sub">Earned with approved hours.</p>
      <ul class="badges">${milestones.map(item).join("")}${areas.map(item).join("")}</ul>
    </div>`;
  }

  function viewPassport() {
    if (!state.family) return registerHTML();
    const fam = state.family;
    const t = tally(state.logs);
    const logs = state.logs.filter(l => l.status !== "rejected").sort((a, b) => b.date.localeCompare(a.date));
    const stamps = logs.length
      ? `<div class="stamp-grid">${logs.map(l => `
          <div class="stamp-item">
            ${stampHTML({ domain: l.domain, hours: l.hours, date: l.date, pending: l.status === "pending", seed: l.id })}
            <p>${esc(l.title)}<small>${fmtDate(l.date)}</small></p>
          </div>`).join("")}</div>`
      : `<div class="empty-state"><p>No stamps yet. Pick a challenge and submit a photo to collect your first one.</p><a class="btn btn-primary" href="#/challenges">Browse challenges</a></div>`;

    return `
    ${pageHead("جواز سند العائلي", familyLabel(fam.name) + " passport", esc(progressSentence(t)))}
    <section class="wrap">
      <div class="passport-layout">
        <div class="stack">${idPageHTML(fam)}${badgesHTML(t)}</div>
        ${progressPanelHTML(t)}
      </div>
      <div class="stamp-sheet">
        <div class="stamp-sheet-head">
          <div>
            <h2>Stamps</h2>
            <p class="panel-sub">One stamp per activity. Dashed stamps are waiting for the Sanad team to review.</p>
          </div>
          <a class="btn btn-primary btn-small" href="#/challenges">Add an activity</a>
        </div>
        ${stamps}
      </div>
    </section>`;
  }

  function loadSample() {
    const s = D.sampleFamily;
    state.family = { name: s.name, members: s.members.slice(), issued: "2026-09-01" };
    state.logs = s.logs.map(l => makeLog(activityById[l.activityId], {
      date: l.date, submitted: l.date, status: l.status, members: s.members.slice(), fileName: "Photo"
    }));
    saveState();
    render();
    showToast("Sample family loaded. Use Start over to clear it.");
  }

  /* ---------- Challenges ---------- */

  function activityCardHTML(a, count) {
    return `<article class="activity" data-domain="${a.domain}">
      <div class="activity-top">${chip(a.domain)}<span class="hours-tag">${hoursLabel(a.hours)}</span></div>
      <h3>${esc(a.name)}</h3>
      <p>${esc(a.description)}</p>
      <ul class="task-list" aria-label="What to do">${a.tasks.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
      ${a.link ? `<a class="activity-link" href="${a.link.href}">${esc(a.link.label)}</a>` : ""}
      <div class="activity-foot">
        ${count ? `<span class="done-count">Submitted ${count === 1 ? "once" : count + " times"}</span>` : "<span></span>"}
        <button class="btn btn-primary btn-small" type="button" data-action="submit-proof" data-activity="${a.id}">Submit proof</button>
      </div>
    </article>`;
  }

  function viewChallenges(arg) {
    const active = domainById[arg] ? arg : "";
    const list = D.activities.filter(a => !active || a.domain === active);
    const counts = {};
    state.logs.forEach(l => { if (l.status !== "rejected") counts[l.activityId] = (counts[l.activityId] || 0) + 1; });
    return `
    ${pageHead("التحديات والأنشطة", "Challenges", "Shared activities for the whole family. Repeat any of them as often as you like: each time you submit proof, the hours go towards your passport.")}
    <section class="wrap">
      <div class="filter-bar" role="group" aria-label="Filter by area">
        <button type="button" data-action="filter" data-domain="" aria-pressed="${!active}">All areas</button>
        ${D.domains.map(d => `<button type="button" data-action="filter" data-domain="${d.id}" aria-pressed="${active === d.id}"><span class="dot" style="background:${d.fill}"></span>${esc(d.name)}</button>`).join("")}
      </div>
      <div class="activity-grid">${list.map(a => activityCardHTML(a, counts[a.id] || 0)).join("")}</div>
    </section>`;
  }

  let pendingUpload = null; // { photo: dataURL|null, fileName, kind }

  function modalHead(title, pre) {
    return `<div class="modal-head">
      <div>${pre || ""}<h2 id="modal-title">${esc(title)}</h2></div>
      <button class="modal-close" type="button" data-action="close-modal" aria-label="Close">×</button>
    </div>`;
  }

  function needPassportHTML(what) {
    return `${modalHead("Create your passport first")}
    <div class="modal-body">
      <p>Your family needs a Sanad passport to ${what}. Setting it up takes a minute.</p>
      <div class="form-actions">
        <button class="btn btn-secondary" type="button" data-action="close-modal">Not now</button>
        <a class="btn btn-primary" href="#/passport">Create passport</a>
      </div>
    </div>`;
  }

  function uploadFieldHTML(label, hint, accept) {
    return `<div class="field">
      <span class="field-label">${label} <span class="hint">${hint}</span></span>
      <label class="upload">
        <input type="file" name="upload" accept="${accept}" data-upload>
        <span><strong>Choose a file</strong> or take a photo</span>
      </label>
      <div class="upload-preview" id="upload-preview"></div>
    </div>`;
  }

  function quizHTML(quiz) {
    return `<div class="quiz">
      <span class="field-label">Venue quiz</span>
      ${quiz.map((q, i) => `<fieldset data-q="${i}">
        <legend>${i + 1}. ${esc(q.q)}</legend>
        ${q.options.map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"> <span>${esc(o)}</span></label>`).join("")}
      </fieldset>`).join("")}
      <p class="quiz-result" id="quiz-result" aria-live="polite"></p>
    </div>`;
  }

  function openProof(activityId) {
    const a = activityById[activityId];
    if (!state.family) { openModal(needPassportHTML("submit activities")); return; }
    pendingUpload = null;
    openModal(`${modalHead(a.name, chip(a.domain))}
    <div class="modal-body">
      <form class="form" data-form="proof" data-activity="${a.id}" novalidate>
        <p class="muted">This adds ${hoursLabel(a.hours)} to your passport. The Sanad team checks your proof before the hours are approved.</p>
        <div class="field">
          <label for="p-date">When did you do it?</label>
          <input id="p-date" name="date" type="date" required value="${todayISO()}" max="${todayISO()}">
        </div>
        <fieldset class="field">
          <legend>Who took part?</legend>
          <div class="checks">${state.family.members.map(m => `<label><input type="checkbox" name="members" value="${esc(m)}" checked> ${esc(m)}</label>`).join("")}</div>
        </fieldset>
        ${uploadFieldHTML("Photo or short video", "Required as proof", "image/*,video/*")}
        ${a.quiz ? quizHTML(a.quiz) : ""}
        <div class="field">
          <label for="p-note">${esc(a.noteLabel || "Tell us about it")} <span class="hint">Optional</span></label>
          <textarea id="p-note" name="note" rows="3"></textarea>
        </div>
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
          <button class="btn btn-primary" type="submit">Submit proof</button>
        </div>
      </form>
    </div>`);
  }

  function markQuiz(input) {
    const form = input.form;
    const quiz = activityById[form.dataset.activity].quiz;
    const fs = input.closest("fieldset");
    const q = quiz[Number(fs.dataset.q)];
    fs.querySelectorAll("label").forEach((label, j) => {
      label.classList.toggle("is-right", j === q.answer);
      label.classList.toggle("is-wrong", j === Number(input.value) && j !== q.answer);
    });
    const answers = quiz.map((_, i) => form.querySelector(`input[name="q${i}"]:checked`));
    if (answers.every(Boolean)) {
      const right = answers.filter((el, i) => Number(el.value) === quiz[i].answer).length;
      document.getElementById("quiz-result").textContent = `${right} of ${quiz.length} correct.`;
    }
  }

  function shrinkImage(file, max) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("unreadable image")); };
      img.src = url;
    });
  }

  async function handleUpload(input) {
    const file = input.files && input.files[0];
    const box = document.getElementById("upload-preview");
    pendingUpload = null;
    if (!file) { box.innerHTML = ""; return; }
    if (file.type.startsWith("image/")) {
      try {
        const photo = await shrinkImage(file, 720);
        pendingUpload = { photo, fileName: file.name, kind: "photo" };
        box.innerHTML = `<img src="${photo}" alt=""><p>${esc(file.name)}</p>`;
      } catch (err) {
        pendingUpload = { photo: null, fileName: file.name, kind: "photo" };
        box.innerHTML = `<p>${esc(file.name)} is attached. This browser can't preview it.</p>`;
      }
    } else if (file.type.startsWith("video/")) {
      pendingUpload = { photo: null, fileName: file.name, kind: "video" };
      box.innerHTML = `<video src="${URL.createObjectURL(file)}" controls muted playsinline></video><p>${esc(file.name)}. In this demo only the file name is saved.</p>`;
    } else {
      box.innerHTML = "<p>Choose a photo or a video file.</p>";
    }
  }

  function showFormError(form, message) {
    const el = form.querySelector("#form-error");
    el.textContent = message;
    el.hidden = false;
  }

  /* ---------- Archive ---------- */

  function allStories() {
    return state.stories.concat(D.stories);
  }

  function storyCardHTML(s) {
    return `<article class="story" data-action="read-story" data-story="${s.id}">
      ${s.photo ? `<img class="story-photo" src="${s.photo}" alt="">` : `<span class="story-cover" aria-hidden="true">${esc(s.era)}</span>`}
      <div class="story-text">
        ${s.photo ? `<span class="story-era">${esc(s.era)}</span>` : ""}
        <h3>${esc(s.title)}</h3>
        <p>${esc(truncate(s.text[0], 150))}</p>
        <span class="story-by">Told by ${esc(s.teller)}${s.recorder ? `, recorded by ${esc(s.recorder)}` : ""}</span>
        <button class="link-btn" type="button" data-action="read-story" data-story="${s.id}">Read the story</button>
      </div>
    </article>`;
  }

  function viewArchive() {
    const stories = allStories();
    return `
    ${pageHead("الأرشيف العائلي", "Family archive", "Memories and family history from our grandparents, recorded by their children and grandchildren.")}
    <section class="wrap">
      <div class="section-head">
        <p class="muted">${stories.length} ${stories.length === 1 ? "story" : "stories"} so far</p>
        <button class="btn btn-primary" type="button" data-action="add-story">Add a story</button>
      </div>
      <div class="story-grid">${stories.map(storyCardHTML).join("")}</div>
    </section>`;
  }

  function openStory(id) {
    const s = allStories().find(x => x.id === id);
    if (!s) return;
    openModal(`${modalHead(s.title, `<span class="story-era">${esc(s.era)}</span>`)}
    <div class="modal-body story-full">
      ${s.photo ? `<img src="${s.photo}" alt="">` : ""}
      <div class="prose">${s.text.map(p => `<p>${esc(p)}</p>`).join("")}</div>
      <p class="story-by">Told by ${esc(s.teller)}${s.recorder ? `, recorded by ${esc(s.recorder)}` : ""}</p>
    </div>`);
  }

  function openStoryForm() {
    pendingUpload = null;
    const session = activityById["grandparents-stories"];
    const eras = ["Before 1950", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s or later"];
    openModal(`${modalHead("Add a story to the archive")}
    <div class="modal-body">
      <form class="form" data-form="story" novalidate>
        <div class="field">
          <label for="s-title">Story title</label>
          <input id="s-title" name="title" type="text" required placeholder="For example, The summer my father went to sea">
        </div>
        <div class="field">
          <label for="s-teller">Told by</label>
          <input id="s-teller" name="teller" type="text" required placeholder="For example, Grandmother Moza">
        </div>
        <div class="field">
          <label for="s-recorder">Recorded by <span class="hint">Optional</span></label>
          <input id="s-recorder" name="recorder" type="text" placeholder="For example, Ahmed, her grandson">
        </div>
        <div class="field">
          <label for="s-era">When is the story from?</label>
          <select id="s-era" name="era">${eras.map(e => `<option${e === "1970s" ? " selected" : ""}>${e}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="s-text">The story <span class="hint">Write it in their words. Leave a blank line between paragraphs.</span></label>
          <textarea id="s-text" name="story" rows="7" required></textarea>
        </div>
        ${uploadFieldHTML("Photo", "Optional. An old family photo works well.", "image/*")}
        ${state.family ? `<label class="check-row"><input type="checkbox" name="logIt" checked> <span>Count this as a ${esc(session.name)} (${hoursLabel(session.hours)}) in our passport</span></label>` : ""}
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
          <button class="btn btn-primary" type="submit">Add story</button>
        </div>
      </form>
    </div>`);
  }

  /* ---------- Events ---------- */

  function viewEvents() {
    return `
    ${pageHead("الفعاليات والتسجيل", "Events", "Volunteering and sports events for the whole family. Register as a group, and the hours go into your passport once the organizers confirm you attended.")}
    <section class="wrap">
      <ul class="event-list">${upcomingEvents().map(eventRowHTML).join("")}</ul>
      <p class="muted events-note">These are sample events. Dates and venues will be confirmed by the Sanad team.</p>
    </section>`;
  }

  function openEventForm(id) {
    const e = eventById[id];
    if (!state.family) { openModal(needPassportHTML("register for events")); return; }
    openModal(`${modalHead("Register for " + e.title, chip(e.domain, fmtDate(e.date, { weekday: "long", day: "numeric", month: "long" })))}
    <div class="modal-body">
      <form class="form" data-form="event" data-event="${e.id}" novalidate>
        <p class="muted">${esc(e.time)} at ${esc(e.location)}. Your family earns ${hoursLabel(e.hours)} once the organizers confirm you attended.</p>
        <div class="field">
          <label for="e-count">How many family members are coming?</label>
          <input id="e-count" name="participants" type="number" min="1" max="20" required value="${state.family.members.length}">
        </div>
        <div class="field">
          <label for="e-phone">Contact number <span class="hint">So the organizers can reach you on the day</span></label>
          <input id="e-phone" name="phone" type="tel" autocomplete="tel" placeholder="+974">
        </div>
        <div class="field">
          <label for="e-notes">Anything the organizers should know? <span class="hint">Optional</span></label>
          <textarea id="e-notes" name="notes" rows="2" placeholder="For example, a grandparent who uses a wheelchair"></textarea>
        </div>
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
          <button class="btn btn-primary" type="submit">Confirm registration</button>
        </div>
      </form>
    </div>`);
  }

  /* ---------- Admin ---------- */

  function adminData() {
    const reviews = state.reviews;
    const families = D.demoFamilies.map(f => {
      const hours = Object.assign({}, f.hours);
      D.demoPending.forEach(p => {
        if (p.familyId === f.id && reviews[p.id] === "verified") {
          const a = activityById[p.activityId];
          hours[a.domain] += a.hours;
        }
      });
      return { name: f.name, members: f.members, hours, last: f.last, you: false };
    });
    if (state.family) {
      const t = tally(state.logs);
      const hours = {};
      D.domains.forEach(d => { hours[d.id] = t.by[d.id].done; });
      const last = state.logs.reduce((m, l) => (l.date > m ? l.date : m), state.family.issued);
      families.push({ name: state.family.name, members: state.family.members.length, hours, last, you: true });
    }
    families.forEach(f => { f.total = Object.values(f.hours).reduce((s, n) => s + n, 0); });
    families.sort((a, b) => b.total - a.total);

    const pending = [];
    D.demoPending.forEach(p => {
      if (reviews[p.id]) return;
      const a = activityById[p.activityId];
      const fam = D.demoFamilies.find(f => f.id === p.familyId);
      pending.push({ id: p.id, family: fam.name, title: a.name, domain: a.domain, hours: a.hours, date: p.date, note: p.note, photo: null, proof: "Photo", you: false });
    });
    state.logs.forEach(l => {
      if (l.status !== "pending") return;
      pending.push({ id: l.id, family: state.family ? state.family.name : "", title: l.title, domain: l.domain, hours: l.hours, date: l.date, note: l.note, photo: l.photo, proof: l.fileName || "File", you: true });
    });
    pending.sort((a, b) => b.date.localeCompare(a.date));

    const counts = Object.assign({}, D.demoActivityCounts);
    state.logs.forEach(l => { if (l.status === "verified" && counts[l.activityId] != null) counts[l.activityId] += 1; });
    D.demoPending.forEach(p => { if (reviews[p.id] === "verified") counts[p.activityId] += 1; });

    return { families, pending, counts };
  }

  function barRow(label, value, max, unit, domainId) {
    const pct = Math.max(1, value / max * 100);
    return `<li class="bar-row"${domainId ? ` data-domain="${domainId}"` : ""} title="${esc(label)}: ${value} ${unit}">
      <span class="label">${domainId ? chip(domainId, label) : esc(label)}</span>
      <span class="bar-track"><span class="bar-fill" style="display:block;width:${pct}%"></span></span>
      <span class="value">${value}</span>
    </li>`;
  }

  function viewAdmin() {
    const { families, pending, counts } = adminData();
    const totalHours = families.reduce((s, f) => s + f.total, 0);
    const people = families.reduce((s, f) => s + f.members, 0);
    const reached = families.filter(f => f.total >= D.goalHours).length;
    const byArea = D.domains.map(d => ({ d, v: families.reduce((s, f) => s + f.hours[d.id], 0) }));
    const maxArea = Math.max(1, ...byArea.map(x => x.v));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxTop = Math.max(1, ...top.map(x => x[1]));
    const completed = Object.values(counts).reduce((s, n) => s + n, 0);

    const kpi = (label, value, sub) => `<div class="kpi"><span>${label}</span><b>${value}</b><small>${sub}</small></div>`;

    const pendingRows = pending.length ? pending.map(p => `<tr>
        <td>${esc(familyLabel(p.family))}${p.you ? '<span class="you">You</span>' : ""}</td>
        <td>${chip(p.domain, p.title)}${p.note ? `<div class="muted" style="font-size:.875rem;margin-top:4px">${esc(truncate(p.note, 80))}</div>` : ""}</td>
        <td class="num">${p.hours}</td>
        <td>${fmtDate(p.date)}</td>
        <td>${p.photo ? `<img class="thumb" src="${p.photo}" alt="Proof photo">` : `<span class="muted">${esc(truncate(p.proof, 24))}</span>`}</td>
        <td><div class="row-actions">
          <button class="btn btn-secondary" type="button" data-action="review" data-id="${p.id}" data-decision="rejected">Reject</button>
          <button class="btn btn-primary" type="button" data-action="review" data-id="${p.id}" data-decision="verified">Approve</button>
        </div></td>
      </tr>`).join("")
      : `<tr><td colspan="6" class="muted">Nothing waiting for review.</td></tr>`;

    const familyRows = families.map(f => `<tr>
        <td>${esc(familyLabel(f.name))}${f.you ? '<span class="you">You</span>' : ""}</td>
        <td class="num">${f.members}</td>
        <td class="num">${f.total}</td>
        <td><div class="mini-track"><div class="mini-fill" style="width:${Math.min(100, f.total / D.goalHours * 100)}%"></div></div></td>
        <td>${fmtDate(f.last)}</td>
        <td><span class="status${f.total >= D.goalHours ? " is-done" : ""}">${f.total >= D.goalHours ? "Reached 100 hours" : "In progress"}</span></td>
      </tr>`).join("");

    const eventRows = D.events.map(e => {
      const reg = state.registrations[e.id];
      const taken = e.registered + (reg ? 1 : 0);
      let yours = '<span class="muted">Not registered</span>';
      if (reg && reg.attended) yours = `<span class="status is-done">Attended, ${hoursLabel(e.hours)} added</span>`;
      else if (reg) yours = `<button class="btn btn-secondary btn-small" type="button" data-action="confirm-attendance" data-event="${e.id}">Confirm attendance</button>`;
      return `<tr>
        <td>${esc(e.title)}</td>
        <td>${fmtDate(e.date)}</td>
        <td class="num">${taken} of ${e.capacity}</td>
        <td><div class="mini-track"><div class="mini-fill" style="width:${Math.min(100, taken / e.capacity * 100)}%;background:var(--gold)"></div></div></td>
        <td>${state.family ? yours : '<span class="muted">No passport yet</span>'}</td>
      </tr>`;
    }).join("");

    return `
    ${pageHead("لوحة التحكم", "Admin dashboard", "Follow participating families, review submitted activities and track the initiative's success indicators.")}
    <section class="wrap">
      <div class="admin-note">
        <span>Demo view with sample families. In the live version this page sits behind a team login.</span>
        <button class="link-btn" type="button" data-action="reset-demo">Reset demo data</button>
      </div>

      <div class="kpis">
        ${kpi("Families taking part", families.length, `${people} people`)}
        ${kpi("Approved hours", totalHours, `${Math.round(totalHours / families.length)} per family on average`)}
        ${kpi("Reached 100 hours", reached, `${Math.round(reached / families.length * 100)}% of families`)}
        ${kpi("Waiting for review", pending.length, pending.length ? "Submissions to check" : "All caught up")}
      </div>

      <div class="two-col">
        <div class="panel">
          <h2>Approved hours by area</h2>
          <p class="panel-sub">All families combined</p>
          <ul class="bars">${byArea.map(x => barRow(x.d.name, x.v, maxArea, "hours", x.d.id)).join("")}</ul>
        </div>
        <div class="panel">
          <h2>Most completed challenges</h2>
          <p class="panel-sub">${completed} activities completed so far</p>
          <ul class="bars bars-neutral">${top.map(([id, n]) => barRow(activityById[id].name, n, maxTop, "times")).join("")}</ul>
        </div>
      </div>

      <div class="panel panel-gap" id="review">
        <h2>Waiting for review</h2>
        <p class="panel-sub">Check the proof, then approve it to add the hours to the family's passport.</p>
        <div class="table-scroll"><table class="table">
          <thead><tr><th>Family</th><th>Challenge</th><th class="num">Hours</th><th>Date</th><th>Proof</th><th><span class="visually-hidden">Actions</span></th></tr></thead>
          <tbody>${pendingRows}</tbody>
        </table></div>
      </div>

      <div class="panel panel-gap">
        <h2>Families</h2>
        <p class="panel-sub">Sorted by approved hours</p>
        <div class="table-scroll"><table class="table">
          <thead><tr><th>Family</th><th class="num">Members</th><th class="num">Hours</th><th>Progress to 100</th><th>Last activity</th><th>Status</th></tr></thead>
          <tbody>${familyRows}</tbody>
        </table></div>
      </div>

      <div class="panel panel-gap">
        <h2>Event registrations</h2>
        <p class="panel-sub">Confirm attendance to add the event hours to a family's passport.</p>
        <div class="table-scroll"><table class="table">
          <thead><tr><th>Event</th><th>Date</th><th class="num">Families</th><th>Capacity</th><th>Your family</th></tr></thead>
          <tbody>${eventRows}</tbody>
        </table></div>
      </div>
    </section>`;
  }

  /* ---------- Modal, toast, nav ---------- */

  function openModal(html) {
    modal.innerHTML = html;
    if (!modal.open) modal.showModal();
  }

  function closeModal() {
    if (modal.open) modal.close();
  }

  modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  modal.addEventListener("close", () => { modal.innerHTML = ""; pendingUpload = null; });

  let toastTimer = null;
  function showToast(message, href, linkText) {
    toastEl.innerHTML = esc(message) + (href ? `<a href="${href}">${esc(linkText)}</a>` : "");
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 5000);
  }

  function setNav(open) {
    const nav = document.getElementById("site-nav");
    const btn = document.querySelector(".nav-toggle");
    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.textContent = open ? "Close" : "Menu";
  }

  /* ---------- Actions ---------- */

  const actions = {
    "skip": () => main.focus(),
    "toggle-nav": () => setNav(!document.getElementById("site-nav").classList.contains("is-open")),
    "close-modal": closeModal,
    "load-sample": loadSample,
    "edit-family": () => openModal(`${modalHead("Edit family")}
      <div class="modal-body"><form class="form" data-form="editFamily" novalidate>
        ${familyFieldsHTML(state.family)}
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>
          <button class="btn btn-primary" type="submit">Save changes</button>
        </div>
      </form></div>`),
    "reset-family": () => {
      if (!confirm("Start over? This removes your family, stamps and event registrations from this browser.")) return;
      state.family = null;
      state.logs = [];
      state.registrations = {};
      saveState();
      render();
    },
    "filter": ds => {
      history.replaceState(null, "", ds.domain ? "#/challenges/" + ds.domain : "#/challenges");
      render(true);
    },
    "submit-proof": ds => openProof(ds.activity),
    "read-story": ds => openStory(ds.story),
    "add-story": openStoryForm,
    "register-event": ds => openEventForm(ds.event),
    "cancel-event": ds => {
      delete state.registrations[ds.event];
      saveState();
      render(true);
      showToast("Registration cancelled.");
    },
    "review": ds => {
      const log = state.logs.find(l => l.id === ds.id);
      if (log) log.status = ds.decision;
      else state.reviews[ds.id] = ds.decision;
      saveState();
      render(true);
      showToast(ds.decision === "verified"
        ? "Approved. The hours now count towards the family's passport."
        : "Rejected. The hours were not added.");
    },
    "confirm-attendance": ds => {
      const e = eventById[ds.event];
      const reg = state.registrations[e.id];
      reg.attended = true;
      state.logs.push(makeLog(activityById["national-event"], {
        title: e.title, domain: e.domain, hours: e.hours, date: e.date, status: "verified", eventId: e.id
      }));
      saveState();
      render(true);
      showToast(`Attendance confirmed. ${hoursLabel(e.hours)} added to your passport.`);
    },
    "reset-demo": () => {
      if (!confirm("Reset the demo? This clears everything saved in this browser.")) return;
      state = blankState();
      saveState();
      render();
      showToast("Demo data cleared.");
    }
  };

  const forms = {
    register(form) {
      const name = field(form, "familyName").replace(/\s+family$/i, "");
      const members = parseMembers(field(form, "members"));
      if (!name || !members.length) { showFormError(form, "Add your family name and at least one member."); return; }
      state.family = { name, members, issued: todayISO() };
      saveState();
      render();
      showToast(`Passport created for the ${familyLabel(name)}.`);
    },

    editFamily(form) {
      const name = field(form, "familyName").replace(/\s+family$/i, "");
      const members = parseMembers(field(form, "members"));
      if (!name || !members.length) { showFormError(form, "Add your family name and at least one member."); return; }
      state.family.name = name;
      state.family.members = members;
      saveState();
      closeModal();
      render(true);
      showToast("Family details saved.");
    },

    proof(form) {
      const a = activityById[form.dataset.activity];
      const members = Array.from(form.querySelectorAll('input[name="members"]:checked')).map(i => i.value);
      const date = field(form, "date");
      if (!date) return showFormError(form, "Choose the date you did the activity.");
      if (!members.length) return showFormError(form, "Tick at least one family member who took part.");
      if (!pendingUpload) return showFormError(form, "Add a photo or short video as proof.");
      if (a.quiz && a.quiz.some((q, i) => !form.querySelector(`input[name="q${i}"]:checked`))) {
        return showFormError(form, "Answer all three quiz questions.");
      }
      state.logs.push(makeLog(a, {
        date, members, note: field(form, "note"),
        photo: pendingUpload.photo, fileName: pendingUpload.fileName
      }));
      saveState();
      closeModal();
      render(true);
      showToast(`Submitted. ${hoursLabel(a.hours)} added to your passport, waiting for review.`, "#/passport", "View passport");
    },

    story(form) {
      const title = field(form, "title");
      const teller = field(form, "teller");
      const text = field(form, "story");
      if (!title || !teller || !text) return showFormError(form, "Add a title, who told the story, and the story itself.");
      const photo = pendingUpload ? pendingUpload.photo : null;
      state.stories.unshift({
        id: "u-" + uid(), title, teller,
        recorder: field(form, "recorder"),
        era: field(form, "era"),
        text: text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean),
        photo, added: todayISO()
      });
      const logIt = form.elements.namedItem("logIt");
      const session = activityById["grandparents-stories"];
      if (logIt && logIt.checked) {
        state.logs.push(makeLog(session, {
          note: "Archive story: " + title, photo,
          fileName: pendingUpload ? pendingUpload.fileName : "Archive story",
          members: state.family.members.slice()
        }));
      }
      saveState();
      closeModal();
      render(true);
      showToast(logIt && logIt.checked
        ? `Story added. ${hoursLabel(session.hours)} sent for review.`
        : "Story added to the archive.");
    },

    event(form) {
      const e = eventById[form.dataset.event];
      const participants = parseInt(field(form, "participants"), 10);
      if (!participants || participants < 1) return showFormError(form, "Enter how many family members are coming.");
      state.registrations[e.id] = {
        participants, phone: field(form, "phone"), notes: field(form, "notes"),
        at: todayISO(), attended: false
      };
      saveState();
      closeModal();
      render(true);
      showToast(`You're registered for ${e.title}.`);
    }
  };

  /* ---------- Wiring ---------- */

  document.addEventListener("click", e => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const fn = actions[target.dataset.action];
    if (!fn) return;
    e.preventDefault();
    fn(target.dataset, target);
  });

  document.addEventListener("submit", e => {
    const form = e.target.closest("form[data-form]");
    if (!form || !forms[form.dataset.form]) return;
    e.preventDefault();
    forms[form.dataset.form](form);
  });

  document.addEventListener("change", e => {
    if (e.target.matches("input[data-upload]")) handleUpload(e.target);
    else if (e.target.matches(".quiz input[type=radio]")) markQuiz(e.target);
  });

  window.addEventListener("hashchange", () => {
    if (location.hash === "#main") return;
    closeModal();
    setNav(false);
    render();
    main.focus({ preventScroll: true });
  });

  render();
})();
