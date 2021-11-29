---
title: Data Grid - Filtering
---

# Data Grid - Filtering

<p class="description">Filtering helps to view a subset of the records based on a criteria.</p>

## Basic filter

Column filters can be set using the column menu and clicking the Filter menu item.
Alternatively, if the grid has the toolbar displayed, you just need to click on the Filters button.

The filter applied to a column can be pre-configured using the `filterModel` prop:

```jsx
<DataGrid
  filterModel={{
    items: [{ columnField: 'commodity', operatorValue: 'contains', value: 'rice' }],
  }}
/>
```

{{"demo": "pages/components/data-grid/filtering/BasicFilteringGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Predefined filters

A filter is composed of three parts: the column to filter, the value to look for, and an operator (e.g. _contains_, _is before_, _is after_, etc.).
On the `DataGridPro`, the `id` field is required on `filterModel.items` when multiple filters are used.
The operator determines if a candidate value should be considered as a result.
The candidate value used by the operator is the one corresponding to the `field` attribute or the `valueGetter` of the `GridColDef`.
As part of the predefined column types, a set of operators is available.
You can find the supported column types in the [columns section](/components/data-grid/columns/#column-types).

**Note**: The [`valueFormatter`](/components/data-grid/columns/#value-formatter) is only used for rendering purposes.

The following demo allows to explore the different operators available:

{{"demo": "pages/components/data-grid/filtering/FilterOperators.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable filtering

**Globally**

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```jsx
<DataGrid disableColumnFilter />
```

**Per column**

You can disable the filter on a column by setting the `filterable` property of the `GridColDef` to `false`;

```js
const columns = [{ field: 'image', filterable: false }];
```

{{"demo": "pages/components/data-grid/filtering/DisableFilteringGrid.js", "bg": "inline"}}

## Customize the filters

The grid provides different ways to customize the filter panel.
This section provides examples on how to make the most common modifications.

### Change the input component

The value used by the operator to look for has to be entered by the user.
On most column types, a text field is used. However, a custom component can be rendered instead.

In this demo, the Rating column reuses the numeric filter and the same rating component is used to the enter the value of the filter.

{{"demo": "pages/components/data-grid/filtering/ExtendNumericOperator.js", "bg": "inline", "defaultCodeOpen": false}}

### Extend filter operators

When defining a [custom column type](/components/data-grid/columns/#custom-column-types), the added operators are the same from the type that was extended.

In this demo, a `price` column type (used by Total is USD) is defined extending the `number` column type.
Instead of adding all numeric operators, only the operators `<` and `>` are kept.
Furthermore, the "$" prefix is added to the input component with the `InputComponentProps` prop.

{{"demo": "pages/components/data-grid/filtering/ColumnTypeFilteringGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Create a custom operator

If reusing the native filter operators is not enough, creating a custom operator is an option.
A custom operator is defined creating a `GridFilterOperator` object.
This object has to be added to the `filterOperators` attribute of the `GridColDef`.

The most important part of an operator is the `getApplyFilterFn` function.
It's called with the `GridFilterItem` object and the `GridColDef` object.
This function must return another function that is called on every value of the column.
The returned function determines if the cell value satisfies the condition of the operator.

```ts
{
  label: 'From',
  value: 'from',
  getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
    if (!filterItem.columnField || !filterItem.value || !filterItem.operatorValue) {
      return null;
    }
    return (params: GridCellParams): boolean => {
      return Number(params.value) >= Number(filterItem.value);
    };
  },
  InputComponent: RatingInputValue,
  InputComponentProps: { type: 'number' },
}
```

**Note**: If the column has a [`valueGetter`](/components/data-grid/columns/#value-getter), then `params.value` will be the resolved value.

In this demo, you can see how to create a completely new operator for the Rating column.

{{"demo": "pages/components/data-grid/filtering/CustomRatingOperator.js", "bg": "inline", "defaultCodeOpen": false}}

## Server-side filter

Filtering can be run server-side by setting the `filterMode` prop to `server`, and implementing the `onFilterModelChange` handler.

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  filterMode="server"
  onFilterModelChange={handleFilterModelChange}
  loading={loading}
/>
```

Below is a very simple demo on how you could achieve server-side filtering.

{{"demo": "pages/components/data-grid/filtering/ServerFilterGrid.js", "bg": "inline"}}

<!-- ## Controlled filtering -->

<!-- WIP -->

## Multi-column filtering [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

`DataGridPro` supports filtering by multiple columns.
The default operator that will be applied between filters is an And.

{{"demo": "pages/components/data-grid/filtering/MultiFilteringGrid.js", "bg": "inline", "disableAd": true}}

**Note**: The `id` field is required on `filterModel.items` when multiple filters are used.

To change the default operator, you should set the `linkOperator` property of the `filterModel` like below.

```ts
const filterModel: GridFilterModel = {
  items: [
    { id: 1, columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
    { id: 2, columnField: 'commodity', operatorValue: 'startsWith', value: 'Soy' },
  ],
  linkOperator: GridLinkOperator.Or,
};
```

{{"demo": "pages/components/data-grid/filtering/MultiFilteringWithOrGrid.js", "bg": "inline", "disableAd": true}}

## Quick filter

The grid does not natively include quick filtering.
However, it can be implemented as in the demo below.

{{"demo": "pages/components/data-grid/filtering/QuickFilteringGrid.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠️ This feature isn't natively implemented in the grid package. It's coming.
>
> 👍 Upvote [issue #2842](https://github.com/mui-org/material-ui-x/issues/2842) if you want to see it land faster.

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

{{"demo": "pages/components/data-grid/filtering/FilterApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
