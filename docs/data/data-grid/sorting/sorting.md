# Data Grid - Sorting

<p class="description">Easily sort your rows based on one or several criteria.</p>

Sorting is enabled by default to the data grid users and works out of the box without any explicit configuration.
Users can set a sorting rule simply by clicking on a column header.
Following clicks change the column's sorting direction. You can see the applied direction on the header's arrow indicator.

{{"demo": "BasicExampleDataGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Single and multi-sorting

:::warning
The Data Grid can only sort the rows according to one criterion at a time.

To use multi-sorting, you need to upgrade to [Pro plan](/x/introduction/licensing/#pro-plan) or above.
:::

## Multi-sorting [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

The following demo lets you sort the rows according to several criteria at the same time.

Hold down the <kbd class="key">Ctrl</kbd> or <kbd class="key">Shift</kbd> (use <kbd class="key">⌘ Command</kbd> on macOS) key while clicking the column header.

{{"demo": "BasicExampleDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Pass sorting rules to the data grid

### Structure of the model

The sort model is a list of sorting items.
Each item represents a sorting rule and is composed of several elements:

- `sortingItem.field`: the field on which the rule applies.
- `sortingItem.sort`: the direction of the sorting (`'asc'`, `'desc'`, `null` or `undefined`). If `null` or `undefined`, the rule doesn't apply.

### Initialize the sort model

Sorting is enabled by default to the user.
But if you want to set an initial sorting order, simply provide the model to the `initialState` prop.

```jsx
<DataGrid
  initialState={{
    sorting: {
      sortModel: [{ field: 'rating', sort: 'desc' }],
    },
  }}
/>
```

{{"demo": "InitialSort.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled sort model

Use the `sortModel` prop to control the state of the sorting rules.

You can use the `onSortModelChange` prop to listen to changes in the sorting rules and update the prop accordingly.

{{"demo": "ControlledSort.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable the sorting

### For all columns

Sorting is enabled by default, but you can easily disable this feature by setting the `disableColumnSorting` prop.

```jsx
<DataGrid disableColumnSorting />
```

{{"demo": "DisableSortingGridAllColumns.js", "bg": "inline", "defaultCodeOpen": false}}

### For some columns

By default, all columns are sortable.
To disable sorting on a column, set the `sortable` property of `GridColDef` to `false`.
In the following demo, the user cannot sort the _rating_ column from the UI.

```tsx
<DataGrid columns={[...columns, { field: 'rating', sortable: false }]} />
```

{{"demo": "DisableSortingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Sorting non-sortable columns programmatically

The columns with `colDef.sortable` set to `false` are not sortable from the grid UI but could still be sorted programmatically. To add a sort rule to such a column, you could initialize the `sortModel`, use the `sortModel` prop, or use the API methods `sortColumn` or `setSortModel`.

In the following demo, the `firstName` column is not sortable by the default grid UI, but it is sorted programmatically by a custom built UI.

{{"demo": "ReadOnlySortingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom comparator

A comparator determines how two cell values should be sorted.

Each column type comes with a default comparator method.
You can re-use them by importing the following functions:

- `gridStringOrNumberComparator` (used by the `string` and `singleSelect` columns)
- `gridNumberComparator` (used by the `number` and `boolean` columns)
- `gridDateComparator` (used by the `date` and `date-time` columns)

To extend or modify this behavior in a specific column, you can pass in a custom comparator, and override the `sortComparator` property of the `GridColDef` interface.

### Create a comparator from scratch

In the following demo, the "Created on" column sorting is based on the day of the month of the `createdOn` field.
It is a fully custom sorting comparator.

{{"demo": "FullyCustomSortComparator.js", "bg": "inline", "defaultCodeOpen": false}}

### Combine built-in comparators

In the following demo, the "Name" column combines the `name` and `isAdmin` fields.
The sorting is based on `isAdmin` and then on `name`, if necessary. It re-uses the built-in sorting comparator.

{{"demo": "ExtendedSortComparator.js", "bg": "inline", "defaultCodeOpen": false}}

### Asymmetric comparator

The Data Grid considers the `sortComparator` function symmetric, automatically reversing the return value for descending sorting by multiplying it by `-1`.

While this is sufficient for most use cases, it is possible to define an asymmetric comparator using the `getSortComparator` function – it receives the sorting direction as an argument and returns a comparator function.

In the demo below, the `getSortComparator` function is used in the "Quantity" column to keep the `null` values at the bottom when sorting is applied (regardless of the sorting direction):

{{"demo": "GetSortComparator.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom sort order

By default, the sort order cycles between these three different modes:

```jsx
const sortingOrder = ['asc', 'desc', null];
```

In practice, when you click a column that is not sorted, it will sort ascending (`asc`).
The next click will make it sort descending (`desc`). Another click will remove the sort (`null`), reverting to the order that the data was provided in.

### For all columns

The default sort order can be overridden for all columns with the `sortingOrder` prop.
In the following demo, columns are only sortable in descending or ascending order.

{{"demo": "OrderSortingGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Per column

Sort order can be configured (and overridden) on a per-column basis by setting the `sortingOrder` property of the `GridColDef` interface:

```tsx
const columns: GridColDef = [
  { field: 'rating', sortingOrder: ['desc', 'asc', null] },
];
```

{{"demo": "OrderSortingPerColumnGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Server-side sorting

Sorting can be run server-side by setting the `sortingMode` prop to `server`, and implementing the `onSortModelChange` handler.

{{"demo": "ServerSortingGrid.js", "bg": "inline"}}

## apiRef

:::warning
Only use this API as the last option. Give preference to the props to control the Data Grid.
:::

{{"demo": "SortingApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Sorting"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
