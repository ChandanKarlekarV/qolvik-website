// =========================================================
//  POST /api/contact — Vercel serverless function
//  Receives the website contact form and emails it to you via Resend.
//
//  Environment variables (Vercel → Project → Settings → Environment Variables):
//    RESEND_API_KEY  (secret)  from resend.com → API Keys
//    CONTACT_TO                the inbox that receives enquiries
//                              (without a verified domain, must be your Resend sign-up email)
//    CONTACT_FROM   (optional) e.g. "Dotforge <hello@yourdomain.com>" once your domain is verified
//    CONTACT_DRY_RUN (optional, local testing) "1" = validate everything but don't send
//
//  Security: POST only, same-origin only, 10 KB body limit, server-side validation,
//  honeypot, per-IP rate limit, plain-text email (no HTML injection), header-injection safe,
//  generic error messages (details only in server logs), secrets never sent to the browser.
// =========================================================

const MAX_BODY = 10 * 1024;
const WINDOW_MS = 10 * 60 * 1000;   // 10 minutes
const MAX_PER_WINDOW = 3;           // per IP, per server instance
const hits = new Map();

const INTERESTS = new Set(["UI/UX Design", "Web application", "MVP", "Website", "Campus ERP"]);
// Only plain strings are accepted — objects/arrays (e.g. NoSQL operators like {"$gt": ""}) become ""
const clean = (v, max) => (typeof v === "string" ? v : "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
const oneLine = (v) => v.replace(/[\r\n]+/g, " ");

function validate(body) {
  const data = {
    name: oneLine(clean(body.name, 120)),
    email: oneLine(clean(body.email, 160)).toLowerCase(),
    message: clean(body.message, 4000),
    interest: (Array.isArray(body.interest) ? body.interest : body.interest ? [body.interest] : []).map((i) => clean(i, 40)).filter((i) => INTERESTS.has(i)),
  };
  const errors = {};
  if (data.name.length < 2) errors.name = "Please enter your name (at least 2 characters).";
  else if (data.name.length > 80) errors.name = "Name is too long (max 80 characters).";
  else if (/[<>]/.test(data.name)) errors.name = "Please remove the < and > characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) errors.email = "That email doesn't look right — check for typos.";
  if (data.message.length < 20) errors.message = "Tell us a little more — at least 20 characters.";
  else if (data.message.length > 2000) errors.message = "Message is too long (max 2000 characters).";
  return { data, errors };
}

function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) { hits.set(ip, list); return true; }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return false;
}

const send = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return send(res, 405, { ok: false, error: "Method not allowed." }); }

  // Same-origin only: browsers always send Origin on cross-site POSTs.
  const origin = req.headers.origin;
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  if (origin && host) {
    let originHost = "";
    try { originHost = new URL(origin).host; } catch {}
    if (originHost !== host) return send(res, 403, { ok: false, error: "Forbidden." });
  }

  if (!String(req.headers["content-type"] || "").includes("application/json")) return send(res, 415, { ok: false, error: "Unsupported content type." });
  if (Number(req.headers["content-length"] || 0) > MAX_BODY) return send(res, 413, { ok: false, error: "Message too large." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== "object") return send(res, 400, { ok: false, error: "Invalid request." });

  // Honeypot: real people never fill this hidden field. Pretend success, send nothing.
  if (clean(body.company_website, 200)) return send(res, 200, { ok: true });

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) return send(res, 429, { ok: false, error: "Too many messages — please try again in a few minutes." });

  const { data, errors } = validate(body);
  if (Object.keys(errors).length) return send(res, 422, { ok: false, errors });

  const subject = oneLine(`New enquiry: ${data.interest.join(", ") || "General"} — ${data.name}`).slice(0, 150);
  const text = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Interested in: ${data.interest.join(", ") || "Not specified"}`,
    "",
    data.message,
    "",
    "—",
    `Sent from the website contact form · ${new Date().toISOString()}`,
  ].join("\n");

  if (process.env.CONTACT_DRY_RUN === "1") {
    console.log("[contact] dry run — would send:", { subject, to: process.env.CONTACT_TO || "(unset)" });
    return send(res, 200, { ok: true, dryRun: true });
  }

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO;
  if (!key || !to) {
    console.error("[contact] RESEND_API_KEY or CONTACT_TO is not configured");
    return send(res, 503, { ok: false, error: "Our contact form isn't available right now." });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.CONTACT_FROM || "Dotforge Website <onboarding@resend.dev>", to: [to], reply_to: data.email, subject, text }),
    });
    if (!r.ok) {
      console.error("[contact] Resend error", r.status, (await r.text()).slice(0, 300));
      return send(res, 502, { ok: false, error: "We couldn't send your message right now." });
    }
    return send(res, 200, { ok: true });
  } catch (e) {
    console.error("[contact] send failed", e?.message);
    return send(res, 502, { ok: false, error: "We couldn't send your message right now." });
  }
};

module.exports._validate = validate; // exposed for local tests
