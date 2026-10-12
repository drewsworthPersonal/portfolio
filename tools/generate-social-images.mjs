// Renders the link-preview image, the iPhone home-screen icon, and the default favicon
// from the logo and profile data, using headless Chrome.
//
//   npm run images
//
// Set CHROME_PATH if Chrome or Edge is installed somewhere unusual.

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { logoPaths, logoViewBox, logoSvg } from "../src/data/logo.ts";
import { profile } from "../src/data/site.ts";

const root = resolve(import.meta.dirname, "..");
const out = (name) => join(root, "public", name);

const chrome = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].find((p) => p && existsSync(p));
if (!chrome) throw new Error("Chrome or Edge not found. Set CHROME_PATH.");

const font = (pkg, file) => pathToFileURL(join(root, "node_modules", pkg, "files", file)).href;
const inter = font("@fontsource-variable/inter", "inter-latin-wght-normal.woff2");
const mono = font("@fontsource-variable/jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2");

const mark = (size, color) =>
  `<svg viewBox="${logoViewBox}" width="${size}" height="${size}"><g fill="${color}" fill-rule="evenodd">${logoPaths
    .map((d) => `<path d="${d}"/>`)
    .join("")}</g></svg>`;

const page = (body, css) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; src: url("${inter}") format("woff2"); font-weight: 100 900; }
@font-face { font-family: Mono; src: url("${mono}") format("woff2"); font-weight: 100 800; }
* { margin: 0; box-sizing: border-box; }
${css}
</style></head><body>${body}</body></html>`;

const [domainName, tld] = profile.domain.split(".");

// 1200x630 link preview. Content stays inside the middle 630px so square crops
// (WhatsApp thumbnails) still show the logo and name.
const og = page(
  `<main>
    <div class="logo">${mark(150, "#fafafa")}</div>
    <h1>${profile.name}</h1>
    <p class="role">${profile.title} · ${profile.location}</p>
    <p class="url">${domainName}<span>.${tld}</span></p>
  </main>`,
  `body { width: 1200px; height: 630px; overflow: hidden; background: #0a0a0a; color: #fafafa; font-family: Inter, sans-serif; }
  main { position: relative; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;
    background:
      radial-gradient(60% 70% at 50% 30%, rgba(56, 170, 245, 0.16), transparent 70%),
      radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px) 0 0 / 22px 22px; }
  .logo { filter: drop-shadow(0 0 28px rgba(56, 170, 245, 0.35)); }
  h1 { margin-top: 30px; font-size: 66px; font-weight: 700; letter-spacing: -0.035em; }
  .role { margin-top: 10px; font-size: 28px; color: #a3a3a3; }
  .url { margin-top: 26px; padding: 10px 22px; border: 1px solid #2a2a2a; border-radius: 999px; font-family: Mono, monospace; font-size: 26px; font-weight: 500; }
  .url span { color: #38aaf5; }`,
);

// 180x180 iPhone home-screen icon. iOS rounds the corners itself, so the tile is full-bleed.
const touch = page(
  `<main>${mark(112, "#ffffff")}</main>`,
  `body { width: 180px; height: 180px; overflow: hidden; background: #171717; }
  main { height: 100%; display: grid; place-items: center; }`,
);

const dir = mkdtempSync(join(tmpdir(), "social-"));
function shot(html, width, height, file) {
  const src = join(dir, `${file}.html`);
  writeFileSync(src, html);
  execFileSync(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--force-device-scale-factor=1",
    `--window-size=${width},${height}`,
    `--screenshot=${out(file)}`,
    pathToFileURL(src).href,
  ], { stdio: "ignore" });
  console.log(`wrote public/${file}`);
}

try {
  shot(og, 1200, 630, "og-image.png");
  shot(touch, 180, 180, "apple-touch-icon.png");
  // Default tab icon (Graphite colors) shown before the theme script recolors it
  writeFileSync(out("favicon.svg"), logoSvg("#171717", "#ffffff") + "\n");
  console.log("wrote public/favicon.svg");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
