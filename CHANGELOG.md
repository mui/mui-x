# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.0.0-alpha.15](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.14...v4.0.0-alpha.15)

###### _Jan 7, 2021_

Big thanks to the 2 contributors who made this release possible. Here are some highlights ✨:

- 🔗 Update peer dependencies for React 17 (#814) @DanailH
- 🐛 Fix keyboard event collisions inside DataGrid cells (#794) @DanailH

### @material-ui/x-grid@v4.0.0-alpha.15 / @material-ui/data-grid@v4.0.0-alpha.15

- [DataGrid] Fix keyboard event collisions (#794) @DanailH

### Docs

- [docs] Add documentation for the column menu (#815) @DanailH

### Core

- [core] Update peer dependencies for React 17 (#814) @DanailH
- [core] Batch small changes (#800) @oliviertassinari
- [CHANGELOG] Use the format of the main repository @oliviertassinari

## [4.0.0-alpha.14](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.13...v4.0.0-alpha.14)

###### _Dec 31, 2020_

Big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🌎 Add support for internationalization (#718) @DanailH

  You can use the `localeText` prop to provide custom wordings in the data grid.
  Check the documentation for [a demo](https://material-ui.com/components/data-grid/localization/#translation-keys).

- 📚 Start documenting the filtering feature 🧪 (#754) @dtassone

  The work in progress filtering feature and documentation can be found following [this link](https://material-ui.com/components/data-grid/filtering/). Early feedback are welcome.

### @material-ui/x-grid@v4.0.0-alpha.14 / @material-ui/data-grid@v4.0.0-alpha.14

- [DataGrid] Convert remaining text to use locale text API (#791) @DanailH
- [DataGrid] Fix column width calculation after data changes (#756) @DanailH
- [DataGrid] Setup internationalization (#718) @DanailH
- [DataGrid] getValueError in valueGetter if incorrect field is supplied (#755) @ZeeshanTamboli
- [XGrid] Fix support for custom class name generators (#793) @DanailH

### Docs

- [docs] Polish docs (#778) @oliviertassinari
- [docs] Start documentation for the data grid filter features (#754) @dtassone
- [docs] Sync with docs to fix images (#776) @oliviertassinari

### Core

- [test] We don't need to wait 100ms (#773) @oliviertassinari
- [core] Remove useless clone (#757) @oliviertassinari

## [4.0.0-alpha.13](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.12...v4.0.0-alpha.13)

###### _Dec 16, 2020_

Big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🐛 Fix bugs from recently released features.
- 🧪 Continue the iteration on the data grid filtering feature, soon to be released @dtassone.

### @material-ui/x-grid@v4.0.0-alpha.13 / @material-ui/data-grid@v4.0.0-alpha.13

- [DataGrid] Fix density prop when toolbar is hidden (#717) @DanailH
- [DataGrid] Fix row cells leaking CSS 'text-align' from parent (#728) @ZeeshanTamboli
- [DataGrid] Add 'nonce' prop to allow inline style if user has CSP (#724) @ZeeshanTamboli

### Docs

- [docs] Add missing props to DataGrid and XGrid api pages (#721) @DanailH
- [docs] Fix wrong link anchor @oliviertassinari
- [docs] Proxy production version @oliviertassinari

### Core

- [security] Bump ini from 1.3.5 to 1.3.7 (#719) @dependabot-preview
- [core] Update monorepository (#725) @oliviertassinari
- [test] Polish refactor (#723) @oliviertassinari
- [test] Split data grid tests in multiple files (#722) @dtassone
- [test] Add tests for DataGrid filtering feature (#715) @dtassone

## [4.0.0-alpha.12](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.11...v4.0.0-alpha.12)

###### _Dec 9, 2020_

Big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🔍 Add a new data grid [density selector](https://material-ui.com/components/data-grid/rendering/#density) feature (#606) @DanailH.
- 💄 A first iteration on the data grid's toolbar.
- 🧪 Continue the iteration on the data grid filtering feature, soon to be released @dtassone.

### @material-ui/x-grid@v4.0.0-alpha.12 / @material-ui/data-grid@v4.0.0-alpha.12

#### Changes

- [DataGrid] Add Density selector (#606) @DanailH
- [DataGrid] Fix swallowing of keyboard events (#673) @DanailH
- [DataGrid] Fix collision with react-virtualized on detectElementResize (#678) @tifosiblack
- [DataGrid] Fix component name, rm context,  refact gridComponent (#707) @dtassone
- [DataGrid] Fix infinite loop with multiple grid, and fix performance (#679) @dtassone
- [DataGrid] Fix keyboard navigation in column picker (#674) @oliviertassinari
- [DataGrid] Fix server-side sorting (#704) @akandels
- [DataGrid] Improve the DX of popups (#686) @oliviertassinari
- [DataGrid] Refactor cols (#682) @dtassone
- [DataGrid] Rename hideToolbar prop to showToolbar (#706) @DanailH
- [DataGrid] Prepare server filters (#649) @dtassone
- [DataGrid] Fix display of selected rows in footer (#676) @oliviertassinari

### Docs

- [docs] Enable codesandbox preview in PRs (#613) @oliviertassinari

### Core

- [core] Batch small changes (#683) @oliviertassinari
- [test] Add regression test (#705) @oliviertassinari
- [test] Allow running all the tests in strict mode (#684) @oliviertassinari

## [4.0.0-alpha.11](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.10...v4.0.0-alpha.11)

###### _Dec 2, 2020_

Big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🐛 Fix bugs from recently released features.
- 🧪 Iterate on the upcoming filtering feature under an undocumented prop.

### @material-ui/x-grid@v4.0.0-alpha.11 / @material-ui/data-grid@v4.0.0-alpha.11

#### Breaking changes

- [XGrid] Rows refactoring, flatten RowModel, remove RowData (#668) @dtassone

  These changes simplify the API and avoid confusion between `RowData` and `RowModel`.
  Now we only have RowModel which is a flat object containing an id and the row data. It is the same object as the items of the `rows` prop array.

  The API to change update the rows using apiRef has changed:

  ```diff
  -apiRef.current.updateRowData()
  +apiRef.current.updateRows()
  ```
  ```diff
  -apiRef.current.setRowModels()
  +apiRef.current.setRows()
  ```

  `apiRef.current.updateRowModels` has been removed, please use `apiRef.current.updateRows`.

#### Changes

- [DataGrid] Fix server-side pagination (#639) @dtassone
- [DataGrid] Fix flex columns not taking into account "checkboxSelection" prop @DanailH
- [DataGrid] First iteration on filtering, basic support (#411) @dtassone
- [DataGrid] Improve filters (#635) @dtassone
- [DataGrid] Fix filters on rendering new rows (#642) @dtassone
- [DataGrid] Fix filters flex-shrink (#664) @oliviertassinari

### Docs

- [docs] Data Grid depends on side effects (#666) @oliviertassinari
- [docs] Clarify the purpose of x-grid-data-generator (#634) @Elius94
- [docs] Data Grid is in the lab (#612) @oliviertassinari
- [docs] Fix Demo app, downgrade webpack-cli, known issue in latest version (#647) @dtassone
- [docs] Fix typo in columns.md @stojy
- [docs] Reduce confusion on /export page (#646) @SerdarMustafa1

### Core

- [core] Introduce a feature toggle (#637) @oliviertassinari
- [core] Remove gitHead (#669) @oliviertassinari
- [core] Remove react-select (#658) @dependabot-preview
- [core] Replace Storybook knobs for args (#601) @tooppaaa
- [core] Update to Material-UI v4.11.1 (#636) @oliviertassinari

## [4.0.0-alpha.10](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.9...v4.0.0-alpha.10)

###### _Nov 20, 2020_

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

## [4.0.0-alpha.9](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.8...v4.0.0-alpha.9)

###### _Nov 9, 2020_

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

## [4.0.0-alpha.8](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.7...v4.0.0-alpha.8)

###### _Oct 23, 2020_

### @material-ui/x-grid@v4.0.0-alpha.8 / @material-ui/data-grid@v4.0.0-alpha.8

- [DataGrid] Fix header row tabIndex (#478) @DanailH
- [DataGrid] Reduce dependency on lodash, save 1kB gzipped (#450) @oliviertassinari
  The DataGrid goes from [28.2 kB](https://bundlephobia.com/result?p=@material-ui/data-grid@4.0.0-alpha.7) gzipped down to [27.3 kB](https://bundlephobia.com/result?p=@material-ui/data-grid@4.0.0-alpha.8) gzipped.
- [XGrid] Second iteration on resizing logic (#436) @oliviertassinari
  Fix 8 bugs with the resizing.

### Core

- [core] Remove usage of LESS (#467) @dependabot-preview
- [core] Update to the latest version of the main repo (#456) @oliviertassinari

## [4.0.0-alpha.7](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.6...v4.0.0-alpha.7)

###### _Oct 19, 2020_

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

## [4.0.0-alpha.6](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.2...v4.0.0-alpha.6)

###### _Sep 25, 2020_

### @material-ui/x-grid@v4.0.0-alpha.6 / @material-ui/data-grid@v4.0.0-alpha.6

- [DataGrid] Throw if rows id is missing (#349) @dtassone
- [DataGrid] Fix valueGetter sorting (#348) @dtassone
- [DataGrid] Fix typings and packages assets (#339) @dtassone
- [DataGrid] Add npm keywords (#304) @oliviertassinari

### Docs

- [docs] Avoid double borders (#340) @oliviertassinari
- [docs] Fix layout jump issue (#338) @oliviertassinari
- [docs] Fix short description warning (#302) @oliviertassinari

## [4.0.0-alpha.2](https://github.com/mui-org/material-ui-x/compare/v4.0.0-alpha.1...v4.0.0-alpha.2)

###### _Sep 18, 2020_

- [DataGrid] Fix wrongly exported types (#298) @dtassone

## [4.0.0-alpha.1](https://github.com/mui-org/material-ui-x/compare/v0.1.67...v4.0.0-alpha.1)

###### _Sep 17, 2020_

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
