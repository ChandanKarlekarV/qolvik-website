// =========================================================
//  QOLVIK — SITE CONFIG  (edit content here)
// =========================================================

export const BRAND = {
  name: "Qolvik",
  tagline: "From sketch to scale.",
  email: "hello@qolvik.com", // must be a real inbox — set it up in Zoho Mail (docs/zoho-setup.md, step 1)
};

// ---------------------------------------------------------
//  CONTACT FORM DELIVERY — tried in this order:
//  1. Web3Forms — paste your Access Key from https://web3forms.com (docs/zoho-setup.md, step 2).
//                 Every message is emailed to the inbox you signed up with.
//                 The key is meant to sit in public code; it can only send mail TO you.
//  2. /api/contact on Vercel (serverEmail: true + RESEND_API_KEY + CONTACT_TO).
//  None set up → the visitor's email app opens with the message filled in.
// ---------------------------------------------------------
export const FORM = {
  web3formsKey: "62842f04-54d9-4b93-814d-90e88a775bf4", // ← paste your Web3Forms Access Key here

  serverEmail: false,
};

// ---------------------------------------------------------
//  BOOK A DEMO — paste your Zoho Bookings page link (docs/zoho-setup.md, step 3).
//  Empty = "Book a demo" buttons scroll to the contact form instead.
// ---------------------------------------------------------
export const BOOKING_URL = "";

// ---------------------------------------------------------
//  CONTACT — shown on the site and sent to Google for local search.
//  Leave a value empty ("") to hide it — nothing fake is ever shown.
// ---------------------------------------------------------
export const CONTACT = {
  phone: "+91 90193 40778",  // also turns on the WhatsApp buttons
  city: "Bengaluru",
  region: "Karnataka",
  street: "8th Cross, Shivananda Nagar, Moodalapalya",
  postalCode: "",            // e.g. "560072" — add it so Google Maps places you exactly
  country: "IN",
};

// ---------------------------------------------------------
//  ERP PRICING shown on the site (₹ per student per year, before GST).
//  Range = Standard → List from the internal price book.
// ---------------------------------------------------------
export const ERP_PRICING = {
  school: { from: 180, to: 250, minYear: 50000 },
  college: { from: 300, to: 420, minYear: 150000 },
  setupFrom: 25000,       // one-time setup and data import, from
  foundingSpots: 5,       // founding schools for the 2026–27 year
};

// ---------------------------------------------------------
//  STUDIO SERVICES — the "Also from our studio" grid
//  icon: a line icon from scripts/icons.js
// ---------------------------------------------------------
export const SERVICES = [
  { title: "Websites", icon: "website", desc: "Fast, search-friendly websites for schools, clinics and businesses — built to bring enquiries." },
  { title: "Web Applications", icon: "webapp", desc: "Dashboards, portals and internal tools with roles, payments and integrations." },
  { title: "MVP Development", icon: "mvp", desc: "From idea to a launched product in weeks — scoped tightly and measured from day one." },
  { title: "Mobile Apps", icon: "mobile", desc: "One Flutter app for iOS and Android — parent apps, field apps and consumer products." },
  { title: "UI/UX Design", icon: "uiux", desc: "Research, flows and clickable prototypes people understand on day one." },
  { title: "Campus ERP", icon: "erp", desc: "Our own product for schools, colleges and coaching institutes — see it above." },
];

// ---------------------------------------------------------
//  CAMPUS ERP — feature grid under the live demo (one list per tab)
// ---------------------------------------------------------
export const ERP = {
  school: [
    { icon: "attendance", t: "Attendance in seconds", d: "One tap per class. Parents of absent students get an SMS straight away." },
    { icon: "fees", t: "Fees without chasing", d: "Instalments, concessions, online payment, receipts and automatic reminders." },
    { icon: "report", t: "Report cards, your format", d: "CBSE, ICSE and State board layouts — printed, or shared on the parent app." },
    { icon: "parent", t: "Parent app included", d: "Homework, circulars, fees and results on every parent's phone." },
    { icon: "timetable", t: "Timetable & substitutions", d: "Build the week once. Find a free teacher for a substitution in one click." },
    { icon: "staff", t: "Staff, transport & more", d: "Staff attendance and payroll, bus routes, library and admissions." },
  ],
  college: [
    { icon: "attendance", t: "Semester registration", d: "Credit-based courses, electives and approvals, all online." },
    { icon: "exam", t: "Exam cell workflows", d: "Internal marks with locks, hall tickets for eligible students, results." },
    { icon: "fees", t: "Fees & scholarships", d: "Fee heads per course, instalments, scholarships and online payment." },
    { icon: "hostel", t: "Hostel & library", d: "Room allotment, mess fees and book issue in one place." },
    { icon: "placement", t: "Placements & alumni", d: "Drives, offers and alumni records, all tracked." },
    { icon: "parent", t: "Student & parent app", d: "Timetable, attendance, marks and notices on every phone." },
  ],
};

