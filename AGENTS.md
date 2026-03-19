# Project guidelines

Check `AGENTS.local.md` for personal preferences.

## Linting and formatting

### Linting

```bash
pnpm eslint
pnpm eslint:fix # Auto-fix issues
```

### Formatting

```bash
pnpm prettier # Format changed files (compared to master)
pnpm prettier:all # Format all files
```

### Other Linters

```bash
pnpm stylelint # when editing CSS/style files
pnpm markdownlint # when editing markdown files
pnpm generate:exports # when editing code in `packages/x-charts*`
```

## Testing

### Run unit tests in JSDOM

```bash
# Filter by project name (glob patterns supported)
# --run flag = run tests once and exit
pnpm test:unit --project "x-data-grid" --run # exact match
pnpm test:unit --project "x-charts*" --run # starts with
pnpm test:unit --project "*-pro" --run # ends with
```

### Run unit tests in the browser

```bash
# Filter by project name (glob patterns supported)
# --run flag = run tests once and exit
pnpm test:browser --project "x-data-grid" --run # exact match
pnpm test:browser --project "x-charts*" --run # starts with
pnpm test:browser --project "*-pro" --run # ends with
```

### Writing new unit tests

#### Ensuring a test only runs in a specific environment

- Use `it.skipIf(isJSDOM)` to skip when running unit tests
- Use `it.skipIf(!isJSDOM)` to run only in browser mode.

## TypeScript

```bash
# Using pnpm filter
pnpm --filter "@mui/x-data-grid" run typescript # single package
pnpm --filter "@mui/x-data-grid*" run typescript # glob pattern (all data-grid packages)
pnpm --filter "@mui/x-charts*" run typescript # all charts packages
pnpm typescript # typecheck the entire monorepo
```

## Components documentation

When editing React components or TypeScript types/interfaces in the `packages` folder, run the following script after you're done with the changes:

```bash
pnpm proptypes # generate PropTypes
pnpm docs:api # generate/update the API documentation
```

## Error Messages

These guidelines only apply for errors thrown from public packages.

Every error message must:

1. **Say what happened** - Describe the problem clearly
2. **Say why it's a problem** - Explain the consequence
3. **Point toward how to solve it** - Give actionable guidance

Format:

<!-- markdownlint-disable MD038 -->

- Prefix with `MUI X:` (for internal or generic packages) and `MUI X PackageName:` (for example, `MUI X Charts:` or `MUI X Data Grid:`) for specific packages
- Use string concatenation for readability
- Include a documentation link when applicable (`https://mui.com/x/...`)

Example:

```tsx
throw new Error(
  `MUI X Charts: The series configuration is missing a required serializer.
This prevents the chart from identifying series items correctly.
Ensure each series type registers its serializer in the seriesConfig.`,
);
```

### Error Minifier

Use the `/* minify-error-disabled */` comment to de-activate the babel plugin for small error messages:

```tsx
throw /* minify-error-disabled */ new Error(`MUI X: Unreachable`);
```

The minifier works with both `Error` and `TypeError` constructors.

### After Adding/Updating Errors

Run `pnpm extract-error-codes` to update `docs/public/static/error-codes.json`.

**Important:** If the update created a new error code, but the new and original message have the same number of arguments and semantics haven't changed, update the original error in `error-codes.json` instead of creating a new code.

## Other scripts

Refer to `package.json` for other available scripts.

## Docs

### Updating docs demos

When updating demos in the `docs` folder, only update the `.tsx` files.
To generate `.js` files, run `pnpm docs:typescript:formatted`.

## Codemods

Codemods are run by consumers of the MUI X libraries to migrate to newer versions of the libraries.

### Versioning

When creating codemods, the code should be created in the directory of the target version. E.g., a codemod to migrate from v8 to v9 should be placed inside the `v9.0.0` directory.

### Writing codemods

When writing codemods, first check in the `src/util` folder of the `x-codemod` package if there are any utilities that can help you.
