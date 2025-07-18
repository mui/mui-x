# Changelog

> For full v7 changelog, please refer to the [v.7x branch](https://github.com/mui/mui-x/blob/v7.x/CHANGELOG.md).

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 8.9.0

_Jul 17, 2025_

We'd like to extend a big thank you to the 10 contributors who made this release possible. Here are some highlights ✨:

- ✨ Improve the drag and drop interaction for Data Grid [row reordering](https://mui.com/x/react-data-grid/row-ordering/) feature. It uses a drop indicator to point to the position the row would be moving to.

  https://github.com/user-attachments/assets/37284c4f-e8d4-4fc6-a6af-a780592905ef

- 🚀 Improve Data Grid Pivoting and Aggregation performance

- 📊 Add `minBarSize` to set a minimum height for bars

Special thanks go out to the community members for their valuable contributions:
@lauri865

The following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @flaviendelangle, @JCQuintas, @LukasTy, @mapache-salvaje, @noraleonte, @MBilalShafi

### Data Grid

#### `@mui/x-data-grid@8.9.0`

Internal changes.

#### `@mui/x-data-grid-pro@8.9.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.9.0`, plus:

- [DataGridPro] Row reorder using drop indicator (#18627) @MBilalShafi

#### `@mui/x-data-grid-premium@8.9.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.9.0`, plus:

- [DataGridPremium] Allow group column overrides with pivoting (#18765) @arminmeh
- [DataGridPremium] Support sort-dependent aggregation and improve performance (#18348) @lauri865

### Date and Time Pickers

#### `@mui/x-date-pickers@8.9.0`

- [pickers] Avoid useless date creation in `AdapterDayjs` (#18429) @flaviendelangle
- [pickers] Fix `timeSteps` JSDoc (#18807) @LukasTy

#### `@mui/x-date-pickers-pro@8.9.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.9.0`.

### Charts

#### `@mui/x-charts@8.9.0`

- [charts] Add `minBarSize` to prevent bars from having 0 height (#18798) @JCQuintas
- [charts] Add click listener to radar charts (#18773) @alexfauquette
- [charts] Improve scatter chart pointer move performance (#18775) @bernardobelchior
- [charts] Simplify radar internal hooks (#18760) @alexfauquette
- [charts] `minBarSize` now ignores `0` and `null` values (#18816) @JCQuintas
- [charts] Fix y-axis tick label overlap when using log scale (#18744) @bernardobelchior
- [charts] Expose <ChartType>Series type for all chart types (#18805) @bernardobelchior

#### `@mui/x-charts-pro@8.9.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.9.0` plus:

[charts-pro] Fix issue where charts gestures weren't properly working when inside the shadow-dom (#18837) @JCQuintas

### Tree View

#### `@mui/x-tree-view@8.9.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.9.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.9.0`.

### Codemod

#### `@mui/x-codemod@8.9.0`

Internal changes.

### Docs

- [data grid][docs] Revise the Pro filter docs (#17929) @mapache-salvaje
- [charts][docs] Move mark outside clip-path (#18806) @alexfauquette

### Miscellaneous

- [code-infra] Fix ESLint `import` restriction rule for test files (#18669) @LukasTy
- [code-infra] Remove charts benchmarks dependency on `@testing-library/jest-dom` (#18800) @bernardobelchior
- [code-infra] Remove duplicate dependency from `eslint-plugin-mui-x` (#18797) @bernardobelchior

## 8.8.0

_Jul 11, 2025_

We'd like to extend a big thank you to the 13 contributors who made this release possible. Here are some highlights ✨:

- 📊 Chart zoom preview can be enabled

  <img width="758" alt="chart with x-axis preview" src="https://github.com/user-attachments/assets/50ce6f61-16dc-4e9b-a727-ca65d80927d7" />

- 🌎 Add Indonesian (id-ID) locale on the Data Grid

Special thanks go out to the community members for their valuable contributions:
@kennarddh

The following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @noraleonte, @prakhargupta1, @rita-codes, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.8.0`

- [DataGrid] Fix `useGridSelector` missing subscription in `React.StrictMode` (#18676) @cherniavskii
- [DataGrid] Fix scrollbar filler `z-index` (#18688) @KenanYusuf
- [DataGrid] Set correct data source cache chunk size when pagination is disabled (#18636) @arminmeh
- [l10n] Add Indonesian (id-ID) locale (#18710) @kennarddh

#### `@mui/x-data-grid-pro@8.8.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.8.0`, plus:

- [DataGridPro] Fix row ordering not auto-scrolling when moving beyond viewport (#18557) @MBilalShafi
- [DataGridPro] Set correct parent paths when tree is refreshed with data source tree data and row grouping (#18715) @arminmeh

#### `@mui/x-data-grid-premium@8.8.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.8.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.8.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.8.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.8.0`.

### Charts

#### `@mui/x-charts@8.8.0`

- [charts] Add control to the axis highlight (#17900) @alexfauquette
- [charts] Avoid processing area plot data if area isn't used in series (#18712) @bernardobelchior
- [charts] Make smarter default domain limit (#18506) @alexfauquette

#### `@mui/x-charts-pro@8.8.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.8.0`, plus:

- [charts-pro] Add `funnelDirection` to control pyramid direction (#18568) @JCQuintas
- [charts-pro] Add `onBeforeExport` callback (#18722) @bernardobelchior
- [charts-pro] Add chart zoom preview (#18267) @bernardobelchior
- [charts-pro] Allow customizing scatter preview marker size (#18726) @bernardobelchior
- [charts-pro] Allow disabling the copy of styles in charts export (#18753) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.8.0`

- [tree view] Fix state update that caused scrolling bug when lazy loading and `checkboxSelection` are enabled (#18749) @rita-codes

#### `@mui/x-tree-view-pro@8.8.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.8.0`.

### Codemod

#### `@mui/x-codemod@8.8.0`

Internal changes.

### Docs

- [docs] Add standalone Pyramid chart page to improve SEO (#18527) @prakhargupta1
- [docs] Add example to customise line interaction (#18539) @alexfauquette
- [docs] Fix `size` column filtering in files tree demo (#17952) @cherniavskii
- [docs] Generate `llms.txt` for X and their products (#18595) @siriwatknp
- [docs] Improve bar chart demos on mobile (#18721) @alexfauquette
- [docs] Refine charts overview page (#17447) @noraleonte

### Miscellaneous

- [code-infra] Ensure all `@mui/*` packages are picked by `Material UI` renovate group (#18711) @LukasTy
- [code-infra] Fix broken CI (#18716) @LukasTy
- [code-infra] Refactor `prettier` config resolving (#18720) @LukasTy
- [test] Increase data points in chart benchmarks (#18714) @bernardobelchior

## 8.7.0

_Jul 4, 2025_

We'd like to extend a big thank you to the 15 contributors who made this release possible. Here are some highlights ✨:

- 📊 Add `useChartProApiRef` for easier access to the API
- 📆 Support different start and end `referenceDate` props on range components
- 📚 Documentation improvements
- 🐞 Bugfixes
- 🌎 Improve Greek (el-GR) translations on the Charts
- 🌎 Improve Danish (da-DK) locale on the Data Grid

Special thanks go out to the community members for their valuable contributions:
@ShahrazH, @vadimkuragkovskiy, @whythecode

The following are all team members who have contributed to this release:
@alexfauquette, @brijeshb42, @mapache-salvaje, @arminmeh, @bernardobelchior, @bharatkashyap, @Janpot, @JCQuintas, @KenanYusuf, @LukasTy, @michelengelen, @rita-codes

### Data Grid

#### `@mui/x-data-grid@8.7.0`

- [DataGrid] Fix column state restore with controlled column visibility model (#18567) @arminmeh
- [DataGrid] Fix styling virtualized column headers (#18603) @KenanYusuf
- [l10n] Improve Danish (da-DK) locale (#18537) @ShahrazH

#### `@mui/x-data-grid-pro@8.7.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.7.0`.

#### `@mui/x-data-grid-premium@8.7.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.7.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.7.0`

- [pickers] Support different `start` and `end` `referenceDate` props on range components (#18549) @LukasTy

#### `@mui/x-date-pickers-pro@8.7.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.7.0`.

### Charts

#### `@mui/x-charts@8.7.0`

- [charts] Export `ChartsReferenceLineProps` (#18598) @bernardobelchior
- [charts] Extract bar and line plot logic into reusable hooks (#18541) @bernardobelchior
- [charts] Extract plot logic into separate files for reuse (#18522) @bernardobelchior
- [charts] Profile charts benchmarks using chromium (#18528) @bernardobelchior
- [l10n] Add Greek (el-GR) locale to charts (#18548) @whythecode

#### `@mui/x-charts-pro@8.7.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.7.0`, plus:

- [charts-pro] Add `useChartProApiRef` for easier refs (#18013) @JCQuintas
- [charts-pro] Add tests and classes to zoom slider (#18660) @JCQuintas
- [charts-pro] Fix geometry not handling gestures in specific scenarios (#18651) @JCQuintas
- [charts-pro] Rename `useChartApiContext` to `useChartProApiContext` (#18565) @JCQuintas
- [charts-pro] Zoom pointer improvements (#17480) @JCQuintas

### Tree View

#### `@mui/x-tree-view@8.7.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.7.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.7.0`, plus:

- [tree view pro] Add missing `dataSource` JSDoc (#18650) @LukasTy

### Docs

- [docs] Add MCP stub (#18204) @bharatkashyap
- [docs] Fix AI Assistant proxy rewrite prefix (#18661) @arminmeh
- [docs] Improve test README.MD (#18634) @LukasTy
- [docs] Provide workaround for pie chart composition (#18600) @alexfauquette
- [docs][charts] Add donut chart as a special case of a pie chart (#18652) @bernardobelchior
- [docs][charts] Centralize country and continent data (#18604) @bernardobelchior
- [docs][data grid] Audit and revise the Pro row docs (#17926) @mapache-salvaje
- [docs][pickers] Add mention of theme augmentation in relevant migration section (#18608) @LukasTy

### Core

- [core] Avoid stringifying `document` object (#18657) @vadimkuragkovskiy

### Miscellaneous

- [code-infra] Bump code-infra version and fix breaking changes (#18653) @brijeshb42
- [code-infra] Ensure `material-ui/disallow-react-api-in-server-components` ESLint rule is applied (#18570) @LukasTy
- [code-infra] Migrate to flat eslint config (#18562) @brijeshb42
- [code-infra] Refactor eslint config (#18643) @LukasTy
- [infra] Add renovatebot rule for latest infra packages (#18609) @Janpot
- [infra] Move pushArgos script to code-infra (#18667) @Janpot
- [infra] Updates release script to fetch latest major version from upstream (#18552) @michelengelen
- [release] Add missing contributor to changelog (#18561) @bernardobelchior

## 8.6.0

_Jun 27, 2025_

We'd like to extend a big thank you to the 12 contributors who made this release possible. Here are some highlights ✨:

- 📊 Add export menu to charts toolbar
- 📅 Add `usePickerAdapter` hook to access the date adapter.

  You can use the adapter in your custom components if you need them to work with multiple date libraries — [Learn more](https://mui.com/x/react-date-pickers/custom-components/#access-date-adapter).

- 🌎 Improve Danish (da-DK) locale
- 🌎 Improve German (de-DE) locale

Special thanks go out to the community members for their valuable contributions:
@omalyutin, @ShahrazH, @vadimka123

The following are all team members who have contributed to this release:
@arminmeh, @bernardobelchior, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @michelengelen, @noraleonte, @rita-codes, @sai6855

### Data Grid

#### `@mui/x-data-grid@8.6.0`

- [DataGrid] Fix `label` type in `GridActionsCellItem` type (#18175) @sai6855
- [DataGrid] Fix grid menu not closing when pressing escape/tab (#18300) @KenanYusuf
- [l10n] Improve Danish (da-DK) locale (#18428) @ShahrazH
- [l10n] Improve German (de-DE) locale (#18388) @omalyutin

#### `@mui/x-data-grid-pro@8.6.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.6.0`, plus:

- [DataGridPro] Fix lazy loading params calculated from rendering context (#18460) @arminmeh

#### `@mui/x-data-grid-premium@8.6.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.6.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.6.0`

- [pickers] Add `usePickerAdapter` hook (#18457) @LukasTy
- [pickers] Fix to use latest `value` when updating `lastCommittedValue` in internal state (#18518) @LukasTy
- [pickers] Use `usePickerAdapter` hook internally instead of `useUtils` (#18465) @LukasTy

#### `@mui/x-date-pickers-pro@8.6.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.6.0`.

### Charts

#### `@mui/x-charts@8.6.0`

- [charts] Add `data-series` to charts legend item (#18414) @bernardobelchior
- [charts] Add `data-series` to bar charts (#18413) @bernardobelchior
- [charts] Add `data-series` to elements of line chart (#18409) @bernardobelchior
- [charts] Add `data-series` to pie charts (#18432) @bernardobelchior
- [charts] Fix missing key in bar plot (#18502) @bernardobelchior
- [charts] Split axis utils from main file (#18517) @JCQuintas
- [charts] Improve touch behavior for polar axis (#18531) @JCQuintas
- [charts] Add `isElementInside` helper (#18530) @JCQuintas

#### `@mui/x-charts-pro@8.6.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.6.0`, plus:

- [charts-pro] Add export menu to charts toolbar (#18210) @bernardobelchior
- [charts-pro] Fix export docs mentioning tooltip instead of toolbar (#18490) @bernardobelchior
- [charts-pro] Fix iframe not being removed after print export (#18500) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.6.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.6.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.6.0`, plus:

- [tree view pro] Fix theme augmentation (#18437) @LukasTy

### Codemod

#### `@mui/x-codemod@8.6.0`

Internal changes.

### Docs

- [docs] Document `GridRenderContext` (#18492) @arminmeh
- [docs] Prevent stale rows to appear on sort and filter change in the lazy loading demo (#18461) @arminmeh
- [docs][pickers] Update action bar demo to use the `nextOrAccept` action (#18505) @LukasTy
- [docs] Update indeterminate checkbox section in migration guide (#18229) @michelengelen
- [docs] Data source nested pagination recipe (#14777) @MBilalShafi

### Core

- [core] Avoid json stringify whole window object (#18512) @vadimka123

### Miscellaneous

- [code-infra] Dynamically get pickers adapters dependencies versions (#18446) @JCQuintas
- [infra] Adjust inquirer version and usage (#18495) @michelengelen
- [infra] Use `String.raw` for creating the remote regex (#18462) @michelengelen

## 8.5.3

_Jun 19, 2025_

We'd like to extend a big thank you to the 10 contributors who made this release possible. Here are some highlights ✨:

- 📚 Documentation improvements
- 🐞 Bugfixes

Special thanks go out to the community members for their valuable contributions:
@alisasanib, @arminmeh, @sai6855

The following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @flaviendelangle, @JCQuintas, @LukasTy, @MBilalShafi, @oliviertassinari

### Data Grid

#### `@mui/x-data-grid@8.5.3`

- [DataGrid] Fix export menu button tooltip being interactive when menu is open (#18327) @bernardobelchior
- [DataGrid] Fix column menu scroll close (#18065) @alisasanib
- [DataGrid] Fix page size issue with data source (#18419) @MBilalShafi

#### `@mui/x-data-grid-pro@8.5.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.5.3`, plus:

- [DataGridPro] Ignore missing `rowCount` response when new children are fetched with the data source (#17711) @arminmeh

#### `@mui/x-data-grid-premium@8.5.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.5.3`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.5.3`

- [pickers] Add `inputSizeSmall` to classes interface (#18242) @sai6855

#### `@mui/x-date-pickers-pro@8.5.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.5.3`.

### Charts

#### `@mui/x-charts@8.5.3`

- [charts] Add item class to list item around each series in legend (#18411) @bernardobelchior
- [charts] Allow `tabIndex` in surface and legend (#18344) @JCQuintas
- [charts] Explore selector typing (#18362) @alexfauquette
- [charts] Fix highlight with number ids (#18423) @alexfauquette
- [charts] Make scatter chart use data attributes (#18048) @alexfauquette

#### `@mui/x-charts-pro@8.5.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.5.3`, plus:

- [charts-pro] Add data-series to elements of funnel chart (#18067) @JCQuintas
- [charts-pro] Hide values outside minStart and maxEnd in zoom slider (#18336) @bernardobelchior
- [charts-pro] Fix `FunnelChart` label positioning with different curves (#18354) @JCQuintas

### Tree View

#### `@mui/x-tree-view@8.5.3`

Internal changes.

#### `@mui/x-tree-view-pro@8.5.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.5.3`.

### Codemod

#### `@mui/x-codemod@8.5.3`

Internal changes.

### Docs

- [docs] Fix 404 in charts docs (#18440) @alexfauquette
- [docs][pickers] Fix adapter version resolving when opening demo to edit (#18363) @LukasTy

### Core

- [core] Fix pnpm valelint error (#18420) @oliviertassinari

### Miscellaneous

- [code-infra] Add back a `Playwright` renovate group (#18397) @LukasTy
- [code-infra] Setup `CODEOWNERS` for charts repositories (#18418) @JCQuintas
- [code-infra] Strengthen `URL` usage for test config (#18444) @LukasTy
- [code-infra] Use `vitest` bundled types (#17758) @JCQuintas
- [infra] Stabilise tests by removing babel and plugins from vitest (#18341) @JCQuintas
- [infra] Add automated release PR creation script (#18345) @michelengelen

## 8.5.2

_Jun 12, 2025_

We'd like to extend a big thank you to the 15 contributors who made this release possible. Here are some highlights ✨:

- 📊 Improve Data Grid selectors performance
- 🐞 Fix `useSyncExternalStore` import error in React 17

Special thanks go out to the community members for their valuable contributions:
@alisasanib, @noobyogi0010.

The following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @JCQuintas, @KenanYusuf, @LukasTy, @mapache-salvaje, @michelengelen, @noraleonte, @oliviertassinari, @prakhargupta1, @romgrk.

### Data Grid

#### `@mui/x-data-grid@8.5.2`

- [DataGrid] Improve selectors performance (#18234) @romgrk
- [DataGrid] Fix data grid palette when using CSS vars (#18310) @KenanYusuf
- [DataGrid] Ignore data source request if the grid got unmounted (#18268) @arminmeh

#### `@mui/x-data-grid-pro@8.5.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.5.2`, plus:

- [DataGridPro] Fix flex column width if it is a pinned column (#18293) @alisasanib
- [DataGridPro] Fix inconsistent filtering results with aggregation (#17954) @cherniavskii

#### `@mui/x-data-grid-premium@8.5.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.5.2`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.5.2`

- [pickers] Add `PickerDay2` and `DateRangePickerDay2` components (#15921) @noraleonte
- [pickers] Fix `hiddenLabel` prop propagation (#18195) @noobyogi0010

#### `@mui/x-date-pickers-pro@8.5.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.5.2`.

### Charts

#### `@mui/x-charts@8.5.2`

- [charts] Add a default value formatter for continuous scales (#18178) @bernardobelchior
- [charts] Add margin-bottom to charts toolbar (#18326) @bernardobelchior
- [charts] Fix grid with band scale (#18295) @alexfauquette
- [charts] Remove unnecessary style changes in tests (#18317) @JCQuintas
- [charts] Remove `sx` prop merging from `useComponentRenderer` (#18235) @bernardobelchior
- [charts] Fix `useSyncExternalStore` import error in React 17 (#18314) @bernardobelchior

#### `@mui/x-charts-pro@8.5.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.5.2`, plus:

- [charts-pro] Document zoom slider tooltip value formatting (#18261) @bernardobelchior
- [charts-pro] Funnel `gap` prop does not impact the drawing area (#18233) @JCQuintas
- [charts-pro] Use `ChartsToolbarPro` types in pro charts (#18243) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.5.2`

- [tree-view] Fix `useSyncExternalStore` import error in React 17 (#18314) @bernardobelchior

#### `@mui/x-tree-view-pro@8.5.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.5.2`.

### Docs

- [docs] Add toolbar custom trigger and panel recipe (#18297) @KenanYusuf
- [docs] Copyedit the Priority support page (#18311) @mapache-salvaje
- [docs] Remove confusing opt-out mention in telemetry docs (#18257) @prakhargupta1
- [docs] Revise the Master Detail doc (#17927) @mapache-salvaje
- [docs] Revise the list view doc (#17928) @mapache-salvaje
- [docs] Audit and revise the Pro column docs (#17844) @mapache-salvaje
- [docs] Add some more context on Heatmap (#18256) @oliviertassinari
- [x-telemetry] Reduce Telemetry overhead (#18292) @oliviertassinari
- [code-infra] Align Node version used in CI to v22 (#18319) @LukasTy
- [code-infra] Fix pkg.pr.new publishing (#18316) @bernardobelchior
- [code-infra] Revert `React` to `19.0.0` (#18265) @LukasTy
- [code-infra] Use `catalog` for reused dependencies (#18302) @LukasTy
- [infra] Remove unused karma/mocha deps and files (#18340) @JCQuintas
- [infra] Update GitHub label references to use 'scope' instead of 'component' (#18260) @michelengelen
- [infra] Use a single browser server in CI (#18230) @JCQuintas

## 8.5.1

<!-- generated comparing v8.5.0..master -->

_Jun 5, 2025_

We'd like to extend a big thank you to the 9 contributors who made this release possible. Here are some highlights ✨:

- 📊 Allow exporting pie charts
- 📚 Documentation improvements
- 🌎 Improve Portuguese (ptPT) translations on the Data Grid
- 🌎 Improve Portuguese (ptPT, ptBR) translations on Charts
- 🌎 Improve Arabic (ar-SD) locale
- 🐞 Bugfixes

Special thanks go out to the community members for their valuable contributions: @moosekebab, @TiagoPortfolio.
The following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @JCQuintas, @KenanYusuf, @LukasTy, @michelengelen, @arminmeh.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.5.1`

- [DataGrid] Fix `registerPipeProcessor()` for Node v20 (#18241) @arminmeh
- [DataGrid] Fix background color in column header filler cells (#18188) @KenanYusuf
- [DataGrid] Keep pipe pre-processors execution order when callback reference changes (#17558) @arminmeh
- [DataGrid] Use `useComponentRenderer` from x-internals (#18203) @bernardobelchior
- [l10n] Improve Arabic (ar-SD) locale (#17959) @moosekebab
- [l10n] Improve Portuguese from Portugal (pt-PT) locale (#18064) @TiagoPortfolio

#### `@mui/x-data-grid-pro@8.5.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.5.1`, plus:

- [DataGridPro] Skip rendering detail panels of the rows turned into skeleton rows with lazy loading (#17958) @arminmeh

#### `@mui/x-data-grid-premium@8.5.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.5.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.5.1`

- [pickers] Fix `transformOrigin` resolving based on popper `placement` (#18206) @LukasTy

#### `@mui/x-date-pickers-pro@8.5.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.5.1`.

### Charts

#### `@mui/x-charts@8.5.1`

- [charts] Allow skipping tooltip render (#18050) @alexfauquette
- [charts] Fix act warnings in toolbar tests (#18212) @JCQuintas
- [charts] Fix prop typo in `extendVertically` (#18211) @JCQuintas
- [charts] Fix responsive height for ChartsWrapper (#18183) @alexfauquette
- [charts] Improve charts toolbar accessibility (#18056) @bernardobelchior
- [charts] Let line series propagate null from the dataset (#18223) @alexfauquette
- [l10n] Add Portuguese locales for charts (pt-PT, pt-BR) (#18069) @bernardobelchior

#### `@mui/x-charts-pro@8.5.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.5.1`, plus:

- [charts-pro] Add `linear-sharp` curve as alternative to square edge (#17966) @JCQuintas
- [charts-pro] Add correct classes to `FunnelSectionLabel` (#18061) @JCQuintas
- [charts-pro] Allow exporting a pie chart (#18063) @bernardobelchior
- [charts-pro] Fix initial render for zoom slider selection (#18208) @bernardobelchior
- [charts-pro] Fix props being passed to DOM in FunnelChart (#18192) @JCQuintas
- [charts-pro] Show axis value in zoom slider tooltip (#18054) @bernardobelchior
- [charts-pro] Render the toolbar in the heatmap chart (#18247) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.5.1`

Internal changes.

#### `@mui/x-tree-view-pro@8.5.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.5.1`.

### Docs

- [docs] Update `valueFormatter` signature in migration guide (#18226) @michelengelen

### Core

- [code-infra] Different approach to console testing for `processRowUpdate` (#18213) @JCQuintas
- [code-infra] Fix act warnings in DataGrid/toolbar (#18207) @JCQuintas
- [code-infra] Remove `istanbul` references (#18194) @JCQuintas
- [code-infra] Remove codesandbox:ci (#18179) @JCQuintas
- [code-infra] Replace `mocha` with `vitest` on e2e and regression tests (#18071) @JCQuintas
- [code-infra] Upgrade @mui/internal-test-utils (#18191) @JCQuintas
- [code-infra] Use vitest for `no-direct-state-access` tests (#18209) @JCQuintas
- [infra] Improve test setup (#18228) @LukasTy
- [infra] Update bug and feature request templates to standardize label types (#18198) @michelengelen
- [infra] Use `playwright` docker image (#18186) @LukasTy

## 8.5.0

_May 29, 2025_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 📊 Add support for exporting `RadarChartPro`, `FunnelChart` and `Heatmap` as image and PDF.
- 📊 `RadarChart` is now stable.

Special thanks go out to the community members for their valuable contributions:
@xBlizZer, @sai6855, @alisasanib.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @KenanYusuf, @LukasTy, @oliviertassinari.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.5.0`

- [DataGrid] Avoid ResizeObserver loop error (#17984) @cherniavskii
- [DataGrid] Fix column management `toggleColumn` event type (#18023) @KenanYusuf
- [DataGrid] Remove unnecessary `any` type (#17979) @sai6855

#### `@mui/x-data-grid-pro@8.5.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.5.0`, plus:

- [DataGridPro] Allow multi sorting without modifier key (#17925) @cherniavskii
- [DataGridPro] Row reordering icon improvements (#17947) @KenanYusuf
- [DataGridPro] Fix pinned columns order in column management (#17950) @alisasanib

#### `@mui/x-data-grid-premium@8.5.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.5.0`, plus:

- [DataGridPremium] Export `GridApiPremium` type (#18037) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.5.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.5.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.5.0`, plus:

- [DateRangePicker] Allow to override the format in the field (#17972) @flaviendelangle

### Charts

#### `@mui/x-charts@8.5.0`

- [charts] Add `render` prop to charts toolbar components (#17649) @bernardobelchior
- [charts] Add configurable slots to toolbar (#17712) @bernardobelchior
- [charts] Export `useFunnelSeries` and `useRadarSeries` (#18034) @JCQuintas
- [charts] Expose `ChartApi` through context (#18004) @bernardobelchior
- [charts] Mark Radar chart as stable (#17946) @alexfauquette
- [charts] Only update store if interaction item is different (#17851) @bernardobelchior
- [charts] Reuse shared date utils (#18014) @JCQuintas
- [charts] Use Map for string cache instead of object (#17982) @bernardobelchior
- [charts] Fix Population pyramid demo (#17987) @oliviertassinari

#### `@mui/x-charts-pro@8.5.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.5.0`, plus:

- [charts-pro] Add range selection to zoom slider (#17949) @bernardobelchior
- [charts-pro] Allow configuring zoom slider tooltip (#18030) @bernardobelchior
- [charts-pro] Allow exporting a funnel chart (#17957) @bernardobelchior
- [charts-pro] Allow exporting a heatmap chart (#17916) @bernardobelchior
- [charts-pro] Allow exporting a radar chart (#17968) @bernardobelchior
- [charts-pro] Always show both zoom slider tooltips (#18027) @bernardobelchior
- [charts-pro] Show zoom slider tooltip when selecting range (#18028) @bernardobelchior
- [charts-pro] Split `ChartAxisZoomSlider` into smaller files (#18011) @bernardobelchior
- [charts-pro] Update zoom slider range selection cursor (#17977) @bernardobelchior
- [charts-pro] Add support for Heatmap legend (#17943) @alexfauquette

### Tree View

#### `@mui/x-tree-view@8.5.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.5.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.5.0`.

### Docs

- [docs] Fix derived column pivoting demo crash (#17944) @arminmeh
- [docs] Fix light/dark mode blink on pickers overview (#18002) @alexfauquette
- [docs] Fix scatter shape demo causing horizontal overflow (#17974) @bernardobelchior

### Core

- [code-infra] Add bundle size monitor (#17754) @Janpot
- [code-infra] Enable `babel-plugin-display-name` in vitest (#17903) @JCQuintas
- [infra] Remove last deprecated `ponyfillGlobal` usage (#18003) @LukasTy
- [infra] Use `babel-plugin-display-name` from npm (#18040) @LukasTy
- [x-telemetry] Remove deprecated `ponyfillGlobal` (#17986) @xBlizZer

## 8.4.0

_May 21, 2025_

We'd like to offer a big thanks to the 21 contributors who made this release possible. Here are some highlights ✨:

- 🔺 Support regular [`pyramid` variation in the `<FunnelChart />` component](https://mui.com/x/react-charts/funnel/#pyramid-chart):

  <img width="398" alt="Pyramid funnel chart" src="https://github.com/user-attachments/assets/90ccb221-3a48-4ffa-8878-89c6db16da86" />

- 📚 Documentation improvements
- 🌎 Improve Icelandic (is-IS) locale on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community members for their valuable contributions:
@aizerin, @arminmeh, @campmarc, @jyash97, @mapache-salvaje, @noraleonte, @nusr, @ragnarr18, @romgrk, @whereisrmsqhs.
Following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @flaviendelangle, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @rita-codes.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.4.0`

- [DataGrid] Fix content rendering for large rows while using automatic page size (#14737) @campmarc
- [DataGrid] Fix disabled typography variants crashing grid (#17934) @KenanYusuf
- [DataGrid] Fix tree data demo crash (#17904) @MBilalShafi
- [DataGrid] Use `exclude` selection model type if quick filter does not have actual values (#17899) @arminmeh
- [DataGrid] Fix clipboard copy behavior for cell ranges with empty cells (#16797) @nusr
- [l10n] Improve Icelandic (is-IS) locale (#17915) @ragnarr18

#### `@mui/x-data-grid-pro@8.4.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.4.0`, plus:

- [DataGridPro] Add `aria-expanded` attribute to the master detail toggle button (#17122) @whereisrmsqhs
- [DataGridPro] Preserve row state during server-side lazy loading (#17743) @arminmeh
- [DataGridPro] Prevent text selection when reordering rows (#16568) @jyash97

#### `@mui/x-data-grid-premium@8.4.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.4.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.4.0`

- [fields] Ensure fresh `disabled` value is used when focusing or clicking (#17914) @aizerin
- [fields] Improve the field controlled edition (#17816) @flaviendelangle
- [pickers] Fix `PickersTextField` overflow (#17942) @noraleonte

#### `@mui/x-date-pickers-pro@8.4.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.4.0`.

### Charts

#### `@mui/x-charts@8.4.0`

- [charts] Add grouped axes demo (#17848) @bernardobelchior
- [charts] Enable tooltip disable portal (#17871) @alexfauquette
- [charts] Improve performance in scatter chart (#17849) @bernardobelchior
- [charts] Recreate `isPointInside` less often (#17850) @bernardobelchior
- [charts] Try fix for flaky `useAnimate` test (#17777) @JCQuintas
- [charts] Add `isXInside` and `isYInside` (#17911) @bernardobelchior

#### `@mui/x-charts-pro@8.4.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.4.0`, plus:

- [charts-pro] Add size for zoom slider (#17736) @bernardobelchior
- [charts-pro] Add zoom slider tooltip (#17733) @bernardobelchior
- [charts-pro] Clean and document Heatmap Tooltip (#17933) @alexfauquette
- [charts-pro] Introduce `Pyramid` chart (#17783) @JCQuintas
- [charts-pro] Update zoom slider nomenclature (#17938) @bernardobelchior
- [charts-pro] Fix error when importing rasterizehtml (#17897) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.4.0`

- [TreeView] Add `getItemChildren` prop in `RichTreeView` (#17894) @rita-codes
- [TreeView] Add a method in the `apiRef` to toggle the editing status of an item (#17768) @rita-codes
- [TreeView] Add missing sx prop on the Tree Item component (#17930) @flaviendelangle

#### `@mui/x-tree-view-pro@8.4.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.4.0`.

### Docs

- [docs] Add a recipe for drag and drop row grouping (#17638) @KenanYusuf
- [docs] Add introductory text to Data Grid component pages (#17902) @KenanYusuf
- [docs] Refactor embedded CodeSandbox on Data Grid—Quickstart page (#17749) @rita-codes
- [docs] Remove double border on Data Grid—Quickstart demo (#17932) @rita-codes
- [docs] Standardize `apiRef` copy (#17776) @mapache-salvaje
- [docs][DataGrid] Revise server-side data docs (#17007) @mapache-salvaje
- [docs][DataGrid] Audit and revise the tree data doc (#17650) @mapache-salvaje
- [docs][pickers] Fix migration guide references to range fields (#17861) @LukasTy
- [docs][charts] Reorganize the Tooltip documentation (#17917) @alexfauquette

### Core

- [core] refactor: remove manual `displayName` (#17845) @romgrk
- [code-infra] Document how to use `vitest` cli (#17847) @JCQuintas
- [code-infra] Increase charts export test timeout (#17909) @JCQuintas
- [code-infra] Set `isolatedModules=true` in tsconfig (#17781) @JCQuintas
- [infra] Ensure proper docs preview path resolution (#17863) @LukasTy

## 8.3.1

_May 14, 2025_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Norwegian Bokmål (nb-NO) locale on the Data Grid
- 🌍 Improve Korean (ko-KR) locale on the Data Grid and Pickers
- 📚 Documentation improvements
- 🐞 Bugfixes

Special thanks go out to the community members for their valuable contributions:
@100pearlcent, @htollefsen, @JanPretzel, @sai6855.
Following are all team members who have contributed to this release:
@bernardobelchior, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @MBilalShafi, @oliviertassinari, @prakhargupta1.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.3.1`

- [DataGrid] Add `reason` param for `onRowSelectionModelChange` callback (#17545) @sai6855
- [DataGrid] Fix `renderContext` calculation loop (#17779) @cherniavskii
- [DataGrid] Fix column spanning jump on scroll (#17759) @cherniavskii
- [DataGrid] Fix material augmentation not working (#17761) @cherniavskii
- [DataGrid] Use arguments selector for checkbox props (#17683) @MBilalShafi
- [l10n] Improve Norwegian Bokmål (nb-NO) locale (#17766) @htollefsen
- [l10n] Improve Korean (ko-KR) locale (#17484) @100pearlcent

#### `@mui/x-data-grid-pro@8.3.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.3.1`.

#### `@mui/x-data-grid-premium@8.3.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.3.1`, plus:

- [DataGridPremium] Fix aggregation label not being used in pivot panel (#17760) @cherniavskii

### Date and Time Pickers

#### `@mui/x-date-pickers@8.3.1`

- [fields] Add notch to the field outlined when the label is manually shrank (#17620) @flaviendelangle
- [l10n] Improve Korean (ko-KR) locale (#17484) @100pearlcent

#### `@mui/x-date-pickers-pro@8.3.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.3.1`.

### Charts

#### `@mui/x-charts@8.3.1`

- [charts] Fix infinite tick number when zoom range is zero (#17750) @bernardobelchior
- [charts] Improve tick rendering performance (#17755) @bernardobelchior

#### `@mui/x-charts-pro@8.3.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.3.1`, plus:

- [charts-pro] Fix ESM build issue with Vite (#17774) @bernardobelchior
- [charts-pro] Add benchmark for zoomed in scatter chart (#17756) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.3.1`

Internal changes.

#### `@mui/x-tree-view-pro@8.3.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.3.1`.

### Docs

- [docs] Fix 301 to Next.js docs for license @oliviertassinari
- [docs] Fix AI assistant API URL (#17745) @oliviertassinari
- [docs] Fix heading structure in README @oliviertassinari
- [docs] Fix translation keys documentation (#17811) @JanPretzel
- [docs] Improve CHANGELOG format @oliviertassinari

### Core

- [core] Apply YAML convention, blank line only at top level @oliviertassinari
- [code-infra] Fix dynamic import missing extensions (#17767) @Janpot
- [code-infra] Replace `mocha` with `vitest` for browser & jsdom tests (#14508) @JCQuintas
- [scheduler] Create the package and setup a private doc page (#17239) @flaviendelangle

## 8.3.0

_May 8, 2025_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🎨 Added new styling options and shapes for `<FunnelChart />`, including `variant`, `borderRadius`, `pyramid`, and `step-pyramid` curves.
- 📚 Documentation improvements
- 🐞 Bugfixes

Special thanks go out to this community member for a valuable contribution: @ptuukkan.
Team members who have contributed to this release: @alexfauquette, @arminmeh, @bernardobelchior, @flaviendelangle, @Janpot, @JCQuintas, @LukasTy, @MBilalShafi, @rita-codes, @romgrk.

### Data Grid

#### `@mui/x-data-grid@8.3.0`

- [DataGrid] Fix cell editing of computed columns with data source (#17684) @ptuukkan
- [DataGrid] Fix lazy loading crash with `isRowSelectable` prop (#17629) @MBilalShafi
- [DataGrid] Fix: use CSS nonce (#17726) @romgrk
- [DataGrid] Ignore `preProcessEditCellProps` for non-editable columns when starting a row update (#17732) @arminmeh
- [DataGrid] Avoid applying row selection propagation on filtered rows (#17739) @MBilalShafi

#### `@mui/x-data-grid-pro@8.3.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.3.0`.

#### `@mui/x-data-grid-premium@8.3.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.3.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.3.0`

- [DateTimePicker] Fix focus behavior on desktop variant (#17719) @LukasTy
- [pickers] Avoid `DigitalClock` stealing focus from a Picker open button on close (#17686) @LukasTy

#### `@mui/x-date-pickers-pro@8.3.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.3.0`, plus:

- [DateRangePicker] Fix to reset range position after closing mobile Picker (#17631) @LukasTy

### Charts

- The `<FunnelChart />` series now accepts a `variant='outlined'` prop for a simpler style.
  <img width="398" alt="Screenshot 2025-05-06 at 20 36 12" src="https://github.com/user-attachments/assets/00fef14f-9026-421e-a4b6-7e081adce1e8" />

- Add a `borderRadius` property to `<FunnelChart />`. All funnels have `8px` as a default value.
  <img width="386" alt="Screenshot 2025-05-06 at 14 00 20" src="https://github.com/user-attachments/assets/4f4cc0e7-01ce-4ed6-a0e1-a387f78def23" />

- Add a `pyramid` curve to `<FunnelChart />`, which allows creation of a pyramid-shaped funnel.
  <img width="344" alt="Screenshot 2025-05-06 at 14 32 59" src="https://github.com/user-attachments/assets/0b2896e0-0478-4766-bb1b-258a4977a751" />

- Add a `step-pyramid` curve to `<FunnelChart />`, which creates a stepped-pyramid like shape.
  <img width="344" alt="Screenshot 2025-05-06 at 14 33 03" src="https://github.com/user-attachments/assets/894f0ab3-7898-40fe-b0df-560feea4085a" />

#### `@mui/x-charts@8.3.0`

- [charts] Add charts toolbar with zoom options (#17615) @bernardobelchior
- [charts] Add zoom slider (#17496) @bernardobelchior
- [charts] Cleanup compiler warnings (#17360) @alexfauquette
- [charts] Fix `<PieArcLabel />` not taking `arcLabelRadius` into account (#17655) @bernardobelchior
- [charts] Fix spark line not having clip path (#17501) @bernardobelchior
- [charts] Fix type issue with ESM (#17624) @alexfauquette
- [charts] Improve `<MarkElement />` performance (#17546) @bernardobelchior
- [charts] Rename `materialSlots` internal constant (#17710) @bernardobelchior
- [charts] Update zoom slider design (#17682) @bernardobelchior
- [charts] Fix zoom being documented as available for heatmap (#17657) @bernardobelchior

#### `@mui/x-charts-pro@8.3.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.3.0`, plus:

- [charts-pro] Add `pyramid` curve to `<FunnelChart />` (#17665) @JCQuintas
- [charts-pro] Add `variant='outlined'` to `<FunnelChart />` series (#17661) @JCQuintas
- [charts-pro] Add a `borderRadius` property to `<FunnelChart />` (#17660) @JCQuintas

### Tree View

#### `@mui/x-tree-view@8.3.0`

- [tree view] Bug fix - Escape does not cancel Drag n Drop (#17735) @rita-codes
- [tree view] Fix keyboard navigation error (#17685) @rita-codes
- [tree view] Continue cleaning the plugin system (#17386) @flaviendelangle

#### `@mui/x-tree-view-pro@8.3.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.3.0`.

### Docs

- [charts] Add population pyramid demo (#17652) @bernardobelchior
- [charts] Fix randomised argos test (#17658) @JCQuintas
- [docs] Make preview messaging consistent in charts @bernardobelchior

### Core

- [code-infra] Avoid `node` types in the built packages (#17533) @LukasTy
- [code-infra] Add `pkg.pr.new` publishing (#17402) @Janpot
- [code-infra] Normalize author package in org @oliviertassinari
- [code-infra] Remove required checkout step (#17729) @JCQuintas
- [docs-infra] Normalize netlify.toml in org @oliviertassinari

## 8.2.0

_May 1, 2025_

We'd like to offer a big thanks to the 14 contributors who made this release possible. Here are some highlights ✨:

- 📊 `<FunnelChart/>` now uses the `strawberrySky` sequential color palette by default.
  <img width="481" alt="Screenshot 2025-04-29 at 13 55 21" src="https://github.com/user-attachments/assets/182085d1-a7ce-4e4d-9d8d-a4fe87f27167" />
- 📊 Add API to export a chart as an image: `apiRef.exportAsImage` — [Learn more](https://mui.com/x/react-charts/export/#export-as-image).

Special thanks go out to the community members for their valuable contributions:
@federico-ntr, @nusr.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @hasdfa, @Janpot, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @michelengelen, @oliviertassinari, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.2.0`

- [DataGrid] Fix panel alignment (#17625) @KenanYusuf
- [DataGrid] Fix theme `defaultProps` causing unwanted re-renders (#17490) @KenanYusuf
- [DataGrid] Fix circular reference error (#17591) @romgrk
- [DataGrid] Fix `<GridEditInputCell />` break input (#16773) @nusr

#### `@mui/x-data-grid-pro@8.2.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.2.0`, plus:

- [DataGridPro] Use intersection observer to trigger server-side infinite loading (#17369) @arminmeh

#### `@mui/x-data-grid-premium@8.2.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.2.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.2.0`

- [l10n] Improve Italian (it-IT) locale (#17600) @federico-ntr
- [pickers] Refactor owner state typing (#17517) @LukasTy

#### `@mui/x-date-pickers-pro@8.2.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.2.0`.

### Charts

#### `@mui/x-charts@8.2.0`

- [charts] Add library name to errors (#17547) @bernardobelchior
- [charts] Add monochrome palettes (#17610) @JCQuintas
- [charts] Add screenshot of the tooltip (#17395) @alexfauquette
- [charts] Default bar chart x-axis scale type to band (#17519) @bernardobelchior
- [charts] Document axis ID uniqueness constraints (#17630) @bernardobelchior
- [charts] Refactor axis types (#17632) @bernardobelchior
- [charts] Use `<circle />` for circular legend mark (#17590) @alexfauquette

#### `@mui/x-charts-pro@8.2.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.2.0`, plus:

- [charts-pro] Add `gap` option to `<FunnelChart />` (#17642) @JCQuintas
- [charts-pro] Export charts as image (#17353) @bernardobelchior
- [charts-pro] Simplify zoom testing (#17525) @JCQuintas
- [charts-pro] Use new sequential color palette in `<FunnelChart />` (#17606) @JCQuintas

### Tree View

#### `@mui/x-tree-view@8.2.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.2.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.2.0`.

### Docs

- [docs][charts] Add composition sections (#17377) @alexfauquette
- [docs][charts] Add docs on tooltip style (#17601) @bernardobelchior
- [docs][charts] Fix highlighting heading structure (#17581) @oliviertassinari
- [docs][charts] Improve export docs (#17538) @oliviertassinari
- [docs][charts] Similar introduction on most charts pages (#17374) @alexfauquette
- [docs][DataGrid] Clear component docs (#17540) @oliviertassinari
- [docs] Explicitly state that `groupingColDef` reference needs to be stable (#17544) @arminmeh
- [docs] Fix <kbd> a11y (#17536) @oliviertassinari
- [docs] Fix CodeSandbox spelling @oliviertassinari
- [docs] Fix coding style function @oliviertassinari
- [docs] Fix migration guide format (#17450) @oliviertassinari
- [docs] Improve data grid export docs (#17551) @MBilalShafi
- [docs] Remove leftover `@next` usages (#17542) @LukasTy

### Core

- [core] Add security label to dependabot PRs @oliviertassinari
- [core] Allow post-install vale @oliviertassinari
- [core] Component consistency @oliviertassinari
- [core] Fix all Vale errors @oliviertassinari
- [core] Move `loadStyleSheets` to internals and use it in data grid and charts (#17548) @bernardobelchior
- [core] Remove empty version (#17582) @oliviertassinari
- [core] Remove eslint from codemod spec files (#17443) @alexfauquette
- [core] Remove unnecessary versions (#17597) @oliviertassinari
- [code-infra] Allow postinstall scripts for packages requesting it (#17635) @LukasTy
- [code-infra] Data Grid `vitest` changes (#17619) @JCQuintas
- [code-infra] Fix date-time sensitive tests (#17644) @JCQuintas
- [code-infra] Fix extension handling for type imports (#17636) @Janpot
- [code-infra] Further remove `clock=fake` and add `async act` for datagrid (#17563) @JCQuintas
- [code-infra] Latest vitest picker changes (#17577) @JCQuintas
- [docs-infra] Fix Vale no longer working (#17602) @alexfauquette
- [docs-infra] Uniformize Vale between repositories @oliviertassinari
- [infra] Updates to `branch switch comments` (#17589) @michelengelen
- [x-telemetry] Fix issue with get machineid hash (#17614) @hasdfa

## 8.1.0

_Apr 24, 2025_

We'd like to offer a big thanks to the 14 contributors who made this release possible. Here are some highlights ✨:

- 📊 Add API to print a chart or export it as PDF: `apiRef.exportAsPrint()`.
- 📚 Documentation improvements
- 🐞 Bugfixes

Special thanks go out to the community members for their valuable contributions:
@lhilgert9, @ArturAghakaryan, @sai6855.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @JCQuintas, @joserodolfofreitas, @KenanYusuf, @LukasTy, @mapache-salvaje, @oliviertassinari, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.1.0`

- [DataGrid] Allow row deselection with multiple rows selected (#17473) @arminmeh
- [DataGrid] Fix column title truncation on touch devices (#17375) @KenanYusuf
- [DataGrid] Remove internal usage of `material` prop (#17513) @KenanYusuf
- [DataGrid] Fix apiRef not being passed on onCellClick params (#17335) @sai6855
- [DataGrid] Add Armenian (hy-AM) locale (#17527) @ArturAghakaryan

#### `@mui/x-data-grid-pro@8.1.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.1.0`, plus:

- [DataGridPro] Fix locales.ts export (#17433) @lhilgert9
- [DataGridPro] Avoid proptypes warnings with header filters in React 17 (#17482) @cherniavskii
- [DataGridPro] Fix expandable rows detail content height updates (#17394) @arminmeh

#### `@mui/x-data-grid-premium@8.1.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.1.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.1.0`

- [pickers] Improve `PickersInputBase` owner state typing (#17478) @LukasTy

#### `@mui/x-date-pickers-pro@8.1.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.1.0`.

### Charts

- Add API to print a chart or export it as PDF: `apiRef.exportAsPrint()`.

#### `@mui/x-charts@8.1.0`

- [charts] Add a localization provider (#17325) @alexfauquette
- [charts] Add codemod for replacing legend's hidden slot prop (#17392) @bernardobelchior
- [charts] Fix chart visual tests flakiness (#17469) @bernardobelchior
- [charts] Fix tooltip position (#17440) @alexfauquette
- [charts] Improve axis tooltip performances (#17398) @alexfauquette
- [charts] Move radar from under development to preview (#17418) @alexfauquette
- [charts] Advance time in charts regression tests (#17420) @bernardobelchior
- [charts] Fix charts visuals flakiness (#17472) @bernardobelchior
- [charts] Move `rafThrottle` on event handlers instead of setter (#17489) @bernardobelchior

#### `@mui/x-charts-pro@8.1.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.1.0`, plus:

- [charts-pro] Add export as PDF/print functionality (#17285) @bernardobelchior
- [charts-pro] Fix axis zoom being disabled when not specified in `initialZoom` (#17500) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.1.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.1.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.1.0`.

### Docs

- [docs] Fix AI Assistant Panel Trigger demo (#17426) @KenanYusuf
- [docs] Fix DataGrid's master-detail demo for one expanded detail panel at a time (#17471) @arminmeh
- [docs] Improve StackOverflow links (#17483) @oliviertassinari
- [docs] Refine charts demos (#17417) @alexfauquette
- [docs] Remove ad on paid docs pages (#17373) @oliviertassinari
- [docs] Serve migration guides in raw markdown format (#17210) @cherniavskii
- [docs] Fix heading structure (#17495) @oliviertassinari
- [docs] Revise the Row Grouping doc (#16217) @mapache-salvaje
- [docs] Fix ellipsis in the demo (#17476) @oliviertassinari
- [docs] Add docs information for Legend HTML (#17502) @alexfauquette
- [docs] Refine charts demos (#17417) @alexfauquette
- [tree view][docs] Copyedit the Tree View Overview page (#17498) @mapache-salvaje

### Core

- [core] Bump `@types/node` (#17444) @LukasTy
- [core] Remove `react-is` dependency (#17470) @LukasTy
- [core] Remove redundant `overridesResolver` in `styled` components (#17466) @romgrk
- [core] Update support table (#17425) @joserodolfofreitas
- [code-infra] Ditch `@babel/node` (#17446) @LukasTy
- [code-infra] Further remove `clock=fake` from pickers (#17253) @JCQuintas

## 8.0.0

_Apr 17, 2025_

We're excited to [announce the first v8 stable release](https://mui.com/blog/mui-x-v8/)! 🎉🚀

This is now the officially supported major version, where we'll keep rolling out new features, bug fixes, and improvements.
Migration guides are available with a complete list of the breaking changes:

- [Data Grid](https://mui.com/x/migration/migration-data-grid-v7/)
- [Date and Time Pickers](https://mui.com/x/migration/migration-pickers-v7/)
- [Tree View](https://mui.com/x/migration/migration-tree-view-v7/)
- [Charts](https://mui.com/x/migration/migration-charts-v7/)
- [Material UI v7](https://mui.com/material-ui/migration/upgrade-to-v7/)

Here are the highlights from alpha and beta releases included in this stable release:

- ⚛️ React 19 support.
- 🎁 `@mui/material@7` support – see the [Material UI v7 upgrade guide](https://mui.com/material-ui/migration/upgrade-to-v7/).

- 🔄 [Pivoting](https://mui.com/x/react-data-grid/pivoting/).
- 🤖 [AI Assistant](https://mui.com/x/react-data-grid/ai-assistant/).
- 🛠️ New and improved Data Grid [Toolbar component](https://mui.com/x/react-data-grid/components/toolbar/).
- 📦 Data Grid [data source](https://mui.com/x/react-data-grid/server-side-data/) is now available in the Community plan.
- 🚫 Add ["No columns" overlay](https://mui.com/x/react-data-grid/overlays/#no-columns-overlay) to Data Grid.
- 🍬 Improved design for Data Grid [Header filters](https://mui.com/x/react-data-grid/filtering/header-filters/).
- 🔄 Add Data Grid [Scroll restoration](https://mui.com/x/react-data-grid/scrolling/#scroll-restoration).
- 💫 Support [aggregation with server-side data](https://mui.com/x/react-data-grid/server-side-data/aggregation/).
- 🎁 Support [server-side lazy loading](https://mui.com/x/react-data-grid/server-side-data/lazy-loading/) on the Data Grid.
- 📝 Support [editing with server-side Data Source](https://mui.com/x/react-data-grid/server-side-data/#updating-data).
- 🎯 Improved [data caching](https://mui.com/x/react-data-grid/server-side-data/#data-caching).
- 🏎️ Improved Data Grid aggregation, Excel export serialization, mount, resize and scrolling performance.
- 🎨 Improved Data Grid theming and add default background color.

- 📊 New Pro chart: [Funnel](https://mui.com/x/react-charts/funnel/).
- 📊 New Community chart: [Radar](https://mui.com/x/react-charts/radar/) is available in preview for testing.
- 📊 Charts legend is now an HTML element which can be styled more easily.
- 📊 [Gauge charts](https://mui.com/x/react-charts/gauge/) animation.
- 📊 Create [custom HTML components](https://mui.com/x/react-charts/components/#html-components) using chart data.
- 📊 Refactor Charts [Tooltip customization](https://mui.com/x/react-charts/tooltip/#overriding-content).
- 📊 Improved Charts [composition](https://mui.com/x/react-charts/composition/#overview).
- 📊 Charts support server-side rendering under [some conditions](https://mui.com/x/react-charts/getting-started/#server-side-rendering).
- 📊 Add a new API to support multiple axes (decouple `margin` and `axis-size`).
- 🚫 Removed `react-spring` dependency from `@mui/x-charts`.

- 🚀 New [Time Range Picker](https://mui.com/x/react-date-pickers/time-range-picker/) component.

- 🔁 Support [automatic parents and children selection](https://mui.com/x/react-tree-view/rich-tree-view/selection/#automatic-parents-and-children-selection) for the Rich Tree View components.
- 🎛️ New [customization APIs](https://mui.com/x/migration/migration-tree-view-v7/#new-api-to-customize-the-tree-item) for the Tree Item component.

Below are the changes since the last beta release:

### Data Grid

#### `@mui/x-data-grid@8.0.0`

- [DataGrid] Data source with editing (#16045) @MBilalShafi
- [DataGrid] Deprecate old toolbar components (#17294) @KenanYusuf
- [DataGrid] Refactor: add typings to icons (#17291) @romgrk
- [DataGrid] Prevent scrollbars from showing on top (#17405) @romgrk
- [l10n] Improve Polish (pl-PL) locale (#17336) (#17396) @sofortdagmbh
- [l10n] Improve Swedish (sv-SE) locale (#17293) @ptuukkan

#### `@mui/x-data-grid-pro@8.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0`, plus:

- [DataGridPro] Fix row virtualization not working in list view (#17399) @cherniavskii

#### `@mui/x-data-grid-premium@8.0.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0`, plus:

- [DataGridPremium] AI Assistant (#16992) @arminmeh
- [DataGridPremium] Fix aggregated values sorting (#17326) @cherniavskii
- [DataGridPremium] Fix cell display with custom renderers in pivot mode (#17323) @cherniavskii
- [DataGridPremium] Fix stale aggregation results after filtering (#17296) @cherniavskii
- [DataGridPremium] Pivoting (#9877) @cherniavskii
- [DataGridPremium] Use `groupingValueGetter` for row grouping on the server (#17376) @cherniavskii

### Date and Time Pickers

#### Breaking changes

- The view selection process has been updated to make it clear across all Pickers.
  Pickers no longer automatically switch between **date** and **time views** or **start** and **end positions**.
  Moving between views and range positions is achieved using the new "Next" action button.

#### `@mui/x-date-pickers@8.0.0`

- [fields] Fix the error message when a custom field with an `<input />` but the field expects the accessible DOM structure (#17237) @flaviendelangle
- [fields] Fix to submit a form on `Enter` press with accessible DOM structure (#17328) @LukasTy
- [fields] Prevent focusing the field or any section when `disabled=true` (#17215) @flaviendelangle
- [l10n] Improve Czech (cs-CZ) locale (#17387) @lubka272
- [l10n] Improve Slovak (sk-SK) locale (#17249) @lubka272
- [pickers] Fix failing proptypes CI (#17413) @romgrk
- [pickers] Fix to not process default prevented propagated events (#17312) @LukasTy
- [pickers] Mark active range position field section with underline (#16938) @LukasTy
- [pickers] Remove automatic switch between date and time or between range positions (#17166) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0`, plus:

- [DateTimeRangePicker] Fix focused view behavior (#17313) @LukasTy

### Charts

#### `@mui/x-charts@8.0.0`

- [charts] Add `slotProps.legend.hidden` to migration docs (#17379) @bernardobelchior
- [charts] Add labels above bars example (#16860) @bernardobelchior
- [charts] Add tooltip to the radar (#16950) @alexfauquette
- [charts] Add uncertainty area to line with forecast demo (#17355) @bernardobelchior
- [charts] Animate gauge chart (#17304) @bernardobelchior
- [charts] Convert `AnimationContext` into a plugin (#17299) @bernardobelchior
- [charts] Export 'series' class as part of `barElementClasses` (#17273) @10tacion
- [charts] Expose axes types (#17309) @bernardobelchior
- [charts] Expose higher level `useAnimate` hook (#17162) @bernardobelchior
- [charts] Fix axis types not narrowing (#17321) @bernardobelchior
- [charts] Fix bar chart with partial data (#17290) @alexfauquette
- [charts] Fix `useAnimate` test flakiness (#17372) @bernardobelchior
- [charts] Radar design refinement (#17165) @alexfauquette
- [charts] Remove unused code (#17310) @bernardobelchior
- [charts] Remove unused files (#17242) @JCQuintas
- [charts] Use `useEventCallback` to memoize `onZoomChange` without triggering a re-render (#17233) @JCQuintas
- [charts] Document series class name (#17362) @bernardobelchior
- [charts] Add default plugins in `ChartDataProvider` (#17403) @bernardobelchior
- [charts] Fix chart direction in docs (#17419) @bernardobelchior

#### `@mui/x-charts-pro@8.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0`, plus:

- [charts-pro] Update zoom using `requestAnimationFrame` (#17137) @JCQuintas

### Tree View

#### `@mui/x-tree-view@8.0.0`

- [TreeView] Add React Compiler linting rules (#16357) @flaviendelangle

#### `@mui/x-tree-view-pro@8.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0`.

### Docs

- [docs] Add intro section for Telemetry (#17244) @prakhargupta1
- [docs] Add migration guide for the picker's `ownerState` changes (#17151) @flaviendelangle
- [docs] Add What's new section for MUI X v8 (#17397) @joserodolfofreitas
- [docs] Fix ESM guide (#17280) @oliviertassinari
- [docs] Fix Vale errors (#17281) @oliviertassinari
- [docs] Fix country columns throwing on grouping (#17315) @cherniavskii
- [docs] Fix paths in `ResponsiveChartContainer` migration guide (#17364) @MonstraG
- [docs] Mention priority support on MUI X docs (#16467) @prakhargupta1
- [docs] Match title side nav @oliviertassinari
- [docs] Fix incorrect mention of PDF export (#17277) @oliviertassinari
- [docs] Fix row spanning lab icon (#17278) @oliviertassinari
- [docs] Fix header Sentence case consistency (#17274) @oliviertassinari
- [docs] Flag experimental API (#17279) @oliviertassinari
- [docs] Fix some 301 redirections @oliviertassinari
- [docs] Update supported versions table (#17287) @joserodolfofreitas

### Core

- [core] Always use the correct babel runtime (#17241) @alexfauquette
- [core] Document `TelemetryContextType` (#17282) @oliviertassinari
- [core] Fix proptypes (#17378) @cherniavskii
- [core] Remove modern bundles (#17359) @LukasTy
- [core] Setup testing to work with CSS imports (#17214) @romgrk
- [core] Testing setup fixes & lints (#17356) @romgrk
- [core] Simplify the way `__RELEASE_INFO__` is managed (#17416) @LukasTy
- [code-infra] Align build script with core to handle sideEffects (#17370) @Janpot
- [code-infra] CI optimization: re-use ffmpeg (#17333) @romgrk
- [code-infra] Charts `vitest` changes (#17247) @JCQuintas
- [code-infra] Further datagrid changes for `vitest` (#17251) @JCQuintas
- [code-infra] Prepare argos script call for required arg (#17371) @Janpot
- [code-infra] Remove more `clock=fake` from pickers tests (#17225) @JCQuintas
- [code-infra] Tentative fix for datagrid flaky test (#17289) @JCQuintas
- [code-infra] Update MUI Internal and slightly cleanup regressions test setup (#17182) @LukasTy
- [infra] Update support label from 'priority' to 'unknown' (#17288) @michelengelen
- [release] Major release preparation (#17319) @michelengelen
- [test] Fix flaky data source aggregation test (#17307, #17311, #17316) @KenanYusuf @cherniavskii @LukasTy
- [test] Skip flaky aggregation test (#17391) @MBilalShafi

## 8.0.0-beta.3

_Apr 3, 2025_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🚫 Removed `react-spring` as a dependency of `@mui/x-charts`
- 📦 Data Grid list view feature is now stable
- 💫 Support title in Data Grid
- 📚 Documentation improvements
- 🐞 Bugfixes

Team members who have contributed to this release: @bernardobelchior, @cherniavskii, @flaviendelangle, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @michelengelen, @oliviertassinari, @noraleonte, @romgrk, @alexfauquette.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- The list view feature and its related props are now stable.

  The `unstable_listColumn` prop has been renamed to `listViewColumn`.

  The `GridListColDef` type has been renamed to `GridListViewColDef`.

  ```diff
  -const listViewColDef: GridListColDef = {
  +const listViewColDef: GridListViewColDef = {
     field: 'listColumn',
     renderCell: ListViewCell,
   };

   <DataGridPro
  -  unstable_listView
  -  unstable_listColumn={listViewColDef}
  +  listView
  +  listViewColumn={listViewColDef}
   />
  ```

- The `useGridApiEventHandler()` hook has been renamed to `useGridEvent()`.
- The `useGridApiOptionHandler()` hook has been renamed to `useGridEventPriority()`.

#### `@mui/x-data-grid@8.0.0-beta.3`

- [DataGrid] Fix "is any of" autocomplete rendering (#17226) @KenanYusuf
- [DataGrid] Rename `useGridApiEventHandler()` to `useGridEvent()` (#17159) @romgrk
- [DataGrid] Support adding a label to the grid (#17147) @KenanYusuf
- [DataGrid] Refactor: remove material typings (#17119) @romgrk

#### `@mui/x-data-grid-pro@8.0.0-beta.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-beta.3`, plus:

- [DataGridPro] Make list view feature stable (#17217) @KenanYusuf
- [DataGridPro] Always refetch lazy-loading rows (#16827) @MBilalShafi

#### `@mui/x-data-grid-premium@8.0.0-beta.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-beta.3`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.0.0-beta.3`

- [pickers] Add new `nextOrAccept` action bar action (#17037) @flaviendelangle
- [pickers] Improve the Multi Section Digital Clock scrollbar thickness (#16774) @oliviertassinari
- [TimePicker] Align the Digital Clock scrollbar thickness (#17203) @LukasTy

#### `@mui/x-date-pickers-pro@8.0.0-beta.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-beta.3`.

### Charts

#### Breaking changes

- Removed `react-spring` as a dependency of `@mui/x-charts`.
  A consequence of this change is that the props of some slots have been changed because the `SpringValue` wrapper has been removed. The affected slots and props are:
  - the type of the `x`, `y`, `width` and `height` props of the `bar` slot are now `number`;
  - the type of `startAngle`, `endAngle`, `innerRadius`, `outerRadius`, `arcLabelRadius`, `cornerRadius` and `paddingAngle` props of `pieArc` and `pieArcLabel` slot are now `number`.

  Additionally, the `pieArc` slot now receives a `skipAnimation` prop to configure whether animations should be enabled or disabled.

- Tick labels in the y-axis of cartesian charts will now have an ellipsis applied to prevent overflow.
  If your tick labels are being clipped sooner than you would like, you can increase the y-axis size by increasing its width property.

- The tooltip DOM structure is modified to improve accessibility. If you relied on it to apply some style or run tests, you might be impacted by this modification.
  - The axis tooltip displays a table per axis with the axis value in a caption.
  - Cells containing the series label and the color mark got merged in a th cell.

#### `@mui/x-charts@8.0.0-beta.3`

- [charts] Adjust color palettes (#17209) @noraleonte
- [charts] Allow multiple axes in the tooltip (#17058) @alexfauquette
- [charts] Improve custom legend docs (#17231) @JCQuintas
- [charts] Fix crash when item shown in tooltip is unmounted (#17169) @bernardobelchior
- [charts] Migrate some animations from `react-spring` (#16961) @bernardobelchior
- [charts] Remove `react-spring` (#17123) @bernardobelchior
- [charts] Fix y-axis tick label overflow (#16846) @bernardobelchior

#### `@mui/x-charts-pro@8.0.0-beta.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-beta.3`.

### Tree View

#### `@mui/x-tree-view@8.0.0-beta.3`

Internal changes.

#### `@mui/x-tree-view-pro@8.0.0-beta.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-beta.3`.

### `@mui/x-codemod@8.0.0-beta.3`

- [codemod] Add `listView` prop rename codemod (#17220) @MBilalShafi

### Docs

- [docs] Add "Usage with Material UI v5/v6" guide (#17164) @cherniavskii
- [docs] Fix 301 link @oliviertassinari
- [docs] Fix redirection getting-started (#17200) @oliviertassinari
- [docs] Sync Stack Overflow docs with reality (#17198) @oliviertassinari
- [docs] Update Localization Provider JSDoc link (#17207) @LukasTy

### Core

- [core] Cleanup `@mui` dependency versions (#17160) @LukasTy
- [core] Sync scorecards.yml across codebase @oliviertassinari
- [core] Revert upgrade to React 19.1 (#17206) @bernardobelchior
- [code-infra] Fix `test:unit` warning (#17224) @JCQuintas
- [code-infra] Fix pickers failing test after clock=fake removal (#17202) @JCQuintas
- [code-infra] Remove clock=fake from `describeValidation` (#17150) @JCQuintas
- [code-infra] Remove clock=fake from `describeValue` (#17199) @JCQuintas
- [infra] Add write permission for actions in issue status label handler (#17161) @michelengelen

## 8.0.0-beta.2

_Mar 27, 2025_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🔍 Update the Data Grid quick filter to be collapsed when not in use
- 🐞 Bugfixes

Special thanks go out to the community members for their valuable contributions:
@lhilgert9.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @flaviendelangle, @hasdfa, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @michelengelen, @mnajdova, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.0.0-beta.2`

- [DataGrid] Fix error caused by trying to render rows that are not in the state anymore (#17057) @arminmeh
- [DataGrid] Refactor: remove more material (#16922) @romgrk
- [DataGrid] Update Quick Filter component to be expandable (#16862) @KenanYusuf
- [DataGrid] Fix crash when used with `@mui/styled-engine-sc` (#17154) @KenanYusuf

#### `@mui/x-data-grid-pro@8.0.0-beta.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-beta.2`, plus:

- [DataGridPro] Data source: Allow expanding groups with unknown children (#17144) @MBilalShafi

#### `@mui/x-data-grid-premium@8.0.0-beta.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-beta.2`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.0.0-beta.2`

- [fields] Extract the props of each field slot into a standalone hook for easier re-use (#17114) @flaviendelangle
- [pickers] Fix visual regression in Date Range Calendar's day (#17148) @flaviendelangle
- [pickers] Remove all code duplication to apply default values to validation props (#17038) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-beta.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-beta.2`.

### Charts

#### `@mui/x-charts@8.0.0-beta.2`

- [charts] Memoize axes and series with default (#17156) @alexfauquette
- [charts] Add pie benchmark (#17115) @JCQuintas
- [charts] Fix CSS vars support for dark theme (#17106) @alexfauquette
- [charts] Fix radar hover (#17134) @alexfauquette
- [charts] Move axis interaction to selectors (#17039) @alexfauquette
- [charts] Fix Pie benchmark (#17125) @JCQuintas

#### `@mui/x-charts-pro@8.0.0-beta.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-beta.2`.

### Tree View

#### `@mui/x-tree-view@8.0.0-beta.2`

Internal changes.

#### `@mui/x-tree-view-pro@8.0.0-beta.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-beta.2`.

### `@mui/x-codemod@8.0.0-beta.1`

- [codemod] Add Data Grid codemods (#17121, #17124) @MBilalShafi

### Docs

- [docs] Fix example import for `ExportExcel` component (#17110) @KenanYusuf

### Core

- [code-infra] Remove `@mui/styles` dependency & patches (#17071) @mnajdova
- [code-infra] Add more tests to slow screenshot tests (#17075) @JCQuintas
- [code-infra] Fix pickers codecov (#17120) @JCQuintas
- [code-infra] Move `isDeepEqual` to @mui/x-internals (#17129) @JCQuintas
- [code-infra] Remove `test_regressions` step from React 18 pipeline (#17108) @LukasTy
- [code-infra] Update some data-grid tests for vitest (#17078, #17104, #17146) @JCQuintas
- [code-infra] Update some date-pickers tests for vitest (#17083) @JCQuintas
- [infra] Update `issue-status-label-handler.yml` @michelengelen
- [infra] Added reusable issue status label handler workflow (#17145) @michelengelen
- [infra] Switch to reusable 'stale issues/PRs' workflow (#17107) @michelengelen
- [telemetry] Improve request body size, update dependencies, and optimize SSR handling (#17008) @hasdfa

## 8.0.0-beta.1

_Mar 21, 2025_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

Special thanks go out to the community members for their valuable contributions:
@jyash97.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @flaviendelangle, @JCQuintas, @KenanYusuf.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.0.0-beta.1`

- [DataGrid] Fix error caused by `forwardRef` to `ClickAwayListener` (#17049) @arminmeh
- [DataGrid] Fix error while editing rows with custom id (#17048) @arminmeh

#### `@mui/x-data-grid-pro@8.0.0-beta.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-beta.1`, plus:

- [DataGridPro] Fix header select checkbox state with `checkboxSelectionVisibleOnly` and `paginationMode="server"` (#17026) @arminmeh

#### `@mui/x-data-grid-premium@8.0.0-beta.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-beta.1`, plus:

- [DataGridPremium] Update column state correctly when grouping mode is updated with one grouping column (#17069) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.0.0-beta.1`

- [fields] Clean the `useField` hook (part 1) (#16944) @flaviendelangle
- [fields] Improve the check for year in `doesSectionFormatHaveLeadingZeros` (#17051) @flaviendelangle
- [pickers] Deprecate the `disableOpenPicker` prop (#17040) @flaviendelangle
- [pickers] Simplify the `cleanLeadingZeros` method (#17063) @flaviendelangle
- [pickers] Use the new `ownerState` in `PickersDay` and `DateRangePickerDay` (#17035) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-beta.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-beta.1`, plus:

- [DateRangePicker] Use desktop media query constant on range pickers (#17052) @flaviendelangle

### Charts

#### `@mui/x-charts@8.0.0-beta.1`

- [charts] Fix horizontal bar with multiple axes (#17059) @alexfauquette

#### `@mui/x-charts-pro@8.0.0-beta.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-beta.1`, plus:

- [charts-pro] Allow disabling Heatmap tooltip (#17060) @JCQuintas

### Tree View

#### `@mui/x-tree-view@8.0.0-beta.1`

Internal changes.

#### `@mui/x-tree-view-pro@8.0.0-beta.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-beta.1`.

### Docs

- [docs] Fix 404 (#17033) @alexfauquette
- [docs] Fix Data Grid advanced list view demo (#17064) @KenanYusuf

## 8.0.0-beta.0

<img width="100%" alt="MUI X v8 Beta is live" src="https://github.com/user-attachments/assets/61ec4dd8-c946-456b-8b45-d51de8772f5d">

_Mar 18, 2025_

We'd like to offer a big thanks to the 21 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Add [Time Range Picker](https://mui.com/x/react-date-pickers/time-range-picker/) component
- 🎁 Add support for `@mui/material` version 7 in all X packages
- 🐞 Bugfixes
- 🌍 Improve Chinese (zh-CN), (zh-HK), (zh-TW), Czech (cs-CZ), Korean (ko-KR) and Slovak (sk-Sk) locales on the Data Grid
- 🌍 Improve Chinese (zh-CN), (zh-HK) and (zh-TW) locales on the Pickers

### Breaking changes

- ℹ️ The peer dependency on `@mui/material` has been updated to accept only v7.
  This has been done to increase the adoption rate of ESM.
  Since only v7 of `@mui/material` has proper ESM support, we decided to help with its adoption and fix numerous issues using X packages in environments where transpiling is not an option.

Special thanks go out to the community members for their valuable contributions:
@Blake-McCullough, @hlavacz, @k-rajat19, @layerok, @nusr, @owais635, @yelahj.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @DiegoAndai, @flaviendelangle, @Janpot, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @michelengelen, @noraleonte, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Alpha release highlights

Below are the highlights of the alpha releases leading up to this beta release:

- ⚛️ React 19 support.

- 🛠️ New and improved Data Grid [Toolbar component](https://mui.com/x/react-data-grid/components/toolbar/).
- 📦 Data Grid [data source](https://mui.com/x/react-data-grid/server-side-data/) is now available in the Community plan.
- 🚫 Add ["No columns" overlay](https://mui.com/x/react-data-grid/overlays/#no-columns-overlay) to Data Grid.
- 🍬 Improved design for Data Grid [Header filters](https://mui.com/x/react-data-grid/filtering/header-filters/).
- 🔄 Add Data Grid [Scroll restoration](https://mui.com/x/react-data-grid/scrolling/#scroll-restoration).
- 💫 Support [aggregation with server-side data](https://mui.com/x/react-data-grid/server-side-data/aggregation/).
- 🎁 Support [Server-side lazy loading](https://mui.com/x/react-data-grid/server-side-data/lazy-loading/) on the Data Grid.
- 🎯 Improved [data caching](https://mui.com/x/react-data-grid/server-side-data/#data-caching).
- 🏎️ Improve Data Grid aggregation, Excel export serialization, mount, resize and scrolling performance.
- 🎨 Improve Data Grid theming and add default background color.

- 📊 New Pro chart: [Funnel](https://mui.com/x/react-charts/funnel/).
- 📊 New Community chart: [Radar](https://mui.com/x/react-charts/radar/) is available in preview for testing.
- 📊 Charts legend is now an HTML element which can be styled more easily.
- 📊 Create [custom HTML components](https://mui.com/x/react-charts/components/#html-components) using chart data.
- 📊 Refactor Charts [Tooltip customization](https://mui.com/x/react-charts/tooltip/#overriding-content).
- 📊 Improve Charts [composition](https://mui.com/x/react-charts/composition/#overview).
- 📊 Charts support server-side rendering under [some conditions](https://mui.com/x/react-charts/getting-started/#server-side-rendering).
- 📊 Add a new API to support multiple axes (decouple `margin` and `axis-size`)

- 🔁 Support [automatic parents and children selection](https://mui.com/x/react-tree-view/rich-tree-view/selection/#automatic-parents-and-children-selection) for the Rich Tree View components.

### Data Grid

#### `@mui/x-data-grid@8.0.0-beta.0`

- [DataGrid] Add a slot for unsort icon in column menu (#16918) @layerok
- [DataGrid] Add click propagation and prevents default on `toggleMenu` click (#16845) @michelengelen
- [DataGrid] Anchor preference panel to columns/filter trigger (#16953) @KenanYusuf
- [DataGrid] Fix `QuickFilter` debounce overriding input value (#16856) @KenanYusuf
- [DataGrid] Fix `printOptions` not respecting `hideFooter` root prop (#14863) @k-rajat19
- [DataGrid] Fix `processRowUpdate()` error if the row is removed before it is executed (#16741) @arminmeh
- [DataGrid] Fix bug with adding and removing columns in active edit state (#16888) @Blake-McCullough
- [DataGrid] Fix columns update not restoring column definition defaults (#16970) @cherniavskii
- [DataGrid] Fix page scrolling when preference panel is opened (#17004) @KenanYusuf
- [DataGrid] Fix visual issue with pinned columns and row spanning (#16923) @MBilalShafi
- [DataGrid] Make column header menu button aria-labels unique (#16796) @owais635
- [DataGrid] Refactor: create base Pagination (#16759) @romgrk
- [DataGrid] Update CSS variable naming convention to singular (#16993) @KenanYusuf
- [DataGrid] Use Material UI CSS vars (#16962) @KenanYusuf
- [l10n] Improve Chinese (zh-CN), (zh-HK) and (zh-TW) locales (#15230, #16898 and #16966) @nusr
- [l10n] Improve Czech (cs-CZ) and Slovak (sk-Sk) locales (#16968) @hlavacz
- [l10n] Improve Korean (ko-KR) locale (#16807) @yelahj

#### `@mui/x-data-grid-pro@8.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-beta.0`, plus:

- [DataGridPro] Fix header filters not displaying restored values (#16855) @MBilalShafi
- [DataGridPro] Fix infinite loading not reacting when scrolling to the end (#16926) @arminmeh

#### `@mui/x-data-grid-premium@8.0.0-beta.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-beta.0`, plus:

- [DataGridPremium] Fix selection propagation issues with controlled state (#16810) @MBilalShafi

### Date and Time Pickers

#### Breaking changes

- The `useClearableField` hook has been removed.
  The custom field component now receives the `clearable` and `onClear` props — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#useclearablefield).
- The `ExportedUseClearableFieldProps`, `UseClearableFieldSlots`, `UseClearableFieldSlotProps`, and `UseClearableFieldResponse` types have been removed — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#removed-types).

#### `@mui/x-date-pickers@8.0.0-beta.0`

- [l10n] Improve Chinese (zh-CN), (zh-HK) and (zh-TW) locales (#16966) @nusr
- [pickers] Add the Time Range Picker component (#9431) @LukasTy and @flaviendelangle
- [pickers] Add valid aria labels to the range picker opening button (#16799) @flaviendelangle
- [pickers] Always use `props.value` as the source of truth when defined (#16853) @flaviendelangle
- [pickers] Avoid passing unexpected `focusedView` to time renderers (#16869) @LukasTy
- [pickers] Improve JSDoc (#16858) @flaviendelangle
- [pickers] Remove `useClearableField` hook (#16859) @LukasTy

#### `@mui/x-date-pickers-pro@8.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-beta.0`, plus:

- [DateRangeCalendar] Do not update the previewed day when hovering a day and the value is empty (#16892) @flaviendelangle
- [TimeRangePicker] Shift popper between start and end input on multi input field (#16920) @LukasTy

### Charts

#### Breaking changes

- Tick labels in the x-axis of cartesian charts will now have an ellipsis applied to prevent overflow.
  If your tick labels are being clipped sooner than you would like, you can increase the x-axis size by increasing its `height` property.
  The default line-height has also been changed to 1.25, so if you aren't customizing the line height for x-axis tick labels, make sure to double check if the result is desirable.

#### `@mui/x-charts@8.0.0-beta.0`

- [charts] Add axis highlight to the radar (#16868) @alexfauquette
- [charts] Add radar labels (#16839) @alexfauquette
- [charts] Allow breaking line for radar labels (#16947) @alexfauquette
- [charts] Allow circular grid on radar chart (#16870) @alexfauquette
- [charts] Allow customizing shape in scatter charts (#16640) @bernardobelchior
- [charts] Avoid spreading props in demos (#16857) @bernardobelchior
- [charts] Fix React 18 tests failing due to missing `forwardRef` (#16894) @bernardobelchior
- [charts] Fix line highlight position with RTL (#16994) @alexfauquette
- [charts] Fix interaction performance (#16897) @JCQuintas
- [charts] Fix x-axis tick label overflow (#16709) @bernardobelchior
- [charts] Grid support time step below 1s (#16957) @alexfauquette
- [charts] Improve radar slice (#16932) @alexfauquette
- [charts] Radar add option to highlighting series (#16940) @alexfauquette
- [charts] Refactor zoom `isInteracting` behavior directly to community code (#16999) @JCQuintas
- [charts] Remove `fireEvent` usage from tests (#17006) @JCQuintas
- [charts] Remove dead voronoi code (#16886) @JCQuintas
- [charts] Remove the polar axis plugin from the default plugins of the ChartContainer (#16936) @alexfauquette
- [charts] Rename `useIsClient` (#16937) @bernardobelchior

#### `@mui/x-charts-pro@8.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-beta.0`.

### Tree View

#### `@mui/x-tree-view@8.0.0-beta.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-beta.0`.

### Docs

- [docs] Add the Time Range Picker to relevant validation demos (#16919) @LukasTy
- [docs] Adjust Picker field lifecycle explanation (#16901) @LukasTy
- [docs] Fix custom detail panel toggle state update (#16929) @nusr
- [docs] Fix Pickers custom field with Autocomplete demo (#16863) @LukasTy
- [docs] Fix link to the lazy loading demo for the DataGrid (#16907) @nusr
- [docs] Improve sparkline demo (#16911) @alexfauquette
- [docs] Remove `showQuickFilter: true` toolbar prop from demos (#17003) @KenanYusuf

### Core

- [core] Fix proptypes and API docs after merge (#16934) @LukasTy
- [core] Update `@mui/utils` dependency to only v7 (#16928) @Janpot
- [core] Use MUI Core v7 libraries in packages and docs (#16771) @DiegoAndai
- [code-infra] Avoid loading package.json with relative path (#16931) @Janpot
- [code-infra] Bump `cimg/node` image version (#16964) @LukasTy
- [code-infra] Create `Tanstack query` renovate group (#16989) @LukasTy
- [code-infra] Fix inconsistent argos test (#16921) @JCQuintas
- [infra] Added issue permission to workflow (#16865) @michelengelen
- [infra] Make tests on React 18 part of pipeline (#16933) @LukasTy
- [infra] changed event trigger from `pull_request` to `pull_request_target` (#16902) @michelengelen
- [test] Fix Apple M3 failing to execute unit test cases (#16959) @nusr

## 8.0.0-alpha.14

_Mar 7, 2025_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🚀📊 New Pro Chart: It is now possible to create Funnel charts—perfect for visualizing conversions, sales pipelines and more!
  <img width="418" alt="Screenshot 2025-01-31 at 12 22 31" src="https://github.com/user-attachments/assets/8cd26821-5f11-46bf-a9bb-34d212880a47" />
- 🎁 The first iteration of the radar chart is available. Features and refinements will be added in the coming weeks.
- 🛠️ New and improved [Toolbar component](https://mui.com/x/react-data-grid/components/toolbar/) for the data grid
- 🐞 Bugfixes

Special thanks go out to the community member for their valuable contributions:
@vadimka123.

Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @flaviendelangle, @JCQuintas, @KenanYusuf, @LukasTy, @michelengelen, @noraleonte, @oliviertassinari.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- The density selector has been removed from the toolbar. It is still possible to set the density programmatically via the `density` prop. A density selector can be added to a custom toolbar passed to `slots.toolbar`. See [Toolbar component—Settings menu](https://mui.com/x/react-data-grid/components/toolbar/#settings-menu) for an example.
- The quick filter is now shown in the toolbar by default. Use `slotProps={{ toolbar: { showQuickFilter: false } }}` to hide it.
- The `<GridSaveAltIcon />` icon is not exported anymore. Import `SaveAlt` from `@mui/icons-material` instead.

#### `@mui/x-data-grid@8.0.0-alpha.14`

- [DataGrid] Fix `aria-hidden` console error when scrollbar is dragged (#16829) @arminmeh
- [DataGrid] Fix scroll jump with dynamic row height (#16763) @cherniavskii
- [DataGrid] New `<Toolbar />` component (#14611) @KenanYusuf
- [DataGrid] Use new toolbar by default (#16814) @KenanYusuf
- [DataGrid] Remove the quick filtering on a given column (#16738) @vadimka123

#### `@mui/x-data-grid-pro@8.0.0-alpha.14` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.14`.

#### `@mui/x-data-grid-premium@8.0.0-alpha.14` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.14`.

### Date and Time Pickers

#### Breaking changes

- All Date Time Picker variants now use Digital Clock for time editing.
- Stop passing invalid date to `onChange` when the date is partially filled — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#treat-partially-filled-date-as-null-in-onchange).

#### `@mui/x-date-pickers@8.0.0-alpha.14`

- [DateTimePicker] Use Digital Clock in all component variants (#16678) @LukasTy
- [fields] Always use `props.value` as the source of truth when defined (#15875) @flaviendelangle
- [fields] Fix Fields aria relationship with `helperText` (#16821) @LukasTy
- [pickers] Add `TValidationProps` generic to the `PickerManager` interface (#16832) @flaviendelangle
- [pickers] Fix `edge` property setting in different button position cases (#16838) @LukasTy
- [pickers] Fix typo in JSDoc (#16831) @flaviendelangle
- [pickers] Refactor the files in the `usePicker` folder (#16680) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.14` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.14`.

### Charts

#### `@mui/x-charts@8.0.0-alpha.14`

- [charts] Fix `undefined` behaving differently from missing value for axis size (#16844) @bernardobelchior
- [charts] Fix x-axis text anchor default when language is RTL (#16836) @bernardobelchior
- [charts] Add Radar chart (#16406) @alexfauquette
- [charts] Move series default color generation in the series config (#16752) @alexfauquette
- [charts] Render axis title within axis size (#16730) @bernardobelchior
- [charts] Split `defaultizeAxis` function into two (#16745) @bernardobelchior
- [charts] Warn if axes data don't have enough elements (#16830) @alexfauquette
- [charts] XAxis: Add defaults for `textAnchor` and `dominantBaseline` based on `angle` (#16817) @bernardobelchior

#### `@mui/x-charts-pro@8.0.0-alpha.14` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.14`, plus:

- [charts] Add Funnel chart (#14804) @JCQuintas

### Tree View

#### Breaking changes

- The `selectItem` method has been renamed `setItemSelection`:

  ```diff
   const { publicAPI } = useTreeItemUtils();

   const handleSelectItem() {
  -  publicAPI.selectItem({ event, itemId: props.itemId, shouldBeSelected: true })
  +  publicAPI.setItemSelection({ event, itemId: props.itemId, shouldBeSelected: true })
   }
  ```

- The `setItemExpansion` method now receives a single object instead of a list of parameters:

  ```diff
   const { publicAPI } = useTreeItemUtils();

   const handleExpandItem() {
  -  publicAPI.setItemExpansion(event, props.itemId, true)
  +  publicAPI.setItemExpansion({ event, itemId: props.itemId, shouldBeExpanded: true })
   }
  ```

#### `@mui/x-tree-view@8.0.0-alpha.14`

- [TreeView] Clean the expansion and selection API methods (#16795) @flaviendelangle

#### `@mui/x-tree-view-pro@8.0.0-alpha.14` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.14`.

### Docs

- [docs] Fix padding package install on mobile (#16794) @oliviertassinari
- [docs] Typo fixes (#16835) @alexfauquette

### Core

- [code-infra] Fix console warning in telemetry package (#16816) @JCQuintas
- [code-infra] Split date-picker test files (#16825) @JCQuintas
- [infra] Replace PR label check workflow with reusable version (#16762) @michelengelen
- [infra] Update label in priority-support issue template (#16767) @michelengelen
- [test] Add timeout to flaky screenshot tests (#16852) @LukasTy

## 8.0.0-alpha.13

_Feb 28, 2025_

We'd like to offer a big thanks to the 19 contributors who made this release possible. Here are some highlights ✨:

- 📊 Decouple `margin` and `axis-size`. A new API to support multiple axes (#16418) @JCQuintas
- 🗺️ Added Bangla (bn-BD) locale
- 🗺️ Improve Russian (ru-RU) and Hungarian (hu-HU) locale on the Data Grid

Special thanks go out to the community members for their contributions:
@denpiligrim, @lhilgert9, @noherczeg, @officialkidmax, @pcorpet.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @flaviendelangle, @hasdfa, @Janpot, @JCQuintas, @KenanYusuf, @LukasTy, @michelengelen, @MBilalShafi, @oliviertassinari, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- The `slots.baseFormControl` component was removed.

- The "Reset" button in the column visibility panel now resets to the initial column visibility model. Previously it was reset to the model that was active at the time the panel was opened. The reset behavior follows these rules:
  1. If an initial `columnVisibilityModel` is provided, it resets to that model.
  2. If a controlled `columnVisibilityModel` is provided, it resets to the first model value.
  3. When the columns are updated (via the `columns` prop or `updateColumns()` API method), the reset reference point updates to the current `columnVisibilityModel`.

  To revert to the previous behavior, provide a custom component to the `slots.columnsManagement`.

- The deprecated `LicenseInfo` export has been removed from the `@mui/x-data-grid-pro` and `@mui/x-data-grid-premium` packages.
  You have to import it from `@mui/x-license` instead:

  ```diff
  - import { LicenseInfo } from '@mui/x-data-grid-pro';
  - import { LicenseInfo } from '@mui/x-data-grid-premium';
  + import { LicenseInfo } from '@mui/x-license';

   LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
  ```

- The row selection model has been changed from `GridRowId[]` to `{ type: 'include' | 'exclude'; ids: Set<GridRowId> }`.
  Using `Set` allows for a more efficient row selection management.
  The `exclude` selection type allows to select all rows except the ones in the `ids` set.

  This change impacts the following props:
  - `rowSelectionModel`
  - `onRowSelectionModelChange`
  - `initialState.rowSelectionModel`

  ```diff
  - const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  + const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  ```

  This change also impacts the `gridRowSelectionStateSelector` selector.
  For convenience, use the `gridRowSelectionManagerSelector` selector to handle both selection types:

  ```diff
  - const rowSelection = gridRowSelectionStateSelector(apiRef);
  - const isRowSelected = rowSelection.includes(rowId);
  + const rowSelectionManager = gridRowSelectionManagerSelector(apiRef);
  + const isRowSelected = rowSelectionManager.has(rowId);
  ```

  There is also a `createRowSelectionManager` utility function that can be used to manage the row selection:

  ```ts
  const rowSelectionManager = createRowSelectionManager({
    type: 'include',
    ids: new Set(),
  });
  rowSelectionManager.select(rowId);
  rowSelectionManager.unselect(rowId);
  rowSelectionManager.has(rowId);
  ```

- The `selectedIdsLookupSelector` selector has been removed. Use the `gridRowSelectionManagerSelector` or `gridRowSelectionStateSelector` selectors instead.
- The `selectedGridRowsSelector` has been renamed to `gridRowSelectionIdsSelector`.
- The `selectedGridRowsCountSelector` has been renamed to `gridRowSelectionCountSelector`.

- The data source feature and its related props are now stable.

  ```diff
   <DataGridPro
  -  unstable_dataSource={dataSource}
  -  unstable_dataSourceCache={cache}
  -  unstable_lazyLoading
  -  unstable_lazyLoadingRequestThrottleMs={100}
  +  dataSource={dataSource}
  +  dataSourceCache={cache}
  +  lazyLoading
  +  lazyLoadingRequestThrottleMs={100}
   />
  ```

- The data source API is now stable.

  ```diff
  - apiRef.current.unstable_dataSource.getRows()
  + apiRef.current.dataSource.getRows()
  ```

- The signature of `unstable_onDataSourceError()` has been updated to support future use-cases.

  ```diff
   <DataGrid
  -  unstable_onDataSourceError={(error: Error, params: GridGetRowsParams) => {
  -    if (params.filterModel) {
  -      // do something
  -    }
  -  }}
  +  unstable_onDataSourceError={(error: GridGetRowsError | GridUpdateRowError) => {
  +    if (error instanceof GridGetRowsError && error.params.filterModel) {
  +      // do something
  +    }
  +  }}
   />
  ```

- Fix the type of the `GridSortModel` to allow readonly arrays.

- `GridSortItem` interface is not exported anymore.

- The `showToolbar` prop is now required to display the toolbar.

  It is no longer necessary to pass `GridToolbar` as a slot to display the default toolbar.

  ```diff
   <DataGrid
  +  showToolbar
  -  slots={{
  -    toolbar: GridToolbar,
  -  }}
   />
  ```

#### `@mui/x-data-grid@8.0.0-alpha.13`

- [DataGrid] Add `showToolbar` prop to enable default toolbar (#16687) @KenanYusuf
- [DataGrid] Column Visibility: Update "Reset" button behavior (#16626) @MBilalShafi
- [DataGrid] Column management design updates (#16630) @KenanYusuf
- [DataGrid] Fix `showColumnVerticalBorder` prop (#16715) @KenanYusuf
- [DataGrid] Fix scrollbar overlapping cells on mount (#16639) @KenanYusuf
- [DataGrid] Fix: base `Select` menuprops `onClose()` (#16643) @romgrk
- [DataGrid] Make `GridSortItem` internal (#16732) @arminmeh
- [DataGrid] Make data source stable (#16710) @MBilalShafi
- [DataGrid] Reshape row selection model (#15651) @cherniavskii
- [DataGrid] Replace `sx` prop usage with `styled()` components (#16665) @KenanYusuf
- [DataGrid] Refactor: create base `Autocomplete` (#16390) @romgrk
- [DataGrid] Refactor: remove base form control (#16634) @romgrk
- [DataGrid] Refactor: remove base input label & adornment (#16646) @romgrk
- [DataGrid] Refactor: remove material containers (#16633) @romgrk
- [DataGrid] Refactor: theme to CSS variables (#16588) @romgrk
- [DataGrid] Update the signature of the `onDataSourceError()` callback (#16718) @MBilalShafi
- [DataGrid] Use readonly array for the `GridSortModel` (#16627) @pcorpet
- [DataGrid] Fix the popper focus trap (#16736) @romgrk
- [l10n] Added Bangla (bn-BD) locale (#16648) @officialkidmax
- [l10n] Improve Hungarian (hu-HU) locale (#16578) @noherczeg
- [l10n] Improve Russian (ru-RU) locale (#16591) @denpiligrim

#### `@mui/x-data-grid-pro@8.0.0-alpha.13` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.13`, plus:

- [DataGridPro] Remove `LicenseInfo` reexports (#16671) @cherniavskii

#### `@mui/x-data-grid-premium@8.0.0-alpha.13` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.13`, plus:

- [DataGridPremium] Use `valueGetter` to get row group keys (#16016) @cherniavskii

### Date and Time Pickers

#### Breaking changes

- The `<DateRangePicker />` now uses a `dialog` instead of a `tooltip` to render their view when used with a single input range field.

#### `@mui/x-date-pickers@8.0.0-alpha.13`

- [l10n] Added Bangla (bn-BD) locale (#16648) @officialkidmax
- [pickers] Clean the typing of the slots on the range pickers (#16670) @flaviendelangle
- [pickers] Fix Time Clock meridiem button selected styles (#16681) @LukasTy
- [pickers] Make the single input field the default field on range pickers (#16656) @flaviendelangle
- [pickers] Move the opening logic to the range fields (#16175) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.13` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.13`.

### Charts

#### Breaking changes

- Charts array inputs are now `readonly`. Allowing externally defined `as const` to be used as a prop value of the React component.

  ```tsx
  const xAxis = [{ position: 'bottom' }] as const
  <BarChart xAxis={xAxis} />
  ```

- Replace `topAxis`, `rightAxis`, `bottomAxis` and `leftAxis` props by the `position` property in the axis config.
  If you were using them to place axis, set the `position` property to the corresponding value `'top' | 'right' | 'bottom' | 'left'`.
  If you were disabling an axis by setting it to `null`, set its `position` to `'none'`.

  ```diff
   <LineChart
     yAxis={[
       {
         scaleType: 'linear',
  +      position: 'right',
       },
     ]}
     series={[{ data: [1, 10, 30, 50, 70, 90, 100], label: 'linear' }]}
     height={400}
  -  rightAxis={{}}
   />
  ```

- Remove `position` prop from `ChartsXAxis` and `ChartsYAxis`.
  The `position` prop has been removed from the `ChartsXAxis` and `ChartsYAxis` components. Configure it directly in the axis config.

  ```diff
   <ChartContainer
     yAxis={[
       {
         id: 'my-axis',
  +      position: 'right',
       },
     ]}
   >
  -  <ChartsYAxis axisId="my-axis" position="right" />
  +  <ChartsYAxis axisId="my-axis" />
   </ChartContainer>
  ```

- Add `minTickLabelGap` to x-axis, which allows users to define the minimum gap, in pixels, between two tick labels. The default value is 4px. Make sure to check your charts as the spacing between tick labels might have changed.

#### `@mui/x-charts@8.0.0-alpha.13`

- [charts] Accept component in `labelMarkType` (#16739) @bernardobelchior
- [charts] Add `minTickLabelGap` to x-axis (#16548) @bernardobelchior
- [charts] Add unit test for pie chart with empty series (#16663) @bernardobelchior
- [charts] Decouple `margin` and `axis-size` (#16418) @JCQuintas
- [charts] Display slider tooltip on demos (#16723) @JCQuintas
- [charts] Fix composition docs link (#16761) @bernardobelchior
- [charts] Fix default label measurement being off (#16635) @bernardobelchior
- [charts] Fix is highlighted memoization (#16592) @alexfauquette
- [charts] Fix missing `theme.shape` error in the tooltip (#16748) @alexfauquette
- [charts] Fix typo in error message (#16641) @JCQuintas
- [charts] Improve axis size docs (#16673) @JCQuintas
- [charts] Improve performance of rendering ticks in x-axis (#16536) @bernardobelchior
- [charts] Make `defaultizeAxis` function type-safe (#16642) @JCQuintas
- [charts] Make `series.data` readonly (#16645) @JCQuintas
- [charts] Migrate `ChartsUsageDemo` to TSX and removed NoSnap (#16686) @JCQuintas
- [charts] Prevent `position='none'` axes from rendering (#16727) @JCQuintas
- [charts] Make array inputs readonly (#16632) @JCQuintas
- [charts] Remove state initialization hack (#16520) @alexfauquette
- [charts] Remove redundant default axis (#16734) @bernardobelchior

#### `@mui/x-charts-pro@8.0.0-alpha.13` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.13`, plus:

- [charts-pro] Add back zoom control (#16550) @alexfauquette

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.13`

Internal changes.

#### `@mui/x-tree-view-pro@8.0.0-alpha.13` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.13`.

### `@mui/x-codemod@8.0.0-alpha.13`

- [codemod] Add a few Data Grid codemods (#16711) @MBilalShafi
- [codemod] Improve Pickers renaming codemod (#16685) @LukasTy

### Docs

- [docs] Fix charts with on bar and line pages (#16712) @alexfauquette
- [docs] Fix migration guide introduction for charts (#16679) @alexfauquette
- [docs] Fix remaining charts demos on mobile (#16728) @alexfauquette
- [docs] Fix scroll overflow on mobile (#16675) @oliviertassinari
- [docs] Improve Pickers migration page (#16682) @LukasTy
- [docs] Update small Pickers doc inconsistencies (#16724) @LukasTy
- [code-infra] Charts changes for `vitest` (#16755) @JCQuintas
- [code-infra] General packages changes for `vitest` (#16757) @JCQuintas
- [code-infra] Native Node.js ESM (#16603) @Janpot
- [infra] Update contributor acknowledgment wording (#16751) @michelengelen
- [test] Revert timeout increase for possibly slow tests (#16651) @LukasTy
- [x-license] Introduce usage telemetry (#13530) @hasdfa

## 8.0.0-alpha.12

_Feb 17, 2025_

We'd like to offer a big thanks to the 16 contributors who made this release possible. Here are some highlights ✨:

- 📦 Data Grid [data source](https://mui.com/x/react-data-grid/server-side-data/) is now available in the Community plan
- ⚡ Improve Data Grid Excel export serialization performance
- 🚫 Add ["No columns" overlay](https://mui.com/x/react-data-grid/overlays/#no-columns-overlay) to Data Grid
- 🌍 Improve Polish (pl-PL) and Ukrainian (uk-UA) locales on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@Neonin, @nusr, and @pawelkula.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @Janpot, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @michelengelen, @oliviertassinari, @romgrk, and @mapache-salvaje.

### Data Grid

#### Breaking changes

- The `main--hasSkeletonLoadingOverlay` class has been renamed to `main--hiddenContent` and is now also applied when the "No columns" overlay is displayed.

- The `apiRef.current.forceUpdate()` method was removed. Use selectors combined with `useGridSelector()` hook to react to changes in the state.

- The selectors signature has been updated. They are only accepting `apiRef` as a first argument and `instanceId` is no longer the third argument.

  ```diff
  -mySelector(state, arguments, instanceId)
  +mySelector(apiRef, arguments)
  ```

#### `@mui/x-data-grid@8.0.0-alpha.12`

- [DataGrid] Add "No columns" overlay (#16543) @KenanYusuf
- [DataGrid] All selectors accept only `apiRef` as first argument (#16198) @arminmeh
- [DataGrid] Avoid `undefined` value for pagination `rowCount` (#16488) @cherniavskii
- [DataGrid] Create the base Checkbox slot (#16445) @romgrk
- [DataGrid] Create the base Input slot (#16443) @romgrk
- [DataGrid] Create the base MenuList slot (#16481) @romgrk
- [DataGrid] Create the base Popper slot (#16362) @romgrk
- [DataGrid] Create the base Select slot (#16394) @romgrk
- [DataGrid] Create the base Switch slot (#16527) @romgrk
- [DataGrid] Extract `getRowId()` API method as a selector (#16487) @MBilalShafi
- [DataGrid] Fix the `onClock` prop of the base Select slot (#16557) @romgrk
- [DataGrid] Go to the first page when sorting/filtering is applied (#16447) @arminmeh
- [DataGrid] Make base data source available in the Community plan (#16359) @MBilalShafi
- [DataGrid] Remove `apiRef.current.forceUpdate()` method (#16560) @MBilalShafi
- [DataGrid] Fix the unexpected behavior of the pagination when using `-1` for "All" rows per page (#16485) @nusr
- [l10n] Improve Polish (pl-PL) locale (#16123) @pawelkula
- [l10n] Improve Ukrainian (uk-UA) locale (#16463) @Neonin

#### `@mui/x-data-grid-pro@8.0.0-alpha.12` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.12`.

#### `@mui/x-data-grid-premium@8.0.0-alpha.12` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.12`, plus:

- [DataGridPremium] Fix Excel export Web Worker demo not working in dev mode (#16517) @cherniavskii
- [DataGridPremium] Fix loading issue + add skeleton overlay (#16282) @MBilalShafi
- [DataGridPremium] Improve Excel export serialization performance (#16526) @cherniavskii
- [DataGridPremium] Namespace Excel export worker (#16020) @oliviertassinari

### Date and Time Pickers

#### Breaking changes

- The `aria-label` on the `<Clock />` component and Time Picker opening button has been fixed to rely on the set `ampm` property instead of defaulting to the user's locale.

- The following unused formats have been removed from the adapters and can no longer be overridden via the `dateFormats` prop on the `<LocalizationProvider />` component:
  - `fullTime` - please use `fullTime12h` and `fullTime24h` instead:
    ```diff
      <LocalizationProvider
        dateFormats={{
    -     fullTime: 'LT',
    +     fullTime12h: 'hh:mm A',
    +     fullTime24h: 'hh:mm',
        }}
      >
    ```
  - `keyboardDateTime` - please use `keyboardDateTime12h` and `keyboardDateTime24h` instead:
    ```diff
      <LocalizationProvider
        dateFormats={{
    -     keyboardDateTime: 'DD.MM.YYYY | LT',
    +     keyboardDateTime12h: 'DD.MM.YYYY | hh:mm A',
    +     keyboardDateTime24h: 'DD.MM.YYYY | hh:mm',
        }}
      >
    ```

#### `@mui/x-date-pickers@8.0.0-alpha.12`

- [pickers] Fix time related aria labels to depend on `ampm` flag value (#16572) @LukasTy
- [pickers] Remove unused adapter formats (#16522) @LukasTy

#### `@mui/x-date-pickers-pro@8.0.0-alpha.12` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.12`, plus:

- [DateRangePicker] Avoid unnecessary field section focusing (#16474) @LukasTy

### Charts

#### Breaking changes

- The `useSeries` hook family has been stabilized and renamed accordingly — [Learn more](https://mui.com/x/migration/migration-charts-v7/#stabilize-useseries-and-usexxxseries-hooks-✅)

#### `@mui/x-charts@8.0.0-alpha.12`

- [charts] Add docs for scatter "Size" section (#16556) @bernardobelchior
- [charts] Add `test:performance:browser` script #16600 @bernardobelchior
- [charts] Add warning when using unknown ids in `useXxxSeries` hooks (#16552) @JCQuintas
- [charts] Divide the logic for `useXxxSeries` into `useXxxSeriesContext` (#16546) @JCQuintas
- [charts] Document plugins for internal use (#16504) @JCQuintas
- [charts] Fix internal typo (#16524) @alexfauquette
- [charts] Fix type overloads (#16581) @JCQuintas
- [charts] Fix zoom filter regression (#16507) @alexfauquette
- [charts] Improve tooltip placement in mobile (#16553) @bernardobelchior
- [charts] Let the `useXxxSeries` support array of ids and document them (#15545) @JCQuintas
- [charts] Memoize some tooltip internals (#16564) @alexfauquette
- [charts] Move Voronoi handler in a dedicated plugin (#16470) @alexfauquette
- [charts] Performance tests: set license on setup. Update vitest minor version. (#16525) @bernardobelchior
- [charts] Propagate the axis scale to the `valueFormatter` (#16555) @alexfauquette
- [charts] Remove `colors` prop from `SparkLineChart`. (#16494) @bernardobelchior
- [charts] Stabilize series hooks (`useSeries`, `usePieSeries`, etc.) (#16459) @bernardobelchior

#### `@mui/x-charts-pro@8.0.0-alpha.12` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.12`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.12`

Internal changes.

#### `@mui/x-tree-view-pro@8.0.0-alpha.12` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.12`.

### Docs

- [docs] Add demo for Scatter Chart with linked points (#16505) @bernardobelchior
- [docs] Improve license installation page (#16403) @michelengelen
- [docs] Standardize getting started docs across all packages (#16302) @mapache-salvaje

### Core

- [core] Update charts folder structure (#16471) @alexfauquette
- [code-infra] Bump @mui/monorepo (#16422) @LukasTy
- [code-infra] Fix lock file (#16562) @LukasTy
- [code-infra] Fix root package version (#16503) @JCQuintas
- [code-infra] Update internal packages to `next` releases (#16423) @LukasTy
- [code-infra] Update package layout for better ESM support (#14386) @Janpot
- [code-infra] Update peer dependencies for v8 (#16563) @Janpot

## 8.0.0-alpha.11

_Feb 7, 2025_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- ⚡ Mount and resize performance improvements for the Data Grid

Special thanks go out to the community contributors who have helped make this release possible:
@lauri865.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @flaviendelangle, @Janpot, @KenanYusuf, @LukasTy, @MBilalShafi, @noraleonte, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- `createUseGridApiEventHandler()` is not exported anymore.
- The `filteredRowsLookup` object of the filter state does not contain `true` values anymore. If the row is filtered out, the value is `false`. Otherwise, the row id is not present in the object.
  This change only impacts you if you relied on `filteredRowsLookup` to get ids of filtered rows. In this case,use `gridDataRowIdsSelector` selector to get row ids and check `filteredRowsLookup` for `false` values:

  ```diff
   const filteredRowsLookup = gridFilteredRowsLookupSelector(apiRef);
  -const filteredRowIds = Object.keys(filteredRowsLookup).filter((rowId) => filteredRowsLookup[rowId] === true);
  +const rowIds = gridDataRowIdsSelector(apiRef);
  +const filteredRowIds = rowIds.filter((rowId) => filteredRowsLookup[rowId] !== false);
  ```

- The `visibleRowsLookup` state does not contain `true` values anymore. If the row is not visible, the value is `false`. Otherwise, the row id is not present in the object:

  ```diff
   const visibleRowsLookup = gridVisibleRowsLookupSelector(apiRef);
  -const isRowVisible = visibleRowsLookup[rowId] === true;
  +const isRowVisible = visibleRowsLookup[rowId] !== false;
  ```

#### `@mui/x-data-grid@8.0.0-alpha.11`

- [DataGrid] Avoid `<GridRoot />` double-render pass on mount in SPA mode (#15648) @lauri865
- [DataGrid] Fix loading overlay not in sync with scroll (#16437) @MBilalShafi
- [DataGrid] Refactor: remove material `MenuList` import (#16444) @romgrk
- [DataGrid] Refactor: simplify `useGridApiEventHandler()` (#16479) @romgrk

#### `@mui/x-data-grid-pro@8.0.0-alpha.11` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.11`, plus:

- [DataGridPro] Fix the return type of `useGridApiContext()` for Pro and Premium packages on React < 19 (#16441) @arminmeh

#### `@mui/x-data-grid-premium@8.0.0-alpha.11` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.11`, plus:

- [DataGridPremium] Fix "no rows" overlay not showing with active aggregation (#16466) @KenanYusuf

### Date and Time Pickers

#### `@mui/x-date-pickers@8.0.0-alpha.11`

Internal changes.

#### `@mui/x-date-pickers-pro@8.0.0-alpha.11` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.11`, plus:

- [DateRangeCalendar] Support arrow navigation with multiple months rendered (#16363) @flaviendelangle
- [DateRangePicker] Fix `currentMonthCalendarPosition` prop behavior on mobile (#16455) @LukasTy
- [DateRangePicker] Fix vertical alignment for multi input fields (#16489) @noraleonte

### Charts

#### `@mui/x-charts@8.0.0-alpha.11`

- [charts] Add `color` prop to `Sparkline` and deprecate `colors` (#16477) @bernardobelchior
- [charts] Make typescript more flexible about plugins and their params (#16478) @alexfauquette
- [charts] Remove component for axis event listener (#16314) @alexfauquette

#### `@mui/x-charts-pro@8.0.0-alpha.11` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.11`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.11`

Internal changes.

#### `@mui/x-tree-view-pro@8.0.0-alpha.11` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.11`.

### Docs

- [docs] Update charts colors default value (#16484) @bernardobelchior

### Core

- [core] Fix corepack and pnpm installation in CircleCI (#16434) @flaviendelangle
- [code-infra] Update monorepo (#16112) @Janpot
- [test] Avoid test warning when running on React 18 (#16486) @LukasTy
- [test] Disable `react-transition-group` transitions in unit testing (#16288) @lauri865

## 8.0.0-alpha.10

_Jan 30, 2025_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🎨 Data Grid theming improvements and default background color
- 📚 Documentation improvements
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@k-rajat19, @lauri865, @mateuseap.
Following are all team members who have contributed to this release:
@alexfauquette, @flaviendelangle, @JCQuintas, @KenanYusuf, @MBilalShafi, @romgrk, @arminmeh.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

### Breaking changes

- `viewportInnerSize.width` now includes pinned columns' widths (fixes recursive loops in updating dimensions <-> columns)
- The Data Grid now has a default background color, and its customization has moved from `theme.mixins.MuiDataGrid` to `theme.palette.DataGrid` with the following properties:
  - `bg`: Sets the background color of the entire grid (new property)
  - `headerBg`: Sets the background color of the header (previously named `containerBackground`)
  - `pinnedBg`: Sets the background color of pinned rows and columns (previously named `pinnedBackground`)

  ```diff
   const theme = createTheme({
  -  mixins: {
  -    MuiDataGrid: {
  -      containerBackground: '#f8fafc',
  -      pinnedBackground: '#f1f5f9',
  -    },
  -  },
  +  palette: {
  +    DataGrid: {
  +      bg: '#f8fafc',
  +      headerBg: '#e2e8f0',
  +      pinnedBg: '#f1f5f9',
  +    },
  +  },
   });
  ```

- The `detailPanels`, `pinnedColumns`, and `pinnedRowsRenderZone` classes have been removed.
- Return type of the `useGridApiRef()` hook and the type of `apiRef` prop are updated to explicitly include the possibilty of `null`. In addition to this, `useGridApiRef()` returns a reference that is initialized with `null` instead of `{}`.

  Only the initial value and the type are updated. Logic that initializes the API and its availability remained the same, which means that if you could access API in a particular line of your code before, you are able to access it as well after this change.

  Depending on the context in which the API is being used, you can decide what is the best way to deal with `null` value. Some options are:
  - Use optional chaining
  - Use non-null assertion operator if you are sure your code is always executed when the `apiRef` is not `null`
  - Return early if `apiRef` is `null`
  - Throw an error if `apiRef` is `null`

#### `@mui/x-data-grid@8.0.0-alpha.10`

- [DataGrid] Fix `renderContext` calculation with scroll bounce / over-scroll (#16297) @lauri865
- [DataGrid] Remove unused classes from `gridClasses` (#16256) @mateuseap
- [DataGrid] Add default background color to grid (#16066) @KenanYusuf
- [DataGrid] Add missing style overrides (#16272) @KenanYusuf
- [DataGrid] Add possibility of `null` in the return type of the `useGridApiRef()` hook (#16353) @arminmeh
- [DataGrid] Fix header filters keyboard navigation when there are no rows (#16126) @k-rajat19
- [DataGrid] Fix order of `onClick` prop on toolbar buttons (#16356) @KenanYusuf
- [DataGrid] Refactor row state propagation (#15627) @lauri865
- [DataGrid] Refactor: create TextField props (#16174) @romgrk
- [DataGrid] Remove outdated warning (#16360) @MBilalShafi
- [DataGrid] Respect width of `iconContainer` during autosizing (#16399) @michelengelen

#### `@mui/x-data-grid-pro@8.0.0-alpha.10` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.10`, plus:

- [DataGridPro] Fetch new rows only once when multiple models are changed in one cycle (#16101) @arminmeh
- [DataGridPro] Fix the return type of `useGridApiRef` for Pro and Premium packages on React < 19 (#16328) @arminmeh

#### `@mui/x-data-grid-premium@8.0.0-alpha.10` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.10`.

### Date and Time Pickers

#### Breaking changes

- The component passed to the `field` slot no longer receives the `ref`, `disabled`, `className`, `sx`, `label`, `name`, `formatDensity`, `enableAccessibleFieldDOMStructure`, `selectedSections`, `onSelectedSectionsChange` and `inputRef` props — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slot-field)
- The `MuiPickersPopper` theme entry have been renamed `MuiPickerPopper` and some of its props have been removed — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#muipickerspopper)

#### `@mui/x-date-pickers@8.0.0-alpha.10`

- [pickers] Clean the internals and the public API of `<PickersPopper />` (#16319) @flaviendelangle
- [pickers] Improve the JSDoc of the `PickerContextValue` properties (#16327) @flaviendelangle
- [pickers] Move more field props to the context (#16278) @flaviendelangle
- [pickers] Do not close the picker when doing keyboard editing (#16402) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.10` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.10`.

### Charts

#### Breaking changes

- Replace `legend.position.horizontal` from `"left" | "middle" | "right"` to `"start" | "center" | "end"`.
  This is to align with the CSS values and reflect the RTL ability of the legend component.
- The default colors have changed. To keep using the old palette. It is possible to import `blueberryTwilightPalette` from `@mui/x-charts/colorPalettes` and set it on the `colors` property of charts.
- The `id` property is now optional on the `Pie` and `Scatter` data types.

#### `@mui/x-charts@8.0.0-alpha.10`

- [charts] Add new `bumpX` and `bumpY` curve options (#16318) @JCQuintas
- [charts] Move `tooltipGetter` to `seriesConfig` (#16331) @JCQuintas
- [charts] Move item highligh feature to plugin system (#16211) @alexfauquette
- [charts] Replace `legend.position.horizontal` from `"left" | "middle" | "right"` to `"start" | "center" | "end"` (#16315) @JCQuintas
- [charts] New default colors (#16373) @JCQuintas
- [charts] Make `id` optional on `PieValueType` and `ScatterValueType` (#16389) @JCQuintas

#### `@mui/x-charts-pro@8.0.0-alpha.10` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.10`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.10`

Internal changes.

#### `@mui/x-tree-view-pro@8.0.0-alpha.10` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.10`.

### Docs

- [docs] Improve release documentation (#16321) @MBilalShafi

### Core

- [core] Reduce chart perf benchmark weight (#16374) @alexfauquette
- [test] Fix console warnings while executing tests with React 18 (#16386) @arminmeh
- [test] Fix flaky data source tests in DataGrid (#16395) @lauri865

## 8.0.0-alpha.9

_Jan 24, 2025_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Persian (fa-IR) and Urdu (ur-PK) locales on the Data Grid
- 📚 Documentation improvements
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@AxharKhan, @lauri865, @mapache-salvaje, @mostafaRoosta74.

Following are all team members who have contributed to this release:
@alexfauquette, @cherniavskii, @Janpot, @JCQuintas, @LukasTy, @arminmeh.

### Data Grid

#### `@mui/x-data-grid@v8.0.0-alpha.9`

- [DataGrid] Fix toggling preference panel from toolbar (#16274) @lauri865
- [DataGrid] Only try to mount filter button if there are filters present (#16267) @lauri865
- [DataGrid] Revert `apiRef` to be `MutableRefObject` for React versions < 19 (#16279) @arminmeh
- [l10n] Improve Persian (fa-IR) locale (#16312) @mostafaRoosta74
- [l10n] Improve Urdu (ur-PK) locale (#16295) @AxharKhan

#### `@mui/x-data-grid-pro@v8.0.0-alpha.9` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@v8.0.0-alpha.9`.

#### `@mui/x-data-grid-premium@v8.0.0-alpha.9` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@v8.0.0-alpha.9`.

### Date and Time Pickers

#### `@mui/x-date-pickers@v8.0.0-alpha.9`

- [fields] Reset `all` selected state on section edit (#16223) @LukasTy

#### `@mui/x-date-pickers-pro@v8.0.0-alpha.9` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@v8.0.0-alpha.9`.

### Charts

#### Breaking Changes

The `experimentalMarkRendering` prop has been removed from the `LineChart` component.
The line mark are now `<circle />` element by default.
And you can chose another shape by adding a `shape` property to your line series.

The codemod only removes the `experimentalMarkRendering` prop.
If you relied on the fact that marks were `path` elements, you need to update your logic.

#### `@mui/x-charts@v8.0.0-alpha.9`

- [charts] Expand line with step interpolation (#16229) @alexfauquette
- [charts] Fix hydration mismatch (#16261) @alexfauquette
- [charts] Fix zoom option reactivity (#16262) @alexfauquette
- [charts] Move legend getter to series config (#16307) @alexfauquette
- [charts] Use `<circle />` instead of `<path />` for line marks by default (#15220) @alexfauquette

#### `@mui/x-charts-pro@v8.0.0-alpha.9` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@v8.0.0-alpha.9`, plus:

- [charts-pro] Fix `pro` components watermark (#16222) @JCQuintas

### Tree View

#### `@mui/x-tree-view@v8.0.0-alpha.9`

Internal changes.

#### `@mui/x-tree-view-pro@v8.0.0-alpha.9` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@v8.0.0-alpha.9`.

### Docs

- [docs] Fix `domainLimit` definition (#16270) @alexfauquette
- [docs] Fix tiny line chart breaking change (#16268) @alexfauquette
- [docs] Revise planned feature callouts and descriptions (#16290) @mapache-salvaje
- [docs] Copyedit the Aggregation doc (#16200) @mapache-salvaje
- [docs] Revise the Data Grid getting started docs (#15757) @mapache-salvaje
- [code-infra] Add 'use client' directive (#16273) @Janpot
- [code-infra] Allow dispatch of manual cherry-pick workflow (#16299) @JCQuintas
- [code-infra] Update changelog script (#16218) @cherniavskii
- [test] Fix flaky column pinning tests (#16219) @cherniavskii
- [test] Fix flaky tests (#16257) @lauri865

## 8.0.0-alpha.8

_Jan 16, 2025_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🍬 Improved design for Data Grid [Header filters](https://mui.com/x/react-data-grid/filtering/header-filters/)

  <img width="100%" alt="Data Grid Header filters" src="https://github.com/user-attachments/assets/74a50cd9-7a55-41fc-a2b8-f8a0d5b9120e" />

- 🔄 Data Grid [Scroll restoration](https://mui.com/x/react-data-grid/scrolling/#scroll-restoration)
- 📊 Charts support server-side rendering under [some conditions](https://mui.com/x/react-charts/getting-started/#server-side-rendering)
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@lauri865.
Following are all team members who have contributed to this release:
@arminmeh, @romgrk, @samuelsycamore, @alexfauquette, @cherniavskii, @flaviendelangle, @JCQuintas, @KenanYusuf, @LukasTy, @michelengelen.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- The clear button in header filter cells has been moved to the header filter menu. Use `slotProps={{ headerFilterCell: { showClearIcon: true } }}` to restore the clear button in the cell.

#### `@mui/x-data-grid@8.0.0-alpha.8`

- [DataGrid] Improve scrollbar deadzone with overlay scrollbars (#15961) @lauri865
- [DataGrid] Header filter design improvements (#15991) @KenanYusuf
- [DataGrid] Scroll restoration (#15623) @lauri865
- [DataGrid] Fix row, cell and header memoizations (#15666) @lauri865

#### `@mui/x-data-grid-pro@8.0.0-alpha.8` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.8`, plus:

- [DataGridPro] Add test for column pinning with disabled column virtualization (#16176) @cherniavskii
- [DataGridPro] Fix width of right-pinned column group during resize (#16199) @cherniavskii

#### `@mui/x-data-grid-premium@8.0.0-alpha.8` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.8`.

### Date and Time Pickers

#### Breaking changes

- The field is now editable if rendered inside a mobile Picker — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#field-editing-on-mobile-pickers)
- The `useMultiInputDateRangeField`, `useMultiInputTimeRangeField`, and `useMultiInputDateTimeRangeField` hooks have been removed in favor of the new `useMultiInputRangeField` hook — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#usemultiinputdaterangefield)
- The component passed to the `field` slot no longer receives the `value`, `onChange`, `timezone`, `format`, `disabled`, `formatDensity`, `enableAccessibleFieldDOMStructure`, `selectedSections` and `onSelectedSectionsChange` props — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slot-field)

#### `@mui/x-date-pickers@8.0.0-alpha.8`

- [pickers] Let the field components handle their opening UI, and allow field editing on mobile pickers (#15671) @flaviendelangle
- [pickers] Remove code duplication for the multi input range fields (#15505) @flaviendelangle
- [pickers] Rename `onRangePositionChange` into `setRangePosition` in `usePickerRangePositionContext` (#16189) @flaviendelangle
- [pickers] Use context to pass props from the picker to the field (#16042) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.8` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.8`.

### Charts

#### Breaking changes

- Charts tooltip markers now have different styles for each chart type. The tooltip and legend marks are now the same.
- Duplicate axis id's across `x` and `y` axis now log a warning in dev mode. Axis ids should be unique to prevent internal issues.

#### `@mui/x-charts@8.0.0-alpha.8`

- [charts] Fix flaky charts tests (#16180) @JCQuintas
- [charts] Handle case where gradient stop `offset` could be `Infinite` (#16131) @JCQuintas
- [charts] Make `useChartGradientId` public (#16106) @JCQuintas
- [charts] Move z-axis to plugin (#16130) @alexfauquette
- [charts] Plot data at first render if `skipAnimation` is set to `true` (#16166) @alexfauquette
- [charts] Replace tooltip mark with style (#16117) @JCQuintas
- [charts] Support `rtl` for gradient legend (#16115) @JCQuintas
- [charts] Use plugin system for series and axes (#15865) @alexfauquette

#### `@mui/x-charts-pro@8.0.0-alpha.8` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.8`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.8`

No changes since `@mui/x-tree-view-pro@v8.0.0-alpha.7`.

#### `@mui/x-tree-view-pro@8.0.0-alpha.8` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.8`.

### Docs

- [docs] Add example for custom legend (#16169) @alexfauquette
- [docs] Add full custom field creation example (#15194) @flaviendelangle
- [docs] Copyedit the Data Grid cell selection page (#16099) @samuelsycamore
- [docs] Fix demo rendering issue on CodeSandbox (#16118) @arminmeh
- [docs] Remove broken links (#16167) @alexfauquette
- [docs] Split the Data Grid editing page (#14931) @MBilalShafi
- [docs] Fix wrong props warnings (#16119) @JCQuintas

### Core

- [core] Type all references as `RefObject` (#16124) @arminmeh
- [code-infra] Refactor `react` and `react-dom` definitions to simplify dep resolving (#16160) @LukasTy
- [code-infra] Stop renovate from updating `date-fns-v2` (#16158) @LukasTy
- [infra] Improve cherry-pick action target list (#16184) @michelengelen
- [test] Fix flaky column pinning unit test (#16202) @cherniavskii
- [test] Fix flaky screenshot (#16182) @cherniavskii

## 8.0.0-alpha.7

_Jan 9, 2025_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 📊 Charts legend is now an HTML element which can be styled more easily
- 💫 Support [aggregation with server-side data](/x/react-data-grid/server-side-data/aggregation/)
- 🏎️ Improve Data Grid aggregation performance
- 🌍 Add Chinese (Taiwan) (zh-TW) locale on the Date and Time Pickers
- 🌍 Improve Norwegian (nb-NO) locale on the Date and Time Pickers
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@derek-0000, @josteinjhauge, @k-rajat19, @nusr, @tomashauser.
Following are all team members who have contributed to this release:
@cherniavskii, @flaviendelangle, @JCQuintas, @LukasTy, @MBilalShafi, @arminmeh, @romgrk, @oliviertassinari.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.0.0-alpha.7`

- [DataGrid] Improve React 19 support (#15769) @LukasTy
- [DataGrid] Add `name` attribute to the checkbox selection column (#15178) @derek-0000
- [DataGrid] Fix number filter field formatting values while typing (#16062) @arminmeh
- [DataGrid] Fix select all checkbox state reset with server side data (#16034) @MBilalShafi
- [DataGrid] Refactor: create base button props (#15930) @romgrk
- [DataGrid] Refactor: create tooltip props (#16086) @romgrk
- [DataGrid] Fix TS error (#16046) @cherniavskii

#### `@mui/x-data-grid-pro@8.0.0-alpha.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.7`.

#### `@mui/x-data-grid-premium@8.0.0-alpha.7` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.7`, plus:

- [DataGridPremium] Improve aggregation performance for multiple columns (#16097) @cherniavskii
- [DataGridPremium] Make Aggregation keyboard accessible in the column menu (#15934) @k-rajat19
- [DataGridPremium] Server-side aggregation with data source (#15741) @MBilalShafi

### Date and Time Pickers

#### Breaking changes

- The `date-fns` and `date-fns-jalali` date library adapters have been renamed to better align with the current stable major versions — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#✅-rename-date-fns-adapter-imports)
- Update default `closeOnSelect` and Action Bar `actions` values - [Learn more](https://mui.com/x/migration/migration-pickers-v7/#update-default-closeonselect-and-action-bar-actions-values)
- The component passed to the `layout` slot no longer receives the `value`, `onChange` and `onSelectShortcut` props — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slot-layout).
- The component passed to the `toolbar` slot no longer receives the `value`, `onChange` and `isLandscape` props — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slot-toolbar).
- The component passed to the `shortcuts` slot no longer receives the `onChange`, `isValid` and `isLandscape` props — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slot-shortcuts).
- The `PickerShortcutChangeImportance` type has been renamed `PickerChangeImportance` — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#renamed-variables-and-types).
- The component passed to the `layout` slot no longer receives the `rangePosition` and `onRangePositionChange` on range pickers — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slot-layout).
- The component passed to the `toolbar` slot no longer receives the `rangePosition` and `onRangePositionChange` on range pickers — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slot-toolbar).
- The component passed to the `tabs` slot no longer receives the `rangePosition` and `onRangePositionChange` on range pickers — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slot-tabs).

#### `@mui/x-date-pickers@8.0.0-alpha.7`

- [fields] Handle focusing container with `inputRef.current.focus` on `accessibleFieldDOMStructure` (#15985) @LukasTy
- [pickers] Always use `setValue` internally to update the picker value (#16056) @flaviendelangle
- [pickers] Create a new context to pass the range position props to the layout components and to the views (#15846) @flaviendelangle
- [pickers] Introduce a new concept of `manager` (#15339) @flaviendelangle
- [pickers] Improve React 19 support (#15769) @LukasTy
- [pickers] Memoize `<PickersActionBar />` (#16071) @LukasTy
- [pickers] Remove `NonEmptyDateRange` type (#16035) @flaviendelangle
- [pickers] Rename `AdapterDateFns` into `AdapterDateFnsV2` and `AdapterDateFnsV3` into `AdapterDateFns` (#16082) @LukasTy
- [pickers] Rename `ctx.onViewChange` to `ctx.setView` and add it to the actions context (#16044) @flaviendelangle
- [pickers] Support `date-fns-jalali` v4 (#16011) @LukasTy
- [pickers] Update `closeOnSelect` and `actionBar.actions` default values (#15944) @LukasTy
- [pickers] Use `usePickerContext()` and `usePickerActionsContext()` instead of passing props to the `shortcuts` and `toolbar` slots (#15948) @flaviendelangle
- [l10n] Add Chinese (Taiwan) (zh-TW) locale (#16033) @nusr
- [l10n] Improve Norwegian (nb-NO) locale (#16089) @josteinjhauge

#### `@mui/x-date-pickers-pro@8.0.0-alpha.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.7`.

### Charts

#### Breaking changes

- Removed `DefaultChartsLegend` component, since it is now easier to create custom legends — [Learn more](https://mui.com/x/react-charts/components/#html-components).
- The default legend is now an HTML element and can be styled more easily.
- The `width` and `height` properties of the charts now only apply to the `svg` element, and not their wrappers, this might cause some layout shifts.
- `slotProps.legend.direction` now accepts `'horizontal' | 'vertical'` instead of `'row' | 'column'` — [Learn more](https://mui.com/x/migration/migration-charts-v7/#legend-direction-value-change-✅).
- The `getSeriesToDisplay` function was removed in favor of the `useLegend` hook. — [Learn more](https://mui.com/x/migration/migration-charts-v7/#the-getseriestodisplay-function-was-removed).

#### `@mui/x-charts@8.0.0-alpha.7`

- [charts] New HTML legend & styles (#15733) @JCQuintas
- [charts] Improve React 19 support (#15769) @LukasTy
- [charts] Fix 301 redirection in the API documentation @oliviertassinari

#### `@mui/x-charts-pro@8.0.0-alpha.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.7`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.7`

- [TreeView] Improve React 19 support (#15769) @LukasTy

#### `@mui/x-tree-view-pro@8.0.0-alpha.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.7`.

### Docs

- [docs] Fix `EditingWithDatePickers` demo (#15967) @k-rajat19
- [docs] Fix inconsistent multi input range field separators (#16043) @flaviendelangle
- [docs] Fix non-existing "adapter" property of `LocalizationProvider` (#16084) @tomashauser
- [docs] Refactor Data Grid with Date Pickers example (#15992) @LukasTy
- [docs] Unify the wording of the pickers slots breaking changes (#16036) @flaviendelangle

### Core

- [core] Clarify the release strategy (#16014) @MBilalShafi
- [core] Small fixes on docs @oliviertassinari
- [core] Sync with other repos @oliviertassinari
- [core] Update the `release:version` docs (#16038) @cherniavskii
- [code-infra] Add `testSkipIf` and `describeSkipIf` (#16049) @JCQuintas
- [test] Stabilize flaky Data Grid tests (#16053) @LukasTy

## 8.0.0-alpha.6

_Dec 26, 2024_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🏎️ Improve Data Grid scrolling performance
- 🌍 Improve Dutch (nl-NL) locale on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@JoepVerkoelen, @k-rajat19, @lauri865.
Following are all team members who have contributed to this release:
@flaviendelangle, @JCQuintas, @LukasTy, @MBilalShafi, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- The `sanitizeFilterItemValue()` utility is not exported anymore.

#### `@mui/x-data-grid@8.0.0-alpha.6`

- [DataGrid] Avoid subscribing to `renderContext` state in grid root for better scroll performance (#15986) @lauri865
- [DataGrid] Fix header filters showing clear button while empty (#15829) @k-rajat19
- [DataGrid] Improve test coverage of server side data source (#15942) @MBilalShafi
- [DataGrid] Move progress components to leaf import (#15914) @romgrk
- [DataGrid] Move skeleton to leaf import (#15931) @romgrk
- [DataGrid] Replace `forwardRef` with a shim for forward compatibility (#15955) @lauri865
- [l10n] Improve Dutch (nl-NL) locale (#15994) @JoepVerkoelen

#### `@mui/x-data-grid-pro@8.0.0-alpha.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.6`.

#### `@mui/x-data-grid-premium@8.0.0-alpha.6` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.6`, plus:

- [DataGridPremium] Fix column unpinning with row grouping (#15908) @k-rajat19

### Date and Time Pickers

#### `@mui/x-date-pickers@8.0.0-alpha.6`

- [pickers] Use `usePickerContext()` and `usePickerActionsContext()` to get the actions in the `actionBar` slot and in internal components (#15843) @flaviendelangle
- [pickers] Use `usePickerContext()` to get the view-related props in the layout, toolbar and tabs slots (#15606) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.6`.

### Charts

#### `@mui/x-charts@8.0.0-alpha.6`

No changes since `@mui/x-charts@v8.0.0-alpha.5`.

#### `@mui/x-charts-pro@8.0.0-alpha.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.6`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.6`

No changes since `@mui/x-tree-view-pro@v8.0.0-alpha.5`.

#### `@mui/x-tree-view-pro@8.0.0-alpha.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.6`.

### Docs

- [docs] Remove production profiler from docs build (#15959) @lauri865
- [code-infra] Add new `next-env.d.ts` changes (#15947) @JCQuintas

## 8.0.0-alpha.5

_Dec 19, 2024_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Korean (ko-KR) locale on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@good-jinu, @k-rajat19.
Following are all team members who have contributed to this release:
@alexfauquette, @cherniavskii, @flaviendelangle, @KenanYusuf, @LukasTy, @MBilalShafi, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- Passing additional props (like `data-*`, `aria-*`) directly on the Data Grid component is no longer supported. To pass the props, use `slotProps`:
  - For `.root` element, use `slotProps.root`.
  - For `.main` element (the one with `role="grid"`), use `slotProps.main`.

- `detailPanelExpandedRowIds` and `onDetailPanelExpandedRowIdsChange` props use a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) instead of an array:

  ```diff
  -detailPanelExpandedRowIds?: GridRowId[];
  +detailPanelExpandedRowIds?: Set<GridRowId>;

  -onDetailPanelExpandedRowIdsChange?: (ids: GridRowId[], details: GridCallbackDetails) => void;
  +onDetailPanelExpandedRowIdsChange?: (ids: Set<GridRowId>, details: GridCallbackDetails) => void;
  ```

- `apiRef.current.getExpandedDetailPanels` and `apiRef.current.setExpandedDetailPanels` methods receive and return a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) instead of an array.
- `gridDetailPanelExpandedRowIdsSelector` returns a [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) instead of an array.
- `gridDetailPanelExpandedRowsHeightCacheSelector` was removed.

#### `@mui/x-data-grid@8.0.0-alpha.5`

- [DataGrid] Consider `columnGroupHeaderHeight` prop in `getTotalHeaderHeight` method (#15915) @k-rajat19
- [DataGrid] Fix autosizing with virtualized columns (#15116) @k-rajat19
- [DataGrid] Move `<Badge />` to leaf import (#15879) @romgrk
- [DataGrid] Move `<ListItemText />` and `<ListItemIcon />` to leaf import (#15869) @romgrk
- [DataGrid] Remove the Joy UI demo (#15913) @romgrk
- [DataGrid] Update quick filter input variant (#15909) @KenanYusuf
- [DataGrid] Use `slotProps` to forward props to `.main` and `.root` elements (#15870) @MBilalShafi
- [l10n] Improve Korean(ko-KR) locale (#15878) @good-jinu

#### `@mui/x-data-grid-pro@8.0.0-alpha.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.5`, plus:

- [DataGridPro] Use `Set` for `detailPanelExpandedRowIds` (#15835) @cherniavskii

#### `@mui/x-data-grid-premium@8.0.0-alpha.5` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.5`.

### Date and Time Pickers

#### Breaking changes

- The `<PickersMonth />` component has been moved inside the Month Calendar component — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#month-calendar).

- The `<PickersYear />` component has been moved inside the Year Calendar component — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#year-calendar).

#### `@mui/x-date-pickers@8.0.0-alpha.5`

- [pickers] Add verification to disable skipped hours in spring forward DST (#15849) @flaviendelangle
- [pickers] Remove `PickersMonth` and `PickersYear` from the theme and remove the `div` wrapping each button (#15806) @flaviendelangle
- [pickers] Use the new `ownerState` object on the `<PickersTextField />` component (#15863) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.5`.

### Charts

#### `@mui/x-charts@8.0.0-alpha.5`

- [charts] Fix `<ScatterChart />` value type if `null` (#15917) @alexfauquette

#### `@mui/x-charts-pro@8.0.0-alpha.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.5`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.5`

No changes since `@mui/x-tree-view-pro@v8.0.0-alpha.4`.

#### `@mui/x-tree-view-pro@8.0.0-alpha.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.5`.

### Core

- [code-infra] Remove `@mui/material-nextjs` dependency (#15925) @LukasTy

## 8.0.0-alpha.4

_Dec 13, 2024_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Romanian locale on the Data Grid and Pickers
- 📚 Documentation improvements
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@k-rajat19, @nusr, @rares985, @zivl.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @flaviendelangle, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- The selectors signature has been updated due to the support of arguments in the selectors. Pass `undefined` as `arguments` if the selector doesn't use any arguments.

  ```diff
  -mySelector(state, instanceId)
  +mySelector(state, arguments, instanceId)
  ```

- The `useGridSelector` signature has been updated due to the introduction of arguments parameter in the selectors. Pass `undefined` as `arguments` if the selector doesn't use any arguments.

  ```diff
  -const output = useGridSelector(apiRef, selector, equals)
  +const output = useGridSelector(apiRef, selector, arguments, equals)
  ```

- The default variant for text fields and selects in the filter panel has been changed to `outlined`.
- The "row spanning" feature is now stable.
  ```diff
   <DataGrid
  -  unstable_rowSpanning
  +  rowSpanning
   />
  ```
- Selected row is now deselected when clicked again.

#### `@mui/x-data-grid@8.0.0-alpha.4`

- [DataGrid] Deselect selected row on click (#15509) @k-rajat19
- [DataGrid] Fix "No rows" displaying when all rows are pinned (#15335) @nusr
- [DataGrid] Make row spanning feature stable (#15742) @MBilalShafi
- [DataGrid] Round dimensions to avoid subpixel rendering error (#15850) @KenanYusuf
- [DataGrid] Toggle menu on click in `<GridActionsCell />` (#15867) @k-rajat19
- [DataGrid] Trigger row spanning computation on rows update (#15858) @MBilalShafi
- [DataGrid] Update filter panel input variant (#15807) @KenanYusuf
- [DataGrid] Use `columnsManagement` slot (#15817) @k-rajat19
- [DataGrid] Use new selector signature (#15200) @MBilalShafi
- [l10n] Improve Romanian (ro-RO) locale (#15745) @rares985

#### `@mui/x-data-grid-pro@8.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.4`, plus:

- [DataGridPro] Make row reordering work with pagination (#15355) @k-rajat19

#### `@mui/x-data-grid-premium@8.0.0-alpha.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.4`, plus:

- [DataGridPremium] Fix group column ignoring `valueOptions` for `singleSelect` column type (#15739) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.0.0-alpha.4`

- [l10n] Improve Romanian (ro-RO) locale (#15745) @rares985
- [pickers] Clean `usePicker` logic (#15763) @flaviendelangle
- [pickers] Rename layout `ownerState` property from `isRtl` to `layoutDirection` (#15803) @flaviendelangle
- [pickers] Use the new `ownerState` in `useClearableField` (#15776) @flaviendelangle
- [pickers] Use the new `ownerState` in the toolbar components (#15777) @flaviendelangle
- [pickers] Use the new `ownerState` object for the clock components and the desktop / mobile wrappers (#15669) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.4`.

### Charts

#### Breaking changes

- The default styling of the charts tooltip has been updated.

#### `@mui/x-charts@8.0.0-alpha.4`

- [charts] Fix hydration missmatch (#15647) @alexfauquette
- [charts] Fix internal spelling typo (#15805) @zivl
- [charts] Fix scatter dataset with missing data (#15802) @alexfauquette
- [charts] HTML Labels (#15813) @JCQuintas
- [charts] Only access store values by using hooks (#15764) @alexfauquette
- [charts] Update Tooltip style (#15630) @alexfauquette

#### `@mui/x-charts-pro@8.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.4`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.4`

No changes, releasing to keep the versions in sync.

#### `@mui/x-tree-view-pro@8.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Releasing to benefit from license package fix (#15814).

### Docs

- [docs] Clean Joy and Browser custom field demos (#15707) @flaviendelangle
- [docs] Fix outdated link to handbook (#15855) @oliviertassinari
- [docs] Improve Pickers accessible DOM migration section description (#15596) @LukasTy
- [docs] Use `updateRows` method for list view demos (#15732) @KenanYusuf
- [docs] Use date library version from package dev dependencies for sandboxes (#15762) @LukasTy

### Core

- [code-infra] Add Charts sandbox generation (#15830) @JCQuintas
- [code-infra] Remove redundant `@type/react-test-renderer` dep (#15766) @LukasTy
- [license] Use `console.log` for the error message on CodeSandbox to avoid rendering error (#15814) @arminmeh

## 8.0.0-alpha.3

_Dec 5, 2024_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 💫 Support [Server-side lazy loading](https://mui.com/x/react-data-grid/server-side-data/lazy-loading/) on the Data Grid. Use [data source](https://mui.com/x/react-data-grid/server-side-data/#data-source) to fetch a range of rows on demand and update the rows in the same way as described in [Infinite loading](https://mui.com/x/react-data-grid/row-updates/#infinite-loading) and [Lazy loading](https://mui.com/x/react-data-grid/row-updates/#lazy-loading) without the need to use any additional event listeners and callbacks.
- 🎯 Improved [data caching](https://mui.com/x/react-data-grid/server-side-data/#data-caching). Check out our [recommendations](https://mui.com/x/react-data-grid/server-side-data/#improving-the-cache-hit-rate) for improving the cache hit rate.

Special thanks go out to the community contributors who have helped make this release possible:
@ihsanberkozcan, @k-rajat19, @perezShaked.
Following are all team members who have contributed to this release:
@arminmeh, @cherniavskii, @flaviendelangle, @JCQuintas, @MBilalShafi, @noraleonte.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- The "Select all" checkbox is now checked when all the selectable rows are selected, ignoring rows that are not selectable because of the `isRowSelectable` prop.
- The `rowPositionsDebounceMs` prop was removed.
- The `gridRowsDataRowIdToIdLookupSelector` selector was removed. Use the `gridRowsLookupSelector` selector in combination with the `getRowId()` API method instead.
  ```diff
  -const idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);
  -const rowId = idToIdLookup[id]
  +const rowsLookup = gridRowsLookupSelector(apiRef);
  +const rowId = apiRef.current.getRowId(rowsLookup[id])
  ```
- The Grid is now more aligned with the WAI-ARIA authoring practices and sets the `role` attribute to `treegrid` if the Data Grid is used with row grouping feature.

#### `@mui/x-data-grid@8.0.0-alpha.3`

- [DataGrid] Fix deselection not working with `isRowSelectable` (#15692) @MBilalShafi
- [DataGrid] Make column autosizing work with flex columns (#15465) @cherniavskii
- [DataGrid] Remove `gridRowsDataRowIdToIdLookupSelector` selector (#15698) @arminmeh
- [DataGrid] Remove `rowPositionsDebounceMs` prop (#15482) @k-rajat19
- [l10n] Improve Hebrew (he-IL) locale (#15699) @perezShaked
- [l10n] Improve Turkish (tr-TR) locale (#15734) @ihsanberkozcan

#### `@mui/x-data-grid-pro@8.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.3`, plus:

- [DataGridPro] Cleanup pinned rows on removal (#15697) @cherniavskii
- [DataGridPro] Server-side lazy loading (#13878) @arminmeh

#### `@mui/x-data-grid-premium@8.0.0-alpha.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.3`, plus:

- [DataGridPremium] Remove the `ariaV8` experimental flag (#15694) @arminmeh

### Date and Time Pickers

#### Breaking changes

- The `onOpen()` and `onClose()` methods of the `usePickerContext()` hook have been replaced with a single `setOpen` method — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#usepickercontext).

#### `@mui/x-date-pickers@8.0.0-alpha.3`

- [pickers] Replace the `onOpen()` and `onClose()` methods of `usePickerContext()` with a single `setOpen()` method. (#15701) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.3`.

### Charts

#### `@mui/x-charts@8.0.0-alpha.3`

- [charts] Improve SVG `pattern` and `gradient` support (#15720) @JCQuintas

#### `@mui/x-charts-pro@8.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.3`.

### Tree View

#### `@mui/x-tree-view@8.0.0-alpha.3`

No changes since `@mui/x-tree-view-pro@v8.0.0-alpha.2`.

#### `@mui/x-tree-view-pro@8.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.0.0-alpha.3`.

### Docs

- [docs] Add a customization demo for the Date and Time Pickers overview page (#15118) @noraleonte
- [docs] Fix typo in charts axis documentation (#15743) @JCQuintas
- [docs] Improve SEO titles for the Data Grid (#15695) @MBilalShafi

### Core

- [core] Add `@mui/x-tree-view-pro` to `releaseChangelog` (#15316) @flaviendelangle
- [code-infra] Lock file maintenance (#11894)
- [code-infra] Check if `preset-safe` folder exists in codemod test (#15703) @JCQuintas
- [code-infra] Import Pickers `preset-safe` into global codemod config (#15659) @JCQuintas
- [code-infra] Playwright 1.49 (#15493) @JCQuintas
- [test] Force hover in headless Chrome (#15710) @cherniavskii

## 8.0.0-alpha.2

_Nov 29, 2024_

We'd like to offer a big thanks to the 17 contributors who made this release possible. Here are some highlights ✨:

- 👨🏽‍💻 Improve resize performance on the Data Gird.
- `<ChartDataProvider />` and `<ChartsSurface />` components are now fully divided — [Learn more](https://mui.com/x/react-charts/composition/#overview).
- Users can create their own HTML components using chart data — [Learn more](https://mui.com/x/react-charts/components/#html-components).
- 🌍 Improve Spanish, Portuguese, Chinese locales on the Data Grid component.
- 🌍 Improve Dutch locale on the Date and Time Pickers components.
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community contributors who have helped make this release possible:
@dloeda, @headironc, @jedesroches, @k-rajat19, @lauri865, @mathzdev, @nphmuller, @zinoroman.
Following are all team members who have contributed to this release:
@arminmeh, @alexfauquette, @cherniavskii, @flaviendelangle, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @oliviertassinari.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### Breaking changes

- The `<GridOverlays />` component is not exported anymore.
- The `indeterminateCheckboxAction` prop has been removed. Clicking on an indeterminate checkbox "selects" the unselected descendants.
- The `apiRef.current.resize()` method was removed.
- The default value of the `rowSelectionPropagation` prop has been changed to `{ parents: true, descendants: true }` which means that the selection will be propagated to the parents and descendants by default.
  To revert to the previous behavior, pass `rowSelectionPropagation` as `{ parents: false, descendants: false }`.
- If `estimatedRowCount` is used, the text provided to the [Table Pagination](/material-ui/api/table-pagination/) component from the Material UI library is updated and requires additional translations. Check the example at the end of [Index-based pagination section](/x/react-data-grid/pagination/#index-based-pagination).

#### `@mui/x-data-grid@v8.0.0-alpha.2`

- [DataGrid] Change test dom check from `/jsdom/` to `/jsdom|HappyDOM/`. (#15634) @jedesroches
- [DataGrid] Clear timers on unmount (#15620) @cherniavskii
- [DataGrid] Fix order of spread props on toolbar items (#15556) @KenanYusuf
- [DataGrid] Improve resize performance (#15549) @lauri865
- [DataGrid] Make estimation label more accurate (#15632) @arminmeh
- [DataGrid] Remove `<GridOverlays />` export (#15573) @k-rajat19
- [DataGrid] Remove `indeterminateCheckboxAction` prop (#15522) @MBilalShafi
- [DataGrid] Remove try/catch from `<GridCell />` due to performance issues (#15616) @lauri865
- [DataGrid] Remove unused `resize` method (#15599) @cherniavskii
- [DataGrid] Support column virtualization with dynamic row height (#15541) @cherniavskii
- [DataGrid] Update the default value for `rowSelectionPropagation` (#15523) @MBilalShafi
- [l10n] Improve Chinese (zh-CN) locale (#15570) @headironc
- [l10n] Improve Portuguese (pt-PT) locale (#15561) @mathzdev

#### `@mui/x-data-grid-pro@v8.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@v8.0.0-alpha.2`, plus:

- [DataGridPro] Fix header filtering with `boolean` column type (#15528) @k-rajat19
- [DataGridPro] Fix pagination state not updating if the data source response has no rows (#15622) @zinoroman
- [DataGridPro] Fix selection propagation issue on initialization (#15461) @MBilalShafi

#### `@mui/x-data-grid-premium@v8.0.0-alpha.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@v8.0.0-alpha.2`.

### Date and Time Pickers

#### Breaking changes

- The props received by the `layout` and the `toolbar` slots have been reworked — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#do-not-pass-the-section-type-as-a-generic).

- The `TSection` generic of the `FieldRef` type has been replaced with the `TValue` generic — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slots-breaking-changes).

#### `@mui/x-date-pickers@v8.0.0-alpha.2`

- [l10n] Improve Dutch (nl-NL) locale (#15564) @nphmuller
- [pickers] Fix DST issue with `America/Asuncion` timezone and `AdapterMoment` (#15552) @flaviendelangle
- [pickers] Improve validation internals (#15419) @flaviendelangle
- [pickers] Remove `TSection` and strictly type `TValue` (#15434) @flaviendelangle
- [pickers] Remove `orientation`, `isLandscape`, `isRtl`, `wrapperVariant` and `disabled` props from `PickersLayout` (#15494) @flaviendelangle
- [pickers] Use the new `ownerState` in `<PickersCalendarHeader />`, `<PickersArrowSwitcher />` and `<DayCalendarSkeleton />` (#15499) @flaviendelangle
- [pickers] Use the new `ownerState` object in all the field components (#15510) @flaviendelangle

#### `@mui/x-date-pickers-pro@v8.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@v8.0.0-alpha.2`.

### Charts

#### Breaking changes

- Charts Container don't have a `<div />` wrapping them anymore. All props are now passed to the root `<svg />` instead of the `<div />`.

#### `@mui/x-charts@v8.0.0-alpha.2`

- [charts] Allow the creation of custom HTML components using charts data (#15511) @JCQuintas
- [charts] Flatten imports from `@mui/utils` and `@mui/system` (#15603) @alexfauquette
- [charts] Introduce the plugin system (#15513) @alexfauquette
- [charts] Prevent invalid `releasePointerCapture` (#15602) @alexfauquette
- [charts] Fix custom Tooltip demos (#15631) @alexfauquette

#### `@mui/x-charts-pro@v8.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@v8.0.0-alpha.2`.

### Tree View

#### `@mui/x-tree-view@v8.0.0-alpha.2`

- [TreeView] Flatten import from `@mui/utils` and `@mui/system` (#15604) @alexfauquette

#### `@mui/x-tree-view-pro@v8.0.0-alpha.2`

Same changes as in `@mui/x-tree-view@v8.0.0-alpha.2`.

### Docs

<!-- vale MUI.CorrectRererenceCased = NO -->

- [docs] Fix 404 links (#15575) @oliviertassinari
- [docs] Fix bash comments (#15571) @oliviertassinari
- [docs] Fix Pickers theme augmentation example (#15672) @LukasTy
- [docs] Replace use of "e.g." with "for example" (#15572) @oliviertassinari
- [docs] Update stale `new` and `preview` tags in v8 docs (#15547) @JCQuintas
- [docs] Fix layout shift image on Tree View docs (#15626) @oliviertassinari
- [docs] Fix `anchorEl` API page for charts (#15625) @oliviertassinari
- [docs] Add documentation for the list view feature (#15344) @KenanYusuf

<!-- vale MUI.CorrectRererenceCased = YES -->

### Core

- [core] Follow `()` function convention for docs @oliviertassinari
- [core] Remove dead translation key (#15566) @oliviertassinari
- [code-infra] Auto-merge `@types/node` bumps (#15591) @LukasTy

## 8.0.0-alpha.1

_Nov 22, 2024_

We'd like to offer a big thanks to the 16 contributors who made this release possible. Here are some highlights ✨:

- 🔧 Refactor Tooltip customisation for charts — [Learn more](https://mui.com/x/react-charts/tooltip/#overriding-content).
- ⚛️ React 19 support
- 🌍 Improve Chinese, Spanish, and Swedish locale on the Data Grid component
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community contributors who have helped make this release possible:
@CarlosLopezLg, @headironc, @hendrikpeilke, @k-rajat19, @lhilgert9, @viktormelin.
Following are all team members who have contributed to this release:
@alexfauquette, @arthurbalduini, @cherniavskii, @flaviendelangle, @JCQuintas, @LukasTy, @MBilalShafi, @oliviertassinari, @KenanYusuf, @arminmeh.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@v8.0.0-alpha.1`

- [DataGrid] React 19 support (#15342) @arminmeh
- [DataGrid] Add prop to override search input props in `GridColumnsManagement` (#15347) @k-rajat19
- [DataGrid] Add test coverage for issues fixed in #15184 (#15282) @MBilalShafi
- [DataGrid] Change default loading overlay variants (#15504) @KenanYusuf
- [DataGrid] Fix last separator not being hidden when grid is scrollable (#15543) @KenanYusuf
- [DataGrid] Fix right column group header border with virtualization (#15470) @hendrikpeilke
- [DataGrid] Fix row-spanning in combination with column-pinning (#15368) @lhilgert9
- [l10n] Improve Chinese (zh-CN) locale (#15365) @headironc
- [l10n] Improve Spanish (es-ES) locale (#15369) @CarlosLopezLg
- [l10n] Improve Swedish (sv-SE) locale (#15371) @viktormelin

#### `@mui/x-data-grid-pro@v8.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@v8.0.0-alpha.1`.

#### `@mui/x-data-grid-premium@v8.0.0-alpha.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@v8.0.0-alpha.1`, plus:

- [DataGridPremium] Prompt input control (#15401) @arminmeh

### Date and Time Pickers

#### Breaking change

- The `FieldValueType` type has been renamed to `PickerValueType` — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#renamed-variables).
- The `toolbar` and `layout` slots no longer receive the `disabled` and `readOnly` props — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#slots-breaking-changes).

#### `@mui/x-date-pickers@v8.0.0-alpha.1`

- [fields] Fix focus management with new DOM structure (#15475) @flaviendelangle
- [pickers] React 19 support (#15342) @arminmeh
- [pickers] Add new properties to `PickerOwnerState` and `PickerContextValue` (#15415) @flaviendelangle
- [pickers] Always use `props.value` when it changes (#15490) @flaviendelangle
- [pickers] Ensure internal value timezone is updated (#15435) @LukasTy
- [pickers] Fix unused code in `<PickersToolbar />` component (#15515) @LukasTy
- [pickers] Remove `FieldValueType` in favor of `PickerValueType` (#15259) @arthurbalduini
- [pickers] Remove the form props from the layout and the toolbar slots (#15492) @flaviendelangle
- [pickers] Use `props.referenceDate` timezone when `props.value` and `props.defaultValue` are not defined (#15532) @flaviendelangle
- [TimePicker] Prevent mouse events after `touchend` event (#15346) @arthurbalduini

#### `@mui/x-date-pickers-pro@v8.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@v8.0.0-alpha.1`, plus:

- [DateTimeRangePicker] Use time in `referenceDate` when selecting date (#15429) @LukasTy

### Charts

#### Breaking change

- The DX of the Tooltip customization has been refactored
  - The `tooltip` prop has been removed in favor of `slotProps.tooltip` for consistency.
  - The `popper`, `axisContent`, and `itemContent` slots have been removed in favor of the `tooltip` slot which overrides the entire tooltip.
    - To override the tooltip content, use the `useItemTooltip` or `useAxisTooltip` hook to get the data, and wrap your component in `ChartsTooltipContainer` to follow the pointer position.
    - To override the tooltip placement, use the `ChartsItemTooltipContent` or `ChartsItemTooltipContent` to get default data and place them in your custom tooltip.

- The library now uses the SVG `filter` attribute instead of `d3-color` for color manipulation.
  - This modification impacts the `LinePlot`, `AreaPlot`, and `BarPlot` components.
    If you've customized the `fill` of those elements, you might need to override it by using the CSS `filter`.
  - The `theme.styleOverride` is removed for `MuiLineElement`, `MuiAreaElement`, and `MuiBarElement` to improve performance.
    You can still target those elements by using the `MuiLinePlot`, `MuiAreaPlot`, and `MuiBarPlot` and target the appropriate classes `lineElementClasses.root`, `areaElementClasses.root`, `barElementClasses.root`

- Removed the `resolveSizeBeforeRender` prop from all chart components — [Learn more](https://mui.com/x/migration/migration-charts-v7/#remove-resolvesizebeforerender-prop).
- Removed `width` and `height` props from the `ChartsSurface` component.
- Removed the `viewport` prop from all charts.

#### `@mui/x-charts@v8.0.0-alpha.1`

- [charts] React 19 support (#15342) @arminmeh
- [charts] Decouple `<ChartDataProvider />` and `<ChartsSurface />` (#15375) @JCQuintas
- [charts] Fix Scatter Chart tooltip wrong defaults (#15537) @JCQuintas
- [charts] Fix key generation for the `<ChartsGrid />` component (#15463) @alexfauquette
- [charts] Improve `<SvgRefProvider />` to split the received ref (#15424) @JCQuintas
- [charts] Move interaction state in store (#15426) @alexfauquette
- [charts] Refactor Tooltip customisation (#15154) @alexfauquette
- [charts] Remove intrinsic size requirement (#15471) @JCQuintas
- [charts] Replace `d3-color` with CSS filter for highlight (#15084) @alexfauquette
- [charts] Split `<DrawingProvider />` into `<DrawingAreaProvider />` and `<SvgRefProvider />` (#15417) @JCQuintas

#### `@mui/x-charts-pro@v8.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@v8.0.0-alpha.1`.

### Tree View

#### Breaking changes

- The Tree Item component can no longer use `publicAPI` methods in the `render` because they are now memoized — [Learn more](https://mui.com/x/migration/migration-tree-view-v7/#stop-using-publicapi-methods-in-the-render).

#### `@mui/x-tree-view@v8.0.0-alpha.1`

- [TreeView] React 19 support (#15342) @arminmeh
- [TreeView] Do not re-render every Tree Item when the Rich Tree View re-renders (introduce selectors) (#14210) @flaviendelangle
- [TreeView] Remove `treeId` from the item context (#15542) @flaviendelangle
- [TreeView] Remove state mutation in `moveItemInTree()` (#15539) @flaviendelangle
- [TreeItem] Correct the typing of `slotProps.groupTransition` (#15534) @flaviendelangle

### Docs

- [docs] Fix some migration typos (#15422) @LukasTy
- [docs] Fix typo in migration guide (#15508) @flaviendelangle
- [docs] Fix 301 redirection in docs @oliviertassinari
- [docs] Polish Server-side data section (#15330) @oliviertassinari
- [docs] Use loading state in the demos (#15512) @cherniavskii

### Core

- [core] Keep OpenSSF badge up-to-date @oliviertassinari
- [code-infra] Add `'DensitySelectorGrid'` to time-sensitive argos tests (#15425) @JCQuintas
- [code-infra] Add documentation to internal types (#15540) @JCQuintas
- [code-infra] Prevent relative imports across packages (#15437) @JCQuintas
- [code-infra] Update renovate config to merge `action` pins (#15462) @LukasTy
- [docs-infra] Fix version tooltip (#15468) @alexfauquette
- [docs-infra] Transpile `.ts` demo files (#15345) @KenanYusuf
- [infra] Remove cherry-pick issue write permission (#15456) @oliviertassinari

## 8.0.0-alpha.0

<img width="100%" alt="MUI X v8 Alpha is live" src="https://github.com/user-attachments/assets/114cf615-b617-435f-8499-76ac3c26c57b">

_Nov 14, 2024_

We'd like to offer a big thanks to the 22 contributors who made this release possible. Here are some highlights ✨:

- 🔁 Support [automatic parents and children selection](https://mui.com/x/react-tree-view/rich-tree-view/selection/#automatic-parents-and-children-selection) for the Rich Tree View components.
- 🌍 Improve Greek (el-GR) locale on the Date and Time Pickers components
- 🌍 Improve Polish (pl-PL) locale on the Data Grid component
- 🐞 Bugfixes
- 📚 Documentation improvements

  Special thanks go out to the community contributors who have helped make this release possible:
  @belkocik, @GeorgiosDrivas, @k-rajat19, @kalyan90, @DungTiger, @fxnoob, @GuillaumeMeheut
  Following are all team members who have contributed to this release:
  @alexfauquette, @arminmeh, @arthurbalduini, @cherniavskii, @flaviendelangle, @JCQuintas, @KenanYusuf, @LukasTy, @MBilalShafi, @michelengelen, @noraleonte, @oliviertassinari, @romgrk, @samuelsycamore, @joserodolfofreitas.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@8.0.0-alpha.0`

- [DataGrid] Fix grid overlay aligment with scroll for rtl (#15072) @kalyan90
- [DataGrid] Fix resizing right pinned column (#15107) @KenanYusuf
- [DataGrid] Pass the reason to the `onPaginationModelChange` callback (#13959) @DungTiger
- [DataGrid] Set default overlay height in flex parent layout (#15202) @cherniavskii
- [DataGrid] Refactor `baseMenuList` and `baseMenuItem` (#15049) @romgrk
- [DataGrid] Remove more material imports (#15063) @romgrk
- [l10n] Improve Polish (pl-PL) locale (#15227) @belkocik

#### `@mui/x-data-grid-pro@8.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.0.0-alpha.0`, plus:

- [DataGridPro] Fix column pinning layout (#14966) @cherniavskii

#### `@mui/x-data-grid-premium@8.0.0-alpha.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.0.0-alpha.0`, plus:

- [DataGridPremium] Server-side data source with row grouping (#13826) @MBilalShafi

### Date and Time Pickers

#### Breaking changes

- The default DOM structure of the field has changed [Learn more](https://mui.com/x/migration/migration-pickers-v7/#new-dom-structure-for-the-field).
  - Before version `v8.x`, the fields' DOM structure consisted of an `<input />`, which held the whole value for the component, but unfortunately presents a few limitations in terms of accessibility when managing multiple section values.
  - Starting with version `v8.x`, all the field and picker components come with a new DOM structure that allows the field component to set aria attributes on individual sections, providing a far better experience with screen readers.

- Some translation keys no longer require `utils` and the date object as parameters, but only the formatted value as a string. The keys affected by this changes are: `clockLabelText`, `openDatePickerDialogue` and `openTimePickerDialogue` — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#stop-passing-utils-and-the-date-object-to-some-translation-keys).

- The following types are no longer exported by `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#removed-types).
  - `UseDateFieldComponentProps`
  - `UseTimeFieldComponentProps`
  - `UseDateTimeFieldComponentProps`
  - `BaseSingleInputFieldProps`
  - `BaseMultiInputFieldProps`
  - `BasePickersTextFieldProps`

- The `TDate` generic has been removed from all the types, interfaces, and variables of the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` packages — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#remove-tdate-generic).

- Renamed `usePickersTranslations` and `usePickersContext` hooks to have a coherent `Picker` prefix instead of `Pickers` — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#renamed-variables).

- The `LicenseInfo` object is no longer exported from the `@mui/x-date-pickers-pro` package — [Learn more](https://mui.com/x/migration/migration-pickers-v7/#stop-using-licenseinfo-from-mui-x-date-pickers-pro).

#### `@mui/x-date-pickers@8.0.0-alpha.0`

- [fields] Enable the new field DOM structure by default (#14651) @flaviendelangle
- [fields] Remove `UseDateFieldComponentProps` and equivalent interfaces (#15053) @flaviendelangle
- [fields] Remove clear button from the tab sequence (#14616) @k-rajat19
- [l10n] Improve Greek (el-GR) locale (#15250) @GeorgiosDrivas
- [pickers] Clean definition of validation props (#15198) @flaviendelangle
- [pickers] Clean the new `ownerState` object (#15056) @flaviendelangle
- [pickers] Correctly type the `ownerState` of the `field` and `actionBar` slots when resolved in a picker component (#15162) @flaviendelangle
- [pickers] Fix `DateCalendar` timezone management (#12321) @LukasTy
- [pickers] Fix `DateTimeRangePicker` error when using format without time (#14917) @fxnoob
- [pickers] Fix `DigitalClock` time options on a `DST` switch day (#10793) @LukasTy
- [pickers] Remove `TDate` generics in favor of `PickerValidDate` direct usage (#15001) @flaviendelangle
- [pickers] Remove `utils` and `value` params from translations (#14986) @arthurbalduini
- [pickers] Remove plural in "Pickers" on recently introduced APIs (#15297) @flaviendelangle
- [pickers] Remove the re-export from `@mui/x-license` (#14487) @k-rajat19
- [pickers] Strictly type the props a picker passes to its field, and migrate all the custom field demos accordingly (#15197) @flaviendelangle
- [pickers] Unify JSDoc for all the `disabled` and `readOnly` props (#15304) @flaviendelangle
- [pickers] Use the new `ownerState` in `DateCalendar`, `DateRangeCalendar`, `MonthCalendar` and `YearCalendar` (#15171) @flaviendelangle
- [pickers] Use the new `ownerState` in `usePickersLayout` and `useXXXPicker` (#14994) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.0.0-alpha.0`.

### Charts

#### Breaking changes

- The `legend` prop has been removed. To pass props to the legend, use `slotProps={{ legend: { ... } }}` instead. This can be automatically done with the codemod as long as the `legend` prop does not come from a destructured object — [Learn more](https://mui.com/x/migration/migration-charts-v7/#legend-props-propagation-✅).

- The `slots.legend` does not receive the `drawingArea` prop. You can still access your custom legend with the `useDrawingArea()` hook if your custom legend needs it.

- Removed or renamed multiple props from Series — [Learn more](https://mui.com/x/migration/migration-charts-v7/#series-properties-renaming).
  - The `highlighted` and `faded` properties of highlightScope have been deprecated in favor of `highlight` and `fade`.
    The deprecated ones are now removed.
  - The `xAxisKey`, `yAxisKey`, and `zAxisKey` properties have been deprecated in favor of `xAxisId`, `yAxisId`, and `zAxisId`.

- The Pie Chart lost all props and renderer linked to axes because pie chart does not need cartesian axes. If you used it, you can still add them back with composition. Please consider opening an issue to share your use case with us — [Learn more](https://mui.com/x/migration/migration-charts-v7/#remove-pie-chart-axes).

#### `@mui/x-charts@8.0.0-alpha.0`

- [charts] Introduce `hideLegend` prop (#15277) @alexfauquette
- [charts] Filter items outside the drawing area for performance (#14281) @alexfauquette
- [charts] Fix log scale with `null` data (#15337) @alexfauquette
- [charts] Fix tooltip follow mouse (#15189) @alexfauquette
- [charts] Remove `xAxisKey`, `yAxisKey`, and `zAxisKey` series keys (#15192) @alexfauquette
- [charts] Remove axis from the pie chart (#15187) @alexfauquette
- [charts] Remove deprecated `legend` props (#15081) @alexfauquette
- [charts] Remove deprecated highlight properties (#15191) @alexfauquette
- [charts] Update Popper position outside of React (#15003) @alexfauquette
- [charts] Improve the performance of the `getSymbol` method (#15233) @romgrk

#### `@mui/x-charts-pro@8.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.0.0-alpha.0`.

### Tree View

#### Breaking changes

- The `ContentComponent` or `ContentProps` props of the `<TreeItem />` component have been removed in favor of the new `slots`, `slotProps` props and of the `useTreeItem` hook — [Learn more](https://mui.com/x/migration/migration-tree-view-v7/#new-api-to-customize-the-tree-item).

- The `onClick` and `onMouseDown` callbacks of the Tree Item component are now passed to the root element instead of the content — [Learn more](https://mui.com/x/migration/migration-tree-view-v7/#behavior-change-on-the-onclick-and-onmousedown-props-of-treeitem).

- Rename the `<TreeItem2 />` component (and related utils) — [Learn more](https://mui.com/x/migration/migration-tree-view-v7/#✅-rename-the-treeitem2-and-related-utils).

- The `<TreeView />` component has been renamed `<SimpleTreeView />` which has exactly the same API — [Learn more](https://mui.com/x/migration/migration-tree-view-v7/#✅-use-simple-tree-view-instead-of-tree-view).

- The indentation of nested Tree Items is now applied on the content of the element — [Learn more](https://mui.com/x/migration/migration-tree-view-v7/#apply-the-indentation-on-the-item-content-instead-of-its-parents-group).

#### `@mui/x-tree-view@8.0.0-alpha.0`

- [TreeView] Always apply the indentation on the item content instead of its parent's group (#15089) @flaviendelangle
- [TreeView] Automatic parents and children selection (#14899) @flaviendelangle
- [TreeView] Remove deprecated `TreeView` component (#15093) @flaviendelangle
- [TreeView] Replace `<TreeItem />` with `<TreeItem2 />` and migrate all the components and utils (#14913) @flaviendelangle

### Docs

- [docs] Add docs for rounded symbol (#15324) @GuillaumeMeheut
- [docs] Add migration guide for the removal of `LicenseInfo` from `@mui/x-date-pickers-pro` (#15321) @flaviendelangle
- [docs] Add migration guide for the first breaking changes of charts (#15276) @alexfauquette
- [docs] Add `PickersPopper` component to the Date Picker customization playground (#15305) @LukasTy
- [docs] Add v8 to supported releases table (#15384) @joserodolfofreitas
- [docs] Apply the new DX to the Button Field demos (#14860) @flaviendelangle
- [docs] Apply the new DX to the `Autocomplete` Field demo (#15165) @flaviendelangle
- [docs] Cleanup the pickers migration guide (#15310) @flaviendelangle
- [docs] Copyedit the Charts Getting Started sequence (#14962) @samuelsycamore
- [docs] Create Pickers masked field recipe (#13515) @flaviendelangle
- [docs] Fix `applyDomain` docs for the charts (#15332) @JCQuintas
- [docs] Fix link to private notion page (#15396) @michelengelen
- [docs] Fix missing punctuation on descriptions (#15229) @oliviertassinari
- [docs] Fix peer dependency range (#15281) @oliviertassinari
- [docs] Fix small Tree View typo (#15390) @oliviertassinari
- [docs] Fix the `AdapterMomentHijri` doc section (#15312) @flaviendelangle
- [docs] Replace the Tree Item anatomy images (#15066) @noraleonte
- [docs] Start v8 migration guides (#15096) @MBilalShafi
- [docs] Subdivide and reorganize navigation bar (#15014) @samuelsycamore
- [docs] Use `PickersTextField` in the customization playground (#15288) @LukasTy
- [docs] Use `next` instead of `^8.0.0` in the migration guides (#15091) @flaviendelangle

### Core

- [core] Adjust the `cherry-pick` GitHub actions (#15099) @LukasTy
- [core] Add `()` at the name of function name in the doc (#15075) @oliviertassinari
- [core] Clarify release version bump strategy (#15219) @cherniavskii
- [core] Fix CodeSandbox and StackBlitz for next doc-infra sync @oliviertassinari
- [core] Fix Vale error on `master` @oliviertassinari
- [core] Fix changelog reference to VoiceOver @oliviertassinari
- [core] Fix `tools-public.mui.com` redirection @oliviertassinari
- [core] Fix webpack capitalization (#15353) @oliviertassinari
- [core] Move `helpers` to `@mui/x-internals` package (#15188) @LukasTy
- [code-infra] Set renovate to automerge devDependencies (#13463) @JCQuintas
- [infra] Reintroduce the cherry pick workflow (#15293) @michelengelen
- [core] Remove duplicate title header (#15389) @oliviertassinari
- [release] v8 preparation (#15054) @michelengelen
- [test] Fix advanced list view regression test snapshot (#15260) @KenanYusuf

## 7.28.0

_Mar 17, 2025_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add support for `@mui/material` version 7 in all X packages
- 🐞 Bugfixes
- 🌍 Improve Chinese (zh-CN), (zh-HK), (zh-TW), Czech (cs-CZ), Korean (ko-KR) and Slovak (sk-Sk) locales on the Data Grid
- 🌍 Improve Chinese (zh-CN), (zh-HK) and (zh-TW) locales on the Pickers

Special thanks go out to the community contributors who have helped make this release possible:
@Blake-McCullough, @hlavacz, @yelahj, @k-rajat19, @nusr.
Following are all team members who have contributed to this release:
@arminmeh, @flaviendelangle, @LukasTy, @michelengelen, @MBilalShafi.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.28.0`

- [DataGrid] Add click propagation and prevents default on `toggleMenu` click (#16909) @michelengelen
- [DataGrid] Fix `processRowUpdate()` error if the row is removed before it is executed (#16904) @arminmeh
- [DataGrid] Fix bug with adding and removing columns in active edit state (#16916) @Blake-McCullough
- [DataGrid] Fix visual issue with pinned columns and row spanning (#16942) @MBilalShafi
- [DataGrid] Make column header menu button aria-labels unique (#16925) @owais635
- [DataGrid] Fix `printOptions` not respecting `hideFooter` root prop (#16915) @k-rajat19
- [l10n] Improve Chinese (zh-CN), (zh-HK) and (zh-TW) locales (#16917 and #16887) @nusr
- [l10n] Improve Czech (cs-CZ) and Slovak (sk-Sk) locales (#16996) @hlavacz
- [l10n] Improve Korean (ko-KR) locale (#16998) @yelahj

#### `@mui/x-data-grid-pro@7.28.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.28.0`, plus:

- [DataGridPro] Fix header filters not displaying restored values (#16976) @MBilalShafi
- [DataGridPro] Fix infinite loading not reacting when scrolling to the end (#16939) @arminmeh

#### `@mui/x-data-grid-premium@7.28.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.28.0`, plus:

- [DataGridPremium] Fix selection propagation issues with controlled state (#16995) @MBilalShafi

### Date and Time Pickers

#### `@mui/x-date-pickers@7.28.0`

- [l10n] Improve Chinese (zh-CN), (zh-HK) and (zh-TW) locales (#16997) @nusr

#### `@mui/x-date-pickers-pro@7.28.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.28.0`, plus:

- [DateRangeCalendar] Do not update the previewed day when hovering a day and the value is empty (#16892) @flaviendelangle

### Charts

#### `@mui/x-charts@7.28.0`

Internal changes.

#### `@mui/x-charts-pro@7.28.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.28.0`.

### Tree View

#### `@mui/x-tree-view@7.28.0`

Internal changes.

#### `@mui/x-tree-view-pro@7.28.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@7.28.0`.

### Docs

- [docs] Fix link to the lazy loading demo for the DataGrid (#16912) @nusr

### Core

- [core] Allow `@mui/material` v7 in dependencies (#16951) @LukasTy
- [infra] Make tests on React 18 part of pipeline (#16958) @LukasTy

## 7.27.3

_Mar 7, 2025_

We'd like to offer a big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

Team members who have contributed to this release: @arminmeh, @cherniavskii, @LukasTy, @michelengelen.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.27.3`

- [DataGrid] Fix `aria-hidden` console error when scrollbar is dragged (#16834) @arminmeh
- [DataGrid] Fix scroll jump with dynamic row height (#16801) @cherniavskii

#### `@mui/x-data-grid-pro@7.27.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.27.3`.

#### `@mui/x-data-grid-premium@7.27.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.27.3`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.27.3`

- [fields] Fix Fields aria relationship with `helperText` (#16828) @LukasTy

#### `@mui/x-date-pickers-pro@7.27.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.27.3`.

### Core

- [infra] Update contributor acknowledgment wording (#16753) @michelengelen

## 7.27.2

<!-- generated comparing v7.27.1..v7.x -->

_Feb 27, 2025_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 🌍 Improve Hungarian (hu-HU) and Russian (ru-RU) locales on the Data Grid

Special thanks go out to the community contributors who have helped make this release possible:
@pcorpet, @noherczeg, @denpiligrim.
Following are all team members who have contributed to this release:
@MBilalShafi, @KenanYusuf.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@v7.27.2`

- [DataGrid] Fix `showColumnVerticalBorder` prop (#16726) @KenanYusuf
- [DataGrid] Make server-side data navigation consistent (#16735) @MBilalShafi
- [DataGrid] Use readonly array for `GridSortModel` (#16731) @pcorpet
- [l10n] Improve Hungarian (hu-HU) locale (#16746) @noherczeg
- [l10n] Improve Russian (ru-RU) locale (#16725) @denpiligrim

#### `@mui/x-data-grid-pro@v7.27.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@v7.27.2`.

#### `@mui/x-data-grid-premium@v7.27.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@v7.27.2`.

## 7.27.1

_Feb 25, 2025_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 🌍 Add Bangla (bn-BD) locale on the Data Grid and Date Pickers

Special thanks go out to the community contributors who have helped make this release possible:
@nusr, @officialkidmax.
Following are all team members who have contributed to this release:
@bernardobelchior, @MBilalShafi, @KenanYusuf.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.27.1`

- [DataGrid] Fix the pagination unexpected behavior when using -1 for "All" rows per page (#16485) @nusr
- [DataGrid] Extract `getRowId()` API method as a selector (#16574) @MBilalShafi
- [DataGrid] Fix scrollbars overlapping cells on mount (#16653) @KenanYusuf
- [l10n] Add Bangla (bn-BD) locale (#16649) @officialkidmax

#### `@mui/x-data-grid-pro@7.27.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.27.1`.

#### `@mui/x-data-grid-premium@7.27.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.27.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.27.1`

- [l10n] Add Bangla (bn-BD) locale (#16649) @officialkidmax

#### `@mui/x-date-pickers-pro@7.27.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.27.1`.

### Charts

#### `@mui/x-charts@7.27.1`

- [charts] Fix empty series array in pie chart (#16657) @bernardobelchior

#### `@mui/x-charts-pro@7.27.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.27.1`.

## 7.27.0

_Feb 17, 2025_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- ⚡ Improve Data Grid Excel export serialization performance
- 🐞 Bugfixes
- 🌍 Improve Polish (pl-PL) and Ukrainian (uk-UA) locale on the Data Grid

Special thanks go out to the community contributors who have helped make this release possible:
@pawelkula, @Neonin.
Following are all team members who have contributed to this release:
@cherniavskii, @JCQuintas, @oliviertassinari, @arminmeh and @LukasTy

### Data Grid

#### `@mui/x-data-grid@7.27.0`

- [DataGrid] Add `resetPageOnSortFilter` prop that resets the page after sorting and filtering (#16580) @arminmeh
- [DataGrid] Avoid `undefined` value for pagination `rowCount` (#16558) @cherniavskii
- [l10n] Improve Polish (pl-PL) locale (#16594) @pawelkula
- [l10n] Improve Ukrainian (uk-UA) locale (#16593) @Neonin

#### `@mui/x-data-grid-pro@7.27.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.27.0`.

#### `@mui/x-data-grid-premium@7.27.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.27.0`, plus:

- [DataGridPremium] Fix Excel export Web Worker demo not working in dev mode (#16532) @cherniavskii
- [DataGridPremium] Improve Excel export serialization performance (#16545) @cherniavskii
- [DataGridPremium] Namespace Excel export worker (#16539) @oliviertassinari

### Date and Time Pickers

#### `@mui/x-date-pickers@7.27.0`

Internal changes.

#### `@mui/x-date-pickers-pro@7.27.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.27.0`, plus:

- [DateRangePicker] Avoid unnecessary field section focusing (#16569) @LukasTy

### Charts

#### `@mui/x-charts@7.27.0`

Internal changes.

#### `@mui/x-charts-pro@7.27.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

- [charts-pro] Fix automatic type overloads (#16579) @JCQuintas

### Core

- [test] Fix Data Grid data source error test on React 18 (#16565) @arminmeh

## 7.26.0

_Feb 7, 2025_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- ⚡ Mount and resize performance improvements for the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@lauri865.
Following are all team members who have contributed to this release:
@arminmeh, @noraleonte, @LukasTy, @KenanYusuf, @flaviendelangle.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.26.0`

- [DataGrid] Avoid `<GridRoot />` double-render pass on mount in SPA mode (#16480) @lauri865

#### `@mui/x-data-grid-pro@7.26.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.26.0`, plus:

- [DataGridPro] Fix the return type of `useGridApiContext()` for Pro and Premium packages on React < 19 (#16446) @arminmeh

#### `@mui/x-data-grid-premium@7.26.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.26.0`, plus:

- [DataGridPremium] Fix "no rows" overlay not showing with active aggregation (#16468) @KenanYusuf

### Date and Time Pickers

#### `@mui/x-date-pickers@7.26.0`

Internal changes.

#### `@mui/x-date-pickers-pro@7.26.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.26.0`, plus:

- [DateRangePicker] Fix `currentMonthCalendarPosition` prop behavior on mobile (#16457) @LukasTy
- [DateRangePicker] Fix vertical alignment for multi input fields (#16490) @noraleonte

### Charts

#### `@mui/x-charts@7.26.0`

Internal changes.

#### `@mui/x-charts-pro@7.26.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.26.0`.

### Tree View

#### `@mui/x-tree-view@7.26.0`

Internal changes.

#### `@mui/x-tree-view-pro@7.26.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@7.26.0`.

### Core

- [core] Fix corepack and pnpm installation in CircleCI (#16452) @flaviendelangle

## 7.25.0

_Jan 31, 2025_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@k-rajat19, @lauri865.
Following are all team members who have contributed to this release:
@KenanYusuf, @MBilalShafi, @arminmeh.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.25.0`

- [DataGrid] Fix `renderContext` calculation with scroll bounce / over-scroll (#16368) @lauri865
- [DataGrid] Refactor row state propagation (#16351) @lauri865
- [DataGrid] Add missing style overrides (#16272) (#16358) @KenanYusuf
- [DataGrid] Fix header filters keyboard navigation when there are no rows (#16369) @k-rajat19
- [DataGrid] Fix order of `onClick` prop on toolbar buttons (#16364) @KenanYusuf
- [DataGrid] Improve test coverage of server side data source (#15988) @MBilalShafi
- [DataGrid] Remove outdated warning (#16370) @MBilalShafi
- [DataGrid] Respect width of `iconContainer` during autosizing (#16409) @michelengelen

#### `@mui/x-data-grid-pro@7.25.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.25.0`, plus:

- [DataGridPro] Fix the return type of `useGridApiRef` for Pro and Premium packages on React < 19 (#16348) @arminmeh
- [DataGridPro] Fetch new rows only once when multiple models are changed in one cycle (#16382) @arminmeh

#### `@mui/x-data-grid-premium@7.25.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.25.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.25.0`

Internal changes.

#### `@mui/x-date-pickers-pro@7.25.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.25.0`.

### Charts

#### `@mui/x-charts@7.25.0`

Internal changes.

#### `@mui/x-charts-pro@7.25.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.25.0`.

### Tree View

#### `@mui/x-tree-view@7.25.0`

Internal changes.

#### `@mui/x-tree-view-pro@7.25.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@7.25.0`.

### Docs

- [docs] Improve release documentation (#16322) @MBilalShafi

### Core

- [test] Fix flaky data source tests in DataGrid (#16382) @lauri865

## 7.24.1

_Jan 24, 2025_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 🌍 Improve Persian (fa-IR) locale on the Data Grid

Special thanks go out to the community contributors who have helped make this release possible:
@mostafaRoosta74, @lauri865.

Following are all team members who have contributed to this release:
@alexfauquette, @JCQuintas, @cherniavskii, @LukasTy, @arminmeh.

### Data Grid

#### `@mui/x-data-grid@7.24.1`

- [DataGrid] Fix toggling preference panel from toolbar (#16276) @lauri865
- [DataGrid] Only try to mount filter button if there are filters present (#16269) @lauri865
- [DataGrid] Revert `apiRef` to be `MutableRefObject` for React versions < 19 (#16320) @arminmeh
- [l10n] Improve Persian (fa-IR) locale (#15964) @mostafaRoosta74

#### `@mui/x-data-grid-pro@7.24.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.24.1`.

#### `@mui/x-data-grid-premium@7.24.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.24.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.24.1`

- [fields] Reset `all` selected state on section edit (#16232) @LukasTy

#### `@mui/x-date-pickers-pro@7.24.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.24.1`.

### Charts

#### `@mui/x-charts@7.24.1`

- [charts] Handle case where gradient stop `offset` could be `Infinite` (@JCQuintas) (#16309) @JCQuintas

#### `@mui/x-charts-pro@7.24.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.24.1`.

### Tree View

#### `@mui/x-tree-view@7.24.1`

Internal changes.

#### `@mui/x-tree-view-pro@7.24.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@7.24.1`.

### Docs

- [docs] Fix `domainLimit` definition (#16271) @alexfauquette

### Core

- [core] Make `@mui/x-internals` a dependency of `@mui/x-license` (#16265) @alexfauquette
- [test] Fix flaky column pinning tests (#16228) @cherniavskii
- [test] Fix flaky tests (#16264) @lauri865

## 7.24.0

_Jan 17, 2025_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🔄 Data Grid [Scroll restoration](https://v7.mui.com/x/react-data-grid/scrolling/#scroll-restoration)
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@lauri865, @AxharKhan.
Following are all team members who have contributed to this release:
@KenanYusuf, @arminmeh, @cherniavskii, @michelengelen, @samuelsycamore, @LukasTy.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.24.0`

- [DataGrid] Fix resizing right pinned column (#16193) @KenanYusuf
- [DataGrid] Improve scrollbar deadzone with overlay scrollbars (#16212) @lauri865
- [DataGrid] Scroll restoration (#16208) @lauri865
- [DataGrid] Fix row, cell and header memoizations (#16195) @lauri865
- [l10n] Improve Urdu (ur-PK) locale (#16081) @AxharKhan

#### `@mui/x-data-grid-pro@7.24.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.24.0`, plus:

- [DataGridPro] Add test for column pinning with disabled column virtualization (#16196) @cherniavskii
- [DataGridPro] Fix width of right-pinned column group during resize (#16207) @cherniavskii

#### `@mui/x-data-grid-premium@7.24.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.24.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.24.0`

Internal changes.

#### `@mui/x-date-pickers-pro@7.24.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.24.0`.

### Charts

#### `@mui/x-charts@7.24.0`

Internal changes.

#### `@mui/x-charts-pro@7.24.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.24.0`.

### Tree View

#### `@mui/x-tree-view@7.24.0`

Internal changes.

#### `@mui/x-tree-view-pro@7.24.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@7.24.0`.

### Docs

- [docs] Copyedit the Data Grid cell selection page (#16213) @samuelsycamore
- [docs] Fix demo rendering issue on CodeSandbox (#16129) @arminmeh

### Core

- [core] Type all references as `RefObject` (#16125) @arminmeh
- [code-infra] Refactor `react` and `react-dom` definitions to simplify dep resolving (#16214) @LukasTy
- [infra] Improve cherry-pick action target list (#16188) @michelengelen
- [test] Fix flaky column pinning unit test (#16209) @cherniavskii

## 7.23.6

_Jan 9, 2025_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Chinese (Taiwan) (zh-TW) locale on the Date and Time Pickers
- 🌍 Improve Norwegian (nb-NO) locale on the Date and Time Pickers
- 🌍 Improve Dutch (nl-NL) locale on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@josteinjhauge, @derek-0000, @nusr, @k-rajat19, @tomashauser.
Following are all team members who have contributed to this release:
@flaviendelangle, @LukasTy, @MBilalShafi, @arminmeh, @oliviertassinari, @cherniavskii.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.23.6`

- [DataGrid] Improve React 19 support (#16048) @LukasTy
- [DataGrid] Add `name` attribute to selection checkboxes (#16041) @derek-0000
- [DataGrid] Fix number filter field formatting values while typing (#16068) @arminmeh
- [DataGrid] Fix select all checkbox state reset with server side data (#16039) @MBilalShafi

#### `@mui/x-data-grid-pro@7.23.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.23.6`.

#### `@mui/x-data-grid-premium@7.23.6` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.23.6`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.23.6`

- [pickers] Improve React 19 support (#16048) @LukasTy
- [l10n] Add Chinese (Taiwan) (zh-TW) locale (#16057) @nusr
- [l10n] Improve Norwegian (nb-NO) locale (#16083) @josteinjhauge
- [pickers] Support `date-fns-jalali` v4 (#16013) @LukasTy

#### `@mui/x-date-pickers-pro@7.23.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.23.6`.

### Charts

#### `@mui/x-charts@7.23.6`

- [charts] Improve React 19 support (#16048) @LukasTy
- [charts] Fix 301 redirection in the API documentation @oliviertassinari

#### `@mui/x-charts-pro@7.23.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.23.6`.

### Tree View

#### `@mui/x-tree-view@7.23.6`

- [TreeView] Improve React 19 support (#16048) @LukasTy

#### `@mui/x-tree-view-pro@7.23.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@7.23.6`.

### Docs

- [docs] Fix `EditingWithDatePickers` demo (#16047) @k-rajat19
- [docs] Fix doc warning for automatic children selection on tree view (#16037) @flaviendelangle
- [docs] Fix non-existing "adapter" property of `LocalizationProvider` (#16088) @tomashauser

### Core

- [core] Clarify the release strategy (#16012) @MBilalShafi
- [core] Update the `release:version` docs (#16040) @cherniavskii

## 7.23.5

_Dec 27, 2024_

Here are some highlights ✨:

- 🐞 Fix version mismatch issue in Data Grid codesandbox/stackblitz demos

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.23.5`

No changes since `@mui/x-data-grid@v7.23.4`.

#### `@mui/x-data-grid-pro@7.23.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.23.5`.

#### `@mui/x-data-grid-premium@7.23.5` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.23.5`.

## 7.23.4

_Dec 27, 2024_

We'd like to offer a big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Dutch (nl-NL) locale on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community contributor who has helped make this release possible:
@JoepVerkoelen.
Following are all team members who have contributed to this release:
@arminmeh, @oliviertassinari.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.23.4`

- [DataGrid] Fix header filters showing clear button while empty (#15990) @k-rajat19
- [DataGrid] Replace `forwardRef` with a shim for forward compatibility (#15984) @lauri865
- [l10n] Improve Dutch (nl-NL) locale (#15920) @JoepVerkoelen

#### `@mui/x-data-grid-pro@7.23.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.23.4`.

#### `@mui/x-data-grid-premium@7.23.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.23.4`, plus:

- [DataGridPremium] Fix column pinning with checkbox selection and row grouping (#15949) @k-rajat19

### Docs

- [docs] Fix outdated link to handbook (#15855) @oliviertassinari

## 7.23.3

_Dec 19, 2024_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Korean (ko-KR) locale on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@k-rajat19, @good-jinu.
Following are all team members who have contributed to this release:
@KenanYusuf, @MBilalShafi, @arminmeh, @flaviendelangle.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.23.3`

- [DataGrid] Allow passing custom props to `.main` element (#15919) @MBilalShafi
- [DataGrid] Consider `columnGroupHeaderHeight` prop in `getTotalHeaderHeight` method (#15927) @k-rajat19
- [DataGrid] Deprecate `indeterminateCheckboxAction` prop (#15862) @MBilalShafi
- [DataGrid] Fix `aria-label` value for group checkboxes (#15861) @MBilalShafi
- [DataGrid] Fix autosizing with virtualized columns (#15929) @k-rajat19
- [DataGrid] Round dimensions to avoid subpixel rendering error (#15873) @KenanYusuf
- [DataGrid] Toggle menu on click in `<GridActionsCell />` (#15871) @k-rajat19
- [DataGrid] Trigger row spanning computation on rows update (#15872) @MBilalShafi
- [l10n] Improve Korean (ko-KR) locale (#15906) @good-jinu

#### `@mui/x-data-grid-pro@7.23.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.23.3`.

#### `@mui/x-data-grid-premium@7.23.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.23.3`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.23.3`

- [pickers] Add verification to disable skipped hours in spring forward DST (#15918) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.23.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.23.3`.

## 7.23.2

_Dec 12, 2024_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Romanian and Turkish locales on the Data Grid
- 🌍 Improve Romanian locale on the Pickers
- 📚 Documentation improvements
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@ihsanberkozcan, @k-rajat19, @lhilgert9, @nusr, @rares985.

Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @flaviendelangle, @JCQuintas, @KenanYusuf, @LukasTy.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.23.2`

- [DataGrid] Fix "No rows" displaying when all rows are pinned (#15851) @nusr
- [DataGrid] Use `columnsManagement` slot (#15821) @k-rajat19
- [l10n] Improve Romanian (ro-RO) locale (#15751) @rares985
- [l10n] Improve Turkish (tr-TR) locale (#15748) @ihsanberkozcan

#### `@mui/x-data-grid-pro@7.23.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.23.2`, plus:

- [DataGridPro] Make Row reordering work with pagination (#15782) @k-rajat19

#### `@mui/x-data-grid-premium@7.23.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.23.2`, plus:

- [DataGridPremium] Fix group column ignoring `valueOptions` for `singleSelect` column type (#15754) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@7.23.2`

- [l10n] Improve Romanian (ro-RO) locale (#15751) @rares985

#### `@mui/x-date-pickers-pro@7.23.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.23.2`.

### Charts

#### `@mui/x-charts@7.23.2`

- [charts] Fix key generation for the ChartsGrid (#15864) @alexfauquette
- [charts] Fix scatter dataset with missing data (#15804) @alexfauquette

#### `@mui/x-charts-pro@7.23.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.23.2`.

#### `@mui/x-tree-view@v7.23.2`

No changes, releasing to keep the versions in sync.

#### `@mui/x-tree-view-pro@7.23.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Releasing to benefit from license package fix (#15818).

### Docs

- [docs] Fix typo in charts axis documentation (#15746) @JCQuintas
- [docs] Improve Pickers accessible DOM structure description (#15752) @LukasTy
- [docs] Use `updateRows` method for list view demos (#15824) @KenanYusuf
- [docs] Use date library version from package dev dependencies for sandboxes (#15767) @LukasTy

### Core

- [core] Add `@mui/x-tree-view-pro` to `releaseChangelog` (#15747) @flaviendelangle
- [license] Use `console.log` for the error message on CodeSandbox to avoid rendering error (#15818) @arminmeh

## 7.23.1

_Dec 5, 2024_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve German locale on the Data Grid component
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@lhilgert9.

Following are all team members who have contributed to this release:
@arthurbalduini, @cherniavskii, @flaviendelangle, @JCQuintas, @LukasTy and @MBilalShafi.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.23.1`

- [DataGrid] Make column autosizing work with flex columns (#15712) @cherniavskii
- [l10n] Improve German (de-DE) locale (#15641) @lhilgert9

#### `@mui/x-data-grid-pro@7.23.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.23.1`, plus:

- [DataGridPro] Cleanup pinned rows on removal (#15702) @cherniavskii

#### `@mui/x-data-grid-premium@7.23.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.23.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.23.1`

- [TimePicker] Prevent mouse events after `touchend` event (#15430) @arthurbalduini

#### `@mui/x-date-pickers-pro@7.23.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.23.1`.

### Charts

#### `@mui/x-charts@7.23.1`

- [charts] Improve SVG `pattern` and `gradient` support (#15724) @JCQuintas

#### `@mui/x-charts-pro@7.23.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.23.1`.

### Docs

- [docs] Fix Pickers theme augmentation example (#15675) @LukasTy
- [docs] Remove duplicated warning (#15715) @cherniavskii
- [test] Force hover in headless Chrome (#15711) @cherniavskii
- [docs-infra] Bump `@mui/internal-markdown` to support nested demo imports (#15738) @alexfauquette
- [docs] Improve SEO titles for the Data Grid (#15695) @MBilalShafi

### Core

- [core] Add `@mui/x-tree-view-pro` to `releaseChangelog` (#15747) @flaviendelangle

## 7.23.0

_Nov 29, 2024_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- ✨ Support for a new display mode on the Data Grid with the [List View feature](https://mui.com/x/react-data-grid/list-view/), offering an extremely flexible way to render datasets and enabling developers to adapt how data is displayed across different screen sizes.

  https://github.com/user-attachments/assets/61286adc-03fc-4323-9739-8ca726fcc16c

- ⚛️ React 19 support
- 📚 Documentation improvements
- 🌍 Improve Spanish, Portuguese, Chinese locales on the Data Grid component.
- 🌍 Improve Dutch locale on the Date and Time Picker components.
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@dloeda, @headironc, @mathzdev, @nphmuller, @lhilgert9, @lauri865.
Following are all team members who have contributed to this release:
@oliviertassinari, @arminmeh, @KenanYusuf, @flaviendelangle, @MBilalShafi.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@v7.23.0`

- [DataGrid] React 19 support (#15557) @arminmeh
- [DataGrid] Change test dom check from `/jsdom/` to `/jsdom|HappyDOM/`. (#15642) @jedesroches
- [DataGrid] Fix last separator not being hidden when grid is scrollable (#15551) @KenanYusuf
- [DataGrid] Fix order of spread props on toolbar items (#15556) @KenanYusuf
- [DataGrid] Fix row-spanning in combination with column-pinning (#15460) @lhilgert9
- [DataGrid] Improve resize performance (#15592) @lauri865
- [DataGrid] Support column virtualization with dynamic row height (#15567) @cherniavskii
- [DataGrid] Improve `GridCell` performance (#15621) @lauri865
- [l10n] Improve Chinese (zh-CN) locale (#15570) @headironc
- [l10n] Improve Portuguese (pt-PT) locale (#15561) @mathzdev

#### `@mui/x-data-grid-pro@v7.23.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@v7.23.0`, plus:

- [DataGridPro] Fix header filtering with `boolean` column type (#15640) @k-rajat19
- [DataGridPro] Fix pagination state not updating if the data source response has no rows (#15643) @zinoroman
- [DataGridPro] Fix selection propagation issue on initialization (#15593) @MBilalShafi

#### `@mui/x-data-grid-premium@v7.23.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@v7.23.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@v7.23.0`

- [pickers] React 19 support (#15557) @arminmeh
- [pickers] Fix DST issue with `America/Asuncion` timezone and `AdapterMoment` (#15653) @flaviendelangle
- [pickers] Use `props.referenceDate` timezone when `props.value` and `props.defaultValue` are not defined (#15544) @flaviendelangle
- [l10n] Improve Dutch (nl-NL) locale (#15564) @nphmuller

#### `@mui/x-date-pickers-pro@v7.23.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@v7.23.0`.

### Charts

#### `@mui/x-charts@v7.23.0`

- [charts] React 19 support (#15557) @arminmeh
- [charts] Prevent invalid `releasePointerCapture` (#15609) @alexfauquette

#### `@mui/x-charts-pro@v7.23.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@v7.23.0`.

### Tree View

#### `@mui/x-tree-view@v7.23.0`

- [TreeView] React 19 support (#15557) @arminmeh

#### `@mui/x-tree-view-pro@7.23.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@7.23.0`.

### Docs

- [docs] Add data caching to lazy loaded detail panel demo (#15555) @cherniavskii
- [docs] Remove selectors section from list view docs (#15639) @KenanYusuf
- [docs] Add documentation for the list view feature (#15344) @KenanYusuf

### Core

- [core] Update @mui/monorepo (#15574) @oliviertassinari

## 7.22.3

_Nov 21, 2024_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 📊 Charts Pro get stable. The [zoom](https://mui.com/x/react-charts/zoom-and-pan/) and [Heatmap](https://mui.com/x/react-charts/heatmap/) are now stable.
- 🌍 Improve Chinese, Spanish, Swedish, and Turkish locales on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@CarlosLopezLg, @headironc, @viktormelin, @qerkules, @DungTiger, @hendrikpeilke, @k-rajat19.
Following are all team members who have contributed to this release:
@alexfauquette, @LukasTy, @MBilalShafi, @flaviendelangle.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.22.3`

- [DataGrid] Add prop to override search input props in `GridColumnsManagement` (#15476) @k-rajat19
- [DataGrid] Add test coverage for issues fixed in #15184 @MBilalShafi
- [DataGrid] Fix memoized selectors with arguments (#15336) @MBilalShafi
- [DataGrid] Fix right column group header border with virtualization (#15503) @hendrikpeilke
- [DataGrid] Pass reason to `onPaginationModelChange` (#15402) @DungTiger
- [DataGrid] Set default overlay height in flex parent layout (#15535) @cherniavskii
- [l10n] Improve Chinese (zh-CN) locale (#15365) @headironc
- [l10n] Improve Spanish (es-ES) locale (#15369) @CarlosLopezLg
- [l10n] Improve Swedish (sv-SE) locale (#15371) @viktormelin
- [l10n] Improve Turkish (tr-TR) locale (#15414) @qerkules

#### `@mui/x-data-grid-pro@7.22.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.22.3`.

#### `@mui/x-data-grid-premium@7.22.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.22.3`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.22.3`

- [pickers] Always use `props.value` when it changes (#15500) @flaviendelangle
- [pickers] Ensure internal value timezone is updated (#15491) @LukasTy
- [pickers] Fix `DateTimeRangePicker` error when using format without time (#15341) @fxnoob
- [pickers] Fix unused code in `PickersToolbar` component (#15525) @LukasTy

#### `@mui/x-date-pickers-pro@7.22.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.22.3`, plus:

- [DateTimeRangePicker] Use time in `referenceDate` when selecting date (#15431) @LukasTy

### Charts

#### `@mui/x-charts@7.22.3`

No changes since `@mui/x-charts@7.22.2`.

#### `@mui/x-charts-pro@7.22.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

- [charts-pro] Fix missing typeOverload (#15400) @alexfauquette

### Docs

- [docs] Add `PickersPopper` component to customization playground (#15397) @LukasTy
- [docs] Add `next` version links (#15423) @LukasTy
- [docs] Use the `loading` state in the demos (#15538) @cherniavskii
- [docs] Add data caching to lazy loaded detail panel demo (#15506) @cherniavskii
- [code-infra] Tentative fix for Argos flaky screenshot tests (#15399) @JCQuintas
- [docs-infra] Transpile `.ts` demo files (#15421) @KenanYusuf
- [core] Clarify release version bump strategy (#15536) @cherniavskii

## 7.22.2

_Nov 8, 2024_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 👨🏽‍💻 API enhancements
- 🐞 Bugfixes

Special thanks go out to the community contributors who have helped make this release possible:
@clins1994, @GuillaumeMeheut, @k-rajat19.
Following are all team members who have contributed to this release:
@LukasTy, @MBilalShafi, @KenanYusuf, @arminmeh.

### Upcoming alpha

Keep an eye out for the MUI⠀X `v8.0.0-aplha.0` release soon. It will follow a weekly release schedule as always until it is stable.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.22.2`

- [DataGrid] Fix `null` reference error in `GridVirtualScrollbar` (#15289) @MBilalShafi
- [DataGrid] Fix filtering with `boolean` column type (#15257) @k-rajat19
- [DataGrid] Improve row selection propagation trigger (#15274) @MBilalShafi
- [DataGrid] Preprocess edit cell props on backspace/delete (#15223) @KenanYusuf
- [DataGrid] Add a recipe to persist column width and order (#15309) @MBilalShafi

#### `@mui/x-data-grid-pro@7.22.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.22.2`, plus:

- [DataGridPro] Apply default properties if they are not passed in a reorder column (#15320) @k-rajat19
- [DataGridPro] Toggle row expansion with `Enter` key in Tree data (#15313) @k-rajat19

#### `@mui/x-data-grid-premium@7.22.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.22.2`, plus:

- [DataGridPremium] Fix incorrect rows selection count when selection propagation is enabled with row grouping (#15222) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@7.22.2`

- [pickers] Add support for `moment-hijri@3.0.0` (#15248) @LukasTy

#### `@mui/x-date-pickers-pro@7.22.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.22.2`.

### Charts

#### `@mui/x-charts@7.22.2`

- [charts] Allow `SeriesValueFormatter` to return `null` value (#15295) @clins1994
- [charts] Allow configuring the `domainLimit` for each axis. (#15325) @GuillaumeMeheut

#### `@mui/x-charts-pro@7.0.0-beta.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.22.2`.

## 7.22.1

_Nov 1, 2024_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 📚 Documentation improvements
- 🌍 Improve Polish (pl-PL) locale on the Date Pickers

Special thanks go out to the community contributors who have helped make this release possible:
@wojtkolos, @dpak-maurya, @k-rajat19.
Following are all team members who have contributed to this release:
@LukasTy, @arminmeh, @MBilalShafi, @KenanYusuf, @flaviendelangle.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.22.1`

- [DataGrid] Fix right column group header border (#15152) @KenanYusuf
- [DataGrid] Fix scroll jump when holding down arrow keys (#15167) @arminmeh
- [DataGrid] Move `rowGroupingModelChange` handler to respective hook (#15127) @MBilalShafi
- [DataGrid] Prevent error when deleting the last row (#15153) @dpak-maurya
- [DataGrid] Fix overlay height in autoHeight mode (#15205) @cherniavskii

#### `@mui/x-data-grid-pro@7.22.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.22.1`, plus:

- [DataGridPro] Add list view tests (#15166) @KenanYusuf

#### `@mui/x-data-grid-premium@7.22.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

- [DataGridPremium] Keep focus on the grouping cell on space bar press #15155 @k-rajat19

### Date and Time Pickers

#### `@mui/x-date-pickers@7.22.1`

- [l10n] Improve Polish (pl-PL) locale (#15177) @wojtkolos

#### `@mui/x-date-pickers-pro@7.22.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.22.1`.

### Tree View

#### `@mui/x-tree-view@7.22.1`

- [TreeView] Export `TreeItem2DragAndDropOverlay` and `TreeItem2LabelInput` from the root of each package (#15208) @flaviendelangle
- [TreeView] Fix drag and drop color usage (#15149) @LukasTy

#### `@mui/x-tree-view-pro@7.22.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@7.22.1`.

### Docs

- [docs] Add section explaining how to keep the selection while filtering in Data grid docs (#15199) @arminmeh

## 7.22.0

_Oct 25, 2024_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🛰 Introduce [server-side support for Data Grid row grouping](https://mui.com/x/react-data-grid/server-side-data/row-grouping/)
- 🐞 Bugfixes
- 📚 Documentation improvements
- 🌍 Improve Portuguese (pt-BR) locale on the Data Grid component

Special thanks go out to the community contributors who have helped make this release possible:
@clins1994, @GITPHLAP, @k-rajat19, @kalyan90, @merotosc, @yash49.
Following are all team members who have contributed to this release:
@cherniavskii, @flaviendelangle, @LukasTy, @MBilalShafi, @romgrk.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.22.0`

- [DataGrid] Fix `GridPanelAnchor` positioning (#15022) @k-rajat19
- [DataGrid] Fix ugly prop-types for the `pageStyle` prop of the `GridPrintExportMenuItem` component (#15015) @flaviendelangle
- [DataGrid] Fix value type in filter model for number and boolean column type (#14733) @k-rajat19
- [DataGrid] Focus next row when the focused row is deleted (#15067) @cherniavskii
- [DataGrid] Remove some usages of `<Box />` and `<Badge />` (#15013) @romgrk
- [DataGrid] Fix number of rows to display for page size options with negative value (#14890) @kalyan90
- [l10n] Improve Portuguese (pt-BR) locale (#15021) @k-rajat19

#### `@mui/x-data-grid-pro@7.22.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.22.0`, plus:

- [DataGridPro] Fix column pinning layout (#15073) @cherniavskii

#### `@mui/x-data-grid-premium@7.22.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.22.0`, plus:

- [DataGridPremium] Server-side data source with row grouping (#15109) @MBilalShafi

### Date and Time Pickers

#### `@mui/x-date-pickers@7.22.0`

- [pickers] Fix `DateCalendar` timezone management (#15119) @LukasTy
- [pickers] Fix `DigitalClock` time options on a `DST` switch day (#15092) @LukasTy

#### `@mui/x-date-pickers-pro@7.22.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.22.0`.

### Charts

#### `@mui/x-charts@7.22.0`

- [charts] Export data type in `onAxisClick(_, data)` callback (#15038) @clins1994

#### `@mui/x-charts-pro@7.0.0-beta.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.22.0`.

### Tree View

#### `@mui/x-tree-view@7.22.0`

- [TreeView] Make the cancellable event types public (#14992) @flaviendelangle

### Docs

- [docs] Fix typo in Tree View docs (#15047) @yash49

### Core

- [core] Adjust cherry-pick GH actions (#15101) @LukasTy
- [core] Update prettier target branch (#15100) @MBilalShafi
- [core] Update some `default-branch-switch` instances for `v7.x` (#15085) @MBilalShafi
- [test] Revert to using `fireEvent` instead of `userEvent` (#14927) @LukasTy

## 7.21.0

_Oct 17, 2024_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 💫 Added [`dataset` prop support for the Scatter Chart component](https://mui.com/x/react-charts/scatter/#using-a-dataset)
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community contributors who have helped make this release possible:
@k-rajat19, @kalyan90, @rotembarsela, @wangkailang.
Following are all team members who have contributed to this release:
@arthurbalduini, @cherniavskii, @flaviendelangle, @JCQuintas, @LukasTy, @MBilalShafi, @arminmeh, @romgrk, @KenanYusuf, @oliviertassinari, @samuelsycamore.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.21.0`

- [DataGrid] Fix `onRowSelectionModelChange` firing unnecessarily on initial render (#14909) @MBilalShafi
- [DataGrid] Fix `onRowSelectionModelChange` not being called after row is removed (#14972) @arminmeh
- [DataGrid] Fix pagination scrollbar issue on small zoom (#14911) @cherniavskii
- [DataGrid] Fix scroll jumping (#14929) @romgrk
- [DataGrid] Fix excessive white space at the end of the Data Grid (#14864) @kalyan90

#### `@mui/x-data-grid-pro@7.21.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.21.0`, plus:

- [DataGridPro] Fix indeterminate checkbox state for server-side data (#14956) @MBilalShafi
- [DataGridPro] Fix scrolling performance when `rowHeight={undefined}` (#14983) @cherniavskii
- [DataGridPro] List view (#14393) @KenanYusuf @cherniavskii

#### `@mui/x-data-grid-premium@7.21.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.21.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.21.0`

- [pickers] Cleanup `PageUp` and `PageDown` event handlers on time components (#14928) @arthurbalduini
- [pickers] Create the new picker's `ownerState` object (#14889) @flaviendelangle
- [pickers] Fix `PickerValidDate` usage in the Date Range Picker Toolbar (#14925) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.21.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.21.0`.

### Charts

#### `@mui/x-charts@7.21.0`

- [charts] Allow `dataset` to be used with the Scatter Chart (#14915) @JCQuintas
- [charts] Ensure `reduce motion` preference disables animation on page load (#14417) @JCQuintas

#### `@mui/x-charts-pro@7.0.0-beta.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.21.0`.

### Tree View

#### `@mui/x-tree-view@7.21.0`

- [TreeView] Fix `alpha()` usage with CSS variables (#14969) @wangkailang
- [TreeView] Fix usage of the `aria-selected` attribute (#14991) @flaviendelangle
- [TreeView] Fix hydration error (#15002) @flaviendelangle

### `@mui/x-codemod@7.21.0`

- [codemod] Add a new utility to rename imports (#14919) @flaviendelangle

### Docs

- [docs] Add recipe showing how to toggle detail panels on row click (#14666) @k-rajat19
- [docs] Fix broken link to the validation section in the Data grid component (#14973) @arminmeh
- [docs] Update v5 migration codesandbox @oliviertassinari
- [docs] Enforce component style rules for the Tree View (#14963) @samuelsycamore

### Core

- [core] Fix shortcut with localization keyboard (#14220) @rotembarsela
- [core] Fix docs deploy command (#14920) @arminmeh
- [code-infra] Prepare some tests to work in `vitest/playwright` (#14926) @JCQuintas
- [test] Fix `AdapterDayjs` coverage calculation (#14957) @LukasTy
- [test] Fix split infinitive API convention use @oliviertassinari

## 7.20.0

_Oct 11, 2024_

We'd like to offer a big thanks to the 14 contributors who made this release possible. Here are some highlights ✨:

- 📚 Updated ["What's new"](https://mui.com/x/whats-new/) page giving more detailed overview of the latest new features and other highlights
- 📚 New [collapsible column groups demo](https://mui.com/x/react-data-grid/column-groups/#collapsible-column-groups) for the Data Grid component
- 📚 New [Tree Item Customization](https://mui.com/x/react-tree-view/tree-item-customization/) documentation to learn how to use the new APIs to create custom Tree Items. The old APIs (`props.ContentComponent` and `props.ContentProps`) have been deprecated and will be removed in the new major version of the Tree View component.
- 🌍 Improve Japanese (ja-JP) locale on the Data Grid component
- 🐞 Bugfixes
- 📚 Other documentation improvements

Special thanks go out to the community contributors who have helped make this release possible:
@k-rajat19, @kalyan90, @uma-neko, @vfbiby.
Following are all team members who have contributed to this release: @alelthomas, @arminmeh, @arthurbalduini,
@cherniavskii, @flaviendelangle, @JCQuintas, @MBilalShafi, @noraleonte, @oliviertassinari, @samuelsycamore, @siriwatknp.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.20.0`

- [DataGrid] Add `onColumnHeaderContextMenu` event (#14734) @vfbiby
- [DataGrid] Avoid row spanning computation of outdated rows (#14902) @MBilalShafi
- [DataGrid] Fix scrollbar position not being updated after `scrollToIndexes` (#14888) @arminmeh
- [DataGrid] Pass `rowId` param to `processRowUpdate` (#14821) @k-rajat19
- [l10n] Improve Japanese (ja-JP) locale (#14870) @uma-neko

#### `@mui/x-data-grid-pro@7.20.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.20.0`, plus:

- [DataGridPro] Fix wording on the `rowSelectionPropagation` JSDoc and doc section (#14907) @flaviendelangle

#### `@mui/x-data-grid-premium@7.20.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.20.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.20.0`

- [pickers] Add `PageUp` and `PageDown` support for time components (#14812) @arthurbalduini
- [pickers] Fix regression on `PickerValidDate` (#14896) @flaviendelangle
- [pickers] Move the `DateFieldInPickerProps` interface to the `DatePicker` folder and rename it `DatePickerFieldProps` (same for time and date time) (#14828) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.20.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.20.0`.

### Charts

#### `@mui/x-charts@7.20.0`

No changes since `@mui/x-charts@v7.19.0`.

#### `@mui/x-charts-pro@7.0.0-beta.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.20.0`.

### Tree View

#### `@mui/x-tree-view@7.20.0`

- [TreeItem] Deprecate the `ContentComponent` and `ContentProps` props (#14908) @flaviendelangle
- [TreeView] Rework how items are being rendered in Rich Tree View components (#14749) @flaviendelangle

### Docs

- [docs] Update "What's new" page (#14858) @cherniavskii
- [docs] Add collapsible column groups demo (#14818) @cherniavskii
- [docs] Add custom columns panel demo (#14825) @cherniavskii
- [docs] Capitalize all instances of "Data Grid" (#14884) @samuelsycamore
- [docs] Divide charts `tooltip` and `highlighting` pages (#14824) @JCQuintas
- [docs] Document the `<TreeItem2 />` component and the `useTreeItem2` hook (#14551) @noraleonte
- [docs] Fix column pinning for "Disable detail panel content scroll" section (#14854 and #14885) @kalyan90
- [docs] Fix detail panel demo not working well with pinned columns (#14883) @cherniavskii
- [docs] New recipe of a read-only field (#14606) @flaviendelangle
- [docs] Change demo name example (#14822) @alelthomas

### Core

- [core] Support `@mui/utils` v6 (#14867) @siriwatknp
- [code-infra] Remove deprecated `data-mui-test` in favour of `data-testid` (#14882) @JCQuintas
- [code-infra] Update renovate config and add a `vitest` group (#14856) @JCQuintas
- [test] Replace `waitFor()` with `act()` (#14851) @oliviertassinari
- [test] Restore "pnpm tc" CLI (#14852) @oliviertassinari

## 7.19.0

_Oct 4, 2024_

We'd like to offer a big thanks to the 26 contributors who made this release possible. Here are some highlights ✨:

- 🔁 Automatic parents and children selection for Data Grid ["tree data"](https://mui.com/x/react-data-grid/tree-data/) and ["row grouping"](https://mui.com/x/react-data-grid/row-grouping/) features
- 💫 Support `minHeight` and `maxHeight` on flex parent container for the Data Grid component
- 🎁 Export `publicAPI` from the `useTreeItem2Utils` hook for the Tree View
- 🌍 Improve Bulgarian (bg-BG), Croatian (hr-HR), French (fr-FR), German (de-DE), Japanese (ja-JP) and Vietnamese (vi-VN) locales and add Portuguese (pt-PT) locale on the Data Grid component
- 🌏 Improve Czech (cs-CZ) and Portuguese (pt-BR) locales and add Bulgarian (bg-BG), Croatian (hr-HR) and Portuguese (pt-PT) locales on the Pickers components
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks goes out to our community contributors who have helped make this release possible:
@AWAIS97, @chucamphong, @GMchris, @JakubSveda, @k-rajat19, @k725, @lhilgert9, @ruiaraujo012, @Sanderand, @thomasmoon, @vallereaugabriel.
Following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @arthurbalduini, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @KenanYusuf, @MBilalShafi, @michelengelen, @noraleonte, @oliviertassinari, @romgrk, @sai6855, @samuelsycamore.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.19.0`

- [DataGrid] Fix column definition `undefined` value (#14456) @sai6855
- [DataGrid] Fix `checkboxSelectionVisibleOnly` reset the selection on filtering (#14677) @MBilalShafi
- [DataGrid] Fix background colors when `CSSVarsProvider` is used (#12901) @cherniavskii
- [DataGrid] Fix error when initializing aggregation with row spanning (#14710) @MBilalShafi
- [DataGrid] Fix scroll to cell logic for keyboard navigating cells and drag selection with pinned columns (#14550) @KenanYusuf
- [DataGrid] Support `minHeight` and `maxHeight` on flex parent container (#14614) @cherniavskii
- [l10n] Add missing Portuguese (pt-PT) translations (#14707) @ruiaraujo012
- [l10n] Improve Bulgarian (bg-BG) locale (#14451) @GMchris
- [l10n] Improve Croatian (hr-HR) locale (#14794) @arminmeh
- [l10n] Improve French (fr-FR) locale (#14750) @vallereaugabriel
- [l10n] Improve German (de-DE) locale (#14755) @lhilgert9
- [l10n] Improve Japanese (ja-JP) locale (#14381) @k725
- [l10n] Improve Vietnamese (vi-VN) locale (#14769) @chucamphong

#### `@mui/x-data-grid-pro@7.19.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.19.0`, plus:

- [DataGridPro] Fix dragging styles removal in column reorder (#14680) @k-rajat19
- [DataGridPro] Fix row pre-processing running with a stale data source (#14810) @MBilalShafi
- [DataGridPro] Fix `onRowsScrollEnd` not firing on very fast scrolling (#14171) @arminmeh

#### `@mui/x-data-grid-premium@7.19.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.19.0`, plus:

- [DataGridPremium] Automatic parents and children selection (#13757) @MBilalShafi

### Date and Time Pickers

#### `@mui/x-date-pickers@7.19.0`

- [pickers] Fix left-right keyboard nav with `yearsOrder="desc"` and `direction="rtl"` (#14682) @thomasmoon
- [pickers] Improve `PickerValidDate` type (#14771) @flaviendelangle
- [pickers] Improve typing of the range pickers (#14716) @flaviendelangle
- [l10n] Add Bulgarian (bg-BG) locale (#14469) @GMchris
- [l10n] Add Croatian (hr-HR) locale (#14795) @arminmeh
- [l10n] Add Portuguese (pt-PT) locale (#14722) @ruiaraujo012
- [l10n] Improve Czech (cs-CZ) locale (#14732) @JakubSveda
- [l10n] Improve Portuguese (pt-BR) locale (#14725) @arthurbalduini

#### `@mui/x-date-pickers-pro@7.19.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.19.0`.

### Charts

#### `@mui/x-charts@7.19.0`

- [charts] Fix `LineChart` area animation being stuck when resizing container (#14711) @alexfauquette
- [charts] Improve types and start using `warnOnce` (#14792) @JCQuintas

#### `@mui/x-charts-pro@7.0.0-beta.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.19.0`.

### Tree View

#### `@mui/x-tree-view@7.19.0`

- [TreeView] Apply experimental features in `getDefaultizedParams` instead of in the plugin render (#14661) @flaviendelangle
- [TreeView] Export `publicAPI` form `useTreeItem2Utils` (#14729) @noraleonte
- [TreeView] Fix cursor navigation interfering with browser shortcut keys (#14798) @sai6855
- [TreeView] Fix invalid test for items reordering (#14665) @flaviendelangle
- [TreeView] Remove `instance.getTreeItemIdAttribute` (#14667) @flaviendelangle

### Docs

- [docs] Added warning callout for Firefox reordering bug (#14516) @michelengelen
- [docs] Copyedit `pages.ts` navigation (#14782) @samuelsycamore
- [docs] Fix typo in row spanning doc (#14770) @flaviendelangle
- [docs] Fix typo in the Tree View migration guide to v7 (#14727) @Sanderand
- [docs] Fix typo in usage of Moment guide for UTC and timezones (#14780) @AWAIS97
- [docs] Fix what's new link to use absolute URL (#14543) @oliviertassinari

### Core

- [core] Fix class name composition order (#14775) @oliviertassinari
- [core] Replace minWidth, maxWidth with width (#14776) @oliviertassinari
- [code-infra] Remove custom playwright installation steps (#14728) @Janpot
- [code-infra] Replace or remove all instances of `e` identifier (#14724) @samuelsycamore
- [infra] Adds community contribution section to the changelog script (#14799) @michelengelen
- [infra] Fix line break in Stack Overflow message @oliviertassinari
- [test] Fix `Escape` event firing event (#14797) @oliviertassinari

## 7.18.0

_Sep 20, 2024_

We'd like to offer a big thanks to the 14 contributors who made this release possible. Here are some highlights ✨:

- 💫 Support [Row spanning](https://mui.com/x/react-data-grid/row-spanning/) on the Data Grid that automatically merges the consecutive cells in a column based on the cell value

  <img width="600" src="https://github.com/user-attachments/assets/d32ec936-d238-4c92-9e1a-af6788d74cdf" alt="Data Grid row spanning" />

- ⏰ Support `date-fns` v4 (#14673) @LukasTy
- 🎉 Add option for Pickers to change the order of displayed years (#11780) @thomasmoon
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.18.0`

- [DataGrid] Add default reset value in row edit mode (#14050) @michelengelen
- [DataGrid] Add `columnGroupHeaderHeight` prop for sizing column group headers (#14637) @KenanYusuf
- [DataGrid] Fix `document` reference when the grid is rendered in a popup window (#14649) @arminmeh
- [DataGrid] Remove `minFirstColumn` from `GetHeadersParams` interface (#14450) @k-rajat19
- [DataGrid] Row spanning (#14124) @MBilalShafi

#### `@mui/x-data-grid-pro@7.18.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.18.0`, plus:

- [DataGridPro] Fix `onRowsScrollEnd` being triggered instantly when bottom pinned row is present (#14602) @arminmeh
- [DataGridPro] Fix header filters rendering issue for `isEmpty` and `isNotEmpty` filter operators (#14493) @k-rajat19
- [DataGridPro] Fix pinned columns in RTL mode (#14586) @KenanYusuf

#### `@mui/x-data-grid-premium@7.18.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.18.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.18.0`

- [pickers] Add option to change the order of displayed years (#11780) @thomasmoon
- [pickers] Support `date-fns` v4 (#14673) @LukasTy

#### `@mui/x-date-pickers-pro@7.18.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.18.0`.

### Charts

#### `@mui/x-charts@7.18.0`

- [charts] Add a `PolarProvider` to manage polar axes (#14642) @alexfauquette
- [charts] Fix `LineChart` animation being stuck with initial drawing area value (#14553) @JCQuintas
- [charts] Fix legend slot typing (#14657) @alexfauquette
- [charts] Pass the axis index to extremum getter (#14641) @alexfauquette
- [charts] Provide hooks to create custom tooltip (#14377) @alexfauquette

#### `@mui/x-charts-pro@7.0.0-beta.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.18.0`.

### Tree View

#### `@mui/x-tree-view@7.18.0`

- [TreeView] Add `"use client"` directive to every public component and hook (#14579) @flaviendelangle

### Docs

- [docs] Add `groupingValueGetter` callout in column definition docs (#14599) @michelengelen
- [docs] Clean v6 => v7 migration guide (#14652) @flaviendelangle
- [docs] Copy `vale-action.yml` from main repo @oliviertassinari
- [docs] Edit the Pickers Getting started doc (#14555) @samuelsycamore
- [docs] Fix TypeScript capitalization @oliviertassinari
- [docs] Fix Vale error @oliviertassinari
- [docs] Make the migration guide diff a bit easier to read @oliviertassinari
- [docs] Report Vale at warning level (#14660) @oliviertassinari
- [docs] Warn about the `valueGetter` and `valueFormatter` signature change (#14613) @cherniavskii
- [docs] Polish code formatting (#14603) @oliviertassinari
- [test] Spy on `observe` method to avoid flaky wait for a callback (#14640) @arminmeh

### Core

- [core] Fix 301 link to Next.js and git diff @oliviertassinari
- [core] Fix failing CI on `master` (#14644) @cherniavskii
- [core] Fix `package.json` repository rule @oliviertassinari
- [core] MUI X repository moved to a new location @oliviertassinari
- [docs-infra] Strengthen CSP (#14581) @oliviertassinari
- [license] Finish renaming of LicensingModel (#14615) @oliviertassinari

## 7.17.0

_Sep 13, 2024_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 📊 Charts performance improvement
- 🧑‍💻 New Data Grid [custom columns demo](https://mui.com/x/react-data-grid/custom-columns/#full-example)
- 🐞 Bugfixes
- 📚 Documentation improvements
- 🌍 Improve Hungarian (hu-HU) locale on the Data Grid

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.17.0`

- [DataGrid] Add "does not equal" and "does not contain" filter operators (#14489) @KenanYusuf
- [DataGrid] Add demo to the "Custom columns" page that does not use generator (#13695) @arminmeh
- [DataGrid] Fix VoiceOver reading the column name twice (#14482) @arminmeh
- [DataGrid] Fix bug in CRUD example (#14513) @michelengelen
- [DataGrid] Fix failing jsdom tests caused by `:has()` selectors (#14559) @KenanYusuf
- [DataGrid] Refactor string operator filter functions (#14564) @KenanYusuf
- [l10n] Improve Hungarian (hu-HU) locale (#14506) @ntamas

#### `@mui/x-data-grid-pro@7.17.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.17.0`.

#### `@mui/x-data-grid-premium@7.17.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.17.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.17.0`

- [fields] Improve `useSplitFieldProps` and make it public (#14514) @flaviendelangle
- [pickers] Improve clear action label (#14243) @oliviertassinari
- [pickers] Add `"use client"` directive to every public component and hook (#14562) @flaviendelangle
- [pickers] Allow custom fields to validate the value (#14486) @flaviendelangle
- [pickers] Stop using utils in locales (#14505) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.17.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.17.0`, plus:

- [DateRangePicker] Fix `currentMonthCalendarPosition` not scrolling to future sibling (#14442) @GMchris

### Charts

#### `@mui/x-charts@7.17.0`

- [charts] Add `"use client"` directive to every public component and hook (#14578) @flaviendelangle
- [charts] Allow `onItemClick` on the `Legend` component (#14231) @JCQuintas
- [charts] Fix `onAxisClick` with `layout='horizontal'` (#14547) @alexfauquette
- [charts] Replace `path` with `circle` for performance improvement (#14518) @alexfauquette

#### `@mui/x-charts-pro@7.0.0-beta.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.17.0`.

### Tree View

#### `@mui/x-tree-view@7.17.0`

- [TreeView] Make `useTreeItem2` stable (#14498) @flaviendelangle

### Docs

- [docs] Add missing callout on "Imperative API" Tree View sections (#14503) @flaviendelangle
- [docs] Fix broken redirection to MUI X v5 @oliviertassinari
- [docs] Fix multiple `console.error` messages on `charts` docs (#14554) @JCQuintas
- [docs] Fixed typo in Row Grouping recipes (#14549) @Miodini
- [docs] Match title with blog posts @oliviertassinari

### Core

- [core] Move warning methods to `@mui/x-internals` (#14528) @k-rajat19
- [core] Sync with core release flow @oliviertassinari
- [code-infra] Fix charts benchmark workflow (#14573) @JCQuintas
- [docs-infra] Type interface API pages (#14138) @alexfauquette
- [infra] Create `ESLint plugins` renovate group (#14574) @LukasTy
- [license] Clean-up terminology to match codebase (#14531) @oliviertassinari
- [test] Remove dead `act()` logic (#14529) @oliviertassinari

## 7.16.0

_Sep 5, 2024_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🎨 Update the design of Data Grid column headers (#14293)
- 🧠 Add the `slots` concept introduction documentation page (#13881)
- 🌍 Improve Chinese (zh-CN) and Dutch (nl-NL) locales on the Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.16.0`

- [DataGrid] Add key prop to `GridFilterInputMultipleValue` (#14302) @sai6855
- [DataGrid] Allow to control the indeterminate checkbox behavior (#14247) @MBilalShafi
- [DataGrid] Column header design updates (#14293) @KenanYusuf
- [DataGrid] Fix error on simultaneous `columns` and `columnGroupingModel` update (#14368) @cherniavskii
- [DataGrid] Fix first row flickering with `autoHeight` prop enabled (#14235) @KenanYusuf
- [DataGrid] Remove cell min-width / max-width styles (#14448) @oliviertassinari
- [DataGrid] Restore reselect behavior (#14410) @romgrk
- [l10n] Improve Chinese (zh-CN) locale (#14394) @lawvs
- [l10n] Improve Dutch (nl-NL) locale (#14398) @Janpot

#### `@mui/x-data-grid-pro@7.16.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.16.0`, plus:

- [DataGridPro] Fix duplicate top border in header filters (#14375) @MBilalShafi

#### `@mui/x-data-grid-premium@7.16.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.16.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.16.0`

- [pickers] Improve `onError` JSDoc (#14492) @flaviendelangle
- [pickers] Keep the calendar header and content in sync when switching locale (#14125) @flaviendelangle
- [pickers] Move multi input range field validation tests to the describe test file (#14501) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.16.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.16.0`.

### Charts

#### `@mui/x-charts@7.16.0`

- [charts] Fix JSDoc typos (#14497) @alexfauquette
- [charts] Fix `LineChart` not properly animating when hydrating (#14355) @JCQuintas
- [charts] Fix theme augmentation (#14372) @alexfauquette
- [charts] Pass all props to legend (#14392) @JCQuintas
- [charts] Use `.mjs` extension for ESM build (#14387) @alexfauquette
- [charts] Update `package.json` for vendor package (#14465) @alexfauquette

#### `@mui/x-charts-pro@7.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.16.0`, plus:

- [charts-pro] Fix props and automated documentation on `BarChartPro` and `LineChartPro` (#14391) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.16.0`

- [TreeView] Clean label editing code (#14264) @flaviendelangle

### `@mui/x-codemod@7.16.0`

- [codemod] Fix `experimentalFeatures` codemod for typescript parser (#14150) @MBilalShafi

### Docs

- [docs] Add RTL documentation for the pickers (#13855) @flaviendelangle
- [docs] Add the `slots` concept introduction page (#13881) @flaviendelangle
- [docs] Remove TypeScript v3 outdated version mentions (#14443) @k-rajat19
- [docs] Remove notion of seats (#14351) @oliviertassinari
- [docs] Use real world data for `PieChart` examples (#14297) @JCQuintas

### Core

- [core] Fix changelog spelling @oliviertassinari
- [core] Fix failing tests on the pickers (#14457) @flaviendelangle
- [core] Reset permissions for codspeed GitHub Action (#14420) @oliviertassinari
- [code-infra] Add babel runtime version check (#14483) @Janpot
- [code-infra] Fully resolve imports in ESM target (#14234) @Janpot
- [code-infra] Update runners from node 18 to 20 (#14466) @JCQuintas
- [infra] Added `secrets: inherit` to workflow call (#14454) @michelengelen
- [infra] Switch "add closing message" to reusable workflow (#14499) @michelengelen
- [infra] Switch "issue triage workflow" to reusable workflows (#14390) @michelengelen

## 7.15.0

_Aug 29, 2024_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 💫 Support Material UI v6 (`@mui/material@6`) peer dependency (#14142) @cherniavskii

You can now use MUI X components with either v5 or v6 of `@mui/material` package 🎉

- 🐞 Bugfixes

### Data Grid

#### `@mui/x-data-grid-pro@7.15.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

- [DataGridPro] Export `GridRowReorderCell` component (#14079) @genepaul

#### `@mui/x-data-grid-premium@7.15.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.15.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.15.0`

- [pickers] Add `onTouchStart` handler for `TimeClock` (#14305) @arthurbalduini

#### `@mui/x-date-pickers-pro@7.15.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.15.0`, plus:

- [DateTimeRangePicker] Fix date format resolving from views on 24hr locales (#14341) @arthurbalduini

### Charts

#### `@mui/x-charts@7.15.0`

- [charts] Add missing `themeAugmentation` in pro plan (#14313) @lhilgert9
- [charts] Fix `LineChart` transition stopping before completion (#14366) @JCQuintas
- [charts] Fix tooltip with horizontal layout (#14337) @alexfauquette
- [charts] Keep axis root classe usage explicit (#14378) @alexfauquette

#### `@mui/x-charts-pro@7.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.15.0`, plus:

- [charts pro] Avoid relative reference to `@mui/x-charts` package (#14335) @LukasTy

### Docs

- [docs] Fix sentence case `h2` @oliviertassinari
- [docs] Clarify contribution guide references @oliviertassinari
- [docs] Fix Stack Overflow issue canned response @oliviertassinari
- [docs] Fix outdated link to support page @oliviertassinari
- [docs] Fix use of Material UI @oliviertassinari
- [docs] Update deprecated props in docs (#14295) @JCQuintas

### Core

- [core] Allow only v5.x for `MUI Core` renovate group (#14382) @LukasTy
- [core] Avoid visual regression when using `@mui/material@6` (#14357) @cherniavskii
- [core] Remove renovate rule targeting only `next` releases of `@mui/docs` (#14364) @LukasTy
- [core] Support `@mui/material@6` peer dependency (#14142) @cherniavskii
- [core] Use `useRtl` instead of `useTheme` to access direction (#14359) @LukasTy
- [code-infra] Typecheck nested folders in playground (#14352) @JCQuintas
- [infra] Fix Issue cleanup action @oliviertassinari
- [license] Prepare renaming of argument names @oliviertassinari

## 7.14.0

_Aug 23, 2024_

We'd like to offer a big thanks to the 14 contributors who made this release possible. Here are some highlights ✨:

- 💫 Allow [filtering the axis on zoom](https://mui.com/x/react-charts/zoom-and-pan/#zoom-filtering), making the axis adapt by removing values outside the view.

  <img width="600" src="https://github.com/user-attachments/assets/e65bbd00-d2a8-4136-81cd-3598f1373c16" alt="filtering the axis on zoom" />

- 📊 Improve bar chart performances
- 🌍 Improve Czech (cs-CZ) and Hebrew (he-IL) locales on the Data Grid
- 🌍 Improve Chinese (zh-HK), Hebrew (he-IL), and Vietnamese (vi-VN) locales on the Date and Time Pickers
- 🐞 Bugfixes

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.14.0`

- [DataGrid] Use readonly array result for `getTreeDataPath` (#11743) @pcorpet
- [DataGrid] Use `event.key` for `Tab` and `Escape` keys (#14170) @k-rajat19
- [DataGrid] Introduce selectors with arguments (#14236) @MBilalShafi
- [DataGrid] include `api` in `gridCellParams` interface (#14201) @k-rajat19
- [l10n] Improve Czech (cs-CZ) locale (#14135) @chirimiri22
- [l10n] Improve Hebrew (he-IL) locale (#14287) @rotembarsela

#### `@mui/x-data-grid-pro@7.14.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.14.0`.

#### `@mui/x-data-grid-premium@7.14.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.14.0`, plus:

- [DataGridPremium] Fix clipboard paste not working for a single cell on non-first page (#14261) @arminmeh
- [DataGridPremium] Fix `onCellSelectionModelChange` not triggered when additional cell range is selected (#14199) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@7.14.0`

- [l10n] Improve Chinese (zh-HK) locale (#13289) @yeeharn
- [l10n] Improve Hebrew (he-IL) locale (#14287) @rotembarsela
- [l10n] Improve Vietnamese (vi-VN) locale (#14238) @locnbk2002
- [TimePicker] Handle `Space` and `Enter` on the `TimeClock` component @arthurbalduini

#### `@mui/x-date-pickers-pro@7.14.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.14.0`.

### Charts

#### `@mui/x-charts@7.14.0`

- [charts] Fix grid overflow with zooming (#14280) @alexfauquette
- [charts] Improve bar chart performances (#14278) @alexfauquette
- [charts] Test pointer events (#14042) @alexfauquette
- [charts] Use `isPointInside` function for both graphs and axis (#14222) @JCQuintas

#### `@mui/x-charts-pro@7.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.14.0`, plus:

- [charts-pro] Zoom axis filtering (#14121) @JCQuintas

### Docs

- [docs] Consistent use of UTC and timezones (#14250) @oliviertassinari
- [docs] Fix missing leading slashes in URLs (#14249) @oliviertassinari
- [docs] Dash usage revision on pickers pages (#14260) @arthurbalduini

### Core

- [core] Follow JSDocs convention @oliviertassinari
- [core] Prepare for material v6 (#14143) @LukasTy
- [code-infra] Set up `eslint-plugin-testing-library` (#14232) @LukasTy
- [infra] Updated mui-x roadmap links with new project URL (#14271) @michelengelen

## 7.13.0

_Aug 16, 2024_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 💫 Allow to [edit the label](https://mui.com/x/react-tree-view/rich-tree-view/editing/) of Tree View's items.

  <img width="344" src="https://github.com/user-attachments/assets/1a6cf765-2dc8-4906-bd93-139086eed148" alt="Item label editing" />

- 🔧 Improve rows accessibility on the Data Grid features "Tree Data" and "Row Grouping". Certain "Row Grouping" accessibility updates will only be applied if experimental feature flag is enabled. See the [documentation](https://mui.com/x/react-data-grid/row-grouping/#accessibility-changes-in-v8) for more information.
- 🌍 Improve Vietnamese (vi-VN) locale on the Data Grid
- 🐞 Bugfixes

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.13.0`

- [DataGrid] Fix CSV export for `null` and `undefined` values (#14166) @k-rajat19
- [DataGrid] Fix error logged during skeleton loading with nested Data Grid (#14186) @KenanYusuf
- [DataGrid] Remove needless check in `useGridStateInitialization` (#14181) @k-rajat19
- [DataGrid] Add recipe for persisting filters in local storage (#14208) @cherniavskii
- [l10n] Improve Vietnamese (vi-VN) locale (#14216) @hungnd-casso

#### `@mui/x-data-grid-pro@7.13.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.13.0`, plus:

- [DataGridPro] Fix Tree Data and Row Grouping rows accessibility (#13623) @arminmeh

#### `@mui/x-data-grid-premium@7.13.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.13.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.13.0`

- [pickers] Fix date and time merging to retain milliseconds (#14173) @LukasTy

#### `@mui/x-date-pickers-pro@7.13.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.13.0`.

### Charts

#### `@mui/x-charts@7.13.0`

- [charts] Add `baseline` property to the `LineChart` `series` (#14153) @JCQuintas
- [charts] Fix issue where tooltip would disappear on mouse click (#14187) @alexfauquette
- [charts] Rename `CartesianContextProvider` to `CartesianProvider` (#14102) @JCQuintas
- [charts] Support axis with the same value for all data points (#14191) @alexfauquette

#### `@mui/x-charts-pro@7.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.13.0`.

### Tree View

#### `@mui/x-tree-view@7.13.0`

- [TreeView] Add label editing feature (#13388) @noraleonte
- [TreeView] Fix the parameters passed for the `canMoveItemToNewPosition` prop (#14176) @flaviendelangle

### Docs

- [docs] Extract dataset in the Line chart docs (#14034) @alexfauquette
- [docs] Remove redundant encoding in the mock data source server (#14185) @MBilalShafi
- [docs] Use Netflix financial results to document bar charts (#13991) @alexfauquette
- [docs] Remove relience of abbreviations (#14226) @oliviertassinari

### Core

- [core] Bump monorepo (#14141) @Janpot
- [core] Fix ESLint issue (#14207) @LukasTy
- [core] Fix Netlify build cache issue (#14182) @cherniavskii
- [code-infra] Refactor Netlify `cache-docs` plugin setup (#14105) @LukasTy
- [internals] Move utils needed for Tree View virtualization to shared package (#14202) @flaviendelangle

## 7.12.1

_Aug 8, 2024_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🎨 Charts get a new component to display color mapping in the legend
- 🚀 The `@mui/x-charts-pro` is released in alpha version 🧪. This new package introduces two main features:
  - The Heatmap component
  - The zoom interaction on the bar, line, and scatter charts
- 🌍 Improve Dutch (nl-NL) locale on the Date and Time Pickers
- 🐞 Bugfixes

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.12.1`

- [DataGrid] Fix `checkboxSelectionVisibleOnly` behavior with server-side pagination (#14083) @MBilalShafi
- [DataGrid] Fix `columnHeadersContainerRef` being `undefined` before mount (#14051) @samwato
- [DataGrid] Support Yarn PnP (#14126) @cherniavskii

#### `@mui/x-data-grid-pro@7.12.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.12.1`.

#### `@mui/x-data-grid-premium@7.12.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.12.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.12.1`

- [l10n] Improve Dutch (nlNL) locale (pickers) (#14036) @Robin1896

#### `@mui/x-date-pickers-pro@7.12.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.12.1`.

### Charts

#### `@mui/x-charts@7.12.1`

- [charts] Fix charts vendor publish config (#14073) @JCQuintas
- [charts] Move `plugins` to `PluginProvider` (#14056) @JCQuintas

#### `@mui/x-charts-pro@7.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@7.12.1`, plus:

- [charts-pro] Release the pro package in alpha (#13859) @alexfauquette

### Tree View

#### `@mui/x-tree-view@7.12.1`

No changes since `@mui/x-tree-view@7.12.0`.

### Docs

- [docs] Add a warning to promote the usage of `updateRows()` (#14027) @MBilalShafi
- [docs] Disable ad in `Rich Tree View-Ordering` page (#14123) @oliviertassinari
- [docs] Redesign Date and Time Pickers overview page (#13241) @noraleonte
- [CHANGELOG] Polish details @oliviertassinari
- [code-infra] Use concurrency 1 in CircleCI (#14110) @JCQuintas
- [infra] Re-added the removal of `Latest Version` section (#14132) @michelengelen

## 7.12.0

_Aug 1, 2024_

### 💵 Our commercial offering is evolving

The [Pro plan](https://mui.com/x/introduction/licensing/#pro-plan) is receiving two new packages:

- `@mui/x-tree-view-pro` (available today!)
- `@mui/x-charts-pro` (available in the coming weeks)

As always, every feature released as part of the MIT plan will remain free and MIT licensed forever.

This expansion of the Pro plan comes with some adjustments to our pricing strategy. Learn more about those in the [Upcoming changes to MUI X pricing in 2024](https://mui.com/blog/mui-x-sep-2024-price-update/) blog post.

### Highlights

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce [item reordering using drag and drop](https://mui.com/x/react-tree-view/rich-tree-view/ordering/) on the `<RichTreeViewPro />` component

  <img width="287" src="https://github.com/user-attachments/assets/78bd83c5-7ce4-4ed7-acf9-be70b2dbce54" alt="Item reordering using drag and drop" />

- 📦 Support CommonJS bundle out of the box on `@mui/x-charts` by adding vendored D3 dependencies.
  - This modifies how the package imports D3.js. It will impact you if you use `d3` packages installed by `@mui/x-charts` and don't have them in your `package.json`. You shouldn't be affected otherwise.
  - For more context, the initial issue is caused by D3 only exporting ESM.

    ![image](https://github.com/user-attachments/assets/d705b4de-0c93-420e-a416-528e7a044c1d)

  - The solution up until now was to export charts with only ESM. But some frameworks are confused by this configuration.

    ![image](https://github.com/user-attachments/assets/18a09703-9dd4-4226-a33d-167af059219c)

  - So in order to fix this, we are providing a CJS version of D3.

    ![image](https://github.com/user-attachments/assets/56387fe6-85d8-4750-bb9d-9866d5be68fa)

- 🌍 Improve Turkish (tr-TR) locale on the Data Grid
- 🌍 Improve Finnish (fi-FI) locale on the Date and Time Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.12.0`

- [DataGrid] Fix crash when updating columns immediately after scrolling (#13781) @cherniavskii
- [DataGrid] Fix `role=presentation` a11y issue (#13891) @romgrk
- [DataGrid] Fix top corner pixels & outline radius (#13943) @romgrk
- [DataGrid] Refactor: remove useless copy (#14039) @romgrk
- [l10n] Improve Turkish (tr-TR) locale (#13996) @bagcivan

#### `@mui/x-data-grid-pro@7.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.12.0`.

#### `@mui/x-data-grid-premium@7.12.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.12.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.12.0`

- [l10n] Improve Finnish (fi-FI) locale (#14054) @frozenzia

#### `@mui/x-date-pickers-pro@7.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.12.0`.

### Charts

#### `@mui/x-charts@7.12.0`

- [charts] Fix incorrect `axisId` prop being allowed in xAxis/yAxis config. Use `id` instead. (#13986) @JCQuintas
- [charts] Use vendor to have CommonJS bundle working out of the box (#13608) @alexfauquette
- [charts] Divide the `SeriesProvider` to use in filtering (#14026) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.12.0`

- [TreeView] Add new prop `onItemClick` on the Tree View components (#14018) @flaviendelangle
- [TreeView] Add new utility function `isEventTargetInDescendants` (#13982) @flaviendelangle
- [TreeView] Support item reordering using drag and drop (#12213) @flaviendelangle

### Docs

- [docs] Add Pickers `minDate` and `maxDate` `default` description (#14024) @LukasTy
- [docs] Fix 404 (#13989) @alexfauquette
- [docs] Fix Vale errors (#14025) @oliviertassinari
- [docs] Update on `renderCell` & autogenerated rows (#13879) @romgrk

### Core

- [core] Fix event naming convention @oliviertassinari
- [core] Replace @mui/base with @mui/utils + @mui/material (#13823) @mnajdova
- [core] Test `charts` performance with codspeed (#13952) @JCQuintas
- [infra] Consolidate issue cleanup and support labeling action (#14031) @michelengelen
- [infra] Revert `vale` action `paths` filtering (#14038) @LukasTy
- [test] Fix adapters code coverage (#13969) @alexfauquette
- [test] Fix mocha config to run charts tests (#14041) @alexfauquette

## 7.11.1

_Jul 25, 2024_

We'd like to offer a big thanks to the 18 contributors who made this release possible. Here are some highlights ✨:

- 🔎 Allow `Zoom` to be controllable for charts (#13858) @JCQuintas
- 🌍 Add Icelandic (is-IS) and Norwegian Nynorsk (nn-NO) locales on the Data Grid
- 🌍 Improve Norwegian Bokmål (nb-NO) and German (de-DE) locales on the Data Grid
- 🌍 Add Norwegian Nynorsk (nn-NO) locale on the Date and Time Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.11.1`

- [DataGrid] Remove dead code in internal `GridPreferencesPanel` (#13934) @k-rajat19
- [DataGrid] Do not miss to escape formulas in CSV export (#13888) @arminmeh
- [l10n] Add Icelandic (is-IS) locale (#13283) @magnimarels
- [l10n] Add Norwegian nynorsk (nn-NO) locale and improve Norwegian bokmål (nb-NO) locale (#13588) @AnderzL7
- [l10n] Improve German (de-DE) locale (#13910) @lhilgert9

#### `@mui/x-data-grid-pro@7.11.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.11.1`.

#### `@mui/x-data-grid-premium@7.11.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.11.1`, plus:

- [DataGridPremium] Pass the `api` object to events (#13893) @pcorpet
- [DataGridPremium] Fix paste to selected cells (#13967) @romgrk

### Date and Time Pickers

#### `@mui/x-date-pickers@7.11.1`

- [fields] Prevent keyboard editing when disabled (#13900) @arthurbalduini
- [l10n] Add Norwegian Nynorsk (nn-NO) locale (#13946) @AnderzL7

#### `@mui/x-date-pickers-pro@7.11.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.11.1`.

### Charts

#### `@mui/x-charts@7.11.1`

- [charts] Add `ownerState` function to `slotProps` typing when available (#13965) @alexfauquette
- [charts] Allow `Zoom` to be controllable (#13858) @JCQuintas
- [charts] Deprecate `xAxisKey` /`zAxisKey` in favor of `xAxisId`/`zAxisId` (#13940) @alexfauquette
- [charts] Hide empty arcs in the PieChart (#13897) @alexfauquette
- [charts] Limit the trigger of exit charts (#13682) @alexfauquette

### Tree View

#### `@mui/x-tree-view@7.11.1`

- [TreeView] Allow the plugins to enrich the props passed to the item slots (#13953) @flaviendelangle

### Docs

- [docs] Bump pnpm priority as a package manager (#13894) @oliviertassinari
- [docs] Explicitly mark charts pro as not released (#13905) @alexfauquette
- [docs] Fix dot consistency a11y table @oliviertassinari
- [docs] Fix some typos in charts docs (#13906) @cratiu222
- [docs] Fix spelling (#13902) @nnsW3
- [docs] Improve error message when moving between plans (#13874) @oliviertassinari
- [docs] Update `SparkLineChart` reference not being correctly capitalised (#13960) @duckboy81
- [docs] Fix scroll demos disorientation (#13909) @oliviertassinari

### Core

- [core] Add `@mui/material-nextjs` to `MUI Core` renovate group (#13966) @LukasTy
- [core] Remove warning message in production (#13911) @oliviertassinari
- [code-infra] Reuse `useReactVersion` script from the monorepo (#13710) @cherniavskii
- [infra] Adds order id validation action (#13957) @michelengelen
- [infra] Fix order id validator action (#13971) @michelengelen
- [infra] Fix regex in order id validation (#13976) @michelengelen
- [infra] Issue template improvement (#13954) @michelengelen

## 7.11.0

_Jul 18, 2024_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🎨 Add [color legend](https://mui.com/x/react-charts/legend/#color-legend) for charts (#13700) @alexfauquette
- 🌍 Improve Korean (ko-KR) locale on the Date and Time Pickers
- 🌍 Improve Russian (ru-RU) locale on the Date and Time Pickers and Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.11.0`

- [DataGrid] Expose `gridEditRowsStateSelector` (#13877) @romgrk
- [DataGrid] Fix `columnResizeStop` event not emitted when column is not resized (#13307) @mateuseap
- [DataGrid] Fix delete filter inconsistent behavior (#13353) @oukunan
- [DataGrid] Enable flip on preferences panel (#13803) @romgrk
- [DataGrid] Support `date` and `datetime-local` input types in `GridFilterInputMultipleValue` type (#13411) @karudedios
- [l10n] Improve Russian (ru-RU) locale (#13735) @diro-atk

#### `@mui/x-data-grid-pro@7.11.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.11.0`.

#### `@mui/x-data-grid-premium@7.11.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.11.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.11.0`

- [l10n] Improve Korean (ko-KR) locale (#13651) @100pearlcent
- [l10n] Improve Russian (ru-RU) locale (#13871) @Inv1x
- [pickers] Add more conformance tests improving API docs precision (#13800) @LukasTy
- [TimePicker] Add `Mui-selected` class to `TimeClock` meridiem buttons (#13848) @LukasTy

#### `@mui/x-date-pickers-pro@7.11.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.11.0`, plus:

- [DateRangePicker] Fix `name` prop propagation regression (#13821) @LukasTy

### Charts

#### `@mui/x-charts@7.11.0`

- [charts] Create color legend (#13700) @alexfauquette
- [charts] Defaultize axis on top level `useChartContainerProps` (#13817) @JCQuintas
- [charts] Fix charts not passing `className` to root element (#13647) @JCQuintas
- [charts] Generate API documentation for pro components (#13822) @alexfauquette
- [charts] Improve zoomed highlight behavior (unreleased) (#13868) @JCQuintas
- [charts] Allow zoom on Y axis and add zoom options to configure zooming behavior (unreleased) (#13726) @JCQuintas
- [charts] Disable animations while zooming (unreleased) (#13807) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.11.0`

- [TreeView] Extract some logic outside of the `useTreeView` hook (#13845) @flaviendelangle

### Docs

- [docs] Add warning about `process.env.NODE_ENV` in production (#13869) @cherniavskii
- [docs] Allow controlling the demo form from the example (#13796) @JCQuintas
- [docs] Clarify Pickers clearable behavior not working on mobile (#13786) @lnhrdt
- [docs] Improve the documentation of the picker's `onChange` and `onAccept` props (#13543) @flaviendelangle
- [docs] Replace company name with project name @oliviertassinari
- [docs] Sort Pickers & Charts API slots alphabetically (#13843) @LukasTy

### Core

- [core] Add MUI Internal `renovate` group (#13846) @LukasTy
- [core] Link GitHub issue for `import/prefer-default-export` rule @oliviertassinari
- [core] Normalize `...other` and test imports in charts (#13844) @JCQuintas
- [core] Normalize rest / other to match the most common used @oliviertassinari
- [code-infra] Follow `next` tag for `@mui/docs` package bumps (#13813) @LukasTy
- [code-infra] Use specific version for `@mui/docs` dependency (#13760) @LukasTy
- [internals] Move `EventManager` to `@mui/x-internals` package (#13815) @flaviendelangle

## 7.10.0

_Jul 11, 2024_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add selectors to support showing child row count in footer in the Data Grid
- ✨ New APIs for retrieving current item tree and item's children IDs in the Tree View
- 🌍 Improve Spanish (es-ES) locale on the Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.10.0`

- [DataGrid] Add selectors to support showing child row count in footer (#13725) @KenanYusuf
- [DataGrid] Fix incorrect panels position when using a toolbar (#13474) @oukunan
- [DataGrid] Set default variant to `'standard'` in `GridFilterInputMultipleValue` (#13129) @tarunrajput
- [DataGrid] Use `readonly` on more array props (#13331) @pcorpet
- [l10n] Improve Spanish (es-ES) locale (#13772) @joserealdev

#### `@mui/x-data-grid-pro@7.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.10.0`, plus:

- [DataGridPro] Keep bottom pinned row at the bottom (#13313) @romgrk

#### `@mui/x-data-grid-premium@7.10.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.10.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.10.0`

- [fields] Prevent infinite recursion when ensuring selection (#13779) @LukasTy
- [fields] Unify fields behavior regardless of the `readOnly` flag (#13688) @LukasTy

#### `@mui/x-date-pickers-pro@7.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.10.0`, plus:

- [DateRangePicker] Fix `calendarHeader` slot props propagation (#13780) @LukasTy
- [DateTimeRangePicker] Resolve `format` from given `views` (#13743) @LukasTy

### Charts

#### `@mui/x-charts@7.10.0`

- [charts] Fix displaying area of a `LineChart` when using the `log` scale (#13791) @alexfauquette
- [charts] Use correct click handler prop on pie chart `OnSeriesItemClick` documentation (#13761) @tonyhallett

### Tree View

#### `@mui/x-tree-view@7.10.0`

- [TreeView] Add `getItemTree` and `getItemOrderedChildrenIds` methods to the public API (#13804) @flaviendelangle
- [TreeView] Add utility function to check if an optional plugin is present (#13788) @flaviendelangle

### Docs

- [docs] Add missing default `loading` prop value (#13604) @oliviertassinari
- [docs] Add the `DateTimeRangePicker` to the "Commonly used components" demo (#13775) @flaviendelangle
- [docs] Fix Pickers customization playground overflow (#13742) @LukasTy
- [docs] Move Pickers dialog guidelines to accessibility page (#13778) @arthurbalduini

### Core

- [core] Sort `DATA_GRID_PROPS_DEFAULT_VALUES` alphabetically (#13783) @oliviertassinari
- [test] Fix split infinitive use in tests @oliviertassinari

## 7.9.0

_Jul 5, 2024_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🔄 Add loading overlay variants, including a skeleton loader option to the Data Grid component. See [Loading overlay docs](https://mui.com/x/react-data-grid/overlays/#loading-overlay) for more details.
- 🌳 Add `selectItem()` and `getItemDOMElement()` methods to the TreeView component public API
- ⛏️ Make the `usePickersTranslations` hook public in the pickers component
- 🐞 Bugfixes

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.9.0`

- [DataGrid] Add skeleton loading overlay support (#13293) @KenanYusuf
- [DataGrid] Fix pagination when `pagination={undefined}` (#13349) @sai6855

#### `@mui/x-data-grid-pro@7.9.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.9.0`.

#### `@mui/x-data-grid-premium@7.9.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.9.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.9.0`

- [pickers] Make the `usePickersTranslations` hook public (#13657) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.9.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.9.0`.

### Charts

#### `@mui/x-charts@7.9.0`

- [charts] Add Heatmap (unreleased) (#13209) @alexfauquette
- [charts] Add initial `Zoom&Pan` to the Pro charts (unreleased) (#13405) @JCQuintas
- [charts] Fix Axis Highlight on horizontal bar charts regression (#13717) @JCQuintas
- [charts] Improve charts interaction for mobile users (#13692) @JCQuintas
- [charts] Add documentation on how to disable the tooltip on charts (#13724) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.9.0`

- [TreeView] Add `selectItem()` and `getItemDOMElement()` methods to the public API (#13485) @flaviendelangle

### Docs

- [docs] Fix custom "no results overlay" demo in dark mode (#13715) @KenanYusuf

### Core

- [core] Add `react_next` workflow in CircleCI (#13360) @cherniavskii
- [core] Create a new package to share utils across X packages (#13528) @flaviendelangle
- [core] Fix dependency setup (#13684) @LukasTy
- [core] Remove `jscodeshift-add-imports` package (#13720) @LukasTy
- [code-infra] Cleanup monorepo and `@mui/docs` usage (#13713) @LukasTy

## 7.8.0

_Jun 28, 2024_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🛰 Introduce server-side data source for improved server integration in the Data Grid.

  Supports server-side pagination, sorting and filtering on plain and tree data, and automatic caching.

  To enable, provide a `getRows` function to the `unstable_dataSource` prop on the Data Grid component.

  ```tsx
  const dataSource = {
    getRows: async (params: GridServerGetRowsParams) => {
      const data = await fetch(
        `https://api.example.com/data?${new URLSearchParams({
          page: params.page,
          pageSize: params.pageSize,
          sortModel: JSON.stringify(params.sortModel),
          filterModel: JSON.stringify(params.filterModel),
        }).toString()}`,
      );
      return {
        rows: data.rows,
        totalRows: data.totalRows,
      };
    },
  }
  <DataGridPro
    unstable_dataSource={dataSource}
    {...otherProps}
  />
  ```

  See [server-side data documentation](https://mui.com/x/react-data-grid/server-side-data/) for more details.

- 📈 Support Date data on the BarChart component
- ↕️ Support custom column sort icons on the Data Grid
- 🖱️ Support modifying the expansion trigger on the Tree View components

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.8.0`

- [DataGrid] Add `columnHeaderSortIcon` slot (#13563) @arminmeh
- [DataGrid] Fix dimensions lag issue after autosize (#13587) @MBilalShafi
- [DataGrid] Fix print export failure when `hideFooter` option is set (#13034) @tarunrajput

#### `@mui/x-data-grid-pro@7.8.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.8.0`, plus:

- [DataGridPro] Fix multi-sorting indicator being cut off (#13625) @KenanYusuf
- [DataGridPro] Server-side tree data support (#12317) @MBilalShafi

#### `@mui/x-data-grid-premium@7.8.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.8.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.8.0`

- [fields] Fix section clearing behavior on Android (#13652) @LukasTy

#### `@mui/x-date-pickers-pro@7.8.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.8.0`.

### Charts

#### `@mui/x-charts@7.8.0`

- [charts] Fix line chart props not passing correct event handlers (#13609) @JCQuintas
- [charts] Support BarChart with `Date` data (#13471) @alexfauquette
- [charts] Support RTL for y-axis (#13614) @alexfauquette
- [charts] Use default values instead of non-null assertion to prevent error being thrown (#13637) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.8.0`

- [TreeView] Add `expansionTrigger` prop (#13533) @noraleonte
- [TreeView] Support experimental features from plugin's dependencies (#13632) @flaviendelangle

### Docs

- [docs] Add callout for `Luxon` `throwOnInvalid` support (#13621) @LukasTy
- [docs] Add "Overlays" section to the Data Grid documentation (#13624) @KenanYusuf

### Core

- [core] Add eslint rule to restrict import from `../internals` root (#13633) @JCQuintas
- [docs-infra] Sync `\_app` folder with monorepo (#13582) @Janpot
- [license] Allow usage of Charts and Tree View Pro package for old premium licenses (#13619) @flaviendelangle

## 7.7.1

_Jun 21, 2024_

We'd like to offer a big thanks to the 14 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Portuguese (pt-PT) locale on the Data Grid
- 🌍 Improve Danish (da-DK) locale on the Date and Time Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.7.1`

- [DataGrid][docs] Clarify enabling pagination (#13350) @oliviertassinari
- [DataGrid] Fix CSV export escaping for non-string values (#13560) @joeycumines-scw
- [l10n] Improve Portuguese (pt-PT) locale (#13348) @joaosreis

#### `@mui/x-data-grid-pro@7.7.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.7.1`, plus:

- [DataGrid] Warn about `getTreeDataPath` reference (#13519) @cherniavskii

#### `@mui/x-data-grid-premium@7.7.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.7.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.7.1`

- [fields] Prevent digit editing on the `Space` key down (#13510) @flaviendelangle
- [l10n] Improve Danish (da-DK) locale (#13375) @jacrowland1
- [pickers] Add context to `onAccept` callback (#13511) @flaviendelangle
- [pickers] Always use the same timezone in the field, the view and the layout components (#13481) @flaviendelangle
- [pickers] Fix `AdapterDateFnsV3` generated method types (#13464) @alexey-kozlenkov
- [pickers] Fix controlled `view` behavior (#13552) @LukasTy
- [TimePicker] Improves RTL verification for the time pickers default views (#13447) @arthurbalduini

#### `@mui/x-date-pickers-pro@7.7.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.7.1`, plus:

- [DateRangePicker] Add accessible name to calendar grid (#13538) @LukasTy

### Charts

#### `@mui/x-charts@7.7.1`

- [charts] Divide `CartesianProvider` to use logic in Pro package (#13531) @JCQuintas
- [charts] Do not publish the pro package (#13539) @alexfauquette
- [charts] Export `Pro` versions of regular charts (#13547) @JCQuintas
- [charts] Prepare `ChartContainerPro` for future Zoom changes (#13532) @JCQuintas
- [charts] Remove unnecessary proptypes from internal component (#13518) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.7.1`

- [TreeView] Improve typing to support optional dependencies in plugins and in the item (#13523) @flaviendelangle
- [TreeView] Move `useTreeViewId` to the core plugins (#13566) @flaviendelangle
- [TreeView] Remove unused state from `useTreeViewId` (#13579) @flaviendelangle
- [TreeView] Support `itemId` with escaping characters when using Simple Tree View (#13487) @oukunan

### Docs

- [docs] Add section about the new uncovered product watermark (#13568) @michelengelen
- [docs] Document the `PickerValidDate` type override (#13476) @flaviendelangle
- [docs] Fix typo (#13507) @anshtiwatne
- [docs] Remove "-" in heat-map and tree-map urls (#13569) @alexfauquette
- [docs] Use dedicated tab for weather dataset (#13513) @alexfauquette
- [x-license] license update proposal (#13459) @michelengelen

### Core

- [core] Fix failing CI test (#13574) @alexfauquette
- [infra] Remove explicit `@testing-library/react` dependency (#13478) @LukasTy

## 7.7.0

_Jun 13, 2024_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Allow customization of the Pickers month and the year buttons
- 🌍 Improve Persian (fa-IR), Portuguese (pt-PT), and Russian (ru-RU) locales on the Data Grid
- 🌍 Improve Korean (ko-KR) and Persian (fa-IR) locales on the Date and Time Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.7.0`

- [DataGrid] Add `getFilterState` method (#13418) @cherniavskii
- [DataGrid] Do not show resize separators for column groups (#13455) @cherniavskii
- [l10n] Improve Persian (fa-IR) locale (#13402) @fakhamatia
- [l10n] Improve Portuguese (pt-PT) locale (#13384) @olavocarvalho
- [l10n] Improve Russian (ru-RU) locale (#11210) @dastan-akhmetov-scity

#### `@mui/x-data-grid-pro@7.7.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.7.0`, plus:

- [DataGridPro] Do not render detail panel if the focused cell is not visible (#13456) @cherniavskii

#### `@mui/x-data-grid-premium@7.7.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.7.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.7.0`

- [l10n] Improve Korean (ko-KR) locale (#13452) @ryxxn
- [l10n] Improve Persian (fa-IR) locale (#13402) @fakhamatia
- [pickers] Allow to customize the month and the year buttons (#13321) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.7.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.7.0`.

### Charts

#### `@mui/x-charts@7.7.0`

- [charts] Add watermark on the pro `ResponsiveChartContainer` (#13398) @alexfauquette
- [charts] Allow to specify y-axis configuration (#13438) @alexfauquette
- [charts] Fix eslint for react compiler (#13444) @alexfauquette
- [charts] Improve themeAugmentation typing (#13433) @noraleonte
- [charts] Move the `ZAxisContextProvider` by default in the `ChartContainer` (#13465) @alexfauquette
- [charts] Use plugins to define series extremum and colors (#13397) @alexfauquette

### Tree View

#### `@mui/x-tree-view@7.7.0`

- [TreeView] Improve TypeScript for plugins (#13380) @flaviendelangle
- [TreeView] Improve the typing of the cancelable events (#13152) @flaviendelangle
- [TreeView] Prepare support for PigmentCSS (#13412) @flaviendelangle
- [TreeView] Refactor the Tree View internals to prepare for headless API (#13311) @flaviendelangle

### Docs

- [docs] Add `renderHeader` recipe to the Master Details docs (#13370) @michelengelen
- [docs] Add lazy loading detail panel demo (#13453) @cherniavskii
- [docs] Add small edits to the Data Grid overview page (#13060) @danilo-leal
- [docs] Update a11y pages description (#13417) @danilo-leal
- [docs] improve the writing on the "Quick filter outside of the grid" example (#13155) @michelengelen

### Core

- [core] Add `eslint-plugin-react-compiler` experimental version and rules (#13415) @JCQuintas
- [core] Minor setup cleanup (#13467) @LukasTy
- [infra] Adjust CI setup (#13448) @LukasTy
- [test] Add tests for the custom slots of `<TreeItem2 />` (#13314) @flaviendelangle

## 7.6.2

_Jun 6, 2024_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 📚 Adds Date and Time Pickers accessibility page
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.6.2`

- [DataGrid] Add the `areElementSizesEqual` utility to improve code readability (#13254) @layerok
- [DataGrid] Clean up IE remnants from the codebase (#13390) @MBilalShafi

#### `@mui/x-data-grid-pro@7.6.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.6.2`.

#### `@mui/x-data-grid-premium@7.6.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.6.2`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.6.2`

- [fields] Fix `PageUp` and `PageDown` editing on letter sections (#13310) @arthurbalduini
- [pickers] Fix `AdapterDayjs` timezone behavior (#13362) @LukasTy
- [pickers] Use `useRtl` instead of `useTheme` to access direction (#13363) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.6.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.6.2`.

### Charts

#### `@mui/x-charts@7.6.2`

- [charts] Add `Initializable` type and behavior to allow checking if a complex context has been initialized. (#13365) @JCQuintas
- [charts] Fix some props not working in `xAxis` and `yAxis` (#13372) @Valyok26
- [charts] Harmonize charts types (#13366) @alexfauquette
- [charts] Introduce plugins system (#13367) @alexfauquette
- [charts] Simplify plugin types (#13396) @JCQuintas

### Docs

- [docs] Add badges like in Material UI @oliviertassinari
- [docs] Update twitter.com to x.com @oliviertassinari
- [docs] Fix the description of `tickInterval` (#13355) @alexfauquette
- [docs] Adjust the code example for `quickFilterValues` (#12919) @michelengelen
- [docs] Create Pickers accessibility page (#13274) @arthurbalduini

### Core

- [core] Comment on `CSS.escape` for the future @oliviertassinari
- [core] Fix `l10n` action setup (#13382) @LukasTy
- [core] Fixes in preparation for React 18.3 (#13378) @LukasTy
- [core] Remove explicit `marked` dependency (#13383) @LukasTy
- [core] Remove unused `@types/prettier` dependency (#13389) @LukasTy
- [core] Add `docs/.env.local` to `.gitignore` (#13377) @KenanYusuf

## 7.6.1

_May 31, 2024_

We'd like to offer a big thanks to the 2 contributors who made this release possible. Here are some highlights ✨:

🐞 Address the `@mui/internal-test-utils` added as a direct dependency to `@mui/x-data-grid` by mistake.

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.6.1`

- [DataGrid] Fix column resize not working with special character (#13069) @oukunan
- [DataGrid] Move `@mui/internal-test-utils` to dev dependency (#13318) @LukasTy

#### `@mui/x-data-grid-pro@7.6.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.6.1`.

#### `@mui/x-data-grid-premium@7.6.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.6.1`.

## 7.6.0

_May 30, 2024_

We'd like to offer a big thanks to the 14 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Allow to define and customize the indentation of nested items in the Tree View
- ✨ Allow charts highlights to be controlled
- 🌍 Improve Persian (fa-IR) locale on the Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### `@mui/x-data-grid@7.6.0`

- [DataGrid] Avoid re-rendering all cells on column change (#12980) @romgrk
- [DataGrid] Export `GridColumnHeadersProps` (#13229) @cherniavskii
- [DataGrid] Fix header filters' issue with custom filters (#13255) @MBilalShafi
- [DataGrid] Remove dead logic to support Safari < 13 (#13249) @oliviertassinari
- [l10n] Improve Persian (fa-IR) locale (#12994) @amiryxe

#### `@mui/x-data-grid-pro@7.6.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.6.0`.

#### `@mui/x-data-grid-premium@7.6.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.6.0`, plus:

- [DataGridPremium] Fix excel export causing column with wrong width (#13191) @romgrk

### Date and Time Pickers

#### `@mui/x-date-pickers@7.6.0`

- [pickers] Fix `DateBuilderReturnType` when the date is `undefined` (#13244) @alexey-kozlenkov

#### `@mui/x-date-pickers-pro@7.6.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.6.0`.

### Charts

#### `@mui/x-charts@7.6.0`

- [charts] Allow charts highlights to be controlled (#12828) @JCQuintas
- [charts] Refactor axis band scaleType check (#13295) @JCQuintas
- [charts] Refactor checkScaleErrors to improve readability and simplify axis message logic (#13305) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.6.0`

- [TreeView] Add JSDoc to every instance method (#13219) @flaviendelangle
- [TreeView] Allow to customize the indentation of nested items (#13225) @flaviendelangle
- [TreeView] Allow to define indentation at the item level (#13126) @flaviendelangle

### Docs

- [docs] Add Bulk editing demo for the Community plan (#12800) @cherniavskii
- [docs] Add conditional label formatting on tooltip page and link to label page (#13235) @JCQuintas
- [docs] Add information about key combinations on a11y sections (#13234) @arthurbalduini
- [docs] Cleanup of the Tree View demos (#13237) @flaviendelangle
- [docs] Document how to customize a subsection of a line chart (#13210) @alexfauquette
- [docs] Fix Pickers FAQ callout (#13238) @LukasTy
- [docs] Fix Vale errors @oliviertassinari
- [docs] Fix a small typo in property comment (#13245) @Janpot
- [docs] Improve the Data Grid FAQ page (#13258) @MBilalShafi
- [docs] Removes unused lines in TreeItem2 styling (#13264) @arthurbalduini
- [docs] Small improvements on accessibility Data Grid doc (#13233) @arthurbalduini
- [docs] Update Pickers demo configurations (#13303) @LukasTy

### Core

- [core] Add comment on why logic to sync column header (#13248) @oliviertassinari
- [core] Fix `l10n` script execution with arguments (#13297) @LukasTy
- [core] Prevent "Add reviewers" workflow from triggering since it doesn't work (#13236) @JCQuintas
- [docs-infra] Fix `@mui/material` version used in sandboxes (#13260) @LukasTy
- [test] Use `describeTreeView` for keyboard navigation tests on disabled items (#13184) @flaviendelangle
- [test] Use `describeTreeView` for remaining items tests (#13262) @flaviendelangle
- [test] Use test-utils from npm (#12880) @michaldudak
- [typescript] Remove duplicate `DateRangePosition` type in favor of `RangePosition` (#13288) @LukasTy

## 7.5.1

_May 23, 2024_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🧰 Improve Tree View testing
- 📊 Add `label` to be displayed in BarChart

### Data Grid

#### `@mui/x-data-grid@7.5.1`

- [DataGrid] Escape formulas in CSV and Excel export (#13115) @cherniavskii

#### `@mui/x-data-grid-pro@7.5.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.5.1`.

#### `@mui/x-data-grid-premium@7.5.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.5.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.5.1`

- [pickers] Fix `disableOpenPicker` prop behavior (#13212) @LukasTy

#### `@mui/x-date-pickers-pro@7.5.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.5.1`.

### Charts

#### `@mui/x-charts@7.5.1`

- [charts] Add `label` to be displayed inside bars in BarChart (#12988) @JCQuintas
- [charts] Setup the repository for charts-pro (#13182) @alexfauquette

### Docs

- [docs] Clean the pages in the navbar (#13192) @flaviendelangle
- [docs] Improve Tree View selection doc (#13105) @flaviendelangle
- [docs] Unify Tree View `apiRef` methods doc examples (#13193) @flaviendelangle

### Core

- [core] Remove `raw-loader` package (#13160) @LukasTy
- [core] Remove outdated prop-types (#13181) @flaviendelangle
- [core] Rename `yarn` to `pnpm` in `PropTypes` comment (#13167) @LukasTy
- [core] Use `describeTreeView` for items test (partial) (#12893) @flaviendelangle
- [core] Use `describeTreeView` for keyboard selection tests (#13164) @flaviendelangle
- [core] Use `describeTreeView` for navigation tests (#12907) @flaviendelangle
- [core] Use `describeTreeView` for items rendering edge-case tests (#13168) @flaviendelangle
- [core] Add `test:coverage:inspect` to allow easier debugging (#13198) @JCQuintas
- [core] Fix `yarn proptypes` vs `pnpm proptypes` (#13199) @JCQuintas
- [code-infra] Run corepack enable on all CI jobs (#13205) @Janpot
- [code-infra] Use `nx` for lerna tasks (#13166) @LukasTy

## 7.5.0

_May 17, 2024_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add support for checkbox selection on the Tree View components
- 🌍 Improve Norwegian (nb-NO) and Spanish (es-ES) locales on the Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.5.0`

- [DataGrid] Fix `rowModesModel` controlled prop (#13056) @Janpot
- [DataGrid] Reduce bundle size with error messages (#12992) @oliviertassinari
- [l10n] Improve Norwegian (nb-NO) locale (#13106) @oliverlaidma
- [l10n] Improve Spanish (es-ES) locale (#13133) @Jucabel

#### `@mui/x-data-grid-pro@7.5.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.5.0`.

#### `@mui/x-data-grid-premium@7.5.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.5.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.5.0`

- [fields] Allow empty `textField` slot placeholder value (#13148) @arthurbalduini
- [pickers] Fix `AdapterMomentJalaali` regression (#13144) @LukasTy
- [pickers] Fix field focusing when switching to view without a renderer (#13112) @LukasTy
- [pickers] Reuse `AdapterDateFnsBase` in Jalali adapters (#13075) @LukasTy

#### `@mui/x-date-pickers-pro@7.5.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.5.0`.

### Charts

#### `@mui/x-charts@7.5.0`

- [charts] Tooltip with `trigger=axis` now follow touch on mobile (#13043) @wzdorowa
- [charts] Allow `series.label` property to receive a function with the "location" it is going to be displayed on (#12830) @JCQuintas
- [charts] Improve TypeScript performance (#13137) @alexfauquette
- [charts] Fix area order when overlapping (#13121) @alexfauquette
- [charts] Improve `useSlotProps` types (#13141) @alexfauquette
- [charts] Fix using the theme's font in the Overlay (#13107) @alexfauquette

### Tree View

#### `@mui/x-tree-view@7.5.0`

- [TreeView] Add support for checkbox selection (#11452) @flaviendelangle
- [TreeView] Remove unused code (#12917) @flaviendelangle

### Docs

- [docs] Document missing Charts API's (#12875) @alexfauquette

### Core

- [core] Avoid root level `@mui/x-date-pickers` imports (#13120) @LukasTy
- [core] Refactor ESLint config to disallow root level imports (#13130) @LukasTy
- [core] Simplify Danger's config (#13062) @oliviertassinari
- [core] Shift aliasing from babel to webpack (#13051) @Janpot
- [core] Reuse the `SectionTitle` component in the doc (#13139) @alexfauquette

## 7.4.0

_May 10, 2024_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- ✨ Add optional `id` attribute on shortcut items of the Date and Time Pickers
- 🎁 Add support for `date-fns-jalali` v3 in the Date and Time Pickers
- 🚀 Support rounded corners on `BarChart`
- 🌍 Add accessibility page to TreeView docs
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.4.0`

- [DataGrid] Fix error when focus moves from column header to `svg` element (#13028) @oukunan
- [DataGrid] Fix error on column groups change (#12965) @romgrk

#### `@mui/x-data-grid-pro@7.4.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.4.0`.

#### `@mui/x-data-grid-premium@7.4.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.4.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.4.0`

- [fields] Fix regression preventing form submit on "Enter" click (#13065) @LukasTy
- [pickers] Add `AdapterDateFnsJalaliV3` adapter (#12891) @smmoosavi
- [pickers] Add optional `id` attribute on shortcut items (#12976) @noraleonte

#### `@mui/x-date-pickers-pro@7.4.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.4.0`.

### Charts

#### `@mui/x-charts@7.4.0`

- [charts] Add `ChartsGrid` to `themeAugmentation` (#13026) @noraleonte
- [charts] Support rounded corners on `BarChart` (#12834) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.4.0`

- [TreeView] Fix props propagation and theme entry in `<TreeItem2 />` (#12889) @flaviendelangle

### Docs

- [docs] Add accessibility page to TreeView docs (#12845) @noraleonte
- [docs] Fix Charts styling typos (#13061) @oliviertassinari
- [docs] Fix legal link to EULA free trial (#13013) @oliviertassinari
- [docs] Update interface name in pinned columns docs (#13070) @cherniavskii

### Core

- [core] Improve release process docs (#12977) @JCQuintas
- [core] Prepare React 19 (#12991) @oliviertassinari
- [docs-infra] Fix Netlify PR preview path (#12993) @oliviertassinari
- [infra] Automation: Add release PR reviewers (#12982) @michelengelen

## 7.3.2

_May 2, 2024_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add "no data" and "loading" states to charts, allowing users to create [custom visualizations for each state](https://mui.com/x/react-charts/styling/#overlay)
- 🌍 Improve Hebrew (he-IL) and Hungarian (hu-HU) locales on the Date and Time Pickers
- 🌍 Improve Danish (da-DK) and Slovak (sk-SK) locales on the Data Grid
- 📝 Fix a [typo](https://github.com/mui/mui-x/pull/12941/files/4bf4bffbc2799a01a96bc7458a17318cf41c1722#diff-26c31cc69d6f51110f89e339578ef9b3d4a3551f79077fff73f7babb81c5099f) in the auto-generated Charts gradient `id` attribute.
  It should not affect you, but if you were relying on the gradient `id` attribute, please update your usage.
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.3.2`

- [DataGrid] Allow to change reset text in the columns management panel (#12972) @MBilalShafi
- [DataGrid] Derive `formattedValue` from the edit value when passing to `renderEditCell` (#12870) @cherniavskii
- [DataGrid] Fix rows not being recomputed on `props.rowCount` change (#12833) @MBilalShafi
- [l10n] Improve Danish (da-DK) locale (#12844) @fosterbuster
- [l10n] Improve Slovak (sk-SK) locale (#12949) @stefikp

#### `@mui/x-data-grid-pro@7.3.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.3.2`.

#### `@mui/x-data-grid-premium@7.3.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.3.2`, plus:

- [DataGridPremium] Fix print export not working with row grouping (#12957) @MBilalShafi

### Date and Time Pickers

#### `@mui/x-date-pickers@7.3.2`

- [l10n] Improve Hebrew (he-IL) locale (#12910) @michaelNXT1
- [l10n] Improve Hungarian (hu-HU) locale (#12930) @noherczeg
- [pickers] Fix typo on the `viewRenderers` prop description (#12915) @flaviendelangle
- [pickers] Improve TypeScript performance in `PickersDay` (#12920) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.3.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.3.2`.

### Charts

#### `@mui/x-charts@7.3.2`

- [charts] Add an overlay for "no data" or "loading" states (#12817) @alexfauquette
- [charts] Fix typos in documentation, translations and errors (#12941) @JCQuintas
- [charts] Fix `prop.slots` and `prop.slotProps` not passed to `<ChartsTooltip />` (#12939) @JCQuintas

### Docs

- [docs] Improve Data Grid migration guide (#12969) @MBilalShafi
- [docs] Polish references to the plans (#12922) @oliviertassinari

### Core

- [core] Fix dependencies (#12951) @LukasTy
- [core] Remove inconsistent blank lines (#12966) @oliviertassinari
- [code-infra] Bump node image used by CI in docker (#12961) @LukasTy
- [docs-infra] Remove no longer needed `next.config` settings (#12861) @oliviertassinari
- [docs-infra] Use the `@mui/docs/HighlightedCode` (#12848) @alexfauquette
- [test] Restore `t` command (#12948) @LukasTy

## 7.3.1

_Apr 26, 2024_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Scatter Charts get a [z-axis to allow coloring data points independently from their coordinates](https://mui.com/x/react-charts/scatter/#color-scale)
- 🌍 Improve Catalan (ca-ES) and Spanish (es-ES) locales on the Date and Time Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.3.1`

- [DataGrid] Fix date filtering for negative timezone offsets (#12836) @cherniavskii
- [DataGrid] Fix flex column width when used with pinned columns (#12849) @romgrk
- [DataGrid] Fix group header resize (#12863) @arminmeh
- [DataGrid] Pass slot props to `columnHeaders` slot (#12768) @cherniavskii

#### `@mui/x-data-grid-pro@7.3.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.3.1`.

#### `@mui/x-data-grid-premium@7.3.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.3.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.3.1`

- [l10n] Improve Catalan (ca-ES) locale (#12856) @soler1212
- [l10n] Improve Spanish (es-ES) locale (#12858) @soler1212

#### `@mui/x-date-pickers-pro@7.3.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.3.1`.

### Charts

#### `@mui/x-charts@7.3.1`

- [charts] Add documentation on border radius alternative for `BarCharts` (#12859) @JCQuintas
- [charts] Add z-axis to colorize scatter charts (#12738) @alexfauquette
- [charts] Fix left/bottomAxis not picking up default axis id (#12894) @JCQuintas
- [charts] Improve default tooltip content (#12257) @oliviertassinari
- [charts] Round y values for bar chart (#12846) @alexfauquette

### Tree View

#### `@mui/x-tree-view@7.3.1`

- [TreeView] Remove un-needed `aria-activedescendant` attribute (#12867) @flaviendelangle
- [TreeView] Rework the selection internals (#12703) @flaviendelangle
- [TreeView] Use the order in which the items are displayed for `type-ahead` (#12827) @flaviendelangle

### Docs

- [docs] Add demo for styling charts with `sx` props (#12791) @derek-0000
- [docs] Cover webpack 4 support in migration guide (#12710) @cherniavskii
- [docs] Document interfaces for charts (#12656) @alexfauquette
- [docs] Fix Vale regression (#12862) @oliviertassinari
- [docs] Improve Data Grid migration guide (#12879) @MBilalShafi
- [docs] Update Column features availability (#12865) @DanailH

### Core

- [core] Fix `l10n` GH workflow (#12895) @LukasTy
- [core] Match Base UI and Toolpad @oliviertassinari
- [core] Remove redundant `setupFiles` entries in `package.json` (#12899) @LukasTy
- [core] Use `describeTreeView` for focus tests (#12698) @flaviendelangle
- [core] Use `describeTreeView` for type-ahead tests (#12811) @flaviendelangle
- [code-infra] Change package manager to `pnpm` (#11875) @LukasTy
- [code-infra] Closer sync with eslint config of codebase (#12864) @oliviertassinari
- [support-infra] Add release announcement to GitHub workflows (#11867) (#12843) @michelengelen

## 7.3.0

_Apr 18, 2024_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 📄 Support [unknown and estimated row count in server-side pagination](https://mui.com/x/react-data-grid/pagination/#index-based-pagination) (#12490) @MBilalShafi
- 🎨 Support color scales in Charts (#12490) @alexfauquette
  Add a [`colorMap` configuration](https://mui.com/x/react-charts/styling/#values-color) to an axis, and the chart will use it to select colors.
  Each impacted chart ([bar charts](https://mui.com/x/react-charts/bars/#color-scale), [line charts](https://mui.com/x/react-charts/lines/#color-scale), [scatter charts](https://mui.com/x/react-charts/scatter/#color-scale)) has a dedicated section explaining how this color map is impacting it.

  <img src="https://github.com/mui/mui-x/assets/45398769/f0066606-3486-4c4e-b3be-7fdd56d763c3" alt="scatter chart with gradient along y-axis" />

- 🌍 Improve Danish (da-DK) locale on the Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.3.0`

- [DataGrid] Fix calling `onCellEditStop` on error (#12747) @sai6855
- [DataGrid] Fix column resize (#12792) @romgrk
- [DataGrid] Fix column separators (#12808) @romgrk
- [DataGrid] Limit panel width to not exceed screen width (#12799) @cherniavskii
- [DataGrid] Support advanced server-side pagination use cases (#12474) @MBilalShafi
- [DataGrid] Support state export and restore on grid density (#12671) @MBilalShafi
- [l10n] Improve Danish (da-DK) locale (#12784) @EmilBahnsen

#### `@mui/x-data-grid-pro@7.3.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.3.0`, plus:

- [DataGridPro] Implement header filter height (#12666) @romgrk

#### `@mui/x-data-grid-premium@7.3.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.3.0`.

### Charts

#### Breaking change

A typo fix:

```diff
- ContinuouseScaleName
+ ContinuousScaleName
```

#### `@mui/x-charts@7.3.0`

- [charts] Add `dataIndex` to series `valueFormatter` (#12745) @JCQuintas
- [charts] Add color scale (#12490) @alexfauquette
- [charts] Do not document the usage of `DEFAULT_X_AXIS_KEY` and `DEFAULT_Y_AXIS_KEY` (#12780) @alexfauquette
- [charts] Export more utils (#12744) @alexfauquette
- [charts] Fix passing slot props down to `PieArcLabel` (#12806) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.3.0`

- [TreeView] Support `defaultMuiPrevented` on the `onFocus` prop of the root slot (#12813) @flaviendelangle

### Docs

- [docs] Add grid cell display example to the migration guide (#12793) @romgrk
- [docs] Use charts classes objects (#12781) @alexfauquette
- [docs] Fix layout shift on demos (#12816) @zanivan
- [test] Increase timeout for test that sometimes fail on `DateTimeRangePicker` (#12786) @LukasTy

### Core

- [docs-infra] Prepare infra to document charts interfaces (#12653) @alexfauquette

## 7.2.0

_Apr 12, 2024_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎨 Make grid colors customizable through the MUI themes API
- 🌍 Improve French (fr-FR), German (de-DE), and Swedish (sv-SE) locales on the Data Grid and Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.2.0`

- [DataGrid] Add missing `api` property to `GridCallbackDetails` (#12742) @sai6855
- [DataGrid] Do not escape double quotes when copying to clipboard (#12722) @cherniavskii
- [DataGrid] Fix column vertical border (#12741) @romgrk
- [DataGrid] Fix invalid date error when filtering `date`/`dateTime` columns (#12709) @cherniavskii
- [DataGrid] Fix overflow with dynamic row height (#12683) @romgrk
- [DataGrid] Make colors customizable (#12614) @romgrk
- [l10n] Improve French (fr-FR) locale (#12755) @derek-0000
- [l10n] Improve German (de-DE) locale (#12752) @Jens-Schoen
- [l10n] Improve Swedish (sv-SE) locale (#12731) @pontusdacke

#### `@mui/x-data-grid-pro@7.2.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.2.0`.

#### `@mui/x-data-grid-premium@7.2.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.2.0`, plus:

- [DataGridPremium] Fix clipboard paste not working when cell loses focus (#12724) @cherniavskii

### Date and Time Pickers

#### `@mui/x-date-pickers@7.2.0`

- [fields] Fix field editing after closing the picker (#12675) @LukasTy
- [l10n] Improve French (fr-FR) locale (#12692) @FaroukBel
- [l10n] Improve German (de-DE) locale (#12752) @Jens-Schoen
- [l10n] Improve Swedish (sv-SE) locale (#12731) @pontusdacke
- [pickers] Fix desktop date time Pickers grid layout (#12748) @LukasTy

#### `@mui/x-date-pickers-pro@7.2.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.2.0`, plus:

- [DateTimeRangePicker] Fix desktop toolbar style (#12760) @LukasTy

### Charts

#### `@mui/x-charts@7.2.0`

- [charts] Fix Bar chart with empty dataset throwing an error (#12708) @JCQuintas
- [charts] Fix `tickLabelInterval` not working on `YAxis` (#12746) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.2.0`

- [TreeView] Add a new lookup to access an item index without expansive computation (#12729) @flaviendelangle
- [TreeView] Clean up usage of term "node" in internals (#12655) @noraleonte
- [TreeView] Improve performance by removing `getNavigableChildrenIds` method (#12713) @flaviendelangle
- [TreeView] Remove `state.items.itemTree` (#12717) @flaviendelangle
- [TreeView] Remove remaining occurences of the word "node" in the codebase (#12712) @flaviendelangle
- [TreeView] Return `instance` and `publicAPI` methods from plugin and populate the main objects inside `useTreeView` (#12650) @flaviendelangle
- [TreeView] Fix behaviors when the item order changes (#12369) @flaviendelangle

### Docs

- [docs] Add `AxisFormatter` documentation for customizing tick/tooltip value formatting (#12700) @JCQuintas
- [docs] Add file explorer example to rich Tree View customization docs (#12707) @noraleonte
- [docs] Do not use import of depth 3 in the doc (#12716) @flaviendelangle
- [docs] Explain how to clip plots with composition (#12679) @alexfauquette
- [docs] Fix typo in Data Grid v7 migration page (#12720) @bfaulk96
- [docs] Fix typo in Pickers v7 migration page (#12721) @bfaulk96

### Core

- [core] Support multiple resolved `l10n` PR packages (#12735) @LukasTy
- [core] Update Netlify release references in release README (#12687) @LukasTy
- [core] Use `describeTreeView` for icons tests (#12672) @flaviendelangle
- [core] Use `describeTreeView` in existing tests for `useTreeViewItems` (#12732) @flaviendelangle

## 7.1.1

_Apr 5, 2024_

We'd like to offer a big thanks to the 19 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Add `setItemExpansion` Tree View API method (#12595) @flaviendelangle
- 🌍 Improve Persian (fa-IR), Portuguese (pt-BR), and Spanish (es-ES) locale on the Data Grid
- 🌍 Improve Persian (fa-IR), Portuguese (pt-BR), and Ukrainian (uk-UA) locale on the Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.1.1`

- [DataGrid] Allow higher packages' props to be used in MIT (#12365) @MBilalShafi
- [DataGrid] Fix RTL mode (#12583) @romgrk
- [DataGrid] Fix `ColDefChangesGridNoSnap` demo crash (#12663) @MBilalShafi
- [DataGrid] Fix server-side filter demo not working (#12662) @MBilalShafi
- [DataGrid] Log error if `rowCount` is used with client-side pagination (#12448) @michelengelen
- [DataGrid] Remove `GridFormatterParams` completely (#12660) @romgrk
- [DataGrid] Restore main slot (#12657) @romgrk
- [l10n] Improve Persian (fa-IR) locale (#12630) @amirhosseinzf
- [l10n] Improve Portuguese (pt-BR) locale (#12618) @hugoalkimim
- [l10n] Improve Spanish (es-ES) locale (#12606) @aitor40

#### `@mui/x-data-grid-pro@7.1.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.1.1`.

#### `@mui/x-data-grid-premium@7.1.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.1.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.1.1`

- [fields] Fix `readOnly` behavior (#12609) @LukasTy
- [l10n] Improve Persian (fa-IR) locale (#12632) @misafari
- [l10n] Improve Portuguese (pt-BR) locale (#12613) @cnHealth
- [l10n] Improve Ukrainian (uk-UA) locale (#12627) @alexkobylansky

#### `@mui/x-date-pickers-pro@7.1.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.1.1`, plus:

- [DateTimeRangePicker] Fix selection on same day (#12604) @LukasTy

### Charts

#### `@mui/x-charts@7.1.1`

- [charts] Fix `tickInterval` usage for y-axis (#12592) @alexfauquette
- [charts] Fix Scatter series highlight when `id` is a `number` (#12677) @JCQuintas
- [charts] Fix TS error when using `sx` property on `ChartsTooltip` (#12659) @JCQuintas

### Tree View

#### `@mui/x-tree-view@7.1.1`

- [TreeView] Add JSDoc to all `publicAPI` methods (#12649) @flaviendelangle
- [TreeView] Create `<RichTreeViewPro />` component (not released yet) (#12610) @flaviendelangle
- [TreeView] Create Pro package (not released yet) (#12240) @flaviendelangle
- [TreeView] Fix typo in errors (#12623) @alissa-tung
- [TreeView] New API method: `setItemExpansion` (#12595) @flaviendelangle

### Docs

- [docs] Add a recipe for the `checkboxSelectionVisibleOnly` prop (#12646) @michelengelen
- [docs] Explain the use of `_action: 'delete'` in `processRowUpdate` (#12670) @michelengelen
- [docs] Fix formatting and typo on migration guide @oliviertassinari
- [docs] Fix formatting in changelog @oliviertassinari
- [docs] Fix grammar in TreeView migration doc (#12615) @joshkel
- [docs] Fix missing closing props in `PieShapeNoSnap` demo (#12636) @alp-ex
- [docs] Fix type arguments in Custom Field page (#12619) @Juneezee
- [docs] Fix typo in `getItemId` prop description (#12637) @flaviendelangle
- [docs] Make the Charts `margin` usage more visible (#12591) @alexfauquette
- [docs] Match IE 11 spacing with Material UI @oliviertassinari
- [docs] Move Data Grid interfaces to standard API page layout (#12016) @alexfauquette
- [docs] Remove ` around @default values (#12158) @alexfauquette
- [docs] Remove `day` from the default `dayOfWeekFormatter` function params (#12644) @LukasTy
- [docs] Use `<TreeItem2 />` for icon expansion example on `<RichTreeView />` (#12563) @flaviendelangle

### Core

- [core] Add cherry-pick `master` to `v6` action (#12648) @LukasTy
- [core] Fix typo in `@mui/x-tree-view-pro/themeAugmentation` (#12674) @flaviendelangle
- [core] Introduce `describeTreeView` to run test on `<SimpleTreeView />` and `<RichTreeView />`, using `<TreeItem />` and `<TreeItem2 />` + migrate expansion tests (#12428) @flaviendelangle
- [core] Limit `test-types` CI step allowed memory (#12651) @LukasTy
- [core] Remove explicit `express` package (#12602) @LukasTy
- [core] Update to new embedded translations in the docs package (#12232) @Janpot
- [core] Use PR labels to identify the package a `l10n` PR belongs to (#12639) @LukasTy
- [core] Use `describeTreeView` for selection tests (#12647) @flaviendelangle
- [docs-infra] Adjust the links to search for issues (#11995) @michelengelen
- [infra] Polish support survey experience (#12624) @oliviertassinari
- [support-infra] Replace author association with a permission check in survey action (#12068) @michelengelen
- [support-infra] Fix user permission check (#12669) @michelengelen
- [test] Fix Tree View test import (#12668) @LukasTy

## 7.1.0

_Mar 28, 2024_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Add `resizeThrottleMs` prop (#12556) @romgrk
- 🌍 Improve Chinese (Hong Kong) (zh-HK) and Italian (it-IT) locale on the Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.1.0`

- [DataGrid] Add `resizeThrottleMs` prop (#12556) @romgrk
- [DataGrid] Do not publish `rowEditStop` event if row has fields with errors (#11383) @cherniavskii
- [DataGrid] Fix bug in suspense (#12553) @romgrk
- [DataGrid] Fix missing class name in the `GridToolbarQuickFilter` component (#12484) @jhawkins11

#### `@mui/x-data-grid-pro@7.1.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.1.0`.

#### `@mui/x-data-grid-premium@7.1.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.1.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.1.0`

- [fields] Fix placeholder override (#12589) @flaviendelangle
- [l10n] Improve Chinese (Hong Kong) (zh-HK) locale (#12547) @samchiu90
- [l10n] Improve Italian (it-IT) locale (#12549) @antomanc
- [pickers] Prepare compatibility with `@mui/zero-runtime` (stop using `ownerState` in `styled`) (#12003) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.1.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.1.0`, plus:

- [DateRangePicker] Fix selection behavior with single input field when `readOnly` (#12593) @LukasTy

### Charts

#### `@mui/x-charts@7.1.0`

- [charts] Fix tooltip causing crash on data change (#12571) @Rishi556

### Tree View

#### `@mui/x-tree-view@7.1.0`

- [TreeView] Do not use outdated version of the state to compute new label first char in Rich Tree View (#12512) @flaviendelangle

### Docs

- [docs] Add example to add a second icon next to the field's opening button (#12524) @flaviendelangle
- [docs] Add missing note to Data Grid migration guide (#12557) @romgrk
- [docs] Fix Charts title for SEO (#12545) @oliviertassinari
- [docs] Fix small typo (#12558) @diogoparente
- [docs] Improve codemod related documentation (#12582) @MBilalShafi
- [docs] Reduce noise in migration docs side navigation (#12552) @cherniavskii
- [docs] Sync static images from core repository (#12525) @LukasTy

### Core

- [core] Fix `l10n` script on Windows (#12550) @LukasTy
- [core] Include `DateTimeRangePicker` tag in `releaseChangelog` (#12526) @LukasTy
- [core] Upgrade monorepo (#12536) @cherniavskii

## 7.0.0

_Mar 22, 2024_

We're excited to [announce the first v7 stable release](https://mui.com/blog/mui-x-v7/)! 🎉🚀

This is now the officially supported major version, where we'll keep rolling out new features, bug fixes, and improvements.
Migration guides are available with a complete list of the breaking changes:

- [Data Grid](https://mui.com/x/migration/migration-data-grid-v6/)
- [Date and Time Pickers](https://mui.com/x/migration/migration-pickers-v6/)
- [Tree View](https://mui.com/x/migration/migration-tree-view-v6/)
- [Charts](https://mui.com/x/migration/migration-charts-v6/)

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Improve the usage of custom `viewRenderers` on `DateTimePicker` (#12441) @LukasTy
- ✨ Set focus on the focused Tree Item instead of the Tree View (#12226) @flaviendelangle
- 🕹️ Support controlled `density` for the Data Grid (#12332) @MBilalShafi
- 🎁 Dynamic virtualization range for the Data Grid (#12353) @romgrk
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The `density` is a [controlled prop](https://mui.com/x/react-data-grid/accessibility/#set-the-density-programmatically) now, if you were previously passing the `density` prop to the Data Grid, you will need to do one of the following:
  1. Move it to the `initialState.density` to initialize it.

  ```diff
   <DataGrid
  -  density="compact"
  +  initialState={{ density: "compact" }}
   />
  ```

  2. Move it to the state and use `onDensityChange` callback to update the `density` prop accordingly for it to work as expected.

  ```diff
  + const [density, setDensity] = React.useState<GridDensity>('compact');
   <DataGrid
  -  density="compact"
  +  density={density}
  +  onDensityChange={(newDensity) => setDensity(newDensity)}
   />
  ```

- The selector `gridDensityValueSelector` was removed, use the `gridDensitySelector` instead.

- The props `rowBuffer` and `columnBuffer` were renamed to `rowBufferPx` and `columnBufferPx`.
  Their value is now a pixel value rather than a number of items. Their default value is now `150`.

- The props `rowThreshold` and `columnThreshold` have been removed.
  If you had the `rowThreshold` prop set to `0` to force new rows to be rendered more often – this is no longer necessary.

#### `@mui/x-data-grid@7.0.0`

- [DataGrid] Allow to control the grid density (#12332) @MBilalShafi
- [DataGrid] Dynamic virtualization range (#12353) @romgrk
- [DataGrid] Fix `ElementType` usage (#12479) @cherniavskii
- [DataGrid] Fix cell value formatting on copy (#12357) @sai6855
- [DataGrid] Fix checkbox selection is keeping selection when filtering (#11751) @g1mishra
- [DataGrid] Make `rows` an optional prop (#12478) @MBilalShafi

#### `@mui/x-data-grid-pro@7.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0`.

#### `@mui/x-data-grid-premium@7.0.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0`, plus:

- [DataGridPremium] Add support for confirmation before clipboard paste (#12225) @cherniavskii
- [DataGridPremium] Fix single grouping column sorting (#9679) @cherniavskii
- [DataGridPremium] Fix boolean cell not rendered in group rows (#12492) @sai6855

### Date and Time Pickers

#### Breaking changes

- The `DesktopDateTimePicker` view rendering has been optimized by using the same technique as for `DesktopDateTimeRangePicker`.
  - The `dateTimeViewRenderers` have been removed in favor of reusing existing time view renderers (`renderTimeViewClock`, `renderDigitalClockTimeView` and `renderMultiSectionDigitalClockTimeView`) and date view renderer (`renderDateViewCalendar`).
  - Passing `renderTimeViewClock` to time view renderers will no longer revert to the old behavior of rendering only date or time view.

#### `@mui/x-date-pickers@7.0.0`

- [fields] Allow to override the separator between the start and the end date in all range fields (#12174) @flaviendelangle
- [fields] Support format without separator (#12489) @flaviendelangle
- [pickers] Use renderer interceptor on `DesktopDateTimePicker` (#12441) @LukasTy

#### `@mui/x-date-pickers-pro@7.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0`, plus:

- [DateTimeRangePicker] Add component `JSDoc` (#12518) @LukasTy
- [DateTimeRangePicker] Fix views behavior regression (#12529) @LukasTy

### Charts

#### `@mui/x-charts@7.0.0`

- [charts] Fix small typo in `CartesianContextProvider` (#12461) @Janpot

### Tree View

#### Breaking changes

- The required `nodeId` prop used by `<TreeItem />` has been renamed to `itemId` for consistency:

```diff
 <TreeView>
-    <TreeItem label="Item 1" nodeId="one">
+    <TreeItem label="Item 1" itemId="one">
 </TreeView>
```

- The focus is now applied to the Tree Item root element instead of the Tree View root element.

  This change will allow new features that require the focus to be on the Tree Item,
  like the drag and drop reordering of items.
  It also solves several issues with focus management,
  like the inability to scroll to the focused item when a lot of items are rendered.

  This will mostly impact how you write tests to interact with the Tree View:

  For example, if you were writing a test with `react-testing-library`, here is what the changes could look like:

  ```diff
   it('test example on first item', () => {
  -  const { getByRole } = render(
  +  const { getAllByRole } = render(
       <SimpleTreeView>
         <TreeItem nodeId="one" />
         <TreeItem nodeId="two" />
      </SimpleTreeView>
     );

  -  const tree = getByRole('tree');
  +  const firstTreeItem = getAllByRole('treeitem')[0];
     act(() => {
  -    tree.focus();
  +    firstTreeItem.focus();
     });
  -  fireEvent.keyDown(tree, { key: 'ArrowDown' });
  +  fireEvent.keyDown(firstTreeItem, { key: 'ArrowDown' });
   })
  ```

#### `@mui/x-tree-view@7.0.0`

- [TreeView] Rename `nodeId` to `itemId` (#12418) @noraleonte
- [TreeView] Set focus on the focused Tree Item instead of the Tree View (#12226) @flaviendelangle
- [TreeView] Update JSDoc of the `ContentComponent` prop to avoid using the word "node" (#12476) @flaviendelangle

### `@mui/x-codemod@7.0.0`

- [codemod] Add a codemod and update the grid migration guide (#12488) @MBilalShafi

### Docs

- [docs] Finalize migration guide (#12501) @noraleonte
- [docs] Fix nested cells alignment in the popular features demo (#12450) @cherniavskii
- [docs] Fix some Vale errors (#12469) @oliviertassinari
- [docs] Remove mentions of pre release (#12513) @noraleonte
- [docs] Update branch name and tags (#12498) @cherniavskii
- [docs] Update links to v6 (#12496) @cherniavskii
- [docs] Update links to v7 docs (#12500) @noraleonte
- [docs] Update supported versions (#12508) @joserodolfofreitas
- [docs] Update "What's new in MUI X" page #12527 @cherniavskii

### Core

- [core] Bump `@mui/material` peer dependency for all packages (#12516) @LukasTy
- [core] Fix `no-restricted-imports` ESLint rule not working for Data Grid packages (#12477) @cherniavskii
- [core] Lower the frequency of `no-response` action runs (#12491) @michaldudak
- [core] Remove leftover `legacy` `browserlistrc` entry (#12415) @LukasTy
- [core] Update NPM tag (#12511) @cherniavskii
- [core] Update supported browsers (browserlistrc) (#12521) @LukasTy
- [core] Use Circle CI context @oliviertassinari
- [license] Fix grammar on expired license error message (#12460) @joserodolfofreitas

## 7.0.0-beta.7

_Mar 14, 2024_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🦥 The Lazy loading feature is now stable and the `lazyLoading` feature flag was removed from the `experimentalFeatures` prop.
- 🌍 Improve Japanese (ja-JP) locale for the Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The `columnHeader--showColumnBorder` class was replaced by `columnHeader--withLeftBorder` and `columnHeader--withRightBorder`.
- The `columnHeadersInner`, `columnHeadersInner--scrollable`, and `columnHeaderDropZone` classes were removed since the inner wrapper was removed in our effort to simplify the DOM structure and improve accessibility.
- The `pinnedColumnHeaders`, `pinnedColumnHeaders--left`, and `pinnedColumnHeaders--right` classes were removed along with the element they were applied to.
  The pinned column headers now use `position: 'sticky'` and are rendered in the same row element as the regular column headers.

#### `@mui/x-data-grid@7.0.0-beta.7`

- [DataGrid] Fix focus visible style on scrollbar (#12402) @oliviertassinari
- [DataGrid] Fix the issue where pressing the Delete key resets various cell values to an empty string. (#12216) @sooster910
- [DataGrid] Make `rowCount` part of the state (#12381) @MBilalShafi
- [DataGrid] Make column resizing and autosizing available in Community plan (#12420) @cherniavskii
- [DataGrid] Remove `baseSwitch` slot (#12439) @romgrk
- [l10n] Improve Japanese (ja-JP) locale (#12398) @makoto14

#### `@mui/x-data-grid-pro@7.0.0-beta.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-beta.7`, plus:

- [DataGridPro] Add `inputRef` to the props passed to `colDef.renderHeaderFilter` (#12328) @vovarudomanenko
- [DataGridPro] Fix filler rendered for no reason when there are pinned columns (#12440) @cherniavskii
- [DataGridPro] Make lazy loading feature stable (#12421) @cherniavskii
- [DataGridPro] Render pinned and non-pinned column headers in one row (#12376) @cherniavskii

#### `@mui/x-data-grid-premium@7.0.0-beta.7` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-beta.7`, plus:

- [DataGridPremium] Fix auto-scroll not working when selecting cell range (#12267) @cherniavskii

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-beta.7`

- [fields] Fix `tabIndex` on accessible field DOM structure (#12311) @flaviendelangle
- [fields] Fix items alignment on multi input range fields (#12312) @flaviendelangle
- [pickers] Improve the customization of the range picker calendar header (#11988) @flaviendelangle
- [pickers] Keep the existing time when looking for closest enabled date (#12377) @LukasTy

#### `@mui/x-date-pickers-pro@7.0.0-beta.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-beta.7`.

### Charts

#### `@mui/x-charts@7.0.0-beta.7`

- [charts] Fix axis highlight when axis is reversed (#12407) @alexfauquette

### Tree View

#### Breaking changes

The `onNodeFocus` callback has been renamed to `onItemFocus` for consistency:

```diff
 <SimpleTreeView
-  onNodeFocus={onNodeFocus}
+  onItemFocus={onItemFocus}
 />
```

#### `@mui/x-tree-view@7.0.0-beta.7`

- [TreeView] Clean the usage of the term "item" and "node" in API introduced during v7 (#12368) @noraleonte
- [TreeView] Introduce a new `<TreeItem2 />` component and a new `useTreeItem2` hook (#11721) @flaviendelangle
- [TreeView] Rename `onNodeFocus` to `onItemFocus` (#12419) @noraleonte

### Docs

- [docs] Add `legacy` bundle drop mention in migration pages (#12424) @LukasTy
- [docs] Add missing luxon `Info` import (#12427) @LukasTy
- [docs] Improve slots definitions for charts (#12408) @alexfauquette
- [docs] Polish What's new in MUI X blog titles (#12309) @oliviertassinari
- [docs] Replace `rel="noreferrer"` by `rel="noopener"` @oliviertassinari
- [docs] Update `date-fns` `weekStarsOn` overriding example (#12416) @LukasTy

### Core

- [core] Fix CI (#12414) @flaviendelangle
- [core] Fix PR deploy link for Tree View doc pages (#12411) @flaviendelangle

## 7.0.0-beta.6

_Mar 8, 2024_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.0.0-beta.6`

- [DataGrid] Fix crashing of demos on rating change (#12315) @sai6855
- [DataGrid] Fix double border below header (#12349) @joespeargresham
- [DataGrid] Fix empty sort being saved in the `sortModel` (#12325) @MBilalShafi
- [DataGrid] Remove unnecessary `stopCellMode` event in `renderEditRating` component (#12335) @sai6855
- [DataGrid] Small performance optimizations (#12346) @romgrk

#### `@mui/x-data-grid-pro@7.0.0-beta.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-beta.6`, plus:

- [DataGridPro] Rework `onRowsScrollEnd` to use `IntersectionObserver` (#8672) @DanailH

#### `@mui/x-data-grid-premium@7.0.0-beta.6` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-beta.6`.

### Charts

#### `@mui/x-charts@7.0.0-beta.6`

- [charts] Add context to axis value formatter (#12172) @alexfauquette
- [charts] Customize tick position for band scale (#12316) @alexfauquette
- [charts] Fix RTL legend (#12175) @alexfauquette

### Tree View

#### Breaking changes

- The component used to animate the item children is now defined as a slot on the `<TreeItem />` component.

  If you were passing a `TransitionComponent` or `TransitionProps` to your `<TreeItem />` component,
  you need to use the new `groupTransition` slot on this component:

  ```diff
   <SimpleTreeView>
      <TreeItem
        nodeId="1"
        label="Node 1"
  -     TransitionComponent={Fade}
  +     slots={{ groupTransition: Fade }}
  -     TransitionProps={{ timeout: 600 }}
  +     slotProps={{ groupTransition: { timeout: 600 } }}
      />
    </SimpleTreeView>
  ```

- The `group` class of the `<TreeItem />` component has been renamed to `groupTransition` to match with its new slot name.

  ```diff
   const StyledTreeItem = styled(TreeItem)({
  -  [`& .${treeItemClasses.group}`]: {
  +  [`& .${treeItemClasses.groupTransition}`]: {
      marginLeft: 20,
    },
   });
  ```

#### `@mui/x-tree-view@7.0.0-beta.6`

- [TreeView] Fix invalid nodes state when updating `props.items` (#12359) @flaviendelangle
- [TreeView] In the Rich Tree View, do not use the item id as the HTML id attribute (#12319) @flaviendelangle
- [TreeView] New instance and publicAPI method: `getItem` (#12251) @flaviendelangle
- [TreeView] Replace `TransitionComponent` and `TransitionProps` with a `groupTransition` slot (#12336) @flaviendelangle

### Docs

- [docs] Add a note about `z-index` usage in SVG (#12337) @alexfauquette
- [docs] Rich Tree View customization docs (#12231) @noraleonte

### Core

- [test] Add `Charts` test (#11551) @alexfauquette

## 7.0.0-beta.5

_Mar 1, 2024_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add `getSortComparator` for more advanced sorting behaviors (#12215) @cherniavskii
- 🚀 Add `use client` directive to the Grid packages (#11803) @MBilalShafi
- 🌍 Improve Korean (ko-KR) and Chinese (zh-CN) locales on the Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.0.0-beta.5`

- [DataGrid] Add `getSortComparator` for more advanced sorting behaviors (#12215) @cherniavskii
- [DataGrid] Add `use client` directive to the Grid packages (#11803) @MBilalShafi
- [DataGrid] Fix `disableResetButton` and `disableShowHideToggle` flags to not exclude each other (#12169) @adyry
- [DataGrid] Fix cell range classnames (#12230) @romgrk
- [DataGrid] Fix wrong offset for right-pinned columns when toggling dark/light modes (#12233) @cherniavskii
- [DataGrid] Improve row virtualization and rendering performance (#12247) @romgrk
- [DataGrid] Improve performance by removing `querySelector` call (#12229) @romgrk
- [DataGrid] Fix `onColumnWidthChange` called before autosize affects column width (#12140) @shaharyar-shamshi
- [DataGrid] Fix boolean "is" filter (#12117) @shaharyar-shamshi
- [DataGrid] Fix `upsertFilterItems` removing filters that are not part of the update (#11954) @gitstart
- [DataGrid] Render scrollbars only if there is scroll (#12265) @cherniavskii

#### `@mui/x-data-grid-pro@7.0.0-beta.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-beta.5`, plus:

- [DataGridPro] Fix column resize errors on MacOS with automatic scrollbars enabled (#12217) @cherniavskii
- [DataGridPro] Fix lazy-loading crash (#12080) @romgrk
- [DataGridPro] Fix useGridRows not giving error on reversed data (#10821) @martijn-basesoft

#### `@mui/x-data-grid-premium@7.0.0-beta.5` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-beta.5`, plus:

- [DataGridPremium] Make clipboard copy respect the sorting during cell selection (#12235) @MBilalShafi

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-beta.5`

- [pickers] Fix toolbar components props handling (#12211) @LukasTy
- [l10n] Improve Chinese (zh-CN) locale (#12245) @headironc
- [l10n] Improve Korean (ko-KR) locale (#12192) @Luzi

#### `@mui/x-date-pickers-pro@7.0.0-beta.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-beta.5`.

- [DateTimeRangePicker] Fix validation behavior (#12243) @LukasTy

### Charts / `@mui/x-charts@7.0.0-beta.5`

- [charts] Fix grid duplicated key (#12208) @alexfauquette

### Tree View / `@mui/x-tree-view@7.0.0-beta.5`

- [TreeView] Add public API and expose focus method (#12143) @noraleonte

### Docs

- [docs] Fix image layout shift when loading @oliviertassinari
- [docs] Match Material UI repo comment for redirections @oliviertassinari
- [docs] Non breaking spaces @oliviertassinari
- [docs] Polish the Date Picker playground (#11869) @zanivan
- [docs] Standardize WAI-ARIA references @oliviertassinari

### Core

- [core] Allow local docs next.js settings (#12227) @romgrk
- [core] Remove grid folder from `getComponentInfo` RegExp (#12241) @flaviendelangle
- [core] Remove `window.` reference for common globals @oliviertassinari
- [core] Use runtime agnostic setTimeout type @oliviertassinari
- [docs-infra] Fix Stack Overflow breaking space @oliviertassinari
- [docs-infra] Fix missing non breaking spaces @oliviertassinari
- [infra] Update `no-response` workflow (#12193) @MBilalShafi
- [infra] Fix missing permission reset @oliviertassinari

## 7.0.0-beta.4

_Feb 23, 2024_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce a new DOM structure for the field components that provides a better accessibility
- 🚀 Simplify Data Grid DOM structure for improved performance (#12013) @romgrk
- 🕥 The support for IE 11 has been removed (#12151) @flaviendelangle
- 🐞 Bugfixes
- 📚 Documentation improvements

### Breaking changes

- The support for IE 11 has been removed from all MUI X packages. The `legacy` bundle that used to support old browsers like IE 11 is no longer included.

### Data Grid

#### Breaking changes

- The cell inner wrapper `.MuiDataGrid-cellContent` has been removed, use `.MuiDataGrid-cell` to style the cells.

#### `@mui/x-data-grid@7.0.0-beta.4`

- [DataGrid] Simplify cell DOM structure (#12013) @romgrk
- [DataGrid] Fix values labels in `is any of` filter operator (#11939) @gitstart

#### `@mui/x-data-grid-pro@7.0.0-beta.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-beta.4`.

#### `@mui/x-data-grid-premium@7.0.0-beta.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-beta.4`.

### Date and Time Pickers

#### Breaking changes

- The `selectedSections` prop no longer accepts start and end indexes.
  When selecting several — but not all — sections, the field components were not behaving correctly, you can now only select one or all sections:

  ```diff
   <DateField
  -  selectedSections={{ startIndex: 0, endIndex: 0 }}
  +  selectedSections={0}

     // If the field has 3 sections
  -  selectedSections={{ startIndex: 0, endIndex: 2 }}
  +  selectedSections="all"
   />
  ```

- The headless field hooks (for example `useDateField()`) now returns a new prop called `enableAccessibleFieldDOMStructure`.
  This property is utilized to determine whether the anticipated UI is constructed using an accessible DOM structure.
  Learn more about this new accessible DOM structure in the [v8 migration guide](https://v7.mui.com/x/migration/migration-pickers-v7/#new-dom-structure-for-the-field).

  When building a custom UI, you are most-likely only supporting one DOM structure, so you can remove `enableAccessibleFieldDOMStructure` before it is passed to the DOM:

  ```diff
    function MyCustomTextField(props) {
      const {
  +     // Should be ignored
  +     enableAccessibleFieldDOMStructure,
        // ... rest of the props you are using
      } = props;

      return ( /* Some UI to edit the date */ )
    }

    function MyCustomField(props) {
      const fieldResponse = useDateField<Dayjs, false, typeof textFieldProps>({
        ...props,
  +     // If you only support one DOM structure, we advise you to hardcode it here to avoid unwanted switches in your application
  +     enableAccessibleFieldDOMStructure: false,
      });

      return <MyCustomTextField ref={ref} {...fieldResponse} />;
    }

    function App() {
      return <DatePicker slots={{ field: MyCustomField }} />;
    }
  ```

- The following internal types were exported by mistake and have been removed from the public API:
  - `UseDateFieldDefaultizedProps`
  - `UseTimeFieldDefaultizedProps`
  - `UseDateTimeFieldDefaultizedProps`
  - `UseSingleInputDateRangeFieldComponentProps`
  - `UseSingleInputTimeRangeFieldComponentProps`
  - `UseSingleInputDateTimeRangeFieldComponentProps`

#### `@mui/x-date-pickers@7.0.0-beta.4`

- [fields] Add a11y support to multi-HTML field (#12173) @LukasTy
- [fields] Use the `PickersTextField` component in the fields (#10649) @flaviendelangle
- [pickers] Fix styling props propagation to `DateTimePickerTabs` (#12096) @LukasTy

#### `@mui/x-date-pickers-pro@7.0.0-beta.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-beta.4`.

### Charts / `@mui/x-charts@7.0.0-beta.4`

#### Breaking changes

These components are no longer exported from `@mui/x-charts`:

- `CartesianContextProvider`
- `DrawingProvider`

#### `@mui/x-charts@7.0.0-beta.4`

- [charts] Don't display text if no value is provided (#12127) @alexfauquette
- [charts] Remove export of context providers (#12123) @oliviertassinari

### Tree View / `@mui/x-tree-view@7.0.0-beta.4`

- [TreeView] Stop using custom `findIndex` to support IE 11 (#12129) @flaviendelangle

### Docs

- [docs] Add recipe for hiding separator on non-resizable columns (#12134) @michelengelen
- [docs] Add small improvements to the Gauge page (#12076) @danilo-leal
- [docs] Add the 'point' scaleType to the axis documentation (#12179) @alexfauquette
- [docs] Clarify Pickers 'Component composition' section (#12097) @LukasTy
- [docs] Fix "Licensing" page link (#12156) @LukasTy
- [docs] Fix the Treemap illustration (#12185) @danilo-leal
- [docs] Fix error raised by Grammarly on the page @oliviertassinari
- [docs] Improve performance on Charts entry point @oliviertassinari
- [docs] Link to React Transition Group with https @oliviertassinari
- [docs] Move Heatmap to `pro` plan (#12047) @alexfauquette
- [docs] Reduce number of Vale errors @oliviertassinari
- [docs] Remove default value set to `undefined` (#12128) @alexfauquette

### Core

- [core] Fix docs link check (#12135) @LukasTy
- [core] Fix missing context display names (#12124) @oliviertassinari
- [core] Fix shortcuts when Caps Lock enabled (#12121) @oliviertassinari
- [core] Remove IE 11 compat logic (#12119) @oliviertassinari
- [core] Simplify key utils (#12120) @oliviertassinari
- [core] Use the @mui/internal-scripts package (#12142) @michaldudak
- [all components] Remove legacy IE 11 bundle (#12151) @flaviendelangle
- [code-infra] Bump monorepo (#11880) @Janpot
- [code-infra] Use `experimental.cpus` to control amount of export workers in Next.js (#12095) @Janpot
- [docs-infra] Remove randomized API page layout (#11876) @alexfauquette
- [test] Create local wrapper over `describeConformance` (#12130) @michaldudak

## 7.0.0-beta.3

_Feb 16, 2024_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Charts get a [built in grid](https://v7.mui.com/x/react-charts/axis/#grid)

  <img src="https://github.com/mui/mui-x/assets/45398769/74299f54-f020-4135-b38c-dc88a230db30" width="510" alt="Charts Grid" />

- 🎛️ Charts get a [Gauge component](https://v7.mui.com/x/react-charts/gauge/).

  <img src="https://github.com/mui/mui-x/assets/45398769/fb7a94b5-bef6-4fc2-a0cd-d6ff5b60fa8b" width="510" alt="Guage Chart" />

- 🐞 Bugfixes

- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The `rowEditCommit` event and the related prop `onRowEditCommit` was removed. The [`processRowUpdate`](https://v7.mui.com/x/react-data-grid/editing/#the-processrowupdate-callback) prop can be used in place.

#### `@mui/x-data-grid@7.0.0-beta.3`

- [DataGrid] Performance: avoid style invalidation (#12019) @romgrk
- [DataGrid] Remove legacy editing API event: `rowEditCommit` (#12073) @MBilalShafi
- [DataGrid] Fix styling grid filter input single select (#11520) @FreakDroid

#### `@mui/x-data-grid-pro@7.0.0-beta.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-beta.3`.

#### `@mui/x-data-grid-premium@7.0.0-beta.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-beta.3`.

### Charts / `@mui/x-charts@7.0.0-beta.3`

- [charts] Add Gauge component (#11996) @alexfauquette
- [charts] Add a `ChartsGrid` component (#11034) @alexfauquette

### Tree View / `@mui/x-tree-view@7.0.0-beta.3`

- [TreeView] Remove instance existence checks (#12066) @flaviendelangle

### Docs

- [docs] Complete charts API pages (#12038) @alexfauquette
- [docs] Add more illustrations to the charts overview page (#12041) @danilo-leal
- [docs] Fix 301 redirection to StackBlitz @oliviertassinari
- [docs] Fix Tree space to match the reset of the docs @oliviertassinari
- [docs] Fix `dayOfWeekFormatter` typo in the pickers v6 to v7 migration document (#12043) @StylesTrip
- [docs] Fix redirection @oliviertassinari
- [docs] Fix typo for `AdapterDateFnsV3` (#12036) @flaviendelangle
- [docs] Removed `focused` prop from demo (#12092) @michelengelen

### Core

- [core] Fix CodeSandbox CI template @oliviertassinari
- [core] Sort prop asc (#12033) @oliviertassinari
- [core] Bump monorepo (#12055) @alexfauquette

## 7.0.0-beta.2

_Feb 9, 2024_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Add slot typings on the Data Grid components (#11795) @romgrk
- 🎁 Support UTC date formatting in Charts tooltip (#11943) @shaharyar-shamshi
- 🌍 Improve Danish (da-DK) locale Data Grid (#11877) @ShahrazH
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.0.0-beta.2`

- [DataGrid] Add `removeAllFilterItems` as a reason of `onFilterModelChange` callback (#11911) @shaharyar-shamshi
- [DataGrid] Add slot typings (#11795) @romgrk
- [DataGrid] Add support for dialogs in menu actions (#11909) @cherniavskii
- [DataGrid] Allow passing readonly arrays to `pageSizeOptions` prop (#11609) @pcorpet
- [DataGrid] Fix incorrect computation of `lastPage` in `GridPagination` (#11958) @MBilalShafi
- [DataGrid] Improve vertical scrolling performance (#11924) @romgrk
- [l10n] Improve Danish (da-DK) locale (#11877) @ShahrazH

#### `@mui/x-data-grid-pro@7.0.0-beta.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@v7.0.0-beta.2`.

#### `@mui/x-data-grid-premium@v7.0.0-beta.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-beta.2`, plus:

- [DataGridPremium] Fix autosize grouping cell (#11870) @romgrk
- [DataGridPremium] Fix clipboard paste not working with Caps Lock enabled (#11965) @shaharyar-shamshi

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-beta.2`

- [pickers] Avoid relying on locale in Luxon `isWithinRange` method (#11936) @LukasTy
- [pickers] Limit the valid values of `TDate` (#11791) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.0.0-beta.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-beta.2`.

### Charts / `@mui/x-charts@7.0.0-beta.2`

- [charts] Add `reverse` property to axes (#11899) @alexfauquette
- [charts] Allow series ids to be numbers (#11941) @alexfauquette
- [charts] Support UTC date formatting in tooltip (#11943) @shaharyar-shamshi

### Tree View / `@mui/x-tree-view@7.0.0-beta.2`

- [TreeView] Correctly detect if an item is expandable (#11963) @swalker326
- [TreeView] Polish the default design & revise the simple version pages (#11529) @danilo-leal

### License

#### Breaking changes

- If you're using the [commercial license](https://v7.mui.com/x/introduction/licensing), you need to update the import path:

  ```diff
  -import { LicenseInfo } from '@mui/x-license-pro';
  +import { LicenseInfo } from '@mui/x-license';
  ```

`@mui/x-license@7.0.0-beta.2`

- [license] Rename `@mui/x-license-pro` to `@mui/x-license` (#11938) @cherniavskii

### Docs

- [docs] Add a note about `AdapterDateFnsV3` on the Getting Started page (#11985) @flaviendelangle
- [docs] Add missing `Charts` breaking change steps (#11971) @alexfauquette
- [docs] Fix `ChartsTooltip` typo (#11961) @thisisharsh7
- [docs] Refactor `Localization` documentation sections (#11989) @LukasTy
- [docs] Use "cannot" instead of "can't" or "can not" (#11986) @flaviendelangle
- [docs] Add quick fixes to the migration guide (#11806) @danilo-leal
- [docs] Avoid use of shorthand (#12000) @oliviertassinari
- [docs] Avoid the use of MUI Core @oliviertassinari
- [docs] Fix image size and dark mode @oliviertassinari
- [docs] Follow blank line convention with use client @oliviertassinari
- [docs] Stable layout between light and dark mode @oliviertassinari

### Core

- [core] Add `docs:serve` script (#11935) @cherniavskii
- [core] Bump monorepo (#12001) @cherniavskii
- [core] Deprecate `LicenseInfo` re-exports (#11956) @cherniavskii
- [core] Fix `test_types` failing on the `next` branch (#11944) @cherniavskii
- [core] Fix failing `test_static` on the next branch (#11977) @cherniavskii
- [core] Flatten grid packages folder (#11946) @cherniavskii
- [core] Improve license info deprecation message (#11974) @cherniavskii
- [core] Integrate changes from Core #40842 PR (#11801) @michaldudak
- [core] Move next config to ESM (#11882) @Janpot
- [core] Add auto-message on closed issues (#11805) @michelengelen
- [core] Simplify bug reproduction (#11849) @oliviertassinari
- [core] Fix npm reference @oliviertassinari
- [core] Normalize issue template @oliviertassinari

## 7.0.0-beta.1

_Feb 1, 2024_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🏃 Improve the filtering performance of the Data Grid by changing the `GridColDef` methods signatures (#11573) @cherniavskii
- 🎁 The Line Chart component now has animation by default (#11620) @alexfauquette
- 🚀 All charts have click handlers (#11411) @alexfauquette
  Test their respective documentation demonstrations to know more about the data format:
  - [Scatter Chart](https://v7.mui.com/x/react-charts/scatter/#click-event)
  - [Line Chart](https://v7.mui.com/x/react-charts/lines/#click-event)
  - [Bar Chart](https://v7.mui.com/x/react-charts/bars/#click-event)
  - [Pie Chart](https://v7.mui.com/x/react-charts/pie/#click-event)

  Big thanks to @giladappsforce and @yaredtsy for their contribution on exploring this feature.

### Data Grid

### Breaking changes

- The signature of `GridColDef['valueGetter']` has been changed for performance reasons:

  ```diff
  - valueGetter: ({ value, row }) => value,
  + valueGetter: (value, row, column, apiRef) => value,
  ```

  The `GridValueGetterParams` interface has been removed:

  ```diff
  - const customValueGetter = (params: GridValueGetterParams) => params.row.budget;
  + const customValueGetter: GridValueGetterFn = (value, row) => row.budget;
  ```

- The signature of `GridColDef['valueFormatter']` has been changed for performance reasons:

  ```diff
  - valueFormatter: ({ value }) => value,
  + valueFormatter: (value, row, column, apiRef) => value,
  ```

  The `GridValueFormatterParams` interface has been removed:

  ```diff
  - const gridDateFormatter = ({ value, field, id }: GridValueFormatterParams<Date>) => value.toLocaleDateString();
  + const gridDateFormatter: GridValueFormatter = (value: Date) => value.toLocaleDateString();
  ```

- The signature of `GridColDef['valueSetter']` has been changed for performance reasons:

  ```diff
  - valueSetter: (params) => {
  -   const [firstName, lastName] = params.value!.toString().split(' ');
  -   return { ...params.row, firstName, lastName };
  - }
  + valueSetter: (value, row) => {
  +   const [firstName, lastName] = value!.toString().split(' ');
  +   return { ...row, firstName, lastName };
  +}
  ```

  The `GridValueSetterParams` interface has been removed:

  ```diff
  - const setFullName = (params: GridValueSetterParams) => {
  -   const [firstName, lastName] = params.value!.toString().split(' ');
  -   return { ...params.row, firstName, lastName };
  - };
  + const setFullName: GridValueSetter<Row> = (value, row) => {
  +   const [firstName, lastName] = value!.toString().split(' ');
  +   return { ...row, firstName, lastName };
  + }
  ```

- The signature of `GridColDef['valueParser']` has been changed for performance reasons:

  ```diff
  - valueParser: (value, params: GridCellParams) => value.toLowerCase(),
  + valueParser: (value, row, column, apiRef) => value.toLowerCase(),
  ```

- The signature of `GridColDef['colSpan']` has been changed for performance reasons:

  ```diff
  - colSpan: ({ row, field, value }: GridCellParams) => (row.id === 'total' ? 2 : 1),
  + colSpan: (value, row, column, apiRef) => (row.id === 'total' ? 2 : 1),
  ```

- The signature of `GridColDef['pastedValueParser']` has been changed for performance reasons:

  ```diff
  - pastedValueParser: (value, params) => new Date(value),
  + pastedValueParser: (value, row, column, apiRef) => new Date(value),
  ```

- The signature of `GridColDef['groupingValueGetter']` has been changed for performance reasons:

  ```diff
  - groupingValueGetter: (params) => params.value.name,
  + groupingValueGetter: (value: { name: string }) => value.name,
  ```

#### `@mui/x-data-grid@7.0.0-beta.1`

- [DataGrid] Add `toggleAllMode` prop to the `columnsManagement` slot (#10794) @H999
- [DataGrid] Change `GridColDef` methods signatures (#11573) @cherniavskii
- [DataGrid] Fix row reorder with cell selection (#11783) @PEsteves8
- [DataGrid] Make columns management' casing consistent (#11858) @MBilalShafi
- [l10n] Improve Hebrew (he-IL) locale (#11788) @danielmishan85

#### `@mui/x-data-grid-pro@7.0.0-beta.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-beta.1`.

#### `@mui/x-data-grid-premium@7.0.0-beta.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-beta.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-beta.1`

- [TimePicker] Add missing toolbar classes descriptions (#11856) @LukasTy

#### `@mui/x-date-pickers-pro@7.0.0-beta.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-beta.1`.

### Charts

#### Breaking changes

- The line chart now have animation by default.
  You can disable it with `skipAnimation` prop.
  See [animation documentation](v7.mui.com/x/react-charts/lines/#animation) for more information.

- Pie charts `onClick` get renamed `onItemClick` for consistency with other charts click callback.

`@mui/x-charts@7.0.0-beta.1`

- [charts] Add `onClick` support (#11411) @alexfauquette
- [charts] Add line animation (#11620) @alexfauquette
- [charts] Document how to modify color according to values (#11824) @alexfauquette
- [charts] Fix Tooltip crash with out of range lines (#11898) @alexfauquette

### Docs

- [docs] Add a general uplift to the changelog page (#11396) @danilo-leal
- [docs] Do not reference the Tree View overview page in the API pages (#11826) @flaviendelangle
- [docs] Fix charts API links (#11832) @alexfauquette
- [docs] Improve Support page (#11556) @oliviertassinari
- [docs] Improve column visibility documentation (#11857) @MBilalShafi
- [docs] Polish header @oliviertassinari
- [docs] Sync support page with core @oliviertassinari
- [docs] Update whats new page with "v7 Beta blogpost" content (#11879) @joserodolfofreitas

### Core

- [core] Rely on immutable ref when possible (#11847) @oliviertassinari
- [core] Bump monorepo (#11897) @alexfauquette

## 7.0.0-beta.0

_Jan 26, 2024_

We are glad to announce MUI X v7 beta!
This version has several improvements, bug fixes, and exciting features 🎉.
We want to offer a big thanks to the 7 contributors who made this release possible ✨:

- 🚀 Release the [Date Time Range Picker](https://v7.mui.com/x/react-date-pickers/date-time-range-picker/) component (#9528) @LukasTy

  <img src="https://github.com/mui/mui-x/assets/4941090/122bb7bc-5e72-4e11-a8e5-96f3026de922" width="510" height="652" alt="Date Time Range Picker example" />

- 🎁 New column management panel design for the Data Grid (#11770) @MBilalShafi

  <img width="310" alt="image" src="https://github.com/mui/mui-x/assets/12609561/a79dac8b-d54d-4e69-a63a-ef78f3993f37">

- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The columns management component has been redesigned and the component was extracted from the `ColumnsPanel` which now only serves as a wrapper to display the component above the headers as a panel. As a result, a new slot `columnsManagement` and the related prop `slotProps.columnsManagement` have been introduced. The props corresponding to the columns management component which were previously passed to the prop `slotProps.columnsPanel` should now be passed to `slotProps.columnsManagement`. `slotProps.columnsPanel` could still be used to override props corresponding to the `Panel` component used in `ColumnsPanel` which uses [`Popper`](https://v7.mui.com/material-ui/react-popper/) component under the hood.

  ```diff
   <DataGrid
    slotProps={{
  -   columnsPanel: {
  +   columnsManagement: {
        sort: 'asc',
        autoFocusSearchField: false,
      },
    }}
   />
  ```

- `Show all` and `Hide all` buttons in the `ColumnsPanel` have been combined into one `Show/Hide All` toggle in the new columns management component. The related props `disableShowAllButton` and `disableHideAllButton` have been replaced with a new prop `disableShowHideToggle`.

  ```diff
   <DataGrid
  -  disableShowAllButton
  -  disableHideAllButton
  +  disableShowHideToggle
   />
  ```

#### `@mui/x-data-grid@7.0.0-beta.0`

- [DataGrid] Export `GridColumnTypes` interface for custom column types (#11742) @cherniavskii
- [DataGrid] Initialize `apiRef` early (#11792) @cherniavskii
- [DataGrid] New column management panel design (#11770) @MBilalShafi
- [DataGrid] Fix support for tree with more than 50,000 children (#11757) @zenazn

#### `@mui/x-data-grid-pro@7.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-beta.0`.

#### `@mui/x-data-grid-premium@7.0.0-beta.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-beta.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-beta.0`

- [pickers] Apply the `layout.tabs` class to `Tabs` slot (#11781) @LukasTy
- [pickers] Avoid deep imports (#11794) @LukasTy
- [pickers] Fields typing optimization (#11779) @LukasTy

#### `@mui/x-date-pickers-pro@7.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-beta.0`, plus:

- [pickers] Add `DateTimeRangePicker` component (#9528) @LukasTy
- [pickers] Add `DateTimeRangePicker` theme augmentation (#11814) @LukasTy
- [DateRangePicker] Remove `calendars` prop on `Mobile` (#11752) @LukasTy

### Tree View / `@mui/x-tree-view@7.0.0-beta.0`

- [TreeView] Remove unused props from prop-types and typing (#11778) @flaviendelangle
- [TreeView] Throw an error when two items have the same id (#11715) @flaviendelangle

### Docs

- [docs] Add `contextValue` to the headless Tree View doc (#11705) @flaviendelangle
- [docs] Add section for the `disableSelection` prop (#11821) @flaviendelangle
- [docs] Fix brand name non-breaking space (#11758) @oliviertassinari
- [docs] Fix typo in Data Grid components page (#11775) @flaviendelangle
- [docs] Fix use of quote, should use callout (#11759) @oliviertassinari
- [docs] Improve error message for MUI Vale rule @oliviertassinari
- [docs] Include `DateTimeRangePicker` in relevant demos (#11815) @LukasTy
- [docs] Add recipe for sorting row groups by the number of child rows (#11164) @cherniavskii

### Core

- [core] Cleanup script and alias setup (#11749) @LukasTy
- [core] Polish issue templates @oliviertassinari
- [code-infra] Update prettier and pretty-quick (#11735) @Janpot

## 7.0.0-alpha.9

_Jan 19, 2024_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🎁 The Data Grid headers have been refactored to bring immense improvements to scrolling, state management, and overall performance of the grid.
- ⚙️ The Data Grid disabled column-specific features like filtering, sorting, grouping, etc. could now be accessed programmatically. See the related [docs](https://v7.mui.com/x/react-data-grid/api-object/#access-the-disabled-column-features) section.
- 🚀 Uplift the Simple Tree View customization examples (#11424) @noraleonte
- 🌍 Add Croatian (hr-HR), Portuguese (pt-PT), and Chinese (Hong Kong) (zh-HK) locales (#11668) on the Data Grid @BCaspari
- 🐞 Bugfixes
- 💔 Bump `@mui/material` peer dependency for all packages (#11692) @LukasTy
  The minimum required version of `@mui/material` is now `5.15.0`.

### Data Grid

#### Breaking changes

- The `ariaV7` experimental flag has been removed and the Data Grid now uses the improved accessibility implementation by default.
  If you were using the `ariaV7` flag, you can remove it from the `experimentalFeatures` prop:

  ```diff
  -<DataGrid experimentalFeatures={{ ariaV7: true }} />
  +<DataGrid />
  ```

  The most notable changes that might affect your application or tests are:
  - The `role="grid"` attribute along with related ARIA attributes are now applied to the inner `div` element instead of the root `div` element:

    ```diff
    -<div class="MuiDataGrid-root" role="grid" aria-colcount="5" aria-rowcount="101" aria-multiselectable="false">
    +<div class="MuiDataGrid-root">
       <div class="MuiDataGrid-toolbarContainer"></div>
    -    <div class="MuiDataGrid-main"></div>
    +    <div class="MuiDataGrid-main" role="grid" aria-colcount="5" aria-rowcount="101" aria-multiselectable="false"></div>
       <div class="MuiDataGrid-footerContainer"></div>
     </div>
    ```

  - When the [Tree data](https://v7.mui.com/x/react-data-grid/tree-data/) feature is used, the grid role is now `role="treegrid"` instead of `role="grid"`.
  - The Data Grid cells now have `role="gridcell"` instead of `role="cell"`.

  - The buttons in toolbar composable components `GridToolbarColumnsButton`, `GridToolbarFilterButton`, `GridToolbarDensity`, and `GridToolbarExport` are now wrapped with a tooltip component and have a consistent interface. To override some props corresponding to the toolbar buttons or their corresponding tooltips, you can use the `slotProps` prop. Following is an example diff. See [Toolbar section](https://v7.mui.com/x/react-data-grid/components/#toolbar) for more details.

    ```diff
      function CustomToolbar() {
        return (
          <GridToolbarContainer>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton
      -     title="Custom filter" // 🛑 This was previously forwarded to the tooltip component
      +     slotProps={{ tooltip: { title: 'Custom filter' } }} // ✅ This is the correct way now
          />
          <GridToolbarDensitySelector
      -     variant="outlined"    // 🛑 This was previously forwarded to the button component
      +     slotProps={{ button: { variant: 'outlined' } }} // ✅ This is the correct way now
          />
          </GridToolbarContainer>
        );
      }
    ```

- Column grouping is now enabled by default. The flag `columnGrouping` is no longer needed to be passed to the `experimentalFeatures` prop to enable it.

  ```diff
  -<DataGrid experimentalFeatures={{ columnGrouping: true }} />
  +<DataGrid />
  ```

- The column grouping API methods `getColumnGroupPath` and `getAllGroupDetails` are no longer prefixed with `unstable_`.

- The column grouping selectors `gridFocusColumnGroupHeaderSelector` and `gridTabIndexColumnGroupHeaderSelector` are no longer prefixed with `unstable_`.

- The disabled column specific features like `hiding`, `sorting`, `filtering`, `pinning`, `row grouping`, etc could now be controlled programmatically using `initialState`, respective controlled models, or the [API object](https://v7.mui.com/x/react-data-grid/api-object/). See the related [docs](https://v7.mui.com/x/react-data-grid/api-object/#access-the-disabled-column-features) section.

#### `@mui/x-data-grid@7.0.0-alpha.9`

- [DataGrid] Allow to filter non-filterable columns programmatically (#11538) @MBilalShafi
- [DataGrid] Allow to programmatically sort unsortable columns (#11512) @MBilalShafi
- [DataGrid] Fix incorrect default value for `filterModel.logicOperator` (#11673) @MBilalShafi
- [DataGrid] Make `column grouping` feature stable (#11698) @MBilalShafi
- [DataGrid] Remove the `ariaV7` experimental flag (#11428) @cherniavskii
- [DataGrid] Start the FAQ page (#11686) @MBilalShafi
- [DataGrid] Sticky headers (#10059) @romgrk
- [DataGrid] Wrap toolbar buttons with tooltip (#11357) @MBilalShafi
- [l10n] Add Croatian (hr-HR), Portuguese (pt-PT), and Chinese (Hong Kong) (zh-HK) locales (#11668) @BCaspari

#### `@mui/x-data-grid-pro@7.0.0-alpha.9` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.9`, plus:

- [DataGridPro] Allow non-pinnable columns to be pinned programmatically (#11680) @MBilalShafi

#### `@mui/x-data-grid-premium@7.0.0-alpha.9` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.9`, plus:

- [DataGridPremium] Allow aggregation to be applied for non-aggregable columns (#11574) @MBilalShafi
- [DataGridPremium] Allow programmatically grouping non-groupable columns (#11539) @MBilalShafi

### Date and Time Pickers

#### Breaking changes

- The `locales` export has been removed from the root of the packages.
  If you were importing locales from the root, be sure to update it:

  ```diff
  -import { frFR } from '@mui/x-date-pickers';
  +import { frFR } from '@mui/x-date-pickers/locales';
  ```

#### `@mui/x-date-pickers@7.0.0-alpha.9`

- [fields] Make `PickersTextField` and its dependencies public (#11581) @flaviendelangle
- [fields] Support farsi digits (#11639) @flaviendelangle
- [pickers] Fix AdapterLuxon `getWeekNumber` behavior (#11697) @LukasTy
- [pickers] Stop root exporting `locales` (#11612) @LukasTy

#### `@mui/x-date-pickers-pro@7.0.0-alpha.9` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.9`.

### Charts / `@mui/x-charts@7.0.0-alpha.9`

- [charts] Do not propagate `innerRadius` and `outerRadius` to the DOM (#11689) @alexfauquette
- [charts] Fix default `stackOffset` for `LineChart` (#11647) @alexfauquette
- [charts] Remove a TypeScript ignore (#11688) @alexfauquette

### Tree View

#### Breaking changes

- The `expandIcon` / `defaultExpandIcon` props, used to expand the children of a node (rendered when it is collapsed),
  is now defined as a slot both on the Tree View and the Tree Item components.

  If you were using the `ChevronRight` icon from `@mui/icons-material`,
  you can stop passing it to your component because it is now the default value:

  ```diff
  -import ChevronRightIcon from '@mui/icons-material/ChevronRight';

   <SimpleTreeView
  -  defaultExpandIcon={<ChevronRightIcon />}
   >
     {items}
   </SimpleTreeView>
  ```

  If you were passing another icon to your Tree View component,
  you need to use the new `expandIcon` slot on this component:

  ```diff
   <SimpleTreeView
  -  defaultExpandIcon={<MyCustomExpandIcon />}
  +  slots={{ expandIcon: MyCustomExpandIcon }}
   >
     {items}
   </SimpleTreeView>
  ```

  If you were passing another icon to your Tree Item component,
  you need to use the new `expandIcon` slot on this component:

  ```diff
    <SimpleTreeView>
      <TreeItem
        nodeId="1"
        label="Node 1"
  -     expandIcon={<MyCustomExpandIcon />}
  +     slots={{ expandIcon: MyCustomExpandIcon }}
      />
    </SimpleTreeView>
  ```

- The `collapseIcon` / `defaultCollapseIcon` props, used to collapse the children of a node (rendered when it is expanded),
  is now defined as a slot both on the Tree View and the Tree Item components.

  If you were using the `ExpandMore` icon from `@mui/icons-material`,
  you can stop passing it to your component because it is now the default value:

  ```diff
  - import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

    <SimpleTreeView
  -   defaultCollapseIcon={<ExpandMoreIcon />}
    >
      {items}
    </SimpleTreeView>
  ```

  If you were passing another icon to your Tree View component,
  you need to use the new `collapseIcon` slot on this component:

  ```diff
    <SimpleTreeView
  -   defaultCollapseIcon={<MyCustomCollapseIcon />}
  +   slots={{ collapseIcon: MyCustomCollapseIcon }}
    >
      {items}
    </SimpleTreeView>
  ```

  If you were passing another icon to your Tree Item component,
  you need to use the new `collapseIcon` slot on this component:

  ```diff
    <SimpleTreeView>
      <TreeItem
        nodeId="1"
        label="Node 1"
  -     collapseIcon={<MyCustomCollapseIcon />}
  +     slots={{ collapseIcon: MyCustomCollapseIcon }}
      />
    </SimpleTreeView>
  ```

- The `useTreeItem` hook has been renamed `useTreeItemState`.
  This will help create a new headless version of the Tree Item component based on a future `useTreeItem` hook.

  ```diff
  -import { TreeItem, useTreeItem } from '@mui/x-tree-view/TreeItem';
  +import { TreeItem, useTreeItemState } from '@mui/x-tree-view/TreeItem';

   const CustomContent = React.forwardRef((props, ref) => {
  -  const { disabled } = useTreeItem(props.nodeId);
  +  const { disabled } = useTreeItemState(props.nodeId);

     // Render some UI
   });

   function App() {
     return (
       <SimpleTreeView>
         <TreeItem ContentComponent={CustomContent} />
       </SimpleTreeView>
     )
   }
  ```

- The `parentIcon` prop has been removed from the Tree View components.

  If you were passing an icon to your Tree View component,
  you can achieve the same behavior
  by passing the same icon to both the `collapseIcon` and the `expandIcon` slots on this component:

  ```diff
    <SimpleTreeView
  -   defaultParentIcon={<MyCustomParentIcon />}
  +   slots={{ collapseIcon: MyCustomParentIcon, expandIcon: MyCustomParentIcon }}
    >
      {items}
    </SimpleTreeView>
  ```

- The `endIcon` / `defaultEndIcon` props, rendered next to an item without children,
  is now defined as a slot both on the Tree View and the Tree Item components.

  If you were passing an icon to your Tree View component,
  you need to use the new `endIcon` slot on this component:

  ```diff
    <SimpleTreeView
  -   defaultEndIcon={<MyCustomEndIcon />}
  +   slots={{ endIcon: MyCustomEndIcon }}
    >
      {items}
    </SimpleTreeView>
  ```

  If you were passing an icon to your Tree Item component,
  you need to use the new `endIcon` slot on this component:

  ```diff
    <SimpleTreeView>
      <TreeItem
        nodeId="1"
        label="Node 1"
  -     endIcon={<MyCustomEndIcon />}
  +     slots={{ endIcon: MyCustomEndIcon }}
      />
    </SimpleTreeView>
  ```

- The `icon` prop, rendered next to an item without children,
  is now defined as a slot on the Tree Item component.

  If you were passing an icon to your Tree Item component,
  you need to use the new `icon` slot on this component:

  ```diff
    <SimpleTreeView>
      <TreeItem
        nodeId="1"
        label="Node 1"
  -     icon={<MyCustomIcon />}
  +     slots={{ icon: MyCustomIcon }}
      />
    </SimpleTreeView>
  ```

#### `@mui/x-tree-view@7.0.0-alpha.9`

- [TreeView] Adjust expansion and selection docs (#11723) @noraleonte
- [TreeView] Improve plugin signature definition (#11665) @flaviendelangle
- [TreeView] Make each plugin responsible for its context value (#11623) @flaviendelangle
- [TreeView] Migrate remaining icon props to slots (#11713) @flaviendelangle
- [TreeView] Pass through `Theme` generic to variants (#11480) @dhulme
- [TreeView] Rename `useTreeItem` to `useTreeItemState` (#11712) @flaviendelangle
- [TreeView] Add `slots` and `slotProps` on the Tree View components (#11664) @flaviendelangle
- [TreeView] Explore a better plugin model API (#11567) @flaviendelangle

### Docs

- [docs] Clean the pickers migration guide (#11694) @flaviendelangle
- [docs] Cleanup and fix Pickers Playground styling (#11700) @LukasTy
- [docs] First draft of the Tree View custom plugin doc (#11564) @flaviendelangle
- [docs] Fix Pickers migration syntax and diffs (#11695) @LukasTy
- [docs] Fix generated Tree View API docs (#11737) @LukasTy
- [docs] Generate docs for Tree View slots (#11730) @flaviendelangle
- [docs] Improve codemod for v7 (#11650) @oliviertassinari
- [docs] Improve Data Grid `pageSizeOptions` prop documentation (#11682) @oliviertassinari
- [docs] Parse markdown on API docs demo titles (#11728) @LukasTy
- [docs] Remove the description from the `className` prop (#11693) @oliviertassinari
- [docs] Uplift Simple Tree View customization examples (#11424) @noraleonte
- [docs] Uplift the Date Pickers playground (#11555) @danilo-leal

### Core

- [core] Bump `@mui/material` peer dependency for all packages (#11692) @LukasTy
- [core] Make `karma` run in parallel (#11571) @romgrk
- [core] make `karma-parallel` run under a new command (#11716) @romgrk
- [code-infra] Migrate all prettier APIs to the async version (#11732) @Janpot
- [code-infra] Update the Babel macro path (#11479) @michaldudak
- [docs-infra] Enforce brand name rules (#11651) @oliviertassinari
- [test] Fix flaky Data Grid test (#11725) @cherniavskii

## 7.0.0-alpha.8

_Jan 11, 2024_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- ⏰ Support date-fns v3 (#11659) @LukasTy
  Pickers support both v2 and v3 of date-fns. For v3 use `AdapterDateFnsV3`.
  ```js
  // with date-fns v2.x
  import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  import de from 'date-fns/locale/de';
  ```
  ```js
  // with date-fns v3.x
  import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
  import { de } from 'date-fns/locale/de';
  ```

### Data Grid

#### Breaking changes

- The import path for locales has been changed:

  ```diff
  -import { enUS } from '@mui/x-data-grid';
  +import { enUS } from '@mui/x-data-grid/locales';

  -import { enUS } from '@mui/x-data-grid-pro';
  +import { enUS } from '@mui/x-data-grid-pro/locales';

  -import { enUS } from '@mui/x-data-grid-premium';
  +import { enUS } from '@mui/x-data-grid-premium/locales';
  ```

#### `@mui/x-data-grid@7.0.0-alpha.8`

- [DataGrid] Stop exporting locales from the package root (#11614) @cherniavskii

#### `@mui/x-data-grid-pro@7.0.0-alpha.8` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.8`.

#### `@mui/x-data-grid-premium@7.0.0-alpha.8` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.8`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-alpha.8`

- [pickers] Add `date-fns@3.x` adapter (#11462) @LukasTy
- [pickers] Avoid deeper than 2nd level imports (#11588) @LukasTy
- [pickers] Fix clearable behavior blocking focus return to `OpenPickerButton` (#11642) @noraleonte
- [pickers] Move `DateRange` to `@mui/x-date-pickers-pro/models` (#11611) @flaviendelangle
- [l10n] Add missing Danish (da-DK) locale export (#11640) @etlos

#### `@mui/x-date-pickers-pro@7.0.0-alpha.8` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.8`.

### Tree View / `@mui/x-tree-view@7.0.0-alpha.8`

- [TreeView] Cleanup `onKeyDown` handler (#11481) @flaviendelangle
- [TreeView] Define the parameters used by each plugin to avoid listing them in each component (#11473) @flaviendelangle

### Docs

- [docs] Fix parsing of `x-date-pickers-pro` demo adapter imports (#11628) @LukasTy
- [docs] Improve `git diff` format @oliviertassinari
- [docs] Push up the MUI X brand (#11533) @oliviertassinari
- [docs] Remove old Data Grid translation files (#11646) @cherniavskii
- [docs] Improve Server-side Data Grid docs (#11589) @oliviertassinari
- [docs] Improve charts landing page (#11570) @oliviertassinari

### Core

- [core] Lock `jsdom` version (#11652) @cherniavskii
- [core] Remove PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD (#11608) @oliviertassinari
- [core] Simplify isSsr logic (#11606) @oliviertassinari
- [core] Sync playwright cache between MUI X and Material UI (#11607) @oliviertassinari
- [core] Use MUI X official name in errors (#11645) @oliviertassinari

## 7.0.0-alpha.7

_Jan 5, 2024_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🎁 New component to create a Tree View from a structured data source:

  You can now directly pass your data to the `<RichTreeView />` component instead of manually converting it into JSX `<TreeItem />` components:

  ```tsx
  const ITEMS = [
    {
      id: 'node-1',
      label: 'Node 1',
      children: [
        { id: 'node-1-1', label: 'Node 1.1' },
        { id: 'node-1-2', label: 'Node 1.2' },
      ],
    },
    {
      id: 'node-2',
      label: 'Node 2',
    },
  ];

  <RichTreeView
    items={MUI_X_PRODUCTS}
    defaultCollapseIcon={<ExpandMoreIcon />}
    defaultExpandIcon={<ChevronRightIcon />}
  />;
  ```

- 🌍 Improve Czech (cs-CZ) locale on the Data Grid
- 🐞 Bugfixes

### Data Grid

#### `@mui/x-data-grid@7.0.0-alpha.7`

- [DataGrid] Don't evaluate `hasEval` when `disableEval` is set (#11516) @reihwald
- [DataGrid] follow warning message guideline for `autoPageSize` and `autoHeight` (#11585) @Sboonny
- [DataGrid] Replace `eval` with `new Function` (#11557) @oliviertassinari
- [DataGrid] Warn devs when `autoPageSize` is used with `autoHeight` (#11554) @Sboonny
- [l10n] Improve Czech (cs-CZ) locale (#11526) @fdebef

#### `@mui/x-data-grid-pro@7.0.0-alpha.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.7`.

#### `@mui/x-data-grid-premium@7.0.0-alpha.7` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.7`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-alpha.7`

- [pickers] Fix views management (#11419) @LukasTy

#### `@mui/x-date-pickers-pro@7.0.0-alpha.7` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.7`.

### Charts / `@mui/x-charts@7.0.0-alpha.7`

- [charts] Add `arcLabelRadius` property (#11487) @alexfauquette
- [charts] Fix `null` in line chart using dataset (#11550) @alexfauquette

### Tree View

#### Breaking changes

- The expansion props have been renamed to better describe their behaviors:

  | Old name          | New name                |
  | :---------------- | :---------------------- |
  | `onNodeToggle`    | `onExpandedNodesChange` |
  | `expanded`        | `expandedNodes`         |
  | `defaultExpanded` | `defaultExpandedNodes`  |

  ```diff
    <TreeView
  -   onNodeToggle={handleExpansionChange}
  +   onExpandedNodesChange={handleExpansionChange}

  -   expanded={expandedNodes}
  +   expandedNodes={expandedNodes}

  -   defaultExpanded={defaultExpandedNodes}
  +   defaultExpandedNodes={defaultExpandedNodes}
    />
  ```

- The selection props have been renamed to better describe their behaviors:

  | Old name          | New name                |
  | :---------------- | :---------------------- |
  | `onNodeSelect`    | `onSelectedNodesChange` |
  | `selected`        | `selectedNodes`         |
  | `defaultSelected` | `defaultSelectedNodes`  |

  ```diff
    <TreeView
  -   onNodeSelect={handleSelectionChange}
  +   onSelectedNodesChange={handleSelectionChange}

  -   selected={selectedNodes}
  +   selectedNodes={selectedNodes}

  -   defaultSelected={defaultSelectedNodes}
  +   defaultSelectedNodes={defaultSelectedNodes}
    />
  ```

#### `@mui/x-tree-view@7.0.0-alpha.7`

- [TreeView] Improve the expansion API (#11476) @flaviendelangle
- [TreeView] Improve the selection API (#11560) @flaviendelangle
- [TreeView] Introduce the `items` prop (#11059) @flaviendelangle

### Docs

- [docs] Add example for TreeView `onNodeExpansionToggle` prop (#11547) @flaviendelangle
- [docs] Clarify Pickers usage with Luxon (#11545) @LukasTy
- [docs] Complete transition to next branch (#11521) @oliviertassinari
- [docs] Fix 404 links in the docs @oliviertassinari
- [docs] Fix over page fetching @oliviertassinari
- [docs] Lint `next.config.js` (#11514) @oliviertassinari

### Core

- [core] Fix release changelog (#11496) @romgrk
- [core] Fix use of ::before & ::after (#11515) @oliviertassinari
- [core] Localize the issue template to MUI X (#11511) @oliviertassinari
- [core] Regenerate API files (#11542) @flaviendelangle
- [core] Remove issue emoji @oliviertassinari
- [core] Sync the release instructions with MUI Core @oliviertassinari
- [core] Yaml format match most common convention @oliviertassinari

## 7.0.0-alpha.6

_Dec 22, 2023_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Data Grid now supports `Date` objects in the `filterModel`
- 🌍 Improve Russian (ru-RU) locale on the Data Grid
- 🐞 Bugfixes

### Data Grid

#### Breaking changes

- The filter panel no longer uses the native version of the [`Select`](https://mui.com/material-ui/react-select/) component for all components.
- The `getOptionValue` and `getOptionLabel` props were removed from the following components:
  - `GridEditSingleSelectCell`
  - `GridFilterInputSingleSelect`
  - `GridFilterInputMultipleSingleSelect`

  Use the `getOptionValue` and `getOptionLabel` properties on the `singleSelect` column definition instead:

  ```tsx
  const column: GridColDef = {
    type: 'singleSelect',
    field: 'country',
    valueOptions: [
      { code: 'BR', name: 'Brazil' },
      { code: 'FR', name: 'France' },
    ],
    getOptionValue: (value: any) => value.code,
    getOptionLabel: (value: any) => value.name,
  };
  ```

- The `filterModel` now supports `Date` objects as values for `date` and `dateTime` column types.
  The `filterModel` still accepts strings as values for `date` and `dateTime` column types,
  but all updates to the `filterModel` coming from the UI (for example filter panel) will set the value as a `Date` object.

#### `@mui/x-data-grid@7.0.0-alpha.6`

- [DataGrid] Fix typos in the JSDoc (#11451) @flaviendelangle
- [DataGrid] Make `checkboxSelection` respect the `disableMultipleRowSelection` prop (#11448) @cherniavskii
- [DataGrid] Support `Date` objects in filter model (#7069) @cherniavskii
- [DataGrid] Use non-native `Select`s by default (#11330) @cherniavskii
- [l10n] Improve Russian (ru-RU) locale (#11441) @wensiet

#### `@mui/x-data-grid-pro@7.0.0-alpha.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.6`.

#### `@mui/x-data-grid-premium@7.0.0-alpha.6` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.6`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-alpha.6`

- [fields] Adjust `PickersInput` sizing styles (#11392) @noraleonte
- [fields] Fix section pasting (#11447) @LukasTy
- [pickers] Add `PickersTextField` `standard` and `filled` variants (#11250) @noraleonte
- [pickers] Cleanup error messages in `PickersSectionList` (#11449) @flaviendelangle
- [pickers] Create new component `PickersSectionList` (#11352) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.0.0-alpha.6` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.6`.

### Charts / `@mui/x-charts@7.0.0-alpha.5`

- [charts] Allow percentage values for pie chart center and radius (#11464) @alexfauquette
- [charts] Improve dataset typing (#11372) @alexfauquette
- [charts] Make error message more explicit (#11457) @alexfauquette
- [charts] Make the helper `ChartsText` component public (#11370) @alexfauquette

### Docs

- [docs] Document `false` default values for boolean props (#11477) @cherniavskii
- [docs] Improve Pickers `name` prop examples (#11422) @LukasTy
- [docs] Limit `date-fns` package to v2 in codesandbox (#11463) @LukasTy

### Core

- [core] Add missing breaking changes to changelog (#11420) @MBilalShafi
- [core] Cherry pick follow up (#11469) @LukasTy
- [core] Fix `cherry-pick` action (#11446) @LukasTy
- [core] Fix security regressions in cherry-pick-next-to-master.yml (#11482) @MBilalShafi
- [test] Reload the page if its blank and there are no links to the remaining tests (#11466) @cherniavskii

## 7.0.0-alpha.5

_Dec 14, 2023_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 💫 New recipe added for the Data Grid
- 🌍 Improve Swedish (sv-SE) and Urdu (ur-PK) locales on the Data Grid
- 🐞 Bugfixes

### Data Grid

#### Breaking changes

- The `instanceId` prop is now required for state selectors.
  This prop is used to distinguish between multiple Data Grid instances on the same page.
  See [migration docs](https://v7.mui.com/x/migration/migration-data-grid-v6/#instanceid-prop-is-required-for-state-selectors) for more details.

#### `@mui/x-data-grid@7.0.0-alpha.5`

- [DataGrid] Make `instanceId` required for state selectors (#11395) @cherniavskii
- [DataGrid] Recipe for grouped rows autosizing (#11401) @michelengelen
- [l10n] Improve Swedish (sv-SE) locale (#11373) @fredrikcarlbom
- [l10n] Improve Urdu (ur-PK) locale (#11400) @MBilalShafi

#### `@mui/x-data-grid-pro@7.0.0-alpha.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.5`.

#### `@mui/x-data-grid-premium@7.0.0-alpha.5` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.5`.

### Date and Time Pickers

#### Breaking changes

- The slot interfaces have been renamed to match with `@mui/base` naming.
  The `SlotsComponent` suffix has been replaced with `Slots` and `SlotsComponentsProps` with `SlotProps`.

  ```diff
  -DateCalendarSlotsComponent
  -DateCalendarSlotsComponentsProps
  +DateCalendarSlots
  +DateCalendarSlotProps
  ```

- Move `inputRef` inside the props passed to the field hooks

  The field hooks now only receive the props instead of an object containing both the props and the `inputRef`.

  ```diff
  -const { inputRef, ...otherProps } = props
  -const fieldResponse = useDateField({ props: otherProps, inputRef });
  +const fieldResponse = useDateField(props);
  ```

  If you are using a multi input range field hook, the same applies to `startInputRef` and `endInputRef` params

  ```diff
  -const { inputRef: startInputRef, ...otherStartTextFieldProps } = startTextFieldProps
  -const { inputRef: endInputRef, ...otherEndTextFieldProps } = endTextFieldProps

   const fieldResponse = useMultiInputDateRangeField({
     sharedProps,
  -  startTextFieldProps: otherStartTextFieldProps,
  -  endTextFieldProps: otherEndTextFieldProps,
  -  startInputRef
  -  endInputRef,
  +  startTextFieldProps,
  +  endTextFieldProps
   });
  ```

- Rename the ref returned by the field hooks to `inputRef`

  When used with the v6 TextField approach (where the input is an `<input />` HTML element), the field hooks return a ref that needs to be passed to the `<input />` element.
  This ref was previously named `ref` and has been renamed `inputRef` for extra clarity.

  ```diff
   const fieldResponse = useDateField(props);

  -return <input ref={fieldResponse.ref} />
  +return <input ref={fieldResponse.inputRef} />
  ```

  If you are using a multi input range field hook, the same applies to the ref in the `startDate` and `endDate` objects

  ```diff
   const fieldResponse = useDateField(props);

   return (
     <div>
  -    <input ref={fieldResponse.startDate.ref} />
  +    <input ref={fieldResponse.startDate.inputRef} />
       <span>–</span>
  -    <input ref={fieldResponse.endDate.ref} />
  +    <input ref={fieldResponse.endDate.inputRef} />
     </div>
   )
  ```

- Restructure the API of `useClearableField`

  The `useClearableField` hook API has been simplified to now take a `props` parameter instead of a `fieldProps`, `InputProps`, `clearable`, `onClear`, `slots` and `slotProps` parameters.

  You should now be able to directly pass the returned value from your field hook (for example `useDateField`) to `useClearableField`

  ```diff
   const fieldResponse = useDateField(props);

  -const { InputProps, onClear, clearable, slots, slotProps, ...otherFieldProps } = fieldResponse
  -const { InputProps: ProcessedInputProps, fieldProps: processedFieldProps } = useClearableField({
  -  fieldProps: otherFieldProps,
  -  InputProps,
  -  clearable,
  -  onClear,
  -  slots,
  -  slotProps,
  -});
  -
  - return <MyCustomTextField {...processedFieldProps} InputProps={ProcessedInputProps} />

  +const processedFieldProps = useClearableField(fieldResponse);
  +
  +return <MyCustomTextField {...processedFieldProps} />
  ```

#### `@mui/x-date-pickers@7.0.0-alpha.5`

- [fields] Support empty sections (#10307) @flaviendelangle
- [pickers] Fix field types to avoid error on latest `@types/react` version (#11397) @LukasTy
- [pickers] Remove all relative imports to the internals index file (#11375) @flaviendelangle
- [pickers] Rename slots interfaces (#11339) @alexfauquette
- [pickers] Simplify the API of the field hooks (#11371) @flaviendelangle
- [pickers] Support name prop (#11025) @gitstart

#### `@mui/x-date-pickers-pro@7.0.0-alpha.5` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.5`, plus:

- [DateRangePicker] Fix `autoFocus` behavior (#11273) @kealjones-wk

### Charts / `@mui/x-charts@7.0.0-alpha.5`

- [charts] Fix size overflow (#11385) @alexfauquette

### `@mui/x-codemod@7.0.0-alpha.5`

- [codemod] Add `cellSelection` codemod and update migration guide (#11353) @MBilalShafi

### Docs

- [docs] Respect GoT books (@janoma) (#11387) @alexfauquette

### Core

- [core] Automate cherry-pick of PRs from `next` -> `master` (#11382) @MBilalShafi
- [infra] Update `no-response` workflow (#11369) @MBilalShafi
- [test] Fix flaky screenshots (#11388) @cherniavskii

## 7.0.0-alpha.4

_Dec 8, 2023_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🚀 The scatter charts now use voronoi to trigger items

  Users needed to hover the item to highlight the scatter item or show the tooltip.
  Now they can interact with data by triggering the closest element. See the [docs page](https://v7.mui.com/x/react-charts/scatter/#interaction) for more info.

- 📚 Add [Pickers FAQ page](https://v7.mui.com/x/react-date-pickers/faq/)
- 🎉 The Data Grid Header filters feature is now stable
- 🌍 Improve Danish (da-DK) locale on Data Grid
- 🐞 Bugfixes

### Data Grid

#### Breaking changes

- The header filters feature is now stable. `unstable_` prefix is removed from prop `headerFilters` and related exports.
  See [migration docs](https://v7.mui.com/x/migration/migration-data-grid-v6/#filtering) for more details.

- The `GridColDef['type']` has been narrowed down to only accept the built-in column types.
  TypeScript users need to use the `GridColDef` interface when defining columns:

  ```tsx
  // 🛑 `type` is inferred as `string` and is too wide
  const columns = [{ type: 'number', field: 'id' }];
  <DataGrid columns={columns} />;

  // ✅ `type` is `'number'`
  const columns: GridColDef[] = [{ type: 'number', field: 'id' }];
  <DataGrid columns={columns} />;

  // ✅ Alternalively, `as const` can be used to narrow down the type
  const columns = [{ type: 'number' as const, field: 'id' }];
  <DataGrid columns={columns} />;
  ```

#### `@mui/x-data-grid@7.0.0-alpha.4`

- [DataGrid] Added a guard for reorder cells (#11159) @michelengelen
- [DataGrid] Narrow down `GridColDef['type']` (#11270) @cherniavskii
- [l10n] Improve Danish (da-DK) locale (#11304) @goibon

#### `@mui/x-data-grid-pro@7.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.4`, plus:

- [DataGridPro] Make header filters feature stable (#11243) @MBilalShafi

#### `@mui/x-data-grid-premium@7.0.0-alpha.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.4`.

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-alpha.4`

- [fields] Rework `PickersTextField` (#11258) @flaviendelangle
- [pickers] Fix `MultiSectionDigitalClock` issues (#11305) @LukasTy
- [pickers] Fix views height consistency (#11337) @LukasTy

#### `@mui/x-date-pickers-pro@7.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.4`.

### Charts / `@mui/x-charts@7.0.0-alpha.4`

- [charts] Remove animation on sparkline (#11311) @oliviertassinari
- [charts] Use voronoi cells to trigger interaction with scatter items (#10981) @alexfauquette
- [charts] Add `@mui/utils` as a dependency (#11351) @michelengelen

### Docs

- [docs] Add FAQ page (#11271) @noraleonte
- [docs] Add a doc section on how to override the start of the week with each adapter (#11223) @flaviendelangle
- [docs] Added params to `onPaginationModelChange` docs (#10191) @JFBenzs
- [docs] Fix typo (#11324) @cadam11
- [docs] Improve `DemoContainer` styling coverage (#11315) @LukasTy
- [docs] General revision of the Charts docs (#11249) @danilo-leal

## 7.0.0-alpha.3

_Dec 4, 2023_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Support localized start of the week on pickers' `AdapterLuxon`

  When using Luxon 3.4.4 or higher, the start of the week will be defined by the date locale (for example: Sunday for `en-US`, Monday for `fr-FR`).

- 📈 Fix a lot of Charts package issues
- 🎉 The Data Grid features Cell selection and Clipboard paste are now stable
- 🌍 Improve Bulgarian (bg-BG) locale on Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The clipboard paste feature is now enabled by default. The flag `clipboardPaste` is no longer needed to be passed to the `experimentalFeatures` prop.

- The clipboard related exports `ignoreValueFormatterDuringExport` and `splitClipboardPastedText` are no longer prefixed with `unstable_`.

- The deprecated constants `SUBMIT_FILTER_STROKE_TIME` and `SUBMIT_FILTER_DATE_STROKE_TIME` have been removed from the Data Grid exports. Use the [`filterDebounceMs`](https://v7.mui.com/x/api/data-grid/data-grid/#data-grid-prop-filterDebounceMs) prop to customize filter debounce time.

- The `slots.preferencesPanel` slot and the `slotProps.preferencesPanel` prop were removed. Use `slots.panel` and `slotProps.panel` instead.

- The `GridPreferencesPanel` component is not exported anymore as it wasn't meant to be used outside of the Data Grid.

- The `unstable_` prefix has been removed from the cell selection props listed below.

  | Old name                              | New name                     |
  | :------------------------------------ | :--------------------------- |
  | `unstable_cellSelection`              | `cellSelection`              |
  | `unstable_cellSelectionModel`         | `cellSelectionModel`         |
  | `unstable_onCellSelectionModelChange` | `onCellSelectionModelChange` |

- The `unstable_` prefix has been removed from the cell selection API methods listed below.

  | Old name                           | New name                  |
  | :--------------------------------- | :------------------------ |
  | `unstable_getCellSelectionModel`   | `getCellSelectionModel`   |
  | `unstable_getSelectedCellsAsArray` | `getSelectedCellsAsArray` |
  | `unstable_isCellSelected`          | `isCellSelected`          |
  | `unstable_selectCellRange`         | `selectCellRange`         |
  | `unstable_setCellSelectionModel`   | `setCellSelectionModel`   |

- The Quick Filter now ignores hidden columns by default.
  See [including hidden columns](https://v7.mui.com/x/react-data-grid/filtering/quick-filter/#including-hidden-columns) section for more details.

#### `@mui/x-data-grid@7.0.0-alpha.3`

- [DataGrid] Fix cell editing adding a leading "v" on paste (#9205) @prasad5795
- [DataGrid] Exclude hidden columns from quick filtering by default (#11229) @cherniavskii
- [DataGrid] Fix `onFilterModelChange` being fired with stale field value (#11000) @gitstart
- [DataGrid] Fix handling of event target in portal (#11174) @cherniavskii
- [DataGrid] Remove deprecated constants (#11233) @michelengelen
- [DataGrid] Remove the `preferencesPanel` slot (#11228) @cherniavskii
- [l10n] Improve Bulgarian (bg-BG) locale (#10856) @Kristiqn95

#### `@mui/x-data-grid-pro@7.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.3`.

#### `@mui/x-data-grid-premium@7.0.0-alpha.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.3`, plus:

- [DataGridPremium] Fix aggregated column ignoring column definition changes (#11129) @cherniavskii
- [DataGridPremium] Make Cell selection feature stable (#11246) @MBilalShafi
- [DataGridPremium] Make Clipboard paste feature stable (#11248) @MBilalShafi

### Date and Time Pickers

#### Breaking changes

- The Date and Time Pickers now use the localized week when using `AdapterLuxon` and Luxon v3.4.4 or higher is installed.
  This new behavior allows `AdapterLuxon` to have the same behavior as the other adapters.
  If you want to keep the start of the week on Monday even if your locale says otherwise, you can hardcode the week settings as follows:
  The Firefox browser currently does not support this behavior because the [getWeekInfo](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/getWeekInfo) API is not yet implemented.

  ```ts
  import { Settings, Info } from 'luxon';

  Settings.defaultWeekSettings = {
    firstDay: 1,
    minimalDays: Info.getMinimumDaysInFirstWeek(),
    weekend: [6, 7],
  };
  ```

- Add new parameters to the `shortcuts` slot `onChange` callback

  The `onChange` callback fired when selecting a shortcut now requires two new parameters (previously they were optional):
  - The [`changeImportance`](/x/react-date-pickers/shortcuts/#behavior-when-selecting-a-shortcut) of the shortcut.
  - The `item` containing the entire shortcut object.

  ```diff
   const CustomShortcuts = (props) => {
     return (
       <React.Fragment>
         {props.items.map(item => {
           const value = item.getValue({ isValid: props.isValid });
           return (
             <button
  -            onClick={() => onChange(value)}
  +            onClick={() => onChange(value, props.changeImportance ?? 'accept', item)}
             >
               {value}
             </button>
           )
         }}
       </React.Fragment>
     )
   }

   <DatePicker slots={{ shortcuts: CustomShortcuts }} />
  ```

  - Usage of `AdapterDayjs` with the `customParseFormat` plugin
    The call to `dayjs.extend(customParseFormatPlugin)` has been moved to the `AdapterDayjs` constructor. This allows users to pass custom options to this plugin before the adapter uses it.

  If you are using this plugin before the rendering of the first `LocalizationProvider` component and did not call `dayjs.extend` in your own codebase, you will need to manually extend `dayjs`:

  ```tsx
  import dayjs from 'dayjs';
  import customParseFormatPlugin from 'dayjs/plugin/customParseFormat';

  dayjs.extend(customParseFormatPlugin);
  ```

  The other plugins are still added before the adapter initialization.

#### `@mui/x-date-pickers@7.0.0-alpha.3`

- [pickers] Expand field placeholder methods flexibility by providing `format` parameter (#11130) @LukasTy
- [pickers] Make `changeImportance` and `shortcut` mandatory in `PickersShortcuts` (#10941) @flaviendelangle
- [pickers] Moved extend with `customParseFormat` to constructor (#11151) @michelengelen
- [pickers] POC: `PickersTextField` styling - outlined variant (#10778) @noraleonte
- [pickers] Support localized start of the week on `AdapterLuxon` (#10964) @flaviendelangle
- [pickers] Use adapter methods instead of date library ones whenever possible (#11142) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.3`.

### Charts / `@mui/x-charts@7.0.0-alpha.3`

- [charts] Adjusted `defaultizeValueFormatter` util to accept an optional `series.valueFormatter` value (#11144) @michelengelen
- [charts] Apply `labelStyle` and `tickLabelStyle` props on `<ChartsYAxis />` (#11180) @akamfoad
- [charts] Fix TypeScript config (#11259) @alexfauquette
- [charts] Fix error with empty dataset (#11063) @alexfauquette
- [charts] Fix export strategy (#11235) @alexfauquette
- [charts] Remove outdated prop-types (#11045) @alexfauquette

### Docs

- [docs] Add `TextField` styling example to customization playground (#10812) @noraleonte
- [docs] Add a card grid to the installation page (#11177) @danilo-leal
- [docs] Add end v6 blogpost to whats new page (#10999) @joserodolfofreitas
- [docs] Add small formatting improvements to the licensing page (#11178) @danilo-leal
- [docs] Document charts composition (#10710) (#11239) @alexfauquette
- [docs] Fix <title> generation (#11182) @oliviertassinari
- [docs] Fix dead anchor link (#11265) @oliviertassinari
- [docs] Improve Data Grid togglable columns example (#11238) @MBilalShafi
- [docs] Improve the prop descriptions of `DayCalendar` (#11158) @flaviendelangle
- [docs] Move the adapter breaking changes in a collapsable block (#11205) @flaviendelangle
- [docs] Polish Next.js header description @oliviertassinari
- [docs] Remove the `newFeature` flag on v6 features (#11168) @flaviendelangle
- [docs] Simplify a bit chart demo (#11173) @oliviertassinari
- [docs] Standardize the usage of callouts in the MUI X docs (#7127) @samuelsycamore
- [docs] Adjust the Data Grid demo page design (#11231) @danilo-leal

### Core

- [core] Make `@mui/system` a direct dependency (#11128) @LukasTy
- [core] Remove blank lines, coding style @oliviertassinari
- [core] Remove outdated `ENABLE_AD` env variable (#11181) @oliviertassinari
- [github] Do not add `plan: Pro` and `plan: Premium` labels on Pro / Premium issue templates (#10183) @flaviendelangle

## 7.0.0-alpha.2

_Nov 23, 2023_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 📈 Export missing Charts props
- 🌍 Improve Arabic (ar-SD) and Hebrew (he-IL) locales on Data Grid
- 🌍 Add Macedonian (mk) locale and improve German (de-DE) locale on Pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@7.0.0-alpha.2`

- [l10n] Improve Arabic (ar-SD) locale (#11114) @MBilalShafi
- [l10n] Improve Hebrew (he-IL) locale (#11056) (#11149) @MBilalShafi
- [DataGrid] Remove unused utilities (#11156) @flaviendelangle

#### `@mui/x-data-grid-pro@7.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.2`.

#### `@mui/x-data-grid-premium@7.0.0-alpha.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.2`.

### Date and Time Pickers

#### Breaking changes

- The deprecated `shouldDisableClock` prop has been removed in favor of the more flexible `shouldDisableTime` prop.
  The `shouldDisableClock` prop received `value` as a `number` of hours, minutes, or seconds.
  Instead, the `shouldDisableTime` prop receives the date object (based on the used adapter).

  You can read more about the deprecation of this prop in [v6 migration guide](https://v7.mui.com/x/migration/migration-pickers-v5/#%E2%9C%85-rename-or-refactor-shoulddisabletime-prop).

  ```diff
   <DateTimePicker
  -  shouldDisableClock={(timeValue, view) => view === 'hours' && timeValue < 12}
  +  shouldDisableTime={(value, view) => view === 'hours' && value.hour() < 12}
   />
  ```

- The `adapter.dateWithTimezone` method has been removed and its content moved to the `date` method.
  You can use the `adapter.date` method instead:

  ```diff
  - adapter.dateWithTimezone(undefined, 'system');
  + adapter.date(undefined, 'system');
  ```

- The `dayPickerClasses` variable has been renamed to `dayCalendarClasses` to be consistent with the new name of the `DayCalendar` component introduced in v6.0.0.

  ```diff
  - import { dayPickerClasses } from '@mui/x-date-pickers/DateCalendar';
  + import { dayCalendarClasses } from '@mui/x-date-pickers/DateCalendar';
  ```

- The deprecated `defaultCalendarMonth` prop has been removed in favor of the more flexible `referenceDate` prop.

  ```diff
  - <DateCalendar defaultCalendarMonth={dayjs('2022-04-01')};
  + <DateCalendar referenceDate{dayjs('2022-04-01')} />
  ```

- The `adapter.date` method now has the v6 `adapter.dateWithTimezone` method behavior.
  It no longer accepts `any` as a value but only `string | null | undefined`.

  ```diff
  - adapter.date(new Date());
  + adapter.date();

  - adapter.date(new Date('2022-04-17');
  + adapter.date('2022-04-17');

  - adapter.date(new Date(2022, 3, 17, 4, 5, 34));
  + adapter.date('2022-04-17T04:05:34');

  - adapter.date(new Date('Invalid Date'));
  + adapter.getInvalidDate();
  ```

#### `@mui/x-date-pickers@7.0.0-alpha.2`

- [l10n] Improve German (de-DE) locale (#11103) @jho-vema
- [l10n] Add Macedonian (mk) locale (#10935) @brsnik
- [pickers] Remove the `defaultCalendarMonth` prop (#10987) @flaviendelangle
- [pickers] Remove the `shouldDisableClock` prop (#11042) @flaviendelangle
- [pickers] Rename the `dayPickerClasses` variable `dayCalendarClasses` (#11140) @flaviendelangle
- [pickers] Replace `adapter.date` with the current `adapter.dateWithTimezone` (#10979) @flaviendelangle

#### `@mui/x-date-pickers-pro@7.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.2`.

### Charts / `@mui/x-charts@7.0.0-alpha.2`

- [charts] Change export strategy in index files (#11113) @michelengelen
- [charts] Fix `ChartsTooltip` component setup (#11152) @LukasTy

### `@mui/x-codemod@7.0.0-alpha.2`

- [codemod] Add codemod to use `referenceDate` instead of `defaultCalendarMonth` (#11139) @flaviendelangle
- [codemod] Clean the components to slots codemod usage (#11145) @flaviendelangle

### Docs

- [docs] Add LTS section to support docs (#10927) @joserodolfofreitas
- [docs] Clean the codemod README (#11051) @flaviendelangle
- [docs] Fix typos and grammar issues (#11049) @flaviendelangle
- [docs] Fix version links (#11001) @LukasTy
- [docs] Point to the source of `@mui/x-data-grid-generator` (#11134) @oliviertassinari

### Core

- [core] Bump monorepo (#11160) @LukasTy
- [core] Fix comment in doc generation (#11098) @flaviendelangle
- [core] Rename OpenCollective @oliviertassinari
- [core] Upgrade `babel-plugin-module-resolver` to 5.0.0 (#11065) @flaviendelangle
- [changelog] Improve git diff format @oliviertassinari
- [renovate] Monthly schedule for lockfile maintenance (#10336) @Janpot
- [test] Skip flaky e2e test in webkit (#11110) @cherniavskii

## 7.0.0-alpha.1

_Nov 17, 2023_

We'd like to offer a big thanks to the 3 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 📚 Documentation improvements

### Date and Time Pickers

#### `@mui/x-date-pickers@7.0.0-alpha.1` / `@mui/x-date-pickers-pro@7.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

#### Breaking changes

- The string argument of the `dayOfWeekFormatter` prop has been replaced in favor of the date object to allow more flexibility.

  ```diff
   <DateCalendar
     // If you were still using the day string, you can get it back with your date library.
  -  dayOfWeekFormatter={dayStr => `${dayStr}.`}
  +  dayOfWeekFormatter={day => `${day.format('dd')}.`}

     // If you were already using the day object, just remove the first argument.
  -  dayOfWeekFormatter={(_dayStr, day) => `${day.format('dd')}.`}
  +  dayOfWeekFormatter={day => `${day.format('dd')}.`}
   />
  ```

- The imports related to the `calendarHeader` slot have been moved from `@mui/x-date-pickers/DateCalendar` to `@mui/x-date-pickers/PIckersCalendarHeader`:

  ```diff
   export {
     pickersCalendarHeaderClasses,
     PickersCalendarHeaderClassKey,
     PickersCalendarHeaderClasses,
     PickersCalendarHeader,
     PickersCalendarHeaderProps,
     PickersCalendarHeaderSlotsComponent,
     PickersCalendarHeaderSlotsComponentsProps,
     ExportedPickersCalendarHeaderProps,
  -} from '@mui/x-date-pickers/DateCalendar';
  +} from '@mui/x-date-pickers/PickersCalendarHeader';

  ```

- The `monthAndYear` format has been removed.
  It was used in the header of the calendar views, you can replace it with the new `format` prop of the `calendarHeader` slot:

  ```diff
   <LocalizationProvider
     adapter={AdapterDayJS}
  -  formats={{ monthAndYear: 'MM/YYYY' }}
   />
     <DatePicker
  +    slotProps={{ calendarHeader: { format: 'MM/YYYY' }}}
     />
     <DateRangePicker
  +    slotProps={{ calendarHeader: { format: 'MM/YYYY' }}}
     />
   <LocalizationProvider />
  ```

- The `adapter.getDiff` method have been removed, you can directly use your date library:

  ```diff
   // For Day.js
  -const diff = adapter.getDiff(value, comparing, unit);
  +const diff = value.diff(comparing, unit);

   // For Luxon
  -const diff = adapter.getDiff(value, comparing, unit);
  +const getDiff = (value: DateTime, comparing: DateTime | string, unit?: AdapterUnits) => {
  +  const parsedComparing = typeof comparing === 'string'
  +    ? DateTime.fromJSDate(new Date(comparing))
  +    : comparing;
  +  if (unit) {
  +    return Math.floor(value.diff(comparing).as(unit));
  +  }
  +  return value.diff(comparing).as('millisecond');
  +};
  +
  +const diff = getDiff(value, comparing, unit);

    // For DateFns
  -const diff = adapter.getDiff(value, comparing, unit);
  +const getDiff = (value: Date, comparing: Date | string, unit?: AdapterUnits) => {
  +  const parsedComparing = typeof comparing === 'string' ? new Date(comparing) : comparing;
  +  switch (unit) {
  +    case 'years':
  +      return dateFns.differenceInYears(value, parsedComparing);
  +    case 'quarters':
  +      return dateFns.differenceInQuarters(value, parsedComparing);
  +    case 'months':
  +      return dateFns.differenceInMonths(value, parsedComparing);
  +    case 'weeks':
  +      return dateFns.differenceInWeeks(value, parsedComparing);
  +    case 'days':
  +      return dateFns.differenceInDays(value, parsedComparing);
  +    case 'hours':
  +      return dateFns.differenceInHours(value, parsedComparing);
  +    case 'minutes':
  +      return dateFns.differenceInMinutes(value, parsedComparing);
  +    case 'seconds':
  +      return dateFns.differenceInSeconds(value, parsedComparing);
  +    default: {
  +      return dateFns.differenceInMilliseconds(value, parsedComparing);
  +    }
  +  }
  +};
  +
  +const diff = getDiff(value, comparing, unit);

   // For Moment
  -const diff = adapter.getDiff(value, comparing, unit);
  +const diff = value.diff(comparing, unit);
  ```

- The `adapter.getFormatHelperText` method have been removed, you can use the `adapter.expandFormat` instead:

```diff
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format);
```

And if you need the exact same output you can apply the following transformation:

```diff
 // For Day.js
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format).replace(/a/gi, '(a|p)m').toLocaleLowerCase();

 // For Luxon
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format).replace(/(a)/g, '(a|p)m').toLocaleLowerCase();

 // For DateFns
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format).replace(/(aaa|aa|a)/g, '(a|p)m').toLocaleLowerCase();

 // For Moment
-const expandedFormat = adapter.getFormatHelperText(format);
+const expandedFormat = adapter.expandFormat(format).replace(/a/gi, '(a|p)m').toLocaleLowerCase();
```

- The `adapter.getMeridiemText` method have been removed, you can use the `adapter.setHours`, `adapter.date` and `adapter.format` methods to recreate its behavior:

  ```diff
  -const meridiem = adapter.getMeridiemText('am');
  +const getMeridiemText = (meridiem: 'am' | 'pm') => {
  +  const date = adapter.setHours(adapter.date()!, meridiem === 'am' ? 2 : 14);
  +  return utils.format(date, 'meridiem');
  +};
  +
  +const meridiem = getMeridiemText('am');
  ```

- The `adapter.getMonthArray` method have been removed, you can use the `adapter.startOfYear` and `adapter.addMonths` methods to recreate its behavior:

  ```diff
  -const monthArray = adapter.getMonthArray(value);
  +const getMonthArray = (year) => {
  +  const firstMonth = utils.startOfYear(year);
  +  const months = [firstMonth];
  +
  +  while (months.length < 12) {
  +    const prevMonth = months[months.length - 1];
  +    months.push(utils.addMonths(prevMonth, 1));
  +  }
  +
  +  return months;
  +}
  +
  +const monthArray = getMonthArray(value);
  ```

- The `adapter.getNextMonth` method have been removed, you can use the `adapter.addMonths` method instead:

  ```diff
  -const nextMonth = adapter.getNextMonth(value);
  +const nextMonth = adapter.addMonths(value, 1);
  ```

- The `adapter.getPreviousMonth` method have been removed, you can use the `adapter.addMonths` method instead:

  ```diff
  -const previousMonth = adapter.getPreviousMonth(value);
  +const previousMonth = adapter.addMonths(value, -1);
  ```

- The `adapter.getWeekdays` method have been removed, you can use the `adapter.startOfWeek` and `adapter.addDays` methods instead:

  ```diff
  -const weekDays = adapter.getWeekdays(value);
  +const getWeekdays = (value) => {
  +  const start = adapter.startOfWeek(value);
  +  return [0, 1, 2, 3, 4, 5, 6].map((diff) => utils.addDays(start, diff));
  +};
  +
  +const weekDays = getWeekdays(value);
  ```

- The `isNull` method have been removed, you can replace it with a very basic check:

  ```diff
  -const isNull = adapter.isNull(value);
  +const isNull = value === null;
  ```

- The `adapter.mergeDateAndTime` method have been removed, you can use the `adapter.setHours`, `adapter.setMinutes`, and `adapter.setSeconds` methods to recreate its behavior:

  ```diff
  -const result = adapter.mergeDateAndTime(valueWithDate, valueWithTime);
  +const mergeDateAndTime = <TDate>(
  +   dateParam,
  +   timeParam,
  + ) => {
  +   let mergedDate = dateParam;
  +   mergedDate = utils.setHours(mergedDate, utils.getHours(timeParam));
  +   mergedDate = utils.setMinutes(mergedDate, utils.getMinutes(timeParam));
  +   mergedDate = utils.setSeconds(mergedDate, utils.getSeconds(timeParam));
  +
  +   return mergedDate;
  + };
  +
  +const result = mergeDateAndTime(valueWithDate, valueWithTime);
  ```

- The `adapter.parseISO` method have been removed, you can directly use your date library:

  ```diff
   // For Day.js
  -const value = adapter.parseISO(isoString);
  +const value = dayjs(isoString);

   // For Luxon
  -const value = adapter.parseISO(isoString);
  +const value = DateTime.fromISO(isoString);

   // For DateFns
  -const value = adapter.parseISO(isoString);
  +const value = dateFns.parseISO(isoString);

   // For Moment
  -const value = adapter.parseISO(isoString);
  +const value = moment(isoString, true);
  ```

- The `adapter.toISO` method have been removed, you can directly use your date library:

  ```diff
   // For Day.js
  -const isoString = adapter.toISO(value);
  +const isoString = value.toISOString();

   // For Luxon
  -const isoString = adapter.toISO(value);
  +const isoString = value.toUTC().toISO({ format: 'extended' });

   // For DateFns
  -const isoString = adapter.toISO(value);
  +const isoString = dateFns.formatISO(value, { format: 'extended' });

   // For Moment
  -const isoString = adapter.toISO(value);
  +const isoString = value.toISOString();
  ```

- The `adapter.isEqual` method used to accept any type of value for its two input and tried to parse them before checking if they were equal.
  The method has been simplified and now only accepts an already-parsed date or `null` (ie: the same formats used by the `value` prop in the pickers)

  ```diff
   const adapterDayjs = new AdapterDayjs();
   const adapterLuxon = new AdapterLuxon();
   const adapterDateFns = new AdapterDateFns();
   const adapterMoment = new AdatperMoment();

   // Supported formats
   const isEqual = adapterDayjs.isEqual(null, null); // Same for the other adapters
   const isEqual = adapterLuxon.isEqual(DateTime.now(), DateTime.fromISO('2022-04-17'));
   const isEqual = adapterMoment.isEqual(moment(), moment('2022-04-17'));
   const isEqual = adapterDateFns.isEqual(new Date(), new Date('2022-04-17'));

   // Non-supported formats (JS Date)
  -const isEqual = adapterDayjs.isEqual(new Date(), new Date('2022-04-17'));
  +const isEqual = adapterDayjs.isEqual(dayjs(), dayjs('2022-04-17'));

  -const isEqual = adapterLuxon.isEqual(new Date(), new Date('2022-04-17'));
  +const isEqual = adapterLuxon.isEqual(DateTime.now(), DateTime.fromISO('2022-04-17'));

  -const isEqual = adapterMoment.isEqual(new Date(), new Date('2022-04-17'));
  +const isEqual = adapterMoment.isEqual(moment(), moment('2022-04-17'));

   // Non-supported formats (string)
  -const isEqual = adapterDayjs.isEqual('2022-04-16', '2022-04-17');
  +const isEqual = adapterDayjs.isEqual(dayjs('2022-04-17'), dayjs('2022-04-17'));

  -const isEqual = adapterLuxon.isEqual('2022-04-16', '2022-04-17');
  +const isEqual = adapterLuxon.isEqual(DateTime.fromISO('2022-04-17'), DateTime.fromISO('2022-04-17'));

  -const isEqual = adapterMoment.isEqual('2022-04-16', '2022-04-17');
  +const isEqual = adapterMoment.isEqual(moment('2022-04-17'), moment('2022-04-17'));

  -const isEqual = adapterDateFns.isEqual('2022-04-16', '2022-04-17');
  +const isEqual = adapterDateFns.isEqual(new Date('2022-04-17'), new Date('2022-04-17'));
  ```

- The `dateLibInstance` prop of `LocalizationProvider` does not work with `AdapterDayjs` anymore (#11023). This prop was used to set the pickers in UTC mode before the implementation of a proper timezone support in the components.
  You can learn more about the new approach on the [dedicated doc page](https://mui.com/x/react-date-pickers/timezone/).

  ```diff
   // When a `value` or a `defaultValue` is provided
   <LocalizationProvider
     adapter={AdapterDayjs}
  -  dateLibInstance={dayjs.utc}
   >
     <DatePicker value={dayjs.utc('2022-04-17')} />
   </LocalizationProvider>

   // When no `value` or `defaultValue` is provided
   <LocalizationProvider
     adapter={AdapterDayjs}
  -  dateLibInstance={dayjs.utc}
   >
  -  <DatePicker />
  +  <DatePicker timezone="UTC" />
   </LocalizationProvider>
  ```

- The property `hasLeadingZeros` has been removed from the sections in favor of the more precise `hasLeadingZerosInFormat` and `hasLeadingZerosInInput` properties (#10994). To keep the same behavior, you can replace it by `hasLeadingZerosInFormat`:

  ```diff
   const fieldRef = React.useRef<FieldRef<FieldSection>>(null);

   React.useEffect(() => {
     const firstSection = fieldRef.current!.getSections()[0];
  -  console.log(firstSection.hasLeadingZeros);
  +  console.log(firstSection.hasLeadingZerosInFormat);
   }, []);

   return (
     <DateField unstableFieldRef={fieldRef} />
   );
  ```

- The `adapter.getYearRange` method used to accept two params and now accepts a tuple to be consistent with the `adapter.isWithinRange` method (#10978):

  ```diff
  -adapter.getYearRange(start, end);
  +adapter.getYearRange([start, end])
  ```

- The `adapter.isValid` method used to accept any type of value and tried to parse them before checking their validity (#10971).
  The method has been simplified and now only accepts an already-parsed date or `null`.
  Which is the same type as the one accepted by the components `value` prop.

  ```diff
   const adapterDayjs = new AdapterDayjs();
   const adapterLuxon = new AdapterLuxon();
   const adapterDateFns = new AdapterDateFns();
   const adapterMoment = new AdatperMoment();

   // Supported formats
   const isValid = adapterDayjs.isValid(null); // Same for the other adapters
   const isValid = adapterLuxon.isValid(DateTime.now());
   const isValid = adapterMoment.isValid(moment());
   const isValid = adapterDateFns.isValid(new Date());

   // Non-supported formats (JS Date)
  -const isValid = adapterDayjs.isValid(new Date('2022-04-17'));
  +const isValid = adapterDayjs.isValid(dayjs('2022-04-17'));

  -const isValid = adapterLuxon.isValid(new Date('2022-04-17'));
  +const isValid = adapterLuxon.isValid(DateTime.fromISO('2022-04-17'));

  -const isValid = adapterMoment.isValid(new Date('2022-04-17'));
  +const isValid = adapterMoment.isValid(moment('2022-04-17'));

   // Non-supported formats (string)
  -const isValid = adapterDayjs.isValid('2022-04-17');
  +const isValid = adapterDayjs.isValid(dayjs('2022-04-17'));

  -const isValid = adapterLuxon.isValid('2022-04-17');
  +const isValid = adapterLuxon.isValid(DateTime.fromISO('2022-04-17'));

  -const isValid = adapterMoment.isValid('2022-04-17');
  +const isValid = adapterMoment.isValid(moment('2022-04-17'));

  -const isValid = adapterDateFns.isValid('2022-04-17');
  +const isValid = adapterDateFns.isValid(new Date('2022-04-17'));
  ```

#### Changes

- [pickers] Change the input format of `adapter.getYearRange` to be consistent with `adapter.isWithinRange` (#10978) @flaviendelangle
- [pickers] Clean remaining `components` / `componentsProps` typings (#11040) @flaviendelangle
- [pickers] Modify `adapter.isEqual` method to accept `TDate | null` instead of `any` (#10976) @flaviendelangle
- [pickers] Modify `adapter.isValid` method to accept `TDate | null` instead of `any` (#10971) @flaviendelangle
- [pickers] Remove the `hasLeadingZeros` property from `FieldSection` (#10994) @flaviendelangle
- [pickers] Remove the deprecated methods and formats from the adapters (#10776) @flaviendelangle
- [pickers] Remove the legacy UTC implementation for `dayjs` (#11023) @flaviendelangle
- [pickers] Remove unused code (#11048) @flaviendelangle
- [pickers] Move the exports of the `calendarHeader` slot to `@mui/x-date-pickers/PickersCalendarHeader` (#11020) @flaviendelangle
- [DateCalendar] Allow to override the format of the header with a prop (#10990) @flaviendelangle
- [DateCalendar] Remove the string argument of the `dayOfWeekFormatter` prop (#10992) @flaviendelangle

### Docs

- [docs] Fix incorrect component name in the "Custom slots and subcomponents" page (#11024) @flaviendelangle
- [docs] Fix typos in pickers migration guide (#11057) @flaviendelangle

### Core

- [core] Clean the component slots doc generation (#11021) @flaviendelangle
- [core] Fix script to release with `next` tag (#10996) @LukasTy
- [test] Wait for images to load (#11004) @cherniavskii

## 7.0.0-alpha.0

_Nov 10, 2023_

We're thrilled to announce the first alpha release of our next major version, v7.
This release introduces a few breaking changes, paving the way for the upcoming features like Pivoting and DateTimeRangePicker.

A special shoutout to thank the 12 contributors who made this release possible. Here are some highlights ✨:

- 🚀 First v7 alpha release
- ✨ Fix aggregation label not showing when `renderHeader` is used (#10961) @cherniavskii
- 📘 Server side data source [early documentation](https://mui.com/x/react-data-grid/server-side-data/)
- 💫 New recipes added for the Data Grid
- 📈 `<ChartsReferenceLine />` component is now available
- 🌍 Add Basque (eu) locale, improve Czech (cs-CZ) and Spanish (es-ES) locales
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The deprecated `components` and `componentsProps` props have been removed. Use `slots` and `slotProps` instead. See [components section](/x/react-data-grid/components/) for more details.
- The print export will now only print the selected rows if there are any.
  If there are no selected rows, it will print all rows. This makes the print export consistent with the other exports.
  You can [customize the rows to export by using the `getRowsToExport` function](/x/react-data-grid/export/#customizing-the-rows-to-export).
- The `getApplyFilterFnV7` in `GridFilterOperator` was renamed to `getApplyFilterFn`.
  If you use `getApplyFilterFnV7` directly - rename it to `getApplyFilterFn`.
- The signature of the function returned by `getApplyFilterFn` has changed for performance reasons:

```diff
 const getApplyFilterFn: GetApplyFilterFn<any, unknown> = (filterItem) => {
   if (!filterItem.value) {
     return null;
   }
   const filterRegex = new RegExp(escapeRegExp(filterItem.value), 'i');
-  return (cellParams) => {
-    const { value } = cellParams;
+  return (value, row, colDef, apiRef) => {
     return value != null ? filterRegex.test(String(value)) : false;
   };
 }
```

- The `getApplyQuickFilterFnV7` in `GridColDef` was renamed to `getApplyQuickFilterFn`.
  If you use `getApplyQuickFilterFnV7` directly - rename it to `getApplyQuickFilterFn`.
- The signature of the function returned by `getApplyQuickFilterFn` has changed for performance reasons:

```diff
 const getGridStringQuickFilterFn: GetApplyQuickFilterFn<any, unknown> = (value) => {
   if (!value) {
     return null;
   }
   const filterRegex = new RegExp(escapeRegExp(value), 'i');
-  return (cellParams) => {
-    const { formattedValue } = cellParams;
+  return (value, row, column, apiRef) => {
+    let formattedValue = apiRef.current.getRowFormattedValue(row, column);
     return formattedValue != null ? filterRegex.test(formattedValue.toString()) : false;
   };
 };
```

#### `@mui/x-data-grid@7.0.0-alpha.0`

- [DataGrid] Fix for error thrown when removing skeleton rows, after sorting is applied (#10807) @benjaminbialy
- [DataGrid] Fix: `undefined` slot value (#10937) @romgrk
- [DataGrid] Print selected rows by default (#10846) @cherniavskii
- [DataGrid] Remove deprecated `components` and `componentsProps` (#10911) @MBilalShafi
- [DataGrid] Remove legacy filtering API (#10897) @cherniavskii
- [DataGrid] Fix keyboard navigation for actions cell with disabled buttons (#10882) @michelengelen
- [DataGrid] Added a recipe for using non-native select in filter panel (#10916) @michelengelen
- [DataGrid] Added a recipe to style cells without impacting the aggregation cells (#10913) @michelengelen
- [l10n] Improve Czech (cs-CZ) locale (#10949) @luborepka

#### `@mui/x-data-grid-pro@7.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@7.0.0-alpha.0`, plus:

- [DataGridPro] Autosize Columns - Fix headers being cut off (#10666) @gitstart
- [DataGridPro] Add data source interface and basic documentation (#10543) @MBilalShafi

#### `@mui/x-data-grid-premium@7.0.0-alpha.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@7.0.0-alpha.0`, plus:

- [DataGridPremium] Render aggregation label when `renderHeader` is used (#10936) @cherniavskii

### Date and Time Pickers

#### Breaking changes

- The deprecated `components` and `componentsProps` props have been removed. Use `slots` and `slotProps` instead.

#### `@mui/x-date-pickers@7.0.0-alpha.0`

- [pickers] Escape non tokens words (#10400) @alexfauquette
- [fields] Fix `MultiInputTimeRangeField` section selection (#10922) @noraleonte
- [pickers] Refine `referenceDate` behavior in views (#10863) @LukasTy
- [pickers] Remove `components` and `componentsProps` props (#10700) @alexfauquette
- [l10n] Add Basque (eu) locale and improve Spanish (es-ES) locale (#10819) @lajtomekadimon
- [pickers] Add short weekdays token (#10988) @alexfauquette

#### `@mui/x-date-pickers-pro@7.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@7.0.0-alpha.0`.

### Charts / `@mui/x-charts@7.0.0-alpha.0`

#### Breaking changes

Types for `slots` and `slotProps` have been renamed by removing the "Component" which is meaningless for charts.
Unless you imported those types, to create a wrapper, you should not be impacted by this breaking change.

Here is an example of the renaming for the `<ChartsTooltip />` component.

```diff
-ChartsTooltipSlotsComponent
+ChartsTooltipSlots

-ChartsTooltipSlotComponentProps
+ChartsTooltipSlotProps
```

- [charts] Add `<ChartsReferenceLine />` component (#10597) (#10946) @alexfauquette
- [charts] Improve properties JSDoc (#10931) (#10955) @alexfauquette
- [charts] Rename `slots` and `slotProps` types (#10875) @alexfauquette

### `@mui/x-codemod@7.0.0-alpha.0`

- [codemod] Add `v7.0.0/preset-safe` (#10973) @LukasTy

### Docs

- [docs] Add `@next` tag to the installation instructions (#10963) @MBilalShafi
- [docs] Document how to hide the legend (#10951) @alexfauquette
- [docs] Fix typo in the migration guide (#10972) @flaviendelangle

### Core

- [core] Adds migration docs for Charts, Pickers, and Tree View (#10926) @michelengelen
- [core] Bump monorepo (#10959) @LukasTy
- [core] Changed prettier branch value to next (#10917) @michelengelen
- [core] Fix GitHub title tag consistency @oliviertassinari
- [core] Fixed wrong package names in migration docs (#10953) @michelengelen
- [core] Merge `master` into `next` (#10929) @cherniavskii
- [core] Update release instructions as per v7 configuration (#10962) @MBilalShafi
- [license] Correctly throw errors (#10924) @oliviertassinari

## Older versions

Changes before 7.x are listed in our [changelog for older versions](https://github.com/mui/mui-x/blob/HEAD/changelogOld/).
