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

## Other scripts

Refer to `package.json` for other available scripts.

## Docs

### Updating docs demos

When updating demos in the `docs` folder, only update the `.tsx` files.
To generate JS files, run `pnpm docs:typescript:formatted`.
