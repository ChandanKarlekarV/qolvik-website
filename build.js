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
const PAGES = ["index.html", "studio.html", "projects.html", "guide-choose-school-erp.html", "guide-reduce-late-fees.html", "guide-excel-to-erp.html", "privacy.html", "terms.html", "404.html"];
const COPY = [...PAGES, "assets", "scripts", "styles", "favicon.ico", "_headers"];
// Studio page "Selected work" picks — one per service (ids from PROJECTS in scripts/config.js)
const STUDIO_WORK = ["nimbus", "pulse", "kiln", "kirana-khata", "clinicly", "coachpoint"];
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
  for (const dir of ["scripts", "styles"]) for (const f of walk(path.join(out, dir)).sort()) hash.update(fs.readFileSync(f));
  const V = hash.digest("hex").slice(0, 10);

  // ---------- 2. Pre-render helpers ----------
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const fill = (html, attr, content) => {
    const re = new RegExp(`(<(\\w+)\\b[^>]*\\s${esc(attr)}(?=[\\s>])[^>]*>)(</\\2>)`);
    if (!re.test(html)) throw new Error(`Pre-render target not found: ${attr}`);
    return html.replace(re, (_, open, _tag, close) => open + content + close);
  };
  const city = [C.CONTACT.city, C.CONTACT.region].filter(Boolean).join(", ");
  // Copper loading curtain on every page (pure CSS: it lifts by itself, even if scripts fail)
  const LOADER = `\n  <div class="loader" aria-hidden="true"><div class="loader__in"><span class="loader__word">Qolvik<i>.</i></span><span class="loader__bar"><b></b></span><span class="loader__tag">${C.BRAND.tagline}</span></div></div>`;
  const common = (html) => fill(html, "data-socials", T.socialsHTML())
    .replace(/<body([^>]*)>/, (m) => m + LOADER)
    .replace(/<span data-year><\/span>/g, `<span data-year>${new Date().getFullYear()}</span>`)
    .replace(/(<a\b[^>]*data-brand-email)([^>]*)href="#"([^>]*)><\/a>/g, `$1$2href="mailto:${C.BRAND.email}"$3>${C.BRAND.email}</a>`)
    // Empty phone / city in config.js → the whole row is left out (no placeholders online)
    //   (each data-reach row sits on its own line in the HTML)
    .replace(/^[ \t]*<(?:span|li) data-reach>.*data-brand-(phone|wa|city|address).*\r?\n/gm,
      (m, kind) => ((kind === "city" ? C.CONTACT.city : kind === "address" ? C.CONTACT.street : C.CONTACT.phone) ? m : ""))
    .replace(/<span data-brand-address><\/span>/g, C.CONTACT.street ? `<span data-brand-address>${T.addressText()}</span>` : "")
    .replace(/(<a\b[^>]*data-brand-phone)([^>]*)href="#"([^>]*)><\/a>/g, `$1$2href="${T.telHref()}"$3>${C.CONTACT.phone}</a>`)
    .replace(/(<a\b[^>]*data-brand-wa)([^>]*)href="#"/g, `$1$2href="${T.waHref().replace(/&/g, "&amp;")}"`)
    .replace(/<span data-brand-city><\/span>/g, `<span data-brand-city>${city}, India</span>`);

  const prerender = {
    "index.html": (h) => {
      h = fill(h, "data-erp-feats", T.erpFeatsHTML("school"));
      h = fill(h, "data-services", T.servicesHTML());
      h = fill(h, "data-pricing", T.pricingHTML());
      h = fill(h, "data-guides", T.guidesHTML());
      h = fill(h, "data-team", T.teamHTML());
      h = fill(h, "data-founder", T.founderHTML());
      h = fill(h, "data-faq", T.faqHTML());
      // Business details for Google: company, co-founders, team, services and FAQ
      const same = C.SOCIALS.map((s) => s.url).filter((u) => /^https?:/.test(u));
      const ORG = `${SITE_URL}/#org`;
      const person = (m) => ({
        "@type": "Person", name: m.name, jobTitle: m.role, worksFor: { "@id": ORG },
        ...(m.photo ? { image: `${SITE_URL}/${m.photo}` } : {}),
        ...(m.links?.linkedin?.startsWith("http") ? { sameAs: [m.links.linkedin] } : {}),
      });
      const addr = { "@type": "PostalAddress", addressCountry: C.CONTACT.country,
        ...(C.CONTACT.street ? { streetAddress: C.CONTACT.street } : {}), ...(C.CONTACT.postalCode ? { postalCode: C.CONTACT.postalCode } : {}),
        ...(C.CONTACT.city ? { addressLocality: C.CONTACT.city } : {}), ...(C.CONTACT.region ? { addressRegion: C.CONTACT.region } : {}) };
      const ld = { "@context": "https://schema.org", "@graph": [
        {
          "@type": ["Organization", "ProfessionalService"], "@id": ORG, name: C.BRAND.name,
          url: `${SITE_URL}/`, logo: `${SITE_URL}/assets/apple-touch-icon.png`, image: `${SITE_URL}/assets/og-image.jpg`, slogan: C.BRAND.tagline,
          description: "Bengaluru company building Campus ERP for schools and colleges, plus websites, web apps, MVPs and mobile apps.",
          priceRange: "₹₹", areaServed: [{ "@type": "City", name: "Bengaluru" }, { "@type": "Country", name: "India" }],
          email: C.BRAND.email, ...(C.CONTACT.phone ? { telephone: C.CONTACT.phone } : {}), address: addr,
          knowsAbout: ["UI/UX design", "Web application development", "MVP development", "Website development", "Mobile app development", "School ERP", "College ERP"],
          founder: C.TEAM.filter((m) => /co-founder/i.test(m.role)).map(person),
          employee: C.TEAM.filter((m) => !/co-founder/i.test(m.role)).map(person),
          numberOfEmployees: { "@type": "QuantitativeValue", value: C.TEAM.length },
          hasOfferCatalog: { "@type": "OfferCatalog", name: "Services", itemListElement: C.SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.desc } })) },
          ...(same.length ? { sameAs: same } : {}),
        },
        { "@type": "WebSite", "@id": `${SITE_URL}/#site`, url: `${SITE_URL}/`, name: C.BRAND.name, publisher: { "@id": ORG }, inLanguage: "en-IN" },
        { "@type": "FAQPage", mainEntity: C.FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      ] };
      return h.replace("<!--LD-JSON-->", `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`);
    },
    "studio.html": (h) => fill(fill(h, "data-services", T.servicesHTML()), "data-work", T.workHTML(STUDIO_WORK)),
    "projects.html": (h) => fill(fill(h, "data-pgrid", T.projectCardsHTML()), "data-p-tabs", T.tabButtons(T.PROJECT_TABS)),
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
    h = h.replace(/((?:href|src)=")(\/?(?:scripts|styles)\/[^"?#]+)"/g, `$1$2?v=${V}"`);
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
  const urls = [["/", "1.0", "weekly"], ["/projects.html", "0.8", "monthly"], ["/studio.html", "0.8", "monthly"], ...C.GUIDES.map((g) => [`/${g.slug}.html`, "0.7", "monthly"]), ["/privacy.html", "0.2", "yearly"], ["/terms.html", "0.2", "yearly"]];
  fs.writeFileSync(path.join(out, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(([u, p, c]) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><changefreq>${c}</changefreq><priority>${p}</priority></url>`).join("\n") +
    `\n</urlset>\n`);

  console.log(`Built ./dist for ${SITE_URL} (version ${V}) — upload this folder to your host.`);
}

main().catch((e) => { console.error("Build failed:", e.message); process.exit(1); });
