// =========================================================
//  TEMPLATES — pure HTML-string builders (no DOM).
//  Used in the browser AND by build.js to pre-render content
//  into the HTML, so search engines see it without JavaScript.
// =========================================================
import { SERVICES, ERP, TEAM, FAQ, PROJECTS, SOCIALS, CONTACT, FOUNDER_NOTE } from "./config.js";
import { icon } from "./icons.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const realUrl = (u) => /^https?:\/\//.test(u || "");
const initials = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export const tabButtons = (values, labels = values) => values.map((v, i) => `<button type="button" data-value="${esc(v)}" aria-pressed="${i === 0}">${esc(labels[i])}</button>`).join("");

// ---------- Studio services ----------
export const servicesHTML = () => SERVICES.map((s) => `
        <li>${icon(s.icon)}<div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div></li>`).join("");

// ---------- Campus ERP features ----------
export const erpFeatsHTML = (key) => ERP[key].map((f) => `
        <li class="feat">${icon(f.icon)}<h3>${esc(f.t)}</h3><p>${esc(f.d)}</p></li>`).join("");

// ---------- Team: black & white photo, colour fades in on hover (opacity only) ----------
export const teamHTML = () => TEAM.map((m) => {
  const li = realUrl(m.links?.linkedin) ? `<a class="person__in" href="${m.links.linkedin}" target="_blank" rel="noopener me" aria-label="${esc(m.name)} on LinkedIn">${icon("linkedin")}</a>` : "";
  const photo = m.photo
    ? `<img class="person__img person__img--bw" src="${m.photo}" alt="" aria-hidden="true" loading="lazy" decoding="async" width="720" height="756" />
          <img class="person__img person__img--color" src="${m.photo}" alt="${esc(m.name)}, ${esc(m.role)} at Qolvik" loading="lazy" decoding="async" width="720" height="756" />`
    : `<span class="person__initials" aria-hidden="true">${initials(m.name)}</span>`;
  return `
      <li class="person" data-reveal>
        <div class="person__photo">
          ${photo}
          <span class="person__name">${esc(m.name)}</span>
        </div>
        <div class="person__info"><div><p class="person__role">${esc(m.role)}</p><p class="person__bio">${esc(m.bio)}</p></div>${li}</div>
      </li>`;
}).join("");

// ---------- Founder note ----------
export const founderHTML = () => {
  const n = FOUNDER_NOTE;
  return `
        <div class="letter__photo">${n.photo ? `<img src="${n.photo}" alt="${esc(n.by)}" loading="lazy" decoding="async" width="720" height="756" />` : ""}</div>
        <blockquote>
          <span class="tag-box tag-box--r"><b>A note</b> from the founder</span>
          ${n.text.map((p) => `<p>${esc(p)}</p>`).join("")}
          <footer><b>${esc(n.by)}</b><span class="muted">${esc(n.role)}, Qolvik</span></footer>
        </blockquote>`;
};

// ---------- FAQ (native <details>, works without JavaScript) ----------
export const faqHTML = () => FAQ.map((f, i) => `
        <details class="qa"${i === 0 ? " open" : ""}><summary>${esc(f.q)}<i aria-hidden="true"></i></summary><p>${esc(f.a)}</p></details>`).join("");

// ---------- Work cards ----------
const cardInner = (p) => `
        <div class="wcard__frame">${p.concept ? '<span class="wcard__badge">Concept</span>' : ""}<div data-mini-host></div></div>
        <div class="wcard__meta"><div><h3>${esc(p.title)}</h3><p>${esc(p.type)}</p></div><span class="label">${esc(p.category)}</span></div>`;

// Homepage: a few picks that link to the projects page
export const workHTML = (ids) => ids.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean).map((p) => `
      <a class="wcard" href="projects.html#${p.id}" data-id="${p.id}" data-reveal>${cardInner(p)}</a>`).join("");

// Projects page: every project, opens a detail sheet
export const PROJECT_TABS = ["All", ...new Set(PROJECTS.map((p) => p.category))];
export const projectCardsHTML = () => PROJECTS.map((p) => `
      <article class="pcard" id="${p.id}" data-id="${p.id}" data-cat="${esc(p.category)}">
        <button class="pcard__hit" type="button" aria-label="Open project: ${esc(p.title)}"></button>
        ${cardInner(p)}
        <p class="visually-hidden">${esc(p.summary)}</p>
      </article>`).join("");

// ---------- Social links (only real URLs are shown) ----------
export const socialsHTML = () => SOCIALS.filter((s) => realUrl(s.url)).map((s) => `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.name)}</a>`).join("");

// ---------- Contact helpers ----------
export const telHref = () => `tel:${CONTACT.phone.replace(/[^\d+]/g, "")}`;
export const waHref = () => `https://wa.me/${CONTACT.phone.replace(/\D/g, "")}?text=${encodeURIComponent("Hi Qolvik, I'd like to talk about a project.")}`;
