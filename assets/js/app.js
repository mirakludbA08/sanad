/*
  Sanad Family Passport — demo app.
  A small single-page app with hash routes (#/passport, #/events, ...), in Arabic
  (the default) and English. There is no server: family accounts and everything
  they enter are saved in the browser (localStorage), so the site runs as-is on
  GitHub Pages. To share accounts across devices, replace the "Saved state" and
  "Accounts" sections with calls to a hosted database such as Supabase.
*/
(function () {
  "use strict";

  const D = window.SANAD;
  const STORE_KEY = "sanad-demo-v2";
  const SESSION_KEY = "sanad-session-v2";
  const ADMIN_KEY = "sanad-admin-v1";
  const LANG_KEY = "sanad-lang";
  const domainById = Object.fromEntries(D.domains.map(d => [d.id, d]));
  const activityById = Object.fromEntries(D.activities.map(a => [a.id, a]));

  const main = document.getElementById("main");
  const modal = document.getElementById("modal");
  const toastEl = document.getElementById("toast");

  /* ---------- Language ---------- */

  let lang = loadLang();

  // Arabic by default. A link ending in ?lang=en (or ?lang=ar) sets the language and remembers it.
  function loadLang() {
    const asked = new URLSearchParams(location.search).get("lang");
    try {
      if (asked === "en" || asked === "ar") localStorage.setItem(LANG_KEY, asked);
      return localStorage.getItem(LANG_KEY) === "en" ? "en" : "ar";
    } catch (e) {
      return asked === "en" ? "en" : "ar";
    }
  }

  const otherLang = () => (lang === "ar" ? "en" : "ar");

  // Interface text. Content (challenges, events, stories) lives in data.js with "Ar" fields.
  const STR = {
    en: {
      "nav.about": "About", "nav.passport": "Passport", "nav.challenges": "Challenges", "nav.leaderboard": "Leaderboard",
      "nav.archive": "Archive", "nav.events": "Events", "brandSub": "Family Passport",
      "menu": "Menu", "close": "Close", "skip": "Skip to content",
      "lang.label": "العربية", "lang.short": "ع", "lang.aria": "التبديل إلى العربية",
      "pill.signin": "Sign in", "pill.signinShort": "Sign in", "pts": "pts",
      "footer.blurb": "Sanad is a youth-led community initiative that brings families in Qatar closer through 100 hours of shared activities.",
      "footer.about": "About Sanad", "footer.challenges": "Challenges", "footer.events": "Events", "footer.leaderboard": "Leaderboard",
      "footer.admin": "Admin dashboard", "footer.demo": "This is a demo version. Everything you enter is saved only on this device.",
      "footer.credit": "Website by",
      "cancel": "Cancel", "optional": "Optional",

      "home.h1": "100 hours that bring a family closer.",
      "home.lede": "Every family gets a digital passport. Do activities together across four areas of family and community life, collect a stamp for each one, and work towards 100 shared hours.",
      "home.ctaOpen": "Open your passport", "home.ctaCreate": "Create a family account", "home.ctaBrowse": "Browse challenges",
      "areas.title": "Four areas, 25 hours each",
      "areas.text": "Every challenge belongs to one area. A balanced passport has about 25 hours in each.",
      "areas.meta": "{n} challenges, {h}",
      "how.title": "How the passport works",
      "how.s1t": "Create your account", "how.s1": "Register your family and add everyone taking part, from grandparents to grandchildren.",
      "how.s2t": "Pick a challenge", "how.s2": "Choose from {n} shared activities, or sign up for a family event.",
      "how.s3t": "Submit proof", "how.s3": "Upload a photo or short video. The Sanad team reviews it and approves your hours.",
      "how.s4t": "Collect stamps and points", "how.s4": "Each activity adds a stamp and points to your passport. Families who reach 100 hours earn the Sanad badge.",
      "band.accent": "Family archive",
      "band.title": "Every grandparent has a story worth keeping",
      "band.text": "The family archive keeps our elders' memories for the next generation. Record a story with your grandparents and it counts towards your passport.",
      "band.cta": "Visit the family archive", "band.recorded": "{teller}, recorded by {recorder}",
      "upcoming.title": "Upcoming family events",
      "upcoming.text": "Register as a family group. Hours are added once the organizers confirm you attended.",
      "upcoming.all": "All events",

      "ev.forPassport": "{h} for your passport", "ev.capacity": "{n} of {cap} families registered",
      "ev.registered": "Registered, {people}", "ev.cancel": "Cancel registration", "ev.full": "Event full", "ev.register": "Register family",
      "events.title": "Events",
      "events.text": "Volunteering and sports events for the whole family. Register as a group, and the hours go into your passport once the organizers confirm you attended.",
      "events.note": "These are sample events. Dates and venues will be confirmed by the Sanad team.",

      "about.title": "About Sanad",
      "about.text": "A youth-led initiative that strengthens family bonds and social participation in Qatar through one shared goal: 100 hours of activities, done together.",
      "about.meaning": "<span lang=\"ar\">سند</span> means support: the person you lean on, and who leans on you.",
      "about.ideaTitle": "The idea",
      "about.idea1": "Busy schedules and screens leave families less time together, and children grow up with fewer chances to hear their grandparents' stories. Sanad turns time together into a goal the whole family works towards.",
      "about.idea2": "Each family receives a digital Sanad Family Passport. Together they complete challenges in four areas: kinship ties, national identity, volunteering, and health and skills. Every activity adds a stamp and hours to the passport, until the family reaches 100 hours.",
      "about.goalsTitle": "Our goals",
      "about.goal1": "Strengthen the bond between generations through regular, meaningful time together.",
      "about.goal2": "Root children in Qatari identity, heritage and values.",
      "about.goal3": "Make volunteering and community service a family habit.",
      "about.goal4": "Encourage active, screen-free time and new practical skills.",
      "about.goal5": "Preserve our elders' memories in a family archive for future generations.",
      "about.visionTitle": "Our vision", "about.vision": "A society where every family is a sanad for its members and for its community.",
      "about.areasTitle": "The four areas",
      "about.measureTitle": "How we measure success", "about.measureText": "The admin dashboard follows these indicators as families take part.",
      "about.viewDash": "View the dashboard",
      "about.ind1t": "Families taking part", "about.ind1": "Registered families and how many members join in.",
      "about.ind2t": "Shared hours", "about.ind2": "Approved hours, in total and in each of the four areas.",
      "about.ind3t": "Families reaching 100 hours", "about.ind3": "How many families complete their passport.",
      "about.ind4t": "Community reach", "about.ind4": "Event registrations, volunteering hours and stories added to the archive.",

      "auth.signinTitle": "Sign in to your family passport", "auth.joinTitle": "Create your family account",
      "auth.signinText": "Each family has its own account, passport and points.",
      "auth.joinText": "One account per family. Your passport records every activity you complete together and the points you earn.",
      "auth.tabSignin": "Sign in", "auth.tabJoin": "Create an account",
      "auth.username": "Username", "auth.usernameHint": "3 to 20 letters, numbers, dots or underscores", "auth.usernamePh": "For example, alkuwari",
      "auth.password": "Password", "auth.passwordHint": "At least 6 characters", "auth.password2": "Repeat password",
      "auth.submitSignin": "Sign in", "auth.submitJoin": "Create family account",
      "auth.samplePre": "Presenting Sanad?", "auth.sampleBtn": "Open the sample family", "auth.samplePost": "to show a passport that already has stamps and points.",
      "auth.device": "Demo version: accounts are saved on this device only.",
      "auth.tabAdmin": "Admin", "auth.adminTitle": "Admin sign in",
      "auth.adminText": "For the Sanad team: review submitted activities, manage events and follow the indicators.",
      "auth.submitAdmin": "Sign in as admin",
      "auth.adminNote": "Demo version: admin sign-in is checked in the browser. A live version should check it on a server.",
      "err.admin": "That admin username and password don't match.",
      "toast.adminIn": "Signed in as admin.", "toast.adminOut": "Signed out of the admin dashboard.",
      "admin.signedIn": "Signed in as admin ({user})", "admin.signout": "Sign out of admin", "nav.admin": "Admin",
      "fam.name": "Family name", "fam.namePh": "For example, Al-Kuwari", "fam.members": "Who is taking part?",
      "fam.membersHint": "One name per line, or separated by commas", "fam.membersPh": "Grandmother Moza\nAhmed\nMaryam",
      "err.famFields": "Add your family name and at least one member.",
      "err.username": "Choose a username of 3 to 20 letters, numbers, dots or underscores.",
      "err.taken": "That username is already taken. Choose another one.",
      "err.password": "Use a password of at least 6 characters.", "err.match": "The two passwords don't match.",
      "err.signin": "That username and password don't match.", "err.secure": "Open the site from its web address to sign in.",
      "toast.created": "Welcome to Sanad, {family}.", "toast.welcome": "Welcome back, {family}.", "toast.signedOut": "Signed out.",
      "toast.sample": "Signed in as the sample {family}.", "toast.saved": "Family details saved.",
      "familyOf": "{name} family",

      "pass.title": "{family} passport", "pass.famName": "Family name", "pass.no": "Passport no.", "pass.members": "Members",
      "pass.issued": "Issued", "pass.goal": "Goal", "pass.goalVal": "{n} shared hours",
      "pass.edit": "Edit family", "pass.signout": "Sign out", "pass.signedAs": "Signed in as",
      "points.unit": "points", "points.rankOf": "of {families}",
      "points.hours": "{h} approved × {p}", "points.areas": "{n} of {t} areas completed × {p}", "points.bonus": "100-hour passport bonus",
      "points.pending": "{p} more once the Sanad team approves your {h} in review.", "points.board": "See the leaderboard",
      "progress.title": "Progress", "progress.of": "of {n} hours", "progress.aria": "{d} approved hours and {p} in review, out of {g}",
      "key.done": "Approved", "key.pending": "In review", "key.empty": "To go", "progress.extra": "Plus {h} beyond the goal",
      "meter": "{n} of {t} h",
      "badges.title": "Badges", "badges.sub": "Earned with approved hours.",
      "badge.10": "First steps", "badge.25": "Quarter way", "badge.50": "Halfway", "badge.75": "Almost there", "badge.100": "Sanad family",
      "badge.area": "{area} complete", "badge.earned": "Earned", "badge.toGo": "{h} to go",
      "stamps.title": "Stamps", "stamps.sub": "One stamp per activity. Dashed stamps are waiting for the Sanad team to review.",
      "stamps.empty": "No stamps yet. Pick a challenge and submit a photo to collect your first one.",
      "stamps.add": "Add an activity", "stamps.browse": "Browse challenges", "stamp.review": "In review",
      "sentence.zero": "Your passport is ready. Complete a challenge to collect your first stamp.",
      "sentence.done": "You've reached 100 approved hours. Congratulations, you're a Sanad family.",
      "sentence.left": "{h} to go.", "sentence.all": "You've logged 100 hours.",
      "sentence.pending": "{h} waiting for the Sanad team to review.",

      "ch.title": "Challenges",
      "ch.text": "Shared activities for the whole family. Repeat any of them as often as you like: each time you submit proof, the hours go towards your passport.",
      "ch.all": "All areas", "ch.filterAria": "Filter by area", "ch.aim": "Aim for {h}", "ch.tasksAria": "What to do",
      "ch.submit": "Submit proof", "ch.once": "Submitted once", "ch.times": "Submitted {n} times", "ch.upTo": "Up to {h}",
      "proof.intro": "This adds {h} to your passport. The Sanad team checks your proof before the hours are approved.",
      "proof.introFlex": "Log the time you actually spent, up to {h}. The Sanad team checks your proof before the hours are approved.",
      "proof.date": "When did you do it?", "proof.who": "Who took part?", "proof.hours": "How many hours did it take?",
      "proof.file": "Photo or short video", "proof.fileHint": "Required as proof", "proof.note": "Tell us about it", "proof.submit": "Submit proof",
      "upload.choose": "Choose a file", "upload.or": "or take a photo",
      "upload.noPreview": "{f} is attached. This browser can't preview it.", "upload.video": "{f}. In this demo only the file name is saved.",
      "upload.wrong": "Choose a photo or a video file.",
      "quiz.title": "Venue quiz", "quiz.result": "{n} of {t} correct.",
      "err.date": "Choose the date you did the activity.", "err.who": "Tick at least one family member who took part.",
      "err.file": "Add a photo or short video as proof.", "err.quiz": "Answer all three quiz questions.", "err.hours": "Enter between 1 and {max} hours.",
      "toast.submitted": "Submitted. {h} added to your passport, waiting for review.", "toast.view": "View passport",
      "need.title": "Sign in first", "need.text": "Sign in or create a family account to {what}.",
      "need.submit": "submit activities", "need.register": "register for events",
      "need.signin": "Sign in", "need.join": "Create an account", "need.notNow": "Not now",

      "arch.title": "Family archive", "arch.text": "Memories and family history from our grandparents, recorded by their children and grandchildren.",
      "arch.count": "{n} stories so far", "arch.countOne": "1 story so far", "arch.add": "Add a story",
      "arch.told": "Told by {teller}", "arch.recorded": ", recorded by {recorder}", "arch.read": "Read the story",
      "sf.title": "Add a story to the archive", "sf.storyTitle": "Story title", "sf.titlePh": "For example, The summer my father went to sea",
      "sf.teller": "Told by", "sf.tellerPh": "For example, Grandmother Moza", "sf.recorder": "Recorded by", "sf.recorderPh": "For example, Ahmed, her grandson",
      "sf.era": "When is the story from?", "sf.text": "The story", "sf.textHint": "Write it in their words. Leave a blank line between paragraphs.",
      "sf.photo": "Photo", "sf.photoHint": "Optional. An old family photo works well.",
      "sf.logIt": "Count this as a {activity} ({h}) in our passport", "sf.submit": "Add story",
      "err.story": "Add a title, who told the story, and the story itself.",
      "toast.story": "Story added to the archive.", "toast.storyLogged": "Story added. {h} sent for review.",

      "evf.title": "Register for {event}", "evf.intro": "{time} at {location}. Your family earns {h} once the organizers confirm you attended.",
      "evf.count": "How many family members are coming?", "evf.phone": "Contact number", "evf.phoneHint": "So the organizers can reach you on the day",
      "evf.notes": "Anything the organizers should know?", "evf.notesPh": "For example, a grandparent who uses a wheelchair",
      "evf.submit": "Confirm registration", "err.count": "Enter how many family members are coming.",
      "toast.registered": "You're registered for {event}.", "toast.cancelled": "Registration cancelled.",
      "edit.title": "Edit family", "edit.save": "Save changes",

      "lb.title": "Family leaderboard",
      "lb.text": "Families earn points for every approved hour, plus bonuses for completing an area and the whole passport.",
      "lb.how": "How points work", "lb.r1": "for each approved hour", "lb.r2": "for each completed area", "lb.r3": "at 100 approved hours",
      "lb.tableTitle": "All families", "lb.empty": "No families yet. Be the first family to join Sanad.", "lb.emptyCta": "Create a family account",
      "lb.note": "Families with accounts on this device, plus sample families for the demo.",
      "th.rank": "Rank", "th.family": "Family", "th.points": "Points", "th.areasDone": "Areas completed", "th.hours": "Approved hours",
      "tag.you": "You", "tag.sample": "Sample",

      "admin.title": "Admin dashboard",
      "admin.text": "Follow participating families, review submitted activities and track the initiative's success indicators.",
      "admin.note": "Demo view. In the live version this page sits behind a team login.", "admin.reset": "Reset demo data",
      "kpi.families": "Families taking part", "kpi.hours": "Approved hours", "kpi.avg": "{n} per family on average",
      "kpi.reached": "Reached 100 hours", "kpi.share": "{n}% of families", "kpi.pending": "Waiting for review",
      "kpi.toCheck": "Submissions to check", "kpi.caught": "All caught up",
      "panel.byArea": "Approved hours by area", "panel.byAreaSub": "All families combined",
      "panel.top": "Most completed challenges", "panel.topSub": "{n} activities completed so far",
      "review.title": "Waiting for review", "review.sub": "Check the proof, then approve it to add the hours to the family's passport.",
      "th.challenge": "Challenge", "th.date": "Date", "th.proof": "Proof", "th.actions": "Actions",
      "review.reject": "Reject", "review.approve": "Approve", "review.none": "Nothing waiting for review.",
      "proof.photo": "Photo", "proof.fileWord": "File",
      "fams.title": "Families", "fams.sub": "Ranked by points", "fams.export": "Download CSV",
      "th.members": "Members", "th.progress": "Progress to 100", "th.last": "Last activity", "th.status": "Status",
      "status.done": "Reached 100 hours", "status.progress": "In progress",
      "evadm.title": "Events and registrations", "evadm.sub": "Add new events, and confirm attendance to add the hours to a family's passport.",
      "evadm.add": "Add an event", "th.event": "Event", "th.capacity": "Families", "th.siteFams": "Families on this site",
      "evadm.confirm": "Confirm attendance", "evadm.attended": "Attended", "evadm.none": "None yet", "evadm.delete": "Delete",
      "ae.title": "Add an event", "ae.titleEn": "Event name in English", "ae.titleAr": "Event name in Arabic", "ae.area": "Area",
      "ae.date": "Date", "ae.time": "Time", "ae.timePh": "For example, 4:00 to 6:00 pm", "ae.location": "Venue",
      "ae.hours": "Hours for the passport", "ae.capacity": "Number of families", "ae.desc": "Description", "ae.submit": "Add event",
      "err.event": "Add the event name, date and venue.",
      "toast.eventAdded": "Event added.", "toast.eventDeleted": "Event deleted.", "confirm.deleteEvent": "Delete this event?",
      "toast.approved": "Approved. The hours now count towards the family's passport.", "toast.rejected": "Rejected. The hours were not added.",
      "toast.attended": "Attendance confirmed. {h} added to the {family} passport.",
      "confirm.reset": "Reset the demo? This clears everything saved in this browser, including family accounts.",
      "toast.reset": "Demo data cleared.", "toast.storage": "This browser's storage is full, so photos weren't kept.",
      "toast.exported": "Families downloaded as a CSV file."
    },

    ar: {
      "nav.about": "عن سند", "nav.passport": "الجواز", "nav.challenges": "التحديات", "nav.leaderboard": "لوحة الشرف",
      "nav.archive": "الأرشيف", "nav.events": "الفعاليات", "brandSub": "جواز العائلة",
      "menu": "القائمة", "close": "إغلاق", "skip": "انتقل إلى المحتوى",
      "lang.label": "English", "lang.short": "EN", "lang.aria": "Switch to English",
      "pill.signin": "تسجيل الدخول", "pill.signinShort": "دخول", "pts": "نقطة",
      "footer.blurb": "سند مبادرة شبابية مجتمعية تقرّب العائلات في قطر من خلال 100 ساعة من الأنشطة المشتركة.",
      "footer.about": "عن سند", "footer.challenges": "التحديات", "footer.events": "الفعاليات", "footer.leaderboard": "لوحة الشرف",
      "footer.admin": "لوحة التحكم", "footer.demo": "هذه نسخة تجريبية، وكل ما تُدخله يُحفظ على هذا الجهاز فقط.",
      "footer.credit": "تصميم الموقع:",
      "cancel": "إلغاء", "optional": "اختياري",

      "home.h1": "100 ساعة تقرّب العائلة أكثر.",
      "home.lede": "لكل عائلة جواز رقمي. أنجزوا معًا أنشطة في أربعة محاور من حياة الأسرة والمجتمع، واجمعوا ختمًا عن كل نشاط، حتى تصلوا إلى 100 ساعة مشتركة.",
      "home.ctaOpen": "افتح جواز عائلتك", "home.ctaCreate": "أنشئ حساب العائلة", "home.ctaBrowse": "تصفّح التحديات",
      "areas.title": "أربعة محاور، 25 ساعة لكل محور",
      "areas.text": "ينتمي كل تحدٍّ إلى محور واحد، والجواز المتوازن فيه نحو 25 ساعة في كل محور.",
      "areas.meta": "{n} تحديات، {h}",
      "how.title": "كيف يعمل الجواز",
      "how.s1t": "أنشئوا حساب العائلة", "how.s1": "سجّلوا عائلتكم وأضيفوا كل من سيشارك، من الأجداد إلى الأحفاد.",
      "how.s2t": "اختاروا تحديًا", "how.s2": "اختاروا من بين {n} نشاطًا مشتركًا، أو سجّلوا في فعالية عائلية.",
      "how.s3t": "أرسلوا الإثبات", "how.s3": "ارفعوا صورة أو مقطعًا قصيرًا، ويراجعه فريق سند ليعتمد ساعاتكم.",
      "how.s4t": "اجمعوا الأختام والنقاط", "how.s4": "كل نشاط يضيف ختمًا ونقاطًا إلى جوازكم، والعائلات التي تبلغ 100 ساعة تنال وسام سند.",
      "band.accent": "الأرشيف العائلي",
      "band.title": "لكل جدٍّ وجدّة حكاية تستحق أن تُحفظ",
      "band.text": "يحفظ الأرشيف العائلي ذكريات كبارنا للأجيال القادمة. سجّلوا حكاية مع أجدادكم، وستُحتسب في جوازكم.",
      "band.cta": "زوروا الأرشيف العائلي", "band.recorded": "{teller}، وسجّلها {recorder}",
      "upcoming.title": "الفعاليات القادمة",
      "upcoming.text": "سجّلوا عائلتكم كمجموعة، وتُضاف الساعات بعد أن يؤكد المنظمون حضوركم.",
      "upcoming.all": "كل الفعاليات",

      "ev.forPassport": "{h} في جوازكم", "ev.capacity": "{n} من {cap} عائلة مسجّلة",
      "ev.registered": "تم التسجيل، {people}", "ev.cancel": "إلغاء التسجيل", "ev.full": "اكتمل العدد", "ev.register": "سجّل العائلة",
      "events.title": "الفعاليات والتسجيل",
      "events.text": "فعاليات تطوعية ورياضية للعائلة كلها. سجّلوا كمجموعة، وتُضاف الساعات إلى جوازكم بعد أن يؤكد المنظمون حضوركم.",
      "events.note": "هذه فعاليات تجريبية، وسيؤكد فريق سند المواعيد والأماكن.",

      "about.title": "عن سند",
      "about.text": "مبادرة شبابية تعزّز الروابط الأسرية والمشاركة المجتمعية في قطر من خلال هدف واحد مشترك: 100 ساعة من الأنشطة نقضيها معًا.",
      "about.meaning": "<b>السند</b> هو من تستند إليه، ويستند إليك.",
      "about.ideaTitle": "الفكرة",
      "about.idea1": "انشغالات الحياة والشاشات قلّلت الوقت الذي تقضيه العائلات معًا، وصار الأطفال يكبرون بفرص أقل لسماع حكايات أجدادهم. يحوّل سند الوقت المشترك إلى هدف تعمل عليه العائلة كلها.",
      "about.idea2": "تحصل كل عائلة على جواز سند العائلي الرقمي، وتنجز معًا تحديات في أربعة محاور: صلة الرحم، والهوية الوطنية، والتطوع، والصحة والمهارات. كل نشاط يضيف ختمًا وساعات إلى الجواز، حتى تبلغ العائلة 100 ساعة.",
      "about.goalsTitle": "أهدافنا",
      "about.goal1": "تقوية الروابط بين الأجيال من خلال وقت منتظم وهادف نقضيه معًا.",
      "about.goal2": "ترسيخ الهوية القطرية وقيمها وتراثها لدى الأبناء.",
      "about.goal3": "جعل التطوع وخدمة المجتمع عادة عائلية.",
      "about.goal4": "تشجيع النشاط البدني والوقت بعيدًا عن الشاشات واكتساب مهارات عملية جديدة.",
      "about.goal5": "حفظ ذكريات كبارنا في أرشيف عائلي للأجيال القادمة.",
      "about.visionTitle": "رؤيتنا", "about.vision": "مجتمع تكون فيه كل عائلة سندًا لأفرادها ولمجتمعها.",
      "about.areasTitle": "المحاور الأربعة",
      "about.measureTitle": "كيف نقيس النجاح", "about.measureText": "تتابع لوحة التحكم هذه المؤشرات مع مشاركة العائلات.",
      "about.viewDash": "عرض لوحة التحكم",
      "about.ind1t": "العائلات المشاركة", "about.ind1": "عدد العائلات المسجّلة وعدد أفرادها المشاركين.",
      "about.ind2t": "الساعات المشتركة", "about.ind2": "الساعات المعتمدة إجمالًا وفي كل محور من المحاور الأربعة.",
      "about.ind3t": "العائلات التي بلغت 100 ساعة", "about.ind3": "عدد العائلات التي أكملت جوازها.",
      "about.ind4t": "الأثر المجتمعي", "about.ind4": "التسجيل في الفعاليات، وساعات التطوع، والحكايات المضافة إلى الأرشيف.",

      "auth.signinTitle": "الدخول إلى جواز عائلتك", "auth.joinTitle": "أنشئ حساب العائلة",
      "auth.signinText": "لكل عائلة حسابها وجوازها ونقاطها.",
      "auth.joinText": "حساب واحد لكل عائلة، يسجّل جوازه كل نشاط تنجزونه معًا والنقاط التي تكسبونها.",
      "auth.tabSignin": "تسجيل الدخول", "auth.tabJoin": "إنشاء حساب",
      "auth.username": "اسم المستخدم", "auth.usernameHint": "من 3 إلى 20 حرفًا إنجليزيًا أو رقمًا أو نقطة أو شرطة سفلية", "auth.usernamePh": "alkuwari",
      "auth.password": "كلمة المرور", "auth.passwordHint": "6 أحرف على الأقل", "auth.password2": "أعد كتابة كلمة المرور",
      "auth.submitSignin": "تسجيل الدخول", "auth.submitJoin": "إنشاء حساب العائلة",
      "auth.samplePre": "تقدّم عرضًا عن سند؟", "auth.sampleBtn": "افتح العائلة التجريبية", "auth.samplePost": "لعرض جواز فيه أختام ونقاط.",
      "auth.device": "نسخة تجريبية: الحسابات محفوظة على هذا الجهاز فقط.",
      "auth.tabAdmin": "المشرف", "auth.adminTitle": "دخول المشرف",
      "auth.adminText": "لفريق سند: مراجعة الأنشطة المرسلة، وإدارة الفعاليات، ومتابعة المؤشرات.",
      "auth.submitAdmin": "الدخول كمشرف",
      "auth.adminNote": "نسخة تجريبية: يتم التحقق من دخول المشرف داخل المتصفح، وينبغي في النسخة الفعلية التحقق منه عبر خادم.",
      "err.admin": "اسم المستخدم أو كلمة المرور الخاصة بالمشرف غير صحيحة.",
      "toast.adminIn": "تم الدخول كمشرف.", "toast.adminOut": "تم الخروج من لوحة التحكم.",
      "admin.signedIn": "مسجّل الدخول كمشرف ({user})", "admin.signout": "خروج المشرف", "nav.admin": "لوحة التحكم",
      "fam.name": "اسم العائلة", "fam.namePh": "مثلًا: الكواري", "fam.members": "من سيشارك؟",
      "fam.membersHint": "اسم في كل سطر، أو افصل بينها بفواصل", "fam.membersPh": "الجدة موزة\nأحمد\nمريم",
      "err.famFields": "أضف اسم العائلة وفردًا واحدًا على الأقل.",
      "err.username": "اختر اسم مستخدم من 3 إلى 20 حرفًا إنجليزيًا أو رقمًا أو نقطة أو شرطة سفلية.",
      "err.taken": "اسم المستخدم هذا محجوز. اختر اسمًا آخر.",
      "err.password": "يجب ألا تقل كلمة المرور عن 6 أحرف.", "err.match": "كلمتا المرور غير متطابقتين.",
      "err.signin": "اسم المستخدم أو كلمة المرور غير صحيحة.", "err.secure": "افتح الموقع من عنوانه على الإنترنت لتسجيل الدخول.",
      "toast.created": "أهلًا بكم في سند، {family}.", "toast.welcome": "أهلًا بعودتكم، {family}.", "toast.signedOut": "تم تسجيل الخروج.",
      "toast.sample": "تم الدخول إلى {family} التجريبية.", "toast.saved": "تم حفظ بيانات العائلة.",
      "familyOf": "عائلة {name}",

      "pass.title": "جواز {family}", "pass.famName": "اسم العائلة", "pass.no": "رقم الجواز", "pass.members": "الأفراد",
      "pass.issued": "تاريخ الإصدار", "pass.goal": "الهدف", "pass.goalVal": "{n} ساعة مشتركة",
      "pass.edit": "تعديل بيانات العائلة", "pass.signout": "تسجيل الخروج", "pass.signedAs": "اسم المستخدم",
      "points.unit": "نقطة", "points.rankOf": "من {families}",
      "points.hours": "{h} معتمدة × {p}", "points.areas": "{n} من {t} محاور مكتملة × {p}", "points.bonus": "مكافأة إكمال 100 ساعة",
      "points.pending": "ستحصلون على {p} إضافية عند اعتماد الساعات قيد المراجعة ({h}).", "points.board": "عرض لوحة الشرف",
      "progress.title": "التقدّم", "progress.of": "من {n} ساعة", "progress.aria": "{d} ساعة معتمدة و{p} قيد المراجعة من أصل {g}",
      "key.done": "معتمدة", "key.pending": "قيد المراجعة", "key.empty": "متبقية", "progress.extra": "و{h} فوق الهدف",
      "meter": "{n} من {t} س",
      "badges.title": "الأوسمة", "badges.sub": "تُكتسب بالساعات المعتمدة.",
      "badge.10": "الخطوة الأولى", "badge.25": "ربع الطريق", "badge.50": "منتصف الطريق", "badge.75": "على وشك الوصول", "badge.100": "عائلة سند",
      "badge.area": "إتمام {area}", "badge.earned": "مكتسب", "badge.toGo": "متبقٍّ {h}",
      "stamps.title": "الأختام", "stamps.sub": "ختم لكل نشاط، والأختام المنقّطة بانتظار مراجعة فريق سند.",
      "stamps.empty": "لا توجد أختام بعد. اختاروا تحديًا وأرسلوا صورة لتحصلوا على أول ختم.",
      "stamps.add": "أضف نشاطًا", "stamps.browse": "تصفّح التحديات", "stamp.review": "قيد المراجعة",
      "sentence.zero": "جوازكم جاهز. أنجزوا تحديًا لتحصلوا على أول ختم.",
      "sentence.done": "بلغتم 100 ساعة معتمدة. مبارك، أنتم عائلة سند!",
      "sentence.left": "متبقٍّ {h}.", "sentence.all": "سجّلتم 100 ساعة.",
      "sentence.pending": "{h} بانتظار مراجعة فريق سند.",

      "ch.title": "التحديات والأنشطة",
      "ch.text": "أنشطة مشتركة للعائلة كلها. كرّروا أيًّا منها كما تشاؤون، ففي كل مرة ترسلون فيها إثباتًا تُضاف الساعات إلى جوازكم.",
      "ch.all": "كل المحاور", "ch.filterAria": "تصفية حسب المحور", "ch.aim": "الهدف {h}", "ch.tasksAria": "المطلوب",
      "ch.submit": "أرسل الإثبات", "ch.once": "أُرسل مرة واحدة", "ch.times": "عدد مرات الإرسال: {n}", "ch.upTo": "حتى {h}",
      "proof.intro": "يضيف هذا النشاط {h} إلى جوازكم، ويراجع فريق سند الإثبات قبل اعتماد الساعات.",
      "proof.introFlex": "سجّلوا الوقت الذي قضيتموه فعلًا، حتى {h}. يراجع فريق سند الإثبات قبل اعتماد الساعات.",
      "proof.date": "متى أنجزتموه؟", "proof.who": "من شارك؟", "proof.hours": "كم ساعة استغرق؟",
      "proof.file": "صورة أو مقطع قصير", "proof.fileHint": "مطلوب كإثبات", "proof.note": "حدّثونا عنه", "proof.submit": "أرسل الإثبات",
      "upload.choose": "اختر ملفًا", "upload.or": "أو التقط صورة",
      "upload.noPreview": "تم إرفاق {f}، لكن هذا المتصفح لا يستطيع عرضه.", "upload.video": "{f}. في هذه النسخة التجريبية يُحفظ اسم الملف فقط.",
      "upload.wrong": "اختر صورة أو مقطع فيديو.",
      "quiz.title": "اختبار المكان", "quiz.result": "{n} من {t} إجابات صحيحة.",
      "err.date": "اختر تاريخ النشاط.", "err.who": "حدّد فردًا واحدًا على الأقل شارك في النشاط.",
      "err.file": "أضف صورة أو مقطعًا قصيرًا كإثبات.", "err.quiz": "أجب عن أسئلة الاختبار الثلاثة.", "err.hours": "أدخل عدد ساعات بين 1 و{max}.",
      "toast.submitted": "تم الإرسال، وأُضيفت {h} إلى جوازكم بانتظار المراجعة.", "toast.view": "عرض الجواز",
      "need.title": "سجّلوا الدخول أولًا", "need.text": "سجّلوا الدخول أو أنشئوا حساب العائلة {what}.",
      "need.submit": "لإرسال الأنشطة", "need.register": "للتسجيل في الفعاليات",
      "need.signin": "تسجيل الدخول", "need.join": "إنشاء حساب", "need.notNow": "ليس الآن",

      "arch.title": "الأرشيف العائلي", "arch.text": "ذكريات أجدادنا وتاريخ عائلاتنا، يسجّلها الأبناء والأحفاد.",
      "arch.count": "عدد الحكايات: {n}", "arch.countOne": "عدد الحكايات: 1", "arch.add": "أضف حكاية",
      "arch.told": "يرويها {teller}", "arch.recorded": "، وسجّلها {recorder}", "arch.read": "اقرأ الحكاية",
      "sf.title": "أضف حكاية إلى الأرشيف", "sf.storyTitle": "عنوان الحكاية", "sf.titlePh": "مثلًا: الصيف الذي ذهب فيه أبي إلى البحر",
      "sf.teller": "الراوي", "sf.tellerPh": "مثلًا: الجدة موزة", "sf.recorder": "من سجّلها", "sf.recorderPh": "مثلًا: أحمد، حفيدها",
      "sf.era": "إلى أي زمن تعود الحكاية؟", "sf.text": "الحكاية", "sf.textHint": "اكتبوها بكلماتهم، واتركوا سطرًا فارغًا بين الفقرات.",
      "sf.photo": "صورة", "sf.photoHint": "اختياري. الصور العائلية القديمة مناسبة جدًا.",
      "sf.logIt": "احتسبوها {activity} ({h}) في جوازنا", "sf.submit": "أضف الحكاية",
      "err.story": "أضف عنوانًا واسم الراوي والحكاية نفسها.",
      "toast.story": "أُضيفت الحكاية إلى الأرشيف.", "toast.storyLogged": "أُضيفت الحكاية، وأُرسلت {h} للمراجعة.",

      "evf.title": "التسجيل في {event}", "evf.intro": "{time}، {location}. تحصل عائلتكم على {h} بعد أن يؤكد المنظمون حضوركم.",
      "evf.count": "كم فردًا من العائلة سيحضر؟", "evf.phone": "رقم التواصل", "evf.phoneHint": "ليتمكن المنظمون من التواصل معكم يوم الفعالية",
      "evf.notes": "هل هناك ما ينبغي أن يعرفه المنظمون؟", "evf.notesPh": "مثلًا: أحد الأجداد يستخدم كرسيًا متحركًا",
      "evf.submit": "تأكيد التسجيل", "err.count": "أدخل عدد أفراد العائلة الحاضرين.",
      "toast.registered": "تم تسجيلكم في {event}.", "toast.cancelled": "تم إلغاء التسجيل.",
      "edit.title": "تعديل بيانات العائلة", "edit.save": "حفظ التغييرات",

      "lb.title": "لوحة الشرف",
      "lb.text": "تكسب العائلات نقاطًا عن كل ساعة معتمدة، مع مكافآت عند إكمال كل محور وعند إكمال الجواز.",
      "lb.how": "كيف تُحتسب النقاط", "lb.r1": "لكل ساعة معتمدة", "lb.r2": "عند إكمال كل محور", "lb.r3": "عند بلوغ 100 ساعة معتمدة",
      "lb.tableTitle": "ترتيب العائلات", "lb.empty": "لا توجد عائلات بعد. كونوا أول عائلة تنضم إلى سند.", "lb.emptyCta": "أنشئ حساب العائلة",
      "lb.note": "تظهر هنا العائلات المسجّلة على هذا الجهاز، إضافة إلى عائلات تجريبية للعرض.",
      "th.rank": "المركز", "th.family": "العائلة", "th.points": "النقاط", "th.areasDone": "المحاور المكتملة", "th.hours": "الساعات المعتمدة",
      "tag.you": "أنتم", "tag.sample": "تجريبية",

      "admin.title": "لوحة التحكم",
      "admin.text": "تابعوا العائلات المشاركة، وراجعوا الأنشطة المرسلة، وراقبوا مؤشرات نجاح المبادرة.",
      "admin.note": "عرض تجريبي. في النسخة الفعلية تكون هذه الصفحة محمية بدخول خاص بالفريق.", "admin.reset": "مسح البيانات التجريبية",
      "kpi.families": "العائلات المشاركة", "kpi.hours": "الساعات المعتمدة", "kpi.avg": "بمعدل {n} ساعة لكل عائلة",
      "kpi.reached": "بلغت 100 ساعة", "kpi.share": "{n}% من العائلات", "kpi.pending": "بانتظار المراجعة",
      "kpi.toCheck": "إرسالات تحتاج إلى مراجعة", "kpi.caught": "لا يوجد ما ينتظر",
      "panel.byArea": "الساعات المعتمدة حسب المحور", "panel.byAreaSub": "لجميع العائلات",
      "panel.top": "أكثر التحديات إنجازًا", "panel.topSub": "عدد الأنشطة المنجزة: {n}",
      "review.title": "بانتظار المراجعة", "review.sub": "راجعوا الإثبات، ثم اعتمدوه لإضافة الساعات إلى جواز العائلة.",
      "th.challenge": "التحدي", "th.date": "التاريخ", "th.proof": "الإثبات", "th.actions": "الإجراءات",
      "review.reject": "رفض", "review.approve": "اعتماد", "review.none": "لا يوجد ما ينتظر المراجعة.",
      "proof.photo": "صورة", "proof.fileWord": "ملف",
      "fams.title": "العائلات", "fams.sub": "مرتبة حسب النقاط", "fams.export": "تنزيل ملف CSV",
      "th.members": "الأفراد", "th.progress": "التقدّم نحو 100", "th.last": "آخر نشاط", "th.status": "الحالة",
      "status.done": "بلغت 100 ساعة", "status.progress": "قيد التقدّم",
      "evadm.title": "الفعاليات والتسجيل", "evadm.sub": "أضيفوا فعاليات جديدة، وأكّدوا حضور العائلات لإضافة الساعات إلى جوازاتها.",
      "evadm.add": "أضف فعالية", "th.event": "الفعالية", "th.capacity": "العائلات", "th.siteFams": "عائلات هذا الموقع",
      "evadm.confirm": "تأكيد الحضور", "evadm.attended": "حضرت", "evadm.none": "لا أحد بعد", "evadm.delete": "حذف",
      "ae.title": "أضف فعالية", "ae.titleEn": "اسم الفعالية بالإنجليزية", "ae.titleAr": "اسم الفعالية بالعربية", "ae.area": "المحور",
      "ae.date": "التاريخ", "ae.time": "الوقت", "ae.timePh": "مثلًا: 4:00 – 6:00 مساءً", "ae.location": "المكان",
      "ae.hours": "الساعات في الجواز", "ae.capacity": "عدد العائلات", "ae.desc": "الوصف", "ae.submit": "أضف الفعالية",
      "err.event": "أضف اسم الفعالية والتاريخ والمكان.",
      "toast.eventAdded": "أُضيفت الفعالية.", "toast.eventDeleted": "حُذفت الفعالية.", "confirm.deleteEvent": "هل تريد حذف هذه الفعالية؟",
      "toast.approved": "تم الاعتماد، وأُضيفت الساعات إلى جواز العائلة.", "toast.rejected": "تم الرفض، ولم تُضف الساعات.",
      "toast.attended": "تم تأكيد الحضور، وأُضيفت {h} إلى جواز {family}.",
      "confirm.reset": "هل تريد مسح البيانات التجريبية؟ سيُحذف كل ما حُفظ في هذا المتصفح، بما في ذلك حسابات العائلات.",
      "toast.reset": "تم مسح البيانات التجريبية.", "toast.storage": "مساحة التخزين في هذا المتصفح ممتلئة، لذلك لم تُحفظ الصور.",
      "toast.exported": "تم تنزيل ملف العائلات."
    }
  };

  function t(key, vars, lng) {
    let s = STR[lng || lang][key];
    if (s == null) s = STR.en[key];
    if (s == null) return key;
    return vars ? s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? "" : vars[k])) : s;
  }

  // Pick the Arabic version of a content field (e.g. nameAr) when Arabic is on.
  const L = (obj, key) => (lang === "ar" && obj && obj[key + "Ar"] != null ? obj[key + "Ar"] : obj[key]);
  const locale = () => (lang === "ar" ? "ar-u-nu-latn" : "en-GB");

  /* ---------- Saved state ---------- */

  // Every family account on this device, keyed by id. Stories and team-added events are shared.
  function blankState() {
    return { families: {}, stories: [], reviews: {}, events: [] };
  }

  let state = loadState();
  let sessionId = loadSession();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) return Object.assign(blankState(), JSON.parse(raw));
    } catch (e) { /* storage blocked: keep everything in memory */ }
    return blankState();
  }

  function loadSession() {
    try { return localStorage.getItem(SESSION_KEY); } catch (e) { return null; }
  }

  function setSession(id) {
    sessionId = id;
    try {
      if (id) localStorage.setItem(SESSION_KEY, id);
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) { /* memory only */ }
  }

  const families = () => Object.values(state.families);
  const me = () => (sessionId && state.families[sessionId]) || null;
  const myLogs = () => (me() ? me().logs : []);
  const myRegs = () => (me() ? me().registrations : {});

  function saveState() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (e) {
      // Usually the browser's storage is full of photos: keep the data, drop the photos.
      families().forEach(f => f.logs.forEach(l => { l.photo = null; }));
      state.stories.forEach(s => { s.photo = null; });
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e2) { /* memory only */ }
      showToast(t("toast.storage"));
    }
  }

  /* ---------- Helpers ---------- */

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ESC[c]);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const truncate = (s, n) => (s.length > n ? s.slice(0, n).replace(/\s+\S*$/, "") + "…" : s);
  const fmtNum = n => Number(n).toLocaleString("en-US");

  // Arabic counted nouns: 1, 2, 3–10 and 11+ each take a different form.
  function arCount(n, one, two, few, many) {
    if (n === 1) return one;
    if (n === 2) return two;
    const r = n % 100;
    return `${fmtNum(n)} ${r >= 3 && r <= 10 ? few : many}`;
  }
  const hoursLabel = n => (lang === "ar" ? arCount(n, "ساعة واحدة", "ساعتان", "ساعات", "ساعة") : `${fmtNum(n)} ${n === 1 ? "hour" : "hours"}`);
  const pointsLabel = n => (lang === "ar" ? arCount(n, "نقطة واحدة", "نقطتان", "نقاط", "نقطة") : `${fmtNum(n)} ${n === 1 ? "point" : "points"}`);
  const familiesLabel = n => (lang === "ar" ? arCount(n, "عائلة واحدة", "عائلتان", "عائلات", "عائلة") : `${fmtNum(n)} ${n === 1 ? "family" : "families"}`);
  const peopleLabel = n => (lang === "ar" ? arCount(n, "فرد واحد", "فردان", "أفراد", "فردًا") : `${fmtNum(n)} ${n === 1 ? "person" : "people"}`);

  function familyLabel(name) {
    if (lang === "ar") return /^(عائلة|أسرة|آل)\s/.test(name) ? name : t("familyOf", { name });
    return /family$/i.test(name) ? name : t("familyOf", { name });
  }
  const famName = f => L(f, "name");

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
    return parseDate(iso).toLocaleDateString(locale(), opts || { day: "numeric", month: "short", year: "numeric" });
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

  /* ---------- Artwork ---------- */

  // Line icons for the four areas, drawn after the Sanad poster.
  // Shapes that sit in front of others are filled with --icon-bg so lines behind them are hidden.
  const AREA_ICON = {
    kinship: '<circle cx="15" cy="14" r="4.5"/><path d="M6.5 31c0-5.2 3.8-9 8.5-9s8.5 3.8 8.5 9"/><circle cx="33" cy="14" r="4.5"/><path d="M24.5 31c0-5.2 3.8-9 8.5-9s8.5 3.8 8.5 9"/><g style="fill:var(--icon-bg)"><circle cx="24" cy="24.5" r="4"/><path d="M17 39c0-4.6 3.1-8 7-8s7 3.4 7 8z"/></g>',
    heritage: '<path d="M39.5 33V17.5M43 33V17.5M38.5 17.5h5.5M41.2 17.5v-3.5M41.2 14l-1.2-1.5h2.4z"/><path d="M6 32h32l-4 5.5H11z" style="fill:var(--icon-bg)"/><path d="M20 32V9.5"/><path d="M20.5 10.5c6 5 9.5 11.5 10.5 19H20.5z"/><path d="M10.5 9.6l1.1 2.2 2.4.3-1.8 1.6.5 2.4-2.2-1.2-2.1 1.2.4-2.4-1.7-1.6 2.4-.3z"/><path d="M5 42c2-1.4 4-1.4 6 0s4 1.4 6 0 4-1.4 6 0 4 1.4 6 0 4-1.4 6 0 4 1.4 6 0"/>',
    volunteering: '<path d="M24 34V21"/><path d="M24 26c-5.5 0-8.5-3.4-8.5-8.5 5.5 0 8.5 3.4 8.5 8.5z"/><path d="M24 22.5c0-5 3-8.5 8.5-8.5 0 5-3 8.5-8.5 8.5z"/><path d="M4.5 27.5l6 7c2.2 2.6 5.3 4 8.7 4H24M43.5 27.5l-6 7c-2.2 2.6-5.3 4-8.7 4H24"/><path d="M10.5 34.5l3.5-4c1-1.1 2.7-1.2 3.8-.2l2.7 2.4M37.5 34.5l-3.5-4c-1-1.1-2.7-1.2-3.8-.2l-2.7 2.4"/>',
    health: '<path d="M24 38.5C14.5 31.5 8 25.5 8 18.5 8 14 11.5 10.5 16 10.5c3.4 0 6 2 8 4.6 2-2.6 4.6-4.6 8-4.6 4.5 0 8 3.5 8 8 0 7-6.5 13-16 20z"/><path d="M10.5 23h6.5l2.8-5.5 4.2 11 2.8-6.5 1.6 1H37"/><g style="fill:var(--icon-bg)"><circle cx="37.5" cy="36" r="5.2"/></g><circle cx="37.5" cy="36" r="1.8"/><path d="M37.5 28.6v2.2M37.5 41.2v2.2M30.1 36h2.2M42.7 36h2.2M32.3 30.8l1.5 1.5M41.2 39.7l1.5 1.5M32.3 41.2l1.5-1.5M41.2 32.3l1.5-1.5"/>'
  };

  function areaIcon(id, cls) {
    return `<span class="area-icon${cls ? " " + cls : ""}" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${AREA_ICON[id]}</svg></span>`;
  }

  // Palm fronds drawn as leaflets along a curved rib. The CSS blurs them so they read as
  // the shadow of a palm falling across a plaster wall.
  let palmCache = "";
  function palmSVG() {
    if (palmCache) return palmCache;
    const fronds = [
      { p0: [-60, 10], p1: [250, 30], p2: [600, 250], len: 130 },
      { p0: [-40, 300], p1: [200, 170], p2: [470, 30], len: 105 },
      { p0: [-80, 150], p1: [140, 120], p2: [330, 175], len: 80 }
    ];
    let leaves = "", ribs = "";
    fronds.forEach(f => {
      const at = (tt, i) => (1 - tt) * (1 - tt) * f.p0[i] + 2 * (1 - tt) * tt * f.p1[i] + tt * tt * f.p2[i];
      const slope = (tt, i) => 2 * (1 - tt) * (f.p1[i] - f.p0[i]) + 2 * tt * (f.p2[i] - f.p1[i]);
      ribs += `<path d="M${f.p0} Q${f.p1} ${f.p2}"/>`;
      for (let i = 2; i < 32; i++) {
        const tt = i / 32, x = at(tt, 0), y = at(tt, 1);
        let tx = slope(tt, 0), ty = slope(tt, 1);
        const m = Math.hypot(tx, ty); tx /= m; ty /= m;
        [-1, 1].forEach(s => {
          const a = s * 0.95;
          const dx = tx * Math.cos(a) - ty * Math.sin(a), dy = tx * Math.sin(a) + ty * Math.cos(a);
          const len = f.len * (1 - 0.55 * tt) * (0.8 + 0.08 * ((i * 7 + (s > 0 ? 3 : 0)) % 5));
          const w = 8 * (1 - 0.45 * tt);
          const mx = x + dx * len * 0.45, my = y + dy * len * 0.45;
          const r = n => n.toFixed(1);
          leaves += `<path d="M${r(x)},${r(y)}Q${r(mx - dy * w)},${r(my + dx * w)} ${r(x + dx * len)},${r(y + dy * len)}Q${r(mx + dy * w)},${r(my - dx * w)} ${r(x)},${r(y)}Z"/>`;
        });
      }
    });
    palmCache = `<svg class="palm" viewBox="0 0 600 400" aria-hidden="true" focusable="false"><g fill="currentColor">${leaves}</g><g fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round">${ribs}</g></svg>`;
    return palmCache;
  }

  // The calligraphic sweep that underlines the logo on the poster.
  const SWASH = '<svg class="swash" viewBox="0 0 420 40" aria-hidden="true" focusable="false"><path d="M4 34C90 14 250 2 416 8 268 8 116 20 8 37z" fill="currentColor"/></svg>';

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

  // A log's title in the current language: from its event or challenge when we still have it.
  function logTitle(l) {
    if (l.eventId) {
      const e = eventOf(l.eventId);
      return e ? L(e, "title") : l.title;
    }
    const a = activityById[l.activityId];
    return a ? L(a, "name") : l.title;
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
    return pad("P<QAT" + clean(fam.username || fam.name) + "<<FAMILY<PASSPORT") + "\n" +
      pad(passportNo(fam) + "<QAT" + issued + "<" + count + "<<SANAD<100<HOURS");
  }

  /* ---------- Accounts ---------- */

  const USERNAME_RE = /^[a-z0-9_.]{3,20}$/;
  const normUser = u => u.trim().toLowerCase();
  const canPBKDF2 = () => !!(window.crypto && crypto.subtle);

  // Passwords are never stored, only a salted hash. PBKDF2 needs a secure page (https);
  // a page opened straight from a file falls back to a simple salted hash.
  async function hashPassword(password, salt, algo) {
    algo = algo || (canPBKDF2() ? "pbkdf2" : "basic");
    if (algo === "pbkdf2") {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
      const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
      return "pbkdf2$" + Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, "0")).join("");
    }
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (const ch of salt + ":" + password) {
      const c = ch.charCodeAt(0);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return "basic$" + (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16);
  }

  function findByUsername(username) {
    const u = normUser(username);
    return families().find(f => f.username === u) || null;
  }

  async function createFamily({ username, password, name, members }) {
    const salt = uid() + uid();
    const fam = {
      id: "fam-" + uid(), username: normUser(username), name, members, issued: todayISO(),
      salt, hash: await hashPassword(password, salt), logs: [], registrations: {}
    };
    state.families[fam.id] = fam;
    saveState();
    return fam;
  }

  async function checkPassword(fam, password) {
    const algo = (fam.hash || "").split("$")[0];
    if (!algo) return false;
    if (algo === "pbkdf2" && !canPBKDF2()) throw new Error(t("err.secure"));
    return (await hashPassword(password, fam.salt, algo)) === fam.hash;
  }

  /* ---------- Admin ---------- */

  // The Sanad team's admin account. Only a salted hash of the password is kept here.
  // The check runs in the browser, so it keeps casual visitors out but is not real security:
  // a live version should check admin sign-in on a server.
  const ADMIN = {
    username: "user1",
    salt: "sanad-admin-2026",
    hash: {
      pbkdf2: "pbkdf2$bfb49d7f3060910e557b43c7967243ce5d7489f855f1be6b2fa38aa91ae19d51",
      basic: "basic$1315fb5347bc3e22"
    }
  };

  let adminOn = loadAdmin();

  function loadAdmin() {
    try { return localStorage.getItem(ADMIN_KEY) === "1"; } catch (e) { return false; }
  }

  function setAdmin(on) {
    adminOn = on;
    try {
      if (on) localStorage.setItem(ADMIN_KEY, "1");
      else localStorage.removeItem(ADMIN_KEY);
    } catch (e) { /* memory only */ }
  }

  async function checkAdmin(username, password) {
    if (normUser(username) !== ADMIN.username) return false;
    const algo = canPBKDF2() ? "pbkdf2" : "basic";
    return (await hashPassword(password, ADMIN.salt, algo)) === ADMIN.hash[algo];
  }

  // To change the admin password: open the site, press F12, and run sanadAdminHash("new password")
  // in the Console. Paste the two results into ADMIN.hash above.
  window.sanadAdminHash = async password => ({
    pbkdf2: await hashPassword(password, ADMIN.salt, "pbkdf2"),
    basic: await hashPassword(password, ADMIN.salt, "basic")
  });

  /* ---------- Points ---------- */

  // Points come only from approved hours, so the team's review is what counts.
  function scoreFromHours(hours) {
    const P = D.points;
    const total = Object.values(hours).reduce((s, n) => s + n, 0);
    const areasDone = D.domains.filter(d => (hours[d.id] || 0) >= d.target).length;
    const passportDone = total >= D.goalHours;
    const points = total * P.perHour + areasDone * P.areaComplete + (passportDone ? P.passportComplete : 0);
    return { total, areasDone, passportDone, points };
  }

  // Every family for the leaderboard and dashboard: accounts on this device, then the sample families.
  function familyRows() {
    const rows = families().map(f => {
      const tl = tally(f.logs);
      const hours = {};
      D.domains.forEach(d => { hours[d.id] = tl.by[d.id].done; });
      const last = f.logs.reduce((m, l) => (l.date > m ? l.date : m), f.issued);
      return Object.assign({
        id: f.id, name: f.name, nameAr: f.nameAr, username: f.username, members: f.members.length,
        hours, pending: tl.pending, last, you: f.id === sessionId, sample: !!f.sample, local: true
      }, scoreFromHours(hours));
    });
    if (D.showSampleFamilies) {
      D.demoFamilies.forEach(f => {
        const hours = Object.assign({}, f.hours);
        D.demoPending.forEach(p => {
          if (p.familyId === f.id && state.reviews[p.id] === "verified") {
            const a = activityById[p.activityId];
            hours[a.domain] += a.hours;
          }
        });
        rows.push(Object.assign({
          id: f.id, name: f.name, nameAr: f.nameAr, members: f.members, hours, pending: 0,
          last: f.last, you: false, sample: true, local: false
        }, scoreFromHours(hours)));
      });
    }
    rows.sort((a, b) => b.points - a.points || b.total - a.total || a.name.localeCompare(b.name));
    rows.forEach((r, i) => { r.rank = i + 1; });
    return rows;
  }

  /* ---------- Events ---------- */

  // Events from data.js, plus any the team adds on the admin dashboard.
  const allEvents = () => D.events.concat(state.events || []);
  const eventOf = id => allEvents().find(e => e.id === id);
  const regsFor = id => families().filter(f => f.registrations[id]);

  /* ---------- Routing ---------- */

  const routes = {
    "": viewHome,
    about: viewAbout,
    passport: viewPassport,
    challenges: viewChallenges,
    archive: viewArchive,
    events: viewEvents,
    leaderboard: viewLeaderboard,
    admin: viewAdmin
  };

  const titleKeys = {
    about: "about.title", passport: "nav.passport", challenges: "ch.title", archive: "arch.title",
    events: "events.title", leaderboard: "lb.title", admin: "admin.title"
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

  // Everything outside <main>: language, header, menu and footer text.
  function updateChrome(page) {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-nav]").forEach(a => {
      if (a.dataset.nav === page) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    // The dashboard appears in the menu once the admin has signed in.
    document.querySelector('.site-nav [data-nav="admin"]').hidden = !adminOn;
    const toggle = document.querySelector(".lang-toggle");
    toggle.lang = otherLang();
    toggle.setAttribute("aria-label", t("lang.aria"));
    toggle.innerHTML = `<span class="long">${t("lang.label")}</span><span class="short">${t("lang.short")}</span>`;
    const navOpen = document.getElementById("site-nav").classList.contains("is-open");
    document.querySelector(".nav-toggle").textContent = navOpen ? t("close") : t("menu");

    const pill = document.getElementById("family-pill");
    const fam = me();
    if (fam) {
      const row = familyRows().find(r => r.you);
      pill.classList.remove("is-empty");
      pill.innerHTML = `<span>${esc(familyLabel(famName(fam)))}</span><b>${fmtNum(row.points)} ${t("pts")}</b>`;
      pill.setAttribute("aria-label", `${familyLabel(famName(fam))}, ${pointsLabel(row.points)}`);
    } else {
      pill.classList.add("is-empty");
      pill.innerHTML = `<span class="long">${t("pill.signin")}</span><span class="short">${t("pill.signinShort")}</span>`;
      pill.removeAttribute("aria-label");
    }
    document.title = page ? t(titleKeys[page]) + " | " + (lang === "ar" ? "سند" : "Sanad") : (lang === "ar" ? "جواز سند العائلي" : "Sanad Family Passport");
  }

  /* ---------- Shared pieces ---------- */

  // Photographs from the Sanad poster, shown as framed prints in page headers.
  const PHOTO = {
    hands: { src: "assets/img/photo-hands.jpg", en: "An elder's hand holding a young girl's hand", ar: "يد جدٍّ تمسك بيد حفيدته", w: 430, h: 250 },
    flag: { src: "assets/img/photo-flag.jpg", en: "The Qatari flag against a sunlit wall and palm leaves", ar: "علم قطر على جدار مشمس بين سعف النخيل", w: 330, h: 330 },
    planting: { src: "assets/img/photo-planting.jpg", en: "Volunteers planting young trees", ar: "متطوعون يزرعون أشجارًا صغيرة", w: 430, h: 280 },
    sadu: { src: "assets/img/photo-sadu.jpg", en: "A woven Sadu rug in maroon, black and white", ar: "بساط سدو منسوج بالعنابي والأسود والأبيض", w: 500, h: 200 },
    skyline: { src: "assets/img/photo-skyline.jpg", en: "The Doha skyline at sunset from the corniche", ar: "أفق الدوحة عند الغروب من الكورنيش", w: 506, h: 300 }
  };

  function printHTML(photo, cls) {
    return `<figure class="print${cls ? " " + cls : ""}"><img src="${photo.src}" alt="${esc(photo[lang])}" width="${photo.w}" height="${photo.h}"></figure>`;
  }

  // A small line in the other language above a heading, as on the poster.
  function accentHTML(key, vars) {
    const o = otherLang();
    return `<span class="ar accent" lang="${o}" dir="${o === "ar" ? "rtl" : "ltr"}">${esc(t(key, vars, o))}</span>`;
  }

  function pageHead(key, text, photo, title) {
    return `<section class="page-head">
      ${palmSVG()}
      <div class="wrap${photo ? " has-print" : ""}">
        <div>
          ${accentHTML(key)}
          <h1>${esc(title || t(key))}</h1>
          <span class="rule"></span>
          ${text ? `<p>${text}</p>` : ""}
        </div>
        ${photo ? printHTML(photo, "page-print") : ""}
      </div>
    </section>`;
  }

  function areaCardsHTML() {
    return `<div class="area-grid">${D.domains.map(d => `
      <a class="area-card" data-domain="${d.id}" href="#/challenges/${d.id}">
        <span class="area-photo"><img src="${d.photo}" alt="${esc(L(d, "photoAlt"))}" loading="lazy" width="500" height="340"></span>
        ${areaIcon(d.id)}
        <span class="area-ar" lang="ar" dir="rtl">${d.ar}</span>
        <span class="area-goal-ar" lang="ar" dir="rtl">${d.goalAr}</span>
        <span class="rule"></span>
        <span class="area-en" lang="en" dir="ltr"><b>${esc(d.name)}</b>${esc(d.goal)}</span>
        <span class="area-meta">${t("areas.meta", { n: D.activities.filter(a => a.domain === d.id).length, h: hoursLabel(d.target) })}</span>
      </a>`).join("")}
    </div>`;
  }

  function stampHTML(o) {
    const d = domainById[o.domain];
    const r = o.rot != null ? o.rot : (hashCode(o.date + o.domain + o.hours + (o.seed || "")) % 24) - 12;
    const date = o.pending ? t("stamp.review")
      : lang === "ar" ? fmtDate(o.date, { day: "numeric", month: "short" })
      : fmtDate(o.date, { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase();
    return `<div class="stamp${o.pending ? " is-pending" : ""}${o.cls ? " " + o.cls : ""}" data-domain="${d.id}" style="--r:${r}deg">
      ${areaIcon(d.id, "stamp-icon")}
      <span class="stamp-area">${esc(L(d, "short"))}</span>
      <span class="stamp-hours">${o.hours}<small>${lang === "ar" ? "س" : "h"}</small></span>
      <span class="stamp-date">${esc(date)}</span>
    </div>`;
  }

  function bookletHTML() {
    return `<div class="booklet">
      <p class="booklet-top"><span lang="ar" dir="rtl">مبادرة سند</span><span lang="en">Sanad initiative</span></p>
      <img src="assets/img/logo-gold.png" alt="">
      <p class="booklet-title"><span class="ar-line" lang="ar" dir="rtl">جواز العائلة</span><strong lang="en">Family</strong><span lang="en">Passport</span></p>
      <span class="booklet-sadu"></span>
      <span class="chip-mark"></span>
    </div>`;
  }

  function chip(domainId, text) {
    return `<span class="chip" data-domain="${domainId}">${areaIcon(domainId, "chip-icon")}${esc(text || L(domainById[domainId], "name"))}</span>`;
  }

  function upcomingEvents() {
    const today = todayISO();
    const list = allEvents().filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    return list.length ? list : allEvents();
  }

  function eventRowHTML(e) {
    const d = parseDate(e.date);
    const reg = myRegs()[e.id];
    const taken = (e.registered || 0) + regsFor(e.id).length;
    const full = !reg && taken >= e.capacity;
    let side;
    if (reg) {
      side = `<span class="registered-note">${icon.check}${t("ev.registered", { people: peopleLabel(reg.participants) })}</span>
        <button class="link-btn" type="button" data-action="cancel-event" data-event="${e.id}">${t("ev.cancel")}</button>`;
    } else if (full) {
      side = `<button class="btn btn-secondary btn-small" type="button" disabled>${t("ev.full")}</button>`;
    } else {
      side = `<button class="btn btn-primary btn-small" type="button" data-action="register-event" data-event="${e.id}">${t("ev.register")}</button>`;
    }
    return `<li class="event-row">
      <div class="date-block">
        <span class="day">${d.getDate()}</span>
        <span class="mon">${d.toLocaleDateString(locale(), { month: lang === "ar" ? "long" : "short" })}</span>
        <span class="wk">${d.toLocaleDateString(locale(), { weekday: lang === "ar" ? "long" : "short" })}</span>
      </div>
      <div class="event-main">
        ${chip(e.domain)}
        <h3>${esc(L(e, "title"))}</h3>
        <div class="event-meta">
          <span>${icon.clock}${esc(L(e, "time"))}</span>
          <span>${icon.pin}${esc(L(e, "location"))}</span>
          <span>${t("ev.forPassport", { h: hoursLabel(e.hours) })}</span>
        </div>
        ${L(e, "description") ? `<p class="event-desc">${esc(L(e, "description"))}</p>` : ""}
      </div>
      <div class="event-side">
        <div class="capacity">${t("ev.capacity", { n: taken, cap: e.capacity })}
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
      ${palmSVG()}
      <img class="lantern" src="assets/img/lantern.jpg" alt="" width="112" height="470">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <div class="hero-mark">
            <img src="assets/img/logo.png" alt="${lang === "ar" ? "سند" : "Sanad"}" width="900" height="367">
            ${SWASH}
          </div>
          <p class="hero-tagline" lang="ar" dir="rtl">${D.tagline.ar}</p>
          ${lang === "en" ? `<p class="hero-tagline-en">${esc(D.tagline.en)}</p>` : ""}
          <h1>${t("home.h1")}</h1>
          <p class="lede">${t("home.lede")}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${me() ? "#/passport" : "#/passport/join"}">${me() ? t("home.ctaOpen") : t("home.ctaCreate")}</a>
            <a class="btn btn-secondary" href="#/challenges">${t("home.ctaBrowse")}</a>
          </div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <span class="sun"></span>
          ${bookletHTML()}
          ${stampHTML({ domain: "kinship", hours: 3, date: "2026-10-02", rot: 14, cls: "hero-stamp stamp-in" })}
          ${stampHTML({ domain: "volunteering", hours: 5, date: "2026-10-09", rot: -12, cls: "hero-stamp two stamp-in" })}
        </div>
      </div>
    </section>

    <section class="section areas">
      <div class="wrap">
        <div class="section-head centered">
          ${accentHTML("areas.title")}
          <h2>${t("areas.title")}</h2>
          <span class="rule"></span>
          <p>${t("areas.text")}</p>
        </div>
        ${areaCardsHTML()}
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head"><div>${accentHTML("how.title")}<h2>${t("how.title")}</h2></div></div>
        <ol class="steps">
          <li><h3>${t("how.s1t")}</h3><p>${t("how.s1")}</p></li>
          <li><h3>${t("how.s2t")}</h3><p>${t("how.s2", { n: D.activities.length })}</p></li>
          <li><h3>${t("how.s3t")}</h3><p>${t("how.s3")}</p></li>
          <li><h3>${t("how.s4t")}</h3><p>${t("how.s4")}</p></li>
        </ol>
      </div>
    </section>

    <section class="band section">
      <div class="wrap band-grid">
        <div class="band-memory">
          ${printHTML(PHOTO.hands, "band-print")}
          <blockquote>
            <p>“${esc(L(story, "text")[0])}”</p>
            <cite>${t("band.recorded", { teller: esc(L(story, "teller")), recorder: esc(L(story, "recorder")) })}</cite>
          </blockquote>
        </div>
        <div>
          ${accentHTML("band.accent")}
          <h2>${t("band.title")}</h2>
          <p>${t("band.text")}</p>
          <a class="btn btn-primary" href="#/archive">${t("band.cta")}</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-head">
          <div>
            ${accentHTML("upcoming.title")}
            <h2>${t("upcoming.title")}</h2>
            <p>${t("upcoming.text")}</p>
          </div>
          <a class="btn btn-secondary btn-small" href="#/events">${t("upcoming.all")}</a>
        </div>
        <ul class="event-list">${upcomingEvents().slice(0, 3).map(eventRowHTML).join("")}</ul>
      </div>
    </section>`;
  }

  /* ---------- About ---------- */

  function viewAbout() {
    return `
    ${pageHead("about.title", t("about.text"), PHOTO.flag)}

    <section class="wrap section-tight">
      <div class="about-grid">
        <div class="prose">
          <p class="meaning">${t("about.meaning")}</p>
          <h2>${t("about.ideaTitle")}</h2>
          <p>${t("about.idea1")}</p>
          <p>${t("about.idea2")}</p>
        </div>
        <div>
          <h2>${t("about.goalsTitle")}</h2>
          <ul class="goal-list">
            ${[1, 2, 3, 4, 5].map(i => `<li><span>${t("about.goal" + i)}</span></li>`).join("")}
          </ul>
        </div>
      </div>
    </section>

    <section class="wrap section-tight">
      <div class="vision">
        <span class="ar" lang="ar" dir="rtl">${D.tagline.ar}</span>
        <h2>${t("about.visionTitle")}</h2>
        <p>${t("about.vision")}</p>
      </div>
    </section>

    <section class="wrap section-tight">
      <div class="section-head centered">
        ${accentHTML("about.areasTitle")}
        <h2>${t("about.areasTitle")}</h2>
        <span class="rule"></span>
      </div>
      ${areaCardsHTML()}
    </section>

    <section class="wrap section-tight">
      <div class="section-head">
        <div>
          <h2>${t("about.measureTitle")}</h2>
          <p>${t("about.measureText")}</p>
        </div>
        <a class="btn btn-secondary btn-small" href="#/admin">${t("about.viewDash")}</a>
      </div>
      <div class="indicator-list">
        ${[1, 2, 3, 4].map(i => `<div><b>${t("about.ind" + i + "t")}</b><span>${t("about.ind" + i)}</span></div>`).join("")}
      </div>
    </section>`;
  }

  /* ---------- Passport ---------- */

  function familyFieldsHTML(fam) {
    return `
      <div class="field">
        <label for="f-name">${t("fam.name")}</label>
        <input id="f-name" name="familyName" type="text" required autocomplete="family-name" placeholder="${esc(t("fam.namePh"))}" value="${esc(fam ? fam.name : "")}">
      </div>
      <div class="field">
        <label for="f-members">${t("fam.members")} <span class="hint">${t("fam.membersHint")}</span></label>
        <textarea id="f-members" name="members" required placeholder="${esc(t("fam.membersPh")).replace(/\n/g, "&#10;")}">${esc(fam ? fam.members.join("\n") : "")}</textarea>
      </div>`;
  }

  // Sign in (default), create an account (#/passport/join) or sign in as admin (#/passport/admin).
  function authHTML(mode) {
    const join = mode === "join", admin = mode === "admin";
    const form = admin ? `
      <form class="form" data-form="adminSignin" novalidate>
        <div class="field">
          <label for="ad-user">${t("auth.username")}</label>
          <input id="ad-user" name="username" type="text" dir="ltr" required autocomplete="username" autocapitalize="none" spellcheck="false">
        </div>
        <div class="field">
          <label for="ad-pass">${t("auth.password")}</label>
          <input id="ad-pass" name="password" type="password" dir="ltr" required autocomplete="current-password">
        </div>
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions start"><button class="btn btn-primary" type="submit">${t("auth.submitAdmin")}</button></div>
      </form>` : join ? `
      <form class="form" data-form="signup" novalidate>
        ${familyFieldsHTML(null)}
        <div class="field">
          <label for="a-user">${t("auth.username")} <span class="hint">${t("auth.usernameHint")}</span></label>
          <input id="a-user" name="username" type="text" dir="ltr" required autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="${esc(t("auth.usernamePh"))}">
        </div>
        <div class="field-pair">
          <div class="field">
            <label for="a-pass">${t("auth.password")} <span class="hint">${t("auth.passwordHint")}</span></label>
            <input id="a-pass" name="password" type="password" dir="ltr" required autocomplete="new-password" minlength="6">
          </div>
          <div class="field">
            <label for="a-pass2">${t("auth.password2")}</label>
            <input id="a-pass2" name="password2" type="password" dir="ltr" required autocomplete="new-password">
          </div>
        </div>
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions start"><button class="btn btn-primary" type="submit">${t("auth.submitJoin")}</button></div>
      </form>` : `
      <form class="form" data-form="signin" novalidate>
        <div class="field">
          <label for="s-user">${t("auth.username")}</label>
          <input id="s-user" name="username" type="text" dir="ltr" required autocomplete="username" autocapitalize="none" spellcheck="false">
        </div>
        <div class="field">
          <label for="s-pass">${t("auth.password")}</label>
          <input id="s-pass" name="password" type="password" dir="ltr" required autocomplete="current-password">
        </div>
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions start"><button class="btn btn-primary" type="submit">${t("auth.submitSignin")}</button></div>
      </form>`;
    const head = admin ? pageHead("auth.adminTitle", t("auth.adminText"), PHOTO.flag)
      : pageHead(join ? "auth.joinTitle" : "auth.signinTitle", t(join ? "auth.joinText" : "auth.signinText"), PHOTO.hands);
    const tab = (href, on, key) => `<a href="${href}"${on ? ' aria-current="page"' : ""}>${t(key)}</a>`;
    return `
    ${head}
    <section class="wrap">
      <div class="register-card">
        <nav class="auth-tabs" aria-label="${esc(t("nav.passport"))}">
          ${tab("#/passport", !join && !admin, "auth.tabSignin")}
          ${tab("#/passport/join", join, "auth.tabJoin")}
          ${tab("#/passport/admin", admin, "auth.tabAdmin")}
        </nav>
        ${form}
        ${admin ? `<p class="device-note">${t("auth.adminNote")}</p>` : `
        <p class="sample-note">${t("auth.samplePre")} <button class="link-btn" type="button" data-action="load-sample">${t("auth.sampleBtn")}</button> ${t("auth.samplePost")}</p>
        <p class="device-note">${t("auth.device")}</p>`}
      </div>
    </section>`;
  }

  function progressSentence(tl) {
    if (tl.total === 0) return t("sentence.zero");
    if (tl.done >= D.goalHours) return t("sentence.done");
    const left = Math.max(0, D.goalHours - tl.total);
    let s = left ? t("sentence.left", { h: hoursLabel(left) }) : t("sentence.all");
    if (tl.pending) s += " " + t("sentence.pending", { h: hoursLabel(tl.pending) });
    return s;
  }

  function idPageHTML(fam) {
    return `<div class="id-page">
      <div class="id-head"><p lang="en" dir="ltr">Sanad family passport</p><p lang="ar" dir="rtl">جواز سند العائلي</p></div>
      <div class="id-body">
        <div class="id-photo"><div><img src="assets/img/logo.png" alt=""><span>${peopleLabel(fam.members.length)}</span></div></div>
        <dl class="id-fields">
          <div><dt>${t("pass.famName")}</dt><dd>${esc(famName(fam))}</dd></div>
          <div><dt>${t("pass.no")}</dt><dd dir="ltr">${passportNo(fam)}</dd></div>
          <div class="wide"><dt>${t("pass.members")}</dt><dd>${esc(L(fam, "members").join(lang === "ar" ? "، " : ", "))}</dd></div>
          <div><dt>${t("pass.issued")}</dt><dd>${fmtDate(fam.issued)}</dd></div>
          <div><dt>${t("pass.goal")}</dt><dd>${t("pass.goalVal", { n: D.goalHours })}</dd></div>
        </dl>
      </div>
      <pre class="mrz" dir="ltr" aria-hidden="true">${esc(mrz(fam))}</pre>
      <div class="id-actions">
        ${fam.sample ? "" : `<button class="link-btn" type="button" data-action="edit-family">${t("pass.edit")}</button>`}
        <button class="link-btn" type="button" data-action="sign-out">${t("pass.signout")}</button>
        <span class="id-user">${t("pass.signedAs")}: <b dir="ltr">${esc(fam.username)}</b></span>
      </div>
    </div>`;
  }

  function pointsPanelHTML() {
    const rows = familyRows();
    const row = rows.find(r => r.you);
    const P = D.points;
    return `<div class="panel points-panel">
      <div class="points-top">
        <div class="points-total"><span class="big">${fmtNum(row.points)}</span><span class="of">${t("points.unit")}</span></div>
        <a class="rank" href="#/leaderboard"><b dir="ltr">#${row.rank}</b><span>${t("points.rankOf", { families: familiesLabel(rows.length) })}</span></a>
      </div>
      <ul class="points-breakdown">
        <li><span>${t("points.hours", { h: hoursLabel(row.total), p: P.perHour })}</span><b>${fmtNum(row.total * P.perHour)}</b></li>
        <li><span>${t("points.areas", { n: row.areasDone, t: D.domains.length, p: P.areaComplete })}</span><b>${fmtNum(row.areasDone * P.areaComplete)}</b></li>
        <li><span>${t("points.bonus")}</span><b>${row.passportDone ? fmtNum(P.passportComplete) : "0"}</b></li>
      </ul>
      ${row.pending ? `<p class="panel-sub">${t("points.pending", { p: pointsLabel(row.pending * P.perHour), h: hoursLabel(row.pending) })}</p>` : ""}
      <a class="btn btn-secondary btn-small" href="#/leaderboard">${t("points.board")}</a>
    </div>`;
  }

  function progressPanelHTML(tl) {
    // One cell per hour: approved hours first, grouped by area, then hours in review.
    const cells = [];
    D.domains.forEach(d => { for (let i = 0; i < tl.by[d.id].done; i++) cells.push(`<span class="cell is-done" data-domain="${d.id}"></span>`); });
    D.domains.forEach(d => { for (let i = 0; i < tl.by[d.id].pending; i++) cells.push(`<span class="cell is-pending" data-domain="${d.id}"></span>`); });
    const extra = Math.max(0, cells.length - D.goalHours);
    const shown = cells.slice(0, D.goalHours);
    while (shown.length < D.goalHours) shown.push('<span class="cell"></span>');

    const meters = D.domains.map(d => {
      const v = tl.by[d.id];
      const done = Math.min(100, v.done / d.target * 100);
      const pending = Math.min(100 - done, v.pending / d.target * 100);
      return `<li data-domain="${d.id}">
        <div class="meter-label"><b>${esc(L(d, "name"))}</b><span>${t("meter", { n: v.done + v.pending, t: d.target })}</span></div>
        <div class="meter-track"><div class="meter-fill" style="width:${done}%"></div><div class="meter-fill pending" style="width:${pending}%"></div></div>
      </li>`;
    }).join("");

    return `<div class="panel">
      <h2>${t("progress.title")}</h2>
      <div class="progress-head"><span class="big">${tl.total}</span><span class="of">${t("progress.of", { n: D.goalHours })}</span></div>
      <div class="hour-grid" role="img" aria-label="${esc(t("progress.aria", { d: tl.done, p: tl.pending, g: D.goalHours }))}">${shown.join("")}</div>
      <div class="grid-key">
        <span><i class="k-done"></i>${t("key.done")}</span>
        <span><i class="k-pending"></i>${t("key.pending")}</span>
        <span><i class="k-empty"></i>${t("key.empty")}</span>
        ${extra ? `<span>${t("progress.extra", { h: hoursLabel(extra) })}</span>` : ""}
      </div>
      <ul class="meters">${meters}</ul>
    </div>`;
  }

  function badgesHTML(tl) {
    const milestones = [10, 25, 50, 75, 100].map(at => ({ medal: at, name: t("badge." + at), earned: tl.done >= at, left: at - tl.done }));
    const areas = D.domains.map(d => ({
      medal: areaIcon(d.id, "medal-icon"),
      name: t("badge.area", { area: L(d, "short") }),
      earned: tl.by[d.id].done >= d.target,
      left: d.target - tl.by[d.id].done
    }));
    const item = b => `<li class="badge${b.earned ? " is-earned" : ""}">
      <div class="medal">${b.medal}</div>
      <b>${esc(b.name)}</b>
      <span>${b.earned ? t("badge.earned") : t("badge.toGo", { h: hoursLabel(b.left) })}</span>
    </li>`;
    return `<div class="panel">
      <h2>${t("badges.title")}</h2>
      <p class="panel-sub">${t("badges.sub")}</p>
      <ul class="badges">${milestones.map(item).join("")}${areas.map(item).join("")}</ul>
    </div>`;
  }

  function viewPassport(arg) {
    const fam = me();
    if (arg === "admin") return authHTML("admin");
    if (!fam) return authHTML(arg);
    const tl = tally(fam.logs);
    const logs = fam.logs.filter(l => l.status !== "rejected").sort((a, b) => b.date.localeCompare(a.date));
    const stamps = logs.length
      ? `<div class="stamp-grid">${logs.map(l => `
          <div class="stamp-item">
            ${stampHTML({ domain: l.domain, hours: l.hours, date: l.date, pending: l.status === "pending", seed: l.id })}
            <p>${esc(logTitle(l))}<small>${fmtDate(l.date)}</small></p>
          </div>`).join("")}</div>`
      : `<div class="empty-state"><p>${t("stamps.empty")}</p><a class="btn btn-primary" href="#/challenges">${t("stamps.browse")}</a></div>`;

    return `
    ${pageHead("nav.passport", esc(progressSentence(tl)), PHOTO.hands, t("pass.title", { family: familyLabel(famName(fam)) }))}
    <section class="wrap">
      <div class="passport-layout">
        <div class="stack">${idPageHTML(fam)}${badgesHTML(tl)}</div>
        <div class="stack">${pointsPanelHTML()}${progressPanelHTML(tl)}</div>
      </div>
      <div class="stamp-sheet">
        <div class="stamp-sheet-head">
          <div>
            <h2>${t("stamps.title")}</h2>
            <p class="panel-sub">${t("stamps.sub")}</p>
          </div>
          <a class="btn btn-primary btn-small" href="#/challenges">${t("stamps.add")}</a>
        </div>
        ${stamps}
      </div>
    </section>`;
  }

  // The sample family is a ready-made account for presentations. It has no password,
  // so it can only be opened with this button.
  function loadSample() {
    const s = D.sampleFamily;
    let fam = findByUsername("sample");
    if (!fam) {
      fam = {
        id: "fam-sample", username: "sample", sample: true,
        name: s.name, nameAr: s.nameAr, members: s.members.slice(), membersAr: (s.membersAr || s.members).slice(),
        issued: "2026-09-01", salt: "", hash: "", registrations: {},
        logs: s.logs.map(l => makeLog(activityById[l.activityId], {
          date: l.date, submitted: l.date, status: l.status, members: s.members.slice(), fileName: "Photo"
        }))
      };
      state.families[fam.id] = fam;
      saveState();
    }
    setSession(fam.id);
    if (location.hash !== "#/passport") location.hash = "#/passport";
    else render();
    showToast(t("toast.sample", { family: familyLabel(famName(fam)) }));
  }

  /* ---------- Challenges ---------- */

  function activityCardHTML(a, count) {
    const hoursTag = a.logHours ? t("ch.upTo", { h: hoursLabel(a.maxHours) }) : hoursLabel(a.hours);
    return `<article class="activity" data-domain="${a.domain}">
      <div class="activity-top">${chip(a.domain)}<span class="hours-tag">${hoursTag}</span></div>
      <h3>${esc(L(a, "name"))}</h3>
      <p>${esc(L(a, "description"))}</p>
      <ul class="task-list" aria-label="${esc(t("ch.tasksAria"))}">${L(a, "tasks").map(x => `<li>${esc(x)}</li>`).join("")}</ul>
      ${a.link ? `<a class="activity-link" href="${a.link.href}">${esc(L(a.link, "label"))}</a>` : ""}
      <div class="activity-foot">
        ${count ? `<span class="done-count">${count === 1 ? t("ch.once") : t("ch.times", { n: count })}</span>` : "<span></span>"}
        <button class="btn btn-primary btn-small" type="button" data-action="submit-proof" data-activity="${a.id}">${t("ch.submit")}</button>
      </div>
    </article>`;
  }

  function viewChallenges(arg) {
    const active = domainById[arg] ? arg : "";
    const counts = {};
    myLogs().forEach(l => { if (l.status !== "rejected") counts[l.activityId] = (counts[l.activityId] || 0) + 1; });
    return `
    ${pageHead("ch.title", t("ch.text"), PHOTO.planting)}
    <section class="wrap">
      <div class="filter-bar" role="group" aria-label="${esc(t("ch.filterAria"))}">
        <button type="button" data-action="filter" data-domain="" aria-pressed="${!active}">${t("ch.all")}</button>
        ${D.domains.map(d => `<button type="button" data-action="filter" data-domain="${d.id}" aria-pressed="${active === d.id}">${areaIcon(d.id, "filter-icon")}${esc(L(d, "name"))}</button>`).join("")}
      </div>
      ${D.domains.filter(d => !active || d.id === active).map(d => `
        <section class="area-group" aria-labelledby="group-${d.id}">
          <div class="area-banner" data-domain="${d.id}">
            <span class="area-banner-photo"><img src="${d.photo}" alt="${esc(L(d, "photoAlt"))}" loading="lazy" width="500" height="340"></span>
            <div class="area-banner-text">
              ${areaIcon(d.id)}
              <div>
                ${lang === "en" ? `<span class="area-ar" lang="ar" dir="rtl">${d.ar}</span>` : ""}
                <h2 id="group-${d.id}">${esc(L(d, "name"))}</h2>
                <p>${esc(L(d, "goal"))}</p>
                ${lang === "en" ? `<p class="goal-ar" lang="ar" dir="rtl">${d.goalAr}</p>` : `<p class="goal-en" lang="en" dir="ltr">${esc(d.name)}: ${esc(d.goal)}</p>`}
                <span class="area-meta">${t("ch.aim", { h: hoursLabel(d.target) })}</span>
              </div>
            </div>
          </div>
          <div class="activity-grid">${D.activities.filter(a => a.domain === d.id).map(a => activityCardHTML(a, counts[a.id] || 0)).join("")}</div>
        </section>`).join("")}
    </section>`;
  }

  let pendingUpload = null; // { photo: dataURL|null, fileName, kind }

  function modalHead(title, pre) {
    return `<div class="modal-head">
      <div>${pre || ""}<h2 id="modal-title">${esc(title)}</h2></div>
      <button class="modal-close" type="button" data-action="close-modal" aria-label="${esc(t("close"))}">×</button>
    </div>`;
  }

  function needPassportHTML(whatKey) {
    return `${modalHead(t("need.title"))}
    <div class="modal-body">
      <p>${t("need.text", { what: t(whatKey) })}</p>
      <div class="form-actions">
        <button class="btn btn-secondary" type="button" data-action="close-modal">${t("need.notNow")}</button>
        <a class="btn btn-secondary" href="#/passport">${t("need.signin")}</a>
        <a class="btn btn-primary" href="#/passport/join">${t("need.join")}</a>
      </div>
    </div>`;
  }

  function uploadFieldHTML(label, hint, accept) {
    return `<div class="field">
      <span class="field-label">${label} <span class="hint">${hint}</span></span>
      <label class="upload">
        <input type="file" name="upload" accept="${accept}" data-upload>
        <span><strong>${t("upload.choose")}</strong> ${t("upload.or")}</span>
      </label>
      <div class="upload-preview" id="upload-preview"></div>
    </div>`;
  }

  function quizHTML(quiz) {
    return `<div class="quiz">
      <span class="field-label">${t("quiz.title")}</span>
      ${quiz.map((q, i) => `<fieldset data-q="${i}">
        <legend>${i + 1}. ${esc(L(q, "q"))}</legend>
        ${L(q, "options").map((o, j) => `<label><input type="radio" name="q${i}" value="${j}"> <span>${esc(o)}</span></label>`).join("")}
      </fieldset>`).join("")}
      <p class="quiz-result" id="quiz-result" aria-live="polite"></p>
    </div>`;
  }

  function openProof(activityId) {
    const a = activityById[activityId];
    const fam = me();
    if (!fam) { openModal(needPassportHTML("need.submit")); return; }
    pendingUpload = null;
    const members = L(fam, "members");
    openModal(`${modalHead(L(a, "name"), chip(a.domain))}
    <div class="modal-body">
      <form class="form" data-form="proof" data-activity="${a.id}" novalidate>
        <p class="muted">${a.logHours ? t("proof.introFlex", { h: hoursLabel(a.maxHours) }) : t("proof.intro", { h: hoursLabel(a.hours) })}</p>
        <div class="field-pair">
          <div class="field">
            <label for="p-date">${t("proof.date")}</label>
            <input id="p-date" name="date" type="date" required value="${todayISO()}" max="${todayISO()}">
          </div>
          ${a.logHours ? `<div class="field">
            <label for="p-hours">${t("proof.hours")}</label>
            <input id="p-hours" name="hours" type="number" min="1" max="${a.maxHours}" step="1" required value="${a.hours}">
          </div>` : ""}
        </div>
        <fieldset class="field">
          <legend>${t("proof.who")}</legend>
          <div class="checks">${members.map((m, i) => `<label><input type="checkbox" name="members" value="${esc(fam.members[i] || m)}" checked> ${esc(m)}</label>`).join("")}</div>
        </fieldset>
        ${uploadFieldHTML(t("proof.file"), t("proof.fileHint"), "image/*,video/*")}
        ${a.quiz ? quizHTML(a.quiz) : ""}
        <div class="field">
          <label for="p-note">${esc(L(a, "noteLabel") || t("proof.note"))} <span class="hint">${t("optional")}</span></label>
          <textarea id="p-note" name="note" rows="3"></textarea>
        </div>
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">${t("cancel")}</button>
          <button class="btn btn-primary" type="submit">${t("proof.submit")}</button>
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
      document.getElementById("quiz-result").textContent = t("quiz.result", { n: right, t: quiz.length });
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
        box.innerHTML = `<p>${esc(t("upload.noPreview", { f: file.name }))}</p>`;
      }
    } else if (file.type.startsWith("video/")) {
      pendingUpload = { photo: null, fileName: file.name, kind: "video" };
      box.innerHTML = `<video src="${URL.createObjectURL(file)}" controls muted playsinline></video><p>${esc(t("upload.video", { f: file.name }))}</p>`;
    } else {
      box.innerHTML = `<p>${t("upload.wrong")}</p>`;
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

  const storyText = s => L(s, "text");

  function storyBy(s) {
    const teller = L(s, "teller"), recorder = L(s, "recorder");
    return esc(t("arch.told", { teller })) + (recorder ? esc(t("arch.recorded", { recorder })) : "");
  }

  function storyCardHTML(s) {
    return `<article class="story" data-action="read-story" data-story="${s.id}">
      ${s.photo ? `<img class="story-photo" src="${s.photo}" alt="">` : `<span class="story-cover" aria-hidden="true">${esc(L(s, "era"))}</span>`}
      <div class="story-text">
        ${s.photo ? `<span class="story-era">${esc(L(s, "era"))}</span>` : ""}
        <h3>${esc(L(s, "title"))}</h3>
        <p>${esc(truncate(storyText(s)[0], 150))}</p>
        <span class="story-by">${storyBy(s)}</span>
        <button class="link-btn" type="button" data-action="read-story" data-story="${s.id}">${t("arch.read")}</button>
      </div>
    </article>`;
  }

  function viewArchive() {
    const stories = allStories();
    return `
    ${pageHead("arch.title", t("arch.text"), PHOTO.sadu)}
    <section class="wrap">
      <div class="section-head">
        <p class="muted">${stories.length === 1 ? t("arch.countOne") : t("arch.count", { n: stories.length })}</p>
        <button class="btn btn-primary" type="button" data-action="add-story">${t("arch.add")}</button>
      </div>
      <div class="story-grid">${stories.map(storyCardHTML).join("")}</div>
    </section>`;
  }

  function openStory(id) {
    const s = allStories().find(x => x.id === id);
    if (!s) return;
    openModal(`${modalHead(L(s, "title"), `<span class="story-era">${esc(L(s, "era"))}</span>`)}
    <div class="modal-body story-full">
      ${s.photo ? `<img src="${s.photo}" alt="">` : ""}
      <div class="prose">${storyText(s).map(p => `<p>${esc(p)}</p>`).join("")}</div>
      <p class="story-by">${storyBy(s)}</p>
    </div>`);
  }

  const ERAS = {
    en: ["Before 1950", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s or later"],
    ar: ["قبل 1950", "الخمسينيات", "الستينيات", "السبعينيات", "الثمانينيات", "التسعينيات", "الألفينيات أو بعدها"]
  };

  function openStoryForm() {
    pendingUpload = null;
    const session = activityById["grandparents-stories"];
    openModal(`${modalHead(t("sf.title"))}
    <div class="modal-body">
      <form class="form" data-form="story" novalidate>
        <div class="field">
          <label for="s-title">${t("sf.storyTitle")}</label>
          <input id="s-title" name="title" type="text" required placeholder="${esc(t("sf.titlePh"))}">
        </div>
        <div class="field-pair">
          <div class="field">
            <label for="s-teller">${t("sf.teller")}</label>
            <input id="s-teller" name="teller" type="text" required placeholder="${esc(t("sf.tellerPh"))}">
          </div>
          <div class="field">
            <label for="s-recorder">${t("sf.recorder")} <span class="hint">${t("optional")}</span></label>
            <input id="s-recorder" name="recorder" type="text" placeholder="${esc(t("sf.recorderPh"))}">
          </div>
        </div>
        <div class="field">
          <label for="s-era">${t("sf.era")}</label>
          <select id="s-era" name="era">${ERAS[lang].map((e, i) => `<option${i === 3 ? " selected" : ""}>${e}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="s-text">${t("sf.text")} <span class="hint">${t("sf.textHint")}</span></label>
          <textarea id="s-text" name="story" rows="7" required></textarea>
        </div>
        ${uploadFieldHTML(t("sf.photo"), t("sf.photoHint"), "image/*")}
        ${me() ? `<label class="check-row"><input type="checkbox" name="logIt" checked> <span>${esc(t("sf.logIt", { activity: L(session, "name"), h: hoursLabel(session.hours) }))}</span></label>` : ""}
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">${t("cancel")}</button>
          <button class="btn btn-primary" type="submit">${t("sf.submit")}</button>
        </div>
      </form>
    </div>`);
  }

  /* ---------- Events ---------- */

  function viewEvents() {
    return `
    ${pageHead("events.title", t("events.text"), PHOTO.skyline)}
    <section class="wrap">
      <ul class="event-list">${upcomingEvents().map(eventRowHTML).join("")}</ul>
      <p class="muted events-note">${t("events.note")}</p>
    </section>`;
  }

  function openEventForm(id) {
    const e = eventOf(id);
    const fam = me();
    if (!fam) { openModal(needPassportHTML("need.register")); return; }
    openModal(`${modalHead(t("evf.title", { event: L(e, "title") }), chip(e.domain, fmtDate(e.date, { weekday: "long", day: "numeric", month: "long" })))}
    <div class="modal-body">
      <form class="form" data-form="event" data-event="${e.id}" novalidate>
        <p class="muted">${esc(t("evf.intro", { time: L(e, "time"), location: L(e, "location"), h: hoursLabel(e.hours) }))}</p>
        <div class="field-pair">
          <div class="field">
            <label for="e-count">${t("evf.count")}</label>
            <input id="e-count" name="participants" type="number" min="1" max="20" required value="${fam.members.length}">
          </div>
          <div class="field">
            <label for="e-phone">${t("evf.phone")} <span class="hint">${t("evf.phoneHint")}</span></label>
            <input id="e-phone" name="phone" type="tel" dir="ltr" autocomplete="tel" placeholder="+974">
          </div>
        </div>
        <div class="field">
          <label for="e-notes">${t("evf.notes")} <span class="hint">${t("optional")}</span></label>
          <textarea id="e-notes" name="notes" rows="2" placeholder="${esc(t("evf.notesPh"))}"></textarea>
        </div>
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">${t("cancel")}</button>
          <button class="btn btn-primary" type="submit">${t("evf.submit")}</button>
        </div>
      </form>
    </div>`);
  }

  /* ---------- Leaderboard ---------- */

  function areaDots(row) {
    return `<span class="area-dots">${D.domains.map(d => {
      const done = (row.hours[d.id] || 0) >= d.target;
      return `<span class="area-dot${done ? " is-done" : ""}" data-domain="${d.id}" title="${esc(L(d, "name"))}">${areaIcon(d.id)}</span>`;
    }).join("")}</span>`;
  }

  function rowTags(r) {
    return (r.you ? `<span class="tag tag-you">${t("tag.you")}</span>` : "") + (r.sample ? `<span class="tag">${t("tag.sample")}</span>` : "");
  }

  function viewLeaderboard() {
    const rows = familyRows();
    const P = D.points;
    const podium = rows.slice(0, 3).map(r => `
      <li class="podium-item place-${r.rank}${r.you ? " is-you" : ""}">
        <span class="podium-medal">${r.rank}</span>
        <b class="podium-name">${esc(familyLabel(famName(r)))}</b>
        <span class="podium-points">${pointsLabel(r.points)}</span>
        ${areaDots(r)}
        <span class="podium-tags">${rowTags(r)}</span>
      </li>`).join("");
    const table = rows.map(r => `<tr${r.you ? ' class="is-you"' : ""}>
        <td class="num" dir="ltr">#${r.rank}</td>
        <td>${esc(familyLabel(famName(r)))} ${rowTags(r)}</td>
        <td class="num"><b>${fmtNum(r.points)}</b></td>
        ${D.domains.map(d => `<td class="num">${r.hours[d.id] || 0}</td>`).join("")}
        <td>${areaDots(r)}</td>
        <td class="num">${r.total}</td>
      </tr>`).join("");
    return `
    ${pageHead("lb.title", t("lb.text"), PHOTO.flag)}
    <section class="wrap">
      ${rows.length ? `
      <div class="points-rules" aria-label="${esc(t("lb.how"))}">
        <h2>${t("lb.how")}</h2>
        <ul>
          <li><b dir="ltr">+${P.perHour}</b><span>${t("lb.r1")}</span></li>
          <li><b dir="ltr">+${P.areaComplete}</b><span>${t("lb.r2")}</span></li>
          <li><b dir="ltr">+${P.passportComplete}</b><span>${t("lb.r3")}</span></li>
        </ul>
      </div>
      <ol class="podium">${podium}</ol>
      <div class="panel panel-gap">
        <h2>${t("lb.tableTitle")}</h2>
        <div class="table-scroll"><table class="table leaderboard-table">
          <thead><tr>
            <th class="num">${t("th.rank")}</th><th>${t("th.family")}</th><th class="num">${t("th.points")}</th>
            ${D.domains.map(d => `<th class="num">${areaIcon(d.id, "chip-icon")}<span class="visually-hidden">${esc(L(d, "name"))}</span></th>`).join("")}
            <th>${t("th.areasDone")}</th><th class="num">${t("th.hours")}</th>
          </tr></thead>
          <tbody>${table}</tbody>
        </table></div>
      </div>
      <p class="muted events-note">${t("lb.note")}</p>` : `
      <div class="empty-state"><p>${t("lb.empty")}</p><a class="btn btn-primary" href="#/passport/join">${t("lb.emptyCta")}</a></div>`}
    </section>`;
  }

  /* ---------- Admin ---------- */

  function adminData() {
    const rows = familyRows();
    const pending = [];
    if (D.showSampleFamilies) {
      D.demoPending.forEach(p => {
        if (state.reviews[p.id]) return;
        const a = activityById[p.activityId];
        const f = D.demoFamilies.find(x => x.id === p.familyId);
        pending.push({ id: p.id, family: "", name: famName(f), sample: true, title: L(a, "name"), domain: a.domain, hours: a.hours, date: p.date, note: L(p, "note"), photo: null, proof: t("proof.photo"), you: false });
      });
    }
    families().forEach(f => f.logs.forEach(l => {
      if (l.status !== "pending") return;
      pending.push({ id: l.id, family: f.id, name: famName(f), sample: !!f.sample, title: logTitle(l), domain: l.domain, hours: l.hours, date: l.date, note: l.note, photo: l.photo, proof: l.fileName || t("proof.fileWord"), you: f.id === sessionId });
    }));
    pending.sort((a, b) => b.date.localeCompare(a.date));

    const counts = {};
    D.activities.forEach(a => { counts[a.id] = D.showSampleFamilies ? (D.demoActivityCounts[a.id] || 0) : 0; });
    families().forEach(f => f.logs.forEach(l => { if (l.status === "verified" && counts[l.activityId] != null && !l.eventId) counts[l.activityId] += 1; }));
    if (D.showSampleFamilies) D.demoPending.forEach(p => { if (state.reviews[p.id] === "verified") counts[p.activityId] += 1; });
    return { rows, pending, counts };
  }

  function barRow(label, value, max, domainId) {
    const pct = Math.max(1, value / max * 100);
    return `<li class="bar-row"${domainId ? ` data-domain="${domainId}"` : ""} title="${esc(label)}: ${value}">
      <span class="label">${domainId ? chip(domainId, label) : esc(label)}</span>
      <span class="bar-track"><span class="bar-fill" style="display:block;width:${pct}%"></span></span>
      <span class="value">${fmtNum(value)}</span>
    </li>`;
  }

  function viewAdmin() {
    if (!adminOn) return authHTML("admin");
    const { rows, pending, counts } = adminData();
    const n = rows.length || 1;
    const totalHours = rows.reduce((s, f) => s + f.total, 0);
    const people = rows.reduce((s, f) => s + f.members, 0);
    const reached = rows.filter(f => f.total >= D.goalHours).length;
    const byArea = D.domains.map(d => ({ d, v: rows.reduce((s, f) => s + (f.hours[d.id] || 0), 0) }));
    const maxArea = Math.max(1, ...byArea.map(x => x.v));
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const maxTop = Math.max(1, ...top.map(x => x[1]));
    const completed = Object.values(counts).reduce((s, x) => s + x, 0);

    const kpi = (label, value, sub) => `<div class="kpi"><span>${label}</span><b>${value}</b><small>${sub}</small></div>`;

    const pendingRows = pending.length ? pending.map(p => `<tr>
        <td>${esc(familyLabel(p.name))} ${p.you ? `<span class="tag tag-you">${t("tag.you")}</span>` : ""}${p.sample ? `<span class="tag">${t("tag.sample")}</span>` : ""}</td>
        <td>${chip(p.domain, p.title)}${p.note ? `<div class="muted row-note">${esc(truncate(p.note, 80))}</div>` : ""}</td>
        <td class="num">${p.hours}</td>
        <td>${fmtDate(p.date)}</td>
        <td>${p.photo ? `<img class="thumb" src="${p.photo}" alt="${esc(t("proof.photo"))}">` : `<span class="muted">${esc(truncate(p.proof, 24))}</span>`}</td>
        <td><div class="row-actions">
          <button class="btn btn-secondary" type="button" data-action="review" data-id="${p.id}" data-family="${p.family}" data-decision="rejected">${t("review.reject")}</button>
          <button class="btn btn-primary" type="button" data-action="review" data-id="${p.id}" data-family="${p.family}" data-decision="verified">${t("review.approve")}</button>
        </div></td>
      </tr>`).join("")
      : `<tr><td colspan="6" class="muted">${t("review.none")}</td></tr>`;

    const familyRowsHTML = rows.map(f => `<tr${f.you ? ' class="is-you"' : ""}>
        <td class="num" dir="ltr">#${f.rank}</td>
        <td>${esc(familyLabel(famName(f)))} ${rowTags(f)}</td>
        <td class="num">${f.members}</td>
        <td class="num"><b>${fmtNum(f.points)}</b></td>
        <td class="num">${f.total}</td>
        <td><div class="mini-track"><div class="mini-fill" style="width:${Math.min(100, f.total / D.goalHours * 100)}%"></div></div></td>
        <td>${areaDots(f)}</td>
        <td>${fmtDate(f.last)}</td>
      </tr>`).join("");

    const eventRows = allEvents().map(e => {
      const regs = regsFor(e.id);
      const taken = (e.registered || 0) + regs.length;
      const site = regs.length ? regs.map(f => {
        const reg = f.registrations[e.id];
        return `<div class="site-reg"><span>${esc(familyLabel(famName(f)))} (${peopleLabel(reg.participants)})</span>${reg.attended
          ? `<span class="status is-done">${t("evadm.attended")}</span>`
          : `<button class="btn btn-secondary btn-small" type="button" data-action="confirm-attendance" data-event="${e.id}" data-family="${f.id}">${t("evadm.confirm")}</button>`}</div>`;
      }).join("") : `<span class="muted">${t("evadm.none")}</span>`;
      return `<tr>
        <td>${esc(L(e, "title"))}${e.custom ? ` <button class="link-btn" type="button" data-action="delete-event" data-event="${e.id}">${t("evadm.delete")}</button>` : ""}</td>
        <td>${fmtDate(e.date)}</td>
        <td class="num">${taken} / ${e.capacity}</td>
        <td>${site}</td>
      </tr>`;
    }).join("");

    return `
    ${pageHead("admin.title", t("admin.text"))}
    <section class="wrap">
      <div class="admin-note">
        <span>${t("admin.signedIn", { user: ADMIN.username })}</span>
        <span class="admin-note-actions">
          <button class="link-btn" type="button" data-action="reset-demo">${t("admin.reset")}</button>
          <button class="btn btn-secondary btn-small" type="button" data-action="admin-signout">${t("admin.signout")}</button>
        </span>
      </div>

      <div class="kpis">
        ${kpi(t("kpi.families"), rows.length, peopleLabel(people))}
        ${kpi(t("kpi.hours"), fmtNum(totalHours), t("kpi.avg", { n: Math.round(totalHours / n) }))}
        ${kpi(t("kpi.reached"), reached, t("kpi.share", { n: Math.round(reached / n * 100) }))}
        ${kpi(t("kpi.pending"), pending.length, pending.length ? t("kpi.toCheck") : t("kpi.caught"))}
      </div>

      <div class="two-col">
        <div class="panel">
          <h2>${t("panel.byArea")}</h2>
          <p class="panel-sub">${t("panel.byAreaSub")}</p>
          <ul class="bars">${byArea.map(x => barRow(L(x.d, "name"), x.v, maxArea, x.d.id)).join("")}</ul>
        </div>
        <div class="panel">
          <h2>${t("panel.top")}</h2>
          <p class="panel-sub">${t("panel.topSub", { n: fmtNum(completed) })}</p>
          <ul class="bars bars-neutral">${top.map(([id, c]) => barRow(L(activityById[id], "name"), c, maxTop)).join("")}</ul>
        </div>
      </div>

      <div class="panel panel-gap" id="review">
        <h2>${t("review.title")}</h2>
        <p class="panel-sub">${t("review.sub")}</p>
        <div class="table-scroll"><table class="table">
          <thead><tr><th>${t("th.family")}</th><th>${t("th.challenge")}</th><th class="num">${t("th.hours")}</th><th>${t("th.date")}</th><th>${t("th.proof")}</th><th><span class="visually-hidden">${t("th.actions")}</span></th></tr></thead>
          <tbody>${pendingRows}</tbody>
        </table></div>
      </div>

      <div class="panel panel-gap">
        <div class="panel-head">
          <div><h2>${t("fams.title")}</h2><p class="panel-sub">${t("fams.sub")}</p></div>
          <button class="btn btn-secondary btn-small" type="button" data-action="export-csv">${t("fams.export")}</button>
        </div>
        <div class="table-scroll"><table class="table">
          <thead><tr><th class="num">${t("th.rank")}</th><th>${t("th.family")}</th><th class="num">${t("th.members")}</th><th class="num">${t("th.points")}</th><th class="num">${t("th.hours")}</th><th>${t("th.progress")}</th><th>${t("th.areasDone")}</th><th>${t("th.last")}</th></tr></thead>
          <tbody>${familyRowsHTML}</tbody>
        </table></div>
      </div>

      <div class="panel panel-gap">
        <div class="panel-head">
          <div><h2>${t("evadm.title")}</h2><p class="panel-sub">${t("evadm.sub")}</p></div>
          <button class="btn btn-primary btn-small" type="button" data-action="add-event">${t("evadm.add")}</button>
        </div>
        <div class="table-scroll"><table class="table">
          <thead><tr><th>${t("th.event")}</th><th>${t("th.date")}</th><th class="num">${t("th.capacity")}</th><th>${t("th.siteFams")}</th></tr></thead>
          <tbody>${eventRows}</tbody>
        </table></div>
      </div>
    </section>`;
  }

  function openAddEvent() {
    openModal(`${modalHead(t("ae.title"))}
    <div class="modal-body">
      <form class="form" data-form="addEvent" novalidate>
        <div class="field-pair">
          <div class="field"><label for="ae-ar">${t("ae.titleAr")}</label><input id="ae-ar" name="titleAr" type="text" dir="rtl"></div>
          <div class="field"><label for="ae-en">${t("ae.titleEn")}</label><input id="ae-en" name="title" type="text" dir="ltr"></div>
        </div>
        <div class="field-pair">
          <div class="field"><label for="ae-area">${t("ae.area")}</label>
            <select id="ae-area" name="domain">${D.domains.map(d => `<option value="${d.id}">${esc(L(d, "name"))}</option>`).join("")}</select></div>
          <div class="field"><label for="ae-date">${t("ae.date")}</label><input id="ae-date" name="date" type="date" min="${todayISO()}" value="${todayISO()}"></div>
        </div>
        <div class="field-pair">
          <div class="field"><label for="ae-time">${t("ae.time")}</label><input id="ae-time" name="time" type="text" placeholder="${esc(t("ae.timePh"))}"></div>
          <div class="field"><label for="ae-loc">${t("ae.location")}</label><input id="ae-loc" name="location" type="text"></div>
        </div>
        <div class="field-pair">
          <div class="field"><label for="ae-hours">${t("ae.hours")}</label><input id="ae-hours" name="hours" type="number" min="1" max="12" value="3"></div>
          <div class="field"><label for="ae-cap">${t("ae.capacity")}</label><input id="ae-cap" name="capacity" type="number" min="1" max="500" value="30"></div>
        </div>
        <div class="field"><label for="ae-desc">${t("ae.desc")} <span class="hint">${t("optional")}</span></label><textarea id="ae-desc" name="description" rows="2"></textarea></div>
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">${t("cancel")}</button>
          <button class="btn btn-primary" type="submit">${t("ae.submit")}</button>
        </div>
      </form>
    </div>`);
  }

  // Families as a CSV file the team can open in Excel. The BOM keeps Arabic names readable.
  function exportCSV() {
    const rows = familyRows();
    const head = ["Rank", "Family", "Family (Arabic)", "Username", "Members", "Points", "Approved hours"]
      .concat(D.domains.map(d => d.name + " hours"), ["Areas completed", "Last activity", "Sample"]);
    const cell = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const lines = rows.map(r => [r.rank, r.name, r.nameAr || "", r.username || "", r.members, r.points, r.total]
      .concat(D.domains.map(d => r.hours[d.id] || 0), [r.areasDone, r.last, r.sample ? "yes" : "no"]).map(cell).join(","));
    const blob = new Blob(["﻿" + [head.map(cell).join(",")].concat(lines).join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sanad-families-${todayISO()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast(t("toast.exported"));
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
    btn.textContent = open ? t("close") : t("menu");
  }

  /* ---------- Actions ---------- */

  const actions = {
    "skip": () => main.focus(),
    "toggle-nav": () => setNav(!document.getElementById("site-nav").classList.contains("is-open")),
    "toggle-lang": () => {
      lang = otherLang();
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* memory only */ }
      closeModal();
      render(true);
    },
    "close-modal": closeModal,
    "load-sample": loadSample,
    "edit-family": () => openModal(`${modalHead(t("edit.title"))}
      <div class="modal-body"><form class="form" data-form="editFamily" novalidate>
        ${familyFieldsHTML(me())}
        <p class="form-error" id="form-error" hidden></p>
        <div class="form-actions">
          <button class="btn btn-secondary" type="button" data-action="close-modal">${t("cancel")}</button>
          <button class="btn btn-primary" type="submit">${t("edit.save")}</button>
        </div>
      </form></div>`),
    "sign-out": () => {
      setSession(null);
      render();
      showToast(t("toast.signedOut"));
    },
    "admin-signout": () => {
      setAdmin(false);
      location.hash = "#/";
      showToast(t("toast.adminOut"));
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
      delete me().registrations[ds.event];
      saveState();
      render(true);
      showToast(t("toast.cancelled"));
    },
    "review": ds => {
      if (ds.family) {
        const f = state.families[ds.family];
        const log = f && f.logs.find(l => l.id === ds.id);
        if (log) log.status = ds.decision;
      } else {
        state.reviews[ds.id] = ds.decision;
      }
      saveState();
      render(true);
      showToast(ds.decision === "verified" ? t("toast.approved") : t("toast.rejected"));
    },
    "confirm-attendance": ds => {
      const e = eventOf(ds.event);
      const f = state.families[ds.family];
      const reg = f && f.registrations[e.id];
      if (!reg) return;
      reg.attended = true;
      f.logs.push(makeLog(activityById["national-event"], {
        title: e.title, domain: e.domain, hours: e.hours, date: e.date, status: "verified", eventId: e.id
      }));
      saveState();
      render(true);
      showToast(t("toast.attended", { h: hoursLabel(e.hours), family: familyLabel(famName(f)) }));
    },
    "add-event": openAddEvent,
    "delete-event": ds => {
      if (!confirm(t("confirm.deleteEvent"))) return;
      state.events = (state.events || []).filter(e => e.id !== ds.event);
      saveState();
      render(true);
      showToast(t("toast.eventDeleted"));
    },
    "export-csv": exportCSV,
    "reset-demo": () => {
      if (!confirm(t("confirm.reset"))) return;
      state = blankState();
      setSession(null);
      saveState();
      render();
      showToast(t("toast.reset"));
    }
  };

  const forms = {
    async adminSignin(form) {
      if (!(await checkAdmin(field(form, "username"), form.elements.namedItem("password").value))) {
        return showFormError(form, t("err.admin"));
      }
      setAdmin(true);
      if (location.hash !== "#/admin") location.hash = "#/admin";
      else render();
      showToast(t("toast.adminIn"));
    },

    async signin(form) {
      const fam = findByUsername(field(form, "username"));
      try {
        if (!fam || !(await checkPassword(fam, form.elements.namedItem("password").value))) {
          return showFormError(form, t("err.signin"));
        }
      } catch (err) {
        return showFormError(form, err.message);
      }
      setSession(fam.id);
      render();
      showToast(t("toast.welcome", { family: familyLabel(famName(fam)) }));
    },

    async signup(form) {
      const name = field(form, "familyName").replace(/\s+family$/i, "").replace(/^(عائلة|أسرة)\s+/, "");
      const members = parseMembers(field(form, "members"));
      const username = normUser(field(form, "username"));
      const password = form.elements.namedItem("password").value;
      if (!name || !members.length) return showFormError(form, t("err.famFields"));
      if (!USERNAME_RE.test(username)) return showFormError(form, t("err.username"));
      if (findByUsername(username)) return showFormError(form, t("err.taken"));
      if (password.length < 6) return showFormError(form, t("err.password"));
      if (password !== form.elements.namedItem("password2").value) return showFormError(form, t("err.match"));
      const fam = await createFamily({ username, password, name, members });
      setSession(fam.id);
      location.hash = "#/passport";
      showToast(t("toast.created", { family: familyLabel(name) }));
    },

    editFamily(form) {
      const name = field(form, "familyName").replace(/\s+family$/i, "").replace(/^(عائلة|أسرة)\s+/, "");
      const members = parseMembers(field(form, "members"));
      if (!name || !members.length) return showFormError(form, t("err.famFields"));
      const fam = me();
      fam.name = name;
      fam.members = members;
      delete fam.nameAr;
      delete fam.membersAr;
      saveState();
      closeModal();
      render(true);
      showToast(t("toast.saved"));
    },

    proof(form) {
      const a = activityById[form.dataset.activity];
      const members = Array.from(form.querySelectorAll('input[name="members"]:checked')).map(i => i.value);
      const date = field(form, "date");
      let hours = a.hours;
      if (a.logHours) {
        hours = parseInt(field(form, "hours"), 10);
        if (!hours || hours < 1 || hours > a.maxHours) return showFormError(form, t("err.hours", { max: a.maxHours }));
      }
      if (!date) return showFormError(form, t("err.date"));
      if (!members.length) return showFormError(form, t("err.who"));
      if (!pendingUpload) return showFormError(form, t("err.file"));
      if (a.quiz && a.quiz.some((q, i) => !form.querySelector(`input[name="q${i}"]:checked`))) {
        return showFormError(form, t("err.quiz"));
      }
      me().logs.push(makeLog(a, {
        date, members, hours, note: field(form, "note"),
        photo: pendingUpload.photo, fileName: pendingUpload.fileName
      }));
      saveState();
      closeModal();
      render(true);
      showToast(t("toast.submitted", { h: hoursLabel(hours) }), "#/passport", t("toast.view"));
    },

    story(form) {
      const title = field(form, "title");
      const teller = field(form, "teller");
      const text = field(form, "story");
      if (!title || !teller || !text) return showFormError(form, t("err.story"));
      const photo = pendingUpload ? pendingUpload.photo : null;
      state.stories.unshift({
        id: "u-" + uid(), title, teller,
        recorder: field(form, "recorder"),
        era: field(form, "era"),
        text: text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean),
        photo, added: todayISO(), familyId: sessionId
      });
      const logIt = form.elements.namedItem("logIt");
      const session = activityById["grandparents-stories"];
      if (logIt && logIt.checked && me()) {
        me().logs.push(makeLog(session, {
          note: title, photo,
          fileName: pendingUpload ? pendingUpload.fileName : "",
          members: me().members.slice()
        }));
      }
      saveState();
      closeModal();
      render(true);
      showToast(logIt && logIt.checked ? t("toast.storyLogged", { h: hoursLabel(session.hours) }) : t("toast.story"));
    },

    event(form) {
      const e = eventOf(form.dataset.event);
      const participants = parseInt(field(form, "participants"), 10);
      if (!participants || participants < 1) return showFormError(form, t("err.count"));
      me().registrations[e.id] = {
        participants, phone: field(form, "phone"), notes: field(form, "notes"),
        at: todayISO(), attended: false
      };
      saveState();
      closeModal();
      render(true);
      showToast(t("toast.registered", { event: L(e, "title") }));
    },

    addEvent(form) {
      const title = field(form, "title"), titleAr = field(form, "titleAr");
      const date = field(form, "date"), location = field(form, "location");
      if (!(title || titleAr) || !date || !location) return showFormError(form, t("err.event"));
      state.events = state.events || [];
      state.events.push({
        id: "ev-" + uid(), custom: true, domain: field(form, "domain"),
        title: title || titleAr, titleAr: titleAr || title, date,
        time: field(form, "time"), location,
        hours: Math.max(1, parseInt(field(form, "hours"), 10) || 1),
        capacity: Math.max(1, parseInt(field(form, "capacity"), 10) || 1),
        registered: 0, description: field(form, "description")
      });
      saveState();
      closeModal();
      render(true);
      showToast(t("toast.eventAdded"));
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
