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

    core.debug(`>>> Issue Body: ${issue.data.body}`);

    // add to this regex the possibility that the ORDER ID is wrapped in ** or __
    const orderIdRegex = /(?:\*|_){0,2}?Order ID(?:\*|_){0,2}?: (\d+)/;
    const orderIdMatch = issue.data.body.match(orderIdRegex);
    const orderId = orderIdMatch ? orderIdMatch[1] : null;

    core.debug(`>>> Order ID: ${orderId}`);

    if (!orderId) {
      core.info('No Order ID found in issue body');
    } else {
      const order = await fetch(`${orderApi}${orderId}`, {
        headers: {
          Authorization: orderApiToken,
          'User-Agent': 'MUI-Tools-Private/X-Orders-Inspector v1',
        },
      });

      const orderDetails = await order.json();

      core.debug(`>>> Order Items: ${orderDetails.line_items?.join(',')}`);

      const plan =
        orderDetails.line_items?.filter((item) => /\b(pro|premium)\b/i.test(item.name))[0].name ||
        '';

      if (!plan) {
        core.info('No Pro or Premium plan found in order');
        return;
      }

      const planName = plan.match(/\b(pro|premium)\b/i)[0].toLowerCase();
      const labelName = `support: ${planName}`;

      core.debug(`>>> planName: ${planName}`);
      core.debug(`>>> labelName: ${labelName}`);

      const label = await github.rest.issues.getLabel({
        owner,
        repo,
        name: labelName,
      });

      core.debug(`>>> new label: ${label.name}`);

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
