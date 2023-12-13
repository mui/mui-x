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
-"@mui/x-data-grid": "^6.0.0",
+"@mui/x-data-grid": "next",
```

Since v7 is a major release, it contains changes that affect the public API.
These changes were done for consistency, improved stability and to make room for new features.
Described below are the steps needed to migrate from v6 to v7.

## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v7.
You can run `v7.0.0/data-grid/preset-safe` targeting only Data Grid or `v7.0.0/preset-safe` to target other MUI X components like Date and Time pickers as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

```bash
// Data Grid specific
npx @mui/x-codemod v7.0.0/data-grid/preset-safe <path>
// Target other MUI X components as well
npx @mui/x-codemod v7.0.0/preset-safe <path>
```

:::info
If you want to run the codemods one by one, check out the codemods included in the [preset-safe codemod for data grid](https://github.com/mui/mui-x/blob/master/packages/x-codemod/README.md#preset-safe-for-data-grid-v700) for more details.
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

<!-- ### Renamed props

- -->

### Removed props

- The deprecated props `components` and `componentsProps` have been removed. Use `slots` and `slotProps` instead. See [components section](/x/react-data-grid/components/) for more details.
- The `slots.preferencesPanel` slot and the `slotProps.preferencesPanel` prop were removed. Use `slots.panel` and `slotProps.panel` instead.

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

<!-- ### Editing

- -->

### Other exports

- The deprecated constants `SUBMIT_FILTER_STROKE_TIME` and `SUBMIT_FILTER_DATE_STROKE_TIME` are no longer exported.
  Use the [`filterDebounceMs`](/x/api/data-grid/data-grid/#DataGrid-prop-filterDebounceMs) prop to customize filter debounce time.

- The `GridPreferencesPanel` component is not exported anymore as it wasn't meant to be used outside of the Data Grid.

<!-- ### CSS classes

- Some CSS classes were removed or renamed

  | MUI X v6 classes | MUI X v7 classes | Note |
  | :--------------- | :--------------- | :--- |
  |                  |                  |      |
  |                  |                  |      | -->

<!-- ### Removals from the public API

- -->

<!-- ### Rename `components` to `slots` -->
