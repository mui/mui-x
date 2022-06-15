---
title: Data Grid - Column pinning
---

# Data grid - Column pinning [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

<p class="description">Pin columns to keep them visible at all time.</p>

Pinned (or frozen, locked, or sticky) columns are columns that are visible at all time while the user scrolls the grid horizontally.
They can be pinned either to the left or right side and cannot be reordered.

To pin a column, there are a few ways:

- Using the `initialState` prop
- [Controlling](#controlling-the-pinned-columns) the `pinnedColumns` and `onPinnedColumnsChange` props
- Dedicated buttons in the column menu
- Accessing the [imperative](#apiref) API

To set pinned columns via `initialState`, pass an object with the following shape to this prop:

```ts
interface GridPinnedColumns {
  left?: string[]; // Optional field names to pin to the left
  right?: string[]; // Optional field names to pin to the right
}
```

The following demos illustrates how this approach works:

{{"demo": "BasicColumnPinning.js", "disableAd": true, "bg": "inline"}}

:::info
The column pinning feature can be completely disabled with `disableColumnPinning`.

```tsx
<DataGridPro disableColumnPinning />
```

:::

:::warning
You may encounter issues if the sum of the widths of the pinned columns is larger than the width of the grid.
Make sure that the grid can accommodate properly, at least, these columns.
:::

## Controlling the pinned columns

While the `initialState` prop only works for setting pinned columns during the initialization, the `pinnedColumns` prop allows you to modify which columns are pinned at any time.
The value passed to it follows the same shape from the previous approach.
Use it together with `onPinnedColumnsChange` to know when a column is pinned or unpinned.

{{"demo": "ControlPinnedColumns.js", "disableAd": true, "bg": "inline"}}

## Blocking column unpinning

It may be desirable to not allow a column to be unpinned.
The only thing required to achieve that is to hide the buttons added to the column menu.
This can be done in two ways:

1. Per column, by setting `pinnable` to `false` in each `GridColDef`:

   ```tsx
   <DataGrid columns={[{ field: 'id', pinnable: false }]} /> // Default is `true`.
   ```

2. By providing a custom menu, as demonstrated below:

{{"demo": "DisableColumnPinningButtons.js", "disableAd": true, "bg": "inline"}}

:::info
Using the `disableColumnMenu` prop also works, however, you disable completely the column menu with this approach.
:::

## Pinning the checkbox selection column

To pin the checkbox column added when using `checkboxSelection`, add `GRID_CHECKBOX_SELECTION_COL_DEF.field` to the list of pinned columns.

{{"demo": "ColumnPinningWithCheckboxSelection.js", "disableAd": true, "bg": "inline"}}

## apiRef

{{"demo": "ColumnPinningApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
