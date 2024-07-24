/**
 * We import these just for type checking as the actual imports
 * are passed as arguments to the function
 * https://github.com/marketplace/actions/github-script#run-a-separate-file
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core = require('@actions/core');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const github = require('@actions/github');

/**
 *
 * @param {core} core
 * @param {github} github
 */
// eslint-disable-next-line @typescript-eslint/no-shadow
module.exports = async (core, github) => {
  try {
    const owner = process.env.OWNER;
    const repo = process.env.REPO;
    const issueNumber = process.env.ISSUE_NUMBER;
    const token = process.env.TOKEN;

    const orderApiToken = process.env.ORDER_API_TOKEN;
    const orderApi = 'https://store-wp.mui.com/wp-json/wc/v3/orders/';

    const octokit = github.getOctokit(token);

    const issue = octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    });

    // add to this regex the possibility that the ORDER ID is wrapped in ** or __
    const orderIdRegex = /(?:\*|_){0,2}?Order ID(?:\*|_){0,2}?: (\d+)/;
    const orderIdMatch = issue.data.body.match(orderIdRegex)[1];
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    if (!orderId) {
      core.setFailed('No Order ID found in issue body');
    } else {
      const order = await fetch(`${orderApi}${orderId}`, {
        headers: {
          Authorization: orderApiToken,
          'User-Agent': 'MUI-Tools-Private/X-Orders-Inspector v1',
        },
      });
      const orderDetails = await order.json();
      const plan =
        orderDetails.line_items?.filter((item) => item.name.test(/\b(pro|premium)\b/i))[0].name ||
        '';

      if (!plan) {
        core.setFailed('No Pro or Premium plan found in order');
      }

      const planName = plan.match(/\b(pro|premium)\b/i)[0].toLowerCase();
      const labelName = `support: ${planName}`;

      const label = octokit.rest.issues.getLabel({
        owner,
        repo,
        name: labelName,
      });

      octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number: issueNumber,
        labels: [...issue.data.labels, label],
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
};
