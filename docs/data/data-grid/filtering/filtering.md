---
title: Data Grid - Filtering
---

# Data Grid - Filtering

<p class="description">Easily filter your rows based on one or several criteria.</p>

The filters can be modified through the grid interface in several ways:

- By opening the column menu and clicking the _Filter_ menu item.
- By clicking the _Filters_ button in the grid toolbar (if enabled).

Each column type has its own filter operators.
The demo below lets you explore all the operators for each built-in column type.

_See [the dedicated section](#customize-the-operators) to learn how to create your own custom filter operator._

{{"demo": "BasicExampleDataGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Single and multi-filtering

> ⚠️ The `DataGrid` can only filter the rows according to one criterion at the time.
>
> To use multi-filtering, you need to upgrade to the [Pro plan](https://mui.com/store/items/material-ui-pro/)

## Multi-filtering [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The following demo lets you filter the rows according to several criteria at the same time.

{{"demo": "BasicExampleDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Pass filters to the grid

### Structure of the model

The full typing details can be found on the [GridFilterModel API page](/api/data-grid/grid-filter-model/).

The filter model is composed of a list of `items` and a `linkOperator`:

#### The `items`

A filter item represents a filtering rule and is composed of several elements:

- `filterItem.columnField`: the field on which we want to apply the rule.
- `filterItem.value`: the value to look for.
- `filterItem.operatorValue`: name of the operator method to use (e.g. _contains_), matches the `value` key of the .
- `filterItem.id` ([<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)): only useful when multiple filters are used.

**Note**: Some operators do not need any value (for instance the `isEmpty` operator of the `string` column).

#### The `linkOperator` [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The `linkOperator` tells the grid if a row should satisfy all (`AND`) filter items or at least one (`OR`) in order to be considered valid.

```ts
// Example 1: get rows with rating > 4 OR isAdmin = true
const filterModel: GridFilterModel = {
  items: [
    { id: 1, columnField: 'rating', operatorValue: '>', value: '4' },
    { id: 2, columnField: 'isAdmin', operatorValue: 'is', value: 'true' },
  ],
  linkOperator: GridLinkOperator.Or,
};

// Example 2: get rows with rating > 4 AND isAdmin = true
const filterModel: GridFilterModel = {
  items: [
    { id: 1, columnField: 'rating', operatorValue: '>', value: '4' },
    { id: 2, columnField: 'isAdmin', operatorValue: 'is', value: 'true' },
  ],
  linkOperator: GridLinkOperator.And,
};
```

If no `linkOperator` is provided, the grid will use `GridLinkOperator.Or` by default.

### Initialize the filters

To initialize the filters without controlling them, provide the model to the `initialState` prop.

```jsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [{ columnField: 'rating', operatorValue: '>', value: '2.5' }],
      },
    },
  }}
/>
```

{{"demo": "InitialFilters.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled filters

Use the `filterModel` prop to control the filter applied on the rows.

You can use the `onFilterModelChange` prop to listen to changes to the filters and update the prop accordingly.

```jsx
<DataGrid
  filterModel={{
    items: [{ columnField: 'rating', operatorValue: '>', value: '2.5' }],
  }}
/>
```

{{"demo": "ControlledFilters.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable the filters

### For all columns

Filters are enabled by default, but you can easily disable this feature by setting the `disableColumnFilter` prop.

```jsx
<DataGrid disableColumnFilter />
```

{{"demo": "DisableFilteringGridAllColumns.js", "bg": "inline", "defaultCodeOpen": false}}

### For some columns

To disable the filter of a single column, set the `filterable` property in `GridColDef` to `false`.

In the example below, the _rating_ column can not be filtered.

```js
<DataGrid columns={[...columns, { field: 'rating', filterable: false }]} />
```

{{"demo": "DisableFilteringGridSomeColumns.js", "bg": "inline", "defaultCodeOpen": false}}

## Customize the operators

The full typing details can be found on the [GridFilterOperator api page](/api/data-grid/grid-filter-operator/).

An operator determines if a cell value should be considered as a valid filtered value.
The candidate value used by the operator is the one corresponding to the `field` attribute or the value returned by the `valueGetter` of the `GridColDef`.

Each column type comes with a default array of operators.
You can get them by importing the following functions:

| Column type    | Function                         |
| -------------- | -------------------------------- |
| `string`       | `getGridStringOperators()`       |
| `number`       | `getGridNumericOperators()`      |
| `boolean`      | `getGridBooleanOperators()`      |
| `date`         | `getGridDateOperators()`         |
| `dateTime`     | `getGridDateOperators(true)`     |
| `singleSelect` | `getGridSingleSelectOperators()` |

You can find more information about the supported column types in the [columns section](/components/data-grid/columns/#column-types).

### Create a custom operator

If the built-in filter operators are not enough, creating a custom operator is an option.
A custom operator is defined by creating a `GridFilterOperator` object.
This object has to be added to the `filterOperators` attribute of the `GridColDef`.

The main part of an operator is the `getApplyFilterFn` function.
When applying the filters, the grid will call this function with the filter item and the column on which the item must be applied.
This function must return another function that takes the cell value as an input and return `true` if it satisfies the operator condition.

```ts
const operator: GridFilterOperator = {
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
};
```

**Note**: The [`valueFormatter`](/components/data-grid/columns/#value-formatter) is only used for rendering purposes.

**Note**: If the column has a [`valueGetter`](/components/data-grid/columns/#value-getter), then `params.value` will be the resolved value.

In the demo below, you can see how to create a completely new operator for the Rating column.

{{"demo": "CustomRatingOperator.js", "bg": "inline", "defaultCodeOpen": false}}

### Wrap built-in operators

You can create custom operators that re-use the logic of the built-in ones.

In the demo below, the selected rows are always visible even when they don't match the filtering rules.

{{"demo": "CustomSelectionOperator.js", "bg": "inline", "defaultCodeOpen": false}}

### Multiple values operator

You can create a custom operator which accepts multiple values. To do this, provide an array of values to the `value` property of the `filterItem`.
The `valueParser` of the `GridColDef` will be applied to each item of the array.

The filtering function `getApplyFilterFn` must be adapted to handle `filterItem.value` as an array.
Below is an example for a "between" operator, applied on the "Quantity" column.

```ts
{
  label: 'Between',
  value: 'between',
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
      return null;
    }
    if (filterItem.value[0] == null || filterItem.value[1] == null) {
      return null;
    }
    return ({ value }): boolean => {
      return value != null && filterItem.value[0] <= value && value <= filterItem.value[1];
    };
  },
  InputComponent: InputNumberInterval,
}
```

{{"demo": "CustomMultiValueOperator.js", "bg": "inline", "defaultCodeOpen": false}}

### Remove an operator

To remove built-in operators, import the method to generate them and filter the output to fit your needs.

```ts
// Only keep '>' and '<' default operators
const filterOperators = getGridNumericOperators().filter(
  (operator) => operator.value === '>' || operator.value === '<',
);
```

In the demo below, the `rating` column only has the `<` and `>` operators.

{{"demo": "RemoveBuiltInOperators.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom input component

The value used by the operator to look for has to be entered by the user.
On most column types, a text field is used.
However, a custom component can be rendered instead.

In the demo below, the `rating` column reuses the numeric operators but the rating component is used to enter the value of the filter.

{{"demo": "CustomInputComponent.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom column types

When defining a [custom column type](/components/data-grid/columns/#custom-column-types), by default the grid will reuse the operators from the type that was extended.
The filter operators can then be edited just like on a regular column.

```ts
const ratingColumnType: GridColTypeDef = {
  extendType: 'number',
  filterOperators: getGridNumericOperators().filter(
    (operator) => operator.value === '>' || operator.value === '<',
  ),
};
```

## Custom filter panel

You can customize the rendering of the filter panel as shown in [the component section](/components/data-grid/components/#overriding-components) of the documentation.

### Customize the filter panel content

The customization of the filter panel content can be performed by passing props to the default `<GridFilterPanel />` component.
The available props allow overriding:

- The `linkOperators` (can contains `GridLinkOperator.And` and `GridLinkOperator.Or`)
- The order of the column selector (can be `"asc"` or `"desc"`)
- Any prop of the input components

Input components can be [customized](/customization/how-to-customize/) by using two approaches.
You can pass a `sx` prop to any input container or you can use CSS selectors on nested components of the filter panel.
More details are available in the demo.

| Props                    | CSS class                                 |
| :----------------------- | :---------------------------------------- |
| `deleteIconProps`        | `MuiDataGrid-filterFormDeleteIcon`        |
| `linkOperatorInputProps` | `MuiDataGrid-filterFormLinkOperatorInput` |
| `columnInputProps`       | `MuiDataGrid-filterFormColumnInput`       |
| `operatorInputProps`     | `MuiDataGrid-filterFormOperatorInput`     |
| `valueInputProps`        | `MuiDataGrid-filterFormValueInput`        |

{{"demo": "CustomFilterPanelContent.js", "bg": "inline"}}

### Customize the filter panel position

The demo below shows how to anchor the filter panel to the toolbar button instead of the column header.

{{"demo": "CustomFilterPanelPosition.js", "bg": "inline", "defaultCodeOpen": false}}

## Server-side filter

Filtering can be run server-side by setting the `filterMode` prop to `server`, and implementing the `onFilterModelChange` handler.

The example below demonstrates how to achieve server-side filtering.

{{"demo": "ServerFilterGrid.js", "bg": "inline"}}

## Quick filter

The grid does not natively include quick filtering.
However, it can be implemented as in the demo below.

{{"demo": "QuickFilteringGrid.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠️ This feature isn't natively implemented in the grid package. It's coming.
>
> 👍 Upvote [issue #2842](https://github.com/mui/mui-x/issues/2842) if you want to see it land faster.

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

{{"demo": "FilterApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## Selectors [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

{{"demo": "FilterSelectorsNoSnap.js", "bg": "inline", "hideToolbar": true}}

More information about the selectors and how to use them on the [dedicated page](/components/data-grid/state#access-the-state)

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
- [GridFilterModel](/api/data-grid/grid-filter-model/)
- [GridFilterItem](/api/data-grid/grid-filter-item/)
- [GridFilterOperator](/api/data-grid/grid-filter-operator/)
