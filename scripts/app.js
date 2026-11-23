// =========================================================
//  DOTFORGE — homepage
// =========================================================
import { BRAND, SERVICES, STACK, TEAM, TEAM_GROUPS, FAQ, PROJECTS } from "./config.js";
import { initErpApp } from "./erp-app.js";
import { icon } from "./icons.js";
import {
  M, useMotion, ease, sleep, finePointer, getLenis, initSmoothScroll, reveals, enhanceButtons, setLabel,
  spotlights, countUps, segmented, accordion, animateIn, toast, scrollText, wordSwap, customCursor, whileVisible,
} from "./motion-kit.js";
import { mountMini } from "./minis.js";
import { renderSocials, mountCards, initAnalytics, fillContact, initWhatsApp } from "./shared.js";
import {
  STACK_ALL, PILL, tabButtons, marqueeHTML, servicesHTML, catalogHTML, CATALOG_TABS, STACK_TABS, stackTilesHTML,
  erpFeatsHTML, TEAM_TABS, teamHTML, teamCountText, faqHTML,
} from "./templates.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const setTabs = (el, values) => { el.innerHTML = PILL + tabButtons(values); };

// Boot runs at the very bottom of this file (after all constants are defined)
function boot() {
// ---------- 1. Render content from config ----------
renderMarquee();
renderServices();
renderCatalog();
renderSocials($("[data-socials]"));
renderStack(Object.keys(STACK)[0]);
renderErp("school");
renderTeam();
renderFaq();
$$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
fillContact();
$(".stats [data-count-stack]")?.setAttribute("data-count", STACK_ALL.length);
footerHop();

// ---------- 2. Motion + behaviour ----------
initSmoothScroll();
customCursor();
enhanceButtons();
spotlights();
countUps();
reveals();
scrollText($("[data-scroll-text]"));
wordSwap($("[data-swap]"), $("[data-swap]").dataset.swap.split(","));
accordion($("[data-faq]"));
faqExamples();
navBehaviour();
mobileMenu();
studio();
servicePreview();
hscroll();
schema();
processSteps();
erpMotion();
contactForm();
initAnalytics();
initWhatsApp();

segmented($("[data-cat-tabs]"), filterCatalog);
segmented($("[data-stack-tabs]"), (v) => renderStack(v, true));
segmented($("[data-erp-tabs]"), (v) => renderErp(v, true));
segmented($("[data-team-tabs]"), filterTeam);
}

// =========================================================
//  Marquee + services
// =========================================================
function renderMarquee() {
  [0, 1].forEach((i) => ($(`[data-marquee="${i}"]`).innerHTML = marqueeHTML(i)));
}

function renderServices() {
  $("[data-services]").innerHTML = servicesHTML();
  // Hover preview shows a real mini design for each service
  const pv = $("[data-spreview]");
  pv.innerHTML = SERVICES.map((s) => `<div class="pv" data-pv-k="${s.preview}"></div>`).join("");
  $$(".pv", pv).forEach((p) => mountMini(p, p.dataset.pvK, { interactive: false }));
}

// =========================================================
//  Design catalog — six live, interactive mini designs
// =========================================================
function renderCatalog() {
  const grid = $("[data-catalog]");
  grid.innerHTML = catalogHTML();
  mountCards(grid);
  grid.setAttribute("data-stagger", "");
  setTabs($("[data-cat-tabs]"), CATALOG_TABS);
}
function filterCatalog(cat) {
  const shown = [];
  $$("[data-catalog] .ccard").forEach((c) => {
    const show = cat === "All" || c.dataset.cat === cat;
    c.hidden = !show;
    if (show) shown.push(c);
  });
  animateIn(shown);
}

