---
title: Data Grid - Aggregation
---

# Data Grid - Aggregation [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Add aggregation functions to the Data Grid to let users combine row values.</p>

The Data Grid Premium provides tools to give end users the ability to aggregate and compare row values.
It includes [built-in functions](#built-in-functions) to cover common use cases such as sum, average, minimum, and maximum, as well as the means to [create custom functions](#creating-custom-functions) for all other needs.

End users can aggregate rows through the Data Grid interface by opening the column menu and selecting from the items under **Aggregation**.
The aggregated values are rendered in a footer row at the bottom of the Grid.

{{"demo": "AggregationInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
This document covers client-side implementation.
For aggregation on the server side, see [Server-side aggregation](/x/react-data-grid/server-side-data/aggregation/).
:::

## Structure of the model

The aggregation model is an object.
The keys correspond to the columns, and the values are the names of the aggregation functions.

## Initializing aggregation

To initialize aggregation without controlling its state, provide the model to the `initialState` prop, as shown below:

{{"demo": "AggregationInitialState.js", "bg": "inline"}}

## Controlled aggregation

Use the `aggregationModel` prop to control aggregation passed to the Data Grid.
Use the `onAggregationModelChange` prop to listen to changes to aggregation and update the prop accordingly.

{{"demo": "AggregationControlled.js", "bg": "inline"}}

## Disabling aggregation

### For all columns

To disable aggregation, set the `disableAggregation` prop to `true`.
This will disable all features related to aggregation, even if a model is provided.

{{"demo": "AggregationDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

### For specific columns

To disable aggregation on a specific column, set the `aggregable` property on its column definition (`GridColDef`) to `false`.

In the example below, the **Year** column is not aggregable since its `aggregable` property is set to `false`.

{{"demo": "AggregationColDefAggregable.js", "bg": "inline", "defaultCodeOpen": false}}

## Aggregating non-aggregable columns

To apply aggregation programmatically on non-aggregable columns (columns with `aggregable: false` in the [column definition](/x/api/data-grid/grid-col-def/)), you can provide the aggregation model in one of the following ways:

- Pass `aggregation.model` to the `initialState` prop. This initializes aggregation with the provided model.
- Provide the `aggregationModel` prop. This controls aggregation with the provided model.
- Call the API method `setAggregationModel()`. This applies an aggregation with the provided model.

In the following demo, even though the **Year** column is not aggregable, it's still aggregated in read-only mode by providing an initial aggregation model as described above.

{{"demo": "AggregationColDefNonAggregable.js", "bg": "inline", "defaultCodeOpen": false}}

## Usage with row grouping

When [row grouping](/x/react-data-grid/row-grouping/) is enabled, aggregated values can be displayed in the grouping rows as well as the top-level footer.

In the example below, each row group's sum is aggregated and displayed in its grouping row, and the total sum for all rows is displayed in the footer.

{{"demo": "AggregationRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

You can use the `getAggregationPosition` prop to customize this behavior.
This function takes the current group node as an argument (or `null` for the root group) and returns the position of the aggregated value.
The position can be one of three values:

- `"footer"`—the Data Grid adds a footer to the group to aggregate its rows.
- `"inline"`—the Data Grid disables aggregation on the grouping row.
- `null`—the Data Grid doesn't aggregate the group.

The following snippets build on the demo above to show various use cases for the `getAggregationPosition` prop:

```tsx
// Aggregate the root group in the top-level footer
// and the other groups in their grouping row
// (default behavior)
getAggregationPosition=(groupNode) => (groupNode == null ? 'footer' : 'inline'),

// Aggregate all the groups in their grouping row;
// the root will not be aggregated
getAggregationPosition={(groupNode) => groupNode == null ? null : 'inline'}

// Only aggregate the company groups in the grouping row;
// director groups and root will not be aggregated
getAggregationPosition={(groupNode) => groupNode?.groupingField === 'company' ? 'inline' : null}

// Only aggregate the company group "Universal Pictures" in the grouping row
getAggregationPosition={(groupNode) =>
(groupNode?.groupingField === 'company' &&
  groupNode?.groupingKey === 'Universal Pictures') ? 'inline' : null
}

// Only aggregate the root group in the top-level footer
getAggregationPosition={(groupNode) => groupNode == null ? 'footer' : null}
```

The demo below shows the sum aggregation in the footer of each group but not in the top-level footer:

{{"demo": "AggregationGetAggregationPosition.js", "bg": "inline"}}

## Usage with tree data

When working with [tree data](/x/react-data-grid/tree-data/), aggregated values can be displayed in the footer and in grouping rows.

:::info
If an aggregated value is displayed in a grouping row, it always takes precedence over any existing row data.
This means that even if the dataset explicitly provides group values, they will be ignored in favor of the aggregated values calculated by the Data Grid.
:::

In the demo below, the max values of the **Last modification** column and the sums of the **Size** column values are displayed in both the grouping rows and the footer:

{{"demo": "AggregationTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

## Filtering

By default, aggregation only uses filtered rows.
To use all rows, set the `aggregationRowsScope` prop to `"all"`.

In the example below, the movie _Avatar_ doesn't pass the filters but is still used for the max aggregation of the **Gross** column:

{{"demo": "AggregationFiltering.js", "bg": "inline"}}

## Aggregation functions

### Basic structure

An aggregation function is an object that describes how to combine a given set of values.

```ts
const minAgg: GridAggregationFunction<number | Date> = {
  // Aggregates the `values` into a single value.
  apply: ({ values }) => Math.min(...values.filter((value) => value != null)),
  // This aggregation function is only compatible with numerical values.
  columnTypes: ['number'],
};
```

You can find full typing details in the [`GridAggregationFunction` API reference](/x/api/data-grid/grid-aggregation-function/).

### Built-in functions

The `@mui/x-data-grid-premium` package comes with a set of built-in aggregation functions to cover common use cases:

| Name   | Behavior                                                   | Supported column types       |
| :----- | :--------------------------------------------------------- | :--------------------------- |
| `sum`  | Returns the sum of all values in the group                 | `number`                     |
| `avg`  | Returns the non-rounded average of all values in the group | `number`                     |
| `min`  | Returns the smallest value of the group                    | `number`, `date`, `dateTime` |
| `max`  | Returns the largest value of the group                     | `number`, `date`, `dateTime` |
| `size` | Returns the number of cells in the group                   | all                          |

### Removing a built-in function

#### From all columns

To remove specific aggregation functions from all columns, pass a filtered object to the `aggregationFunctions` prop.
In the example below, the sum function has been removed:

{{"demo": "AggregationRemoveFunctionAllColumns.js", "bg": "inline"}}

#### From a specific column

To limit the aggregation options in a given column, pass the `availableAggregationFunctions` property to the column definition.
This lets you specify which options are available to the end user:

```ts
const column = {
  field: 'year',
  type: 'number',
  availableAggregationFunctions: ['max', 'min'],
};
```

In the example below, you can only aggregate the **Year** column using the max and min functions, whereas all functions are available for the **Gross** column:

{{"demo": "AggregationRemoveFunctionOneColumn.js", "bg": "inline"}}

### Creating custom functions

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
    // The `label` property defines the label displayed in the column header
    // when this aggregation is being used.
    label: 'firstAlphabetical',
    // The `types` property defines which type of columns can use this aggregation function.
    // Here, we only want to propose this aggregation function for `string` columns.
    // If not defined, aggregation will be available for all column types.
    columnTypes: ['string'],
  };
```

To provide custom aggregation functions, pass them to the `aggregationFunctions` prop on the Data Grid Premium.
In the example below, the Grid has two custom functions for `string` columns: `firstAlphabetical` and `lastAlphabetical`:

{{"demo": "AggregationCustomFunction.js", "bg": "inline", "defaultCodeOpen": false}}

### Aggregating data from multiple row fields

By default, the `apply` method of the aggregation function receives an array of values that represent a single field value from each row.

In the example below, the sum function receives the values of the `gross` field.
The values in the `profit` column are derived from the `gross` and `budget` fields of the row:

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

To aggregate the `profit` column, you would have to calculate the sum of the `gross` and `budget` fields separately, and then use the formula from the example above to calculate the aggregated `profit` value.
To do this, you can use the `getCellValue()` callback on the aggregation function to transform the data being passed to the `apply()` method:

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

By default, an aggregated cell uses the value formatter of its corresponding column.
But for some columns, the format of the aggregated value might differ from that of the column values.
You can provide a `valueFormatter()` method to the aggregation function to override the column's default formatting:

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

If the column used to display aggregation has a `renderCell()` property, then the aggregated cell calls it with a `params.aggregation` object to let you decide how you want to render it.
This object contains a `hasCellUnit` property to indicate whether the current aggregation has the same unit as the rest of the column's data—for instance, if the column is in `$`, is the aggregated value is also in `$`?

In the example below, all the aggregation functions are rendered with the rating UI aside from `size`, because it's not a valid rating:

{{"demo": "AggregationRenderCell.js", "bg": "inline", "defaultCodeOpen": false}}

## Selectors

{{"component": "modules/components/SelectorsDocs.js", "category": "Aggregation"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridAggregationFunction](/x/api/data-grid/grid-aggregation-function/)
