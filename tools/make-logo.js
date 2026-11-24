// Turns the Qolvik logo artwork into web assets.  Run: node tools/make-logo.js
// Source: assets/brand/qolvik-logo-source.webp (white background)
// Output: transparent logo (PNG + WebP), favicons, Apple touch icon, favicon.ico
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "assets/brand/qolvik-logo-source.webp");
const out = (f) => path.join(root, "assets", f);
const IVORY = { r: 251, g: 247, b: 243, alpha: 1 };

(async () => {
  // 1. Remove the white background: near-white → transparent, soft edges un-blended from white
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const m = Math.min(r, g, b);
    const a = m >= 248 ? 0 : m <= 200 ? 1 : (248 - m) / 48;
    if (a > 0 && a < 1) {
      data[i] = Math.max(0, Math.min(255, Math.round((r - (1 - a) * 255) / a)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round((g - (1 - a) * 255) / a)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round((b - (1 - a) * 255) / a)));
    }
    data[i + 3] = Math.round(a * 255);
  }
  const clean = await sharp(data, { raw: info }).trim({ threshold: 1 }).png().toBuffer();
  const meta = await sharp(clean).metadata();
  console.log(`Trimmed logo: ${meta.width}x${meta.height}`);

  // 2. Square, padded master so it centres nicely in any slot
  const side = Math.max(meta.width, meta.height);
  const square = await sharp({ create: { width: side, height: side, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: clean, gravity: "center" }]).png().toBuffer();

  await sharp(square).resize(512, 512).png({ compressionLevel: 9, palette: false }).toFile(out("qolvik-logo.png"));
  await sharp(square).resize(512, 512).webp({ quality: 88, alphaQuality: 90 }).toFile(out("qolvik-logo.webp"));
  await sharp(square).resize(128, 128).webp({ quality: 90 }).toFile(out("qolvik-mark.webp"));
  await sharp(square).resize(128, 128).png().toFile(out("qolvik-mark.png"));

  // 3. Icons on an ivory tile so the logo stands out on dark browser tabs
  const tile = async (size, pad) => {
    const inner = Math.round(size * (1 - pad * 2));
    const mark = await sharp(square).resize(inner, inner).png().toBuffer();
    return sharp({ create: { width: size, height: size, channels: 4, background: IVORY } }).composite([{ input: mark, gravity: "center" }]).png().toBuffer();
  };
  fs.writeFileSync(out("apple-touch-icon.png"), await tile(180, 0.12));
  fs.writeFileSync(out("favicon-32.png"), await sharp(square).resize(32, 32).png().toBuffer());
  const ico48 = await sharp(square).resize(48, 48).png().toBuffer();
  // favicon.ico wrapping a 48px PNG
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header.writeUInt8(48, 6); header.writeUInt8(48, 7); header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(ico48.length, 14); header.writeUInt32LE(22, 18);
  fs.writeFileSync(path.join(root, "favicon.ico"), Buffer.concat([header, ico48]));

  for (const f of ["qolvik-logo.png", "qolvik-logo.webp", "qolvik-mark.webp", "qolvik-mark.png", "apple-touch-icon.png", "favicon-32.png"]) {
    console.log(f.padEnd(22), Math.round(fs.statSync(out(f)).size / 1024) + " KB");
  }
})();