// Preview card follows the cursor over service rows (one rAF loop, eased)
function servicePreview() {
  if (!finePointer) return;
  const pv = $("[data-spreview]");
  let tx = 0, ty = 0, x = 0, y = 0, raf = null, on = false;
  const loop = () => {
    x += (tx - x) * 0.16; y += (ty - y) * 0.16;
    pv.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${((tx - x) * 0.04).toFixed(2)}deg)`;
    raf = on || Math.abs(tx - x) > 0.3 ? requestAnimationFrame(loop) : null;
  };
  $$(".srow").forEach((row) => {
    row.addEventListener("pointerenter", (e) => {
      if (!on) { x = tx = e.clientX; y = ty = e.clientY; }
      on = true;
      pv.classList.add("is-on");
      $$(".pv", pv).forEach((p) => p.classList.toggle("is-on", p.dataset.pvK === row.dataset.pv));
      if (!raf) raf = requestAnimationFrame(loop);
    });
    row.addEventListener("pointermove", (e) => { tx = e.clientX + 150; ty = e.clientY; });
  });
  const hide = () => { on = false; pv.classList.remove("is-on"); };
  $("[data-services]").addEventListener("pointerleave", hide);
  addEventListener("scroll", () => { if (on && !$("[data-services]").matches(":hover")) hide(); }, { passive: true });
}

// =========================================================
//  Hero motion graphic — designer draws UI, engineer writes code
// =========================================================
const SNIPPET = [
  ["c", "// generated from our design tokens\n"],
  ["k", "export function "], ["", "Hero() {\n  "],
  ["k", "return "], ["", "(\n    <section className="], ["s", '"hero"'], ["", ">\n      <h1>"],
  ["", "Admissions, simplified."], ["", "</h1>\n      <Button variant="], ["s", '"primary"'], ["", ">\n        Apply now\n      </Button>\n    </section>\n  );\n}"],
];

function studio() {
  const root = $("[data-studio]");
  const cd = $("[data-cursor-design]"), cv = $("[data-cursor-dev]");
  const sel = $("[data-select]"), blocks = $$("[data-block]", root), code = $("[data-code]");
  const deploy = $("[data-deploy]"), heroBlock = $("[data-hero-block]"), swatch = $("[data-swatch]"), tool = $("[data-tool]");
  const writeCode = async (speed) => {
    code.innerHTML = "";
    for (const [cls, text] of SNIPPET) {
      const span = document.createElement("span");
      if (cls) span.className = cls;
      code.append(span);
      if (!speed) { span.textContent = text; continue; }
      for (const ch of text) { span.textContent += ch; if (ch !== " ") await sleep(speed); }
    }
  };
  if (!useMotion) { writeCode(0); cd.style.display = cv.style.display = "none"; return; }

  const box = () => root.getBoundingClientRect();
  const at = (el, fx = 0.5, fy = 0.5) => {
    const r = box(), e = el.getBoundingClientRect();
    return { x: e.left - r.left + el.offsetWidth * fx, y: e.top - r.top + el.offsetHeight * fy, l: e.left - r.left, t: e.top - r.top, w: el.offsetWidth, h: el.offsetHeight };
  };
  const move = (c, p, d = 0.7) => M.animate(c, { x: p.x, y: p.y }, { duration: d, ease: [0.45, 0, 0.2, 1] }).finished;
  const click = (c) => M.animate(c.querySelector("svg"), { scale: [1, 0.72, 1] }, { duration: 0.28 }).finished;
  const select = (p) => {
    Object.assign(sel.style, { width: p.w + 8 + "px", height: p.h + 8 + "px", transform: `translate(${p.l - 4}px, ${p.t - 4}px)` });
    M.animate(sel, { opacity: [0, 1] }, { duration: 0.2 });
  };

  M.animate(cd, { x: root.clientWidth * 0.25, y: 260 }, { duration: 0 });
  M.animate(cv, { x: root.clientWidth * 0.85, y: 380 }, { duration: 0 });
  // Entrance of the whole studio
  M.animate(root, { opacity: [0, 1], transform: ["translateY(60px) scale(.97)", "translateY(0px) scale(1)"] }, { duration: 1.2, ease, delay: 0.6 });

  whileVisible(root, async () => {
    const hasCode = !!$(".studio__code", root).offsetParent;
    cv.style.display = hasCode ? "" : "none";
    blocks.forEach((b) => { b.style.transform = "scale(0)"; b.style.opacity = "0"; });
    heroBlock.classList.remove("is-beige");
    code.innerHTML = "";
    sel.style.opacity = 0;
    deploy.style.opacity = 0;

    await move(cd, at(tool)); await click(cd);
    for (const b of blocks) {
      const p = at(b, 0, 0);
      await move(cd, p, 0.5);
      await click(cd);
      b.style.opacity = "1";
      select(p);
      M.animate(cd, { x: p.x + p.w, y: p.y + p.h }, { duration: 0.55, ease });
      await M.animate(b, { transform: ["scale(0)", "scale(1)"] }, { duration: 0.55, ease }).finished;
    }
    await move(cd, at(swatch)); await click(cd);
    heroBlock.classList.add("is-beige");
    select(at(heroBlock, 0, 0));
    await sleep(500);
    M.animate(sel, { opacity: 0 }, { duration: 0.3 });
    M.animate(cd, { x: at(heroBlock).x, y: at(heroBlock).y + 40 }, { duration: 0.8, ease });

    if (hasCode) {
      const pre = $(".studio__pre", root);
      await move(cv, at(pre, 0.15, 0.08), 0.6);
      await click(cv);
      M.animate(cv, { x: at(pre, 0.6, 0.75).x, y: at(pre, 0.6, 0.75).y }, { duration: 3, ease: "linear" });
      await writeCode(14);
    } else await sleep(600);

    await M.animate(deploy, { opacity: [0, 1], transform: ["translateY(14px) scale(.9)", "translateY(0px) scale(1)"] }, { type: "spring", stiffness: 320, damping: 20 }).finished;
    await sleep(2400);
    await M.animate([...blocks, deploy], { opacity: 0 }, { duration: 0.4 }).finished;
    await sleep(300);
  });
}

// =========================================================
//  How we design — pinned horizontal scroll (desktop) / swipe (mobile)
// =========================================================
function hscroll() {
  const sec = $("#design"), track = $("[data-hs-track]"), num = $("[data-hs-num]"), bar = $("[data-hs-bar]");
  const panels = $$("[data-dpanel]");
  const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("is-play", e.isIntersecting)), { threshold: 0.3 });
  panels.forEach((p) => io.observe(p));
  if (!useMotion || !M.scroll) return;
  let cancel = null, lastN = 0;
  const setup = () => {
    cancel?.(); cancel = null;
    track.style.transform = "";
    sec.style.height = "";
    if (innerWidth <= 900) return;
    const dist = Math.max(0, track.scrollWidth - innerWidth);
    sec.style.height = `${dist * 1.15 + innerHeight}px`;
    cancel = M.scroll((p) => {
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
      bar.style.transform = `scaleX(${0.2 + 0.8 * p})`;
      const n = Math.min(panels.length, Math.floor(p * panels.length) + 1);
      if (n !== lastN) { num.textContent = String(n).padStart(2, "0"); lastN = n; }
    }, { target: sec, offset: ["start start", "end end"] });
  };
  setup();
  let t;
  addEventListener("resize", () => { clearTimeout(t); t = setTimeout(setup, 200); });
}

// =========================================================
//  Stack tiles + live schema
// =========================================================
function renderStack(cat, animate) {
  if (!animate) setTabs($("[data-stack-tabs]"), STACK_TABS);
  const wrap = $("[data-stack-tiles]");
  wrap.innerHTML = stackTilesHTML(cat);
  spotlights(wrap);
  if (animate) animateIn([...wrap.children]);
}

function schema() {
  const root = $("[data-schema]");
  const rows = {};
  $$(".tbl", root).forEach((t) => {
    const table = t.querySelector("b").textContent;
    $$("[data-row]", t).forEach((r) => (rows[`${table}.${r.textContent}`] = r));
  });
  const q = $("[data-query]"), res = $("[data-result]");
  const QUERIES = [
    { sql: "SELECT s.name, SUM(f.amount)\nFROM students s JOIN fees f\n  ON f.student_id = s.id\nGROUP BY s.name;", hits: ["students.id", "students.name", "fees.student_id", "fees.amount"], out: "→ 1,240 rows · 4 ms" },
    { sql: "SELECT COUNT(*) FROM attendance\nWHERE date = CURRENT_DATE;", hits: ["attendance.student_id", "attendance.date"], out: "→ 1 row · 2 ms" },
  ];
  if (!useMotion) { q.textContent = QUERIES[0].sql; res.textContent = QUERIES[0].out; return; }
  let i = 0;
  whileVisible(root, async () => {
    const { sql, hits, out } = QUERIES[i++ % QUERIES.length];
    res.textContent = "";
    q.textContent = "";
    for (const ch of sql) { q.textContent += ch; if (ch !== " ") await sleep(22); }
    for (const h of hits) { rows[h]?.classList.add("is-hit"); await sleep(220); }
    res.textContent = out;
    M.animate(res, { opacity: [0, 1], transform: ["translateY(6px)", "translateY(0px)"] }, { duration: 0.4 });
    await sleep(2200);
    Object.values(rows).forEach((r) => r.classList.remove("is-hit"));
    await sleep(400);
  });
}

// =========================================================
//  Campus ERP
// =========================================================
let erpApp = null;
function renderErp(key, animate) {
  const list = $("[data-erp-list]");
  list.innerHTML = erpFeatsHTML(key);
  if (animate && useMotion) M.animate([...list.children], { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0px)"] }, { duration: 0.5, ease, delay: M.stagger(0.06) });
  if (!erpApp) erpApp = initErpApp($("[data-erp-app]"), { M, useMotion, ease });
  else erpApp.setInstitution(key);
  const att = erpApp.data().att;
  $("[data-float-att]").textContent = att + "%";
  $("[data-float-arc]").style.strokeDashoffset = String(113 - (113 * att) / 100);
}

// ERP stage: app tilts back and straightens as you scroll in; floating cards drift
function erpMotion() {
  if (!useMotion || !M.scroll) return;
  const stage = $("[data-erp-stage]");
  M.scroll(M.animate($("[data-erp-tilt]"), { transform: ["perspective(1800px) rotateX(22deg) scale(.88) translateY(40px)", "perspective(1800px) rotateX(0deg) scale(1) translateY(0px)"] }, { ease: "linear" }),
    { target: stage, offset: ["start end", "center 60%"] });
  [[".efloat--a", -60], [".efloat--b", 50], [".efloat--c", -90]].forEach(([sel, d]) => {
    M.scroll(M.animate($(sel), { transform: [`translateY(${-d}px)`, `translateY(${d}px)`] }, { ease: "linear" }), { target: stage, offset: ["start end", "end start"] });
  });
}

// =========================================================
//  Process — steps light up while the side stays pinned
// =========================================================
function processSteps() {
  const steps = $$("[data-pstep]"), ring = $("[data-ring]"), num = $("[data-ring-num]");
  const setActive = (step) => {
    const idx = steps.indexOf(step) + 1;
    steps.forEach((s) => s.classList.toggle("is-active", s === step));
    num.textContent = step.dataset.pstep;
    ring.style.strokeDashoffset = String(327 - (327 * idx) / steps.length);
  };
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target)), { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => io.observe(s));
}

// =========================================================
//  Team (edit TEAM in config.js)
// =========================================================
function renderTeam() {
  setTabs($("[data-team-tabs]"), TEAM_TABS);
  $("[data-team-count]").textContent = teamCountText();
  $("[data-team]").innerHTML = teamHTML();
  $("[data-team]").setAttribute("data-stagger", "");
}
function filterTeam(group) {
  const shown = [];
  $$("[data-team] .member").forEach((m) => {
    const show = group === "All" || m.dataset.teamOf === group || m.dataset.teamOf === "*";
    m.hidden = !show;
    if (show) shown.push(m);
  });
  animateIn(shown);
}

// =========================================================
//  FAQ, footer, nav, menu, contact
// =========================================================
function renderFaq() {
  const proj = (id) => PROJECTS.find((p) => p.id === id);
  $("[data-faq]").innerHTML = faqHTML();
  $$(".acc", $("[data-faq]")).forEach((acc) => {
    const p = proj(acc.dataset.ex);
    const host = $("[data-mini-host]", acc);
    if (p && host) mountMini(host, p.mini, { interactive: false });
  });
}

// Left column shows a live example for whichever question is open
function faqExamples() {
  const box = $("[data-faq-ex]");
  let current = null;
  const show = (acc) => {
    const id = acc?.dataset.ex;
    const p = PROJECTS.find((x) => x.id === id);
    if (!p || id === current) return;
    current = id;
    const f = FAQ.find((x) => x.ex === id);
    const swap = () => {
      mountMini($("[data-faq-mini]", box), p.mini);
      $("[data-faq-title]", box).textContent = `${p.title} — ${p.type}`;
      $("[data-faq-note]", box).textContent = f.exNote;
      $("[data-faq-link]", box).href = `projects.html#${p.id}`;
    };
    if (!useMotion || !box.dataset.ready) { swap(); box.dataset.ready = "1"; return; }
    M.animate(box, { opacity: 0, transform: "translateY(10px) scale(.98)" }, { duration: 0.2 }).then(() => {
      swap();
      M.animate(box, { opacity: 1, transform: "translateY(0px) scale(1)" }, { duration: 0.5, ease });
    });
  };
  show($("[data-faq] .acc.is-open"));
  $$("[data-faq] .acc__btn").forEach((b) => b.addEventListener("click", () => requestAnimationFrame(() => show($("[data-faq] .acc.is-open")))));
}

