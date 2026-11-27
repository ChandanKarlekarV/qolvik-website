// =========================================================
//  QOLVIK — homepage
//  Content is pre-rendered into index.html by build.js; this
//  file only adds behaviour: the live ERP demo, tabs, the hero
//  preview, the fee calculator and the contact form.
// =========================================================
import { ERP_PRICING } from "./config.js";
import { initErpApp } from "./erp-app.js";
import { mountMini } from "./minis.js";
import { erpFeatsHTML, inr } from "./templates.js";
import { initPage, segmented, contactForm } from "./shared.js";

const $ = (s) => document.querySelector(s);

initPage();

// Hero: a still preview of the ERP (the live one is just below)
mountMini($("[data-hero-mini]"), "erp", { interactive: false, stage: "sand" });

// Live ERP demo + feature list follow the Schools / Colleges switch
const app = initErpApp($("[data-erp-app]"));
const feats = $("[data-erp-feats]");
if (!feats.children.length) feats.innerHTML = erpFeatsHTML("school");
segmented($("[data-erp-tabs]"), (key) => {
  app.setInstitution(key);
  feats.innerHTML = erpFeatsHTML(key);
});

// ---------- Fee calculator (runs only in the browser; nothing is sent) ----------
const calc = $("[data-calc]");
if (calc) {
  const el = (id) => $(`#${id}`);
  const out = (k) => calc.querySelector(`[data-out="${k}"]`);
  const res = (k) => calc.querySelector(`[data-r="${k}"]`);
  const lakh = (n) => (n >= 1e7 ? `₹${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `₹${(n / 1e5).toFixed(1)} L` : inr(n));
  const update = () => {
    const students = +el("c-students").value;
    const fee = Math.max(0, +el("c-fee").value || 0);
    const late = +el("c-late").value / 100, gain = +el("c-gain").value / 100;
    out("students").textContent = students.toLocaleString("en-IN");
    out("late").textContent = `${Math.round(late * 100)}%`;
    out("gain").textContent = `${Math.round(gain * 100)}%`;
    const total = students * fee, lateAmt = total * late, onTime = lateAmt * gain;
    const P = ERP_PRICING.school;
    const lo = Math.max(P.minYear, students * P.from), hi = Math.max(P.minYear, students * P.to);
    res("total").textContent = lakh(total);
    res("late").textContent = lakh(lateAmt);
    res("gain").textContent = lakh(onTime);
    res("cost").textContent = `${lakh(lo)}–${lakh(hi)}`;
    res("note").textContent = "Money that arrives on time instead of weeks late — better cash flow and fewer follow-up calls, plus the hours saved on attendance, receipts and report cards. An estimate from your own numbers, not a promise.";
  };
  calc.addEventListener("input", update);
  update();
}

contactForm();
