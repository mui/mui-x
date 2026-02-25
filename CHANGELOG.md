# Changelog

> For full v8 changelog, please refer to the [v.8x branch](https://github.com/mui/mui-x/blob/v8.x/CHANGELOG.md).

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 8.27.2

_Feb 20, 2026_

We'd like to extend a big thank you to the 3 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

### Data Grid

#### `@mui/x-data-grid@8.27.2`

Internal changes.

#### `@mui/x-data-grid-pro@8.27.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.27.2`, plus:

- [DataGridPro] Fix number input visibility in header filters (#21345) @michelengelen

#### `@mui/x-data-grid-premium@8.27.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.27.2`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.27.2`

- [DatePicker] Add keyboard support for selecting day, month, and year (#21399) @michelengelen

#### `@mui/x-date-pickers-pro@8.27.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.27.2`, plus:

- [DateRangePicker] Fix timezone update issue leading to `invalidRange` error (#21382) @michelengelen

### Charts

#### `@mui/x-charts@8.27.2`

Internal changes.

#### `@mui/x-charts-pro@8.27.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.27.2`, plus:

- [charts-pro] Handle edge case in export image (#21206) @bernardobelchior

#### `@mui/x-charts-premium@8.27.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.27.2`.

### Tree View

#### `@mui/x-tree-view@8.27.2`

- [tree view] Focus item sibling on unmount instead of the 1st item (#21386) @flaviendelangle

#### `@mui/x-tree-view-pro@8.27.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.27.2`.

### Codemod

#### `@mui/x-codemod@8.27.2`

Internal changes.

### Core

- [code-infra] Only ignore `renovate[bot]` in changelog generation script (#21188) @bernardobelchior

## v8.27.1

<!-- generated comparing v8.27.0..v8.x -->

_Feb 13, 2026_

We'd like to extend a big thank you to the 6 contributors who made this release possible. Here are some highlights ✨:

- 📝 CSS bundler support is no longer needed for the Data Grid
- 🐞 Bugfixes

Special thanks go out to these community members for their valuable contributions:
@sai6855

The following team members contributed to this release:
@arminmeh, @cherniavskii, @flaviendelangle, @mj12albert, @MBilalShafi

### Data Grid

#### `@mui/x-data-grid@8.27.1`

- [DataGrid] Hide column menu icon when there are no items (#21303) @MBilalShafi
- [DataGrid] Migrate styled imports and remove `index.css` (#21176) @MBilalShafi
- [DataGrid] Optimize `GridRootStyles` overrides resolver (#21251) @sai6855

#### `@mui/x-data-grid-pro@8.27.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.27.1`, plus:

- [DataGridPro] Fix column pinning issue with `restoreState` (#21305) @MBilalShafi
- [DataGridPro] Fix lazy loading params for page with one row (#21238) @MBilalShafi
- [DataGridPro] Properly extract parent path (#21301) @arminmeh

#### `@mui/x-data-grid-premium@8.27.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.27.1`, plus:

- [DataGridPremium] Fix aggregation display when `initialState` has both `sortModel` and `pinnedColumns` (#21152) @mj12albert

### Tree View

#### `@mui/x-tree-view@8.27.1`

- [tree view] Fix `apiRef.current.setItemExpansion()` (#21095) @flaviendelangle

#### `@mui/x-tree-view-pro@8.27.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.27.1`.

### Core

- [internal] Add CLI for translation using LLM (#21299) @cherniavskii

## v8.27.0

_Feb 2, 2026_

We'd like to extend a big thank you to the 8 contributors who made this release possible. Here are some highlights ✨:

- 📝 Data Grid supports new `longText` [column type](https://mui.com/x/react-data-grid/column-definition/#column-types)

The following team members contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @flaviendelangle, @JCQuintas, @MBilalShafi, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.27.0`

- [DataGrid] Fix virtualization crash by preventing out-of-bounds `focusedVirtualCell` indices (#21123) @cherniavskii
- [DataGrid] Fix focus steal issue with `<Dialog />` (#21106) @MBilalShafi
- [DataGrid] Add new `longText` column type (#21103) @siriwatknp

#### `@mui/x-data-grid-pro@8.27.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.27.0`.

#### `@mui/x-data-grid-premium@8.27.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.27.0`, plus:

- [DataGridPremium] Fix focus retention when undo/redo operations are done on the same cell (#21110) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.27.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.27.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.27.0`.

### Charts

#### `@mui/x-charts@8.27.0`

- [charts] Deprecate `AxisId` class in favour of to `data-axis-id` attribute (#21048) @JCQuintas

#### `@mui/x-charts-pro@8.27.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.27.0`, plus:

- [charts-pro] Add `onItemClick` to the heatmap (#20817) (#21030) @alexfauquette

#### `@mui/x-charts-premium@8.27.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.27.0`, plus:

- [charts-premium] Fix wrong `defaultSlots` in premium charts (#21052) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.27.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.27.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.27.0`, plus:

- [RichTreeViewPro] Do not export `useSimpleTreeViewApiRef()` and `useRichTreeViewApiRef()` from pro package (#21145) @flaviendelangle

### Codemod

#### `@mui/x-codemod@8.27.0`

Internal changes.

### Docs

- [docs] Fix DataGrid's cell edit renderers (@arminmeh) (#21041) @github-actions[bot]

### Core

- [code-infra] Add `consistent-type-imports` rule to the grid packages (#21119) @arminmeh
- [code-infra] Allow user to select target branch if it exists for current major (#21005) @JCQuintas
- [code-infra] Fix the target branch condition in the release script (#21051) @arminmeh
- [code-infra] Update docs deploy script to fetch from `v8.x` (#21013) @arminmeh

## 8.26.1

_Jan 23, 2026_

Release highlight ✨:

- 🐞 Hotfix for Data Grid Premium type imports

### Data Grid

#### `@mui/x-data-grid-premium@8.26.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

- [DataGridPremium] Fix type import (#21033) @arminmeh

## 8.26.0

_Jan 22, 2026_

We'd like to extend a big thank you to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🔄 Data Grid now supports undo and redo actions. See the [Undo and redo](https://mui.com/x/react-data-grid/undo-redo/) page for details about out-of-the-box support and customization options.
- 🐞 Bugfixes

Special thanks go out to these community members for their valuable contributions:
@jhe-iqbis

The following team members contributed to this release:
@arminmeh, @cherniavskii, @flaviendelangle, @JCQuintas, @romgrk

### Data Grid

#### `@mui/x-data-grid@8.26.0`

- [DataGrid] Add `onMenuOpen()` and `onMenuClose()` event handlers in `GridActionsCell` (#20994) @jhe-iqbis
- [DataGrid] Fix scroll position when virtualization is disabled (#20958) @romgrk

#### `@mui/x-data-grid-pro@8.26.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.26.0`.

#### `@mui/x-data-grid-premium@8.26.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.26.0`, plus:

- [DataGridPremium] Undo and redo (#20993) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.26.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.26.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.26.0`.

### Charts

#### `@mui/x-charts@8.26.0`

Internal changes.

#### `@mui/x-charts-pro@8.26.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.26.0`.

#### `@mui/x-charts-premium@8.26.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.26.0`.

### Tree View

#### `@mui/x-tree-view@8.26.0`

- [tree view] Fix `props.id` not passed to the root element (#20976) @flaviendelangle

#### `@mui/x-tree-view-pro@8.26.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.26.0`.

### Codemod

#### `@mui/x-codemod@8.26.0`

Internal changes.

### Docs

- [docs] Recipe for lazy loading DataGrid's detail panels with auto height (#20995) @arminmeh

### Core

- [code-infra] Update `master` to `v8` references (#20864) @JCQuintas
- [code-infra] Update v8 branch tags (#20926) @JCQuintas
- [code-infra] V8 changes in master (#20919) @JCQuintas
- [code-infra] Allow user to select target branch if it exists for current major (#21005) @JCQuintas
- [internal] Set up shared instructions for coding agents (#21000) @cherniavskii

## 8.25.0

<!-- generated comparing v8.24.0..master -->

_Jan 14, 2026_

We'd like to extend a big thank you to the 8 contributors who made this release possible. Here are some highlights ✨:

- 📊 The Chart legend now has an option that enables [click to toggle visibility](https://mui.com/x/react-charts/legend/#toggle-visibility) of series.

  ![Image](https://github.com/user-attachments/assets/c8250287-1318-4581-ac5d-07e7ee01341c)

- 🐞 Bugfixes
- 📚 Documentation improvements

The following team members contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @JCQuintas, @mapache-salvaje, @rita-codes, @Janpot

### Data Grid

#### `@mui/x-data-grid@8.25.0`

Internal changes.

#### `@mui/x-data-grid-pro@8.25.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.25.0`.

#### `@mui/x-data-grid-premium@8.25.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.25.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.25.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.25.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.25.0`.

### Charts

#### `@mui/x-charts@8.25.0`

- [charts] Add Legend actions (#20404) @JCQuintas
- [charts] Add `initialHiddenItems` prop to set initial state (#20894) @JCQuintas
- [charts] Control the item tooltip (#20617) @alexfauquette
- [charts] Export plugins from premium (#20866) @JCQuintas
- [charts] Fix node anchor on iOS (#20848) @alexfauquette
- [charts] Fix test inconsistency in charts (#20907) @JCQuintas
- [charts] Revert `touch-action: pan-y` removal when zoom is disabled (#20852) @bernardobelchior
- [charts] Use React event handler to detect pointer type (#20849) @alexfauquette
- [charts] Enable keyboard navigation in radar chart (#20765) @alexfauquette
- [charts] Fix tooltip position for stacked line series (#20901) @alexfauquette

#### `@mui/x-charts-pro@8.25.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.25.0`, plus:

- [charts-pro] Add keyboard navigation to funnel (#20766) @alexfauquette
- [charts-pro] Add keyboard navigation to heatmap (#20786) @alexfauquette
- [charts-pro] Add keyboard navigation to sankey (#20777) @alexfauquette
- [charts-pro] Prefer global pointer interaction tracker in Heatmap (#20697) @bernardobelchior
- [charts-pro] Support composition for Sankey (#20604) @alexfauquette
- [charts-pro] Fix crash when two same-direction axes have a zoom preview (#20916) @bernardobelchior

#### `@mui/x-charts-premium@8.25.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.25.0`, plus:

- [charts-premium] Add `ChartContainerPremium` (#20910) @bernardobelchior
- [charts-premium] Fix `ChartDataProviderPremium` tests (#20868) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.25.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.25.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.25.0`.

### Codemod

#### `@mui/x-codemod@8.25.0`

Internal changes.

### Docs

- [docs] Fix Waterfall Chart documentation badge from Pro to Premium (#20888) @Copilot
- [docs] Fix broken links on Data Grid Editing sub-pages (#20911) @arminmeh
- [docs] Increase chart axis size in docs to fit in Ubuntu Firefox (#20844) @bernardobelchior
- [docs] Simplify heatmap zoom demo (#20851) @bernardobelchior
- [docs] Revise the Charts Composition doc (#20032) @mapache-salvaje
- [docs] Revise the Charts Localization doc (#20800) @mapache-salvaje
- [docs] Revise the Charts Stacking doc (#20830) @mapache-salvaje
- [docs] Fix broken links (#20914) @Janpot

### Core

- [code-infra] Fix `material-ui/disallow-react-api-in-server-components` (#20909) @JCQuintas
- [code-infra] Prepare for v9 (#20860) @JCQuintas
- [code-infra] Update codeowners (#20886) @JCQuintas
- [internal] Remove local Claude settings from the repo (#20853) @cherniavskii

## 8.24.0

_Jan 8, 2026_

We'd like to extend a big thank you to the 12 contributors who made this release possible. Here are some highlights ✨:

- ⚡️Add bar [batch renderer](https://mui.com/x/react-charts/bars/#performance), result in a significant performance improvement when rendering thousands of bars
- 📊 Add [range bar chart](https://mui.com/x/react-charts/range-bar/) to render
  ![image](https://github.com/user-attachments/assets/4112c09b-d841-42f7-a0c8-d23b61c23ca0)
- 🌎 Improved Danish (da-DK) and Japanese (ja-JP) locales on the Data Grid

Special thanks go out to these community members for their valuable contributions:
@anders-noerrelykke, @auloin, @sai6855, @yuito-it

The following team members contributed to this release:
@alelthomas, @alexfauquette, @arminmeh, @bernardobelchior, @flaviendelangle, @JCQuintas, @mapache-salvaje, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.24.0`

- [l10n] Improve Danish (da-DK) locale (#20828) @anders-noerrelykke
- [l10n] Improve Japanese (ja-JP) locale (#20251) @yuito-it

#### `@mui/x-data-grid-pro@8.24.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.24.0`, plus:

- [DataGridPro] Fix header filter height for `density="compact"` (#20834) @arminmeh

#### `@mui/x-data-grid-premium@8.24.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.24.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.24.0`

- [pickers] Fix Styles applied to PickersDay when MuiPickersDay-dayOutsideMonth is used (#20719) @sai6855

#### `@mui/x-date-pickers-pro@8.24.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.24.0`.

### Charts

#### `@mui/x-charts@8.24.0`

- [charts] Add `VisibilityManager` logic to allow managing series/items (#20571) @JCQuintas
- [charts] Add `identifierSerializer` configuration (#20775) @JCQuintas
- [charts] Add `serializeIdentifier` instance function (#20791) @JCQuintas
- [charts] Add bar batch renderer (#20457) @bernardobelchior
- [charts] Allow animating bar, line, and pie elements to hidden state (#20798) @JCQuintas
- [charts] Fix failing lint step (#20813) @bernardobelchior
- [charts] Fix tooltip anchored to item (#20783) @alexfauquette
- [charts] Fix type casting in getCategoryAxisConfig and applySeriesLayout functions (#20797) @sai6855
- [charts] Let keyboard navigation avoid overflow and handle nullish values (#20757) @alexfauquette
- [charts] Refactor `PieChart` and `PieChartPro` to use `slots` and `slotProps` directly (#20795) @sai6855
- [charts] Refactor `useRegisterPointerEventHandlers` (#20824) @bernardobelchior
- [charts] Update legend types to allow hiding/showing items (#20784) @JCQuintas

#### `@mui/x-charts-pro@8.24.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.24.0`, plus:

- [charts-pro] Pass `slotProps.toolbar` to `Toolbar` in `PieChartPro` (#20796) @sai6855

#### `@mui/x-charts-premium@8.24.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.24.0`, plus:

- [charts-premium] Add range bar chart (#20275) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.24.0`

- [tree view] Introduce a Tree View Store to clean the internals (#20051) @flaviendelangle

#### `@mui/x-tree-view-pro@8.24.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.24.0`.

### Codemod

#### `@mui/x-codemod@8.24.0`

Internal changes.

### Docs

- [docs] Fix axis size default values (#20799) @bernardobelchior
- [docs] Update What's New in MUI X page with post v8 features (DX-118) (#20787) @alelthomas
- [docs] Fix `onAccept`'s `context.source` documentation to use 'view' instead of 'picker' (#20465) @auloin
- [docs] Revise the Charts Brush doc (#20792) @mapache-salvaje
- [docs] Revise the Charts Highlighting doc (#20788) @mapache-salvaje
- [docs] Revise the Charts Label doc (#20794) @mapache-salvaje
- [docs] Revise the Charts Export doc (#20779) @mapache-salvaje

### Core

- [code-infra] Fix v8.23.0 release date (#20767) @bernardobelchior
- [code-infra] Remove `glob-gitignore` (#20801) @bernardobelchior
- [code-infra] Remove `nyc` (#20804) @bernardobelchior
- [code-infra] Remove `stream-browserify` and `null-loader` (#20805) @bernardobelchior
- [code-infra] Remove `stylelint-config-tailwindcss` (#20807) @bernardobelchior
- [code-infra] Remove unused `path` package (#20802) @bernardobelchior
- [code-infra] Retry flaky e2e test on webkit (#20806) @JCQuintas
- [internal] Add `internal` slot to properly generate components CSS layer (#20763) @siriwatknp

## 8.23.0

_Dec 24, 2025_

We'd like to extend a big thank you to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🧮 Support Data Grid `size`, `size(true)`, and `size(false)` [aggregations for `'boolean'` column type](https://mui.com/x/react-data-grid/aggregation/#usage-with-row-grouping)
- 🔎 Allow zooming a heatmap

Special thanks go out to these community members for their valuable contributions:
@henkerik, @sai6855

The following team members contributed to this release:
@alelthomas, @alexfauquette, @arminmeh, @bernardobelchior, @brijeshb42, @flaviendelangle, @JCQuintas, @mapache-salvaje, @MBilalShafi, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.23.0`

- [DataGrid] Fix columns state and columns prop sync issue (#20703) @arminmeh
- [DataGrid] Fix filter datetime with seconds (#20557) @siriwatknp
- [DataGrid] Add new `includeHeaderFilters` flag to include header filters when autosizing columns (#20510) @siriwatknp
- [DataGrid] Prevent default on `Enter` key down when starting editing (#20751) @siriwatknp
- [l10n] Improve Portuguese from Portugal (pt-PT) locale (#20722) @Copilot

#### `@mui/x-data-grid-pro@8.23.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.23.0`, plus:

- [DataGridPro] Fix crash on rows change in tree data with pagination (#20215) @Copilot

#### `@mui/x-data-grid-premium@8.23.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.23.0`, plus:

- [DataGridPremium] Add aggregation for `'boolean'` column type (#20683) @arminmeh
- [DataGridPremium] Fix strategy value computation with row grouping (#20725) @MBilalShafi
- [DataGridPremium] Handle `isRowSelectable()` checks for the rows missing due to `keepNonExistentRowsSelected` (#20668) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.23.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.23.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.23.0`.

### Charts

#### `@mui/x-charts@8.23.0`

- [charts] Custom stack functions implementation (#20679) @JCQuintas
- [charts] Extract keyboard focus navigation to the series config (#20693) @alexfauquette
- [charts] Fix demo not wrapping in mobile (#20713) @JCQuintas
- [charts] Fix missing dependencies in `x-charts-vendor` (#20685) @henkerik
- [charts] Remove webkit test differences (#20707) @JCQuintas

#### `@mui/x-charts-pro@8.23.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.23.0`, plus:

- [charts-pro] Allow registering preview plots from higher tier packages (#20716) @bernardobelchior
- [charts-pro] Fix erroneous behavior when adding/removing pointers from zoom&pan gestures (#20698) @JCQuintas
- [charts-pro] Move heatmap highlight handling to plot component (#20701) @bernardobelchior
- [charts-pro] Add zoom to heatmap (#20708) @bernardobelchior

#### `@mui/x-charts-premium@8.23.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.23.0`.

### Tree View

#### `@mui/x-tree-view@8.23.0`

- [tree view] Add new APIs to disable selection feature for tree view item (#20666) @siriwatknp

#### `@mui/x-tree-view-pro@8.23.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.23.0`.

### Codemod

#### `@mui/x-codemod@8.23.0`

Internal changes.

### Docs

- [docs] Clarify feature availability and relationship between Community and Pro/Premium docs (#20714) @mapache-salvaje
- [docs] Copyedit Tree View docs and apply new component style rules (DX-19) (#20652) @mapache-salvaje
- [docs] Fix `ColumnPinningDynamicRowHeight` demo (#20750) @sai6855
- [docs] Clean up Charts docs sidebar (DX-97) (#20700) @alelthomas
- [docs] Fix tick labels not being shown on a demo (#20718) @sai6855

### Core

- [code-infra] Bump prettier to 3.7.4 (#20709) @JCQuintas
- [code-infra] Fix contributor generation logic in changelog script (#20705) @brijeshb42

## 8.22.1

_Dec 17, 2025_

We'd like to extend a big thank you to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🌎 Improve Swedish (sv-SE) locale on the Data Grid
- 🐞 Bugfixes

Special thanks go out to the community members for their valuable contributions:
@KyeongJooni, @VismaAndreasIvarsson

The following team members contributed to this release:
@alelthomas, @alexfauquette, @arminmeh, @bernardobelchior, @Janpot, @JCQuintas, @mapache-salvaje, @michelengelen, @mj12albert, @prakhargupta1, @romgrk, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.22.1`

- [data grid] Fix column menu keyboard shortcut (#20621) @mj12albert
- [data grid] Fix row checkbox disabled state on first render and keep cell focusable (ARIA) (#20641) @michelengelen
- [data grid] Fix tree data selection bug (#20528) @michelengelen
- [data grid] Prevent clear cell selection on edit mode (#20544) @siriwatknp
- [data grid] Refactor column merge logic to prioritize defined properties only (#20640) @michelengelen
- [data grid] Reset row spanning on row expansion change (#20661) @siriwatknp
- [data grid] Resize newly added rows while resize action is happening (#20676)
- [l10n] Improve Swedish (sv-SE) locale (#20682) @VismaAndreasIvarsson

#### `@mui/x-data-grid-pro@8.22.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.22.1`.

#### `@mui/x-data-grid-premium@8.22.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.22.1`, plus:

- [DataGridPremium] Import `useId()` from `@mui/utils` to maintain React 17 compatibility (#20635) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.22.1`

- [pickers] Add minutesStep validation test (#20672) @KyeongJooni
- [pickers] Fix `onAccept()` returning wrong year after selecting year then month (#20639) @michelengelen

#### `@mui/x-date-pickers-pro@8.22.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.22.1`.

### Charts

#### `@mui/x-charts@8.22.1`

- [charts] Extract `FocusedPieArc` from `PieArcPlot` (#20613) @alexfauquette
- [charts] Fix regression on the highlight control (#20627) @alexfauquette
- [charts] Refactor: `useSelector()` => `store.use()` (#20681) @romgrk
- [charts] Remove duplicated types (#20694) @alexfauquette
- [charts] Remove unused generics from bar charts (#20642) @bernardobelchior
- [charts] Simplify tooltip position getter for pie chart (#20625) @alexfauquette

#### `@mui/x-charts-pro@8.22.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.22.1`, plus:

- [charts-pro] Add heatmap performance benchmark (#20695) @bernardobelchior

#### `@mui/x-charts-premium@8.22.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.22.1`, plus:

- [charts-premium] Create `BarChartPremium` (#20643) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.22.1`

Internal changes.

#### `@mui/x-tree-view-pro@8.22.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.22.1`.

### Codemod

#### `@mui/x-codemod@8.22.1`

Internal changes.

### Docs

- [docs] Add button to GitHub source code for the Data Grid advanced demos (DX-50) (#20633) @alelthomas
- [docs] Remove `seriesConfig` to prevent future confusion (#20678) @alexfauquette
- [docs] Revise the Data Grid's API object doc for clarity and style (#20649) @mapache-salvaje
- [docs] Update list of charts (#20479) @prakhargupta1

### Core

- [code-infra] Regression tests improvements (#20441) @Janpot
- [code-infra] Test utils upgrade (#20592) @Janpot
- [code-infra] Try to fix the Tree View flacky tests (#20573) @JCQuintas

## 8.22.0

_Dec 11, 2025_

We'd like to extend a big thank you to the 11 contributors who made this release possible. Here are some highlights ✨:

- Each Tree View component now exposes its own hook to initialize the `apiRef` object with accurate typing:

  ```diff
  -import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
  +import { useSimpleTreeViewApiRef } from '@mui/x-tree-view/hooks';
  -const apiRef = useTreeViewApiRef();
  +const apiRef = useSimpleTreeViewApiRef();

  -import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
  +import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
  -const apiRef = useTreeViewApiRef();
  +const apiRef = useRichTreeViewApiRef();

  -import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
  +import { useRichTreeViewProApiRef } from '@mui/x-tree-view-pro/hooks';
  -const apiRef = useTreeViewApiRef();
  +const apiRef = useRichTreeViewProApiRef();
  ```

- 📚 [Tutorial](https://mui.com/x/react-data-grid/tutorials/server-side-data/) on building a Data Grid with server-side data
- 🐞 Bugfixes

Special thanks go out to this community member for their valuable contributions:
@kzhgit

The following team members contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @flaviendelangle, @JCQuintas, @mapache-salvaje, @michelengelen, @noraleonte, @oliviertassinari

### Data Grid

#### `@mui/x-data-grid@8.22.0`

- [DataGrid] Sync component props with theme defaults (#20590) @michelengelen
- [DataGrid] Add fallback for CSS `color-mix` if it is unsupported (#20597) @cherniavskii
- [DataGrid] Use `baseTooltip` slot for column header sort icon (#20460) @kzhgit

#### `@mui/x-data-grid-pro@8.22.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.22.0`.

#### `@mui/x-data-grid-premium@8.22.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.22.0`, plus:

- [DataGridPremium] Handle pivoting column name generation for empty strings (#20608) @arminmeh
- [DataGridPremium] Pass a row with aggregated value to the custom aggregation function `valueFormatter` (#20607) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.22.0`

- [pickers] Fix invalid date tests (#20606) @michelengelen

#### `@mui/x-date-pickers-pro@8.22.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.22.0`.

### Charts

#### `@mui/x-charts@8.22.0`

- [charts] Add consistent animation duration and timing (#20564) @JCQuintas
- [charts] Extract a tooltip plugin from the interaction one (#20591) @alexfauquette
- [charts] General type improvements (#20565) @JCQuintas
- [charts] Place ordinal ticks according to a continuous scale (#19808) @alexfauquette
- [charts] Remove layout data from the tooltip internals (#20548) @alexfauquette
- [charts] Remove usage of focus outline for item highlight (#19856) @alexfauquette
- [charts] Simplify `MarkPlot` by moving calculation to `useMarkPlotData` (#20570) @JCQuintas
- [charts] Use `store.state` over `store.getSnapshot()` (#20616) @bernardobelchior
- [charts] Vendor flatqueue (#20610) @bernardobelchior
- [charts] Extract pie layout computation (#20611) @alexfauquette
- [charts][infra] Enable `@typescript-eslint/consistent-type-imports` eslint rules (#20560) @JCQuintas
- [charts][infra] Enable `import/no-cycle` eslint rules (#20554) @JCQuintas

#### `@mui/x-charts-pro@8.22.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.22.0`, plus:

- [charts-pro] Display sankey labels on top of nodes (#20569) @alexfauquette

#### `@mui/x-charts-premium@8.22.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.22.0`.

### Tree View

#### `@mui/x-tree-view@8.22.0`

- [tree view] Expose one hook per component to initialize the `apiRef` (#20235) @flaviendelangle
- [tree view] Update the typing of `updateItemChildren()` to accept `null` (#20483) @noraleonte

#### `@mui/x-tree-view-pro@8.22.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.22.0`.

### Codemod

#### `@mui/x-codemod@8.22.0`

Internal changes.

### Docs

- [docs] Add tutorial on building a Data Grid with server-side data (DX-22) (#19782) @mapache-salvaje
- [docs] Modify the default value for the stacking demo (#20596) @alexfauquette
- [docs] Revise the Charts Custom Components doc (#19793) @mapache-salvaje
- [docs] Remove copy-pasted `aria-label` (#20620) @alexfauquette

### Core

- [internal] Remove unsafe dependency version from range (#20574) @oliviertassinari

### Miscellaneous

- Bump `@mui/monorepo` digest to `800638d` (#20337) @renovate[bot]
- Bump `@next/eslint-plugin-next` to `15.5.7` (#20575) @renovate[bot]
- Bump GitHub Actions (#20577) @renovate[bot]
- Bump Tanstack query to `^5.90.12` (#20582) @renovate[bot]
- Bump Vite & Vitest (#20583) @renovate[bot]
- Bump `eslint` to `^8.48.1` (#20576) @renovate[bot]
- Bump `markdown-to-jsx` to `^9.3.2` (#20507) @renovate[bot]
- Bump `motion` to `^12.23.25` (#20579) @renovate[bot]
- Bump react monorepo to `19.2.1` (#20581) @renovate[bot]
- Bump `react-hook-form` to `^7.68.0` (#20584) @renovate[bot]
- Bump `react-router` to `^7.10.1` (#20341) @renovate[bot]
- Bump `tsx` to `^4.21.0` (#20585) @renovate[bot]
- Bump MUI infra packages (#20478) @renovate[bot]
- [infra] Automatically add teams to release PRs (#20558) @JCQuintas
- [infra] Fix codeowners typo (#20562) @JCQuintas

## 8.21.0

_Dec 3, 2025_

We'd like to extend a big thank you to the 8 contributors who made this release possible. Here are some highlights ✨:

- ✨ Add [tick spacing property](https://mui.com/x/react-charts/axis/#tick-spacing) to charts axis to control the distance between ticks.

The following team members contributed to this release:
@alexfauquette, @bernardobelchior, @ElliottMiller, @Janpot, @JCQuintas, @romgrk, @sai6855, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.21.0`

- [DataGrid] Fix autosizing header width calculation (#20323) @siriwatknp
- [DataGrid] Virtualizer refactor (#19465) @romgrk

#### `@mui/x-data-grid-pro@8.21.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.21.0`.

#### `@mui/x-data-grid-premium@8.21.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.21.0`, plus:

- [DataGridPremium] Prevent pasting to non-editable cells (#20333) @ElliottMiller

### Date and Time Pickers

#### `@mui/x-date-pickers@8.21.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.21.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.21.0`.

### Charts

#### `@mui/x-charts@8.21.0`

- [charts] Fix string measuring types (#20454) @bernardobelchior
- [charts] Fix typo in performance note for CustomLineMarks demo (#20529) @sai6855
- [charts] Introduce the notion of series with positions (#20461) @alexfauquette
- [charts] Migrate from sinon to Vitest mocking utilities for x-charts\* packages (#20444) @Copilot
- [charts] Move series-level values to series computed data in bar plot (#20467) @bernardobelchior
- [charts] Refactor bar chart components in preparation for range bar chart (#20521) @bernardobelchior
- [charts] Remove unnecessary `any` types (#20527) @sai6855
- [charts] Remove unused `drawingArea` from `findClosestPoints` (#20471) @bernardobelchior
- [charts] Revert `useIsHydrated` to default=false (#20511) @JCQuintas
- [charts] Support tooltip anchor position for radar (#20422) @alexfauquette
- [charts] Add tick spacing property (#20282) @bernardobelchior
- [charts] Fix Vitest lint error (#20550) @bernardobelchior
- [charts] Fix infinite loop when highlighting pie slices or scatter points (#20549) @bernardobelchior

#### `@mui/x-charts-pro@8.21.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.21.0`, plus:

- [charts-pro] Add support for `anchor="node"` on Sankey tooltip (#20462) @alexfauquette

#### `@mui/x-charts-premium@8.21.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.21.0`.

### Tree View

#### `@mui/x-tree-view@8.21.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.21.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.21.0`.

### Codemod

#### `@mui/x-codemod@8.21.0`

Internal changes.

### Docs

- [docs] Migrate to `next/font` for fonts loading (#20407) @Copilot

### Core

- [code-infra] Enable vitest eslint plugin (#20530) @Janpot
- [code-infra] Fix missing font loading for local fonts (#20480) @Janpot
- [internal] Performance: use raw `useSyncExternalStore` (#20447) @romgrk
- [code-infra] Enable `vitest/expect-expect` and `vitest/no-standalone-expect` rules for x-charts packages (#20535) @Copilot

### Miscellaneous

- Bump @types/d3-sankey to ^0.12.5 (#20489) @renovate[bot]
- Bump @types/react to 19.2.7 (#20490) @renovate[bot]
- Bump @types/yargs to ^17.0.35 (#20491) @renovate[bot]
- Bump Vite & Vitest to ^4.0.14 (#20500) @renovate[bot]
- Bump csstype to ^3.2.3 (#20493) @renovate[bot]
- Bump es-toolkit to ^1.42.0 (#20494) @renovate[bot]
- Bump eslint to ^8.48.0 (#20495) @renovate[bot]
- Bump lerna to ^9.0.3 (#20496) @renovate[bot]
- Bump lucide-react to ^0.555.0 (#20502) @renovate[bot]
- Bump playwright monorepo (#20503) @renovate[bot]
- Bump pnpm to 10.24.0 (#20504) @renovate[bot]
- Bump react monorepo (#20340) @renovate[bot]
- Bump react-hook-form to ^7.66.1 (#20497) @renovate[bot]
- Bump rimraf to ^6.1.2 (#20498) @renovate[bot]
- Bump webpack-bundle-analyzer to ^5.0.1 (#20508) @renovate[bot]
- Bump next to ^15.5.7 [SECURITY] (#20555) @renovate[bot]

## 8.20.0

_Nov 26, 2025_

We'd like to extend a big thank you to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🔃 Data Grid tree data now supports row reordering. See the [Drag-and-drop tree data reordering](https://mui.com/x/react-data-grid/tree-data/#drag-and-drop-tree-data-reordering) section for more details.
- 🐞 Bugfixes

The following team members contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @siriwatknp, @JCQuintas, @MBilalShafi, @prakhargupta1

### Data Grid

#### `@mui/x-data-grid@8.20.0`

- [DataGrid] Fix RTL virtualization to display columns when viewport width is larger than the grid (#20409) @siriwatknp
- [DataGrid] Fix row range selection (#20442) @arminmeh
- [DataGrid] Initialize data grid core packages (#20276) @cherniavskii
- [DataGrid] Improve accessibility of the sort icon (#20430) @arminmeh
- [DataGrid] Use `viewport` as a boundary for the `BasePopper` flip (#20311) @arminmeh

#### `@mui/x-data-grid-pro@8.20.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.20.0`, plus:

- [DataGridPro] Avoid automatic scroll back to the focused header filter after it leaves the viewport (#20416) @arminmeh
- [DataGridPro] Tree data row reordering (#19401) @MBilalShafi

#### `@mui/x-data-grid-premium@8.20.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.20.0`.

### Charts

#### `@mui/x-charts@8.20.0`

- [charts] Fix item tooltip position with node anchor (#20421) @alexfauquette
- [charts] Fix radar item tooltip closing bug (#20429) @alexfauquette
- [charts] Move series processing to selector (#20388) @JCQuintas
- [charts] Prevent pointer out from removing controlled highlight (#20385) @alexfauquette

#### `@mui/x-charts-pro@8.20.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.20.0`, plus:

- [charts-pro] Fix Content-Security-Policy nonce not being correctly set on export (#20395) @bernardobelchior
- [charts-pro] Improve vertical zoom slider thumb on mobile (#20439) @bernardobelchior
- [charts-pro] Provide arguments to the `AreaPlotRoot` styled component (#20414) @arminmeh
- [charts-pro] Remove grid outside the drawing area (#20412) @alexfauquette

#### `@mui/x-charts-premium@8.20.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.20.0`, plus:

- [charts-premium] Add explicit return type to `ChartsRenderer` for better compatibility with React 18 (#20413) @arminmeh

### Docs

- [docs] Add `llms.txt` link to the sidebar (#20312) @siriwatknp
- [docs] Add a line chart demo for the Overview section (#20239) @prakhargupta1

## 8.19.0

_Nov 20, 2025_

We'd like to extend a big thank you to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🔎 Add pan on `wheel` to the charts zoom
- ⌨️ Allow opt-in to [tab navigation](https://mui.com/x/react-data-grid/accessibility/#tab-navigation) inside the Data Grid.
- ⚙️ New way of defining [action columns](https://mui.com/x/react-data-grid/column-definition/#ActionsWithModalGrid.tsx) in the Data Grid that makes it easier to keep `columns` prop stable.
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to these community members for their valuable contributions:
@lauri865, @noobyogi0010, @sai6855

The following team members contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @mj12albert, @noraleonte, @rita-codes, @siriwatknp, @ZeeshanTamboli

### Data Grid

#### `@mui/x-data-grid@8.19.0`

- [DataGrid] Add `tabNavigation` prop to control tab navigation in the grid (#20286) @arminmeh
- [DataGrid] Allow to focus disabled checkbox cells (#19959) @mj12albert
- [DataGrid] Alternative actions column definition API (#15041) @cherniavskii
- [DataGrid] Fix failing tests (#20332) @cherniavskii
- [DataGrid] Prevent Safari 26 error in the event handler (#20369) @arminmeh
- [DataGrid] Undeprecate the `autoHeight` prop (#20363) @cherniavskii
- [DataGrid] Fix print export grid dimensions with dynamic row height and print styles (#19835) @cherniavskii

#### `@mui/x-data-grid-pro@8.19.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.19.0`.

#### `@mui/x-data-grid-premium@8.19.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.19.0`, plus:

- [DataGridPremium] Fix aggregation with sorting (#19892) @lauri865
- [DataGridPremium] Lock `ExcelJS` version (#20329) @cherniavskii

### Date and Time Pickers

#### `@mui/x-date-pickers@8.19.0`

- [pickers] Do not loose `slotProps.field.slotProps` (#20322) @flaviendelangle

#### `@mui/x-date-pickers-pro@8.19.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.19.0`.

### Charts

#### `@mui/x-charts@8.19.0`

- [charts] Expose `niceDomain` utility (#20250) @bernardobelchior
- [charts] Fix benchmark regression by downgrading to JSDOM v26 (#20405) @bernardobelchior
- [charts] Fix Pie Chart keyboard focus highlight (#20358) @JCQuintas
- [charts] Memoize series selectors (#20326) @JCQuintas
- [charts] Relax dataset type (#20294) @bernardobelchior
- [charts] Remove `touch-action: pan-y` when zoom is disabled (#20204) @bernardobelchior
- [charts] Use `getBBox()` for correct SVG sizes in firefox (#20309) @JCQuintas
- [charts] Use directly selector from `@mui/x-internals` (#20365) @alexfauquette
- [charts] Fix unnecessary errors in dev mode (#20380) @JCQuintas

#### `@mui/x-charts-pro@8.19.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.19.0`, plus:

- [charts-pro] Add pan on `wheel` to zoom (#19998) @JCQuintas
- [charts-pro] Fix zoom slider preview having an opaque background in dark mode (#20367) @bernardobelchior

#### `@mui/x-charts-premium@8.19.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.19.0`.

### Tree View

#### `@mui/x-tree-view@8.19.0`

- [tree view] Enable lazy load when children count is not know in tree view (#18680) @noobyogi0010
- [tree view] Fix unwanted behaviors on the item re-ordering (#20368) @flaviendelangle

#### `@mui/x-tree-view-pro@8.19.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.19.0`.

### Codemod

#### `@mui/x-codemod@8.19.0`

Internal changes.

### Docs

- [docs] Add minimum Typescript version to migration guide (#20320) @siriwatknp
- [docs] Fix Autosizing documentation (#20348) @siriwatknp
- [docs] Fix separator opacity in demo (#20293) @sai6855
- [docs] Replace deprecated `LoadingButton` with `Button` component (#20208) @Janpot

### Core

- [code-infra] Add new broken links checker (#20120) @Janpot
- [code-infra] Disable Codspeed pipeline (#20370) @JCQuintas
- [code-infra] Optimize `checkMaterialVersion` (#20307) @Janpot
- [code-infra] Use utils from code-infra for changelog and PR creation (#20406) @brijeshb42
- [docs-infra] Revert `@docsearch/react` (#20313) @Janpot

### Miscellaneous

- [test] Fix browser tests skipping some projects (#20318) @cherniavskii
- [test] Update `use-react-version` pnpm script (#20319) @cherniavskii

## 8.18.0

<!-- generated comparing v8.17.0..master -->

_Nov 13, 2025_

We'd like to extend a big thank you to the 14 contributors who made this release possible. Here are some highlights ✨:

- Add `barLabelPlacement` property to customize the bar label position in bar charts, enabling labels to be placed above bars.

  ![image](https://github.com/user-attachments/assets/4bc3a75b-74b8-4c6d-896b-5f5bf837bcda)

- Add `source` property to the date/time picker lifecycle and event handler context, enabling clearer differentiation between changes initiated by the picker UI and those from direct field input.
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to these community members for their valuable contributions:
@htollefsen, @sai6855, @Sigdriv

The following team members contributed to this release:
@arminmeh, @bernardobelchior, @brijeshb42, @cherniavskii, @flaviendelangle, @JCQuintas, @michelengelen, @noraleonte, @prakhargupta1, @rita-codes, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.18.0`

- [DataGrid] Allow default event in the column action cell item click event handler (#20272) @arminmeh
- [DataGrid] Remove unnecessary generic from `useGridApiRef` (#20277) @cherniavskii

#### `@mui/x-data-grid-pro@8.18.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.18.0`.

#### `@mui/x-data-grid-premium@8.18.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.18.0`, plus:

- [DataGridPremium] Return the correct `cellParams` value from the aggregation cells (#20224) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.18.0`

- [pickers] Keep invalid date state consistent (#20040) @michelengelen
- [pickers] Adds new `source` property to `onChange` and `onAccept` context object (#20234) @michelengelen

#### `@mui/x-date-pickers-pro@8.18.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.18.0`.

### Charts

#### `@mui/x-charts@8.18.0`

- [charts] Add prop for positioning a bar label (#20194) @Sigdriv
- [charts] Fix applying dark mode styles in `ChartAxisZoomSliderThumb` (#20232) @sai6855

#### `@mui/x-charts-pro@8.18.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.18.0`, plus:

- [charts-pro] Allow specifying Content Security Policy nonce on export (#20053) @bernardobelchior
- [charts-pro] Fix applying dark mode styles to slider (#20220) @sai6855
- [charts-pro] Sankey should respect node order (#20065) @JCQuintas

#### `@mui/x-charts-premium@8.18.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.18.0`.

### Tree View

#### `@mui/x-tree-view@8.18.0`

- [tree view] Prepare tests for the new store structure (#20225) @flaviendelangle
- [tree view] Prepare the item plugin files for the store migration (#20240) @flaviendelangle
- [tree view] Use `TreeItemId` type instead of raw string (#20233) @flaviendelangle

#### `@mui/x-tree-view-pro@8.18.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.18.0`.

### Codemod

#### `@mui/x-codemod@8.18.0`

Internal changes.

### Docs

- [charts] Add a demo for a custom tick label (#20073) @prakhargupta1
- [charts] Create `useAxes()` hook documentation page (#20229) @JCQuintas
- [charts] Fix logo alignment (#20228) @JCQuintas
- [charts] Fixes typo in import example (#20236) @htollefsen
- [Data Grid] Add recipe for cursor pagination with data source (#19700) @siriwatknp
- [Data Grid] Add a demo for pinned rows aggregation (#20198) @cherniavskii

### Core

- [docs-infra] Use deployment config from docs-infra package (#20243) @brijeshb42

## 8.17.0

_Nov 5, 2025_

We'd like to extend a big thank you to the 13 contributors who made this release possible. Here are some highlights ✨:

- Add `colorGetter` prop to cartesian charts series

  <img width="400" alt="Image" src="https://github.com/user-attachments/assets/d8b1263f-794e-4939-b17e-87350fdd1746" />

- 🌎 Add Catalan (ca-ES) locale on the Data Grid
- 🌎 Add Norwegian Bokmål (nb-NO) locale on the Charts
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to these community members for their valuable contributions:
@frncesc, @Methuselah96, @samuelwalk, @htollefsen

The following team members contributed to this release:
@alexfauquette, @bernardobelchior, @flaviendelangle, @Janpot, @JCQuintas, @mnajdova, @rita-codes, @arminmeh, @brijeshb42

### Data Grid

#### `@mui/x-data-grid@8.17.0`

- [DataGrid] Stop event propagation on data grid action buttons (GridActionsCellItem) (#19513) @Copilot
- [DataGrid] Update cell editable state if `editable` prop is updated in the column definition (#20147) @arminmeh
- [DataGrid] Wait for external model updates before resetting pagination after sort/filter (#20162) @arminmeh
- [l10n] Add Catalan (ca-ES) locale (#20154) @frncesc
- [l10n] Improve Arabic (ar-SD) locale (#20185) @samuelwalk

#### `@mui/x-data-grid-pro@8.17.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.17.0`.

#### `@mui/x-data-grid-premium@8.17.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.17.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.17.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.17.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.17.0`.

### Charts

#### `@mui/x-charts@8.17.0`

- [charts] Add `barLabel` to bar series. Deprecate `barLabel` in `BarPlot`. (#20184) @bernardobelchior
- [charts] Add series color callback (#20084) @bernardobelchior
- [charts] Expose `ChartsSurface` classes (#20180) @bernardobelchior
- [charts] Fix chart cut off when inside `overflow: scroll` container (#20182) @bernardobelchior
- [charts] Fix tick label overflow on multiple axes and series demo (#20152) @bernardobelchior
- [charts] Organize series config (#20155) @bernardobelchior
- [charts] Use selectors from `@mui/x-internals` (#20052) @alexfauquette
- [charts] Use store from `@mui/x-internals` (#20121) @alexfauquette
- [charts] Add `useDataset` hook (#20205) @JCQuintas
- [l10n] Add Norwegian Bokmål (nb-NO) locale (#20197) @htollefsen

#### `@mui/x-charts-pro@8.17.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.17.0`, plus:

- [charts-pro] Fix zoom pan issue when controlled (#20163) @JCQuintas

#### `@mui/x-charts-premium@8.17.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.17.0`.

### Tree View

#### `@mui/x-tree-view@8.17.0`

- [tree view] Accept read only arrays in `expandedItems` prop (#20181) @Methuselah96
- [tree view] Use `aria-checked` instead of `aria-selected` on items (#19851) @flaviendelangle

#### `@mui/x-tree-view-pro@8.17.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.17.0`.

### Codemod

#### `@mui/x-codemod@8.17.0`

Internal changes.

### Docs

- [docs] Fix focus issues in the action column demo (#20178) @arminmeh
- [docs] Remove hidden Tree View headless page (#20119) @flaviendelangle
- [docs] Fix some external redirects (#20211) @Janpot

### Core

- [code-infra] Fix cci job timeout due to buffered test output (#20193) @Janpot
- [code-infra] Fix publish workflow (#20140) @bernardobelchior
- [code-infra] Increase JSDOM test parallelism (#20179) @Janpot
- [code-infra] Remove React import requirement for jsx (#20144) @brijeshb42
- [code-infra] Replace `getInitialProps` with `getStaticProps` (#20192) @Janpot
- [code-infra] git-ignore next-env.d.ts (#20177) @Janpot
- [code-infra] Stabilize screenshot testing (#19868) @Janpot

## 8.16.0

_Oct 29, 2025_

We'd like to extend a big thank you to the 14 contributors who made this release possible. Here are some highlights ✨:

- 🖌️ Add `brush` zoom interaction to charts
- 🔁 [Server-side update](https://mui.com/x/react-data-grid/server-side-data/#updating-server-side-data) in a grid with tree data/row grouping and aggregation will trigger re-fetch for all parent levels of that row to update aggregated values. See the [demo](https://mui.com/x/react-data-grid/server-side-data/aggregation/#usage-with-tree-data).

Special thanks go out to the community members for their valuable contributions:
@felix-wg, @frncesc, @sai6855

The following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @brijeshb42, @flaviendelangle, @JCQuintas, @MBilalShafi, @mbrookes, @michelengelen, @noraleonte, @rita-codes

### Data Grid

#### `@mui/x-data-grid@8.16.0`

- [DataGrid] Ignore `Ctrl+A` key combination for the row selection in the community version (#20110) @felix-wg
- [DataGrid][l10n] Improve Spanish (es-ES) locale (#20134) @frncesc

#### `@mui/x-data-grid-pro@8.16.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.16.0`, plus:

- [DataGridPro] Add explicit return type to `getVisibleRowsLookup()` to fix the build with `tsc` (#20116) @arminmeh
- [DataGridPro] Retain the expansion state with expansion configuration props (#20126) @MBilalShafi

#### `@mui/x-data-grid-premium@8.16.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.16.0`, plus:

- [DataGridPremium] Export and restore chart integration state (#20079) @arminmeh
- [DataGridPremium] Fix grouping column `valueFormatter()` crash (#20070) @sai6855
- [DataGridPremium] Refetch aggregation data after row update with server-side aggregation (#20039) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.16.0`

- [pickers] Prevent blur event propagation on individual sections (#19825) @michelengelen

#### `@mui/x-date-pickers-pro@8.16.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.16.0`.

### Charts

#### `@mui/x-charts@8.16.0`

- [charts] Allow tooltip to anchor items (#19954) @alexfauquette
- [charts] Fix behavior of grouped axis (#20118) @JCQuintas
- [charts] Move scale symlog inside scales (#20137) @JCQuintas
- [charts] Fix AreaChartConnectNulls demo height not correctly resizing (#20078) @sai6855
- [charts] Fix charts resizing overflow (#20080) @alexfauquette
- [charts] Fix tooltip not showing on first render (#20115) @bernardobelchior
- [charts] Handle `undefined` id and color in series (#20087) @bernardobelchior
- [charts] Remove `useMemo` from isZoomOn*Enabled and isPanOn*Enabled hooks (#20132) @Copilot
- [charts] Use static data for perf (#20072) @JCQuintas
- [charts] Move scale symlog inside scales (#20137) @JCQuintas

#### `@mui/x-charts-pro@8.16.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.16.0`, plus:

- [charts-pro] Add `brush` zoom interaction (#19899) @JCQuintas
- [charts-pro] Add sankey performance check (#20069) @JCQuintas

#### `@mui/x-charts-premium@8.16.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.16.0`.

### Tree View

#### `@mui/x-tree-view@8.16.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.16.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.16.0`.

### Codemod

#### `@mui/x-codemod@8.16.0`

Internal changes.

### Core

- [code-infra] Setup eslint compat plugin (#20105) @brijeshb42
- [code-infra] Improve store types (#20129) @JCQuintas
- [docs] Update the callout in `rows` prop documentation (#20127) @MBilalShafi
- [docs-infra] Refine changelog contributor acknowledgment messages (#20123) @mbrookes

### Miscellaneous

- [x-telemetry] Skip telemetry tests on browser mode (#20122) @bernardobelchior

## 8.15.0

_Oct 23, 2025_

We'd like to extend a big thank you to the 14 contributors who made this release possible. Here are some highlights ✨:

- 🖌️ Add new [`brush` charts interaction](https://mui.com/x/react-charts/brush/) for building custom behavior.
  ![brush visualization example](https://github.com/user-attachments/assets/60c382a1-e418-4736-8dcb-1567c4e361e3)
- ⚡️ Performance improvements for large bar charts
- 🤖 Data Grid AI assistant can now [visualize the query results](https://mui.com/x/react-data-grid/ai-assistant/#data-visualization) by controlling the chart integration settings
- 📦 DataGrid uses an internal MUI fork of ExcelJS that does not depend on vulnerable versions of NPM packages
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@ZagrebaAlex

The following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @KenanYusuf, @prakhargupta1, @rita-codes, @siriwatknp, @arminmeh, @brijeshb42, @noraleonte

### Data Grid

#### `@mui/x-data-grid@8.15.0`

- [DataGrid] Fix `dataSource.fetchRows` API's return type (#20068) @arminmeh

#### `@mui/x-data-grid-pro@8.15.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.15.0`, plus:

- [DataGridPro] Keep children in the tree after parent row is re-fetched with the data source (#19934) @arminmeh
- [DataGridPro] Support scroll shadows customization (#19982) @KenanYusuf

#### `@mui/x-data-grid-premium@8.15.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.15.0`, plus:

- [DataGridPremium] Use ExcelJS fork (#19796) @cherniavskii
- [DataGridPremium] Support data visualization in AI Assistant (#19831) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.15.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.15.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.15.0`.

### Charts

#### `@mui/x-charts@8.15.0`

- [charts] Add `ChartsBrushOverlay` and allow brush configuration (#19956) @JCQuintas
- [charts] Add `getStringSize` benchmark. Remove benchmarks from built package. (#19995) @bernardobelchior
- [charts] Batch string size measurement (#19994) @bernardobelchior
- [charts] Fix console issue (#20025) @JCQuintas
- [charts] Fix is[ZoomFeature]Enabled type (#20058) @alexfauquette
- [charts] Fix reference line middle spacing (#20004) @JCQuintas
- [charts] Improve `getStringSize` and `batchMeasureStrings` performance (#19996) @bernardobelchior
- [charts] Improve deep export script (#20007) @JCQuintas
- [charts] Improve string measurement benchmarks (#19999) @bernardobelchior
- [charts] Measure string sizes using SVG elements (#19981) @bernardobelchior
- [l10n] Improve Greek (gr-GR) locale (#20060) @ZagrebaAlex

#### `@mui/x-charts-pro@8.15.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.15.0`, plus:

- [charts-pro] Fix pan with `axis.reverse` (#20031) @JCQuintas

#### `@mui/x-charts-premium@8.15.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.15.0`.

### Tree View

#### `@mui/x-tree-view@8.15.0`

- [tree view] Multi character type-ahead (#19942) @noraleonte

#### `@mui/x-tree-view-pro@8.15.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.15.0`.

### Codemod

#### `@mui/x-codemod@8.14.0`

Internal changes.

### Docs

- [docs] Add overview section for scatter chart and heatmap (#19888) @prakhargupta1
- [docs] Add charts bell curve example (#20003) @JCQuintas
- [docs] Add grouped multiple fields for Data Grid row grouping recipe (#19964) @siriwatknp
- [docs] Add Data Grid loading state recipe (#19958) @siriwatknp

### Core

- [code-infra] Remove @mui/monorepo usage for react versioning (#19894) @Janpot
- [code-infra] Remove invalid `environment: 'browser'` from vitest browser config (#19993) @bernardobelchior
- [code-infra] Remove unused babel aliases (#19987) @Janpot
- [code-infra] Turn on all testing-library eslint rules (#19946) @brijeshb42
- [docs-infra] Fix broken hash link (#20062) @Janpot

## 8.14.1

_Oct 16, 2025_

We'd like to extend a big thank you to the 14 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Charts have optimized data structures for closest point calculations — initial render times reduced by ~25% for 1,000+ data points, with greater gains at larger scales (#19790) @bernardobelchior
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@djpremier, @jacknot, @justdoit1897, @mellis481, @sai6855

The following are all team members who have contributed to this release:
@arminmeh, @bernardobelchior, @brijeshb42, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @noraleonte, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.14.1`

- [DataGrid] Fix cell not rerendering on `isCellEditable` prop change (#19898) @cherniavskii
- [DataGrid] Fix virtualizer memory leaks (#19886) @cherniavskii
- [DataGrid] Fix tree data unable to deselect row for exclude model (#19846) @siriwatknp
- [l10n] Improve Italian (it-IT) locale (#19322) @jacknot and (#19940) @justdoit1897

#### `@mui/x-data-grid-pro@8.14.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.14.1`, plus:

- [DataGridPro] Clear cache before new request to the nested request queue after a row has been edited (#19873) @arminmeh

#### `@mui/x-data-grid-premium@8.14.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.14.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.14.1`

Internal changes.

#### `@mui/x-date-pickers-pro@8.14.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.14.1`.

### Charts

#### `@mui/x-charts@8.14.1`

- [charts] Fix `minBarSize` when y-axis is reversed (#19932) @bernardobelchior
- [charts] Fix bar chart border radius when axis is reversed (#19895) @bernardobelchior
- [charts] Fix scatter chart `datasetKeys.id` not being optional (#19897) @bernardobelchior
- [charts] Use more performant data structure for closest point (#19790) @bernardobelchior
- [charts] Fix `GaugeValueArc` having wrong class (#19965) @bernardobelchior
- [charts] Fix `undefined` path when highlight empty line chart axis (#19969) @bernardobelchior

#### `@mui/x-charts-pro@8.14.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.14.1`, plus:

- [charts-pro] Add `highlighting` to Sankey chart (#19662) @JCQuintas

#### `@mui/x-charts-premium@8.14.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.14.1`.

### Tree View

#### `@mui/x-tree-view@8.14.1`

- [tree view] Do not forward the `ownerState` to the icon (#19772) @flaviendelangle

#### `@mui/x-tree-view-pro@8.14.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.14.1`.

### Codemod

#### `@mui/x-codemod@8.14.0`

Internal changes.

### Docs

- [docs] Add `'bumpX'` and `'bumpY'` curve types to the interpolation demo (#19676) @djpremier
- [docs] Add scatter chart with linear regression demo (#19900) @bernardobelchior
- [docs] Correctly describe Data Grid's row selection behavior (#19968) @arminmeh
- [docs] Fix `isExpanded` type in tree view docs (#19092) @mellis481

### Core

- [code-infra] Disable Netlify cache plugin (#19950) @Janpot
- [code-infra] Lint json through eslint (#19890) @Janpot
- [docs-infra] Use published netlify cache plugin package (#19929) @brijeshb42

## 8.14.0

_Oct 9, 2025_

We'd like to extend a big thank you to the 14 contributors who made this release possible. Here are some highlights ✨:

- 📊 The [Chart zoom now supports the `pressAndDrag` gesture](https://mui.com/x/react-charts/zoom-and-pan/#zoom-interactions-configuration). Pan by pressing and dragging.
- 🔄 [Server-side pivoting](https://mui.com/x/react-data-grid/server-side-data/pivoting/) support for the Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@djpremier, @Utkarsh-0304

The following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @flaviendelangle, @hasdfa, @Janpot, @JCQuintas, @prakhargupta1, @rita-codes, @noraleonte, @brijeshb42, @arminmeh, @michelengelen

### Data Grid

#### `@mui/x-data-grid@8.14.0`

- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#19658) @djpremier

#### `@mui/x-data-grid-pro@8.14.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.14.0`.

#### `@mui/x-data-grid-premium@8.14.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.14.0`, plus:

- [DataGridPremium] Server-side pivoting (#19575) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.14.0`

- [pickers] Fixed the extra element for the disabled date picker (#19387) @Utkarsh-0304
- [pickers] Fix input `autoCapitalize` value for Firefox compatibility (#19285) @michelengelen
- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#19658) @djpremier

#### `@mui/x-date-pickers-pro@8.14.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.14.0`.

### Charts

#### `@mui/x-charts@8.14.0`

- [charts] Add `pressAndDrag` pan gesture (#19779) @JCQuintas
- [charts] Allow `minPointers` and `maxPointers` to be configured by pointer type (#19794) @JCQuintas
- [charts] Correct scale domain types (#19844) @bernardobelchior
- [charts] Fix tooltip position when scrolling (#19857) @alexfauquette
- [charts] Link item highlight with keyboard navigation (#19768) @alexfauquette
- [charts] Refactor domain/scale selectors (#19832) @bernardobelchior
- [charts] Remove min/max from ordinal configuration (#19789) @alexfauquette
- [charts] Simplify axes filters selectors (#19833) @bernardobelchior
- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#19658) @djpremier

#### `@mui/x-charts-pro@8.14.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.14.0`.

#### `@mui/x-charts-premium@8.14.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.14.0`.

### Tree View

#### `@mui/x-tree-view@8.14.0`

- [tree view] Fix Tree View tooltip anchoring on overview page (#19806) @noraleonte

#### `@mui/x-tree-view-pro@8.14.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.14.0`.

### Codemod

#### `@mui/x-codemod@8.14.0`

Internal changes.

### Docs

- [docs] Add overview section for pie chart (#19672) @prakhargupta1
- [docs] Fix demo title knob keys (#19843) @JCQuintas
- [docs] Hide UI elements of unsupported features in the data source demos (#19849) @arminmeh

### Core

- [code-infra] Cleanup unused dependencies (#19788) @brijeshb42
- [code-infra] Fix pnpm-lock issue (#19861) @JCQuintas
- [code-infra] Improve publishing docs (#19404) @Janpot
- [code-infra] Remove tsconfig `baseUrl` (#19837) @Janpot
- [code-infra] Support custom npm dist tags during release (#19803) @Janpot
- [code-infra] Wait longer for print dialog (#19795) @JCQuintas
- [code-infra] Replace `lodash` with `es-toolkit` (#19853) @bernardobelchior
- [code-infra] Update release script PR checklist (#19785) @bernardobelchior
- [code-infra] Remove remaining usages of `lodash` (#19864) @bernardobelchior
- [docs-infra] Add `title` knob (#19792) @JCQuintas
- [docs-infra] Fix missing key in title knob (#19804) @JCQuintas

### Miscellaneous

- [x-telemetry] Fix transpile issues (#19761) @hasdfa
- [x-telemetry] Fix ref to deleted file (#19842) @JCQuintas

## 8.13.1

_Oct 1, 2025_

- 🐛 Fix `@mui/x-charts-pro` failure on import due to missing `@mui/x-internals` release

### Data Grid

#### `@mui/x-data-grid@8.13.1`

Internal changes.

#### `@mui/x-data-grid-pro@8.13.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.13.1`.

#### `@mui/x-data-grid-premium@8.13.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.13.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.12.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.12.0`.

### Charts

#### `@mui/x-charts@8.13.1`

Internal changes.

#### `@mui/x-charts-pro@8.13.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.13.1`, plus:

- [charts-pro] Fix `@mui/x-charts-pro` failure on import due to missing `@mui/x-internals` release @bernardobelchior

#### `@mui/x-charts-premium@8.13.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.13.1`.

### Tree View

#### `@mui/x-tree-view@8.13.1`

Internal changes.

#### `@mui/x-tree-view-pro@8.13.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.13.1`.

### Codemod

#### `@mui/x-codemod@8.12.0`

Internal changes.

## 8.13.0

_Oct 1, 2025_

We'd like to extend a big thank you to the 14 contributors who made this release possible. Here are some highlights ✨:

- 📊 The chart zoom now supports the `tapAndDrag` gesture. Zoom in/out by tapping twice and dragging vertically.
- 🔎 Charts now allow [fine-grained control for zoom interactions](https://mui.com/x/react-charts/zoom-and-pan/#zoom-interactions-configuration).
  ```jsx
  <BarChartPro
    zoomInteractionConfig={{
      // Only zoom when Control key is pressed
      zoom: [{ type: 'wheel', keys: ['Control'] }],
      // Only pan when Shift key is pressed
      pan: [{ type: 'drag', keys: ['Shift'] }],
    }}
  />
  ```
- ➡️ Data Grid grouping rows now persist their expansion state when the rows are updated.
- 📜 Updated Data Grid vertical scrollbar to include pinned rows and aggregation sections.
- 📌 Improved the appearance of [pinned columns](https://mui.com/x/react-data-grid/column-pinning/#pinned-columns-appearance) and [pinned rows](https://mui.com/x/react-data-grid/row-pinning/#pinned-rows-appearance) sections in the Data Grid.
- 🚀 Tree View now fetches the children of expanded items on mount when using lazy loading.
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@sai6855

The following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @flaviendelangle, @hasdfa, @Janpot, @JCQuintas, @KenanYusuf, @mapache-salvaje, @MBilalShafi, @mnajdova, @rita-codes, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.13.0`

- [DataGrid] Add scroll shadows and fix scrollbar overlap (#16476) @KenanYusuf
- [DataGrid] Fix row spanning stale state issue (#19733) @MBilalShafi
- [DataGrid] Fix toolbar `slotProps` not being applied (#19769) @sai6855
- [DataGrid] Skip calling `fetchRows()` when strategy is not initialized (#19728) @MBilalShafi

#### `@mui/x-data-grid-pro@8.13.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.13.0`, plus:

- [DataGridPro] Retain expansion state on rows update (#19697) @MBilalShafi

#### `@mui/x-data-grid-premium@8.13.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.13.0`, plus:

- [DataGridPremium] Add `metadata.referenceId` to AI assistant prompt resolver (#19695) @hasdfa
- [DataGridPremium] Fix aggregation value retrieval (#19724) @arminmeh
- [DataGridPremium] Get correct active chart id while rebuilding data (#19720) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.12.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.12.0`.

### Charts

#### `@mui/x-charts@8.13.0`

- [charts] Add `tapAndDrag` zoom gesture (#19727) @JCQuintas
- [charts] Add arc focus indicator that follows the arc form (#19696) @mnajdova
- [charts] Fix outline color (#19752) @alexfauquette
- [charts] Improve tooltip doc (#19731) @JCQuintas
- [charts] Make axis highlight reflect the keyboard interaction (#19631) @alexfauquette
- [charts] Prevent horizontal scroll on keyboard navigation (#19704) @alexfauquette
- [charts] Simplify gestures by removing bindings (#19767) @JCQuintas

#### `@mui/x-charts-pro@8.13.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.13.0`, plus:

- [charts-pro] Allow zoom interactions to be configured (#18646) @JCQuintas
- [charts-pro] Fix zoom preview having wrong domain in some cases (#19723) @bernardobelchior

#### `@mui/x-charts-premium@8.13.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.13.0`.

### Tree View

#### `@mui/x-tree-view@8.13.0`

- [tree view] Export the `apiRef` type of each Tree View component (#19543) @flaviendelangle
- [tree view] Fix indeterminate checkbox state (#19544) @flaviendelangle
- [tree view] Improve the lazy loading initial expansion (#19284) @flaviendelangle
- [tree view] Use Base UI utils whenever possible (#19502) @flaviendelangle

#### `@mui/x-tree-view-pro@8.13.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.13.0`.

### Codemod

#### `@mui/x-codemod@8.12.0`

Internal changes.

### Docs

- [docs] Add a recipe to customize editing component with Autocomplete (#19651) @siriwatknp
- [docs] Refine the electricity scatter tooltip (#19689) @alexfauquette
- [docs] Revise the Axis doc (#19052) @mapache-salvaje
- [docs] Remove reference to nonexistent `FocusedMark` API page (#19773) @bernardobelchior

### Core

- [code-infra] Change charts codspeed integration to use walltime (#19729) @JCQuintas
- [code-infra] Port stylelint from core repo (#19633) @Janpot
- [code-infra] Stabilize fake timers in regression tests (#19719) @Janpot
- [code-infra] Stabilize size for bundles with `releaseInfo` (#19674) @Janpot
- [code-infra] Fix `pnpm-lock.yaml` broken lockfile (#19755) @bernardobelchior

## 8.12.1

_Sep 25, 2025_

Release highlight ✨:

- 🐞 Hotfix for Grid-Charts integration issue with aggregated values

### Data Grid

#### `@mui/x-data-grid@8.12.1`

Internal changes.

#### `@mui/x-data-grid-pro@8.12.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.12.1`.

#### `@mui/x-data-grid-premium@8.12.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.12.1`, plus:

- [DataGridPremium] Collect aggregated values properly for the charts integration context (#19714) @arminmeh

## 8.12.0

_Sep 25, 2025_

We'd like to extend a big thank you to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🤝 Grid-Charts integration

![Grid x Charts](https://github.com/user-attachments/assets/0817c36f-f87f-4688-8f30-fa0db638ca8c)

👉 [🎥 Watch the full video](https://github.com/user-attachments/assets/28f1848e-dc85-4077-8756-a3e88afd4e54)

- ⌨️ Charts keyboard navigation
- ⚡️ Charts: Add new `renderer="svg-batch"` prop to Scatter charts that provides improved performance for large datasets
- 🐞 Bugfixes
- 📚 Documentation improvements
- 🧰 Codemod requires Node >=20.19

`@mui/x-codemod` minimum supported Node version is `20.19`.
This was only the case due to using the v18 `yargs` package; this now explicitly aligns with it. (#18979)

Special thanks go out to the community members for their valuable contributions:
@deade1e, @sai6855, @thomas-mcdonald

The following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @flaviendelangle, @Janpot, @JCQuintas, @LukasTy, @michelengelen, @prakhargupta1, @rita-codes, @siriwatknp, @arminmeh, @romgrk

### Data Grid

#### `@mui/x-data-grid@8.12.0`

- [DataGrid] Fix flex column width diff calculation while resizing (#19667) @arminmeh

#### `@mui/x-data-grid-pro@8.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.12.0`.

#### `@mui/x-data-grid-premium@8.12.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.12.0`, plus:

- [DataGridPremium] Grid-Charts integration (#18021) @arminmeh
- [DataGridPremium] Fix sorting and filtering of the tree group columns with aggregation (#19607) @arminmeh
- [DataGridPremium] Disable aggregation on the grouping column by default (#19692) @arminmeh
- [DataGridPremium] Do not rely on the group separation constant to retrieve the column name for the charts panel (#19677) @arminmeh
- [DataGridPremium] Fix stale aggregation state (#19690) @arminmeh
- [DataGridPremium] Fix pivot column being hidden on autosizing (#19699) @cherniavskii

### Date and Time Pickers

#### `@mui/x-date-pickers@8.12.0`

- [pickers] Ensure reference value is not updated for invalid values (#19635) @michelengelen
- [pickers] Fix `slotProps.textField.slotProps.htmlInput` resolution (#19713) @LukasTy
- [pickers] Preserve time format when using single column layout on Time Range Picker (#19626) @sai6855
- [pickers] Preserve time format when using single column layout on Date Time Picker and Date Time Range Picker (#19608) @sai6855

#### `@mui/x-date-pickers-pro@8.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.12.0`.

### Charts

#### `@mui/x-charts@8.12.0`

- [charts] Add batch renderer for scatter chart (#19075) @bernardobelchior
- [charts] Add renderer suffix to performance benchmarks (#19620) @bernardobelchior
- [charts] Document how plugins can be used (#19343) @alexfauquette
- [charts] Export chart plugins per series type (#19337) @alexfauquette
- [charts] Export plugins (#19335) @alexfauquette
- [charts] Fix horizontal layout and toolbar (#19655) @alexfauquette
- [charts] Fix performance issue with JS animations (#19606) @bernardobelchior
- [charts] Fix piecewise scale causing wrong colors in axis with min/max (#19610) @bernardobelchior
- [charts] Fix zoom discard inconsistency (#19535) @bernardobelchior
- [charts] Introduce keyboard navigation (#19155) @alexfauquette
- [charts] Refactor `getAxisExtremum` (#19627) @bernardobelchior
- [charts] Remove unused code path from `getAxisScale` (#19673) @bernardobelchior
- [charts] Make new hideLegend prop on ChartWrapper optional (#19694) @thomas-mcdonald
- [charts] Fix chart crash in test environment (#19711) @JCQuintas

#### `@mui/x-charts-pro@8.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.12.0`, plus:

- [charts-pro] Add `valueFormatter` to sankey (#19636) @JCQuintas
- [charts-pro] Allow `source/target` keywords in sankey link color (#19634) @JCQuintas
- [charts-pro] Allow exporting `SankeyChart` (#19659) @JCQuintas
- [charts-pro] Fix axis inversion when using axis `max` and `filterMode: 'discard'` (#19200) @bernardobelchior

#### `@mui/x-charts-premium@8.12.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@8.12.0`, plus:

- [charts-premium] Grid-Charts integration (#18021) @arminmeh

### Tree View

#### `@mui/x-tree-view@8.12.0`

- [tree view] Allow to pass `null` to the icon slots (#19569) @flaviendelangle
- [tree view] Fix `apiRef.current.isItemExpanded()` method (#19619) @flaviendelangle

#### `@mui/x-tree-view-pro@8.12.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.12.0`.

### Codemod

#### `@mui/x-codemod@8.12.0`

- [codemod] Bump `engines.node` to `>=20.19` to align with `yargs` package (#18979) @LukasTy

### Docs

- [docs] Add missing label to Charts example (#19616) @prakhargupta1
- [docs] Replace axis type and axis data with a table (#19618) @prakhargupta1
- [docs] Add Charts example collection page (#18353) @prakhargupta1
- [docs] Add a Charts demo showcasing bar and scatter composition (#19605) @prakhargupta1
- [docs] Add composition Charts demo for legends and tooltip (#19602) @prakhargupta1
- [docs] Add recipe about server-side data export (#19617) @siriwatknp
- [docs] Clarify DataGrid layout requirements (#19413) @romgrk
- [docs] Fix `ExportServerSideData` demo layout shift (#19669) @siriwatknp
- [docs] Improve server-side `updateRow()` description (#19554) @deade1e
- [docs] Show how to customize drawing area background (#19682) @alexfauquette
- [docs] Add hook documentation pages (#19334) @Copilot

### Core

- [code-infra] Add copilot instructions specific to x repo (#19623) @JCQuintas
- [code-infra] Load `tsx` files in visual regression (#19595) @JCQuintas
- [code-infra] Remove renovate automerge (#19501) @Janpot
- [code-infra] Update `DEFAULT_TIMESTAMP` format to ISO 8601 (#19624) @Janpot
- [code-infra] Update `findLatestTaggedVersion` to filter tags based on major version (#19693) @michelengelen
- [code-infra] Fix changelog generation for charts premium (#19701) @JCQuintas
- [code-infra] Run prettier on `createReleasePR.mjs` (#19702) @bernardobelchior
- [code-infra] Make `x-charts-premium` releasable (#18959) @JCQuintas
- [docs-infra] Ensure `create-playground` script only runs if target file is absent (#19603) @michelengelen
- [docs-infra] Add @prakhargupta1 as a codeowner of the docs (#19679) @alexfauquette

### Miscellaneous

- [test] Reduce time for wheel zoom test (#19571) @alexfauquette
- Change `matchPackageNames` to `matchDepNames` for date-fns-v2 @Janpot
- Remove groupName for date-fns-v2 in renovate.json @Janpot

## 8.11.3

_Sep 16, 2025_

We'd like to extend a big thank you to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@sai6855

The following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @brijeshb42, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @LukasTy, @rita-codes, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.11.3`

- [DataGrid] Fix numeric font size not being applied (#19552) @cherniavskii
- [DataGrid] Improve `operator` types to display literal values (#19529) @siriwatknp

#### `@mui/x-data-grid-pro@8.11.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.11.3`.

#### `@mui/x-data-grid-premium@8.11.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.11.3`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.11.3`

- [pickers] Refactor `slots` and `slotProps` propagation strategy (#18867) @LukasTy

#### `@mui/x-date-pickers-pro@8.11.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.11.3`.

### Charts

#### `@mui/x-charts@8.11.3`

- [charts] Add `inline-` piecewise legend options (#19382) @JCQuintas
- [charts] Add bar gradient example (#19174) @bernardobelchior
- [charts] Ignore empty tick labels in label overlap computation (#19547) @alexfauquette
- [charts] Rename `isBandScale` to `isDiscreteScale` (#19514) @bernardobelchior
- [charts] Fix legend position affecting toolbar's position (#19257) @sai6855

#### `@mui/x-charts-pro@8.11.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.11.3`, plus:

- [charts-pro] Add chart title and caption to export demo (#19524) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.11.3`

- [tree view] Stop looping through all items to publish the `removeItem` event (#19500) @flaviendelangle
- [tree view] Support flat DOM structure (#19350) @flaviendelangle
- [tree view] Update cursor styles for disabled TreeItem (#19548) @sai6855

#### `@mui/x-tree-view-pro@8.11.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.11.3`.

### Codemod

#### `@mui/x-codemod@8.11.3`

Internal changes.

### Docs

- [docs] Add styling row group recipe (#19349) @siriwatknp
- [docs] Group demos data into the dataset folder (#19549) @alexfauquette
- [docs] Add `shiny` bar chart example at the top (#19416) @JCQuintas

### Core

- [code-infra] Axios update (#19577) @Janpot
- [code-infra] Remove usage of copy-files command from code-infra (#19518) @brijeshb42
- [internal] Fix naming to match convention @oliviertassinari

## 8.11.2

_Sep 10, 2025_

We'd like to extend a big thank you to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@ludvigeriksson, @sai6855

The following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @brijeshb42, @flaviendelangle, @Janpot, @LukasTy, @MBilalShafi, @noraleonte, @rita-codes, @romgrk, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.11.2`

- [DataGrid] Allow opting out of the exclude row selection model (#19423) @MBilalShafi
- [DataGrid] Fix column dropdown menu text alignment for the "Unpin" menu item (#19462) @MBilalShafi
- [DataGrid] Fix indeterminate state for "Select all" checkbox with exclude model (#19466) @MBilalShafi
- [DataGrid] Fix styled API arguments error (#19460) @MBilalShafi
- [DataGrid] Fix `stringify()` for theme objects (#19427) @romgrk

#### `@mui/x-data-grid-pro@8.11.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.11.2`.

#### `@mui/x-data-grid-premium@8.11.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.11.2`, plus:

- [DataGridPremium] Fallback to the regular reorder method for plain data (#19467) @MBilalShafi
- [DataGridPremium] Fix showing `0` as total aggregation value when aggregation position is set to `null` for row groups (#19515) @cherniavskii

### Date and Time Pickers

#### `@mui/x-date-pickers@8.11.2`

- [pickers] Gracefully handle `textField.slotProps` (#18980) @LukasTy
- [pickers] Improve hour and minute placement in Date Time Picker (#19227) @MBilalShafi
- [pickers] Use `calendarState.currentMonth` in Month Calendar when available (#19073) @LukasTy
- [pickers] Improve invalid value pasting into a section (#19357) @sai6855
- [fields] Remove redundant `id` and `aria-labelledby` attributes from spinbuttons (#19523) @LukasTy

#### `@mui/x-date-pickers-pro@8.11.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.11.2`.

### Charts

#### `@mui/x-charts@8.11.2`

- [charts] Fix highlight regression (#19486) @alexfauquette
- [charts] Improve code reuse in `ChartsXAxis` and `ChartsYAxis` (#19198) @bernardobelchior
- [charts] Simplify params in `getRange` and `createDateFormatter` (#19517) @bernardobelchior
- [charts] Handle domain edge cases with `filterMode: 'discard'` (#19199) @bernardobelchior
- [l10n] Add Swedish (sv-SE) locale (#19489) @ludvigeriksson

#### `@mui/x-charts-pro@8.11.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.11.2`.

### Tree View

#### `@mui/x-tree-view@8.11.2`

- [TreeView] Do not mutate `props.items` in the `getItemTree()` method (#19483) @flaviendelangle
- [TreeView] Expose a new hook to apply selection propagation on the selected items (#19402) @flaviendelangle

#### `@mui/x-tree-view-pro@8.11.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.11.2`.

### Codemod

#### `@mui/x-codemod@8.11.2`

Internal changes.

### Docs

- [docs] Add recipe for save and manage filters from the panel (#19361) @siriwatknp

### Core

- [code-infra] Remove log when restarting dev server (#19490) @bernardobelchior
- [code-infra] Store test results in CI (#19507) @Janpot

### Miscellaneous

- [infra] Set nodejs versions of various CIs to 22.18 (#19503) @brijeshb42
- [test] Split infinitive @romgrk

## 8.11.1

_Sep 4, 2025_

We'd like to extend a big thank you to the 6 contributors who made this release possible. Here are some highlights ✨:

Special thanks go out to the community members for their valuable contributions:
@sai6855

The following are all team members who have contributed to this release:
@brijeshb42, @flaviendelangle, @JCQuintas, @mapache-salvaje, @oliviertassinari

### Data Grid

#### `@mui/x-data-grid@8.11.1`

- [DataGrid] Refine types in `GridCell` component (#19384) @sai6855

#### `@mui/x-data-grid-pro@8.11.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.11.1`.

#### `@mui/x-data-grid-premium@8.11.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.11.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.11.1`

- [pickers] Merge `slotProps` for input adornment in `PickerFieldUI` component (#19399) @sai6855

#### `@mui/x-date-pickers-pro@8.11.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.11.1`.

### Charts

#### `@mui/x-charts@8.11.1`

- [charts] Prevent crash and warn user on incorrect `axisId` when composing (#19397) @JCQuintas

#### `@mui/x-charts-pro@8.11.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.11.1`.

### Tree View

#### `@mui/x-tree-view@8.11.1`

- [tree view] Expose the methods to manually refetch the children of an item (#19248) @flaviendelangle
- [tree view] Use the shared store implementation instead of the custom one (#19261) @flaviendelangle

#### `@mui/x-tree-view-pro@8.11.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.11.1`.

### Codemod

#### `@mui/x-codemod@8.11.1`

Internal changes.

### Docs

- [docs] Fix grammar and spelling mistakes on the Date and Time Pickers pages (#19300) @mapache-salvaje
- [docs] Remove wrong legend info (#19383) @JCQuintas

### Core

- [internal] Fix action alert (#19388) @oliviertassinari
- [internal] Fix pnpm valelint to have 0 errors @oliviertassinari
- [infra] Remove "main" fields from publishable packages (#19407) @brijeshb42

## 8.11.0

_Aug 29, 2025_

We'd like to extend a big thank you to the 19 contributors who made this release possible. Here are some highlights ✨:

- 📊 Add new `SankeyChart`

  <img height="300" alt="Screenshot 2025-07-24 at 12 54 33" src="https://github.com/user-attachments/assets/d77bcec1-044b-48c6-b37d-d7b74793b91c" />

- 🚀 Data Grid row grouping now supports row reordering

  See the [Drag-and-drop group reordering](https://mui.com/x/react-data-grid/row-grouping/#drag-and-drop-group-reordering) section for more details.

- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@dwrth, @lauri865, @Webini

The following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @brijeshb42, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @mapache-salvaje, @MBilalShafi, @michelengelen, @noraleonte, @oliviertassinari, @rita-codes, @romgrk, @sai6855, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.11.0`

- [DataGrid] Fix focused column header scroll jump (#19323) @lauri865
- [DataGrid] Bring `columnUnsortedIcon` slot back (#19268) @arminmeh
- [DataGrid] Do not add `menu` role to the empty actions menu (#19338) @arminmeh
- [DataGrid] Fix `columnsManagementRow` style override slot not working (#19097) @dwrth
- [DataGrid] Fix pagination state synchronization issue (#19290) @MBilalShafi
- [DataGrid] Fix scroll issue in R17 (#19265) @romgrk
- [DataGrid] Hide column separator of non-resizable pinned column (#19277) @arminmeh

#### `@mui/x-data-grid-pro@8.11.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.11.0`, plus:

- [DataGridPro] Fix column menu sort when `multipleColumnsSortingMode="always"` (#19099) @MBilalShafi
- [DataGridPro] Keep the drop effect if `keepColumnPositionIfDraggedOutside` is enabled (#19372) @arminmeh

#### `@mui/x-data-grid-premium@8.11.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.11.0`, plus:

- [DataGridPremium] Fix `valueFormatter` issues when `rowGroupingColumnMode="single"` (#18967) @cherniavskii
- [DataGridPremium] Reordering support for row grouping (#18251) @MBilalShafi

### Date and Time Pickers

#### `@mui/x-date-pickers@8.11.0`

- [pickers] Fix Firefox bug causing crash when `startContainer` is a restricted object (#18772) @Webini
- [pickers] RTL not applied correctly for Calendar Systems examples (works in v7.x but broken in latest version) (#19287) @rita-codes
- [pickers] Use the locale week day on the Luxon adapter (#19230) @flaviendelangle
- [pickers] Fix display of placeholder when label is shrunk (#19318) @sai6855

#### `@mui/x-date-pickers-pro@8.11.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.11.0`.

### Charts

#### `@mui/x-charts@8.11.0`

- [charts] Add `RadarAxis` component to render labels (#19240) @alexfauquette
- [charts] Handle item identifier with data (#19295) @JCQuintas
- [charts] Refactor optional chaining for props in PieChart, PieChartPro, and ScatterChartPro components (#19292) @sai6855
- [charts] Remove unused `fill` and `stroke` properties (#19316) @sai6855
- [charts] Correct `hideLegend` prop description in docs (#19371) @sai6855

#### `@mui/x-charts-pro@8.11.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.11.0`, plus:

- [charts-pro] Add new `SankeyChart` (#18895) @JCQuintas

### Tree View

#### `@mui/x-tree-view@8.11.0`

- [tree view] Improve the typing of the item's checkbox `slotProps` (#19247) @flaviendelangle

#### `@mui/x-tree-view-pro@8.11.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.11.0`.

### Codemod

#### `@mui/x-codemod@8.11.0`

Internal changes.

### Docs

- [docs][TreeView] Fix grammar and spelling mistakes (#19299) @mapache-salvaje
- [docs][DataGrid] Add pagination number formatting doc with a demo (#19221) @siriwatknp
- [docs][Charts] Correct some small grammar mistakes (#19297) @mapache-salvaje
- [docs][DataGrid] Correct grammar mistakes (#19298) @mapache-salvaje
- [docs][DataGrid] Make it clear that the API key for AI Assistant must be private (#19244) @oliviertassinari

### Core

- [code-infra] Remove unnecessary triggers from publish workflow (#19348) @Janpot
- [code-infra] Set up publishing from GitHub actions (#19264) @Janpot
- [code-infra] Update renovate, exclude infra packages from MUI group (#19288) @Janpot
- [internal] Add comment for Codspeed triggers (#19302) @oliviertassinari
- [internal] Fix changelog generation for infra tags (#19266) @oliviertassinari
- [internal] Remove dead repository field (#19301) @oliviertassinari
- [internal] Sentence case @oliviertassinari
- [internal] Update 8.10.1 changelog with missing changes (#19345) @cherniavskii
- [support-infra] Improve GitHub Action that check PRs labels (#19303) @oliviertassinari

### Miscellaneous

- [infra] Add `synchronize` to workflow triggers (#19342) @michelengelen
- [infra] Add charts docs folder in codowner (#19317) @alexfauquette
- [infra] Fix publish workflow complaint (#19346) @JCQuintas
- [infra] Migrate to use eslint without airbnb config (#19269) @brijeshb42
- [infra] Simplify release preparation script (#19351) @michelengelen

## 8.10.2

_Aug 20, 2025_

We'd like to extend a big thank you to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🌎 Improve Finnish (fi-FI) locale on the Data Grid

Special thanks go out to the community members for their valuable contributions:
@lauri-heinonen-2025-04, @Methuselah96, @sai6855, @wilcoschoneveld

The following are all team members who have contributed to this release:
@alexfauquette, @cherniavskii, @flaviendelangle, @Janpot, @oliviertassinari, @rita-codes

### Data Grid

#### `@mui/x-data-grid@8.10.2`

- [DataGrid] Fix display for `<GridEditSingleSelect />` when `density='compact'` (#19249) @sai6855
- [DataGrid] Fix column header sortable classname when using `disableColumnSorting` (#19222) @wilcoschoneveld
- [l10n] Improve finnish (fi-FI) locale (#19163) @lauri-heinonen-2025-04

#### `@mui/x-data-grid-pro@8.10.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.10.2`, plus:

- [DataGridPro] Fix quick filter not working in List View mode (#19254) @cherniavskii

#### `@mui/x-data-grid-premium@8.10.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.10.2`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.10.2`

Internal changes.

#### `@mui/x-date-pickers-pro@8.10.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.10.2`.

### Charts

#### `@mui/x-charts@8.10.2`

Internal changes.

#### `@mui/x-charts-pro@8.10.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.10.2`.

### Tree View

#### `@mui/x-tree-view@8.10.2`

- [tree view] Add `aria-hidden` to the Tree Item Checkbox (#19246) @flaviendelangle

#### `@mui/x-tree-view-pro@8.10.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.10.2`.

### Codemod

#### `@mui/x-codemod@8.10.2`

Internal changes.

### Docs

- [docs] Fix links to the pyramid chart (#19250) @alexfauquette

### Core

- [internal] Avoid script for CI only @oliviertassinari
- [internal] Fix `renovate.json` @oliviertassinari
- [internal] Polish renovate config @oliviertassinari
- [internal] Rename core to internal (#19203) @oliviertassinari
- [internal] Update link to GitHub labels @oliviertassinari

### Miscellaneous

- [code-infra] Prepare for incoming `execa` update (#19229) @Janpot
- [virtualizer] Fix type import (#19192) @Methuselah96
- [virtualizer] Improve type export (#19192) @Methuselah96

## 8.10.1

_Aug 15, 2025_

We'd like to extend a big thank you to the 11 contributors who made this release possible. Here are some highlights ✨:

- 📊 Y-axes can now be grouped by category when using `band` and `point` scales.
- 📚 Documentation improvements

The following are all team members who have contributed to this release:
@alexfauquette, @bernardobelchior, @Janpot, @JCQuintas, @mnajdova, @oliviertassinari, @prakhargupta1, @romgrk, @brijeshb42, @noraleonte, @rita-codes

### Data Grid

#### `@mui/x-data-grid@8.10.1`

- [DataGrid] Fix scroll jumping (#19156) @romgrk
- [DataGrid] Fix scroll restoration (#19182) @romgrk
- [DataGrid] Fix "no row with id" error (#19193) @romgrk
- [DataGrid] Fix missing rows in the print export window (#19159) @cherniavskii
- [DataGrid] Fix broken scroll (#19178) @romgrk

#### `@mui/x-data-grid-pro@8.10.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.10.1`.

#### `@mui/x-data-grid-premium@8.10.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.10.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@8.10.0`

Internal changes.

#### `@mui/x-date-pickers-pro@8.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.10.0`.

### Charts

- Axes can now be grouped by category when using `band` and `point` scales

  <img width="643" height="455" alt="Bar chart with y-axis grouped per categories" src="https://github.com/user-attachments/assets/59044afe-bcc5-4152-8bf1-225db0635025" />

#### `@mui/x-charts@8.10.1`

- [charts] Allow y-axis to be grouped (#19081) @JCQuintas
- [charts] Fix default axis highlight for axes without data attribute (#18985) @alexfauquette
- [charts] Fix tooltip mark unexpected wrapping in mobile (#19122) @bernardobelchior
- [charts] Prevent overflow on charts tooltip (#19123) @bernardobelchior
- [charts] Add demo for log-scale ticks without labels (#19152) @bernardobelchior
- [charts] Update animation customization docs (#19185) @bernardobelchior

#### `@mui/x-charts-pro@8.10.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.10.1`.

### Tree View

#### `@mui/x-tree-view@8.10.1`

- [tree view] Fix root not loading from cache on remount (#19088) @noraleonte
- [tree view] Don't overwrite childrenIds when collapsed to preserve indeterminate state of the parent (#19196) @rita-codes

#### `@mui/x-tree-view-pro@8.10.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.10.1`.

### Codemod

#### `@mui/x-codemod@8.10.1`

Internal changes.

### Docs

- [docs] Add all planned charts on the overview page (#19077) @prakhargupta1
- [docs] Add future charts components link in the sidebar (#19140) @prakhargupta1
- [docs] Fix Heatmap docs duplicate text (#19138) @JCQuintas
- [docs] Remove preview from Toolbar & Funnel (#19131) @mnajdova
- [docs] Reproduce npm sparkline (#19089) @alexfauquette

### Core

- [core] Fix licensing model name (#19025) @oliviertassinari
- [core] Fix usage of `:catalog` for `@babel/runtime` (#19028) @oliviertassinari
- [core] Refactor virtualizer API (#18995) @romgrk

### Miscellaneous

- [code-infra] Remove namespaces (#19071) @Janpot
- [code-infra] Fix `fs-extra` removal from `formattedTSDemos` script (#19132) @bernardobelchior
- [code-infra] Remove unused code and dependency (#19139) @bernardobelchior
- [code-infra] Replace `fs-extra` with `node:fs` where possible (#19127) @bernardobelchior
- [code-infra] Migrate build command to code-infra (#19006) @brijeshb42
- [internal] Edit, keep `lockFileMaintenance` simple @oliviertassinari
- [internal] Fix writing style action name @oliviertassinari
- [internal] Make it clear that `lockFileMaintenance` is enabled @oliviertassinari
- [support-infra] Remove default issue label (#19104) @oliviertassinari

## 8.10.0

_Aug 8, 2025_

We'd like to extend a big thank you to the 17 contributors who made this release possible. Here are some highlights ✨:

- 📊 [`FunnelChart`](https://mui.com/x/react-charts/funnel/) marked as stable
- 📈 [Zoom slider](https://mui.com/x/react-charts/zoom-and-pan/#zoom-slider) and [Preview](https://mui.com/x/react-charts/zoom-and-pan/#preview) marked as stable
- 📈 Supporting [label groups](https://mui.com/x/react-charts/axis/#grouped-axes) in band and point axis
- 🌎 Improve Norwegian Nynorsk (nn-NO) locale on the Data Grid
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@AnderzL7, @aqeelat, @dwrth, @noobyogi0010, @nusr, @sai6855

The following are all team members who have contributed to this release:
@arminmeh, @bernardobelchior, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @mapache-salvaje, @MBilalShafi, @oliviertassinari, @rita-codes, @romgrk

### Data Grid

#### `@mui/x-data-grid@8.10.0`

- [DataGrid] Move spread operator in `BaseSelect` to allow `variant` change (#19026) @dwrth
- [DataGrid] Use `use-sync-external-store` shim (#19063) @romgrk
- [DataGrid] Allow skipping cache in `dataSource.fetchRows()` API method (#18904) @MBilalShafi
- [DataGrid] Do not call `preProcessEditCellProps()` if cell is not editable based on `isCellEditable()` (#18405) @nusr
- [DataGrid] Fix `renderCountry` throwing an error when used in tree data (#19068) @cherniavskii
- [DataGrid] Fix performance issue for root level "select all" (#19015) @MBilalShafi
- [DataGrid] Fix pagination `slotProps` being ignored by the grid (#19095) @romgrk
- [l10n] Improve Norwegian Nynorsk (nn-NO) locale (#19076) @AnderzL7

#### `@mui/x-data-grid-pro@8.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.10.0`, plus:

- [DataGridPro] Fix row reorder not working with column reorder disabled (#19016) @MBilalShafi
- [DataGridPro] Fix header filters cache sharing issue (#19090) @MBilalShafi

#### `@mui/x-data-grid-premium@8.10.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.10.0`, plus:

- [DataGridPremium] Allow additional derived columns customization via `valueFormatter` (#18982) @arminmeh
- [DataGridPremium] Fix complex `singleSelect` columns not working in pivot model (#18971) @cherniavskii

### Date and Time Pickers

#### `@mui/x-date-pickers@8.10.0`

- [pickers] `MuiPickersLayout-toolbar` is overlapping the Calendar in RTL `MobileDatePicker` variant (#18981) @rita-codes

#### `@mui/x-date-pickers-pro@8.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.10.0`.

### Charts

#### `@mui/x-charts@8.10.0`

- [charts] Add `groups` to `band` and `point` axis config (#18766) @JCQuintas
- [charts] Animation example using `motion` library (#18993) @JCQuintas
- [charts] Deprecate `Unstable_` radar exports (#19079) @JCQuintas
- [charts] Improve grouped axis logic (#19069) @JCQuintas
- [charts] Fix type assertion in axis highlight components (#19060) @sai6855
- [charts] Remove unnecessary type assertion in tooltip `valueFormatter` in heatmap (#19047) @sai6855

#### `@mui/x-charts-pro@8.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.10.0`, plus:

- [charts-pro] Fix `slotProps.tooltip.trigger` not respected in `ScatterChartPro` and `FunnelChart` (#18902) @bernardobelchior
- [charts-pro] Fix zoom filtering adjusting axis too soon (#18992) @bernardobelchior
- [charts-pro] Mark `FunnelChart` as stable (#19048) @JCQuintas
- [charts-pro] Mark zoom slider and preview as stable (#19049) @JCQuintas
- [charts-pro] Refactor `createAxisFilterMapper` (#18998) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@8.10.0`

Internal changes.

#### `@mui/x-tree-view-pro@8.10.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@8.10.0`.

### Codemod

#### `@mui/x-codemod@8.10.0`

Internal changes.

### Docs

- [docs] Add CSS bundler breaking change to migration guide (#17436) @romgrk
- [docs] `RichTreeViewPro` demo for dragging via custom drag-handle is not working properly (#19008) @rita-codes
- [docs] Fix broken link to D3 in Charts (#19020) @oliviertassinari
- [docs] Revise the Charts Animation doc (#18990) @mapache-salvaje
- [docs] Fix incorrect code in line chart preview (#19023) @noobyogi0010
- [docs] Improve bundling instructions for the Data Grid (#19065) @romgrk
- [docs] Reduce image size in the inventory grid demo (#19004) @arminmeh

### Core

- [core] Fix ESLint reference name @oliviertassinari

### Miscellaneous

- [infra] Remove bundle size tracking for subpaths (#19072) @Janpot
- [infra] Accept `PORT` env on `docs:dev` script (#19014) @JCQuintas
- [infra] Skip codesandbox iframe demos in regressions tests (#18970) @cherniavskii
- [infra] Remove package.json `module` field (#18961) @Janpot
- [internal] Remove peer dependency on `@mui/system` (#19062) @aqeelat

## 8.9.2

_Jul 31, 2025_

We'd like to extend a big thank you to the 23 contributors who made this release possible. Here are some highlights ✨:

- 🌎 Improve French (fr-FR), Hebrew (he-IL) and Polish (pl-PL) locales on the Data Grid
- 🌎 Improve Korean (ko-KR) locale on the Date and Time Pickers
- 📈 Add symlog scale to charts
- 📊 Fix bar border radius on Firefox
- 🐞 Bugfixes
- 📚 Documentation improvements

Special thanks go out to the community members for their valuable contributions:
@AmrElnaggar99, @atlanteh, @ddolcimascolo, @Jiseoup, @leonaha5, @noherczeg, @sai6855

The following are all team members who have contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @bharatkashyap, @brijeshb42, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @KenanYusuf, @LukasTy, @mapache-salvaje, @MBilalShafi, @rita-codes, @romgrk, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@8.9.2`

- [DataGrid] Add debounce for columns panel search (#18719) @noherczeg
- [DataGrid] Extract virtualization engine (#18275) @romgrk
- [DataGrid] Improve types in `<GridEditSingleSelect />` (#18184) @sai6855
- [l10n] Improve French (fr-FR) locale (#18905) @ddolcimascolo
- [l10n] Improve Hebrew (he-IL) locale (#18665) @atlanteh
- [l10n] Improve Polish (pl-PL) locale (#18068) @leonaha5

#### `@mui/x-data-grid-pro@8.9.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.9.2`, plus:

- [DataGridPro] Fix duplicate nested rows for dynamically updated row IDs (#18526) @MBilalShafi

#### `@mui/x-data-grid-premium@8.9.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.9.2`, plus:

- [DataGridPremium] Add `privateMode` to AI assistant prompt resolver (#18759) @bharatkashyap
- [DataGridPremium] Fix empty nested group values caused by main criterial `valueFormatter()` (#18916) @cherniavskii
- [DataGridPremium] Sidebar content and state is managed the same way as for preference panel (#18741) @arminmeh
- [DataGridPremium] Make `api` param for the aggregation function optional (#18984) @arminmeh

### Date and Time Pickers

#### `@mui/x-date-pickers@8.9.2`

- [l10n] Improve Korean (ko-KR) locale (#18664) @Jiseoup
- [pickers] Fix popper click-away behavior (#18804) @LukasTy
- [pickers] Fix usage not in main document (#18944) @LukasTy

#### `@mui/x-date-pickers-pro@8.9.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@8.9.2`.

### Charts

#### `@mui/x-charts@8.9.2`

- [charts] Add symlog scale to charts (#18729) @bernardobelchior
- [charts] Fix bar border radius on Firefox (#18824) @bernardobelchior
- [charts] Fix crash when rendering large scatter dataset (#18845) @bernardobelchior
- [charts] Remove unnecessary type assertion in tooltip `valueFormatter()` (#18877) @sai6855
- [charts] Export `ChartsWrapper` from `'./ChartsWrapper'` rather than `'./internals'` (#18966) @JCQuintas

#### `@mui/x-charts-pro@8.9.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@8.9.2`, plus:

- [charts-pro] Fix voronoi interaction with zoom (#18950) @alexfauquette
- [charts-pro] Hide toolbar by default when exporting (#18764) @bernardobelchior

### Codemod

#### `@mui/x-codemod@8.9.2`

Internal changes.

### Docs

- [docs] Add Data Grid demo pages (#18180) @KenanYusuf
- [docs] Copyedit the Charts Overview page (#18840) @mapache-salvaje
- [docs] Fix incorrect parameter name in pickers "Custom components" page from `variant` to `pickerVariant` (#18919) @AmrElnaggar99

### Miscellaneous

- [code-infra] Auto-generate deep exports to prevent asymmetric exports (#18917) @JCQuintas
- [docs-infra] Turn on "Edit in Chat" for X docs (#18869) @siriwatknp
- [infra] Add specific bundle size tracking (#18884) @Janpot
- [infra] Fix markdown formatting in llms generation (#18914) @Janpot
- [infra] Use CI action from mui-public (#18709) @brijeshb42

## 8.9.1

_Jul 21, 2025_

We'd like to extend a big thank you to the 2 contributors who made this release possible. Here are some highlights ✨:

🐞 Fix package publish issue

The following are all team members who have contributed to this release:
@KenanYusuf, @MBilalShafi

### Data Grid

#### `@mui/x-data-grid@8.9.1`

- [DataGrid] Move conditional list view column logic into `gridVisibleColumnDefinitionsSelector` (#18724) @KenanYusuf
- [DataGrid] Fix row selection "exclude" model inconsistency (#18844) @MBilalShafi

#### `@mui/x-data-grid-pro@8.9.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@8.9.1`.

#### `@mui/x-data-grid-premium@8.9.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@8.9.1`.

### Core

- [core] Follow yml syntax convention @oliviertassinari

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
- [code-infra] Migrate to flat ESLint config (#18562) @brijeshb42
- [code-infra] Refactor ESLint config (#18643) @LukasTy
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
- [core] Remove ESLint from codemod spec files (#17443) @alexfauquette
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

## Older versions

Changes before 8.x are listed in our [changelog for older versions](https://github.com/mui/mui-x/blob/HEAD/changelogOld/).
