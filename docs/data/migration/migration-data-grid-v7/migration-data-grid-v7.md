---
title: React Data Grid - Migration from v7 to v8
productId: x-data-grid
---

# Migration from v7 to v8

<p class="description">This guide describes the changes needed to migrate the Data Grid from v7 to v8.</p>

## Introduction

This is a reference guide for upgrading `@mui/x-data-grid` from v7 to v8.

## Start using the new release

In `package.json`, change the version of the Data Grid package to `next`.

```diff
-"@mui/x-data-grid": "^7.x.x",
+"@mui/x-data-grid": "next",

-"@mui/x-data-grid-pro": "^7.x.x",
+"@mui/x-data-grid-pro": "next",

-"@mui/x-data-grid-premium": "^7.x.x",
+"@mui/x-data-grid-premium": "next",
```

Using `next` ensures that it will always use the latest v8 pre-release version, but you can also use a fixed version, like `8.0.0-alpha.0`.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v8. You can run `v8.0.0/data-grid/preset-safe` targeting only Data Grid or `v8.0.0/preset-safe` to target the other packages as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

<!-- #default-branch-switch -->

```bash
# Data Grid specific
npx @mui/x-codemod@latest v8.0.0/data-grid/preset-safe <path>

# Target the other packages as well
npx @mui/x-codemod@latest v8.0.0/preset-safe <path>
```

:::info
If you want to run the transformers one by one, check out the transformers included in the [preset-safe codemod for data grid](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-data-grid-v800) for more details.
:::

Breaking changes that are handled by this codemod are prefixed with a ✅ emoji.

If you have already applied the `v8.0.0/data-grid/preset-safe` (or `v8.0.0/preset-safe`) codemod, then you should not need to take any further action on these items.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies, etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<DataGrid {...dataGridProps} />
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
:::

## Breaking changes

Since v8 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v7 to v8.

## `@mui/material` peer dependency change

The `@mui/material` peer dependency has been updated to `^7.0.0` in an effort to smoothen the adoption of hybrid ESM and CJS support.
This change should resolve ESM and CJS interoperability issues in various environments.

:::info
The migration to `@mui/material` v7 should not cause too many issues as it has limited amount of breaking changes.

- [Upgrade](/material-ui/migration/upgrade-to-v6/) to `@mui/material` v6
- [Upgrade](/material-ui/migration/upgrade-to-v7/) to `@mui/material` v7

:::

### Setting license key

The deprecated `LicenseInfo` export was removed from the `@mui/x-data-grid-pro` and `@mui/x-data-grid-premium` packages.
You have to import it from `@mui/x-license` instead:

```diff
-import { LicenseInfo } from '@mui/x-data-grid-pro';
-import { LicenseInfo } from '@mui/x-data-grid-premium';
+import { LicenseInfo } from '@mui/x-license';

 LicenseInfo.setLicenseKey('YOUR_LICENSE_KEY');
```

### Props

- Passing additional props (like `data-*`, `aria-*`) directly on the Data Grid component is no longer supported. To pass the props, use `slotProps`:
  - For the `.root` element, use `slotProps.root`
  - For the `.main` element (the one with `role="grid"`), use `slotProps.main`

### Selection

- The default value of the `rowSelectionPropagation` prop has been changed to `{ parents: true, descendants: true }` which means that the selection will be propagated to the parents and descendants by default.
  To revert to the previous behavior, pass `rowSelectionPropagation={{ parents: false, descendants: false }}`.
