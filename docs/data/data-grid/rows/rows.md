---
title: Data Grid - Rows
---

# Data Grid - Rows

<p class="description">This section goes in details on the aspects of the rows you need to know.</p>

## Feeding data

The rows can be defined with the `rows` prop, which expects an array of objects.

> ⚠️ The `rows` prop should keep the same reference between two renders except when you want to apply new rows.
> Otherwise, the grid will re-apply heavy work like sorting and filtering.

{{"demo": "RowsGrid.js", "bg": "inline"}}

> ⚠️ Each row object should have a field that uniquely identifies the row.
> By default, the grid will use the `id` property of the row. Note that [column definition](/x/react-data-grid/column-definition) for `id` field is not required.
>
> When using dataset without a unique `id` property, you can use the `getRowId` prop to specify a custom id for each row.
>
> ```tsx
> <DataGrid getRowId={(row) => row.internalId} />
> ```

{{"demo": "RowsGridWithGetRowId.js", "bg": "inline", "defaultCodeOpen": false}}

## Updating rows

### The `rows` prop

The simplest way to update the rows is to provide the new rows using the `rows` prop.
It replaces the previous values. This approach has some drawbacks:

- You need to provide all the rows.
- You might create a performance bottleneck when preparing the rows array to provide to the grid.

{{"demo": "UpdateRowsProp.js", "bg": "inline", "disableAd": true}}

### The `updateRows` method [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

If you want to only update part of the rows, you can use the `apiRef.current.updateRows` method.

{{"demo": "UpdateRowsApiRef.js", "bg": "inline", "disableAd": true}}

The default behavior of `updateRows` API is to upsert rows.
So if a row has an id that is not in the current list of rows then it will be added to the grid.

Alternatively, if you would like to delete a row, you would need to pass an extra `_action` property in the update object as below.

```ts
apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
```

### Infinite loading [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

The grid provides a `onRowsScrollEnd` prop that can be used to load additional rows when the scroll reaches the bottom of the viewport area.

In addition, the area in which `onRowsScrollEnd` is called can be changed using `scrollEndThreshold`.

{{"demo": "InfiniteLoadingGrid.js", "bg": "inline", "disableAd": true}}

### High frequency [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

Whenever the rows are updated, the grid has to apply the sorting and filters. This can be a problem if you have high frequency updates. To maintain good performances, the grid allows to batch the updates and only apply them after a period of time. The `throttleRowsMs` prop can be used to define the frequency (in milliseconds) at which rows updates are applied.

When receiving updates more frequently than this threshold, the grid will wait before updating the rows.

The following demo updates the rows every 10ms, but they are only applied every 2 seconds.

{{"demo": "ThrottledRowsGrid.js", "bg": "inline"}}

## Row height

