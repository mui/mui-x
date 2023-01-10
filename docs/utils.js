/* eslint-disable no-console */
const { Octokit } = require('@octokit/rest');
const { retry } = require('@octokit/plugin-retry');

const MyOctokit = Octokit.plugin(retry);

async function resolveGitRemoteUrl() {
  let remoteUrl = null;
  if (!process.env.PULL_REQUEST_ID) {
    console.log(`Returning ${remoteUrl}, because PULL_REQUEST_ID=${process.env.PULL_REQUEST_ID}`);
    return remoteUrl;
  }
  const octokit = new MyOctokit({
    auth: process.env.GITHUB_TOKEN,
  });
  try {
    const prInfo = await octokit.request(`GET /repos/{owner}/{repo}/pulls/{pull_number}`, {
      owner: 'mui',
      repo: 'mui-x',
      pull_number: process.env.PULL_REQUEST_ID,
    });
    console.log(prInfo);
    console.log(prInfo.data.head.repo);
    remoteUrl = `${prInfo.data.head.repo.owner.html_url}/${prInfo.data.head.repo.name}`;
  } catch (err) {
    console.log('Failed to resolve remote URL from PR:', err);
  }
  return remoteUrl;
}

module.exports = {
  resolveGitRemoteUrl,
};
