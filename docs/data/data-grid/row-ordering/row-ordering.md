---
title: Data Grid - Row ordering
---

# Data Grid - Row ordering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Drag and drop your rows to reorder them.</p>

Row reordering lets users rearrange rows by dragging the special reordering cell.

By default, row reordering is disabled.
To enable it, you need to add the `rowReordering` prop.

```tsx
<DataGridPro rowReordering />
```

{{"demo": "RowOrderingGrid.js", "bg": "inline"}}

To capture changes in the order of the dragged row, you can pass a callback to the `onRowOrderChange` prop. This callback is called with a `GridRowOrderChangeParams` object.

In addition, you can import the following events to customize the row reordering experience:

- `rowDragStart`: emitted when dragging of a row starts.
- `rowDragOver`: emitted when dragging a row over another row.
- `rowDragEnd`: emitted when dragging of a row stops.

## Customizing the reorder value

By default, when you start dragging a row, the `id` is displayed in the draggable box.
To change this, you can give a value to the `__reorder__` field for each row.

```tsx
const columns: GridColDef[] = [{ field: 'brand' }];

const rows: GridRowsProp = [
  { id: 0, brand: 'Nike', __reorder__: 'Nike' },
  { id: 1, brand: 'Adidas', __reorder__: 'Adidas' },
  { id: 2, brand: 'Puma', __reorder__: 'Puma' },
];

<DataGridPro rows={rows} columns={columns} rowReordering />;
```

## Customizing the row reordering icon

To change the icon used for the row reordering, you can provide a different component for the [icon slot](/x/react-data-grid/components/#icons) as follow:

```tsx
<DataGridPro
  slots={{
    rowReorderIcon: CustomMoveIcon,
  }}
/>
```

Another way to customize is to add a column with `field: __reorder__` to your set of columns.
That way, you can overwrite any of the properties from the `GRID_REORDER_COL_DEF` column.
The grid will detect that there is already a reorder column defined and it will not add another one in the default position.
If you only set the `field`, then it is up to you to configure the remaining options (for example disable the column menu, filtering, sorting).
To start with our suggested configuration, spread `GRID_REORDER_COL_DEF` when defining the column.

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

## Reordering rows with row grouping 🚧

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4821](https://github.com/mui/mui-x/issues/4821) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this component, or if you are facing a pain point with your current solution.
:::

## Reordering rows with tree data 🚧

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #4821](https://github.com/mui/mui-x/issues/4821) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this component, or if you are facing a pain point with your current solution.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
