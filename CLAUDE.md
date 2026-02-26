# MUI X

Advanced React component monorepo: Data Grid, Charts, Date Pickers, Tree View, Scheduler.

Commands for linting, testing, typechecking, and docs: @AGENTS.md

## Open-core model

Community (MIT) → Pro → Premium tiers. Each product follows: `x-<product>` → `x-<product>-pro` → `x-<product>-premium`. Pro/Premium packages re-export and extend community. All pro/premium packages depend on `x-license`.

When adding features, place code in the correct tier package. Community features go in base package; gated features go in pro/premium.

## Key gotchas

- **Docs demos**: only edit `.tsx` files. Run `pnpm docs:typescript:formatted` to regenerate `.js` files. NEVER edit `.js` demo files directly.
- **After editing component props/types in `packages/`**: run `pnpm proptypes && pnpm docs:api`
- **After editing code in `packages/x-charts*`**: run `pnpm generate:exports`
- **Tests use Chai assertions** (not Jest-style): `expect(x).to.equal(y)`, NOT `expect(x).toBe(y)`. Mocking uses Sinon (`spy()`, `stub()`).
- **Test rendering**: use `createRenderer()` from `@mui/internal-test-utils`, NOT `@testing-library/react` directly.
- **Test helpers**: `getCell()`, `getRow()`, `getColumnHeaderCell()` etc. are in `test/utils/helperFn.ts`
- **Environment skip**: `it.skipIf(isJSDOM)` / `it.skipIf(!isJSDOM)` from `test/utils/skipIf`
- **Date pickers tests**: use `createPickerRenderer()` instead of `createRenderer()`
- **Markdown demo syntax**: `{{"demo": "DemoName.js"}}` — admonitions: `:::info`, `:::warning`, `:::success`
- **Codemods**: place in target version directory (e.g., `v9.0.0/`), check `x-codemod/src/util` for helpers

## Shared infrastructure

`x-internals` — shared utilities used by all products. `x-virtualizer` — virtualization. `x-charts-vendor` — vendored D3 deps.
