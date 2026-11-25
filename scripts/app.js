// =========================================================
//  QOLVIK — homepage
// =========================================================
import { BRAND, SERVICES, STACK, TEAM, TEAM_GROUPS, FAQ, PROJECTS, FORM } from "./config.js";
import { initErpApp } from "./erp-app.js";
import { icon } from "./icons.js";
import {
  M, useMotion, ease, sleep, finePointer, getLenis, initSmoothScroll, reveals, enhanceButtons, setLabel,
  spotlights, countUps, segmented, accordion, animateIn, toast, scrollText, wordSwap, customCursor, whileVisible,
} from "./motion-kit.js";
import { mountMini } from "./minis.js";
import { renderSocials, mountCards, initAnalytics, fillContact } from "./shared.js";
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
// The demo is ALWAYS a complete, working design. Each cycle the designer selects a block and
// recolours it, the engineer edits the matching line of code, and it "deploys". Nothing is ever wiped.
const TONES = [
  { name: "ivory", label: "Ivory" },
  { name: "stone", label: "Stone" },
  { name: "copper", label: "Copper" },
  { name: "ink", label: "Ink" },
];
const codeHTML = (target, tone) => `<span class="c">// generated from our design tokens</span>
<span class="k">export function</span> Home() {
  <span class="k">return</span> (
    &lt;<span class="t">Hero</span> tone=<span class="s">"<span data-tok="hero">${target === "hero" ? tone : "ivory"}</span>"</span>&gt;
      &lt;h1&gt;Admissions, simplified.&lt;/h1&gt;
      &lt;<span class="t">Button</span> variant=<span class="s">"primary"</span>&gt;Apply now&lt;/<span class="t">Button</span>&gt;
    &lt;/<span class="t">Hero</span>&gt;
    &lt;<span class="t">Cards</span> tone=<span class="s">"<span data-tok="cards">${target === "cards" ? tone : "white"}</span>"</span> /&gt;
  );
}`;

