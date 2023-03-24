# Data Grid - Filtering

<p class="description">Easily filter your rows based on one or several criteria.</p>

The filters can be modified through the data grid interface in several ways:

- By opening the column menu and clicking the _Filter_ menu item.
- By clicking the _Filters_ button in the data grid toolbar (if enabled).

Each column type has its own filter operators.
The demo below lets you explore all the operators for each built-in column type.

_See [the dedicated section](#customize-the-operators) to learn how to create your own custom filter operator._

{{"demo": "BasicExampleDataGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Single and multi-filtering

:::warning
The `DataGrid` can only filter the rows according to one criterion at the time.

To use multi-filtering, you need to upgrade to the [Pro plan](/x/introduction/licensing/#pro-plan) or above.
:::

## Multi-filtering [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

The following demo lets you filter the rows according to several criteria at the same time.

{{"demo": "BasicExampleDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

### One filter per column [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

You can also limit to only one filter per column while still allowing to filter other columns. For this, use the [`filterColumns`](/x/api/data-grid/grid-filter-form/) and [`getColumnForNewFilter`](/x/api/data-grid/grid-filter-panel/) props available in `slotProps.filterPanel`.

#### Use cases

- Sometimes it's a limitation of some server-side filtering APIs to only allow one filter per column.
- You can also write custom logic to prevent some columns from being shown as possible filters.

This demo implements a basic use case to prevent showing multiple filters for one column.

{{"demo": "DisableMultiFiltersDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

### Disable action buttons [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

To disable `Add filter` or `Remove all` buttons, pass `disableAddFilterButton` or `disableRemoveAllButton` to `componentsProps.filterPanel`.

{{"demo": "DisableActionButtonsDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Pass filters to the Data Grid

### Structure of the model

The full typing details can be found on the [GridFilterModel API page](/x/api/data-grid/grid-filter-model/).

The filter model is composed of a list of `items` and a `logicOperator`:

#### The `items`

A filter item represents a filtering rule and is composed of several elements:

- `filterItem.field`: the field on which the rule applies.
- `filterItem.value`: the value to look for.
- `filterItem.operator`: name of the operator method to use (e.g. _contains_), matches the `value` key of the operator object.
- `filterItem.id` ([<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)): required when multiple filter items are used.

:::info
Some operators do not need any value (for instance the `isEmpty` operator of the `string` column).
:::

#### The `logicOperator` [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

The `logicOperator` tells the data grid if a row should satisfy all (`AND`) filter items or at least one (`OR`) in order to be considered valid.

```ts
// Example 1: get rows with rating > 4 OR isAdmin = true
const filterModel: GridFilterModel = {
  items: [
    { id: 1, field: 'rating', operator: '>', value: '4' },
    { id: 2, field: 'isAdmin', operator: 'is', value: 'true' },
  ],
  logicOperator: GridLogicOperator.Or,
};

// Example 2: get rows with rating > 4 AND isAdmin = true
const filterModel: GridFilterModel = {
  items: [
    { id: 1, field: 'rating', operator: '>', value: '4' },
    { id: 2, field: 'isAdmin', operator: 'is', value: 'true' },
  ],
  logicOperator: GridLogicOperator.And,
};
```

If no `logicOperator` is provided, the data grid will use `GridLogicOperator.Or` by default.

### Initialize the filters

To initialize the filters without controlling them, provide the model to the `initialState` prop.

```jsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [{ field: 'rating', operator: '>', value: '2.5' }],
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
    items: [{ field: 'rating', operator: '>', value: '2.5' }],
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

The full typing details can be found on the [GridFilterOperator API page](/x/api/data-grid/grid-filter-operator/).

An operator determines if a cell value should be considered as a valid filtered value.
The candidate value used by the operator is the one corresponding to the `field` attribute or the value returned by the `valueGetter` of the `GridColDef`.

Each column type comes with a default array of operators.
You can get them by importing the following functions:

| Column type      | Function                           |
| :--------------- | :--------------------------------- |
| `string`         | `getGridStringOperators()`         |
| `number`         | `getGridNumericOperators()`        |
| `boolean`        | `getGridBooleanOperators()`        |
| `date`           | `getGridDateOperators()`           |
| `dateTime`       | `getGridDateOperators(true)`       |
| `singleSelect`   | `getGridSingleSelectOperators()`   |
| `multipleSelect` | `getGridMultipleSelectOperators()` |

You can find more information about the supported column types in the [columns section](/x/react-data-grid/column-definition/#column-types).

### Create a custom operator

If the built-in filter operators are not enough, creating a custom operator is an option.
A custom operator is defined by creating a `GridFilterOperator` object.
This object has to be added to the `filterOperators` attribute of the `GridColDef`.

The main part of an operator is the `getApplyFilterFn` function.
When applying the filters, the data grid will call this function with the filter item and the column on which the item must be applied.
This function must return another function that takes the cell value as an input and return `true` if it satisfies the operator condition.

```ts
const operator: GridFilterOperator = {
  label: 'From',
  value: 'from',
  getApplyFilterFn: (filterItem: GridFilterItem, column: GridColDef) => {
    if (!filterItem.field || !filterItem.value || !filterItem.operator) {
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

:::info
The [`valueFormatter`](/x/react-data-grid/column-definition/#value-formatter) is only used for rendering purposes.
:::

:::info
If the column has a [`valueGetter`](/x/react-data-grid/column-definition/#value-getter), then `params.value` will be the resolved value.
:::

:::info
The filter button displays a tooltip on hover if there are active filters. Pass [`getValueAsString`](/x/api/data-grid/grid-filter-operator/) in the filter operator to customize or convert the value to a more human-readable form.
:::

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

When defining a [custom column type](/x/react-data-grid/column-definition/#custom-column-types), by default the data grid will reuse the operators from the type that was extended.
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

You can customize the rendering of the filter panel as shown in [the component section](/x/react-data-grid/components/#overriding-components) of the documentation.

### Customize the filter panel content

The customization of the filter panel content can be performed by passing props to the default [`<GridFilterPanel />`](/x/api/data-grid/grid-filter-panel/) component.
The available props allow overriding:

- The `logicOperators` (can contains `GridLogicOperator.And` and `GridLogicOperator.Or`)
- The order of the column selector (can be `"asc"` or `"desc"`)
- Any prop of the input components

Input components can be [customized](/material-ui/customization/how-to-customize/) by using two approaches.
You can pass a `sx` prop to any input container or you can use CSS selectors on nested components of the filter panel.
More details are available in the demo.

| Props                     | CSS class                                  |
| :------------------------ | :----------------------------------------- |
| `deleteIconProps`         | `MuiDataGrid-filterFormDeleteIcon`         |
| `logicOperatorInputProps` | `MuiDataGrid-filterFormLogicOperatorInput` |
| `columnInputProps`        | `MuiDataGrid-filterFormColumnInput`        |
| `operatorInputProps`      | `MuiDataGrid-filterFormOperatorInput`      |
| `valueInputProps`         | `MuiDataGrid-filterFormValueInput`         |

The value input is a special case, because it can contain a wide variety of components (the one provided or [your custom `InputComponent`](#create-a-custom-operator)).
To pass props directly to the `InputComponent` and not its wrapper, you can use `valueInputProps.InputComponentProps`.

{{"demo": "CustomFilterPanelContent.js", "bg": "inline"}}

### Customize the filter panel position

The demo below shows how to anchor the filter panel to the toolbar button instead of the column header.

{{"demo": "CustomFilterPanelPosition.js", "bg": "inline", "defaultCodeOpen": false}}

## Server-side filter

Filtering can be run server-side by setting the `filterMode` prop to `server`, and implementing the `onFilterModelChange` handler.

The example below demonstrates how to achieve server-side filtering.

{{"demo": "ServerFilterGrid.js", "bg": "inline"}}

## Quick filter

Quick filter allows filtering rows by multiple columns with a single text input.
To enable it, you can add the `<GridToolbarQuickFilter />` component to your custom toolbar or pass `showQuickFilter` to the default `<GridToolbar />`.

By default, the quick filter considers the input as a list of values separated by space and keeps only rows that contain all the values.

{{"demo": "QuickFilteringGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Initialize the quick filter values

The quick filter values can be initialized by setting the `filter.filterModel.quickFilterValues` property of the `initialState` prop.

```tsx
<DataGrid
  initialState={{
    filter: {
      filterModel: {
        items: [],
        quickFilterValues: ['quick', 'filter'],
      },
    },
  }}
/>
```

{{"demo": "QuickFilteringInitialize.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom filtering logic

The logic used for quick filter can be switched to filter rows that contain _at least_ one of the values specified instead of testing if it contains all of them.
To do so, set `quickFilterLogicOperator` to `GridLogicOperator.Or` as follows:

```js
initialState={{
  filter: {
    filterModel: {
      items: [],
      quickFilterLogicOperator: GridLogicOperator.Or,
    },
  },
}}
```

With the default settings, quick filter will only consider columns with types `'string'`,`'number'`, `'singleSelect'`, and `'multipleSelect'`.

- For `'string'`, `'multipleSelect'`, and `'singleSelect'` columns, the cell's formatted value must **contain** the value
- For `'number'` columns, the cell's formatted value must **equal** the value

To modify or add the quick filter operators, add the property `getApplyQuickFilterFn` to the column definition.
This function is quite similar to `getApplyFilterFn`.
This function takes as an input a value of the quick filter and returns another function that takes the cell value as an input and returns `true` if it satisfies the operator condition.

In the example below, a custom filter is created for the `date` column to check if it contains the correct year.

```ts
getApplyQuickFilterFn: (value: string) => {
  if (!value || value.length !== 4 || !/\d{4}/.test(value)) {
    // If the value is not a 4 digit string, it can not be a year so applying this filter is useless
    return null;
  }
  return (params: GridCellParams): boolean => {
    return params.value.getFullYear() === Number(value);
  };
};
```

To remove the quick filtering on a given column set `getApplyQuickFilterFn: undefined`.

In the demo bellow, the column "Name" is not searchable with the quick filter, and 4 digits figures will be compared to the year of column "Created on."

{{"demo": "QuickFilteringCustomLogic.js", "bg": "inline", "defaultCodeOpen": false}}

### Parsing values

The values used by the quick filter are obtained by splitting with space.
If you want to implement a more advanced logic, the `<GridToolbarQuickFilter/>` component accepts a prop `quickFilterParser`.
This function takes the string from the search text field and returns an array of values.

If you control the `quickFilterValues` either by controlling `filterModel` or with the initial state, the content of the input must be updated to reflect the new values.
By default, values are joint with a spaces. You can customize this behavior by providing `quickFilterFormatter`.
This formatter can be seen as the inverse of the `quickFilterParser`.

For example, the following parser allows to search words containing a space by using the `','` to split values.

```jsx
<GridToolbarQuickFilter
  quickFilterParser={(searchInput) =>
    searchInput.split(',').map((value) => value.trim())
  }
  quickFilterFormatter={(quickFilterValues) => quickFilterValues.join(', ')}
  debounceMs={200} // time before applying the new quick filter value
/>
```

In the following demo, the quick filter value `"Saint Martin, Saint Lucia"` will return rows with country is Saint Martin or Saint Lucia.

{{"demo": "QuickFilteringCustomizedGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

:::warning
Only use this API as the last option. Give preference to the props to control the data grid.
:::

{{"demo": "FilterApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Filtering"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state)

## API

- [GridFilterForm](/x/api/data-grid/grid-filter-form/)
- [GridFilterItem](/x/api/data-grid/grid-filter-item/)
- [GridFilterModel](/x/api/data-grid/grid-filter-model/)
- [GridFilterOperator](/x/api/data-grid/grid-filter-operator/)
- [GridFilterPanel](/x/api/data-grid/grid-filter-panel/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
