---
title: Data Grid - Aggregation
---

# Data Grid - Aggregation [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Add aggregation functions to the Data Grid so users can combine row values.</p>

You can aggregate rows through the Data Grid interface by opening the column menu and selecting from the items under **Aggregation**.

The aggregated values are rendered in a footer row at the bottom of the Data Grid.

{{"demo": "AggregationInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

## Pass aggregation to the Data Grid

### Structure of the model

The aggregation model is an object.
The keys correspond to the columns, and the values are the name of the aggregation functions to use.

### Initialize aggregation

To initialize aggregation without controlling its state, provide the model to the `initialState` prop.

{{"demo": "AggregationInitialState.js", "bg": "inline"}}

### Controlled aggregation

Use the `aggregationModel` prop to control aggregation passed to the Data Grid.

Use the `onAggregationModelChange` prop to listen to changes to aggregation and update the prop accordingly.

{{"demo": "AggregationControlled.js", "bg": "inline"}}

## Disable aggregation

### For all columns

To disable aggregation, set the `disableAggregation` prop to `true`.
This will disable all features related to aggregation, even if a model is provided.

{{"demo": "AggregationDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

### For some columns

To disable aggregation on a specific column, set the `aggregable` property on its column definition (`GridColDef`) to `false`.

In the example below, the **Year** column is not aggregable since its `aggregable` property is set to `false`.

{{"demo": "AggregationColDefAggregable.js", "bg": "inline", "defaultCodeOpen": false}}

### Aggregating non-aggregable columns programmatically

To apply aggregation programmatically on non-aggregable columns (columns with `aggregable: false` in the [column definition](/x/api/data-grid/grid-col-def/)), you can provide aggregation model in one of the following ways:

1. Pass `aggregation.model` to the `initialState` prop. This will [initialize the aggregation](/x/react-data-grid/aggregation/#initialize-aggregation) with the provided model.
2. Provide the `aggregationModel` prop. This will [control the aggregation](/x/react-data-grid/aggregation/#controlled-aggregation) with the provided model.
3. Call the API method `setAggregationModel`. This will set the aggregation with the provided model.

In the demo below, although the **Year** column is not aggregable, yet it's aggregated in a read-only mode by providing an initial aggregation model.

{{"demo": "AggregationColDefNonAggregable.js", "bg": "inline", "defaultCodeOpen": false}}

## Usage with row grouping

When row grouping is enabled, the aggregated values will be displayed in two places:

1. On the grouping rows—the Data Grid will display each group aggregated value on its grouping row.
2. On the top-level footer—the Data Grid will add a top-level footer to aggregate all the rows, as it would with a flat row list.

{{"demo": "AggregationRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `getAggregationPosition` prop to customize this behavior.
This function takes the current group node as an argument (`null` for the root group) and returns the position of the aggregated value.
This position must be one of the three following values:

1. `"footer"`—the Data Grid adds a footer to the group to aggregate its rows.
2. `"inline"`—the Data Grid disables aggregation on the grouping row.
3. `null`—the Data Grid doesn't aggregate the group.

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

The demo below shows the **SUM** aggregation on the footer of each group but not on the top-level footer:

{{"demo": "AggregationGetAggregationPosition.js", "bg": "inline"}}

## Usage with tree data

As with row grouping, you can display the aggregated values either in the footer or in the grouping row.

:::info
If the aggregated value is displayed in the grouping row, it always has priority over the row data.

This means that the data from groups explicitly provided in the dataset are ignored in favor of their aggregated values.
:::

The demo below shows the **SUM** aggregation on the **Size** column and the **MAX** aggregation on the **Last modification** column:

{{"demo": "AggregationTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

## Filtering

By default, aggregation only uses the filtered rows.
To use all rows, set the `aggregationRowsScope` to `"all"`.

In the example below, the movie _Avatar_ doesn't pass the filters but is still used for the **MAX** aggregation of the **Gross** column:

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

You can find full typing details on the [GridAggregationFunction API page](/x/api/data-grid/grid-aggregation-function/).

### Built-in functions

The `@mui/x-data-grid-premium` package comes with a set of built-in aggregation functions to cover the basic use cases:

| Name   | Behavior                                                   | Supported column types       |
| :----- | :--------------------------------------------------------- | :--------------------------- |
| `sum`  | Returns the sum of all values in the group                 | `number`                     |
| `avg`  | Returns the non-rounded average of all values in the group | `number`                     |
| `min`  | Returns the smallest value of the group                    | `number`, `date`, `dateTime` |
| `max`  | Returns the largest value of the group                     | `number`, `date`, `dateTime` |
| `size` | Returns the number of cells in the group                   | all                          |

### Remove a built-in function

#### For all columns

To remove specific aggregation functions from all columns, pass a filtered object to the `aggregationFunctions` prop.
In the example below, the **SUM** function has been removed:

{{"demo": "AggregationRemoveFunctionAllColumns.js", "bg": "inline"}}

#### For one column

To limit the aggregation options in a given column, pass the `availableAggregationFunctions` property to the column definition.

This lets you specify which options will be available, as shown below:

```ts
const column = {
  field: 'year',
  type: 'number',
  availableAggregationFunctions: ['max', 'min'],
};
```

In the example below, you can aggregate the **Year** column using the **MAX** and **MIN** functions, whereas all functions are available for the **Gross** column:

{{"demo": "AggregationRemoveFunctionOneColumn.js", "bg": "inline"}}

### Create custom functions

Pass custom aggregation functions to the `aggregationFunctions` prop.

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

In the example below, the Data Grid has two additional custom aggregation functions for `string` columns: `firstAlphabetical` and `lastAlphabetical`:

{{"demo": "AggregationCustomFunction.js", "bg": "inline", "defaultCodeOpen": false}}

### Aggregating data from multiple row fields

By default, the `apply` method of the aggregation function receives an array of values that represent a single field value of each row.
For example, the `sum` aggregation function receives the values of the `gross` field.

In the example below, the values in the `profit` column are derived from the `gross` and `budget` fields of the row:

```tsx
{
  field: 'profit',
  type: 'number',
  valueGetter: (value, row) => {
    if (!row.gross || !row.budget) {
      return null;
    }
    return (row.gross - row.budget) / row.budget;
  }
}
```

To aggregate the `profit` column, you have to calculate the sum of the `gross` and `budget` fields separately, and then use the formula from the example above to calculate the aggregated `profit` value.

To do so, use the `getCellValue` callback on the aggregation function to transform the data that are being passed to the `apply` method:

```tsx
const profit: GridAggregationFunction<{ gross: number; budget: number }, number> = {
  label: 'profit',
  getCellValue: ({ row }) => ({ budget: row.budget, gross: row.gross }),
  apply: ({ values }) => {
    let budget = 0;
    let gross = 0;
    values.forEach((value) => {
      if (value) {
        gross += value.gross;
        budget += value.budget;
      }
    });
    return (gross - budget) / budget;
  },
  columnTypes: ['number'],
};
```

{{"demo": "AggregationMultipleRowFields.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom value formatter

By default, the aggregated cell uses the value formatter of its column.
But for some columns, the format of the aggregated value may need to differ from the format of the other cell values.

Provide a `valueFormatter` method to the aggregation function to override the column's default formatting:

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

If the column used to display aggregation has a `renderCell` property, the aggregated cell calls it with a `params.aggregation` object to let you decide how you want to render it.

This object contains a `hasCellUnit` which lets you know if the current aggregation has the same unit as the rest of the column's data—for instance, if the column is in `$`, is the aggregated value is also in `$`?

In the example below, you can see that all the aggregation functions are rendered with the rating UI aside from `size`, because it's not a valid rating:

{{"demo": "AggregationRenderCell.js", "bg": "inline", "defaultCodeOpen": false}}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Aggregation"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridAggregationFunction](/x/api/data-grid/grid-aggregation-function/)
