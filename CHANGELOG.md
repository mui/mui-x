# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.16.2

_Oct 12, 2023_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 📊 Chart's legend text management has been reworked and contains breaking changes (#10138) @alexfauquette
- 📝 Add [Bulk editing](https://mui.com/x/react-data-grid/recipes-editing/#bulk-editing) demo (#10333) @cherniavskii
- 🚀 Column grouping now works smoothly with column pinning (#10518) @MBilalShafi
- 🌍 Improve Arabic (ar-SD) and Spanish (es-ES) locales
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.16.2`

- [DataGrid] Fix `LazyLoading` demo crash (#10621) @MBilalShafi
- [DataGrid] Fix cells overlapping the scrollbar in iOS Safari (#10633) @cherniavskii
- [DataGrid] Fix `getRowId is not defined` error (#10613) @romgrk
- [DataGrid] Get quick filter to work OOTB with `date` and `dateTime` fields (#10636) @MBilalShafi
- [DataGrid] Make cursor for selectable cells to be `default` unless editable (#9997) @gitstart
- [DataGrid] Remove unnecessary syntax in JSDoc (#10567) @Lev-Shapiro
- [DataGrid] Update row hover behavior to match native hover (#10623) @cherniavskii
- [l10n] Improve Arabic (ar-SD) locale (#10625) @alabenyahia

#### `@mui/x-data-grid-pro@6.16.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.16.2`, plus:

- [DataGridPro] Improve column grouping and column pinning friendship (#10518) @MBilalShafi

#### `@mui/x-data-grid-premium@6.16.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.16.2`.

### Date Pickers

#### `@mui/x-date-pickers@6.16.2`

- [DateTimePicker] Add support for `DigitalClock` view renderer (#10624) @LukasTy
- [fields] Bootstrap the multi-HTML input component (#10638) @flaviendelangle
- [pickers] Fix timezone `UTC` false positive (#10586) @alexfauquette
- [l10n] Improve Spanish (es-ES) locale (#10588) @eduardodallmann

#### `@mui/x-date-pickers-pro@6.16.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.16.2`.

### Charts / `@mui/x-charts@6.0.0-alpha.15`

#### Breaking changes

The charts have a new text display mechanism.
It adds line break support and avoids overlapping text in the legend.
This comes with some breaking changes.

- The DOM structure is modified. An intermediary `<tspan />` element has been added. This can impact how your style is applied.
  ```diff
  - <text>The label</text>
  + <text><tspan>The label</tspan></text>
  ```

- The top margin has been reduced from 100 to 50 to benefit from the denser legend.

- To accurately compute the text size and then place it, styling should be provided as a JS object. For example, to set the legend font size, you should do:
  ```jsx
  <PieChart
    {/** ... */}
    slotProps={{
      legend: {
        labelStyle: {
          fontSize: 16,
        },
      },
    }}
  />
  ```
  Support for other text elements (axis labels and tick labels) will be implemented in follow-up PR.

#### Changes

- [charts] Fix typo between internal/external variable (#10640) @alexfauquette
- [charts] Improve the management of the text (#10138) @alexfauquette

### Docs

- [docs] Add bulk editing demo (#10333) @cherniavskii
- [docs] Add reference links to DateRangePicker components (#10629) @michelengelen
- [docs] Add reference links to DateTimePicker components (#10628) @michelengelen
- [docs] Add reference links to picker field components (#10631) @michelengelen
- [docs] Added reference links to TimePicker components (#10627) @michelengelen
- [docs] Avoid Pickers playground error due to empty views (#10654) @LukasTy
- [docs] Fix DataGrid[Pro/Premium] reference links (#10620) @michelengelen

### Core

- [core] Bump monorepo (#10619) @alexfauquette
- [core] Update `no-response` workflow (#10491) @MBilalShafi
- [core] Update the issue templates to reflect the new support workflow (#10651) @MBilalShafi
- [test] Fix `testEval` not invoking test assertions (#10587) @cherniavskii
- [test] Fix dev mode warning (#10610) @oliviertassinari
- [test] Set UUID chance seed in visual tests (#10609) @oliviertassinari

## 6.16.1

_Oct 6, 2023_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🥧 Support interaction with pie chart
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.16.1`

- [DataGrid] Add a new demo with sparklines (#9228) @flaviendelangle
- [DataGrid] Fix autosize missing a few pixels (#10471) @romgrk
- [DataGrid] Make `disableColumnSelector` demo idempotent (#10548) @MBilalShafi

#### `@mui/x-data-grid-pro@6.16.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.16.1`.

#### `@mui/x-data-grid-premium@6.16.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.16.1`.

### Date Pickers

#### `@mui/x-date-pickers@6.16.1`

- [pickers] Avoid calendar layout shifting when changing views (#10541) @LukasTy
- [pickers] Fix clearable behavior when disabled (#10542) @noraleonte
- [pickers] Improve customization playground examples (#10544) @noraleonte

#### `@mui/x-date-pickers-pro@6.16.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.16.1`, plus:

- [DateRangePicker] Fix `InputProps` propagation in multi input (#10564) @alexfauquette

### Charts / `@mui/x-charts@6.0.0-alpha.14`

- [charts] Display cursor pointer for pie chart only if `onClick` is provided (#10551) @giladappsforce
- [charts] Add `onClick` prop to PieChart (#10506) @giladappsforce
- [charts] Support `slots`/`slotProps` for the tooltip (#10515) @alexfauquette

### Docs

- [docs] Add `DateRangePicker` example with a `Button` trigger (#10485) @LukasTy
- [docs] Add section about disabling columns panel (#10328) @MBilalShafi
- [docs] Add section about overriding slots to base concepts (#10421) @noraleonte
- [docs] Add "What's new" page listing all release announcements (#9727) @joserodolfofreitas
- [docs] Update RTL Support section of the grid localization docs (#10561) @MBilalShafi

### Core

- [core] Fix casing consistency with legal and marketing content @oliviertassinari
- [core] Revert the link in the priority support ticket description (#10517) @michelengelen
- [CHANGELOG] Polish image @oliviertassinari

## 6.16.0

_Sep 29, 2023_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add a clearable behavior to all the single input pickers and fields (#9095) @noraleonte

  The pickers and fields now have an out-of-the box implementation for clearing the field value. You can see the documentation for this behavior on the [Date Picker documentation](https://mui.com/x/react-date-pickers/date-picker/#clearing-the-value).

  <img width="337" height="139" alt="Clearable behavior" src="https://github.com/mui/mui-x/assets/3165635/a5407cb6-0b8a-443c-b4b9-1f81ceb4d087">

- 💫 Add Date Picker customization playground (#9581) @noraleonte

  You can play around with style customization options on the [Date Picker documentation](https://mui.com/x/react-date-pickers/date-picker/#customization).

  We are thrilled to hear your feedback about this functionality!

- 🚀 Fix header filters menu auto closing on render (#10483) @MBilalShafi
- 🎯 Fix column headers scroll when theme scoping is used (#10437) @cherniavskii
- 🌍 Improve Russian (ru-RU) locale on the data grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.16.0`

- [DataGrid] Fix column headers scroll when theme scoping is used (#10437) @cherniavskii
- [DataGrid] Rename `global` to `globalScope` due to Jest issue (#10470) @romgrk
- [l10n] Improve Russian (ru-RU) locale (#10464 and #10407) @NKodos

#### `@mui/x-data-grid-pro@6.16.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.16.0`, plus:

- [DataGridPro] Fix header filters menu auto closing on render (#10483) @MBilalShafi

#### `@mui/x-data-grid-premium@6.16.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.16.0`.

### Date Pickers

#### `@mui/x-date-pickers@6.16.0`

- [pickers] Add warning to `shouldDisableDate` validation (#10502) @michelengelen
- [pickers] Implement `clearable` field behavior (#9095) @noraleonte
- [pickers] Refactor `dayOfWeekFormatter` (#10345) @michelengelen

#### `@mui/x-date-pickers-pro@6.16.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.16.0`.

### Charts / `@mui/x-charts@6.0.0-alpha.13`

- [charts] Share upfront future Pro features (#10465) @oliviertassinari

### Tree View / `@mui/x-tree-view@6.0.0-beta.0`

- [TreeView] Do not try to focus a collapsed node when re-focusing the TreeView (#10422) @flaviendelangle
- [TreeView] Fix the typing of the `Multiple` generic (#10478) @flaviendelangle

### Docs

- [docs] Correct the typo in data grid api docs (#10477) @MBilalShafi
- [docs] Add customization playground (#9581) @noraleonte
- [docs] Fix Tree View product ID (#10428) @oliviertassinari
- [docs] Fix demo crashing when all rows are deleted (#10438) @cherniavskii
- [docs] Fix mobile scrollbar column resize (#10455) @oliviertassinari
- [docs] Fix usage of `GridRenderCellParams` interface (#10435) @cherniavskii

### Core

- [core] Fix typo in header data grid quick filter @oliviertassinari
- [core] Group D3 renovate PRs (#10480) @flaviendelangle
- [core] Link the priority support page (#10495) @michelengelen
- [core] Move the pickers describes to the test utils folder (#10490) @flaviendelangle
- [core] Priority Support casing normalization @oliviertassinari
- [core] Remove automated DataGrid performance tests (#10414) @romgrk
- [core] Sync `prism-okaidia.css` with docs-infra @oliviertassinari
- [core] Update issue actions & templates (#10375) @romgrk
- [core] Update release guide (#10468) @DanailH

## 6.15.0

_Sep 22, 2023_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Implement columns auto-sizing (#10180) @romgrk
- 🎁 Add support for `getRowsToExport` option to print export on the data grid (#10084) @zreecespieces
- 🌍 Improve Finnish (fi-FI) locale
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.15.0`

- [DataGrid] Add support for `getRowsToExport` option to print export (#10084) @zreecespieces
- [DataGrid] Fix dev warning about `InputLabelProps` (#10413) @romgrk
- [DataGrid] Refactor `GridMenu` prop `onClickAway` to `onClose` (#10411) @romgrk
- [DataGrid] Restore focus after `GridMenu` closes (#10412) @romgrk
- [DataGrid] Fix typing of `GridActionsCellItem` (#10344) @romgrk
- [DataGrid] Hide `eval` from bundlers (#10329) @romgrk
- [DataGrid] Add `border: 0` to unmounted focused cell to avoid layout shifts in that row (#10318) @lauri865

#### `@mui/x-data-grid-pro@6.15.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.15.0`, plus:

- [DataGridPro] Implement columns auto-sizing (#10180) @romgrk
- [DataGridPro] Fix keyboard navigation issue in header filters (#10358) @MBilalShafi
- [DataGridPro] Add missing row hover styles (#10252) @cherniavskii
- [DataGridPro] Make default filter items have stable references in header filters (#10338) @MBilalShafi

#### `@mui/x-data-grid-premium@6.15.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.15.0`.

### Date Pickers

#### `@mui/x-date-pickers@6.15.0`

- [pickers] Support tokens without spaces (#10185) @alexfauquette
- [l10n] Improve Finnish (fi-FI) locale (#10346) @samijouppila

#### `@mui/x-date-pickers-pro@6.15.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.15.0`.

### Charts / `@mui/x-charts@6.0.0-alpha.12`

- [charts] Fix sparkline scale and rendering (#10402) @alexfauquette
- [charts] Remove components from `@mui/material` (#10115) @alexfauquette

### Tree View / `@mui/x-tree-view@6.0.0-alpha.4`

- [TreeView] Split features into plugins to prepare for Pro version (#10123) @flaviendelangle

### Docs

- [docs] Add charts documentation pages to complete pricing table (#10394) @alexfauquette
- [docs] Add missing MIT packages on the Licensing page (#10348) @flaviendelangle
- [docs] Clearer component pattern @oliviertassinari
- [docs] Easier to understand demo (#10370) @oliviertassinari
- [docs] Fix `301` to Material UI @oliviertassinari
- [docs] Improve the column visibility section (#10327) @MBilalShafi
- [docs] Improve the documentation section `rowIdentifier` (#10326) @MBilalShafi
- [docs] Improve pickers localization documentation (#10202) @flaviendelangle
- [docs] Polish typescript ref usage (#10359) @oliviertassinari
- [docs] Improve charts tooltip wording (#10406) @alexfauquette

### Core

- [core] Cleanup GitHub issues template (#10372) @romgrk
- [core] Fix Circle CI OOM (#10385) @romgrk
- [core] Improve sleep test helper @oliviertassinari
- [core] Remove unwanted prefixes @oliviertassinari
- [core] Remove duplicate label @oliviertassinari
- [core] Simplify source @oliviertassinari
- [core] Upgrade monorepo (#10425) @cherniavskii
- [core] Upgrade monorepo to have the new typescript-to-proptype (#10224) @flaviendelangle
- [test] Do not use deprecated adapter methods (#10416) @flaviendelangle
- [test] Name test suites according to sentence case (#10429) @alexfauquette

## 6.14.0

_Sep 14, 2023_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Fix `YearCalendar` and `MonthCalendar` accessibility (#10312) @LukasTy

  The `YearCalendar` and `MonthCalendar` items role has been changed from `button` to `radio` in order to improve the component's a11y support.
  If you were relying on the mentioned components having a `button` role for items, you will need to update your usage to expect a `radio` role instead.

- 🌍 Improve Japanese (ja-JP), Persian (fa-IR), and Vietnamese (vi-VN) locales on the data grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.14.0`

- [l10n] Improve Japanese (ja-JP) locale (#10299) @makoto14
- [l10n] Improve Persian (fa-IR) locale (#10277) @aminsaedi
- [l10n] Improve Vietnamese (vi-VN) locale (#10280) @khangnguyen2100

#### `@mui/x-data-grid-pro@6.14.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.14.0`.

#### `@mui/x-data-grid-premium@6.14.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.14.0`, plus:

- [DataGridPremium] Fix clipboard import cutting off at 100 rows (#9930) @gitstart

### Date Pickers

#### `@mui/x-date-pickers@6.14.0`

- [pickers] Fix `YearCalendar` and `MonthCalendar` a11y (#10312) @LukasTy
- [pickers] Localize `TimeClock` meridiem text (#10324) @LukasTy

#### `@mui/x-date-pickers-pro@6.14.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.14.0`.

### Charts / `@mui/x-charts@6.0.0-alpha.11`

- [charts] Add default `barGapRatio` and increase `categoryGapRatio` (#10317) @LukasTy
- [charts] Enable `eslint` on the package (#10330) @LukasTy

### Tree View / `@mui/x-tree-view@6.0.0-alpha.3`

- [TreeView] Fix box-sizing dependency (#10255) @oliviertassinari

### Docs

- [docs] Add conditional range picker props example (#10227) @LukasTy
- [docs] Add toolbar to the multi-filters demo (#10223) @MBilalShafi
- [docs] Avoid the use of "We" @oliviertassinari
- [docs] Clarify MUI vs. MUI Core difference @oliviertassinari
- [docs] Enable `ariaV7` flag for demos using `useDemoData` hook (#10204) @cherniavskii
- [docs] Fix Tree View link to API references (#10282) @oliviertassinari
- [docs] Fix image layout shift (#10313) @oliviertassinari
- [docs] Fix link to MUI X from readme logo @oliviertassinari
- [docs] Fix redirection to Base UI URLs @oliviertassinari
- [docs] Improve Tree View demos (#10268) @oliviertassinari
- [docs] Improve docs for ref type props (#10273) @michelengelen
- [docs] Improve npm package README (#10269) @oliviertassinari
- [docs] Improve the clarity of the npm links @oliviertassinari
- [docs] Keep installation readme simple @oliviertassinari
- [docs] Make each component feel more standalone @oliviertassinari

### Core

- [core] Add types extension for clarity @oliviertassinari
- [core] Set logo height to fix layout shift in GitHub @oliviertassinari
- [core] TrapFocus was renamed to FocusTrap @oliviertassinari

## 6.13.0

_Sep 8, 2023_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Fix `anchorRef` behavior on range pickers (#10077) @LukasTy

  The range picker popup will now be anchored to the first input element and left aligned like other pickers.

- 🌍 Improve Slovak (sk-SK) locale on the data grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.13.0`

- [DataGrid] Allow to override the default overlay height in `autoHeight` mode (#10203) @cherniavskii
- [DataGrid] Allow to override the default row count component in footer (#10063) @hungmanhle
- [DataGrid] Fix an error when hovering on a row, the background changed to white (#10214) @chucamphong
- [DataGrid] Fix custom column docs, remove legacy `extendType` (#10175) @oliviertassinari
- [DataGrid] Make the pinned rows be on top of the no rows overlay (#9986) @DanailH
- [l10n] Improve Slovak (sk-SK) locale (#10182) @msidlo

#### `@mui/x-data-grid-pro@6.13.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.13.0`, plus:

- [DataGridPro] Fix column resize with pinned rows (#10229) @cherniavskii

#### `@mui/x-data-grid-premium@6.13.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.13.0`, plus:

- [DataGridPremium] Fix aggregated column resizing (#10079) @cherniavskii

### Date Pickers

#### `@mui/x-date-pickers@6.13.0`

- [pickers] Respect the adapter locale in `AdapterMoment.getWeekdays` (#10221) @flaviendelangle

#### `@mui/x-date-pickers-pro@6.13.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.13.0`, plus:

- [DateRangePicker] Fix `anchorRef` behavior (#10077) @LukasTy

### Charts / `@mui/x-charts@6.0.0-alpha.10`

- [charts] Remove require condition from package.json exports (#10272) @Janpot

### Tree View / `@mui/x-tree-view@6.0.0-alpha.2`

- [TreeView] Add missing export (#10245) @flaviendelangle

### Docs

- [docs] Add a `Getting Started` page for the Tree View (#10218) @flaviendelangle
- [docs] Add pickers `Custom opening button` page (#10200) @flaviendelangle
- [docs] Add pie chart demo with a center label (#10220) @giladappsforce
- [docs] Do not document ignored components (#10258) @flaviendelangle
- [docs] Fix charts demo using too deep import (#10263) @LukasTy
- [docs] Fix `e.g.` typo @oliviertassinari
- [docs] Fix npm package indentation @oliviertassinari
- [docs] Fix typo in tree view docs @oliviertassinari
- [docs] Improve the week picker example (#8257) @flaviendelangle
- [docs] Include code links in the data grid demo (#10219) @cherniavskii
- [docs] Polish page for SEO (#10216) @oliviertassinari
- [docs] Use `Base UI` `Portal` for the quick filter recipe (#10188) @DanailH

### Core

- [core] Finish migration to GA4 @oliviertassinari
- [core] Fix yarn docs:create-playground script @oliviertassinari
- [core] Move @mui/base from peer dependency to dependency (#10215) @oliviertassinari
- [core] Prevent `e.g.` typo (#10193) @oliviertassinari
- [core] Remove unused `babel-plugin-tester` package (#10243) @LukasTy

## 6.12.1

_Aug 31, 2023_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🏎️ Perf improvement for line charts
- 🎁 Add `referenceDate` prop on pickers (#9991) @flaviendelangle
  Find out more about this feature in the [documentation section](https://mui.com/x/react-date-pickers/base-concepts/#reference-date-when-no-value-is-defined).
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.12.1`

- [DataGrid] Add a recipe showing how to render components outside of the grid (#10121) @DanailH
- [DataGrid] Fix `valueFormatter` being persisted on column type change (#10041) @cherniavskii
- [DataGrid] Fix error when keyboard navigating an empty grid (#10081) @romgrk
- [DataGrid] Replace timeout with `useTimeout` (#10179) @romgrk

#### `@mui/x-data-grid-pro@6.12.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.12.1`.

#### `@mui/x-data-grid-premium@6.12.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.12.1`.

### Date Pickers

#### `@mui/x-date-pickers@6.12.1`

- [pickers] Add `referenceDate` on picker components (and `DateRangeCalendar`) (#9991) @flaviendelangle

#### `@mui/x-date-pickers-pro@6.12.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.12.1`.

### Charts / `@mui/x-charts@6.0.0-alpha.9`

- [charts] Move the line item highligh into a dedicated component (#10117) @alexfauquette

### Docs

- [docs] Add `DemoContainer` and `DemoItem` JSDoc (#10186) @LukasTy
- [docs] Add link to `custom layout` page (#10184) @LukasTy
- [docs] Add tree view nav item (#10181) @LukasTy
- [docs] Fix wrong chart tooltip reference (#10169) @oliviertassinari
- [docs] Improve chart SEO (#10170) @oliviertassinari
- [docs] Precise expired license key condition (#10165) @oliviertassinari
- [docs] Reorganize the page menu (#10139) @alexfauquette

### Core

- [core] Update babel configs (#9713) @romgrk
- [test] Disable false positive e2e test on webkit (#10187) @LukasTy

## 6.12.0

_Aug 25, 2023_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 📊 Support horizontal bar chart
- 💫 Improved animations on Android devices
- 🌍 Improve Ukrainian (uk-UA) locale on the data grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.12.0`

- [DataGrid] Allow print export for more than 100 rows (#10045) @MBilalShafi
- [l10n] Improve Ukrainian (uk-UA) locale (#10076) @mkundos

#### `@mui/x-data-grid-pro@6.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.12.0`.

#### `@mui/x-data-grid-premium@6.12.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.12.0`.

### Date Pickers

#### `@mui/x-date-pickers@6.12.0`

- [fields] Do not clamp day of month (#9973) @flaviendelangle
- [pickers] Fix `ownerState` on `desktopPaper` slot props (#10103) @LukasTy
- [pickers] Fix to `transform-origin` when popper opens to `top` (#10069) @LukasTy
- [pickers] Fix `YearCalendar` scrolling (#10135) @LukasTy
- [pickers] Improve the typing of the adapter `dateWithTimezone` method (#10029) @flaviendelangle
- [pickers] Make `openPickerButton` toggle picker (#10109) @noraleonte
- [pickers] Update `reduceAnimations` default rule (#9864) @LukasTy

#### `@mui/x-date-pickers-pro@6.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.12.0`.

### Charts / `@mui/x-charts@6.0.0-alpha.8`

- [charts] Fix import issue (#10111) @alexfauquette
- [charts] Fix `slotProps` propagation (#10105) @alexfauquette
- [charts] Support horizontal bar chart (#9992) @alexfauquette

### Docs

- [docs] Address charts docs feedback (#10119) @alexfauquette
- [docs] Capitalization convention pickers @oliviertassinari
- [docs] Fix a11y issue on plan links (#10026) @oliviertassinari
- [docs] Fix some charts horizontal overflow on mobile devices (#10082) @cupok
- [docs] Fix typo in quick filter @oliviertassinari
- [docs] Fix typo in the timezone page (#10073) @flaviendelangle

### Core

- [core] Bump monorepo (#10129) @LukasTy
- [core] Document a bit `useLazyRef` @oliviertassinari
- [core] Enable strict type checking options in the top-level tsconfig (#9925) @cherniavskii
- [core] Increase global e2e timeout (#10134) @LukasTy
- [core] Remove outdated link (#10125) @oliviertassinari
- [core] Update `no-response` workflow (#10102) @DanailH

## 6.11.2

_Aug 17, 2023_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🏎️ Lower the filtering delay in the grid
- 🌍 Improve Spanish (es-ES) locale on the data grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.11.2`

- [DataGrid] Fix `eval` blocked by CSP (#9863) @romgrk
- [DataGrid] Fix row id bug (#10051) @romgrk
- [DataGrid] Honor `disableExport` flag in Print Export (#10044) @MBilalShafi
- [DataGrid] Lower filter debounce delay (#9712) @romgrk
- [DataGrid] Unhide potential ref binding issue (#9965) @oliviertassinari
- [l10n] Improve Chinese (zh-CN) and Chinese(traditional) (zh-TW) locales (#9999) @MyNameIsTakenOMG
- [l10n] Improve Spanish (es-ES) locale (#10037) @Macampu420

#### `@mui/x-data-grid-pro@6.11.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.11.2`.

#### `@mui/x-data-grid-premium@6.11.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.11.2`.

### Date Pickers

#### `@mui/x-date-pickers@6.11.2`

- [pickers] Fix month switcher RTL (#10003) @alexfauquette
- [pickers] Follow-up on using device motion reduction preference (#9858) @LukasTy
- [pickers] Pass the shortcut information in the `onChange` context (#9985) @flaviendelangle
- [pickers] Replace `Grid` toolbar component with a styled `div` (#10052) @LukasTy

#### `@mui/x-date-pickers-pro@6.11.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.11.2`.

### Docs

- [docs] Add migration guide for the Tree View (#9987) @flaviendelangle
- [docs] Fix en-US changelog @oliviertassinari
- [docs] Update column types (#10040) @romgrk

### Core

- [core] Remove unnecessary Box (#9831) @oliviertassinari
- [core] Set GitHub Action top level permission @oliviertassinari
- [core] Split the pickers test utils (#9976) @flaviendelangle

## 6.11.1

_Aug 11, 2023_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 💫 Add theme augmentation to `@mui/x-tree-view`
- 📈 Enable charts customization using `slot` and `slotProps` props
- 🌍 Improve Finnish (fi-FI) and Icelandic (is-IS) locales on the pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.11.1`

- [DataGrid] `getCellAggregationResult`: Handle `null` `rowNode` case (#9915) @romgrk

#### `@mui/x-data-grid-pro@6.11.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.11.1`.

#### `@mui/x-data-grid-premium@6.11.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.11.1`.

### Date Pickers

#### `@mui/x-date-pickers@6.11.1`

- [fields] Use `numeric` `inputmode` instead of `tel` (#9918) @LukasTy
- [pickers] Always respect locale when formatting meridiem (#9979) @flaviendelangle
- [pickers] Call `onChange` when selecting a shortcut with `changeImportance="set"` (#9974) @flaviendelangle
- [pickers] Refactor `themeAugmentation` `styleOverrides` (#9978) @LukasTy
- [l10n] Improve Finnish (fi-FI) locale (#9795) @kurkle
- [l10n] Improve Icelandic (is-IS) locale (#9639) @magnimarels

#### `@mui/x-date-pickers-pro@6.11.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.11.1`.

### Charts / `@mui/x-charts@6.0.0-alpha.7`

- [charts] Fix label and tick alignment (#9952) @LukasTy
- [charts] Remove not functional component `styleOverrides` (#9996) @LukasTy
- [charts] Set custom ticks number (#9922) @alexfauquette
- [charts] Use `slot`/`slotProps` for customization (#9744) @alexfauquette
- [charts] Extend cheerful fiesta palette (#9980) @noraleonte

### Tree View / `@mui/x-tree-view@6.0.0-alpha.1`

- [TreeView] Add theme augmentation (#9967) @flaviendelangle

### Docs

- [docs] Clarify the `shouldDisableClock` migration code options (#9920) @LukasTy

### Core

- [core] Port GitHub workflow for ensuring triage label is present (#9924) @DanailH
- [docs-infra] Fix the import samples in Api pages (#9898) @alexfauquette

## 6.11.0

_Aug 4, 2023_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- ⌚️ Move the tree view component from `@mui/lab` package

  The `<TreeView />` component has been moved to the MUI X repository.
  It is now accessible from its own package: `@mui/x-tree-view`.

- 🌍 Improve Hebrew (he-IL), Finnish (fi-FI), and Italian (it-IT) locales on the data grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.11.0`

- [DataGrid] Add `ariaV7` experimental flag (#9496) @cherniavskii
- [DataGrid] Fix cell size when column width is set to `undefined` (#9871) @gitstart
- [l10n] Improve Hebrew (he-IL) locale (#9820) @itayG98
- [l10n] Improve Finnish (fi-FI) locale (#9848) @sambbaahh
- [l10n] Improve Italian (it-IT) locale (#9627) @fabio-rizzello-omnia

#### `@mui/x-data-grid-pro@6.11.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.11.0`.

#### `@mui/x-data-grid-premium@6.11.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.11.0`.

### Date Pickers

#### `@mui/x-date-pickers@6.11.0`

- [fields] Correctly handle events with a complete value insertion (#9896) @LukasTy
- [fields] Fix hours editing on dayjs with timezone and DST (#9901) @flaviendelangle
- [fields] Fix section clearing with timezone (#9819) @flaviendelangle
- [pickers] Add `CalendarHeader` slot (#7784) @flaviendelangle
- [pickers] Allow to override the `InputProps` of the `TextField` using the `slotProps` (#9849) @flaviendelangle
- [pickers] Allow to override the opening aria text using the `localeText` prop on the pickers (#9870) @flaviendelangle
- [pickers] Fix `sx` and `className` props on `MobileDateRangePicker` (#9853) @flaviendelangle
- [pickers] Fix default descriptions (#9887) @LukasTy
- [pickers] Fix offset management on dayjs adapter (#9884) @flaviendelangle
- [pickers] Use device motion reduction preference (#9823) @LukasTy

#### `@mui/x-date-pickers-pro@6.11.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.11.0`.

### Charts / `@mui/x-charts@6.0.0-alpha.6`

- [charts] Add TS definition to the exported elements (#9885) @alexfauquette
- [charts] Add sparkline (#9662) @alexfauquette
- [charts] Fix missing configuration types (#9886) @alexfauquette
- [charts] Introduce dataset to simplify plot of data from API (#9774) @alexfauquette

### Tree View / `@mui/x-tree-view@6.0.0-alpha.0`

- [TreeView] Add missing exported types (#9862) @flaviendelangle
- [TreeView] Add tree view to changelog generator script (#9903) @MBilalShafi
- [TreeView] Create the package on the X repository (#9798) @flaviendelangle
- [TreeView] Improve props typing (#9855) @flaviendelangle

### Docs

- [docs] Add Tree View doc (#9825) @flaviendelangle
- [docs] Add charts nav item (#9821) @LukasTy
- [docs] Add charts to MUI X introduction pages (#9704) @joserodolfofreitas
- [docs] Add example for avoiding picker views layout shift (#9781) @noraleonte
- [docs] Consistency of Next.js App Router @oliviertassinari
- [docs] Fix API page regression: bring back slots section (#9866) @alexfauquette
- [docs] Fix demo using Pro while it's MIT (#9842) @oliviertassinari
- [docs] Get ready for next docs-infra change @oliviertassinari
- [docs] Improve the slots documentation `Recommended usage` section (#9892) @flaviendelangle

### Core

- [core] Fix font loading issue dev-mode (#9843) @oliviertassinari
- [core] Fix pipeline (#9894) @LukasTy
- [core] Fix the link-check script on Windows (#9888) @alexfauquette
- [core] Fix v7 capitalization (#9878) @oliviertassinari
- [core] Regen doc (#9902) @flaviendelangle
- [core] Remove benchmark package (#9413) @LukasTy
- [core] Stop using the deprecated `JSX` global namespace (#9854) @flaviendelangle
- [core] Update monorepo (#9846) @flaviendelangle
- [core] Update tree data API docs (#9827) @cherniavskii
- [test] Add pickers e2e tests (#9747) @LukasTy
- [test] Data grid e2e tests follow-up (#9822) @cherniavskii

## 6.10.2

_Jul 27, 2023_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Improve scatter charts performance
- 📚 Redesigned component API documentation and side navigation
- 🐞 Bugfixes

### Data Grid

#### `@mui/x-data-grid@6.10.2`

- [DataGrid] Fix quick filter & aggregation error (#9729) @romgrk
- [DataGrid] Fix row click propagation causing error in nested grid (#9741) @cherniavskii
- [DataGrid] Keep focused cell in the DOM (#7357) @yaredtsy
- [l10n] Improve Finnish (fi-FI) locale (#9746) @sambbaahh

#### `@mui/x-data-grid-pro@6.10.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.10.2`.

#### `@mui/x-data-grid-premium@6.10.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.10.2`, plus:

- [DataGridPremium] Allow to customize grouping cell offset (#9417) @cherniavskii

### Date Pickers

#### `@mui/x-date-pickers@6.10.2`

- [pickers] Remove the `endOfDate` from `DigitalClock` timeOptions (#9800) @noraleonte

#### `@mui/x-date-pickers-pro@6.10.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.10.2`.

### Charts / `@mui/x-charts@6.0.0-alpha.5`

- [charts] Improve JSDoc for axis-related props (#9779) @flaviendelangle
- [charts] Improve performances of Scatter component (#9527) @flaviendelangle

### Docs

- [docs] Add `pnpm` in more places @oliviertassinari
- [docs] Add `pnpm` installation instructions for MUI X (#9707) @richbustos
- [docs] Align pickers "uncontrolled vs controlled" sections (#9772) @LukasTy
- [docs] Apply style guide to the data grid Layout page (#9673) @richbustos
- [docs] Differentiate between packages in `slotProps` docs (#9668) @cherniavskii
- [docs] Fix charts width in axis pages (#9801) @alexfauquette
- [docs] Fix wrong prop name in the Editing page (#9753) @m4theushw
- [docs] New component API page and side nav design (#9187) @alexfauquette
- [docs] Update overview page with up to date information about the plans (#9512) @joserodolfofreitas

### Core

- [core] Use PR charts version in preview (#9787) @alexfauquette
- [license] Allow overriding the license on specific parts of the page (#9717) @Janpot
- [license] Throw in dev mode after 30 days (#9701) @oliviertassinari
- [license] Only throw in dev mode (#9803) @oliviertassinari
- [test] Fail the CI when new unexpected files are created (#9728) @oliviertassinari

## 6.10.1

_Jul 20, 2023_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Fix CSV export for values containing double quotes
- 🚀 Improve tree data performance
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.10.1`

- [DataGrid] Filtering performance: compile filter applier with `eval` (#9635) @romgrk
- [DataGrid] Fix CSV export for values containing double quotes (#9667) @cherniavskii
- [DataGrid] Fix column type change not working correctly (#9594) @cherniavskii
- [DataGrid] Fix quick filter `undefined` row error (#9708) @romgrk
- [DataGrid] Prevent `viewportOuterSize.height` going negative (#9664) @gitstart
- [DataGrid] Update focused cell on page change via keyboard (#9203) @m4theushw
- [DataGrid] Wait for remote stylesheets to load before print (#9665) @cherniavskii

#### `@mui/x-data-grid-pro@6.10.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.10.1`, plus:

- [DataGridPro] Improve tree data performance (#9682) @cherniavskii
- [DataGridPro] Prevent affecting cells from child DataGrid when resizing a column (#9670) @m4theushw

#### `@mui/x-data-grid-premium@6.10.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.10.1`.

### Date Pickers

#### `@mui/x-date-pickers@6.10.1`

- [fields] Fix `format` and `value` update order (#9715) @LukasTy
- [pickers] Remove `require` usage in comment (#9675) @LukasTy

#### `@mui/x-date-pickers-pro@6.10.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.10.1`.

### Charts / `@mui/x-charts@6.0.0-alpha.4`

- [charts] Fix blinking in responsive charts and extremums computation for line charts (#9734) @alexfauquette
- [charts] Use ESM with imports (#9645) @alexfauquette

### Docs

- [docs] Add additional note for license key installation on Next.js (#9575) @joserodolfofreitas
- [docs] Add paragraph about managing focus of custom edit components (#9658) @m4theushw
- [docs] Add unsorted icon slot to the custom sort icons demo (#9169) @d4rekanguok
- [docs] Disable ad for onboarding pages (#9700) @oliviertassinari
- [docs] Disabling ads without toolbar has no effect @oliviertassinari
- [docs] Fix Date Pickers usage to Title Case (#9680) @richbustos
- [docs] Fix sorting in `CustomSortIcons` demo (#9656) @MBilalShafi
- [docs] Improve the UI for pickers introduction (#9644) @alexfauquette
- [docs] Improve the demo design @oliviertassinari
- [docs] Localization progress, polish (#9672) @oliviertassinari
- [docs] Normalize the WIP items (#9671) @oliviertassinari

### Core

- [core] Add `validate` command (#9714) @romgrk
- [CHANGELOG] Update generator to new format @oliviertassinari

## 6.10.0

_Jul 13, 2023_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- ⚡ Improve data grid filtering performance
- 🎁 Include column groups in the CSV export
- 🌍 Improve Polish (pl-PL) locale for the data grid
- 🌍 Improve Norwegian (nb-NO) locale for the pickers

### Data Grid

#### `@mui/x-data-grid@6.10.0`

- [DataGrid] Allow to exclude hidden columns from the quick filter (#9610) @cherniavskii
- [DataGrid] Filtering performance: remove indirection (#9334) @romgrk
- [DataGrid] Fix props propagation on `GridToolbarQuickFilter` component (#9633) @giladappsforce
- [DataGrid] Fix quick filter input lag (#9630) @cherniavskii
- [DataGrid] Include column groups in the CSV export (#9585) @cherniavskii
- [DataGrid] Make `rowExpansionChange` event public (#9611) @MBilalShafi
- [l10n] Improve Polish (pl-PL) locale (#9625) @ch1llysense

#### `@mui/x-data-grid-pro@6.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.10.0`.

#### `@mui/x-data-grid-premium@6.10.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.10.0`.

### Date Pickers

#### `@mui/x-date-pickers@6.10.0`

- [pickers] Fix date calendar issues (#9652) @LukasTy
- [l10n] Improve Norwegian (nb-NO) locale (#9608) @JosteinBrevik

#### `@mui/x-date-pickers-pro@6.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.10.0`.

### Charts / `@mui/x-charts@6.0.0-alpha.3`

- [charts] Allow configuring bar size (#9632) @alexfauquette
- [charts] Simplify custom components creation (#9561) @alexfauquette

### Docs

- [docs] Add slot components usage alert (#9660) @LukasTy
- [docs] Fix casing Cell selection @oliviertassinari

### Core

- [core] Disambiguate eslint plugin name @oliviertassinari
- [core] Update priority support issue template and prompt (#9574) @DanailH
- [CHANGELOG] Clarify each plan (#9446) @oliviertassinari
- [license] Fix error terminology (#9614) @oliviertassinari

## 6.9.2

_Jul 6, 2023_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Auto-scroll when making range selection (#8661) @m4theushw

- 📚 New page: Components lifecycle (#8372) @flaviendelangle

  Clarify pickers events and value updates in a [single docs page](https://mui.com/x/react-date-pickers/lifecycle/).

- 🥧 Add pie chart component

  They are fresh from the code editor. You can visit [pie charts docs](https://mui.com/x/react-charts/pie/) or their [demo page](https://mui.com/x/react-charts/pie-demo/).

  <img width="380" alt="pie-charts" src="https://github.com/mui/mui-x/assets/13808724/fe908c45-803c-4316-b913-dbd2f9f0551e">

- 🐞 Bugfixes

- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.9.2`

- [DataGrid] Fix `RangeError` when using flex columns (#9554) @cherniavskii
- [DataGrid] Fix React 17 editing bug (#9530) @romgrk
- [DataGrid] Use `getRowId` in filtering (#9564) @romgrk
- [DataGrid] Correctly reflect `TablePagination`'s `rowsPerPageOptions` shape to `pageSizeOptions` (#9438) @burakkgunduzz
- [l10n] Improve Spanish (es-ES) locale (#9500) @fufex

#### `@mui/x-data-grid-pro@6.9.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.9.2`.

#### `@mui/x-data-grid-premium@6.9.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.9.2`, plus:

- [DataGridPremium] Auto-scroll when making range selection (#8661) @m4theushw

### Date Pickers

#### `@mui/x-date-pickers@6.9.2`

- [pickers] Forward digital clock classes (#9555) @YoonjiJang
- [pickers] Rename `internal` folder to `internals` on `@mui/x-date-picker-pro` (#9571) @flaviendelangle

#### `@mui/x-date-pickers-pro@6.9.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.9.2`.

### Charts / `@mui/x-charts@6.0.0-alpha.2`

- [charts] Add pie chart component (#9395) @alexfauquette

### Docs

- [docs] Add pickers playground (#9164) @LukasTy
- [docs] Fix API links for pickers (#9573) @alexfauquette
- [docs] Fix demos with `ToggleButtonGroup` (#9548) @flaviendelangle
- [docs] Fix typos in pagination documentation page (#9332) @RatherBeLunar
- [docs] Hide ads on paid content @oliviertassinari
- [docs] Move the charts in the sidebar (#9437) @flaviendelangle
- [docs] New page: Components lifecycle (#8372) @flaviendelangle
- [docs] Remove outdated header tag @oliviertassinari

### Core

- [core] Fix typo in priority support @oliviertassinari
- [core] Remove mention of Crowdin @oliviertassinari

## 6.9.1

_Jun 30, 2023_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🔎 Add experimental API for faster filtering performance
- 🌍 Add Chinese (Hong Kong) (zh-HK) locale on the pickers
- 🌍 Improve Romanian (ro-RO) and Hungarian (hu-HU) translations on the pickers and the data grid
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.9.1`

- [DataGrid] Add Joy UI `tooltip` and `loadingOverlay` slots (#9028) @cherniavskii
- [DataGrid] Add section about enabling pagination on Pro and Premium (#8759) @joserodolfofreitas
- [DataGrid] Don't forward `editCellState` prop to DOM element (#9501) @m4theushw
- [DataGrid] Add experimental API for faster filtering performance (#9254) @romgrk
- [DataGrid] Fix `nextFieldToFocus` to always be a visible column field when <kbd>Tab</kbd> key is pressed (#8314) @yaredtsy
- [DataGrid] Fix `Maximum call stack size exceeded` error when using fractional width (#9516) @cherniavskii
- [l10n] Improve Romanian (ro-RO) and Hungarian (hu-HU) translations (#9436) @noraleonte

#### `@mui/x-data-grid-pro@6.9.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.9.1`, plus:

- [DataGridPro] Don't throw error in column pinning (#9507) @romgrk
- [DataGridPro] Fix bug with `checkboxSelection` and treeData/grouping (#9418) @romgrk

#### `@mui/x-data-grid-premium@6.9.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.9.1`.

### Date Pickers

#### `@mui/x-date-pickers@6.9.1`

- [DateTimePicker] Scroll to Digital Clock section only when selection changes (#9434) @LukasTy
- [pickers] Handle `keyDown` only when input is focused (#9481) @LukasTy
- [pickers] Add `referenceDate` prop on `TimeClock`, `DigitalClock` and `MultiSectionDigitalClock` (#9356) @flaviendelangle
- [l10n] Add Chinese (Hong Kong) (zh-HK) locale (#9468) @samchiu90
- [l10n] Improve Romanian (ro-RO) translations (#9436) @noraleonte

#### `@mui/x-date-pickers-pro@6.9.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.9.1`.

### Charts / `@mui/x-charts@6.0.0-alpha.1`

- [charts] Take responsive container from data grid (#9497) @alexfauquette
- [charts] Update README.md (#9426) @alexfauquette
- [charts] Fix typo and small refactor (#9526) @flaviendelangle

### Docs

- [docs] Add a recipe limiting to one expanded detail panel at a time (#9488) @cherniavskii
- [docs] Add missing upcoming flag without issue (#9449) @oliviertassinari
- [docs] Fix 301 when opening the charts @oliviertassinari
- [docs] Fix 404 link (#9435) @alexfauquette
- [docs] Fix `productId` logic (#9451) @oliviertassinari
- [docs] Update charts overview.md (#9429) @brentertz
- [docs] Avoid systematic usage of `"bg": "inline"` (#9499) @alexfauquette
- [docs] Display plan icon in ToC (#9490) @cherniavskii
- [docs] Remove "product" markdown header (#9517) @oliviertassinari

### Core

- [core] Add `edit-mode` to priority support action (#9483) @DanailH
- [core] Fix priority support prompt action (#9472) @DanailH
- [core] Update `uses` for priority support action (#9480) @DanailH
- [core] Bumb update monorepo (#9476) @alexfauquette
- [CHANGELOG] Fix media quality (#9439) @oliviertassinari
- [CHANGELOG] Remove height img attribute @oliviertassinari
- [test] Skip flaky row pinning tests in JSDOM (#9511) @cherniavskii

## 6.9.0

_Jun 22, 2023_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🎁 We released a new open-source package: `@mui/x-charts`. This package aims at simplifying the integration of charts into your dashboards. 📊

  <img width="512" alt="charts" src="https://github.com/mui/mui-x/assets/3165635/41201d3c-16a4-442d-a230-68356e6b433d">

  It already contains [line](https://mui.com/x/react-charts/lines/), [bar](https://mui.com/x/react-charts/bars/), and [scatter](https://mui.com/x/react-charts/scatter/) charts, with basic customization features. Check out the [documentation](https://mui.com/x/react-charts/) to see what it can do, and open issues to get the feature you need implemented.

- 🚀 Introducing UTC and timezone support for pickers.

  <img width="774" src="https://github.com/mui/mui-x/assets/3165635/ad95a404-ee67-4aff-b996-ad6cbb322348">

  Visit the [documentation](https://mui.com/x/react-date-pickers/timezone/) to learn how to use it.

- 🌍 Improve Brazilian Portuguese (pt-BR) on the data grid
- 🌍 Improve Czech (cs-CZ) locale on the pickers
- 🚅 Performance improvements
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.9.0`

- [DataGrid] Filtering performance: use unmemoized selectors by default (#9287) @romgrk
- [DataGrid] Use container dimensions from `getComputedStyle` (#9236) @m4theushw
- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#9404) @julioAz

#### `@mui/x-data-grid-pro@6.9.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.9.0`.

#### `@mui/x-data-grid-premium@6.9.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.9.0`.

### Date Pickers

#### `@mui/x-date-pickers@6.9.0`

- [fields] Ensure `minutesStep` is respected by fields arrows up/down (#9338) @alexfauquette
- [fields] Reset internal state when `referenceValue` changes (#9390) @adrianmxb
- [l10n] Improve Czech (cs-CZ) locale (#9397) @radimkafka
- [pickers] Add proper support for UTC and timezones (#8261) @flaviendelangle
- [pickers] Fix field section selection on `DateTimePicker` (#9342) @LukasTy
- [pickers] Reduce date range calendar vertical border width (#9368) @oliviertassinari
- [pickers] Reset fields internal state when pasting value (#9385) @alexfauquette

#### `@mui/x-date-pickers-pro@6.9.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.9.0`.

### Charts / `@mui/x-charts@6.0.0-alpha.0`

- [charts] Allow to customize colors based on the theme mode (#9006) @alexfauquette
- [charts] Prepare the charts release (#9361) @alexfauquette
- [charts] Various improvements of charts docs (#9341) @alexfauquette

### Docs

- [docs] Add examples of using different time view renderers (#9360) @LukasTy
- [docs] Add recipe for single-click editing (#8365) @m4theushw
- [docs] Fix Base UI references (#9349) @oliviertassinari
- [docs] Fix random screenshot generation (#9364) @cherniavskii
- [docs] Remove random generation from chart doc example (#9343) @flaviendelangle
- [docs] Sync h1 with sidenav link (#9252) @oliviertassinari
- [docs] Use the mui-x Stack Overflow tag (#9352) @oliviertassinari

### Core

- [core] Add PR template and update the contributions guide (#9329) @DanailH
- [core] Bump monorepo (#9420) @LukasTy
- [core] Fix file typo (#9421) @DanailH
- [core] Fix proptypes (#9396) @LukasTy
- [core] Move old release notes in `CHANGELOG.old.md` (#9269) @flaviendelangle
- [core] Add priority support issue template (#8928) @DanailH

## 6.8.0

_Jun 16, 2023_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Greek (el-GR) locale on Pickers and improve on Data Grid
- 🚅 Performance improvements
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.8.0`

- [DataGrid] Add missing styles to `overridesResolver` (#9248) @mrmuhammadali
- [DataGrid] Keep column header menu icon always visible on touch devices (#9076) @cherniavskii
- [DataGrid] Correct the type for single digit edited number value (#9282) @MBilalShafi
- [DataGrid] Correct the type for single digit edited number for row edit (#9348) @MBilalShafi
- [DataGrid] Filtering performance: cache values (#9284) @romgrk
- [DataGrid] Fix tabbing between `actions` cells in edit mode (#9321) @md250721
- [DataGrid] Make autocompletion work for `GridColDef['type']` (#9320) @cherniavskii
- [DataGrid] Polish shortcut logic (#9220) @oliviertassinari
- [DataGrid] Row reordering fix for different row heights (#7006) @yaredtsy
- [DataGrid] Scroll performance improvements (#9037) @romgrk
- [l10n] Improve Greek (el-GR) locale (#9292) @clytras

#### `@mui/x-data-grid-pro@6.8.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.8.0`.

#### `@mui/x-data-grid-premium@6.8.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.8.0`.

### Date Pickers

#### `@mui/x-date-pickers@6.8.0`

- [l10n] Add Greek (el-GR) locale (#9293) @clytras
- [pickers] Add a `referenceDate` prop on `DateCalendar`, `MonthCalendar` and `YearCalendar` (#9260) @flaviendelangle
- [pickers] Close the calendar when a shortcut is selected (#9080) @flaviendelangle
- [pickers] Fix disabling for digital clock (#9300) @alexfauquette

#### `@mui/x-date-pickers-pro@6.8.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.8.0`.

### Docs

- [docs] Add header filters to the popular features demo (#9069) @MBilalShafi
- [docs] Fix `Date Calendar` dynamic data demo (#9290) @benzler
- [docs] Fix Data Grid header filter link (#9225) @oliviertassinari
- [docs] Fix missing docs version warning (#9221) @oliviertassinari
- [docs] Improve Chart overview (#9333) @oliviertassinari
- [docs] Improve Next.js license installation guide (#8975) @oliviertassinari
- [docs] Link pagination documentation to the migration guide (#9296) @MBilalShafi
- [docs] One step toward components -> slots (#9251) @oliviertassinari
- [docs] Improve and reorganize sections on editing page (#8431) @joserodolfofreitas
- [docs] Add clipboard paste to popular features demo (#9029) @cherniavskii

### Core

- [core] Polish event name (#9336) @oliviertassinari
- [core] Re-enable `Argos` CI step (#9301) @LukasTy
- [core] Upgrade Node.js to v18 on CircleCI, CodeSandbox and Netlify (#9319) @ZeeshanTamboli
- [core] Upgrade Node.js v18 for l10n GitHub CI (#9355) @ZeeshanTamboli
- [charts] Add demonstration pages based on Recharts demo (#9175) @alexfauquette
- [charts] Add legend (#9024) @alexfauquette
- [charts] Complete the docs to introduce charts (#9153) @alexfauquette
- [charts] Manage elements highlights (#9242) @alexfauquette
- [charts] Prefix subcomponents with `Charts` (#9314) @alexfauquette
- [license] Improve annual license expiration message (#9135) @oliviertassinari

## 6.7.0

_Jun 9, 2023_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Improve the default `format` prop value on the pickers.

  Here are a few examples:

  ```tsx
  <TimePicker views={['hours', 'minutes', 'seconds']} ampm />
  // Format before v6.7.0: `hh:mm aa`
  // Format after v6.7.0: `hh:mm:ss aa`

  <DatePicker views={['year']} />
  // Format before v6.7.0: `MM/DD/YYYY`
  // Format after v6.7.0: `YYYY`

  <DateTimePicker views={['day', 'hours', 'minutes']} ampm />
  // Format before v6.7.0: `MM/DD/YYYY hh:mm aa`
  // Format after v6.7.0: `DD hh:mm aa`
  ```

- 🌍 Add Romanian (ro-RO) locale on the pickers
- 🌍 Improve German (de-DE) locale on the pickers
- 🌍 Improve Czech (cs-CZ), German (de-DE) and Turkish (tr-TR) locales on the data grid
- 🚀 Performance improvements
- 🐞 Bugfixes
- 📚 Documentation improvements

### Data Grid

#### `@mui/x-data-grid@6.7.0`

- [DataGrid] Allow overflowing grid root element (#9179) @cherniavskii
- [DataGrid] Fix module augmentation error when using `@mui/lab` (#9235) @cherniavskii
- [DataGrid] Fix row with ids matching `Object` prototype (#9265) @romgrk
- [DataGrid] Fix `sortModel` and `filterModel` resetting when columns change (#9239) @alexgonch
- [DataGrid] Improve grouping performance for large datasets (#9200) @romgrk
- [DataGrid] Increase threshold to trigger memory leak warning (#9263) @m4theushw
- [DataGrid] Update data grid migration guide to include updated type (#9272) @MBilalShafi
- [l10n] Improve Czech (cs-CZ) locale (#9266) @MartinSkarpa
- [l10n] Improve German (de-DE) locale (#9259) @ximex
- [l10n] Improve Turkish (tr-TR) locale (#9237) @MCErtan

#### `@mui/x-data-grid-pro@6.7.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@6.7.0`, plus:

- [DataGridPro] Improve header filter menu visuals (#9181) @MBilalShafi

#### `@mui/x-data-grid-premium@6.7.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@6.7.0`, plus:

- [DataGridPremium] Remove last line break on clipboard paste (#9163) @cherniavskii

### Pickers

#### `@mui/x-date-pickers@6.7.0`

- [l10n] Add Romanian (ro-RO) locale (#9257) @ximex
- [l10n] Improve German (de-DE) locale (#9258) @ximex
- [pickers] Apply dynamic default format depending on views for all desktop and mobile pickers (#9126) @flaviendelangle

#### `@mui/x-date-pickers-pro@6.7.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@6.7.0`, plus:

- [pickers] Update `DateRangePickerDay` props JSDoc (#9191) @stevus

### Docs

- [docs] Fix missing props on the `GridFilterPanel` API page (#9180) @cherniavskii
- [docs] Fix overview page typo (#9230) @LukasTy
- [docs] Fix version redirect (#9273) @alexfauquette

### Core

- [core] Temporarily remove the Argos upload on the regression testing (#9267) @flaviendelangle
- [charts] Add clip-path to avoid charts overflow (#9012) @alexfauquette
- [charts] Add style customization on bar (#8935) @alexfauquette
- [charts] Enforce axis `min`/`max` over the `nice()` method (#9189) @alexfauquette
- [charts] Improve axis label and ticks label alignements (#9190) @alexfauquette
- [charts] Simplify the switch between responsive and fix dimensions (#9151) @alexfauquette

## 6.6.0

_Jun 1, 2023_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🚀 New date time picking UI on [`DesktopDateTimePicker`](https://mui.com/x/react-date-pickers/date-time-picker/)

  <img src="https://github.com/mui/mui-x/assets/3165635/4e1fe9f9-03eb-4f23-99dd-80212b21fb23" width="840" height="506" />

- 🚀 Performance improvements
- 🐞 Bugfixes
- 📚 Documentation improvements
- 🌍 Improve Dutch (nl-NL) and French (fr-FR) locales on the data grid
- 🌍 Add Vietnamese (vi-VN) locale on the pickers

### `@mui/x-data-grid@6.6.0` / `@mui/x-data-grid-pro@6.6.0` / `@mui/x-data-grid-premium@6.6.0`

#### Changes

- [DataGrid] Support data attributes (#8845) @romgrk
- [DataGrid] Avoid allocations in `hydrateRowsMeta` (#9121) @romgrk
- [DataGrid] Fix filter input select accessibility (#9018) @Jul13nT
- [DataGrid] Fix accessibility issues in panels and toolbar buttons (#8862) @romgrk
- [DataGrid] Fix `onCellEditStop` not invoked (#8857) @romgrk
- [DataGridPro] Fix auto-scroll when reordering columns (#8856) @m4theushw
- [DataGridPro] Fix row ID type casting in detail panels lookup (#8976) @minchaej
- [DataGridPro] Emit `columnWidthChange` event on `touchEnd` of column resize (#8669) @MBilalShafi
- [DataGridPro] Do not apply filters on `rowExpansionChange` (#8671) @cherniavskii
- [DataGridPro] Prevent click event on sorting after a resize (#9117) @romgrk
- [DataGridPremium] Improve Excel export interface (#9128) @TiagoPortfolio
- [l10n] Improve Dutch (nl-NL) locale (#9043) @thedutchruben
- [l10n] Improve French (fr-FR) locale (#9109) @Jul13nT

### `@mui/x-date-pickers@6.6.0` / `@mui/x-date-pickers-pro@6.6.0`

#### Changes

- [fields] Allow to explicitly define the reference value and improve its default value (#9019) @flaviendelangle
- [l10n] Add Vietnamese (vi-VN) locale (#9099) @nhannt201
- [pickers] Add `DigitalClock` to `DesktopDateTimePicker` (#8946) @LukasTy
- [pickers] Add support for timezones on the adapters (#9068) @flaviendelangle
- [pickers] Fix `MonthCalendar` and `YearCalendar` disabled validation (#9149) @LukasTy
- [pickers] Fix bug when fields have a unique section (#9110) @alexfauquette
- [pickers] Fix focus jumping on Safari (#9072) @LukasTy
- [pickers] Use the locale start of the week in `getWeekArray` (#9176) @flaviendelangle

### Docs

- [docs] Add single input range picker demo (#9159) @LukasTy
- [docs] Align `DateCalendar` demo views with labels (#9152) @LukasTy
- [docs] Clarify the peer dependency with React (#9067) @oliviertassinari
- [docs] Fix Norwegian locale typo (#9168) @LukasTy
- [docs] Fix column menu item demo (#9071) @MBilalShafi
- [docs] Improve localization table progress bars (#9033) @noraleonte
- [docs] Smooth performance animation (#8986) @oliviertassinari
- [docs] Use responsive time and date time pickers and the views sections (#9127) @flaviendelangle
- [docs] Reduce layout shift in grid demo (#9132) @oliviertassinari
- [docs] Fix tree data children lazy-loading demo (#8840) @yaredtsy
- [docs] Improve filtering docs discoverability (#9074) @MBilalShafi

### Core

- [core] Allow string literals as keys in `localesText` (#9045) @MBilalShafi
- [core] Fix `randomInt` producing values exceeding `max` value (#9086) @cherniavskii
- [core] Fix flaky test on `dateWithTimezone` adapter test (#9129) @flaviendelangle
- [core] Lock `@types/node` on v18 (#9107) @LukasTy
- [core] Remove `cross-fetch` dependency (#9108) @LukasTy
- [core] Remove `createDetectElementResize()` replaced with `ResizeObserver` (#9015) @oliviertassinari
- [core] Upgrade monorepo (#9027) @m4theushw
- [core] Upgrade monorepo (#9106) @LukasTy
- [charts] Fix proptypes (#9125) @LukasTy
- [charts] Generate the charts proptypes (#9010) @alexfauquette
- [charts] Manage series stacking (#8888) @alexfauquette
- [license] List side effects in the license package (#9092) @cherniavskii

## 6.5.0

_May 19, 2023_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 💫 Introduce filtering on column headers for `DataGridPro` and `DataGridPremium`:

  <img src="https://github.com/mui/mui-x/releases/download/v6.5.0/recording.gif" width="840" height="506" />

  See [the documentation](https://mui.com/x/react-data-grid/filtering/header-filters/) for more information

- 🌍 Improve Hebrew (he-IL) and Czech (cs-CZ) locales
- 📝 Support for editing on pinned rows
- 🚀 Performance improvements
- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.5.0` / `@mui/x-data-grid-pro@6.5.0` / `@mui/x-data-grid-premium@6.5.0`

#### Changes

- [DataGrid] Fix grid size calculation when `.MuiDataGrid-main` has border (#8882) @cherniavskii
- [DataGridPro] Filtering on Column Header (#7760) @MBilalShafi
- [DataGridPro] Improve `treeData` and `rowGrouping` performance (#8990) @MBilalShafi
- [DataGridPro] Support pinned rows editing (#8921) @cherniavskii
- [l10n] Improve Hebrew (he-IL) locale (#8943) @Itzik-Tech
- [l10n] Improve Czech (cs-CZ) locale (#8829) @harastaivan
- [l10n] Improve Czech (cs-CZ) locale (#8956) @davidzemancz

### `@mui/x-date-pickers@6.5.0` / `@mui/x-date-pickers-pro@6.5.0`

#### Changes

- [fields] Select the first section instead of last when clicking right of content (#9005) @noraleonte
- [fields] Refactor prop drilling in fields (#8660) @flaviendelangle
- [pickers] Allow to render the months before `currentMonth` instead of the one after (#8592) @flaviendelangle
- [pickers] Fix view management when `openTo` or `views` is modified (#8997) @alexfauquette
- [l10n] Improve Czech (cs-CZ) locale (#8829) @harastaivan

### Docs

- [docs] Clarify what Controlled / Uncontrolled means (#8926) @flaviendelangle
- [docs] Fix docs using wrong service worker (#9030) @cherniavskii
- [docs] Remove prop-types from JS demos (#9008) @flaviendelangle

### Core

- [core] Add assertion about checkbox rerenders (#8974) @oliviertassinari
- [core] Allow selecting a section by type in field tests (#9009) @flaviendelangle
- [core] Fix `yarn.lock` (#8988) @flaviendelangle
- [core] Fix flacky adapter test (#8995) @flaviendelangle
- [charts] Clean the axis rendering (#8948) @alexfauquette
- [DataGrid] Memoize root props for better performance (#8942) @romgrk
- [test] Skip flaky unit tests in JSDOM (#8994) @cherniavskii

## 6.4.0

_May 12, 2023_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce clipboard paste support for `DataGridPremium`:

  https://github.com/mui/mui-x/assets/13808724/abfcb5c6-9db6-4677-9ba7-ae97de441080

  See [the documentation](https://mui.com/x/react-data-grid/clipboard/#clipboard-paste) for more information

- 🌍 Improve French (fr-FR), German (de-DE), Portuguese (pt-BR) and Ukrainian (uk-UA) locales on the data grid
- 🌍 Add Slovak (sk-SK) locale on the pickers
- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.4.0` / `@mui/x-data-grid-pro@6.4.0` / `@mui/x-data-grid-premium@6.4.0`

#### Changes

- [DataGrid] Fix DataGrid rendering in JSDOM (#8968) @cherniavskii
- [DataGrid] Fix layout when rendered inside a parent with `display: grid` (#8577) @cherniavskii
- [DataGrid] Add Joy UI icon slots (#8940) @siriwatknp
- [DataGrid] Add Joy UI pagination slot (#8871) @cherniavskii
- [DataGrid] Extract `baseChip` slot (#8748) @cherniavskii
- [DataGridPremium] Implement Clipboard import (#7389) @cherniavskii
- [l10n] Improve French (fr-FR) locale (#8825) @allereaugabriel
- [l10n] Improve German (de-DE) locale (#8898) @marcauberer
- [l10n] Improve Portuguese (pt-BR) locale (#8960) @Sorriso337
- [l10n] Improve Ukrainian (uk-UA) locale (#8863) @Neonin

### `@mui/x-date-pickers@6.4.0` / `@mui/x-date-pickers-pro@6.4.0`

#### Changes

- [pickers] Fix trailing zeros inconsistency in `LuxonAdapter` (#8955) @alexfauquette
- [pickers] Stop using deprecated adapter methods (#8735) @flaviendelangle
- [pickers] Strictly type the `adapterLocale` prop of `LocalizationProvider` (#8780) @flaviendelangle
- [l10n] Add Slovak (sk-SK) locale (#8875) @MatejFacko

### Docs

- [docs] Fix date pickers typo in the docs (#8939) @richbustos
- [docs] Fix master detail demo (#8894) @m4theushw
- [docs] Fix typo in clipboard docs (#8971) @MBilalShafi
- [docs] Reduce list of dependencies in Codesandbox/Stackblitz demos (#8535) @cherniavskii

### Core

- [core] Improve testing of the adapters (#8789) @flaviendelangle
- [core] Update license key for tests (#8917) @LukasTy
- [charts] Make introduction docs pages for each chart (#8869) @alexfauquette
- [charts] Document Tooltip and Highlighs (#8867) @alexfauquette
- [test] Cover row grouping regression with a unit test (#8870) @cherniavskii
- [test] Fix flaky regression tests (#8954) @cherniavskii

## 6.3.1

_May 5, 2023_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.3.1` / `@mui/x-data-grid-pro@6.3.1` / `@mui/x-data-grid-premium@6.3.1`

#### Changes

- [DataGrid] Fix broken filtering in the value formatter demo (#8621) @cherniavskii
- [DataGrid] Fix falsy filter values not showing in filter button tooltip (#8550) @ithrforu
- [DataGrid] Fix missing watermark in Pro and Premium packages (#8797) @cherniavskii
- [DataGrid] Remove unwarranted warning log (#8847) @romgrk
- [DataGrid] Add Joy UI slots (`Select`, `SelectOption`, `InputLabel`, `FormControl`) (#8747) @cherniavskii
- [DataGridPremium] Fix expanded groups being collapsed after calling `updateRows` (#8823) @cherniavskii

### `@mui/x-date-pickers@6.3.1` / `@mui/x-date-pickers-pro@6.3.1`

#### Changes

- [pickers] Fix `minutesStep` validation prop behavior (#8794) @LukasTy
- [pickers] Fix time picker `viewRenderers` overriding (#8830) @LukasTy
- [pickers] Remove last additional character when using LTR (#8848) @alexfauquette

### Docs

- [docs] Fix controlled mode demo on Editing page (#8800) @yaredtsy
- [docs] Fix scrolling demo not working with React 18 (#6489) @cherniavskii
- [docs] Update demo to support agregation on popular feature cell (#8617) @BalaM314
- [docs] Clarify what `<path>` is (#8764) @alexfauquette

### Core

- [core] Do not include playground pages in `yarn typescript` script (#8822) @cherniavskii
- [core] Limit `typescript:ci` step memory limit (#8796) @LukasTy
- [core] Upgrade monorepo (#8835) @cherniavskii
- [test] Use `fake` clock on `MobileDateRangePicker` (#8861) @LukasTy
- [charts] Clean some styling (#8778) @alexfauquette
- [charts] Improve tooltip (#8792) @alexfauquette
- [charts] Improvement and docs on axis (#8654) @alexfauquette
- [charts] Defaultize attributes (#8788) @alexfauquette

## 6.3.0

_Apr 28, 2023_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🚀 New [time-picking UI](https://mui.com/x/react-date-pickers/digital-clock/) designed for desktops (#7958) @LukasTy

  <img src="https://user-images.githubusercontent.com/4941090/235072007-de39a397-e4a4-4c98-8e10-5ee4ad440108.gif" width="494" />

- ✨ Picker fields [now always include a leading zero](https://mui.com/x/react-date-pickers/adapters-locale/#respect-leading-zeros-in-fields) on digit sections (#8527) @flaviendelangle
- 🌍 Improve Chinese (zh-CN), French (fr-FR), and Turkish (tr-TR) locales
- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.3.0` / `@mui/x-data-grid-pro@6.3.0` / `@mui/x-data-grid-premium@6.3.0`

#### Changes

- [DataGrid] Add overlay classes to `gridClasses` (#8686) @lindapaiste
- [DataGrid] Avoid passing `api` prop to div (#8679) @someden
- [DataGrid] Fix 'ResizeObserver loop limit exceeded' error (#8744) @m4theushw
- [DataGrid] Add Joy UI slots (button and switch) (#8699) @siriwatknp
- [DataGrid] Fix aggregation label alignment (#8694) @joserodolfofreitas
- [DataGridPremium] Fix infinite loop when updating grouped rows (#8693) @cherniavskii
- [DataGridPro] Fix error after updating `columns` and `columnGroupingModel` at once (#8730) @cherniavskii
- [l10n] Improve Chinese (zh-CN) locale (#8753) @SakumyZ
- [l10n] Improve French (fr-FR) locale (#8704) @Jul13nT
- [l10n] Improve Turkish (tr-TR) locale (#8783) @cccaaannn

### `@mui/x-date-pickers@6.3.0` / `@mui/x-date-pickers-pro@6.3.0`

#### Changes

- [fields] Always add leading zeroes on digit sections (#8527) @flaviendelangle
- [fields] Pass the `readOnly` prop to `InputProps` instead of `inputProps` (#8659) @flaviendelangle
- [pickers] Add missing export for `caES` locale (#8782) @flaviendelangle
- [pickers] Add new `DigitalClock` desktop time picking experience (#7958) @LukasTy
- [pickers] Do not use `instanceOf DateTime` in `AdapterLuxon` (#8734) @flaviendelangle
- [pickers] Fix date calendar `selected` & `disabled` day style (#8773) @LukasTy
- [pickers] Migrate `AdapterDateFns` to our repository (#8736) @flaviendelangle
- [pickers] Migrate `AdapterLuxon` to our repository (#8600) @flaviendelangle
- [pickers] Migrate `AdapterMomentHijri` to our repository (#8776) @flaviendelangle
- [pickers] Migrate `AdapterMomentJalaali` and `AdapterDateFnsJalali` to our repository (#8741) @flaviendelangle
- [pickers] Migrate `AdapterMoment` to our repository (#8700) @flaviendelangle
- [pickers] Refactor the validation files (#8622) @flaviendelangle
- [pickers] Use `en dash` instead of `em dash` in multi input range fields (#8738) @flaviendelangle
- [l10n] Improve Chinese (zh-CN) locale (#8753) @SakumyZ
- [l10n] Improve Turkish (tr-TR) locale (#8783) @cccaaannn

### Docs

- [docs] Add icons for charts menu (#8752) @alexfauquette
- [docs] Document the supported formats (#8746) @flaviendelangle
- [docs] Fix Hijri demo (#8698) @alexfauquette
- [docs] Fix `x-codemod` package version in changelog (#8690) @MBilalShafi
- [docs] Fix columns special properties code example (#8414) @mikkelhl
- [docs] Fix error in `minDateTime` `validation` page section (#8777) @LukasTy
- [docs] Update custom field pickers using theme scoping (#8609) @siriwatknp
- [docs] Use community version of data grid for column grouping demo (#7346) @ASchwad
- [docs] Use new `slots` / `slotProps` props in the pickers migration guide (#8341) @flaviendelangle

### Core

- [core] Cleanup picker tests (#8652) @flaviendelangle
- [core] Use `adapter.lib` instead of `adapterName` in `describeAdapters` (#8779) @flaviendelangle
- [charts] Adapt line and scatter plot to the "band" scale type (#8701) @alexfauquette
- [charts] Link the Gantt Charts issue in the docs (#8739) @flaviendelangle

## 6.2.1

_Apr 20, 2023_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Add virtualization to row detail panels (#7969) @yaredtsy
- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.2.1` / `@mui/x-data-grid-pro@6.2.1` / `@mui/x-data-grid-premium@6.2.1`

#### Changes

- [DataGrid] Add `getTogglableColumns` to `Hide all` and `Show all` actions (#8496) @MBilalShafi
- [DataGrid] Add Grid + Joy UI experiment page (#8067) @cherniavskii
- [DataGrid] Fix print style when rendering inside Shadow DOM (#8656) @Bwatermelon
- [DataGrid] Replace `GridAutoSizer` with `ResizeObserver` (#8091) @m4theushw
- [DataGrid] Use stable ID for the placeholder filter item (#8603) @m4theushw
- [DataGridPro] Virtualize row detail panels (#7969) @yaredtsy

### `@mui/x-date-pickers@6.2.1` / `@mui/x-date-pickers-pro@6.2.1`

#### Changes

- [pickers] Do not include the time in date components when going to today (#8657) @flaviendelangle
- [pickers] Sync internal state with controlled value (#8674) @alexfauquette

### `@mui/x-codemod@6.2.1`

#### Changes

- [codemod] Avoid filter failures on object prototype properties (#8647) @LukasTy

### Docs

- [docs] Add no-op service worker to fix stale cache issue (#8598) @cherniavskii
- [docs] Clarify what `AdapterDayjs` is in the Getting Started page (#8219) @flaviendelangle
- [docs] Fix typo on picker page description (#8611) @maxolasersquad
- [docs] Improve section title in Getting Started page (#8648) @flaviendelangle
- [docs] Inform about input format modification (#8458) @alexfauquette

### Core

- [core] Fix release date (#8618) @flaviendelangle
- [core] Upgrade monorepo (#8668) @MBilalShafi
- [charts] Support Tooltip (#8356) @alexfauquette

## 6.2.0

_Apr 14, 2023_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- Add `@mui/base` as a `peerDependency` of `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` (#8590) @LukasTy

  Both libraries were not working correctly if used without `@mui/base`.
  Most package manager should automatically use the `@mui/base` version installed for `@mui/material`.

- The value rendered in the picker or field input no longer has spaces around the `/` characters (#8425) @flaviendelangle

  You can use the `formatDensity='spacious'` prop to add it back.
  More information on [the dedicated doc section](https://mui.com/x/react-date-pickers/custom-field/#change-the-format-density)

- 🌍 Improve French (fr-FR) and Urdu (ur-PK) and locales.
- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.2.0` / `@mui/x-data-grid-pro@6.2.0` / `@mui/x-data-grid-premium@6.2.0`

#### Changes

- [DataGrid] Reset selection state on `checkboxSelection` toggle (#8522) @MBilalShafi
- [DataGrid] Use `baseSelect` slot instead of `baseTextField` with `select={true}` (#8110) @cherniavskii
- [l10n] Improve French (fr-FR) locale (#8537) @allereaugabriel
- [l10n] Improve Urdu (ur-PK) locale (#8513) @SFARPak

### `@mui/x-date-pickers@6.2.0` / `@mui/x-date-pickers-pro@6.2.0`

#### Changes

- [DateTimePicker] Fix `TimeClock` validation ignoring date by default (#8570) @LukasTy
- [fields] Fix reliance on section order (#8545) @LukasTy
- [fields] Make the space between format separators controllable (#8425) @flaviendelangle
- [pickers] Add `@mui/base` to `peerDependencies` (#8590) @LukasTy
- [pickers] Fix JSDoc for `formatDensity` prop (#8601) @flaviendelangle
- [pickers] Improve value lifecycle on non-controlled pickers (#8312) @flaviendelangle
- [pickers] Migrate `AdapterDayjs` to our repository (#8487) @flaviendelangle

### Docs

- [docs] Fix "Custom day rendering" demo alignment (#8541) @LukasTy
- [docs] Fix **below** typo (#8576) @alexfauquette

### Core

- [core] Optimize `renovate` rules (#8575) @LukasTy
- [core] Upgrade monorepo (#8578) @cherniavskii
- [core] Update last release date (#8569) @DanailH

## 6.1.0

_Apr 10, 2023_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Catalan (ca-ES), Kazakh (kz-KZ) and improve Spanish (es-ES), Dutch (nl-NL), Hebrew (he-IL), Hungarian (hu-HU), Japanese (ja-JP), Portuguese (pt-BR), and Russian (ru-RU) locales
- ✨ Allow to control visibility of columns shown in the columns panel (#8401) @MBilalShafi
- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.1.0` / `@mui/x-data-grid-pro@6.1.0` / `@mui/x-data-grid-premium@6.1.0`

#### Changes

- [DataGrid] Allow to control visibility of columns shown in the `ColumnsPanel` component (#8401) @MBilalShafi
- [DataGrid] Fix filters with empty array value not being removed from the filter model (#8501) @cherniavskii
- [DataGrid] Fix memory leaks in development (#8301) @cherniavskii
- [DataGrid] Sync `date` column value when entering edit mode by pressing a digit (#8364) @m4theushw
- [DataGrid] Wrap column menu button with a tooltip (#7890) @cherniavskii
- [l10n] Improve Dutch (nl-NL) locale (#8491) @thedutchruben
- [l10n] Improve Hungarian (hu-HU) locale (#8486) @PetakCC
- [l10n] Improve Japanese (ja-JP) locale (#8462) @megos
- [l10n] Improve Portuguese (pt-BR) locale (#8480) @pwnedev
- [l10n] Improve Russian (ru-RU) locale (#8510) @alexrapro

### `@mui/x-date-pickers@6.1.0` / `@mui/x-date-pickers-pro@6.1.0`

#### Changes

- [fields] Fix RTL navigation (#8490) @alexfauquette
- [fields] Fix usage of `slotProps.textField.InputProps` (#8428) @flaviendelangle
- [pickers] Fix `componentsProps.dialog` propagation (#8509) @LukasTy
- [pickers] Move `hasError` from `fieldValueManager` to `valueManager` (#8453) @flaviendelangle
- [pickers] Move the adapters interfaces to the X repository (#8412) @flaviendelangle
- [pickers] Update peer dependency versions (#8531) @LukasTy
- [pickers] Fix `isValid` regression (#8543) @LukasTy
- [l10n] Add Catalan (Spain) (ca-ES) and improve Spanish (es-ES) locales (#8498) @makenshikuro
- [l10n] Add Kazakh (kz-KZ) locale (#8451) @zhunus
- [l10n] Improve Dutch (nl-NL) locale (#8491) @thedutchruben
- [l10n] Improve Hebrew (he-IL) locale (#8464) @soris1989
- [l10n] Improve Japanese (ja-JP) locale (#8462) @megos
- [l10n] Improve Portuguese (pt-BR) locale (#8480) @pwnedev

### Docs

- [docs] Fix 301 redirect (#8524) @alexfauquette
- [docs] Fix 404 links (#8454) @alexfauquette
- [docs] Fix broken API reference link (#8460) @oliviertassinari

### Core

- [core] Avoid 301 links (#8383) @oliviertassinari
- [core] Fix the l10n helper by using danger instead of actions (#8512) @alexfauquette
- [core] Help contributors for l10n PRs (#8503) @alexfauquette
- [core] Remove legacy token (#8457) @oliviertassinari
- [charts] Add a styling system (#8445) @alexfauquette

## 6.0.4

_Mar 30, 2023_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Danish (da-DK), and improve Norwegian (nb-NO), Spanish (es-ES), and Swedish (sv-SE) locales
- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.0.4` / `@mui/x-data-grid-pro@6.0.4` / `@mui/x-data-grid-premium@6.0.4`

#### Changes

- [DataGrid] Fix column header tooltip not showing when the title is truncated (#8433) @rohitnatesh
- [DataGrid] Fix filter model buttons' display condition (#8415) @MBilalShafi
- [DataGrid] Fix infinite rerender in a flex parent (#8436) @cherniavskii
- [DataGrid] Prevent reopening column menu when clicking in the button while it is open (#8286) @tanuj-22
- [DataGrid] Rename `components` by `slots` in column menu API (#7999) @MBilalShafi
- [DataGrid] Remove hardcoded CSS classes' usages (#8444) @MBilalShafi
- [DataGridPremium] Fix aggregation initial state causing issue with quick filter (#8441) @MBilalShafi
- [l10n] Improve Danish (da-DK) locale (#8368) @BossElijah
- [l10n] Improve Danish (da-DK) locale (#8378) @BossElijah
- [l10n] Improve Norwegian (nb-NO) locale (#8367) @BossElijah
- [l10n] Improve Norwegian (nb-NO) locale (#8409) @BossElijah
- [l10n] Improve Spanish (es-ES) locale (#8420) @martjanz
- [l10n] Improve Swedish (sv-SE) locale (#8381) @BossElijah

### `@mui/x-date-pickers@6.0.4` / `@mui/x-date-pickers-pro@6.0.4`

#### Changes

- [fields] Add missing tokens to `AdapterDateFnsJalali` (#8402) @flaviendelangle
- [fields] Clean the active date manager (#8370) @flaviendelangle
- [fields] Cleanup `useFieldState` (#8292) @flaviendelangle
- [fields] Only add RTL characters when needed (#8325) @flaviendelangle
- [pickers] Add support for single input fields in range pickers (#7927) @flaviendelangle
- [pickers] Allows non token characters in format (#8256) @alexfauquette
- [pickers] Avoid root imports and move public models to the models folder (#8337) @flaviendelangle
- [pickers] Update `view` when `views` or `openTo` changes (#8361) @LukasTy
- [l10n] Improve Norwegian (nb-NO) locale (#8382) @BossElijah
- [l10n] Add Danish (da-DK) locale (#8379) @BossElijah
- [l10n] Improve Swedish (sv-SE) locale (#8381) @BossElijah

### `@mui/x-codemod@6.0.4`

#### Changes

- [codemod] Fix `remove-stabilized-experimentalFeatures` codemod (#8289) @alexfauquette

### Docs

- [docs] Fix `GridCellParams` signature in migration guide (#8427) @cherniavskii
- [docs] Fix "Custom field" demos responsive styles (#8408) @LukasTy
- [docs] Remove `label` from demos where it reduces clarity (#8416) @LukasTy
- [docs] Update slots' references in Data Grid migration guide (#8159) @MBilalShafi

### Core

- [charts] Work on typing (#8421) @flaviendelangle

## 6.0.3

_Mar 23, 2023_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Bulgarian (bg-BG), Persian (fa-IR), Polish (pl-PL), and Dutch (nl-NL) locales
- 🐞 Bugfixes
- 📚 Documentation improvements

### `@mui/x-data-grid@6.0.3` / `@mui/x-data-grid-pro@6.0.3` / `@mui/x-data-grid-premium@6.0.3`

#### Changes

- [DataGrid] Fix overflow calculation issue in column group headers (#8246) @MBilalShafi
- [DataGridPro] Fix column reorder glitches (#8335) @cherniavskii
- [l10n] Improve Bulgarian (bg-BG) locale (#8315) @todevmilen
- [l10n] Improve Persian (fa-IR) locale (#8268) @fakhamatia
- [l10n] improve Dutch (nl-NL) locale (#8317) @developenguin

### `@mui/x-date-pickers@6.0.3` / `@mui/x-date-pickers-pro@6.0.3`

#### Changes

- [fields] Allow to reset the value from the outside (#8287) @flaviendelangle
- [fields] Cleanup section order generation (#8290) @flaviendelangle
- [fields] Fix Safari input selection resetting regression (#8295) @LukasTy
- [fields] Fix editing when all sections are selected (#8330) @flaviendelangle
- [fields] Fix iOS browser scroll jumping when entering data (#8328) @LukasTy
- [fields] New prop `unstableFieldRef` to imperatively interact with the selected sections (#8235) @flaviendelangle
- [pickers] Align date calendar colors (#8318) @LukasTy
- [pickers] Support invalid dates from the field (#8298) @flaviendelangle
- [l10n] Improve Persian (fa-IR) locale (#8268) @fakhamatia
- [l10n] Improve Polish (pl-PL) locale (#8344) @drmats
- [l10n] improve Dutch (nl-NL) locale (#8317) @developenguin

### Docs

- [docs] Create examples of pickers with custom fields (#8034) @flaviendelangle
- [docs] Fix 301 redirections @oliviertassinari
- [docs] Fix link to React's docs @oliviertassinari
- [docs] Fix pro license links to point to the same page (#8303) @LukasTy
- [docs] Give an incentive to upgrade (#8269) @oliviertassinari
- [docs] Improve contrast on data grid navigation (#8239) @oliviertassinari
- [docs] Update shortcuts page to use slotProps (#8288) @dcorb
- [docs] Explain the `shouldDisableTime` migration in more depth (#8348) @LukasTy

### Core

- [core] Remove unused `visx` chart package (#8259) @LukasTy
- [core] Upgrade monorepo (#8331) @cherniavskii
- [charts] Project setup (#8308) @alexfauquette
- [test] Track visual regressions of column menu and filter/column panels (#8095) @cherniavskii

## 6.0.2

_Mar 16, 2023_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Fire `onChange` when filling a partial date (#8082) @flaviendelangle
- 🎁 Support date format like `1st` (`do`) (#8188) @flaviendelangle
- 🌍 Add Hebrew (he-IL) locale (#8222) @ylarom
- 🌍 Improve Brazilian Portuguese (pt-BR), German (de-DE), and French (fr-FR) locales
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.2` / `@mui/x-data-grid-pro@6.0.2` / `@mui/x-data-grid-premium@6.0.2`

#### Changes

- [DataGrid] Fix <kbd>Space</kbd> triggering edit mode (#8180) @m4theushw
- [DataGrid] Remove warning when adding a custom column type (#8227) @m4theushw
- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#8198) @JoaoSerafim3001

### `@mui/x-date-pickers@6.0.2` / `@mui/x-date-pickers-pro@6.0.2`

#### Changes

- [l10n] Add Hebrew (he-IL) locale (#8222) @ylarom
- [l10n] Improve German (de-DE) locale (#8204) @sebkasanzew
- [l10n] Improve French (fr-FR) locale (#8229) @marvinroger
- [DateRangePicker] Allow overriding `slotProps.textField` (#8201) @LukasTy
- [fields] Fire `onChange` when filling a partial date (#8082) @flaviendelangle
- [fields] Fix editing in shadow dom (#8254) @flaviendelangle
- [fields] Remove the duplicated warning about invalid adapter (#8187) @flaviendelangle
- [fields] Support date format like `1st` (`do`) (#8188) @flaviendelangle
- [pickers] Fix to avoid selecting sections on mobile picker field (#8228) @LukasTy
- [pickers] Inherit previous and next icons size from their parent button (#8218) @flaviendelangle

### Docs

- [docs] Add a warning in the migration guide for people re-enabling the clock on desktop (#8184) @flaviendelangle
- [docs] Add a warning for `luxon` macro tokens (#8245) @flaviendelangle
- [docs] Complete pickers customization pages (#8066) @alexfauquette
- [docs] Fix 301 redirection @oliviertassinari
- [docs] Fix 404 links to customization Material UI APIs (#8200) @oliviertassinari
- [docs] Fix `moment-hijri` demo (#8255) @LukasTy
- [docs] Improve migration diff (#8240) @oliviertassinari
- [docs] Change **What's new** page url to point to announcement blog post (#8186) @joserodolfofreitas
- [docs] Resolve 301 in changelog @oliviertassinari

### Core

- [core] Regen api docs (#8220) @flaviendelangle
- [core] Remove duplicated `/` (#8223) @alexfauquette

## 6.0.1

_Mar 9, 2023_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve French (fr-FR) locale (#8122) @MaherSamiGMC
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.1` / `@mui/x-data-grid-pro@6.0.1` / `@mui/x-data-grid-premium@6.0.1`

#### Changes

- [DataGrid] Fix `MenuProps.onClose` being overridden for single select edit component (#8174) @rohitnatesh
- [DataGrid] Simplify `buildPrintWindow` (#8142) @oliviertassinari
- [l10n] Improve French (fr-FR) locale (#8122) @MaherSamiGMC

### `@mui/x-date-pickers@6.0.1` / `@mui/x-date-pickers-pro@6.0.1`

#### Changes

- [pickers] Add a runtime warning when a `renderInput` prop is passed to a picker (#8183) @flaviendelangle
- [pickers] Don't pass `ownerState` to the `inputAdornment` slot (#8165) @flaviendelangle

### Docs

- [docs] Fix a typo in the migration guide (#8152) @flaviendelangle
- [docs] Fix package version used in CodeSandbox demos (#8125) @cherniavskii
- [docs] Fix typos across codebase (#8126) @stavares843
- [docs] Improve Data Grid quick filter documentation (#8109) @MBilalShafi
- [docs] Improve link from npm to docs (#8141) @oliviertassinari
- [docs] Remove test sections (#8177) @m4theushw

### Core

- [core] Upgrade monorepo (#8162) @m4theushw

## 6.0.0

_Mar 3, 2023_

We're excited to [announce the first v6 stable release](https://mui.com/blog/mui-x-v6/)! 🎉🚀

This is now the officially supported major version, where we'll keep rolling out new features, bug fixes, and improvements.
Migration guides are available with a complete list of the breaking changes:

- [Data Grid](https://mui.com/x/migration/migration-data-grid-v5/)
- [Date Pickers](https://mui.com/x/migration/migration-pickers-v5/)

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎁 The row pinning is no longer experimental (#8055) @MBilalShafi

  You can now use the row pinning without the `experimentalFeatures.rowPinning` flag enabled.

  ```diff
   <DataGridPro
  -  experimentalFeatures={{ rowPinning: true }}
   />
  ```

- ⚡️ Improved grid performance by rows and cells memoization (#7846) @m4theushw
- ✨ Fields have a distinct visual state when empty (#8069) @LukasTy
- 🌍 Improve Czech (cs-CZ) locale (#8113) @BlastyCZ
- 🌍 Improve Arabic (ar-SD) locale (#8100) @atf98
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0` / `@mui/x-data-grid-pro@6.0.0` / `@mui/x-data-grid-premium@6.0.0`

#### Breaking changes

- The `componentsProps` and `slotProps` props are now typed for better DX
- The `cellFocus`, `cellTabIndex` and `editRowsState` props are not passed to the component used in the row slot. You can use the new `focusedCell` and `tabbableCell` props instead. For the editing state, use the API methods.
  The flag `experimentalFeatures.rowPinning` is no longer needed.

#### Changes

- [DataGrid] Add typing for `componentsProps` (#7968) @MBilalShafi
- [DataGrid] Allow multiple modules' augmentation (#8098) @MBilalShafi
- [DataGrid] Extract `BaseInputLabel` slot (#8068) @cherniavskii
- [DataGrid] Extract `BaseSelectOption` slot (#8072) @cherniavskii
- [DataGrid] Make possible to memoize rows and cells (#7846) @m4theushw
- [DataGrid] Register `getLocaleText` synchronously (#8029) @m4theushw
- [DataGrid] Start extracting material slots to a separate directory (#8004) @cherniavskii
- [DataGrid] Use `styled` from system (#8032) @siriwatknp
- [DataGridPro] Improve typing for `getColumnForNewFilter` method (#8043) @MBilalShafi
- [DataGridPro] Remove row pinning from experimental features (#8055) @MBilalShafi
- [l10n] Improve Czech (cs-CZ) locale (#8113) @BlastyCZ
- [l10n] Improve Arabic (ar-SD) locale (#8100) @atf98

### `@mui/x-date-pickers@6.0.0` / `@mui/x-date-pickers-pro@6.0.0`

#### Breaking changes

On desktop, `DateTimePicker` shows the am/pm controls in the toolbar instead of the clock by default.
It can be overridden by specifying `ampmInClock` prop.

#### Changes

- [DateRangePicker] Generalize the highlight between months (#8079) @alexfauquette
- [fields] Clean the order of the tokens in the `formatTokenMap` of each adapter (#8112) @flaviendelangle
- [fields] Implement empty visual state (#8069) @LukasTy
- [fields] Replace `sectionOrder` state with a memoized variable (#8090) @flaviendelangle
- [pickers] Add support for UTC on `moment` adapter (#8031) @flaviendelangle
- [pickers] Document and deprecate `onClose` callback on static pickers (#8021) @LukasTy
- [pickers] Fix am/pm buttons position and responsiveness (#5149) @alexfauquette
- [pickers] Fix layout `sx` propagation (#8064) @alexfauquette
- [pickers] Increase `moment` peer dependency minimum version (#8046) @oliviertassinari
- [pickers] Remove `WrapperVariantContext` (#8088) @LukasTy
- [pickers] Stop using `WrapperVariantContext` in `Clock` (#8083) @LukasTy

### Docs

- [docs] Add `aggregation` experimental flag removal to the migration guide (#8056) @MBilalShafi
- [docs] Add expansion state behavioral change to v6 migration guide (#8108) @MBilalShafi
- [docs] Change default date from 4th of April to 17th of April for readability (#8089) @flaviendelangle
- [docs] Clarify the MIT license restriction for grid pagination (#8045) @arunkp
- [docs] Fix typo replacing "bellow" by "below" (#8080) @TheBox193
- [docs] Link `API object` in the `apiRef` sections (#8106) @MBilalShafi
- [docs] Link to demonstrations in the interfaces API docs (#8028) @cherniavskii
- [docs] Remove the `@next` tag from installation instructions (#8102) @cherniavskii
- [docs] Start enforcing consistency in documentation vocabulary (#6871) @alexfauquette
- [docs] Update accessibility guidelines (#7970) @oliviertassinari
- [docs] Update the DataGrid demo to leverage the latest features (#7863) @joserodolfofreitas
- [docs] Update migration guide for stable release (#8092) @joserodolfofreitas

### Core

- [core] Add modified docs page links in the PR (#7848) @alexfauquette
- [core] Add test on value timezone (#7867) @alexfauquette
- [core] Bump monorepo (#8006) @LukasTy
- [core] Change default branch back to `master` (#8081) @m4theushw
- [core] Upgrade monorepo (#8115) @MBilalShafi
- [core] Mention the use of Support key as an alternative to the OrderID (#6968) @joserodolfofreitas
- [test] Fix flaky tests (#8097) @cherniavskii

## 6.0.0-beta.5

_Feb 23, 2023_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- ⚡️ Add web worker support for Excel export (#7770) @m4theushw
- 🎁 Add a button to remove all filters on the data grid filter panel (#7326) @MBilalShafi
- ⚙️ Allow to customize options label and value in the data grid `singleSelect` column (#7684) @m4theushw
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-beta.5` / `@mui/x-data-grid-pro@6.0.0-beta.5` / `@mui/x-data-grid-premium@6.0.0-beta.5`

#### Changes

- [DataGrid] Allow to customize label and value for `singleSelect` (#7684) @m4theushw
- [DataGrid] Fix `ownerState` being `undefined` in theme style overrides (#7964) @lolaignatova
- [DataGrid] Introduce `slots` and deprecate `components` (#7882) @MBilalShafi
- [DataGridPro] Add `Remove All` option in filter panel (#7326) @MBilalShafi
- [DataGridPremium] Add web worker support for Excel export (#7770) @m4theushw

### `@mui/x-date-pickers@6.0.0-beta.5` / `@mui/x-date-pickers-pro@6.0.0-beta.5`

#### Breaking changes

- The `MuiDateSectionName` type was renamed to `FieldSectionType`

#### Changes

- [fields] Fix multi input range fields validation when uncontrolled (#8002) @LukasTy
- [fields] Fix single input time range fields slot props (#7988) @LukasTy
- [fields] Make the `ArrowUp` / `ArrowDown` edition only impact the active section (#7993) @flaviendelangle
- [fields] Fix single input range fields clearing (#7995) @flaviendelangle
- [fields] Clean the section object (#8009) @flaviendelangle
- [pickers] Fix `textField` slot `error` prop propagation (#7987) @LukasTy

### `@mui/x-codemod@6.0.0-beta.5`

#### Changes

- [codemod] Add `apiRef.current.getRowIndex` to `DataGrid` renaming codemod (#8001) @MBilalShafi

### Docs

- [docs] Fine tune range fields demos (#7992) @LukasTy
- [docs] Fix a few scroll issues on mobile (#7900) @oliviertassinari
- [docs] Fix inconsistency in the data grid migration guide (#7963) @MBilalShafi

### Core

- [core] Fix `moment` locale on adapter tests (#8020) @flaviendelangle
- [test] Support all adapters on the field tests about the formats (#7996) @flaviendelangle

## 6.0.0-beta.4

_Feb 16, 2023_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- ⚡️ Improve grid performance by reducing rerenders (#7857) @cherniavskii
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-beta.4` / `@mui/x-data-grid-pro@6.0.0-beta.4` / `@mui/x-data-grid-premium@6.0.0-beta.4`

#### Changes

- [DataGrid] Add interface for `singleSelect` column (#7685) @m4theushw
- [DataGrid] Allow to pass props to the `FocusTrap` inside the panel wrapper (#7733) @ivek-Prajapatii
- [DataGrid] Avoid unnecessary rerenders after `updateRows` (#7857) @cherniavskii
- [DataGridPro] Change cursor when dragging a column (#7725) @sai6855
- [DataGridPremium] Fix `leafField` to have correct focus value (#7950) @MBilalShafi

### `@mui/x-date-pickers@6.0.0-beta.4` / `@mui/x-date-pickers-pro@6.0.0-beta.4`

#### Changes

- [DateRangePicker] Fix slide transition by avoiding useless component re-rendering (#7874) @LukasTy
- [fields] Support Backspace key on `Android` (#7842) @flaviendelangle
- [fields] Support escaped characters on `Luxon` (#7888) @flaviendelangle
- [pickers] Prepare new pickers for custom fields (#7806) @flaviendelangle

### `@mui/x-codemod@6.0.0-beta.4`

#### Changes

- [codemod] Fix import path (#7952) @LukasTy

### Docs

- [docs] Add an info callout specifying the current state of desktop time view (#7933) @LukasTy
- [docs] Add missing param in `useGridApiEventHandler` examples (#7939) @flaviendelangle
- [docs] Fix markdown table alignments (#7898) @oliviertassinari
- [docs] Improve `DataGrid` migration guide (#7861) @MBilalShafi
- [docs] Update `LocalizationProvider` `dateAdapter` with a link to the doc (#7872) @LukasTy

### Core

- [core] Run editing field tests on all major adapters (#7868) @flaviendelangle

## 6.0.0-beta.3

_Feb 9, 2023_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- ⬅️ Add right-to-left support for the data grid (#6580) @yaredtsy
- ⚡️ Improve grid resize performance (#7864) @cherniavskii
- ✨ New codemods for migrating to v6 @MBilalShafi
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-beta.3` / `@mui/x-data-grid-pro@6.0.0-beta.3` / `@mui/x-data-grid-premium@6.0.0-beta.3`

#### Changes

- [DataGrid] Add `BaseIconButton` component slot (#7329) @123joshuawu
- [DataGrid] Allow to customize the value displayed in the filter button tooltip (#6956) @ithrforu
- [DataGrid] Improve grid resize performance (#7864) @cherniavskii
- [DataGrid] Make `apiRef.current.getRowWithUpdatedValues` stable (#7788) @m4theushw
- [DataGrid] Support RTL (#6580) @yaredtsy
- [DataGrid] Improve query selectors for selecting cell element (#7354) @yaredtsy
- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#7854) @ed-ateixeira

### `@mui/x-date-pickers@6.0.0-beta.3` / `@mui/x-date-pickers-pro@6.0.0-beta.3`

#### Changes

- [fields] Allow to select year 2000 on 2-digit year section (#7858) @flaviendelangle
- [fields] Fix year editing on `day.js` (#7862) @flaviendelangle
- [fields] Fix year editing on valid date (#7834) @flaviendelangle
- [fields] Reset query when pressing `Backspace` or `Delete` (#7855) @flaviendelangle
- [pickers] Clean Popper position on new pickers (#7445) @flaviendelangle
- [pickers] Ditch pickers `skipLibCheck` (#7808) @LukasTy
- [pickers] Improve JSDoc and resulting API docs pages (#7847) @LukasTy

### `@mui/x-codemod@6.0.0-beta.3`

#### Changes

- [codemod] Add more cases to `rename-selectors-and-events` codemod (#7856) @MBilalShafi
- [codemod] Add warning message to the codemods and migration guide (#7813) @MBilalShafi
- [codemod] Add codemod to remove unnecessary `experimentalFeatures` flag (#7836) @MBilalShafi
- [codemod] Rename `GridFilterItem` props (#7483) @MBilalShafi
- [codemod] Rename `linkOperators` to `logicOperators` (#7707) @MBilalShafi
- [codemod] Replace `onCellFocusOut` prop for Data Grid (#7786) @MBilalShafi

### Docs

- [docs] Add a "Whats new in v6" page linked on the sidebar (#7820) @joserodolfofreitas
- [docs] Fix hydration crash in pickers (#7734) @oliviertassinari
- [docs] Remove no longer relevant range shortcuts section (#7840) @LukasTy
- [docs] Use `@next` tag in grid and pickers installation instructions (#7814) @cherniavskii

### Core

- [core] Remove `tslint` package leftovers (#7841) @LukasTy
- [test] Use `createDescribes` for `describeValue` and `describeValidation` (#7866) @flaviendelangle

## 6.0.0-beta.2

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Support week day formats in the field components
- 🌍 Add Hungarian (hu-HU) and Urdu (ur-PK) locales
- 🌍 Improve French (fr-FR) and Italian (it-IT) locales
- ✨ New codemods for migrating to v6
- 📚 Documentation improvements
- 🐞 Bug fixes

### `@mui/x-data-grid@6.0.0-beta.2` / `@mui/x-data-grid-pro@6.0.0-beta.2` / `@mui/x-data-grid-premium@6.0.0-beta.2`

#### Changes

- [DataGrid] Handle non-numeric values returned by `getRowHeight` prop (#7703) @cherniavskii
- [DataGrid] Merge row styles with `componentsProps.row.style` (#7641) @marktoman
- [l10n] Add Hungarian (hu-HU) locale (#7776) @noherczeg
- [l10n] Add Urdu (ur-PK) locale (#6866) @MBilalShafi
- [l10n] Improve French (fr-FR) locale (#7777) @ivek-Prajapatii
- [l10n] Improve Italian (it-IT) locale (#7761) @simonecervini

### `@mui/x-date-pickers@6.0.0-beta.2` / `@mui/x-date-pickers-pro@6.0.0-beta.2`

#### Changes

- [fields] Support week day formats (#7392) @flaviendelangle
- [pickers] Allow to initialize and control the `rangePosition` on all range components (#7764) @flaviendelangle
- [pickers] Fix theme augmentation (#7800) @LukasTy
- [pickers] Hide scrollbars in the date calendar container (#7766) @ivek-Prajapatii
- [pickers] Remove the dependency on `rifm` (#7785) @alexfauquette

### `@mui/x-codemod@6.0.0-beta.2`

#### Changes

- [codemod] Add pickers `rename-default-toolbar-title-localeText` codemod (#7752) @LukasTy
- [codemod] Add pickers `rename-inputFormat-prop` codemod (#7736) @LukasTy

### Docs

- [docs] Fix a typo in data grid layout page (#7113) @sfbaker7
- [docs] Fix require context path to avoid duplicate key creation (#7781) @LukasTy
- [docs] Polish pickers migration docs (#7737) @LukasTy
- [docs] Rename `next` translation docs and remove duplicates with `-next` (#7729) @LukasTy

### Core

- [core] Fix l10n data file (#7804) @flaviendelangle
- [core] Fix Next.js warning (#7754) @oliviertassinari
- [core] Remove unused demos (#7758) @flaviendelangle

## 6.0.0-beta.1

_Jan 27, 2023_

We'd like to offer a big thanks to the 17 contributors who made this release possible. Here are some highlights ✨:

- 🚀 New shortcuts component for the date pickers (#7154) @alexfauquette
- 🌍 Add Belarusian (be-BY), Czech (cs-CZ) and Russian (ru-RU) locales
- 🌍 Improve Spanish (es-ES), Japanese (ja-JP), Slovak (sk-SK), and Vietnamese (vi-VN) locales
- ✨ New codemods for migrating to v6
- 📚 Documentation improvements
- 🐞 Bug fixes

### `@mui/x-data-grid@6.0.0-beta.1` / `@mui/x-data-grid-pro@6.0.0-beta.1` / `@mui/x-data-grid-premium@6.0.0-beta.1`

#### Changes

- [DataGrid] Add `title` attribute to cells (#7682) @thupi
- [DataGrid] Fix `autoHeight` not working properly inside of a flex container (#7701) @cherniavskii
- [DataGrid] Fix grid state not being updated after print preview is closed (#7642) @cherniavskii
- [DataGrid] Fix non-hideable columns visibility toggling (#7637) @cherniavskii
- [DataGrid] Fix scrolling on resize for data grids inside shadow root (#7298) @akiradev
- [l10n] Add Slovak (sk-SK) translation for aggregation functions (#7702) @msidlo
- [l10n] Add missing core locales for `MuiTablePagination` (#7717) @MBilalShafi
- [l10n] Improve Spanish (es-ES) and Vietnamese (vi-VN) locale (#7634) @WiXSL and @SpacerZ
- [l10n] Add Belarusian (be-BY) locale (#7646) @olhalink

### `@mui/x-date-pickers@6.0.0-beta.1` / `@mui/x-date-pickers-pro@6.0.0-beta.1`

#### Changes

- [pickers] Fix `aria-labelledby` assignment to dialog (#7608) @LukasTy
- [pickers] Support `UTC` with `dayjs` (#7610) @flaviendelangle
- [pickers] Update focus when opening a UI view (#7620) @alexfauquette
- [DateRangePickers] Add shortcuts component (#7154) @alexfauquette
- [l10n] Add Czech (cs-CZ) locale (#7645) @OndrejHj04
- [l10n] Add Russian (ru-RU) locale (#7706) @rstmzh
- [l10n] Improve Japanese (ja-JP) locale (#7624) @makoto14

### `@mui/x-codemod@6.0.0-beta.1`

#### Changes

- [codemod] Add pickers `replace-toolbar-props-by-slot` codemod (#7687) @alexfauquette
- [codemod] Add `GridColumnMenuItemProps` to `column-menu-components-rename` codemod (#7710) @MBilalShafi
- [codemod] Add `headerHeight` prop update to `row-selection-props-rename` codemod (#7711) @MBilalShafi
- [codemod] Add pickers codemod for `components` to `slots` renaming (#7533) @alexfauquette
- [codemod] Add pickers `migrate-to-components-componentsProps` and `replace-arrows-button-slot` codemods (#7698) @alexfauquette
- [codemod] Add data grid codemod renaming `rowsPerPageOptions` prop to `pageSizeOptions` (#7603) @MBilalShafi
- [codemod] Add pickers `rename-should-disable-time` codemod (#7709) @alexfauquette
- [codemod] Add data grid `row-selection-props-rename` codemod (#7485) @MBilalShafi
- [codemod] Add data grid `rename-selectors-and-events` codemod (#7699) @MBilalShafi
- [codemod] Add pickers `replace-tabs-props` codemod (#7639) @alexfauquette

### Docs

- [docs] Add info callout about available component `slots` (#7714) @ivek-Prajapatii
- [docs] Add recipe for pinning grouped column (#7712) @MBilalShafi
- [docs] Fix 404 links to picker API page @oliviertassinari
- [docs] Update `DemoContainer` `components` prop using a codemod (#7574) @alexfauquette

### Core

- [core] Fix `innerslotProps` typo (#7697) @LukasTy
- [core] Upgrade monorepo (#7676) @cherniavskii

## 6.0.0-beta.0

_Jan 19, 2023_

After a long period in alpha, we're glad to announce the first MUI X v6 beta!
We encourage you to try out this version, packed with improvements, bug fixes, and a few highlighted features ✨:

**Data Grid**

- [Access to the API Object in the community version](https://mui.com/x/react-data-grid/api-object/)
- [Improved column menu](https://mui.com/x/react-data-grid/column-menu/)
- [Cell selection range](https://mui.com/x/react-data-grid/cell-selection/) (Premium)

**Date and Time pickers**

- [Fields: the new default input for pickers](https://mui.com/x/react-date-pickers/fields/).
- [Improved layout customization](https://mui.com/x/react-date-pickers/custom-layout/)
- [Edit date ranges with drag and drop](https://mui.com/x/react-date-pickers/date-range-calendar/) (Pro)

You can check the migration guides for the [Data Grid](https://mui.com/x/migration/migration-data-grid-v5/) and [Date Pickers](https://mui.com/x/migration/migration-pickers-v5/) in the documentation.

We'd like to offer a big thanks to the 10 contributors who made this release possible.

- ✨ Merge `page` and `pageSize` props into `paginationModel`
- 🚀 Replace old masked picker components with field based ones
- 🌍 Improve Swedish (sv-SE) and Italian (it-IT) locales
- 📚 Documentation improvements
- 🐞 Bug fixes

### `@mui/x-data-grid@6.0.0-beta.0` / `@mui/x-data-grid-pro@6.0.0-beta.0` / `@mui/x-data-grid-premium@6.0.0-beta.0`

#### Breaking changes

- The `disableExtendRowFullWidth` prop was removed.
  Use `showCellVerticalBorder` or `showColumnVerticalBorder` props to show or hide right border for cells and header cells respectively.

- The `GridCellIdentifier` type was removed. Use `GridCellCoordinates` instead.

- The `singleSelect` column type now has a default value formatter that returns the `label` corresponding to the selected value when `valueOptions` is an array of objects.
  As consequence, any existing value formatter will not be applied to the individual options anymore, but only to the text of the cell.
  It is recommended to migrate `valueOptions` to an array of objects to be able to add a custom label for each value.
  To override the label used for each option when the cell is in edit mode or in the filter panel, the following components now support a `getOptionLabel` prop.
  This prop accepts a callback that is called with the item from `valueOptions` and must return the new label.

  - `GridEditSingleSelectCell`
  - `GridFilterInputSingleSelect`
  - `GridFilterInputMultipleSingleSelect`

- The `getGridSingleSelectQuickFilterFn` function was removed.
  You can copy the old function and pass it to the `getApplyQuickFilterFn` property of the `singleSelect` column definition.

- The `page` and `pageSize` props and their respective event handlers `onPageChange` and `onPageSizeChange` were removed.
  Use `paginationModel` and `onPaginationModelChange` instead.

  ```diff
   <DataGrid
    rows={rows}
     columns={columns}
  -  page={page}
  -  pageSize={pageSize}
  -  onPageChange={handlePageChange}
  -  onPageSizeChange={handlePageSizeChange}
  +  paginationModel={{ page, pageSize }}
  +  onPaginationModelChange={handlePaginationModelChange}
   />
  ```

- The properties `initialState.pagination.page` and `initialState.pagination.pageSize` were also removed.
  Use `initialState.pagination.paginationModel` instead.

  ```diff
  -initialState={{ pagination: { page: 1, pageSize: 10 } }}
  +initialState={{ pagination: { paginationModel: { page: 1, pageSize: 10 } } }}
  ```

- The `rowsPerPageOptions` prop was renamed to `pageSizeOptions`.

  ```diff
  -<DataGrid rowsPerPageOptions={[10, 20, 50]} />
  +<DataGrid pageSizeOptions={[10, 20, 50]} />
  ```

- The `error` and `onError` props were removed - the grid no longer catches errors during rendering.
  To catch errors that happen during rendering use the [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

- The `components.ErrorOverlay` slot was removed.

- The `GridErrorOverlay` component was removed.

- The `componentError` event was removed.
  Use the [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) to catch errors thrown during rendering.

- The `apiRef.current.showError` method was removed.
  The UI for errors is no longer handled by the grid.

- The `date` and `dateTime` columns now only support `Date` objects as values.
  To parse a string value, use the [`valueGetter`](https://mui.com/x/react-data-grid/column-definition/#value-getter):

  ```tsx
  <DataGrid
    columns={[
      {
        field: 'date',
        type: 'date',
        valueGetter: (params) => new Date(params.value),
      },
    ]}
  />
  ```

- The following selectors have been renamed:

  - `gridVisibleSortedRowIdsSelector` renamed to `gridExpandedSortedRowIdsSelector`
  - `gridVisibleSortedRowEntriesSelector` renamed to `gridExpandedSortedRowEntriesSelector`
  - `gridVisibleRowCountSelector` renamed to `gridExpandedRowCountSelector`
  - `gridVisibleSortedTopLevelRowEntriesSelector` renamed to `gridFilteredSortedTopLevelRowEntriesSelector`
  - `gridVisibleTopLevelRowCountSelector` renamed to `gridFilteredTopLevelRowCountSelector`

- The `apiRef.current.getVisibleRowModels` method was removed. Use the `gridVisibleSortedRowEntriesSelector` selector instead.

- The `GridRowScrollEndParams["virtualRowsCount"]` parameter was renamed to `GridRowScrollEndParams["visibleRowsCount"]`.

#### Changes

- [DataGrid] Add default value formatter to `singleSelect` (#7290) @m4theushw
- [DataGrid] Fix flickering on grid scroll (#7549) @cherniavskii
- [DataGrid] Merge `page` and `pageSize` props into `paginationModel` (#7147) @MBilalShafi
- [DataGrid] Only support `Date` as value in `date` and `dateTime` column types (#7594) @cherniavskii
- [DataGrid] Remove error boundary (#7579) @cherniavskii
- [DataGrid] Remove `GridCellIdentifier` redundant type (#7578) @MBilalShafi
- [DataGrid] Remove `disableExtendRowFullWidth` prop (#7373) @MBilalShafi
- [DataGrid] Remove tag limit from `isAnyOf` operator input (#7592) @m4theushw
- [DataGrid] Use v6 terminology (#7473) @DanailH
- [DataGridPremium] Keep focus on first selected cell (#7482) @m4theushw
- [l10n] Update Swedish (sv-SE) locale (#7585) @MaanTyringe

### `@mui/x-date-pickers@6.0.0-beta.0` / `@mui/x-date-pickers-pro@6.0.0-beta.0`

#### Breaking changes

- The `showToolbar` prop has been moved to the `toolbar` component slot props:

  ```diff
   <DatePicker
  -  showToolbar
  +  slotProps={{
  +    toolbar: {
  +      hidden: false,
  +    }
  +  }}
   />
  ```

- The new pickers have replaced the legacy one.

  If you were using the new pickers with their temporary name, you just have to change your imports.

  ```diff
  -import { Unstable_NextDatePicker as NextDatePicker } from '@mui/x-date-pickers/NextDatePicker';
  +import { DatePicker } from '@mui/x-date-pickers/DatePicker';
  -import { Unstable_DesktopNextDatePicker as DesktopNextDatePicker } from '@mui/x-date-pickers/DesktopNextDatePicker';
  +import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

   // Same for all the other pickers with an `Unstable_` prefix
  ```

  If you were still using the legacy picker (`DatePicker`, `DesktopDatePicker`, ...), please take a look at our [migration guide](https://mui.com/x/migration/migration-pickers-v5/#picker-components) for detailed explanations on how to start using the new ones.

- The fields components are no longer unstable

  ```diff
  -import { Unstable_DateField as DateField } from '@mui/x-date-pickers/DateField';
  +import { DateField } from '@mui/x-date-pickers/DateField';
  ```

#### Changes

- [DateRangeCalendar] Ignore `calendars` prop on mobile (#7526) @flaviendelangle
- [DateRangeCalendar] Ignore `showDaysOutsideCurrentMonth` when `calendars > 1` (#7529) @flaviendelangle
- [DateRangePicker] Propagate `rangePosition` to view (#7602) @LukasTy
- [fields] Fix upper boundary on 12-hours sections (#7618) @flaviendelangle
- [fields] Publish value when cleaning the last section of a date (#7519) @flaviendelangle
- [fields] Remove the `Unstable_` prefix for field components (#7185) @flaviendelangle
- [pickers] Add missing `slots` and `slotProps` on the date range view renderer (#7586) @flaviendelangle
- [pickers] Drop legacy pickers (#7545) @flaviendelangle
- [pickers] Fix day calendar row and column index (#7589) @LukasTy
- [pickers] Go to the default view when opening a picker (#7484) @flaviendelangle
- [pickers] Make sure the `className` and `sx` props are applied to the field / static root of the picker and never to the view (#7600) @flaviendelangle
- [pickers] Rename new pickers (#7575) @flaviendelangle
- [pickers] Rename remaining `components` and `componentSlots` references (#7576) @LukasTy
- [pickers] Replace `showToolbar` with toolbar slot `hidden` prop (#7498) @LukasTy
- [pickers] Spread props to the DOM in `DateCalendar` and `TimeClock` (#7587) @flaviendelangle
- [pickers] Stop using the `WrapperVariantContext` in `DateRangeCalendar` (#7488) @flaviendelangle
- [l10n] Improve Italian (it-IT) locale (#7582) @marikadeveloper

### `@mui/x-codemod@6.0.0-beta.0`

#### Changes

- [codemod] Remove `disableExtendRowFullWidth` prop (#7508) @MBilalShafi

### Docs

- [docs] Clean-up the `field components` page (#7605) @flaviendelangle
- [docs] List all pickers toolbar pages in api docs side menu (#7577) @LukasTy
- [docs] Remove "Flex layout" docs section and demo (#7477) @cherniavskii
- [docs] Rework the pickers "Getting Started" page (#7140) @flaviendelangle

### Core

- [core] Add missing `status: needs triage` label on RFC @oliviertassinari
- [core] Add release documentation step detailing `x-codemod` package tag change (#7617) @LukasTy
- [core] Fix typo in `CHANGELOG` (#7611) @flaviendelangle
- [test] Fix date range picker tests to work with western time zones (#7581) @m4theushw

## 6.0.0-alpha.15

_Jan 13, 2023_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Support components and slots for new pickers (#7390) @alexfauquette
- ✨ Update `onColumnOrderChange` behavior to match `onRowsOrderChange` (#7385) @DanailH
- 🌍 Improve Spanish (es-ES) and Belarusian (be-BY) locales
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.15` / `@mui/x-data-grid-pro@6.0.0-alpha.15` / `@mui/x-data-grid-premium@6.0.0-alpha.15`

#### Breaking changes

- Remove the `onCellFocusOut` prop (#6302) @cherniavskii

  The `onCellFocusOut` prop was removed. Use `componentsProps.cell.onBlur` instead:

  ```tsx
  <DataGrid
    componentsProps={{
      cell: {
        onBlur: (event) => {
          const cellElement = event.currentTarget;
          const field = cellElement.getAttribute('data-field');
          const rowId = cell.parentElement.getAttribute('data-id');
        },
      },
    }}
  />
  ```

- [DataGrid] Stop exporting editing selector (#7456) @m4theushw

  The `gridEditRowsStateSelector` selector was removed.

- [DataGrid] Rework column headers and virtual scroller positioning (#7001) @cherniavskii

  The `headerHeight` prop was renamed to `columnHeaderHeight`.

- [DataGrid] Remove the `columnTypes` prop (#7309) @cherniavskii

  The `columnTypes` prop was removed. For custom column types see [Custom column types](https://mui.com/x/react-data-grid/column-definition/#custom-column-types) docs.

- [DataGrid] Rename `linkOperators` to `logicOperators` (#7310) @cherniavskii

  The `apiRef.current.setFilterLinkOperator` method was renamed to `apiRef.current.setFilterLogicOperator`.
  The `GridLinkOperator` enum was renamed to `GridLogicOperator`.
  The `GridFilterModel['linkOperator']` was renamed to `GridFilterModel['logicOperator']`.
  The `linkOperators` prop of `GridFilterForm` and `GridFilterPanel` components was renamed to `logicOperators`.
  The `linkOperatorInputProps` prop of `GridFilterForm` component was renamed to `logicOperatorInputProps`.
  The `filterFormProps.linkOperatorInputProps` prop in `GridFilterForm` component was renamed to `filterFormProps.logicOperatorInputProps`.
  The `GridLocaleText['filterPanelLinkOperator']` property was renamed to `GridLocaleText['filterPanelLogicOperator']`.
  The `.MuiDataGrid-filterFormLinkOperatorInput`CSS class was renamed to `.MuiDataGrid-filterFormLogicOperatorInput`.

- [DataGrid] Remove `Alt+C` keyboard shortcut (#7466) @MBilalShafi

  <kbd>Alt</kbd> (or <kbd>⌥ Option</kbd>) + <kbd>C</kbd> keyboard shortcut is no longer supported.

#### Changes

- [DataGrid] Fix <kbd>Tab</kbd> between portaled and non-portaled edit components (#7098) @m4theushw
- [DataGrid] Remove the `columnTypes` prop (#7309) @cherniavskii
- [DataGrid] Remove the `onCellFocusOut` prop (#6302) @cherniavskii
- [DataGrid] Rename `linkOperators` to `logicOperators` (#7310) @cherniavskii
- [DataGrid] Rework column headers and virtual scroller positioning (#7001) @cherniavskii
- [DataGrid] Stop exporting editing selector (#7456) @m4theushw
- [DataGrid] Update `onColumnOrderChange` behavior to match `onRowsOrderChange` (#7385) @DanailH
- [DataGrid] Improve Spanish (es-ES) locale (#7447) @Anderssxn
- [DataGrid] Remove Alt+C keyboard shortcut (#7466) @MBilalShafi
- [DataGridPremium] Fix Excel export not working with date strings (#7396) @cherniavskii

### `@mui/x-date-pickers@6.0.0-alpha.15` / `@mui/x-date-pickers-pro@6.0.0-alpha.15`

#### Breaking changes

- [pickers] Stop using the `WrapperVariantContext` in `MonthCalendar` and `YearCalendar` (#7382) @flaviendelangle

  The `modeMobile` and `modeDesktop` classes have been removed from the `PickersMonth` and `PickersYear` internal components.

  If you were using those classes on responsive components,
  you can import `DEFAULT_DESKTOP_MODE_MEDIA_QUERY` from `@mui/x-date-pickers` or `@mui/x-date-pickers-pro` (or use your custom media query if any):

  ```diff
   <GlobalStyles
     styles={{
  -     [`.${pickersYearClasses.modeDesktop}`]: {
  -       backgroundColor: 'red'
  -     }
  +     [DEFAULT_DESKTOP_MODE_MEDIA_QUERY]: {
  +       [`.${pickersYearClasses.root}`]: {
  +         backgroundColor: 'red'
  +       }
  +     }
  -     [`.${pickersYearClasses.modeMobile}`]: {
  -       backgroundColor: 'red'
  -     }
  +     [DEFAULT_DESKTOP_MODE_MEDIA_QUERY.replace('@media', '@media not')]: {
  +       [`.${pickersYearClasses.root}`]: {
  +         backgroundColor: 'red'
  +       }
  +     }
     }}
   />
  ```

  Works exactly the same way for `PickersMonth`.

- [pickers] Refactor `shouldDisableTime` (#7299) @LukasTy

  The `shouldDisableTime` prop signature has been changed. Either rename the prop usage to `shouldDisableClock` or refactor usage.

  ```diff
   <DateTimePicker
  -   shouldDisableTime={(timeValue, view) => view === 'hours' && timeValue < 12}
  +   shouldDisableClock={(timeValue, view) => view === 'hours' && timeValue < 12}
   />
  ```

  ```diff
   <DateTimePicker
  -   shouldDisableTime={(timeValue, view) => view === 'hours' && timeValue < 12}
  +   shouldDisableTime={(value, view) => view === 'hours' && value.hour() < 12}
   />
  ```

#### Changes

- [fields] Fix Android editing (#7444) @flaviendelangle
- [pickers] Add Belarusian (be-BY) locale (#7395) @olhalink
- [pickers] Hide am/pm controls when there is no hour view (#7380) @flaviendelangle
- [pickers] Hide the tabs by default on `DesktopNextDateTimePicker` (#7503) @flaviendelangle
- [pickers] Refactor `shouldDisableTime` (#7299) @LukasTy
- [pickers] Remove `WrapperVariantContext` from `DateTimePickerTabs` (#7374) @LukasTy
- [pickers] Stop using the `WrapperVariantContext` in `MonthCalendar` and `YearCalendar` (#7382) @flaviendelangle
- [pickers] Support `components` and `slots` for new pickers (#7390) @alexfauquette
- [pickers] Replace `slotsProps` by `slotProps` (#7528) @alexfauquette

### Docs

- [docs] Fix codesandboxes using `DemoContainer` (#7388) @LukasTy
- [docs] Fix wrong reference to currentView (#7441) @oliviertassinari
- [docs] New page for `DateRangeCalendar` (#7378) @flaviendelangle
- [docs] Update the migration guide with the breaking changes between the legacy and the new pickers (#7345) @flaviendelangle
- [docs] Use new pickers on "Custom components" demos (#7194) @flaviendelangle

### Core

- [core] Handle selection edge case (#7350) @oliviertassinari
- [core] Improve license message @oliviertassinari
- [core] Move default `closeOnSelect` to prop definition in `usePickerValue` (#7459) @flaviendelangle
- [core] Move interfaces of UI views to dedicated files (#7458) @flaviendelangle
- [core] Update package used to import LicenseInfo (#7442) @oliviertassinari
- [test] Add a few inheritComponent (#7352) @oliviertassinari

## 6.0.0-alpha.14

_Jan 5, 2023_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 📆 Add `SingleInputTimeRangeField` and `SingleInputDateTimeRangeField` components (#7186) @alexfauquette
- 🚀 Use grid for modifying pickers layout (#6900) @alexfauquette
- ✨ Improve field components editing experience (#7272) @flaviendelangle
- 💻 Multiple codemods
- 📚 Many documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.14` / `@mui/x-data-grid-pro@6.0.0-alpha.14` / `@mui/x-data-grid-premium@6.0.0-alpha.14`

#### Breaking changes

- [DataGrid] Set default `GridCellParams['value']` type to `unknown` (#6959) @cherniavskii

  The default type of `GridCellParams['value']` was changed from `any` to `unknown`.

#### Changes

- [DataGrid] Fix flickering on mount (#7205) @cherniavskii
- [DataGrid] Fix selected text in cell input not being copied in Firefox (#6593) @cherniavskii
- [DataGrid] Invert generic parameters order (#6874) @DanailH
- [DataGrid] Remove legacy logic for `singleSelect` inside `GridFilterInputValue` (#7386) @m4theushw
- [DataGrid] Remove remaining props from legacy editing API (#7381) @m4theushw
- [DataGrid] Set default `GridCellParams['value']` type to `unknown` (#6959) @cherniavskii

### `@mui/x-date-pickers@6.0.0-alpha.14` / `@mui/x-date-pickers-pro@6.0.0-alpha.14`

#### Breaking changes

- [fields] Rename the `input` slot of the fields to `textField` to avoid confusion (#7369) @flaviendelangle

#### Changes

- [fields] Add `SingleInputTimeRangeField` and `SingleInputDateTimeRangeField` components (#7186) @alexfauquette
- [fields] Improve editing (automatic section switch, allow letter editing in digit section, allow numeric editing in letter section) (#7272) @flaviendelangle
- [fields] Rename the `input` slot of the fields to `textField` to avoid confusion (#7369) @flaviendelangle
- [fields] Prevent date change on `TimeField` arrow edition (#7383) @flaviendelangle
- [pickers] Clean some JSDoc descriptions (#7384) @flaviendelangle
- [pickers] Remove redundant `variants` in theme augmentation (#7356) @LukasTy
- [pickers] Remove the `PaperContent` slot from the new pickers (#7342) @flaviendelangle
- [pickers] Use grid for modifying the layout (#6900) @alexfauquette

### `@mui/x-codemod@6.0.0-alpha.14`

#### Changes

- [codemod] Add new codemod for adapter import (#7348) @flaviendelangle
- [codemod] Add new codemod for the value prop renaming on the view components (#7338) @flaviendelangle
- [codemod] Reorganize codemods and add rename column menu components codemod (#7368) @MBilalShafi

### Docs

- [docs] Add example to add back the mobile keyboard view (#7347) @flaviendelangle
- [docs] Cleanup the doc pages of the community pickers (#7339) @flaviendelangle
- [docs] Drop security fixes support for v4 (#7322) @oliviertassinari
- [docs] Fix `disablePast` and `disableFuture` definition swap (#7324) @alexfauquette
- [docs] Hide ad for paid docs pages (#7321) @oliviertassinari
- [docs] New page for `TimeClock` (#7280) @flaviendelangle
- [docs] Note the pickers breaking changes supported by the codemod (#7337) @flaviendelangle
- [docs] Redirect translated pages (#7341) @cherniavskii
- [docs] Reorganize v6 pickers migration guide (#7257) @flaviendelangle

### Core

- [core] Apply eslint rule for React component @oliviertassinari
- [core] Apply title capitalization convention @oliviertassinari
- [core] Fix the product license reference name (#7367) @oliviertassinari
- [core] Order the slots alphabetically in the JSON files (#7349) @flaviendelangle
- [core] Remove blanklines in `_redirects` @oliviertassinari
- [core] Remove dead prettier config @oliviertassinari
- [core] Sync back with the mono repo (#7351) @oliviertassinari
- [core] Sync monorepo, fix layout scrollbar @oliviertassinari
- [core] Upgrade monorepo (#7307) @LukasTy

## 6.0.0-alpha.13

_Dec 24, 2022_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🚀 New column menu design and API
- 🌍 Improve Russian (ru-RU) and Korean (ko-KR) locales
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.13` / `@mui/x-data-grid-pro@6.0.0-alpha.13` / `@mui/x-data-grid-premium@6.0.0-alpha.13`

#### Breaking changes

- New column menu design and API (#6619) MBilalShafi

  The `currentColumn` prop passed to `components.ColumnMenu` was renamed to `colDef`.
  The `column` prop passed to the items of the column menu was renamed to `colDef`.
  The `DATA_GRID_DEFAULT_SLOTS_COMPONENTS` export has been removed.
  The following components and interfaces were been renamed for consistency:

  **Community Package:**

  ```diff
  -<GridFilterMenuItem />
  +<GridColumnMenuFilterItem />
  ```

  ```diff
  -<HideGridColMenuItem />
  +<GridColumnMenuHideItem />
  ```

  ```diff
  -<GridColumnsMenuItem />
  +<GridColumnMenuColumnsItem />
  ```

  ```diff
  -<SortGridMenuItems />
  +<GridColumnMenuSortItem />
  ```

  ```diff
  -interface GridFilterItemProps
  +interface GridColumnMenuItemProps
  ```

  **Pro package:**

  ```diff
  -<GridColumnPinningMenuItems />
  +<GridColumnMenuPinningItem />
  ```

  **Premium package:**

  ```diff
  -<GridAggregationColumnMenuItem />
  +<GridColumnMenuAggregationItem />
  ```

  ```diff
  -<GridRowGroupingColumnMenuItems />
  -<GridRowGroupableColumnMenuItems />
  +<GridColumnMenuGroupingItem />
  ```

- Improve column definition typing (#7224) @cherniavskii

  The `GridColumns` type was removed. Use `GridColDef[]` instead.
  The `GridActionsColDef` interface was removed. Use `GridColDef` instead.
  The `GridEnrichedColDef` type was removed. Use `GridColDef` instead.
  The `GridStateColDef` type was removed.

  If you use it to type `searchPredicate`, use `GridColumnsPanelProps['searchPredicate']` instead.
  If you use it to type `getApplyFilterFn`, `GridFilterOperator['getApplyFilterFn']` can be used as replacement.

- Remove GridDensityType enum (#7304) @cherniavskii

  The `GridDensityTypes` enum was removed. Use `GridDensity` type instead.

#### Changes

- [DataGrid] Allow disabling of buttons in column panel (#6947) @MBilalShafi
- [DataGrid] Improve column definition typing (#7224) @cherniavskii
- [DataGrid] Improve column menu design and API (#6619) @MBilalShafi
- [DataGrid] Remove `GridDensityType` enum (#7304) @cherniavskii
- [DataGrid] Remove `rowHeight` and `headerHeight` from state (#7199) @DanailH
- [DataGrid] Remove column separator to match table styles (#7067) @MBilalShafi
- [DataGrid] Update Russian (ru-RU) locale (#7220) @eceluXa
- [DataGridPro] Use row ID as `key` of the detail panels (#7302) @m4theushw
- [DataGridPremium] Fix `exceljs` import with parcel (#7284) @alexfauquette

### `@mui/x-date-pickers@6.0.0-alpha.13` / `@mui/x-date-pickers-pro@6.0.0-alpha.13`

#### Breaking changes

- Require Luxon 3.0.2 or higher (#7249) @flaviendelangle

  `AdapterLuxon` now requires `luxon` in version `3.0.2` or higher in order to work.

  Take a look at the [Upgrading Luxon](https://moment.github.io/luxon/#/upgrading) guide if you are using an older version.

#### Changes

- [DateRangePicker] Fix to propagate `disabled` and `readOnly` on multi input picker (#7135) @LukasTy
- [fields] Fix multi input fields root element props order and types (#7225) @LukasTy
- [fields] Support escaped characters (#7184) @flaviendelangle
- [pickers] Allow to define custom view renderers on the pickers (#7176) @flaviendelangle
- [pickers] Avoid running validation methods several times in `DateCalendar` (#7247) @flaviendelangle
- [pickers] Improve Korean (ko-KR) locale (#7266) @hanbin9775
- [pickers] Require Luxon 3.0.2 or higher (#7249) @flaviendelangle
- [pickers] Rework view internals (#7097) @flaviendelangle

### `@mui/x-codemod@6.0.0-alpha.13`

#### Changes

- [codemod] New codemod for view component renaming (#7264) @flaviendelangle

### Docs

- [docs] Fix some selectors not being documented (#7218) @cherniavskii
- [docs] New page for `DateCalendar` (#7053) @flaviendelangle
- [docs] Split selection docs (#7213) @m4theushw

### Core

- [core] Fix API demos callout spacing @oliviertassinari

## 6.0.0-alpha.12

_Dec 16, 2022_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🚀 The `apiRef` prop is now available in the `@mui/x-data-grid` package:

  ```tsx
  const apiRef = useGridApiRef();

  return <DataGrid apiRef={apiRef} {...other} />;
  ```

  See [the documentation](https://mui.com/x/react-data-grid/api-object/) for more information.

- 🎁 The `DataGridPremium` now supports cell selection:

  ```tsx
  <DataGridPremium unstable_cellSelection />
  ```

  See [the documentation](https://mui.com/x/react-data-grid/cell-selection/) for more information

- 🌍 Support the Right To Left orientation on the fields components
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.12` / `@mui/x-data-grid-pro@6.0.0-alpha.12` / `@mui/x-data-grid-premium@6.0.0-alpha.12`

#### Breaking changes

- The `showCellRightBorder` was renamed to `showCellVerticalBorder`
- The `showColumnRightBorder` was renamed to `showColumnVerticalBorder`
- The `.MuiDataGrid-withBorder` CSS class was renamed to `.MuiDataGrid-withBorderColor` and it only sets `border-color` CSS property now.
- The following undocumented properties from `apiRef` were removed: `footerRef`, `headerRef`, `columnHeadersElementRef`, `columnHeadersContainerElementRef`
- The `GridHeaderPlaceholder` component was removed.
- The `MAX_PAGE_SIZE` constant was removed.
- The `useGridScrollFn` hook was removed.

#### Changes

- [DataGrid] Display sort column menu items as per `sortingOrder` prop (#7180) @MBilalShafi
- [DataGrid] Support `apiRef` in Community package (#6773) @cherniavskii
- [DataGridPremium] Add support for cell selection (#6567) @m4theushw
- [DataGridPremium] Use separate cache for aggregation columns pre-processor (#7142) @m4theushw
- [DataGridPro] Fix missing border in right-pinned columns (#4197) @cherniavskii
- [DataGridPro] Fix wrong border color on skeleton cells (#7202) @cherniavskii

### `@mui/x-date-pickers@6.0.0-alpha.12` / `@mui/x-date-pickers-pro@6.0.0-alpha.12`

#### Changes

- [fields] Fix bug introduced by RTL in single input range fields (#7189) @alexfauquette
- [fields] Support RTL out of the box (#6715) @alexfauquette
- [pickers] Clean `autoFocus` behavior on fields and new pickers (#7153) @flaviendelangle
- [pickers] Fix label on the new range pickers (#7210) @flaviendelangle
- [pickers] Fix wrong component name on `StaticNextDateTime` (#7187) @flaviendelangle

### Docs

- [docs] Add docs section about field placeholders' localization (#7139) @flaviendelangle
- [docs] Create a `DemoGrid` component to unify demos with several components (#7057) @flaviendelangle
- [docs] Document aggregation selectors (#7148) @cherniavskii
- [docs] Fix 301 links to demo pages in API pages (#7197) @oliviertassinari
- [docs] Fix errors and warning in demos (#7209) @LukasTy
- [docs] Use `DemoContainer` and `DemoItem` on every picker demo (#7149) @flaviendelangle

### Core

- [core] Fix broken test (#7179) @flaviendelangle

## 6.0.0-alpha.11

_Dec 8, 2022_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Add dragging support for the new Date Range Picker (`NextDateRangePicker`) (#6763) @LukasTy
- ⚡️ Improve performance of the `day` view (#7066) @flaviendelangle
- ✨ Fix lazy-loading feature not working in `DataGridPremium` (#7124) @m4theushw
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.11` / `@mui/x-data-grid-pro@6.0.0-alpha.11` / `@mui/x-data-grid-premium@6.0.0-alpha.11`

#### Breaking changes

- The `filterPanelOperators` translation key was renamed to `filterPanelOperator` (#7062) @MBilalShafi
- The `components.Header` slot was removed. Use `components.Toolbar` slot instead (#6999) @cherniavskii

#### Changes

- [DataGrid] Fix rows not rendering properly after height change (#6892) @MBilalShafi
- [DataGrid] Remove `Header` slot (#6999) @cherniavskii
- [DataGrid] Rename `filterPanelOperators` -> `filterPanelOperator` (#7062) @MBilalShafi
- [DataGridPremium] Add support for lazy-loading (#7124) @m4theushw
- [DataGridPremium] Pass `groupId` to aggregation function (#7003) @m4theushw

### `@mui/x-date-pickers@6.0.0-alpha.11` / `@mui/x-date-pickers-pro@6.0.0-alpha.11`

#### Breaking changes

- Remove the callback version of the `action` prop on the `actionBar` slot (#7038) @flaviendelangle

  The `action` prop of the `actionBar` slot is no longer supporting a callback.
  Instead, you can pass a callback at the slot level:

  ```diff
   <DatePicker
     componentsProps={{
  -     actionBar: {
  -       actions: (variant) => (variant === 'desktop' ? [] : ['clear']),
  -     },
  +     actionBar: ({ wrapperVariant }) => ({
  +       actions: wrapperVariant === 'desktop' ? [] : ['clear'],
  +     }),
     }}
   />
  ```

- The `selectedDays` prop has been removed from the `Day` component (#7066) @flaviendelangle
  If you need to access it, you can control the value and pass it to the slot using `componentsProps`:

  ```tsx
  function CustomDay({ selectedDay, ...other }) {
    // do something with 'selectedDay'
    return <PickersDay {...other} />;
  }
  function App() {
    const [value, setValue] = React.useState(null);
    return (
      <DatePicker
        value={value}
        onChange={(newValue) => setValue(newValue)}
        components={{ Day: CustomDay }}
        componentsProps={{
          day: { selectedDay: value },
        }}
      />
    );
  }
  ```

- The `currentlySelectingRangeEnd` / `setCurrentlySelectingRangeEnd` props on the Date Range Picker toolbar have been renamed to `rangePosition` / `onRangePositionChange` (#6989) @flaviendelangle

  ```diff
   const CustomToolbarComponent = props => (
     <div>
  -    <button onChange={() => props.setCurrentlySelectingRangeEnd('end')}>Edit end date</button>
  +    <button onClick={() => props.onRangePositionChange('end')}>Edit end date</button>
  -    <div>Is editing end date: {props.currentlySelectingRangeEnd === 'end'}</div>
  +    <div>Is editing end date: {props.rangePosition === 'end'}</div>
     </div>
   )
   <DateRangePicker
     components={{
       Toolbar: CustomToolbarComponent
     }}
   />
  ```

#### Changes

- [DateRangePicker] Add dragging support to edit range (#6763) @LukasTy
- [pickers] Fix lost props on Date Range Pickers (#7092) @flaviendelangle
- [pickers] Fix toolbar on the new range pickers (#6989) @flaviendelangle
- [pickers] Improve performance of `DayCalendar` (#7066) @flaviendelangle
- [pickers] Initialize date without time when selecting year or month (#7120) @LukasTy
- [pickers] Remove the callback version of the `action` prop in the `actionBar` component slot (#7038) @flaviendelangle

### Docs

- [docs] Add `GridCell` change in migration guide (#7087) @MBilalShafi
- [docs] Fix API page ad space regression (#7051) @oliviertassinari
- [docs] Update localization doc to use existing locale (#7102) @LukasTy

### Core

- [core] Add codemod to move l10n translation (#7027) @alexfauquette
- [core] Add notes to remove the legacy pickers internals (#7133) @flaviendelangle
- [core] Remove `internals-fields` imports (#7119) @flaviendelangle
- [core] Remove unused code (#7094) @flaviendelangle
- [core] Sync `ApiPage.js` with monorepo (#7073) @oliviertassinari
- [test] Fix karma-mocha assertion error messages (#7054) @cherniavskii

## 6.0.0-alpha.10

_Dec 1, 2022_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Ukrainian (uk-UA) and add Urdu (ur-PK) locales
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.10` / `@mui/x-data-grid-pro@6.0.0-alpha.10` / `@mui/x-data-grid-premium@6.0.0-alpha.10`

### Breaking changes

- [DataGrid] Removes `GridCell` fallback to `valueToRender` on `null` children (#7023) @MBilalShafi

  Returning `null` in `column.renderCell` or `column.renderEditCell` now renders an empty cell instead of the default formatted value.

- [DataGrid] Refactor `GridFilterItem` props (#6985) @MBilalShafi

  Properties `columnField` and `operatorValue` of `GridFilterItem` are renamed `field` and `operator`. And `operator` property is now required.

  ```diff
   filterModel: {
     items: [{
  -    columnField: 'rating',
  +    field: 'rating',
  -    operatorValue: '>',
  +    operator: '>', // required
      value: '2.5'
      }],
    },
  ```

#### Changes

- [DataGrid] Fix row selection when clicking blank cell (#6974) @yami03
- [DataGrid] Refactor `GridFilterItem` props (#6985) @MBilalShafi
- [DataGrid] Removes `<GridCell />` fallback to `valueToRender` on `null` children (#7023) @MBilalShafi
- [DataGridPremium] Fix empty column group in Excel export (#7029) @alexfauquette
- [DataGridPremium] Update cache before hydrating columns (#7040) @m4theushw
- [DataGridPremium] Use custom cell component for grouping cell by default (#6692) @cherniavskii
- [l10n] Improve Ukrainian (uk-UA) locale (#7009) @rettoua

### `@mui/x-date-pickers@6.0.0-alpha.10` / `@mui/x-date-pickers-pro@6.0.0-alpha.10`

#### Breaking changes

- Rename `dateRangeIcon` to `dateIcon` (#7024) @LukasTy

  The `dateRangeIcon` prop has been renamed to `dateIcon`:

  ```diff
   // Same on all other Date Time Picker variations
   <DateTimePicker
       componentsProps={{
         tabs: {
  -        dateRangeIcon: <LightModeIcon />,
  +        dateIcon: <LightModeIcon />,
        }
      }}
   />
  ```

#### Changes

- [DateTimePicker] Rename `dateRangeIcon` to `dateIcon` (#7024) @LukasTy
- [pickers] Allow non-controlled usage of `TimeClock` (#6962) @flaviendelangle
- [pickers] Throw error when using adapter from `@date-io` (#6972) @flaviendelangle
- [l10n] Add Urdu (ur-PK) locale (#7007) @MBilalShafi
- [l10n] Improve Ukrainian (uk-UA) locale (#7009) @rettoua

### Docs

- [docs] Add Demos section on the pickers API pages (#6909) @flaviendelangle
- [docs] Add missing pickers migration docs (#7000) @LukasTy
- [docs] Fix broken link (#7048) @flaviendelangle
- [docs] Improve demo about customizing pagination (#6724) @m4theushw
- [docs] Keep track of localization completion (#7002) @alexfauquette
- [docs] Remove `LocalizationProvider` from previews (#6869) @flaviendelangle
- [docs] Remove the statement of support to RTL (#6521) @joserodolfofreitas
- [docs] Rework localization doc pages (#6625) @flaviendelangle
- [docs] Setup GitHub issue template for feedbacks about docs (#7026) @alexfauquette
- [docs] Test links with API page ignoring url hash (#7004) @alexfauquette
- [docs] Update API links from clock-picker to time-clock (#6993) @alexfauquette
- [docs] Use new pickers on the validation page (#7047) @flaviendelangle

### Core

- [core] Remove useless type casting in field hooks (#7045) @flaviendelangle
- [test] Sync `test:unit` with monorepo (#6907) @oliviertassinari

## 6.0.0-alpha.9

_Nov 24, 2022_

We'd like to offer a big thanks to the 14 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce the v6 pickers, built on top of the field components [DatePicker](https://mui.com/x/react-date-pickers/date-picker/), [TimePicker](https://mui.com/x/react-date-pickers/time-picker/), [DateTimePicker](https://mui.com/x/react-date-pickers/date-time-picker/), [DateRangePicker](https://mui.com/x/react-date-pickers/date-range-picker/).

  The old (legacy) components will be removed at the end of the v6 beta.

- 💅 Add support for `theme.vars` in the pickers and the DataGrid (#6784, #6778) @alexfauquette
- ✨ Improve DataGrid theme augmentation (#5818) @iigrik
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.9` / `@mui/x-data-grid-pro@6.0.0-alpha.9` / `@mui/x-data-grid-premium@6.0.0-alpha.9`

### Breaking changes

- <kbd>Ctrl</kbd> + <kbd>Enter</kbd> will no longer toggle the master detail panel (#6945) @MBilalShafi
  You can restore the old behavior by listening to `cellKeyDown` and calling `apiRef.current.toggleDetailPanel()`.

- Remove unnecessary keyboard navigation events (#6863) @m4theushw
  The `cellNavigationKeyDown` event was removed. Use `cellKeyDown` and check the key provided in the event argument.
  The `columnHeaderNavigationKeyDown` event was removed. Use `columnHeaderKeyDown` and check the key provided in the event argument.

- Rename `rowsScroll` event to `scrollPositionChange` (#6957) @DanailH

#### Changes

- [DataGrid] Add spacing in `GridToolbar` for better visibility (#6904) @MBilalShafi
- [DataGrid] Improve typing for the theme in `styleOverrides` (#5818) @iigrik
- [DataGrid] Prevents master detail panel toggle with <kbd>Ctrl</kbd> + <kbd>Enter</kbd> (#6945) @MBilalShafi
- [DataGrid] Remove unnecessary keyboard navigation events (#6863) @m4theushw
- [DataGrid] Rename `ErrorOverlay` to `GridErrorOverlay` (#6946) @MBilalShafi
- [DataGrid] Stop exporting root base state selectors (#6912) @DanailH
- [DataGrid] Support `theme.vars` (#6784) @alexfauquette
- [DataGrid] Rename `rowsScroll` event to `scrollPositionChange` (#6957) @DanailH
- [DataGridPro] Fix lazy-loaded rows not working with `updateRows` API method (#6976) @cherniavskii
- [DataGridPremium] Improve typing for theme in `styleOverrides` (#6920) @m4theushw
- [l10n] Fix translation of `filterOperatorBefore` in Arabic (ar-SD) locale (#6884) @HassanGhazy

### `@mui/x-date-pickers@6.0.0-alpha.9` / `@mui/x-date-pickers-pro@6.0.0-alpha.9`

#### Changes

- [DatePicker] Display week number (#6144) @alexfauquette
- [pickers] Clean `PickersCalendarHeader` slots (#6943) @flaviendelangle
- [pickers] Do not loose the translations when using nested `LocalizationProvider` with each a `localeText` prop (#6895) @flaviendelangle
- [pickers] Fix calendar header switch view button hover circle (#6938) @rajendraarora16
- [pickers] Fix focus management (#6914) @alexfauquette
- [pickers] Fix usage with Shadow DOM (#6952) @flaviendelangle
- [pickers] New `MobileDateRangePicker`, `DesktopDateRangePicker`, `DateRangePicker` and `StaticDateRangePicker` based on `MultiInputDateRangeField` (#6888) @flaviendelangle
- [pickers] Support `theme.vars` (#6778) @alexfauquette

### Docs

- [docs] Add new "Expired package version" error type (#6937) @oliviertassinari
- [docs] Add support for API pages of unstable components (#6981) @flaviendelangle
- [docs] Create docs for the new date pickers (#6902) @flaviendelangle
- [docs] Create docs for the new time, date time and date range pickers (#6958) @flaviendelangle
- [docs] Fix demos live edit (#6975) @oliviertassinari
- [docs] Fix toggle button bug in demos in Custom Components page (#6913) @01zulfi
- [docs] Remove partial Portuguese and Chinese translations of the pickers pages (#6893) @flaviendelangle

### Core

- [core] Cleanup `describeValidation` (#6942) @flaviendelangle
- [core] Group renovate GitHub Action dependency updates @oliviertassinari
- [core] Introduce `x-codemod` package (#6876) @LukasTy
- [core] Update minimum supported version of Node.js to 14.0.0 (#6966) @cherniavskii
- [core] Upgrade monorepo (#6905) @cherniavskii
- [core] Upgrade node to v14.21 (#6916) @piwysocki
- [core] Upgrade ESLint (#6738) @Janpot
- [test] Test validation on date range view (#6941) @alexfauquette

## 6.0.0-alpha.8

_Nov 17, 2022_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Support aggregating data from multiple row fields (#6656) @cherniavskii
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.8` / `@mui/x-data-grid-pro@6.0.0-alpha.8` / `@mui/x-data-grid-premium@6.0.0-alpha.8`

#### Changes

- [DataGrid] Fix `ErrorOverlay` not receiving defined input props (#6819) @banoth-ravinder
- [DataGrid] Fix conflict with the latest version of `@types/react` (#6797) @izv
- [DataGrid] Make more `apiRef` methods private (#6700) @cherniavskii
- [DataGrid] Provide a clear error message when upgrading (#6685) @oliviertassinari
- [DataGridPremium] Allow to customize the indent of group expansion toggle (#6837) @MBilalShafi
- [DataGridPremium] Support aggregating data from multiple row fields (#6656) @cherniavskii
- [DataGridPro] Fix detail panel not working with `getRowSpacing` prop (#6707) @cherniavskii
- [DataGridPro] Opt-out for column jump back on re-order (#6733) @gavbrennan
- [l10n] Improve Finnish (fi-FI) locale (#6859) @RainoPikkarainen

### `@mui/x-date-pickers@6.0.0-alpha.8` / `@mui/x-date-pickers-pro@6.0.0-alpha.8`

#### Breaking changes

- The `ClockPicker` view component has been renamed to `TimeClock` to better fit its usage:

  ```diff
  -<ClockPicker {...props} />
  +<TimeClock {...props} />
  ```

  Component name in the theme has changed as well:

  ```diff
  -MuiClockPicker: {
  +MuiTimeClock: {
  ```

#### Changes

- [pickers] Fix typing and prop drilling on `DateRangeCalendar` and multi input range fields (#6852) @flaviendelangle
- [pickers] Pass the `ampm` prop from the new pickers to their field (#6868) @flaviendelangle
- [pickers] Rename `CalendarPickerView`, `ClockPickerView` and `CalendarOrClockPickerView` (#6855) @flaviendelangle
- [pickers] Rename `ClockPicker` into `TimeClock` (#6851) @flaviendelangle

### Docs

- [docs] Add `dayjs` to the dependencies (#6862) @m4theushw
- [docs] Clarify how the Row Pinning works with other features of the DataGrid (#6853) @cherniavskii
- [docs] Fix typo in Export page (#6848) @m4theushw
- [docs] Group picker pages (#6369) @flaviendelangle
- [docs] Remove default prop and improve format (#6781) @oliviertassinari
- [docs] Sync prism-okaidia.css with source (#6820) @oliviertassinari

### Core

- [core] Convert scripts to ESM (#6789) @LukasTy
- [core] Feedback on branch protection @oliviertassinari
- [core] Fix `test-types` out of memory error (#6850) @LukasTy
- [core] Import from `@mui/utils` instead of `@mui/material/utils` (#6816) @cherniavskii
- [core] Show the whole version to make blame easier @oliviertassinari
- [core] Small changes on new pickers internals (#6840) @flaviendelangle
- [core] Remove prettier scripts (#6815) @Janpot
- [license] Polish error messages (#6881) @oliviertassinari
- [test] Verify `onError` call on the pickers (#6771) @alexfauquette

## 6.0.0-alpha.7

_Nov 10, 2022_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- ⚙️ Removed everything marked as `@deprecated`
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.7` / `@mui/x-data-grid-pro@6.0.0-alpha.7` / `@mui/x-data-grid-premium@6.0.0-alpha.7`

#### Changes

- [DataGrid] Fix cell focus causing scroll jump when virtualization enabled (#6785) @yaredtsy
- [DataGrid] Remove items marked as `@deprecated` (#6505) @DanailH

### `@mui/x-date-pickers@6.0.0-alpha.7` / `@mui/x-date-pickers-pro@6.0.0-alpha.7`

#### Changes

- [fields] Rename section names to match the picker view nomenclature (#6779) @flaviendelangle
- [pickers] Fix pickers toolbar styling (#6793) @LukasTy
- [pickers] Improve validation JSDoc descriptions (#6777) @flaviendelangle
- [pickers] New `MobileDateTimePicker`, `DesktopDateTimePicker`, `DateTimePicker` and `StaticDateTimePicker` based on `DateTimeField` (#6767) @flaviendelangle
- [pickers] New `MobileTimePicker`, `DesktopTimePicker`, `TimePicker` and `StaticTimePicker` based on `TimeField` (#6728) @flaviendelangle
- [pickers] Support the `onError` prop and add context on the `onChange` prop (#6731) @flaviendelangle

### Docs

- [docs] Add missing Pro header suffix (#6775) @oliviertassinari
- [docs] Upgrade to Next.js 13 (#6790) @cherniavskii

### Core

- [core] Add OSSF Scorecard action (#6760) @oliviertassinari
- [core] Fix Pinned-Dependencies @oliviertassinari
- [core] Fix Scorecard fail Action @oliviertassinari
- [core] Pin GitHub Action dependencies (#6739) @renovate[bot]
- [core] Remove default access to GitHub action scopes @oliviertassinari
- [test] Fix test case name: Pro-> Premium @oliviertassinari

## 6.0.0-alpha.6

_Nov 4, 2022_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Allow non-controlled usage of the calendar components (#6643) @flaviendelangle

  ```tsx
  <DateCalendar defaultValue={dayjs()} />
  <MonthCalendar defaultValue={dayjs()} />
  <YearCalendar defaultValue={dayjs()} />
  ```

- 🌍 Add Ukrainian (uk-UA) locale to pickers (#6661) @Dufran
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.6` / `@mui/x-data-grid-pro@6.0.0-alpha.6` / `@mui/x-data-grid-premium@6.0.0-alpha.6`

#### Breaking changes

- The `disableIgnoreModificationsIfProcessingProps` prop has been removed and its behavior when `true` was incorporated as the default behavior.
  The old behavior can be restored by using `apiRef.current.stopRowEditMode({ ignoreModifications: true })` or `apiRef.current.stopCellEditMode({ ignoreModifications: true })`.

#### Changes

- [DataGrid] Add `rowSelection` prop (#6499) @m4theushw
- [DataGrid] Avoid future regression with React 19 (#6638) @oliviertassinari
- [DataGrid] Refactor `@mui/material` imports to `@mui/utils` (#6569) @LukasTy
- [DataGrid] Remove `disableIgnoreModificationsIfProcessingProps` prop (#6640) @m4theushw
- [DataGrid] Separate private and public `apiRef` properties (#6388) @cherniavskii

### `@mui/x-date-pickers@6.0.0-alpha.6` / `@mui/x-date-pickers-pro@6.0.0-alpha.6`

#### Changes

- [DateRangePicker] Fix input focused style and mobile behavior (#6645) @LukasTy
- [fields] Update sections when the locale changes (#6649) @flaviendelangle
- [pickers] Add Ukrainian (uk-UA) locale (#6661) @Dufran
- [pickers] Allow non-controlled usage of the calendar components (#6643) @flaviendelangle
- [pickers] Export other adapters derived from moment or date-fns (#6571) @alexfauquette
- [pickers] New `MobileDatePicker` and `DatePicker` based on `DateField` (#6690) @flaviendelangle
- [pickers] New `StaticDatePicker` component (#6708) @flaviendelangle
- [pickers] Rename `inputFormat` prop to `format` on the new pickers (#6722) @flaviendelangle

### Core

- [core] Fix `typescript:ci` failures (#6705) @LukasTy
- [core] Fixes for upcoming eslint upgrade (#6667) @Janpot
- [core] Pin GitHub Action to digests (#6683) @oliviertassinari

## 6.0.0-alpha.5

_Oct 31, 2022_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- ⚡ Fix memory leak during unmount of the DataGrid (#6620) @cherniavskii
- 📝 New guide for migrating pickers from v5 to v6 (#6472) @flaviendelangle
- 🎁 Allow to disable the autofocus of the search field when opening the column visibility panel (#6444) @e-cloud
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.5` / `@mui/x-data-grid-pro@6.0.0-alpha.5` / `@mui/x-data-grid-premium@6.0.0-alpha.5`

#### Breaking changes

- Stop exporting `gridColumnsSelector` (#6693) @m4theushw

  The `gridColumnsSelector` was deprecated during v5 and is now removed from the export list.

  Please consider using one of the following selectors as a replacement:

  - `gridColumnFieldsSelector`, to obtain the column fields in the order they appear on the screen;
  - `gridColumnLookupSelector`, to access column definitions by field;
  - `gridColumnVisibilityModelSelector`, for the visibility state of each column.

#### Changes

- [DataGrid] Allow to disable autofocusing the search field in the columns panel (#6444) @e-cloud
- [DataGrid] Fix `setRows` method not persisting new rows data after `loading` prop change (#6493) @cherniavskii
- [DataGrid] Fix memory leak on grid unmount (#6620) @cherniavskii
- [DataGrid] Rename `GridColumnsState['all']` to `GridColumnsState['orderedFields']` (#6562) @DanailH
- [DataGrid] Remove `React.memo` from `GridCellCheckboxRenderer` (#6655) @mattcorner
- [DataGrid] Stop exporting `gridColumnsSelector` (#6693)
- [l10n] Improve Bulgarian (bg-BG) locale (#6578) @AtanasVA

### `@mui/x-date-pickers@6.0.0-alpha.5` / `@mui/x-date-pickers-pro@6.0.0-alpha.5`

#### Breaking changes

- [pickers] Rename remaining `private` components (#6550) @LukasTy
  Previously we had 4 component names with `Private` prefix in order to avoid breaking changes in v5.
  These components were renamed:

  - `PrivatePickersMonth` -> `MuiPickersMonth`
  - `PrivatePickersSlideTransition` -> `MuiPickersSlideTransition`
  - `PrivatePickersToolbarText` -> `MuiPickersToolbarText`
  - `PrivatePickersYear` -> `MuiPickersYear`

  Manual style overriding will need to use updated classes:

  ```diff
  -.PrivatePickersMonth-root {
  +.MuiPickersMonth-root {

  -.PrivatePickersSlideTransition-root {
  +.MuiPickersSlideTransition-root {

  -.PrivatePickersToolbarText-root {
  +.MuiPickersToolbarText-root {

  -.PrivatePickersYear-root {
  +.MuiPickersYear-root {
  ```

  Component name changes are also reflected in `themeAugmentation`:

  ```diff
   const theme = createTheme({
     components: {
  -    PrivatePickersMonth: {
  +    MuiPickersMonth: {
         // overrides
       },
  -    PrivatePickersSlideTransition: {
  +    MuiPickersSlideTransition: {
         // overrides
       },
  -    PrivatePickersToolbarText: {
  +    MuiPickersToolbarText: {
        // overrides
       },
  -    PrivatePickersYear: {
  +    MuiPickersYear: {
         // overrides
       },
     },
   });
  ```

#### Changes

- [DateTimePicker] Fix toolbar time order when `theme.rtl=true` (#6636) @alexfauquette
- [pickers] Import fixes for mask editing (#6623) @alexfauquette
- [pickers] Rename remaining `private` components (#6550) @LukasTy
- [pickers] New `DesktopDatePicker` based on `DateField` (#6548) @flaviendelangle

### Docs

- [docs] Add feedback in next doc (#6591) @alexfauquette
- [docs] Check link validity in PR (#6497) @alexfauquette
- [docs] Disable translations (#6560) @cherniavskii
- [docs] Fix typo in DataGrid demo page (#6632) @banoth-ravinder
- [docs] New page to migrate pickers from v5 to v6 (#6472) @flaviendelangle
- [docs] Remove broken welcome page (#6585) @alexfauquette
- [docs] Mark data grid column group as available (#6660) @alexfauquette
- [docs] Fix double space @oliviertassinari

### Core

- [core] Fix duplicate CodeQL build @oliviertassinari
- [core] Fix spreading on validation page (#6624) @flaviendelangle
- [core] Small TypeScript improvements (#6575) @flaviendelangle
- [core] Upgrade monorepo (#6594) @oliviertassinari
- [core] Change reproduction position (#6621) @oliviertassinari
- [core] Fix permissions in `no-response` workflow (#6658) @cherniavskii
- [core] Remove legacy migration function (#6669) @oliviertassinari
- [license] Improve the license content (#6459) @oliviertassinari
- [test] Test Arrow up/down on every token (#6563) @alexfauquette

## 6.0.0-alpha.4

_Oct 20, 2022_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 📝 Manage pickers' toolbar customization with slots
- 🐞 Bugfixes
- 🌍 Improve Turkish (tr-TR) locale on the data grid and pickers (#6542) @ramazansancar

### `@mui/x-data-grid@6.0.0-alpha.4` / `@mui/x-data-grid-pro@6.0.0-alpha.4` / `@mui/x-data-grid-premium@6.0.0-alpha.4`

#### Breaking changes

- To avoid confusion with the props that will be added for the cell selection feature, some props related to row selection were renamed to have "row" in their name.
  The renamed props are the following:

  | Old name                   | New name                      |
  | :------------------------- | :---------------------------- |
  | `selectionModel`           | `rowSelectionModel`           |
  | `onSelectionModelChange`   | `onRowSelectionModelChange`   |
  | `disableSelectionOnClick`  | `disableRowSelectionOnClick`  |
  | `disableMultipleSelection` | `disableMultipleRowSelection` |

- The `gridSelectionStateSelector` selector was renamed to `gridRowSelectionStateSelector`.

- The `selectionChange` event was renamed to `rowSelectionChange`.

#### Changes

- [DataGrid] Add `searchPredicate` prop to `GridColumnsPanel` component (#6557) @cherniavskii
- [DataGrid] Support keyboard navigation in column group header (#5947) @alexfauquette
- [DataGrid] Fix grid not updating state on `rowCount` prop change (#5982) @cherniavskii
- [DataGrid] Rename selection props (#6556) @m4theushw
- [l10n] Improve Turkish (tr-TR) locale on the data grid and pickers (#6542) @ramazansancar

### `@mui/x-date-pickers@6.0.0-alpha.4` / `@mui/x-date-pickers-pro@6.0.0-alpha.4`

#### Breaking changes

- The `ToolbarComponent` has been replaced by a `Toolbar` component slot.
  You can find more information about this pattern in the [Base UI documentation](https://mui.com/base-ui/getting-started/usage/#shared-props):

  ```diff
   // Same on all other pickers
   <DatePicker
  -  ToolbarComponent: MyToolbar,
  +  components={{ Toolbar: MyToolbar }}
   />
  ```

- The `toolbarPlaceholder` and `toolbarFormat` props have been moved to the `toolbar` components props slot:

  ```diff
   // Same on all other pickers
   <DatePicker
  -  toolbarPlaceholder="__"
  -  toolbarFormat="DD / MM / YYYY"
  +  componentsProps={{
  +    toolbar: {
  +      toolbarPlaceholder: '__',
  +      toolbarFormat: 'DD / MM / YYYY',
  +    }
  +  }}
   />
  ```

- The `toolbarTitle` prop has been moved to the localization object:

  ```diff
   // Same on all other pickers
   <DatePicker
  -  toolbarTitle="Title"
  +  localeText={{ toolbarTitle: 'Title' }}
   />
  ```

- The toolbar related translation keys have been renamed to better fit their usage:

  ```diff
   <LocalizationProvider
     localeText={{
  -    datePickerDefaultToolbarTitle: 'Date Picker',
  +    datePickerToolbarTitle: 'Date Picker',

  -    timePickerDefaultToolbarTitle: 'Time Picker',
  +    timePickerToolbarTitle: 'Time Picker',

  -    dateTimePickerDefaultToolbarTitle: 'Date Time Picker',
  +    dateTimePickerToolbarTitle: 'Date Time Picker',

  -    dateRangePickerDefaultToolbarTitle: 'Date Range Picker',
  +    dateRangePickerToolbarTitle: 'Date Range Picker',
     }}
   />
  ```

- The `onChange` / `openView` props on the toolbar have been renamed `onViewChange` / `view`

#### Changes

- [fields] Add a `validationError` property to the `onChange` callback (#6539) @flaviendelangle
- [fields] Distinguish start and end input error on multi input fields (#6503) @flaviendelangle
- [pickers] Clean the `Tabs` component slot (#6543) @flaviendelangle
- [pickers] Fix localization of the placeholder (#6547) @alexfauquette
- [pickers] Fix TypeScript issues (#6322) @flaviendelangle
- [pickers] Improve error consistency between single and multiple range pickers (#6561) @alexfauquette
- [pickers] Refactor `@mui/material` imports to `@mui/utils` (#6443) @LukasTy
- [pickers] Replace toolbar's props by a component slot (#6445) @flaviendelangle

### Docs

- [docs] Enable inlined preview for disabled date picker (#6477) @oliviertassinari
- [docs] Fix 404 errors (#6541) @alexfauquette
- [docs] Fix broken links on field pages (#6501) @flaviendelangle
- [docs] Improve markdownlint (#6518) @oliviertassinari

### Core

- [core] Run CodeQL only on schedule @oliviertassinari
- [core] Fix trailing spaces and git diff format (#6523) @oliviertassinari
- [core] Harden GitHub Actions permissions (#6396) @step-security-bot
- [core] Improve the playground DX (#6514) @oliviertassinari
- [core] Link Netlify in the danger comment (#6513) @oliviertassinari
- [core] Organize tests for pickers slots (#6546) @flaviendelangle
- [core] Remove outdated `docsearch.js` dependency (#6242) @oliviertassinari
- [core] Upgrade monorepo (#6549) @cherniavskii
- [test] Add validation test on range pickers (#6504) @alexfauquette
- [test] Remove BrowserStack (#6263) @DanailH

## 6.0.0-alpha.3

_Oct 13, 2022_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- ⌚️ New components to edit date and time with <kbd>keyboard</kbd>—without using any modal or dropdown UI.
  Please check out our [documentation](https://mui.com/x/react-date-pickers/fields/) to discover those new components.

  - [`DateField`](https://mui.com/x/react-date-pickers/date-field/) to edit date
  - [`TimeField`](https://mui.com/x/react-date-pickers/time-field/) to edit time
  - [`DateTimeField`](https://mui.com/x/react-date-pickers/date-time-field/) to edit date and time
  - [`MultiInputDateRangeField` / `SingleInputDateRangeField`](https://mui.com/x/react-date-pickers/date-range-field/) to edit date range
  - [`MultiInputTimeRangeField`](https://mui.com/x/react-date-pickers/time-range-field/) to edit time range with two inputs
  - [`MultiInputDateTimeRangeField`](https://mui.com/x/react-date-pickers/date-time-range-field/) to edit date and time range with two inputs

  ⚠️ These components are unstable.
  They might receive breaking changes on their props to have the best components possible by the time of the stable release.

- 📝 Allow to limit to one filter per column for `DataGridPro` and `DataGridPremium` (#6333) @MBilalShafi
- 📚 New [page describing the validation props on each picker](https://mui.com/x/react-date-pickers/validation/) (#6064) @flaviendelangle
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.3` / `@mui/x-data-grid-pro@6.0.0-alpha.3` / `@mui/x-data-grid-premium@6.0.0-alpha.3`

#### Breaking changes

- [DataGrid] Remove legacy editing API

  The editing API that is enabled by default was replaced with a new API that contains better support for server-side persistence, validation and customization. This new editing feature was already available in v5 under the `newEditingApi` experimental flag. In v6, this flag can be removed.

  ```diff
   <DataGrid
  -  experimentalFeatures={{ newEditingApi: true }}
   />
  ```

  For users that didn't migrate to the new editing API in v5, additional work may be needed because the new API is not equivalent to the legacy API. Although, some migration steps are available to help in this task.

  - The `editCellPropsChange` event was removed. If you still need it please file a new issue so we can propose an alternative.
  - The `cellEditCommit` event was removed and the `processRowUpdate` prop can be used in place. More information, check the [docs](https://mui.com/x/react-data-grid/editing/#persistence) section about the topic.
  - The `editRowsModel` and `onEditRowsModelChange` props were removed. The [`cellModesModel`](https://mui.com/x/react-data-grid/editing/#controlled-mode) or [`rowModesModel`](https://mui.com/x/react-data-grid/editing/#controlled-mode) props can be used to achieve the same goal.
  - The following API methods were removed:
    - Use `apiRef.current.stopCellEditMode` to replace `apiRef.current.commitCellChange`
    - Use `apiRef.current.startCellEditMode` to replace `apiRef.current.setCellMode(id, field, 'edit')`
    - Use `apiRef.current.stopRowEditMode` to replace `apiRef.current.commitRowChange`
    - Use `apiRef.current.startRowMode` to replace `apiRef.current.setRowMode(id, 'edit')`
    - Use the [`cellModesModel`](https://mui.com/x/react-data-grid/editing/#controlled-mode) or [`rowModesModel`](https://mui.com/x/react-data-grid/editing/#controlled-mode) props to replace `apiRef.current.setEditRowsModel`

#### Changes

- [DataGrid] Fix start edit mode with printable character in React 18 (#6257) @m4theushw
- [DataGrid] Remove legacy editing API (#6016) @m4theushw
- [DataGrid] Simplify `useGridApiContext` and `useGridApiRef` type overrides (#6423) @cherniavskii
- [DataGrid] Use generics instead of verbose state overrides (#6409) @cherniavskii
- [DataGridPro] Allow to limit to one filter per column (#6333) @MBilalShafi

### `@mui/x-date-pickers@6.0.0-alpha.3` / `@mui/x-date-pickers-pro@6.0.0-alpha.3`

#### Breaking changes

- All the props used by the mobile and desktop wrappers to override components or components' props have been replaced by component slots. You can find more information about this pattern in the [Base UI documentation](https://mui.com/base-ui/getting-started/usage/#shared-props).

  Some of the names have also been prefixed by `desktop` when it was unclear that the behavior was only applied on the desktop version of the pickers (or the responsive version when used on a desktop).

  The `DialogProps` prop has been replaced by a `dialog` component props slot on responsive and mobile pickers:

  ```diff
   // Same on MobileDatePicker, DateTimePicker, MobileDateTimePicker,
   // TimePicker, MobileTimePicker, DateRangePicker and MobileDateRangePicker.
   <DatePicker
  -  DialogProps={{ backgroundColor: 'red' }}
  +  componentsProps={{ dialog: { backgroundColor: 'red' }}}
   />
  ```

  The `PaperProps` prop has been replaced by a `desktopPaper` component props slot on all responsive and desktop pickers:

  ```diff
   // Same on DesktopDatePicker, DateTimePicker, DesktopDateTimePicker,
   // TimePicker, DesktopTimePicker, DateRangePicker and DesktopDateRangePicker.
   <DatePicker
  -  PaperProps={{ backgroundColor: 'red' }}
  +  componentsProps={{ desktopPaper: { backgroundColor: 'red' }}}
   />
  ```

  The `PopperProps` prop has been replaced by a `popper` component props slot on all responsive and desktop pickers:

  ```diff
   // Same on DesktopDatePicker, DateTimePicker, DesktopDateTimePicker,
   // TimePicker, DesktopTimePicker, DateRangePicker and DesktopDateRangePicker.
   <DatePicker
  -  PopperProps={{ onClick: handleClick }}
  +  componentsProps={{ popper: { onClick: handleClick }}}
   />
  ```

  The `TransitionComponent` prop has been replaced by a `DesktopTransition` component slot on all responsive and desktop pickers:

  ```diff
   // Same on DesktopDatePicker, DateTimePicker, DesktopDateTimePicker,
   // TimePicker, DesktopTimePicker, DateRangePicker and DesktopDateRangePicker.
   <DatePicker
  -  TransitionComponent={Fade}
  +  components={{ DesktopTransition: Fade }}
   />
  ```

  The `TrapFocusProps` prop has been replaced by a `desktopTrapFocus` component props slot on all responsive and desktop pickers:

  ```diff
   // Same on DesktopDatePicker, DateTimePicker, DesktopDateTimePicker,
   // TimePicker, DesktopTimePicker, DateRangePicker and DesktopDateRangePicker.
   <DatePicker
  -  TrapFocusProps={{ isEnabled: () => false }}
  +  componentsProps={{ desktopTrapFocus: { isEnabled: () => false }}}
   />
  ```

- The view components allowing to pick a date or parts of a date without an input have been renamed to better fit their usage:

  ```diff
  -<CalendarPicker {...props} />
  +<DateCalendar {...props} />
  ```

  ```diff
  -<DayPicker {...props} />
  +<DayCalendar {...props} />
  ```

  ```diff
  -<CalendarPickerSkeleton {...props} />
  +<DayCalendarSkeleton {...props} />
  ```

  ```diff
  -<MonthPicker {...props} />
  +<MonthCalendar {...props} />
  ```

  ```diff
  -<YearPicker {...props} />
  +<YearCalendar {...props} />
  ```

- Component names in the theme have changed as well:

  ```diff
  -MuiCalendarPicker: {
  +MuiDateCalendar: {
  ```

  ```diff
  -MuiDayPicker: {
  +MuiDayCalendar: {
  ```

  ```diff
  -MuiCalendarPickerSkeleton: {
  +MuiDayCalendarSkeleton: {
  ```

  ```diff
  -MuiMonthPicker: {
  +MuiMonthCalendar: {
  ```

  ```diff
  -MuiYearPicker: {
  +MuiYearCalendar: {
  ```

#### Changes

- [DatePicker] Allows to fix the number of week displayed (#6299) @alexfauquette
- [DateRangePicker] Fix calendar day outside of month layout shifting on hover (#6448) @alexfauquette
- [fields] New components: `MultiInputDateTimeRangePicker` and `MultiInputTimeRangePicker` (#6392) @alexfauquette
- [fields] Prepare the field exports for the public release (#6467) @flaviendelangle
- [fields] Support paste in single section (#6422) @alexfauquette
- [pickers] Add field placeholders to the locale (#6337) @flaviendelangle
- [pickers] Do not use `Partial` for `components` and `componentsProps` props (#6463) @flaviendelangle
- [pickers] New component: `DateRangeCalendar` (#6416) @flaviendelangle
- [pickers] Replace the `Picker` prefix in the view component by `Calendar` (eg: `MonthPicker` => `MonthCalendar`) (#6389) @flaviendelangle
- [pickers] Support pasting on fields (#6364) @flaviendelangle
- [pickers] Use slots in the mobile and desktop wrappers instead of `XXXComponent` and `XXXProps` (#6381) @flaviendelangle

### Docs

- [docs] Add migration to DataGrid v6 page (#6235) @m4theushw
- [docs] Create first publishable version of the field doc (#6323) @flaviendelangle
- [docs] Fix trailing spaces in the readme @oliviertassinari
- [docs] New page for the pickers: Validation (#6064) @flaviendelangle
- [docs] Organize migration pages (#6480) @flaviendelangle

### Core

- [core] Add CodeQL workflow (#6387) @DanailH
- [core] Add missing breaking change to the changelog (#6471) @flaviendelangle
- [core] Fix playground structure (#6466) @LukasTy
- [core] Fix tests for pasting on fields (#6465) @flaviendelangle
- [core] Remove absolute link (#6420) @flaviendelangle
- [core] Remove unused `react-text-mask` package (#6408) @LukasTy
- [core] Send explicit warning when dayjs locale is not found (#6424) @alexfauquette
- [core] Test validation on textfield and date views (#6265) @alexfauquette
- [test] Sync comment with monorepo @oliviertassinari

## 6.0.0-alpha.2

_Oct 7, 2022_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Further progress on stabilizing new date field components
- 🎁 Improve support for theme augmentation in the DataGrid (#6269) @cherniavskii
- 🌍 Add Japanese (ja-JP) locale to pickers (#6365) @sho918
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.2` / `@mui/x-data-grid-pro@6.0.0-alpha.2` / `@mui/x-data-grid-premium@6.0.0-alpha.2`

#### Breaking changes

- 🎁 The aggregation is no longer experimental.

  You can now use the aggregation without the `experimentalFeatures.aggregation` flag enabled.

  ```diff
   <DataGridPremium
  -  experimentalFeatures={{ aggregation: true }}
   />
  ```

  The aggregation of the columns through the column menu is now enabled by default on `DataGridPremium`. You can set `disableAggregation={true}` to disable it.

#### Changes

- [DataGrid] Add filter item ID to `.MuiDataGrid-filterForm` (#6313) @m4theushw
- [DataGrid] Add missing `valueOptions` (#6401) @DanailH
- [DataGrid] Don't start edit mode when pressing Shift + Space (#6228) @m4theushw
- [DataGrid] Fix error when using column grouping with all columns hidden (#6405) @alexfauquette
- [DataGrid] Pass generics to the components in the theme augmentation (#6269) @cherniavskii
- [DataGridPremium] Remove the aggregation from the experimental features (#6372) @flaviendelangle

### `@mui/x-date-pickers@6.0.0-alpha.2` / `@mui/x-date-pickers-pro@6.0.0-alpha.2`

#### Breaking changes

- The `renderDay` prop has been replaced by a `Day` component slot.
  You can find more information about this pattern in the [Base UI documentation](https://mui.com/base-ui/getting-started/usage/#shared-props).

  ```diff
   // Same for any other date, date time or date range picker.
   <DatePicker
  -  renderDay={(_, dayProps) => <CustomDay {...dayProps} />}
  +  components={{ Day: CustomDay }}
   />
  ```

#### Changes

- [DateRangePicker] Fix the shape of the first selected day when the start date has an hour set (#6403) @flaviendelangle
- [l10n] Add Japanese (ja-JP) locale to pickers (#6365) @sho918
- [DateRangePicker] Force focus to stay on inputs (#6324) @alexfauquette
- [pickers] Improve edition on field components (#6339) @flaviendelangle
- [pickers] Improve field selection behaviors (#6317) @flaviendelangle
- [pickers] Replace the `renderDay` prop with a `Day` component slot (#6293) @flaviendelangle

### Docs

- [docs] Apply style guide to Data Grid Aggregation page (#5781) @samuelsycamore
- [docs] Fix code examples of editing cells (#6004) @TiagoPortfolio
- [docs] Fix customized day rendering demo style (#6342) (#6399) @Ambrish-git
- [docs] Implement Style Guide on "Advanced" Data Grid doc pages (#6331) @samuelsycamore
- [docs] Use components instead of demos for `SelectorsDocs` (#6103) @flaviendelangle
- [license] Add new license status 'Out of scope' (#5260) @flaviendelangle

### Core

- [core] Speedup of yarn install in the CI (#6395) @oliviertassinari
- [test] Remove redundant test clean-ups (#6377) @oliviertassinari
- [test] Replace `React.render` with `React.createRoot` in e2e tests (#6393) @m4theushw

## 6.0.0-alpha.1

_Sep 29, 2022_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Better support for custom overlays (#5808) @cherniavskii
- 🖨️ Improve print export (#6273) @oliviertassinari
- 🎁 Reduce confusion when initializing pickers with a date value (#6170) @flaviendelangle
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.1` / `@mui/x-data-grid-pro@6.0.0-alpha.1` / `@mui/x-data-grid-premium@6.0.0-alpha.1`

#### Breaking changes

- New internal rows structure for v6 (#4927) @flaviendelangle

  Some selectors related to the rows have been renamed to better describe the type of rows they are returning:

  ```diff
  -const result = gridRowsIdToIdLookupSelector(apiRef);
  +const result = gridRowsDataRowIdToIdLookupSelector(apiRef);
  ```

  ```diff
  -const result = gridRowTreeDepthSelector(apiRef);
  +const result = gridRowMaximumTreeDepthSelector(apiRef);
  ```

  The format of the tree nodes (the element accessible in `params.node` or with the `apiRef.current.getRowNode` method) have changed.
  You have a new `type` property, which can be useful, for example, to apply custom behavior on groups.
  Here is an example of the old and new approach showing how to apply a custom value formatter in groups for the grouping column:

  ```diff
   <DataGridPremium
     groupingColDef={() => ({
       valueFormatter: (params) => {
         if (params.id == null) {
           return params.value;
         }

         const rowNode = apiRef.current.getRowNode(params.id!)!;
  -      if (rowNode.children?.length) {
  +      if (rowNode.type === 'group') {
           return `by ${rowNode.groupingKey ?? ''}`;
         }

         return params.value;
       }
     })}
   />
  ```

- The `GridFeatureModeConstant` constant no longer exists (#6077) @DanailH

  ```diff
  -import { GridFeatureModeConstant } from '@mui/x-data-grid';
  ```

#### Changes

- [DataGrid] Fix `GridPagination` props typing (#6238) @cherniavskii
- [DataGrid] Fix `GridRow` not forwarding `ref` to the root element (#6274) @cherniavskii
- [DataGrid] Fix `undefined` value being showed in filter button tooltip text (#6259) @cherniavskii
- [DataGrid] Fix blank space when changing page with dynamic row height (#6049) @m4theushw
- [DataGrid] New internal rows structure for v6 (#4927) @flaviendelangle
- [DataGrid] Revert cell/row mode if `processRowUpdate` fails (#6185) @m4theushw
- [DataGrid] Rework overlays layout (#5808) @cherniavskii
- [DataGrid] Improve print support (#6273) @oliviertassinari
- [DataGridPremium] Add missing `themeAugmentation` module (#6270) @cherniavskii

### `@mui/x-date-pickers@6.0.0-alpha.1` / `@mui/x-date-pickers-pro@6.0.0-alpha.1`

#### Breaking changes

- The `value` prop of the pickers now expects a parsed value.

  Until now, it was possible to provide any format that your date management library was able to parse.
  For instance, you could pass `value={new Date()}` when using `AdapterDayjs`.

  This brought a lot of confusion so we decided to remove this behavior.
  The format expected by the `value` prop is now the same as for any other prop holding a date.
  Here is the syntax to initialize a date picker at the current date for each adapter:

  ```tsx
  // Date-fns
  <DatePicker value={new Date()} />;

  // Dayjs
  import dayjs from 'dayjs';
  <DatePicker value={dayjs()} />;

  // Moment
  import moment from 'moment';
  <DatePicker value={moment()} />;

  // Luxon
  import { DateTime } from 'luxon';
  <DatePicker value={DateTime.now()} />;
  ```

#### Changes

- [DatePicker] Respect `minDate` and `maxDate` when opening a `DatePicker` or `DateTimePicker` (#6309) @alexfauquette
- [DateTimePicker] Fix validation with `shouldDisableMonth` and `shouldDisableYear` (#6266) @flaviendelangle
- [TimePicker] Add support for `disablePast` and `disableFuture` validation props (#6226) @LukasTy
- [CalendarPicker] Prevent getting focus when `autoFocus=false` (#6304) @alexfauquette
- [DateField] Extend moment adapter to support `expandFormat` and `formatTokenMap` (#6215) @alexfauquette
- [pickers] Allow to control the selected sections (#6209, #6307) @flaviendelangle
- [pickers] Do not loose the value of date sections not present in the format in the new field components (#6141) @flaviendelangle
- [pickers] Do not support unparsed date formats anymore (#6170) @flaviendelangle
- [pickers] Support slots on the `DateField` component (#6048) @flaviendelangle
- [pickers] Support Luxon v3 in `AdapterLuxon` (#6069) @alexfauquette
- [pickers] New components `TimeField` and `DateTimeField` (#6312) @flaviendelangle
- [pickers] Support basic mobile edition on new field components (#5958) @flaviendelangle

### Docs

- [docs] Fix issue in DataGrid/DataGridPro row styling demo (#6264) @MBilalShafi
- [docs] Improve pickers Getting Started examples (#6292) @flaviendelangle
- [docs] Pass model change callbacks in controlled grid editing demos (#6296) @cherniavskii
- [docs] Update the CodeSandbox to use the `next` branch (#6275) @oliviertassinari

### Core

- [core] Fix typing error (#6291) @flaviendelangle
- [core] Fix typo in the state updater of `useField` (#6311) @flaviendelangle
- [core] Remove `GridFeatureModeConstant` (#6077) @DanailH
- [core] Simplify testing architecture (#6043) @flaviendelangle
- [test] Skip test in Chrome non-headless and Edge (#6318) @m4theushw

## 6.0.0-alpha.0

_Sep 22, 2022_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add a `localeText` prop to all pickers to customize the translations (#6212) @flaviendelangle
- 🌍 Add Finnish (fi-FI) locale to the pickers (#6219) @PetroSilenius
- 🌍 Add Persian (fa-IR) locale to the pickers (#6181) @fakhamatia
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@6.0.0-alpha.0` / `@mui/x-data-grid-pro@6.0.0-alpha.0` / `@mui/x-data-grid-premium@6.0.0-alpha.0`

#### Breaking changes

- The deprecated `hide` column property has been removed in favor of the `columnVisibilityModel` prop and initial state.

  ```diff
   <DataGrid
     columns={[
       field: 'id,
  -    hide: true,
     ]}
  +  initialState={{
  +    columns: {
  +      columnVisibilityModel: { id: false },
  +    },
  +  }}
   />
  ```

  You can find more information about this new API on our [documentation](https://mui.com/x/react-data-grid/column-visibility/).

- The `GridEvents` enum is now a TypeScript type.

  ```diff
  -apiRef.current.subscribeEvent(GridEvents.rowClick', handleRowClick);
  +apiRef.current.subscribeEvent('rowClick', handleRowClick);
  ```

#### Changes

- [DataGrid] Do not publish `cellFocusOut` event if the row was removed (#6251) @cherniavskii
- [DataGrid] Fix scroll anchoring with master details (#6054) @oliviertassinari
- [DataGrid] Improve Polish (pl-PL) locale on the data grid (#6245) @grzegorz-bach
- [DataGrid] Remove the `GridEvents` enum (#6003) @flaviendelangle
- [DataGrid] Remove the deprecated `hide` column property (#5999) @flaviendelangle

### `@mui/x-date-pickers@6.0.0-alpha.0` / `@mui/x-date-pickers-pro@6.0.0-alpha.0`

#### Breaking changes

- All the deprecated props that allowed you to set the text displayed in the pickers have been removed.

  You can now use the `localText` prop available on all picker components:

  | Removed prop                 | Property in the new `localText` prop                                              |
  | :--------------------------- | :-------------------------------------------------------------------------------- |
  | `endText`                    | `end`                                                                             |
  | `getClockLabelText`          | `clockLabelText`                                                                  |
  | `getHoursClockNumberText`    | `hoursClockNumberText`                                                            |
  | `getMinutesClockNumberText`  | `minutesClockNumberText`                                                          |
  | `getSecondsClockNumberText`  | `secondsClockNumberText`                                                          |
  | `getViewSwitchingButtonText` | `calendarViewSwitchingButtonAriaLabel`                                            |
  | `leftArrowButtonText`        | `openPreviousView` (or `previousMonth` when the button changes the visible month) |
  | `rightArrowButtonText`       | `openNextView` (or `nextMonth` when the button changes the visible month)         |
  | `startText`                  | `start`                                                                           |

  For instance if you want to replace the `startText` / `endText`

  ```diff
   <DateRangePicker
  -  startText="From"
  -  endText="To"
  +  localeText={{
  +    start: 'From',
  +    end: 'To',
  +  }}
   />
  ```

You can find more information about the new api, including how to set those translations on all your components at once in the [documentation](https://mui.com/x/react-date-pickers/localization/)

- The deprecated `locale` prop of the `LocalizationProvider` component have been renamed `adapterLocale`:

  ```diff
   <LocalizationProvider
     dateAdapter={AdapterDayjs}
  -  locale="fr"
  +  adapterLocale="fr"
   >
     {children}
   </LocalizationProvider>
  ```

- The component slots `LeftArrowButton` and `RightArrowButton` have been renamed `PreviousIconButton` and `NextIconButton` to better describe there usage:

  ```diff
   <DatePicker
     components={{
  -    LeftArrowButton: CustomButton,
  +    PreviousIconButton: CustomButton,

  -    RightArrowButton: CustomButton,
  +    NextIconButton: CustomButton,
     }}
     componentsProps={{
  -    leftArrowButton: {},
  +    previousIconButton: {},

  -    rightArrowButton: {},
  +    nextIconButton: {},
     }}
   />
  ```

- The `date` prop has been renamed `value` on `MonthPicker` / `YearPicker`, `ClockPicker` and `CalendarPicker`.

  ```diff
  -<MonthPicker date={dayjs()} onChange={handleMonthChange} />
  +<MonthPicker value={dayjs()} onChange={handleMonthChange} />

  -<YearPicker date={dayjs()} onChange={handleYearChange} />
  +<YearPicker value={dayjs()} onChange={handleYearChange} />

  -<ClockPicker date={dayjs()} onChange={handleTimeChange} />
  +<ClockPicker value={dayjs()} onChange={handleTimeChange} />

  -<CalendarPicker date={dayjs()} onChange={handleDateChange} />
  +<CalendarPicker value={dayjs()} onChange={handleDateChange} />
  ```

#### Changes

- [CalendarPicker] Don't move to closest enabled date when `props.date` contains a disabled date (#6146) @flaviendelangle
- [DateRangePicker] Switch to new month when changing the value from the outside (#6166) @flaviendelangle
- [pickers] Add a `localeText` prop to all pickers to customize the translations (#6212) @flaviendelangle
- [pickers] Add Finnish (fi-FI) locale to the pickers (#6219) (#6230) @PetroSilenius
- [pickers] Add Persian (fa-IR) locale to the pickers (#6181) @fakhamatia
- [pickers] Allow nested `LocalizationProvider` (#6011) @flaviendelangle
- [pickers] Clean slots on `PickersArrowSwitcher` component (#5890) @flaviendelangle
- [pickers] Fix invalid date error when decreasing `DateField` day (#6071) @alexfauquette
- [pickers] Fix mobile section selection (#6207) @oliviertassinari
- [pickers] Fix usage with Typescript 4.8 (#6229) @flaviendelangle
- [pickers] Improve error message when no adapter context is found (#6211) @flaviendelangle
- [pickers] Remove `valueStr` from the field state (#6142) @flaviendelangle
- [pickers] Remove remaining deprecated locale props (#6233) @flaviendelangle
- [pickers] Rename the `date` prop `value` on `MonthPicker` / `YearPicker`, `ClockPicker` and `CalendarPicker` (#6128) @flaviendelangle
- [pickers] Rename the `onClose` prop of `PickersPopper` `onDismiss` to simplify typing (#6155) @flaviendelangle
- [pickers] Support the `sx` prop on all public component with a root HTML elements (#5944) @flaviendelangle
- [pickers] Unify `PickersMonth` and `PickersYear` behaviors (#6034) @flaviendelangle
- [pickers] Use `shouldDisableMonth` and `shouldDisableYear` for date validation (#6066) @flaviendelangle
- [YearPicker] Scroll to the current year even with `autoFocus=false` (#6224) @alexfauquette

### Docs

- [docs] Add automatic vale check (#5429) @alexfauquette
- [docs] Add Pro logo in "column ordering" link (#6127) @alexfauquette
- [docs] Fix 301 link (#6239) @oliviertassinari
- [docs] Fix broken link (#6163) @alexfauquette
- [docs] Fix broken links (#6101) @alexfauquette
- [docs] Fix demonstration date to avoid hydration errors (#6032) @alexfauquette
- [docs] Fix hidden popper in restore state example (#6191) @heyfirst
- [docs] Fix invalid links causing 404 & 301 errors (#6105) @oliviertassinari
- [docs] Fix npm repository url in the pickers `package.json` (#6172) @oliviertassinari
- [docs] Fix typo in linked issue (#6162) @flaviendelangle
- [docs] Import `generateUtilityClass` from `@mui/utils` (#6216) @michaldudak
- [docs] Improve Upgrade plan docs (#6018) @oliviertassinari
- [docs] Link the OpenSSF Best Practices card (#6171) @oliviertassinari

### Core

- [core] Add `v5.17.3` changelog to next branch (#6250) @flaviendelangle
- [core] Add link to the security page on the `README` (#6073) @oliviertassinari
- [core] Fix scroll restoration in the docs (#5938) @oliviertassinari
- [core] Remove the Storybook (#6099) @flaviendelangle
- [core] Tag release as `next` in NPM (#6256) @m4theushw
- [core] Update monorepo (#6180) @flaviendelangle
- [core] Use the `next` branch for Prettier (#6097) @flaviendelangle
- [core] Use the official repository for `@mui/monorepo` instead of a fork (#6189) @oliviertassinari
- [test] Fix logic to skip column pinning tests (#6133) @m4theushw
- [test] Hide the date on the print regression test (#6120) @flaviendelangle
- [test] Skip tests for column pinning and dynamic row height (#5997) @m4theushw
- [website] Improve security header @oliviertassinari

## Older versions

Changes before 6.x are listed in our [changelog for older versions](https://github.com/mui/mui-x/blob/HEAD/changelogOld/).
