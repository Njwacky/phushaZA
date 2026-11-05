/* ================================================================
   Pusha — tests/serve-netlify.js
   -----------------------------------------------------------------
   Serves the upload folder with the exact headers Netlify will send,
   so the Content-Security-Policy can be tested locally before it can
   lock a real visitor out of the app.

       node tests/serve-netlify.js [folder] [port]     default: ../site 8100

   Then:  NODE_PATH=/tmp/node_modules node tests/deploy.js http://127.0.0.1:8100/
   ================================================================ */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(process.argv[2] || path.join(__dirname, "..", "site"));
const PORT = Number(process.argv[3] || 8100);

/* read Netlify's _headers file: "path-pattern" then indented "Name: value" lines */
const HEADERS = (() => {
  const out = [];
  try {
    const lines = fs.readFileSync(path.join(ROOT, "_headers"), "utf8").split("\n");
    let current = null;
    for (const raw of lines) {
      const line = raw.replace(/\s+$/, "");
      if (!line || line.startsWith("#")) continue;
      if (!/^\s/.test(line)) {
        current = { glob: line.trim(), headers: {} };
        out.push(current);
      } else if (current) {
        const i = line.indexOf(":");
        if (i > 0) current.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      }
    }
  } catch (e) {}
  return out;
})();

const match = (glob, p) => {
  if (glob === "/*") return true;
  if (glob.endsWith("/*")) return p.startsWith(glob.slice(0, -1));
  return p === glob;
};

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".webmanifest": "application/manifest+json", ".jpg": "image/jpeg",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon",
  ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8"
};

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let rel = url === "/" ? "index.html" : url.replace(/^\/+/, "");
  let file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end("no"); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
  if (!fs.existsSync(file)) {
    const nf = path.join(ROOT, "404.html");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : "not found");
    return;
  }
  const headers = { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" };
  for (const rule of HEADERS) if (match(rule.glob, url)) Object.assign(headers, rule.headers);
  res.writeHead(200, headers);
  res.end(fs.readFileSync(file));
}).listen(PORT, "0.0.0.0", () => {
  console.log("serving " + ROOT + " on http://127.0.0.1:" + PORT + "  (" + HEADERS.length + " header rules)");
});
