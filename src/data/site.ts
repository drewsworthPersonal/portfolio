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
  "I build production AI and cloud systems for a 24/7 freight brokerage. I designed Data Dump, an LLM pipeline that turns ops chat and email into verified TMS records, run a multi-agent platform where local models do the work and Claude reviews it, and cut server latency 88% along the way.";

export const stats = [
  { value: "24,656", label: "messages processed by AI" },
  { value: "43", label: "draft PRs opened by agents" },
  { value: "414", label: "tests on the AI pipeline" },
  { value: "88%+", label: "latency cut" },
];

export const jobs = [
  {
    role: "Software Engineer",
    org: "GH Logistics LLC",
    place: "San Antonio, TX",
    when: "Jun 2026 to present",
    summary: "Four-person team owning application development and DevOps for a 24/7 freight brokerage.",
    points: [
      "Built a multi-agent platform on a dual-GPU workstation: local Qwen and Gemma models on llama.cpp do the work and Claude reviewers approve each plan. Its agents have opened 43 draft PRs (bug fixes and SOPs), guarded by a GitHub App and push blocks.",
      "Shipped a helpdesk agent on a local LLM that files IT tickets from Telegram and email, with a custom tool plugin, a staff name matcher 100% correct on 274 employees, and a 32-scenario eval suite.",
      "Designed and shipped Data Dump, an LLM pipeline that turns chat and email load updates into verified TMS notes and documents, using Claude Haiku for intake, Sonnet for export and document review, and the Batches API for backlog. Cleared a 24,656-message backlog for under $40, with eval-gated CI and 414 tests.",
      "Cut server latency by over 88% by tracing production 504s to a Vite dev server in production, shipping an optimized static build, and moving blocking BigQuery queries off live request paths.",
      "Designed a normalized 44-table Cloud SQL for PostgreSQL schema, splitting a 131-column loads table into a 31-column core plus 7 satellite tables.",
      "Launched Supplier Bridge, a sealed-bid freight procurement platform, with Firestore security rules (212 tests), Twilio SMS and push alerts, and a bidding stress harness.",
      "Integrated the LoadStop TMS REST API into Bravo Matrix and reworked rate-limited syncs to pull about 9,900 loads in 65 seconds.",
    ],
    tags: ["Claude API", "LLM evals", "Python", "TypeScript", "PostgreSQL", "Cloud Run", "Terraform", "Firebase"],
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
    name: "Multi-agent platform",
    kicker: "GH Logistics · internal",
    blurb: "Local Qwen and Gemma models on llama.cpp do the work, and Claude reviewers approve every plan before anything runs. Agents can only open draft PRs; 43 so far, for bug fixes and SOPs.",
    tags: ["llama.cpp", "Claude", "OpenClaw", "GitHub App"],
  },
  {
    name: "Helpdesk agent",
    kicker: "GH Logistics · company-wide",
    blurb: "Staff message it on Telegram or email to file IT tickets. Custom tools, a preview-then-confirm guard so it can't invent ticket numbers, and a name matcher 100% correct on 274 employees.",
    tags: ["Local LLM", "TypeScript", "Apps Script", "Evals"],
  },
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
  {
    name: "Data Dump",
    feature: true, // full-width card
    kicker: "GH Logistics · production AI",
    blurb: "LLM pipeline that reads ops chat and email, matches each update to a load, and writes verified TMS notes and documents. Claude Haiku for intake, Sonnet for export and review, evals in CI, and personal data masked before any model call.",
    tags: ["Claude API", "Python", "FastAPI", "Cloud Run", "Terraform"],
  },
];

export const education = [
  { school: "University of Texas at San Antonio", degree: "B.S., Software Engineering", when: "Expected May 2027" },
  { school: "Northwest Vista College", degree: "A.S., Computer Science", when: "Dec 2024" },
];
