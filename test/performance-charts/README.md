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
