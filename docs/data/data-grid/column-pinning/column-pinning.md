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

## Initializing the pinned columns

To set pinned columns via `initialState`, pass an object with the following shape to this prop:

```ts
interface GridPinnedColumnFields {
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

## Disable column pinning

### For all columns

Column pinning is enabled by default, but you can easily disable this feature by setting the `disableColumnPinning` prop.

```tsx
<DataGridPro disableColumnPinning />
```

### For some columns

To disable the pinning of a single column, set the `pinnable` property in `GridColDef` to `false`.

```tsx
<DataGridPro columns={[{ field: 'id', pinnable: false }]} /> // Default is `true`.
```

### Pin non-pinnable columns programmatically

It may be desirable to allow one or more columns to be pinned or unpinned programmatically that cannot be pinned or unpinned on the UI (that is columns for which prop `disableColumnPinning = true` or `colDef.pinnable = false`).
This can be done in one of the following ways.

- (A) Initializing the pinned columns
- (B) Controlling the pinned columns
- (C) Using the API method `setPinnedColumns` to set the pinned columns

```tsx
// (A) Initializing the pinning
<DataGridPro
  disableColumnPinning
  initialState={{ pinnedColumns: { left: ['name'] } }}
/>

// (B) Controlling the pinned columns
<DataGridPro
  disableColumnPinning
  pinnedColumns={{ left: ['name'] }}
/>

// (C) Using the API method `setPinnedColumns` to set the pinned columns
<React.Fragment>
  <DataGridPro disableColumnPinning />
  <Button onClick={() => apiRef.current.setPinnedColumns({ left: ['name'] })}>
    Pin name column
  </Button>
</React.Fragment>
```

The following demo uses method (A) to initialize the state of the pinned columns which pins a column `name` although the pinning feature is disabled.

{{"demo": "DisableColumnPinningButtons.js", "bg": "inline"}}

:::info
Another alternate option to disable pinning actions on the UI is to disable the pinning options in the column menu in one of the following ways.

1. Use [`disableColumnMenu` prop](/x/react-data-grid/column-menu/#disable-column-menu) to completely disable the column menu.
2. Use column menu API to hide the pinning options in the column menu. See [Column Menu - Hiding a menu item](/x/react-data-grid/column-menu/#hiding-a-menu-item) for more details.

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
