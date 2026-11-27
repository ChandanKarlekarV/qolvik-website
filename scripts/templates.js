// =========================================================
//  TEMPLATES — pure HTML-string builders (no DOM).
//  Used in the browser AND by build.js to pre-render content
//  into the HTML, so search engines see it without JavaScript.
// =========================================================
import { SERVICES, STACK, TEAM, TEAM_GROUPS, FAQ, PROJECTS, SOCIALS, CONTACT, BRAND } from "./config.js";
import { icon } from "./icons.js";
import { MINIS } from "./minis.js";

export const STACK_ALL = Object.values(STACK).flat();
export const PILL = '<span class="segmented__pill" aria-hidden="true"></span>';
export const tabButtons = (values) => values.map((v, i) => `<button type="button" data-value="${v}" aria-pressed="${i === 0}">${v}</button>`).join("");

// ---------- Marquee ----------
export function marqueeHTML(row) {
  const half = Math.ceil(STACK_ALL.length / 2);
  const list = row === 0 ? STACK_ALL.slice(0, half) : STACK_ALL.slice(half);
  const html = list.map((t) => `<span class="mq"><b>${t.mono}</b>${t.name}</span>`).join("");
  return html + html; // doubled for a seamless loop
}

// ---------- Services ----------
export const servicesHTML = () => SERVICES.map((s, i) => `
    <a class="srow" href="#contact" data-pv="${s.preview}">
      <span class="srow__num">${String(i + 1).padStart(2, "0")}</span>
      <h3>${s.title}</h3>
      <div class="srow__body"><p>${s.desc}</p><div class="srow__tags">${s.tags.map((t) => `<span>${t}</span>`).join("")}</div></div>
      <span class="srow__arrow" aria-hidden="true"><svg><use href="#arrow"/></svg></span>
    </a>`).join("");

// ---------- Design catalog ----------
export const CATALOG_TABS = ["All", ...new Set(Object.values(MINIS).map((m) => m.cat))];
export function catalogCard(key) {
  const m = MINIS[key];
  return `
    <article class="ccard" data-cat="${m.cat}" data-key="${key}">
      <div class="ccard__frame" data-mini-host></div>
      <div class="ccard__meta">
        <div><span class="tag tag--grey">${m.cat}</span><h3>${m.title}</h3><p>${m.kind}</p></div>
        <span class="ccard__hint"><span class="pulse"></span>${m.hint}</span>
      </div>
    </article>`;
}
export const catalogHTML = () => Object.keys(MINIS).map(catalogCard).join("");

// ---------- Stack ----------
export const STACK_TABS = Object.keys(STACK);
export const stackTilesHTML = (cat) => STACK[cat].map((t) => `<div class="tile spotlight"><span class="tile__mono">${t.mono}</span><b>${t.name}</b><span>${t.note}</span></div>`).join("");

// ---------- Campus ERP feature columns ----------
export const ERP_FEATS = {
  school: [["Attendance in seconds", "One tap per class, instant SMS to parents of absent students."], ["Fees without chasing", "Instalments, online payment and automatic reminders."], ["Report cards, your format", "CBSE, ICSE and State board layouts out of the box."], ["Parent app included", "Homework, circulars and results on every parent's phone."]],
  college: [["Semester registration", "Credit-based courses, electives and approvals online."], ["Exam cell workflows", "Internal marks, hall tickets and results in one flow."], ["Hostel & library", "Room allotment, mess fees and book issue in one place."], ["Placements & alumni", "Drives, offers and alumni records, all tracked."]],
  university: [["Multi-campus control", "Departments and affiliated colleges on one platform."], ["Accreditation-ready", "NAAC/NIRF style reports generated from live data."], ["Research & faculty", "Grants, publications and faculty records."], ["Role-based access", "Fine-grained permissions for every department."]],
};
export const erpFeatsHTML = (key) => ERP_FEATS[key].map(([t, d], i) => `<li><span class="mono">0${i + 1}</span><b>${t}</b><p>${d}</p></li>`).join("");

