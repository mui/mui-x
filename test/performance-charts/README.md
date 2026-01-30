# Performance Charts

## How to run

First build the project.

```bash
pnpm release:build
```

To run the tests locally, you have two options

1. Initialize a git repo inside the `test/performance-charts` folder.

2. Or uncomment all the `browser` options from [vitest.config.ts](./vitest.config.ts) file.

```ts
    browser: {
      enabled: true,
      headless: true,
      name: 'chromium',
      provider: 'playwright',
      providerOptions: {
        timeout: 60000,
      },
    },
```

Then `cd` into the project folder and run the tests.

```bash
pnpm test:performance
```

or from the root of the project

```bash
pnpm --filter "@mui-x-internal/performance-charts" test:performance
```

```
  grep -rlI --exclude-dir=node_modules --exclude-dir=build 'material-ui/' . | xargs sed -i '' \
    -e 's|mui/material-ui-name-matches-component-name|mui/material-ui-name-matches-component-name|g' \
    -e 's|mui/material-ui-rules-of-use-theme-variants|mui/material-ui-rules-of-use-theme-variants|g' \
    -e 's|mui/material-ui-no-empty-box|mui/material-ui-no-empty-box|g' \
    -e 's|mui/material-ui-no-styled-box|mui/material-ui-no-styled-box|g' \
    -e 's|mui/consistent-production-guard|mui/consistent-production-guard|g' \
    -e 's|mui/disallow-active-element-as-key-event-target|mui/disallow-active-element-as-key-event-target|g' \
    -e 's|mui/docgen-ignore-before-comment|mui/docgen-ignore-before-comment|g' \
    -e 's|mui/straight-quotes|mui/straight-quotes|g' \
    -e 's|mui/disallow-react-api-in-server-components|mui/disallow-react-api-in-server-components|g' \
    -e 's|mui/no-restricted-resolved-imports|mui/no-restricted-resolved-imports|g' \
    -e 's|mui/add-undef-to-optional|mui/add-undef-to-optional|g' \
    -e 's|mui/require-dev-wrapper|mui/require-dev-wrapper|g'
```
