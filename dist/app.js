import {
  lessons,
  paths,
  defaults,
  progressFor,
  stats,
  emailValid,
  applicationValid,
} from "./data.js";
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const key = "veteacher-v1";
let state = {
  prefs: { ...defaults },
  progress: {},
  saved: [],
  notes: {},
  onboarded: false,
  last: null,
};
let storageOK = true;
try {
  const s = JSON.parse(localStorage.getItem(key));
  if (s && typeof s === "object") {
    state = { ...state, ...s, prefs: { ...defaults, ...s.prefs } };
    state.progress =
      state.progress && typeof state.progress === "object"
        ? state.progress
        : {};
    state.saved = Array.isArray(state.saved)
      ? state.saved.filter((id) => lessons.some((l) => l.id === id))
      : [];
    state.notes =
      state.notes && typeof state.notes === "object" ? state.notes : {};
  }
} catch {
  storageOK = false;
}
let filter = "all",
  search = "",
  showHint = false,
  alternate = "",
  feedback = "",
  menu = false,
  installPrompt = null;
function save() {
  try {
    localStorage.setItem(key, JSON.stringify(state));
  } catch {
    storageOK = false;
    toast(
      "Progress could not be saved on this device. You can still keep learning.",
    );
  }
}
function toast(text) {
  $("#toast").textContent = text;
  $("#toast").classList.add("visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => $("#toast").classList.remove("visible"), 4500);
}
const glyphs = {
  home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  book: '<path d="M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Zm0 0v15"/>',
  play: '<path d="m9 5 11 7-11 7z"/>',
  chart: '<path d="M4 3v17h17M8 15v-4m5 4V6m5 9V9"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  settings:
    '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1-1.5 3m0 3h.01"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  video:
    '<rect x="3" y="5" width="12" height="14" rx="2"/><path d="m15 10 6-4v12l-6-4"/>',
  shield:
    '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
  briefcase:
    '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V3h8v4M3 12c6 4 12 4 18 0M12 12v4"/>',
  file: '<path d="M5 3h9l5 5v13H5zM14 3v6h5M8 13h8m-8 4h6"/>',
  chat: '<path d="M3 4h18v13H9l-6 4zM7 8h10M7 12h7"/>',
  monitor:
    '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>',
  sound:
    '<path d="m3 9 4 0 5-5v16l-5-5H3zM16 8a7 7 0 0 1 0 8m3-11a11 11 0 0 1 0 14"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/>',
  attach:
    '<path d="m8 12 7-7a4 4 0 0 1 6 6L10 22a6 6 0 0 1-8-8L13 3m-8 14 11-11"/>',
  leaf: '<path d="M20 3C8 2 2 8 5 15s17 5 15-12ZM4 21 16 9"/>',
};
function icon(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${glyphs[name] || glyphs.book}</svg>`;
}
function btn(label, action, cls = "", ico = "") {
  return `<button class="btn ${cls}" data-action="${action}">${ico ? icon(ico) : ""}${label}</button>`;
}
function applyPrefs() {
  document.documentElement.dataset.size = state.prefs.size;
  document.documentElement.classList.toggle("contrast", state.prefs.contrast);
  document.documentElement.classList.toggle(
    "reduce-motion",
    state.prefs.motion,
  );
  document.documentElement.classList.toggle("focus-mode", state.prefs.focus);
}
function route() {
  return (location.hash.slice(1) || "home").split("/");
}
function go(hash) {
  if (location.hash === "#" + hash) render();
  else location.hash = hash;
}
function header(title, desc, action = "") {
  return `<header class="page-heading"><div><h1 tabindex="-1">${title}</h1><p>${desc}</p></div>${action}</header>`;
}
function meter(done, total) {
  return `<div class="meter" role="progressbar" aria-label="Lesson progress" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${done}"><span style="width:${(done / total) * 100}%"></span></div>`;
}
function shell(content) {
  const [r] = route();
  const nav = [
    ["home", "home", "My learning"],
    ["learn", "book", "Learning paths"],
    ["practice", "play", "Practice space"],
    ["progress", "chart", "My progress"],
    ["saved", "bookmark", "Saved resources"],
  ];
  return `<aside class="sidebar ${menu ? "open" : ""}"><a class="brand" href="#home"><img src="./icon.svg" alt=""/>VeTeacher<span>Learning for your next chapter</span></a><nav aria-label="Main navigation">${nav.map(([id, i, t]) => `<a href="#${id}" class="${r === id ? "active" : ""}" ${r === id ? 'aria-current="page"' : ""}>${icon(i)}${t}</a>`).join("")}</nav><div class="sidebar-bottom"><div class="pace-note">${icon(leafName())}<strong>Your pace. Your path.</strong><p>Small steps count.<br>Come back whenever you’re ready.</p></div><nav aria-label="Tools"><a href="#settings" class="${r === "settings" ? "active" : ""}">${icon("settings")}Learning preferences</a><a href="#help" class="${r === "help" ? "active" : ""}">${icon("help")}Help & support</a></nav><div class="device-label"><span class="status-dot"></span>${storageOK ? "Saved on this device" : "Saving unavailable"}</div></div></aside><div class="workspace"><div class="topbar"><button class="mobile-menu btn" data-action="menu" aria-label="Toggle navigation" aria-expanded="${menu}">${icon("menu")}</button><span class="breadcrumb"><span class="desktop-brand">Your learning space</span><a class="mobile-brand" href="#home"><img src="./icon.svg" alt=""/>VeTeacher</a></span><a class="preferences-link" href="#settings">${icon("settings")}Make it comfortable</a><button class="profile" data-action="profile" aria-label="Edit your name">${esc((state.prefs.name || "V").slice(0, 1).toUpperCase())}</button></div><main id="main" tabindex="-1">${content}</main><footer>Made for veterans. Built around you.<span>Learn without timers or streaks.</span></footer></div>`;
}
function leafName() {
  return "leaf";
}
function lessonRow(l) {
  const p = progressFor(state, l.id);
  return `<a class="lesson-row" href="#lesson/${l.id}"><span class="row-icon">${icon(l.icon)}</span><span class="row-copy"><strong>${l.title}</strong><span>${l.minutes} min · ${p.complete ? "Completed — practice again" : state.progress[l.id] ? "In progress" : "At your own pace"}</span></span><span class="row-end">${p.complete ? icon("check") : icon("arrow")}</span></a>`;
}
function home() {
  const st = stats(state);
  const active = lessons.find(
    (l) => l.id === state.last && !progressFor(state, l.id).complete,
  );
  const next =
    active ||
    lessons.find(
      (l) =>
        !progressFor(state, l.id).complete &&
        (state.prefs.goal === "either" || l.path === state.prefs.goal),
    ) ||
    lessons.find((l) => !progressFor(state, l.id).complete) ||
    lessons[0];
  const p = progressFor(state, next.id);
  return (
    header(
      state.prefs.name
        ? `Make room to grow, ${esc(state.prefs.name)}.`
        : "Your next chapter starts here.",
      "Practical skills. Patient guidance. A pace that feels right for you.",
      !state.onboarded
        ? btn("Set up my learning", "onboarding", "secondary")
        : "",
    ) +
    `<div class="dashboard-grid"><section class="continue-panel"><div class="section-top"><span>${active ? "Pick up where you left off" : "A good place to begin"}</span><span class="meta">${icon("clock")}${next.minutes} min · no rush</span></div><h2>${next.title}</h2><p>${active ? `You’re on “${next.steps[Math.min(p.step, 2)].title}.” Your place is saved.` : next.description}</p><div class="lesson-journey"><span class="journey-current">Read & explore</span><i></i><span>Try it yourself</span><i></i><span>Take it with you</span></div><div class="continue-bottom"><a class="btn primary" href="#lesson/${next.id}">${active ? "Continue learning" : "Start this lesson"}${icon("arrow")}</a><span>${active ? "One step at a time." : "You can pause at any point."}</span></div></section><section class="progress-panel"><div class="section-top"><h2>Your progress</h2>${icon("chart")}</div><div class="progress-number">${st.completed}<span> / ${lessons.length}</span></div><p>lessons completed</p>${meter(st.completed, lessons.length)}<p class="muted">${st.completed ? "You’re building skills you can take with you." : "A fresh start. Every small step counts."}</p><a class="text-link" href="#progress">See your journey ${icon("arrow")}</a></section><section class="paths-block"><div class="section-top"><h2>Choose your path</h2><a class="text-link" href="#learn">View all lessons ${icon("arrow")}</a></div><div class="path-grid">${Object.entries(
      paths,
    )
      .map(
        ([id, path]) =>
          `<article class="path-panel"><div class="path-heading">${icon(path.icon)}<span>3 guided lessons</span></div><h3>${path.title}</h3><p>${path.description}</p><div class="path-topics">${id === "digital" ? "Email · Video calls · Online safety" : "Experience · Applications · Interviews"}</div><a class="text-link" href="#learn/${id}">Explore this path ${icon("arrow")}</a></article>`,
      )
      .join(
        "",
      )}</div></section><section class="practice-banner"><div>${icon("play")}<h2>A little practice. A little more confidence.</h2><p>Try an email, a video call, or a job application in a safe practice space.</p></div><a class="btn secondary" href="#practice">Try a practice ${icon("arrow")}</a></section><section class="comfort-strip"><div>${icon("settings")}<span><strong>Learning should fit you.</strong> Adjust text, sound, and focus.</span></div><a class="text-link" href="#settings">Set your preferences ${icon("arrow")}</a></section></div>`
  );
}
function learn() {
  const [, p] = route();
  const selected = p || filter;
  const found = lessons.filter(
    (l) =>
      (selected === "all" || l.path === selected) &&
      `${l.title} ${l.description}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    header(
      "Find your next skill",
      "Choose what is useful to you. Every lesson can be repeated.",
    ) +
    `<div class="library-controls"><div class="segmented" role="group" aria-label="Filter lessons">${[
      ["all", "All lessons"],
      ["digital", "Technology"],
      ["career", "Career"],
    ]
      .map(
        ([id, t]) =>
          `<button aria-pressed="${selected === id}" data-filter="${id}">${t}</button>`,
      )
      .join(
        "",
      )}</div><label class="search-field">${icon("search")}<span class="sr-only">Search lessons</span><input id="search" placeholder="Find a skill…" value="${esc(search)}"/></label></div><p class="muted" id="result-count">${found.length} ${found.length === 1 ? "lesson" : "lessons"}</p><div id="lesson-results" class="library-grid">${found.length ? found.map((l) => `<article class="library-card"><div class="section-top"><span>${paths[l.path].title}</span><button class="icon-btn" data-save="${l.id}" aria-label="${state.saved.includes(l.id) ? "Unsave" : "Save"} ${l.title}" aria-pressed="${state.saved.includes(l.id)}">${icon("bookmark")}</button></div><h2>${l.title}</h2><p>${l.description}</p><div class="section-top"><span class="meta">${icon("clock")}${l.minutes} min</span><a class="text-link" href="#lesson/${l.id}">${progressFor(state, l.id).complete ? "Review lesson" : "Open lesson"} ${icon("arrow")}</a></div></article>`).join("") : '<p class="empty">No lessons match. Try “email,” “call,” or “career.”</p>'}</div>`
  );
}
function getLesson(id) {
  return lessons.find((l) => l.id === id);
}
function ensureProgress(id) {
  state.progress[id] ??= {
    step: 0,
    answers: {},
    practice: false,
    complete: false,
    draft: {},
  };
  return state.progress[id];
}
function lesson(id) {
  const l = getLesson(id);
  if (!l) return notFound();
  const p = ensureProgress(id);
  state.last = id;
  save();
  const step = Math.max(0, Math.min(p.step || 0, 3));
  p.step = step;
  const s = l.steps[Math.min(step, 2)];
  return `<div class="lesson-top"><a class="text-link" href="#learn">${icon("back")}All lessons</a><button class="btn secondary" data-action="pause">Pause & save ${icon("bookmark")}</button></div>${header(l.title, `${paths[l.path].title} · ${l.minutes} minutes suggested · Take as long as you need`)}<div class="lesson-layout"><aside class="lesson-outline"><h2>Your lesson</h2><ol>${l.steps.map((s, i) => `<li><button data-step="${i}" class="${step === i ? "current" : ""}" ${step === i ? 'aria-current="step"' : ""}><span>${p.answers?.[i] === s.answer ? icon("check") : i + 1}</span>${s.title}</button></li>`).join("")}<li><button data-step="3" class="${step === 3 ? "current" : ""}"><span>${p.complete ? icon("check") : 4}</span>Practice & takeaways</button></li></ol><p>There’s no timer.<br>You can revisit any step.</p></aside><section class="lesson-content" id="lesson-content">${step < 3 ? `<div class="section-top"><span class="muted">Part ${step + 1} of 4</span>${btn("Listen", "listen", "secondary", "sound")}</div>${meter(step, 4)}<h2>${s.title}</h2><p class="lesson-text" id="spoken-text">${state.prefs.short ? s.simple : s.text}</p>${state.prefs.experience ? `<p class="experience-note">Build on what you know: ${l.path === "digital" ? "checking details and following a clear sequence are skills you may already use." : "planning, teamwork, training, and recordkeeping can transfer across settings."}</p>` : ""}<div class="explain-controls">${btn("Say it simply", "simple", "text-button")}${btn("Show an example", "example", "text-button")}</div>${alternate ? `<div class="explanation" role="status">${alternate === "simple" ? s.simple : s.example}</div>` : ""}<fieldset class="knowledge-check"><legend>${s.question}</legend><p class="muted">A quick check. Try as many times as you like.</p>${s.choices.map((c, i) => `<button data-answer="${i}" class="choice ${p.answers?.[step] === i ? "selected" : ""}" aria-pressed="${p.answers?.[step] === i}"><span class="choice-dot">${p.answers?.[step] === i ? icon("check") : ""}</span>${c}</button>`).join("")}<div role="status" class="answer-feedback ${p.answers?.[step] === s.answer ? "correct" : ""}">${feedback || (p.answers?.[step] === s.answer ? "That’s right. You can continue when you’re ready." : "")}</div></fieldset><div class="lesson-actions"><button class="btn secondary" data-action="previous" ${step === 0 ? "disabled" : ""}>${icon("back")}Back</button><button class="btn primary" data-action="next" ${p.answers?.[step] !== s.answer ? "disabled" : ""}>${step === 2 ? "Try it yourself" : "Continue"}${icon("arrow")}</button></div>` : takeaways(l, p)}</section></div>`;
}
function takeaways(l, p) {
  return `<div class="section-top"><span class="muted">Part 4 of 4</span><span class="status-label">${p.complete ? "Lesson completed" : "Put it into practice"}</span></div><h2>${p.complete ? "A skill to take with you" : "Ready to try it yourself?"}</h2><p>${p.practice ? "Practice complete. Your checklist is ready below." : "Try the practice activity, then keep a checklist for the real thing."}</p><a class="btn ${p.practice ? "secondary" : "primary"}" href="#practice/${l.id}">${p.practice ? "Practice again" : "Open practice space"}${icon("arrow")}</a><h3>Your take-away checklist</h3><ul class="checklist">${l.checklist.map((x) => `<li>${icon("check")}${x}</li>`).join("")}</ul><label class="field-label" for="note">Your own notes</label><textarea id="note" data-note="${l.id}" rows="3" placeholder="What would you like to remember?">${esc(state.notes[l.id] || "")}</textarea><p class="small muted">Notes stay in this browser. Avoid entering sensitive information.</p><div class="wrap-actions"><button class="btn secondary" data-save="${l.id}">${icon("bookmark")}${state.saved.includes(l.id) ? "Saved to resources" : "Save checklist"}</button>${btn("Download checklist", "download-checklist", "secondary", "download")}</div><div class="lesson-actions">${btn("Back", "previous", "secondary", "back")}<button class="btn primary" data-action="complete" ${!p.practice || !l.steps.every((s, i) => p.answers?.[i] === s.answer) ? "disabled" : ""}>${p.complete ? "Return to my learning" : "Complete lesson"}${icon("check")}</button></div>${!p.practice || !l.steps.every((s, i) => p.answers?.[i] === s.answer) ? '<p class="muted small">Finish the three quick checks and the practice activity to complete this lesson.</p>' : ""}`;
}
function practiceList() {
  return (
    header(
      "A safe place to practice",
      "Try, repeat, and build confidence. Everything here is a simulation.",
    ) +
    `<div class="practice-intro">${icon("shield")}<p>Use sample details. Practice messages and applications never leave this app. Video practice does not access your camera or microphone.</p></div><div class="practice-list">${lessons.map((l) => `<article class="practice-row"><span class="practice-number">${icon(l.icon)}</span><div><h2>${l.title}</h2><p>${l.description}</p></div><a class="btn secondary" href="#practice/${l.id}">Try it ${icon("arrow")}</a></article>`).join("")}</div>`
  );
}
function field(name, label, value, placeholder = "", type = "text") {
  return `<label class="field-label" for="${name}">${label}</label><input id="${name}" name="${name}" data-draft="${name}" type="${type}" value="${esc(value || "")}" placeholder="${placeholder}"/>`;
}
function practice(id) {
  const l = getLesson(id);
  if (!l) return notFound();
  const p = ensureProgress(id),
    d = p.draft || {};
  let body = "";
  if (id === "email")
    body = `<div class="simulation-head">${icon("mail")}New practice message<span>Simulation</span></div><div class="simulation-body">${field("to", "To", d.to, "careers@example.com", "email")}${field("subject", "Subject", d.subject, "Résumé for operations role")}<label class="field-label" for="message">Message</label><textarea id="message" data-draft="message" rows="4" placeholder="Write a short message about your attachment…">${esc(d.message || "")}</textarea><button class="btn secondary" data-action="attach">${icon("attach")}${d.attached ? "Sample résumé.pdf attached" : "Attach sample résumé"}</button><p class="muted small">Use careers@example.com. This is a practice address.</p><button class="btn primary" data-action="send-practice">Send practice email ${icon("arrow")}</button></div>`; // taste-skill-ignore: reserved example domains are intentional offline practice destinations
  if (id === "video")
    body = `<div class="simulation-head">${icon("video")}Practice meeting<span>Simulation</span></div><div class="video-preview"><div class="video-initial">${icon(d.camera ? "video" : "shield")}</div><strong>${d.joined ? "You’re in the practice call" : d.camera ? "Sample camera preview" : "Your camera is off"}</strong><p>No camera or microphone access is used.</p>${d.captions ? '<div class="captions">Practice caption: “Welcome. Take your time getting settled.”</div>' : ""}</div><div class="simulation-body"><div class="wrap-actions"><button class="btn secondary" data-action="mic" aria-pressed="${!!d.mic}">${icon("mic")}${d.mic ? "Microphone on" : "Microphone muted"}</button><button class="btn secondary" data-action="camera" aria-pressed="${!!d.camera}">${icon("video")}${d.camera ? "Camera on" : "Camera off"}</button><button class="btn secondary" data-action="captions" aria-pressed="${!!d.captions}">Captions ${d.captions ? "on" : "off"}</button></div><p>Practice goal: join muted, turn on captions, then leave the call.</p><button class="btn primary" data-action="${d.joined ? "leave" : "join"}">${d.joined ? "Leave practice call" : "Join practice call"}${icon("arrow")}</button></div>`;
  if (id === "scams")
    body = `<div class="simulation-head">${icon("mail")}A message in your inbox<span>Simulation</span></div><div class="simulation-body"><p class="muted">From: Account Support &lt;urgent@account-check.example&gt;</p><h2>Last warning: act within 10 minutes</h2><p>Your account will be closed today. Send your verification code to keep access. Do not contact your usual support team.</p><div class="sample-link">Sample link: account-check.example/verify (not active)</div><fieldset class="scam-options"><legend>Which warning signs do you notice?</legend>${["Creates pressure to act immediately", "Asks for a private verification code", "Discourages independent verification"].map((x, i) => `<label><input type="checkbox" data-flag="${i}" ${d.flags?.includes(i) ? "checked" : ""}/> ${x}</label>`).join("")}</fieldset><label class="field-label" for="response">What would you do next?</label><select id="response" data-draft="response"><option value="">Choose a response</option><option value="verify" ${d.response === "verify" ? "selected" : ""}>Open the known official website myself</option><option value="reply" ${d.response === "reply" ? "selected" : ""}>Reply with my verification code</option><option value="link" ${d.response === "link" ? "selected" : ""}>Use the link in this message</option></select><button class="btn primary" data-action="check-scams">Check my choices ${icon("check")}</button></div>`;
  if (id === "resume")
    body = `<div class="simulation-head">${icon("briefcase")}Your experience, in plain language<span>Practice</span></div><div class="simulation-body"><p>Use a public, non-sensitive example. You can also use the sample below.</p>${btn("Use a sample", "resume-sample", "secondary")} ${field("action", "What did you do?", d.action, "Organized weekly equipment checks")}${field("result", "What did that help achieve?", d.result, "Kept maintenance records current")}<label class="field-label" for="skill">Skill this demonstrates</label><select id="skill" data-draft="skill"><option value="">Choose a skill</option>${["Organization", "Teamwork", "Training", "Problem solving", "Recordkeeping"].map((x) => `<option ${d.skill === x ? "selected" : ""}>${x}</option>`).join("")}</select><button class="btn primary" data-action="build-resume">Build my statement ${icon("arrow")}</button>${d.statement ? `<div class="explanation"><h3>Your draft statement</h3><p>${esc(d.statement)}</p><p class="small">Skill: ${esc(d.skill)}</p><p class="muted small">Review for accuracy. This uses your words; it does not verify the claim.</p>${btn("Download statement", "download-statement", "secondary", "download")}</div>` : ""}</div>`;
  if (id === "application")
    body = `<div class="simulation-head">${icon("file")}Operations assistant application<span>Simulation</span></div><div class="simulation-body"><p>Practice with fictional details. This is not a real job listing.</p>${btn("Fill sample details", "application-sample", "secondary")}${field("name", "Full name", d.name, "Jordan Ellis")}${field("email", "Email address", d.email, "jordan@example.com", "email")}<button class="btn secondary" data-action="attach">${icon("attach")}${d.attached ? "Sample résumé.pdf attached" : "Attach sample résumé"}</button><label class="check-label"><input type="checkbox" id="consent" data-draft="consent" ${d.consent ? "checked" : ""}/> I have reviewed these sample details and understand this is a practice submission.</label><button class="btn primary" data-action="review-application">Review application ${icon("arrow")}</button>${d.review ? `<div class="explanation"><h3>Review your sample application</h3><p>${esc(d.name)} · ${esc(d.email)}</p><p>Attachment: Sample résumé.pdf</p>${btn("Submit practice application", "submit-application", "primary")}</div>` : ""}</div>`; // taste-skill-ignore: reserved example domains are intentional offline practice destinations
  if (id === "interview")
    body = `<div class="simulation-head">${icon("chat")}Interview rehearsal<span>Practice</span></div><div class="simulation-body"><h2>Tell me about a problem you solved.</h2><p>Use a real example you can discuss publicly, or begin with a sample.</p>${btn("Use a sample", "interview-sample", "secondary")}${[
      ["situation", "What was the situation?"],
      ["action", "What did you do?"],
      ["result", "What happened, and what did you learn?"],
    ]
      .map(
        ([k, t]) =>
          `<label class="field-label" for="${k}">${t}</label><textarea id="${k}" data-draft="${k}" rows="3">${esc(d[k] || "")}</textarea>`,
      )
      .join(
        "",
      )}<button class="btn primary" data-action="rehearse">Put my answer together ${icon("arrow")}</button>${d.answer ? `<div class="explanation"><h3>Your practice answer</h3><p id="spoken-text">${esc(d.answer)}</p><div class="wrap-actions">${btn("Read aloud", "listen", "secondary", "sound")}${btn("Download answer", "download-answer", "secondary", "download")}</div><p class="muted small">Read this aloud yourself, then revise any phrases that don’t sound like you.</p></div>` : ""}</div>`;
  return `<div class="lesson-top"><a class="text-link" href="#practice">${icon("back")}All practice activities</a><a class="text-link" href="#lesson/${id}">Read the lesson ${icon("book")}</a></div>${header(l.title, "A safe space to try. Nothing is sent to an employer or another person.")}<div class="practice-layout"><section class="simulation">${body}<div class="practice-feedback ${p.practice ? "correct" : ""}" role="status">${feedback || (p.practice ? "You’ve completed this practice. You can repeat it anytime." : "")}</div>${p.practice ? `<div class="simulation-body"><a class="btn secondary" href="#lesson/${id}" data-return="${id}">Continue to my checklist ${icon("arrow")}</a></div>` : ""}</section><aside class="practice-guide"><h2>Take your time</h2><p>It’s okay to try again. This space is here for practice, not a perfect score.</p>${btn(showHint ? "Hide hint" : "I’d like a hint", "hint", "secondary", "help")}${showHint ? `<div class="hint">${hintFor(id)}</div>` : ""}<h3>What you’re practicing</h3><ul>${l.checklist.map((t) => `<li>${t}</li>`).join("")}</ul></aside></div>`;
}
function hintFor(id) {
  return {
    email:
      "Use careers@example.com, write a subject and message, and attach the sample résumé before sending.", // taste-skill-ignore: reserved domain required by safe practice exercise
    video:
      "Keep the microphone muted, switch captions on, join the call, then choose Leave practice call.",
    scams:
      "All three statements are warning signs. Verify the alert through a known official website you open yourself.",
    resume:
      "Choose an action and a result. Use the sample if you want help getting started. Add only facts you can support.",
    application:
      "Use Fill sample details, attach the sample résumé, and read the review checkbox before checking it.",
    interview:
      "Use one sentence for the situation, one for your action, and one for the outcome. The sample shows the structure.",
  }[id];
} // taste-skill-ignore: reserved example domains are intentional offline practice destinations
function progressPage() {
  const st = stats(state);
  return (
    header(
      "Your learning journey",
      "Progress is personal. There’s no deadline and no streak to keep.",
      btn("Share progress", "share", "secondary", "download"),
    ) +
    `<div class="stats-strip"><div><span>Lessons completed</span><strong>${st.completed} <small>of ${lessons.length}</small></strong></div><div><span>Practices completed</span><strong>${lessons.filter((l) => progressFor(state, l.id).practice).length} <small>of ${lessons.length}</small></strong></div><div><span>Saved resources</span><strong>${st.saved}</strong></div></div><div class="path-grid">${Object.entries(
      paths,
    )
      .map(
        ([id, path]) =>
          `<section class="path-panel"><h2>${path.title}</h2>${meter(lessons.filter((l) => l.path === id && progressFor(state, l.id).complete).length, 3)}${lessons
            .filter((l) => l.path === id)
            .map(lessonRow)
            .join("")}</section>`,
      )
      .join(
        "",
      )}</div><section class="reflection"><h2>Skills you can take with you</h2>${
      st.completed
        ? `<div class="wrap-actions">${lessons
            .filter((l) => progressFor(state, l.id).complete)
            .map(
              (l) => `<span class="earned">${icon("check")}${l.skill}</span>`,
            )
            .join("")}</div>`
        : '<p>Complete a lesson to see your skills here. Start with something you want to use in everyday life.</p><a class="text-link" href="#learn">Explore lessons ' +
          icon("arrow") +
          "</a>"
    }</section>`
  );
}
function savedPage() {
  const saved = lessons.filter((l) => state.saved.includes(l.id));
  return (
    header(
      "Keep the useful things",
      "Your checklists and notes, ready when you need them.",
    ) +
    (saved.length
      ? `<div class="library-grid">${saved.map((l) => `<section class="library-card"><div class="section-top"><h2>${l.title}</h2><button class="icon-btn" data-save="${l.id}" aria-label="Remove ${l.title} from saved">${icon("close")}</button></div><ul class="checklist">${l.checklist.map((t) => `<li>${icon("check")}${t}</li>`).join("")}</ul>${state.notes[l.id] ? `<p class="saved-note">${esc(state.notes[l.id])}</p>` : ""}<a class="text-link" href="#lesson/${l.id}">Revisit lesson ${icon("arrow")}</a></section>`).join("")}</div>`
      : `<section class="empty-panel">${icon("bookmark")}<h2>A place for what helps</h2><p>Save a lesson or its checklist to find it here later.</p><a class="btn primary" href="#learn">Find a lesson ${icon("arrow")}</a></section>`)
  );
}
function toggle(k, title, desc) {
  return `<div class="setting-row"><div><label for="pref-${k}">${title}</label><p>${desc}</p></div><input class="switch" type="checkbox" role="switch" id="pref-${k}" data-pref="${k}" ${state.prefs[k] ? "checked" : ""}/></div>`;
}
function settings() {
  return (
    header(
      "Make learning yours",
      "Changes apply immediately and stay saved on this device.",
    ) +
    `<div class="settings-section"><div><h2>Your learning path</h2><p>You don’t need to share a diagnosis or service history.</p></div><div class="settings-panel"><label class="field-label" for="pref-name">What should we call you? (optional)</label><input id="pref-name" data-pref="name" maxlength="30" value="${esc(state.prefs.name)}" autocomplete="given-name"/><label class="field-label" for="pref-goal">What would you like to work on?</label><select id="pref-goal" data-pref="goal">${[
      ["either", "A little of both"],
      ["digital", "Everyday technology"],
      ["career", "Civilian career skills"],
    ]
      .map(
        ([k, t]) =>
          `<option value="${k}" ${state.prefs.goal === k ? "selected" : ""}>${t}</option>`,
      )
      .join(
        "",
      )}</select></div></div><div class="settings-section"><div><h2>Reading & display</h2><p>Choose what feels comfortable. The preview changes with you.</p><div class="settings-preview"><strong>Your next step</strong><p>Take your time. You can repeat any part of a lesson.</p></div></div><div class="settings-panel"><label class="field-label" for="pref-size">Text size</label><select id="pref-size" data-pref="size">${[
      ["standard", "Standard"],
      ["large", "Large"],
      ["larger", "Extra large"],
    ]
      .map(
        ([k, t]) =>
          `<option value="${k}" ${state.prefs.size === k ? "selected" : ""}>${t}</option>`,
      )
      .join(
        "",
      )}</select>${toggle("contrast", "Higher contrast", "Darker text and stronger control outlines.")}${toggle("short", "Shorter explanations", "Show concise lesson text first.")}${toggle("focus", "Focus view", "Hide the lesson outline while you read.")}</div></div><div class="settings-section"><div><h2>Sound & movement</h2><p>You control when audio plays. All lessons are available as text.</p></div><div class="settings-panel">${toggle("motion", "Reduce motion", "Keep transitions to a minimum.")}${toggle("sound", "Completion sound", "Play a gentle sound after a successful practice.")}${toggle("experience", "Connect to existing skills", "Include optional connections to planning and teamwork.")}<label class="field-label" for="pref-rate">Read-aloud speed</label><select id="pref-rate" data-pref="rate">${[
      ["0.8", "Slower"],
      ["1", "Normal"],
      ["1.2", "Faster"],
    ]
      .map(
        ([k, t]) =>
          `<option value="${k}" ${state.prefs.rate === k ? "selected" : ""}>${t}</option>`,
      )
      .join(
        "",
      )}</select>${btn("Test read aloud", "test-audio", "secondary", "sound")}</div></div><div class="settings-section"><div><h2>Your data & devices</h2><p>Progress lives in this browser, not an online account. Export a backup to move it to another device.</p></div><div class="settings-panel"><div class="wrap-actions">${btn("Export backup", "export", "secondary", "download")}${btn("Import backup", "import", "secondary")}${btn("Install app", "install", "secondary")}</div><p class="muted small">A backup includes your name, preferences, notes, and practice drafts. Only share it with people you choose.</p>${btn("Reset my learning data", "reset", "text-button danger")}</div></div>`
  );
}
function help() {
  return (
    header(
      "A little help, when you need it",
      "You are in control of how you learn and what you share.",
    ) +
    `<div class="help-grid"><section class="path-panel"><h2>Learning with VeTeacher</h2><details open><summary>Where should I start?</summary><p>Choose a lesson in Everyday technology or Your next career. Read a short step, try the quick check, then practice. You can repeat anything.</p></details><details><summary>Can I stop halfway through?</summary><p>Yes. Your answers, notes, and practice drafts save in this browser as you work. Use Pause & save, or simply return later on the same device.</p></details><details><summary>How do I use this on my phone?</summary><p>Open the same website in your phone browser. Use its Add to Home Screen or Install app option where supported. Use a backup from Preferences to transfer progress between devices.</p></details><details><summary>Does the app work offline?</summary><p>After a successful online visit, the app caches its lessons and practice activities for offline use where the browser supports it. Browser read-aloud voices may still need a connection.</p></details></section><section class="path-panel"><h2>Learn with someone you trust</h2><p>A friend, family member, or mentor can practice alongside you. You decide what they see.</p>${btn("Prepare a help request", "request-help", "secondary", "chat")}<p class="muted small">Prepare and copy a message yourself. VeTeacher doesn’t contact anyone automatically.</p><h3>Share an accomplishment</h3><p>Create a short summary of completed lessons, without sharing your private notes.</p>${btn("Preview progress summary", "share", "secondary")}</section><section class="path-panel"><h2>About this first version</h2><p>VeTeacher is an independent learning project for veterans. It is not affiliated with the VA, an employer, or a benefits provider.</p><p>The lessons teach practical skills. Accessibility preferences support learning; they do not diagnose or treat a condition.</p><p>All job listings, call participants, and email addresses inside practice activities are fictional examples.</p></section><section class="path-panel"><h2>Make it comfortable</h2><p>Change text size, contrast, movement, or explanation length at any time. Read-aloud controls are available inside lessons.</p><a class="btn secondary" href="#settings">Learning preferences ${icon("arrow")}</a></section></div>`
  );
}
function notFound() {
  return (
    header("Let’s find your place", "That lesson or page is not available.") +
    '<a class="btn primary" href="#home">Return to my learning</a>'
  );
}
function render(focus = false) {
  const active = document.activeElement;
  const identity = active?.id
    ? { id: active.id }
    : active?.dataset?.action
      ? { action: active.dataset.action }
      : active?.dataset?.answer !== undefined
        ? { answer: active.dataset.answer }
        : null;
  applyPrefs();
  const [r, id] = route();
  let content =
    r === "home"
      ? home()
      : r === "learn"
        ? learn()
        : r === "lesson"
          ? lesson(id)
          : r === "practice"
            ? id
              ? practice(id)
              : practiceList()
            : r === "progress"
              ? progressPage()
              : r === "saved"
                ? savedPage()
                : r === "settings"
                  ? settings()
                  : r === "help"
                    ? help()
                    : notFound();
  $("#app").innerHTML = shell(content);
  document.title = `${{ home: "My learning", learn: "Learning paths", practice: "Practice space", progress: "My progress", saved: "Saved resources", settings: "Learning preferences", help: "Help & support" }[r] || getLesson(id)?.title || "Learning"} — VeTeacher`;
  if (focus) {
    $("h1")?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  } else if (identity) {
    const target = identity.id
      ? document.getElementById(identity.id)
      : identity.action
        ? document.querySelector('[data-action="' + identity.action + '"]')
        : document.querySelector('[data-answer="' + identity.answer + '"]');
    target?.focus({ preventScroll: true });
  }
}
function modal(html) {
  $("#modal").innerHTML =
    `<button class="icon-btn modal-close" data-action="close" aria-label="Close dialog">${icon("close")}</button>${html}`;
  $("#modal").showModal();
}
function closeModal() {
  $("#modal").close();
}
function download(name, text, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function summary() {
  const complete = lessons.filter((l) => progressFor(state, l.id).complete);
  return `My VeTeacher progress\n\n${complete.length} of ${lessons.length} lessons completed.\n${complete.map((l) => "• " + l.title).join("\n")}\n\nI’m learning at my own pace.`;
}
function speak(text) {
  if (!("speechSynthesis" in window)) {
    toast(
      "Read aloud is unavailable in this browser. The full lesson is available as text.",
    );
    return;
  }
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    toast("Read aloud stopped.");
    return;
  }
  const u = new SpeechSynthesisUtterance(text);
  u.rate = Number(state.prefs.rate);
  u.onerror = () =>
    toast("Audio could not play. Try another browser or use the lesson text.");
  speechSynthesis.speak(u);
  toast("Reading aloud. Select Listen again to stop.");
}
function success(id, message) {
  ensureProgress(id).practice = true;
  save();
  feedback = message;
  if (state.prefs.sound) {
    try {
      const c = new (window.AudioContext || window.webkitAudioContext)(),
        o = c.createOscillator(),
        g = c.createGain();
      o.connect(g);
      g.connect(c.destination);
      o.frequency.value = 523;
      g.gain.setValueAtTime(0.035, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
      o.start();
      o.stop(c.currentTime + 0.3);
      o.onended = () => c.close();
    } catch {}
  }
  render();
}
function onboarding() {
  modal(
    `<div class="onboarding-mark"><img src="./icon.svg" alt=""/></div><h2>A little more comfortable.</h2><p>Choose what helps you learn. You can change this anytime.</p>${toggle("short", "Keep it short", "Start with concise explanations.")}${toggle("contrast", "Higher contrast", "Make text and controls stand out.")}<label class="field-label" for="onboard-size">Text size</label><select id="onboard-size" data-pref="size"><option value="standard">Standard</option><option value="large">Large</option><option value="larger">Extra large</option></select><div class="wrap-actions">${btn("Start learning", "onboard-done", "primary", "arrow")}${btn("Explore preferences", "onboard-settings", "secondary")}</div><p class="small muted">No account or medical details needed. Progress stays on this device.</p>`,
  );
}
document.addEventListener("click", async (e) => {
  if (e.target.closest(".skip")) {
    e.preventDefault();
    $("#main").focus();
    return;
  }
  const el = e.target.closest(
    "[data-action],[data-answer],[data-step],[data-save],[data-filter],[data-return]",
  );
  if (!el) return;
  const [r, id] = route(),
    l = getLesson(id),
    p = l ? ensureProgress(id) : null,
    d = p ? (p.draft ??= {}) : null;
  if (el.dataset.return) {
    ensureProgress(el.dataset.return).step = 3;
    save();
    return;
  }
  if (el.dataset.save) {
    const id = el.dataset.save;
    state.saved = state.saved.includes(id)
      ? state.saved.filter((x) => x !== id)
      : [...state.saved, id];
    save();
    render();
    toast(
      state.saved.includes(id)
        ? "Saved to your resources."
        : "Removed from saved resources.",
    );
    return;
  }
  if (el.dataset.filter) {
    filter = el.dataset.filter;
    go("learn");
    return;
  }
  if (el.dataset.step !== undefined) {
    p.step = +el.dataset.step;
    feedback = "";
    alternate = "";
    window.speechSynthesis?.cancel();
    save();
    render(true);
    return;
  }
  if (el.dataset.answer !== undefined) {
    const i = +el.dataset.answer;
    p.answers ??= {};
    p.answers[p.step] = i;
    feedback =
      i === l.steps[p.step].answer
        ? "That’s right. Continue when you’re ready."
        : "Not quite. Read the explanation again or try another answer. There’s no penalty.";
    save();
    render();
    return;
  }
  const a = el.dataset.action;
  if (a === "onboarding") {
    onboarding();
    return;
  }
  if (a === "close") {
    closeModal();
    return;
  }
  if (a === "menu") {
    menu = !menu;
    render();
    return;
  }
  if (a === "profile") {
    go("settings");
    return;
  }
  if (a === "onboard-done" || a === "onboard-settings") {
    state.onboarded = true;
    save();
    closeModal();
    a === "onboard-settings" ? go("settings") : render();
    return;
  }
  if (a === "pause") {
    save();
    go("home");
    toast("Your place is saved. Come back when you’re ready.");
    return;
  }
  if (a === "simple" || a === "example") {
    alternate = alternate === a ? "" : a;
    render();
    return;
  }
  if (a === "listen") {
    speak($("#spoken-text")?.textContent || "Choose a lesson to listen.");
    return;
  }
  if (a === "test-audio") {
    speak(
      "Welcome to VeTeacher. Take your time. You can repeat any part of a lesson.",
    );
    return;
  }
  if (a === "next" || a === "previous") {
    if (a === "next" && p.answers[p.step] !== l.steps[p.step].answer) return;
    p.step = Math.max(0, Math.min(3, p.step + (a === "next" ? 1 : -1)));
    feedback = "";
    alternate = "";
    window.speechSynthesis?.cancel();
    save();
    render(true);
    return;
  }
  if (a === "complete") {
    if (p.practice && l.steps.every((s, i) => p.answers?.[i] === s.answer)) {
      p.complete = true;
      p.completedAt ??= new Date().toISOString();
      save();
      go("progress");
      toast("Lesson completed. Your progress is saved.");
    }
    return;
  }
  if (a === "download-checklist") {
    download(
      `${id}-checklist.txt`,
      `${l.title}\n\n${l.checklist.map((t) => "□ " + t).join("\n")}${state.notes[id] ? "\n\nMy notes\n" + state.notes[id] : ""}`,
    );
    return;
  }
  if (a === "hint") {
    showHint = !showHint;
    render();
    return;
  }
  if (a === "attach") {
    d.attached = !d.attached;
    d.review = false;
    save();
    render();
    return;
  }
  if (a === "send-practice") {
    if (emailValid(d))
      success(
        id,
        "Practice email sent successfully inside this simulation. You checked the recipient, wrote a message, and attached a file.",
      );
    else {
      feedback =
        "Check the To address is careers@example.com, add a subject and message, and attach the sample résumé."; // taste-skill-ignore: reserved domain required by safe practice exercise
      render();
    }
    return;
  }
  if (["mic", "camera", "captions"].includes(a)) {
    d[a] = !d[a];
    save();
    render();
    return;
  }
  if (a === "join") {
    if (d.mic || !d.captions) {
      feedback =
        "For this practice, mute your microphone and turn on captions before joining.";
      render();
    } else {
      d.joined = true;
      d.joinedReady = true;
      feedback =
        "You joined muted with captions on. Now leave the practice call.";
      save();
      render();
    }
    return;
  }
  if (a === "leave") {
    d.joined = false;
    if (d.joinedReady)
      success(
        id,
        "You joined with your chosen settings and left the practice call. You’re in control.",
      );
    return;
  }
  if (a === "check-scams") {
    if (d.flags?.length === 3 && d.response === "verify")
      success(
        id,
        "You spotted all three warning signs and chose independent verification. No message or link was opened.",
      );
    else {
      feedback =
        "There are three warning signs. Look for pressure, a request for a code, and instructions not to verify. Choose a trusted route to check.";
      render();
    }
    return;
  }
  if (a === "resume-sample") {
    Object.assign(d, {
      action: "Organized weekly equipment checks",
      result: "Kept maintenance records current",
      skill: "Organization",
    });
    save();
    render();
    return;
  }
  if (a === "build-resume") {
    if (!d.action?.trim() || !d.result?.trim() || !d.skill) {
      feedback =
        "Add an action, an outcome, and a skill. You can start with the sample.";
      render();
    } else {
      d.statement = `${d.action.trim().replace(/[.!]$/, "")}. ${d.result.trim().replace(/[.!]$/, "")}.`;
      success(
        id,
        "Your draft is ready. Review it for accuracy and adjust the wording to sound like you.",
      );
    }
    return;
  }
  if (a === "download-statement") {
    download("my-experience-statement.txt", d.statement || "");
    return;
  }
  if (a === "application-sample") {
    Object.assign(d, {
      name: "Jordan Ellis",
      email: "jordan@example.com", // taste-skill-ignore: reserved domain required by safe practice exercise
      review: false,
    });
    save();
    render();
    return;
  }
  if (a === "review-application") {
    if (applicationValid(d)) {
      d.review = true;
      feedback =
        "Review the summary below, then submit the practice application.";
    } else
      feedback =
        "Add a name and valid email, attach the sample résumé, and read the review checkbox before checking it.";
    save();
    render();
    return;
  }
  if (a === "submit-application") {
    if (applicationValid(d) && d.review)
      success(
        id,
        "Practice application complete. No information was submitted to an employer.",
      );
    return;
  }
  if (a === "interview-sample") {
    Object.assign(d, {
      situation: "Our team needed a clearer way to track maintenance.",
      action:
        "I created a shared checklist and asked teammates to record completed checks.",
      result:
        "Missed checks became easier to spot. I learned to keep instructions simple.",
    });
    save();
    render();
    return;
  }
  if (a === "rehearse") {
    if (!["situation", "action", "result"].every((k) => d[k]?.trim())) {
      feedback =
        "Add a situation, your action, and the outcome, or use the sample.";
      render();
    } else {
      d.answer = [d.situation, d.action, d.result]
        .map((x) => x.trim())
        .join(" ");
      success(
        id,
        "Your practice answer is ready. Rehearse it in your own voice, without a timer.",
      );
    }
    return;
  }
  if (a === "download-answer") {
    download("my-interview-answer.txt", d.answer || "");
    return;
  }
  if (a === "share") {
    modal(
      `<h2>Share only what you choose</h2><p>This summary contains completed lesson names. It leaves out your notes and practice drafts.</p><textarea id="share-text" rows="8" readonly>${esc(summary())}</textarea><div class="wrap-actions">${btn("Copy summary", "copy", "primary")}${btn("Download summary", "download-summary", "secondary", "download")}</div>`,
    );
    return;
  }
  if (a === "request-help") {
    modal(
      `<h2>Ask someone you trust</h2><p>Edit this message, then copy it into your own email or messaging app.</p><textarea id="share-text" rows="5">I’m practicing some new skills with VeTeacher. Would you be willing to sit with me while I work through a lesson? I’d appreciate patient guidance and a chance to try each step myself.</textarea>${btn("Copy message", "copy", "primary")}`,
    );
    return;
  }
  if (a === "copy") {
    try {
      await navigator.clipboard.writeText($("#share-text").value);
      toast("Copied. You choose where to share it.");
    } catch {
      $("#share-text").select();
      toast("Select and copy the text to share it.");
    }
    return;
  }
  if (a === "download-summary") {
    download("veteacher-progress.txt", summary());
    return;
  }
  if (a === "export") {
    download(
      "veteacher-backup.json",
      JSON.stringify({ version: 1, ...state }, null, 2),
      "application/json",
    );
    return;
  }
  if (a === "import") {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";
    input.onchange = async () => {
      try {
        const file = input.files[0];
        if (!file || file.size > 2e6) throw Error();
        const data = JSON.parse(await file.text());
        if (
          data.version !== 1 ||
          !data.progress ||
          typeof data.progress !== "object" ||
          Array.isArray(data.progress) ||
          !Array.isArray(data.saved) ||
          !data.prefs ||
          typeof data.prefs !== "object"
        )
          throw Error();
        const clean = {
          prefs: { ...defaults },
          progress: {},
          saved: data.saved.filter((id) => !!getLesson(id)),
          notes: {},
          onboarded: true,
          last: getLesson(data.last) ? data.last : null,
        };
        for (const k of Object.keys(defaults)) {
          if (typeof data.prefs[k] === typeof defaults[k])
            clean.prefs[k] = data.prefs[k];
        }
        clean.prefs.name = clean.prefs.name.slice(0, 30);
        if (!["standard", "large", "larger"].includes(clean.prefs.size))
          clean.prefs.size = "standard";
        if (!["digital", "career", "either"].includes(clean.prefs.goal))
          clean.prefs.goal = "either";
        if (!["0.8", "1", "1.2"].includes(clean.prefs.rate))
          clean.prefs.rate = "1";
        for (const l of lessons) {
          const p = data.progress[l.id];
          if (p && typeof p === "object") {
            const answers = {};
            for (let i = 0; i < 3; i++)
              if (
                Number.isInteger(p.answers?.[i]) &&
                p.answers[i] >= 0 &&
                p.answers[i] < 3
              )
                answers[i] = p.answers[i];
            const draft = {};
            if (p.draft && typeof p.draft === "object")
              for (const [k, v] of Object.entries(p.draft)) {
                if (typeof v === "string") draft[k] = v.slice(0, 10000);
                else if (typeof v === "boolean") draft[k] = v;
                else if (k === "flags" && Array.isArray(v))
                  draft[k] = [
                    ...new Set(v.filter((x) => [0, 1, 2].includes(x))),
                  ];
              }
            clean.progress[l.id] = {
              step: Number.isInteger(p.step)
                ? Math.max(0, Math.min(3, p.step))
                : 0,
              answers,
              practice: p.practice === true,
              complete:
                p.complete === true &&
                p.practice === true &&
                l.steps.every((s, i) => answers[i] === s.answer),
              draft,
            };
          }
          if (typeof data.notes?.[l.id] === "string")
            clean.notes[l.id] = data.notes[l.id].slice(0, 10000);
        }
        modal(
          `<h2>Replace this device’s progress?</h2><p>This backup contains ${stats(clean).completed} completed lessons. Importing replaces your current preferences, notes, and progress.</p>${btn("Import this backup", "confirm-import", "primary")}`,
        );
        $("#modal").querySelector('[data-action="confirm-import"]').onclick =
          () => {
            state = clean;
            save();
            closeModal();
            render();
            toast("Backup imported.");
          };
      } catch {
        toast(
          "That backup could not be read. Choose a VeTeacher JSON backup under 2 MB.",
        );
      }
    };
    input.click();
    return;
  }
  if (a === "reset") {
    modal(
      `<h2>Reset your learning data?</h2><p>This removes preferences, notes, practice drafts, and progress from this browser. Download a backup first if you want to keep them.</p>${btn("Reset this device", "confirm-reset", "secondary danger")}`,
    );
    return;
  }
  if (a === "confirm-reset") {
    state = {
      prefs: { ...defaults },
      progress: {},
      saved: [],
      notes: {},
      onboarded: true,
      last: null,
    };
    save();
    closeModal();
    go("home");
    render();
    toast("Learning data reset on this device.");
    return;
  }
  if (a === "install") {
    if (installPrompt) {
      await installPrompt.prompt();
      installPrompt = null;
    } else
      modal(
        `<h2>Keep VeTeacher close</h2><p>On iPhone or iPad, open this site in Safari, choose Share, then Add to Home Screen.</p><p>On Android or desktop, look in your browser menu for Install app or Add to Home screen. Availability depends on your browser.</p><p>Your progress stays in this browser. Use Export backup to move it to another device.</p>`,
      );
    return;
  }
}); // taste-skill-ignore: reserved example domains are intentional offline practice destinations
document.addEventListener("input", (e) => {
  const el = e.target;
  const [, id] = route();
  if (el.dataset.draft) {
    const p = ensureProgress(id);
    p.draft ??= {};
    p.draft[el.dataset.draft] = el.type === "checkbox" ? el.checked : el.value;
    p.draft.review = false;
    save();
  }
  if (el.dataset.flag !== undefined) {
    const p = ensureProgress(id);
    p.draft ??= {};
    p.draft.flags = p.draft.flags || [];
    p.draft.flags = el.checked
      ? [...new Set([...p.draft.flags, +el.dataset.flag])]
      : p.draft.flags.filter((x) => x !== +el.dataset.flag);
    save();
  }
  if (el.dataset.note) {
    state.notes[el.dataset.note] = el.value;
    save();
  }
  if (el.id === "search") {
    search = el.value;
    const pos = el.selectionStart;
    render();
    $("#search").focus();
    $("#search").setSelectionRange(pos, pos);
  }
});
document.addEventListener("change", (e) => {
  const el = e.target;
  if (el.dataset.pref) {
    state.prefs[el.dataset.pref] =
      el.type === "checkbox" ? el.checked : el.value;
    save();
    applyPrefs();
    toast("Preference saved.");
  }
});
window.addEventListener("hashchange", () => {
  menu = false;
  feedback = "";
  showHint = false;
  alternate = "";
  window.speechSynthesis?.cancel();
  render(true);
});
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installPrompt = e;
});
render();
if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("./sw.js").catch(() => {});
