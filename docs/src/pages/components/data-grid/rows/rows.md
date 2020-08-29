---
title: Data Grid - Rows
components: DataGrid, XGrid
---

# Data Grid - Rows

<p class="description">A fast and extendable data table and data grid for React. It's a feature-rich compoent available in MIT or Enterprise versions.</p>

## Row sorting

### Basic sorting

Single column sorting can be triggered with by clicking a column header.
Repeat this action to change the sorting direction.

A sorted column can be can pre-configured using the `sortModel` prop of the `ColDef` interface:

```ts
const sortModel = [
  {
    field: 'commodity',
    sort: 'asc' as SortDirection,
  },
];
```

{{"demo": "pages/components/data-grid/rows/BasicSortingGrid.js"}}

### Custom comparator

The Grid handles sorting and applies different comparators in columns according to their types.
The component handles sorting natively for the following types:

- string
- number
- date

To extend or modify this behavior in a specific column, you can pass in a custom comparator, and override the `sortComparator` prop of the `ColDef` interface.

In the example below, the `username` column combines `name` and `age`, but it is sorted by `age` using a custom comparator:

{{"demo": "pages/components/data-grid/rows/ComparatorSortingGrid.js"}}

### Sort order

By default, the sort order cycles between these three different modes:

```jsx
const sortingOrder = ['asc', 'desc', null];
```

In practice, when you click a column that is not sorted, it will sort ascending (`asc`).
The next click will make it sort descending (`desc`). Another click will remove the sort (`null`), reverting to the order that the data was provided in.
This behavior can be overwritten by setting the `sortingOrder` prop.

In the example below columns are only sortable in descending or ascending order.

{{"demo": "pages/components/data-grid/rows/OrderSortingGrid.js"}}

### Disable sorting

By default, all columns are sortable.
This can be revoked using the sortable prop of the `ColDef` interface:

```tsx
const columns: ColDef = [{ field: 'name', sortable: false }];
```

{{"demo": "pages/components/data-grid/rows/DisableSortingGrid.js"}}

### Server-side sorting

By default, sorting works client-side.
To switch it to server-side, set `sortingMode="server"`.
Then you need to handle the `onSortModelChange` callback, sort the rows on the server-side, and update the `rows` prop with the newly sorted rows.

{{"demo": "pages/components/data-grid/rows/ServerSortingGrid.js"}}

### apiRef

The Grid exposes a set of methods that enables all of these features using the imperative apiRef.

> ⚠️ Only use this API when you have no alternative. Always start from the declarative API that the Grid exposes.

- `getSortModel`
- `setSortModel`
- `onSortModelChange`

### Multi-column sorting ✨

You can sort by multiple columns at the same time using `XGrid`.
Hold the <kbd>CTRL</kbd> key down while clicking the column header.

```ts
const sortModel = [
  {
    field: 'commodity',
    sort: 'asc' as SortDirection,
  },
  {
    field: 'desk',
    sort: 'desc' as SortDirection,
  },
];
```

{{"demo": "pages/components/data-grid/rows/MultiSortingGrid.js"}}

## Row height

- https://ej2.syncfusion.com/react/demos/#/material/grid/row-height
- https://ag-grid.com/javascript-grid-row-height/

## Row spanning

> ⚠️ This feature isn't yet implemented. It's coming.
>
> 👍 Upvote [issue #207](https://github.com/mui-org/material-ui-x/issues/207) if you want to see it land faster.

Each cell takes up the width of one row.
Row spanning allows to change this default behavior.
It allows cells to span multiple rows.
This is very close to the "row spanning" in an HTML `<table>`.

## Row reorder

> ⚠️ This feature isn't yet implemented. It's coming.
>
> 👍 Upvote [issue #206](https://github.com/mui-org/material-ui-x/issues/206) if you want to see it land faster.

Row reorder is used to rearrange rows by dragging the row with the mouse.
