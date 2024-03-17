# Data Grid - Filter customization

<p class="description">Ways to customize your filters.</p>

## Customize the operators

The full typing details can be found on the [GridFilterOperator API page](/x/api/data-grid/grid-filter-operator/).

An operator determines if a cell value should be considered as a valid filtered value.
The candidate value used by the operator is the one corresponding to the `field` attribute or the value returned by the `valueGetter` of the `GridColDef`.

Each column type comes with a default array of operators.
You can get them by importing the following functions:

| Column type    | Function                         |
| :------------- | :------------------------------- |
| `string`       | `getGridStringOperators()`       |
| `number`       | `getGridNumericOperators()`      |
| `boolean`      | `getGridBooleanOperators()`      |
| `date`         | `getGridDateOperators()`         |
| `dateTime`     | `getGridDateOperators(true)`     |
| `singleSelect` | `getGridSingleSelectOperators()` |

You can find more information about the supported column types in the [columns section](/x/react-data-grid/column-definition/#column-types).

### Create a custom operator

If the built-in filter operators are not enough, creating a custom operator is an option.
A custom operator is defined by creating a `GridFilterOperator` object.
This object has to be added to the `filterOperators` attribute of the `GridColDef`.

The main part of an operator is the `getApplyFilterFn` function.
When applying the filters, the data grid will call this function with the filter item and the column on which the item must be applied.
This function must return another function that takes the cell value as an input and return `true` if it satisfies the operator condition.

```ts
const operator: GridFilterOperator<any, number> = {
  label: 'From',
  value: 'from',
  getApplyFilterFn: (filterItem, column) => {
    if (!filterItem.field || !filterItem.value || !filterItem.operator) {
      return null;
    }

    return (value, row, column, apiRef) => {
      return Number(value) >= Number(filterItem.value);
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
const operator: GridFilterOperator<any, number> = {
  label: 'Between',
  value: 'between',
  getApplyFilterFn: (filterItem) => {
    if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
      return null;
    }
    if (filterItem.value[0] == null || filterItem.value[1] == null) {
      return null;
    }
    return (value) => {
      return (
        value != null && filterItem.value[0] <= value && value <= filterItem.value[1]
      );
    };
  },
  InputComponent: InputNumberInterval,
};
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
  type: 'number',
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

## API

- [GridFilterOperator](/x/api/data-grid/grid-filter-operator/)
- [GridFilterItem](/x/api/data-grid/grid-filter-item/)
- [GridFilterPanel](/x/api/data-grid/grid-filter-panel/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
