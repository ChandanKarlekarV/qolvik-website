# Put qolvik.com live on Cloudflare Pages

The site is built from GitHub by Cloudflare Pages. Every push to `main` then goes live on qolvik.com by itself, usually in about a minute.

## 1. Free qolvik.com from the old Worker

At the moment a Cloudflare **Worker** owns qolvik.com, so nothing else can use it.

1. Cloudflare dashboard → **Workers & Pages** → open the Worker that uses qolvik.com.
2. **Settings → Domains & Routes** → remove `qolvik.com` (and `www.qolvik.com` if it's there).
3. If that Worker isn't used for anything else: **Settings → Delete**.

## 2. Create the Pages project

1. **Workers & Pages → Create → Pages → Connect to Git**.
2. Connect GitHub and choose **ChandanKarlekarV/qolvik-website**.
3. Build settings:
   - Production branch: `main`
   - Framework preset: **None**
   - Build command: `node build.js`
   - Build output directory: `dist`
   - Environment variable: `SITE_URL` = `https://qolvik.com`
4. **Save and Deploy**. You get a test address like `qolvik-website.pages.dev` — open it and check the site.

## 3. Connect qolvik.com

1. In the Pages project → **Custom domains → Set up a custom domain** → `qolvik.com` → Activate.
2. Do the same for `www.qolvik.com`.
3. Cloudflare adds the DNS records itself. Leave the Zoho Mail MX and TXT records as they are.
4. Optional: **Rules → Redirect Rules** → redirect `www.qolvik.com/*` to `https://qolvik.com/$1` (301).

## 4. Remove Vercel

1. vercel.com → project **qolvik** → **Settings → General → Delete Project**.
2. Also delete the old **dotforge** project if it's still there.
3. vercel.com → **Account Settings → Git / Integrations** → remove access to the GitHub repo.

The repository no longer contains any Vercel files (`vercel.json`, `api/`), so nothing breaks.

## Notes

- Security and caching headers come from `_headers`, which Cloudflare Pages reads automatically.
- The 404 page (`404.html`) is used automatically.
- Contact form emails go through Web3Forms — nothing to set up on Cloudflare.
