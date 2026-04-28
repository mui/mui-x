# Changelog

## 9.0.4

_Apr 28, 2026_

A big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- Fix Pickers previous (v9.0.3) release ensuring the latest `@mui/x-internals` version usage

The following team members contributed to this release:
@alexfauquette, @JCQuintas, @LukasTy, @mj12albert

### Data Grid

#### `@mui/x-data-grid@9.0.4`

Internal changes.

#### `@mui/x-data-grid-pro@9.0.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.4`.

#### `@mui/x-data-grid-premium@9.0.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.4`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.4`

Internal changes.

#### `@mui/x-date-pickers-pro@9.0.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.4`.

### Charts

#### `@mui/x-charts@9.0.4`

- [charts] Exclude hidden series and items from keyboard navigation (alt approach) (#22221) @JCQuintas
- [charts] Fix line interaction with `area` and `conectNulls` (#22227) @alexfauquette
- [charts] Implement the continuous case of `getAxisIndex` for rotation axis (#22230) @alexfauquette

#### `@mui/x-charts-pro@9.0.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.4`.

#### `@mui/x-charts-premium@9.0.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.4` plus:

- [charts-premium] Add `showMark` and `shape` properties to radial line (#22226) @alexfauquette

### Tree View

#### `@mui/x-tree-view@9.0.4`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.4`.

### Scheduler

#### `@mui/x-scheduler@9.0.4`

Internal changes.

#### `@mui/x-scheduler-premium@9.0.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-scheduler@9.0.4`.

### Codemod

#### `@mui/x-codemod@9.0.4`

Internal changes.

### Docs

- [docs] Update WCAG links (#22234) @mj12albert

### Core

- [code-infra] Avoid overriding `renovate` `ignoredPaths` (#22228) @LukasTy

## 9.0.3

_Apr 27, 2026_

A big thanks to the 16 contributors who made this release possible. Here are some highlights ✨:

- ⌨️ Keyboard support for creating events in the Scheduler

Special thanks go out to these community members for their valuable contributions:
@supunsathsara, @ZAKIURREHMAN

The following team members contributed to this release:
@aemartos, @alexfauquette, @arminmeh, @brijeshb42, @Janpot, @JCQuintas, @LukasTy, @MBilalShafi, @michelengelen, @oliviertassinari, @rita-codes, @romgrk, @sai6855, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@9.0.3`

- [DataGrid] Fix `:first-child` SSR warning when `MuiDataGrid.styleOverrides` is set (#22081) @siriwatknp
- [DataGrid] Fix row reordering when filter hides rows (#22096) @siriwatknp
- [DataGrid] Remove unused `LayoutDataGridLegacy` class (#22009) @romgrk
- [DataGrid] Remove unused code, clean up grid-related utilities and deprecate `GridPanelHeader` (#22112) @sai6855
- [DataGrid] Fix columns cutting off after resizing (#22088) @ZAKIURREHMAN

#### `@mui/x-data-grid-pro@9.0.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.3`.

#### `@mui/x-data-grid-premium@9.0.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.3`, plus:

- [DataGridPremium] Fix row grouping model updates not being reflected (#22122) @MBilalShafi

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.3`

- [pickers] Fix `DateRangeCalendar` drag with `AdapterDayjs` plain-constructor values (#22165) @LukasTy
- [pickers] Fix disabled state not overriding error border color (#21169) @supunsathsara
- [pickers] Forward `data-*` and `aria-*` attributes to the root (#22147) @LukasTy
- [pickers] Support `K` and `k` hour format tokens (#22108) @michelengelen

#### `@mui/x-date-pickers-pro@9.0.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.3`, plus:

- [DateRangeCalendar] Ensure date dragging triggers regardless of trigger element (#21868) @michelengelen

### Charts

#### `@mui/x-charts@9.0.3`

- [charts] Centralize WebGL clear/render cycle (context-based) (#22127) @JCQuintas
- [charts] Fix closest series detection for line charts (#22168) @alexfauquette
- [charts] Fix radius grid lines when axis uses point scale (#22134) @alexfauquette
- [charts] Use cubic solver for berzier intersection (#22152) @alexfauquette

#### `@mui/x-charts-pro@9.0.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.3`, plus:

- [charts-pro] Fix wheel zoom clamping with custom `minStart`/`maxEnd` (#22159) @JCQuintas

#### `@mui/x-charts-premium@9.0.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.3`, plus:

- [charts] Create a `'radialLine'` series type (#22066) @alexfauquette
- [charts] Plot radial line (#22133) @alexfauquette
- [charts] Remove `HeatmapWebGLRenderer` indirection (#22169) @JCQuintas

### Tree View

#### `@mui/x-tree-view@9.0.2`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.2`.

### Scheduler

#### Breaking changes

- The `views` of `EventTimelinePremium` have been renamed to `presets`, with names that describe the header layout. The props `view`/`defaultView`/`views`/`onViewChange` are now `preset`/`defaultPreset`/`presets`/`onPresetChange`, and the type `EventTimelinePremiumView` is now `EventTimelinePremiumPreset`.

| Old      | New            |
| :------- | :------------- |
| `time`   | `dayAndHour`   |
| `days`   | `day`          |
| `weeks`  | `dayAndWeek`   |
| `months` | `monthAndYear` |
| `years`  | `year`         |

CSS variables (`--time-cell-width`, etc.) and headless store state (`state.view`, `setView`) follow the same rename. The `presets` array is now sorted internally against a canonical zoom order.

#### `@mui/x-scheduler@9.0.0-alpha.3`

- [scheduler] Allow creating events via keyboard - EventCalendar (#21967) @rita-codes
- [scheduler] Prefix element IDs with a unique Scheduler instance ID (#22109) @rita-codes

#### `@mui/x-scheduler-premium@9.0.0-alpha.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-scheduler@9.0.0-alpha.3`.

- [scheduler] Allow creating events via keyboard - `EventTimeline` (#22119) @rita-codes
- [scheduler] Rename `EventTimeline` `views` to ordered presets (#22130) @rita-codes

### Docs

- [docs] Cleanup generated llm md files for chat (#22163) @brijeshb42
- [docs] Fix `highlightScope` description (#22154) @alexfauquette
- [docs] Remove obsolete v7 deprecation warning for `dayOfWeekFormatter` (#22111) @LukasTy
- [docs] Use mui.com for broken links checker known targets (#22129) @JCQuintas
- [docs] Document picker behavior inside MUI `Dialog` and provide recommended solutions (#22144) @michelengelen
- [docs] Improve v9 license key version mismatch error guidance (#22180) @aemartos

### Core

- [code-infra] Reduce concurrency for package build to 5 (#22115) @Janpot
- [code-infra] Rename `docsx` alias to `docs` (#22155) @brijeshb42
- [docs-infra] Remove monorepo dependency (#22025) @brijeshb42
- [docs-infra] Use latest published packages (#22086) @brijeshb42
- [test] Refactor Pickers tests to async user-event (#22043) @LukasTy
- [test] Remove redundant explicit `unmount()` calls from Pickers tests (#22118) @LukasTy

### Miscellaneous

- [infra] Update `.gitignore` to exclude `.claude/worktrees` (#22145) @michelengelen
- [infra] Enable branch tracking when creating release branch (#22177) @michelengelen
- [license] Add MIT license to `x-virtualizer` package (#22164) @michelengelen
- [website] Fix outdated MUI logos (#22117) @oliviertassinari
- [internal] Try avoiding store update when virtualization is disabled (#22093) @arminmeh

## 9.0.2

<!-- generated comparing v9.0.1..master -->

_Apr 15, 2026_

A big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 📊 Added `valueGetter` to axes and series configurations, which allow for dynamically getting data out of a `dataset`.
- 🐞 Bugfixes
- 📚 Docs updates

Special thanks go out to these community members for their valuable contributions:
@Anexus5919, @nk10nikhil

The following team members contributed to this release:
@aemartos, @alexfauquette, @brijeshb42, @Janpot, @JCQuintas, @LukasTy, @MBilalShafi, @michelengelen, @rita-codes, @sai6855

### Data Grid

#### `@mui/x-data-grid@9.0.2`

- [DataGrid] Fix skeleton overlay backdrop issue (#21951) @MBilalShafi
- [DataGrid] Make `overridesResolver` of `ResizablePanelHandle` dynamic (#21724) @sai6855

#### `@mui/x-data-grid-pro@9.0.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.2`.

#### `@mui/x-data-grid-premium@9.0.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.2`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.2`

- [fields] Allow `openPickerButtonPosition` on single-input range fields (#22011) @LukasTy
- [pickers] Fix spurious `onBlur`/`onFocus` firing during field focus transitions (#22098) @LukasTy
- [pickers] Use `convertToMeridiem` utility in `transferDateSectionValue` (#22062) @michelengelen

#### `@mui/x-date-pickers-pro@9.0.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.2`.

### Charts

#### `@mui/x-charts@9.0.2`

- [charts] Add `valueGetter` to axes and series (#21963) @JCQuintas
- [charts] Create a `ChartsRadialDataProvider` (#22047) @alexfauquette
- [charts] Create a `ChartsRadialGrid` (#22085) @alexfauquette
- [charts] Deprecate `Scatter` component (#22060) @JCQuintas
- [charts] Remove duplicate `useThemeProps` call (#22045) @alexfauquette
- [charts] Simplify focus state handling in `BarElement` component (#22101) @sai6855

#### `@mui/x-charts-pro@9.0.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.2`, plus:

- [charts-pro] Add range buttons to toolbar (#21964) @JCQuintas

#### `@mui/x-charts-premium@9.0.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.2`.

### Tree View

#### `@mui/x-tree-view@9.0.2`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.2`, plus:

- [tree view] Move `lazyLoadedItems` initialization to state initializer (#22073) @michelengelen

### Scheduler

#### `@mui/x-scheduler@9.0.0-alpha.2`

- [scheduler] Add recurrence icon to recurring events in `EventTimeline` (#22019) (#22046) @nk10nikhil
- [scheduler] Reset scroll position when navigating to a new time period (#22036) @Anexus5919
- [l10n] Improve German (de-DE) locale (#21944) @rita-codes
- [l10n] Improve Portuguese - Portugal (pt-PT) locale & Improve Portuguese - Brazil (pt-BR) locale (#21943) @rita-codes

#### `@mui/x-scheduler-premium@9.0.0-alpha.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-scheduler@9.0.0-alpha.2`.

### Chat

#### `@mui/x-chat@9.0.0-alpha.1`

- Internal changes.

#### `@mui/x-chat-headless@9.0.0-alpha.1`

- Internal changes.

### Docs

- [docs] Add data grid `isAnyOf` paste recipe (#21961) @MBilalShafi
- [docs] Add `@mui/material` upgrade requirement to v9 migration guides (#22068) @LukasTy
- [docs] Fix pages width with `disableToc` (#22051) @LukasTy
- [docs] Split charts axis page (#22069) @alexfauquette
- [docs] Update `ChartsRadialDataProvider` API page imports (#22072) @JCQuintas

### Core

- [code-infra] Fix lock file (#22053) @JCQuintas
- [code-infra] Limit `release:build` lerna concurrency to 6 (#22077) @Janpot
- [docs-infra] Update monorepo dependency with relevant migration (#22041) @brijeshb42

### Miscellaneous

- [telemetry] Skip runtime resolution when telemetry is disabled (#22078) @aemartos
- [test] Remove v7 suffix from test helpers and stale comments (#22023) @LukasTy
- [scheduler] Fix README for published packages (#22042) @rita-codes

## 9.0.1

<!-- generated comparing v9.0.0..master -->

_Apr 8, 2026_

A big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- Docs updates 📚
- Chat release 🥳

Special thanks go out to community member @mixelburg for their valuable contribution.

The following team members contributed to this release:
@alexfauquette, @cherniavskii, @hasdfa, @Janpot, @LukasTy, @MBilalShafi, @rita-codes

### Data Grid

#### `@mui/x-data-grid@9.0.1`

- [DataGrid] Fix `processRowUpdate` invoked when cancelling edit for non-existent rows (#21990) @mixelburg
- [DataGrid] Remove flaky argos tests (#22034) @MBilalShafi

#### `@mui/x-data-grid-pro@9.0.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.1`.

#### `@mui/x-data-grid-premium@9.0.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.1`.

### Charts

#### `@mui/x-charts@9.0.1`

- [charts] Small code cleanup (#22031) @alexfauquette

#### `@mui/x-charts-pro@9.0.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.1`.

#### `@mui/x-charts-premium@9.0.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.1`.

### Tree View

#### `@mui/x-tree-view@9.0.1`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.1`.

### Scheduler

#### `@mui/x-scheduler@9.0.0-alpha.1`

Internal changes.

#### `@mui/x-scheduler-premium@9.0.0-alpha.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-scheduler@9.0.0-alpha.1`.

### Chat

#### `@mui/x-chat@9.0.0-alpha.0`

- [chat] Add x-chat package family (#21666) @hasdfa

#### `@mui/x-chat-headless@9.0.0-alpha.0`

- [chat] Add x-chat package family (#21666) @hasdfa

### Docs

- [docs] Add charts a11y page in the menu (#22028) @alexfauquette
- [docs] Signal BC severity in v8 to v9 pickers migration guide (#22026) @LukasTy
- [docs] Use the same heading level data grid packages (#22024) @cherniavskii

### Core

- [code-infra] Fix changelog generator for Premium-without-Pro products (#22029) @LukasTy
- [code-infra] Remove `@mui/x-charts-vendor` check in ci (#22030) @alexfauquette
- [code-infra] Remove push to remote fallback in release script (#22021) @Janpot

### Miscellaneous

- [code] Fix few typos in JSDocs and error messages (#22032) @alexfauquette
- [core] Post stable release changes (#22033) @LukasTy
- [core-infra] Update monorepo hash and remove temporary patch (#22038) @rita-codes

## 9.0.0

<!-- generated comparing v9.0.0-rc.0..master -->

_Apr 8, 2026_

🥳 We're excited to announce the stable release of MUI X v9!
This major release includes many new features and improvements. Here are some highlights ✨:

- Data Grid – [Charts integration](https://mui.com/x/react-data-grid/charts-integration/) [Premium]
- Data Grid – [AI Assistant](https://mui.com/x/react-data-grid/ai-assistant/) [Premium]
- Data Grid – [Undo and redo](https://mui.com/x/react-data-grid/undo-redo/) [Premium]
- Data Grid – [Drag fill](https://mui.com/x/react-data-grid/clipboard/#drag-to-fill) [Premium]
- Data Grid – [longText column type](https://mui.com/x/react-data-grid/column-definition/#column-types)
- Charts – [Interaction and accessibility](https://mui.com/x/react-charts/accessibility/)
- Charts – [Candlestick](https://mui.com/x/react-charts/candlestick/) [Premium]
- Charts – [Range bar charts](https://mui.com/x/react-charts/range-bar/) [Premium]
- Charts – [WebGL Heatmap renderer](https://mui.com/x/react-charts/heatmap/#webgl-renderer) [Premium]
- Tree View – [Virtualization](https://mui.com/x/react-tree-view/rich-tree-view/virtualization/) [Pro]
- New [Scheduler](https://mui.com/x/react-scheduler/) packages [Alpha]

A big thanks to the 5 contributors who made this release possible.
The following team members contributed to this release:
@DanailH, @LukasTy, @MBilalShafi, @oliviertassinari, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@9.0.0`

Internal changes.

#### `@mui/x-data-grid-pro@9.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0`, plus:

- [DataGridPro] Preserve parent selection for non-selectable children (#21132) @MBilalShafi

#### `@mui/x-data-grid-premium@9.0.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0`, plus:

- [DataGridPremium] Drag fill (#21717) @MBilalShafi

### Date and Time Pickers

#### Breaking changes

- Removed the legacy Pickers and Field TextField props (for example: `InputProps`) in favor of the nested `slotProps`. [Read more](https://mui.com/x/migration/migration-pickers-v8/#drop-deprecated-pickerstextfield-props)
- The `utils` field in `PickersAdapterContextValue` has been removed in favor of the `adapter` field.
  This should no longer affect you, as the context export has also been removed.
- `MuiPickersAdapterContext` export has been removed.
  Prefer using the `usePickerAdapter` hook. [Read more](https://mui.com/x/migration/migration-pickers-v8/#localizationprovider-breaking-changes).

#### `@mui/x-date-pickers@9.0.0`

- [pickers] Refactor `PickersTextField` to use `slotProps` approach (#22002) @LukasTy
- [pickers] Remove deprecated LocalizationProvider legacy API (#22010) @LukasTy

#### `@mui/x-date-pickers-pro@9.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0`.

### Charts

#### `@mui/x-charts@9.0.0`

Internal changes.

#### `@mui/x-charts-pro@9.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0`.

#### `@mui/x-charts-premium@9.0.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0`.

### Tree View

#### `@mui/x-tree-view@9.0.0`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0`.

### Scheduler

#### `@mui/x-scheduler@9.0.0-alpha.0`

Internal changes.

#### `@mui/x-scheduler-premium@9.0.0-alpha.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-scheduler@9.0.0-alpha.0`.

### Codemod

#### `@mui/x-codemod@9.0.0`

Internal changes.

### Docs

- [docs] Add explanation for v8 -> v9 license migration (#22004) @DanailH

### Core

- [code-infra] Optimize dependency definition (#22006) @LukasTy
- [internal] Prepare v9 stable (#22018) @siriwatknp
- [internal] Remove 'conf' from codebase (#21989) @oliviertassinari

## 9.0.0-rc.0

<!-- generated comparing v9.0.0-beta.0..master -->

_Apr 7, 2026_

A big thanks to the 18 contributors who made this release possible.

Special thanks go out to these community members for their valuable contributions:
@mixelburg, @sibananda485, @youjin-hong

The following team members contributed to this release:
@aemartos, @alexfauquette, @arminmeh, @brijeshb42, @flaviendelangle, @JCQuintas, @LukasTy, @mapache-salvaje, @MBilalShafi, @michelengelen, @noraleonte, @rita-codes, @romgrk, @siriwatknp, @ZeeshanTamboli

### Data Grid

#### `@mui/x-data-grid@9.0.0-rc.0`

- [DataGrid] Rename filter panel `Columns` label to singular `Column` (#21935) @youjin-hong
- [DataGrid] Export `GridColumnUnsortedIconProps` for custom column icon slots (#21658) @mixelburg
- [DataGrid] Remove `x-virtualizer`'s `virtualScroller` from public API (#21936) @romgrk
- [DataGrid][virtualizer] Scrolling without render gaps (#21616) @romgrk

#### `@mui/x-data-grid-pro@9.0.0-rc.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0-rc.0`, plus:

- [DataGridPro] Improve trigger for nested row reordering (#21642) @MBilalShafi
- [DataGridPro] Undeprecate `onRowsScrollEnd` prop (#21912) @MBilalShafi

#### `@mui/x-data-grid-premium@9.0.0-rc.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0-rc.0`, plus:

- [DataGridPremium] Fix clipboard paste issue in portal (#21931) @sibananda485

### Date and Time Pickers

#### Breaking changes

- Accessible DOM structure is now the only default. [Read more](https://mui.com/x/migration/migration-pickers-v8/#accessible-dom-structure-is-now-the-default)
- The `PickerDay2` and `DateRangePickerDay2` components were propagated to stable while removing the previous defaults. [Read more](https://mui.com/x/migration/migration-pickers-v8/#day-slot)

#### `@mui/x-date-pickers@9.0.0-rc.0`

- [pickers] Remove `PickersDay` and `DateRangePickerDay` and promote their `2` versions as replacements (#21739) @michelengelen

#### `@mui/x-date-pickers-pro@9.0.0-rc.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0-rc.0`.

### Charts

#### `@mui/x-charts@9.0.0-rc.0.0`

- [charts] Make line visibility toggle start from the baseline (#21893) @alexfauquette
- [charts] Remove the container overflow (#21955) @alexfauquette
- [charts] Revert `theme.alpha` for non-channel token (#21965) @siriwatknp

#### `@mui/x-charts-pro@9.0.0-rc.0.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0-rc.0.0`, plus:

- [charts-pro] Zoom slider touch improvements (#21832) @JCQuintas
- [charts-pro] Add `seriesIds` filter to zoom slider preview (#21933) @JCQuintas
- [charts-pro] Fix zoom slider preview with discard filter mode (#21883) @JCQuintas

#### `@mui/x-charts-premium@9.0.0-rc.0.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0-rc.0.0`, plus:

- [charts-premium] Add series `valueFormatter` to candlestick chart (#21905) @JCQuintas
- [charts-premium] Add zoom slider preview support for candlestick charts (#21914) @JCQuintas
- [charts-premium] Allow color customization in `Candlestick` chart (#21838) @JCQuintas
- [charts-premium] Support hide/show for OHLC (candlestick) series (#21807) @Copilot
- [charts-premium] Add `dataset` support to `Candlestick` chart (#21872) @JCQuintas
- [charts-premium] Add candlestick page to sidebar navigation (#21834) @JCQuintas

### Tree View

#### `@mui/x-tree-view@9.0.0-rc.0`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.0-rc.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0-rc.0`, plus:

- [RichTreeViewPro] Allow to auto-expand lazy loaded items (#21759) @flaviendelangle

### Scheduler

#### `@mui/x-scheduler@9.0.0-alpha.0`

- [scheduler] Add locale files, adapt l10n scripts, and add localization table to docs (#21870) @rita-codes
- [scheduler] Add planned features to the docs (#21705) @rita-codes
- [scheduler] Add scheduler to docs introduction (#21845) @rita-codes
- [scheduler] Add wide docs to scheduler (#21860) @noraleonte
- [scheduler] All day event bugfixes (#21884) @noraleonte
- [scheduler] Autofocus title field (#21947) @noraleonte
- [scheduler] Change default event creation trigger to single click (#21979) @rita-codes
- [scheduler] Change order of the views on the view selector (#21904) @rita-codes
- [scheduler] Disabled border color for the repeat day picker in dark mode (#21987) @rita-codes
- [scheduler] Drop unused dependency (#21956) @flaviendelangle
- [scheduler] Fix all-day event shifting to previous day in negative UTC offsets (#21994) @rita-codes
- [scheduler] Fix dark theme localization demos (#21992) @noraleonte
- [scheduler] Fix licensing confusion in docs (#21939) @rita-codes
- [scheduler] Fix preferences menu width shift when toggling options + Improve preferences menu accessibility (#21902) @rita-codes
- [scheduler] Prepare for the alpha launch (#21859) @rita-codes
- [scheduler] Sync Base UI internals and apply good practices (#21946) @flaviendelangle
- [scheduler] Update close modal aria label translation (#21940) @rita-codes
- [scheduler] Add Spanish (es-ES) locale (#21900) @rita-codes
- [scheduler] Improve French (fr-FR) locale (#21941) @rita-codes
- [scheduler] Improve Romanian (ro-RO) locale (#21942) @rita-codes

#### `@mui/x-scheduler-premium@9.0.0-alpha.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-scheduler@9.0.0-alpha.0`.

### Codemod

#### `@mui/x-codemod@9.0.0-rc.0`

Internal changes.

### Docs

- [docs] Fix JSDOM → jsdom casing (#21907) @JCQuintas
- [docs] Remove Joy UI references and dependency (#21937) @siriwatknp
- [docs] Remove none generated files (#21886) @alexfauquette
- [docs] Remove unused interactive demo code (#21945) @LukasTy
- [docs] Revise the Funnel doc (#21677) @mapache-salvaje
- [docs] Revise the Line chart docs (#21554) @mapache-salvaje
- [docs] Revise the Radar doc (#21674) @mapache-salvaje
- [docs] Revise the Sankey doc (#21678) @mapache-salvaje
- [docs] Revise the Scatter chart docs (#21564) @mapache-salvaje

### Core

- [docs-infra] Update to the latest monorepo (#21971) @brijeshb42
- [internal] Remove checks for `materialVersion >= 6` (#21975) @LukasTy

### Miscellaneous

- [core] Bump @mui/material to v9.0.0-beta.1 (#21858) @siriwatknp
- [core] Update browserslistrc (#21974) @siriwatknp
- [deps] Bump minimum core packages to 7.3.0 to adopt theme color manipulator (#21892) @siriwatknp
- [telemetry] Prefer upstream remote over origin for `projectId` (#21882) @aemartos
- [telemetry] Send `repoHash`, `[x]packageNameHash`, and `rootPathHash` alongside `projectId` (#21896) @aemartos
- [test] Exclude flaky `DataGrid` argos test (#21977) @MBilalShafi
- [test] Fix flaky `DataGrid` test (#22000) @arminmeh
- [test] Remove `componentsProp` test from `describeConformance` (#21897) @ZeeshanTamboli
- [x-license] Change `orderId` type from `number` to `string` (#21885) @aemartos

## 9.0.0-beta.0

<!-- generated comparing v9.0.0-alpha.4..master -->

_Mar 27, 2026_

A big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🔊 New Charts voiceover component for improved screen reader support
- ⌨️ Charts keyboard navigation improvements: axis tooltip now shows when navigating with the keyboard
- 📊 Charts axes now can be set to automatically resize to fit their content
- 📝 New `rowCheckbox` slot in Data Grid for easier checkbox column customization
- ⚡️ `fetchRows()` API in Data Grid Pro now defaults `start` and `end` based on scroll position with lazy loading
- 🐞 Bugfixes and internal improvements

The following team members contributed to this release:
@aemartos, @alexfauquette, @arminmeh, @cherniavskii, @Janpot, @JCQuintas, @mapache-salvaje, @michelengelen, @noraleonte, @rita-codes

### Data Grid

#### `@mui/x-data-grid@9.0.0-beta.0`

- [DataGrid] Add `rowCheckbox` slot for easier customization (#21797) @michelengelen
- [DataGrid] Prevent repeated `hasScrollbar` state updates (#21820) @arminmeh

#### `@mui/x-data-grid-pro@9.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0-beta.0`, plus:

- [DataGridPro] `fetchRows()` API's default `start` and `end` params based on scroll position with lazy loading (#21742) @arminmeh

#### `@mui/x-data-grid-premium@9.0.0-beta.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0-beta.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.0-beta.0`

Internal changes.

#### `@mui/x-date-pickers-pro@9.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0-beta.0`.

### Charts

#### `@mui/x-charts@9.0.0-beta.0`

- [charts] Add `className` prop to Pro chart plot components (#21793) @JCQuintas
- [charts] Add experimental position-based pointer interaction for line series (#21809) @JCQuintas
- [charts] Add l10n to the bar accessibility (#21815) @alexfauquette
- [charts] Add localization for the basic charts (#21822) @alexfauquette
- [charts] Add voiceover component (#21344) @alexfauquette
- [charts] Allow axes to automatically resize to content (#21087) @JCQuintas
- [charts] Document multiple use-cases for references (#21768) @alexfauquette
- [charts] Remove compatibility layer for React vs native events (#21780) @JCQuintas
- [charts] Remove deprecated `barLabel` props (#21783) @alexfauquette
- [charts] Show axis tooltip when navigating with keyboard (#21689) @Copilot

#### `@mui/x-charts-pro@9.0.0-beta.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0-beta.0`.

#### `@mui/x-charts-premium@9.0.0-beta.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0-beta.0`.

### Tree View

#### `@mui/x-tree-view@9.0.0-alpha.4`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0-alpha.4`.

### Codemod

#### `@mui/x-codemod@9.0.0-alpha.4`

Internal changes.

### Docs

- [docs] Document how to customize voiceover announcement (#21833) @alexfauquette
- [docs] Remove Discord mention from docs (#21855) @mapache-salvaje
- [docs] Remove stabilized experimental feature from demo (#21869) @JCQuintas
- [docs] Update telemetry guide to reflect pseudonymous data collection and license compliance (#21812) @aemartos
- [docs] Revise the Sparkline doc (#21614) @mapache-salvaje
- [docs] Revise the Gauge doc (#21673) @mapache-salvaje
- [docs] Revise the Heatmap doc (#21676) @mapache-salvaje

### Core

- [code-infra] Remove unused deps and unify es-toolkit via catalog (#21840) @Janpot
- [code-infra] Update @mui/internal-bundle-size-checker to canary.68 (#21836) @Janpot
- [code-infra] Update next (#21837) @Janpot
- [internal] Remove headless data grid packages (#21843) @cherniavskii

### Miscellaneous

- Add @romgrk to CODEOWNERS for `x-virtualizer` and `x-internals` (#21819) @Copilot
- [x-license] add 2022 plan version (#21814) @aemartos

## 9.0.0-alpha.4

_Mar 19, 2026_

A big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes and internal improvements

The following team members contributed to this release:
@aemartos, @alexfauquette, @bernardobelchior, @Janpot, @JCQuintas, @LukasTy, @mapache-salvaje, @michelengelen, @noraleonte, @rita-codes, @sai6855, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@9.0.0-alpha.4`

- [DataGrid] Mark charts integration as stable (#21764) @JCQuintas
- [DataGrid] Move `elementOverrides` to constants and remove duplicates (#21618) @sai6855
- [DataGrid] Migrate from deprecated Material UI APIs (#21682) @siriwatknp

#### `@mui/x-data-grid-pro@9.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0-alpha.4`.

#### `@mui/x-data-grid-premium@9.0.0-alpha.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0-alpha.4`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.0-alpha.4`

- [pickers] Avoid stealing focus on click away (#13434) @LukasTy
- [pickers] Promote `fieldRef` to stable and add `clearValue` method (#21655) @michelengelen

#### `@mui/x-date-pickers-pro@9.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0-alpha.4`.

### Charts

#### `@mui/x-charts@9.0.0-alpha.4`

- [charts] Add v9 chart series types and helper functions migration (#21009) @bernardobelchior
- [charts] Extract event listener to the layer container (#21751) @alexfauquette
- [charts] Fix WebGL print export canvas stretching (#21738) @JCQuintas
- [charts] Improve deprecation warnings (#21760) @alexfauquette
- [charts] Improve type safety in `identifierCleaner` (#21719) @bernardobelchior
- [charts] Make `preferStrictDomainInLineCharts` the default (#21744) @JCQuintas
- [charts] Move title and description to the layer container (#21757) @alexfauquette
- [charts] Refactor `FunnelChart` classes structure (#21652) @JCQuintas
- [charts] Refactor `Heatmap` classes structure (#21653) @JCQuintas
- [charts] Refactor `RadarChart` classes structure (#21650) @JCQuintas
- [charts] Refactor `SankeyChart` classes structure (#21654) @JCQuintas
- [charts] Refactor legend getters to use utility functions (#21628) @sai6855
- [charts] Remove deprecated `ChartContainer` and `ChartDataProvider` (#21777) @alexfauquette
- [charts] Remove deprecated `itemId` from `SeriesLegendItemContext` (#21788) @alexfauquette
- [charts] Remove deprecated `useMouseTracker()` (#21787) @alexfauquette
- [charts] Remove deprecated classes (#21775) @alexfauquette
- [charts] Remove deprecated props from PieArcLabel animation (#21789) @alexfauquette
- [charts] Remove get\*UtilityClass from public exports (#21769) @JCQuintas
- [charts] Remove the deprecated `disableHover` property (#21785) @alexfauquette
- [charts] Remove the deprecated `message` prop (#21784) @alexfauquette
- [charts] Remove deprecated props about voronoi (#21796) @alexfauquette
- [charts] Remove deprecated pieArcClasses (#21795) @alexfauquette
- [charts] Rename `data-series-id` by `data-series` (#21761) @alexfauquette
- [charts] Rename `voronoiMaxRadius`/`disableVoronoi` to `hitAreaRadius`/`disableHitArea` (#21750) @bernardobelchior
- [charts] Update pt-PT locale (#21296) @bernardobelchior
- [charts] Use different shape per series by default (#21713) @alexfauquette
- [charts] Add className prop to Radar components (#21794) @JCQuintas
- [charts] Add className prop to shared chart components (#21792) @JCQuintas
- [charts] Add className prop to BarPlot (#21791) @JCQuintas
- [charts] Portal tooltip into ChartsLayerContainer (#21801) @JCQuintas

#### `@mui/x-charts-pro@9.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0-alpha.4`, plus:

- [charts-pro] Allow `brush` interaction to accept `requiredKeys/pointerMode` (#21716) @JCQuintas
- [charts-pro] Remove deprecated `onAxisClick` for Heatmap (#21786) @alexfauquette

#### `@mui/x-charts-premium@9.0.0-alpha.4` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0-alpha.4`, plus:

- [charts-premium] Add candlestick chart (#21129) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@9.0.0-alpha.4`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.0-alpha.4` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0-alpha.4`.

### Codemod

#### `@mui/x-codemod@9.0.0-alpha.4`

Internal changes.

### Docs

- [docs-infra] Exclude `ServerSideLazyLoadingRevalidation` from argos (#21734) @sai6855
- [docs] Update charts v9 migration guide to include premium package (#21743) @bernardobelchior
- [docs] Update v9 migration guides to install next tag (#21741) @bernardobelchior
- [docs] Revise the Pie chart docs (#21565) @mapache-salvaje
- [docs] Revise the Bar Chart docs (#21482) @mapache-salvaje
- [docs] Removed a `console.log` from an aggregation demo (#21698) @michelengelen

### Core

- [code-infra] Add pkg-pr-new as dev dependency (#21754) @Janpot
- [code-infra] Prevent `combiner` to have default parameters (#21707) @JCQuintas
- [code-infra] Remove CI coverage collection and upload to Codecov (#21671) @Janpot
- [internal] Remove @bernardobelchior from Charts CODEOWNERS (#21776) @Copilot

### Miscellaneous

- [x-license] Fix process.env.MUI_VERSION not being replaced during build (#21727) @aemartos
- [x-license] Add new watermark license status message (#21720) @aemartos

## 9.0.0-alpha.3

_Mar 12, 2026_

A big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes and internal improvements

The following team members contributed to this release:
@aemartos, @alexfauquette, @bernardobelchior, @brijeshb42, @cherniavskii, @flaviendelangle, @Janpot, @JCQuintas, @MBilalShafi, @michelengelen, @rita-codes, @sai6855, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@9.0.0-alpha.3`

- [DataGrid] Fix crash when `rows` and `rowModesModel` are updated simultaneously (#21265) @michelengelen
- [DataGrid] Add missing `resizablePanelHandle` classes to `gridClasses` object (#21538) @sai6855
- [DataGrid] Refactor `headerAlign` style calls (#21541) @sai6855

#### `@mui/x-data-grid-pro@9.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0-alpha.3`, plus:

- [DataGridPro] Add `role="presentation"` to detail panel toggle header content (#21634) @michelengelen
- [DataGridPro] Fix sorting not reflected in nested server-side data (#21619) @MBilalShafi

#### `@mui/x-data-grid-premium@9.0.0-alpha.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0-alpha.3`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.0-alpha.3`

- [pickers] Refactor `DateRangePickerDay` overrides to use a centralized `elementOverrides` object (#21426) @sai6855
- [pickers] Migrate from deprecated props for `PickersModalDialog` (#21702) @siriwatknp

#### `@mui/x-date-pickers-pro@9.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0-alpha.3`.

### Charts

#### `@mui/x-charts@9.0.0-alpha.3`

- [charts] Differentiate Line Plot roots classes (#21679) @JCQuintas
- [charts] Enable keyboard navigation by default (#21675) @alexfauquette
- [charts] Fix keyboard tooltip radar (#21667) @alexfauquette
- [charts] Fix selector default parameter (#21638) @JCQuintas
- [charts] Fix tooltip blink between node and pointer anchor (#21611) @alexfauquette
- [charts] Let tooltip and legend reflect the line shape (#21475) @alexfauquette
- [charts] Refactor `BarChart` classes structure (#21601) @JCQuintas
- [charts] Refactor `LineChart` classes structure (#21648) @JCQuintas
- [charts] Refactor `ScatterChart` classes structure (#21651) @JCQuintas
- [charts] Refactor `PieChart` classes structure (#21649) @JCQuintas
- [charts] Remove batch rendering checks in highlight selectors (#21646) @bernardobelchior
- [charts] Standardize generic arg names to `SeriesType` (#21694) @alexfauquette
- [charts] Simplify highlight hooks return types (#21695) @alexfauquette

#### `@mui/x-charts-pro@9.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0-alpha.3`, plus:

- [charts-pro] Fix heatmap style override from `arc` to `cell` (#21693) @Copilot
- [charts-pro] Fix image export truncated when page is zoomed out (#21685) @bernardobelchior
- [charts-pro] Speed-up heatmap cell search with an index lookup (#21130) @alexfauquette
- [charts-pro] Fix heatmap highlight not working (#21710) @Copilot

#### `@mui/x-charts-premium@9.0.0-alpha.3` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0-alpha.3`, plus:

- [charts-premium] Re-enable WebGL tests (#21708) @bernardobelchior

### Tree View

#### Breaking changes

- Remove `TreeViewBaseItem` type (use `TreeViewDefaultItemModelProperties` or a custom interface)
- Remove `useTreeViewApiRef` hook (use `useRichTreeViewApiRef`, `useSimpleTreeViewApiRef`, or `useRichTreeViewProApiRef`)
- Remove `status` from content slot props returned by `getContentProps()` (use `data-*` attributes; `status` on `useTreeItem` return value is unchanged)
- Remove deprecated CSS state classes from `treeItemClasses`: `expanded`, `selected`, `focused`, `disabled`, `editable`, `editing` (use `[data-expanded]`, `[data-selected]`, etc.)
- The `<RichTreeViewPro />` component has now virtualization enabled by default.
- The items used inside the `<RichTreeViewPro />` now have a default height of `32px`.
- The items of the `<RichTreeViewPro />` are now rendered as a flat list instead of a nested tree.

#### `@mui/x-tree-view@9.0.0-alpha.3`

- [tree view] Remove deprecated APIs (#21591) @flaviendelangle
- [tree view] Fix collapsed children not selected with `selectionPropagation.descendants` in `SimpleTreeView` (#21253) @flaviendelangle

#### `@mui/x-tree-view-pro@9.0.0-alpha.3` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0-alpha.3`, plus:

- [RichTreeViewPro] Make the virtualization opt-out and port the layout doc from the data grid (#21461) @flaviendelangle

### Codemod

#### `@mui/x-codemod@9.0.0-alpha.3`

Internal changes.

### Docs

- [docs] Fix `AssistantWithDataSource` demo crashing (#21555) @sai6855
- [docs] Remove `Preview` pill from Sankey (#21623) @bernardobelchior
- [docs] Migrate internal Material UI deprecated APIs (#21680) @siriwatknp
- [docs] Remove `New` flag on Tree View and Date and Time Pickers features released before v9 alpha (#21585) @flaviendelangle

### Core

- [code-infra] Remove checkout step (#21688) @Janpot
- [code-infra] Fix contributor generation in changelog (#21718) @brijeshb42
- [docs-infra] Do not point to non-existent v8 subdomain (#21640) @cherniavskii

### Miscellaneous

- [test] Add missing tests for forwarding props to filter operators in DataGrid (#21441) @siriwatknp
- [x-license] Export additional license types and constants (#21625) @aemartos
- [x-license] Refactor license verification to accept package info object and add v9 version gating (#21690) @aemartos

## 9.0.0-alpha.2

_Mar 5, 2026_

A big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- ✅ Stabilize Sankey chart
- 🐞 Bugfixes and internal improvements

The following team members contributed to this release:
@aemartos, @alelthomas, @alexfauquette, @arminmeh, @bernardobelchior, @brijeshb42, @Janpot, @JCQuintas, @mapache-salvaje, @michelengelen, @mj12albert, @sai6855, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@9.0.0-alpha.2`

- [dataGrid] Fix keyboard nav with single-row checkbox selection (#21149) @mj12albert
- [DataGrid] Add `checkboxColDef` prop to customize the selection column (#21331) @michelengelen
- [DataGrid] Format pagination numbers by default (#21117) @siriwatknp
- [DataGrid] Prevent unnecessary row selection checkbox rerendering (#21570) @arminmeh
- [DataGrid] Make GridScrollArea overrides resolver dynamic (#21532) @sai6855

#### `@mui/x-data-grid-pro@9.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0-alpha.2`, plus:

- [DataGridPro] Use `getRowId` prop to calculate the tree data row update (#21540) @arminmeh

#### `@mui/x-data-grid-premium@9.0.0-alpha.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0-alpha.2`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.0-alpha.2`

- [pickers] Add `keepOpenDuringFieldFocus` prop (#20782) @michelengelen

#### `@mui/x-date-pickers-pro@9.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0-alpha.2`.

### Charts

#### `@mui/x-charts@9.0.0-alpha.2`

- [charts] Add `ChartsLayerContainer` component (#21264) @bernardobelchior
- [charts] Add codemod for `ChartsContainer` rename (#21504) @JCQuintas
- [charts] Add codemod for `ChartsDataProvider` rename (#21552) @JCQuintas
- [charts] Add codemod for `ChartsZoomSlider` rename (#21597) @JCQuintas
- [charts] Base the highlight items on the item identifiers (#21161) @alexfauquette
- [charts] Deprecate `ChartDataProvider` in favour of `ChartsDataProvider` (#21191) @JCQuintas
- [charts] Deprecate `highlighted` and `faded` classes (#21476) @alexfauquette
- [charts] Migrate to latest v8 warning (#21518) @JCQuintas
- [charts] Rename `ChartZoomSlider` to `ChartsZoomSlider` (#21553) @JCQuintas
- [charts] Rename `WebGl` to `WebGL` (#21524) @JCQuintas
- [charts] Rename `useSvgRef()` by `useChartsLayerContainerRef()` (#21494) @alexfauquette
- [charts] Restore focus on last focused item (#21522) @alexfauquette
- [charts] Warn users when controlled tooltip state does not match the trigger (#21520) @Copilot
- [charts] Fix controlled tooltip position (#21603) @bernardobelchior

#### `@mui/x-charts-pro@9.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0-alpha.2`, plus:

- [charts-pro] Center the watermark (#21550) @alexfauquette
- [charts-pro] Stabilize `SankeyChart` API (#21133) @Copilot

#### `@mui/x-charts-premium@9.0.0-alpha.2` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0-alpha.2`.

### Tree View

#### `@mui/x-tree-view@9.0.0-alpha.2`

Internal changes.

#### `@mui/x-tree-view-pro@9.0.0-alpha.2` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0-alpha.2`.

### Codemod

#### `@mui/x-codemod@9.0.0-alpha.2`

Internal changes.

### Docs

- [docs] Add backticks and parentheses to all functions and hooks (DX-173) (#21496) @mapache-salvaje
- [docs] Remove mentions of `mySvgRef` (#21559) @bernardobelchior
- [docs] Update Roadmap section in the docs (#20892) @alelthomas
- [docs] Add tutorial and example app for aggregation with row grouping (DX-162) (#21102) @mapache-salvaje
- [docs] Fix missing codemod docs (#21604) @JCQuintas

### Core

- [code-infra] Add eslint rule to prevent `Math.random` in docs (#21505) @JCQuintas
- [code-infra] Avoid static props for pageContent (#21038) @Janpot
- [code-infra] Isolate `date-pickers-pro` in the browser tests (#21383) @Janpot
- [code-infra] Remove `--coverage` (#21410) @Janpot
- [code-infra] Remove unneeded `skipIf`s (#21569) @JCQuintas
- [code-infra] Remove vale as a workspace dependency (#21489) @brijeshb42
- [code-infra] Remove x-charts-vendor from nextjs processing (#21534) @brijeshb42
- [code-infra] Set BASE_BRANCH env var in CircleCI config (#21548) @brijeshb42
- [code-infra] Setup error code extraction (#21469) @brijeshb42
- [code-infra] Setup flat build for packages (#21029) @brijeshb42
- [code-infra] Upgrade test_unit to large resource class (#21558) @Janpot
- [code-infra] Removed getTeamMembers function and usage from release script (#21605) @michelengelen

### Miscellaneous

- [x-license] Add Q1-2026 plan version with quantity and appType support (#21574) @aemartos
- [x-license] Add v3 key format support, centralize test keys, and trim public API (#21485) @aemartos
- [x-telemetry] telemetry opt-out by default, remove conf dependency (#21470) @aemartos
- [x-telemetry] test: mock context module directly in sender tests (#21546) @aemartos

## 9.0.0-alpha.1

_Feb 26, 2026_

A big thanks to the 18 contributors who made this release possible. Here are some highlights ✨:

- ⚡️ Improved dynamic data support and cache invalidation in lazy loading for Data Grid Pro
- ⌨️ Keyboard support for selecting day, month, and year in Date Pickers
- 📊 Axis tooltip sorting and control improvements in Charts
- 🐞 Bugfixes and internal improvements

Special thanks go out to these community members for their valuable contributions:
@EllGree, @lion1963

The following team members contributed to this release:
@alexfauquette, @arminmeh, @brijeshb42, @cherniavskii, @dav-is, @flaviendelangle, @Janpot, @JCQuintas, @mapache-salvaje, @MBilalShafi, @michelengelen, @noraleonte, @rita-codes, @sai6855, @siriwatknp, @ZeeshanTamboli

### Data Grid

#### `@mui/x-data-grid@9.0.0-alpha.1`

- [DataGrid] Forward rest props in `GridFilterInputMultipleValue` (#21407) @siriwatknp
- [DataGrid] Preserve key input during row edit when using `rowModesModel` (#20759) @michelengelen
- [DataGrid] Remove double rtl inversion logic for columns pinning (#21371) @siriwatknp

#### `@mui/x-data-grid-pro@9.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0-alpha.1`, plus:

- [DataGridPro] Fix number input visibility in header filters (#21328) @michelengelen
- [DataGridPro] Improve dynamic data support and cache invalidation in lazy loading (#21282) @MBilalShafi

#### `@mui/x-data-grid-premium@9.0.0-alpha.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0-alpha.1`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.0-alpha.1`

- [DatePicker] Add keyboard support for selecting day, month, and year (#20859) @michelengelen

#### `@mui/x-date-pickers-pro@9.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0-alpha.1`, plus:

- [DateRangePicker] Fix timezone update issue leading to `invalidRange` error (#20863) @michelengelen

### Charts

#### `@mui/x-charts@9.0.0-alpha.1`

- [charts] Add `sort` props to the axis tooltip (#21293) @alexfauquette
- [charts] Controll axis tooltip (#21351) @alexfauquette
- [charts] De duplicate keyboard focus handler function (#21267) @sai6855
- [charts] Make `type` optional in identifiers (#21311) @alexfauquette
- [charts] Move ref to the root component (#21396) @alexfauquette
- [charts] Refactor loading and no data overlays to use a shared OverlayText component (#21414) @sai6855
- [charts] Require series ids to be unique (#21330) @alexfauquette
- [charts] Set `showMark` as `false` by default (#21373) @alexfauquette
- [charts] Use `createGetNextIndexFocusedItem()` util in Funnel and RangeBar charts (#21390) @sai6855
- [charts] Remove unnecessary string concatenation (#21418) @sai6855

#### `@mui/x-charts-pro@9.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0-alpha.1`.

#### `@mui/x-charts-premium@9.0.0-alpha.1` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0-alpha.1`.

### Tree View

#### `@mui/x-tree-view@9.0.0-alpha.1`

- [tree view] Focus item sibling on unmount instead of the 1st item (#21254) @flaviendelangle

#### `@mui/x-tree-view-pro@9.0.0-alpha.1` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0-alpha.1`.

### Codemod

#### `@mui/x-codemod@9.0.0-alpha.1`

Internal changes.

### Docs

- [docs] Fix external 301s (#21377) @Janpot
- [docs] Show premium in the overview (#21343) @alexfauquette
- [docs][charts] Revise the useLegend hook doc (#21352) @mapache-salvaje
- [docs][charts] Revise the axis hooks doc (#21317) @mapache-salvaje
- [docs][charts] Revise the scale hooks doc (#21316) @mapache-salvaje
- [docs][charts] Revise the series hooks doc (#21353) @mapache-salvaje
- [docs][charts] Revise the useDataset doc (#21336) @mapache-salvaje
- [docs][charts] Revise the useDrawingArea doc (#21333) @mapache-salvaje

### Core

- [core] Update docs deploy script to the `docs-next` branch (#21341) @siriwatknp
- [code-infra] Cleanup unused babel plugins (#21453) @brijeshb42
- [code-infra] Do not append `x` to the last version for the compare API (#21408) @arminmeh
- [code-infra] Upgrade react-docgen to v8 X (#21155) @JCQuintas
- [code-infra] Modernize codemod (#21096) @JCQuintas
- [docs-infra] Fix current version detection logic (#21417) @cherniavskii
- [docs-infra] Reapply Cookie Banner (#21281) @dav-is
- [internal] Headless filtering plugin (#21302) @arminmeh
- [internal] Headless pagination plugin (#21183) @arminmeh
- [internal] Headless virtualization followups (#21327) @cherniavskii
- [internal] Keep cached data for disabled pipe processors (#21348) @arminmeh
- [internal] Remove autoprefixer package (#21440) @ZeeshanTamboli

### Miscellaneous

- [l10n] Fix Czech (csCZ) locale: sort/filter labels are swapped (#21400) @EllGree
- [l10n] Improve Ukrainian (uk-UA) locale (#21366) @lion1963

## 9.0.0-alpha.0

_Feb 16, 2026_

A big thanks to the 21 contributors who made this release possible. Here are some highlights ✨:

- Add support for virtualized items on `<RichTreeViewPro />`:

  ```tsx
  <RichTreeViewPro items={ITEMS} virtualization itemHeight={48} />
  ```

- Add Thai (`thTH`) locale on the Data Grid and the Date and Time Pickers (#21116) @siriwatknp
- Add a new `AdapterDayjsBuddhist` adapter for Date and Time Pickers (#20984) @siriwatknp
- Add support for virtualization in the rich tree view (#20780) @flaviendelangle
- Add WebGL renderer to Heatmap (#20756) @bernardobelchior

Special thanks go out to these community members for their valuable contributions:
@jhe-iqbis

The following team members contributed to this release:
@alexfauquette, @arminmeh, @bernardobelchior, @brijeshb42, @cherniavskii, @dav-is, @flaviendelangle, @Janpot, @JCQuintas, @mapache-salvaje, @MBilalShafi, @michelengelen, @mj12albert, @noraleonte, @oliviertassinari, @rita-codes, @romgrk, @sai6855, @siriwatknp

### Data Grid

#### `@mui/x-data-grid@9.0.0-alpha.0`

- [DataGrid] Update default `logicOperator` behavior in filtering docs (#21098) @michelengelen
- [DataGrid] Add `thTH` locale (#21116) @siriwatknp
- [DataGrid] Fix initial filter value state in CustomMultiValueOperator demo (#21217) @sai6855

#### `@mui/x-data-grid-pro@9.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-data-grid@9.0.0-alpha.0`, plus:

- [DataGridPro] Cleanup outdated rows on `dataSource` reference update (#21138) @MBilalShafi

#### `@mui/x-data-grid-premium@9.0.0-alpha.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-data-grid-pro@9.0.0-alpha.0`.

### Date and Time Pickers

#### `@mui/x-date-pickers@9.0.0-alpha.0`

- [pickers] Add `AdapterDayjsBuddhist` adapter (#20984) @siriwatknp
- [pickers] Add `thTH` locale (#21116) @siriwatknp

#### `@mui/x-date-pickers-pro@9.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-date-pickers@9.0.0-alpha.0`.

### Charts

#### `@mui/x-charts@9.0.0-alpha.0`

- [charts] Add Legend actions (#20404) @JCQuintas
- [charts] Add `Chart` suffix to MUI Classes (#21042) @JCQuintas
- [charts] Add `axesGap` props to put space between axes (#20904) @alexfauquette
- [charts] Add `cleanIdentifier` function to charts series instance (#20832) @JCQuintas
- [charts] Add `initialHiddenItems` prop to set initial state (#20894) @JCQuintas
- [charts] Add `useXAxisCoordinates` and `useYAxisCoordinates` hooks (#20972) @bernardobelchior
- [charts] Add axis slots and expose axis ticks hooks (#20935) @bernardobelchior
- [charts] Change `line` legend marker to be a line (#21059) @JCQuintas
- [charts] Codemod test pattern with function (#21111) @JCQuintas
- [charts] Control the item tooltip (#20617) @alexfauquette
- [charts] Enable keyboard navigation in radar chart (#20765) @alexfauquette
- [charts] Export `CartesianChartSeriesType` and `StackableChartSeriesType` (#21012) @bernardobelchior
- [charts] Export plugins from premium (#20866) @JCQuintas
- [charts] Filter hidden series from axis tooltip (#21273) @Copilot
- [charts] Filter hidden series from axis tooltip (#21273) @Copilot
- [charts] Fix rename `getSVGPoint` to `getChartPoint` (#21335) @bernardobelchior
- [charts] Fix cleanup function in useChartInteractionListener to correctly remove event listeners with options (#21218) @sai6855
- [charts] Fix import rename in codemod (#21112) @JCQuintas
- [charts] Fix multiple exports of `HighlightScope` (#21270) @bernardobelchior
- [charts] Fix test inconsistency in charts (#20907) @JCQuintas
- [charts] Fix tooltip position for stacked line series (#20901) @alexfauquette
- [charts] Make Highlight scope a generic (#21189) @alexfauquette
- [charts] Make `LegendItemParams.type` required (#21003) @alexfauquette
- [charts] Make `seriesId` a string only (#20997) @alexfauquette
- [charts] Make the `useChartRootRef` support typing parameter (#21023) @alexfauquette
- [charts] Memoize HeatmapItem to avoid re-render when fading/highlighting (#20865) @bernardobelchior
- [charts] Move axis id to `data-axis-id` attribute instead of class (#21037) @JCQuintas
- [charts] Move `cleanIdentifier` and `serializeIdentifier` instance methods to `useChartSeriesConfig` plugin (#21025) @JCQuintas
- [charts] Move `seriesConfig` to `useChartSeriesConfig` plugin (#21004) @JCQuintas
- [charts] Move element refs to `useChartElementRef` plugin (#21099) @JCQuintas
- [charts] Move types related to `seriesConfig` into the `useChartSeriesConfig` plugin folder (#21026) @JCQuintas
- [charts] Remove `data-has-focused-item` from `ChartsSurface` (#21255) @bernardobelchior
- [charts] Remove default generic of item identifiers (#21182) @alexfauquette
- [charts] Remove deprecated `id` from `LegendItemParams` (#21055) @alexfauquette
- [charts] Remove deprecated `ChartApi` export from `ChartContainer` (#20975) @JCQuintas
- [charts] Remove deprecated `useAxisTooltip` in favor of `useAxesTooltip` (#20962) @Copilot
- [charts] Remove deprecated series type helpers and functions (#20998) @alexfauquette
- [charts] Rename `ChartContainer` to `ChartsContainer` (#21173) @JCQuintas
- [charts] Rename `getSVGPoint` to `getChartPoint` (#21322) @bernardobelchior
- [charts] Rename `TickItemType` to `TickItem` (#21008) @bernardobelchior
- [charts] Replace props `id` by `seriesId` when necessary (#21057) @alexfauquette
- [charts] Revert `touch-action: pan-y` removal when zoom is disabled (#20852) @bernardobelchior
- [charts] The `useXxxSeries([])` return empty array (#21001) @alexfauquette
- [charts] Use `NumberValue` in domain limit function (#21054) @JCQuintas

#### `@mui/x-charts-pro@9.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-charts@9.0.0-alpha.0`, plus:

- [charts-pro] Add border radius to heatmap (#20931) @bernardobelchior
- [charts-pro] Add keyboard navigation to funnel (#20766) @alexfauquette
- [charts-pro] Add keyboard navigation to heatmap (#20786) @alexfauquette
- [charts-pro] Add keyboard navigation to sankey (#20777) @alexfauquette
- [charts-pro] Fix Heatmap's `onItemClick` not triggering (#21016) @bernardobelchior
- [charts-pro] Fix crash when two same-direction axes have a zoom preview (#20916) @bernardobelchior
- [charts-pro] Handle edge case in export image (#21190) @bernardobelchior
- [charts-pro] Prefer global pointer interaction tracker in Heatmap (#20697) @bernardobelchior
- [charts-pro] Support composition for Sankey (#20604) @alexfauquette
- [charts-pro] Update Heatmap identifier (#21124) @alexfauquette
- [charts-pro] Update default value of `hideLegend` prop in `Heatmap` (#20961) @Copilot

#### `@mui/x-charts-premium@9.0.0-alpha.0` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in `@mui/x-charts-pro@9.0.0-alpha.0`, plus:

- [charts-premium] Add WebGL renderer to Heatmap (#20756) @bernardobelchior
- [charts-premium] Add `ChartContainerPremium` (#20910) @bernardobelchior
- [charts-premium] Add `HeatmapPremium` (#20930) @bernardobelchior
- [charts-premium] Add keyboard navigation to range-bar (#21272) @alexfauquette
- [charts-premium] Extract `HeatmapSVGPlot` from `HeatmapPlot` component (#21015) @bernardobelchior
- [charts-premium] Fix `ChartDataProviderPremium` tests (#20868) @bernardobelchior
- [charts-premium] Fix links in comments for chart containers and data providers (#21105) @bernardobelchior

### Tree View

#### `@mui/x-tree-view@9.0.0-alpha.0`

_No changes._

#### `@mui/x-tree-view-pro@9.0.0-alpha.0` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in `@mui/x-tree-view@9.0.0-alpha.0`, plus:

- [RichTreeViewPro] Add support for virtualization (#20780) @flaviendelangle

### Codemod

#### `@mui/x-codemod@9.0.0-alpha.0`

- [codemod] Document and Clean the codemod utils (#21014) @alexfauquette

### Docs

- [docs] Add focus highlight in composition snipets (#20614) @alexfauquette
- [docs] Add simple candlestick chart demo (#20912) @bernardobelchior
- [docs] Fix Waterfall Chart documentation badge from Pro to Premium (#20888) @Copilot
- [docs] Fix broken links on Data Grid Editing sub-pages (#20911) @arminmeh
- [docs] Fix docs API for HeatmapPremium (#21137) @alexfauquette
- [docs] Fix horizontal overflow in heatmap docs (#20968) @bernardobelchior
- [docs] Move Range Bar Chart to existing charts (#21120) @bernardobelchior
- [docs] Prepare the scheduler doc for the alpha (#21268) @flaviendelangle
- [docs] Rewording of the heatmap item click (#20987) @alexfauquette
- [scheduler][docs] Create the Quickstart page (#20913) @flaviendelangle
- [charts][docs] Revise the Charts CSP doc (#20906) @mapache-salvaje
- [charts][docs] Revise the Charts Composition doc (#20032) @mapache-salvaje
- [charts][docs] Revise the Charts Hooks Overview doc (#20921) @mapache-salvaje
- [charts][docs] Revise the Charts Legend doc (#20821) @mapache-salvaje
- [charts][docs] Revise the Charts Localization doc (#20800) @mapache-salvaje
- [charts][docs] Revise the Charts Plugins doc (#20933) @mapache-salvaje
- [charts][docs] Revise the Charts Stacking doc (#20830) @mapache-salvaje
- [charts][docs] Revise the Charts Styling doc (#20835) @mapache-salvaje
- [charts][docs] Revise the Charts Toolbar doc (#20867) @mapache-salvaje
- [charts][docs] Revise the Charts Tooltip doc (#20869) @mapache-salvaje
- [charts][docs] Revise the Charts Zoom and Pan doc (#20893) @mapache-salvaje
- [DataGrid][docs] Add a recipe for handling long text cell (#20754) @siriwatknp
- [DataGrid][docs] Add high-level competitor comparison to Overview doc (DX-117) (#20870) @mapache-salvaje
- [DataGrid][docs] Remove Bundling section from quickstart (#21177) @MBilalShafi

### Core

- [code-infra] Add `MUI_TEST_ENV` global (#21187) @Janpot
- [code-infra] Fix `material-ui/disallow-react-api-in-server-components` (#20909) @JCQuintas
- [code-infra] Fix `renameImports` codemod not preserving comments (#20977) @JCQuintas
- [code-infra] Fix the label comparison to use lower case (#20934) @brijeshb42
- [code-infra] Github action to sync title and label (#20922) @brijeshb42
- [code-infra] Ignore scheduler demo with random data (#20982) @JCQuintas
- [code-infra] Improve `codemod` testing setup (#20981) @JCQuintas
- [code-infra] Only ignore renovate[bot] in changelog generation script (#21185) @bernardobelchior
- [code-infra] Prepare for v9 (#20860) @JCQuintas
- [code-infra] Set `rasterizehtml` version in pnpm catalog (#21175) @bernardobelchior
- [code-infra] Update codeowners (#20886) @JCQuintas
- [code-infra] V9 preparation (#20928) @JCQuintas
- [code-infra] eslint rule rename (#21172) @Janpot
- [code-infra][docs] V9 charts migration doc kickoff (#20973) @JCQuintas
- [docs-infra] Add Cookie Banner and Analytics Provider (#21228) @dav-is
- [docs-infra] Fix missing slots section on API page (#20915) @Janpot
- [docs-infra] Fix two broken links (#20914) @Janpot
- [docs-infra] Port demo changes (#20971) @Janpot
- [internal] Add information about codemods to AGENTS.md (#21011) @bernardobelchior
- [internal] Fix codemod versioning instructions in `AGENTS.md` (#21024) @bernardobelchior
- [internal] Fix missing generated props in master (#21142) @bernardobelchior
- [internal] Headless sorting plugin (#21089) @arminmeh
- [internal] Remove duplicate code (#20896) @oliviertassinari

### Miscellaneous

- Bump next to ^15.5.11 (#21171) @Copilot
- [core] Fix CI (#21223) @flaviendelangle
- [PoC] Headless data grid (#20645) @cherniavskii
