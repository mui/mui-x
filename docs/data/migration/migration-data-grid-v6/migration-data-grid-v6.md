---
productId: x-data-grid
---

# Migration from v6 to v7

<!-- #default-branch-switch -->

<p class="description">This guide describes the changes needed to migrate the Data Grid from v6 to v7.</p>

<!-- ## Introduction

To get started, check out [the blog post about the release of MUI X v6](https://mui.com/blog/mui-x-v6/). -->

## Start using the new release

In `package.json`, change the version of the data grid package to `next`.

```diff
-"@mui/x-data-grid": "6.x.x",
+"@mui/x-data-grid": "next",
```

Since v7 is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from v6 to v7.

## Update `@mui/material` package

To have the option of using the latest API from `@mui/material`, the package peer dependency version has been updated to `^5.15.0`.
It is a change in minor version only, so it should not cause any breaking changes.
Please update your `@mui/material` package to this or a newer version.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v7.
You can run `v7.0.0/data-grid/preset-safe` targeting only Data Grid or `v7.0.0/preset-safe` to target other MUI X components like Date and Time pickers as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

```bash
// Data Grid specific
npx @mui/x-codemod@next v7.0.0/data-grid/preset-safe <path>
// Target other MUI X components as well
npx @mui/x-codemod@next v7.0.0/preset-safe <path>
```

:::info
If you want to run the codemods one by one, check out the codemods included in the [preset-safe codemod for data grid](https://github.com/mui/mui-x/blob/HEAD/packages/x-codemod/README.md#preset-safe-for-data-grid-v700) for more details.
:::

Breaking changes that are handled by `preset-safe` codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen or next to the specific point that is handled by it.

If you have already applied the `v7.0.0/data-grid/preset-safe` (or `v7.0.0/preset-safe`) codemod, then you should not need to take any further action on these items. If there's a specific part of the breaking change that is not part of the codemod or needs some manual work, it will be listed in the end of each section.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies, etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<DataGrid {...newProps} />
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
:::

## Breaking changes

Since v7 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v6 to v7.

### DOM changes

The layout of the grid has been substantially altered to use CSS sticky positioned elements. As a result, the following changes have been made:

- The main element now corresponds to the virtal scroller element.
- Headers are now contained in the virtual scroller.
- Pinned row and column sections are now contained in the virtual scroller.

<!-- ### Renamed props

- -->

### Removed props

- The deprecated props `components` and `componentsProps` have been removed. Use `slots` and `slotProps` instead. See [components section](/x/react-data-grid/components/) for more details.
- The `slots.preferencesPanel` slot and the `slotProps.preferencesPanel` prop were removed. Use `slots.panel` and `slotProps.panel` instead.
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

### Behavioral changes

- The disabled column specific features like `hiding`, `sorting`, `filtering`, `pinning`, `row grouping`, etc could now be controlled programmatically using `initialState`, respective controlled models, or the [API object](/x/react-data-grid/api-object/).

Here's the list of affected features, colDef flags and props to disable them and the related props and API methods to control them programmatically.

{{"demo": "ColDefChangesGridNoSnap.js", "bg": "inline", "hideToolbar": true}}

### State access

- Some selectors now require passing `instanceId` as a second argument:
  ```diff
  - gridColumnFieldsSelector(apiRef.current.state);
  + gridColumnFieldsSelector(apiRef.current.state, apiRef.current.instanceId);
  ```
  However, it's preferable to pass the `apiRef` as the first argument instead:
  ```js
  gridColumnFieldsSelector(apiRef);
  ```
  See [Direct state access](/x/react-data-grid/state/#direct-selector-access) for more info.

<!-- ### Events

- -->

### Columns

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

- The type `GridPinnedColumns` has been renamed to `GridPinnedColumnFields`.

- The type `GridPinnedPosition` has been renamed to `GridPinnedColumnPosition`.

- Column grouping is now enabled by default. The flag `columnGrouping` is no longer needed to be passed to the `experimentalFeatures` prop to enable it.

- The column grouping API methods `getColumnGroupPath` and `getAllGroupDetails` are not anymore prefixed with `unstable_`.

- The column grouping selectors `gridFocusColumnGroupHeaderSelector` and `gridTabIndexColumnGroupHeaderSelector` are not anymore prefixed with `unstable_`.

<!-- ### Rows

- -->

<!-- ### `apiRef` methods

- -->

### Clipboard

- Clipboard paste is now enabled by default. The flag `clipboardPaste` is no longer needed to be passed to the `experimentalFeatures` prop to enable it.
- The clipboard related exports `ignoreValueFormatterDuringExport` and `splitClipboardPastedText` are not anymore prefixed with `unstable_`.

### Print export

- The print export will now only print the selected rows if there are any.
  If there are no selected rows, it will print all rows. This makes the print export consistent with the other exports.
  You can [customize the rows to export by using the `getRowsToExport` function](/x/react-data-grid/export/#customizing-the-rows-to-export).

### Selection

- ✅ The `unstable_` prefix has been removed from the cell selection props listed below.

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

### Filtering

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

- The Quick Filter now ignores hidden columns by default.
  See [Including hidden columns](/x/react-data-grid/filtering/quick-filter/#including-hidden-columns) section for more details.

- The header filters feature is now stable. `unstable_` prefix is removed from prop `headerFilters` and the following exports.

  | Old name                                          | New name                                 |
  | :------------------------------------------------ | :--------------------------------------- |
  | `unstable_gridFocusColumnHeaderFilterSelector`    | `gridFocusColumnHeaderFilterSelector`    |
  | `unstable_gridHeaderFilteringEditFieldSelector`   | `gridHeaderFilteringEditFieldSelector`   |
  | `unstable_gridHeaderFilteringMenuSelector`        | `gridHeaderFilteringMenuSelector`        |
  | `unstable_gridHeaderFilteringStateSelector`       | `gridHeaderFilteringStateSelector`       |
  | `unstable_gridTabIndexColumnHeaderFilterSelector` | `gridTabIndexColumnHeaderFilterSelector` |

- The filter panel no longer uses the native version of the [`Select`](https://mui.com/material-ui/react-select/) component for all components.
- The `filterModel` now supports `Date` objects as values for `date` and `dateTime` column types.
  The `filterModel` still accepts strings as values for `date` and `dateTime` column types,
  but all updates to the `filterModel` coming from the UI (e.g. filter panel) will set the value as a `Date` object.

### Accessibility

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

  - When [Tree data](/x/react-data-grid/tree-data/) feature is used, the grid role is now `role="treegrid"` instead of `role="grid"`.
  - The Data Grid cells now have `role="gridcell"` instead of `role="cell"`.

<!-- ### Editing

- -->

### Other exports

- The import path for locales has been changed:

  ```diff
  -import { enUS } from '@mui/x-data-grid';
  +import { enUS } from '@mui/x-data-grid/locales';

  -import { enUS } from '@mui/x-data-grid-pro';
  +import { enUS } from '@mui/x-data-grid-pro/locales';

  -import { enUS } from '@mui/x-data-grid-premium';
  +import { enUS } from '@mui/x-data-grid-premium/locales';
  ```

- The deprecated constants `SUBMIT_FILTER_STROKE_TIME` and `SUBMIT_FILTER_DATE_STROKE_TIME` are no longer exported.
  Use the [`filterDebounceMs`](/x/api/data-grid/data-grid/#DataGrid-prop-filterDebounceMs) prop to customize filter debounce time.

- The `GridPreferencesPanel` component is not exported anymore as it wasn't meant to be used outside of the Data Grid.

- The buttons in toolbar composable components `GridToolbarColumnsButton`, `GridToolbarFilterButton`, `GridToolbarDensity`, and `GridToolbarExport` are now wrapped with a tooltip component and have a consistent interface. In order to override some props corresponding to the toolbar buttons or their corresponding tooltips, you can use the `slotProps` prop. Following is an example diff. See [Toolbar section](/x/react-data-grid/components/#toolbar) for more details.

```diff
 function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton
-       title="Custom filter" // 🛑 This was previously forwarded to the tooltip component
+       slotProps={{ tooltip: { title: 'Custom filter' } }} // ✅ This is the correct way now
      />
      <GridToolbarDensitySelector
-       variant="outlined"    // 🛑 This was previously forwarded to the button component
+       slotProps={{ button: { variant: 'outlined' } }} // ✅ This is the correct way now
      />
    </GridToolbarContainer>
  );
 }
```

### CSS classes

- Some CSS classes were removed or renamed

  | MUI X v6 classes                            | MUI X v7 classes | Note                   |
  | :------------------------------------------ | :--------------- | :--------------------- | --- |
  | `.Mui-hovered`                              | `:hover`         | For rows               |
  | `.MuiDataGrid--pinnedColumns-(left\|right)` | Removed          | Not applicable anymore | --> |

### Changes to the public API

- The method `getRootDimensions()` now returns a non-null value.
- The field `mainElementRef` is now always non-null.
- The field `rootElementRef` is now always non-null.
- The field `virtualScrollerRef` is now always non-null.
- The event `renderedRowsIntervalChange` params changed from `GridRenderedRowsIntervalChangeParams` to `GridRenderContext`, and the former has been removed.

### Changes to slots

- The slot `columnHeaders` has had these props removed: `columnPositions`, `densityFactor`, `minColumnIndex`.
- The slot `row` has had these props removed: `containerWidth`, `position`.
- The slot `row` has typed props now.
- The slot `headerFilterCell` has had these props removed: `filterOperators`.

<!-- ### Rename `components` to `slots` -->