// ---------- Team ----------
const TONES = [
  { tone: "var(--mono-800)", ink: "var(--clay-100)" },
  { tone: "var(--clay-400)", ink: "var(--mono-900)" },
  { tone: "var(--mono-700)", ink: "var(--clay-200)" },
  { tone: "var(--clay-200)", ink: "var(--mono-900)" },
  { tone: "var(--mono-600)", ink: "var(--mono-0)" },
];
const initials = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
export const TEAM_TABS = ["All", ...TEAM_GROUPS];
export const teamCountText = () => `${TEAM.length} people, two co-founders — no account managers, you talk to the people who design and build.`;
const realUrl = (u) => /^https?:\/\//.test(u || "");
// Photo: a black-and-white layer with the colour photo on top, faded in on hover (opacity only = smooth).
const photoHTML = (m) => `
          <img class="member__img member__img--bw" src="${m.photo}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="720" height="756" />
          <img class="member__img member__img--color" src="${m.photo}" alt="${m.name}, ${m.role} at Qolvik" loading="lazy" decoding="async" width="720" height="756" />`;
export const teamHTML = () => TEAM.map((m, i) => {
  const t = TONES[i % TONES.length];
  const links = Object.entries(m.links || {}).filter(([, url]) => realUrl(url)).map(([k, url]) =>
    `<a href="${url}" aria-label="${m.name} on ${k === "linkedin" ? "LinkedIn" : k}" target="_blank" rel="noopener me">${icon(k)}</a>`).join("");
  return `
      <article class="member" data-team-of="${m.team}" tabindex="0">
        <div class="member__photo${m.photo ? " has-photo" : ""}" style="--tone:${t.tone};--ink:${t.ink}">
          ${m.photo ? photoHTML(m) : `<span class="member__initials" aria-hidden="true">${initials(m.name)}</span>`}
          <div class="member__overlay"><p>${m.bio}</p>${links ? `<div class="member__links">${links}</div>` : ""}</div>
        </div>
        <div class="member__info"><div><h3>${m.name}</h3><span class="member__role">${m.role}</span></div><span class="member__team">${m.team}</span></div>
      </article>`;
}).join("");

// ---------- FAQ ----------
export const faqHTML = () => FAQ.map((f, i) => {
  const p = PROJECTS.find((x) => x.id === f.ex);
  return `
    <div class="acc${i === 0 ? " is-open" : ""}" data-ex="${f.ex || ""}">
      <button class="acc__btn" type="button" aria-expanded="${i === 0}" aria-controls="faq-${i}">${f.q}<span class="acc__icon" aria-hidden="true"></span></button>
      <div class="acc__panel" id="faq-${i}"><div class="acc__inner"><p>${f.a}</p>
        ${p ? `<div class="acc__ex"><div class="acc__ex-mini" data-mini-host></div><div class="acc__ex-text"><small class="mono">Example work</small><b>${p.title}</b><em>${f.exNote}</em><a class="link" href="projects.html#${p.id}">See the project →</a></div></div>` : ""}
      </div></div>
    </div>`;
}).join("");

// ---------- Projects page ----------
export const PROJECT_TABS = ["All", ...new Set(PROJECTS.map((p) => p.category))];
export const projectCardsHTML = () => PROJECTS.map((p) => `
  <article class="pcard" id="${p.id}" data-id="${p.id}" data-cat="${p.category}">
    <button class="pcard__hit" type="button" aria-label="Open project: ${p.title}" data-cursor="Open"></button>
    <div class="pcard__frame">
      ${p.concept ? '<span class="tag pcard__badge">Concept</span>' : ""}
      <div data-mini-host></div>
      <span class="pcard__open" aria-hidden="true"><svg><use href="#arrow"/></svg></span>
    </div>
    <div class="pcard__meta"><div><h2>${p.title}</h2><p>${p.type}</p><p class="visually-hidden">${p.summary}</p></div><span class="pcard__year">${p.year}</span></div>
  </article>`).join("");

// ---------- Social links ----------
export const socialsHTML = () => SOCIALS.filter((s) => realUrl(s.url)).map((s) => `
    <a class="social" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name} — ${s.handle}">
      <span class="social__icon">${icon(s.key)}</span>
      <span class="social__text"><b>${s.name}</b><small>${s.handle}</small></span>
      <span class="social__arrow">${icon("arrow-up-right")}</span>
    </a>`).join("");

// ---------- Contact helpers ----------
export const telHref = () => `tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`;
export const waHref = () => `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Qolvik, I'd like to talk about a project.")}`;
