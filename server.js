// Local preview server (development only — never deployed).
//   npm start            → serves the source folder at http://localhost:5173
//   $env:ROOT="dist"; npm start   → serves the built site exactly as it will go live
// Applies the same security headers as production (from _headers) so problems show up locally.
const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, process.env.ROOT || ".");
const port = process.env.PORT || 5173;
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain" };

// Parse the "/*" block of _headers (skip HSTS on plain http localhost)
const headers = {};
try {
  let inGlobal = false;
  for (const line of fs.readFileSync(path.join(__dirname, "_headers"), "utf8").split(/\r?\n/)) {
    if (/^\S/.test(line)) inGlobal = line.trim() === "/*";
    else if (inGlobal && line.includes(":")) {
      const [k, ...v] = line.trim().split(":");
      if (!/strict-transport|cache-control/i.test(k)) headers[k] = v.join(":").trim();
    }
  }
} catch {}

const send = (res, status, file) => {
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain", ...headers }); return res.end("Not found"); }
    res.writeHead(status, { "Content-Type": types[path.extname(file)] || "application/octet-stream", ...headers });
    res.end(data);
  });
};

http.createServer((req, res) => {
  // Local stand-in for Vercel's /api/contact function
  if (req.url.split("?")[0] === "/api/contact") {
    let raw = "";
    req.on("data", (c) => { if (raw.length < 20000) raw += c; }); // oversized bodies are rejected by the handler (413)
    req.on("end", () => {
      try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
      for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
      require("./api/contact.js")(req, res);
    });
    return;
  }
  if (req.method !== "GET" && req.method !== "HEAD") { res.writeHead(405, { Allow: "GET, HEAD", ...headers }); return res.end("Method not allowed"); }
  let p;
  try { p = decodeURIComponent(req.url.split("?")[0]); } catch { res.writeHead(400); return res.end("Bad request"); }
  if (p.endsWith("/")) p += "index.html";
  const file = path.normalize(path.join(root, p));
  if (!file.startsWith(root + path.sep) || /(^|[\\/])\.(?!well-known)/.test(path.relative(root, file))) { res.writeHead(403, headers); return res.end("Forbidden"); }
  fs.stat(file, (err, st) => (err || !st.isFile() ? send(res, 404, path.join(root, "404.html")) : send(res, 200, file)));
}).listen(port, () => console.log(`Dotforge running at http://localhost:${port} (serving ${path.relative(__dirname, root) || "source"})`));
