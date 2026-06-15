/**
 * @param {object} event
 * @param {string} event.body - https://jsoneditoronline.org/#left=cloud.fb1a4fa30a4f475fa6887071c682e2c1
 */
exports.handler = async (event) => {
  const { payload } = JSON.parse(event.body);
  const repo = payload.review_url.match(/github\.com\/(.*)\/pull\/(.*)/);
  if (!repo) {
    throw new Error(`No repo found at review_url: ${payload.review_url}`);
  }

  // eslint-disable-next-line no-console
  console.info(`repo:`, repo[1]);
  // eslint-disable-next-line no-console
  console.info(`PR:`, repo[2]);
  // eslint-disable-next-line no-console
  console.info(`url:`, payload.deploy_ssl_url);

  // Trigger via the GitHub App pipeline-run endpoint so the resulting checks report through
  // the CircleCI GitHub App (not the legacy OAuth app). https://circleci.com/docs/api/v2/
  await fetch(`https://circleci.com/api/v2/project/gh/${repo[1]}/pipeline/run`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      // Token from https://app.netlify.com/projects/material-ui-x/configuration/env#content
      'Circle-Token': process.env.CIRCLE_CI_TOKEN,
    },
    body: JSON.stringify({
      // CircleCI "GitHub App" pipeline-definition id for mui/mui-x (not a secret). Stable for
      // the life of the pipeline definition: it does not change per run or when
      // .circleci/config.yml changes, only if the project is reconnected to the GitHub App.
      // To obtain/refresh it:
      //   PROJECT_ID=$(curl -s -H "Circle-Token: $CIRCLE_CI_TOKEN" \
      //     https://circleci.com/api/v2/project/gh/mui/mui-x | jq -r .id)
      //   curl -s -H "Circle-Token: $CIRCLE_CI_TOKEN" \
      //     "https://circleci.com/api/v2/projects/$PROJECT_ID/pipeline-definitions" \
      //     | jq -r '.items[] | select(.config_source.provider=="github_app") | .id'
      definition_id: '96663f15-ee8b-4362-a8f1-035e9ee1ae50',
      // For PR, /head is needed. https://support.circleci.com/hc/en-us/articles/360049841151
      config: { branch: `pull/${repo[2]}/head` },
      checkout: { branch: `pull/${repo[2]}/head` },
      parameters: {
        // the parameters defined in .circleci/config.yml
        workflow: 'e2e-website', // name of the workflow
        'e2e-base-url': payload.deploy_ssl_url, // deploy preview url
      },
    }),
  });
  return {
    statusCode: 200,
    body: {},
  };
};
