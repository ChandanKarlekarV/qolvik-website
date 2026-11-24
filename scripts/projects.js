// =========================================================
//  QOLVIK — projects page
// =========================================================
import { PROJECTS } from "./config.js";
import { M, useMotion, ease, getLenis, initSmoothScroll, reveals, enhanceButtons, segmented, animateIn, customCursor } from "./motion-kit.js";
import { MINIS, mountMini } from "./minis.js";
import { renderSocials, initAnalytics, fillContact } from "./shared.js";
import { projectCardsHTML, PROJECT_TABS, PILL, tabButtons } from "./templates.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---------- Cards (also pre-rendered into the HTML by build.js) ----------
const grid = $("[data-pgrid]");
grid.innerHTML = projectCardsHTML();
$$(".pcard", grid).forEach((c) => mountMini($("[data-mini-host]", c), PROJECTS.find((p) => p.id === c.dataset.id).mini, { interactive: false }));
grid.setAttribute("data-stagger", "");
$("[data-p-tabs]").innerHTML = PILL + tabButtons(PROJECT_TABS);

renderSocials($("[data-socials]"));
fillContact();
initAnalytics();
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

initSmoothScroll();
customCursor();
enhanceButtons();
reveals();
segmented($("[data-p-tabs]"), (cat) => {
  const shown = [];
  $$(".pcard", grid).forEach((c) => { c.hidden = !(cat === "All" || c.dataset.cat === cat); if (!c.hidden) shown.push(c); });
  animateIn(shown);
});

// ---------- Detail sheet ----------
const sheet = $("[data-sheet]"), overlay = $("[data-sheet-overlay]"), content = $("[data-sheet-content]");
let lastFocus;
let currentId = null;
function openProject(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p || (currentId === id && sheet.classList.contains("is-open"))) return;
  currentId = id;
  lastFocus = document.activeElement;
  $("[data-sheet-cat]").textContent = p.concept ? `${p.category} · Concept` : p.category;
  content.innerHTML = `
    <div class="sheet__grid">
      <div class="sheet__demo"><div class="ccard__frame" data-demo></div><span class="sheet__hint"><span class="pulse"></span>Live demo — ${MINIS[p.mini].hint.toLowerCase()}</span></div>
      <div class="sheet__info">
        <div><span class="sheet__type">${p.type} · ${p.year}</span><h2 id="sheet-title">${p.title}</h2></div>
        <p class="lead">${p.summary}</p>
        <div class="sheet__block"><h3>The challenge</h3><p>${p.challenge}</p></div>
        <div class="sheet__block"><h3>Our approach</h3><p>${p.solution}</p></div>
        <div class="sheet__block"><h3>What we delivered</h3><ul class="sheet__list">${p.deliverables.map((d) => `<li>${d}</li>`).join("")}</ul></div>
        <div class="sheet__block"><h3>Tech stack</h3><div class="sheet__chips">${p.stack.map((s) => `<span class="tag tag--grey">${s}</span>`).join("")}</div></div>
        <div><a class="btn btn--primary btn--lg" href="index.html#contact"><span class="btn__label">Build something like this</span><span class="btn__arrow" aria-hidden="true"><svg><use href="#arrow"/></svg><svg><use href="#arrow"/></svg></span></a></div>
      </div>
    </div>`;
  mountMini($("[data-demo]", content), p.mini);
  enhanceButtons(content);
  $(".sheet__body").scrollTop = 0;
  sheet.inert = false;
  sheet.setAttribute("aria-hidden", "false");
  sheet.classList.add("is-open");
  overlay.classList.add("is-open");
  getLenis()?.stop();
  setTimeout(() => $("[data-sheet-close]").focus(), 80);
  if (useMotion) M.animate([...content.querySelectorAll(".sheet__info > *")], { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0px)"] }, { duration: 0.7, ease, delay: M.stagger(0.06, { startDelay: 0.25 }) });
}
function closeProject() {
  if (!sheet.classList.contains("is-open")) return;
  currentId = null;
  sheet.classList.remove("is-open");
  overlay.classList.remove("is-open");
  sheet.setAttribute("aria-hidden", "true");
  sheet.inert = true;
  getLenis()?.start();
  lastFocus?.focus();
}
// URL <-> panel: opening adds #project-id (shareable, and the Back button closes it)
function showProject(id) {
  if (history.state?.sheet !== id) history.pushState({ sheet: id }, "", `#${id}`);
  openProject(id);
}
function hideProject() {
  // Synchronous URL update (no history.back) so rapid open/close can never re-open a stale panel
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  closeProject();
}
const syncFromUrl = () => {
  const id = location.hash.slice(1);
  if (PROJECTS.some((p) => p.id === id)) openProject(id);
  else closeProject();
};
grid.addEventListener("click", (e) => { const c = e.target.closest(".pcard"); if (c) showProject(c.dataset.id); });
$("[data-sheet-close]").addEventListener("click", hideProject);
overlay.addEventListener("click", hideProject);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sheet.classList.contains("is-open")) hideProject(); });
addEventListener("popstate", syncFromUrl);
addEventListener("hashchange", syncFromUrl);
setTimeout(syncFromUrl, 400); // deep link: projects.html#campus-one


// ---------- Mobile menu ----------
const burger = $(".nav__burger"), menu = $("#menu");
const setMenu = (open) => {
  burger.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("is-open", open);
  menu.inert = !open;
  menu.setAttribute("aria-hidden", String(!open));
  open ? getLenis()?.stop() : getLenis()?.start();
};
burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
