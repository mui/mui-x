---
title: Data Grid - Aggregation
---

# Data grid - Aggregation [<span class="plan-premium"></span>](https://mui.com/store/items/mui-x-premium/)

<p class="description">Use aggregation functions to combine your row values.</p>

You can aggregate rows through the grid interface by opening the column menu and selecting from the items under **Aggregation**.

The aggregated values will be rendered in a footer row at the bottom of the grid.

:::warning
This feature is experimental, it needs to be explicitly activated using the `aggregation` experimental feature flag.

```tsx
<DataGridPremium experimentalFeatures={{ aggregation: true }} {...otherProps} />
```

:::

{{"demo": "AggregationInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

## Pass aggregation to the grid

### Structure of the model

The aggregation model is an object.
The keys correspond to the columns, and the values are the name of the aggregation functions to use.

### Initialize aggregation

To initialize aggregation without controlling its state, provide the model to the `initialState` prop.

{{"demo": "AggregationInitialState.js", "bg": "inline"}}

### Controlled aggregation

Use the `aggregationModel` prop to control aggregation passed to the grid.

You can use the `onAggregationModelChange` prop to listen to changes to aggregation and update the prop accordingly.

{{"demo": "AggregationControlled.js", "bg": "inline"}}

## Disable aggregation

### For all columns

You can disable aggregation by setting the `disableAggregation` prop to true.

It will disable all features related to aggregation, even if a model is provided.

{{"demo": "AggregationDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

### For some columns

In case you need to disable aggregation on specific column(s), set the `aggregable` property on the respective column definition (`GridColDef`) to `false`.
In the example below, the `title` and `year` columns are blocked from being aggregated:

{{"demo": "AggregationColDefAggregable.js", "bg": "inline", "defaultCodeOpen": false}}

## Usage with row grouping

When the row grouping is enabled, the aggregated values will be displayed in two places:

1. On the grouping rows - the grid will display each group aggregated value on its grouping row

2. On the top-level footer - the grid will add a top-level footer to aggregate all the rows, as it would with a flat row list

{{"demo": "AggregationRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

You can customize this behavior using the `getAggregationPosition` prop.

This function takes the current group node as an argument (`null` for the root group) and returns the position of the aggregated value.
This position must be one of the three following values:

1. `"footer"` - the grid will add a footer to the group to aggregate its rows

2. `"inline"` - the grid will disable aggregation on the grouping row

3. `null` - the grid will not aggregate the group

```tsx
// Will aggregate the root group on the top-level footer and the other groups on their grouping row
// (default behavior)
getAggregationPosition=(groupNode) => (groupNode == null ? 'footer' : 'inline'),

// Will aggregate all the groups on their grouping row
// The root will not be aggregated
getAggregationPosition={(groupNode) => groupNode == null ? null : 'inline'}

// Will only aggregate the company groups on the grouping row
// Director groups and the root will not be aggregated
getAggregationPosition={(groupNode) => groupNode?.groupingField === 'company' ? 'inline' : null}

// Will only aggregate the company group "Universal Pictures" on the grouping row
getAggregationPosition={(groupNode) =>
(groupNode?.groupingField === 'company' &&
  groupNode?.groupingKey === 'Universal Pictures') ? 'inline' : null
}

// Will only aggregate the root group on the top-level footer
getAggregationPosition={(groupNode) => groupNode == null ? 'footer' : null}
```

The demo below shows the _sum_ aggregation on the footer of each group but not on the top-level footer:

{{"demo": "AggregationGetAggregationPosition.js", "bg": "inline"}}

## Usage with tree data

As with row grouping, you can display the aggregated values either in the footer or in the grouping row.

:::info
If the aggregated value is displayed in the grouping row, it will always have priority over the row data.

This means that the data from groups explicitly provided in your dataset will be ignored in favor of their aggregated values.  
:::

The demo below shows the _sum_ aggregation on the **Size** column and the _max_ aggregation on the **Last modification** column.

{{"demo": "AggregationTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

## Filtering

By default, aggregation only uses the filtered rows.
You can set the `aggregationRowsScope` to `"all"` to use all rows.

In the example below, the movie _Avatar_ is not passing the filters but is still used for the **max** aggregation of the `gross` column.

{{"demo": "AggregationFiltering.js", "bg": "inline"}}

## Aggregation functions

### Basic structure

An aggregation function is an object describing how to combine a given set of values.

```ts
const minAgg: GridAggregationFunction<number | Date> = {
  // Aggregates the `values` into a single value.
  apply: ({ values }) => Math.min(...values.filter((value) => value != null)),
  // This aggregation function is only compatible with numerical values.
  columnTypes: ['number'],
};
```

The full typing details can be found on the [GridAggregationFunction API page](/x/api/data-grid/grid-aggregation-function/).

### Built-in functions

The `@mui/x-data-grid-premium` package comes with a set of built-in aggregation functions to cover the basic use cases:

| Name   | Behavior                                                   | Supported column types       |
| ------ | ---------------------------------------------------------- | ---------------------------- |
| `sum`  | Returns the sum of all values in the group                 | `number`                     |
| `avg`  | Returns the non-rounded average of all values in the group | `number`                     |
| `min`  | Returns the smallest value of the group                    | `number`, `date`, `dateTime` |
| `max`  | Returns the largest value of the group                     | `number`, `date`, `dateTime` |
| `size` | Returns the amount of cells in the group                   | all                          |

### Remove a built-in function

#### Remove a built-in function for all columns

You can remove some aggregation functions for all columns by passing a filtered object to the `aggregationFunctions` prop.

In the example below, the `sum` aggregation function has been removed:

{{"demo": "AggregationRemoveFunctionAllColumns.js", "bg": "inline"}}

#### Remove a built-in function for one column

You can limit the aggregation options in a given column by passing the `availableAggregationFunctions` property to the column definition.

This lets you specify which options will be available, as shown below:

```ts
const column = {
  field: 'year',
  type: 'number',
  availableAggregationFunctions: ['max', 'min'],
};
```

In the example below, the **Year** column can be aggregated using the `max` and `min` functions, whereas all functions are available for the **Gross** column:

{{"demo": "AggregationRemoveFunctionOneColumn.js", "bg": "inline"}}

### Create custom functions

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
    // The `label` property defines the label displayed in the column header when this aggregation is being used.
    label: 'firstAlphabetical',
    // The `types` property defines which type of columns can use this aggregation function.
    // Here, we only want to propose this aggregation function for `string` columns.
    // If not defined, aggregation will be available for all column types.
    columnTypes: ['string'],
  };
```

In the example below, the grid has two additional custom aggregation functions for `string` columns—`firstAlphabetical` and `lastAlphabetical`:

{{"demo": "AggregationCustomFunction.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom value formatter

By default, the aggregated cell uses the value formatter of its column.
But for some columns, the format of the aggregated value may have to differ from the format of the other cell values.

You can provide a `valueFormatter` method to your aggregation function to override the column's default formatting.

```ts
const aggregationFunction: GridAggregationFunction = {
  apply: () => {
    /* */
  },
  valueFormatter: (params) => {
    /* format the aggregated value */
  },
};
```

{{"demo": "AggregationValueFormatter.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom rendering

If the column used to display aggregation has a `renderCell` property, the aggregated cell will call it with a `params.aggregation` object to let you decide how you want to render it.

This object contains a `hasCellUnit` which lets you know if the current aggregation has the same unit as the rest of the column's data—for instance, if your column is in `$`, is the aggregated value is also in `$`?

In the example below, you can see that all the aggregation functions are rendered with the rating UI aside from `size`, because it's not a valid rating:

{{"demo": "AggregationRenderCell.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridAggregationFunction](/x/api/data-grid/grid-aggregation-function/)
