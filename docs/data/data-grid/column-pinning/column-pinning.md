---
title: Data Grid - Column pinning
---

# Data Grid - Column pinning [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Pin columns to keep them visible at all time.</p>

Pinned (or frozen, locked, or sticky) columns are columns that are visible at all time while the user scrolls the data grid horizontally.
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

{{"demo": "BasicColumnPinning.js", "bg": "inline"}}

:::info
The column pinning feature can be completely disabled with `disableColumnPinning`.

```tsx
<DataGridPro disableColumnPinning />
```

:::

:::warning
You may encounter issues if the sum of the widths of the pinned columns is larger than the width of the Grid.
Make sure that the Data Grid can properly accommodate these columns at a minimum.
:::

## Controlling the pinned columns

While the `initialState` prop only works for setting pinned columns during the initialization, the `pinnedColumns` prop allows you to modify which columns are pinned at any time.
The value passed to it follows the same shape from the previous approach.
Use it together with `onPinnedColumnsChange` to know when a column is pinned or unpinned.

{{"demo": "ControlPinnedColumns.js", "bg": "inline"}}

## Blocking column unpinning

It may be desirable to not allow a column to be unpinned.
The only thing required to achieve that is to hide the buttons added to the column menu.
This can be done in two ways:

1. Per column, by setting `pinnable` to `false` in each `GridColDef`:

   ```tsx
   <DataGrid columns={[{ field: 'id', pinnable: false }]} /> // Default is `true`.
   ```

2. By providing a custom menu, as demonstrated below:

{{"demo": "DisableColumnPinningButtons.js", "bg": "inline"}}

:::warning
Using the `disableColumnMenu` prop also works, but this approach completely disables the column menu.
:::

## Pinning the checkbox selection column

To pin the checkbox column added when using `checkboxSelection`, add `GRID_CHECKBOX_SELECTION_COL_DEF.field` to the list of pinned columns.

{{"demo": "ColumnPinningWithCheckboxSelection.js", "bg": "inline"}}

## Usage with dynamic row height

You can have both pinned columns and [dynamic row height](/x/react-data-grid/row-height/#dynamic-row-height) enabled at the same time.
However, if the rows change their content after the initial calculation, you may need to trigger a manual recalculation to avoid incorrect measurements.
You can do this by calling `apiRef.current.resetRowHeights()` every time that the content changes.

The demo below contains an example of both features enabled:

{{"demo": "ColumnPinningDynamicRowHeight.js", "bg": "inline"}}

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

{{"demo": "ColumnPinningApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
