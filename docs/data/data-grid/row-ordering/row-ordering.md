---
title: Data Grid - Drag-and-drop reordering
---

# Data Grid - Drag-and-drop row reordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">The Data Grid Pro lets users drag and drop rows to reorder them.</p>

By default, users cannot manually rearrange rows in the Data Grid.
With the Data Grid Pro, you can give them the ability to drag and drop rows to reorder them.

## Implementing row reordering

To enable drag-and-drop row reordering, pass the `rowReordering` prop to the Data Grid Pro:

```tsx
<DataGridPro rowReordering />
```

This generates a new column for drag indicators at the start of each row:

{{"demo": "RowOrderingGrid.js", "bg": "inline"}}

## Row reordering events

To capture changes in the order of the dragged row, you can pass a callback to the `onRowOrderChange` prop.
This callback is called with a `GridRowOrderChangeParams` object.

Row reordering emits the following events:

- `rowDragStart`: emitted when the user starts dragging a row.
- `rowDragOver`: emitted when the user drags a row over another row.
- `rowDragEnd`: emitted when the user stops dragging a row.

## Customizing the row reordering value

By default, when the user starts dragging a row, its ID is displayed in the draggable box.
To customize this, you can pass a value to the `__reorder__` field for each row, as shown below:

```tsx
const columns: GridColDef[] = [{ field: 'brand' }];

const rows: GridRowsProp = [
  { id: 0, brand: 'Nike', __reorder__: 'Nike' },
  { id: 1, brand: 'Adidas', __reorder__: 'Adidas' },
  { id: 2, brand: 'Puma', __reorder__: 'Puma' },
];

<DataGridPro rows={rows} columns={columns} rowReordering />;
```

## Customizing the drag indicator

To change the icon used in the drag indicator column, you can provide a different component for the [icon slot](/x/react-data-grid/components/#icons):

```tsx
<DataGridPro
  slots={{
    rowReorderIcon: CustomMoveIcon,
  }}
/>
```

Alternatively, you can add a column with `field: __reorder__` to your set of columns.
This enables you to override any of the properties from the `GRID_REORDER_COL_DEF` column.
The Grid will detect that there's already a reordering column defined and so it won't add another one in the default position.
If you only set the `field`, then you must configure the remaining options (such as disabling the column menu, filtering, and sorting).

To get started with this configuration, spread `GRID_REORDER_COL_DEF` when defining the column:

```tsx
<DataGridPro
  columns={[
    {
      ...GRID_REORDER_COL_DEF, // Already contains the right field
      width: 40,
    },
  ]}
/>
```

This approach can also be used to change the location of the toggle column.

:::warning
For now, row reordering is disabled if sorting is applied to the Data Grid.
:::

## Disable reordering of specific rows

To disable reordering of specific rows, you can pass a callback to the `isRowReorderable()` prop.
This callback is called with `row` and `rowNode` objects so that rows can be disabled based on multiple criteria.

```tsx
const isRowReorderable = (params: IsRowReorderableParams) => {
  // Example: Disable reordering if the quantity is greater than 50000
  return params.row.quantity > 50000;
};

<DataGridPro isRowReorderable={isRowReorderable} />;
```

The demo below shows how to disable reordering of specific rows based on the row model.

{{"demo": "RowReorderingDisabled.js", "bg": "inline"}}

## Disable specific reorder operations

Sometimes, the information provided by the source row isn't enough to determine if a reorder operation is valid.
In these cases, you can pass a callback to the `isValidRowReorder()` prop.

This callback is fired _during_ the drag operation so it provides information about the dragged row and the potential position for it to be dropped.
It is called with a `ReorderValidationContext` object so that specific reorder operations can be disabled based on the context.

The demo below prohibits reordering leaf rows under the same parent and only allows cross-parent operations.

{{"demo": "RowReorderingValidation.js", "bg": "inline"}}

:::warning
The row reorder feature has an internal validation ruleset to ensure that only the supported use cases are allowed.
`isValidRowReorder()` should only be used to add more validation rules.
:::

## Row reordering with tree data

Users can drag and drop rows to move between parents, or convert leaf nodes into parent groups.

For more details, see [Tree data—Drag-and-drop tree data reordering](/x/react-data-grid/tree-data/#drag-and-drop-tree-data-reordering).

## Row reordering with row grouping [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

This feature allows users to reorder rows within grouped data to adjust the order of groups and their contents directly in the grid.

For more details, see [Row grouping—Drag-and-drop group reordering](/x/react-data-grid/row-grouping/#drag-and-drop-group-reordering).

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridRowOrderChangeParams](/x/api/data-grid/grid-row-order-change-params/)
