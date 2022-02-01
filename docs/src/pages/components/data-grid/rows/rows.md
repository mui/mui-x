---
title: Data Grid - Rows
---

# Data Grid - Rows

<p class="description">This section goes in details on the aspects of the rows you need to know.</p>

## Feeding data

The rows can be defined with the `rows` prop, which expects an array of objects.

> ⚠️ The `rows` prop should keep the same reference between two renders except when you want to apply new rows.
> Otherwise, the grid will re-apply heavy work like sorting and filtering.

{{"demo": "pages/components/data-grid/rows/RowsGrid.js", "bg": "inline"}}

## Updating rows

### The `rows` prop

The simplest way to update the rows is to provide the new rows using the `rows` prop.
It replaces the previous values. This approach has some drawbacks:

- You need to provide all the rows.
- You might create a performance bottleneck when preparing the rows array to provide to the grid.

{{"demo": "pages/components/data-grid/rows/UpdateRowsProp.js", "bg": "inline", "disableAd": true}}

### The `updateRows` method [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

If you want to only update part of the rows, you can use the `apiRef.current.updateRows` method.

{{"demo": "pages/components/data-grid/rows/UpdateRowsApiRef.js", "bg": "inline", "disableAd": true}}

The default behavior of `updateRows` API is to upsert rows.
So if a row has an id that is not in the current list of rows then it will be added to the grid.

Alternatively, if you would like to delete a row, you would need to pass an extra `_action` property in the update object as below.

```ts
apiRef.current.updateRows([{ id: 1, _action: 'delete' }]);
```

### Infinite loading [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The grid provides a `onRowsScrollEnd` prop that can be used to load additional rows when the scroll reaches the bottom of the viewport area.

In addition, the area in which `onRowsScrollEnd` is called can be changed using `scrollEndThreshold`.

{{"demo": "pages/components/data-grid/rows/InfiniteLoadingGrid.js", "bg": "inline", "disableAd": true}}

### High frequency [<span class="plan-pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

Whenever the rows are updated, the grid has to apply the sorting and filters. This can be a problem if you have high frequency updates. To maintain good performances, the grid allows to batch the updates and only apply them after a period of time. The `throttleRowsMs` prop can be used to define the frequency (in milliseconds) at which rows updates are applied.

When receiving updates more frequently than this threshold, the grid will wait before updating the rows.

The following demo updates the rows every 10ms, but they are only applied every 2 seconds.

{{"demo": "pages/components/data-grid/rows/ThrottledRowsGrid.js", "bg": "inline"}}

## Row height

By default, the rows have a height of 52 pixels.
This matches the normal height in the [Material Design guidelines](https://material.io/components/data-tables).

If you want to create a more / less compact grid and not only set the row height, take a look at our [Density documentation](/components/data-grid/accessibility/#density-selector)

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

## 🚧 Row reorder [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #206](https://github.com/mui-org/material-ui-x/issues/206) if you want to see it land faster.

Row reorder is used to rearrange rows by dragging the row with the mouse.

## 🚧 Row pinning [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #1251](https://github.com/mui-org/material-ui-x/issues/1251) if you want to see it land faster.

Pinned (or frozen, locked, or sticky) rows are rows that are visible at all times while the user scrolls the grid vertically.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
