---
title: Data Grid - Aggregation
---

# Data Grid - Aggregation [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

<p class="description">Apply aggregation function to populate the group row with values.</p>

## Set aggregation

### Initialize the aggregation

{{"demo": "AggregationInitialState.js", "bg": "inline"}}

### Controlled aggregation

If you need to control the state of the aggregation model, use the `aggregationModel` prop.
You can use the `onAggregationModelChange` prop to listen to changes to the model and update the prop accordingly.

{{"demo": "AggregationControlled.js", "bg": "inline"}}

## Usage with row grouping

When using aggregation with row grouping, all the groups will contain the aggregated value

{{"demo": "AggregationRowGroupingFooter.js", "bg": "inline", "defaultCodeOpen": false}}

### Render aggregated values on the group rows

By default, the aggregated values are rendered on a footer row for each group.
But you can switch the `aggregationPosition` prop to `"inline"` to render them directly on the group row.

{{"demo": "AggregationRowGroupingInline.js", "bg": "inline"}}

### Only aggregate some groups

You can limit the aggregation to some groups with the `isGroupAggregated` prop.
This function receives the group from which the grid is trying to aggregate or `null` if trying to aggregate the root group.

```tsx
// Will aggregate all the groups but not the root
isGroupAggregated={(groupNode) => groupNode != null}

// Will only aggregate the company groups, director groups and the root will not be aggregated
isGroupAggregated={(groupNode) => groupNode?.groupingField === 'company'}

// Will only aggregate the company group "Universal Pictures"
isGroupAggregated={(groupNode) =>
  groupNode?.groupingField === 'company' &&
  groupNode?.groupingKey === 'Universal Pictures'
}
```

The demo below shows only aggregate the groups.

{{"demo": "AggregationIsGroupAggregated.js", "bg": "inline"}}

> ⚠️ If you are using `aggregationPosition: "inline"`, there is no root footer,
> so the root will not be aggregated, even is `isGroupAggregated` says otherwise.

## Filtering

By default, the aggregation only uses the filtered rows.
You can set the `aggregatedRows` to `"all"` to use all rows.

In the example below, the movie _Avatar_ is not passing the filters but is still used for the **max** aggregation of the `gross` column.

{{"demo": "AggregationFiltering.js", "bg": "inline"}}

## Aggregation functions

### Basic structure

An aggregation function is an object describing how to generate an aggregated value for a given set of values.

Let's take a look at a simple aggregation function:

The full typing details can be found on the [GridAggregationFunction API page](/x/api/data-grid/grid-aggregation-function/).

### Built-in functions

The `@mui/x-data-grid-premium` package comes with a set of built-in aggregation functions that should cover all the basic use-cases.

| Name   | Behavior                                                   | Column types                 |
| ------ | ---------------------------------------------------------- | ---------------------------- |
| `sum`  | Returns the sum of all values in the group                 | `number`                     |
| `avg`  | Returns the non-rounded average of all values in the group | `number`                     |
| `min`  | Returns the smallest value of the group                    | `number`, `date`, `dateTime` |
| `max`  | Returns the largest value of the group                     | `number`, `date`, `dateTime` |
| `size` | Returns the amount of cells in the group                   | all                          |

### Remove a built-in function

#### Remove a built-in function for all columns

You can remove some aggregations functions for all columns by passing a filtered object to the `aggregationFunctions` prop.

In the example below, the `sum` aggregation function have been removed.

{{"demo": "AggregationRemoveFunctionAllColumns.js", "bg": "inline"}}

#### Remove a built-in function for one column

You can remove some aggregation function for one column by passing a `availableAggregationFunctions` property to the column definition.

```ts
const column = {
  field: 'year',
  type: 'number',
  availableAggregationFunctions: ['max', 'min'],
};
```

In the example below, the only aggregation function available for the **Year** column is `max` whereas all aggregation functions are available for the **Gross** column

{{"demo": "AggregationRemoveFunctionOneColumn.js", "bg": "inline"}}

### Create a custom functions

You can pass custom aggregation functions to the `aggregationFunctions` prop.

An aggregation function is an object with the following shape:

```ts
const firstAlphabeticalAggregation: GridAggregationFunction<string, string | null> =
  {
    // The `apply` method takes the values to aggregate and returns the aggregated value
    apply: (params) => {
      if (params.values.length === 0) {
        return null;
      }

      const sortedValue = params.values.sort((a = '', b = '') => a.localeCompare(b));

      return sortedValue[0];
    },
    // The `types` property defines which type of columns can use this aggregation function.
    // Here, we only want to propose this aggregation function for `string` columns.
    // If not defined, the aggregation will be available for all column types.
    types: ['string'],
  };
```

In the example below, the grid have two additional custom aggregation functions for `string` columns: `firstAlphabetical` `lastAlphabetical`.

{{"demo": "AggregationCustomFunction.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom value formatter

By default, the aggregated value will use the value formatter from the column.
But for some columns, the format of the aggregated value may have to differ from the format of the cell values.

You can provide a `valueFormatter` method to your aggregation function to override the one from the column.

```ts
const aggregationFunction: GridAggregationFunction = {
  apply: () => {
    /* */
  },
  types: [
    /* */
  ],
  valueFormatter: (params) => {
    /* format the aggregated value */
  },
};
```

{{"demo": "AggregationValueFormatter.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom rendering

If the column you are aggregating from have a `renderCell` property, the aggregated cell will call it with a `params.aggregation` object to let you decide whether you want to render your custom UI for it.

This objects contains a `hasCellUnit` which lets you know if the current aggregation has the same unit as the rest of this column's data (for instance, if your column is in `$`, does the aggregated value is also in `$` or is it unit-less)

In the example below, you can see that all the aggregation function are rendered with the rating UI except the `size` one because it is not a valid rating.

{{"demo": "AggregationRenderCell.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
