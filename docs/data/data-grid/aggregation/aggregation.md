---
title: Data Grid - Aggregation
---

# Data Grid - Aggregation [<span class="plan-premium"></span>](https://mui.com/store/items/mui-x-premium/)

<p class="description">Use aggregation functions to combine your row values.</p>

The aggregation can be modified through the grid interface by opening the column menu and selecting an item on the _Aggregation_ select.

The aggregated values will be rendered in a footer row at the bottom of the grid.

:::warning
The footer row will be pinned at the bottom of the grid once [#1251](https://github.com/mui/mui-x/issues/1251) is ready.
:::

{{"demo": "AggregationBasic.js", "bg": "inline", "defaultCodeOpen": false}}

## Pass aggregation to the grid

### Structure of the model

The aggregation model is a lookup where the keys are the columns, and the values are aggregation items, containing the functions defining the aggregation behavior, and where the aggregated values should be displayed.

An aggregation item is an object where `item.footer` contains the name of the aggregation function to apply on the footers
and `item.inline` contains the name of the aggregation function to apply on the grouping rows.

:::info
If you only need to aggregate in the footer, you can use the short notation:

```ts
const model: GridAggregationModel = { gross: { footer: 'sum' } };
// can be replaced by
const model: GridAggregationModel = { gross: 'sum' };
```

:::

### Initialize the aggregation

To initialize the aggregation without controlling it, provide the model to the `initialState` prop.

{{"demo": "AggregationInitialState.js", "bg": "inline"}}

### Controlled aggregation

Use the `aggregationModel` prop to control the aggregation passed to the grid.

You can use the `onAggregationModelChange` prop to listen to changes to the aggregation and update the prop accordingly.

{{"demo": "AggregationControlled.js", "bg": "inline"}}

## Disable the aggregation

### For all columns

You can disable the aggregation by setting the `disableAggregation` prop to true.

It will disable all features related to the aggregation, even if a model is provided.

{{"demo": "AggregationDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

### For some columns

In case you need to disable the aggregation on specific column(s), set the `aggregatable` property on the respective column definition (`GridColDef`) to `false`.
In the example below, the `title` and `year` columns are blocked from being aggregated:

{{"demo": "AggregationColDefAggregable.js", "bg": "inline", "defaultCodeOpen": false}}

## Aggregation label

### Choose the column for the label

Use the `aggregationFooterLabelField` to choose on which column the label of the aggregation should be rendered.

{{"demo": "AggregationLabelColumn.js", "bg": "inline"}}

### Customize the content of the label

TODO

## Usage with row grouping

When the row grouping is enabled, the aggregated values can be displayed on two positions:

1. `footer` - the grid will add a root level footer to aggregate all the rows and one footer per group to aggregate its rows

2. `inline` - the grid will display aggregation on the grouping rows

Both positions can be used simultaneously with different aggregation function as shown in the example below:

```tsx
<DataGridPremium
  initialState={{
    rowGrouping: {
      model: ['company'],
    },
    aggregation: {
      model: {
        gross: {
          // Aggregation displayed on the footers
          footer: 'sum',
          // Aggregation displayed on the grouping rows
          inline: 'max',
        },
      },
    },
  }}
/>
```

{{"demo": "AggregationRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

### Only aggregate some groups

You can limit the aggregation to some groups with the `isGroupAggregated` prop.
This function receives two parameters:

1. The group from which the grid is trying to aggregate or `null` if trying to aggregate the root group.
2. The position on which the grid is trying to aggregate.

```tsx
// Will aggregate all the groups but not the root
isGroupAggregated={(groupNode) => groupNode != null}

// Will only aggregate the company groups
// Director groups and the root will not be aggregated
isGroupAggregated={(groupNode) => groupNode?.groupingField === 'company'}

// Will only aggregate the company group "Universal Pictures"
isGroupAggregated={(groupNode) =>
  groupNode?.groupingField === 'company' &&
  groupNode?.groupingKey === 'Universal Pictures'
}

// Will aggregate on the grouping rows and on the top level footee
isGroupAggregated={(groupNode, position) => position === 'inline' || groupNode == null}
```

The demo below shows the _sum_ aggregation on both the grouping rows and the top level footer.

{{"demo": "AggregationIsGroupAggregated.js", "bg": "inline"}}

## Usage with tree data

Like for row grouping, you can display the aggregated values either in the footer or in the grouping row.

:::info
If the aggregated value is displayed in the grouping row, it will always have priority over the row data.
This means that the data from groups explicitly provided in your dataset will be ignored in favour of their aggregated values.  
:::

The demo below shows the _sum_ aggregation on the "Size" column and the _max_ aggregation on the "Last modification" column.

{{"demo": "AggregationTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

## Filtering

By default, the aggregation only uses the filtered rows.
You can set the `aggregatedRows` to `"all"` to use all rows.

In the example below, the movie _Avatar_ is not passing the filters but is still used for the **max** aggregation of the `gross` column.

{{"demo": "AggregationFiltering.js", "bg": "inline"}}

## Aggregation functions

### Basic structure

An aggregation function is an object describing how to combine a given set of values.

The full typing details can be found on the [GridAggregationFunction API page](/x/api/data-grid/grid-aggregation-function/).

### Built-in functions

The `@mui/x-data-grid-premium` package comes with a set of built-in aggregation functions to cover the basic use-cases:

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

In the example below, the `sum` aggregation function has been removed.

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

In the example below, the **Year** column can be aggregated using the `max` and `min` functions, whereas all functions are available for the **Gross** column

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
    // The `label` property defined the label rendered when this aggregation function is the only one being used.
    label: 'First in alphabet',
    // The `types` property defines which type of columns can use this aggregation function.
    // Here, we only want to propose this aggregation function for `string` columns.
    // If not defined, the aggregation will be available for all column types.
    columnTypes: ['string'],
  };
```

In the example below, the grid have two additional custom aggregation functions for `string` columns: `firstAlphabetical` `lastAlphabetical`.

{{"demo": "AggregationCustomFunction.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom value formatter

By default, the aggregated cell uses the value formatter of its column.
But for some columns, the format of the aggregated value may have to differ from the format of the other cell values.

You can provide a `valueFormatter` method to your aggregation function to override the one of the column.

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

If the column used to display the aggregation have a `renderCell` property, the aggregated cell will call it with a `params.aggregation` object to let you decide how you want to render it.

This objects contains a `hasCellUnit` which informs you if the current aggregation has the same unit as the rest of this column's data (for instance, if your column is in `$`, does the aggregated value is also in `$` or is it unit-less ?)

In the example below, you can see that all the aggregation functions are rendered with the rating UI aside from `size`, because it's not a valid rating:

{{"demo": "AggregationRenderCell.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [GridAggregationFunction](/x/api/data-grid/grid-aggregation-function/)
