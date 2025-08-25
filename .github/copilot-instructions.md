# MUI X - GitHub Copilot Developer Instructions

MUI X is a suite of advanced React UI components including Data Grid, Date and Time Pickers, Charts, and Tree View. This is a monorepo with 19 packages covering Community (MIT), Pro, and Premium (commercial) versions of components.

**Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap, Build, and Test the Repository

**CRITICAL - Install pnpm first:** This project requires pnpm 10.14.0 exactly.
- `npm install -g pnpm@10.14.0`

**Install dependencies:** Takes ~2 minutes. NEVER CANCEL.
- `pnpm install` -- takes 102 seconds. Set timeout to 180+ seconds.

**Build all packages:** Takes ~2.5 minutes. NEVER CANCEL.
- `pnpm release:build` -- takes 147 seconds for 19 packages. Set timeout to 300+ seconds.

**Run unit tests:** Takes ~10 minutes. NEVER CANCEL.
- `pnpm test` or `pnpm test:unit:jsdom` -- takes 619 seconds (7101 tests). Set timeout to 900+ seconds.
- Alternative: `pnpm test:unit:browser` -- requires playwright browsers (see Browser Tests section)

**Run docs development server:**
- **IMPORTANT**: The docs server currently has configuration issues with babel/ESM compatibility
- `pnpm docs:dev` -- may fail due to babel configuration errors
- Alternative: Use built documentation or focus on component testing via unit tests
- If working: starts on port 3001 (not 3000!), takes ~3.5 seconds to be ready

### Browser Tests and E2E Tests

**Browser tests require Playwright browsers:**
- `pnpm exec playwright install` -- downloads browsers, may take several minutes
- Then run: `pnpm test:unit:browser`
- **WARNING**: Browser installation may fail in CI/restricted environments due to download issues

**E2E tests:**
- `pnpm test:e2e` -- requires build first, runs against built packages
- `pnpm test:e2e-website` -- tests documentation website
- `pnpm test:regressions` -- visual regression tests with Argos

### Validation and Code Quality

**Run linting and formatting:** 
- `pnpm prettier` -- formats changed files only (< 2 seconds)
- `pnpm prettier:all` -- formats all files
- `pnpm eslint` -- may show import/export errors that don't block functionality
- `pnpm markdownlint` -- lints markdown files (~5 seconds)

**ALWAYS run these before committing:**
- `pnpm prettier` 
- `pnpm markdownlint`
- Consider running `pnpm proptypes` to generate prop types for components

**Full validation command:**
- `pnpm validate` -- runs prettier, eslint, proptypes, docs typescript, and docs API generation

## Validation

**ALWAYS manually validate any new code by building and testing.**
- Run `pnpm release:build` to ensure your changes build correctly (takes ~2.5 minutes)
- Run `pnpm test` to ensure tests pass (takes ~10 minutes, or run specific test files)
- Run `pnpm typescript` to validate TypeScript compilation across all packages (~3 minutes)
- **CRITICAL**: When making component changes, test functionality via unit tests since docs server has issues
- For component validation: run specific test files, e.g., `pnpm test packages/x-data-grid/src/tests/columns.DataGrid.test.tsx`

**Component testing workflow:**
1. Make your changes
2. Run `pnpm release:build` to build packages
3. Run specific tests for the component you modified
4. Run `pnpm typescript` to ensure no type errors
5. Consider running the full test suite with `pnpm test`

**For data grid components:** Test filtering, sorting, selection, editing workflows via unit tests
**For date pickers:** Test date selection, keyboard input, locale changes via unit tests  
**For charts:** Test data visualization, interactions, responsive behavior via unit tests
**For tree view:** Test expansion, selection, keyboard navigation via unit tests

## Working Around Documentation Issues

**Current Issue**: The docs development server (`pnpm docs:dev`) and build (`pnpm docs:build`) fail due to babel configuration compatibility issues between ESM and CommonJS modules.

**Alternative validation approaches:**
1. **Unit test validation**: Run specific test files to validate component behavior
   ```bash
   pnpm test packages/x-data-grid/src/tests/columns.DataGrid.test.tsx
   ```
2. **TypeScript validation**: Ensure no type errors across packages
   ```bash
   pnpm typescript  # ~3 minutes, validates all packages
   ```
3. **Build validation**: Ensure packages build correctly
   ```bash
   pnpm release:build  # ~2.5 minutes for all packages
   pnpm --filter @mui/x-data-grid build  # ~21 seconds for specific package
   ```
