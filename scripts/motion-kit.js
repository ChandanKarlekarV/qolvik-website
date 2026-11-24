// =========================================================
//  QOLVIK MOTION KIT — shared animation helpers
//  Motion (motion.dev) for orchestration, Lenis for smooth scroll,
//  CSS transitions for hovers, rAF easing for cursor-follow.
// =========================================================
import Lenis from "../vendor/lenis.mjs";

export const M = window.Motion;
export const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const useMotion = !!M && !reduceMotion;
export const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
export const ease = [0.22, 1, 0.36, 1];
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const css = getComputedStyle(document.documentElement);
export const cssVar = (n) => css.getPropertyValue(n).trim();

if (useMotion) document.documentElement.classList.add("js-motion");

// ---------- Smooth scroll ----------
let lenis = null;
export const getLenis = () => lenis;
export function initSmoothScroll() {
  if (!reduceMotion) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    // The visitor always wins: while Lenis is gliding (after a link click or form focus) it ignores the
    // browser's own scrolling and would drag the page back. Hand control over on keyboard, scrollbar,
    // touch, or any outside jump (Home key, find-in-page, "back to top", scroll restoration).
    const yieldToUser = () => { if (lenis.isScrolling === "smooth") lenis.scrollTo(window.scrollY, { immediate: true, force: true }); };
    addEventListener("keydown", (e) => { if (["Home", "End", "PageUp", "PageDown", "ArrowUp", "ArrowDown", " "].includes(e.key)) yieldToUser(); });
    addEventListener("mousedown", (e) => { if (e.clientX >= document.documentElement.clientWidth) yieldToUser(); }); // scrollbar drag
    addEventListener("touchstart", yieldToUser, { passive: true });
    addEventListener("scroll", () => {
      if (lenis.isScrolling === "smooth" && Math.abs(window.scrollY - lenis.animatedScroll) > 120) yieldToUser();
    }, { passive: true });
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href");
    const target = id === "#" || id === "#top" ? document.body : document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: -20, duration: 1.3 });
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  });
}

// ---------- Split text into words ----------
export function splitWords(el) {
  if (el.classList.contains("is-split")) return;
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(" ");
          const w = document.createElement("span");
          w.className = "word";
          const inner = document.createElement("span");
          inner.className = "word__in";
          inner.textContent = part;
          w.append(inner);
          frag.append(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR" && !n.hasAttribute("data-no-split")) walk(n);
    });
  };
  walk(el);
  el.classList.add("is-split");
}

// ---------- Scroll reveals ----------
const entryEl = (e) => e.target || e; // Motion 11 passes an IntersectionObserverEntry
export function reveals(root = document) {
  root.querySelectorAll("[data-words]").forEach(splitWords);
  if (!useMotion) return;
  M.inView(root.querySelectorAll("[data-words]"), (e) => {
    const el = entryEl(e);
    M.animate(el.querySelectorAll(".word__in"), { transform: "translateY(0%)" }, { duration: 1, ease, delay: M.stagger(0.05, { startDelay: parseFloat(el.dataset.delay || 0) }) });
  }, { amount: 0.4 });
  M.inView(root.querySelectorAll("[data-reveal]"), (e) => {
    const el = entryEl(e);
    M.animate(el, { opacity: 1, transform: "translateY(0px)" }, { duration: 0.9, ease, delay: parseFloat(el.dataset.delay || 0) });
  }, { amount: 0.2 });
  M.inView(root.querySelectorAll("[data-stagger]"), (e) => {
    M.animate([...entryEl(e).children], { opacity: 1, transform: "translateY(0px)" }, { duration: 0.8, ease, delay: M.stagger(0.06) });
  }, { amount: 0.1 });
}

export function animateIn(els) {
  if (!useMotion || !els.length) return;
  M.animate(els, { opacity: [0, 1], transform: ["translateY(18px) scale(.97)", "translateY(0px) scale(1)"] }, { duration: 0.6, ease, delay: M.stagger(0.04) });
}

