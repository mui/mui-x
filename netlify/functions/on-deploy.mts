import type { DeploySucceededEvent } from '@netlify/types';

const DEPLOY_PREVIEW_CONTEXT = 'deploy-preview';

// `deploy.branch` is just the head branch name (not a PR ref), and the old
// `review_url` field this replaced no longer exists. Deploy Preview URLs are
// hostnamed `deploy-preview-<n>--<site>.netlify.app` (documented at
// https://docs.netlify.com/deploy/deploy-overview/), so the PR number can be
// read straight off the deploy's own URL instead.
const PREVIEW_URL_PR_RE = /^deploy-preview-(\d+)--/;

function findPrNumber(sslUrl: URL): string {
  const match = PREVIEW_URL_PR_RE.exec(sslUrl.hostname);
  if (!match) {
    throw new Error(`Could not find a PR number in deploy URL: ${sslUrl.href}`);
  }
  return match[1];
}

export default {
  async deploySucceeded(event: DeploySucceededEvent) {
    const { deploy } = event;

    if (deploy.context !== DEPLOY_PREVIEW_CONTEXT) {
      return;
    }

    let deploySslUrl: URL;
    try {
      deploySslUrl = new URL(deploy.sslUrl);
    } catch {
      throw new Error(`Invalid sslUrl: ${deploy.sslUrl}`);
    }
    if (deploySslUrl.protocol !== 'https:') {
      throw new Error(`Expected an https sslUrl, got: ${deploy.sslUrl}`);
    }

    const prNumber = findPrNumber(deploySslUrl);

    // eslint-disable-next-line no-console
    console.info(`PR:`, prNumber);
    // eslint-disable-next-line no-console
    console.info(`url:`, deploySslUrl.href);

    // for more details > https://circleci.com/docs/2.0/api-developers-guide/#
    // Repo is hardcoded: this function is only ever notified about mui/mui-x deploys.
    await fetch(`https://circleci.com/api/v2/project/gh/mui/mui-x/pipeline`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        // Token from https://app.netlify.com/projects/material-ui-x/configuration/env#content
        'Circle-Token': process.env.CIRCLE_CI_TOKEN!,
      },
      body: JSON.stringify({
        // For PR, /head is needed. https://support.circleci.com/hc/en-us/articles/360049841151
        branch: `pull/${prNumber}/head`,
        parameters: {
          // the parameters defined in .circleci/config.yml
          workflow: 'e2e-website', // name of the workflow
          'e2e-base-url': deploySslUrl.href, // deploy preview url
        },
      }),
    });
  },
};
