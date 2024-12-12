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
-"@mui/x-data-grid": "^7.0.0",
+"@mui/x-data-grid": "next",

-"@mui/x-data-grid-pro": "^7.0.0",
+"@mui/x-data-grid-pro": "next",

-"@mui/x-data-grid-premium": "^7.0.0",
+"@mui/x-data-grid-premium": "next",
```

Using `next` ensures that it will always use the latest v8 pre-release version, but you can also use a fixed version, like `8.0.0-alpha.0`.

## Breaking changes

Since v8 is a major release, it contains some changes that affect the public API.
These changes were done for consistency, improve stability and make room for new features.
Below are described the steps you need to make to migrate from v7 to v8.

### Selection

- The default value of the `rowSelectionPropagation` prop has been changed to `{ parents: true, descendants: true }` which means that the selection will be propagated to the parents and descendants by default.
  To revert to the previous behavior, pass `rowSelectionPropagation={{ parents: false, descendants: false }}`.
- The prop `indeterminateCheckboxAction` has been removed. Clicking on an indeterminate checkbox "selects" the unselected descendants.
- The "Select all" checkbox would now be checked when all the selectable rows are selected, ignoring rows that are not selectable because of the `isRowSelectable` prop.

### Changes to the public API

- The `rowPositionsDebounceMs` prop was removed.
- The `apiRef.current.resize()` method was removed.
- The `<GridOverlays />` component is not exported anymore.
- `gridRowsDataRowIdToIdLookupSelector` was removed. Use `gridRowsLookupSelector` in combination with `getRowId()` API method instead.

  ```diff
  -const idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);
  -const rowId = idToIdLookup[id]
  +const rowsLookup = gridRowsLookupSelector(apiRef);
  +const rowId = apiRef.current.getRowId(rowsLookup[id]);
  ```

- The feature row spanning is now stable.

  ```diff
   <DataGrid
  -  unstable_rowSpanning
  +  rowSpanning
   />
  ```

### Localization

- If `estimatedRowCount` is used, the text provided to the [Table Pagination](/material-ui/api/table-pagination/) component from the Material UI library is updated and requires additional translations. Check the example at the end of [Index-based pagination section](/x/react-data-grid/pagination/#index-based-pagination).

### Accessibility

- The Grid is more aligned with the WAI-ARIA authoring practices and sets the `role` attribute to `treegrid` if the Data Grid is used with row grouping feature.

### State

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

### Other exports

- `ariaV8` experimental flag is removed.

<!-- ### Editing

TBD

### CSS classes and styling

TBD

### Changes to slots

TBD -->
