---
title: Data Grid - Sorting
---

# Data Grid - Sorting

<p class="description">Sorting allows ordering records in the data grid.</p>

## Basic sorting

Single column sorting can be triggered with by clicking a column header.
Repeat this action to change the sorting direction.

A sorted column can be can pre-configured using the `sortModel` prop of the `GridColDef` interface:

{{"demo": "pages/components/data-grid/sorting/BasicSortingGrid.js", "bg": "inline"}}

## Custom comparator

The grid handles sorting and applies different comparators in columns according to their types.
The component handles sorting natively for the following types:

- string
- number
- date
- dateTime

To extend or modify this behavior in a specific column, you can pass in a custom comparator, and override the `sortComparator` prop of the `GridColDef` interface.

In the example below, the `username` column combines `name` and `age`, but it is sorted by `age` using a custom comparator:

{{"demo": "pages/components/data-grid/sorting/ComparatorSortingGrid.js", "bg": "inline"}}

## Sort order

By default, the sort order cycles between these three different modes:

```jsx
const sortingOrder = ['asc', 'desc', null];
```

In practice, when you click a column that is not sorted, it will sort ascending (`asc`).
The next click will make it sort descending (`desc`). Another click will remove the sort (`null`), reverting to the order that the data was provided in.
This behavior can be overwritten by setting the `sortingOrder` prop.

In the example below columns are only sortable in descending or ascending order.

{{"demo": "pages/components/data-grid/sorting/OrderSortingGrid.js", "bg": "inline"}}

## Disable sorting

By default, all columns are sortable.
This can be revoked using the sortable prop of the `GridColDef` interface:

```tsx
const columns: GridColDef = [{ field: 'name', sortable: false }];
```

{{"demo": "pages/components/data-grid/sorting/DisableSortingGrid.js", "bg": "inline"}}

## Server-side sorting

By default, sorting works client-side.
To switch it to server-side, set `sortingMode="server"`.
Then you need to handle the `onSortModelChange` callback, sort the rows on the server-side, and update the `rows` prop with the newly sorted rows.

{{"demo": "pages/components/data-grid/sorting/ServerSortingGrid.js", "bg": "inline"}}

## Multi-column sorting [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

You can sort by multiple columns at the same time using `DataGridPro`.
Hold down the <kbd class="key">CTRL</kbd> or <kbd class="key">Shift</kbd> (use <kbd class="key">⌘ Command</kbd> on macOS) key while clicking the column header.

{{"demo": "pages/components/data-grid/sorting/MultiSortingGrid.js", "disableAd": true, "bg": "inline"}}

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

{{"demo": "pages/components/data-grid/sorting/SortingApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
