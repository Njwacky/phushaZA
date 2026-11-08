# Pusha usage totals on Netlify

This is **optional, opt-in analytics**, separate from the local Vault. Only app
opens (including reloads), taps on the five navigation tabs, CV print / Save as
PDF **attempts**, and PDF pack download **attempts** are counted. A person must
explicitly opt in; declining or doing nothing sends nothing. The app, Vault and
file:// standalone continue to work without it. The standalone file never asks
for or sends usage counts, even if served over HTTP.

## Setup for the site owner

1. Connect the repository to the Netlify **production** site. Use the root
   `netlify.toml`: build command `node app/build-dist.js`, publish directory
   `site`, functions directory `netlify/functions`, Node 22. Netlify must be
   able to install the npm dependency `@netlify/blobs`. If site settings
   override the repository config, update them to match. This setup requires
   Git-connected builds; dragging only `site/` cannot deploy the functions.
   The analytics endpoints and owner dashboard use the root of the site.
2. In Netlify → Site configuration → Environment variables, create
   `PUSHA_ANALYTICS_KEY` with a long, randomly generated secret (at least 24
   characters; 32 random bytes encoded as hex is recommended). You can generate
   one privately on your own computer with `openssl rand -hex 32`. Make it
   available to **Functions** in the production context. Generate it privately;
   do not put it in the repository, a URL, or a chat message. The collector and
   report fail closed until this is set. Check Netlify's current Functions and
   Blobs limits and costs for your plan before enabling it.
3. Deploy the branch after it is merged to the production branch. Visit
   `https://YOUR-SITE/usage.html`, enter the key, and choose **View totals**.
   The key is sent in an HTTPS Authorization header, held only in the page's
   memory for that request and not added to the URL or browser storage. Rotate
   the environment variable and redeploy if the key is exposed.
4. To verify, visit the production app on a test phone, explicitly allow usage
   counts, tap sections, then wait for a connection and refresh the dashboard.
   Counts may be delayed; check the deployment logs and environment scope if
   the report says analytics is not configured. Preview / branch deploys do not
   collect usage; set and test this on the real production origin.

## Privacy and reliability

- Request bodies contain only a day, a random **batch** identifier and numeric
  counts for an allowlist of actions. No names, IDs, CV text, filenames,
  documents, account numbers, precise timestamps, locations or persistent user
  identifiers are included. The random identifier is unique to each batch and
  makes retries idempotent. This is not a unique-user or return-user counter.
- Netlify necessarily sees network metadata such as IP addresses when requests
  are made; it may keep operational logs under its own policies. Review Netlify
  terms and South African privacy requirements for the deployed service. Do not
  advertise this as zero network tracking.
- A small queue stays on the device while offline (up to 100 new events plus
  one pending batch; events older than seven days are dropped). It is sent only
  while opted in, retried when the app is open and online, and deleted on opt
  out. Counts already sent cannot be individually removed because there is no
  user identifier. Consent and queue keys are excluded from Pusha backups, so
  consent is not transferred to another device.
- Totals are estimates: only opt-ins count, a user clearing storage or never
  reconnecting loses queued events, reloads count as opens, and concurrent tabs
  may race. CV printing cannot distinguish saving a PDF from cancelling.
- The dashboard reports the last 30 UTC days and warns if a 50,000-batch safety
  cap truncates the result. Batches in the Netlify Blobs store remain until the
  owner deletes them; define and follow a retention policy. The named store is
  site-level and shared across deploys, so scope the secret to production only.
  Netlify hosting / storage availability and
  pricing are outside this repository and should be checked before launch.
- The public collector has strict event allowlists, request size limits and an
  origin check, but is **not** a fraud-proof counter: requests can be forged or
  spammed. Use Netlify's available rate-limiting/security controls and monitor
  usage/costs. Protect the reporting endpoint with a strong key and Netlify
  access controls if available. No authentication scheme can make public
  browser events tamper-proof.

## Local tests

Run `npm install`, then `npm run test:usage`. The API tests use a fake Blob
store; they do not prove that your Netlify account, Functions configuration,
production environment key, or network deployment is working. Browser tests
can run with Playwright: `node tests/usage-browser.js http://127.0.0.1:8000/`.
