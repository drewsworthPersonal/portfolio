// All page copy lives here. Edit this file to change text, jobs, or projects.

export const profile = {
  name: "Andrew Velazquez",
  first: "Andrew",
  last: "Velazquez",
  initials: "AV",
  title: "Software engineer",
  location: "San Antonio, TX",
  email: "velazquezandrew27@gmail.com",
  github: "https://github.com/drewsworthh",
  githubLabel: "github.com/drewsworthh",
  linkedin: "https://www.linkedin.com/in/drewsworth",
  linkedinLabel: "linkedin.com/in/drewsworth",
  domain: "drewsworth.dev",
  resume: "/Andrew Velazquez resume.pdf",
};

export const greetings = [
  "Hello",
  "Hola",
  "Xin chào",
  "Bonjour",
  "안녕하세요",
  "Ciao",
  "こんにちは",
  "Olá",
  "你好",
  "Hallo",
  "नमस्ते",
  "Hej",
];

export const about =
  "I build and run cloud systems for a 24/7 freight brokerage. I cut server latency 88%, designed a 44-table PostgreSQL schema for our move off BigQuery, and shipped Supplier Bridge, a sealed-bid procurement platform used by four outside companies.";

export const stats = [
  { value: "88%+", label: "latency cut" },
  { value: "~9,900", label: "loads synced in 65s" },
  { value: "44", label: "Postgres tables designed" },
  { value: "212", label: "security rule tests" },
];

export const jobs = [
  {
    role: "Software Engineer",
    org: "GH Logistics LLC",
    place: "San Antonio, TX",
    when: "Jun 2026 to present",
    summary: "Four-person team owning application development and DevOps for a 24/7 freight brokerage.",
    points: [
      "Cut server latency by over 88% by tracing production 504s to a Vite dev server in production, shipping an optimized static build, and moving blocking BigQuery queries off live request paths.",
      "Designed a normalized 44-table Cloud SQL for PostgreSQL schema, splitting a 131-column loads table into a 31-column core plus 7 satellite tables.",
      "Launched Supplier Bridge, a sealed-bid freight procurement platform, with Firestore security rules (212 tests), Twilio SMS and push alerts, and a bidding stress harness.",
      "Integrated the LoadStop TMS REST API into Bravo Matrix and reworked rate-limited syncs to pull about 9,900 loads in 65 seconds.",
      "Built REST APIs across brokerage microservices, including EDI X12 204 load tenders, and deployed them to Cloud Run with a GitHub CI/CD pipeline.",
    ],
    tags: ["TypeScript", "Node.js", "PostgreSQL", "BigQuery", "Cloud Run", "Firebase", "EDI X12"],
  },
  {
    role: "Software Developer I",
    org: "Ventura Telephone",
    place: "San Antonio, TX",
    when: "Feb 2024 to Feb 2025",
    summary: "Promoted from Software Development Assistant in Sep 2024.",
    points: [
      "Built internal job navigation and payroll web apps for an AT&T contractor using Laravel, PHP, JavaScript, and MySQL.",
      "Added features and REST APIs to business systems, optimized MySQL databases, and modernized legacy code.",
    ],
    tags: ["Laravel", "PHP", "JavaScript", "MySQL"],
  },
];

export const projects = [
  {
    name: "AQUA",
    kicker: "Rowdy Hacks 2026 · 24 hours",
    blurb: "Natural-language-to-SQL assistant. I built the Python NL2SQL engine on Gemini with a self-hosted Ollama fallback, reaching about 80% accuracy at about 5 seconds per answer.",
    tags: ["Python", "Gemini", "RAG", "Ollama"],
    link: "https://aqua-ai.us",
    linkLabel: "aqua-ai.us",
  },
  {
    name: "Supplier Bridge",
    kicker: "GH Logistics · production",
    blurb: "Sealed-bid freight procurement, live with 4 external companies. Firestore rules backed by 212 tests, Twilio alerts, and a stress harness for concurrent bidding.",
    tags: ["Firebase", "Twilio", "Vitest"],
  },
  {
    name: "Bravo Matrix × LoadStop",
    kicker: "GH Logistics · internal",
    blurb: "Third-party TMS integration and QC workspace. Reworked rate-limited syncs to pull about 9,900 loads in 65 seconds.",
    tags: ["REST APIs", "Node.js", "BigQuery"],
  },
  {
    name: "BigQuery to Postgres",
    kicker: "GH Logistics · data",
    blurb: "A normalized 44-table Cloud SQL schema. Split a 131-column loads table into a 31-column core plus 7 satellite tables.",
    tags: ["PostgreSQL", "Cloud SQL", "node-pg-migrate"],
  },
];

export const education = [
  { school: "University of Texas at San Antonio", degree: "B.S., Software Engineering", when: "Expected May 2027" },
  { school: "Northwest Vista College", degree: "A.S., Computer Science", when: "Dec 2024" },
];
