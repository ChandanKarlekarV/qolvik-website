// =========================================================
//  QOLVIK — projects page
//  Cards are pre-rendered by build.js; this adds the filter,
//  the live previews and the detail sheet.
// =========================================================
import { PROJECTS } from "./config.js";
import { MINIS, mountMini } from "./minis.js";
import { icon } from "./icons.js";
import { initPage, mountWorkMinis, segmented } from "./shared.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

initPage();
const grid = $("[data-pgrid]");
mountWorkMinis(grid);

segmented($("[data-p-tabs]"), (cat) => {
  $$(".pcard", grid).forEach((c) => (c.hidden = !(cat === "All" || c.dataset.cat === cat)));
});

// ---------- Detail sheet ----------
const sheet = $("[data-sheet]"), overlay = $("[data-sheet-overlay]"), content = $("[data-sheet-content]");
let lastFocus, currentId = null;
function openProject(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p || (currentId === id && sheet.classList.contains("is-open"))) return;
  currentId = id;
  lastFocus = document.activeElement;
  $("[data-sheet-cat]").textContent = p.concept ? `${p.category} · Concept` : p.category;
  content.innerHTML = `
    <div class="sheet__grid">
      <div class="sheet__demo"><div class="wcard__frame" data-demo></div><span class="label">Live demo — ${MINIS[p.mini].hint.toLowerCase()}</span></div>
      <div class="sheet__info">
        <div><span class="label">${p.type} · ${p.year}</span><h2 id="sheet-title">${p.title}</h2></div>
        <p class="lead">${p.summary}</p>
        <div class="sheet__block"><h3>The challenge</h3><p>${p.challenge}</p></div>
        <div class="sheet__block"><h3>Our approach</h3><p>${p.solution}</p></div>
        <div class="sheet__block"><h3>What we delivered</h3><ul class="sheet__list">${p.deliverables.map((d) => `<li>${d}</li>`).join("")}</ul></div>
        <div class="sheet__block"><h3>Tech stack</h3><div class="sheet__chips">${p.stack.map((s) => `<span>${s}</span>`).join("")}</div></div>
        <div><a class="btn" href="index.html#contact">Build something like this ${icon("arrow")}</a></div>
      </div>
    </div>`;
  mountMini($("[data-demo]", content), p.mini, { stage: p.stage });
  $(".sheet__body").scrollTop = 0;
  sheet.inert = false;
  sheet.setAttribute("aria-hidden", "false");
  sheet.classList.add("is-open");
  overlay.classList.add("is-open");
  document.documentElement.style.overflow = "hidden";
  setTimeout(() => $("[data-sheet-close]").focus(), 60);
}
function closeProject() {
  if (!sheet.classList.contains("is-open")) return;
  currentId = null;
  sheet.classList.remove("is-open");
  overlay.classList.remove("is-open");
  sheet.setAttribute("aria-hidden", "true");
  sheet.inert = true;
  document.documentElement.style.overflow = "";
  lastFocus?.focus();
}
// URL <-> panel: opening adds #project-id (shareable, and the Back button closes it)
function showProject(id) {
  if (history.state?.sheet !== id) history.pushState({ sheet: id }, "", `#${id}`);
  openProject(id);
}
function hideProject() {
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
syncFromUrl(); // deep link: projects.html#campus-one
