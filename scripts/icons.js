// Line icons (24×24, stroke = currentColor via CSS)
const P = {
  mvp: "M5 19c2-6 6-10 14-14-4 8-8 12-14 14Zm0 0 4-4m3-5.5 2.5 2.5M8 9H4l3-3h4m4 4v4l-3 3v-4",
  webapp: "M3 5h18v14H3zM3 9h18M7 13h4M7 16h7",
  website: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z",
  erp: "M3 10 12 5l9 5M5 10v8m4.7-8v8m4.6-8v8M19 10v8M3 20h18",
  uiux: "M4 20l4-1L19 8l-3-3L5 16l-1 4ZM14 7l3 3",
  ds: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM16.5 13a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
  brand: "M12 3l2.6 5.6L20 9.3l-4 4.1.9 5.6L12 16.3 7.1 19l.9-5.6-4-4.1 5.4-.7L12 3Z",
  care: "M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z",
  arrow: "M4 12h15m-5-6 6 6-6 6",
  close: "M6 6l12 12M18 6 6 18",
  cart: "M4 5h2l2 11h10l2-8H7m3 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  plus: "M12 5v14M5 12h14",
  check: "M5 12.5l4.5 4.5L19 7",
  linkedin: "M6 9v10M6 5.5v.01M10 19v-6a3 3 0 0 1 6 0v6m-6-10v10",
  github: "M9 19c-4 1.5-4-2-6-2.5m12 4.5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21",
  dribbble: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.6 3.7c3.6 4.6 6.4 10.3 7.6 16.3M3.1 10.6c6 .2 11.6-1 15.5-4.4M5.4 18.3c3.4-4.4 8.6-6 15.5-4.4",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5.5-1.5v.01",
  facebook: "M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z",
  x: "M4 4h4.5L20 20h-4.5L4 4Zm16 0-6.6 7.2M4 20l6.6-7.2",
  "arrow-up-right": "M7 17 17 7M8 7h9v9",
};

export const icon = (name, cls = "") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[name] || P.plus}"/></svg>`;

// Arrow pair used by .btn__arrow (slides out → in on hover)
export const btnArrow = () => `<span class="btn__arrow" aria-hidden="true">${icon("arrow")}${icon("arrow")}</span>`;
