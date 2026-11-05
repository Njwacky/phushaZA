# Putting Pusha on Netlify

Two ways, both fine. The folder is already built and clean — Netlify never sees
`README.md`, `IMPROVEMENT-AUDIT.md`, `MARKET-AND-GROWTH.md`, `tests/` or the build
scripts.

```
cd app
node build-dist.js          # writes ../site  (666 KB, 40 files, config included)
```

What is in `site/`: `index.html`, `styles.css`, `theme.js`, `manifest.webmanifest`,
`sw.js`, 15 files in `js/`, 10 photos in `img/`, the 9 icons something actually
points at, `_headers`, `netlify.toml`, `404.html`.

---

## A · Drag and drop (30 seconds, no git)

1. `node build-dist.js`
2. Open <https://app.netlify.com/drop>
3. Drag the whole **`site`** folder onto the page.
4. Netlify gives you `https://something-random.netlify.app` with HTTPS already on.
5. Site configuration → **Change site name** so the link is shareable.

That URL is live and installable immediately. This is the route I'd take today.

## B · From a git repo (auto-deploy on push)

1. Push the **whole repo** (including `app/` — the build needs it).
2. Netlify → *Add new site → Import an existing project* → pick the repo.
3. Build settings:
   * **Build command:** `node app/build-dist.js`
   * **Publish directory:** `site`
   * Base directory: leave empty.
4. Deploy. Every push rebuilds `site/` and republishes.

Do **not** create a `netlify.toml` at the repo root: the generated one inside
`site/` is the real config, and a root file would point at the wrong folder.

---

## What the generated config does

`_headers` (works for drag-and-drop and git) applies to every response:

| header | value | why |
|---|---|---|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'self'; base-uri 'none'; form-action 'none'; object-src 'none'` | the app loads nothing except its own files; photos are data URIs, styles are inline attributes |
| `X-Content-Type-Options` | `nosniff` | |
| `Referrer-Policy` | `no-referrer` | a leaked URL here is someone's app |
| `X-Frame-Options` | `SAMEORIGIN` | |
| `Permissions-Policy` | `geolocation=(), camera=(), microphone=(), payment=()` | asks for nothing |
| `Cache-Control` | `public, max-age=0, must-revalidate` | **no file name carries a hash**, so the HTTP cache must not keep them. The service worker is the cache, and its name changes every release |
| `Content-Type` on `manifest.webmanifest` | `application/manifest+json` | some hosts serve it as octet-stream and the browser then ignores the manifest |

I tested the app **through this exact config** locally
(`node tests/serve-netlify.js` — a 20-line server that applies `_headers`):

```
25/25 deployment checks green with the CSP on
check · learn · features  → errors []
0 CSP violations while opening sheets, exporting a backup, and switching language
```

---

## After the first deploy — five things to check on the live URL

```bash
NODE_PATH=/tmp/node_modules node tests/deploy.js https://your-site.netlify.app/
```

Expect `25 checks, 25 passed, pageErrors []`. Then, by thumb:

1. **HTTPS padlock**, and *Force HTTPS* turned on (Domain management → HTTPS).
2. **Install it on an Android phone** — Chrome menu → *Install app* — and confirm
   the icon appears. That proves the manifest, the worker and the icons survived
   the CDN.
3. **Airplane mode**, launch from the icon: ideas, DIY photos, your vault.
4. **iPhone**: fill a name → the *Keep this on your iPhone* card → *Got it* →
   Share → *Add to Home Screen*.
5. **View source** on the live URL and search for `analytics`: there should be
   nothing. Netlify injects nothing by default — keep it that way.

---

## Netlify settings that matter

- **Asset optimization: OFF.** It rewrites and bundles assets, which fights a
  service worker that caches files by name.
- **Snippet injection: none.** Any injected script — Netlify Forms, analytics,
  a chat widget — breaks both the CSP and the "nothing leaves your phone" line on
  the About card.
- **Branch / deploy previews:** they work, but each preview URL is its own origin
  with its own storage. Test the PWA on the **production** URL, not a preview.
- **Rollbacks:** Deploys → pick the previous deploy → *Publish deploy*. Because
  the app ships its own cache name, users on the old build pick the rollback up on
  their next visit.
- **Custom domain:** add it, then turn on *Force HTTPS*; the certificate is
  automatic.

## The one thing to remember before every future upload

```bash
node build-dist.js     # rebuilds site/ from the source
node build-single-file.js   # if you also hand out the one-file version
```

and **bump `CACHE` in `sw.js`** — the folder build checks that every file the
worker lists actually exists, but only you can change its version.

If you upload a new build without bumping `CACHE`, returning visitors keep the
old JavaScript until the browser evicts it. That is the only foot-gun in the whole
deploy.
