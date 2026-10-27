import { getCollection } from "astro:content";

// Published posts, newest first. Set `draft: true` in a post's frontmatter to hide it.
export async function getPosts() {
  const posts = await getCollection("blog", (p) => !p.data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const formatDate = (d: Date) =>
  new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);

// About 230 words a minute, never less than 1
export const readingTime = (body = "") => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 230));
