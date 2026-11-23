// =========================================================
//  DOTFORGE — SITE CONFIG  (edit content here)
// =========================================================

export const BRAND = {
  name: "Dotforge",
  tagline: "We forge products, dot by dot.",
  email: "hello@dotforge.studio", // placeholder — replace with your real email
};

// ---------------------------------------------------------
//  CONTACT — PLACEHOLDERS: replace with your real number and city.
//  whatsapp: country code + number, digits only (e.g. "919812345678")
// ---------------------------------------------------------
export const CONTACT = {
  phone: "+91 00000 00000",
  whatsapp: "910000000000",
  city: "Your City",
  region: "Your State",
  country: "IN",
};

// ---------------------------------------------------------
//  SERVICES — numbered rows on the homepage
// ---------------------------------------------------------
export const SERVICES = [
  { title: "UI/UX Design", desc: "Research, wireframes, interfaces and prototypes people understand on day one.", tags: ["Research", "Wireframes", "Figma", "Prototyping"], preview: "finance" },
  { title: "Web Applications", desc: "Dashboards, portals and internal tools with roles, APIs and integrations.", tags: ["React", "Node.js", "APIs", "Auth"], preview: "dashboard" },
  { title: "MVP Development", desc: "From idea to a launched product in weeks — scoped tightly, measured from day one.", tags: ["Scoping", "Prototype", "Launch", "Analytics"], preview: "shop" },
  { title: "Websites", desc: "Fast, beautiful, search-friendly websites that turn visitors into enquiries.", tags: ["Next.js", "SEO", "CMS", "Performance"], preview: "landing" },
  { title: "Campus ERP", desc: "Custom ERP for schools, colleges and universities — admissions to alumni.", tags: ["Admissions", "Fees", "Exams", "Parent app"], preview: "erp" },
];

// ---------------------------------------------------------
//  TECH STACK — CHANGE THIS to match what your team really uses.
//  mono: 2–3 letters shown on the tile.
// ---------------------------------------------------------
export const STACK = {
  Languages: [
    { name: "TypeScript", mono: "TS", note: "Type-safe front and back end" },
    { name: "JavaScript", mono: "JS", note: "The language of the web" },
    { name: "Python", mono: "Py", note: "APIs, data and automation" },
    { name: "Dart", mono: "Da", note: "Cross-platform mobile apps" },
    { name: "SQL", mono: "SQL", note: "Queries, reports, analytics" },
    { name: "HTML & CSS", mono: "</>", note: "Accessible, responsive UI" },
  ],
  Frameworks: [
    { name: "React", mono: "Re", note: "Component-driven interfaces" },
    { name: "Next.js", mono: "Nx", note: "Fast, SEO-friendly web apps" },
    { name: "Node.js", mono: "No", note: "APIs and real-time services" },
    { name: "Django", mono: "Dj", note: "Robust admin-heavy backends" },
    { name: "Flutter", mono: "Fl", note: "iOS & Android from one codebase" },
    { name: "Tailwind CSS", mono: "Tw", note: "Design-system styling" },
  ],
  Databases: [
    { name: "PostgreSQL", mono: "PG", note: "Our default relational database" },
    { name: "MySQL", mono: "My", note: "Proven for ERP workloads" },
    { name: "MongoDB", mono: "Mo", note: "Flexible document storage" },
    { name: "Redis", mono: "Rd", note: "Caching, queues, sessions" },
    { name: "Firebase", mono: "Fb", note: "Realtime data & auth for MVPs" },
    { name: "Supabase", mono: "Sb", note: "Postgres with auth & storage" },
  ],
  "Cloud & tools": [
    { name: "AWS", mono: "AWS", note: "Scalable cloud hosting" },
    { name: "Vercel", mono: "Ve", note: "Instant web deployments" },
    { name: "Docker", mono: "Dk", note: "Consistent environments" },
    { name: "GitHub Actions", mono: "CI", note: "Automated tests & deploys" },
    { name: "Figma", mono: "Fi", note: "Design & prototyping" },
    { name: "Postman", mono: "Pm", note: "API design & testing" },
  ],
};

// ---------------------------------------------------------
//  TEAM — add as many members as you like.
//  photo: optional, e.g. "assets/team/asha.jpg"
// ---------------------------------------------------------
export const TEAM_GROUPS = ["Leadership", "Engineering", "Design", "Delivery"];

export const TEAM = [
  { name: "Founder Name",    role: "Founder & CEO",            team: "Leadership",  bio: "Leads client relationships and product direction.", links: { linkedin: "#" } },
  { name: "Co-founder Name", role: "Co-founder & CTO",         team: "Leadership",  bio: "Architecture, security and engineering standards.", links: { linkedin: "#", github: "#" } },
  { name: "Engineer Name",   role: "Full-stack Engineer",      team: "Engineering", bio: "Builds web apps end to end, from database to UI.", links: { github: "#" } },
  { name: "Engineer Name",   role: "Mobile Engineer",          team: "Engineering", bio: "Parent & student apps for iOS and Android.", links: { github: "#" } },
  { name: "Designer Name",   role: "Lead UI/UX Designer",      team: "Design",      bio: "Turns complex workflows into calm, simple screens.", links: { dribbble: "#" } },
  { name: "Designer Name",   role: "Brand & Motion Designer",  team: "Design",      bio: "Identity, illustration and the motion you see here.", links: { dribbble: "#" } },
  { name: "Manager Name",    role: "Project Manager",          team: "Delivery",    bio: "Keeps timelines honest and clients in the loop.", links: { linkedin: "#" } },
  { name: "Support Name",    role: "Implementation & Support", team: "Delivery",    bio: "Data migration, training and after-launch support.", links: { linkedin: "#" } },
];

