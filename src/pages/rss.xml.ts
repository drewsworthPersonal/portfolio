import type { APIRoute } from "astro";
import { getPosts } from "../data/blog";

// RSS 2.0 feed of the blog, built at build time
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL("https://drewsworth.dev");
  const posts = await getPosts();
  const items = posts
    .map((p) => {
      const url = new URL(`/blog/${p.id}/`, base).href;
      return `<item><title>${esc(p.data.title)}</title><link>${url}</link><guid>${url}</guid><description>${esc(p.data.description)}</description><pubDate>${p.data.pubDate.toUTCString()}</pubDate></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>drewsworth.dev blog</title><link>${new URL("/blog/", base).href}</link><description>Notes from Andrew Velazquez on building software and AI systems.</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
