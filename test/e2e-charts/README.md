# Testing Charts E2E

This directory contains the end-to-end tests for the x-charts project.

## Running the tests

Basic tests can be run with the following command:

```bash
pnpm test:e2e:charts
```

We use the playwright test runner to run the tests. You can find more information about playwright [here](https://playwright.dev/).

An useful command to run the tests with the browser UI is:

```bash
pnpm test:e2e:charts --ui
```

## Writing tests

The tests are written in TypeScript and can be written in any of the x-charts(-\*) packages. Simply create a new file with the `.e2e.spec.tsx?` extension and write your tests.

We use playwright in [component testing mode](https://playwright.dev/docs/test-components), which is **experimental**. But allows us to test the components in isolation. It has some caveats, so be sure to read the documentation.

## Reasoning vs RTL

Some of our features use SVG apis that are not available in the JSDOM environment. This is why we use playwright to run the tests in a real browser.

An alternative would be to use [svgdom](https://www.npmjs.com/package/svgdom) or polyfill everything ourselves.
