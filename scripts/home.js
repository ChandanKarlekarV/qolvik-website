// =========================================================
//  QOLVIK — homepage
//  Content is pre-rendered into index.html by build.js; this
//  file only adds behaviour: the live ERP demo, tabs, work
//  previews and the contact form.
// =========================================================
import { initErpApp } from "./erp-app.js";
import { erpFeatsHTML } from "./templates.js";
import { initPage, mountWorkMinis, segmented, contactForm } from "./shared.js";

const $ = (s) => document.querySelector(s);

initPage();

// Live ERP demo + feature list follow the Schools / Colleges switch
const app = initErpApp($("[data-erp-app]"));
const feats = $("[data-erp-feats]");
if (!feats.children.length) feats.innerHTML = erpFeatsHTML("school");
segmented($("[data-erp-tabs]"), (key) => {
  app.setInstitution(key);
  feats.innerHTML = erpFeatsHTML(key);
});

mountWorkMinis($("[data-work]"));
contactForm();
