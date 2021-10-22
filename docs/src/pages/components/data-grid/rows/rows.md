---
title: Data Grid - Rows
---

# Data Grid - Rows

<p class="description">This section goes in details on the aspects of the rows you need to know.</p>

## Feeding data

Grid rows can be defined with the `rows` prop.
`rows` expects an array of objects.
Rows should have this type: `GridRowModel[]`.
The columns' "field" property should match a key of the row object (`GridRowModel`).

{{"demo": "pages/components/data-grid/rows/RowsGrid.js", "bg": "inline"}}

## Updating rows

Rows can be updated in two ways:

### The `rows` prop

The simplest way is to provide the new rows using the `rows` prop.
It replaces the previous values. This approach has some drawbacks:

- You need to provide all the rows.
- You might create a performance bottleneck when preparing the rows array to provide to the grid.

### Infinite loading [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

The grid provides a `onRowsScrollEnd` prop that can be used to load additional rows when the scroll reaches the bottom of the viewport area.

In addition, the area in which the callback provided to the `onRowsScrollEnd` is called can be changed using `scrollEndThreshold`.

{{"demo": "pages/components/data-grid/rows/InfiniteLoadingGrid.js", "bg": "inline", "disableAd": true}}

### apiRef [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

The second way to update rows is to use the apiRef.
This is an imperative API that is designed to solve the previous two limitations of the declarative `rows` prop. `apiRef.current.updateRows()`, updates the rows to the grid. It **merges** the new rows with the previous ones.

The following demo updates the rows every 200ms.

{{"demo": "pages/components/data-grid/rows/ApiRefRowsGrid.js", "bg": "inline", "disableAd": true}}

The default behavior of `updateRows` API is to upsert rows.
So if a row has an id that is not in the current list of rows then it will be added to the grid.

Alternatively, if you would like to delete a row, you would need to pass an extra `_action` property in the update object as below.

```ts
apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
```

### High frequency [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

Whenever the rows are updated, the grid has to apply the sorting and filters. This can be a problem if you have high frequency updates. To maintain good performances, the grid allows to batch the updates and only apply them after a period of time. The `throttleRowsMs` prop can be used to define the frequency (in milliseconds) at which rows updates are applied.

When receiving updates more frequently than this threshold, the grid will wait before updating the rows.

The following demo updates the rows every 10ms, but they are only applied every 2 seconds.

{{"demo": "pages/components/data-grid/rows/ThrottledRowsGrid.js", "bg": "inline"}}

## Row height

By default, the rows have a height of 52 pixels.
This matches the normal height in the [Material Design guidelines](https://material.io/components/data-tables).

To change the row height for the whole grid, set the `rowHeight` prop:

{{"demo": "pages/components/data-grid/rows/DenseHeightGrid.js", "bg": "inline"}}

## Styling rows

You can check the [styling rows](/components/data-grid/style/#styling-rows) section for more information.

## 🚧 Row spanning

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #207](https://github.com/mui-org/material-ui-x/issues/207) if you want to see it land faster.

Each cell takes up the width of one row.
Row spanning allows to change this default behavior.
It allows cells to span multiple rows.
This is very close to the "row spanning" in an HTML `<table>`.

## 🚧 Row reorder [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #206](https://github.com/mui-org/material-ui-x/issues/206) if you want to see it land faster.

Row reorder is used to rearrange rows by dragging the row with the mouse.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
