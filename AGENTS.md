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
pnpm stylelint
pnpm markdownlint
pnpm proptypes
```

## Testing

### Unit tests in JSDOM

```bash
# Filter by project name (glob patterns supported)
pnpm test:unit --project "x-data-grid" # exact match
pnpm test:unit --project "x-charts*" # starts with
pnpm test:unit --project "*-pro" # ends with
```

### Unit tests in the browser

```bash
# Filter by project name (glob patterns supported)
pnpm test:browser --project "x-data-grid" # exact match
pnpm test:browser --project "x-charts*" # starts with
pnpm test:browser --project "*-pro" # ends with
```

## TypeScript

```bash
# Using pnpm filter
pnpm --filter "@mui/x-data-grid" run typescript # single package
pnpm --filter "@mui/x-data-grid*" run typescript # glob pattern (all data-grid packages)
pnpm --filter "@mui/x-charts*" run typescript # all charts packages
pnpm typescript # typecheck the entire monorepo
```

## Other scripts

Refer to `package.json` for other available scripts.

## Docs

### Updating docs demos

When updating demos in the `docs` folder, only update the `.tsx` files.
To generate JS files, run `pnpm docs:typescript:formatted`.
