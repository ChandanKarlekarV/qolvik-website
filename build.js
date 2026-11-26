// Build the deployable site into ./dist
//   npm run build                                         → default address below
//   $env:SITE_URL="https://qolvik.com"; npm run build    → your real domain
//
// What it does:
//   1. Copies only website files (whitelist) into ./dist
//   2. Pre-renders config-driven content into the HTML (crawlers see it without JS)
//   3. Adds absolute URLs, business structured data, sitemap.xml and robots.txt
//   4. Adds a build version (?v=hash) to every script/style URL so updates never mix old + new files
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { pathToFileURL } = require("url");

const SITE_URL = (process.env.SITE_URL || "https://qolvik.com").replace(/\/$/, "");
const root = __dirname;
const out = path.join(root, "dist");
const PAGES = ["index.html", "projects.html", "design-system.html", "privacy.html", "terms.html", "404.html"];
const COPY = [...PAGES, "assets", "scripts", "styles", "vendor", "tokens", "favicon.ico", "_headers"];
const SKIP = new Set(["package.json", "brand", "qolvik-logo.png", "qolvik-mark.png"]); // source artwork stays out of the build

async function main() {
  const T = await import(pathToFileURL(path.join(root, "scripts/templates.js")).href);
  const C = await import(pathToFileURL(path.join(root, "scripts/config.js")).href);

  // ---------- 1. Copy ----------
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out);
  for (const item of COPY) {
    const src = path.join(root, item);
    if (!fs.existsSync(src)) throw new Error(`Missing ${item}`);
    fs.cpSync(src, path.join(out, item), { recursive: true, filter: (s) => !SKIP.has(path.basename(s)) });
  }

  // ---------- Build version from the content of all code + styles ----------
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  const hash = crypto.createHash("sha1");
  for (const dir of ["scripts", "styles", "vendor"]) for (const f of walk(path.join(out, dir)).sort()) hash.update(fs.readFileSync(f));
  const V = hash.digest("hex").slice(0, 10);

  // ---------- 2. Pre-render helpers ----------
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fill = (html, attr, content) => {
    const re = new RegExp(`(<(\\w+)\\b[^>]*\\s${esc(attr)}(?=[\\s>])[^>]*>)(</\\2>)`);
    if (!re.test(html)) throw new Error(`Pre-render target not found: ${attr}`);
    return html.replace(re, (_, open, _tag, close) => open + content + close);
  };
  const fillTabs = (html, attr, values) => {
    const re = new RegExp(`(<div[^>]*\\s${esc(attr)}(?=[\\s>])[^>]*>\\s*${esc(T.PILL)})(</div>)`);
    if (!re.test(html)) throw new Error(`Tabs target not found: ${attr}`);
    return html.replace(re, (_, open, close) => open + T.tabButtons(values) + close);
  };
  const common = (html) => html
    .replace(/<span data-year><\/span>/g, `<span data-year>${new Date().getFullYear()}</span>`)
    .replace(/(<a\b[^>]*data-brand-email)([^>]*)href="#"([^>]*)><\/a>/g, `$1$2href="mailto:${C.BRAND.email}"$3>${C.BRAND.email}</a>`)
    .replace(/(<a\b[^>]*data-brand-phone)([^>]*)href="#"([^>]*)><\/a>/g, `$1$2href="${T.telHref()}"$3>${C.CONTACT.phone}</a>`)
    .replace(/<span data-brand-city><\/span>/g, `<span data-brand-city>${C.CONTACT.city}, India</span>`);

  const prerender = {
    "index.html": (h) => {
      h = fill(h, 'data-marquee="0"', T.marqueeHTML(0));
      h = fill(h, 'data-marquee="1"', T.marqueeHTML(1));
      h = fill(h, "data-services", T.servicesHTML());
      h = fill(h, "data-catalog", T.catalogHTML());
      h = fillTabs(h, "data-cat-tabs", T.CATALOG_TABS);
      h = fillTabs(h, "data-stack-tabs", T.STACK_TABS);
      h = fill(h, "data-stack-tiles", T.stackTilesHTML(T.STACK_TABS[0]));
      h = fill(h, "data-erp-list", T.erpFeatsHTML("school"));
      h = fillTabs(h, "data-team-tabs", T.TEAM_TABS);
      h = fill(h, "data-team-count", T.teamCountText());
      h = fill(h, "data-team", T.teamHTML());
      h = fill(h, "data-faq", T.faqHTML());
      h = fill(h, "data-socials", T.socialsHTML());
      h = h.replace('data-count="24" data-count-stack></span>', `data-count="${T.STACK_ALL.length}" data-count-stack>${T.STACK_ALL.length}</span>`);
      h = h.replace(/<span data-count="(\d+)"( data-suffix="([^"]*)")?><\/span>/g, (_, n, __, s = "") => `<span data-count="${n}"${s ? ` data-suffix="${s}"` : ""}>${n}${s}</span>`);
      // Business details for Google (local search)
      const same = C.SOCIALS.map((s) => s.url).filter((u) => /^https?:/.test(u));
      const ld = {
        "@context": "https://schema.org", "@type": "ProfessionalService", name: C.BRAND.name, url: `${SITE_URL}/`,
        logo: `${SITE_URL}/assets/apple-touch-icon.png`, image: `${SITE_URL}/assets/og-image.jpg`,
        description: "Design and engineering studio building MVPs, web applications, websites and campus ERP for schools and colleges.",
        email: C.BRAND.email, telephone: C.CONTACT.phone,
        address: { "@type": "PostalAddress", addressLocality: C.CONTACT.city, addressRegion: C.CONTACT.region, addressCountry: C.CONTACT.country },
        areaServed: "IN", knowsAbout: ["UI/UX design", "Web application development", "MVP development", "Website development", "School ERP", "College ERP"],
        ...(same.length ? { sameAs: same } : {}),
      };
      return h.replace("<!--LD-JSON-->", `<script type="application/ld+json">${JSON.stringify(ld)}</script>`);
    },
    "projects.html": (h) => fillTabs(fill(fill(h, "data-pgrid", T.projectCardsHTML()), "data-socials", T.socialsHTML()), "data-p-tabs", T.PROJECT_TABS),
    "privacy.html": (h) => fill(h, "data-socials", T.socialsHTML()),
    "terms.html": (h) => fill(h, "data-socials", T.socialsHTML()),
    // The source 404 uses relative paths so it also works when opened from disk.
    // Online it is served at any depth (/a/b/c), so make every local link root-absolute.
    "404.html": (h) => h.replace(/((?:href|src)=")(?!https?:|\/|#|data:|mailto:|tel:)([^"]*)"/g,
      (_, a, p) => `${a}/${p.replace(/^index\.html/, "")}"`),
  };

  // ---------- 3 + 4. Finalise each page ----------
  for (const page of PAGES) {
    const f = path.join(out, page);
    let h = fs.readFileSync(f, "utf8");
    if (prerender[page]) h = prerender[page](h);
    h = common(h).replaceAll("__SITE_URL__", SITE_URL);
    h = h.replace(/((?:href|src)=")(\/?(?:scripts|styles|vendor)\/[^"?#]+)"/g, `$1$2?v=${V}"`);
    fs.writeFileSync(f, h);
  }
  // Version every relative import inside the JS modules
  for (const f of walk(path.join(out, "scripts"))) {
    if (!f.endsWith(".js")) continue;
    const src = fs.readFileSync(f, "utf8").replace(/((?:from\s*|import\s*\(\s*))(["'])(\.{1,2}\/[^"'?]+)\2/g, `$1$2$3?v=${V}$2`);
    fs.writeFileSync(f, src);
  }

  // ---------- robots.txt + sitemap.xml ----------
  fs.writeFileSync(path.join(out, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  const today = new Date().toISOString().slice(0, 10);
  const urls = [["/", "1.0", "weekly"], ["/projects.html", "0.8", "monthly"], ["/design-system.html", "0.5", "monthly"], ["/privacy.html", "0.2", "yearly"], ["/terms.html", "0.2", "yearly"]];
  fs.writeFileSync(path.join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(([u, p, c]) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><changefreq>${c}</changefreq><priority>${p}</priority></url>`).join("\n") +
    `\n</urlset>\n`);

  console.log(`Built ./dist for ${SITE_URL} (version ${V}) — upload this folder to your host.`);
}

main().catch((e) => { console.error("Build failed:", e.message); process.exit(1); });
