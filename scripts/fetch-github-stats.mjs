/**
 * Refreshes src/data/github-stats.json — evidence metadata for the exhibit
 * cards. Run manually whenever you want fresher numbers (output is
 * committed so builds stay hermetic):
 *   GITHUB_TOKEN=<token> node scripts/fetch-github-stats.mjs
 */
import { writeFileSync } from "node:fs";

const REPOS = [
  "manzilone",
  "syncwave-web",
  "Universe-Portfolio",
  "smart-umrah",
  "Jarvis",
];
const OWNER = "SyedAbdulKareem13";

const headers = { "User-Agent": "be-weird-build" };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;
}

const stats = {};
for (const repo of REPOS) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${repo}`, {
    headers,
  });
  if (!res.ok) {
    console.error(`skip ${repo}: HTTP ${res.status}`);
    continue;
  }
  const data = await res.json();
  stats[repo] = {
    stars: data.stargazers_count,
    pushedAt: data.pushed_at,
    language: data.language,
  };
  console.log(`${repo}: ★${data.stargazers_count} pushed ${data.pushed_at}`);
}

writeFileSync(
  "src/data/github-stats.json",
  JSON.stringify(stats, null, 2) + "\n"
);
console.log("wrote src/data/github-stats.json");
