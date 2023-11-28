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

<!-- ## Run codemods

The `preset-safe` codemod will automatically adjust the bulk of your code to account for breaking changes in v6.
You can run `v6.0.0/data-grid/preset-safe` targeting only Data Grid or `v6.0.0/preset-safe` to target Date and Time pickers as well.

You can either run it on a specific file, folder, or your entire codebase when choosing the `<path>` argument.

```bash
// Data Grid specific
npx @mui/x-codemod v6.0.0/data-grid/preset-safe <path>
// Target Date and Time Pickers as well
npx @mui/x-codemod v6.0.0/preset-safe <path>
```

:::success
Apart from the removed methods and exports that require manual intervention, around 50% of the DataGrid breaking changes are automatically handled by the `preset-safe` codemod 🎉.
:::

:::info
If you want to run the codemods one by one, check out the codemods included in the [preset-safe codemod for data grid](https://github.com/mui/mui-x/blob/master/packages/x-codemod/README.md#preset-safe-for-data-grid-v700) for more details.
:::

Breaking changes that are handled by `preset-safe` codemod are denoted by a ✅ emoji in the table of contents on the right side of the screen or next to the specific point that is handled by it.

If you have already applied the `v6.0.0/data-grid/preset-safe` (or `v6.0.0/preset-safe`) codemod, then you should not need to take any further action on these items. If there's a specific part of the breaking change that is not part of the codemod or needs some manual work, it will be listed in the end of each section.

All other changes must be handled manually.

:::warning
Not all use cases are covered by codemods. In some scenarios, like props spreading, cross-file dependencies, etc., the changes are not properly identified and therefore must be handled manually.

For example, if a codemod tries to rename a prop, but this prop is hidden with the spread operator, it won't be transformed as expected.

```tsx
<DataGrid {...newProps} />
```

After running the codemods, make sure to test your application and that you don't have any console errors.

Feel free to [open an issue](https://github.com/mui/mui-x/issues/new/choose) for support if you need help to proceed with your migration.
::: -->

## Breaking changes

Since v7 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v6 to v7.

<!-- ### Renamed props

- -->

### Removed props

- The deprecated props `components` and `componentsProps` have been removed. Use `slots` and `slotProps` instead. See [components section](/x/react-data-grid/components/) for more details.

<!-- ### State access

- -->

<!-- ### Events

- -->

<!-- ### Columns

- -->

<!-- ### Rows

- -->

<!-- ### `apiRef` methods

- -->

### Print export

- The print export will now only print the selected rows if there are any.
  If there are no selected rows, it will print all rows. This makes the print export consistent with the other exports.
  You can [customize the rows to export by using the `getRowsToExport` function](/x/react-data-grid/export/#customizing-the-rows-to-export).

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

<!-- ### Editing

- -->

<!-- ### Other exports

- -->

<!-- ### CSS classes

- Some CSS classes were removed or renamed

  | MUI X v6 classes | MUI X v7 classes | Note |
  | :--------------- | :--------------- | :--- |
  |                  |                  |      |
  |                  |                  |      | -->

<!-- ### Removals from the public API

- -->

<!-- ### Rename `components` to `slots` -->
