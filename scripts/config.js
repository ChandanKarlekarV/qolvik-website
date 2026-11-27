// =========================================================
//  QOLVIK — SITE CONFIG  (edit content here)
// =========================================================

export const BRAND = {
  name: "Qolvik",
  tagline: "From sketch to scale.",
  email: "hello@qolvik.com", // placeholder — replace with your real email
};

// ---------------------------------------------------------
//  CONTACT FORM DELIVERY — Web3Forms (free, 250 messages/month).
//  Get a key at https://web3forms.com (enter the inbox that should receive messages),
//  paste it below. This key is designed to be public — it only lets people send TO you.
//  Empty = the form falls back to the /api/contact function (Resend) if that is configured.
// ---------------------------------------------------------
// serverEmail: set to true once RESEND_API_KEY + CONTACT_TO are added in Vercel (uses /api/contact).
export const FORM = { web3formsKey: "", serverEmail: false };

// ---------------------------------------------------------
//  CONTACT — PLACEHOLDERS: replace with your real number and city.
//  phone is shown on the site; city is used for local search
// ---------------------------------------------------------
// Leave phone / city empty ("") to hide them — nothing fake is ever shown.
export const CONTACT = {
  phone: "",      // e.g. "+91 98765 43210" — also turns on the WhatsApp button
  city: "",       // e.g. "Bengaluru"
  region: "",     // e.g. "Karnataka"
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
  { title: "Mobile Apps", desc: "iOS and Android apps from one codebase — parent apps, field apps and consumer products.", tags: ["Flutter", "iOS", "Android", "Push"], preview: "onboard" },
  { title: "Campus ERP", desc: "ERP for schools, colleges and coaching institutes — admissions, attendance, fees and exams.", tags: ["Admissions", "Fees", "Exams", "Parent app"], preview: "erp" },
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
//  photo: optional, e.g. "assets/team/name.webp" (720×756, face centred)
//  No photo yet → initials are shown.
// ---------------------------------------------------------
export const TEAM_GROUPS = ["Leadership", "Engineering"];

export const TEAM = [
  { name: "Chandan Karlekar V", role: "Co-founder & CEO", team: "Leadership", photo: "assets/team/chandan.webp",
    bio: "Leads clients, partnerships and product direction — the first call on every project.",
    links: { linkedin: "https://www.linkedin.com/in/chandan-karlekar-v-6b41b03b3/" } },
  { name: "Druva Teja", role: "Co-founder & CTO", team: "Leadership", photo: "assets/team/druva.webp",
    bio: "Owns architecture, security and code quality across the ERP and every client build.",
    links: { linkedin: "https://www.linkedin.com/in/druva-teja-c/" } },
  { name: "Ullas Gowda", role: "Chief Marketing Officer", team: "Leadership",
    bio: "Brand, campaigns and partnerships — how schools and founders find Qolvik.",
    links: { linkedin: "https://www.linkedin.com/in/ullas-gowda-8b4993413/" } },
  { name: "Arvind Patil", role: "Developer", team: "Engineering",
    bio: "APIs, databases and the business logic behind fees, attendance and reports.",
    links: { linkedin: "https://www.linkedin.com/in/arvind-patil-5221893b3/" } },
  { name: "Pallavi B R", role: "Frontend Developer", team: "Engineering", photo: "assets/team/pallavi.webp",
    bio: "Turns approved designs into fast, accessible, pixel-accurate screens.",
    links: { linkedin: "https://www.linkedin.com/in/pallavi-br-0b2287448/" } },
  { name: "Anushka P", role: "Frontend Developer", team: "Engineering", photo: "assets/team/anushka.webp",
    bio: "Responsive layouts, motion and polish that hold up on every phone.",
    links: { linkedin: "https://www.linkedin.com/in/anushka-p-429100452/" } },
];

export const FAQ = [
  { q: "What does a typical project look like?", a: "A short discovery call, a scoped plan with screens, then weekly working demos until launch. You always know what's next.", ex: "kiln", exNote: "Kiln & Co. went from first call to a live store in 6 weekly sprints." },
  { q: "Do you only design, or also build?", a: "Both. Our designers and engineers work together, so what you approve in Figma is exactly what ships.", ex: "ledger", exNote: "Ledger: researched, designed and prototyped in Figma, then built in Flutter by the same team." },
  { q: "Which tech stack will you use?", a: "The one that fits your product. Most projects use TypeScript, React/Next.js, Node.js and PostgreSQL — we'll explain every choice.", ex: "pulse", exNote: "Pulse Analytics runs on Next.js, TypeScript and PostgreSQL, deployed on Vercel." },
  { q: "Who owns the code and designs?", a: "You do. Every project ends with a documented handover of code, designs and accounts.", ex: "nimbus", exNote: "Nimbus received its full codebase, Figma files, CMS access and a launch checklist." },
  { q: "Can the Campus ERP be customised for us?", a: "That's the point. We map your forms, fee rules and report formats before we build.", ex: "campus-one", exNote: "Campus One maps a school's own attendance rules and sends parent SMS automatically." },
];

// ---------------------------------------------------------
//  SOCIAL LINKS — paste the real profile URL. Empty "" = hidden.
//  (When all are empty the "Follow the studio" block is hidden.)
// ---------------------------------------------------------
export const SOCIALS = [
  { key: "linkedin",  name: "LinkedIn",  handle: "/company/qolvik", url: "" },
  { key: "instagram", name: "Instagram", handle: "@qolvik.studio",  url: "" },
  { key: "facebook",  name: "Facebook",  handle: "/qolvikstudio",   url: "" },
  { key: "x",         name: "X",         handle: "@qolvik",         url: "" },
];

// ---------------------------------------------------------
//  PROJECTS — shown on projects.html (2–3 per service).
//  concept: true = an in-house studio build / design concept, labelled "Concept" on the site.
//  When you finish real client work, add it here with concept: false.
//  mini: which live design to show (finance | dashboard | landing | shop | erp | onboard)
//  stage: optional backdrop (beige | sand | grey | dark)
// ---------------------------------------------------------
export const PROJECTS = [
  // ---- one of each service first (sets the order of the filter tabs) ----
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
    id: "pulse", title: "Pulse Analytics", mini: "dashboard", category: "Web app", year: "2026", concept: true,
    type: "SaaS · Web application",
    summary: "A revenue dashboard that turns raw orders into answers in seconds.",
    challenge: "Founders were exporting CSVs every week to understand basic revenue trends.",
    solution: "Live KPIs, week/month comparisons and drill-down charts connected straight to their database.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Vercel"],
    deliverables: ["Product design", "Web app build", "API integrations", "Analytics"],
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
    id: "nimbus", title: "Nimbus", mini: "landing", category: "Website", year: "2026", concept: true,
    type: "SaaS · Marketing website",
    summary: "A fast, conversion-focused website with clear pricing and a crisp brand voice.",
    challenge: "Visitors couldn't tell what the product did or how much it cost.",
    solution: "One clear promise above the fold, transparent pricing with a yearly toggle, and a 98+ performance score.",
    stack: ["Next.js", "Tailwind CSS", "Vercel"],
    deliverables: ["Copy & IA", "Web design", "Development", "SEO setup"],
  },
  {
    id: "companion", title: "Campus Companion", mini: "onboard", category: "Mobile app", year: "2026", concept: true,
    type: "Education · Parent & student app",
    summary: "The parent & student app that pairs with Campus One — attendance, fees and notices in your pocket.",
    challenge: "Parents relied on WhatsApp forwards and notice boards for school updates.",
    solution: "A simple onboarding, instant notifications and one-tap fee payment.",
    stack: ["Flutter", "Dart", "Supabase"],
    deliverables: ["Onboarding UX", "Mobile app", "Push notifications", "App store launch"],
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

  // ---- second and third builds per service ----
  {
    id: "collegia", title: "Collegia", mini: "erp", stage: "sand", category: "ERP", year: "2026", concept: true,
    type: "Campus ERP · Degree college",
    summary: "Semester registration, internal marks and hall tickets in one flow for a multi-department college.",
    challenge: "Every department kept its own spreadsheet, so the exam cell spent the last week of each semester reconciling marks by hand.",
    solution: "One shared student record, department-wise attendance, internal-marks entry with locks, and hall tickets generated only for eligible students.",
    stack: ["Django", "PostgreSQL", "React", "Docker"],
    deliverables: ["Process mapping", "Exam cell module", "Role-based access", "Data migration"],
  },
  {
    id: "seller-hub", title: "Seller Hub", mini: "dashboard", stage: "grey", category: "Web app", year: "2026", concept: true,
    type: "Marketplace · Seller portal",
    summary: "A portal where small sellers see orders, payouts and returns without calling support.",
    challenge: "Sellers called the support line daily to ask about payouts and order status.",
    solution: "Live order and payout views, a returns queue, and downloadable GST-ready statements.",
    stack: ["React", "Node.js", "PostgreSQL", "Redis"],
    deliverables: ["Service design", "Seller portal", "Payout reports", "Admin tools"],
  },
  {
    id: "tiffinly", title: "Tiffinly", mini: "shop", stage: "sand", category: "MVP", year: "2026", concept: true,
    type: "Food subscription · MVP",
    summary: "A home-cooked meal subscription tested with real customers in under a month.",
    challenge: "The founder wanted to know whether office workers would pay for weekly tiffin plans before investing in an app.",
    solution: "A simple plan picker, UPI checkout and a kitchen dashboard — launched to one neighbourhood and measured weekly.",
    stack: ["Next.js", "Supabase", "Razorpay"],
    deliverables: ["Lean scope", "Ordering flow", "Kitchen dashboard", "Launch analytics"],
  },
  {
    id: "coachpoint", title: "Coachpoint", mini: "landing", stage: "beige", category: "Website", year: "2026", concept: true,
    type: "Coaching institute · Website",
    summary: "A fast website for a coaching institute with clear batches, fees and a one-tap enquiry.",
    challenge: "Parents phoned the office to ask the same questions about batches, timings and fees.",
    solution: "Batch and fee plans on one page, results up front, and an enquiry form that goes straight to the counsellor.",
    stack: ["Astro", "Tailwind CSS", "Cloudflare"],
    deliverables: ["Content plan", "Web design", "Local SEO", "Enquiry tracking"],
  },
  {
    id: "kirana-khata", title: "Kirana Khata", mini: "finance", stage: "grey", category: "Mobile app", year: "2026", concept: true,
    type: "Retail · Shop ledger app",
    summary: "A credit-ledger app that helps neighbourhood shops track dues and send polite reminders.",
    challenge: "Shopkeepers tracked customer credit in notebooks and lost track of who owed what.",
    solution: "A balance-first home screen, one-tap entries and WhatsApp reminders in the customer's language.",
    stack: ["Flutter", "Firebase", "Cloud Functions"],
    deliverables: ["Field research", "Mobile app", "Reminders", "Play Store launch"],
  },
  {
    id: "clinicly", title: "Clinicly", mini: "onboard", stage: "grey", category: "UI/UX", year: "2026", concept: true,
    type: "Healthcare · Appointment app UI/UX",
    summary: "A booking flow for small clinics that patients can finish in under a minute.",
    challenge: "Patients dropped off a long sign-up form before ever booking an appointment.",
    solution: "Book first, sign up later: three short steps, clear time slots and reminders patients actually read.",
    stack: ["Figma", "Usability testing", "Design tokens"],
    deliverables: ["Journey map", "Clickable prototype", "Usability tests", "Developer handoff"],
  },
  {
    id: "vidya", title: "Vidya Coaching ERP", mini: "erp", stage: "grey", category: "ERP", year: "2026", concept: true,
    type: "Campus ERP · Coaching institute",
    summary: "Batch-wise attendance, test scores and fee instalments for a growing coaching chain.",
    challenge: "Three branches tracked students and fees differently, so the owner never had one clear picture.",
    solution: "One system for all branches: batch attendance, weekly test results for parents and instalment reminders.",
    stack: ["React", "Node.js", "MySQL", "AWS"],
    deliverables: ["Branch setup", "Fees & instalments", "Test results", "Owner dashboard"],
  },
  {
    id: "franchise-desk", title: "Franchise Desk", mini: "dashboard", stage: "sand", category: "Web app", year: "2026", concept: true,
    type: "Multi-branch business · Operations dashboard",
    summary: "One dashboard comparing sales and orders across every franchise branch.",
    challenge: "Head office waited for each branch's Excel report at month end.",
    solution: "Branch-wise sales, orders and targets updated daily, with alerts when a branch falls behind.",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Docker"],
    deliverables: ["Data model", "Dashboard build", "Role-based access", "Daily alerts"],
  },
  {
    id: "tutor-match", title: "Tutor Match", mini: "onboard", stage: "beige", category: "MVP", year: "2026", concept: true,
    type: "Education marketplace · MVP",
    summary: "An MVP matching parents with verified home tutors by subject and area.",
    challenge: "Parents found tutors only through word of mouth, with no way to compare or verify them.",
    solution: "A three-step onboarding, subject and area matching, and a simple demo-class booking — launched in one city first.",
    stack: ["Flutter", "Supabase", "Node.js"],
    deliverables: ["Lean scope", "Onboarding flow", "Matching logic", "Pilot launch"],
  },
];
// ---------------------------------------------------------
//  ANALYTICS — privacy-friendly, cookieless Cloudflare Web Analytics (free).
//  Paste the token from dash.cloudflare.com → Analytics → Web Analytics.
//  Empty = analytics off.
// ---------------------------------------------------------
export const ANALYTICS = { cloudflareToken: "" };