By default, the rows have a height of 52 pixels.
This matches the normal height in the [Material Design guidelines](https://material.io/components/data-tables).

If you want to create a more / less compact grid and not only set the row height, take a look at our [Density documentation](/x/react-data-grid/accessibility/#density-selector)

To change the row height for the whole grid, set the `rowHeight` prop:

{{"demo": "DenseHeightGrid.js", "bg": "inline"}}

### Variable row height

If you need some rows to have different row heights this can be achieved using the `getRowHeight` prop. This function is called for each visible row and if the return value is a `number` then that `number` will be set as that row's `rowHeight`. If the return value is `null` or `undefined` then the `rowHeight` prop will take effect for the given row.

{{"demo": "VariableRowHeightGrid.js", "bg": "inline"}}

> ⚠ Changing the `DataGrid` density does not affect the rows with variable row height.
> You can access the density factor from the params provided to the `getRowHeight` prop
>
> ⚠ Always memoize the function provided to `getRowHeight`.
> The grid bases on the referential value of these props to cache their values and optimize the rendering.
>
> ```tsx
> const handleGetRowHeight = React.useCallback(() => { ... }, []);
>
> <DataGridPro getRowHeight={handleGetRowHeight} />
> ```

## Row spacing

You can use the `getRowSpacing` prop to increase the spacing between rows.
This prop is called with a [`GridRowSpacingParams`](/x/api/data-grid/grid-row-spacing-params/) object.

```tsx
const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
  return {
    top: params.isFirstVisible ? 0 : 5,
    bottom: params.isLastVisible ? 0 : 5,
  };
}, []);
```

{{"demo": "RowMarginGrid.js", "bg": "inline", "defaultCodeOpen": false}}

By default, setting `getRowSpacing` will change the `marginXXX` CSS properties of each row.
To add a border instead, set `rowSpacingType` to `"border"` and customize the color and style.

```tsx
<DataGrid
  getRowSpacing={...}
  rowSpacingType="border"
  sx={{ '& .MuiDataGrid-row': { borderTopColor: 'yellow', borderTopStyle: 'solid' } }}
/>
```

> ⚠ Adding a bottom margin or border to rows that also have a [detail panel](/x/react-data-grid/master-detail) is not recommended because the detail panel relays on the bottom margin to work.
> As an alternative, only use the top spacing to define the space between rows.
> It will be easier to always increase the next row spacing not matter if the detail panel is expanded or not, but you can use `gridDetailPanelExpandedRowIdsSelector` to only do when open.

## Styling rows

You can check the [styling rows](/x/react-data-grid/style/#styling-rows) section for more information.

## Row reorder [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

Row reordering allows to rearrange rows by dragging the special reordering cell.

By default, row reordering is disabled.
To enable it, you need to add the `rowReordering` prop.

```tsx
<DataGridPro rowReordering />
```

{{"demo": "RowOrderingGrid.js", "disableAd": true, "bg": "inline"}}

To capture changes in the order of the dragged row, you can pass a callback to the `onRowOrderChange` prop. This callback is called with a `GridRowOrderChangeParams` object.

In addition, you can import the following events to customize the row reordering experience:

- `rowDragStart`: emitted when dragging of a row starts.
- `rowDragOver`: emitted when dragging a row over another row.
- `rowDragEnd`: emitted when dragging of a row stops.

### Customizing the reorder value

By default, when you start dragging a row, the `id` is displayed in the draggable box.
To change this, you can give a value to the `__reorder__` field for each row.

```tsx
const columns: GridColumns = [{ field: 'brand' }];

const rows: GridRowsProp = [
  { id: 0, brand: 'Nike', __reorder__: 'Nike' },
  { id: 1, brand: 'Adidas', __reorder__: 'Adidas' },
  { id: 2, brand: 'Puma', __reorder__: 'Puma' },
];

<DataGridPro rows={rows} columns={columns} rowReordering />;
```

### Customizing the row reordering icon

To change the icon used for the row reordering, you can provide a different component for the [icon slot](/x/react-data-grid/components/#icons) as follow:

```tsx
<DataGridPro
  components={{
    RowReorderIcon: CustomMoveIcon,
  }}
/>
```

Another way to customize is to add a column with `field: __reorder__` to your set of columns.
That way, you can overwrite any of the properties from the `GRID_REORDER_COL_DEF` column.
The grid will detect that there is already a reorder column defined and it will not add another one in the default position.
By only setting the `field`, is up to you to configure the remaining options (e.g. disable the column menu, filtering, sorting).
To already start with a few suggested options configured, spread `GRID_REORDER_COL_DEF` when defining the column.

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

> ⚠️ For now, row reordering is disabled if sorting is applied to the grid.
>
> In addition, if row grouping or tree data is being used, the row reordering is also disabled.

## 🚧 Row spanning

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #207](https://github.com/mui/mui-x/issues/207) if you want to see it land faster.

Each cell takes up the width of one row.
Row spanning allows to change this default behavior.
It allows cells to span multiple rows.
This is very close to the "row spanning" in an HTML `<table>`.

## 🚧 Row pinning [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #1251](https://github.com/mui/mui-x/issues/1251) if you want to see it land faster.

Pinned (or frozen, locked, or sticky) rows are rows that are visible at all times while the user scrolls the grid vertically.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
