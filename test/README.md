# Testing

We use [Vitest](https://vitest.dev/) for unit tests in both the browser and jsdom environments.

## How to run

Some simple examples on how to run the tests.

### Filter by project

```bash
### starting with `x-charts`
pnpm test:unit --project "x-charts*"

### exactly `x-data-grid`
pnpm test:unit --project "x-data-grid"

### ending with `-pro`
pnpm test:unit --project "*-pro"
```

### Filter by path

```bash
### any file that has BarChart in its path
pnpm test:browser BarChart

# FILTER BY TEST NAME (generally slow)

### any test that hast "hide tooltip" in its name
pnpm test:browser -t "hide tooltip"
```

### Combine the above

```bash
### only run files that contain the pattern inside a specific project
pnpm test:browser --project "x-charts" BarChart

### only run tests which names contain the pattern inside a specific project
pnpm test:browser --project "x-charts" -t "hide tooltip"
```

### Using test.only

Vitest's `test.only` behavior is different from Mocha's. That's because Vitest parallelizes tests and can't know whether `test.only` is used in another file. This behavior is the same as [Jest's](https://github.com/jestjs/jest/issues/4414).

The way to make the test run only a test specified with a `.only` modifier is to use the file filter and run only the file that contains the test.

```tsx
// src/x-charts/test/BarChart.test.tsx
it.only('should show the tooltip', () => {
  // ...
});
```

```bash
pnpm test:browser BarChart
```

This will run only the test that has `it.only` in it and will ignore all other tests in the file.

## Testing multiple versions of React

You can check integration of different versions of React (for example different [release channels](https://react.dev/community/versioning-policy) or PRs to React) by running the following command:

`pnpm use-react-version <version>`

Possible values for `version`:

- default: `stable` (minimum supported React version)
- a tag on npm, for example `next`, `experimental` or `latest`
- an older version, for example `^17.0.0`

## Testing multiple versions of Material UI

Currently, we use `@mui/material` v5 in the MUI X repo and all tests are run against it.
But MUI X packages are compatible with v5 and v6.
You can run the tests against `@mui/material` v6 by running the following command:

`pnpm use-material-ui-v6`

## CI

To execute additional jobs for custom versions of React/Material UI, you can use an `additional` workflow. In combination with `with-react-version` and/or `with-material-ui-6` parameters, it executes those jobs with dependency versions different from the main `pipeline` workflow.

| Parameter type | Name                 | Value                |
| :------------- | :------------------- | :------------------- |
| `string`       | `workflow`           | `additional`         |
| `string`       | `with-react-version` | `<VERSION_OF_REACT>` |
| `boolean`      | `with-material-ui-6` | `true` or `false`    |

1. Go to https://app.circleci.com/pipelines/github/mui/mui-x?branch=pull/PR_NUMBER and replace `PR_NUMBER` with the PR number you want to test.
2. Click `Trigger Pipeline` button.
3. Go to the `Parameters` section and update the `workflow` parameter in combination with the version parameter(s).
   You can leave the rest of the parameters with their default values.
4. Click `Trigger Pipeline` button.

![CircleCI workflow](./circleci-workflow.png)

### API

You can pass the same to our CircleCI pipeline through API as well:

With the following API request we're triggering a run of the `additional` workflow in
PR #24289 for `react@rc` and `@mui/material-ui@6`

```bash
curl --request POST \
  --url https://circleci.com/api/v2/project/gh/mui/mui-x/pipeline \
  --header 'content-type: application/json' \
  --header 'Circle-Token: $CIRCLE_TOKEN' \
  --data-raw '{"branch":"pull/24289/head","parameters":{"workflow":"additional","with-react-version":"rc","with-material-ui-6":true}}'
```
