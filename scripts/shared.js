// =========================================================
//  Shared browser behaviour used by every page
//  (no animation libraries — CSS does the motion)
// =========================================================
import { ANALYTICS, BRAND, CONTACT, FORM, PROJECTS, BOOKING_URL } from "./config.js";
import { mountMini } from "./minis.js";
import * as T from "./templates.js";
const { telHref, waHref, addressText } = T;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

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

// Mobile menu
export function initMenu() {
  const btn = $(".nav__burger"), menu = $("#menu");
  if (!btn || !menu) return;
  const set = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    menu.inert = !open;
  };
  btn.addEventListener("click", () => set(btn.getAttribute("aria-expanded") !== "true"));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => set(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("is-open")) { set(false); btn.focus(); } });
  matchMedia("(min-width: 861px)").addEventListener("change", (e) => e.matches && set(false));
}

// Email / phone / WhatsApp links + city, filled from config on every page.
// Anything left empty in config.js is removed, so no placeholder ever shows.
export function fillContact() {
  const drop = (el) => (el.closest("[data-reach]") || el).remove();
  $$("[data-brand-email]").forEach((a) => { a.textContent = BRAND.email; a.href = `mailto:${BRAND.email}`; });
  $$("[data-brand-phone]").forEach((a) => { if (!CONTACT.phone) return drop(a); a.textContent = CONTACT.phone; a.href = telHref(); });
  $$("[data-brand-wa]").forEach((a) => { if (!CONTACT.phone) return drop(a); a.href = waHref(); });
  $$("[data-brand-city]").forEach((el) => { if (!CONTACT.city) return drop(el); el.textContent = `${CONTACT.city}${CONTACT.region ? ", " + CONTACT.region : ""}, India`; });
  $$("[data-brand-address]").forEach((el) => { if (!CONTACT.street) return drop(el); el.textContent = addressText(); });
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

// Static previews inside work cards
export function mountWorkMinis(root = document) {
  $$("[data-id]", root).forEach((c) => {
    const p = PROJECTS.find((x) => x.id === c.dataset.id), host = $("[data-mini-host]", c);
    if (p && host && !host.firstElementChild) mountMini(host, p.mini, { interactive: false, stage: p.stage });
  });
}

// Small segmented button group → calls onChange(value)
export function segmented(el, onChange) {
  if (!el) return;
  el.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-value]");
    if (!b || b.getAttribute("aria-pressed") === "true") return;
    $$("button", el).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    onChange(b.dataset.value);
  });
}

