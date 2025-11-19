---
title: Data Grid - Column pinning
---

# Data Grid - Column pinning [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Implement pinning to keep columns in the Data Grid visible at all times.</p>

Pinned columns (also known as sticky, frozen, and locked) are visible at all times while scrolling the Data Grid horizontally.
Users can access this feature through the column menu to pin and unpin columns to either the left or right side.
Pinned columns cannot be [reordered](/x/react-data-grid/column-ordering/), except by unpinning and repinning.

## Implementing column pinning

The Data Grid Pro provides column pinning to end users by default, and there are several different tools you can use to modify the experience to meet your needs:

- The `initialState` prop – for pinning during initialization
- The `pinnedColumns` and `onPinnedColumnsChange` props – for more control over pinning
- The imperative `apiRef` API – for fully custom solutions

### Column pinning on initialization

To set pinned columns when the Data Grid is initialized, pass a value to the `pinnedColumns` property of the `initialState` prop with the following shape:

```ts
interface GridPinnedColumnFields {
  left?: string[]; // Optional field names to pin to the left
  right?: string[]; // Optional field names to pin to the right
}
```

The demo below illustrates how this works:

{{"demo": "BasicColumnPinning.js", "bg": "inline"}}

:::warning
You may encounter issues if the sum of the widths of the pinned columns is larger than the width of the Grid.
Make sure that the Data Grid can properly accommodate these columns at a minimum.
:::

### Controlled column pinning

The `pinnedColumns` prop gives you more granular control over how the user can interact with the pinning feature.
To implement this prop, pass an object to it with the same shape as that outlined in [the `initialState` section above](#column-pinning-on-initialization).
Use it together with `onPinnedColumnsChange` to track when columns are pinned and unpinned, as shown in the demo below:

{{"demo": "ControlPinnedColumns.js", "bg": "inline"}}

## Pinned columns appearance

By default, the pinned columns sections are separated from non-pinned columns with a border and a shadow that appears when there is scroll.

You can change the appearance by setting the [`pinnedColumnsSectionSeparator`](/x/api/data-grid/data-grid-pro/#data-grid-pro-prop-pinnedColumnsSectionSeparator) prop to `'border'`, `'shadow'`, or `'border-and-shadow'`.

{{"demo": "ColumnPinningSectionSeparator.js", "bg": "inline"}}

You can override the scroll shadow's color and opacity by setting the `--color` and `--opacity` CSS variables on the `.MuiDataGrid-scrollShadow` class. For example:

```tsx
<DataGridPro
  pinnedColumnsSectionSeparator="shadow"
  sx={{
    '& .MuiDataGrid-scrollShadow': {
      '--color': '255, 0, 0', // must be an RGB value
      '--opacity': '0.5',
    },
  }}
/>
```

## Disabling column pinning

Column pinning is enabled by default on the Data Grid Pro, but you can disable it for some or all columns.

### For all columns

To disable pinning for all columns, set the `disableColumnPinning` prop to `true`:

```tsx
<DataGridPro disableColumnPinning />
```

### For specific columns

To disable pinning for a specific column, set the `pinnable` property to `false` in the column's `GridColDef`, as shown below:

```tsx
<DataGridPro columns={[{ field: 'id', pinnable: false }]} /> // Default is `true`
```

### Remove pinning from the column menu

An alternative option for disabling pinning actions is to remove them from the user interface, which can be done in one of two ways:

1. Use the column menu API to hide the pinning actions. See [Column menu—Hiding a menu item](/x/react-data-grid/column-menu/#hiding-a-menu-item) for details.
2. Use the [`disableColumnMenu` prop](/x/react-data-grid/column-menu/#disable-column-menu) to completely remove the column menu altogether.

## Pinning non-pinnable columns programmatically

When [pinning is disabled](#disabling-column-pinning) in the UI for some or all columns (via `disableColumnPinning` or `colDef.pinnable`), it's still possible to implement it programmatically.
You can do this in one of three ways:

1. Initialized pinning with `initialState`
2. Controlled pinning with `pinnedColumns`
3. Using the [`setPinnedColumns()` method](#apiref)

The code snippets below illustrate these three approaches:

```tsx
// 1. Initialized pinning
<DataGridPro
  disableColumnPinning
  initialState={{ pinnedColumns: { left: ['name'] } }}
/>

// 2. Controlled pinning
<DataGridPro
  disableColumnPinning
  pinnedColumns={{ left: ['name'] }}
/>

// 3. Using the `setPinnedColumns()` method
<React.Fragment>
  <DataGridPro disableColumnPinning />
  <Button onClick={() => apiRef.current.setPinnedColumns({ left: ['name'] })}>
    Pin name column
  </Button>
</React.Fragment>
```

In the following demo, pinning is disabled but the Grid is initialized with the **Name** column pinned to the left:

{{"demo": "DisableColumnPinningButtons.js", "bg": "inline"}}

## Pinning autogenerated columns

Certain features (such as [checkbox selection](/x/react-data-grid/row-selection/#checkbox-selection) and [row reordering](/x/react-data-grid/row-ordering/)) add autogenerated columns in the Data Grid.
You can pin these by adding `GRID_CHECKBOX_SELECTION_COL_DEF.field` and `GRID_REORDER_COL_DEF.field`, respectively, to the list of pinned columns, as shown in the demo below:

{{"demo": "ColumnPinningAutogeneratedColumns.js", "bg": "inline"}}

## Pinning columns with dynamic row height

The Data Grid supports use cases involving both column pinning and [dynamic row height](/x/react-data-grid/row-height/#dynamic-row-height).
However, if row contents change after the initial calculation, you may need to trigger a manual recalculation to avoid incorrect measurements.
You can do this by calling `apiRef.current.resetRowHeights()` whenever the content changes.

The demo below contains an example of both features enabled:

{{"demo": "ColumnPinningDynamicRowHeight.js", "bg": "inline"}}

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the column pinning feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

{{"demo": "ColumnPinningApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
