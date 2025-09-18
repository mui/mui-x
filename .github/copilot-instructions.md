## Testing

There are two main types of test in this repository: unit tests and browser tests. Both use the same files.

To run tests:

- `browser tests`: `pnpm run test:browser`
- `unit tests`: `pnpm run test:unit`

The following options work in both environments:

- Always use the `--run` flag to skip watch mode.
- Always use `--project <project-name>` to run tests only for a specific project. The project names are defined by the folder names in the `packages` directory. Additionally you can use `<partial-project-name>*` to run tests for multiple projects that match the partial name.
  - For example: `pnpm run test:unit --run --project 'x-charts*'`
- To test a single file, you can append the file name to the command.
  - For example: `pnpm run test:unit --run --project 'x-charts' ChartsSurface.test.tsx`
- To test a single test, you can use use the `-t` flag followed by a regex that matches the test name. Always add the file name as well to avoid running all tests in the repo.
  - For example: `pnpm run test:unit --run --project 'x-charts' -t 'renders the surface' ChartsSurface.test.tsx`

### Ensuring a test only runs in a specific environment

- Use `it.skipIf(isJSDOM)` to skip when running unit tests
- Use `it.skipIf(!isJSDOM)` to run only in browser mode.

## Formatting

We use multiple formatters and scripts to ensure the code is consistent. Some of these scripts take multiple seconds to run.

To format the code, run:

- `pnpm prettier:all` should always be run
- `pnpm eslint` should always be run
- `pnpm proptypes` should be run when editing React components
- `pnpm docs:api` should be run when editing React components or TypeScript types/interfaces
- `pnpm docs:typescript:formatted` should be run when creating or editing the docs examples using typescript
- `pnpm generate:exports` should always be run when committing code that touches the x-charts family of packages
