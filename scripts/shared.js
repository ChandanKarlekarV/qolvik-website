// Shared browser behaviour used by every page
import { ANALYTICS, BRAND, CONTACT } from "./config.js";
import { mountMini } from "./minis.js";
import { socialsHTML, telHref, catalogCard } from "./templates.js";

export { catalogCard };

// Cookieless analytics — only loads when a token is set in config.js
export function initAnalytics() {
  const token = ANALYTICS?.cloudflareToken;
  if (!token || location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
  const s = document.createElement("script");
  s.defer = true;
  s.src = "https://static.cloudflareinsights.com/beacon.min.js";
  s.dataset.cfBeacon = JSON.stringify({ token });
  document.head.append(s);
}

// Full-screen mobile menu (pages other than the homepage)
export function initMobileMenu(getLenis) {
  const btn = document.querySelector(".nav__burger"), menu = document.getElementById("menu");
  if (!btn || !menu) return;
  const set = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    menu.inert = !open;
    menu.setAttribute("aria-hidden", String(!open));
    open ? getLenis?.()?.stop() : getLenis?.()?.start();
  };
  btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) set(false); });
}

export function renderSocials(host) {
  if (host) host.innerHTML = socialsHTML();
}

export function mountCards(root) {
  root.querySelectorAll(".ccard").forEach((c) => mountMini(c.querySelector("[data-mini-host]"), c.dataset.key));
}

// Email / phone links + city, filled from config on every page
export function fillContact() {
  document.querySelectorAll("[data-brand-email]").forEach((a) => { a.textContent = BRAND.email; a.href = `mailto:${BRAND.email}`; });
  document.querySelectorAll("[data-brand-phone]").forEach((a) => { a.textContent = CONTACT.phone; a.href = telHref(); });
  document.querySelectorAll("[data-brand-city]").forEach((el) => (el.textContent = `${CONTACT.city}, India`));
}

