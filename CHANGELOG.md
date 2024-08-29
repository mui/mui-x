# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 7.15.0

_Aug 29, 2024_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 💫 Support Material UI v6 (`@mui/material@6`) peer dependency (#14142) @cherniavskii

You can now use MUI X components with either v5 or v6 of `@mui/material` package 🎉

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
- [docs] Fix Stack Overflow issue canned response @oliviertassinari
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
- [DataGrid] Fix error logged during skeleton loading with nested data grid (#14186) @KenanYusuf
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
- [internals] Move utils needed for tree view virtualization to shared package (#14202) @flaviendelangle

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

### Docs

- [docs] Add a warning to promote the usage of `updateRows` (#14027) @MBilalShafi
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

This expansion of the Pro plan comes with some adjustments to our pricing strategy. Learn more about those in the [Upcoming changes to MUI X pricing in 2024](https://mui.com/blog/mui-x-sep-2024-price-update/) blog post.

### Highlights

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce [item reordering using drag and drop](https://mui.com/x/react-tree-view/rich-tree-view/ordering/) on the `RichTreeViewPro` component

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
- [charts] Use vendor to have Common JS bundle working out of the box (#13608) @alexfauquette
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
- 🌳 Add `selectItem` and `getItemDOMElement` methods to the TreeView component public API
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

- [TreeView] Add `selectItem` and `getItemDOMElement` methods to the public API (#13485) @flaviendelangle

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
- [license] Allow usage of charts and tree view pro package for old premium licenses (#13619) @flaviendelangle

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
- [TreeView] Support `itemId` with escaping characters when using `SimpleTreeView` (#13487) @oukunan

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
- [TreeView] Refactor the tree view internals to prepare for headless API (#13311) @flaviendelangle

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
- [test] Add tests for the custom slots of `TreeItem2` (#13314) @flaviendelangle

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
- [docs] Small improvements on accessibility data grid doc (#13233) @arthurbalduini
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

## v7.5.1

_May 23, 2024_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🧰 Improve tree view testing
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

## v7.5.0

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

- [TreeView] Fix props propagation and theme entry in `TreeItem2` (#12889) @flaviendelangle

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
- [docs] Add file explorer example to rich tree view customization docs (#12707) @noraleonte
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
- [TreeView] Create `RichTreeViewPro` component (not released yet) (#12610) @flaviendelangle
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
- [docs] Move data grid interfaces to standard API page layout (#12016) @alexfauquette
- [docs] Remove ` around @default values (#12158) @alexfauquette
- [docs] Remove `day` from the default `dayOfWeekFormatter` function params (#12644) @LukasTy
- [docs] Use `TreeItem2` for icon expansion example on `RichTreeView` (#12563) @flaviendelangle

### Core

- [core] Add cherry-pick `master` to `v6` action (#12648) @LukasTy
- [core] Fix typo in `@mui/x-tree-view-pro/themeAugmentation` (#12674) @flaviendelangle
- [core] Introduce `describeTreeView` to run test on `SimpleTreeView` and `RichTreeView`, using `TreeItem` and `TreeItem2` + migrate expansion tests (#12428) @flaviendelangle
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

- [TreeView] Do not use outdated version of the state to compute new label first char in `RichTreeView` (#12512) @flaviendelangle

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

- The required `nodeId` prop used by the `TreeItem` has been renamed to `itemId` for consistency:

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
- [TreeView] Introduce a new `TreeItem2` component and a new `useTreeItem2` hook (#11721) @flaviendelangle
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

- The component used to animate the item children is now defined as a slot on the `TreeItem` component.

  If you were passing a `TransitionComponent` or `TransitionProps` to your `TreeItem` component,
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

- The `group` class of the `TreeItem` component has been renamed to `groupTransition` to match with its new slot name.

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
- [TreeView] In the `RichTreeView`, do not use the item id as the HTML id attribute (#12319) @flaviendelangle
- [TreeView] New instance and publicAPI method: `getItem` (#12251) @flaviendelangle
- [TreeView] Replace `TransitionComponent` and `TransitionProps` with a `groupTransition` slot (#12336) @flaviendelangle

### Docs

- [docs] Add a note about `z-index` usage in SVG (#12337) @alexfauquette
- [docs] `RichTreeView` customization docs (#12231) @noraleonte

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

- The headless field hooks (e.g.: `useDateField`) now returns a new prop called `enableAccessibleFieldDOMStructure`.
  This property is utilized to determine whether the anticipated UI is constructed using an accessible DOM structure. Learn more about this new [accessible DOM structure](/x/react-date-pickers/fields/#accessible-dom-structure).

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

- 🎁 Charts get a [built in grid](https://next.mui.com/x/react-charts/axis/#grid)

  <img src="https://github.com/mui/mui-x/assets/45398769/74299f54-f020-4135-b38c-dc88a230db30" width="510" alt="Charts Grid" />

- 🎛️ Charts get a [Gauge component](https://next.mui.com/x/react-charts/gauge/).

  <img src="https://github.com/mui/mui-x/assets/45398769/fb7a94b5-bef6-4fc2-a0cd-d6ff5b60fa8b" width="510" alt="Guage Chart" />

- 🐞 Bugfixes

- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The `rowEditCommit` event and the related prop `onRowEditCommit` was removed. The [`processRowUpdate`](https://next.mui.com/x/react-data-grid/editing/#the-processrowupdate-callback) prop can be used in place.

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

- If you're using the [commercial license](https://next.mui.com/x/introduction/licensing), you need to update the import path:

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

  - [Scatter Chart](https://next.mui.com/x/react-charts/scatter/#click-event)
  - [Line Chart](https://next.mui.com/x/react-charts/lines/#click-event)
  - [Bar Chart](https://next.mui.com/x/react-charts/bars/#click-event)
  - [Pie Chart](https://next.mui.com/x/react-charts/pie/#click-event)

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
  See [animation documentation](next.mui.com/x/react-charts/lines/#animation) for more information.

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

- 🚀 Release the [Date Time Range Picker](https://next.mui.com/x/react-date-pickers/date-time-range-picker/) component (#9528) @LukasTy

  <img src="https://github.com/mui/mui-x/assets/4941090/122bb7bc-5e72-4e11-a8e5-96f3026de922" width="510" height="652" alt="Date Time Range Picker example" />

- 🎁 New column management panel design for the Data Grid (#11770) @MBilalShafi

  <img width="310" alt="image" src="https://github.com/mui/mui-x/assets/12609561/a79dac8b-d54d-4e69-a63a-ef78f3993f37">

- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The columns management component has been redesigned and the component was extracted from the `ColumnsPanel` which now only serves as a wrapper to display the component above the headers as a panel. As a result, a new slot `columnsManagement` and the related prop `slotProps.columnsManagement` have been introduced. The props corresponding to the columns management component which were previously passed to the prop `slotProps.columnsPanel` should now be passed to `slotProps.columnsManagement`. `slotProps.columnsPanel` could still be used to override props corresponding to the `Panel` component used in `ColumnsPanel` which uses [`Popper`](https://next.mui.com/material-ui/react-popper/) component under the hood.

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

- [docs] Add `contextValue` to the headless tree view doc (#11705) @flaviendelangle
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
- ⚙️ The Data Grid disabled column-specific features like filtering, sorting, grouping, etc. could now be accessed programmatically. See the related [docs](https://next.mui.com/x/react-data-grid/api-object/#access-the-disabled-column-features) section.
- 🚀 Uplift the `SimpleTreeView` customization examples (#11424) @noraleonte
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

  - When the [Tree data](https://next.mui.com/x/react-data-grid/tree-data/) feature is used, the grid role is now `role="treegrid"` instead of `role="grid"`.
  - The Data Grid cells now have `role="gridcell"` instead of `role="cell"`.

  - The buttons in toolbar composable components `GridToolbarColumnsButton`, `GridToolbarFilterButton`, `GridToolbarDensity`, and `GridToolbarExport` are now wrapped with a tooltip component and have a consistent interface. To override some props corresponding to the toolbar buttons or their corresponding tooltips, you can use the `slotProps` prop. Following is an example diff. See [Toolbar section](https://next.mui.com/x/react-data-grid/components/#toolbar) for more details.

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

- The disabled column specific features like `hiding`, `sorting`, `filtering`, `pinning`, `row grouping`, etc could now be controlled programmatically using `initialState`, respective controlled models, or the [API object](https://next.mui.com/x/react-data-grid/api-object/). See the related [docs](https://next.mui.com/x/react-data-grid/api-object/#access-the-disabled-column-features) section.

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
  This will help create a new headless version of the `TreeItem` component based on a future `useTreeItem` hook.

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
- [docs] Fix generated tree view API docs (#11737) @LukasTy
- [docs] Generate docs for Tree View slots (#11730) @flaviendelangle
- [docs] Improve codemod for v7 (#11650) @oliviertassinari
- [docs] Improve data grid `pageSizeOptions` prop documentation (#11682) @oliviertassinari
- [docs] Parse markdown on API docs demo titles (#11728) @LukasTy
- [docs] Remove the description from the `className` prop (#11693) @oliviertassinari
- [docs] Uplift `SimpleTreeView` customization examples (#11424) @noraleonte
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

- [tree view] Cleanup `onKeyDown` handler (#11481) @flaviendelangle
- [tree view] Define the parameters used by each plugin to avoid listing them in each component (#11473) @flaviendelangle

### Docs

- [docs] Fix parsing of `x-date-pickers-pro` demo adapter imports (#11628) @LukasTy
- [docs] Improve `git diff` format @oliviertassinari
- [docs] Push up the MUI X brand (#11533) @oliviertassinari
- [docs] Remove old data grid translation files (#11646) @cherniavskii
- [docs] Improve Server-side data grid docs (#11589) @oliviertassinari
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

  You can now directly pass your data to the `RichTreeView` component instead of manually converting it into JSX `TreeItem` components:

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
  See [migration docs](https://next.mui.com/x/migration/migration-data-grid-v6/#instanceid-prop-is-required-for-state-selectors) for more details.

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

- The slot interfaces got renamed to match with `@mui/base` naming.
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

  You should now be able to directly pass the returned value from your field hook (e.g: `useDateField`) to `useClearableField`

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
  Now they can interact with data by triggering the closest element. See the [docs page](https://next.mui.com/x/react-charts/scatter/#interaction) for more info.

- 📚 Add [Pickers FAQ page](https://next.mui.com/x/react-date-pickers/faq/)
- 🎉 The Data Grid Header filters feature is now stable
- 🌍 Improve Danish (da-DK) locale on Data Grid
- 🐞 Bugfixes

### Data Grid

#### Breaking changes

- The header filters feature is now stable. `unstable_` prefix is removed from prop `headerFilters` and related exports.
  See [migration docs](https://next.mui.com/x/migration/migration-data-grid-v6/#filtering) for more details.

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

  When using Luxon 3.4.4 or higher, the start of the week will be defined by the date locale (e.g.: Sunday for `en-US`, Monday for `fr-FR`).

- 📈 Fix a lot of Charts package issues
- 🎉 The Data Grid features Cell selection and Clipboard paste are now stable
- 🌍 Improve Bulgarian (bg-BG) locale on Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### Breaking changes

- The clipboard paste feature is now enabled by default. The flag `clipboardPaste` is no longer needed to be passed to the `experimentalFeatures` prop.

- The clipboard related exports `ignoreValueFormatterDuringExport` and `splitClipboardPastedText` are no longer prefixed with `unstable_`.

- The deprecated constants `SUBMIT_FILTER_STROKE_TIME` and `SUBMIT_FILTER_DATE_STROKE_TIME` have been removed from the `DataGrid` exports. Use the [`filterDebounceMs`](https://next.mui.com/x/api/data-grid/data-grid/#data-grid-prop-filterDebounceMs) prop to customize filter debounce time.

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
  See [including hidden columns](https://next.mui.com/x/react-data-grid/filtering/quick-filter/#including-hidden-columns) section for more details.

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

  You can read more about the deprecation of this prop in [v6 migration guide](https://next.mui.com//x/migration/migration-pickers-v5/#%E2%9C%85-rename-or-refactor-shoulddisabletime-prop).

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
- 💫 New recipes added for the data grid
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

Types for `slots` and `slotProps` got renamed by removing the "Component" which is meaningless for charts.
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

- [core] Adds migration docs for charts, pickers and tree view (#10926) @michelengelen
- [core] Bump monorepo (#10959) @LukasTy
- [core] Changed prettier branch value to next (#10917) @michelengelen
- [core] Fix GitHub title tag consistency @oliviertassinari
- [core] Fixed wrong package names in migration docs (#10953) @michelengelen
- [core] Merge `master` into `next` (#10929) @cherniavskii
- [core] Update release instructions as per v7 configuration (#10962) @MBilalShafi
- [license] Correctly throw errors (#10924) @oliviertassinari

## Older versions

Changes before 7.x are listed in our [changelog for older versions](https://github.com/mui/mui-x/blob/HEAD/changelogOld/).
