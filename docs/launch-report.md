# Dotforge website — launch report

Date: 24 Nov 2026 · Scope: the public marketing website (`index`, `projects`, `design-system`, `privacy`, `terms`, `404`).

## Commands

| Command | What it does |
|---|---|
| `npm start` | Local dev server at http://localhost:5173 (with production security headers) |
| `npm run build` | Builds `./dist` for upload. Set your domain first: `$env:SITE_URL="https://yourdomain"; npm run build` |
| `npm run check` | Pre-launch checks on `./dist`: broken links/anchors, SEO tags, leaked secrets, private files, file sizes, placeholder content |
| `npm run preview` | Builds, then serves `./dist` exactly as it will go live (http://localhost:5173) |

---

## 1. Done and verified on this website

| Item | Status | How it was verified |
|---|---|---|
| Meta titles & descriptions | ✅ every page | `npm run check` (length + presence) |
| Social preview image | ✅ 1200×630 JPG, 80 KB | Viewed the image; `og:` + `twitter:` tags on all pages |
| Favicon | ✅ SVG + 32px PNG + `favicon.ico` + Apple touch icon | Served with correct type (200) |
| Sitemap + robots.txt | ✅ generated at build with your domain | Fetched both; sitemap pages all exist |
| Structured data (Google) | ✅ Organization JSON-LD on homepage | Present in built HTML |
| Custom 404 page | ✅ designed, `noindex` | Unknown URL returns HTTP 404 + the page |
| Privacy policy / Terms pages | ✅ drafted templates, linked in footers + form | Loaded on desktop & mobile |
| Clear call to action | ✅ "Start a project" in nav, hero, CTA, 404 | — |
| Form validation | ✅ per-field messages, length limits, blocks `<` `>` | Tested empty, malicious and valid input |
| Clear error messages | ✅ inline, specific, announced to screen readers | Tested |
| Loading state | ✅ button disables + "Sending…" + `aria-busy` | Tested |
| Failure state | ✅ message kept + "send from your email app" fallback | Forced a server error, confirmed |
| Spam & bot protection | ✅ honeypot field, 3-second timing trap, Netlify spam filter | Bot submission got fake success, **0 network calls** |
| Rate-limit (form) | ✅ one message per minute per visitor (client) + Netlify's server limits | Tested resubmit → blocked |
| Security headers | ✅ CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, COOP | All headers present; **0 CSP violations** across all pages |
| Force HTTPS | ✅ HSTS header + host auto-redirect | Header present (host enforces) |
| Restrict CORS | ✅ no CORS headers sent = browsers block cross-site reads | — |
| Secrets off the frontend / never hardcoded | ✅ there are **no** secrets; scanner runs on every check | `npm run check` secret scan: clean |
| Hide `.env` / private files | ✅ build only copies a whitelist; `.gitignore` added | `/.env` → 403 locally; `server.js` not in build |
| Check git history for secrets | ✅ not a git repo yet → no history to leak | — |
| Disable debug / hide detailed errors | ✅ no debug code; server returns plain "Not found" | — |
| Colour contrast (WCAG AA) | ✅ fixed 13 failing colour pairs | Automated audit: **0 failures** on all pages + ERP demo |
| Mobile friendly / layout | ✅ fixed a design-system overflow bug | No horizontal scroll on any page at 375px |
| Broken links | ✅ | Link + anchor checker: clean |
| Compress images / faster load | ✅ 80 KB JPG; animation lib deferred; caching headers | Homepage: 16 requests, ~300 KB, layout shift 0.002 |
| Analytics | ⚙️ installed, **off until you add a token** | Loader only runs on the live domain |
| Test as untrusted user | ✅ XSS strings, bogus email, honeypot, POST to server, path traversal (`/../server.js`) | All rejected or harmless |

---

## 2. Not added — and why (they don't apply to a website with no user accounts)

Real login/logout, password reset with OTP, email verification, delete-account button, onboarding flow, row-level security, database backup, database indexing, Redis caching, admin routes, file uploads, SQL/NoSQL injection, Firebase/Supabase lockdown, server-side permission checks, isolating user data.

This website has **no users, no database and no server code**. Adding a login to a brochure site would create attack surface and running costs with zero benefit. **All of these belong to the Campus ERP product** — see section 4.

---

## 3. Your five questions

### What's wrong with the plan
- **It mixes two different products.** It's a SaaS checklist applied to a marketing site. The site needs SEO, speed, trust and a working contact form; the ERP needs auth, RLS, backups and scale.
- **It treats "add Redis" as the scaling answer.** For the website the CDN *is* the cache. For the ERP, the bottlenecks are database queries and indexes first, then caching.
- **"Do a load test" on a CDN-hosted static site** measures the CDN, not you — and hammering Netlify/Cloudflare can breach their terms. Load-test the ERP's staging API instead (k6).
- **Duplicates:** form validation ×2, clear errors ×2, analytics ×2, mobile ×2, secrets ×3.

### What breaks (found and fixed during this pass)
- The design-system page **overflowed sideways on phones** (whole page zoomed out). Fixed.
- **13 contrast failures** (beige labels, grey text, nav over light sections, team bios). Fixed.
- The old contact form **never actually sent anything** (only opened your mail app) and exposed your email to scrapers. Now it posts to Netlify Forms with a fallback.
- The headline started invisible and animated in, which hurts Google's "Largest Contentful Paint" score. Now it paints immediately.
- Security headers block the page from being framed (good) — but note this also stops anyone embedding your site in an iframe.

### What's overkill right now
- Redis, load testing, error-tracking SaaS (Sentry), admin routes, account deletion — **for the website**. Revisit Sentry when the ERP ships.
- A cookie-consent banner — not needed because analytics are cookieless.
- Separate staging + production for a static site — Netlify's deploy previews cover it.

### What we missed (now added or flagged)
- **Placeholder content is the #1 launch risk:** team names, email, social links, tech stack are still placeholders (`npm run check` warns until fixed).
- **Business email deliverability:** set up SPF, DKIM and DMARC on your domain, or your replies land in spam.
- **Google Search Console** verification + sitemap submission — the site isn't "search visible" until Google knows about it.
- **India's DPDP Act 2023:** your privacy policy is a template; the ERP will hold **children's data**, which needs verifiable parental consent — get legal advice before selling to schools.
- **SMS in India needs TRAI DLT registration** (entity + templates) before the ERP can text parents.
- **Self-host fonts** (optional): removes the Google Fonts dependency for privacy and a little speed.
- **Uptime monitoring** (free: UptimeRobot / Better Stack).

### What you must do manually
1. **Fill in real content** in `scripts/config.js`: email, social URLs, team, tech stack. Run `npm run check` until only analytics warns.
2. **Create a Netlify account** → drag `dist` onto app.netlify.com/drop (or connect a GitHub repo). Pick a site name, e.g. `dotforge` → `dotforge.netlify.app`.
3. If your address differs: `$env:SITE_URL="https://your-address"; npm run build`, then re-upload.
4. **Netlify → Forms**: turn on form detection and email notifications to your inbox.
5. **Cloudflare Web Analytics** (free): create a site, paste the token into `ANALYTICS.cloudflareToken`, rebuild.
6. **Google Search Console**: add the site, verify, submit `/sitemap.xml`.
7. **Run PageSpeed Insights** on the live URL (local speed numbers in this environment were unreliable).
8. **Optional domain** (~₹800–2,500/yr): buy, connect in Netlify, HTTPS is automatic. Then set up SPF/DKIM/DMARC for email.
9. **Lawyer review** of privacy + terms.
10. `git init` and commit — `.gitignore` already excludes `node_modules`, `dist` and `.env` files.

---

## 4. Plan for the Campus ERP product (where the rest of your list belongs)

| Area | Recommendation |
|---|---|
| Auth | Managed auth (Supabase Auth / Auth.js / Clerk): email verification, OTP password reset, sessions in httpOnly cookies, MFA for admins |
| Multi-school isolation | One Postgres DB, `school_id` on every table, **Row-Level Security** policies enforced in the database — never trust the frontend |
| Permissions | Roles (owner, principal, teacher, parent, student) checked **server-side on every request** |
| Database | PostgreSQL with indexes on `school_id` + foreign keys + date columns; connection pooling (PgBouncer); daily backups + point-in-time recovery, **test restores monthly** |
| Caching & scale | Read-heavy dashboards cached in Redis/Valkey with short TTLs; queues for SMS/email; CDN for static assets. Optimise queries before adding cache |
| Security | Parameterised queries/ORM only, server-side validation (zod), sanitise rich text, signed upload URLs with type/size limits + malware scan, rate-limit login/signup/OTP at the edge, secrets only in host env vars, audit log of admin actions |
| Ops | Sentry error tracking, uptime monitoring, k6 load tests on staging (e.g. 2,000 concurrent parents at 8 AM attendance time), separate staging & production |
| Compliance | DPDP Act consent + parental consent for minors, data retention policy, delete-account/export-data flows, DLT-registered SMS |
| Payments | Razorpay/Cashfree hosted checkout — never touch card data |
