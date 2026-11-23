// Simple pages (privacy, terms): nav, menu, footer, buttons, contact links, analytics
import { getLenis, initSmoothScroll, reveals, enhanceButtons, customCursor } from "./motion-kit.js";
import { renderSocials, initAnalytics, initMobileMenu, fillContact, initWhatsApp } from "./shared.js";

renderSocials(document.querySelector("[data-socials]"));
fillContact();
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
initSmoothScroll();
customCursor();
enhanceButtons();
reveals();
initMobileMenu(getLenis);
initAnalytics();
initWhatsApp();
