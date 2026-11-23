// Dev-only WCAG AA contrast audit. In the browser console on any local page:
//   const { audit } = await import('/tools/contrast-audit.js'); audit()
// Not copied into ./dist.
export function audit({ skip = ".mini,[aria-hidden=true],.visually-hidden,script,style,svg,.hp,.ea,.segmented button" } = {}) {
  document.documentElement.classList.remove("js-motion");
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = (el) => { const s = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { s.push(c); if (c.a >= 1) break; } } let b = { r: 255, g: 255, b: 255 }; for (let i = s.length - 1; i >= 0; i--) { const c = s[i]; b = { r: c.r * c.a + b.r * (1 - c.a), g: c.g * c.a + b.g * (1 - c.a), b: c.b * c.a + b.b * (1 - c.a) }; } return b; };
  const fails = {};
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest(skip)) continue;
    const t = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(" ");
    if (!t) continue;
    const cs = getComputedStyle(el); if (cs.display === "none") continue;
    const fg = parse(cs.color), bg = bgOf(el);
    const fm = { r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a) };
    const L1 = lum(fm), L2 = lum(bg), ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const size = parseFloat(cs.fontSize), need = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700) ? 3 : 4.5;
    if (ratio < need) { const k = `${cs.color} on rgb(${bg.r | 0},${bg.g | 0},${bg.b | 0})`; fails[k] ||= { ratio: ratio.toFixed(2), need, n: 0, ex: [] }; fails[k].n++; if (fails[k].ex.length < 3) fails[k].ex.push(`${el.tagName}.${String(el.className).split(" ")[0]}: ${t.slice(0, 24)}`); }
  }
  return fails;
}