- ✅ The prop `indeterminateCheckboxAction` has been removed. Clicking on an indeterminate checkbox "selects" the unselected descendants.
- The "Select all" checkbox would now be checked when all the selectable rows are selected, ignoring rows that are not selectable because of the `isRowSelectable` prop.
- The row selection model has been changed from `GridRowId[]` to `{ type: 'include' | 'exclude'; ids: Set<GridRowId> }`.
  Using `Set` allows for a more efficient row selection management.
  The `exclude` selection type allows to select all rows except the ones in the `ids` set.

  This change impacts the following props:

  - `rowSelectionModel`
  - `onRowSelectionModelChange`
  - `initialState.rowSelectionModel`

  ```diff
  -const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>([]);
  +const [rowSelectionModel, setRowSelectionModel] = React.useState<GridRowSelectionModel>({ type: 'include', ids: new Set() });
  ```

  This change also impacts the `gridRowSelectionStateSelector` selector.
  For convenience, use the `gridRowSelectionManagerSelector` selector to handle both selection types:

  ```diff
  -const rowSelection = gridRowSelectionStateSelector(apiRef);
  -const isRowSelected = rowSelection.includes(rowId);
  +const rowSelectionManager = gridRowSelectionManagerSelector(apiRef);
  +const isRowSelected = rowSelectionManager.has(rowId);
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

### Changes to the public API

- ✅ The `rowPositionsDebounceMs` prop was removed.
- The `resetPageOnSortFilter` prop was removed. The Data Grid now goes back to the first page after sort or filter is applied.
- The `apiRef.current.resize()` method was removed.
- The `apiRef.current.forceUpdate()` method was removed. Use selectors combined with `useGridSelector()` hook to react to changes in the state.
- The `<GridOverlays />` component is not exported anymore.
- The `<GridSaveAltIcon />` icon is not exported anymore. Import `SaveAlt` from `@mui/icons-material` instead.
- The `sanitizeFilterItemValue()` utility is not exported anymore.
- `gridRowsDataRowIdToIdLookupSelector` was removed. Use `gridRowsLookupSelector` in combination with `getRowId()` API method instead.

  ```diff
  -const idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);
  -const rowId = idToIdLookup[id];
  +const rowsLookup = gridRowsLookupSelector(apiRef);
  +const rowId = apiRef.current.getRowId(rowsLookup[id]);
  ```

- ✅ The feature row spanning is now stable.

  ```diff
   <DataGrid
  -  unstable_rowSpanning
  +  rowSpanning
   />
  ```

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

- Return type of the `useGridApiRef()` hook and the type of `apiRef` prop are updated to explicitly include the possibilty of `null`. In addition to this, `useGridApiRef()` returns a reference that is initialized with `null` instead of `{}`.

  Only the initial value and the type are updated. Logic that initializes the API and its availability remained the same, which means that if you could access API in a particular line of your code before, you are able to access it as well after this change.

  Depending on the context in which the API is being used, you can decide what is the best way to deal with `null` value. Some options are:

  - Use optional chaining
  - Use non-null assertion operator if you are sure your code is always executed when the `apiRef` is not `null`
  - Return early if `apiRef` is `null`
  - Throw an error if `apiRef` is `null`

- `GridSortItem` interface is not exported anymore.
- `createUseGridApiEventHandler()` is not exported anymore.
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

- The quick filter is now shown in the toolbar by default. Use `slotProps={{ toolbar: { showQuickFilter: false } }}` to hide it.

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

### Behavioral changes

- The "Reset" button in the column visibility panel now resets to the initial column visibility model instead of the model when the panel was opened. The reset behavior follows these rules:

  1. If an initial `columnVisibilityModel` is provided, it resets to that model.
  2. If a controlled `columnVisibilityModel` is provided, it resets to the first model value.
  3. When the columns are updated (via the `columns` prop or `updateColumns()` API method), the reset reference point updates to the current `columnVisibilityModel`.

  To revert to the previous behavior, provide a custom component to the `slots.columnsManagement`.

- The density selector has been removed from the toolbar. It is still possible to set the density programmatically via the `density` prop. A density selector can be added to a custom toolbar passed to `slots.toolbar`. See [Toolbar component—Settings menu](/x/react-data-grid/components/toolbar/#settings-menu) for an example.

### Localization

- If `estimatedRowCount` is used, the text provided to the [Table Pagination](/material-ui/api/table-pagination/) component from the Material UI library is updated and requires additional translations. Check the example at the end of [Index-based pagination section](/x/react-data-grid/pagination/#index-based-pagination).

### Accessibility

- The Grid is more aligned with the WAI-ARIA authoring practices and sets the `role` attribute to `treegrid` if the Data Grid is used with row grouping feature.

### State

- The selectors signature has been updated. They are only accepting `apiRef` as a first argument. Some selectors support additional arguments.

  ```diff
  -mySelector(state, instanceId)
  +mySelector(apiRef)
  ```

  or

  ```diff
  -mySelector(state, instanceId)
  +mySelector(apiRef, arguments)
  ```

- The `useGridSelector()` signature has been updated due to the introduction of arguments parameter in the selectors. Pass `undefined` as `arguments` if the selector doesn't use any arguments.

  ```diff
  -const output = useGridSelector(apiRef, selector, equals);
  +const output = useGridSelector(apiRef, selector, arguments, equals);
  ```

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

### Other exports

- ✅ `ariaV8` experimental flag is removed. It's now the default behavior.
- Subcomponents that are in a React Portal must now be wrapped with `GridPortalWrapper`

### Filtering

- The clear button in header filter cells has moved to the header filter menu. Use `slotProps={{ headerFilterCell: { showClearIcon: true } }}` to restore the clear button in the cell.
- Custom filter input components typings have been modified.

### CSS classes and styling

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
- The `main--hasSkeletonLoadingOverlay` class has been renamed to `main--hiddenContent` and is now also applied when the "No columns" overlay is displayed.

### Slots

- The `base*` slots have a new set of typings.
- The `baseFormControl` slot was removed.
- The `baseInputLabel` slot was removed.
- The `baseInputAdornment` slot was removed.
- The `pagination` slot has been mostly refactored to `basePagination`.
- The `paper` slot has been renamed to `panelContent`.

<!-- ### Editing

TBD
