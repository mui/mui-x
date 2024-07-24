/**
 * @param {Object} params
 * @param {import("@actions/core")} params.core
 * @param {ReturnType<import("@actions/github").getOctokit>} params.github
 * @param {import("@actions/github").context} params.context
 */
module.exports = async ({ core, context, github }) => {
  try {
    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const issueNumber = context.issue.number;

    const orderApiToken = process.env.ORDER_API_TOKEN;
    const orderApi = 'https://store-wp.mui.com/wp-json/wc/v3/orders/';

    const issue = await github.rest.issues.get({
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

      const label = await github.rest.issues.getLabel({
        owner,
        repo,
        name: labelName,
      });

      await github.rest.issues.addLabels({
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
