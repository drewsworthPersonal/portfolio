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
  "I build production AI and cloud systems for a 24/7 freight brokerage. I designed Data Dump, an LLM pipeline that turns ops chat and email into verified TMS records. I run a multi-agent platform where local models do the work and Claude reviews it, and I built Bravo Builders so operations staff can ship code safely with Claude Code. Along the way I cut server latency by 88%.";

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
    summary: "Joined a four-person application development and DevOps team for a 24/7 freight brokerage; now its sole engineer, owning every app end to end.",
    points: [
      "Built a multi-agent platform on a dual-GPU workstation: local Qwen and Gemma models on llama.cpp do the work and Claude reviewers approve each plan. Its agents have opened 43 draft PRs (bug fixes and SOPs), guarded by a GitHub App and push blocks.",
      "Designed and shipped Data Dump, an LLM pipeline that turns chat and email load updates into verified TMS notes and documents, using Claude Haiku for intake, Sonnet for export and document review, and the Batches API for backlog. Cleared a 24,656-message backlog for under $40, with eval-gated CI and 414 tests.",
      "Built Bravo Builders, a Claude Code plugin and five-week course that lets operations staff build Bravo Matrix changes. Its pre-command hook blocks deploys, merges, force-pushes, and pushes to master, so every session ends in a draft PR.",
      "Built and run the QA module for check-call review across 29 merged PRs: Dialpad click-to-call, FourKites and Indemni pushes, a points-based checklist board, and a staging site for invited testers. Cut each dashboard refresh from about 10 MB to 0.2 MB by sending recent records first and compressing responses.",
      "Shipped a helpdesk agent on a local LLM that files IT tickets from Telegram and email, with a custom tool plugin, one-time-code sign-in verified against the company's Google Workspace accounts, and a 32-scenario eval suite.",
      "Single-handedly built and deployed Supplier Bridge, a sealed-bid freight procurement platform live with 6 external companies including J.B. Hunt, with its Firestore security rules (212 tests), Twilio SMS and push alerts, and a bidding stress harness.",
      "Cut server latency by over 88% by tracing production 504s to a Vite dev server in production, shipping an optimized static build, and moving blocking BigQuery queries off live request paths.",
    ],
    tags: ["Claude API", "Claude Code", "LLM evals", "Python", "TypeScript", "Cloud Run", "Terraform", "Firebase"],
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
    name: "Bravo Builders",
    kicker: "GH Logistics · AI enablement",
    blurb: "A Claude Code plugin and five-week course that lets operations staff build Bravo Matrix changes themselves. A hook checks every command, blocking deploys, merges, and pushes to master, so each session ends in a draft PR.",
    tags: ["Claude Code", "Plugins", "Hooks", "Teaching"],
  },
  {
    name: "QA module",
    kicker: "GH Logistics · production",
    blurb: "Check-call review for the carrier team: Dialpad click-to-call, FourKites and Indemni pushes, and a points-based checklist board. Cut each dashboard refresh from about 10 MB to 0.2 MB.",
    tags: ["Firebase", "Cloud Functions", "Dialpad", "REST APIs"],
  },
  {
    name: "Helpdesk agent",
    kicker: "GH Logistics · company-wide",
    blurb: "Staff message it on Telegram or email to file IT tickets. They sign in with a one-time code checked against their Google Workspace account, and a preview-then-confirm step keeps it from inventing ticket numbers.",
    tags: ["Local LLM", "TypeScript", "Apps Script", "Evals"],
  },
  {
    name: "Supplier Bridge",
    kicker: "GH Logistics · production",
    blurb: "Sealed-bid freight procurement I built and deployed on my own, live with 6 external companies including J.B. Hunt. Firestore rules backed by 212 tests, Twilio alerts, and a stress harness for concurrent bidding.",
    tags: ["Firebase", "Twilio", "Vitest"],
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
