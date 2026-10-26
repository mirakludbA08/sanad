# Sanad Family Passport | جواز سند العائلي

The website for **Sanad (سند)**, a youth-led community initiative in Qatar that strengthens family bonds and social participation. Families get a digital "Sanad Family Passport" and work towards **100 hours of shared activities** across four areas: kinship ties, national identity, volunteering, and health and skills.

The site opens in **Arabic** (right to left) and switches to **English** with the button at the top. A link ending in `?lang=en` opens it straight in English: https://mirakludba08.github.io/sanad/?lang=en

**Live site:** https://mirakludba08.github.io/sanad/

> **Status: demo version.** Every page and feature works, including family accounts with usernames and passwords, but there is no server yet. Accounts and everything families enter are saved on the device they use, so two families on the same laptop or phone can each sign in and compete on the leaderboard, but an account made on one phone isn't visible on another. See [What the live version still needs](#what-the-live-version-still-needs).

---

## Contents

1. [About the initiative](#about-the-initiative)
2. [What the website does](#what-the-website-does)
3. [Challenges and hours](#challenges-and-hours)
4. [Sample events](#sample-events)
5. [Presenting the demo](#presenting-the-demo)
6. [Publishing on GitHub Pages](#publishing-on-github-pages)
7. [Editing the content](#editing-the-content)
8. [Project structure](#project-structure)
9. [Design](#design)
10. [What the live version still needs](#what-the-live-version-still-needs)
11. [Things for the team to confirm](#things-for-the-team-to-confirm)
12. [Credits](#credits)

---

## About the initiative

**Name:** Sanad (سند). The word means support: the person you lean on, and who leans on you.

**The idea:** Busy schedules and screens leave families less time together, and children grow up with fewer chances to hear their grandparents' stories. Sanad turns time together into a goal. Each family receives a digital Sanad Family Passport and completes shared challenges in four areas. Every activity adds a stamp and hours to the passport, until the family reaches 100 hours.

**Goals**

- Strengthen the bond between generations through regular, meaningful time together.
- Root children in Qatari identity, heritage and values.
- Make volunteering and community service a family habit.
- Encourage active, screen-free time and new practical skills.
- Preserve elders' memories in a family archive for future generations.

**Vision:** A society where every family is a *sanad* for its members and for its community.

**The four areas** (25 suggested hours each, 100 in total)

| Area | Arabic | Focus |
|---|---|---|
| Kinship ties | صلة الرحم | Time with grandparents, gatherings, reconnecting with relatives |
| National identity | الهوية الوطنية | Museums, recipes, proverbs and heritage stories |
| Volunteering | التطوع | Family volunteering, donations, community events |
| Health & skills | الصحة والمهارات | Walks and sport, screen-free days, hands-on skills |

**Success indicators** (tracked on the admin dashboard)

- Families taking part, and how many members join in
- Approved hours, in total and per area
- Families reaching 100 hours
- Community reach: event registrations, volunteering hours, stories added to the archive

---

## What the website does

The site covers every feature in the original brief.

| Requested feature | Where it is | What works in the demo |
|---|---|---|
| About Us page | `#/about` | The idea, goals, vision and success indicators |
| Digital Sanad Passport | `#/passport` | Family accounts (username and password), a passport-style ID page, points and rank, a 100-cell hour grid, progress per area, badges and a stamp for every activity |
| Points and leaderboard | `#/leaderboard` | Every family's points, ranking, approved hours per area and completed areas, with a podium for the top three |
| Challenges & Activities | `#/challenges` | 12 challenge cards (name, area, hours, tasks), filter by area, **Submit proof** with photo/video upload, a quiz for the landmarks challenge |
| Digital Archive | `#/archive` | Grandparents' stories with photos; families can add a story and count it as a storytelling session |
| Events & Registration | `#/events` | Upcoming family events, capacity, register a family group, cancel |
| Admin Dashboard | `#/admin` | Behind an admin sign-in (the **Admin** tab on the sign-in page). Headline indicators, hours by area, most completed challenges, review queue (approve/reject) for every family, families ranked by points with a CSV download for Excel, adding new events, and confirming attendance |
| Arabic and English | every page | Arabic by default with a full right-to-left layout; one click switches every page to English |

**How a family's hours flow**

1. A family creates its account (family name, members, username and password).
2. They pick a challenge and click **Submit proof**, uploading a photo or short video.
3. The hours appear straight away as a dashed stamp marked *In review*.
4. The Sanad team approves it on the admin dashboard and the stamp becomes solid.
5. Badges unlock at 10, 25, 50, 75 and 100 approved hours, and when an area reaches 25 hours.

Event hours work the same way: the family registers, and the hours are added when the team confirms attendance on the admin dashboard.

**Points** (set in `points` at the top of `assets/js/data.js`)

| How | Points |
|---|---|
| Each approved hour | 10 |
| Completing an area (25 approved hours in it) | 100 bonus |
| Reaching 100 approved hours | 250 bonus |

Only approved hours count, so the team's review decides the points. The leaderboard shows the sample families too, marked "Sample"; set `showSampleFamilies: false` in `data.js` to hide them.

**Accounts:** usernames are 3 to 20 letters, numbers, dots or underscores, and must be unique. Passwords need at least 6 characters and are never stored, only a salted PBKDF2 hash. The **Open the sample family** button signs in to a ready-made family for presentations.

---

## Challenges and hours

The hours below are placeholders for the team to confirm. All challenges can be repeated.

| Challenge | Area | Hours |
|---|---|---|
| Weekly Family Gathering | Kinship ties | 3 |
| Grandparents' Storytelling Session | Kinship ties | 4 |
| Digital Family Tree | Kinship ties | 5 |
| Cultural Landmarks Tour (with a 3-question quiz) | National identity | 4 |
| Traditional Recipe Challenge | National identity | 3 |
| Qatari Proverbs & Heritage Stories | National identity | 2 |
| Volunteer Family Challenge | Volunteering | Family logs actual hours, up to 10 |
| Giving Back Initiative | Volunteering | Family logs actual hours, up to 8 |
| National Event Participation | Volunteering | 6 |
| Family Walk & Sports Challenge | Health & skills | Family logs actual hours, up to 6 |
| Screen-Free Day | Health & skills | 6 |
| Hands-On Skill Workshop | Health & skills | 3 |

Each challenge's description and task list is in `assets/js/data.js`.

---

## Sample events

These are placeholders. Dates and venues need to be confirmed by the team.

| Date | Event | Area | Venue | Hours |
|---|---|---|---|---|
| Fri 6 Nov 2026 | Family Beach Cleanup | Volunteering | Al Wakrah Beach | 3 |
| Sat 14 Nov 2026 | Family Walk at Aspire Park | Health | Aspire Park | 2 |
| Fri 20 Nov 2026 | Heritage Morning at Katara | Heritage | Katara Cultural Village | 3 |
| Sat 28 Nov 2026 | Community Meal Packing | Volunteering | To be confirmed | 3 |
| Fri 11 Dec 2026 | National Day Family Volunteering | Volunteering | Darb Al Saai | 4 |

---

## Presenting the demo

A two-minute walkthrough that shows every feature:

1. **Home (in Arabic):** the poster tagline, the four areas and how it works. Click **English** at the top to show the switch, then switch back.
2. **Create an account:** sign up a family with a username and password.
3. **Challenges:** open **Cultural Landmarks Tour**, upload any photo, answer the quiz and submit.
4. **Admin dashboard:** sign in on the **Admin** tab of the sign-in page with the team's admin username and password. The submission is in the review queue with its photo. Click **Approve**.
5. **Leaderboard:** the family now has points and a rank among the other families.
6. **Second family:** sign out, then click **Open the sample family** (37 hours, 11 stamps) to show a passport further along.
7. **Family archive:** open a story, then show **Add a story**.

To start fresh before presenting, use **Reset demo data** on the admin dashboard. It clears every account on that browser.

Tip: open the site on a phone too. It's fully responsive, and on a phone **Submit proof** lets families take the photo directly.

---

## Publishing on GitHub Pages

This repository is already published at https://mirakludba08.github.io/sanad/. The steps below are for setting it up again in another account, such as the initiative's own GitHub account.

No build step is needed: the site is plain HTML, CSS and JavaScript.

1. Sign in to GitHub and create a **new public repository**, for example `sanad-website`. (GitHub Pages on a free account needs a public repository.)
2. On the new repository page, click **uploading an existing file**.
3. Open the `sanad-website` folder on your computer, select **everything inside it** (`index.html`, the `assets` folder, `README.md` and `.nojekyll`) and drag it into the upload area. Upload the contents, not the folder itself, so that `index.html` sits at the top level of the repository.
4. Click **Commit changes**.
5. Go to **Settings → Pages**. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose the `main` branch and the `/ (root)` folder, and click **Save**.
6. Wait a minute or two, then refresh the page. GitHub shows the address, usually `https://YOUR-GITHUB-USERNAME.github.io/sanad-website/`.
7. Paste that address at the top of this README.

`.nojekyll` is an empty file that tells GitHub Pages to serve the files as they are. If Windows hides it or it doesn't upload, the site still works without it.

To update the site later, upload the changed files to the repository again. GitHub Pages redeploys automatically.

**Testing on your computer:** double-click `index.html` to open it in a browser. Everything works this way, except that passwords use a simpler hash because browsers only allow the secure PBKDF2 hash on `https` pages.

---

## Editing the content

| What to change | File |
|---|---|
| Challenges (names, descriptions, tasks, hours), areas, events, sample stories, sample families on the dashboard, the quiz | `assets/js/data.js`. Each English field has an Arabic twin ending in `Ar` (for example `name` and `nameAr`) |
| The 100-hour goal, points, showing sample families | `goalHours`, `points` and `showSampleFamilies` at the top of `assets/js/data.js` |
| Every button, heading and message in the interface, in both languages | the `STR` table near the top of `assets/js/app.js` (`en` and `ar`) |
| Admin username and password | `ADMIN` in `assets/js/app.js`. The username is plain text; the password is stored only as a hash. To change it, open the site, press F12, run `sanadAdminHash("new password")` in the Console, and paste the two results into `ADMIN.hash` |
| The "Website by" credit and footer text | `index.html` |
| Colors and fonts | the `:root` block at the top of `assets/css/style.css` |
| Logo | `assets/img/logo.png` (maroon) and `assets/img/logo-gold.png` (gold, used on the passport cover and footer) |

---

## Project structure

```
sanad-website/
├── index.html            Page shell: header, footer, links to styles and scripts
├── README.md             This file
├── .nojekyll             Tells GitHub Pages to serve files as they are
└── assets/
    ├── css/style.css     All styles
    ├── js/data.js        All content: areas, challenges, events, stories, sample data
    ├── js/app.js         The app: pages, passport logic, forms, admin dashboard
    └── img/
        ├── logo.png      Sanad logo, maroon, transparent background
        └── logo-gold.png Sanad logo, gold, transparent background
```

**Technical notes**

- A single-page app with hash routes (`#/passport`, `#/events`, ...), so it works on GitHub Pages and from a local file with no server configuration.
- Data is stored in the browser's `localStorage` under the key `sanad-demo-v2`: every family account, its activities and registrations, stories and team-added events. The signed-in family and the language choice are stored separately. Uploaded photos are resized to 720 px before saving. For videos, only the file name is kept.
- No frameworks or build tools. The only external resource is Google Fonts (Reem Kufi, Aref Ruqaa, IBM Plex Sans Arabic and IBM Plex Mono). Without internet the site falls back to system fonts.
- Works in current versions of Chrome, Safari, Edge and Firefox, on desktop and mobile.

---

## Design

- **Look and feel:** adapted from the Sanad poster: warm plaster walls in golden-hour light, palm-leaf shadows, maroon circle icons with cream line drawings, fine tapered rules and a woven Sadu border.
- **Photos:** all photography comes from the Sanad poster (`assets/img/area-*.jpg`, `photo-*.jpg`, `lantern.jpg`). Replace them with the team's own photos at any time, keeping the same file names.
- **Colors:** maroon `#7D1530`, deep maroon `#4C0B1C`, plaster `#F3EADC`, gold `#B8894F`, foil gold `#E6C796` and sunlight `#F4D7A6`.
- **Area colors:** kinship `#A12A4A`, national identity `#B37F2A`, volunteering `#3F8A5F`, health `#4A73B0`. These were checked for color-blind separation and contrast, and every chart labels the areas by name as well.
- **Icons:** the four area icons are drawn in code after the poster's icons (family, dhow and minaret, hands holding a sprout, heart with a pulse and gear), so they stay sharp at any size.
- **Typefaces:** Reem Kufi, a geometric Kufi, for Arabic headings, in the style of the Qatari institutions' posters. Aref Ruqaa, a calligraphic Ruqaa that echoes the logo, for the tagline and the four area titles. IBM Plex Sans Arabic for body text in both languages, and IBM Plex Mono only for the machine-readable lines on the passport page.
- **The passport:** a maroon booklet with the gold logo and a Sadu band on the home page, a passport-style ID page, and ink stamps for each activity.
- Accessible basics: keyboard focus styles, labelled forms, reduced-motion support, and text contrast that meets WCAG AA.

---

## What the live version still needs

The demo shows how everything works. To run it for real with many families, the next phase needs:

1. **A shared database** so family accounts, points and the leaderboard work across every phone and computer, not just one device.
2. **File storage** for proof photos, videos and archive stories.
3. **A server-checked admin login**, plus roles for reviewers. The demo's admin sign-in is checked in the browser, so it keeps casual visitors out but anyone who reads the code could get around it.
4. **Password reset** by email or phone.
5. **Notifications** by email or WhatsApp when hours are approved or an event is coming up.
6. **An interactive digital family tree** for the Digital Family Tree challenge.
7. **Audio and video recordings** of grandparents' stories in the archive.
8. **Privacy and consent:** a privacy notice, and parental consent for photos of children.
9. **A custom domain** (optional), for example `sanad.qa`.

A hosted backend such as Supabase or Firebase covers items 1 to 4 without running a server, and the site can stay on GitHub Pages. In the code, only the "Saved state" and "Accounts" sections of `assets/js/app.js` need to change.

---

## Things for the team to confirm

- [ ] Hours for each challenge, and whether each area should have a 25-hour target
- [ ] Points: 10 per approved hour, 100 per completed area, 250 for the full passport
- [ ] Arabic wording across the site (written for this demo)
- [ ] A stronger admin password before real use
- [ ] Real event dates, venues and partners
- [ ] Real grandparents' stories to replace the three samples
- [ ] About page wording (written from the brief as a draft)
- [ ] Quiz questions and answers for the Cultural Landmarks Tour
- [ ] Team names, partner logos and contact details to add to the site

---

## Credits

- Initiative: the Sanad team
- Website design and development: AbdulKarim Tahir
- Logo: Sanad initiative
