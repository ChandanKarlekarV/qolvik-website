# Qolvik — layout plan v3

References: Linear (two-tone headlines, dark hero, product canvas under the fold),
Vercel (visible grid lines, "+" crosshair corners, mono labels), top agency sites
(numbered service rows, pinned horizontal scroll, giant footer wordmark, cursor follower).

Palette stays: white → black greys + beige accent. Dark sections = hero, stack, team.
Type: Inter Tight (display) · Instrument Serif italic (accent words) · Manrope (body) · JetBrains Mono (labels).

```
┌──────── NAV (floating pill) ─ logo · Services Design Stack Process Team · [Let's talk] ┐
│ HERO (dark, grid lines)                                                              │
│   ● Available for new projects                                                      │
│   We design and build [products ⟳ MVPs ⟳ web apps ⟳ websites ⟳ campus ERP]           │
│   that people love to use.   (grey second line)                                      │
│   [Start a project] [See our work]                                                   │
│   ┌──────────── MOTION GRAPHIC: "Design → Code" canvas ───────────────┐              │
│   │ Designer cursor draws UI blocks │ Engineer cursor types code │ "Deployed ✓" │   │
│   └──────────────────────────────────────────────────────────────────┘              │
├── STACK MARQUEE (two rows, opposite directions) ─────────────────────────────────────┤
├── STATEMENT (big paragraph, words light up as you scroll) ───────────────────────────┤
├── SERVICES (numbered rows · hover fills black · preview follows cursor) ─────────────┤
│   01 UI/UX Design  02 Web Applications  03 MVP Development  04 Websites  05 Campus ERP │
├── HOW WE DESIGN (pinned horizontal scroll; swipe on mobile) ─────────────────────────┤
│   Research → Wireframes → Visual design → Prototype → Design system (each animated)   │
├── STACK (dark) tabs: Languages · Frameworks · Databases · Cloud & tools               │
│   tiles grid (left)                    │ animated database schema (right, sticky)     │
├── CAMPUS ERP (bento: dashboard mock + modules + institution tabs) ───────────────────┤
├── PROCESS (sticky heading + progress · steps light up as you scroll) ────────────────┤
├── TEAM (dark, filter, data-driven) ──────────────────────────────────────────────────┤
├── FAQ ───────────────────────────────────────────────────────────────────────────────┤
├── CTA: giant headline + rotating circular "Start a project" button + form w/ chips ─┤
└── FOOTER: giant wordmark (letters hop on hover) · links ─────────────────────────────┘
Global: custom cursor ring (desktop), smooth scroll, reduced-motion fallback.
```

Content lives in `scripts/config.js` (services, stack, team, FAQ).
