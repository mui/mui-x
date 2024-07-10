# Change Log for v4 releases

## 4.0.0

_Aug 27, 2021_

🎉 This is the first stable release of the data grid component 🎉!

We have been iterating on the component for [18 months](https://github.com/mui/mui-x/commit/705cb0f387b5f3aa056bf40c4183a2342b317447). With the introduction of the [row edit](https://mui.com/x/react-data-grid/editing/#row-editing) feature, many bug fixes, and polishing of the documentation, we believe the component is ready for a stable release.

The MUI X v4.0.0 release supports [MUI Core](https://github.com/mui/material-ui) v4 and has partial support for v5-beta. With the soon-to-be-released v5 version of the core components, we are moving ongoing work to the v5 release line (Core and X).
The support for existing projects on Material UI v4 won't be a priority going forward. We encourage you to migrate to MUI Core v5-beta and soon MUI X v5-beta. We don't patch, fix, or alter older versions. Using MUI Core v4 with MUI X v5 might lead to extra bundle size and configuration.

A big thanks to the 6 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Introduce the [row editing](https://mui.com/x/react-data-grid/editing/#row-editing) feature (#2098) @m4theushw

  <img src="https://user-images.githubusercontent.com/3165635/130665023-3c0730ab-502e-4da1-8bc1-d572427ad2d6.gif" width="851" height="382" alt="Row editing example" />

- ⚡️ Rename the `XGrid` component to `DataGridPro` (#2382) @m4theushw

  This should help clarify the products vs. plans separation. [MUI X](https://github.com/mui/mui-x) is a product line on its own. It contains MIT and Commercial software. Removing X from the name of the paid components should help remove a possible confusion: the MIT version of X is meant to be valuable enough for developers to use it, without feeling that it's crippled compared to other OSS alternatives.
  The Pro suffix should help make it clear what's MIT and what's not.

- ✨ Rename the `@material-ui` npm scope to `@mui` (#2341) @oliviertassinari

  This is part of the ongoing rebranding of the project and company. Material UI is our current official company name, however, we are going to change it. It's too long to write, read, and pronounce; and it is too closely associated with Material Design.
  In the near future, the whole company is moving to MUI and https://mui.com/.

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
- [test] Use `.not.to.equal` in favor of `.to.not.equal` (#2340) @oliviertassinari

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
- [docs] Generate API doc for the GridExportCSVOptions interface (#2102) @flaviendelangle
- [docs] Handle generics in API doc generation (#2210) @flaviendelangle

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
- 🌎 Isolate translations from MUI Core and MUI X (#1913) @DanailH
- 🚀 Improve performance when finding column indexes and updating rows (#1903, #1923) @Janpot @N2D4
- 🐞 Bugfixes

### @material-ui/x-grid@v4.0.0-alpha.32 / @material-ui/data-grid@v4.0.0-alpha.32

#### Breaking changes

- [DataGrid] The `onEditCellChangeCommitted` prop won't be called with an event when committing changes by clicking outside the cell (#1910) @m4theushw
- [DataGrid] Translation for MUI Core components are no longer included in the MUI X translation (#1913) @DanailH

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
- [DataGrid] Include MUI Core component localizations in `localeText` (#1913) @DanailH
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
- [core] Upgrade MUI Core v5 to latest version (#1763) @ZeeshanTamboli
- [test] Reduce flakiness (#1753) @oliviertassinari
- [test] Remove skip on Edge (#1708) @m4theushw

## [4.0.0-alpha.29](https://github.com/mui/mui-x/compare/v4.0.0-alpha.28...v4.0.0-alpha.29)

_May 19, 2021_

Big thanks to the 11 contributors who made this release possible. Here are some highlights ✨:

- 🚀 Performance increased when filtering, sorting, and rendering (#1513) @dtassone
- 💅 Add `columnHeader`, `row` and `cell` to the `classes` prop (#1660) @DanailH
- ✅ Add the `isRowSelectable` prop to disable selection on certain rows (#1659) @m4theushw

  See the documentation for [more details](https://v4.mui.com/components/data-grid/selection/#disable-selection-on-certain-rows).

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
- [DataGrid] Fix broken checkbox in Material UI v5 (#1587) @ZeeshanTamboli
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
- [DataGrid] Rename all events related to column reordering, for example `GRID_COL_REORDER_START` -> `GRID_COLUMN_REORDER_START` (#1299) @m4theushw
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

- [DataGrid] Prefix all public API to fit into the global Material UI namespace (#1069) @DanailH
  This change gets the data grid one step closer to a stable release. It allows the data grid to fit into the global namespace of Material UI. All the exported modules should have a unique name. It allows the search features, in Google, in the docs, and in the codebase to work effectively and efficiently.

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
  We have built the infrastructure to support around 100 [default locales](https://mui.com/x/react-data-grid/localization/#supported-locales). If you have localized the data grid in your application. Please do consider contributing new translations back to Material UI by opening a pull request.
- 🎁 Add new `selectionModel` prop (#986) @dtassone
  The prop can be used to control the selected rows in the data grid. [See the docs](https://v4.mui.com/components/data-grid/selection/#controlled-selection).
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
  This change is done for consistency with `TablePagination` and JavaScript arrays that are 0-based. Material UI still uses a 1-base page for the `Pagination` component that matches the URL's query.

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
- [DataGrid] Resolve the apiRef at the same time as any other ref (#990) @oliviertassinari
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
- 🚀 Add streaming delete row API (#980) @dtassone
- 💅 Fix autoHeight (#940) @oliviertassinari
- 🙌 Enable the data grid to work under strict mode (#933) @dtassone
- ⚡️ Add component slots for toolbar and preference panel (#971) @DanailH
- 🐛 Polish existing features, fix 9 issues.

### @material-ui/x-grid@v4.0.0-alpha.19 / @material-ui/data-grid@v4.0.0-alpha.19

- [DataGrid] Add component slots for toolbar and preference panel (#971) @DanailH
- [DataGrid] Add getRowId prop (#972) @dtassone
- [DataGrid] Add streaming delete row API (#980) @dtassone
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
- [docs] API page update with component slots (#969) @dtassone
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

- 🎁 Add support for Material UI v5-alpha (#855) @DanailH.
  The data grid supports Material UI v4 and v5. We aim to retain the support for v4 as long as v5 hasn't reached the beta phase.
- 💅 Update the customization API to be closer to Material UI v5.
  The data grid accepts two props: `components` and `componentsProps`.
  The first prop allows to swapping specific components used in slots the grid, like the checkboxes.
  The second one allows providing extra props to each slot. It avoids the need for using the React context to access information from outside the data grid.

  See the [RFC](https://github.com/mui/material-ui/issues/21453) for more details.

- 🐛 Polish existing features, fix 3 issues.

### @material-ui/x-grid@v4.0.0-alpha.18 / @material-ui/data-grid@v4.0.0-alpha.18

#### Breaking changes

- [DataGrid] Implement customization pattern of Material UI v5 (#851, #879) @dtassone

  - Capitalize the keys of the `components` prop. This change aims to bring consistency with the customization pattern of Material UI v5:

  ```diff
   <DataGrid
     components={{
  -    noRowsOverlay: CustomNoRowsOverlay,
  +    NoRowOverlay: CustomNoRowsOverlay,
     }}
   />
  ```

  - Move all the icon components overrides in the `components` prop. And added the suffix 'Icon' on each icon component. This change aims to bring consistency with the customization pattern of Material UI v5:

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
- [DataGrid] Add support for Material UI v5-alpha (#855) @DanailH
- [DataGrid] Fix footer count not shown on small screen (#899) @mnajdova
- [DataGrid] Fix column selector crash when hiding columns (#875) @DanailH
- [DataGrid] Fix <kbd>Shift</kbd> + <kbd>Space</kbd> keyboard regression to select row (#897) @dtassone

### docs

- [docs] Fix imports for x-grid-data-generator (#887) @DanailH
- [docs] Skip download of playwright for docs @oliviertassinari
- [changelog] Polish @oliviertassinari

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
- [changelog] Use the format of the main repository @oliviertassinari

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

- [docs] Add missing props to DataGrid and XGrid API pages (#721) @DanailH
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
- [core] Update to Material UI v4.11.1 (#636) @oliviertassinari

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

- [core] Prepare work for a future public state API (#533) @dtassone
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

- [DataGrid] Add API pages for data-grid and x-grid (#289) @dtassone
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