function footerHop() {
  const el = $("[data-hop]");
  el.innerHTML = [...el.textContent].map((c) => `<span class="hop">${c}</span>`).join("");
}

function navBehaviour() {
  const nav = $(".nav");
  let last = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-hidden", y > 500 && y > last + 2 && !$(".menu.is-open"));
    if (y < last - 2) nav.classList.remove("is-hidden");
    last = y;
  }, { passive: true });
  const links = $$(".nav__links a");
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
  }), { rootMargin: "-50% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) io.observe(s); });
  if (useMotion) M.animate(".nav__pill", { opacity: [0, 1], transform: ["translateY(-20px)", "translateY(0px)"] }, { duration: 0.9, ease, delay: 0.2 });
}

function mobileMenu() {
  const btn = $(".nav__burger"), menu = $("#menu");
  const set = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    menu.inert = !open;
    menu.setAttribute("aria-hidden", String(!open));
    open ? getLenis()?.stop() : getLenis()?.start();
  };
  btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) set(false); });
}

// Contact form: inline validation, loading state, honeypot + timing bot checks,
// one submission per minute, real POST (Netlify Forms) with an email fallback.
const RULES = {
  name: (v) => (v.length < 2 ? "Please enter your name (at least 2 characters)." : v.length > 80 ? "Name is too long (max 80 characters)." : /[<>]/.test(v) ? "Please remove the < and > characters." : ""),
  email: (v) => (!v ? "Please enter your email so we can reply." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "That email doesn't look right — check for typos (e.g. name@company.com)." : ""),
  message: (v) => (v.length < 20 ? `Tell us a little more — at least 20 characters (${v.length}/20).` : v.length > 2000 ? "Message is too long (max 2000 characters)." : ""),
};
function contactForm() {
  const form = $("#contact-form");
  const status = $("[data-form-status]", form), btn = $("[data-submit]", form), label = $(".btn__label", btn);
  const openedAt = Date.now();
  let lastSent = 0;
  const field = (n) => form.elements.namedItem(n);
  const check = (n) => {
    const el = field(n), msg = RULES[n](el.value.trim());
    el.classList.toggle("is-invalid", !!msg);
    el.setAttribute("aria-invalid", String(!!msg));
    $(`#${el.getAttribute("aria-describedby").split(" ")[0]}`).textContent = msg;
    return !msg;
  };
  Object.keys(RULES).forEach((n) => {
    field(n).addEventListener("blur", () => field(n).value && check(n));
    field(n).addEventListener("input", () => field(n).classList.contains("is-invalid") && check(n));
  });
  const counter = $('[data-count-for="f-msg"]');
  field("message").addEventListener("input", () => (counter.textContent = `${field("message").value.length} / 2000`));

  const setStatus = (html, kind) => { status.hidden = false; status.className = `form-status form-status--${kind}`; status.innerHTML = html; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const results = Object.keys(RULES).map(check);
    if (results.includes(false)) {
      form.querySelector(".is-invalid")?.focus();
      if (useMotion) M.animate(form, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
      return;
    }
    // Bots: honeypot filled or submitted impossibly fast → pretend success, send nothing.
    const isBot = field("company_website").value !== "" || Date.now() - openedAt < 3000;
    if (Date.now() - lastSent < 60000) { setStatus("You've just sent a message — please wait a minute before sending another.", "warn"); return; }

    btn.disabled = true; form.setAttribute("aria-busy", "true");
    setLabel(label, "Sending…");
    const data = new FormData(form);
    const name = field("name").value.trim();
    try {
      if (!isBot) {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: field("email").value.trim(), message: field("message").value.trim(), interest: data.getAll("interest"), company_website: field("company_website").value }),
        });
        const out = await res.json().catch(() => ({}));
        if (res.status === 422 && out.errors) {
          // Server-side validation disagreed — show its messages on the fields
          for (const [n, msg] of Object.entries(out.errors)) {
            const el = field(n); if (!el) continue;
            el.classList.add("is-invalid"); el.setAttribute("aria-invalid", "true");
            $(`#${el.getAttribute("aria-describedby").split(" ")[0]}`).textContent = msg;
          }
          form.querySelector(".is-invalid")?.focus();
          return;
        }
        if (res.status === 429) { setStatus(out.error || "Too many messages — please try again in a few minutes.", "warn"); return; }
        if (!res.ok || !out.ok) throw new Error(String(res.status));
      }
      lastSent = Date.now();
      form.reset();
      counter.textContent = "0 / 2000";
      setStatus("", "ok");
      status.textContent = `Thanks, ${name}! Your message is on its way — we reply within one business day.`;
      toast("Message sent ✓");
    } catch {
      const interests = data.getAll("interest").join(", ") || "General enquiry";
      const mail = `mailto:${BRAND.email}?subject=${encodeURIComponent(`${interests} — ${name}`)}&body=${encodeURIComponent(field("message").value)}`;
      setStatus(`We couldn't send that right now. Your message is safe — <a class="link" href="${mail}">send it from your email app instead</a>.`, "error");
    } finally {
      btn.disabled = false; form.removeAttribute("aria-busy");
      setLabel(label, "Send message");
    }
  });
}

boot();
