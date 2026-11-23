// =========================================================
//  DOTFORGE — design system page (live component catalog)
// =========================================================
import { initAnalytics } from "./shared.js";
import { M, useMotion, ease, cssVar, initSmoothScroll, reveals, enhanceButtons, spotlights, segmented, accordion, toast, customCursor } from "./motion-kit.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// ---------- Swatches (read straight from tokens.css) ----------
const SCALES = { mono: [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], beige: [50, 100, 200, 300, 400, 500, 600, 700] };
$$("[data-swatches]").forEach((wrap) => {
  const name = wrap.dataset.swatches;
  wrap.innerHTML = SCALES[name].map((step) => {
    const v = cssVar(`--${name}-${step}`);
    return `<button class="swatch" type="button" data-copy-value="var(--${name}-${step})" aria-label="Copy ${name}-${step} ${v}"><i style="background:${v}"></i><b>${name}-${step}</b><code>${v}</code></button>`;
  }).join("");
});
document.addEventListener("click", async (e) => {
  const sw = e.target.closest("[data-copy-value]");
  if (sw) { await copy(sw.dataset.copyValue); toast(`Copied ${sw.dataset.copyValue}`); }
  const code = e.target.closest("[data-copy]");
  if (code) { await copy(code.textContent); code.classList.add("is-copied"); setTimeout(() => code.classList.remove("is-copied"), 1500); }
});
async function copy(text) { try { await navigator.clipboard.writeText(text); } catch {} }

$("[data-space]").innerHTML = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<div><code>space-${n}</code><i style="width:${cssVar(`--space-${n}`)}"></i></div>`).join("");

initSmoothScroll();
customCursor();
enhanceButtons();
spotlights();
reveals();
accordion($("[data-ds-acc]"));
$$("[data-ds-seg]").forEach((s, i) => segmented(s, (v) => { if (i === 0) $("[data-seg-out]").textContent = v; }));

// ---------- Motion curves demo ----------
const EASES = {
  out: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  inout: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
  spring: { type: "spring", stiffness: 380, damping: 14 },
  linear: { duration: 0.7, ease: "linear" },
};
let pos = 0;
$("[data-play]").addEventListener("click", () => {
  pos = pos ? 0 : 1;
  $$(".motion-track i").forEach((dot) => {
    const dist = dot.parentElement.clientWidth - dot.offsetWidth - 8;
    if (M) M.animate(dot, { x: pos * dist }, EASES[dot.dataset.ease]);
    else dot.style.transform = `translateX(${pos * dist}px)`;
  });
});

// ---------- Demo form ----------
$("[data-demo-form]").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.currentTarget;
  let ok = true;
  f.querySelectorAll("[required]").forEach((i) => {
    const bad = !i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value));
    i.classList.toggle("is-invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) { if (useMotion) M.animate(f, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 }); toast("Please fill in the highlighted fields"); }
  else toast("Looks good — form is valid ✓");
});

// ---------- Progress ----------
const prog = $("[data-progress]");
$$("[data-progress-step]").forEach((b) => b.addEventListener("click", () => {
  const p = Math.min(1, Math.max(0.05, parseFloat(prog.style.getPropertyValue("--p")) + parseFloat(b.dataset.progressStep)));
  prog.style.setProperty("--p", p.toFixed(2));
}));

// ---------- Toast + modal ----------
$("[data-toast]").addEventListener("click", () => toast("Your changes were saved", { action: "Undo", onAction: () => toast("Change undone") }));
const modal = $("[data-modal]"), mOverlay = $("[data-modal-overlay]");
let lastFocus;
const openModal = () => { lastFocus = document.activeElement; modal.inert = false; modal.setAttribute("aria-hidden", "false"); modal.classList.add("is-open"); mOverlay.classList.add("is-open"); setTimeout(() => modal.querySelector("button").focus(), 60); };
const closeModal = () => { modal.classList.remove("is-open"); mOverlay.classList.remove("is-open"); modal.inert = true; modal.setAttribute("aria-hidden", "true"); lastFocus?.focus(); };
$("[data-modal-open]").addEventListener("click", openModal);
$$("[data-modal-close]").forEach((b) => b.addEventListener("click", closeModal));
mOverlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });

// ---------- Sidebar: highlight current section ----------
const links = $$(".ds__side a");
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (en.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${en.target.id}`));
}), { rootMargin: "-40% 0px -55% 0px" });
$$(".ds-sec").forEach((s) => io.observe(s));

if (useMotion) M.inView(".space-scale", () => M.animate(".space-scale i", { transform: ["scaleX(0)", "scaleX(1)"] }, { duration: 0.8, ease, delay: M.stagger(0.04) }));

initAnalytics();