// ---------- Scroll-lit paragraph (words brighten as you scroll) ----------
export function scrollText(el) {
  splitWords(el);
  const words = [...el.querySelectorAll(".word__in")];
  el.classList.add("scroll-text");
  if (!useMotion || !M.scroll) { words.forEach((w) => w.classList.add("is-lit")); return; }
  let lit = -1;
  M.scroll((p) => {
    const n = Math.round(p * words.length);
    if (n === lit) return;
    words.forEach((w, i) => w.classList.toggle("is-lit", i < n));
    lit = n;
  }, { target: el, offset: ["start 85%", "end 45%"] });
}

// ---------- Rotating word with letter-by-letter swap ----------
export function wordSwap(el, words, interval = 2400) {
  const render = (w) => {
    el.setAttribute("aria-label", w);
    el.innerHTML = [...w].map((c) => `<span class="ws__ch" aria-hidden="true">${c === " " ? "&nbsp;" : c}</span>`).join("");
    return [...el.children];
  };
  let i = 0;
  render(words[0]);
  if (!useMotion) return;
  setInterval(async () => {
    if (document.hidden) return;
    await M.animate([...el.children], { transform: "translateY(-100%)", opacity: 0 }, { duration: 0.35, ease: [0.55, 0, 0.75, 0.2], delay: M.stagger(0.02) }).finished;
    i = (i + 1) % words.length;
    const chars = render(words[i]);
    M.animate(chars, { transform: ["translateY(100%)", "translateY(0%)"], opacity: [0, 1] }, { duration: 0.55, ease, delay: M.stagger(0.025) });
  }, interval);
}

// ---------- Typewriter (for code panels) ----------
export async function typeInto(el, text, speed = 18) {
  el.textContent = "";
  for (const ch of text) { el.textContent += ch; await sleep(speed); }
}

