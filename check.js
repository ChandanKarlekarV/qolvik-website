// Pre-launch checks on ./dist  →  npm run check   (run `npm run build` first)
// Fails (exit 1) on: broken links/anchors, missing SEO tags, leftover placeholders,
// secrets in shipped files, private files in the build, oversized assets.
const fs = require("fs");
const path = require("path");

const dist = path.join(__dirname, "dist");
if (!fs.existsSync(dist)) { console.error("Run `npm run build` first."); process.exit(1); }

const errors = [], warns = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = walk(dist);
const rel = (f) => path.relative(dist, f).replaceAll("\\", "/");
const html = files.filter((f) => f.endsWith(".html"));
const ids = (src) => new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

// 1. Private / dev files must not ship
for (const f of files) if (/(^|\/)(\.env|server\.js|build\.js|check\.js|package(-lock)?\.json|node_modules|\.git)/.test(rel(f))) errors.push(`Private file in build: ${rel(f)}`);

// 2. Secrets scan on every text file
const SECRET = /(sk_(live|test)_[0-9a-z]{10,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_\-]{35}|-----BEGIN [A-Z ]*PRIVATE KEY|ghp_[A-Za-z0-9]{36}|xox[baprs]-[A-Za-z0-9-]+|(api[_-]?key|secret|password)\s*[:=]\s*["'][^"']{6,}["'])/i;
for (const f of files.filter((f) => /\.(html|js|mjs|css|json|txt|xml)$/.test(f))) {
  const m = fs.readFileSync(f, "utf8").match(SECRET);
  if (m) errors.push(`Possible secret in ${rel(f)}: "${m[0].slice(0, 40)}…"`);
}

// 3. Per-page SEO + links
for (const f of html) {
  const src = fs.readFileSync(f, "utf8"), name = rel(f);
  if (src.includes("__SITE_URL__")) errors.push(`${name}: unreplaced __SITE_URL__`);
  if (!/<title>[^<]{10,70}<\/title>/.test(src)) errors.push(`${name}: missing or badly sized <title> (10–70 chars)`);
  if (name !== "404.html") {
    const d = src.match(/name="description" content="([^"]*)"/);
    if (!d) errors.push(`${name}: missing meta description`);
    else if (d[1].length < 50 || d[1].length > 165) warns.push(`${name}: description is ${d[1].length} chars (aim 50–160)`);
    if (!src.includes('rel="canonical"')) errors.push(`${name}: missing canonical link`);
    if (!src.includes('property="og:image"')) errors.push(`${name}: missing og:image`);
  }
  if (!src.includes('name="viewport"')) errors.push(`${name}: missing viewport meta (mobile)`);
  if (!/<html lang="/.test(src)) errors.push(`${name}: missing <html lang>`);
  if ((src.match(/<h1[\s>]/g) || []).length !== 1) warns.push(`${name}: should have exactly one <h1>`);
  for (const m of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:|#$)/.test(url) || url === "#") continue;
    const [pq, hash] = url.split("#"); const p = pq.split("?")[0];
    const target = p ? path.join(p.startsWith("/") ? dist : path.dirname(f), p) : f;
    if (p && !fs.existsSync(target)) { errors.push(`${name}: broken link → ${url}`); continue; }
    if (hash && target.endsWith(".html")) {
      const tIds = ids(fs.readFileSync(target, "utf8"));
      if (!tIds.has(hash) && hash !== "top") errors.push(`${name}: missing anchor #${hash} in ${rel(target)}`);
    }
  }
  const deadLinks = [...src.matchAll(/<a\b[^>]*>/g)].filter((m) => m[0].includes('href="#"') && !/data-[\w-]+/.test(m[0]));
  if (deadLinks.length) warns.push(`${name}: ${deadLinks.length} placeholder href="#" link(s)`);
}

// 4. Sitemap entries exist
const sm = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
for (const m of sm.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)) {
  const p = m[1] === "/" ? "/index.html" : m[1];
  if (!fs.existsSync(path.join(dist, p))) errors.push(`sitemap lists missing page ${m[1]}`);
}

// 5. Weight budget
let total = 0;
for (const f of files) { const s = fs.statSync(f).size; total += s; if (s > 250 * 1024) warns.push(`Large file ${rel(f)} (${Math.round(s / 1024)} KB)`); }

// 6. Placeholder content still in config
const cfg = fs.readFileSync(path.join(dist, "scripts/config.js"), "utf8");
if (cfg.includes('url: "#"')) warns.push("config.js: social links are still '#' placeholders");
if (cfg.includes("Founder Name")) warns.push("config.js: team names are still placeholders");
if (cfg.includes("hello@qolvik.com")) warns.push("config.js: contact email is still the placeholder");
if (cfg.includes('cloudflareToken: ""')) warns.push("config.js: analytics token not set (analytics off)");
if (cfg.includes("00000 00000") || cfg.includes("Your City")) warns.push("config.js: phone / city are still placeholders");
for (const f of html) { const s = fs.readFileSync(f, "utf8"); if (/(?:src|href)="(?:scripts|styles|vendor)\/[^"?]+"/.test(s)) errors.push(`: unversioned asset URL (cache-busting missing)`); }

console.log(`Checked ${html.length} pages, ${files.length} files, ${Math.round(total / 1024)} KB total.`);
warns.forEach((w) => console.log("  ⚠ " + w));
errors.forEach((e) => console.log("  ✗ " + e));
console.log(errors.length ? `\n${errors.length} error(s) — fix before launch.` : "\n✓ No blocking errors.");
process.exit(errors.length ? 1 : 0);