function studio() {
  const root = $("[data-studio]");
  const canvas = $(".studio__canvas", root);
  const cd = $("[data-cursor-design]"), cv = $("[data-cursor-dev]");
  const sel = $("[data-select]"), code = $("[data-code]"), deploy = $("[data-deploy]");
  const hero = $("[data-hero-block]"), cards = $$(".sb--card", root), swatches = $$(".studio__swatches i", root);
  const tool = $("[data-tool]");

  // Complete design + full code from the first frame
  code.innerHTML = codeHTML("hero", "ivory");
  hero.dataset.tone = "0";
  cards.forEach((c) => (c.dataset.tone = "0"));
  if (!useMotion) { cd.style.display = cv.style.display = "none"; return; }

  // Layout position inside an ancestor (ignores transforms → exact even mid-animation)
  const offsetIn = (el, anc) => {
    let x = 0, y = 0;
    for (let n = el; n && n !== anc; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  };
  const TIP = { x: (20 * 5) / 24, y: (20 * 3) / 24 }; // arrow tip inside the 20px cursor icon
  const pt = (el, fx = 0.5, fy = 0.5) => { const o = offsetIn(el, root); return { x: o.x + o.w * fx - TIP.x, y: o.y + o.h * fy - TIP.y }; };
  const move = (c, p, d = 0.7) => M.animate(c, { x: p.x, y: p.y }, { duration: d, ease: [0.45, 0, 0.2, 1] }).finished;
  const click = (c) => M.animate(c.querySelector("svg"), { scale: [1, 0.72, 1] }, { duration: 0.28 }).finished;
  // Selection box: wraps the element exactly (4px padding), glides between targets
  // (opacity only ever changes through Motion — mixing inline styles and animations is what made the old demo go blank)
  let selShown = false;
  const select = (el) => {
    const o = offsetIn(el, canvas);
    const box = { x: o.x - 4, y: o.y - 4, width: `${o.w + 8}px`, height: `${o.h + 8}px` };
    if (!selShown) { selShown = true; M.animate(sel, box, { duration: 0 }); return M.animate(sel, { opacity: 1 }, { duration: 0.2 }).finished; }
    return M.animate(sel, box, { duration: 0.45, ease }).finished;
  };
  const hideSel = () => { selShown = false; return M.animate(sel, { opacity: 0 }, { duration: 0.35 }).finished; };

  const retype = async (tok, word) => {
    const el = $(`[data-tok="${tok}"]`, code);
    el.classList.add("is-editing");
    while (el.textContent.length) { el.textContent = el.textContent.slice(0, -1); await sleep(45); }
    for (const ch of word) { el.textContent += ch; await sleep(70); }
    el.classList.remove("is-editing");
  };

  requestAnimationFrame(() => {
    M.animate(cd, pt(hero, 0.75, 0.75), { duration: 0 });
    M.animate(cv, pt($(".studio__pre", root), 0.75, 0.7), { duration: 0 });
  });
  M.animate(root, { opacity: [0, 1], transform: ["translateY(60px) scale(.97)", "translateY(0px) scale(1)"] }, { duration: 1.2, ease, delay: 0.6 });

  let step = 0;
  const isOn = whileVisible(root, async () => {
    await sleep(1600);
    if (!isOn()) return;
    const hasCode = !!$(".studio__code", root).offsetParent;
    cv.style.display = hasCode ? "" : "none";

    // Alternate: hero, a card, hero, next card …
    const onHero = step % 2 === 0;
    const target = onHero ? hero : cards[(step >> 1) % cards.length];
    const toneIdx = (Number(target.dataset.tone) + 1 + (step % 3 === 2 ? 1 : 0)) % TONES.length;
    step++;

    // 1. Designer selects the block
    await move(cd, pt(tool)); await click(cd);
    await move(cd, pt(target, 0.18, 0.3), 0.6);
    await click(cd);
    await select(target);

    // 2. …picks a colour, the block updates
    await move(cd, pt(swatches[toneIdx]), 0.6);
    await click(cd);
    target.dataset.tone = String(toneIdx);
    if (!onHero) cards.forEach((c) => (c.dataset.tone = String(toneIdx)));
    await sleep(350);
    M.animate(cd, pt(target, 0.8, 0.85), { duration: 0.7, ease });

    // 3. Engineer edits the matching line of code
    if (hasCode) {
      const tok = $(`[data-tok="${onHero ? "hero" : "cards"}"]`, code);
      await move(cv, pt(tok, 1, 0.5), 0.6);
      await click(cv);
      await retype(onHero ? "hero" : "cards", TONES[toneIdx].name);
    } else await sleep(500);

    // 4. Ship it, then tidy up
    await M.animate(deploy, { opacity: [0, 1], transform: ["translateY(14px) scale(.9)", "translateY(0px) scale(1)"] }, { type: "spring", stiffness: 320, damping: 20 }).finished;
    await sleep(1500);
    await Promise.all([
      M.animate(deploy, { opacity: 0, transform: "translateY(8px) scale(.96)" }, { duration: 0.35 }).finished,
      hideSel(),
    ]);
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
  let shown = null, latest = 0;
  // Always renders whatever question is open *right now* — so rapid clicks can't leave a stale example
  const render = () => {
    const id = $("[data-faq] .acc.is-open")?.dataset.ex;
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    shown = id;
    mountMini($("[data-faq-mini]", box), p.mini);
    $("[data-faq-title]", box).textContent = `${p.title} — ${p.type}`;
    $("[data-faq-note]", box).textContent = FAQ.find((x) => x.ex === id).exNote;
    $("[data-faq-link]", box).href = `projects.html#${p.id}`;
  };
  const show = () => {
    const id = $("[data-faq] .acc.is-open")?.dataset.ex;
    if (!id || id === shown) return;
    if (!useMotion || !box.dataset.ready) { render(); box.dataset.ready = "1"; return; }
    const ticket = ++latest; // only the most recent click is allowed to finish the swap
    M.animate(box, { opacity: 0, transform: "translateY(10px) scale(.98)" }, { duration: 0.2 }).then(() => {
      if (ticket !== latest) return;
      render();
      M.animate(box, { opacity: 1, transform: "translateY(0px) scale(1)" }, { duration: 0.5, ease });
    });
  };
  show();
  $$("[data-faq] .acc__btn").forEach((b) => b.addEventListener("click", () => requestAnimationFrame(show)));
}

function footerHop() {
  const el = $("[data-hop]");
  el.innerHTML = [...el.textContent].map((c) => `<span class="hop">${c}</span>`).join("");
}

function navBehaviour() {
  const nav = $(".nav");
  const links = $$(".nav__links a");
  let last = 0;
  addEventListener("scroll", () => {
    const y = scrollY;
    nav.classList.toggle("is-hidden", y > 500 && y > last + 2 && !$(".menu.is-open"));
    if (y < last - 2) nav.classList.remove("is-hidden");
    if (y < innerHeight * 0.5) links.forEach((l) => l.classList.remove("is-active")); // back at the hero: nothing active
    last = y;
  }, { passive: true });
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
// Focus without the browser's instant jump, then glide there with the smooth-scroll engine
const focusField = (el) => { if (!el) return; el.focus({ preventScroll: true }); const l = getLenis(); if (l) l.scrollTo(el, { offset: -160, duration: 0.8 }); else el.scrollIntoView({ block: "center" }); };
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
      focusField(form.querySelector(".is-invalid"));
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
        const email = field("email").value.trim(), message = field("message").value.trim(), interest = data.getAll("interest");
        let res, out;
        if (FORM.web3formsKey) {
          // Direct delivery to your inbox via Web3Forms (works locally and on Vercel)
          res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: FORM.web3formsKey,
              subject: `New enquiry: ${interest.join(", ") || "General"} — ${name}`,
              from_name: `${BRAND.name} website`,
              name, email, replyto: email, message,
              "Interested in": interest.join(", ") || "Not specified",
              botcheck: "",
            }),
          });
          out = await res.json().catch(() => ({}));
          out.ok = res.ok && out.success === true;
        } else if (!FORM.serverEmail) {
          throw new Error("503"); // no email service switched on → show the email-app fallback instantly
        } else {
          // Our own Vercel function (needs RESEND_API_KEY + CONTACT_TO)
          res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message, interest, company_website: field("company_website").value }),
          });
          out = await res.json().catch(() => ({}));
        }
        if (res.status === 422 && out.errors) {
          // Server-side validation disagreed — show its messages on the fields
          for (const [n, msg] of Object.entries(out.errors)) {
            const el = field(n); if (!el) continue;
            el.classList.add("is-invalid"); el.setAttribute("aria-invalid", "true");
            $(`#${el.getAttribute("aria-describedby").split(" ")[0]}`).textContent = msg;
          }
          focusField(form.querySelector(".is-invalid"));
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
    } catch (err) {
      const interests = data.getAll("interest").join(", ") || "General enquiry";
      const mail = `mailto:${BRAND.email}?subject=${encodeURIComponent(`${interests} — ${name}`)}&body=${encodeURIComponent(field("message").value)}`;
      // 503 = email delivery not configured yet (no Resend key) — say so plainly; anything else = temporary failure
      const notSetUp = String(err?.message) === "503";
      setStatus(notSetUp
        ? `Thanks, ${name} — one last step: <a class="link" href="${mail}">tap here to send it from your email app</a>. Everything you wrote is already filled in.`
        : `We couldn't send that right now. Your message is safe — <a class="link" href="${mail}">send it from your email app instead</a>, or try again in a minute.`, notSetUp ? "warn" : "error");
    } finally {
      btn.disabled = false; form.removeAttribute("aria-busy");
      setLabel(label, "Send message");
    }
  });
}

boot();