// ---------------------------------------------------------
//  TEAM — add as many members as you like.
//  photo: optional, e.g. "assets/team/name.webp" (720×756, face centred)
//  No photo yet → initials and "Photo coming soon" are shown.
// ---------------------------------------------------------
export const TEAM = [
  { name: "Chandan Karlekar V", role: "Co-founder & CEO", photo: "assets/team/chandan.webp",
    bio: "Leads clients, partnerships and product direction — the first call on every project.",
    links: { linkedin: "https://www.linkedin.com/in/chandan-karlekar-v-6b41b03b3/" } },
  { name: "Druva Teja", role: "Co-founder & CTO", photo: "assets/team/druva.webp",
    bio: "Owns architecture, security and code quality across the ERP and every client build.",
    links: { linkedin: "https://www.linkedin.com/in/druva-teja-c/" } },
  { name: "Ullas Gowda", role: "Chief Marketing Officer", photo: "assets/team/ullas.webp",
    bio: "Brand, campaigns and partnerships — how schools and founders find Qolvik.",
    links: { linkedin: "https://www.linkedin.com/in/ullas-gowda-8b4993413/" } },
  { name: "Arvind Patil", role: "Developer", photo: "assets/team/arvind.webp",
    bio: "APIs, databases and the business logic behind fees, attendance and reports.",
    links: { linkedin: "https://www.linkedin.com/in/arvind-patil-5221893b3/" } },
  { name: "Pallavi B R", role: "Frontend Developer", photo: "assets/team/pallavi.webp",
    bio: "Turns approved designs into fast, accessible, pixel-accurate screens.",
    links: { linkedin: "https://www.linkedin.com/in/pallavi-br-0b2287448/" } },
  { name: "Anushka P", role: "Frontend Developer", photo: "assets/team/anushka.webp",
    bio: "Responsive layouts, motion and polish that hold up on every phone.",
    links: { linkedin: "https://www.linkedin.com/in/anushka-p-429100452/" } },
];

// ---------------------------------------------------------
//  FOUNDER NOTE — a short note in the founder's own words (edit freely)
// ---------------------------------------------------------
export const FOUNDER_NOTE = {
  by: "Chandan Karlekar V", role: "Co-founder & CEO", photo: "assets/team/chandan.webp",
  text: [
    "Most school software is built for the office, not for the teacher standing in front of forty students. We started Qolvik to change that.",
    "Our ERP is quick to learn, works on an ordinary phone, and is set up around how your school already runs. We're a team of six, so you will always talk to the people who build it.",
  ],
};

// ---------------------------------------------------------
//  GUIDES — helpful articles for school leaders (bring visitors from Google)
//  Each one is its own page: <slug>.html
// ---------------------------------------------------------
export const GUIDES = [
  { slug: "guide-choose-school-erp", title: "How to choose school ERP software: a 12-point checklist", short: "How to choose school ERP software", desc: "Twelve questions to ask any school ERP vendor before you sign — from data ownership to what happens on exam day.", read: "6 min read" },
  { slug: "guide-reduce-late-fees", title: "How to reduce late fee payments in your school", short: "How to reduce late fee payments", desc: "Practical steps that help parents pay on time — clear schedules, reminders that get read, and easy ways to pay.", read: "5 min read" },
  { slug: "guide-excel-to-erp", title: "Moving from Excel to a school ERP in two weeks", short: "From Excel to ERP in two weeks", desc: "A day-by-day plan for switching your school from spreadsheets to an ERP without disrupting classes.", read: "5 min read" },
];

// ---------------------------------------------------------
//  FAQ — also sent to Google as FAQ data
// ---------------------------------------------------------
export const FAQ = [
  { q: "How long does it take to switch to Qolvik ERP?", a: "About two weeks for a school. We import your students and fee records from Excel or your old software, set up your fee rules and report-card formats, and train your staff." },
  { q: "How is the ERP priced?", a: "Per student, per year: ₹180–₹250 for schools and ₹300–₹420 for colleges, plus 18% GST, with a one-time setup from ₹25,000. Hosting, backups, updates and support are included; SMS and WhatsApp messages are billed at cost. Founding schools get setup free and their price locked for three years." },
  { q: "Is our students' data safe?", a: "Every user sees only what their role allows, all connections are encrypted, and data is backed up daily. The data is yours: you can export it at any time." },
  { q: "Can it follow our own rules and formats?", a: "Yes. Fee instalments, concessions, attendance rules and report-card layouts are settings, not custom code — so updates never break your setup." },
  { q: "Do you also build websites and apps?", a: "Yes. Our studio designs and builds websites, web apps, MVPs and mobile apps for schools, startups and businesses. Every project ends with a full handover of code, designs and accounts." },
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
