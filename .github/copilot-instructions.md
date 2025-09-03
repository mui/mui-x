# MUI X Development Instructions

MUI X is a suite of advanced React UI components for data-rich applications, including Data Grid, Date/Time Pickers, Charts, and Tree View components. The repository is a monorepo using pnpm workspaces with independent package versioning via Lerna.

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

## Working Effectively

### Initial Setup
- Install pnpm package manager (required version 10.15.1):
  - `curl -fsSL https://get.pnpm.io/install.sh | sh -`
  - `source ~/.bashrc`
- Install dependencies: `pnpm install` -- takes 2 minutes. NEVER CANCEL. Set timeout to 5+ minutes.
- Build all packages: `pnpm release:build` -- takes 3 minutes. NEVER CANCEL. Set timeout to 10+ minutes.

### Development Workflow
- Start documentation site: `pnpm docs:dev` -- runs on http://localhost:3001
- Install and run locally: `pnpm start` (alias for `pnpm i && pnpm docs:dev`)

### Build System
- Build all packages: `pnpm release:build` -- takes 3 minutes. NEVER CANCEL. Set timeout to 10+ minutes.
- Clean all builds: `pnpm clean`
- Build specific package: `pnpm --filter @mui/x-[package-name] build`

### Testing
- **Unit tests (JSDOM)**: `pnpm test:unit:jsdom` -- takes 90 seconds per package. NEVER CANCEL. Set timeout to 20+ minutes for full test suite.
  - Filter by package: `pnpm test:unit:jsdom --project "x-data-grid"`
  - Filter by path: `pnpm test:unit:jsdom BarChart`
  - Filter by test name: `pnpm test:unit:jsdom -t "hide tooltip"`
- **Browser tests**: `pnpm test:unit:browser` -- requires Playwright browsers installed first:
  - Install browsers: `pnpm exec playwright install` -- takes 10+ minutes. NEVER CANCEL. Set timeout to 20+ minutes.
  - Run tests: `pnpm test:unit:browser --project "x-data-grid"`
- **Regression tests**: `pnpm test:regressions:dev` -- requires packages to be built first
- **E2E tests**: `pnpm test:e2e` -- requires packages to be built first
- **TypeScript checking**: `pnpm typescript` or `pnpm --filter @mui/x-[package] typescript` -- takes 15 seconds per package

### Code Quality
- **Linting**: `pnpm eslint` -- takes 3 minutes. NEVER CANCEL. Set timeout to 10+ minutes.
  - Fix automatically: `pnpm eslint:fix`
- **Formatting**: `npx prettier --check [file-path]` (prettier script has issues, use npx directly)
  - Format files: `npx prettier --write [file-path]`
- **Validation suite**: `pnpm validate` -- runs prettier, eslint, proptypes, docs:typescript:formatted, and docs:api together

## Key Projects and Packages

### Core Packages (Community - MIT License)
- `@mui/x-data-grid` - Data Grid component (packages/x-data-grid)
- `@mui/x-date-pickers` - Date and Time Pickers (packages/x-date-pickers)  
- `@mui/x-charts` - Charts components (packages/x-charts)
- `@mui/x-tree-view` - Tree View component (packages/x-tree-view)

### Pro/Premium Packages (Commercial License)
- `@mui/x-data-grid-pro` - Advanced Data Grid features
- `@mui/x-data-grid-premium` - Premium Data Grid features  
- `@mui/x-date-pickers-pro` - Advanced Date Picker features
- `@mui/x-charts-pro` - Advanced Charts features
- `@mui/x-tree-view-pro` - Advanced Tree View features
- `@mui/x-charts-premium` - Premium Charts features

### Supporting Packages
- `@mui/x-internals` - Internal utilities and hooks
- `@mui/x-license` - License verification system
- `@mui/x-charts-vendor` - Bundled D3 dependencies for charts
- `@mui/x-data-grid-generator` - Data generation utilities for testing
- `@mui/x-codemod` - Codemod utilities for migrations

## Validation Scenarios

Always manually validate changes by testing these key scenarios:

### Data Grid Validation
After making changes to data grid components:
- Build the package: `pnpm --filter @mui/x-data-grid build`
- Run unit tests: `pnpm test:unit:jsdom --project "x-data-grid" --run`
- Start docs and navigate to Data Grid examples: `pnpm docs:dev` → http://localhost:3001/x/react-data-grid/
- Test basic functionality: sorting, filtering, pagination

### Charts Validation  
After making changes to charts components:
- Build the package: `pnpm --filter @mui/x-charts build`
- Build vendor dependencies: `pnpm --filter @mui/x-charts-vendor build`
- Run unit tests: `pnpm test:unit:jsdom --project "x-charts" --run`
- Start docs and navigate to Charts examples: `pnpm docs:dev` → http://localhost:3001/x/react-charts/
- Test chart rendering and interactions

### Pickers Validation
After making changes to date/time picker components:
- Build the package: `pnpm --filter @mui/x-date-pickers build`
- Run unit tests: `pnpm test:unit:jsdom --project "x-date-pickers" --run`
- Start docs and navigate to Pickers examples: `pnpm docs:dev` → http://localhost:3001/x/react-date-pickers/
- Test date selection and different picker variants

### Documentation Validation
- Build docs API: `pnpm docs:api` -- takes 5+ minutes. NEVER CANCEL. Set timeout to 15+ minutes.
- Generate TypeScript definitions: `pnpm docs:typescript:formatted`
- Build production docs: `pnpm docs:build` -- takes 10+ minutes. NEVER CANCEL. Set timeout to 20+ minutes.

## Important Notes

### Timeouts and Build Times
- **NEVER CANCEL** any build or test command - builds may take 10+ minutes, tests may take 20+ minutes
- Always set explicit timeouts: build commands 10+ minutes, test commands 20+ minutes, browser installation 20+ minutes
- If a command appears to hang, wait at least 10 minutes before considering alternatives

### Common Issues and Workarounds
- Browser tests require Playwright installation: `pnpm exec playwright install`
- Some eslint errors on empty export files are expected until packages are built
- The `prettier` script has path issues - use `npx prettier` directly instead
- Regression tests require packages to be built first: `pnpm release:build`
- Charts package requires vendor dependencies: ensure x-charts-vendor is built

### File Structure
- All packages are in `packages/` directory
- Tests are colocated with source code in `src/` directories  
- Documentation is in `docs/` directory (separate from packages)
- Build artifacts go to `build/` directories in each package
- Test infrastructure is in `test/` directory

### CI/CD Integration
- Main CI workflow is `.github/workflows/ci.yml`
- Uses external workflow from `mui/mui-public` repository
- Builds and tests run on Node.js 22
- Release process uses Lerna for independent versioning

Always build and exercise your changes by running the appropriate validation scenario above. The most critical validation is ensuring the documentation site runs correctly and displays your changes properly.