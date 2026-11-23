// Shared browser behaviour used by every page
import { ANALYTICS, BRAND, CONTACT } from "./config.js";
import { mountMini } from "./minis.js";
import { socialsHTML, telHref, whatsappHref, catalogCard } from "./templates.js";

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

// Email / phone / WhatsApp links + city, filled from config on every page
export function fillContact() {
  document.querySelectorAll("[data-brand-email]").forEach((a) => { a.textContent = BRAND.email; a.href = `mailto:${BRAND.email}`; });
  document.querySelectorAll("[data-brand-phone]").forEach((a) => { a.textContent = CONTACT.phone; a.href = telHref(); });
  document.querySelectorAll("[data-whatsapp]").forEach((a) => { a.href = whatsappHref(); a.target = "_blank"; a.rel = "noopener"; });
  document.querySelectorAll("[data-brand-city]").forEach((el) => (el.textContent = `${CONTACT.city}, India`));
}

// Floating "Chat on WhatsApp" button (hidden while the contact section is on screen)
export function initWhatsApp() {
  if (document.querySelector(".wa-fab")) return;
  const a = document.createElement("a");
  a.className = "wa-fab";
  a.href = whatsappHref();
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chat with Dotforge on WhatsApp");
  a.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg><span>Chat on WhatsApp</span>`;
  document.body.append(a);
  const contact = document.getElementById("contact");
  if (contact) new IntersectionObserver(([e]) => a.classList.toggle("is-hidden", e.isIntersecting), { threshold: 0.15 }).observe(contact);
}