// ---------- Buttons: letter roll + cursor-origin fill + magnetic ----------
export function enhanceButtons(root = document) {
  root.querySelectorAll(".btn:not([data-enhanced])").forEach((btn) => {
    btn.dataset.enhanced = "";
    const label = btn.querySelector(".btn__label");
    if (label) setLabel(label, label.textContent.trim());
    const setOrigin = (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
      btn.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    btn.addEventListener("pointerenter", setOrigin);
    btn.addEventListener("pointerleave", setOrigin);
  });
  if (!reduceMotion && finePointer) root.querySelectorAll("[data-magnetic]:not([data-mag-on])").forEach((el) => { el.dataset.magOn = ""; magnetic(el, parseFloat(el.dataset.magnetic) || 0.3); });
}
export function setLabel(label, text) {
  label.innerHTML = `<span class="visually-hidden">${text}</span>` +
    [...text].map((c, i) => `<span class="ch" aria-hidden="true" style="--i:${i}">${c}</span>`).join("");
}

export function magnetic(el, strength = 0.3) {
  let tx = 0, ty = 0, x = 0, y = 0, raf = null;
  const loop = () => {
    x += (tx - x) * 0.14; y += (ty - y) * 0.14;
    el.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`;
    raf = Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05 ? requestAnimationFrame(loop) : null;
  };
  const start = () => { if (!raf) raf = requestAnimationFrame(loop); };
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    tx = (e.clientX - (r.left + r.width / 2) - x) * strength;
    ty = (e.clientY - (r.top + r.height / 2) - y) * strength;
    start();
  });
  el.addEventListener("pointerleave", () => { tx = ty = 0; start(); });
}

// ---------- Custom cursor (ring follows with easing; grows on links) ----------
export function customCursor() {
  if (reduceMotion || !finePointer) return;
  const ring = document.createElement("div");
  ring.className = "cursor is-hidden";
  ring.innerHTML = `<span class="cursor__label"></span>`;
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  document.body.append(ring, dot);
  const label = ring.firstElementChild;
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    ring.classList.remove("is-hidden");
    const t = e.target.closest?.("[data-cursor], a, button, label, input, select, textarea, [role=button]");
    const text = t?.dataset?.cursor;
    ring.classList.toggle("is-label", !!text);
    ring.classList.toggle("is-link", !!t && !text);
    if (text) label.textContent = text;
  }, { passive: true });
  document.addEventListener("pointerleave", () => ring.classList.add("is-hidden"));
  const loop = () => {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// ---------- Cursor spotlight on cards ----------
export function spotlights(root = document) {
  root.querySelectorAll(".spotlight").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
}

// ---------- Count-up numbers ----------
export function countUps(root = document) {
  root.querySelectorAll("[data-count]").forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const fmt = (v) => Math.round(v).toLocaleString("en-IN") + suffix;
    if (!useMotion) { el.textContent = fmt(target); return; }
    el.textContent = fmt(0);
    M.inView(el, () => { M.animate(0, target, { duration: 1.6, ease, onUpdate: (v) => (el.textContent = fmt(v)) }); });
  });
}

// ---------- Segmented control with sliding pill ----------
export function segmented(el, onChange) {
  const pill = el.querySelector(".segmented__pill");
  const btns = [...el.querySelectorAll("button")];
  const place = () => {
    const a = btns.find((b) => b.getAttribute("aria-pressed") === "true") || btns[0];
    pill.style.width = a.offsetWidth + "px";
    pill.style.height = a.offsetHeight + "px";
    pill.style.transform = `translate(${a.offsetLeft}px, ${a.offsetTop - 5}px)`;
  };
  btns.forEach((b) => b.addEventListener("click", () => {
    if (b.getAttribute("aria-pressed") === "true") return;
    btns.forEach((x) => x.setAttribute("aria-pressed", x === b ? "true" : "false"));
    place();
    onChange?.(b.dataset.value);
  }));
  place();
  document.fonts?.ready.then(place);
  new ResizeObserver(place).observe(el);
}

// ---------- Accordion ----------
export function accordion(root) {
  root.querySelectorAll(".acc").forEach((acc) => {
    const btn = acc.querySelector(".acc__btn");
    btn.addEventListener("click", () => {
      const open = !acc.classList.contains("is-open");
      root.querySelectorAll(".acc.is-open").forEach((o) => { o.classList.remove("is-open"); o.querySelector(".acc__btn").setAttribute("aria-expanded", "false"); });
      acc.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });
}

// ---------- Toasts ----------
let toastWrap;
export function toast(message, { action, onAction, duration = 3200 } = {}) {
  if (!toastWrap) {
    toastWrap = document.createElement("div");
    toastWrap.className = "toasts";
    toastWrap.setAttribute("role", "status");
    toastWrap.setAttribute("aria-live", "polite");
    document.body.append(toastWrap);
  }
  while (toastWrap.children.length >= 2) toastWrap.firstElementChild.remove();
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<span class="toast__dot"></span><span class="toast__msg"></span>${action ? `<button type="button">${action}</button>` : ""}`;
  t.querySelector(".toast__msg").textContent = message;
  toastWrap.append(t);
  const remove = () => {
    if (!t.isConnected) return;
    if (useMotion) M.animate(t, { opacity: 0, transform: "translateY(12px) scale(.97)" }, { duration: 0.3 }).then(() => t.remove());
    else t.remove();
  };
  if (action) t.querySelector("button").addEventListener("click", () => { onAction?.(); remove(); });
  if (useMotion) M.animate(t, { opacity: [0, 1], transform: ["translateY(20px) scale(.96)", "translateY(0px) scale(1)"] }, { duration: 0.5, ease });
  setTimeout(remove, duration);
}

// Run a looping async animation only while its element is on screen
export function whileVisible(el, loopFn) {
  let visible = false, running = false;
  const run = async () => {
    if (running) return;
    running = true;
    while (visible) { try { await loopFn(); } catch { await sleep(500); } }
    running = false;
  };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) run(); }, { threshold: 0.15 }).observe(el);
  return () => visible;
}