4. **Demo transpilation**: Validate demo examples work
   ```bash
   pnpm docs:typescript:formatted  # ~3 seconds
   ```

**For component development without docs server:**
- Modify component code
- Run `pnpm --filter @mui/x-[package-name] build` 
- Run relevant unit tests to validate functionality
- Run `pnpm typescript` to catch type issues

## Common Tasks

### Package Structure
The monorepo contains 19 packages in `/packages/`:
- `x-data-grid` - Community data grid (MIT)
- `x-data-grid-pro` - Pro data grid features
- `x-data-grid-premium` - Premium data grid features
- `x-date-pickers` - Community date/time pickers (MIT)
- `x-date-pickers-pro` - Pro date/time picker features
- `x-charts` - Community charts (MIT)
- `x-charts-pro` - Pro chart features
- `x-charts-premium` - Premium chart features
- `x-tree-view` - Community tree view (MIT)
- `x-tree-view-pro` - Pro tree view features
- Additional internal packages for utilities, licensing, etc.

### Key Files and Directories
- `/docs/` - Documentation website (Next.js on port 3001)
- `/test/` - Test utilities and configurations
- `/scripts/` - Build and release scripts
- `/packages/*/src/` - Source code for each package
- `/packages/*/build/` - Built output (created by build process)

### Development Commands Reference
```bash
# Environment setup
npm install -g pnpm@10.14.0
pnpm install                    # ~2 minutes, NEVER CANCEL

# Building
pnpm release:build              # ~2.5 minutes, NEVER CANCEL, builds all packages
pnpm --filter @mui/x-data-grid build  # Build specific package

# Testing  
pnpm test                       # ~10 minutes, NEVER CANCEL, all unit tests
pnpm test:unit:browser          # Browser tests (requires playwright install)
pnpm test:e2e                   # E2E tests (requires build first)
pnpm test:regressions           # Visual regression tests

# Development servers
pnpm docs:dev                   # Docs server on port 3001 (currently has issues)
pnpm start                      # Alias for docs:dev

# Code quality
pnpm prettier                   # Format changed files
pnpm eslint                     # Lint (may show import errors)
pnpm markdownlint               # Lint markdown
pnpm typescript                # TypeScript compilation (~3 minutes)
pnpm validate                   # Full validation suite (currently fails due to docs issues)

# Specific workflows
pnpm proptypes                  # Generate component prop types
pnpm docs:api:buildX            # Generate API documentation (~15 seconds)
pnpm docs:typescript:formatted  # Transpile demos (~3 seconds)
```

### Timing Expectations
- **Dependency install**: 102 seconds - Set timeout 180+ seconds
- **Full build**: 147 seconds - Set timeout 300+ seconds  
- **Individual package build**: 21 seconds for x-data-grid - Set timeout 60+ seconds
- **Unit tests**: 619 seconds - Set timeout 900+ seconds
- **Individual test file**: 7 seconds - Set timeout 30+ seconds
- **TypeScript compilation**: 180 seconds - Set timeout 300+ seconds
- **Prettier**: < 2 seconds
- **Markdown lint**: 5 seconds
- **API docs generation**: 15 seconds
- **Demo transpilation**: 3 seconds

### Known Issues and Workarounds
- **Docs server**: Currently fails due to babel configuration issues with ESM/CommonJS compatibility
- **Browser tests**: May fail if playwright browsers not installed (`pnpm exec playwright install`)
- **Network restrictions**: Playwright browser downloads may fail in CI/restricted environments  
- **ESLint**: Shows import/export errors in some packages that don't block functionality
- **Build dependencies**: E2E and regression tests require building packages first and playwright browsers
- **Babel config**: docs:build and docs:dev currently fail due to ESM module compatibility issues

### Repository Context
- **Main branch**: `master` 
- **Documentation**: Deployed from `docs-v8` branch to https://material-ui-x.netlify.app/
- **License**: Community packages are MIT, Pro/Premium require commercial license
- **Monorepo**: Uses Lerna + pnpm workspaces
- **CI**: Runs on shared workflow from mui/mui-public repository

### When Making Changes
1. **ALWAYS build and test your changes** - never commit untested code
2. **Use specific timeouts** - builds and tests take significant time, don't let them timeout prematurely  
3. **Test component functionality via unit tests** - docs server currently has configuration issues
4. **Run typescript compilation** to catch type errors across packages
5. **Run prettier and markdown lint** before committing
6. **Focus on unit test validation** rather than manual browser testing due to docs server issues
7. **Consider the license** - Pro/Premium features require CLA signature for contributions