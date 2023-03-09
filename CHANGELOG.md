# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## 6.0.1

_Mar 9, 2023_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve French (fr-FR) locale (#8122) @MaherSamiGMC
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v6.0.1` / `@mui/x-data-grid-pro@v6.0.1` / `@mui/x-data-grid-premium@v6.0.1`

#### Changes

- [DataGrid] Fix `MenuProps.onClose` being overridden for single select edit component (#8174) @rohitnatesh
- [DataGrid] Simplify `buildPrintWindow` (#8142) @oliviertassinari
- [l10n] Improve French (fr-FR) locale (#8122) @MaherSamiGMC

### `@mui/x-date-pickers@v6.0.1` / `@mui/x-date-pickers-pro@v6.0.1`

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

We're happy to announce the first v6 stable release! 🎉🚀

This is now the officially supported major version, where we'll keep rolling out new features, bug fixes, and improvements.
Head over to the [what's new](https://mui.com/x/whats-new/) page to check the highlighted new features.

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

### `@mui/x-data-grid@v6.0.0` / `@mui/x-data-grid-pro@v6.0.0` / `@mui/x-data-grid-premium@v6.0.0`

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

### `@mui/x-date-pickers@v6.0.0` / `@mui/x-date-pickers-pro@v6.0.0`

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

### `@mui/x-data-grid@v6.0.0-beta.5` / `@mui/x-data-grid-pro@v6.0.0-beta.5` / `@mui/x-data-grid-premium@v6.0.0-beta.5`

#### Changes

- [DataGrid] Allow to customize label and value for `singleSelect` (#7684) @m4theushw
- [DataGrid] Fix `ownerState` being `undefined` in theme style overrides (#7964) @lolaignatova
- [DataGrid] Introduce `slots` and deprecate `components` (#7882) @MBilalShafi
- [DataGridPro] Add `Remove All` option in filter panel (#7326) @MBilalShafi
- [DataGridPremium] Add web worker support for Excel export (#7770) @m4theushw

### `@mui/x-date-pickers@v6.0.0-beta.5` / `@mui/x-date-pickers-pro@v6.0.0-beta.5`

#### Breaking changes

- The `MuiDateSectionName` type was renamed to `FieldSectionType`

#### Changes

- [fields] Fix multi input range fields validation when uncontrolled (#8002) @LukasTy
- [fields] Fix single input time range fields slot props (#7988) @LukasTy
- [fields] Make the `ArrowUp` / `ArrowDown` edition only impact the active section (#7993) @flaviendelangle
- [fields] Fix single input range fields clearing (#7995) @flaviendelangle
- [fields] Clean the section object (#8009) @flaviendelangle
- [pickers] Fix `textField` slot `error` prop propagation (#7987) @LukasTy

### `@mui/x-codemod@v6.0.0-beta.5`

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

### `@mui/x-data-grid@v6.0.0-beta.4` / `@mui/x-data-grid-pro@v6.0.0-beta.4` / `@mui/x-data-grid-premium@v6.0.0-beta.4`

#### Changes

- [DataGrid] Add interface for `singleSelect` column (#7685) @m4theushw
- [DataGrid] Allow to pass props to the `TrapFocus` inside the panel wrapper (#7733) @Vivek-Prajapatii
- [DataGrid] Avoid unnecessary rerenders after `updateRows` (#7857) @cherniavskii
- [DataGridPro] Change cursor when dragging a column (#7725) @sai6855
- [DataGridPremium] Fix `leafField` to have correct focus value (#7950) @MBilalShafi

### `@mui/x-date-pickers@v6.0.0-beta.4` / `@mui/x-date-pickers-pro@v6.0.0-beta.4`

#### Changes

- [DateRangePicker] Fix slide transition by avoiding useless component re-rendering (#7874) @LukasTy
- [fields] Support Backspace key on `Android` (#7842) @flaviendelangle
- [fields] Support escaped characters on `Luxon` (#7888) @flaviendelangle
- [pickers] Prepare new pickers for custom fields (#7806) @flaviendelangle

### `@mui/x-codemod@v6.0.0-beta.4`

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

### `@mui/x-data-grid@v6.0.0-beta.3` / `@mui/x-data-grid-pro@v6.0.0-beta.3` / `@mui/x-data-grid-premium@v6.0.0-beta.3`

#### Changes

- [DataGrid] Add `BaseIconButton` component slot (#7329) @123joshuawu
- [DataGrid] Allow to customize the value displayed in the filter button tooltip (#6956) @ithrforu
- [DataGrid] Improve grid resize performance (#7864) @cherniavskii
- [DataGrid] Make `apiRef.current.getRowWithUpdatedValues` stable (#7788) @m4theushw
- [DataGrid] Support RTL (#6580) @yaredtsy
- [DataGrid] Improve query selectors for selecting cell element (#7354) @yaredtsy
- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#7854) @ed-ateixeira

### `@mui/x-date-pickers@v6.0.0-beta.3` / `@mui/x-date-pickers-pro@v6.0.0-beta.3`

#### Changes

- [fields] Allow to select year 2000 on 2-digit year section (#7858) @flaviendelangle
- [fields] Fix year editing on `day.js` (#7862) @flaviendelangle
- [fields] Fix year editing on valid date (#7834) @flaviendelangle
- [fields] Reset query when pressing `Backspace` or `Delete` (#7855) @flaviendelangle
- [pickers] Clean Popper position on new pickers (#7445) @flaviendelangle
- [pickers] Ditch pickers `skipLibCheck` (#7808) @LukasTy
- [pickers] Improve JSDoc and resulting API docs pages (#7847) @LukasTy

### `@mui/x-codemod@v6.0.0-beta.3`

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

### `@mui/x-data-grid@v6.0.0-beta.2` / `@mui/x-data-grid-pro@v6.0.0-beta.2` / `@mui/x-data-grid-premium@v6.0.0-beta.2`

#### Changes

- [DataGrid] Handle non-numeric values returned by `getRowHeight` prop (#7703) @cherniavskii
- [DataGrid] Merge row styles with `componentsProps.row.style` (#7641) @marktoman
- [l10n] Add Hungarian (hu-HU) locale (#7776) @noherczeg
- [l10n] Add Urdu (ur-PK) locale (#6866) @MBilalShafi
- [l10n] Improve French (fr-FR) locale (#7777) @Vivek-Prajapatii
- [l10n] Improve Italian (it-IT) locale (#7761) @simonecervini

### `@mui/x-date-pickers@v6.0.0-beta.2` / `@mui/x-date-pickers-pro@v6.0.0-beta.2`

#### Changes

- [fields] Support week day formats (#7392) @flaviendelangle
- [pickers] Allow to initialize and control the `rangePosition` on all range components (#7764) @flaviendelangle
- [pickers] Fix theme augmentation (#7800) @LukasTy
- [pickers] Hide scrollbars in the date calendar container (#7766) @Vivek-Prajapatii
- [pickers] Remove the dependency on `rifm` (#7785) @alexfauquette

### `@mui/x-codemod@v6.0.0-beta.2`

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

### `@mui/x-data-grid@v6.0.0-beta.1` / `@mui/x-data-grid-pro@v6.0.0-beta.1` / `@mui/x-data-grid-premium@v6.0.0-beta.1`

#### Changes

- [DataGrid] Add `title` attribute to cells (#7682) @thupi
- [DataGrid] Fix `autoHeight` not working properly inside of a flex container (#7701) @cherniavskii
- [DataGrid] Fix grid state not being updated after print preview is closed (#7642) @cherniavskii
- [DataGrid] Fix non-hideable columns visibility toggling (#7637) @cherniavskii
- [DataGrid] Fix scrolling on resize for data grids inside shadow root (#7298) @akiradev
- [l10n] Add Slovak (sk-SK) translation for aggregation functions (#7702) @msidlo
- [l10n] Add missing core locales for `MuiTablePagination` (#7717) @MBilalShafi
- [l10n] Improve Spanish (es-ES) and Vietnamese (vi-VN) locale (#7634) @WiXSL and @SpacerZ
- [l10n] Add Belarusian (be-BY) locale (#7646) @volhalink

### `@mui/x-date-pickers@v6.0.0-beta.1` / `@mui/x-date-pickers-pro@v6.0.0-beta.1`

#### Changes

- [pickers] Fix `aria-labelledby` assignment to dialog (#7608) @LukasTy
- [pickers] Support `UTC` with `dayjs` (#7610) @flaviendelangle
- [pickers] Update focus when opening a UI view (#7620) @alexfauquette
- [DateRangePickers] Add shortcuts component (#7154) @alexfauquette
- [l10n] Add Czech (cs-CZ) locale (#7645) @OndrejHj04
- [l10n] Add Russian (ru-RU) locale (#7706) @rstmzh
- [l10n] Improve Japanese (ja-JP) locale (#7624) @makoto14

### `@mui/x-codemod@v6.0.0-beta.1`

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

- [docs] Add info callout about available component `slots` (#7714) @Vivek-Prajapatii
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

### `@mui/x-data-grid@v6.0.0-beta.0` / `@mui/x-data-grid-pro@v6.0.0-beta.0` / `@mui/x-data-grid-premium@v6.0.0-beta.0`

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
  To catch errors that happen during rendering use the [error boundary](https://reactjs.org/docs/error-boundaries.html).

- The `components.ErrorOverlay` slot was removed.

- The `GridErrorOverlay` component was removed.

- The `componentError` event was removed.
  Use the [error boundary](https://reactjs.org/docs/error-boundaries.html) to catch errors thrown during rendering.

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

### `@mui/x-date-pickers@v6.0.0-beta.0` / `@mui/x-date-pickers-pro@v6.0.0-beta.0`

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

### `@mui/x-codemod@v6.0.0-beta.0`

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

### `@mui/x-data-grid@v6.0.0-alpha.15` / `@mui/x-data-grid-pro@6.0.0-alpha.15` / `@mui/x-data-grid-premium@6.0.0-alpha.15`

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
- [pickers] Add Belarusian (be-BY) locale (#7395) @volhalink
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

### `@mui/x-data-grid@v6.0.0-alpha.14` / `@mui/x-data-grid-pro@v6.0.0-alpha.14` / `@mui/x-data-grid-premium@v6.0.0-alpha.14`

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

### `@mui/x-date-pickers@v6.0.0-alpha.14` / `@mui/x-date-pickers-pro@v6.0.0-alpha.14`

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

### `@mui/x-codemod@v6.0.0-alpha.14`

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
- [DataGrid] Update Russian (ru-RU) locale (#7220) @VeceluXa
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

  See [the documentation](https://mui.com/x/react-data-grid/selection/#cell-selection) for more information

- 🌍 Support the Right To Left orientation on the fields components
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v6.0.0-alpha.12` / `@mui/x-data-grid-pro@v6.0.0-alpha.12` / `@mui/x-data-grid-premium@v6.0.0-alpha.12`

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

### `@mui/x-date-pickers@v6.0.0-alpha.12` / `@mui/x-date-pickers-pro@v6.0.0-alpha.12`

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

### `@mui/x-data-grid@v6.0.0-alpha.11` / `@mui/x-data-grid-pro@v6.0.0-alpha.11` / `@mui/x-data-grid-premium@v6.0.0-alpha.11`

#### Breaking changes

- The `filterPanelOperators` translation key was renamed to `filterPanelOperator` (#7062) @MBilalShafi
- The `components.Header` slot was removed. Use `components.Toolbar` slot instead (#6999) @cherniavskii

#### Changes

- [DataGrid] Fix rows not rendering properly after height change (#6892) @MBilalShafi
- [DataGrid] Remove `Header` slot (#6999) @cherniavskii
- [DataGrid] Rename `filterPanelOperators` -> `filterPanelOperator` (#7062) @MBilalShafi
- [DataGridPremium] Add support for lazy-loading (#7124) @m4theushw
- [DataGridPremium] Pass `groupId` to aggregation function (#7003) @m4theushw

### `@mui/x-date-pickers@v6.0.0-alpha.11` / `@mui/x-date-pickers-pro@v6.0.0-alpha.11`

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

### `@mui/x-data-grid@v6.0.0-alpha.10` / `@mui/x-data-grid-pro@v6.0.0-alpha.10` / `@mui/x-data-grid-premium@v6.0.0-alpha.10`

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

### `@mui/x-date-pickers@v6.0.0-alpha.10` / `@mui/x-date-pickers-pro@v6.0.0-alpha.10`

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

### `@mui/x-data-grid@v6.0.0-alpha.9` / `@mui/x-data-grid-pro@v6.0.0-alpha.9` / `@mui/x-data-grid-premium@v6.0.0-alpha.9`

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

### `@mui/x-date-pickers@v6.0.0-alpha.9` / `@mui/x-date-pickers-pro@v6.0.0-alpha.9`

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

### `@mui/x-data-grid@v6.0.0-alpha.8` / `@mui/x-data-grid-pro@v6.0.0-alpha.8` / `@mui/x-data-grid-premium@v6.0.0-alpha.8`

#### Changes

- [DataGrid] Fix `ErrorOverlay` not receiving defined input props (#6819) @banoth-ravinder
- [DataGrid] Fix conflict with the latest version of `@types/react` (#6797) @vizv
- [DataGrid] Make more `apiRef` methods private (#6700) @cherniavskii
- [DataGrid] Provide a clear error message when upgrading (#6685) @oliviertassinari
- [DataGridPremium] Allow to customize the indent of group expansion toggle (#6837) @MBilalShafi
- [DataGridPremium] Support aggregating data from multiple row fields (#6656) @cherniavskii
- [DataGridPro] Fix detail panel not working with `getRowSpacing` prop (#6707) @cherniavskii
- [DataGridPro] Opt-out for column jump back on re-order (#6733) @gavbrennan
- [l10n] Improve Finnish (fi-FI) locale (#6859) @RainoPikkarainen

### `@mui/x-date-pickers@v6.0.0-alpha.8` / `@mui/x-date-pickers-pro@v6.0.0-alpha.8`

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

### `@mui/x-data-grid@v6.0.0-alpha.7` / `@mui/x-data-grid-pro@v6.0.0-alpha.7` / `@mui/x-data-grid-premium@v6.0.0-alpha.7`

#### Changes

- [DataGrid] Fix cell focus causing scroll jump when virtualization enabled (#6785) @yaredtsy
- [DataGrid] Remove items marked as `@deprecated` (#6505) @DanailH

### `@mui/x-date-pickers@v6.0.0-alpha.7` / `@mui/x-date-pickers-pro@v6.0.0-alpha.7`

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

### `@mui/x-data-grid@v6.0.0-alpha.6` / `@mui/x-data-grid-pro@v6.0.0-alpha.6` / `@mui/x-data-grid-premium@v6.0.0-alpha.6`

#### Breaking changes

- The `disableIgnoreModificationsIfProcessingProps` prop has been removed and its behavior when `true` was incorporated as the default behavior.
  The old behavior can be restored by using `apiRef.current.stopRowEditMode({ ignoreModifications: true })` or `apiRef.current.stopCellEditMode({ ignoreModifications: true })`.

#### Changes

- [DataGrid] Add `rowSelection` prop (#6499) @m4theushw
- [DataGrid] Avoid future regression with React 19 (#6638) @oliviertassinari
- [DataGrid] Refactor `@mui/material` imports to `@mui/utils` (#6569) @LukasTy
- [DataGrid] Remove `disableIgnoreModificationsIfProcessingProps` prop (#6640) @m4theushw
- [DataGrid] Separate private and public `apiRef` properties (#6388) @cherniavskii

### `@mui/x-date-pickers@v6.0.0-alpha.6` / `@mui/x-date-pickers-pro@v6.0.0-alpha.6`

#### Changes

- [DateRangePicker] Fix input focused style and mobile behaviour (#6645) @LukasTy
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

### `@mui/x-data-grid@v6.0.0-alpha.5` / `@mui/x-data-grid-pro@v6.0.0-alpha.5` / `@mui/x-data-grid-premium@v6.0.0-alpha.5`

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

### `@mui/x-date-pickers@v6.0.0-alpha.5` / `@mui/x-date-pickers-pro@v6.0.0-alpha.5`

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

### `@mui/x-data-grid@v6.0.0-alpha.4` / `@mui/x-data-grid-pro@v6.0.0-alpha.4` / `@mui/x-data-grid-premium@v6.0.0-alpha.4`

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

### `@mui/x-date-pickers@v6.0.0-alpha.4` / `@mui/x-date-pickers-pro@v6.0.0-alpha.4`

#### Breaking changes

- The `ToolbarComponent` has been replaced by a `Toolbar` component slot.
  You can find more information about this pattern in the [MUI Base documentation](https://mui.com/base/getting-started/usage/#shared-props):

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

### `@mui/x-data-grid@v6.0.0-alpha.3` / `@mui/x-data-grid-pro@v6.0.0-alpha.3` / `@mui/x-data-grid-premium@v6.0.0-alpha.3`

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

### `@mui/x-date-pickers@v6.0.0-alpha.3` / `@mui/x-date-pickers-pro@v6.0.0-alpha.3`

#### Breaking changes

- All the props used by the mobile and desktop wrappers to override components or components' props have been replaced by component slots. You can find more information about this pattern in the [MUI Base documentation](https://mui.com/base/getting-started/usage/#shared-props).

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

### `@mui/x-data-grid@v6.0.0-alpha.2` / `@mui/x-data-grid-pro@v6.0.0-alpha.2` / `@mui/x-data-grid-premium@v6.0.0-alpha.2`

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

### `@mui/x-date-pickers@v6.0.0-alpha.2` / `@mui/x-date-pickers-pro@v6.0.0-alpha.2`

#### Breaking changes

- The `renderDay` prop has been replaced by a `Day` component slot.
  You can find more information about this pattern in the [MUI Base documentation](https://mui.com/base/getting-started/usage/#shared-props).

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

### `@mui/x-data-grid@v6.0.0-alpha.1` / `@mui/x-data-grid-pro@v6.0.0-alpha.1` / `@mui/x-data-grid-premium@v6.0.0-alpha.1`

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

### `@mui/x-date-pickers@v6.0.0-alpha.1` / `@mui/x-date-pickers-pro@v6.0.0-alpha.1`

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

### `@mui/x-data-grid@v6.0.0-alpha.0` / `@mui/x-data-grid-pro@v6.0.0-alpha.0` / `@mui/x-data-grid-premium@v6.0.0-alpha.0`

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

### `@mui/x-date-pickers@v6.0.0-alpha.0` / `@mui/x-date-pickers-pro@v6.0.0-alpha.0`

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

## 5.17.25

_Feb 23, 2023_

We'd like to offer a big thanks to the 2 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.25` / `@mui/x-data-grid-pro@v5.17.25` / `@mui/x-data-grid-premium@v5.17.25`

#### Changes

- [DataGrid] Fix `ownerState` being `undefined` in theme style overrides (#7757) @lolaignatova

### `@mui/x-date-pickers@v5.0.20` / `@mui/x-date-pickers-pro@v5.0.20`

#### Changes

- [DateTimePicker] Ensure toolbar `viewType` is correctly updated (#7942) @LukasTy

## 5.17.24

_Feb 16, 2023_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Hungarian (hu-HU) locale
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.24` / `@mui/x-data-grid-pro@v5.17.24` / `@mui/x-data-grid-premium@v5.17.24`

#### Changes

- [DataGrid] Allow to pass props to the `TrapFocus` inside the panel wrapper (#7897) @Vivek-Prajapatii
- [DataGrid] Avoid unnecessary rerenders after `updateRows` (#7945) @cherniavskii
- [DataGridPro] Change cursor when dragging a column (#7878) @sai6855
- [DataGridPremium] Fix `leafField` to have correct focus value (#7959) @MBilalShafi

### `@mui/x-date-pickers@v5.0.19` / `@mui/x-date-pickers-pro@v5.0.19`

#### Changes

- [l10n] Add Hungarian (hu-HU) locale (#7796) @noherczeg

## 5.17.23

_Feb 9, 2023_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Brazilian Portuguese (pt-BR) locale
- 🎉 Add banner and callouts to inform about MUI X v6 beta
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.23` / `@mui/x-data-grid-pro@v5.17.23` / `@mui/x-data-grid-premium@v5.17.23`

#### Changes

- [DataGrid] Allow to customize the value displayed in the filter button tooltip (#7816) @ithrforu
- [DataGrid] Fix `getCellElement` method not working with pinned columns (#7844) @yaredtsy
- [DataGrid] Fix stale rows issue in `unstable_replaceRows` (#7694) @MBilalShafi
- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#7850) @ed-ateixeira

### `@mui/x-date-pickers@v_5.0.18` / `@mui/x-date-pickers-pro@v_5.0.18`

#### Changes

- [pickers] Update pickers when new value has a distinct timezone (#7853) @alexfauquette

### Docs

- [docs] Add messages in v5 doc to inform people about v6 (#7838) @flaviendelangle
- [docs] Fix 301 link @oliviertassinari

### Core

- [core] Upgrade monorepo (#7849) @cherniavskii

## 5.17.22

_Feb 2, 2023_

We'd like to offer a big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Urdu (ur-PK) locale
- 🌍 Improve French (fr-FR) and Italian (it-IT) locales
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.22` / `@mui/x-data-grid-pro@v5.17.22` / `@mui/x-data-grid-premium@v5.17.22`

#### Changes

- [DataGrid] Fix an error when deleting pinned row using the buttons in the `actions` column (#7767) @cherniavskii
- [DataGrid] Fix print preview regression in Chrome browser (#7405) @cherniavskii
- [l10n] Add Urdu (ur-PK) locale (#7778) @MBilalShafi
- [l10n] Improve French (fr-FR) locale (#7795) @Vivek-Prajapatii

### `@mui/x-date-pickers@v5.0.17` / `@mui/x-date-pickers-pro@v5.0.17`

#### Changes

- [TimePicker] Add missing `themeAugmentation` entry (#7732) @LukasTy
- [l10n] Improve Italian (it-IT) locale (#7761) @simonecervini

## 5.17.21

_Jan 27, 2023_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Belarusian (be-BY), Czech (cs-CZ), and Russian (ru-RU) locales
- 🌍 Improve Slovak (sk-SK), Japanese (ja-JP), Vietnamese (vi-VN), and Spanish (es-ES) locales
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.21` / `@mui/x-data-grid-pro@v5.17.21` / `@mui/x-data-grid-premium@v5.17.21`

#### Changes

- [DataGrid] Add `title` attribute to cells (#7695) @thupi
- [DataGrid] Fix grid state not being updated after print preview is closed (#7680) @cherniavskii
- [DataGrid] Fix non-hideable columns visibility toggling (#7716) @cherniavskii
- [DataGrid] Fix scrolling on resize for data grids inside shadow root (#7722) @cherniavskii
- [DataGridPremium] Create aggregation footer row with `isAutoGenerated: true` (#7681) @m4theushw
- [l10n] Add Belarusian (be-BY) locale (#7718) @volhalink
- [l10n] Add Slovak (sk-SK) translation for aggregation functions (#7690) @msidlo
- [l10n] Add missing core locales for `MuiTablePagination` (#7719) @MBilalShafi
- [l10n] Improve Japanese (ja-JP) locale (#7627) @makoto14
- [l10n] Improve Vietnamese (vi-VN) locale (#7601) @SpacerZ

### `@mui/x-date-pickers@v5.0.16` / `@mui/x-date-pickers-pro@v5.0.16`

#### Changes

- [pickers] Add missing components to `themeAugmentation` (#7677) @LukasTy
- [l10n] Add Czech (cs-CZ) locale (#7666) @OndrejHj04
- [l10n] Add Russian (ru-RU) locale (#7708) @rstmzh
- [l10n] Improve Spanish (es-ES) locale (#7614) @WiXSL

### Docs

- [docs] Add info callout about available component `slots` (#7723) @Vivek-Prajapatii

## 5.17.20

_Jan 19, 2023_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Italian (it-IT) and Swedish (sv-SE) locales
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.20` / `@mui/x-data-grid-pro@v5.17.20` / `@mui/x-data-grid-premium@v5.17.20`

#### Changes

- [DataGrid] Fix flickering on grid scroll (#7609) @cherniavskii
- [DataGrid] Remove tag limit from `isAnyOf` operator input (#7616) @m4theushw
- [l10n] Improve Swedish (sv-SE) locale (#7463) @MaanTyringe

### `@mui/x-date-pickers@v5.0.15` / `@mui/x-date-pickers-pro@v5.0.15`

#### Changes

- [pickers] Ensure `key` is passed without object spreading (#7584) @alexfauquette
- [l10n] Improve Italian (it-IT) locale (#7547) @marikadeveloper

## 5.17.19

_Jan 16, 2023_
We'd like to offer a big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Spanish (es-ES) and add Belarusian (be-BY) and Urdu (ur-PK) locales
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.19` / `@mui/x-data-grid-pro@v5.17.19` / `@mui/x-data-grid-premium@v5.17.19`

#### Changes

- [DataGrid] Improve print support (#7407) @cherniavskii
- [DataGrid] Improve Spanish (es-ES) locale (#7438) @Anderssxn
- [DataGridPremium] Fix Excel export not working with date strings (#7478) @cherniavskii
- [DataGridPro] Fix missing column headers border with top-pinned rows (#7399) @cherniavskii

### `@mui/x-date-pickers@v5.0.14` / `@mui/x-date-pickers-pro@v5.0.14`

#### Changes

- [pickers] Add Belarusian (be-BY) locale (#7450) @volhalink
- [pickers] Add Urdu (ur-PK) locale (#7449) @MBilalShafi

## 5.17.18

_Jan 5, 2023_

We'd like to offer a big thanks to the 3 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.18` / `@mui/x-data-grid-pro@v5.17.18` / `@mui/x-data-grid-premium@v5.17.18`

#### Changes

- [DataGrid] Fix rows not rendering properly after height change (#7376) @cherniavskii
- [DataGrid] Fix selected text in cell input not being copied in Firefox (#7330) @cherniavskii
- [DataGridPremium] Export row grouping column menu components (#7308) @cherniavskii

### `@mui/x-date-pickers@v5.0.13` / `@mui/x-date-pickers-pro@v5.0.13`

#### Changes

- [pickers] Fix the product license reference name (#7367)

### Docs

- [docs] Redirect translated pages (#7370) @cherniavskii

### Core

- [core] Fix release date (#7314) @DanailH
- [core] Fix the product license reference name (#7367) @oliviertassinari
- [core] Upgrade monorepo (#7344) @cherniavskii

## 5.17.17

_Dec 24, 2022_

We'd like to offer a big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Russian (ru-RU) and Korean (ko-KR) locales
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.17` / `@mui/x-data-grid-pro@v5.17.17` / `@mui/x-data-grid-premium@v5.17.17`

#### Changes

- [DataGrid] Update Russian (ru-RU) locale (#7291) @VeceluXa
- [DataGridPro] Use row ID as `key` of the detail panels (#7311) @m4theushw
- [DataGridPremium] Fix `exceljs` import with parcel (#7285) @alexfauquette

### `@mui/x-date-pickers@v5.0.12` / `@mui/x-date-pickers-pro@v5.0.12`

#### Changes

- [pickers] Improve Korean (ko-KR) locale (#7283) @hanbin9775

## 5.17.16

_Dec 16, 2022_

We'd like to offer a big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.16` / `@mui/x-data-grid-pro@v5.17.16` / `@mui/x-data-grid-premium@v5.17.16`

#### Changes

- [DataGrid] Display sort column menu items as per `sortingOrder` prop (#7125) @hanbin9775
- [DataGrid] Fix flickering on mount (#7155) @cherniavskii
- [DataGridPremium] Use separate cache for aggregation columns pre-processor (#7174) @m4theushw

### `@mui/x-date-pickers@v5.0.11` / `@mui/x-date-pickers-pro@v5.0.11`

#### Changes

- [DateTimePicker] Update export pattern (#7172) @kealjones-wk

### Docs

- [docs] Document aggregation selectors (#7151) @cherniavskii

## 5.17.15

_Dec 8, 2022_

We'd like to offer a big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- ✨ Fix lazy-loading not working in `DataGridPremium` (#7130) @m4theushw
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.15` / `@mui/x-data-grid-pro@v5.17.15` / `@mui/x-data-grid-premium@v5.17.15`

#### Changes

- [DataGridPremium] Add support for lazy-loading (#7130) @m4theushw
- [DataGridPremium] Pass `groupId` to the aggregation function (#7143) @m4theushw

### `@mui/x-date-pickers@v5.0.10` / `@mui/x-date-pickers-pro@v5.0.10`

#### Changes

- [pickers] Initialize date without time when selecting year or month (#7136) @LukasTy

### Docs

- [docs] Fix the nested import on the api pages (#7134) @flaviendelangle
- [docs] Keep track of the localization completion (#7099) @alexfauquette
- [docs] Update localization doc to use existing locale (#7104) @LukasTy

## 5.17.14

_Dec 1, 2022_

We'd like to offer a big thanks to the 3 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Ukrainian (uk-UA) locale (#7035) @rettoua
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.14` / `@mui/x-data-grid-pro@v5.17.14` / `@mui/x-data-grid-premium@v5.17.14`

#### Changes

- [DataGrid] Fix row selection when clicking blank cell (#7056) @yami03
- [DataGridPremium] Update cache before hydrating columns (#7043) @m4theushw
- [l10n] Improve Ukrainian (uk-UA) locale (#7035) @rettoua

## 5.17.13

_Nov 24, 2022_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Fix support of the pickers to Shadow DOM (#6971) @flaviendelangle
- 💅 Improve DataGrid theme augmentation (#6980) @iigrik
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.13` / `@mui/x-data-grid-pro@v5.17.13` / `@mui/x-data-grid-premium@v5.17.13`

#### Changes

- [DataGrid] Fix `ErrorOverlay` not receiving defined input props (#6885) @banoth-ravinder
- [DataGrid] Improve typing for `styleOverrides` (#6980) @iigrik
- [DataGridPro] Fix lazy-loaded rows not working with `updateRows` API method (#6875) @cherniavskii
- [l10n] Fix translation of `filterOperatorBefore` in Arabic (ar-SD) locale (#6917) @HassanGhazy

### `@mui/x-date-pickers@v5.0.9` / `@mui/x-date-pickers-pro@v5.0.9`

#### Changes

- [pickers] Fix usage with Shadow DOM (#6971) @flaviendelangle

### Docs

- [docs] Add new "Expired package version" error type (#6937) @oliviertassinari
- [docs] Enforce values for installation options in Date / Time pickers Getting Started page (#6896) @01zulfi
- [docs] Fix live edit @oliviertassinari
- [docs] Upgrade to Next 13 (#6911) @cherniavskii

### Core

- [core] Upgrade monorepo (#6906) @cherniavskii
- [core] Upgrade node to v14.21 (#6939) @piwysocki

## 5.17.12

_Nov 17, 2022_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Improve Finnish (fi-FI) locale (#6859) @RainoPikkarainen
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.12` / `@mui/x-data-grid-pro@v5.17.12` / `@mui/x-data-grid-premium@v5.17.12`

#### Changes

- [DataGrid] Fix conflict with the latest version of `@types/react` (#6883) @vizv
- [DataGridPremium] Support aggregating data from multiple row fields (#6844) @cherniavskii
- [DataGridPro] Fix detail panel not working with `getRowSpacing` prop (#6858) @cherniavskii
- [l10n] Improve Finnish (fi-FI) locale (#6859) @RainoPikkarainen

### Docs

- [docs] Clarify DataGrid Row Pinning docs (#6891) @cherniavskii

### Core

- [core] Upgrade monorepo (#6864) @m4theushw
- [license] Polish error messages (#6881) @oliviertassinari

## 5.17.11

_Nov 10, 2022_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.11` / `@mui/x-data-grid-pro@v5.17.11` / `@mui/x-data-grid-premium@v5.17.11`

#### Changes

- [DataGrid] Fix for cell focus preventing scroll when virtualization enabled (#6622) @yaredtsy
- [DataGridPro] Opt-out for column jump back on re-order (#6697) @gavbrennan

### `@mui/x-date-pickers@v5.0.8` / `@mui/x-date-pickers-pro@v5.0.8`

#### Changes

- [pickers] Fix pickers toolbar styling (#6793) @LukasTy

### Docs

- [docs] Fix link to localization page (#6766) @alexfauquette

### Core

- [license] Add new license status 'Out of scope' (#6774) @oliviertassinari

## 5.17.10

_Nov 4, 2022_

We'd like to offer a big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Ukrainian (uk-UA) locale to pickers (#6661) @Dufran

### `@mui/x-data-grid@v5.17.10` / `@mui/x-data-grid-pro@v5.17.10` / `@mui/x-data-grid-premium@v5.17.10`

#### Changes

- [DataGrid] Remove `React.memo` from `GridCellCheckboxRenderer` (#6688) @mattcorner

### `@mui/x-date-pickers@v5.0.7` / `@mui/x-date-pickers-pro@v5.0.7`

#### Changes

- [DateRangePicker] Fix input focused style and mobile behaviour (#6645) (#6714) @LukasTy
- [pickers] Add Ukrainian (uk-UA) locale on the date picker (#6661) @Dufran

### Docs

- [docs] Mark data grid column group available (#6659) @alexfauquette

## 5.17.9

_Oct 28, 2022_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- ⚡ Fix memory leak during unmount of the DataGrid (#6579) @cherniavskii
- 🎁 Allow to disable the autofocus of the search field when opening the column visibility panel (#6630) @e-cloud
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.9` / `@mui/x-data-grid-pro@v5.17.9` / `@mui/x-data-grid-premium@v5.17.9`

#### Changes

- [DataGrid] Allow to disable autofocusing the search field in the columns panel (#6630) @e-cloud
- [DataGrid] Fix `setRows` method not persisting new rows data after `loading` prop change (#6637) @cherniavskii
- [DataGrid] Fix memory leak on grid unmount (#6579) @cherniavskii
- [l10n] Improve Bulgarian (bg-BG) locale (#6635) @AtanasVA

### `@mui/x-date-pickers@v5.0.6` / `@mui/x-date-pickers-pro@v5.0.6`

#### Changes

- [pickers] Ignore milliseconds in mask logic (#6618) @alexfauquette
- [pickers] Update input when `inputFormat` is modified (#6617) @alexfauquette

### Docs

- [docs] Add token to redirect feedbacks on slack (#6592) @alexfauquette
- [docs] Disable translations (#6639) @cherniavskii
- [docs] Fix code edit for when v6 will be stable (#6600) @oliviertassinari
- [docs] Fix typo in DataGrid demo page (#6632) (#6634) @LukasTy

### Core

- [core] Upgrade monorepo (#6570) @cherniavskii

## 5.17.8

_Oct 20, 2022_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes
- 🌍 Improve Turkish (tr-TR) locale on the data grid and pickers (#6573) @ramazansancar

### `@mui/x-data-grid@v5.17.8` / `@mui/x-data-grid-pro@v5.17.8` / `@mui/x-data-grid-premium@v5.17.8`

#### Changes

- [DataGrid] Add `searchPredicate` prop to `GridColumnsPanel` component (#6572) @cherniavskii
- [DataGrid] Fix grid not updating state on `rowCount` prop change (#6474) @cherniavskii
- [DataGridPro] Fix row order being reset after updating the row (#6544) @cherniavskii
- [l10n] Improve Turkish (tr-TR) locale on the data grid and pickers (#6542) (#6573) @ramazansancar

### `@mui/x-date-pickers@v5.0.5` / `@mui/x-date-pickers-pro@v5.0.5`

#### Changes

- [CalendarPicker] Don't move to closest enabled date when `props.date` contains a disabled date (#6537) @flaviendelangle
- [DateRangePicker] Fix calendar day outside of month layout shifting on hover (pick #6448) (#6538) @alexfauquette
- [pickers] Fix Typescript issues (#6510) @flaviendelangle

### Docs

- [docs] Fix 301 link to the sx prop page @oliviertassinari

## 5.17.7

_Oct 13, 2022_

We'd like to offer a big thanks to the 2 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.7` / `@mui/x-data-grid-pro@v5.17.7` / `@mui/x-data-grid-premium@v5.17.7`

#### Changes

- [DataGrid] Fix error when using column grouping with all columns hidden (#6425) @alexfauquette
- [DataGrid] Fix start edit mode with printable character in React 18 (#6478) @m4theushw

## 5.17.6

_Oct 6, 2022_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Japanese (ja-JP) locale to pickers (#6365) @sho918
- 🎁 Improve support for theme augmentation in the DataGrid (#6406) @cherniavskii
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.6` / `@mui/x-data-grid-pro@v5.17.6` / `@mui/x-data-grid-premium@v5.17.6`

#### Changes

- [DataGrid] Add missing `valueOptions` (#6400) @DanailH
- [DataGrid] Don't start edit mode when pressing <kbd>Shift</kbd> + <kbd>Space</kbd> (#6380) @m4theushw
- [DataGrid] Pass generics to the components in the theme augmentation (#6406) @cherniavskii

### `@mui/x-date-pickers@v5.0.4` / `@mui/x-date-pickers-pro@v5.0.4`

#### Changes

- [l10n] Add Japanese (ja-JP) locale to pickers (#6365) (#6382) @sho918
- [pickers] Prevent `CalendarPicker` getting focus when `autoFocus=false` (#6304) (#6362) @alexfauquette
- [pickers] Fix git repository location @oliviertassinari

### Docs

- [docs] Fix customized day rendering demo style (#6342) @Ambrish-git

## 5.17.5

_Sep 29, 2022_

We'd like to offer a big thanks to the 2 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add theme augmentation module to DataGridPremium (#6316) @cherniavskii
- 👀 Fix blank space when changing page with dynamic row height (#6320) @m4theushw
- 📚 Improve controlled editing demo to make easier to reuse it (#6306) @cherniavskii
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.5` / `@mui/x-data-grid-pro@v5.17.5` / `@mui/x-data-grid-premium@v5.17.5`

#### Changes

- [DataGrid] Fix `GridPagination` props typing (#6295) @cherniavskii
- [DataGrid] Fix `GridRow` not forwarding `ref` to the root element (#6303) @cherniavskii
- [DataGrid] Fix `undefined` value being showed in filter button tooltip text (#6271) @cherniavskii
- [DataGrid] Fix blank space when changing page with dynamic row height (#6320) @m4theushw
- [DataGrid] Revert cell/row mode if `processRowUpdate` fails (#6319) @m4theushw
- [DataGridPremium] Add missing `themeAugmentation` module (#6316) @cherniavskii

### Docs

- [docs] Pass model change callbacks in controlled grid editing demos (#6306) @cherniavskii

### Core

- [core] Reduce the amount of updated screenshots reported by Argos (#6310) @cherniavskii

## 5.17.4

_Sep 22, 2022_

We'd like to offer a big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Finnish (fi-FI) locale to the pickers (#6230) @PetroSilenius
- 🌍 Add Persian (fa-IR) locale to the pickers (#6181) @fakhamatia
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.4` / `@mui/x-data-grid-pro@v5.17.4` / `@mui/x-data-grid-premium@v5.17.4`

#### Changes

- [DataGrid] Do not publish `cellFocusOut` event if the row was removed (#6251) @cherniavskii
- [DataGrid] Improve Polish (pl-PL) locale on the data grid (#6245) @grzegorz-bach

### `@mui/x-date-pickers@v5.0.3` / `@mui/x-date-pickers-pro@v5.0.3`

#### Changes

- [pickers] Add Finnish (fi-FI) locale to pickers (#6219) (#6230) @PetroSilenius
- [pickers] Add Persian (fa-IR) locale to the pickers (#6181) @fakhamatia
- [pickers] Fix usage with Typescript 4.8 (#6229) @flaviendelangle
- [YearPicker] Scroll to the current year even with `autoFocus=false` (#6224) @alexfauquette

### Docs

- [docs] Fix 301 link (#6239) @oliviertassinari

### Core

- [core] Use the official repository for `@mui/monorepo` instead of a fork (#6189) @oliviertassinari

## 5.17.3

_Sep 16, 2022_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 📝 Fix lost characters when typing into fields in the DataGrid (#5646) @m4theushw
- 🌏 New locale and improvements for pickers
- 🎁 Improve support to theme augmentation for pickers

### `@mui/x-data-grid@v5.17.3` / `@mui/x-data-grid-pro@v5.17.3` / `@mui/x-data-grid-premium@v5.17.3`

#### Changes

- [DataGrid] Only update input with value prop if debounce is off (#5646) @m4theushw

### `@mui/x-date-pickers@v5.0.2` / `@mui/x-date-pickers-pro@v5.0.2`

#### Changes

- [pickers] Add Icelandic (is-IS) locale (#6137) @elvatli
- [pickers] Fix `@mui/x-date-pickers` theme augmentation and style overriding (#6156) @LukasTy
- [pickers] Fix `@mui/x-date-pickers-pro` theme augmentation (#6096) @LukasTy
- [pickers] Improve German (de-DE) locale (#6138) @alexfauquette

### Docs

- [docs] Improve main demo to show new functionalities (#5292) @joserodolfofreitas

### Core

- [core] Update to Typescript 4.8.3 (#6136) @flaviendelangle
- [core] Update RFC template (#6100) @bytasv

## 5.17.2

_Sep 9, 2022_

This release will the last regular release for our `v5` packages.
From now on, we'll be focusing on developing MUI X v6.
You can check the [roadmap](https://github.com/mui/mui-x/projects/1) for more details on what's coming next.

And if you'd like to help, please consider volunteering to give us a [user interview](https://forms.gle/vsBv6CLPz9h57xg8A).
We'd love to know more about your use cases, pain points and expectations for the future.

The `v5` packages will only get new versions to patch critical bug fixes.

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 📃 Add support for column grouping when exporting to Excel (#5895) @alexfauquette
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.2` / `@mui/x-data-grid-pro@v5.17.2` / `@mui/x-data-grid-premium@v5.17.2`

#### Changes

- [DataGrid] Revert mode if cell/row couldn't be saved due to validation error (#5897) @m4theushw
- [DataGridPremium] Export column grouping in Excel (#5895) @alexfauquette

### `@mui/x-date-pickers@v5.0.1` / `@mui/x-date-pickers-pro@v5.0.1`

#### Changes

- [DateTimePicker] Remove circular import (#6087) @flaviendelangle
- [pickers] Add `sx` prop to the equality check of `PickersDay` (#6030) @TheUnlocked
- [pickers] Add warning when `openTo` is invalid based on available `views` (#6042) @LukasTy
- [pickers] Allow keyboard navigation to ignore disabled date for left / right arrow (#6082) @alexfauquette
- [pickers] Fix mobile picker not opening on label click (#6074) @LukasTy

### Docs

- [docs] Add Recipes section

### Core

- [core] Add `yarn release:tag` script (#5169) @DanailH
- [core] Upgrade monorepo (#6072) @m4theushw

## 5.17.1

_Sep 5, 2022_

We'd like to offer a big thanks to the 3 contributors who made this release possible. Here are some highlights ✨:

- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.1` / `@mui/x-data-grid-pro@v5.17.1` / `@mui/x-data-grid-premium@v5.17.1`

#### Changes

- [DataGrid] Fix cells being focused on mouseUp (#5980) @cherniavskii
- [DataGrid] Fix focused cell if column is spanned and new editing API is used (#5962) @m4theushw
- [DataGridPro] Fix import in lazy-loading causing a bundling error (#6031) @flaviendelangle

## 5.17.0

_Sep 2, 2022_

🎉 We are excited to finally introduce a stable release (v5.0.0) for the `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` packages!

If you are still using picker components from the `lab`, take a look at the [migration guide](https://mui.com/x/react-date-pickers/migration-lab/).

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Implement Lazy loading (#5214) @DanailH

  Pro users now can try the experimental lazy loading feature.
  In a few steps, you can load your data on demand, as the rows are displayed.

  To enable this feature, add `experimentalFeatures={{ lazyLoading: true }}`.
  Lazy Loading requires a few other settings.
  See the [documentation](https://mui.com/x/react-data-grid/row-updates/#lazy-loading) to explore the example in detail.

- 🚀 Improve `pickers` focus management (#5820) @alexfauquette
- 🎉 Enable disabling `day` on date range picker depending on `position` (#5773) @alexfauquette
- ✨ Various improvements
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.17.0` / `@mui/x-data-grid-pro@v5.17.0` / `@mui/x-data-grid-premium@v5.17.0`

#### Changes

- [DataGrid] Add `sort` prop to columns panel slot (#5888) @gavbrennan
- [DataGrid] Do not throw if `fieldToFocus` cannot be found (#5871) @cherniavskii
- [DataGrid] Support `getRowId` in the `replaceRows` method (#5988) @flaviendelangle
- [DataGridPro] Add class name to row with open detail panel (#5924) @m4theushw
- [DataGridPro] Fix crash when using `pinnedRows` + `getRowClassName` props and `rows=[]` (#5851) @cherniavskii
- [DataGridPro] Fix filtering with inactive filter items (#5993) @alexfauquette
- [DataGridPro] Implement Lazy loading (#5214) @DanailH
- [DataGridPro] Support pinned columns and dynamic row height (#5782) @m4theushw
- [DataGridPremium] Add state initializer for column groups (#5963) @alexfauquette
- [DataGridPremium] Update grouping when `groupingValueGetter` changes (#5919) @flaviendelangle
- [DataGridPremium] Use the aggregated value on tree data real groups (#5953) @flaviendelangle

### `@mui/x-date-pickers@v5.0.0` / `@mui/x-date-pickers-pro@v5.0.0`

#### Changes

- [DatePicker] Improve focus management (#5820) @alexfauquette
- [DateRangePicker] Enable disabling `day` depending on `position` (#5773) @alexfauquette
- [DateTimePicker] Create a new `tabs` component slot (#5972) @LukasTy
- [pickers] Do not forward validation props to the DOM on field components (#5971) @flaviendelangle
- [pickers] Do not hardcode `date-fns` elements in field components (#5975) @flaviendelangle
- [pickers] Do not require `date-fns` in `@mui/x-date-pickers-pro` (#5941) @flaviendelangle
- [pickers] Fix mobile picker not opening on label click (#5651) @LukasTy
- [pickers] Improve DOM event management on `useField` (#5901) @flaviendelangle
- [pickers] Include `community` package `themeAugmentation` in `pro` package types (#5969) @LukasTy
- [pickers] Rename `DateRangeField` into `SingleInputDateRangeField` (#5961) @flaviendelangle
- [pickers] Support `isSameError` on field components (#5984) @flaviendelangle

### Docs

- [docs] Add `description` and `default` to pickers slots (#5893) @alexfauquette
- [docs] Fix typo (#5945) @wettopa
- [docs] Fix typo `onYearPicker` to `onYearChange` (#5954) @alexfauquette
- [docs] Update `GridCellParams`'s `value` description (#5849) @cherniavskii
- [docs] Update `README.md` to match Introduction section of the docs (#5754) @samuelsycamore

### Core

- [core] Fix typo (#5990) @flaviendelangle
- [core] Remove old babel resolve rule (#5939) @oliviertassinari
- [core] Remove outdated TODO (#5956) @flaviendelangle
- [core] Upgrade monorepo (#5960) @cherniavskii
- [core] Fix statics (#5986) @DanailH
- [core] Remove unused dependencies (#5937) @oliviertassinari
- [license] Remove CLI (#5757) @flaviendelangle
- [test] Fix time zone sensitive test (#5955) @LukasTy
- [test] Use `userEvent.mousePress` instead of `fireClickEvent` (#5920) @cherniavskii

## 5.16.0

_Aug 25, 2022_

We'd like to offer a big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce column grouping for data grid (#5133) @alexfauquette

  You can now group columns using the `columnGroupingModel` prop. This lets you to display more structured data.

  <img src="https://user-images.githubusercontent.com/45398769/186178366-4fba66b2-bf90-4c7a-9d83-940a7fc78704.png" width="800" />

  To enable this feature, add `experimentalFeatures={{ columnGrouping: true }}`.
  The grouping header can be fully customized.
  See the [documentation](https://mui.com/x/react-data-grid/column-groups/) to explore everything it has to offer.

- 🐞 Bugfixes
- 🌏 New locales for pickers thanks to @tesseractjh and @drastus

### `@mui/x-data-grid@v5.16.0` / `@mui/x-data-grid-pro@v5.16.0` / `@mui/x-data-grid-premium@v5.16.0`

#### Changes

- [DataGrid] Implement column grouping (#5133) @alexfauquette
- [DataGrid] Handle `disableVirtualization` prop change (#5889) @cherniavskii
- [DataGrid] Improve `GridRowModel` typing (#5734) @cherniavskii
- [DataGrid] Update deprecation note for `GridColDef` `hide` property (#5886) @cherniavskii

### `@mui/x-date-pickers@v5.0.0-beta.7` / `@mui/x-date-pickers-pro@v5.0.0-beta.7`

#### Changes

- [DatePicker] Fix to pass down `className` prop provided on DatePicker to `renderInput` (#5471) @CruseCtrl
- [DatePicker] Improve `a11y` support (#5809) @LukasTy
- [pickers] Add `PaperContent` component slot (#5801) @LukasTy
- [pickers] Add a breaking change section in the migration guide (#5805) @alexfauquette
- [pickers] Add new translations to `localeText` (#5143) @alexfauquette
- [pickers] Document components slots (#4657) @flaviendelangle
- [pickers] Add new unstable field components (#5504) @flaviendelangle
- [pickers] Fallback to default `minDate` / `maxDate` when `null` value is passed (#5397) @flaviendelangle
- [l10n] Add Korean (ko-KR) locale (#5854) @tesseractjh
- [l10n] Add Polish (pl-PL) locale (#5833) @drastus

### Docs

- [docs] Fix typo in `migration from lab` (#5277) @chuckwired
- [docs] Use `dayjs` instead of `date-fns` in doc examples (#5481) @flaviendelangle

### Core

- [core] Clarify the scope of the license key used for tests and documentation (#5824) @oliviertassinari
- [core] Fix Typescript error on field hooks (#5892) @flaviendelangle
- [core] Memoize `columns` in `useDemoData` hook (#5848) @cherniavskii
- [core] Remove Firefox from the BrowserStack list (#5874) @DanailH
- [core] Small changes to the release script (#5840) @m4theushw

## 5.15.3

_Aug 18, 2022_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.15.3` / `@mui/x-data-grid-pro@v5.15.3` / `@mui/x-data-grid-premium@v5.15.3`

#### Changes

- [DataGrid] Fix <kbd>Enter</kbd> causing Select to re-open when committing value (#5756) @m4theushw
- [DataGrid] Fix `GridOverlays` bypassing pointer events (#5674) @philjones88

### `@mui/x-date-pickers@v5.0.0-beta.6` / `@mui/x-date-picker-pro@v5.0.0-beta.6`

#### Changes

- [DatePicker] Support click on day outside of current month (#5768) @alexfauquette
- [pickers] Extend `PickersActionBarProps` with `DialogActionProps` (#5798) @LukasTy

### Docs

- [docs] Fix API anchor link scroll top (#5795) @oliviertassinari
- [docs] Fix contradiction in the free trial clause (#5732) @oliviertassinari
- [docs] Fix default value of the DataGrid `logLevel` prop to false (#5784) @HwangTaehyun
- [docs] Fix typo on the row height page (#5772) @flaviendelangle
- [docs] Improve "upgrading plans" documentation. (#5683) @joserodolfofreitas
- [docs] Link the license docs before pricing (#5726) @oliviertassinari
- [docs] Update packages README files (#5835) @cherniavskii
- [docs] Use `InputBase` for pickers inputs (#5597) @cherniavskii

### Core

- [core] Upgrade monorepo (#5771, #5797) @cherniavskii
- [core] Various TS improvements (#5556) @flaviendelangle
- [license] Give more context in the missing license (#5731) @oliviertassinari
- [license] Only log an error type once (#5730) @oliviertassinari
- [test] Increase timeout to take print screenshot (#5799) @m4theushw

## 5.15.2

_Aug 11, 2022_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- ✨ Improve quick filtering with row grouping (#5701) @alexfauquette
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.15.2` / `@mui/x-data-grid-pro@v5.15.2` / `@mui/x-data-grid-premium@v5.15.2`

#### Changes

- [DataGrid] Catch errors if rows freezing is not supported (#5711) @cherniavskii
- [DataGrid] Preserve cell mode when entering edit mode while committing (#5686) @m4theushw
- [DataGridPremium] Let quick filter search in row grouping children (#5701) @alexfauquette

### `@mui/x-date-pickers@v5.0.0-beta.5` / `@mui/x-date-picker-pro@5.0.0-beta.5`

#### Changes

- [pickers] Add `react-dom` to peerDependencies (#5752) @cherniavskii
- [TimePicker] Set clock focus outline to `none` (#5758) @LukasTy
- [pickers] Fix theme augmentation with TypeScript (#5596) @alexfauquette
- [pickers] Reset input value when locale is modified (#5310) @alexfauquette
- [pickers] Support `disableHighlightToday` on `MonthPicker` and `YearPicker` (#5562) @flaviendelangle
- [pickers] Fallback to desktop mode when `matchMedia` is unavailable (#5684) @LukasTy
- [pickers] Trigger `onChange` when clearing or accepting `Invalid date` (#5740) @LukasTy

### Docs

- [docs] Add RFC GH issue template (#5739) @bytasv
- [docs] Add description to the `GridExportStateParams` page (#5654) @oliviertassinari
- [docs] Improve the Events page (#5413) @flaviendelangle
- [docs] Use new editing API in the introduction demos (#5728) @oliviertassinari

### Core

- [core] Remove duplicated `FUNDING.yml` file (#5656) @oliviertassinari
- [core] Remove outdated Next.js options (#5727) @oliviertassinari
- [core] Update tooling to run with React 18 (#4155) @m4theushw
- [test] Fix failing dynamic row height tests on Edge (#5707) @m4theushw

## 5.15.1

_Aug 4, 2022_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 📚 New [page presenting the `apiRef`](https://mui.com/x/react-data-grid/api-object/) (#5273) @flaviendelangle
- ✨ Better keyboard support for start editing cells (#5511) @oliviertassinari
- 🌍 Improvements to different locales
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.15.1` / `@mui/x-data-grid-pro@v5.15.1` / `@mui/x-data-grid-premium@v5.15.1`

#### Changes

- [DataGrid] Improve start edit UX (#5511) @oliviertassinari
- [DataGrid] Add `initialOpen` prop to `GridEditSingleSelectCell` to allow overriding initial open state (#5645) @shapaaa
- [DataGrid] Forward `ref` to root element in `GridEditInputCell` (#5631) @Zenoo
- [DataGrid] Toggle open state when clicking on buttons in the `GridToolbar` (#5503) @cherniavskii
- [DataGrid] Improve German (de-DE) locale (#5586) @sebastianfrey
- [DataGrid] Improve Korean (ko-KR) locale (#5668) @Einere
- [DataGrid] Complete Italian (it-IT) locale (#5487) @mamodev

### `@mui/x-date-pickers@v5.0.0-beta.4` / `@mui/x-date-picker-pro@5.0.0-beta.4`

#### Changes

- [DatePicker] Customize day formatter in the calendar (#5373) @alexfauquette

### Docs

- [docs] New location for the legal content (#5595) @oliviertassinari
- [docs] Update description of `maxDateTime` prop (#5639) @jurecuhalev
- [docs] Add missing `date-fns` dependency when opening Codesandbox demo (#5692) @cherniavskii

### Core

- [core] Drop usage of `GRID_EXPERIMENTAL_ENABLED` env variable (#5669) @ar7casper
- [core] Isolate asset loading under /x/ (#5594) @oliviertassinari
- [core] Upgrade node to v14 (#4999) @cherniavskii

## 5.15.0

_Jul 29, 2022_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce aggregation (#5592) @flaviendelangle

  Premium users can now aggregate data in the grid.
  Extract information like sum, average, count, and others with a couple of clicks.

  https://user-images.githubusercontent.com/45398769/181581503-77cc412e-9d9e-4de1-8bc3-c3bccc54cdaa.mp4

  To enable this feature, add `experimentalFeatures={{ aggregation: true }}`.
  Aggregation functions are customizable and they combine well with row grouping.
  See the [documentation](https://mui.com/x/react-data-grid/aggregation/) to explore everything it has to offer.

- 🚀 Introduce row pinning (#4863) @cherniavskii

  Pro users can now pin rows on top or bottom of the grid.

  https://user-images.githubusercontent.com/45398769/181581493-56c733a3-6dd5-4546-bf8d-3f2dff72b14a.mp4

  To do so, enable the feature with `experimentalFeatures={{ rowPinning: true }}` and provide the pinned rows data to the `pinnedRows` prop.
  For more details, see the [documentation](https://mui.com/x/react-data-grid/row-pinning/).

- 🌍 Add simplified Chinese (zh-CN) locale to pickers (#5584) @gamecss
- 📚 Documentation improvements

### `@mui/x-data-grid@v5.15.0` / `@mui/x-data-grid-pro@v5.15.0` / `@mui/x-data-grid-premium@v5.15.0`

#### Changes

- [DataGrid] Add prop to keep modifications while processing props (#5309) @m4theushw
- [DataGrid] Fix container width change on React 18 (#5566) @m4theushw
- [DataGrid] Fix ellipsis style convention (#5587) @oliviertassinari
- [DataGridPro] Implement row pinning (#4863) @cherniavskii
- [DataGridPremium] Make aggregation public (#5592) @cherniavskii
- [l10n] Improve simplified Chinese (zh-CN) locale (#5584) @gamecss

### `@mui/x-date-pickers@v5.0.0-beta.3` / `@mui/x-date-picker-pro@5.0.0-beta.3`

#### Changes

- [l10n] Add simplified Chinese (zh-CN) locale (#5584) @gamecss

### Docs

- [docs] Split docs page about rows (#5195) @flaviendelangle
- [docs] Add warning clarifications (#5399) @alexfauquette
- [docs] Correct slot CSS classes for Pro and Premium components (#5452) @alexfauquette
- [docs] Fix internal link to `valueParser` (#5450) @alexfauquette

### Core

- [core] Upgrade monorepo (#5560) @m4theushw

## 5.14.0

_Jul 21, 2022_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🧪 Export `GridBooleanCell` component from data grid (#5537) @cliedeman
- ⚙️ Improve accessibility of the Export menu (#5486) @nogalpaulina
- 🌍 Improvements to different locales
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@5.14.0` / `@mui/x-data-grid-pro@5.14.0` / `@mui/x-data-grid-premium@5.14.0`

#### Changes

- [DataGrid] Add generics to `GridPreProcessEditCellProps` (#5510) @YunosukeY
- [DataGrid] Avoid inconsistent state export (#5390) @flaviendelangle
- [DataGrid] Export `GridBooleanCell` component (#5537) @cliedeman
- [DataGrid] Fix `date`/`dateTime` edit input font size to match view mode (#5304) @cherniavskii
- [DataGrid] Fix loading overlay position (#5558) @DanailH
- [DataGrid] Improve accessibility of the Export menu in the toolbar (#5486) @nogalpaulina
- [DataGridPremium] Implement Aggregation - not publicly released (#4208) @flaviendelangle
- [DataGridPremium] Fix crash when exporting all columns to Excel (#5425) @cherniavskii
- [l10n] Add Traditional Chinese (zh-TW) locale (#5498) @happyincent

### `@mui/x-date-pickers@v5.0.0-beta.2` / `@mui/x-date-picker-pro@5.0.0-beta.2`

#### Changes

- [l10n] Add Norwegian (nb-NO) locale (#5475) @elkebab

### Docs

- [docs] New page presenting the `apiRef` (#5273) @flaviendelangle
- [docs] Remove blank line @oliviertassinari

### Core

- [core] Add missing comments on zh-TW translation (#5559) @flaviendelangle
- [core] Polish on the bug issue template (#5525) @oliviertassinari
- [test] Add more tests related to `isPrintableKey` (#5458) @mnajdova

## 5.13.1

_Jul 15, 2022_

We'd like to offer a big thanks to the 13 contributors who made this release possible. Here are some highlights ✨:

- ✏️ Enter edit mode when pasting in a cell with Ctrl+V (Cmd+V on macOS) (#5405) @alexfauquette
- 🌍 Many improvements to the locales
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.13.1` / `@mui/x-data-grid-pro@v5.13.1` / `@mui/x-data-grid-premium@v5.13.1`

#### Changes

- [DataGrid] Fix blank space when using dynamic row height with pagination (#5315) @m4theushw
- [DataGrid] Start editing with uppercase letter and Ctrl+V (#5405) @alexfauquette
- [DataGrid] Fix some filters being removed from filter model on filter panel open (#5403) @cherniavskii
- [DataGridPro] Improve pinned column headers accessibility (#5370) @cherniavskii
- [l10n] Improve Dutch (nl-NL) locale (#5464) @developenguin
- [l10n] Improve French (fr-FR) locale (#3211) (#5420) @Zenoo
- [l10n] Improve German (de-DE) locale (#5448) @sebastianfrey
- [l10n] Improve Brazilian Portuguese (pt-BR) locale (#5394) @andrepxa
- [l10n] Improve Romanian (ro-RO) locale (#5449) @rolule

### `@mui/x-date-pickers@v5.0.0-beta.1` / `@mui/x-date-picker-pro@5.0.0-beta.1`

#### Changes

- [pickers] Add Italian (it-IT) locale (#5467) @felixh10r
- [pickers] Add Spanish (es-ES) locale (#5468) @felixh10r
- [pickers] Improve French (fr-FR) locale (#5446) @Zenoo
- [pickers] Improve German (de-DE) locale (#5447) @sebastianfrey

### Docs

- [docs] Fix typo in the sorting page (#5431) @JosephMarinier
- [docs] Fix description for "Striped rows" example (#5432) @lindapaiste
- [docs] Make a clear difference between the license and license key (#5316) @oliviertassinari
- [docs] Update pickers README files (#5456) @cherniavskii
- [docs] Clarify the scope of support for MUI X (#5423) @joserodolfofreitas

### Core

- [core] Add technical support link to \_redirects (#5428) @joserodolfofreitas
- [core] Improve GitHub bug reproduction template (#5067) @joserodolfofreitas
- [core] Include playground pages in tsconfig (#5367) @cherniavskii
- [core] Sort keys like in material-ui @oliviertassinari
- [test] Wait for flags to load on regression tests (#5473) @m4theushw

## 5.13.0

_Jul 7, 2022_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🎁 `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` are now in beta!

- ✨ Allow detail panel's height to match its content (#5163) @m4theushw

  ```tsx
  <DataGridPro getDetailPanelHeight={() => 'auto'} />
  ```

- 🌍 Add Romanian (ro-RO) locale on the data grid (#5345) @rolule
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.13.0` / `@mui/x-data-grid-pro@v5.13.0` / `@mui/x-data-grid-premium@v5.13.0`

#### Changes

- [DataGrid] Allows to customize variant of value input in filter panel (#4826) @alexfauquette
- [DataGrid] Add Romanian (ro-RO) locale (#5345) @rolule
- [DataGrid] Export Norwegian (nb-NO) locale (#5407) @cherniavskii
- [DataGrid] Fix broken "start editing" integration with Japanese (#5414) @mnajdova
- [DataGrid] Fix "stop editing" integration with IME e.g. Japanese (#5257) @Gumichocopengin8
- [DataGrid] Fix dimensions computation with `autoHeight` and scroll x (#5401) @flaviendelangle
- [DataGrid] Improve Slovak (sk-SK) locale (#5332) @msidlo
- [DataGrid] Mention Premium plan in error messages and docs warnings (#5328) @cherniavskii
- [DataGrid] Remove trailing spaces in filter input (#5279) @alexfauquette
- [DataGridPro] Allow to infer detail panel height from content (#5163) @m4theushw
- [DataGridPro] Fix the depth of nodes when switching from a non-flat tree to a flat tree (#5362) @flaviendelangle

### `@mui/x-date-pickers@v5.0.0-beta.0` / `@mui/x-date-picker-pro@5.0.0-beta.0`

#### Changes

- [DateRangePicker] Fix keyboard selection (#5265) @alexfauquette
- [DayPicker] Remove empty space at the bottom of the day view (#5073) @flaviendelangle
- [pickers] Add missing type dependencies (#5331) @Methuselah96
- [pickers] Pass the generics to the components in the theme augmentation (#5199) @toruticas

### Docs

- [docs] Explain how to use hooks inside a cell renderer (#5158) @flaviendelangle
- [docs] Fix server-side pagination demo (#5361) @cherniavskii
- [docs] Fix typo in the quick filter docs (#5313) @alexfauquette
- [docs] Improve the "Getting started" page (#5293) @alexfauquette
- [docs] New page for the pickers action bar customization (#5267) @flaviendelangle
- [docs] Revise and split up "Overview" page into "Introduction" (#4692) @samuelsycamore
- [docs] Use `useKeepGroupedColumnsHiddren` from the grid package on remaining demo (#5382) @flaviendelangle

## v5.12.3

_Jun 23, 2022_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Add Swedish (sv-SE) locale on the data grid and the pickers (#5210) @mrxdst
- 🌍 Add Dutch (nl-NL) locale on the pickers (#5237) @DDukers
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.12.3` / `@mui/x-data-grid-pro@v5.12.3` / `@mui/x-data-grid-premium@v5.12.3`

#### Changes

- [DataGrid] Do not hide non-hideable column when pressing Hide All button (#5298) @flaviendelangle
- [DataGrid] Do not regenerate the row tree when the `loading` prop changes (#5213) @flaviendelangle
- [DataGrid] Fix the default filter operator fallback on state initialization (#5266) @flaviendelangle
- [DataGrid] Stop using the deprecated `api` prop in the grid components (#5205) @flaviendelangle
- [DataGrid] Add Swedish (sv-SE) locale (#5210) @mrxdst
- [DataGridPremium] Fix detail panel on `DataGridPremium` (#5264) @flaviendelangle
- [DataGridPremium] Fix Excel import with Remix / Vite (#5207) @alexfauquette
- [DataGridPremium] Fix error with quick filter and grouping rows (#5238) @alexfauquette

### `@mui/x-date-pickers@v5.0.0-alpha.7` / `@mui/x-date-pickers-pro@v5.0.0-alpha.7`

#### Changes

- [pickers] Export adapters from both `@mui/x-date-pickers` and `@mui/x-date-pickers-pro` (#5204) @flaviendelangle
- [pickers] Add Dutch (nl-NL) locale (#5237) @DDukers

### Docs

- [docs] Add `DataGridPremium` to all API sections (#5196) @flaviendelangle
- [docs] Add plan badge next to event name in the Events page (#5200) @flaviendelangle
- [docs] Add section for theme augmentation in the picker docs (#5276) @flaviendelangle
- [docs] Add waiting for upvote section for row group panel (#5271) @flaviendelangle
- [docs] Disable ad on main demo page (#5301) @joserodolfofreitas
- [docs] Fix typo in the `DateRangePicker` documentation (#5259) @flaviendelangle

### Core

- [core] Allow having multiple playgrounds (#5288) @alexfauquette
- [core] Improve typing of `GridFilterInputMultipleSingleSelect` (#5206) @flaviendelangle
- [core] Remove arbitrary new lines (#5245) @oliviertassinari
- [core] Remove dead logic (#5282) @oliviertassinari
- [test] Fix `inputFormat` when testing with different date adapters (#5291) @cherniavskii
- [test] Fix date assertion in Safari 13 (#5221) @m4theushw
- [test] Throw if date adapter is not found (#5289) @cherniavskii
- [test] Use mock for `ResizeObserver` (#5215) @m4theushw

## v5.12.2

_Jun 16, 2022_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Performance improvement for dynamic row height (#5135) @m4theushw
- 🕒 Add demo of how to use the data grid with date pickers (#5053) @cherniavskii
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.12.2` / `@mui/x-data-grid-pro@v5.12.2` / `@mui/x-data-grid-premium@v5.12.2`

#### Changes

- [DataGrid] Fix for cosmetic bug on column filter badge (#5170) @simbahandiane
- [DataGrid] Hide vertical scrollbar if `autoHeight` is enabled (#5164) @m4theushw
- [DataGrid] Use exponential search to render non-measured rows (#5135) @m4theushw
- [DataGridPro] Fix label of the detail panel toggle column (#5191) @m4theushw
- [DataGridPro] Refresh detail panel caches when props change (#5110) @m4theushw

### Docs

- [docs] Add example with custom checkbox column (#5161) @flaviendelangle
- [docs] Batch small changes (#5177) @oliviertassinari
- [docs] Fix demo currency format (#5034) @oliviertassinari
- [docs] Fix outdated license description to match the EULA (#5219) @joserodolfofreitas
- [docs] Fix redundant headers (#5104) @oliviertassinari
- [docs] Fix some capitalization to match the guidelines (#5105) @oliviertassinari
- [docs] Improve the `getRowId` doc section (#5156) @flaviendelangle
- [docs] Instruction to deal with invalid license message (#5074) @joserodolfofreitas
- [docs] Use redirection in the code (#5114) @oliviertassinari
- [docs] Add demo of how to use the data grid with date pickers (#5053) @cherniavskii

### Core

- [core] Improve inline code rendering within the details tag (#5166) @Harmouch101
- [core] Remove unused props from plugin typing (#5185) @flaviendelangle
- [core] Use the scrollbar size from `useGridDimensions` on `DataGridProColumnHeaders` (#5201) @flaviendelangle
- [core] Fix `GridColTypeDef` type (#5167) @cherniavskii
- [core] Fix `GridColTypeDef` usage in demo (#5197) @cherniavskii
- [test] Add `waitFor` before asserting height (#5203) @m4theushw

## v5.12.1

_Jun 9, 2022_

We'd like to offer a big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add `reason` to `onFilterModelChange` (#4938) @m4theushw
- 🔎 Control quick filter input value via model prop (#5013) @alexfauquette
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.12.1` / `@mui/x-data-grid-pro@v5.12.1` / `@mui/x-data-grid-premium@v5.12.1`

#### Changes

- [DataGrid] Add `reason` to `onFilterModelChange` (#4938) @m4theushw
- [DataGrid] Restore focus after dismissing the column menu (#5027) @m4theushw
- [DataGrid] Update quick filter input when model is modified (#5013) @alexfauquette
- [DataGrid] Fix implicit dependency on react-dom (#5121) @oliviertassinari
- [DataGrid] Support `getRowId` in row reordering (#5093) @flaviendelangle
- [DataGridPro] Fix column resizing in RTL mode (#4989) @cherniavskii
- [DataGridPro] Fix column resizing on touchscreen (#5056) @cherniavskii
- [l10n] Update Japanese (ja-JP) locale (#5122) @hikotq
- [l10n] Update Russian (ru-RU) locale (#5069) @Artboomy

### `@mui/x-date-pickers@v5.0.0-alpha.6` / `@mui/x-date-pickers-pro@v5.0.0-alpha.6`

#### Changes

- [pickers] Fix usage of `maxDate` / `minDate` / `disableFuture` and `disablePast` (#5081) @flaviendelangle
- [pickers] Infer mask from `inputFormat` (#5060) @alexfauquette
- [pickers] Manage input value without using the focus (#4486) @alexfauquette
- [pickers] Use new localization for doc examples (#5097) @flaviendelangle
- [pickers] Fix `shouldDisableDate` in range pickers (#5123) @flaviendelangle
- [l10n] Add Brazilian Portuguese (pt-BR) locale (#5100) @jardelnovaes
- [l10n] Use `localText` for remaining texts (#4986) @alexfauquette

### Docs

- [docs] Implement the focus management on data grid demo links (#5070) @alexfauquette
- [docs] Fix `301` link to render cell (#5106) @oliviertassinari
- [docs] Fix broken anchor link @oliviertassinari
- [docs] Improve movie dataset (#5142) @flaviendelangle
- [docs] Move all localization documentation in a unique page (#5072) @alexfauquette
- [docs] Section for overwriting core components i18n keys (#4998) @DanailH
- [docs] Small grammar and format fixes for Dynamic Row Height section (#5098) @samuelsycamore

### Core

- [core] Allows to run tests with different date adapters (#5055) @alexfauquette
- [core] Prettify the l10n issue (#4928) @alexfauquette
- [core] Set correct `apiRef` type in row reorder pre processors #5125 @DanailH
- [core] Stop using `GridEvents` in technical doc (#5157) @flaviendelangle
- [core] Upgrade monorepo (#5101) @oliviertassinari
- [test] Fix dynamic row height test failing on Chrome (#5147) @m4theushw
- [test] Remove delay on server demo for regression tests (#5131) @alexfauquette

## v5.12.0

_May 31, 2022_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce support for [dynamic row height](https://mui.com/x/react-data-grid/row-height/#dynamic-row-height) (#4859) @m4theushw

  <img src="https://user-images.githubusercontent.com/42154031/171183167-718d7bcd-ec0f-459e-97fe-0f650abb4a99.gif" width="800">

- ⚠️ Remove deprecated row grouping feature from `@mui/x-data-grid-pro`

  Row grouping is available through the `@mui/x-data-grid-premium` package - see [Premium plan release blogpost](https://mui.com/blog/premium-plan-release/).

- 🐞 Bug fixes and improvements

### `@mui/x-data-grid@v5.12.0` / `@mui/x-data-grid-pro@v5.12.0` / `@mui/x-data-grid-premium@v5.12.0`

#### Changes

- [DataGrid] Support dynamic row height (#4859) @m4theushw
- [DataGrid] Add `onMenuOpen` and `onMenuClose` props (#4825) @DanailH
- [DataGrid] Add generics to `GridActionsColDef` to match `GridColDef` (#4982) @subvertallchris
- [DataGrid] Disable drag event handlers when row or column reorder are disabled (#4857) @DanailH
- [DataGrid] Allow other attempts to stop edit mode if the first failed (#5016) @m4theushw
- [DataGrid] Better reflect the dependency on Material UI (#4795) @oliviertassinari
- [DataGrid] Add an id to the filter item created when opening the filter panel (#5014) @flaviendelangle
- [DataGrid] Use column visibility model on Hide All / Show All when enabled (#5050) @flaviendelangle
- [DataGridPro] Unpin columns back to original position (#4512) @m4theushw
- [DataGridPro] Remove experimental row grouping from Pro plan (#4949) @flaviendelangle
- [DataGridPro] Allow to scroll detail panel content if it overflows the panel (#4979) @cherniavskii
- [DataGridPro] Do not call `setRowIndex` when dragging a column over a row (#4987) @flaviendelangle
- [l10n] Add Norwegian (Bokmål) (nb-NO) locale (#5001) @spiftire
- [l10n] Add Turkish (tr-TR) locale (#5026) @Rassilion

### `@mui/x-date-pickers@v5.0.0-alpha.5` / `@mui/x-date-pickers-pro@v5.0.0-alpha.5`

#### Breaking changes

- [pickers] Restructure props in `MonthPicker` / `YearPicker` and `DayPicker` (#4814) @flaviendelangle

  The props of `MonthPicker` / `YearPicker` and `DayPicker` have been reworked to make them more consistent for a standalone usage (#4814) @flaviendelangle

  **MonthPicker**: The prop `onMonthChange` has been removed, you can use `onChange` instead since every change is a month change

  **YearPicker**: The prop `onYearChange` has been removed, you can use `onChange` instead since every change is a year change

  **DayPicker**: The prop `isDateDisabled` has been removed, you can now use the same validation props as for the other components (`maxDate`, `minDate`, `shouldDisableDate`, `disableFuture` and `disablePast`)

#### Changes

- [pickers] Add German (de-DE) translations (#4974) @felixh10r
- [pickers] Support action bar on static pickers and improve typing (#5015) @flaviendelangle

### Docs

- [docs] Add docs sections / pages for upcoming features on pickers (#4603) @flaviendelangle
- [docs] Add docs for filter panel components (#4919) @m4theushw
- [docs] Explain how to manage focus with `renderCell` (#4254) @alexfauquette
- [docs] Fix broken links to GitHub source (#5003) @Edwardveb
- [docs] Fix navigation links (#4956) @oliviertassinari
- [docs] Fix typo on rows docs (#4952) @jamesRadicl
- [docs] New WAI-ARIA guidelines location (#4957) @oliviertassinari
- [docs] Add "Slots" section to the right nav in the API pages (#4993) @DanailH
- [docs] Fix docs feedback widget not working (#4905) @cherniavskii
- [docs] Replace custom notes and warning with callouts (#5008) @flaviendelangle

### Core

- [core] Avoid Order ID to refer to GitHub issues/PRs (#5005) @oliviertassinari
- [core] Improve the workflow for incomplete issues (#5012) @mnajdova
- [core] Remove dead code on row grouping tree creation (#4945) @flaviendelangle
- [core] Use new cache api for the row grouping last model tracking (#4980) @flaviendelangle
- [core] Ensure that PRs have atleast 1 label (#5011) @DanailH
- [core] Fix trailing-space @oliviertassinari
- [core] Stop Renovate PR updates when PR is on hold (#5020) @cherniavskii
- [license] Remove support for UTF-8 (#4893) @oliviertassinari
- [license] Tweak error messages (#4907) @mbrookes
- [test] Skip Safari and Firefox on broken tests (#4994) @alexfauquette
- [test] Make argos screenshots stable (#5061) @m4theushw

## v5.11.1

_May 20, 2022_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🌍 Support localization on the date and time picker components (#4517) @alexfauquette

  Texts can be translated in the pickers components, similar to what can be done in the data grid component. Check the [documentation](https://mui.com/x/react-date-pickers/localization/) for more information.

- 📃 Add support for column spanning when exporting to Excel (#4830) @cherniavskii

  <img src="https://user-images.githubusercontent.com/13808724/167691417-bf6baeb9-d409-4134-acb6-aadaf6434de9.png" width="800">

- 🐞 Bugs fixes

### `@mui/x-data-grid@v5.11.1` / `@mui/x-data-grid-pro@v5.11.1` / `@mui/x-data-grid-premium@v5.11.1`

#### Changes

- [DataGrid] Add a CSS class corresponding to current density (#4858) @m4theushw
- [DataGrid] Execute the pipe-processors in their initialization order (#4913) @flaviendelangle
- [DataGrid] Fix rendering of the no rows overlay when the `loading` prop is changed (#4910) @m4theushw
- [DataGridPremium] Add `exceljs` to the dependencies (#4939) @alexfauquette
- [DataGridPremium] Support column spanning in the Excel export (#4830) @cherniavskii
- [l10n] Improve Russian (ru-RU) locale (#4864) @arvkonstantin

### `@mui/x-date-pickers@v5.0.0-alpha.4` / `@mui/x-date-pickers-pro@v5.0.0-alpha.4`

#### Breaking changes

- The props related to the action bar buttons have been removed (`clearable`, `showTodayButton`, `cancelText`, `okText`)

  To decide which button must be displayed and in which order, you can now use the `actions` prop of the `actionBar` component slot props.

  ```jsx
  <DatePicker
    componentsProps={{
      actionBar: {
        // The actions will be the same between desktop and mobile
        actions: ['clear'],

        // The actions will be different between desktop and mobile
        actions: (variant) => (variant === 'desktop' ? [] : ['clear']),
      },
    }}
  />
  ```

  The build-in `ActionBar` component supports 4 different actions: `'clear'`, `'cancel'`, `'accept'`, and `'today'`.
  By default, the pickers will render the cancel and accept button on mobile and no action on desktop.

  If you need other actions, you can provide your own component to the `ActionBar` component slot

  ```jsx
  <DatePicker components={{ ActionBar: CustomActionBar }} />
  ```

#### Changes

- [DatePicker] Fix keyboard accessibility for first and last year (#4807) @alexfauquette
- [pickers] Add component slot for action bar (#4778) @alexfauquette
- [pickers] Add l10n support (#4517) @alexfauquette
- [pickers] Close Popper when pressing <kbd>Esc</kbd> inside a modal (#4499) @alexfauquette
- [pickers] Support class slots on toolbar components (#4855) @flaviendelangle
- [TimePicker] Fix time validation when current date is `null` (#4867) @flaviendelangle

### Docs

- [docs] Add 301 redirect for columns page (#4940) @alexfauquette
- [docs] Avoid confusion with license key installation (#4891) @oliviertassinari
- [docs] Complete the instructions for pickers installation in readme (#4852) @alexfauquette
- [docs] Disable ads on paid-only pages (#4842) @flaviendelangle
- [docs] Don't redirect to localized doc on deploy preview (#4818) @m4theushw
- [docs] Limit `LICENSE` file to 80 char per line (#4873) @oliviertassinari
- [docs] Typo on OrderId @oliviertassinari
- [docs] Update feature comparison table (#4918) @cherniavskii

### Core

- [core] Add new script to generate tree data rows from file tree (#4902) @flaviendelangle
- [core] Fix code style (#4874) @oliviertassinari
- [core] Fix React 18 peer dependency (#4908) @oliviertassinari
- [core] Fix link to the LICENSE file (#4875) @oliviertassinari
- [core] Fix transitive babel dependency (#4793) @oliviertassinari
- [core] New pipe processing `rowHydration` (#4896) @flaviendelangle
- [core] Remove dead code for the docs (#4791) @oliviertassinari
- [core] Run `yarn prettier` @oliviertassinari
- [core] Polishes on `CHANGELOG.md` (#4876) @oliviertassinari
- [core] Simplify rows cache management (#4933) @flaviendelangle
- [core] Use internal icons for quick filter (#4912) @alexfauquette

## v5.11.0

_May 13, 2022_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 🚀 **Premium plan release**. We're happy to announce that the Premium plan is [finally out](https://mui.com/blog/premium-plan-release/)! With it, MUI X officially steps up to the next level, supporting the most advanced use cases for UI components.

  This plan is available through the new `@mui/x-data-grid-premium` package, which contains the row grouping and the Excel export features.

  If you were already using the row grouping feature, you can upgrade by [installing](https://mui.com/x/react-data-grid/getting-started/#installation) `@mui/x-data-grid-premium` and replace `DataGridPro` with `DataGridPremium`, as follows. Note that the experimental flag is not required anymore to use the row grouping.

  ```diff
  -import { DataGridPro } from '@mui/x-data-grid-pro';
  +import { DataGridPremium } from '@mui/x-data-grid-premium';

  -<DataGridPro experimentalFeatures={{ rowGrouping: true }} />
  +<DataGridPremium />
  ```

  For more information about the revised pricing model please have a look at the [blog post](https://mui.com/blog/premium-plan-release/#the-new-licensing-model).

- 👔 **Excel export**. You can find this new Premium feature at: https://mui.com/x/react-data-grid/export/#excel-export.

- 🔎 **Quick filtering**. You can now add a quick filtering search bar to your grid. To do so, either pass `showQuickFilter` prop to the `<GridToolbar />` or use the `<GridToolbarQuickFilter />` component in your custom toolbar. More information about how to customize the filtering logic is in the [documentation](https://mui.com/x/react-data-grid/filtering/#quick-filter).

  <img src="https://user-images.githubusercontent.com/13808724/167700105-5a5acc7c-5463-4871-8514-3d09e2f365ae.png" width="724">

- 🐞 Bugs fixes

### `@mui/x-data-grid@v5.11.0` / `@mui/x-data-grid-pro@v5.11.0` / `@mui/x-data-grid-premium@v5.11.0`

#### Breaking changes

- Move row grouping to the premium package (#4223) @flaviendelangle

  The use of `rowGrouping` in the `@mui/x-data-grid-pro` package is deprecated. The experimental flag will be removed in an upcoming release.

#### Changes

- [DataGrid] Add TypeScript support to the `sx` prop in inner components (#4743) @lindapaiste
- [DataGrid] Add props to control cell mode (#4210) @m4theushw
- [DataGrid] Add quick filtering engine (#4317) @alexfauquette
- [DataGrid] Check focus validity whenever the rows in state changes (#4683) @flaviendelangle
- [DataGrid] Fix infinite scroll when dragging column header cell over row cell (#4735) @DjoSmer
- [DataGrid] Fix scroll jump when using keyboard navigation (#4515) @cherniavskii
- [DataGrid] Improve sorting accessibility (#4379) @cherniavskii
- [DataGrid] New `getRowGroupChildren` API method (#4304) @flaviendelangle
- [DataGrid] Publish `preferencePanelClose` event only once when clicking on another panel button (#4810) @flaviendelangle
- [DataGrid] Update focused action if the currently focused one is removed (#4694) @m4theushw
- [DataGrid] Add `onChange` callback to edit components (#4621) @m4theushw
- [DataGrid] Add `keepNonExistentRowsSelected` prop (#4786) @willsoto
- [DataGrid] Prevent crash if row is removed with click (#4831) @m4theushw
- [DataGridPro] Fix detail panel not taking full width (#4610) @cherniavskii
- [DataGridPremium] Add Excel export (#3981) @alexfauquette
- [DataGridPremium] Bootstrap `@mui/x-data-grid-premium` (#4223) @flaviendelangle
- [DataGridPremium] Fix Excel date serialization when row grouping is enabled (#4774) @cherniavskii
- [l10n] Improve German (de-DE) locale (#4748) @sebastianfrey
- [l10n] Improve German (de-DE) locale (#4668) @izu-co

### `@mui/x-date-pickers@v5.0.0-alpha.3` / `@mui/x-date-pickers-pro@v5.0.0-alpha.3`

#### Breaking changes

- Rework the auto-closing behavior of the pickers (#4408) @flaviendelangle

  The `disableCloseOnSelect` prop has been replaced by a new `closeOnSelect` prop which has the opposite behavior.
  The default behavior remains the same (close after the last step on desktop but not on mobile).

  ```diff
   // If you don't want to close after the last step
  -<DatePicker disableCloseOnSelect={false} />
  +<DatePicker closeOnSelect />

   // If you want to close after the last step
  -<DatePicker disableCloseOnSelect />
  +<DatePicker closeOnSelect={false} />
  ```

#### Changes

- [DatePicker] Ignore <kbd>Escape</kbd> when the picker is already closed (#4770) @mikewolfd
- [DatePicker] Make month year order changeable in header (#4695) @gky360
- [DateRangePicker] Open view on click, <kbd>Enter</kbd> or <kbd>Space</kbd> instead of focus (#4747) @alexfauquette
- [DateRangePicker] Refactor tests (#4745) @flaviendelangle
- [DateRangePicker] Remove `orientation` prop (#4665) @m4theushw
- [DateTimePicker] `Toolbar` should be visible by default on mobile (#4833) @flaviendelangle
- [MonthPicker] New prop `shouldDisableMonth` (#4708) @someone635
- [TimePicker] Disable and invalidate date with minutes not matching `minutesStep` (#4726) @flaviendelangle
- [TimePicker] Don't merge with previous value when new value is not valid (#4847) @flaviendelangle
- [TimePicker] Refactor `isTimeDisabled` method (#4688) @flaviendelangle
- [pickers] Add details in invalid mask error (#4501) @alexfauquette
- [pickers] Add explicit interfaces for components slots and components slots props (#4589) @flaviendelangle
- [pickers] Add missing `peerDependencies` for `yarn pnp` users (#4763) @nate-summercook
- [pickers] Add overrides to `PickersArrowSwitcher` (#4672) @m4theushw
- [pickers] Clean component interfaces and remove non-implemented props (#4758) @flaviendelangle
- [pickers] Do not apply the current time when no date provided in `DayPicker` (#4649) @flaviendelangle
- [pickers] Document and refacto the value manager (#4701) @flaviendelangle
- [pickers] Drop `allowSameDateSelection` prop (#4808) @flaviendelangle
- [pickers] Enable mask by default when using `ampm=true` (#4731) @alexfauquette
- [pickers] Fix `disabled` and `readOnly` behavior on calendar and clock (#4645) @alexfauquette
- [pickers] Invalid character does not delete last digit (#4839) @alexfauquette
- [pickers] Rename prop `date` into `parsedValue` when it can contain a range (#4736) @flaviendelangle
- [pickers] Rework `TDate`, `TInputDate`, `TValue` and `TInputValue` generics (#4617) @flaviendelangle
- [pickers] Rework the date lifecycle in `usePickerState` (#4408) @flaviendelangle

### Docs

- [docs] Add `scopePathNames` property to column page (#4811) @flaviendelangle
- [docs] Add label to each demo (#4667) @m4theushw
- [docs] Correctly capitalize <kbd>Ctrl</kbd> (#4707) @oliviertassinari
- [docs] Fix documentation on `ampm` prop (#4846) @alexfauquette
- [docs] Generate the event documentation from `GridEventLookup` (#4725) @flaviendelangle
- [docs] Keep columns section expanded when switching between pages (#4816) @cherniavskii
- [docs] Move `useKeepGroupingColumnsHidden` on `@mui/x-data-grid-premium` (#4319) @flaviendelangle
- [docs] Remove legacy pages for old URLs (#4575) @m4theushw
- [docs] Remove remaining pages in `docs/pages/api-docs` folder (#4709) @m4theushw
- [docs] SEO fixes (#4711) @oliviertassinari
- [docs] Set type number to movie column year (#4753) @flaviendelangle
- [docs] Simplify server examples (#4186) @alexfauquette
- [docs] Small typo (#4670) @flaviendelangle
- [docs] Split the 'Columns' page (#4600) @flaviendelangle
- [docs] Stop using `GridEvents` enum in documentation (#4699) @flaviendelangle
- [docs] Update mono repo to get copy code block (#4691) @siriwatknp
- [docs] Update the feature table in the Getting Started page of the data grid (#4619) @flaviendelangle
- [docs] Add demo for Premium (#4750) @m4theushw

### Core

- [core] Check if `process` is available (#4193) @m4theushw
- [core] Fix naming collision (#4853) @alexfauquette
- [core] Prevent out-of-memory when type-checking in CI (#4697) @flaviendelangle
- [core] Remove `rowsCache` from state (#4480) @m4theushw
- [core] Rework `DayPicker` api (#4783) @flaviendelangle
- [core] Update `x-license-pro` license to handle premium package (#4315) @DanailH
- [core] Update monorepo & version (#4789) @oliviertassinari
- [core] Update monorepo (#4772) @flaviendelangle
- [core] Stop using `GridEvents` enum (#4698, #4696, #4685) @flaviendelangle
- [core] Update monorepo (#4854) @cherniavskii
- [license] Allow to limit some packages to a specific license plan (#4651) @flaviendelangle
- [test] Fix path to detect `DataGrid` tests (#4752) @m4theushw
- [test] Reset cleanup tracking on Karma tests (#4679) @m4theushw
- [test] Restore `sinon` sandbox after each `karma` test (#4689) @m4theushw

## v5.10.0

_Apr 25, 2022_

We'd like to offer a big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Introduce [Row reorder](https://mui.com/x/react-data-grid/row-ordering/) (#4034) @DanailH

  <img src="https://user-images.githubusercontent.com/5858539/165091263-23472fbb-a989-44b8-849a-d2185adfe13b.gif" width="800">

- 🐞 Bug fixes

### `@mui/x-data-grid@v5.10.0` / `@mui/x-data-grid-pro@v5.10.0`

- [DataGrid] Don't close column menu when updating rows (#4498) @m4theushw
- [DataGridPro] Introduce row reorder (#4034) @DanailH

### `@mui/x-date-pickers@v5.0.0-alpha.2` / `@mui/x-date-pickers-pro@v5.0.0-alpha.2`

- [pickers] Pass `PaperProps` to `DesktopWrapper` component (#4584) @alexfauquette
- [TimePicker] Fix bug when time picker clear value (#4582) @alexfauquette
- [DateRangePicker] Fix missing `clearable` and `clearText` props (#4511) @zigang93

### Docs

- [docs] Add plan in the nav bar for pro-only and premium-only pages (#4591) @flaviendelangle
- [docs] Clarify where to install the license (#4452) @oliviertassinari
- [docs] Fix CodeSandbox links for demo with pickers (#4570) @alexfauquette
- [docs] Include date-fns dependency when opening demos in CodeSandbox (#4508) @m4theushw
- [docs] Split the 'Group & Pivot' page (#4441) @flaviendelangle

### Core

- [core] Fix the README of the X packages (#4590) @flaviendelangle
- [test] Fix test to not depend on screen resolution (#4587) @m4theushw

## v5.9.0

_Apr 14, 2022_

We'd like to offer a big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- ⚡ Update peer dependencies to support React 18 (#4332) @m4theushw

  Now the data grid and pickers components support the concurrent mode.

- 🎁 Add support for [Column spanning](https://mui.com/x/react-data-grid/column-spanning/) (#4020) @cherniavskii

  <img src="https://user-images.githubusercontent.com/13808724/162926746-93bcb180-3c9d-4eb9-afc7-c3908a5c6406.png" width="788">

- 📚 New standalone documentation for MUI X (#4313) @siriwatknp

  Each MUI product now has its own documentation.
  More information on our [blog post](https://mui.com/blog/docs-restructure-2022/).

- 🌍 Add Hungarian (hu-HU) locale (#4458) @x22tri

- 🐞 Bug fixes

### `@mui/x-data-grid@v5.9.0` / `@mui/x-data-grid-pro@v5.9.0`

- [DataGrid] Add indexes relative to the filtered rows and the current page to the `getRowClassName` and `getRowSpacing` props (#3882) @flaviendelangle
- [DataGrid] Add React 18 to peer dependencies (#4332) @m4theushw
- [DataGrid] Add support for column spanning (#4020) @cherniavskii
- [DataGrid] Apply filtering before sorting (#4359) @flaviendelangle
- [DataGrid] Enable using non-native Select in filter panel (#4361) @kyeongsoosoo
- [DataGrid] Fix `api` prop leaking to DOM (#4384) @m4theushw
- [DataGrid] Fix column dimensions import/export with flex and resizing (#4311) @flaviendelangle
- [DataGrid] Fix focus after stopping row edit mode with pagination enabled (#4326) @m4theushw
- [DataGrid] Fix inconsistent overlay when changing the `loading` prop (#4334) @m4theushw
- [DataGrid] Fix scrollbar grabbing issue in Safari (#4405) @cherniavskii
- [DataGrid] `GridCellParams.formattedValue` should be nullable (#4376) @flaviendelangle
- [DataGrid] Improve accessibility of the `actions` column (#4325) @m4theushw
- [DataGrid] Pass updated row to edit components (#4392) @m4theushw
- [DataGrid] Prevent column header scroll (#4280) @m4theushw
- [DataGridPro] Fix toggling detail panel using keyboard (#4409) @cherniavskii
- [l10n] Add Hungarian (hu-HU) locale (#4458) @x22tri

### `@mui/x-date-pickers@v5.0.0-alpha.1` / `@mui/x-date-pickers-pro@v5.0.0-alpha.1`

- [ClockPicker] Should call `shouldDisableTime` with the hours with meridiem (#4404) @flaviendelangle
- [MonthPicker] Clicking on a `PickersMonth` button should not trigger the form submit (#4402) @flaviendelangle
- [TimePicker] Do not update date when updating input in `TimePicker` (#4398) @flaviendelangle
- [pickers] Add react-dom to pickers peer deps to satisfy react-transition-group (#4411) @CarsonF
- [pickers] Add `TDate` generic to `CalendarOrClockPicker` component (#4465) @flaviendelangle
- [pickers] Fix default props behavior on all pickers (#4451) @flaviendelangle
- [pickers] Export `MuiPickersAdapterContext` (#4367) @flaviendelangle

### Docs

- [docs] Avoid redirections (#4365) @oliviertassinari
- [docs] Fix docs about date adapter (#4386) @alexfauquette
- [docs] Fix small external links issue (#4436) @oliviertassinari
- [docs] Fix some links to date picker docs (#4362) @oliviertassinari
- [docs] Fix wrong URL (#4415) @siriwatknp
- [docs] Go live with the new URLs (#4313) @siriwatknp
- [docs] Update the product names to be in sync @oliviertassinari

### Core

- [core] Add technical doc for pipe processing and family processing (#4322) @flaviendelangle
- [core] Don't upgrade CircleCI node (#4457) @m4theushw
- [core] Fix flaky e2e-website tests in CI (#4136) @cherniavskii
- [core] Fix license file copying during build (#4462) @flaviendelangle
- [core] Fix links on v5.8.0 (#4464) @oliviertassinari
- [core] Fix npm page description mistake (#4364) @oliviertassinari
- [core] Fix typos and JSDoc (#4406) @flaviendelangle
- [core] Move away for the event system to trigger pipe processings (#4378) @flaviendelangle
- [core] Small fixes TS on pickers (#4461) @flaviendelangle
- [core] Unify tests (#4368) @flaviendelangle
- [core] Enforce `noImplicitAny` in `docs` folder (#4412) @cherniavskii

## 5.8.0

_Apr 4, 2022_

We'd like to offer a big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Expose new methods to save and restore the grid state (#4028) @flaviendelangle

  The different methods to save and restore the data-grid state are now [documented](https://mui.com/x/react-data-grid/state/#save-and-restore-the-state).

- ⌚️ Move date and time picker components from the lab (#3451) @flaviendelangle

  Date and time picker components have been moved to the MUI X repository.
  They are now accessible in their own packages: `@mui/x-date-pickers` and `@mui/x-date-pickers-pro`.
  For more information, you can read the [blog article](https://mui.com/blog/lab-date-pickers-to-mui-x/) and the [migration guide](https://mui.com/x/react-date-pickers/migration-lab/).

- 📝 Add `onProcessRowUpdateError` prop to simplify error management in edit mode (#4267) @m4theushw
- ✨ Add generic typing to `GridColDef` and derived interfaces (#4064) @flaviendelangle

  You can now strongly type all the objects related to the row and the cell values.
  Here is an example, you can find out more in the description of #4064.

  ```tsx
  const rows: Movie[] = [];

  return (
    <DataGrid
      rows={rows}
      columns={[
        {
          // typeof params.row => Movie (R)
          valueGetter: (params) => params.row.year,
        },
      ]}
    />
  );
  ```

### `@mui/x-data-grid@v5.8.0` / `@mui/x-data-grid-pro@v5.8.0`

#### Changes

- [DataGrid] Add `onProcessRowUpdateError` prop (#4267) @m4theushw
- [DataGrid] Add generic typing to `GridColDef` and derived interfaces (#4064) @flaviendelangle
- [DataGrid] Add missing classes on `gridClasses` and `gridPanelClasses` (#4273) @flaviendelangle
- [DataGrid] Add `onPreferencePanelClose`/`onPreferencePanelOpen` props (#4265) @kyeongsoosoo
- [DataGrid] Add slot for filter icon button (#4276) @m4theushw
- [DataGrid] Add the documentation of the portable state (#4028) @flaviendelangle
- [DataGrid] Allow to use keyboard navigation even with no rows (#4302) @alexfauquette
- [DataGrid] Fix inconsistency in the border of the last column (#4224) @alexfauquette
- [DataGrid] Fix overlay blocking scrollbar when rows is empty (#4281) @m4theushw
- [DataGrid] Improve selection with keyboard (#4157) @flaviendelangle
- [DataGrid] Scroll to the top of the page when changing page (#4272) @flaviendelangle
- [l10n] Improve Danish (da-DK) locale (#4271) @simplenotezy

### `@mui/x-date-pickers@v5.0.0-alpha.0` / `@mui/x-date-pickers-pro@v5.0.0-alpha.0`

#### Changes

- [DatePicker] Import date-picker components from the lab (#3451) @flaviendelangle

### Docs

- [docs] Create an home page for "Advanced Components" (#4298) @flaviendelangle
- [docs] Update installation docs (#4259) @cherniavskii
- [docs] New page for the migration of date and time pickers from the lab (#4327) @flaviendelangle

### Core

- [core] Fix typo in issue template @oliviertassinari
- [core] Move last variables outside of the models folder (#4303) @flaviendelangle
- [core] Remove dead code (#4283) @oliviertassinari
- [core] Rename the "pre-processing" concept "pipe-processing" (#4261) @flaviendelangle
- [core] Reuse previous state when updating the columns prop (#4229) @m4theushw
- [core] Fix Argos flakiness for pickers tests (#4312) @flaviendelangle

## 5.7.0

_Mar 24, 2022_

We'd like to offer a big thanks to the 12 contributors who made this release possible. Here are some highlights ✨:

- ✏ Add a new editing API with better support for server-side persistence and validation (#3963, #4060) @m4theushw

  The new API is stable, but to avoid any breaking changes or conflicts with the old API, you must add the following flag to access it:

  ```tsx
  <DataGrid experimentalFeatures={{ newEditingApi: true }} />
  ```

  ⚠ Users relying on the old API (legacy) don't need to worry as it will continue to work until v6.

  The new API also features brand new documentation with more useful demos and guides explaining how to create custom edit components.
  Visit the new [documentation](https://mui.com/x/react-data-grid/editing/) for more information.

- 📚 Documentation improvements
- 🐞 Bug and typo fixes

### `@mui/x-data-grid@v5.7.0` / `@mui/x-data-grid-pro@v5.7.0`

#### Changes

- [DataGrid] Add column order and dimensions to the portable state (#3816) @flaviendelangle
- [DataGrid] Add new editing API (#3963) @m4theushw
- [DataGrid] Allow to customize `ColumnsPanel` with `componentsProps` prop (#4207) @alexfauquette
- [DataGrid] Do not unselect row when <kbd>Shift</kbd> + click on the last selected row of a range (#4196) @flaviendelangle
- [DataGrid] Fix `showCellRightBorder` not working in the last row (#4140) @cherniavskii
- [DataGrid] Fix error overlay not visible when `autoHeight` is enabled (#4110) @cherniavskii
- [DataGrid] Fix white blank when scrolling (#4158) @alexfauquette
- [DataGrid] Adjust type of the `description` prop in `GridColumnHeaderTitle` (#4247) @baahrens
- [DataGrid] Fix focus after stopping row edit mode (#4252) @m4theushw
- [DataGridPro] Fix pinned columns edge overflow with custom `borderRadius` (#4188) @socramm9
- [DataGridPro] Fix tab switching order with pinned columns and `editMode="row"` (#4198) @cherniavskii
- [l10n] Improve Persian (fa-IR) locale (#4227) @SaeedZhiany
- [l10n] Improve Polish (pl-PL) locale (#4153) @pbmchc
- [l10n] Improve Arabic (ar-SD) locale (#4212) @shadigaafar
- [l10n] Improve Korean (ko-KR) locale (#4245) @kyeongsoosoo

### Docs

- [docs] Clean demo (#4073) @alexfauquette
- [docs] Delete restore state demos (#4220) @flaviendelangle
- [docs] Document Print export `X-Frame-Options` limitation (#4222) @DanailH
- [docs] Add docs for the new editing API (#4060) @m4theushw
- [docs] Explain how to use `printOptions.pageStyle` (#4138) @alexfauquette
- [docs] Fix 301 links (#4165) @oliviertassinari
- [docs] Fix 404 API links (#4164) @oliviertassinari
- [docs] Fix broken anchor links (#4162) @alexfauquette
- [docs] Remove useless `apiRef` from demos (#4221) @flaviendelangle
- [docs] Sync the headers with core (#4195) @oliviertassinari

### Core

- [core] Add CLI to decode license key (#4126) @flaviendelangle
- [core] Fix Lerna package change detection (#4202) @oliviertassinari
- [core] Implement strategy pattern for pre-processors (#4030) @flaviendelangle
- [core] Keep same reference to the column visibility model if no column has changed (#4154) @m4theushw
- [core] Prepare `@mui/x-license-pro` for date pickers (#4123) @flaviendelangle
- [core] Remove datagen from `@mui/x-data-grid-generator` bundle (#4163) @m4theushw
- [core] Remove lodash `isDeepEqual` (#4159) @flaviendelangle
- [core] Use a pipe processor for `GridPreferencePanel` children (#4216) @flaviendelangle
- [core] Add markdown documentation for contributors (#3447) @alexfauquette
- [test] Add regression test for `showCellRightBorder` (#4191) @cherniavskii
- [test] Mock `getComputedStyle` to speed up unit tests (#4142) @m4theushw
- [test] Upgrade CircleCI convenience image (#4143) @m4theushw

## 5.6.1

_Mar 10, 2022_

We'd like to offer a big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- ✨ Allow to add margins or borders between rows (#3848) @m4theushw

  ```tsx
  <DataGrid getRowSpacing={() => ({ top: 10, bottom: 10 })} />
  ```

  Check the [documentation](https://mui.com/x/react-data-grid/row-height/#row-spacing) for more information.

### `@mui/x-data-grid@v5.6.1` / `@mui/x-data-grid-pro@v5.6.1`

#### Changes

- [DataGrid] Display column's filter icon if a filter is applied (#4120) @DanailH
- [DataGrid] Do not loop through rows to compute top level rows count when the tree is flat (#4081) @flaviendelangle
- [DataGrid] Rename API method (#4148) @m4theushw
- [DataGrid] Support extending built-in column types (#4114) @cherniavskii
- [DataGridPro] Re-export the components removed by mistake during bundle split (#4134) @flaviendelangle

### Docs

- [docs] Fix links to prevent duplicate search result (#4130) @siriwatknp
- [docs] Fix outdated links to `localeTextConstants.ts` (#4080) @patilvishal755
- [docs] Neglect e2e tests related to search (#4118) @siriwatknp
- [docs] Use regex instead of specific url in e2e-website-tests (#4121) @siriwatknp

### Core

- [core] Enforce `noImplicitAny` (#4084) @cherniavskii
- [core] Improve the Pro support issue template (#4082) @oliviertassinari
- [core] Initialize remaining states before feature hooks (#4036) @m4theushw
- [core] Merge `page` and `pageSize` state initializer into a single `pagination` state initializer (#4087) @flaviendelangle
- [core] Prepare `yarn docs:api:build` scripts for multi packages support (#4111) @flaviendelangle
- [core] Upgrade `@mui/monorepo` (#4149) @cherniavskii
- [core] Use `buildWarning` and `wrapWithWarningOnCall` for deprecated methods and wrong usages (#4056) @flaviendelangle
- [test] Make focus state out-of-sync warning opt-in (#4129) @m4theushw
- [test] Only test custom input keyboard event in edit mode (#4075) @alexfauquette

## 5.6.0

_Mar 4, 2022_

We'd like to offer a big thanks to the 15 contributors who made this release possible. Here are some highlights ✨:

- 📦 Use the same bundling scripts as those in the [material-ui](https://github.com/mui/material-ui) repository (#3965) @flaviendelangle

  The code structure and the bundling strategy have been modified to provide better isolation between components.
  The bundle size is slightly reduced, but with tree shaking, the doors are open for significant gains in the future. 🏋
  We predict that such modifications could potentially impact edge cases.
  If you encounter problems with your build, please open an issue.
  These issues will have high priority as part of our risk mitigation strategy.

- 🧼 Clean and document the column selectors (#4010) @flaviendelangle

  Column selectors have been renamed to improve clarity.
  The old names have been deprecated and will be removed in v6.
  Here are the new names and the modifications needed to get the same information with the new selectors.

  | Old name                        | New name                                  |
  | :------------------------------ | :---------------------------------------- |
  | `allGridColumnsFieldsSelector`  | `gridColumnFieldsSelector`                |
  | `allGridColumnsSelector`        | `gridColumnDefinitionsSelector`           |
  | `visibleGridColumnsSelector`    | `gridVisibleColumnDefinitionsSelector`    |
  | `filterableGridColumnsSelector` | `gridFilterableColumnDefinitionsSelector` |

  ```diff
  -const { all, lookup, columnVisibilityModel } = gridColumnsSelector(apiRef);
  +const all = gridColumnFieldsSelector(apiRef);
  +const lookup = gridColumnLookupSelector(apiRef);
  +const columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef);

  -const filterableFields = filterableGridColumnsIdsSelector(apiRef);
  +const lookup = gridFilterableColumnLookupSelector(apiRef);
  +const filterableFields = gridColumnFieldsSelector(apiRef).filter(field => lookup[field]);

  -const visibleColumnsNumber = visibleGridColumnsLengthSelector(apiRef);
  +const visibleColumnsNumber = gridVisibleColumnDefinitionsSelector(apiRef).length;

  -const { totalWidth, positions } = gridColumnsMetaSelector(apiRef);
  +const totalWidth = gridColumnsTotalWidthSelector(apiRef);
  +const positions = gridColumnPositionsSelector(apiRef);
  ```

- 📚 Documentation improvements
- 🐞 Bug and typo fixes

### `@mui/x-data-grid@v5.6.0` / `@mui/x-data-grid-pro@v5.6.0`

#### Changes

- [DataGrid] Add slot for filter panel delete icon (#4069) @Hameezr
- [DataGrid] Add specific label for `linkOperator` (#3915) @alexfauquette
- [DataGrid] Allow for truncated and multiline content in grid cells (#3955) @DanailH
- [DataGrid] Allow to navigate between cells with keyboard once inside an `actions` column (#3375) @m4theushw
- [DataGrid] Fix desynchronization between rows and header when sorting (#4058) @alexfauquette
- [DataGrid] Clean and document the columns selector (#4010) @flaviendelangle
- [DataGrid] Deprecate and stop typing the api params of `GridCellParams`/`GridValueGetterParams` and affiliated (#4089) @ flaviendelangle
- [DataGrid] Differentiate the Pro and Community versions of `GridState`, `GridApi` and `GridApiRef` (#3648) @flaviendelangle
- [DataGrid] Fix column selection for print export (#3917) @alexfauquette
- [DataGrid] Fix horizontal scroll not working on empty grid (#3821) @cherniavskii
- [DataGrid] Fix input element in custom header (#3624) @alexfauquette
- [DataGrid] Improve `singleSelect` filter performance (#3956) @cherniavskii
- [DataGrid] Improve custom overlay slots positioning (#3832) @cherniavskii
- [DataGrid] Improve `flex` implementation match the W3C standard (#4006) @cherniavskii
- [DataGrid] Improve the invalid `sortModel` and `filterModel` warnings (#3671) @flaviendelangle
- [DataGrid] Memoize `Popper` modifiers passed to panel (#3975) @m4theushw
- [DataGrid] Prevent focus while `Popper` is not fully positioned (#4067) @m4theushw
- [DataGrid] Remove `GridCell`'s `borderBottom` when it is the last row (#3519) @DanailH
- [DataGrid] Remove padding from the header title (#3691) @valenfv
- [DataGrid] Reuse previous `rowNode` when building tree and the new `rowNode` is equal to the previous one (#3961) @flaviendelangle
- [DataGrid] Remove last filter item when no value to clean and close the filter panel (#3910) @alexfauquette
- [DataGrid] Send warning when the `rowCount` is not provided while using server pagination (#3902) @alexfauquette
- [DataGrid] Stop checkbox ripple on blur (#3835) @m4theushw
- [DataGrid] Stop calling `onRowClick` when clicking in cells with interactive elements (#3929) @m4theushw
- [DataGrid] Use only `headerName` when available to search column (#3959) @pkratz
- [DataGrid] Use the bundling scripts as the packages published by the [material-ui](https://github.com/mui/material-ui) repository (#3965) @flaviendelangle
- [DataGridPro] Add `unstable_setRowHeight` method to `apiRef` (#3751) @cherniavskii
- [DataGridPro] Always export the `pageSize` and `page` when it has been initialized or is being controlled (#3908) @flaviendelangle
- [DataGridPro] Disable export for detail panel column (#4057) @gustavhagland
- [DataGridPremium] Support `valueFormatter` on the grouping column (#4022) @flaviendelangle
- [l10n] Improve Bulgarian (bg-BG) locale (#3949) @DanailH
- [l10n] Improve German (de-DE) locale (#4077) @sebastianfrey
- [l10n] Improve Hebrew (he-IL) locale (#3930) @ColdAtNight

### Docs

- [docs] Add example of custom operator based on built-in ones (#3911) @flaviendelangle
- [docs] Add missing words in the filtering page (#4079) @flaviendelangle
- [docs] Avoid crash in demos using row grouping and custom formatted cells (#4065) @m4theushw
- [docs] Fix `Commodity` and `Employee` CSV export of the `country` column (#3912) @DanailH
- [docs] Fix links to the GitHub repository (#4005) @oliviertassinari
- [docs] Fix typo (#3923) @oliviertassinari
- [docs] Fix typo (#4016) @MathisBurger
- [docs] Fix typo in client-side validation example (#4066) @krallj
- [docs] Remove useless hide id column (#4021) @alexfauquette

### Core

- [core] Allows to add custom export item (#3891) @alexfauquette
- [core] Remove the `_modules_` folder (#3953) @flaviendelangle
- [core] Fix typo in `useGridScroll.ts` (#3973) @HexM7
- [core] Fix typos, improve wordings and other various fixes (#4062) @flaviendelangle
- [core] Initialize states before feature hooks (#3896) @m4theushw
- [code] Make `@mui/x-data-grid-pro` import shared code from `@mui/x-data-grid` (#3688) @flaviendelangle
- [core] Migrate `@mui/x-license-pro` to the new bundling strategy (#3738) @flaviendelangle
- [core] Reduce usage of `useGridSelector` inside feature hooks (#3978) @flaviendelangle
- [core] Retry l10n CI if 502 returned (#3977) @alexfauquette
- [core] Update release instructions (#3920) @cherniavskii
- [core] Use international locale format (#3921) @oliviertassinari
- [core] Fix license generating script (#4055) @Janpot
- [test] Add screenshot of the filter panel (#4072) @alexfauquette
- [test] Reduce memory usage to run unit tests (#4031) @m4theushw
- [test] Skip test on Firefox (#3926) @m4theushw

## 5.5.1

_Feb 10, 2022_

A big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🎛 Add props to customize the behavior of the filter panel (#3497) @alexfauquette

  ```tsx
  <DataGrid
    componentsProps={{
      filterPanel: { columnsSort: 'asc' },
    }}
  />
  ```

  Check the [documentation](https://mui.com/x/react-data-grid/filtering/#customize-the-filter-panel-content) to see all available props.

- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.5.1` / `@mui/x-data-grid-pro@v5.5.1`

- [DataGrid] Add `debounceMs` option to `setEditCellValue` method (#3825) @m4theushw
- [DataGrid] Allow to translate `checkboxSelection` labels (#3846) @m4theushw
- [DataGrid] Customize the filter panel with props (#3497) @alexfauquette
- [DataGrid] Fix filtering of string columns for `value = 0` (#3843) @flaviendelangle
- [DataGrid] Fix focus when `blur` event rerenders the grid (#3718) @alexfauquette
- [DataGridPro] Add clear error when the tree data has duplicated paths (#3840) @flaviendelangle
- [DataGridPro] Avoid imports from `@mui/base` (#3903) @cherniavskii
- [DataGridPro] Register column pinning after selection (#3887) @m4theushw
- [l10n] Improve Turkish (tr-TR) locale (#3842) @atillaaliyev

### Docs

- [docs] Update v5 migration docs (#3847) @oliviertassinari
- [docs] Fix sorting feature link (#3877) @alexfauquette
- [docs] Migrate content to the new location (#3730) @siriwatknp
- [docs] Unify multi-filtering introduction with the multi-sorting introduction (#3766) @flaviendelangle
- [docs] Move row grouping to Premium plan (#3827) @alexfauquette
- [docs] Reorganize export docs to prepare Excel export doc (#3822) @alexfauquette

### Core

- [core] Add hook `useGridPagination` to call `onGridPage` and `onGridPageSize` (#3880) @flaviendelangle
- [core] Fix docs deploy script (#3874) @oliviertassinari
- [core] Move the git repository to a new location (#3872) @oliviertassinari
- [test] Add `codecov` (#3873) @oliviertassinari

## 5.5.0

_Feb 3, 2022_

A big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add support for [master/detail](https://mui.com/x/react-data-grid/group-pivot/#master-detail) (#3387) @m4theushw

  <img src="https://user-images.githubusercontent.com/42154031/152379354-47120aac-2b37-4a90-b311-64b4522283b9.gif" width="814">

- 🌍 Add Danish (da-DK) locale (#3800) @kasperfilstrup
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.5.0` / `@mui/x-data-grid-pro@v5.5.0`

#### Changes

- [DataGrid] Add methods to import and export the state (#3593) @flaviendelangle
- [DataGrid] Fix <kbd>PageUp</kbd> jumping directly to the column header skipping the first row (#3761) @cherniavskii
- [DataGrid] Throw an error if incorrect column type is used (#3757) @DanailH
- [DataGridPro] Add support for master/detail (#3387) @m4theushw
- [l10n] Add Danish (da-DK) locale (#3800) @kasperfilstrup
- [l10n] Improve Dutch (nl-NL) locale (#3724) @MatthijsKok
- [l10n] Improve Hebrew (he-IL) locale (#3775) @ColdAtNight
- [l10n] Improve Russian (ru-RU) locale (#3818) @Leniorko

### Docs

- [docs] Add default value for `Row` slot (#3807) @cherniavskii
- [docs] Extend full width (#3815) @m4theushw
- [docs] Fix country column sorting not working (#3740) @cherniavskii
- [docs] Fix custom render cell when row is auto generated (#3810) @alexfauquette
- [docs] Fix flag layout shift (#3773) @oliviertassinari
- [docs] Mention row `id` requirement and document `getRowId` prop (#3765) @cherniavskii
- [docs] Refresh the license key documentation (#3529) @oliviertassinari

### Core

- [core] Clean `filtering.DataGrid.test.tsx` (#3768) @flaviendelangle
- [core] Improve GitHub label workflows (#3680) @DanailH
- [core] Isolate selectors called without `useGridSelector` (#3774) @m4theushw
- [core] Prepare infra for pickers migration (#3714) @flaviendelangle
- [core] Remove none code related instructions from git (#3794) @oliviertassinari
- [core] Remove remaining usages of `@mui/styles` (#3769) @m4theushw
- [core] Remove Stylelint (#3811) @m4theushw
- [core] Split cell / row editing into different hooks (#3219) @m4theushw
- [core] Stop using an enum for `GridPreProcessingGroup` (#3798) @flaviendelangle
- [core] Fix failing tests (#3817) @cherniavskii
- [code] Fix `docs:api` silent crash (#3808) @cherniavskii
- [test] Increase timeout for Firefox (#3813) @m4theushw

## 5.4.0

_Jan 28, 2022_

A big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🚣 Introduce [variable row height](https://mui.com/x/react-data-grid/row-height/#variable-row-height) (#438) @DanailH

  Allows for setting a row-specific height.
  By default, all rows have the same height, but now you can set the height on a per-row basis.

  ```tsx
  <DataGrid getRowHeight={({ id }: GridRowHeightParams) => (id % 2 === 0 ? 100 : null)} />
  ```

- 🎁 Add new CSV export option: [`getRowsToExport`](https://mui.com/x/react-data-grid/export/#custom-exported-content) (#3687) @flaviendelangle
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.4.0` / `@mui/x-data-grid-pro@v5.4.0`

#### Changes

- [DataGrid] Add l10n support for `is any of` (#3746) @alexfauquette
- [DataGrid] Add new CSV `getRowsToExport` option (#3687) @flaviendelangle
- [DataGrid] Clean params of `onCellEditCommit` (#3693) @valenfv
- [DataGrid] Create a new lookup with all the filtered rows, collapsed or not (#3736) @flaviendelangle
- [DataGrid] Fix Alt+c being ignored on some systems (#3660) @cherniavskii
- [DataGrid] Fix `isRowSelectable` when `paginationMode='server'` (#3647) @flaviendelangle
- [DataGrid] Fix browser keyboard shortcuts not working when header cell is focused (#3692) @valenfv
- [DataGrid] Fix focus on checkbox cells (#3501) @alexfauquette
- [DataGrid] Only update the visibility status of the updated columns when calling `apiRef.current.updateRows` (#3735) @flaviendelangle
- [DataGrid] Prevent commit if `preProcessEditCellProps` resolves with an error (#3612) @m4theushw
- [DataGrid] Update selected rows when turning off `checkboxSelection` (#3684) @m4theushw
- [DataGrid] Variable row height (#3218) @DanailH
- [DataGridPro] Call `useGridColumnPinning` before `useGridColumns` (#3676) @flaviendelangle
- [DataGridPro] Fix grid cell losing focus when scrolling with keyboard (#3667) @cherniavskii
- [DataGridPro] Fix missing `styleOverrides` on pinned columns (#3733) @alexfauquette
- [DataGridPro] Remove function overloading for `useGridApiRef` (#3666) @flaviendelangle
- [l10n] Improve French (fr-FR) locale (#3739) @flaviendelangle
- [l10n] Improve Italian (it-IT) locale (#3744) @destegabry

### Docs

- [docs] Fix broken code example on the localization page (#3742) @flaviendelangle
- [docs] Fix typo in column visibility example (#3734) @flaviendelangle
- [docs] Fix typo on `columnVisibilityModel` (#3723) @alexfauquette
- [docs] Improve sorting documentation page (#3564) @flaviendelangle
- [docs] Improve `v5.3.0` release notes (#3722) @cherniavskii
- [docs] Prepare scripts and E2E tests for migration (#3515) @siriwatknp
- [docs] Clarify what is the professional support (#3530) @oliviertassinari

### Core

- [core] Add ESLint rule to force default export equals to filename in documentation (#3674) @alexfauquette
- [core] Fix `l10n` script not updating `cs-CZ` locale (#3748) @cherniavskii
- [core] Generate CHANGELOG from GitHub API (#3313) @alexfauquette
- [core] Isolate selectors from different grid instances (#3663) @m4theushw
- [test] Improve test detection (#3728) @m4theushw
- [test] Include module augmentation for Chai custom matchers (#3754) @m4theushw
- [test] Remove a useless `async` (#3675) @alexfauquette
- [test] Remove remaining `@ts-expect-error` (#3762) @m4theushw
- [test] Skip test on Firefox (#3752) @m4theushw
- [test] Wait for flags to load before creating snapshots (#3726) @m4theushw
- [test] Warn when focusing cells without syncing the state (#3486) @m4theushw

## 5.3.0

_Jan 21, 2022_

A big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Allow to group rows based on column value (#3277) @flaviendelangle

  ⚠️ This feature is temporarily available on the Pro plan until the release of the Premium plan.

  To avoid future regression for users of the Pro plan, the feature needs to be explicitly activated using the rowGrouping experimental feature flag.

  ```tsx
  // To fully control
  <DataGridPro
    rowGroupingModel={rowGroupingModel}
    onRowGroupingModel={newModel => setRowGroupingModel(newModel)}
    experimentalFeatures={{ rowGrouping: true }}
  />

  // To initialize without controlling
  <DataGridPro
    initialState={{
      rowGrouping: {
        model: rowGroupingModel,
      },
    }}
    experimentalFeatures={{ rowGrouping: true }}
  />
  ```

  For more details see the [introduction blog post](https://mui.com/blog/introducing-the-row-grouping-feature/) and [documentation](https://mui.com/x/react-data-grid/group-pivot/#row-grouping).

- ⚡ Add `is any of` filter operator (#2874) @alexfauquette

  The new filter operator `is any of` allows the user to provide multiple values. It opens access to complex filtering pattern mixing `AND` and `OR` logic connectors, such as `status is any of filled or rejected, and currency is any of EUR or USD`.

  <img src="https://user-images.githubusercontent.com/45398769/150486348-996a938f-db24-426f-bfe3-c06337f71807.gif" width="770">

- ✨ Introduce a `maxWidth` property in `GridColDef` (#3550) @flaviendelangle

  You can now limit the width of the flex columns and the resizable columns with the new `maxWidth` property on `GridColDef`.

  ```tsx
  const columns: GridColDef[] = [
    { field: 'director', flex: 1, maxWidth: 200 }, // will take the free space up to 200px and will not be resizable above 200px
    { field: 'year', maxWidth: 150 }, // will not be resizable above 150px
  ];
  ```

- 🚀 Add component slots for a subset of used `@mui/material` components (#3490) @DanailH

  To make the grid more flexible we added component slots for base `@mui/material` components that we use. Those component slots are prefixed with `Base` to differentiate them from the other grid specific components

  For more information check the documentation [documentation](https://mui.com/x/api/data-grid/data-grid/#slots).

- 🔥 Allow to pass `csvOptions` and `printOptions` to `toolbar` component prop (#3623) @flaviendelangle

  ```tsx
  const CustomDataGrid = (props: DataGridProps) => {
    return (
      <DataGrid {...props} componentsProps={{ toolbar: { csvOptions: { delimiter: ';' } } }} />
    );
  };
  ```

- 🙈 Add controlled behavior for the visible columns (#3554) @flaviendelangle

  ```tsx
  // To fully control
  <DataGrid
    columnVisibilityModel={columnVisibilityModel}
    onColumnVisilibilityModelChange={newModel => setColumnVisibilityModel(newModel)}
  />

  // To initialize without controlling
  <DataGrid
    initialState={{
      columns: {
        columnVisibilityModel
      }
    }}
  />
  ```

  See the [documentation](https://mui.com/x/react-data-grid/column-visibility/) for more details.

  The `hide` property from `GridColDef` still works but has been deprecated.

- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.3.0` / `@mui/x-data-grid-pro@v5.3.0`

#### Changes

- [DataGrid] Add component slots for a subset of used `@mui/material` components (#3490) @DanailH
- [DataGrid] Add controlled behavior for the visible columns (#3554) @flaviendelangle
- [DataGrid] Add debounce to text input (#3617) @m4theushw
- [DataGrid] Add `is any of` filter operator (#2874) @alexfauquette
- [DataGrid] Allow to pass `csvOptions` and `printOptions` to `GridToolbar` (#3623) @flaviendelangle
- [DataGrid] Disable `Hide` button if there's only one visible column (#3607) @cherniavskii
- [DataGrid] Fix line break characters breaking CSV rows (#3590) @cherniavskii
- [DataGrid] Fix potential memory leak warning (#3558) @m4theushw
- [DataGrid] Introduce a `maxWidth` property in `GridColDef` (#3550) @flaviendelangle
- [DataGrid] Make row editing work with `preProcessEditCellProps` (#3562) @flaviendelangle
- [DataGridPro] Export the column pinning selector (#3594) @flaviendelangle
- [DataGridPro] Keep row children expansion when updating the rows (#3604) @flaviendelangle
- [DataGridPro] Keep tree data grouping column width when regenerating the columns (#3603) @flaviendelangle
- [DataGridPremium] Allow to group rows based on column value (#3277) @flaviendelangle
- [l10n] Improve Finnish (fi-FI) locale (#3621) @MijMa
- [l10n] Improve Ukrainian (uk-UA) locale (#3586) @Neonin
- [l10n] Improve Czech (cs-CZ) and Slovak (sk-SK) locale (#3678) @Haaxor1689

### Docs

- [docs] Add doc example for tree data children lazy loading (#3657) @flaviendelangle
- [docs] Fix typo exchanging `false` and `true` on columns hiding section (#3561) @alexfauquette
- [docs] Improve filtering documentation page (#3437) @flaviendelangle
- [docs] Include header badges as in the other components (#3606) @oliviertassinari
- [docs] Lint markdown in the CI (#3504) @oliviertassinari
- [docs] Make inputs to extend full height of the cell (#3567) @m4theushw
- [docs] Add documentation page about the grid state (#3431) @flaviendelangle
- [docs] Replace `@mui/styles` in `x-data-grid-generator` (#3560) @m4theushw
- [docs] Update usage of prop/property naming (#3649) @cherniavskii

### Core

- [core] Log the output of the script (#3527) @oliviertassinari
- [core] Add ESLint rule to prevent direct state access (#3521) @m4theushw
- [core] Add language to markdown code block (#3651) @m4theushw
- [core] Add typing to the pre-processors methods (#3595) @flaviendelangle
- [core] Don't bump peer dependency ranges on dependency updates (#3646) @oliviertassinari
- [core] Rename more instances of Material UI to MUI (#3525) @oliviertassinari
- [core] Renovate should not try to update node (#3645) @oliviertassinari
- [core] Report performance test results on each PR (#3551) @m4theushw
- [core] Update monorepo (#3653) @m4theushw
- [core] Update `l10n` issue with a single command line (#3588) @alexfauquette
- [test] Wait for promise to resolve before expect (#3597) @m4theushw
- [test] Split cell/row editing tests (#3618) @m4theushw
- [test] Skip tests on Safari (#3679) @m4theushw

## 5.2.2

_Jan 6, 2022_

A big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add `hideable` option to `GridColDef` (#3433) @m4theushw
- ⚡ Add support for column-based `sortingOrder` with the new `sortingOrder` option in `GridColDef` (#3449) @Quppa
- ✨ Allow to initialize the `page` and `pageSize` without controlling them with the `initialState` prop (#3495) @flaviendelangle
- 🙈 Allow to precisely control which children rows to expand with the new `isGroupExpandedByDefault` prop (#3444) @flaviendelangle
- 🌍 Add Finnish (fi-FI) locale (#3485) @kurkle
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.2.2` / `@mui/x-data-grid-pro@v5.2.2`

#### Changes

- [DataGrid] Add `hideable` option to GridColDef (#3433) @alexfauquette
- [DataGrid] Add `sortingOrder` to GridColDef (#3449) @Quppa
- [DataGrid] Add the page and pageSize to the initialState prop (#3495) @flaviendelangle
- [DataGrid] Avoid re-render when pressing key inside already focused cell (#3484) @m4theushw
- [DataGrid] Close other actions menus when opening a new one (#3492) @m4theushw
- [DataGrid] Deprecate `getValue` param from the cell and row params (#3369) @flaviendelangle
- [DataGrid] Fix value parsing in date input (#3307) @alexfauquette
- [DataGrid] Fix can't enter 0 on numeric column (#3491) @m4theushw
- [DataGrid] Fix scrolling bug when an action is focused (#3483) @alexfauquette
- [DataGrid] Remove `line-height` from `GridCell` (#3446) @DanailH
- [DataGridPro] Block edition for auto-generated rows (#3547) @flaviendelangle
- [DataGridPro] Expose the field of the tree data grouping column as a constant (#3549) @flaviendelangle
- [DataGridPro] Fix resizing of right pinned columns (#3502) @m4theushw
- [DataGridPro] Add new prop `isGroupExpandedByDefault` (#3444) @flaviendelangle
- [l10n] Add Finnish (fi-FI) locale (#3485) @kurkle
- [l10n] Improve French (fr-FR) locale (#3494) @Zenoo
- [l10n] Improve Italian (it-IT) locale (#3452) @destegabry
- [l10n] Improve Vietnamese (vi-VN) locale (#3493) @hckhanh

### Docs

- [docs] Generate imports dynamically from the packages export list (#3488) @flaviendelangle
- [docs] Make demos compatible with `preProcessEditCellProps` (#3453) @m4theushw

### Core

- [test] Add test for row checkbox toggling using the Space key (#3262) @alexfauquette
- [core] Increase CI efficiency (#3441) @oliviertassinari
- [core] Refactor sorting comparator (#3390) @flaviendelangle
- [core] Update dependency on the core (#3526) @oliviertassinari
- [core] Update tweet example in release readme (#3481) @DanailH

## 5.2.1

_Dec 17, 2021_

A big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🖨️ Improve the print export to break the pages correctly (#3302) @flaviendelangle
- 🎁 Add `pinnable` option to `GridColDef` (#3425) @m4theushw
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.2.1` / `@mui/x-data-grid-pro@v5.2.1`

#### Changes

- [DataGridPro] Add `pinnable` option (#3425) @m4theushw
- [DataGridPro] Avoid filtering columns if no column is pinned (#3438) @m4theushw
- [DataGrid] Avoid page break inside a row in the Print Export (#3302) @flaviendelangle
- [DataGrid] Fix `GridEditDateCell` to handle `editRowsModel` correctly (#3267) @alexfauquette
- [DataGrid] Refactor keyboard/click event management (#3275) @alexfauquette
- [DataGrid] Fire change event when the state changes, instead of when the prop changes (#3388) @flaviendelangle
- [DataGrid] Unsubscribe event listeners registered in uncommitted renders (#3310) @m4theushw
- [DataGrid] Rework state update methods and deprecate `useGridApi` and `useGridState` (#3325) @flaviendelangle
- [l10n] Improve German (de-DE) locale (#3430) @sebastianfrey
- [l10n] Improve Hebrew (he-IL) locale (#3445) @ColdAtNight
- [l10n] Improve Dutch (nl-NL) locale (#3429) @jaapjr

### Docs

- [docs] Improve pagination documentation page (#3424) @flaviendelangle
- [docs] Include @mui/x-data-grid as dependency in the CodeSandbox (#3396) @m4theushw
- [docs] Stop using TypeDoc to generate the API documentation (#3320) @flaviendelangle
- [docs] Remove column pinning from "Upcoming features" (#3443) @alexfauquette

### Core

- [core] Add sections to some of the feature hooks (#3391) @flaviendelangle
- [core] Generate exports snapshot for both `x-data-grid` and `x-data-grid-pro` packages (#3427) @flaviendelangle
- [core] Remove 'x-data-grid' folder from DataGridPro bundle (#3394) @m4theushw
- [core] Add link to OpenCollective (#3392) @oliviertassinari

## 5.2.0

_Dec 9, 2021_

A big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

### `@mui/x-data-grid@v5.2.0` / `@mui/x-data-grid-pro@v5.2.0`

- 🚀 Introduce the [column pinning](https://mui.com/x/react-data-grid/column-pinning/) feature (#2946) @m4theushw

  <img src="https://user-images.githubusercontent.com/42154031/145425635-b6314fbe-2f1e-4b73-908f-33ee1fda20c7.gif" width="964" height="657">

- 🔥 Add ability to disable export options (#3270) @alexfauquette

  You can disable either export options by setting `disableToolbarButton` to `true`.

  ```tsx
  <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
  ```

  ```tsx
  <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
  ```

- 🙈 Add a new option to hide the amount of descendant on the grouping cells of the Tree Data (#3368) @flaviendelangle

  ```tsx
  <DataGridPro treeData rows={rows} columns={columns} groupingColDef={{ hideDescendantCount }} />
  ```

- ⚠️ Deprecate the `getValue` param for the `valueGetter` callback (#3314) @flaviendelangle

  Instead, you can access directly the row in the params

  ```diff
  -valueGetter: (params) => `${params.getValue(params.id, 'firstName') || ''} ${params.getValue(params.id, 'lastName') || ''}`
  +valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`
  ```

- 📚 Documentation improvements
- 🐞 Bugfixes

#### Changes

- [DataGridPro] Add column pinning (#2946) @m4theushw
- [DataGridPro] Add `hideDescendantCount` option to Tree Data (#3368) @flaviendelangle
- [DataGridPro] Do not expand row children with <kbd>Shift</kbd> + Space (#3380) @flaviendelangle
- [DataGridPro] Pass a list of `fields` to the callback version of `groupingColDef` (#3316) @flaviendelangle
- [DataGrid] Deprecate the `getValue` param for the `valueGetter` callback (#3314) @flaviendelangle
- [DataGrid] Add ability to disable export options (#3270) @alexfauquette
- [DataGrid] Filter value are conserved when possible (#3198) @alexfauquette
- [DataGrid] Fix `DatePicker` bug by limiting years to 4 digits (#3222) @alexfauquette
- [DataGrid] Fix column menu position when closing (#3289) @m4theushw
- [DataGrid] Fix to not crash when a sort item uses a non-existing column (#3224) @flaviendelangle
- [DataGrid] Type the `api` param in callback interfaces (#3315) @flaviendelangle

### Docs

- [docs] Always use auto-generated `apiRef` documentation (#3266) @flaviendelangle
- [docs] Avoid 301 links (#3329) @oliviertassinari
- [docs] Disable the ad when not MIT (#3334) @oliviertassinari
- [docs] Fix 404 link to Zendesk @oliviertassinari
- [docs] Fix dead link on the overview page (#3326) @flaviendelangle
- [docs] Fix double MUI in the title (#3332) @oliviertassinari
- [docs] Fix duplicate "the" (#3365) @noam-honig
- [docs] Update branch to deploy docs (#3321) @m4theushw

### Core

- [core] Add funding field (#3331) @oliviertassinari
- [core] Fix missing LICENSE file (#3330) @oliviertassinari
- [core] Fix release month in CHANGELOG (#3367) @m4theushw
- [core] Fix `yarn prettier` script (#3292) @oliviertassinari
- [core] Improve tests for Tree Data (#3366) @flaviendelangle
- [core] Never import directly from the `__modules__` folder in the `x-data-grid-generator` package (#3379) @flaviendelangle
- [core] Transition to a new Stack Overflow tag (#3308) @oliviertassinari
- [core] Update monorepo (#3370) @flaviendelangle
- [core] Use pre-processors for sorting and filtering (#3318) @flaviendelangle
- [test] Replace `useFakeTimers` (#3323) @m4theushw

## 5.1.0

_Dec 2, 2021_

A big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

### `@mui/x-data-grid@v5.1.0` / `@mui/x-data-grid-pro@v5.1.0`

- 🚀 Introduce the [tree data](https://mui.com/x/react-data-grid/group-pivot/#tree-data) feature (#2725) @flaviendelangle

  <img src="https://user-images.githubusercontent.com/42154031/144259216-fc4f90ac-4d8b-4253-bc95-009204349a4c.gif" width="854" height="453" />

- 💅 Add support for `sx` prop in the DataGrid and DataGridPro (#3281) @m4theushw
- 🔦 Improve focus management in the filter panel (#3004) @alexfauquette
- 🎁 Add strict typing to the event publisher and listener (#3022) (@flaviendelangle)

  The `apiRef.current.subscribeEvent`, `apiRef.current.publishEvent` and `useGridApiEventHandler` are now fully typed and gives you the correct arguments based on the event you are listening to or emitting.

  ```ts
  const handleRowClick: GridEventListener<'rowClick'> = (
    params, // has type `GridRowParams`
    event, // has type `MuiEvent<React.MouseEvent<HTMLElement>>
    details, // has type `GridCallbackDetails
  ) => {
    /* ... */
  };

  // with string event name
  apiRef.current.subscribeEvent('rowClick', handleRowClick);
  useGridApiEventHandler(apiRef, 'rowClick', handleRowClick);

  // or with enum event name
  apiRef.current.subscribeEvent(GridEvents.rowClick, handleRowClick);
  useGridApiEventHandler(apiRef, GridEvents.rowClick, handleRowClick);
  ```

- 🌎 Translation updates for many locales

  If you are using DataGrid or DataGridPro in another language, check [this issue](https://github.com/mui/mui-x/issues/3211) to discover which translations are missing.

- 📚 Documentation improvements
- 🐞 Bugfixes

#### Changes

- [DataGridPro] Add tree data (#2725) @flaviendelangle
- [DataGridPro] Remove the callback version of the `groupigColDef` prop (#3317) @flaviendelangle
- [DataGridPro] Improve license file (#3278) @oliviertassinari
- [DataGridPro] Add types for event publishers and listeners (#3022) @flaviendelangle
- [DataGrid] Add support for `sx` prop (#3281) @m4theushw
- [DataGrid] Do not debounce the initial resizing of the grid (#3213) @flaviendelangle
- [DataGrid] Fix usage of dynamic columns (#3204) @flaviendelangle
- [DataGrid] Move focus when selecting option with <kbd>Enter</kbd> in the `singleSelect` (#3220) @m4theushw
- [DataGrid] Focus on the last value input when a filter is added or removed (#3004) @alexfauquette
- [DataGrid] Prepare the tree structure for grouping sorting / filtering (#3301) @flaviendelangle
- [DataGrid] Rework keyboard navigation (#3193) @flaviendelangle
- [DataGrid] Set minimum dimensions to `GridOverlay` when no row is provided (#3261) @flaviendelangle
- [DataGrid] Improve German (de-DE) locale (#3271, #3230, #3293) @sebastianfrey
- [DataGrid] Improve Hebrew (he-IL) locale (#3294) @ColdAtNight
- [DataGrid] Improve Russian (ru-RU) locale (#3290, #3288) @Alim-El
- [DataGrid] Improve Korean (ko-KR) locale (#3232, #3273) @zzossig
- [DataGrid] Improve Greek (el-GR) locale (#3169) @clytras

### Core

- [core] Add script to sync translation files (#3201) @m4theushw
- [core] Create dedicated `InputComponent` for `singleSelect` and `date` columns #3227 @alexfauquette
- [core] Fix `EventManager` to not run listeners removed after registration #3206 @flaviendelangle
- [core] Group Renovate updates (#3263) @flaviendelangle
- [core] Reflect the change of default branch (#3235) @oliviertassinari
- [core] Replace @mui/core with @mui/base (#3217) @m4theushw
- [core] Split docs generation script (#3189) @flaviendelangle
- [core] Update monorepo (#3303) @m4theushw
- [test] Improve testing of the keyboard navigation (#3187) @flaviendelangle
- [test] Force effect to run on location change (#3283) @m4theushw
- [core] Rework columns state management (#3264) @flaviendelangle

### Docs

- [docs] Improve demo to allow to experiment with `autoHeight` (#3216) @alexfauquette
- [docs] Fix broken images (#3300) @oliviertassinari
- [docs] Fix the wrong release date (#3269) @DanailH
- [docs] Fix typo in CHANGELOG.md (#3214) @gjoseph
- [docs] Improve plan icon placement (#3298) @oliviertassinari
- [docs] Improve rows documentation (#3209) @flaviendelangle
- [docs] Include row pinning (#3191) @oliviertassinari
- [docs] Fix presentation of key combinations (#3297) @oliviertassinari
- [docs] Replace @mui/styles on demos (#3274) @m4theushw
- [docs] Add demos using cell/row editing with server-side persistence (#3124) @flaviendelangle
- [docs] Use relative links (#3299) @oliviertassinari

## 5.0.1

_Nov 23, 2021_

A big thanks to the 3 contributors who made this release possible. Here are some highlights ✨:

- 🎁 New API to validate the editing values (#3006) @m4theushw

  You can now use the `preProcessEditCellProps` key in `GridColDef` to synchronously or asynchronously validate the values committed.

  ```ts
  const columns: GridColDef[] = [
    {
      field: 'firstName',
      preProcessEditCellProps: (params: GridEditCellPropsChangeParams) => {
        const hasError = params.props.value.length < 3;
        return { ...params.props, error: hasError };
      },
    },
    {
      field: 'email',
      preProcessEditCellProps: async (params: GridEditCellPropsChangeParams) => {
        const userWithEmail = await fetchUserByEmail(params.value);
        const hasError = !!userWithEmail;
        return { ...params.props, error: hasError };
      },
    },
  ];
  ```

- ✨ New method `getRootDimensions` to access the size of the grid (#3007) @flaviendelangle

  It contains the size of the viewport (which is the scrollable container containing the rows and columns) considering scrollbars or not.

  ```ts
  const dimensions = apiRef.current.getRootDimensions();
  ```

### `@mui/x-data-grid@v5.0.1` / `@mui/x-data-grid-pro@v5.0.1`

- [DataGrid] New API to validate the editing values (#3006) @m4theushw
- [DataGrid] Use color-scheme to set dark mode on native components (#3146) @alexfauquette
- [DataGrid] Fix the `@mui/x-data-grid` type entrypoint (#3196) @flaviendelangle

### Docs

- [docs] Move sentence about disabling multi rows selection (#3167) @alexfauquette

### Core

- [core] Drop `useGridContainerProps` (#3007) @flaviendelangle
- [core] Move `getRowIdFromRowIndex` and `getRowIndex` to the sorting API (#3126) @flaviendelangle
- [core] Polish v5 CHANGELOG (#3194) @oliviertassinari
- [core] Remove the `index.ts` of the export hooks (#3165) @flaviendelangle
- [core] Set the correct release date for v5.0.0 in the CHANGELOG.md (#3192) @flaviendelangle

## 5.0.0

_Nov 23, 2021_

🎉 We are excited to introduce [MUI X v5.0.0](https://mui.com/blog/mui-x-v5/) 🎉!

If you want to migrate the DataGrid or DataGridPro from v4 to v5, take a look at the [migration guide](https://mui.com/x/migration/migration-data-grid-v4/).
This version is fully compatible with `@mui/material@5.X` and can be used with `@material-ui/core@4.x` with some [additional steps](https://mui.com/x/migration/migration-data-grid-v4/#using-mui-x-v5-with-mui-core-v4).

A big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- ⌨️ Enhance keyboard navigation when pagination is enabled
- 👁 Better support for flex columns
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.0.0` / `@mui/x-data-grid-pro@v5.0.0`

#### Breaking changes

- [DataGrid] The following CSS classes were renamed to follow the internal convention:

  - `MuiDataGrid-columnsContainer` was renamed to `MuiDataGrid-columnHeaders`
  - `MuiDataGrid-columnHeaderWrapper` was renamed to `MuiDataGrid-columnHeadersInner`
  - The `scroll` class applied to `MuiDataGrid-columnHeaderWrapper` was renamed to `MuiDataGrid-columnHeadersInner--scrollable`

- [DataGrid] The `props.components.Checkbox` and `props.componentsProps.checkbox` props were renamed to `props.components.BaseCheckbox` and `props.componentsProps.baseCheckbox` respectively.

  As a first step for [#3066](https://github.com/mui/mui-x/issues/3066), these slots were renamed to clearly indicate that they are meant to replace a core component.

  ```diff
   <DataGrid
     components={{
  -    checkbox: MyCustomCheckbox,
  +    BaseCheckbox: MyCustomCheckbox,
     }}
     componentsProps={{
  -    checkbox: {},
  +    baseCheckbox: {},
     }}
   />
  ```

  **Note**: these changes apply to both the `DataGrid` and `DataGridPro` components.

#### Changes

- [DataGrid] Block multi-rows updates in `apiRef.current.updateRows` on the Community plan (#3095) @flaviendelangle
- [DataGrid] Fix filter not working after deleting the value (#3018) @m4theushw
- [DataGrid] Fix performance regression when selecting 100k rows (#3077) @m4theushw
- [DataGrid] Fix `apiRef.current.updateRows` to not share rows from other instances (#3127) @m4theushw
- [DataGrid] Fix flex space allocation to not cause a horizontal scroll when there is enough space (#3099) @flaviendelangle
- [DataGrid] Improve the filter panel behaviors (#3080) @flaviendelangle
- [DataGrid] Fix keyboard navigation between column headers and rows when not on the first page (#3086) @flaviendelangle
- [DataGrid] Fix keyboard navigation between rows when not on the first page (#3074) @flaviendelangle
- [DataGrid] Prevents bubbling in menu header (#3000) @alexfauquette
- [DataGrid] Remove unused rendering state and selectors (#3133) @flaviendelangle
- [DataGrid] Rename `Checkbox` component and props slots to `BaseCheckbox` (#3142) @DanailH

### Core

- [core] Adapt changelog script to GitHub DOM modification (#3087) @alexfauquette
- [core] Automatically close issues that are incomplete and inactive (#3029) @oliviertassinari
- [core] Improve the typing of `LicenseStatus` (#3141) @Himself65
- [core] Make `useGridColumnsPreProcessing` generic (#3092) @m4theushw
- [core] Move column headers virtualization to hook (#3078) @m4theushw
- [core] Move virtualization logic to hook (#3079) @m4theushw
- [core] Rename directories to match new packages new names (#3088) @flaviendelangle
- [core] Replace `createClientRender` with new `createRenderer` API (#3125) @flaviendelangle
- [core] Store the event manager in a key of `GridApi` instead of making the whole `GridApi` extend it (#3069) @flaviendelangle
- [core] Update monorepo (#3139) @m4theushw
- [core] Use `unstable_` prefix instead of `unsafe_` for private APIs (#3090) @flaviendelangle
- [core] Use official MUI repo as monorepo (#3084) @m4theushw

### Docs

- [docs] Fix broken example in the component slot example (#3123) @Himself65
- [docs] Fix inline previews (#3081) @DanailH
- [docs] Fix the client-side validation link clarity (#3100) @oliviertassinari
- [docs] Improve `rowCount` CSS class description (#3072) @ZeeshanTamboli
- [docs] Use core repo constants for doc internationalization (#3143) @flaviendelangle

## 5.0.0-beta.7

_Nov 4, 2021_

- 💅 Reduce styles specificity to make simpler to override (#3012) @DanailH
- 🌍 Add Hebrew (he-IL) locale (#3028) @ColdAtNight
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.0.0-beta.7` / `@mui/x-data-grid-pro@v5.0.0-beta.7`

#### Breaking changes

- [core] Prefix selectors from `useGridContainerProps` with `unsafe` (#3002) @flaviendelangle

  The dimension API is being temporarily made private to allow to clean it in future minor releases. The current approach causes useless re-renders.
  If you relay on any of these selectors, open an issue explaining the use case so that will be taken into account when refactoring them.

  The following selectors were prefixed by `unstable_`. Use the provided alternatives.

  1. `gridContainerSizesSelector` was renamed to `unstable_gridContainerSizesSelector`
  2. `gridViewportSizesSelector` was renamed to `unstable_gridViewportSizesSelector`
  3. `gridScrollBarSizeSelector` was renamed to `unstable_gridScrollBarSizeSelector`

  The following selectors were removed. You can hard-code their logic in your application if you really need them.

  1. `gridDataContainerSizesSelector`

  ```ts
  const dataContainerSizes = gridContainerSizesSelector(state)?.dataContainerSizes ?? null;
  ```

  2. `gridDataContainerHeightSelector`

  ```ts
  const dataContainerHeight = gridContainerSizesSelector(state)?.dataContainerSizes.height ?? null;
  ```

  The selector `gridViewportSizeStateSelector` was a duplicate and has been removed, you can use the selector `unstable_gridViewportSizesSelector` instead.

#### Changes

- [DataGrid] Add Hebrew (he-IL) locale (#3028) @ColdAtNight
- [DataGrid] Move virtualization logic to hook (#3079) @m4theushw
- [DataGrid] Revert year change in the MIT license (#3059) @oliviertassinari
- [DataGrid] Fix filtering of nullish numeric cells (#3070) @flaviendelangle
- [DataGrid] Improve performance when selecting 100k rows (#3077) @m4theushw
- [DataGrid] Fix `GridEditDateCell` to handle timezone correctly (#2918) @flaviendelangle
- [DataGrid] Fix keyboard navigation on page > 0 (#3074) @flaviendelangle
- [DataGrid] Prevents bubbling in menu header (#3000) @alexfauquette
- [DataGrid] Fix wrong params provided to `cellModeChange` when `setCellMode` is called (#3025) @flaviendelangle

### Core

- [core] Adapt `useDemoData` for Tree Data (#2978) @flaviendelangle
- [core] Group update of MUI Core (#3055) @oliviertassinari
- [core] Ignore `*.tsbuildinfo` files (#3068) @m4theushw
- [core] Implement tree-based row management (#2996) @flaviendelangle
- [core] Invert Codesandbox examples on README (#3073) @flaviendelangle
- [core] Prefix selectors from `useGridContainerProps` with `unsafe` (#3002) @flaviendelangle
- [core] Reduce `setGridState` and `applyFilters` call when updating `filterModel` (#3023) @flaviendelangle
- [core] Reduce styles complexity (#3012) @DanailH
- [core] Upgrade monorepo (#3067) @m4theushw
- [core] Use official MUI repo as monorepo (#3084) @m4theushw
- [test] Retry each expect until success (#3027) @m4theushw
- [core] Adapt changelog script to new GitHub DOM (#3087) @alexfauquette

### Docs

- [docs] Explain how to use `valueGetter` to transform type (#3003) @alexfauquette
- [docs] Fix the outdated demo of the docs (#3058) @oliviertassinari
- [docs] Fix inline previews #3081) @DanailH

## 5.0.0-beta.6

_Oct 29, 2021_

A big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- ✨ Allow `valueOptions` from `GridColDef` to accept a function (#2850) @alexfauquette
- 💅 Prefix undocumented `apiRef` methods with `unsafe_` (#2985) @flaviendelangle
- 👁 Unify filtering, sorting, and rows selectors names (#2942) @flaviendelangle
- 💡 Support style overrides added in the theme (#2995) @DanailH
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.0.0-beta.6` / `@mui/x-data-grid-pro@v5.0.0-beta.6`

#### Breaking changes

- [DataGridPro] The following methods from `apiRef` were renamed. Use the provided alternatives. (#2870) @flaviendelangle

  1. `apiRef.current.applyFilters` was renamed to `apiRef.current.unsafe_applyFilters`
  2. `apiRef.current.applyFilterLinkOperator` was renamed to `apiRef.current.setFilterLinkOperator`
  3. `apiRef.current.upsertFilter` was renamed to `apiRef.current.upsertFilterItem`
  4. `apiRef.current.deleteFilter` was renamed to `apiRef.current.deleteFilterItem`

- [DataGridPro] The `apiRef.current.applyFilter` method was removed. (#2870) @flaviendelangle
  You should never have to call it directly since the filters are already applied when the `filterModel` prop changes.
  To manually apply the filters, use `apiRef.current.unsafe_applyFilters`.

  ```diff
  -apiRef.current.applyFilter
  +apiRef.current.unsafe_applyFilters
  ```

- [DataGridPro] Rename filtering, sorting, and rows selectors to match the naming convention (#2942) @flaviendelangle

  1. `unorderedGridRowIdsSelector` was renamed to `gridRowIdsSelector`
  2. `sortingGridStateSelector` was renamed to `gridSortingStateSelector`
  3. `sortedGridRowIdsSelector` was renamed to `gridSortedRowIdsSelector`
  4. `visibleSortedGridRowIdsSelector` was renamed to `gridVisibleSortedRowIdsSelector`
  5. `visibleGridRowCountSelector` was renamed to `gridVisibleRowCountSelector`
  6. `filterGridColumnLookupSelector` was renamed to `gridFilterActiveItemsSelector`

- [DataGridPro] The `sortedGridRowsSelector` was renamed to `gridSortedRowEntriesSelector` (#2942) @flaviendelangle

  The return value was also changed as below:

  ```diff
  -sortedGridRowsSelector: (state: GridState) => Map<GridRowId, GridRowModel>
  -const map = sortedGridRowsSelector(state);
  +gridSortedRowEntriesSelector: (state: GridState) => GridRowEntry[]
  +const map = new Map(gridSortedRowEntriesSelector(state).map(row => [row.id, row.model]));
  ```

- [DataGridPro] The `visibleSortedGridRowsSelector` was replaced with `gridVisibleSortedRowEntriesSelector` (#2942) @flaviendelangle

  The return value was also changed as below:

  ```diff
  -visibleSortedGridRowsSelector: (state: GridState) => Map<GridRowId, GridRowModel>;
  -const map = visibleSortedGridRowsSelector(state);
  +gridVisibleSortedRowEntriesSelector: (state: GridState) => GridRowEntry[]
  +const map = new Map(gridVisibleSortedRowEntriesSelector(state).map(row => [row.id, row.model]));
  ```

- [DataGridPro] The `visibleSortedGridRowsAsArraySelector` was replaced with `gridVisibleSortedRowEntriesSelector` (#2942) @flaviendelangle

  The return value was also changed as below:

  ```diff
  -visibleSortedGridRowsAsArraySelector: (state: GridState) => [GridRowId, GridRowData][];
  +gridVisibleSortedRowEntriesSelector: (state: GridState) => GridRowEntry[];
  ```

- [DataGridPro] The `filterGridItemsCounterSelector` selector was removed. (#2942) @flaviendelangle
  Use `gridFilterActiveItemsSelector` as replacement.

  ```diff
  -const filterCount = filterGridItemsCounterSelector(state);
  +const filterCount = gridFilterActiveItemsSelector(state).length;
  ```

- [DataGridPro] The `unorderedGridRowModelsSelector` selector was removed. (#2942) @flaviendelangle
  Use `apiRef.current.getRowModels` or `gridRowIdsSelector` and `gridRowsLookupSelector`.

#### Changes

- [DataGrid] Allow `valueOptions` to accept a function (#2850) @alexfauquette
- [DataGrid] Add `overridesResolver` (#2995) @DanailH
- [DataGrid] Unify filtering, sorting, and rows selectors names (#2942) @flaviendelangle
- [DataGridPro] Prefix undocumented `apiRef` methods with `unsafe_` (#2985) @flaviendelangle

### Docs

- [docs] Explain how to use MUI X v5 with MUI Core v4 (#2846) @m4theushw
- [docs] Generate docs for components (#2465) @m4theushw
- [docs] Improve `scrollEndThreshold` API docs (#3001) @ZeeshanTamboli
- [docs] Fix CodeSandbox and feature request templates (#2986) @flaviendelangle

### Core

- [core] Add step for announcing the releases on Twitter (#2997) @DanailH
- [core] Apply all filters to a row before moving to the next one (#2870) @flaviendelangle
- [core] Change monorepo repository URL (#2983) @m4theushw
- [core] Clean Storybook examples (#2805) @flaviendelangle
- [core] Generate list of all grid exports (#2801) @flaviendelangle
- [core] Improve typing of `buildApi.ts` (#2922) @flaviendelangle
- [core] Add additional test for `checkboxSelection` toggling (#2979) @flaviendelangle
- [test] Fix flaky visual regression test (#2981) @m4theushw

## 5.0.0-beta.5

_Oct 22, 2021_

A big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 💅 Remove dependency on `@mui/styles` and use the same styling solution from MUI Core (#2784) @DanailH
- ✨ Add support for generics in `GridRowParams`, `GridCellParams` and `GridRenderCellParams` (#2436) @ZeeshanTamboli
- 👁 Rework the virtualization engine (#2673) @m4theushw
- 💡 Enhance internal code structure
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.0.0-beta.5` / `@mui/x-data-grid-pro@v5.0.0-beta.5`

#### Breaking changes

- The `DataGrid` and `DataGridPro` no longer depends on `@mui/styles`. Use `styled` to provide custom styling. (#2784) @DanailH

  ```diff
  -import { createTheme } from '@mui/material/styles';
  -import { makeStyles } from '@mui/styles';
  +import { styled } from '@mui/material/styles';
  ```

  The following CSS classes were renamed:

  - `.MuiDataGrid-gridMenuList` was renamed to `.MuiDataGrid-menuList`
  - `.MuiGridToolbarContainer-root` was renamed to `.MuiDataGrid-toolbarContainer`
  - `.MuiGridMenu-root` was renamed to `.MuiDataGrid-menu`
  - `.MuiDataGridColumnsPanel-root` was renamed to `.MuiDataGrid-columnsPanel`
  - `.MuiGridPanel-root` was renamed to `.MuiDataGrid-panel`
  - `.MuiGridPanelContent-root` was renamed to `.MuiDataGrid-panelContent`
  - `.MuiGridPanelFooter-root` was renamed to `.MuiDataGrid-panelFooter`
  - `.MuiDataGridPanelHeader-root` was renamed to `.MuiDataGrid-panelHeader`
  - `.MuiGridPanelWrapper-root` was renamed to `.MuiDataGrid-panelWrapper`
  - `.MuiGridFilterForm-root` was renamed to `.MuiDataGrid-filterForm`
  - `.MuiGridToolbarFilterButton-root` was renamed to `.MuiDataGrid-toolbarFilterList`

- [DataGrid] The CSS classes `.MuiDataGrid-window` and `.MuiDataGrid-windowContainer` were removed (#2673) @m4theushw

  The following CSS classes were renamed:

  - `.MuiDataGrid-viewport` was renamed to `.MuiDataGrid-virtualScroller`
  - `.MuiDataGrid-dataContainer` was renamed to `.MuiDataGrid-virtualScrollerContent`
  - `.MuiDataGrid-renderingZone` was renamed to `.MuiDataGrid-virtualScrollerRenderZone`

- [DataGrid] Remove the `useGridSlotComponentProps` hook and replace it as below: (#2856) @flaviendelangle

  ```diff
  -const { apiRef, state, rootElement } = useGridSlotComponentProps();
  +const apiRef = useGridApiContext();
  +const [state] = useGridState(apiRef);
  +const rootElement = apiRef.current.rootElementRef;
  ```

- [DataGrid] Remove the `state` prop and use the `initialState` prop (#2848) @flaviendelangle

  Note that `initialState` only allows the `preferencePanel`, `filter.filterModel` and `sort.sortModel` keys.
  To fully control the state, use the feature's model prop and change callback (e.g. `filterModel` and `onFilterModelChange`).

  ```diff
   <DataGrid
  -  state={{
  +  initialState={{
       preferencePanel: {
         open: true,
         openedPanelValue: GridPreferencePanelsValue.filters,
       },
     }}
   />
  ```

- [DataGridPro] Remove the `onViewportRowsChange` prop and the `viewportRowsChange` event (#2673) @m4theushw

  A listener on the `rowsScroll` event, as shown below, can be used to replace the prop:

  ```tsx
  const apiRef = useGridApiRef();
  const prevRenderContext = React.useRef(null);

  React.useEffect(() => {
    return apiRef.current.subscribeEvent('rowsScroll', ({ renderContext }) => {
      if (
        !prevRenderContext.current ||
        renderContext.firstRowIdx !== prevRenderContext.current.firstRowIndex ||
        renderContext.lastRowIdx !== prevRenderContext.current.lastRowIndex
      ) {
        prevRenderContext.current = renderContext;
        const params = {
          firstRowIndex: renderContext.firstRowIndex,
          lastRowIndex: renderContext.lastRowIndex,
        };
      }
    });
  }, [apiRef]);

  <DataGridPro apiRef={apiRef} />;
  ```

#### Changes

- [DataGrid] Add `valueSetter` (#2876) @m4theushw
- [DataGrid] Add support for generic types in `GridRowParams`, `GridCellParams`, `GridRenderCellParams` (#2436) @ZeeshanTamboli
- [DataGrid] Fix `actions` column type to not select the row when clicking on an item (#2862) @m4theushw
- [DataGrid] Fix column headers misalignment when the render context changes (#2937) @m4theushw
- [DataGrid] Rework virtualization (#2673) @m4theushw
- [DataGrid] Remove `@mui/styles` dependency (#2784) @DanailH
- [DataGrid] Remove `useGridSlotComponentProps` (#2856) @flaviendelangle
- [DataGrid] Replace `prop.state` with `prop.initialState` (#2848) @flaviendelangle
- [DataGrid] Use true content height to dispatch `rowsScrollEnd` (#2938) @m4theushw
- [DataGrid] Fix the typing of `GridToolbarFilterButton` (#2841) @alexfauquette

### Docs

- [docs] Improve the README for releases (#2908) @flaviendelangle
- [docs] Re-add Pro icon (#2928) @m4theushw
- [docs] Fix to not commit changes when clicking outside the cell (#2906) @ZeeshanTamboli
- [docs] Update link to Quick Filter issue (#2909) @m4theushw

### Core

- [core] Small fixes on the Components page (#2877) @flaviendelangle
- [core] Make each feature hook responsible for its column pre-processing (#2839) @flaviendelangle
- [core] Add `useGridRowGroupsPreProcessing` internal hook (#2840) @flaviendelangle
- [core] Register events async if not registered (#2916) @m4theushw
- [core] Remove `material-ui-utils.ts` (#2872) @DanailH
- [core] Remove outdated hooks requirements (#2939) @flaviendelangle
- [core] Remove test event (#2912) @m4theushw
- [core] Remove unused `GridSlotComponentProps` interface (#2911) @flaviendelangle
- [core] Rename 'UNSTABLE*' prefix to 'unstable*' (#2931) @flaviendelangle
- [core] Replace usage of `GridRowData` with `GridRowModel` (#2936) @flaviendelangle
- [core] Revert hardcoded typings (#2907) @DanailH
- [core] Simplify the CSV export (#2941) @flaviendelangle
- [core] Update monorepo version (#2927) @m4theushw
- [test] Take screenshot of the print export (#2881) @m4theushw

## 5.0.0-beta.4

_Oct 14, 2021_

A big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add the ability to print the grid (#2519) @DanailH

  This new feature adds a button to the toolbar to generate a printer-friendly layout. Check the [documentation](https://mui.com/x/react-data-grid/export/#print) about it.

- 💡 Enhance internal code structure
- ✨ New slots for `row` and `cell` (#2753) @m4theushw
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.0.0-beta.4` / `@mui/x-data-grid-pro@v5.0.0-beta.4`

#### Breaking changes

- [DataGrid] Remove unused event listeners and redundant DOM attributes on `GridCell` and `GridRow` (#2810) @m4theushw

  The following props were removed. If you depend on them, use `componentsProps.row` and `componentsProps.cell` to pass custom props to the row or cell.

  - `onCellBlur`
  - `onCellOver`
  - `onCellOut`
  - `onCellEnter`
  - `onCellLeave`
  - `onRowOver`
  - `onRowOut`
  - `onRowEnter`
  - `onRowLeave`

  For more information, check [this page](https://mui.com/x/react-data-grid/components/#row). Example:

  ```diff
   <DataGrid
  -  onRowOver={handleRowOver}
  +  componentsProps={{
  +    row: { onMouseOver: handleRowOver },
  +  }}
   />;
  ```

  The `data-rowindex` and `data-rowselected` attributes were removed from the cell element. Equivalent attributes can be found in the row element.

  The `data-editable` attribute was removed from the cell element. Use the `.MuiDataGrid-cell--editable` CSS class.

  The `data-mode` attribute was removed from the cell element. Use the `.MuiDataGrid-cell--editing` CSS class.

- [DataGrid] The `state.filter` and `state.visibleRows` were merged into a single `state.filter` sub-state (#2782) @flaviendelangle

  To still access this information, use `state.filter` or the selectors as below:

  ```diff
  -const filterModel = state.filter
  -const filterModel = gridFilterStateSelector(state)
  +const filterModel = state.filter.filterModel
  +const filterModel = gridFilterModelSelector(state) // preferred method

  -const visibleRowsLookup = state.visibleRows.visibleRowsLookup
  -const visibleRowsLookup = visibleGridRowsStateSelector(state).visibleRowsLookup
  +const visibleRowsLookup = state.filter.visibleRowsLookup
  +const visibleRowsLookup = gridVisibleRowsLookupSelector(state).visibleRowsLookup // preferred method

  -const visibleRows = state.visibleRows.visibleRows
  +const visibleRows = state.filter.visibleRows
  +const visibleRows = gridVisibleRowsLookupSelector(state).visibleRows // preferred method
  ```

- [DataGrid] The CSS classes constants are not exported anymore. Use `gridClasses` instead. (#2788) @flaviendelangle

  ```diff
  -const columnHeaderClass = GRID_COLUMN_HEADER_CSS_CLASS;
  +const columnHeaderClass = gridClasses.columnHeader;

  -const rowClass = GRID_ROW_CSS_CLASS;
  +const rowClass = gridClasses.row;

  -const cellClass = GRID_CELL_CSS_CLASS;
  +const cellClass = gridClasses.cell;

  -const columnSeparatorClass = GRID_COLUMN_HEADER_SEPARATOR_RESIZABLE_CSS_CLASS;
  +const columnSeparatorClass = gridClasses['columnSeparator--resizable'];

  -const columnHeaderTitleClass = GRID_COLUMN_HEADER_TITLE_CSS_CLASS;
  +const columnHeaderTitleClass = gridClasses.columnHeaderTitle;

  -const columnHeaderDropZoneClass = GRID_COLUMN_HEADER_DROP_ZONE_CSS_CLASS;
  +const columnHeaderDropZoneClass = gridClasses.columnHeaderDropZone;

  -const columnHeaderDraggingClass = GRID_COLUMN_HEADER_DRAGGING_CSS_CLASS;
  +const columnHeaderDraggingClass = gridClasses['columnHeader--dragging'];
  ```

- [DataGrid] Rename `gridCheckboxSelectionColDef` to `GRID_CHECKBOX_SELECTION_COL_DEF` (#2793) @flaviendelangle

  ```diff
  -gridCheckboxSelectionColDef
  +GRID_CHECKBOX_SELECTION_COL_DEF
  ```

- [DataGrid] The constants referring to the column types were removed (#2791) @flaviendelangle
  Replace them as below:

  ```diff
  -const isColumnString = column.type === GRID_STRING_COLUMN_TYPE;
  +const isColumnString = col.type === 'string';

  -const isColumnNumber = col.type === GRID_NUMBER_COLUMN_TYPE;
  +const isColumnNumber = col.type === 'number';

  -const isColumnDate = col.type === GRID_DATE_COLUMN_TYPE;
  +const isColumnDate = col.type === 'date';

  -const isColumnDateTime = col.type === GRID_DATETIME_COLUMN_TYPE;
  +const isColumnDateTime = col.type === 'dateTime';

  -const isColumnBoolean = col.type === GRID_BOOLEAN_COLUMN_TYPE;
  +const isColumnBoolean = col.type === 'boolean';
  ```

- [DataGrid] The state initializers were removed (#2782) @flaviendelangle

  Use `getDefaultGridFilterModel` instead of `getInitialGridFilterState`:

  ```diff
  -const [filterModel, setFilterModel] = React.useState(getInitialGridFilterState);
  +const [filterModel, setFilterModel] = React.useState(getDefaultGridFilterModel);
  ```

  For the other methods, you can hardcode the value you want to apply:

  ```diff
  -const [sortModel, setSortModel] = React.useState(() => getInitialGridSortingState().sortModel);
  +const [sortModel, setSortModel] React.useState([]);

  -getInitialGridColumnReorderState
  -getInitialGridColumnResizeState
  -getInitialGridColumnsState
  -getInitialGridRenderingState
  -getInitialGridRowState
  -getInitialGridState
  -getInitialVisibleGridRowsState
  -getInitialGridState
  ```

#### Changes

- [DataGrid] Add `row` and `cell` component slots (#2753) @m4theushw
- [DataGrid] Rename `gridCheckboxSelectionColDef` to `GRID_CHECKBOX_SELECTION_COL_DEF` (#2793) @flaviendelangle
- [DataGrid] Clean hook folder structure and stop exporting internal hooks (#2789) @flaviendelangle
- [DataGrid] Add support for Print export (#2519) @DanailH
- [DataGrid] Remove internal localization and column type constant exports (#2791) @flaviendelangle
- [DataGrid] Remove `GridRowCells` component (#2811) @m4theushw
- [DataGrid] Remove class constants exports (#2788) @flaviendelangle
- [DataGrid] Remove unused event listeners on `GridCell` and `GridRow` (#2810) @m4theushw
- [DataGrid] Fix the header selection checkbox to work with `prop.checkboxSelectionVisibleOnly` (#2781) @flaviendelangle

### Docs

- [docs] Add link to installation page (#2778) @MostafaKMilly
- [docs] Add redirect from docs home page to `DataGrid` home page (#2737) @flaviendelangle
- [docs] Fix JSX closing tag in `getActions` example (#2847) @dstarner
- [docs] Fix pagination in Ant Design demo (#2787) @ZeeshanTamboli
- [docs] Update the `page` prop docs (#2812) @m4theushw

### Core

- [core] Update hooks to initialize their state synchronously (#2782) @flaviendelangle
- [core] Fix rollup external warnings (#2736) @eps1lon

## 5.0.0-beta.3

_Oct 7, 2021_

A big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🌎 Add Persian (fa-IR) locale (#2712) @devlifeX
- 🎁 Allow to select range of rows with Shift + click (#2456) @flaviendelangle
- 🚀 Allow to throttle the row updates with the `throttleRowsMs` prop on `DataGridPro` and remove the default 100ms row update delay (#2561) @flaviendelangle
- 💡 Enhance internal code structure
- 📚 Documentation improvements
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.0.0-beta.3` / `@mui/x-data-grid-pro@v5.0.0-beta.3`

#### Breaking changes

- [DataGrid] Rename some selectors and interfaces to follow the codebase naming conventions (#2723) @flaviendelangle

  The following selectors were renamed:

  ```diff
  -const filterModel = filterGridStateSelector(state);
  +const filterModel = gridFilterModelSelector(state);
  ```

  ```diff
  -const density: GridGridDensity = densitySelector(state);
  +const density: GridDensityState = gridDensitySelector(state);
  ```

  ```diff
  -const rendering: InternalRenderingState = gridRenderingSelector(state);
  +const rendering: GridRenderingState = gridRenderingSelector(state);
  ```

#### Changes

- [DataGrid] Add Persian (fa-IR) locale (#2712) @devlifeX
- [DataGrid] Allow to select range of rows using Shift + click (#2456) @flaviendelangle
- [DataGrid] Fix numeric column filter to not run when value is empty (#2780) @m4theushw
- [DataGrid] Export `singleSelect` operators (#2666) @jeremyalan
- [DataGrid] Fix Italian localization (#2717) @destegabry
- [DataGrid] Fix `undefined` in filter panel (#2715) @DanailH
- [DataGrid] Fix the fade-out transition of the `GridMenu` (#2734) @flaviendelangle
- [DataGrid] Pass row `id` to `valueFormatter` (#2738) @m4theushw
- [DataGrid] Fix `onSortModelChange` to not be called during initialization (#2724) @flaviendelangle
- [DataGridPro] Stop drag event propagation (#2802) @DanailH
- [DataGridPro] Fix keyboard navigation to work with filtered rows (#2800) @flaviendelangle

### Docs

- [docs] Add missing fonts (#2745) @m4theushw
- [docs] Add page for scrolling API (#2634) @m4theushw
- [docs] Add type to `onChange` event argument (#2669) @jayariglesias
- [docs] Add explanation about the `id` usage in multiple filters in DataGridPro (#2783) @ZeeshanTamboli
- [docs] Fix demo throwing error (#2719) @m4theushw
- [docs] Fix index and improve playground page (#2755) @oliviertassinari

### Core

- [core] Add benchmark script (#2683) @m4theushw
- [core] Clean error messages prefix (#2676) @flaviendelangle
- [core] Do not regenerate columns of `useDemoData` on each render (#2747) @flaviendelangle
- [core] Don't run benchmark on cached files (#2786) @m4theushw
- [core] Drop localization v4 format (#2792) @flaviendelangle
- [core] Remove useless state update in `useGridColumnMenu` (#2722) @flaviendelangle
- [core] Remove v4 conditional code (#2575) @flaviendelangle
- [core] Rework `useGridRows` high frequency update (#2561) @flaviendelangle
- [core] Set up `eps1lon/actions-label-merge-conflict` action (#2751) @m4theushw
- [core] Stop using selectors for Pro features on React components (#2716) @flaviendelangle

## 5.0.0-beta.2

_Sep 24, 2021_

A big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🇻🇳 Add Vietnamese (vi-VN) locale (#2668) @tuananh281098
- 🇵🇱 Improve Polish (pl-PL) locale (#2632) @michallukowski
- ⚡️ Apply the `valueFormatter` to the `singleSelect` column type (#2581) @DanailH

### `@mui/x-data-grid@v5.0.0-beta.2` / `@mui/x-data-grid-pro@v5.0.0-beta.2`

#### Breaking changes

- [DataGrid] The params passed to the `valueFormatter` were changed. (#2581) @DanailH

  Use the `api` to get the missing params.
  The `GridValueFormatterParams` interface has the following signature now:

  ```diff
  -export type GridValueFormatterParams = Omit<GridRenderCellParams, 'formattedValue' | 'isEditable'>;
  +export interface GridValueFormatterParams {
  +  /**
  +   * The column field of the cell that triggered the event.
  +   */
  +  field: string;
  +  /**
  +   * The cell value, but if the column has valueGetter, use getValue.
  +   */
  +  value: GridCellValue;
  +  /**
  +   * GridApi that let you manipulate the grid.
  +   */
  +  api: any;
  +}
  ```

#### Changes

- [DataGrid] Add Vietnamese (vi-VN) locale (#2668) @tuananh281098
- [DataGrid] Apply the `valueFormatter` to `singleSelect` select options (#2581) @DanailH
- [DataGrid] Free up column header space when icons are not visible (#2606) @DanailH
- [DataGrid] Improve Polish (pl-PL) locale (#2632) @michallukowski

### Docs

- [docs] Add section for controlled selection and server-side pagination (#2602) @DanailH
- [docs] Fix Algolia search (#2655) @oliviertassinari
- [docs] Improve the search results relevance (#2656) @oliviertassinari
- [docs] Update installation instructions (#2663) @m4theushw

### Core

- [core] Upgrade JSS plugins to 10.8.0 (#2667) @m4theushw

## 5.0.0-beta.1

_Sep 17, 2021_

A big thanks to the 3 contributors who made this release possible.

### `@mui/x-data-grid@v5.0.0-beta.1` / `@mui/x-data-grid-pro@v5.0.0-beta.1`

This is a hotfix to fix an important regression with `v5.0.0-beta.0`.

### Docs

- [docs] Explain how to use theme augmentation (#2582) @ZeeshanTamboli
- [docs] Fix formatting (#2626) @m4theushw
- [docs] Include packages from next tag (#2628) @m4theushw

### Core

- [core] Copy bin folder when building the libraries (#2627) @flaviendelangle
- [core] Remove prop-types during build (#2586) @m4theushw

## 5.0.0-beta.0

_Sep 17, 2021_

🎉 This is the first release with support for the new MUI v5 🎉!
In the next releases, we will be working to bring all the cool features from MUI v5 to the advanced components.

This beta version of MUI X drops support for MUI v4. We encourage everyone to upgrade to MUI v5 to be able to continue to get all the upcoming features and fixes of MUI X. New versions of MUI X v4, containing only fixes, will still be released, but in a slower pace.

A big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- ⚡ Migrate to the new `@mui/material` and `@mui/styles` packages and drop support for `@material-ui/core` (#2515, #2571, #2620) @m4theushw
- 📚 Migrate to the new documentation infrastructure and design (#2441) (@DanailH, @m4theushw)
- 🎁 Add `actions` column type (#2385) @m4theushw

  See the documentation for [more details](https://mui.com/x/react-data-grid/column-definition/#column-types).

- 👁 Allow to disable virtualization with the `disableVirtualization` prop (#2326) @m4theushw
- 🚀 Introduce the new `isRowSelected` api method (#2523) @flaviendelangle
- 🕹️ Show page size controls on smaller resolutions (#2461) @michaldudak
- 🌎 Add Simplified Chinese (zhCN) localization (#2431) @wlf100220
- 🌎 Add Korean (koKR) localization (#2446) @zzossig
- 📚 Migrate to the new documentation infrastructure and design (#2441) (@DanailH, @m4theushw)
- 🐞 Bugfixes

### `@mui/x-data-grid@v5.0.0-beta.0` / `@mui/x-data-grid-pro@v5.0.0-beta.0`

#### Breaking changes

- [DataGridPro] Remove `apiRef.current.getState` method.

  ```diff
  -const state = apiRef.current.getState();
  +const state = apiRef.current.state;
  ```

- [DataGridPro] The third argument in `apiRef.current.selectRow` is now inverted to keep consistency with other selection APIs. (#2523) @flaviendelangle

  ```diff
  -selectRow: (id: GridRowId, isSelected?: boolean, allowMultiple?: boolean = false) => void;
  +selectRow: (id: GridRowId, isSelected?: boolean, resetSelection?: boolean = false) => void;
  ```

- [DataGrid] Remove the `options` prop from the return of `useGridSlotComponentProps`.

  ```diff
  -const { options } = useGridSlotComponentProps();
  +const rootProps = useGridRootProps();
  ```

- [DataGrid] The module augmentation is not enabled by default. This change was done to prevent conflicts with projects using `DataGrid` and `DataGridPro` together.

  In order to still be able to do overrides at the theme level, add the following imports to your project:

  ```diff
  +import type {} from '@mui/x-data-grid/themeAugmentation';
  +import type {} from '@mui/x-data-grid-pro/themeAugmentation';
  ```

#### Changes

- [DataGridPro] Only apply `checkboxSelectionVisibleOnly` when pagination is enabled (#2443) @flaviendelangle
- [DataGridPro] Remove `apiRef.current.getState` method (#2579) @flaviendelangle
- [DataGrid] Add `disableVirtualization` prop (#2326) @m4theushw
- [DataGrid] Add missing exports from param models (#2448) @flaviendelangle
- [DataGrid] Add missing keys to the `classes` prop (#2458) @m4theushw
- [DataGrid] Add `actions` column type (#2385) @m4theushw
- [DataGrid] Add zhCN localization (#2431) @wlf100220
- [DataGrid] Add koKR localization (#2446) @zzossig
- [DataGrid] Clean the selection public API (#2523) @flaviendelangle
- [DataGrid] Do not call `useGridColumnResize` and `useGridInfiniteLoader` (#2580) @flaviendelangle
- [DataGrid] Do not show right border of last column header when its cells don't have it (#2444) @flaviendelangle
- [DataGrid] Don't consider unselectable rows when `selectionModel` is used (#2464) @m4theushw
- [DataGrid] Drop v4 support (#2515) @m4theushw
- [DataGrid] Export `useGridRootProps` (#2621) @flaviendelangle
- [DataGrid] Fire `columnOrderChange` event after state update (#2451) @flaviendelangle
- [DataGrid] Fix TypeScript type error for toolbar components (#2393) @ZeeshanTamboli
- [DataGrid] Fix navigation between column headers with rows filtered (#2440) @m4theushw
- [DataGrid] Force `scrollEndThreshold` to undefined (#2574) @flaviendelangle
- [DataGrid] Improve ja-JP localization (#2502) @daikiojm
- [DataGrid] Make `hideFooterRowCount` prop available only for DataGridPro (#2564) @ZeeshanTamboli
- [DataGrid] Fix a bug where pressing <kbd>Escape</kbd> was not closing the `GridColumnHeaderMenu` (#2463) @DanailH
- [DataGrid] Prevent scroll when selecting rows (#2558) @m4theushw
- [DataGrid] Reduce specificity of `GridToolbarContainer` styles (#2462) @michaldudak
- [DataGrid] Remove import to `@material-ui/icons` (#2576) @m4theushw
- [DataGrid] Show page size controls on smaller resolutions (#2461) @michaldudak
- [DataGrid] Vertically align column header icons (#2555) @oliviertassinari
- [DataGrid] Fix numeric filter operators not handling '0' correctly (#2528) @flaviendelangle

#### Docs

- [docs] Clarify confusion between licenses (#2525) @oliviertassinari
- [docs] Fix JSDoc comments (#2452) @m4theushw
- [docs] Fix event argument in onXXX props (#2391) @m4theushw
- [docs] Improve SEO ranking (#2467) @oliviertassinari
- [docs] Replace 'paging' with 'pagination' (#2459) @michaldudak
- [docs] Use same infrastructure from v5 (#2441) @DanailH

#### Core

- [core] Add typing to the details argument (#2512) @flaviendelangle
- [core] Allow to create one logger per Grid instance (#2529) @flaviendelangle
- [core] Clean `GridSimpleOptions` interface (#2578) @flaviendelangle
- [core] Fix PR detection mechanism for upstream PRs @oliviertassinari
- [core] Generate propTypes (#2395) @m4theushw
- [core] Improve the feedback loop from developers (#2468) @oliviertassinari
- [core] List the requirement of each hook (#2319) @flaviendelangle
- [core] Only create one `GridEventEmitter` per Grid (#2504) @flaviendelangle
- [core] Only run Prettier on files different from `next` instead of `master` (#2566) @flaviendelangle
- [core] Polish issue template (#2503) @oliviertassinari
- [core] Prepare `x-grid-data-generator` for noImplicitAny (#2505) @flaviendelangle
- [core] Provide theme augmentation as separate module (#2520) @m4theushw
- [core] Publish `GridEvents.rowsSet` when the rows state is modified after `props.rows` is updated (#2530) @flaviendelangle
- [core] Remove `state.isScrolling` (#2337) @m4theushw
- [core] Remove useless apiRef optional chaining or non-null assertions (#2455) @flaviendelangle
- [core] Replace remaining `@material-ui` usages (#2577) @m4theushw
- [core] Replace the options with direct prop reads (#2433) @flaviendelangle
- [core] Skip update on initial render (#2344) @oliviertassinari
- [core] Small changes (#2607, #2511) @flaviendelangle
- [core] Support for `@mui` packages (#2571) @m4theushw
- [core] Synchronously subscribe to events in `useGridApiEventHandler` (#2557) @flaviendelangle
- [core] Update `.browserslistrc` file (#2384) @DanailH
- [core] Update monorepo version and copy assets (#2603) @m4theushw
- [core] Update outdated hook requirements (#2526) @flaviendelangle
- [test] Clean selection tests (#2457) @flaviendelangle
- [test] Disable browserstack for PRs (#2531) @flaviendelangle

## 4.0.0

_Aug 27, 2021_

🎉 This is the first stable release of the data grid component 🎉!

We have been iterating on the component for [18 months](https://github.com/mui/mui-x/commit/705cb0f387b5f3aa056bf40c4183a2342b317447). With the introduction of the [row edit](https://mui.com/x/react-data-grid/editing/#row-editing) feature, many bug fixes, and polishing of the documentation, we believe the component is ready for a stable release.

The MUI X v4.0.0 release supports [MUI Core](https://github.com/mui/material-ui) v4 and has partial support for v5-beta. With the soon-to-be-released v5 version of the core components, we are moving ongoing work to the v5 release line (Core and X).
The support for existing projects on MUI v4 won't be a priority going forward. We encourage you to migrate to MUI Core v5-beta and soon MUI X v5-beta. We don't patch, fix, or alter older versions. Using MUI Core v4 with MUI X v5 might lead to extra bundle size and configuration.

A big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Introduce the [row editing](https://mui.com/x/react-data-grid/editing/#row-editing) feature (#2098) @m4theushw

  <img src="https://user-images.githubusercontent.com/3165635/130665023-3c0730ab-502e-4da1-8bc1-d572427ad2d6.gif" width="851" height="382" />

- ⚡️ Rename the `XGrid` component to `DataGridPro` (#2382) @m4theushw

  This should help clarify the products vs. plans separation. [MUI X](https://github.com/mui/mui-x) is a product line on its own. It contains MIT and Commercial software. Removing X from the name of the paid components should help remove a possible confusion: the MIT version of X is meant to be valuable enough for developers to use it, without feeling that it's crippled compared to other OSS alternatives.
  The Pro suffix should help make it clear what's MIT and what's not.

- ✨ Rename the `@material-ui` npm scope to `@mui` (#2341) @oliviertassinari

  This is part of the ongoing rebranding of the project and company. Material UI is our current official name, however, we are going to change it. It's too long to write, read, and pronounce; and it is too closely associated with Material Design. In the near future, the whole project/company is moving to MUI and https://mui.com/.

- 💡 The `api` property was removed from the callback params. To access the API, use the `DataGridPro` (#2312) @DanailH

### `@mui/x-data-grid@v4.0.0` / `@mui/x-data-grid-pro@v4.0.0`

#### Breaking changes

- [DataGrid] Move packages to `@mui` scope and rename `XGrid` to `DataGridPro` (#2341, #2382) @m4theushw @oliviertassinari
  You can find in the above highlight section why we are making these name changes. You can migrate following these steps:

  ```diff
  -import { DataGrid } from '@material-ui/data-grid';
  +import { DataGrid } from '@mui/x-data-grid';
  ```

  ```diff
  -import { XGrid } from '@material-ui/x-grid';
  -<XGrid />
  +import { DataGridPro } from '@mui/x-data-grid-pro';
  +<DataGridPro />
  ```

- [DataGrid] The `api` property was removed from the callback params (#2312) @DanailH
  To access the API, use the `DataGridPro` and get it from the new `details` param.

  ```diff
   <DataGridPro
  -  onColumnResize={(params, event) => console.log(params.api)}
  +  onColumnResize={(params, event, details) => console.log(details.api)}
   />
  ```

- [DataGrid] Remove unused row CSS classes (#2327) @ZeeshanTamboli
  The CSS classes `.Mui-odd` and `.Mui-even` were removed from the row.

#### Changes

- [DataGrid] Add `gridClasses` API instead of hard coded classes (#2320) @m4theushw
- [DataGrid] Add row editing feature (#2098) @m4theushw
- [DataGrid] Add TypeScript module augmentation for the theme (#2307) @ZeeshanTamboli
- [DataGrid] Fix `box-sizing: border-box` leak (#2330) @m4theushw
- [DataGrid] Fix keyboard navigation header regression (#2342) @oliviertassinari
- [DataGrid] Fix keyboard navigation on filtered rows (#2336) @m4theushw

### Docs

- [docs] Add `Row & Cell editing` in features list (#2396) @ZeeshanTamboli
- [docs] Add redirect from `XGrid` to `DataGridPro` (#2389) @m4theushw
- [docs] Fix `onCellEditCommit` param type (#2390) @ArthurPedroti
- [docs] Fix docs for `onEditRowsModelChange` prop (#2394) @ZeeshanTamboli
- [docs] Fix docs links and pagination sentence (#2381) @ZeeshanTamboli
- [docs] Update the icons for the new branding (#2339) @oliviertassinari

### Core

- [core] Keep prop-types in the same file (#2345) @oliviertassinari
- [core] Reduce `options` internal usage (#2318) @flaviendelangle
- [core] Remove `DataGridPropTypes` (#2432) @flaviendelangle
- [core] Remove private API from the export (#2299) @oliviertassinari
- [core] Remove usages of `options.scrollbarSize` (#2317) @flaviendelangle
- [core] Simplify `useGridColumns` hook (#2343) @oliviertassinari
- [core] Update `doesSupportTouchActionNone` implementation (#2378) @DanailH
- [core] Upgrade dependency with the monorepo (#2377) @oliviertassinari
- [test] Use `.not.to.equal` in favour of `to.not.equal` (#2340) @oliviertassinari

## 4.0.0-alpha.37

_Aug 12, 2021_

Big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🔎 Add the \"is empty\" and \"is not empty\" filter operators to date and number columns (#2274) @flaviendelangle
- ⚡️ Only support @material-ui/core 4.12.0 or higher (#2281) @DanailH
- 🐞 Fix a regression to not require @material-ui/x-license when using the DataGrid (#2295) @oliviertassinari
- 👁️ Add `onViewportRowsChange` prop for `XGrid` only (#2038) @DanailH
- 📃 Translate booleans when exporting rows to CSV (#2296) @m4theushw
- 🌎 Add Sudanese Arabic (ar-SD) locale (#2269) @YassinHussein

This is the last alpha release. We are moving to beta in the next release, next week.

### `@material-ui/data-grid@v4.0.0-alpha.37` / `@material-ui/x-grid@v4.0.0-alpha.37`

#### Breaking changes

- [DataGrid] Drop support for @material-ui/core below v4.12.0 (#2281) @DanailH
- [XGrid] Replace event constants with the `GridEvents` enum (#2279) @flaviendelangle

  ```diff
  -import { GRID_CELL_EDIT_START } from '@material-ui/x-grid';
  -apiRef.current.subscribeEvent(GRID_CELL_EDIT_START, (params, event) => { ... });
  +import { GridEvents } from '@material-ui/x-grid';
  +apiRef.current.subscribeEvent(GridEvents.cellEditStart, (params, event) => { ... });
  ```

#### Changes

- [DataGrid] Add @material-ui/styles as peer dependency (#2288) @m4theushw
- [DataGrid] Add Sudanese Arabic (ar-SD) locale (#2269) @YassinHussein
- [DataGrid] Add \"is empty\" and \"is not empty\" filter operators to date and number columns (#2274) @flaviendelangle
- [DataGrid] Avoid crash if `valueOptions` is missing in the `GridColDef` when using `singleSelect` (#2276) @DanailH
- [DataGrid] Remove the use of the `autoFocus` attribute (#2239) @m4theushw
- [DataGrid] Drop support for @material-ui/core below 4.12.0 (#2281) @DanailH
- [DataGrid] Fix when `renderCell` returns false-ish values (#2242) @siriwatknp
- [DataGrid] Group events into a single enum (#2279) @flaviendelangle
- [DataGrid] Improve error message if using multiple versions of data grid (#2311) @ZeeshanTamboli
- [DataGrid] Make resized column not flexible (#2308) @flaviendelangle
- [DataGrid] Merge `useGridVirtualColumns` into `useGridVirtualRows` (#2314) @m4theushw
- [DataGrid] Remove dependency on x-license (#2295) @oliviertassinari
- [DataGrid] Translate booleans when exporting to CSV (#2296) @m4theushw
- [XGrid] Add `onViewportRowsChange` prop (#2038) @DanailH

### Docs

- [docs] Fix page size warnings (#2301) @oliviertassinari
- [docs] Sort events alphabetically (#2278) @flaviendelangle

### Core

- [core] Assert that `event.defaultMuiPrevented` is called (#2302) @oliviertassinari
- [core] Reduce options usage in feature hooks (#2275, #2284) @flaviendelangle
- [core] Remove use of `getState` (#2300) @oliviertassinari
- [core] Try `rangeStrategy: bump` @oliviertassinari
- [core] Use type inference in selectors (#2244) @flaviendelangle
- [core] Improve type coverage of `colDef` (#2188) @flaviendelangle

## 4.0.0-alpha.36

_August 5, 2021_

Big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Polish the cell editing API (#2220) @m4theushw
- ⚡️ Add `details` param to each callback option in `XGrid` (#2236) @DanailH
- 💅 Work on internal optimizations and code separation (#2176, #2243, #2235, #2213) @flaviendelangle
- ✨ Allow non-integer column width for flex columns (#2282) @flaviendelangle
- 🐞 Fix one bug related to filtering

### `@material-ui/data-grid@v4.0.0-alpha.36` / `@material-ui/x-grid@v4.0.0-alpha.36`

#### Breaking changes

- [DataGrid] Polish cell editing (#2220) @m4theushw

  - Replace `onCellModeChange` prop with `onCellEditStart` or `onCellEditStop`.
  - Rename `onCellEditEnter` prop to `onCellEditStart`.
  - Rename `onCellEditEnd` prop to `onCellEditStop`.

  ```diff
   <DataGrid
  -  onCellEditEnter={...}
  -  onCellEditExit={...}
  +  onCellEditStart={...}
  +  onCellEditStop={...}
   />
  ```

  - [XGrid] The `setEditCellProps` API call is not available anymore.
    Use the [controlled editing](https://mui.com/x/react-data-grid/editing/#controlled-editing) or `setEditRowsModel`.

  ```diff
  -apiRef.current.setEditCellProps({ id, field, props: { ...props, error: true } });
  +apiRef.current.setEditRowsModel({
  +  ...oldModel,
  +  [id]: {
  +    ...oldModel[id],
  +    [field]: { ...oldModel[id][field], error: true },
  +  },
  +});
  ```

- [DataGrid] Allow non-integer column width for flex columns (#2282) @flaviendelangle

  - The `width` property of the columns is no longer updated with the actual width of of the column. Use the new `computedWidth` property in the callbacks instead.

  ```diff
   const columns: GridColDef = [{
     field: 'name',
     width: 100,
     renderCell: ({ value, colDef }) => {
  -    console.log(colDef.width!);
  +    console.log(colDef.computedWidth);
       return value;
     },
   }];
  ```

#### Changes

- [DataGrid] Canonical controlled state behavior (#2208) @oliviertassinari
- [DataGrid] Fix filter with extended columns (#2246) @m4theushw
- [DataGrid] Remove default value of columnTypes prop (#2280) @m4theushw
- [DataGrid] Add German (de-DE) translation for export and isEmpty operator (#2285) @ChristopherBussick
- [XGrid] Add `details` param to each callback option in `XGrid` (#2236) @DanailH

### Docs

- [docs] Improve slot API docs (#2219) @oliviertassinari
- [docs] Document virtualization APIs in virtualization section (#2247) @ZeeshanTamboli

### Core

- [core] Isolate `DataGrid` and `XGrid` (#2176) @dtassone
- [core] Move `GridFilterModel` in the models directory (#2243) @flaviendelangle
- [core] Add new column internal `computedWidth` field (#2235) @flaviendelangle
- [core] Use `rootProps` instead of `options` in the grid components except for `classes` (#2213) @flaviendelangle
- [core] Fix `rebaseWhen=auto` not working (#2271) @oliviertassinari
- [core] Batch small changes (#2249) @oliviertassinari

## 4.0.0-alpha.35

_July 31, 2021_

Big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- ⚛️ Complete the idiomatic support of controllable props (#2143, #2099) @m4theushw, @flaviendelangle
- ✨ Improve support of @material-ui/core@v5 (#2224, #2240) @oliviertassinari, @siriwatknp
- 🐛 Fix 7 bugs and regressions

### `@material-ui/data-grid@v4.0.0-alpha.35` / `@material-ui/x-grid@v4.0.0-alpha.35`

#### Breaking changes

- [DataGrid] Improve controllable cell edit (#2143) @m4theushw

  - The `onEditCellChange` prop was renamed to `onEditCellPropsChange`.
  - The `onEditCellChangeCommitted` prop was renamed to `onCellEditCommit`.
  - The `onEditRowModelChange` prop was removed. Use the new `onEditRowsModelChange` prop.

    ```diff
    -onEditRowModelChange?: (params: GridEditRowModelParams)
    +onEditRowsModelChange?: (editRowsModel: GridEditRowsModel)
    ```

- [XGrid] Improve controllable cell edit (#2143) @m4theushw

  - The `cellEditPropsChange` event was renamed to `editCellPropsChange`.
  - The `cellEditPropsChangeCommitted` event was renamed to `cellEditCommit`.
  - The `cellValueChange` event was removed. Listen to `cellEditCommit` to detect when the value is committed.
  - The `editRowModelChange` event was renamed to `editRowsModelChange`.

- [DataGrid] Improve controllable pagination (#2099) @flaviendelangle

  - The `pageSize` is now a controlled prop. If you set a value, you also need to handle updates with onPageSizeChange. See [the documentation](https://mui.com/x/react-data-grid/pagination/#page-size).
  - Change the controllable API signature:

    ```diff
     // Signature
    -onPageChange?: (params: GridPageChangeParams) => void;
    +onPageChange?: (page: number) => void;

     // Usage
    -<DataGrid onPageChange={(params: GridPageChangeParams) => setPage(params.page)} />
    +<DataGrid onPageChange={(page: number) => setPage(page)} />
    ```

    ```diff
     // Signature
    -onPageSizeChange?: (params: GridPageChangeParams) => void;
    +onPageSizeChange?: (pageSize: number) => void;

     // Usage
    -<DataGrid onPageSizeChange={(params: GridPageChangeParams) => setPageSize(params.pageSize)} />
    +<DataGrid onPageSizeChange={(pageSize: number) => setPageSize(pageSize)} />
    ```

#### Changes

- [DataGrid] Fix `Controlled selection` console error (#2197) @ZeeshanTamboli
- [DataGrid] Fix `disableMultipleColumnsFiltering` console warning @ZeeshanTamboli
- [DataGrid] Fix CSV export when selected row id is number (#2232) @flaviendelangle
- [DataGrid] Fix horizontal scroll when no rows (#2159) @m4theushw
- [DataGrid] Fix id passed to setEditCellValue (#2215) @m4theushw
- [DataGrid] Fix missing value in onCellEditCommit (#2214) @m4theushw
- [DataGrid] Fix prop-type warning with v5 (#2224) @oliviertassinari
- [DataGrid] Fix support for singleSelect with numeric values (#2112) @m4theushw
- [DataGrid] Improve translations to the Turkish locale (#2203) @cihanyakar
- [DataGrid] Use event.defaultMuiPrevented to prevent the default behavior (#2179) @m4theushw
- [DataGrid] Warn when pageSize is not present in rowsPerPageOptions (#2014) @flaviendelangle
- [XGrid] Fix v5 filter select display (#2240) @siriwatknp

### Docs

- [docs] Add missing API docs (#2167) @ZeeshanTamboli
- [docs] Describe how to export custom rendered cells (#2194) @m4theushw
- [docs] Generate api doc for the GridExportCSVOptions interface (#2102) @flaviendelangle
- [docs] Handle generics in api doc generation (#2210) @flaviendelangle

### Core

- [core] Don't export the internal utils (#2233) @flaviendelangle
- [core] Receive patch and minor dependency updates (#2221) @flaviendelangle
- [test] Add tests for column resizing (#2211) @flaviendelangle
- [test] Fix singleSelect tests (#2200) @m4theushw
- [test] Sync Karma config (#2191) @m4theushw
- [test] Test support for theme translations (#2229) @m4theushw

## [4.0.0-alpha.34](https://github.com/mui/mui-x/compare/v4.0.0-alpha.33...v4.0.0-alpha.34)

_July 21, 2021_

Big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Fix @material-ui/core v4.12.1 support (#2108) @DanailH
- 🐞 Add \"is empty\" and \"is not empty\" operators (#1997) @m4theushw
- 💅 Improve the editing API (#1955) @m4theushw
- 🐛 We have improved the scroll keyboard (#2162) @oliviertassinari
- ⚡️ Add control state for selection model, filter model, and sort model @dtassone
- 💡 Add quick filter demo in the docs @dtassone

### @material-ui/x-grid@v4.0.0-alpha.34 / @material-ui/data-grid@v4.0.0-alpha.34

#### Breaking changes

- [DataGrid] Fix scrollToIndexes behavior (#2162) @oliviertassinari

  Remove public `apiRef.current.isColumnVisibleInWindow()` as it servers private use cases.

  ```diff
  -apiRef.current.isColumnVisibleInWindow();
  ```

- [DataGrid] Remove stateId argument from GridApi getState method (#2141) @flaviendelangle

  ```diff
  -const filterState = apiRef.current.getState('filter');
  +const filterState = apiRef.current.state.filter;
  ```

- [DataGrid] Improve controllable sorting (#2095) @dtassone

  Normalize the controlled prop signature:

  ```diff
   <DataGrid
  -  onSortModelChange={(params: GridSortModelParams) => setSortModel(params.model)}
  +  onSortModelChange={(model: GridSortModel) => setSortModel(model)}
   />
  ```

- [DataGrid] Improve controllable filter (#1909) @dtassone

  Normalize the controlled prop signature:

  ```diff
   <DataGrid
  -  onFilterModelChange={(params: GridFilterModelParams) => setFilterModel(params.model)}
  +  onFilterModelChange={(model: GridFilterModel) => setFilterModel(model)}
   />
  ```

- [DataGrid] Improve the editing API (#1955) @m4theushw

  - The `props` key in the first argument of `commitCellChange` was removed to promote the use of the value already stored in the state.
    To update the value in the state, call `setEditCellProps` before.

    ```diff
    -apiRef.current.commitCellChange({ id: 1, field: 'name', props: { value: 'Ana' } });
    +apiRef.current.setEditCellProps({ id: 1, field: 'name', props: { value: 'Ana' } });
    +apiRef.current.commitCellChange({ id: 1, field: 'name' });
    ```

  - Calling `commitCellChange` in a cell in view mode will throw an error. Make sure to first enter the edit mode.

    ```diff
    +apiRef.current.setCellMode(1, 'name', 'edit');
     apiRef.current.commitCellChange({ id: 1, field: 'name' });
    ```

  - The `setCellValue` was removed from the API. Use `commitCellChange` or `updateRows` in place.

    ```diff
    -apiRef.current.setCellValue({ id: 1, field: 'name', value: 'Ana' });
    +apiRef.current.updateRows([{ id: 1, name: 'Ana' }]);
    ```

    or

    ```diff
    -apiRef.current.setCellValue({ id: 1, field: 'name', value: 'Ana' });
    +apiRef.current.setCellMode(1, 'name', 'edit');
    +apiRef.current.setEditCellProps({ id: 1, field: 'name', props: { value: 'Ana' } });
    +apiRef.current.commitCellChange({ id: 1, field: 'name' });
    ```

  - The `getEditCellProps` was removed because `getEditCellPropsParams` offers the same functionality.

    ```diff
    -const props = apiRef.current.getEditCellProps(1, 'name');
    +const { props } = apiRef.current.getEditCellPropsParams(1, 'name');
    ```

    **Note**: This method will now throw an error if the cell is in view mode.

- [DataGrid] Implement useControlState hook, and add control state on selectionModel (#1823) @dtassone

  Normalize the controlled prop signature:

  ```diff
   <DataGrid
  -  onSelectionModelChange={(params: GridSelectionModelChangeParams) => setSelectionModel(params.model)}
  +  onSelectionModelChange={(model: GridSelectionModel) => setSelectionModel(model)}
   />
  ```

  Replace `onRowSelected` with the existing API:

  ```diff
   <DataGrid
  -  onRowSelected={(params: GridRowSelectedParams) =>  }
  +  onSelectionModelChange={(model: GridSelectionModel) => }
   />
  ```

#### Changes

- [DataGrid] Use find instead of filter (#2015) @DanailH
- [DataGrid] Add \"is empty\" and \"is not empty\" operators (#1997) @m4theushw
- [DataGrid] Add `minWidth` to `GridColDef` (#2101) @DanailH
- [DataGrid] Add missing localeText types (#2118) @oliviertassinari
- [DataGrid] Add missing translations to French (fr-FR) locale (#2082) @flaviendelangle
- [DataGrid] Add quick filter demo (#2149) @dtassone
- [DataGrid] Allow passing styles and Popper props to GridPanel (#1994) @sebastianfrey
- [DataGrid] Allow to customize the columns exported as CSV (#2008) @flaviendelangle
- [DataGrid] Emit `pageSizeChange` when autoPageSize is set and the grid size changes (#1986) @flaviendelangle
- [DataGrid] Fix crash when id has a single-quote (#2033) @rbrishabh
- [DataGrid] Fix localeText type (#2117) @oliviertassinari
- [DataGrid] Fix manual entry in date fields (#2051) @m4theushw
- [DataGrid] Fix scrollToIndexes offscreen column (#1964) @m4theushw
- [DataGrid] Fix support for `@material-ui/core@4.12` (#2108) @DanailH
- [DataGrid] Improve GridToolbarXXX props flexibility (#2157) @tifosiblack
- [DataGrid] Make GridToolbarXXX props overridable (#2084) @tifosiblack
- [DataGrid] Remove 'hide: true' from a column should correctly resize the others column (#2034) @flaviendelangle
- [DataGrid] Remove focus on cell when its row is removed from the data (#1995) @flaviendelangle
- [DataGrid] Remove unused `editMode` prop (#2173) @ZeeshanTamboli
- [DataGrid] Support style prop (#2116) @oliviertassinari
- [DataGrid] Use Intl.Collator for string comparison (#2155) @m4theushw
- [DataGrid] Update apiRef.current.getRow to signal that it can return a null value (#2010) @flaviendelangle
- [XGrid] Add ability to disable reorder on some columns (#2085) @flaviendelangle
- [XGrid] Close column header menu when resizing column (#1989) @flaviendelangle
- [XGrid] Fix column resize on touch devices (#2089) @m4theushw
- [XGrid] Only show column sorting in the grid toolbar when experimental features enabled (#2091) @flaviendelangle
- [XGrid] Prevent headers from scrolling during reordering (#2154) @m4theushw

### Docs

- [docs] Add new cursor-based pagination paragraph (#1991) @flaviendelangle
- [docs] Better explain what happens in the future (#2036) @oliviertassinari
- [docs] Fix broken env (#2160) @oliviertassinari
- [docs] Fix small typos in the documentation (#2169) @BrandonOldenhof
- [docs] Fix typo in README (#2150) @studyhog

### Core

- [core] Add @material-ui/lab and @material-ui/icons as peer dependencies (#2012) @m4theushw
- [core] Add additional test case for `onSelectionModelChange` (#1966) @DanailH
- [core] Add support bot (#2097) @oliviertassinari
- [core] Configure Renovate and remove Dependabot (#2075) @flaviendelangle
- [core] Copy getClasses from the core (removed in v5) (#2140) @flaviendelangle
- [core] Correctly test column visibility switch impact on column width (#2130) @flaviendelangle
- [core] Fix missing git source in packages (#2092) @msftenhanceprovenance
- [core] Fix typo errors (#2100) @flaviendelangle
- [core] No need to pin dependencies (#2094) @oliviertassinari
- [core] Remove dead code (#2088) @oliviertassinari
- [core] Remove implicit :scope (#2115) @oliviertassinari
- [core] Remove styled-components (#2060) @m4theushw
- [core] Remove unused event 'cellFocusChange' (#1996) @flaviendelangle
- [core] Renovate : Group storybook updates (#2086) @flaviendelangle
- [core] Replace fade with muiStyleAlpha (#2171) @m4theushw
- [core] Support `docs:api` script in Windows OS (#2166) @ZeeshanTamboli
- [core] Upgrade dependencies (#2114) @oliviertassinari
- [core] Use getColumnHeaderCell in tests (#2093) @flaviendelangle
- [core] Use props instead of options for event handler (#2139) @flaviendelangle
- [test] Allow tests to run for up to 5 instead of 4 minutes (#2152) @oliviertassinari
- [test] Increase Browserstack worker timeout from 2.5 to 4 minutes (#2040) @flaviendelangle
- [test] Remove orphan async @oliviertassinari
- [test] Test the validation before saving a value (#2087) @m4theushw

## [4.0.0-alpha.33](https://github.com/mui/mui-x/compare/v4.0.0-alpha.32...v4.0.0-alpha.33)

_July 1, 2021_

Big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🐞 As a focus of Q2, we have kept fixing bugs
- 💅 End users are now allowed to copy the selected rows to the clipboard with <kbd>Ctrl</kbd> + <kbd>c</kbd> (#1929) @m4theushw
- 🐛 We have fixed the `Select all` checkbox. When triggered, it should only select the filtered rows (#1879) @ZeeshanTamboli
- ⚡️ We have added a new `singleSelect` column type (#1956) @DanailH

  Using the column `type: 'singleSelect'` defaults to `Select` component when the cell is in `edit` mode. You can find the documentation [following this link](https://mui.com/x/react-data-grid/column-definition/#column-types).

  ```jsx
  <DataGrid
    columns={[
      {
        field: 'country',
        type: 'singleSelect',
        valueOptions: ['France', 'Netherlands', 'Brazil'],
        editable: true,
      },
    ]}
    rows={[
      { id: 0, country: 'France' },
      { id: 1, country: 'Netherlands' },
      { id: 2, country: 'Brazil' },
    ]}
  />
  ```

### @material-ui/x-grid@v4.0.0-alpha.33 / @material-ui/data-grid@v4.0.0-alpha.33

#### Breaking changes

- [DataGrid] Rename `onColumnResizeCommitted` to `onColumnWidthChange` (#1967) @m4theushw

  ```diff
  -<DataGrid onColumnResizeCommitted={...} />
  +<DataGrid onColumnWidthChange={...} />
  ```

- [DataGrid] Make GRID_ROWS_CLEAR private (#1925) @oliviertassinari

  The `rowsCleared` event was always triggered alongside `rowsSet`. You can listen to the latter event only.

- [DataGrid] Fix events naming (#1862) @m4theushw

  The following `XGrid` events were renamed:

  - `columnHeaderNavigationKeydown` to `columnHeaderNavigationKeyDown`
  - `columnResizeCommitted` to `columnWidthChange`
  - `rowsUpdated` to `rowsUpdate`
  - `columnsUpdated` to `columnsChange`

  The following `XGrid` DOM events were removed:

  - `focusout`
  - `keydown`
  - `keyup`

#### Changes

- [DataGrid] Add fallback for pagination translations (#2006) @m4theushw
- [DataGrid] Add single select column type (#1956) @DanailH
- [DataGrid] Allow to copy the selected rows to the clipboard (#1929) @m4theushw
- [DataGrid] Improve the logic of `scrollToIndexes` (#1969) @oliviertassinari
- [DataGrid] Fix deferred rendering race condition (#1807) @dtassone
- [DataGrid] Fix double-click issue (#1919) @oliviertassinari
- [DataGrid] Fix number edit cell output (#1959) @oliviertassinari
- [DataGrid] Fix offscreen row when calling `scrollToIndexes` (#1949) @oliviertassinari
- [DataGrid] Ignore drag events when disableColumnReorder is true (#1952) @m4theushw
- [DataGrid] `Select all` checkbox click should select only filtered rows (#1879) @ZeeshanTamboli
- [XGrid] Add option to select only visible rows on the current page (#1998) @DanailH

### Docs

- [docs] Align docs with EULA (source of truth) (#1963) @oliviertassinari
- [docs] Fix changing Dataset not working (#1965) @m4theushw
- [docs] Fix description of union types (#2003) @m4theushw

### Core

- [core] Polish filtering internals (#1760) @ZeeshanTamboli
- [core] Upgrade actions-cool/issues-helper (#1962) @oliviertassinari
- [core] Name variables according to enUS instead of enGB (#1988) @flaviendelangle
- [test] Test vertical scrollbar (#1932) @oliviertassinari

## [4.0.0-alpha.32](https://github.com/mui/mui-x/compare/v4.0.0-alpha.31...v4.0.0-alpha.32)

_June 18, 2021_

Big thanks to the 10 contributors who made this release possible. Here are some highlights ✨:

- ⚡️ Components that use portals, like `Select` and `Autocomplete`, can now be used in the cell editing (#1772) @m4theushw
- 📃 Apply the `valueFormatter` to the CSV exporting (#1922) @DanailH
- 💅 Rename CSS classes to match the convention of the core components (#1872) @DanailH
- 🌎 Isolate translations from MUI Core and MUI X (#1913) @DanailH
- 🚀 Improve performance when finding column indexes and updating rows (#1903, #1923) @Janpot @N2D4
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.32 / @material-ui/data-grid@v4.0.0-alpha.32

#### Breaking changes

- [DataGrid] The `onEditCellChangeCommitted` prop won't be called with an event when committing changes by clicking outside the cell (#1910) @m4theushw
- [DataGrid] Translation for MUI Core components are no longer included in the MUI X translation (#1913) @DanailH

  ```diff
   import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
   import { DataGrid, bgBG } from '@material-ui/data-grid';
  +import { bgBG as coreBgBG } from '@material-ui/core/locale';

   const theme = createMuiTheme(
     {
       // ...
     },
     bgBG,
  +  coreBgBG,
   );
  ```

- [DataGrid] The `disableClickEventBubbling` prop was removed (#1910) @m4theushw

  The same outcome can be obtained by using the React synthetic event, calling `event.stopPropagation()`:

  ```diff
  -<DataGrid disableClickEventBubbling />
  +<DataGrid onCellClick={(event) => event.stopPropagation()} />
  ```

- [DataGrid] Rename CSS classes according to new convention (#1872) @DanailH

  The main grid components:

  - `.data-container` was removed
  - `.MuiDataGrid-columnHeaderSortable` was renamed to `.MuiDataGrid-columnHeader--sortable`
  - `.MuiDataGrid-columnHeaderCenter` was renamed to `.MuiDataGrid-columnHeader--alignCenter`
  - `.MuiDataGrid-columnHeaderRight` was renamed to `.MuiDataGrid-columnHeader--alignRight`
  - `.MuiDataGrid-columnHeader-draggable` was renamed to `.MuiDataGrid-columnHeaderDraggableContainer`
  - `.MuiDataGrid-columnHeaderSortable` was renamed to `.MuiDataGrid-columnHeader--sortable`
  - `.MuiDataGrid-columnHeaderMoving` was renamed to `.MuiDataGrid-columnHeader--moving`
  - `.MuiDataGrid-columnHeaderSorted` was renamed to `.MuiDataGrid-columnHeader--sorted`
  - `.MuiDataGrid-columnHeaderNumeric` was renamed to `.MuiDataGrid-columnHeader--numeric`
  - `.MuiDataGrid-columnHeader-dropZone` was renamed to `.MuiDataGrid-columnHeaderDropZone`
  - `.MuiDataGrid-columnSeparatorResizable` was renamed to `.MuiDataGrid-columnSeparator--resizable`
  - `.MuiDataGrid-cellWithRenderer` was renamed to `.MuiDataGrid-cell--withRenderer`
  - `.MuiDataGrid-cellLeft` was renamed to `.MuiDataGrid-cell--textLeft`
  - `.MuiDataGrid-cellRight` was renamed to `.MuiDataGrid-cell--textRight`
  - `.MuiDataGrid-cellCenter` was renamed to `.MuiDataGrid-cell--textCenter`
  - `.MuiDataGrid-cellEditing` was renamed to `.MuiDataGrid-cell--editing`
  - `.MuiDataGrid-cellEditable` was renamed to `.MuiDataGrid-cell--editable`
  - `.MuiDataGrid-editCellBoolean` was renamed to `.MuiDataGrid-editBooleanCell`
  - `.MuiDataGrid-editCellInputBase` was renamed to `.MuiDataGrid-editInputCell`
  - `.MuiDataGrid-scrollArea-left` was renamed to `.MuiDataGrid-scrollArea--left`
  - `.MuiDataGrid-scrollArea-right` was renamed to `.MuiDataGrid-scrollArea--right`

  The standalone components:

  - `.MuiDataGridMenu-*` was renamed to `.MuiGridMenu-*`
  - `.MuiDataGridPanel-*` was renamed to `.MuiGridPanel-*`
  - `.MuiDataGridPanelContent-*` was renamed to `.MuiGridPanelContent-*`
  - `.MuiDataGridPanelFooter-*` was renamed to `.MuiGridPanelFooter-*`
  - `.MuiDataGridPanelWrapper-*` was renamed to `.MuiGridPanelWrapper-*`
  - `.MuiDataGridFilterForm-*` was renamed to `.MuiGridFilterForm-*`
  - `.MuiDataGridToolbarFilterButton-*` was renamed to `.MuiGridToolbarFilterButton-*`
  - `.MuiDataGrid-footer` was renamed to `.MuiDataGrid-footerContainer`
  - `.MuiDataGrid-toolbar` was renamed to `.MuiDataGrid-toolbarContainer`

#### Changes

- [DataGrid] Add `aria-label` to `GridToolbarExport` (#1869) @rbrishabh
- [DataGrid] Add support for edit components that use portal (#1772) @m4theushw
- [DataGrid] Add `useGridApiContext` hook to access the `GridApiContext` (#1877) @m4theushw
- [DataGrid] Allow to set the delimiter in `GridExportCsvOptions` (#1859) @michallukowski
- [DataGrid] Escape regular expression characters in filters (#1899) @ZeeshanTamboli
- [DataGrid] Fix support for `getRowId` on cell editing (#1917) @m4theushw
- [DataGrid] Fix typo in French (fr-FR) locale (#1874) @julien-guillon
- [DataGrid] Improve Brazilian Portuguese (pt-BR) locale (#1861) @aline-matos
- [DataGrid] Improve type of the blur event (#1918) @oliviertassinari
- [DataGrid] Improve updateRows performance (#1923) @N2D4
- [DataGrid] Include MUI Core component localizations in `localeText` (#1913) @DanailH
- [DataGrid] Make the CSV export respect the `valueFormatter` (#1922) @DanailH
- [DataGrid] Remove `disableClickEventBubbling` (#1910) @m4theushw
- [DataGrid] Rename CSS classes according to new convention (#1872) @DanailH
- [DataGrid] Use binary search to find column indexes in virtualization (#1903) @Janpot

### Docs

- [docs] Fix 404 links (#1880) @oliviertassinari
- [docs] Fix prop-type warning (#1916) @oliviertassinari
- [docs] Make cells editable in demos (#1817) @m4theushw
- [docs] Polish `disableDensitySelector` description (#1884) @oliviertassinari

### Core

- [core] Batch small changes (#1901) @oliviertassinari
- [core] Remove dead logic (#1900) @oliviertassinari
- [test] Fix tests (#1928) @m4theushw

## [4.0.0-alpha.31](https://github.com/mui/mui-x/compare/v4.0.0-alpha.30...v4.0.0-alpha.31)

_June 9, 2021_

Big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 💅 Allow to customize GridToolbarExport's CSV export (#1695) @michallukowski
- 🐛 Allow to deselect rows with <kbd>Ctrl</kbd> + click (#1813) @ZeeshanTamboli
- ⚡️ Refactor scroll size detector (#1703) @dtassone
- 📖 Add [documentation](https://mui.com/x/api/data-grid/) for interfaces and events (#1529) @m4theushw
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.31 / @material-ui/data-grid@v4.0.0-alpha.31

#### Breaking changes

- [DataGrid] Improve `headerClassName` type (#1778) @DanailH

  `cellClassName` and `headerClassName` no longer accept array of strings.

  ```diff
  -cellClassName?: string | string[] | (params: GridCellParams) => string;
  +cellClassName?: string | (params: GridCellParams) => string;
  ```

  ```diff
  -headerClassName?: string | string[];
  +headerClassName?: string | (params: GridColumnHeaderParams) => string;
  ```

#### Changes

- [DataGrid] Add `valueParser` to parse values entered by the user (#1785) @m4theushw
- [DataGrid] Allow to customize GridToolbarExport's CSV export (#1695) @michallukowski
- [DataGrid] Allow to deselect rows with <kbd>Ctrl</kbd> + click (#1813) @ZeeshanTamboli
- [DataGrid] Improve general architecture to better isolate hooks (#1720) @dtassone
- [DataGrid] Fix cell height after changing grid density (#1819) @DanailH
- [DataGrid] Fix fluid columns width when available `viewportWidth` < 0 (#1816) @DanailH
- [DataGrid] Fix force reflow on scroll start and end (#1829) @dtassone
- [DataGrid] Refactor scroll size detector (#1703) @dtassone
- [XGrid] Display the number of filtered rows in the footer (#1830) @m4theushw

### Docs

- [docs] Add docs for `disableDensitySelector` option (#1856) @DanailH
- [docs] Automatically generate API docs (#1529) @m4theushw

### Core

- [core] Batch small changes (#1848) @oliviertassinari
- [core] Add `yarn docs:api` @oliviertassinari
- [test] Improve pagination tests (#1827) @m4theushw

## [4.0.0-alpha.30](https://github.com/mui/mui-x/compare/v4.0.0-alpha.29...v4.0.0-alpha.30)

_May 31, 2021_

Big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 💅 Add `getCellClassName` prop (#1687) @m4theushw
- 🐛 Fix a regression in the controlled pagination (#1729) @ZeeshanTamboli
- ⚡️ Remove `cellClassRules` from `GridColDef` (#1716) @m4theushw
- 🇨🇿 Add cs-CZ locale (#1765) @Haaxor1689
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.30 / @material-ui/data-grid@v4.0.0-alpha.30

#### Breaking changes

- [DataGrid] Rename toolbar components for consistency (#1724) @DanailH

  Prefix all the toolbar-related components with `GridToolbar`.

  ```diff
  -.MuiDataGridFilterToolbarButton-list
  +.MuiDataGridToolbarFilterButton-list
  ```

  ```diff
  -<GridColumnsToolbarButton />
  +<GridToolbarColumnsButton />
  ```

  ```diff
  -<GridFilterToolbarButton />
  +<GridToolbarFilterButton />
  ```

  ```diff
  -<GridDensitySelector />
  +<GridToolbarDensitySelector />
  ```

- [DataGrid] Remove `cellClassRules` from `GridColDef` (#1716) @m4theushw

  The `GridCellClassParams` type is not exported anymore. Replace it with `GridCellParams`.

  ```diff
  -import { GridCellClassParams} from '@material-ui/data-grid';
  +import { GridCellParams } from '@material-ui/data-grid';

  -cellClassName: (params: GridCellClassParams) =>
  +cellClassName: (params: GridCellParams) =>
  ```

  The `cellClassRules` in `GridColDef` was removed because it's redundant. The same functionality can be obtained using `cellClassName` and the [`clsx`](https://www.npmjs.com/package/clsx) utility:

  ```diff
  +import clsx from 'clsx';

   {
     field: 'age',
     width: 150,
  -  cellClassRules: {
  -    negative: params => params.value < 0,
  -    positive: params => params.value > 0,
  -  },
  +  cellClassName: params => clsx({
  +    negative: params.value < 0,
  +    positive: params.value > 0,
  +  }),
   }
  ```

- [DataGrid] Fix `onPageChange` doesn't update the `page` when a pagination button is clicked (#1719) @ZeeshanTamboli

  Fix naming of `pageChange` and `pageSizeChange` events variables. The correct event variable name should be prefixed with `GRID_` and converted to UPPER_CASE.

  ```diff
  -import { GRID_PAGESIZE_CHANGED, GRID_PAGE_CHANGED } from '@material-ui/data-grid';
  +import { GRID_PAGESIZE_CHANGE, GRID_PAGE_CHANGE } from '@material-ui/data-grid';
  ```

- [XGrid] The `getEditCellValueParams` method was removed from the `apiRef` (#1767) @m4theushw

  The `getEditCellValueParams` method was almost a straightforward alias of `getEditCellPropsParams`.

  ```diff
  -const { value } = apiRef.current.getEditCellValueParams(id, field);
  +const { props: { value } } = apiRef.current.getEditCellPropsParams(id, field);
  ```

#### Changes

- [DataGrid] Add `getCellClassName` prop (#1687) @m4theushw
- [DataGrid] Add customizable `aria-label`, `aria-labelledby` field (#1764) @ZeeshanTamboli
- [DataGrid] Add Czech (cs-CZ) locale and fix plural rules in Slovak (sk-SK) locale (#1765) @Haaxor1689
- [DataGrid] Fix cell accessibility aria-colindex (#1669) @ZeeshanTamboli
- [DataGrid] Fix changing rows per page size (#1729) @ZeeshanTamboli
- [DataGrid] Fix date operators not working with date-time values (#1722) @m4theushw
- [DataGrid] Fix `rowCount` prop updates (#1697) @dtassone
- [DataGrid] Improve German (de-DE) translation of "errorOverlayDefaultLabel" (#1718) @sebastianfrey
- [DataGrid] Fix accessibility of the filter panel textboxes (#1727) @m4theushw
- [XGrid] Fix `onFilterModelChange` not firing (#1706) @dtassone

### Docs

- [docs] Fix outdated description of `GridRowParams.getValue` (#1731) @visshaljagtap
- [docs] Fix 404 link (#1752) @oliviertassinari
- [docs] Improve Custom edit component demo (#1750) @oliviertassinari
- [docs] Remove redundant customizable pagination section (#1774) @ZeeshanTamboli
- [docs] Improve `GridApi` descriptions (#1767) @m4theushw

### Core

- [core] Batch updates of storybook (#1751) @oliviertassinari
- [core] Help support different documents (#1754) @oliviertassinari
- [core] Upgrade MUI Core v5 to latest version (#1763) @ZeeshanTamboli
- [test] Reduce flakiness (#1753) @oliviertassinari
- [test] Remove skip on Edge (#1708) @m4theushw

## [4.0.0-alpha.29](https://github.com/mui/mui-x/compare/v4.0.0-alpha.28...v4.0.0-alpha.29)

_May 19, 2021_

Big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Performance increased when filtering, sorting, and rendering (#1513) @dtassone
- 💅 Add `columnHeader`, `row` and `cell` to the `classes` prop (#1660) @DanailH
- ✅ Add the `isRowSelectable` prop to disable selection on certain rows (#1659) @m4theushw

  See the documentation for [more details](https://mui.com/x/react-data-grid/selection/#disable-selection-on-certain-rows).

- ⚡️ Add new icon slot to be displayed when the column is unsorted (#1415) @m4theushw
- ⚙ Improve consistency of the API to prepare for the first beta release
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.29 / @material-ui/data-grid@v4.0.0-alpha.29

#### Breaking changes

- [DataGrid] Remove the properties `element`, `rowIndex`, and `colIndex` from all `params` arguments (#1513) @dtassone

  You can use the following `apiRef` methods to replace some of them:

  ```diff
  -params.rowIndex
  -params.colIndex
  +apiRef.current.getRowIndex(params.id)
  +apiRef.current.getColumnIndex(params.field)
  ```

- [DataGrid] Calling `params.getValue` now requires the id to be passed (#1513) @dtassone

  ```diff
  -params.getValue(field)
  +params.getValue(params.id, field)
  ```

- [DataGrid] Rename CSS classes (#1660) @DanailH

  1. `MuiDataGrid-colCellWrapper` to `MuiDataGrid-columnHeaderWrapper`
  2. `MuiDataGrid-colCell` to `MuiDataGrid-columnHeader`
  3. `MuiDataGrid-colCellCheckbox` to `MuiDataGrid-columnHeaderCheckbox`
  4. `MuiDataGrid-colCellSortable` to `MuiDataGrid-columnHeaderSortable`
  5. `MuiDataGrid-colCellCenter` to `MuiDataGrid-columnHeaderCenter`
  6. `MuiDataGrid-colCellLeft` to `MuiDataGrid-columnHeaderLeft`
  7. `MuiDataGrid-colCellRight` to `MuiDataGrid-columnHeaderRight`

- [XGrid] Calling `setCellFocus` now requires the id and field to be passed (#1513) @dtassone

  ```diff
  -apiRef.current.setCellFocus: (indexes: GridCellIndexCoordinates) => void;
  +apiRef.current.setCellFocus: (id: GridRowId, field: string) => void;
  ```

- [XGrid] Rename `apiRef` methods (#1513) @dtassone

  Changes on `apiRef.current`:

  ```diff
  -apiRef.current.getRowIndexFromId: (id: GridRowId) => number;
  +apiRef.current.getRowIndex: (id: GridRowId) => number;
  ```

- [XGrid] Rename `apiRef` methods (#1667) @m4theushw

  Changes on `apiRef.current`:

  ```diff
  -apiRef.current.getColumnFromField: (field: string) => GridColDef;
  -apiRef.current.getRowFromId: (id: GridRowId) => GridRowModel;
  +apiRef.current.getColumn: (field: string) => GridColDef;
  +apiRef.current.getRow: (id: GridRowId) => GridRowModel;
  ```

#### Changes

- [DataGrid] Add Slovak (sk-SK) locale (#1634) @martinvysnovsky
- [DataGrid] Add `columnHeader`, `row` and `cell` in addition to `root` in classes prop (#1660) @DanailH
- [DataGrid] Add `isRowSelectable` prop (#1659) @m4theushw
- [DataGrid] Add sort icon for when column is unsorted (#1415) @m4theushw
- [DataGrid] Fix `id` and `aria-labelledby` attributes on the column menu (#1460) @m4theushw
- [DataGrid] Fix broken checkbox in Material UI v5 (#1587) @ZeeshanTamboli
- [DataGrid] Fix CSS classes prefix (#1693) @m4theushw
- [DataGrid] Fix German (de-DE) locale (#1624) @klinge27
- [DataGrid] Fix filter with object as value and value getter (#1665) @dtassone
- [DataGrid] Fix incorrect date selection (#1652) @aTmb405
- [DataGrid] Fix overflow of maximum page (#1583) @oliviertassinari
- [DataGrid] Fix typo in Italian (it-IT) locale (#1635) @profcav
- [DataGrid] Improve performance of width resizing (#1686) @dtassone
- [DataGrid] Make rows immutable for better developer experience (#1661) @ZeeshanTamboli
- [DataGrid] Pass state values as props (#1628) @m4theushw
- [DataGrid] Improve performance with filtering, sorting, and rendering (#1513) @dtassone
- [XGrid] Fix checkbox column resizing (#1682) @elyesbenabdelkader

### Docs

- [docs] Add description for all events (#1572) @m4theushw
- [docs] Add missing CSS rules (#1694) @ZeeshanTamboli
- [docs] Add missing descriptions in `GridFilterApi` (#1620) @m4theushw
- [docs] Clean demos components (#1681) @oliviertassinari
- [docs] Fix docs demo (#1691) @dtassone
- [docs] Improve Filtering page (#1671) @m4theushw
- [docs] Improve the data grid components page (#1382) @dtassone
- [docs] Refine the descriptions to be clearer (#1589) @oliviertassinari
- [docs] Reshuffle columns and rows styling sections (#1622) @DanailH

### Core

- [core] Fix dependabot config (#1619) @oliviertassinari
- [core] Remove `makeStyles` dependency on `@material-ui/core/styles` (#1627) @mnajdova
- [core] Remove `withStyles` dependency on `@material-ui/core/styles` (#1690) @mnajdova
- [core] Replace `classnames` utility with `clsx` dependency (#1586) @ZeeshanTamboli
- [core] Reuse `colIndex` already computed (#1666) @oliviertassinari
- [test] Add constraints on cell render (#1662) @oliviertassinari
- [test] Catch broken demos (#1692) @oliviertassinari

## [4.0.0-alpha.28](https://github.com/mui/mui-x/compare/v4.0.0-alpha.27...v4.0.0-alpha.28)

_May 10, 2021_

Big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🇹🇷 Add tr-TR locale (#1446) @simsek97
- 🎁 Add support for checkbox component slot (#1528) @ZeeshanTamboli
- ⚡️ Add `onColumnVisibilityChange` prop (#1578) @DanailH
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.28 / @material-ui/data-grid@v4.0.0-alpha.28

#### Breaking changes

- [XGrid] Rename apiRef `toggleColumn` method for consistency (#1578) @DanailH

  ```diff
  -apiRef.current.toggleColumn: (field: string, forceHide?: boolean) => void;
  +apiRef.current.setColumnVisibility: (field: string, isVisible: boolean) => void;
  ```

- [XGrid] Fix event typo (#1574) @DanailH

  ```diff
  -import { GRID_COLUMN_RESIZE_COMMITED } from '@material-ui/x-grid';
  +import { GRID_COLUMN_RESIZE_COMMITTED } from '@material-ui/x-grid';
  ```

#### Changes

- [DataGrid] Add Turkish (tr-TR) locale (#1526) @simsek97
- [DataGrid] Add `onColumnVisibilityChange` prop (#1578) @DanailH
- [DataGrid] Fix date input crash (#1570) @dtassone
- [DataGrid] Fix resulted filter data shows blank screen during pagination (#1571) @ZeeshanTamboli
- [DataGrid] Support Checkbox component slot (#1528) @ZeeshanTamboli
- [DataGrid] Fix column cell and row cell focus style (#1575) @DanailH

### Docs

- [docs] Fix Feature comparison 404 links (#1525) @ZeeshanTamboli
- [docs] Fix focus isn't set on the text box in `Edit using external button` demo (#1515) @ZeeshanTamboli
- [docs] Fix typo of `onColumnResizeCommitted` prop (#1563) @ZeeshanTamboli
- [docs] Header convention for controllable prop (#1531) @oliviertassinari
- [docs] Fix errors in the docs (#1585) @oliviertassinari

### Core

- [core] Add security policy (#1588) @oliviertassinari
- [core] Improve `GridApi` type structure (#1566) @oliviertassinari
- [core] Simplify component type (#1552) @oliviertassinari
- [core] Update monorepo (#1530) @oliviertassinari
- [core] Increase timeout on jsdom (#1532) @oliviertassinari

## [4.0.0-alpha.27](https://github.com/mui/mui-x/compare/v4.0.0-alpha.26...v4.0.0-alpha.27)

_Apr 30, 2021_

Big thanks to the 9 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add getRowClassName prop (#1448) @m4theushw
- ⚡️ Drop support for Node v10 (#1499) @ZeeshanTamboli
- ♿ Make checkbox focusable (#1421) @dtassone
- 🇮🇹 Add it-IT locale (#1446) @profcav
- 🇷🇺 Add ru-RU locale (#1449) @Lukin
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.27 / @material-ui/data-grid@v4.0.0-alpha.27

#### Breaking changes

- [core] Drop support for Node v10 (#1499) @ZeeshanTamboli
- [XGrid] Remove `onAction` APIs (#1453) @DanailH

  These event handlers on the apiRef were duplicating with the react props
  and the event subscribe API. Changes on `apiRef.current`:

  ```diff
  -onFilterModelChange
  -onPageChange
  -onPageSizeChange
  -onResize
  -onUnmount
  -onRowSelected
  -onSelectionModelChange
  -onSortModelChange
  -onStateChange
  ```

  Note: These methods are available as React props.

- [XGrid] Refactor useGridColumnResize (#1380) @DanailH

  Changes on `apiRef.current`:

  ```diff
  -startResizeOnMouseDown
  +setColumnWidth
  ```

#### Changes

- [DataGrid] Add Italian (it-IT) locale (#1446) @profcav
- [DataGrid] Add Russian (ru-RU) locale (#1449) @Lukin
- [DataGrid] Add getRowClassName prop (#1448) @m4theushw
- [DataGrid] Add support for `classes` prop (#1450) @ZeeshanTamboli
- [DataGrid] Allow to customize the overlay when there're no filtered rows (#1445) @m4theushw
- [DataGrid] Correct quantities pl-PL (#1487) @Chriserus
- [DataGrid] Fix autoPageSize with small dataset (#1505) @dtassone
- [DataGrid] Fix delete key for uneditable cells (#1497) @dtassone
- [DataGrid] Fix invalid translation key (#1504) @DanailH
- [DataGrid] Forward props for all Toolbar and Footer components (#1456) @DanailH
- [DataGrid] Improve support of core v5 (#1458) @oliviertassinari
- [DataGrid] Fix multiple focus behaviors (#1421) @dtassone

### Docs

- [docs] Add missing filterModel prop in /api/ (#1518) @imsuvesh
- [docs] Better document how to disable row selection (#1510) @ZeeshanTamboli
- [docs] Fix data grid feature comparison (#1516) @imsuvesh
- [docs] Fix typos (#1447) @ZeeshanTamboli
- [docs] No ads for commercial license (#1489) @oliviertassinari

### Core

- [core] Label our packages as side effect free (#1466) @oliviertassinari
- [core] Reduce work in data grid (#1520) @oliviertassinari
- [core] Remove React.FC (#1436) @ZeeshanTamboli
- [license] No need to test the location (#1488) @oliviertassinari
- [test] Improve test coverage of roving tabindex (#1459) @oliviertassinari
- [test] Remove jest (#1467) @dependabot-preview
- [test] Run more tests in jsdom (#1361) @oliviertassinari

## [4.0.0-alpha.26](https://github.com/mui/mui-x/compare/v4.0.0-alpha.25...v4.0.0-alpha.26)

_Apr 22, 2021_

Big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 💄 Release the cell editing feature (#1287) @dtassone

  This is the first release of the Cell editing feature. You can find the documentation [following this link](https://mui.com/x/react-data-grid/editing/). We have spent the last three months working on it.

  ![cell edit](https://user-images.githubusercontent.com/3165635/115632215-87994700-a307-11eb-91d9-9f5537df0911.gif)

- 🐞 A focus on bug fixes and documentation improvements

### @material-ui/x-grid@v4.0.0-alpha.26 / @material-ui/data-grid@v4.0.0-alpha.26

- [DataGrid] Add support for Editable cells (#1287) @dtassone
- [DataGrid] Add Ukrainian (uk-UA) locale (#1418) @Neonin
- [DataGrid] Fix 'Hide' menu item with `disableColumnSelector` (#1429) @ZeeshanTamboli
- [DataGrid] Fix reset of virtualPage (#1451) @dtassone
- [DataGrid] Fix support for falsy value from valueFormatter (#1425) @zj9495
- [DataGrid] Fix support for numeric ids in selection (#1404) @m4theushw
- [XGrid] Fix multi-sorting when focus is not in the grid root (#1422) @m4theushw

### Docs

- [docs] Add Shift key as option to enable multi-sorting (#1423) @m4theushw
- [docs] Fix x-grid-data-generator dependencies (#1433) @ZeeshanTamboli
- [docs] Improve PropType to cover required props (#1419) @ZeeshanTamboli
- [docs] Remove duplicate rendering page (#1375) @dtassone

### Core

- [core] Setup e2e tests (#1443) @DanailH

  This infrastructure relies on Playwright to control Chrome with the end-to-end API. It differentiates from our current end-to-end tests by running outside of the browser (Karma runs inside). It's slower and doesn't have a great DX, but it allows to test things like the <kbd>Tab</kbd> behavior.

## [4.0.0-alpha.25](https://github.com/mui/mui-x/compare/v4.0.0-alpha.24...v4.0.0-alpha.25)

_Apr 14, 2021_

Big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add boolean column type @m4theushw
- ⚡️ Update to React 17 (#1331) @m4theushw
- ♿ Make column header cells focusable (#1289), and fix roving tabindex (#1327) @DanailH
- 🐛 Ignore event from portal in cells (#1324) @oliviertassinari
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.25 / @material-ui/data-grid@v4.0.0-alpha.25

#### Breaking changes

- [DataGrid] Add support for custom row ids without cloning (#1377) @m4theushw
  This change has involved the following refactorings.

  - Changes on `apiRef.current`.

  ```diff
  -getRowModels: () => GridRowModel[];
  +getRowModels: () => Map<GridRowId, GridRowModel>;

  -getVisibleRowModels: () => GridRowModel[];
  +getVisibleRowModels: () => Map<GridRowId, GridRowModel>;

  -getSelectedRows: () => GridRowModel[];
  +getSelectedRows: () => Map<GridRowId, GridRowModel>;
  ```

  - Changes on `GridFilterModelParams`.

  ```diff
   export interface GridFilterModelParams {
     /**
      * The full set of rows.
      */
  -  rows: GridRowModel[];
  +  rows: Map<GridRowId, GridRowModel>;
    /**
      * The set of currently visible rows.
      */
  -  visibleRows: GridRowModel[];
  +  visibleRows: Map<GridRowId, GridRowModel>;
   }
  ```

- [DataGrid] Upgrade minimum supported version of React to 17.0.0 (#1410) @m4theushw

#### Changes

- [DataGrid] Add boolean column type (#1321) @m4theushw
- [DataGrid] Add missing filter tooltip translations (#1367) @DanailH
- [DataGrid] Fix autoPageSize (#1366) @dtassone
- [DataGrid] Fix performance issue when sorting columns (#1368) @dtassone
- [DataGrid] Fix printable keys to match ag (#1409) @dtassone
- [DataGrid] Ignore event from portal in cells (#1324) @oliviertassinari
- [DataGrid] Make "Checkbox selection" translatable (#1379) @m4theushw
- [DataGrid] Make column header cells focusable (#1289) @DanailH
- [DataGrid] Remove use of row.id when id prop is available (#1371) @m4theushw
- [DataGrid] Make GridMainContainer tabbable (#1327) @DanailH
- [XGrid] Support column reordering inside the whole grid (#1250) @m4theushw

### Docs

- [docs] Fix anchor links on the /data-grid/filtering/ page (#1398) @oliviertassinari
- [docs] Move Column definition to Columns page (#1373) @dtassone
- [docs] Move density to accessibility page (#1374) @dtassone
- [Docs] Fix GitHub references in API docs (#1411) @SaskiaKeil

### Core

- [core] Update to React 17 (#1331) @m4theushw
- [core] Variable convention (#1397) @oliviertassinari
- [license] Use a global storage rather than a module singleton (#1384) @oliviertassinari

## [4.0.0-alpha.24](https://github.com/mui/mui-x/compare/v4.0.0-alpha.23...v4.0.0-alpha.24)

_Apr 2, 2021_

Big thanks to the 8 contributors who made this release possible. Here are some highlights ✨:

- 🇬🇷 Add el-GR locale (#1275) @clytras
- 🇪🇸 Add es-ES locale (#1286) @WiXSL
- 🇯🇵 Add ja-JP locale (#1283) @seed-of-apricot
- 🇳🇱 Add nl-NL locale (#1273) @wimdetroyer
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.24 / @material-ui/data-grid@v4.0.0-alpha.24

#### Breaking Changes

- [DataGrid] All slot components no longer get access to `GridBaseComponentProps` through the props. To use the `GridBaseComponentProps` call the `useGridSlotComponentProps` hook. (#1252) @DanailH
- [DataGrid] Type `GridSlotsComponent` changed (#1252) @DanailH
- [DataGrid] Rename `GridBaseComponentProps` type to `GridSlotComponentProps` (#1252) @DanailH
- [DataGrid] Rename `useGridBaseComponentProps` hook to `useGridSlotComponentProps` (#1252) @DanailH
- [DataGrid] Rename modules (#1292) @DanailH
- [DataGrid] Rename all events related to column reordering, e.g. `GRID_COL_REORDER_START` -> `GRID_COLUMN_REORDER_START` (#1299) @m4theushw
- [DataGrid] Methods `onColItemDragStart`, `onColHeaderDragOver`, `onColItemDragOver`, `onColItemDragEnter` removed from the grid API. Prefer listening to [column reordering events](https://mui.com/x/react-data-grid/column-ordering/) (#1299) @m4theushw
- [DataGrid] Calling `apiRef.current.getColumnHeaderParams` returns a `GridColumnHeaderParams` instead of `GridColParams` (#1299) @m4theushw
- [DataGrid] Events that follow the pattern `GRID_COLUMN_HEADER_xxx` will be called with a `GridColumnHeaderParams` instead of `GridColParams` (#1299) @m4theushw
- [DataGrid] The `renderHeader` will be called with a `GridColumnHeaderParams` instead of `GridColParams` (#1299) @m4theushw
- [DataGrid] The `apiRef.current.moveColumn` was renamed to `apiRef.current.setColumnIndex` (#1299) @m4theushw

#### Changes

- [DataGrid] Fix loader flag from useDemoData hook (#1279) @DanailH
- [DataGrid] Fix page shift after toggling column (#1284) @m4theushw
- [DataGrid] Fix rendering issues (#1319, #1253) @dtassone
- [DataGrid] Refactor edit events to allow stop propagation (#1304) @dtassone

### Core

- [core] Batch small changes (#1310) @oliviertassinari

## [4.0.0-alpha.23](https://github.com/mui/mui-x/compare/v4.0.0-alpha.22...v4.0.0-alpha.23)

_Mar 22, 2021_

Big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add `onRowsScrollEnd` to support infinite loading (#1199) @DanailH
  This is an XGrid feature. Provides the ability to tap into the `onRowsScrollEnd` which is called when the scroll reaches the bottom of the grid viewport allowing developers to load additional data. It can be used with a combination of `scrollBottomThreshold` to control the area in which the `onRowsScrollEnd` is called.

  See the documentation for [more details](https://mui.com/x/react-data-grid/row-updates/#infinite-loading).

- 🕹 Provide the ability to sort by multiple columns using Shift+click (#1203) @dtassone
- 🇵🇱 Added pl-PL locale (#1117) @LarsKumbier
- ⚡️ Edit cell accessibility (#1205) @dtassone
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.23 / @material-ui/data-grid@v4.0.0-alpha.23

- [DataGrid] Add pl-PL locale (#1274) @michallukowski
- [DataGrid] Add onRowsScrollEnd to support infinite loading (#1199) @DanailH
- [DataGrid] Edit Cell Navigation (#1205) @dtassone
- [DataGrid] Fix Popper z-index (#1240) @m4theushw
- [DataGrid] Provide the ability to sort by multiple columns using Shift+click (#1203) @dtassone

### Docs

- [docs] Lazy generate fake data (#1170) @oliviertassinari
- [docs] Fix linking to sorting component in data-grid overview page (#1237) @SaskiaKeil
- [docs] Fix typos (#1198) @cthogg

### Core

- [core] Improve the handling of events (rm capture, add event, add new props) (#1158) @dtassone
- [core] Reinforce that columns are definitions (#1210) @oliviertassinari
- [core] Batch small changes (#1209) @oliviertassinari
- [core] No top-level imports (#1257) @oliviertassinari
- [core] Remove dead code (#1259) @oliviertassinari

## [4.0.0-alpha.22](https://github.com/mui/mui-x/compare/v4.0.0-alpha.21...v4.0.0-alpha.22)

_Mar 9, 2021_

Big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Implement base foundation for editing a cell (#1025) @dtassone.
  This is the foundation on which the feature will be built. Currently, the newly added methods aren't yet ready for being used. This feature will be available in the coming weeks.
- 🇩🇪 Added de-DE locale (#1117) @LarsKumbier
- 📜 Fix scrollbar related issue (#1146) @dtassone
- 🐛 Handle commas in cell values when doing CSV export (#1154) @DanailH

### @material-ui/x-grid@v4.0.0-alpha.22 / @material-ui/data-grid@v4.0.0-alpha.22

- [DataGrid] Add de-DE locale (#1117) @LarsKumbier
- [DataGrid] Fix scrollbar on autopageSize (#1146) @dtassone
- [DataGrid] Fix handling of special chars when doing CSV export (#1154) @DanailH
- [DataGrid] Implement base foundation for editing a cell (#1025) @dtassone
- [DataGrid] Improve edit cell UI (#1168) @oliviertassinari

### Docs

- [docs] Add demo page (#1147) @DanailH
- [docs] Fix typo in localization.md (#1155) @michael-martin-al
- [docs] Improve the description of the individual packages (#1139) @oliviertassinari
- [docs] Fix rendering docs to solve custom pagination issue (#1159) @consDev

### Core

- [core] Add build in eslintignore (#1171) @dtassone
- [core] Increase timeout for XGrid demo (#1150) @oliviertassinari
- [core] Output warnings in the rendered components (#1153) @oliviertassinari
- [core] Update to the HEAD of the monorepo (#1138) @oliviertassinari

## [4.0.0-alpha.21](https://github.com/mui/mui-x/compare/v4.0.0-alpha.20...v4.0.0-alpha.21)

_Feb 27, 2021_

Big thanks to the 7 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add support for CSV export (#1030) @DanailH.
  This is the first iteration of the feature. You can either render the `GridToolbarExport` component in the toolbar or use the apiRef `exportDataAsCsv`/`getDataAsCsv` methods.

  See the documentation for [more details](https://mui.com/x/react-data-grid/export/#csv-export).

- 🌏 Improve the support for custom locales (#1096, #1079, #1109, #1077)
- ♿️ Fix a couple of accessibility issues with the popups (#1105, #1102)

### @material-ui/x-grid@v4.0.0-alpha.21 / @material-ui/data-grid@v4.0.0-alpha.21

#### Breaking changes

- [DataGrid] Prefix all public API to fit into the global Material UI namespace (#1069) @DanailH
  This change gets the data grid one step closer to a stable release. It allows the data grid to fit into the global namespace of Material UI. All the exported modules should have a unique name. It allows the search features, in Google, in the docs, and in the codebase to work effectively and efficiently.

  For the mirgration, prefixing a broken import with "grid" is often enough. In the case it's not working, head to the pull request's description. It [details all the changes](https://github.com/mui/mui-x/pull/1069).

#### Changes

- [DataGrid] Add fr-FR locale (#1079) @oliviertassinari
- [DataGrid] Add missing TablePagination localizations (#1109) @DanailH
- [DataGrid] Add pt-BR locale (#1077) @erikian
- [DataGrid] Fix checked checkbox when empty rows (#1068) @bigandy
- [DataGrid] Fix issue with visible rows state (#1113) @dtassone
- [DataGrid] Fix last row (#1071) @dtassone
- [DataGrid] Fix menu accessible (#1105) @DanailH
- [DataGrid] Fix missing translation filterOperatorAfter key (#1096) @DanailH
- [DataGrid] Fix preferences panel accessibility (#1102) @DanailH
- [DataGrid] Implement CSV export (#1030) @DanailH

### Docs

- [docs] Add expand cell renderer demo (#1070) @dtassone
- [docs] Clarify align is separate from headerAlign (#1074) @alexdanilowicz
- [docs] Clarify product split (#1080) @oliviertassinari

### Core

- [core] Fix storybook pagination stories (#1099) @dtassone
- [core] Pin playwright image to known working version (#1110) @oliviertassinari
- [test] Add visual regression tests (#1081) @oliviertassinari
- [test] Avoid Rate Limit Exceeded (#1059) @oliviertassinari
- [test] Fix containers size for screenshots (#1111) @oliviertassinari
- [test] Fix visual regression flakiness (#1115) @oliviertassinari
- [test] Improve BrowserStack configuration (#1100) @oliviertassinari
- [test] Speed-up rebuild in Karma (#1064) @oliviertassinari

## [4.0.0-alpha.20](https://github.com/mui/mui-x/compare/v4.0.0-alpha.19...v4.0.0-alpha.20)

_Feb 17, 2021_

Big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 📍 Add support for default locales (#983) @DanailH
  We have built the infrastructure to support around 100 [default locales](https://mui.com/x/react-data-grid/localization/#supported-locales). If you have localized the data grid in your application. Please do consider contributing new translations back to Material UI by opening a pull request.
- 🎁 Add new `selectionModel` prop (#986) @dtassone
  The prop can be used to control the selected rows in the data grid. [See the docs](https://mui.com/x/react-data-grid/selection/#controlled-selection).
- 💅 Add support for default props from theme (#1019) @DanailH
- 🙌 Fix scrollbar size on windows (#1061) @dtassone
- 🐛 Polish existing features, fix 9 issues.

### @material-ui/x-grid@v4.0.0-alpha.20 / @material-ui/data-grid@v4.0.0-alpha.20

#### Breaking changes

- [DataGrid] Remove `sortDirection` from column definitions. Consolidate around fewer ways of doing the same thing. (#1015) @dtassone

  ```diff
  -columns[1] = { ...columns[1], sortDirection: 'asc' };

   return (
     <div>
  -   <DataGrid rows={rows} columns={columns} />
  +   <DataGrid rows={rows} columns={columns} sortModel={[{ field: columns[1].field, sort: 'asc' }]} />
     </div>
   );
  ```

- [DataGrid] Rename the `onSelectionChange` prop to `onSelectionModelChange` for consistency. (#986) @dtassone

  ```diff
  -<DataGrid onSelectionChange={selectionChangeHandler} />
  +<DataGrid onSelectionModelChange={onSelectionModelChangeHandler} />
  ```

- [DataGrid] Remove `showToolbar` prop (#948) @DanailH

  ```diff
  -import { DataGrid } from '@material-ui/data-grid';
  +import { DataGrid, GridToolbar } from '@material-ui/data-grid';

  -<DataGrid showToolbar />
  +<DataGrid components={{ Toolbar: GridToolbar }} />
  ```

- [DataGrid] Change page index base, from 1 to 0. (#1021) @dtassone
  This change is done for consistency with `TablePagination` and JavaScript arrays that are 0-based. Material UI still uses a 1-base page for the `Pagination` component that matches the URL's query.

  ```diff
  -const [page, setPage] = React.useState(1);
  +const [page, setPage] = React.useState(0);

   return (
     <div className="grid-container">
       <DataGrid rows={rows} columns={columns} page={page} />
     </div>
   );
  ```

#### Changes

- [DataGrid] Add bg-BG locale (#983) @DanailH
- [DataGrid] Add last of the missing translations (#1033) @DanailH
- [DataGrid] Add support for default props from theme (#1019) @DanailH
- [DataGrid] Fix controllable filters and select all rows with filters (#1020) @dtassone
- [DataGrid] Fix onPageChange and onPageSizeChange event trigger (#1034) @dtassone
- [DataGrid] Fix process is not defined (EXPERIMENTAL_ENABLED) (#1027) @leontastic
- [DataGrid] Fix scrollbar size on windows (#1061) @dtassone
- [DataGrid] Fix warning with v5 (#1038) @oliviertassinari
- [DataGrid] Resolve the api ref at the same time as any other ref (#990) @oliviertassinari
- [DataGrid] Use the disableDensitySelector to disable the DensitySelector (#1031) @DanailH
- [DataGrid] Fix passing [] or undefined in sortModel prop (#1035) @dtassone
- [XGrid] Fix server-side multi filters (#1029) @dtassone

### Docs

- [docs] Add code snippet for localization docs in the data grid (#1024) @DanailH
- [docs] Fix usage of the wrong type (#1062) @oliviertassinari
- [docs] Reduce fears around license upfront @oliviertassinari
- [docs] Update streaming docs (#1013) @dtassone

### Core

- [core] Batch small changes (#991) @oliviertassinari
- [core] Save/restore actual yarn cache folder (#1039) @oliviertassinari
- [test] Increase yarn timeout (#1023) @oliviertassinari
- [test] Link CircleCI URL in BS (#1060) @oliviertassinari

## [4.0.0-alpha.19](https://github.com/mui/mui-x/compare/v4.0.0-alpha.18...v4.0.0-alpha.19)

_Feb 5, 2021_

Big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add getRowId prop (#972) @dtassone
- 🚀 Add streaming delete row api (#980) @dtassone
- 💅 Fix autoHeight (#940) @oliviertassinari
- 🙌 Enable the data grid to work under strict mode (#933) @dtassone
- ⚡️ Add component slots for toolbar and preference panel (#971) @DanailH
- 🐛 Polish existing features, fix 9 issues.

### @material-ui/x-grid@v4.0.0-alpha.19 / @material-ui/data-grid@v4.0.0-alpha.19

- [DataGrid] Add component slots for toolbar and preference panel (#971) @DanailH
- [DataGrid] Add getRowId prop (#972) @dtassone
- [DataGrid] Add streaming delete row api (#980) @dtassone
- [DataGrid] Fix autoHeight (#940) @oliviertassinari
- [DataGrid] Fix column reorder instability (#950) @dtassone
- [DataGrid] Fix footer visual regression (#932) @dtassone
- [DataGrid] Fix strict mode issue with apiRef (#933) @dtassone
- [DataGrid] Work on the accessibility of the column menu (#900) @zj9495
- [DataGrid] Fix timing guarantee (#981) @oliviertassinari
- [DataGrid] Fix unstable footer height (#937) @oliviertassinari
- [DataGrid] Fix usage of the prop-types API (#955) @oliviertassinari
- [DataGrid] Fix duplicate aria-label (#953) @oliviertassinari

### docs

- [docs] Add sorting page in datagrid docs (#931) @dtassone
- [docs] Api page update with component slots (#969) @dtassone
- [docs] Catch leaks ahread of time (#979) @oliviertassinari
- [docs] Fix immutability with filter operator demos (#975) @dtassone
- [docs] Improve docs of DataGrid about filter operators (#973) @SaskiaKeil
- [docs] Improve the docs for the filtering feature (#945) @dtassone

### core

- [core] Add 'Order id 💳' section in issues (#952) @oliviertassinari
- [core] Improve prop-types handling (#978) @oliviertassinari
- [core] Investigate bundle size (#954) @oliviertassinari

## [4.0.0-alpha.18](https://github.com/mui/mui-x/compare/v4.0.0-alpha.17...v4.0.0-alpha.18)

_Jan 26, 2021_

Big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🎁 Add support for Material UI v5-alpha (#855) @DanailH.
  The data grid supports Material UI v4 and v5. We aim to retain the support for v4 as long as v5 hasn't reached the beta phase.
- 💅 Update the customization API to be closer to Material UI v5.
  The data grid accepts two props: `components` and `componentsProps`.
  The first prop allows to swapping specific components used in slots the grid, like the checkboxes.
  The second one allows providing extra props to each slot. It avoids the need for using the React context to access information from outside the data grid.

  See the [RFC](https://github.com/mui/material-ui/issues/21453) for more details.

- 🐛 Polish existing features, fix 3 issues.

### @material-ui/x-grid@v4.0.0-alpha.18 / @material-ui/data-grid@v4.0.0-alpha.18

#### Breaking changes

- [DataGrid] Implement customization pattern of Material UI v5 (#851, #879) @dtassone

  - Capitalize the keys of the `components` prop. This change aims to bring consistency with the customization pattern of Material UI v5:

  ```diff
   <DataGrid
     components={{
  -    noRowsOverlay: CustomNoRowsOverlay,
  +    NoRowOverlay: CustomNoRowsOverlay,
     }}
   />
  ```

  - Move all the icon components overrides in the `components` prop. And added the suffix 'Icon' on each icon component. This change aims to bring consistency with the customization pattern of Material UI v5:

  ```diff
   <DataGrid
  -  icons: {{
  -    ColumnSortedAscending: SortedAscending,
  -  }},
  +  components={{
  +    ColumnSortedAscendingIcon: SortedAscending,
  +  }}
   />
  ```

  - Change the props provided to the component of the `components` prop. Expose the whole state instead of an arbitrary set of props:

  ```diff
  -function CustomPagination(props: ComponentProps) {
  -  const { pagination, api } = props;
  +function CustomPagination(props: BaseComponentProps) {
  +  const { state, api } = props;

     return (
       <Pagination
  -      page={pagination.page}
  -      count={pagination.pageCount}
  +      page={state.pagination.page}
  +      count={state.pagination.pageCount}

   // ...

   <DataGrid components={{ Pagination: CustomPagination }} />
  ```

#### Changes

- [DataGrid] Add customisation on panels (#890) @dtassone
- [DataGrid] Add support for Material UI v5-alpha (#855) @DanailH
- [DataGrid] Fix footer count not shown on small screen (#899) @mnajdova
- [DataGrid] Fix column selector crash when hiding columns (#875) @DanailH
- [DataGrid] Fix <kbd>Shift</kbd> + <kbd>Space</kbd> keyboard regression to select row (#897) @dtassone

### docs

- [docs] Fix imports for x-grid-data-generator (#887) @DanailH
- [docs] Skip download of playwright for docs @oliviertassinari
- [CHANGELOG] Polish @oliviertassinari

### core

- [core] Automation for duplicate issues (#878) @oliviertassinari
- [core] Replace commander with yargs (#872) @dependabot-preview
- [core] Update monorepo (#884) @oliviertassinari

## [4.0.0-alpha.17](https://github.com/mui/mui-x/compare/v4.0.0-alpha.15...v4.0.0-alpha.17)

_Jan 14, 2021_

Big thanks to the 4 contributors who made this release possible. Here are some highlights ✨:

- 🎛 Add support for Column selector (#837) @DanailH @dtassone.
  The feature can be triggered from the toolbar or the column menu. Check [the documentation](https://mui.com/x/react-data-grid/column-definition/#column-selector).

  ![column selector](https://user-images.githubusercontent.com/3165635/104791267-6ff77300-579a-11eb-9338-11a8fde83258.gif)

- 🐛 A focus on fixing regressions from previous releases refactoring and bugs.

### @material-ui/x-grid@v4.0.0-alpha.17 / @material-ui/data-grid@v4.0.0-alpha.17

- [DataGrid] Fix `onPageChange` firing too often (#838) @dtassone
- [DataGrid] Fix behavior of the `hideFooter` prop (#846) @dtassone
- [DataGrid] Fix the display logic for "error messages" (#843) @dtassone
- [DataGrid] Fix wrong initial sort order (#841) @dtassone
- [DataGrid] Remove tslib dependency from packages (#832) @oliviertassinari

### Docs

- [docs] Add docs for data grid column selector (#837) @DanailH
- [docs] Clarify feature split between Pro and Premium (#779) @oliviertassinari

### Core

- [core] Add tests for Column selector feature (#845) @DanailH

## [4.0.0-alpha.15](https://github.com/mui/mui-x/compare/v4.0.0-alpha.14...v4.0.0-alpha.15)

_Jan 7, 2021_

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

## [4.0.0-alpha.14](https://github.com/mui/mui-x/compare/v4.0.0-alpha.13...v4.0.0-alpha.14)

_Dec 31, 2020_

Big thanks to the 5 contributors who made this release possible. Here are some highlights ✨:

- 🌎 Add support for internationalization (#718) @DanailH

  You can use the `localeText` prop to provide custom wordings in the data grid.
  Check the documentation for [a demo](https://mui.com/x/react-data-grid/localization/#translation-keys).

- 📚 Start documenting the filtering feature 🧪 (#754) @dtassone

  The work in progress filtering feature and documentation can be found following [this link](https://mui.com/x/react-data-grid/filtering/). Early feedback are welcome.

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

## [4.0.0-alpha.13](https://github.com/mui/mui-x/compare/v4.0.0-alpha.12...v4.0.0-alpha.13)

_Dec 16, 2020_

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

## [4.0.0-alpha.12](https://github.com/mui/mui-x/compare/v4.0.0-alpha.11...v4.0.0-alpha.12)

_Dec 9, 2020_

Big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🔍 Add a new data grid [density selector](https://mui.com/x/react-data-grid/accessibility/#density) feature (#606) @DanailH.
- 💄 A first iteration on the data grid's toolbar.
- 🧪 Continue the iteration on the data grid filtering feature, soon to be released @dtassone.

### @material-ui/x-grid@v4.0.0-alpha.12 / @material-ui/data-grid@v4.0.0-alpha.12

#### Changes

- [DataGrid] Add Density selector (#606) @DanailH
- [DataGrid] Fix swallowing of keyboard events (#673) @DanailH
- [DataGrid] Fix collision with react-virtualized on detectElementResize (#678) @tifosiblack
- [DataGrid] Fix component name, rm context, refact gridComponent (#707) @dtassone
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

## [4.0.0-alpha.11](https://github.com/mui/mui-x/compare/v4.0.0-alpha.10...v4.0.0-alpha.11)

_Dec 2, 2020_

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

- [docs] Data grid depends on side effects (#666) @oliviertassinari
- [docs] Clarify the purpose of x-grid-data-generator (#634) @Elius94
- [docs] Data grid is in the lab (#612) @oliviertassinari
- [docs] Fix Demo app, downgrade webpack-cli, known issue in latest version (#647) @dtassone
- [docs] Fix typo in columns.md @stojy
- [docs] Reduce confusion on /export page (#646) @SerdarMustafa1

### Core

- [core] Introduce a feature toggle (#637) @oliviertassinari
- [core] Remove gitHead (#669) @oliviertassinari
- [core] Remove react-select (#658) @dependabot-preview
- [core] Replace Storybook knobs for args (#601) @tooppaaa
- [core] Update to Material UI v4.11.1 (#636) @oliviertassinari

## [4.0.0-alpha.10](https://github.com/mui/mui-x/compare/v4.0.0-alpha.9...v4.0.0-alpha.10)

_Nov 20, 2020_

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

## [4.0.0-alpha.9](https://github.com/mui/mui-x/compare/v4.0.0-alpha.8...v4.0.0-alpha.9)

_Nov 9, 2020_

### @material-ui/x-grid@v4.0.0-alpha.9 / @material-ui/data-grid@v4.0.0-alpha.9

- [DataGrid] Fix keyboard with multiple grids (#562) @dtassone
- [DataGrid] Add touch support on column resize (#537) @DanailH
- [DataGrid] Refactor containerSizes in smaller state (#544) @dtassone
- [DataGrid] Fix display of row count and selected rows on mobile (#508) @oliviertassinari
- [DataGrid] Apply review from #412 (#515) @oliviertassinari
- [DataGrid] Avoid paint step (#531) @oliviertassinari
- [DataGrid] Refactor rendering, remove rafUpdate (#532) @dtassone
- [DataGrid] Add missing reselect dependency (#534) @dtassone
- [DataGrid] Raf Timer stored in apiRef (#506) @dtassone
- [DataGrid] Fix webpack v5 support (#449) @oliviertassinari
- [DataGrid] Rework columnReorder to work with the new state management (#505) @DanailH
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
- [core] Improve types (#448) @oliviertassinari
- [core] Run prettier (#482) @oliviertassinari
- [core] Disable generation of changelogs @oliviertassinari
- [test] Karma should fail if errors are thrown (#543) @oliviertassinari

## [4.0.0-alpha.8](https://github.com/mui/mui-x/compare/v4.0.0-alpha.7...v4.0.0-alpha.8)

_Oct 23, 2020_

### @material-ui/x-grid@v4.0.0-alpha.8 / @material-ui/data-grid@v4.0.0-alpha.8

- [DataGrid] Fix header row tabIndex (#478) @DanailH
- [DataGrid] Reduce dependency on lodash, save 1kB gzipped (#450) @oliviertassinari
  The DataGrid goes from [28.2 kB](https://bundlephobia.com/result?p=@material-ui/data-grid@4.0.0-alpha.7) gzipped down to [27.3 kB](https://bundlephobia.com/result?p=@material-ui/data-grid@4.0.0-alpha.8) gzipped.
- [XGrid] Second iteration on resizing logic (#436) @oliviertassinari
  Fix 8 bugs with the resizing.

### Core

- [core] Remove usage of LESS (#467) @dependabot-preview
- [core] Update to the latest version of the main repo (#456) @oliviertassinari

## [4.0.0-alpha.7](https://github.com/mui/mui-x/compare/v4.0.0-alpha.6...v4.0.0-alpha.7)

_Oct 19, 2020_

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

## [4.0.0-alpha.6](https://github.com/mui/mui-x/compare/v4.0.0-alpha.2...v4.0.0-alpha.6)

_Sep 25, 2020_

### @material-ui/x-grid@v4.0.0-alpha.6 / @material-ui/data-grid@v4.0.0-alpha.6

- [DataGrid] Throw if rows id is missing (#349) @dtassone
- [DataGrid] Fix valueGetter sorting (#348) @dtassone
- [DataGrid] Fix typings and packages assets (#339) @dtassone
- [DataGrid] Add npm keywords (#304) @oliviertassinari

### Docs

- [docs] Avoid double borders (#340) @oliviertassinari
- [docs] Fix layout jump issue (#338) @oliviertassinari
- [docs] Fix short description warning (#302) @oliviertassinari

## [4.0.0-alpha.2](https://github.com/mui/mui-x/compare/v4.0.0-alpha.1...v4.0.0-alpha.2)

_Sep 18, 2020_

- [DataGrid] Fix wrongly exported types (#298) @dtassone

## [4.0.0-alpha.1](https://github.com/mui/mui-x/compare/v0.1.67...v4.0.0-alpha.1)

_Sep 17, 2020_

This is the first public alpha release of the component after 6 months of development since the initial commit (March 15th 2020).
`@material-ui/data-grid` is licensed under MIT while `@material-ui/x-grid` is licensed under a commercial license.
You can find the documentation at this address: https://mui.com/x/react-data-grid/.

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
