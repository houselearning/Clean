import { execSync } from "child_process";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({ auth: process.env.GH_TOKEN });

const repo = process.env.REPO.split("/");
const owner = repo[0];
const repoName = repo[1];

const issueBody = process.env.ISSUE_BODY;

const prMatch = issueBody.match(/Fixes PR:\s*#(\d+)/);
const coauthorMatch = issueBody.match(/Coauthors:\s*(.*)/);

if (!prMatch) process.exit(0);

const prNumber = prMatch[1];
const coauthors = coauthorMatch ? coauthorMatch[1].split(",").map(s => s.trim()) : [];

(async () => {
  const pr = await octokit.pulls.get({ owner, repo: repoName, pull_number: prNumber });
  const branch = pr.data.head.ref;

  execSync(`git fetch origin ${branch}`);
  execSync(`git checkout ${branch}`);

  execSync(`echo "Fixes applied from issue" >> FIXES.txt`);

  let coauthorFooter = "";
  for (const c of coauthors) coauthorFooter += `\nCo-authored-by: ${c}`;

  execSync(`git add .`);
  execSync(
    `git -c user.name="HouseLearningCleaned[bot]" -c user.email="bot@houselearning.com" commit -m "Apply automated fixes"${JSON.stringify(
      coauthorFooter
    )}`
  );

  execSync(`git push origin ${branch}`);
})();
