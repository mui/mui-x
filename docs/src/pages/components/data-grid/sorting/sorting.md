---
title: Data Grid - Sorting
---

# Data Grid - Sorting

<p class="description">Easily sort your rows based on one or several criteria.</p>

The sorting rules can be modified through the grid interface by clicking on a column header. Repeat this action to pass to the next sorting direction of the column.

## Single and multi-sorting

> ⚠️ The `DataGrid` can only sort the rows according to one criterion at the time.
>
> To use multi-sorting, you need to upgrade to the [Pro plan](https://mui.com/store/items/material-ui-pro/)

The demo below let you sort the rows according to several criteria at the same time.

Hold down the <kbd class="key">CTRL</kbd> or <kbd class="key">Shift</kbd> (use <kbd class="key">⌘ Command</kbd> on macOS) key while clicking the column header.

{{"demo": "pages/components/data-grid/sorting/BasicExampleDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Pass sorting rules to the grid

### Structure of the model

The sort model is a list of sorting item.
Each item represent a sorting rule and is composed of several elements:

- `sortingItem.field`: the field on which we want to apply the rule
- `sortingItem.sort`: the direction of the sorting (`'asc'`, `'desc'`, `null` or `undefined`, if `null` or `undefined`, the rule will not be applied)

### Initialize the sort model

To initialize the sort model without controlling it, provide the model to the `initialState` prop.

```jsx
<DataGrid
  initialState={{
    sorting: {
      sortModel: [{ field: 'rating', sort: 'desc' }],
    },
  }}
/>
```

{{"demo": "pages/components/data-grid/sorting/InitialSort.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled sort model

Use the `sortModel` prop to control the sorting rules applied on the rows.

You can use the `onSortModelChange` prop to listen to changes to the sorting rules and update the prop accordingly.

{{"demo": "pages/components/data-grid/sorting/ControlledSort.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable the sorting

By default, all columns are sortable.
To disable the filter on a column, set the `sortable` property of `GridColDef` to `false`.
In the example below, the _rating_ column can not be sorted.

```tsx
<Datagrid columns={[...columns, { field: 'rating', sortable: false }]} />
```

{{"demo": "pages/components/data-grid/sorting/DisableSortingGrid.js", "bg": "inline"}}

## Custom comparator

A comparator determines how two cell values should be sorted.

Each column type comes with a default comparator method.
You can re-use them by importing the following functions:

- `gridStringNumberComparator` (used by the `string` and `singleSelect` columns)
- `gridNumberComparator` (used by the `number` and `boolean` columns)
- `gridDateComparator` (used by the `date` and `date-time` columns)

To extend or modify this behavior in a specific column, you can pass in a custom comparator, and override the `sortComparator` prop of the `GridColDef` interface.

In the example below:

- the "Name" column combines the `name` and `isAdmin` fields. The sorting is based on `isAdmin` and then on `name` if necessary. It re-uses built-in sorting comparator.
- the "Created on" column sorting is based on the day of the month of the `createdOn` field. It is a fully custom sorting comparator.

{{"demo": "pages/components/data-grid/sorting/ComparatorSortingGrid.js", "bg": "inline"}}

## Custom sort order

By default, the sort order cycles between these three different modes:

```jsx
const sortingOrder = ['asc', 'desc', null];
```

In practice, when you click a column that is not sorted, it will sort ascending (`asc`).
The next click will make it sort descending (`desc`). Another click will remove the sort (`null`), reverting to the order that the data was provided in.

### For all columns

The default sort order can be overwritten for all columns with the `sortingOrder` prop.
In the example below columns are only sortable in descending or ascending order.

{{"demo": "pages/components/data-grid/sorting/OrderSortingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Per column

Sort order can be configured (and overridden) on a per-column basis by setting the `sortingOrder` property of the `GridColDef` interface:

```tsx
const columns: GridColDef = [
  { field: 'quantity', sortingOrder: ['desc', 'asc', null] },
];
```

{{"demo": "pages/components/data-grid/sorting/OrderSortingPerColumnGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Server-side sorting

Sorting can be run service-side by setting the `sortingMode` prop to `server`, and implementing the `onSortModelChange` handler.

{{"demo": "pages/components/data-grid/sorting/ServerSortingGrid.js", "bg": "inline"}}

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

{{"demo": "pages/components/data-grid/sorting/SortingApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
