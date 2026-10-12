// GitHub contributions for the last year, fetched once at build time.
//
// With a GITHUB_TOKEN environment variable (any personal access token, no scopes
// needed) it uses GitHub's official GraphQL API. Without one it falls back to the
// free community API at github-contributions-api.jogruber.de. If both fail, it
// returns null and the graph is hidden instead of breaking the build.
//
// The numbers refresh whenever the site is rebuilt (every deploy).

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type Contributions = { total: number; weeks: Day[][] };

const LEVELS: Record<string, Day["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fromGitHub(login: string, token: string): Promise<Contributions> {
  const query = `query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { login } }),
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const json = await res.json();
  const cal = json.data.user.contributionsCollection.contributionCalendar;
  return {
    total: cal.totalContributions,
    weeks: cal.weeks.map((w: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }) =>
      w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount, level: LEVELS[d.contributionLevel] ?? 0 })),
    ),
  };
}

async function fromCommunityApi(login: string): Promise<Contributions> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(login)}?y=last`);
  if (!res.ok) throw new Error(`community API ${res.status}`);
  const json: { total: { lastYear: number }; contributions: Day[] } = await res.json();
  // Group days into Sunday-to-Saturday weeks, like GitHub's own graph
  const weeks: Day[][] = [];
  for (const day of json.contributions) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    if (weekday === 0 || weeks.length === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
  }
  return { total: json.total.lastYear, weeks };
}

export async function getContributions(login: string): Promise<Contributions | null> {
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  try {
    if (token) return await fromGitHub(login, token);
  } catch (e) {
    console.warn(`[github] official API failed, trying community API: ${e}`);
  }
  try {
    return await fromCommunityApi(login);
  } catch (e) {
    console.warn(`[github] contributions unavailable, hiding graph: ${e}`);
    return null;
  }
}