// ---------- Contact form ----------
const RULES = {
  name: (v) => (v.length < 2 ? "Please enter your name." : ""),
  email: (v) => (!v ? "Please enter your email so we can reply." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "That email doesn't look right — check for typos (e.g. name@school.in)." : ""),
  message: (v) => (v.length < 20 ? `Tell us a little more — at least 20 characters (${v.length}/20).` : v.length > 2000 ? "Message is too long (max 2000 characters)." : ""),
};
export function contactForm() {
  const form = $("#contact-form");
  if (!form) return;
  const status = $("[data-form-status]", form), btn = $("[data-submit]", form), label = $("[data-submit-label]", btn);
  const openedAt = Date.now();
  let lastSent = 0;
  const field = (n) => form.elements.namedItem(n);
  const errEl = (el) => $(`#${el.getAttribute("aria-describedby").split(" ")[0]}`);
  const check = (n) => {
    const el = field(n), msg = RULES[n](el.value.trim());
    el.classList.toggle("is-invalid", !!msg);
    el.setAttribute("aria-invalid", String(!!msg));
    errEl(el).textContent = msg;
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
    if (Object.keys(RULES).map(check).includes(false)) { form.querySelector(".is-invalid")?.focus(); return; }
    // Bots: honeypot filled or submitted impossibly fast → pretend success, send nothing.
    const isBot = field("company_website").value !== "" || Date.now() - openedAt < 3000;
    if (Date.now() - lastSent < 60000) { setStatus("You've just sent a message — please wait a minute before sending another.", "warn"); return; }

    btn.disabled = true; form.setAttribute("aria-busy", "true"); label.textContent = "Sending…";
    const data = new FormData(form);
    const name = field("name").value.trim(), org = field("org").value.trim(), phone = field("phone")?.value.trim() || "";
    const interest = data.getAll("interest");
    try {
      if (!isBot) {
        const email = field("email").value.trim(), message = field("message").value.trim();
        let res, out;
        if (FORM.web3formsKey) {
          res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: FORM.web3formsKey,
              subject: `New enquiry: ${interest.join(", ") || "General"} — ${name}${org ? ` (${org})` : ""}`,
              from_name: `${BRAND.name} website`, name, email, replyto: email, message,
              "School or company": org || "—", Phone: phone || "—", "Interested in": interest.join(", ") || "Not specified", botcheck: "",
            }),
          });
          out = await res.json().catch(() => ({}));
          out.ok = res.ok && out.success === true;
        } else if (!FORM.serverEmail) {
          throw new Error("503"); // no email service switched on → show the email-app fallback
        } else {
          res = await fetch("/api/contact", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message: [message, org && `— ${org}`, phone && `Phone: ${phone}`].filter(Boolean).join("\n\n"), interest, company_website: field("company_website").value }),
          });
          out = await res.json().catch(() => ({}));
        }
        if (res.status === 429) { setStatus(out.error || "Too many messages — please try again in a few minutes.", "warn"); return; }
        if (!res.ok || !out.ok) throw new Error(String(res.status));
      }
      lastSent = Date.now();
      form.reset(); counter.textContent = "0 / 2000";
      setStatus("", "ok");
      status.textContent = `Thanks, ${name}! Your message is on its way — we reply within one working day.`;
    } catch (err) {
      const subject = `${interest.join(", ") || "Enquiry"} — ${name}${org ? ` (${org})` : ""}`;
      const mail = `mailto:${BRAND.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(field("message").value)}`;
      const notSetUp = String(err?.message) === "503";
      setStatus(notSetUp
        ? `Thanks, ${name} — one last step: <a class="link" href="${mail}">tap here to send it from your email app</a>. Everything you wrote is already filled in.`
        : `We couldn't send that right now. Your message is safe — <a class="link" href="${mail}">send it from your email app instead</a>, or try again in a minute.`, notSetUp ? "warn" : "error");
    } finally {
      btn.disabled = false; form.removeAttribute("aria-busy"); label.textContent = "Send message";
    }
  });
}

// "Book a demo" buttons → Zoho Bookings page when BOOKING_URL is set
export function initBooking() {
  if (!/^https:\/\//.test(BOOKING_URL || "")) return;
  $$("[data-book]").forEach((a) => { a.href = BOOKING_URL; a.target = "_blank"; a.rel = "noopener"; });
}

// build.js pre-renders these sections into the HTML. If the page is served
// without building (raw files, another host), fill any empty ones here.
const SECTIONS = {
  "data-erp-feats": () => T.erpFeatsHTML("school"),
  "data-services": T.servicesHTML,
  "data-pricing": T.pricingHTML,
  "data-guides": T.guidesHTML,
  "data-team": T.teamHTML,
  "data-founder": T.founderHTML,
  "data-faq": T.faqHTML,
  "data-socials": T.socialsHTML,
  "data-pgrid": T.projectCardsHTML,
  "data-p-tabs": () => T.tabButtons(T.PROJECT_TABS),
};
const STUDIO_WORK = ["nimbus", "pulse", "kiln", "kirana-khata", "clinicly", "coachpoint"];
function hydrate() {
  for (const [attr, html] of Object.entries(SECTIONS))
    $$(`[${attr}]`).forEach((el) => { if (!el.firstElementChild) el.innerHTML = html(); });
  $$("[data-work]").forEach((el) => { if (!el.firstElementChild) el.innerHTML = T.workHTML(STUDIO_WORK); });
}

// Everything a plain page needs
export function initPage() {
  hydrate();
  initMenu();
  initBooking();
  fillContact();
  initAnalytics();
}