export const FAQ = [
  { q: "What does a typical project look like?", a: "A short discovery call, a scoped plan with screens, then weekly working demos until launch. You always know what's next.", ex: "kiln", exNote: "Kiln & Co. went from first call to a live store in 6 weekly sprints." },
  { q: "Do you only design, or also build?", a: "Both. Our designers and engineers work together, so what you approve in Figma is exactly what ships.", ex: "ledger", exNote: "Ledger: researched, designed and prototyped in Figma, then built in Flutter by the same team." },
  { q: "Which tech stack will you use?", a: "The one that fits your product. Most projects use TypeScript, React/Next.js, Node.js and PostgreSQL — we'll explain every choice.", ex: "pulse", exNote: "Pulse Analytics runs on Next.js, TypeScript and PostgreSQL, deployed on Vercel." },
  { q: "Who owns the code and designs?", a: "You do. Every project ends with a documented handover of code, designs and accounts.", ex: "nimbus", exNote: "Nimbus received its full codebase, Figma files, CMS access and a launch checklist." },
  { q: "Can the Campus ERP be customised for us?", a: "That's the point. We map your forms, fee rules and report formats before we build.", ex: "campus-one", exNote: "Campus One maps a school's own attendance rules and sends parent SMS automatically." },
];

// ---------------------------------------------------------
//  SOCIAL LINKS — replace "#" with your real profile URLs
// ---------------------------------------------------------
export const SOCIALS = [
  { key: "linkedin",  name: "LinkedIn",  handle: "/company/dotforge", url: "#" },
  { key: "instagram", name: "Instagram", handle: "@dotforge.studio",  url: "#" },
  { key: "facebook",  name: "Facebook",  handle: "/dotforgestudio",   url: "#" },
  { key: "x",         name: "X",         handle: "@dotforge",         url: "#" },
];

// ---------------------------------------------------------
//  PROJECTS — shown on projects.html.
//  These are CONCEPT projects (design samples) until you add real client work.
//  mini: which live design to show (finance | dashboard | landing | shop | erp | onboard)
// ---------------------------------------------------------
export const PROJECTS = [
  {
    id: "campus-one", title: "Campus One", mini: "erp", category: "ERP", year: "2026", concept: true,
    type: "Campus ERP · K–12 school",
    summary: "A calm, fast ERP that lets teachers take attendance in seconds and keeps parents informed automatically.",
    challenge: "Paper registers and spreadsheets meant attendance took 10 minutes per class and parents heard about absences days later.",
    solution: "One-tap attendance per class, automatic SMS to parents of absent students, and live dashboards for the principal.",
    stack: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
    deliverables: ["UX research", "Attendance & fees modules", "Parent notifications", "Staff training"],
  },
  {
    id: "ledger", title: "Ledger", mini: "finance", category: "UI/UX", year: "2026", concept: true,
    type: "Fintech · Mobile app UI/UX",
    summary: "A friendly wallet app with privacy-first balance hiding and clear spending insights.",
    challenge: "First-time users found existing wallet apps cluttered and worried about showing their balance in public.",
    solution: "A single-glance home, one-tap balance privacy, and a simple weekly spending view.",
    stack: ["Figma", "Flutter", "Firebase"],
    deliverables: ["User interviews", "Wireframes & prototype", "Visual design", "Design system"],
  },
  {
    id: "pulse", title: "Pulse Analytics", mini: "dashboard", category: "Web app", year: "2026", concept: true,
    type: "SaaS · Web application",
    summary: "A revenue dashboard that turns raw orders into answers in seconds.",
    challenge: "Founders were exporting CSVs every week to understand basic revenue trends.",
    solution: "Live KPIs, week/month comparisons and drill-down charts connected straight to their database.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Vercel"],
    deliverables: ["Product design", "Web app build", "API integrations", "Analytics"],
  },
  {
    id: "nimbus", title: "Nimbus", mini: "landing", category: "Website", year: "2026", concept: true,
    type: "SaaS · Marketing website",
    summary: "A fast, conversion-focused website with clear pricing and a crisp brand voice.",
    challenge: "Visitors couldn't tell what the product did or how much it cost.",
    solution: "One clear promise above the fold, transparent pricing with a yearly toggle, and a 98+ performance score.",
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    deliverables: ["Copy & IA", "Web design", "Development", "SEO setup"],
  },
  {
    id: "kiln", title: "Kiln & Co.", mini: "shop", category: "MVP", year: "2026", concept: true,
    type: "E-commerce · MVP",
    summary: "A handmade-goods store launched as an MVP in weeks, built to grow.",
    challenge: "A small maker needed to start selling online quickly without a heavy platform.",
    solution: "A focused product page with variants, a smooth bag and payments — shipped as an MVP and iterated weekly.",
    stack: ["React", "Node.js", "MongoDB", "Docker"],
    deliverables: ["MVP scope", "Store design", "Checkout & payments", "Launch support"],
  },
  {
    id: "companion", title: "Campus Companion", mini: "onboard", category: "MVP", year: "2026", concept: true,
    type: "Education · Mobile MVP",
    summary: "The parent & student app that pairs with Campus One — attendance, fees and notices in your pocket.",
    challenge: "Parents relied on WhatsApp forwards and notice boards for school updates.",
    solution: "A simple onboarding, instant notifications and one-tap fee payment.",
    stack: ["Flutter", "Dart", "Supabase"],
    deliverables: ["Onboarding UX", "Mobile app", "Push notifications", "App store launch"],
  },
];
// ---------------------------------------------------------
//  ANALYTICS — privacy-friendly, cookieless Cloudflare Web Analytics (free).
//  Paste the token from dash.cloudflare.com → Analytics → Web Analytics.
//  Empty = analytics off.
// ---------------------------------------------------------
export const ANALYTICS = { cloudflareToken: "" };
