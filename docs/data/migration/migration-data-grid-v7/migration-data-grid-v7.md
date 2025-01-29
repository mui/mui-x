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

### Props

- Passing additional props (like `data-*`, `aria-*`) directly on the Data Grid component is no longer supported. To pass the props, use `slotProps`:
  - For the `.root` element, use `slotProps.root`
  - For the `.main` element (the one with `role="grid"`), use `slotProps.main`

### Selection

- The default value of the `rowSelectionPropagation` prop has been changed to `{ parents: true, descendants: true }` which means that the selection will be propagated to the parents and descendants by default.
  To revert to the previous behavior, pass `rowSelectionPropagation={{ parents: false, descendants: false }}`.
- The prop `indeterminateCheckboxAction` has been removed. Clicking on an indeterminate checkbox "selects" the unselected descendants.
- The "Select all" checkbox would now be checked when all the selectable rows are selected, ignoring rows that are not selectable because of the `isRowSelectable` prop.

### Changes to the public API

- The `rowPositionsDebounceMs` prop was removed.
- The `apiRef.current.resize()` method was removed.
- The `<GridOverlays />` component is not exported anymore.
- The `sanitizeFilterItemValue()` utility is not exported anymore.
- `gridRowsDataRowIdToIdLookupSelector` was removed. Use `gridRowsLookupSelector` in combination with `getRowId()` API method instead.

  ```diff
  -const idToIdLookup = gridRowsDataRowIdToIdLookupSelector(apiRef);
  -const rowId = idToIdLookup[id];
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

- Return type of the `useGridApiRef()` hook and the type of `apiRef` prop are updated to explicitly include the possibilty of `null`. In addition to this, `useGridApiRef()` returns a reference that is initialized with `null` instead of `{}`.

  Only the initial value and the type are updated. Logic that initializes the API and its availability remained the same, which means that if you could access API in a particular line of your code before, you are able to access it as well after this change.

  Depending on the context in which the API is being used, you can decide what is the best way to deal with `null` value. Some options are:

  - Use optional chaining
  - Use non-null assertion operator if you are sure your code is always executed when the `apiRef` is not `null`
  - Return early if `apiRef` is `null`
  - Throw an error if `apiRef` is `null`

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
  -const output = useGridSelector(apiRef, selector, equals);
  +const output = useGridSelector(apiRef, selector, arguments, equals);
  ```

### Other exports

- `ariaV8` experimental flag is removed. It's now the default behavior.

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

<!-- ### Editing

TBD

### Changes to slots

TBD -->
