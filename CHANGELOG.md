# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0-alpha.10](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.9...v4.0.0-alpha.10) (Nov 20, 2020)

### @material-ui/x-grid@v4.0.0-alpha.10 / @material-ui/data-grid@v4.0.0-alpha.10

- [DataGrid] Add fluid columns width support (#566) @DanailH
- [DataGrid] Default toolbar setup (#574) @DanailH
- [DataGrid] Fix autoHeight computation for custom headers and footers (#597) @DanailH
- [DataGrid] Fix type definitions (#596) @tooppaaa
- [DataGrid] Reset sortedRows state on prop change (#599) @dtassone

### Docs

- [docs] Update feature comparison table for Column reorder @DanailH

### Core

- [core] Prepare work for a future public state api (#533) @dtassone
- [core] Fix yarn prettier write @oliviertassinari
- [test] Share karma setup (#576) @oliviertassinari

## [4.0.0-alpha.9](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.8...v4.0.0-alpha.9) (Nov 9, 2020)

### @material-ui/x-grid@v4.0.0-alpha.9 / @material-ui/data-grid@v4.0.0-alpha.9

- [DataGrid] Fix keyboard with multiple grids (#562) @dtassone
- [DataGrid] Add touch support on column resize (#537) @danailH
- [DataGrid] Refactor containerSizes in smaller state (#544) @dtassone
- [DataGrid] Fix display of row count and selected rows on mobile (#508) @oliviertassinari
- [DataGrid] Apply review from #412 (#515) @oliviertassinari
- [DataGrid] Avoid paint step (#531) @oliviertassinari
- [DataGrid] Refactor rendering, remove rafUpdate (#532) @Dtassone
- [DataGrid] Add missing reselect dependency (#534) @dtassone
- [DataGrid] Raf Timer stored in apiRef (#506) @dtassone
- [DataGrid] Fix webpack v5 support (#449) @oliviertassinari
- [DataGrid] Rework columnReorder to work with the new state management (#505) @danailH
- [DataGrid] Fix performance issues (#501) @dtassone
- [DataGrid] Refactor columns scrolling (#500) @dtassone
- [DataGrid] Replace require with import (#455) @oliviertassinari
- [DataGrid] Restore regression test (#503) @oliviertassinari
- [DataGrid] Refactor state (#412) @dtassone

### Docs

- [docs] Fix links to GitHub (#538) @oliviertassinari
- [docs] Add more information to readme (#539) @An-prog-hub
- [docs] Fix the Netlify proxy for localization of X (#536) @oliviertassinari
- [docs] Add deploy script command @oliviertassinari

### Core

- [core] Batch small changes (#546) @oliviertassinari
- [core] Improve types (#448) @olivertassinari
- [core] Run prettier (#482) @oliviertassinari
- [core] Disable generation of changelogs @oliviertassinari
- [test] Karma should fail if errors are thrown (#543) @oliviertassinari

## [4.0.0-alpha.8](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.7...v4.0.0-alpha.8) (Oct 23, 2020)

### @material-ui/x-grid@v4.0.0-alpha.8 / @material-ui/data-grid@v4.0.0-alpha.8

- [DataGrid] Fix header row tabIndex (#478) @DanailH
- [DataGrid] Reduce dependency on lodash, save 1kB gzipped (#450) @oliviertassinari
  The DataGrid goes from [28.2 kB](https://bundlephobia.com/result?p=@material-ui/data-grid@4.0.0-alpha.7) gzipped down to [27.3 kB](https://bundlephobia.com/result?p=@material-ui/data-grid@4.0.0-alpha.8) gzipped.
- [XGrid] Second iteration on resizing logic (#436) @oliviertassinari
  Fix 8 bugs with the resizing.

### Core

- [core] Remove usage of LESS (#467) @dependabot-preview
- [core] Update to the latest version of the main repo (#456) @oliviertassinari

## [4.0.0-alpha.7](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.6...v4.0.0-alpha.7) (Oct 19, 2020)

### @material-ui/x-grid@v4.0.0-alpha.7 / @material-ui/data-grid@v4.0.0-alpha.7

- [DataGrid] Add column reorder support (#165) @DanailH
- [DataGrid] Fix iOS issue when scrolling left (#439) @DanailH
- [DataGrid] Improve sizing logic (#350) @oliviertassinari
- [DataGrid] Improve warning and docs for layouting (#405) @RobertAron

### Docs

- [docs] Remove id columns (#355) @oliviertassinari
- [docs] Swap words to better match users' query (#354) @oliviertassinari

### Core

- [storybook] Fix warning and improve perf (#407) @dtassone
- [core] Batch small changes (#403) @oliviertassinari
- [core] Fix yarn warning (#421) @oliviertassinari
- [core] Hoist duplicated dependencies (#341) @oliviertassinari
- [core] Remove dead code (#454) @oliviertassinari
- [core] Remove dead-code (#353) @oliviertassinari
- [core] Sync supported browser with v5 (#453) @oliviertassinari
- [test] Add end-to-end test missing id (#356) @oliviertassinari
- [test] Add missing types linting for x-grid (#357) @oliviertassinari
- [test] Run the karma tests in browserstack (#316) @oliviertassinari

## [4.0.0-alpha.6](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.2...v4.0.0-alpha.6) (Sep 25, 2020)

### @material-ui/x-grid@v4.0.0-alpha.6 / @material-ui/data-grid@v4.0.0-alpha.6

- [DataGrid] Throw if rows id is missing (#349) @dtassone
- [DataGrid] Fix valueGetter sorting (#348) @dtassone
- [DataGrid] Fix typings and packages assets (#339) @dtassone
- [DataGrid] Add npm keywords (#304) @oliviertassinari

### Docs

- [docs] Avoid double borders (#340) @oliviertassinari
- [docs] Fix layout jump issue (#338) @oliviertassinari
- [docs] Fix short description warning (#302) @oliviertassinari

## [4.0.0-alpha.2](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.1...v4.0.0-alpha.2) (Sep 18, 2020)

- [DataGrid] Fix wrongly exported types (#298) @dtassone

## [4.0.0-alpha.1](https://github.com/mui-org/material-ui-x/compare/v0.1.67...v4.0.0-alpha.1) (Sep 17, 2020)

This is the first public alpha release of the component after 6 months of development since the initial commit (March 15th 2020).
`@material-ui/data-grid` is licensed under MIT while `@material-ui/x-grid` is licensed under a commercial license.
You can find the documentation at this address: https://material-ui.com/components/data-grid/.

### @material-ui/x-grid@v4.0.0-alpha.1 / @material-ui/data-grid@v4.0.0-alpha.1

- [DataGrid] Add api pages for data-grid and x-grid (#289) @dtassone
- [DataGrid] Add dark mode scrollbar (#282) @dtassone
- [DataGrid] Better explain the limits of MIT vs commercial (#225) @oliviertassinari
- [DataGrid] First v4 alpha version (#291) @dtassone
- [DataGrid] Fix CSS footer spacing (#268) @oliviertassinari
- [DataGrid] Fix checkbox selection issue (#285) @dtassone
- [DataGrid] Fix disableMultipleSelection (#286) @dtassone
- [DataGrid] Fix issue #254, focus cell fully visible (#256) @dtassone
- [DataGrid] Fix issues with path and import (#259) @dtassone
- [DataGrid] Fix setPage not working (#284) @dtassone
- [DataGrid] Move column resizing to XGrid only (#257) @dtassone
- [DataGrid] Remove apiRef in DataGrid, a XGrid only feature (#290) @dtassone
- [DataGrid] Replace style-components with @material-ui/styles (#168) @dtassone

### Docs

- [docs] Add issue templates (#222) @oliviertassinari
- [docs] Add more context on the ⚡️ icons (#265) @oliviertassinari
- [docs] Add pricing links (#266) @oliviertassinari
- [docs] Add Rendering section (#267) @oliviertassinari
- [docs] Add Resources section (#264) @oliviertassinari
- [docs] Apply review from Matt @oliviertassinari
- [docs] Continue the migration of the demos (#232) @oliviertassinari
- [docs] Disable ads on Enterprise features (#263) @oliviertassinari
- [docs] Improve documentation (#287) @oliviertassinari
- [docs] Matt review (#234) @oliviertassinari
- [docs] Migrate Getting Started section (#255) @oliviertassinari
- [docs] Migrate Selection pages (#248) @oliviertassinari
- [docs] Migrate more pages (#243) @oliviertassinari
- [docs] Migrate sorting (#233) @oliviertassinari
- [docs] Migration of the paginaton (#224) @oliviertassinari
- [docs] Polish the first experience (#261) @oliviertassinari
- [docs] Remove blank lines @tags @oliviertassinari
