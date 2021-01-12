---
title: Data Grid - Rows
components: DataGrid, XGrid
---

# Data Grid - Rows

<p class="description">This section goes in details on the aspects of the rows you need to know.</p>

## Feeding data

Grid rows can be defined with the `rows` prop.
`rows` expects an array of objects.
Rows should have this type: `RowData[]`.
The columns' "field" property should match a key of the row object (`RowData`).

{{"demo": "pages/components/data-grid/rows/RowsGrid.js", "bg": "inline"}}

## Updating rows

Rows can be updated in two ways:

### The `rows` prop

The simplest way is to provide the new rows using the `rows` prop.
It replaces the previous values. This approach has some drawbacks:

- You need to provide all the rows.
- You might create a performance bottleneck when preparing the rows array to provide to the grid.

### apiRef [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-x/)

The second way to update rows is to use the apiRef.
This is an imperative API that is designed to solve the previous two limitations of the declarative `rows` prop. `apiRef.current.updateRows()`, updates the rows to the grid. It **merges** the new rows with the previous ones.

The following demo updates the rows every 200ms.

{{"demo": "pages/components/data-grid/rows/ApiRefRowsGrid.js", "bg": "inline"}}

## Row sorting

### Basic sorting

Single column sorting can be triggered with by clicking a column header.
Repeat this action to change the sorting direction.

A sorted column can be can pre-configured using the `sortModel` prop of the `ColDef` interface:

{{"demo": "pages/components/data-grid/rows/BasicSortingGrid.js", "bg": "inline"}}

### Custom comparator

The grid handles sorting and applies different comparators in columns according to their types.
The component handles sorting natively for the following types:

- string
- number
- date
- dateTime

To extend or modify this behavior in a specific column, you can pass in a custom comparator, and override the `sortComparator` prop of the `ColDef` interface.

In the example below, the `username` column combines `name` and `age`, but it is sorted by `age` using a custom comparator:

{{"demo": "pages/components/data-grid/rows/ComparatorSortingGrid.js", "bg": "inline"}}

### Sort order

By default, the sort order cycles between these three different modes:

```jsx
const sortingOrder = ['asc', 'desc', null];
```

In practice, when you click a column that is not sorted, it will sort ascending (`asc`).
The next click will make it sort descending (`desc`). Another click will remove the sort (`null`), reverting to the order that the data was provided in.
This behavior can be overwritten by setting the `sortingOrder` prop.

In the example below columns are only sortable in descending or ascending order.

{{"demo": "pages/components/data-grid/rows/OrderSortingGrid.js", "bg": "inline"}}

### Disable sorting

By default, all columns are sortable.
This can be revoked using the sortable prop of the `ColDef` interface:

```tsx
const columns: ColDef = [{ field: 'name', sortable: false }];
```

{{"demo": "pages/components/data-grid/rows/DisableSortingGrid.js", "bg": "inline"}}

### Server-side sorting

By default, sorting works client-side.
To switch it to server-side, set `sortingMode="server"`.
Then you need to handle the `onSortModelChange` callback, sort the rows on the server-side, and update the `rows` prop with the newly sorted rows.

{{"demo": "pages/components/data-grid/rows/ServerSortingGrid.js", "bg": "inline"}}

### Multi-column sorting [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-x/)

You can sort by multiple columns at the same time using `XGrid`.
Hold the <kbd>CTRL</kbd> key down while clicking the column header.

{{"demo": "pages/components/data-grid/rows/MultiSortingGrid.js", "disableAd": true, "bg": "inline"}}

### apiRef [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-x/)

The grid exposes a set of methods that enables all of these features using the imperative apiRef.

> ⚠️ Only use this API when you have no alternative. Always start from the declarative API that the grid exposes.

- `getSortModel`: Get the sort model currently applied to the grid.
- `setSortModel`: Set the sort model and trigger the sorting of rows.
- `onSortModelChange`: Callback fired when the column sorting changed before the grid has sorted its rows.

## Row height

By default, the rows have a height of 52 pixels.
This matches the normal height in the [Material Design guidelines](https://material.io/components/data-tables).

To change the row height for the whole grid, set the `rowHeight` prop:

{{"demo": "pages/components/data-grid/rows/DenseHeightGrid.js", "bg": "inline"}}

## 🚧 Row spanning

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #207](https://github.com/mui-org/material-ui-x/issues/207) if you want to see it land faster.

Each cell takes up the width of one row.
Row spanning allows to change this default behavior.
It allows cells to span multiple rows.
This is very close to the "row spanning" in an HTML `<table>`.

## 🚧 Row reorder [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-x/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #206](https://github.com/mui-org/material-ui-x/issues/206) if you want to see it land faster.

Row reorder is used to rearrange rows by dragging the row with the mouse.
