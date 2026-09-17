// Netlify builds PR deploy previews off the `refs/pull/<n>/head` ref, and
// exposes it here as `deploy.branch === '<n>/head'`.
// VERIFY: confirm this against a real deploy-succeeded payload in the
// Netlify dashboard (Logs > Functions) before relying on it in production —
// the old `review_url` field this replaced no longer exists in this event.

const PR_HEAD_BRANCH_RE = /^(\d+)\/head$/;

const DEPLOY_PREVIEW_CONTEXT = 'deploy-preview';

export default {
  /**
   * @param {import('@netlify/functions').DeploySucceededEvent} event
   */
  async deploySucceeded(event) {
    const { deploy } = event;

    if (deploy.context !== DEPLOY_PREVIEW_CONTEXT) {
      return;
    }

    const prMatch = PR_HEAD_BRANCH_RE.exec(deploy.branch ?? '');
    if (!prMatch) {
      throw new Error(`Could not find a PR number in deploy branch: ${deploy.branch}`);
    }
    const prNumber = prMatch[1];

    let deploySslUrl;
    try {
      deploySslUrl = new URL(deploy.sslUrl);
    } catch {
      throw new Error(`Invalid sslUrl: ${deploy.sslUrl}`);
    }
    if (deploySslUrl.protocol !== 'https:') {
      throw new Error(`Expected an https sslUrl, got: ${deploy.sslUrl}`);
    }

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
        'Circle-Token': process.env.CIRCLE_CI_TOKEN,
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
