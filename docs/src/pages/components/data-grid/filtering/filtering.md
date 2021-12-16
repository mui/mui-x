---
title: Data Grid - Filtering
---

# Data Grid - Filtering

<p class="description">Easily filter your rows based on one or several criteria.</p>

> ⚠️ The `DataGrid` can only filter the rows according to one criterion at the time.
> 
> To use multi-filtering, you need to upgrade to the [Pro plan](https://mui.com/store/items/material-ui-pro/)

The filters can be modified via the grid interface in several ways:

- By opening the column menu and clicking the _Filter_ menu item.
- By clicking the *Filters* button if the grid toolbar is enabled.

Each column types has its own filtering operators.
The demo below let you explore all the built-in operators for the various column types available on the grid.

*See [the dedicated section](#the-operators) to learn how to create your own custom filtering operator.*

{{"demo": "pages/components/data-grid/filtering/FilterOperators.js", "bg": "inline", "defaultCodeOpen": false}}


## Pass filters to the grid

### Initialize the filters

To initialize the filters without controlling them, provide the model to the `initialState` prop.

```jsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [
          { columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
        ],
      },
    },
  }}
/>
```

{{"demo": "pages/components/data-grid/filtering/InitialFilters.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled filters

Use the `filterModel` prop to control the size of the pages.

You can use the `onFilterModelChange` prop to listen to changes to the filters and update the prop accordingly.

```jsx
<DataGrid
  filterModel={{
    items: [{ columnField: 'commodity', operatorValue: 'contains', value: 'rice' }],
  }}
/>
```

{{"demo": "pages/components/data-grid/filtering/ControlledFilters.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable the filters

### For all columns

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```jsx
<DataGrid disableColumnFilter />
```

{{"demo": "pages/components/data-grid/filtering/DisableFilteringGridAllColumns.js", "bg": "inline"}}

### For some columns

To disable the filter on a column, set the `filterable` property of `GridColDef` to `false`.
If the example below, the _Trader Email_ column can not be filtered.

```js
const columns = [{ field: 'image', filterable: false }];
```

{{"demo": "pages/components/data-grid/filtering/DisableFilteringGridSomeColumns.js", "bg": "inline"}}

## How are the rows filtered?

### The operators

The operator determines if a candidate value should be considered as a result.
The candidate value used by the operator is the one corresponding to the `field` attribute or the `valueGetter` of the `GridColDef`.

The grid comes with a set of built-in filters for each column types.
You can find the supported column types in the [columns section](/components/data-grid/columns/#column-types).

**Note**: The [`valueFormatter`](/components/data-grid/columns/#value-formatter) is only used for rendering purposes.

#### Create a custom operator

If the built-in filter operators are not enough, creating a custom operator is an option.
A custom operator is defined creating a `GridFilterOperator` object.
This object has to be added to the `filterOperators` attribute of the `GridColDef`.

The main part of an operator is the `getApplyFilterFn` function.
When applying the filters, the grid will call this function with the filter item and the column on which the item must be applied.
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

In the demo below, you can see how to create a completely new operator for the Rating column.

{{"demo": "pages/components/data-grid/filtering/CustomRatingOperator.js", "bg": "inline", "defaultCodeOpen": false}}

#### Edit the built-in operators

To remove or edit built-in operators, import the method to generate them and edit the output to fit your needs.

| Column type  | Method                         |
| ------------ | ------------------------------ |
| string       | getGridStringOperators()       |
| number       | getGridNumericOperators()      |
| boolean      | getGridBooleanOperators()      |
| date         | getGridDateOperators()         |
| dateTime     | getGridDateOperators(true)     |
| singleSelect | getGridSingleSelectOperators() |

```ts
const column: GridColDef = {
  field: 'price',
  type: 'number',
  filterOperators: getGridNumericOperators().filter(
    (operator) => operator.value === '>' || operator.value === '<',
  ),
};
```

In the demo below, the `unitPrice` column only has the `<` and `>` operators with custom prefix added to the `InputComponentProps`.

{{"demo": "pages/components/data-grid/filtering/ColumnTypeFilteringGrid.js", "bg": "inline", "defaultCodeOpen": false}}

#### Custom column types

When defining a [custom column type](/components/data-grid/columns/#custom-column-types), by default the grid will reuse the operators from the type that was extended.
The filter operators can then be edited just like on a regular column.

```ts
const priceColumn: priceColumnType = {
  extendType: 'number',
  filterOperators: getGridNumericOperators().filter(
    (operator) => operator.value === '>' || operator.value === '<',
  ),
};
```

### The model

The full typing details can be found on the [GridFilterModel api page](/api/data-grid/grid-filter-model/)

The filter model is composed of a list of `items` and a `linkOperator`

#### The `items`

A filter item is composed of several elements:

- `filterItem.columnField`: the field on which we want to apply the filter.
- `filterItem.value`: the value to look for.
- `filterItem.operatorValue`: name of the operator method to use (e.g. _contains_, _is before_, _is after_, etc.).
- `filterItem.id` ([<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)): only useful when multiple filters are used.

#### The `linkOperator` [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The `linkOperator` tells the grid if a row should pass all the items or at least one in order to be considered valid.

In the example below, the rows with a `commodity` either containing `rice` or starting with `Soy` will be displayed.

```ts
const filterModel: GridFilterModel = {
  items: [
    { id: 1, columnField: 'commodity', operatorValue: 'contains', value: 'rice' },
    { id: 2, columnField: 'commodity', operatorValue: 'startsWith', value: 'Soy' },
  ],
  linkOperator: GridLinkOperator.Or,
};
```

## Custom filtering UI

### Change the input component

The value used by the operator to look for has to be entered by the user.
On most column types, a text field is used. However, a custom component can be rendered instead.

In this demo, the Rating column reuses the numeric filter and the same rating component is used to enter the value of the filter.

{{"demo": "pages/components/data-grid/filtering/ExtendNumericOperator.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom filter panel

You can customize the rendering of the filter panel following [the component section](/components/data-grid/components/#pagination) of the documentation.

## Server-side filter

Filtering can be run server-side by setting the `filterMode` prop to `server`, and implementing the `onFilterModelChange` handler.

```tsx
<DataGrid
  rows={rows}
  columns={columns}
  filterMode="server"
  onFilterModelChange={handleFilterModelChange}
/>
```

Below is a very simple demo on how you could achieve server-side filtering.

{{"demo": "pages/components/data-grid/filtering/ServerFilterGrid.js", "bg": "inline"}}

## Quick filter

The grid does not natively include quick filtering.
However, it can be implemented as in the demo below.

{{"demo": "pages/components/data-grid/filtering/QuickFilteringGrid.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠️ This feature isn't natively implemented in the grid package. It's coming.
>
> 👍 Upvote [issue #2842](https://github.com/mui-org/material-ui-x/issues/2842) if you want to see it land faster.

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

{{"demo": "pages/components/data-grid/filtering/FilterApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
