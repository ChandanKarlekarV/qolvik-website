// Dev-only stress test. In the browser console on the homepage:
//   const { stress } = await import('/tools/stress.js'); await stress()
// Hammers every interactive control, then reports errors, state mismatches and long tasks.
export async function stress({ rounds = 40 } = {}) {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const errors = [], problems = [], longTasks = [];
  const onErr = (e) => errors.push(String(e.message || e.reason || e));
  addEventListener("error", onErr); addEventListener("unhandledrejection", onErr);
  const po = new PerformanceObserver((l) => l.getEntries().forEach((e) => longTasks.push(Math.round(e.duration))));
  try { po.observe({ type: "longtask", buffered: false }); } catch {}

  // 1. Segmented tabs: rapid random clicks
  for (const sel of ["[data-cat-tabs]", "[data-stack-tabs]", "[data-erp-tabs]", "[data-team-tabs]"]) {
    const box = $(sel); if (!box) continue;
    for (let i = 0; i < rounds; i++) { pick($$("button", box)).click(); if (i % 5 === 0) await sleep(16); }
    await sleep(650);
    const active = $$("button", box).filter((b) => b.getAttribute("aria-pressed") === "true");
    if (active.length !== 1) problems.push(`${sel}: ${active.length} active tabs`);
    const pill = $(".segmented__pill", box), a = active[0];
    if (pill && a && Math.abs(pill.offsetWidth - a.offsetWidth) > 2) problems.push(`${sel}: pill width ${pill.offsetWidth} ≠ tab ${a.offsetWidth}`);
  }
  const stackTab = $("[data-stack-tabs] [aria-pressed=true]")?.dataset.value;
  if ($$("[data-stack-tiles] .tile").length === 0) problems.push(`stack tiles empty for ${stackTab}`);

  // 2. ERP demo: views + institutions interleaved
  const views = $$(".ea [data-v]"), insts = $$("[data-erp-tabs] button");
  for (let i = 0; i < rounds; i++) { pick(views).click(); if (i % 3 === 0) pick(insts).click(); if (i % 4 === 0) await sleep(10); }
  await sleep(700);
  const on = $$(".ea [data-v].is-on");
  if (on.length !== 1) problems.push(`ERP: ${on.length} active nav items`);
  else if ($("[data-ea-title]").textContent.trim() !== on[0].textContent.trim()) problems.push(`ERP: title "${$("[data-ea-title]").textContent}" ≠ nav "${on[0].textContent.trim()}"`);
  const s = $("[data-ea-search]"); for (const q of ["a", "ar", "zzz", "", "<img src=x onerror=alert(1)>", ""]) { s.value = q; s.dispatchEvent(new Event("input")); }
  if (document.querySelector(".ea img[src=x]")) problems.push("ERP search rendered HTML from input!");

  // 3. FAQ accordion: rapid toggles, then check the side example matches the open question
  const faqBtns = $$("[data-faq] .acc__btn");
  for (let i = 0; i < rounds; i++) { pick(faqBtns).click(); if (i % 4 === 0) await sleep(20); }
  await sleep(900);
  const open = $$("[data-faq] .acc.is-open");
  if (open.length > 1) problems.push(`FAQ: ${open.length} panels open`);
  if (open.length === 1) {
    const want = open[0].dataset.ex, title = $("[data-faq-title]")?.textContent || "";
    const link = $("[data-faq-link]")?.getAttribute("href") || "";
    if (!link.endsWith("#" + want)) problems.push(`FAQ side example shows ${link} but open question wants #${want} ("${title}")`);
  }

  // 4. Every button inside the live mini designs
  for (let i = 0; i < 3; i++) for (const b of $$(".ccard .mini button")) b.click();
  await sleep(300);

  // 5. Contact form: double/triple submit
  const f = $("#contact-form");
  if (f) { for (let i = 0; i < 5; i++) f.dispatchEvent(new Event("submit", { cancelable: true })); }

  // 6. Scroll storm, ending at the top: hero must be visible
  for (let i = 0; i < 30; i++) { scrollTo(0, Math.random() * document.body.scrollHeight); await sleep(16); }
  scrollTo(0, 0); await sleep(1200);
  for (const sel of [".hero__title", ".hero__lead", ".studio"]) {
    const el = $(sel), cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (+cs.opacity < 0.9 || cs.visibility === "hidden") problems.push(`${sel} not visible at top (opacity ${cs.opacity})`);
    if (r.bottom < 0) problems.push(`${sel} off-screen at top`);
  }
  if ($$(".nav__links a.is-active").length) problems.push("nav link still highlighted at top");

  // 7. Resize storm (pinned horizontal section recalculates)
  await sleep(100);
  dispatchEvent(new Event("resize")); dispatchEvent(new Event("resize"));

  await sleep(500);
  po.disconnect(); removeEventListener("error", onErr); removeEventListener("unhandledrejection", onErr);
  return { errors, problems, longTasks: { count: longTasks.length, worstMs: Math.max(0, ...longTasks) } };
}
