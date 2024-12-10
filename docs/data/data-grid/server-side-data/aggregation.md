---
title: React Data Grid - Server-side aggregation
---

# Data Grid - Server-side aggregation [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')🧪

<p class="description">Aggregation with server-side data source.</p>

To dynamically load tree data from the server, you must create a data source and pass the `unstable_dataSource` prop to the Data Grid, as detailed in the [overview section](/x/react-data-grid/server-side-data/).

:::info
If you are looking for aggregation on the client-side, see [client-side aggregation](/x/react-data-grid/aggregation/).
:::

Since the computation of the server-side aggregation resides on the server, the Data Grid requires some additional information to make it work.

1. Pass the available aggregation functions of type `GridAggregationFunctionDataSource` to the Data Grid using the `aggregationFunctions` prop. It's default value is empty when the Data Grid is used with server-side data.

   ```tsx
   const aggregationFunctions: Record<string, GridAggregationFunctionDataSource> = {
      size: { label: 'Size' },
      sum: { label: 'Sum', columnTypes: ['number'] },
   }

   <DataGridPremium aggregationFunctions={aggregationFunctions} />
   ```

   The `GridAggregationFunctionDataSource` has a similar structure to `GridAggregationFunction`, but it doesn't have the properties that correspond to the computation of the aggregation. These properties are `apply` and `getCellValue`.

   You can find full typing details on the [GridAggregationFunctionDataSource API page](/x/api/data-grid/grid-aggregation-function-data-source/).

2. Use aggregationModel passed in the `getRows` method of `GridDataSource` to fetch the aggregated values.
   For the root level footer aggregation row, pass `aggregateRow` containing the aggregated values in the `GetRowsResponse`.

   ```diff
    const dataSource = {
      getRows: async ({
        sortModel,
        filterModel,
        paginationModel,
   +    aggregationModel,
      }) => {
        const rows = await fetchRows();
   -    const response = await fetchData({ sortModel, filterModel, paginationModel });
   +    const response = await fetchData({ sortModel, filterModel, paginationModel, aggregationModel });
        return {
          rows: response.rows,
          rowCount: getRowsResponse.totalCount,
   +      aggregateRow: response.aggregateRow,
        }
      }
    }
   ```

3. Pass the getter method `getAggregatedValue` in `GridDataSource` that defines how to get the aggregated value for a parent row (including the `aggregateRow`).

   ```tsx
   const dataSource = {
     getRows: async ({
      ...
     }) => {
      ...
     },
     getAggregatedValue: (row, field) => {
       return row[`${field}Aggregate`];
     },
   }
   ```

The following example demonstrates a basic server-side aggregation.

{{"demo": "ServerSideDataGridAggregation.js", "bg": "inline"}}

## Customize the aggregation rows scope

Even though it depends on the business logic on the server, in general, the aggregation is computed for the filtered rows only, as obvious from the default value of the prop `aggregationRowsScope`.

```ts
/**
 * Rows used to generate the aggregated value.
 * If `filtered`, the aggregated values are generated using only the rows currently passing the filtering process.
 * If `all`, the aggregated values are generated using all the rows.
 * @default "filtered"
 */
aggregationRowsScope: 'filtered' | 'all';
```

To make it customizable on the server, the Data Grid passes the `aggregationRowsScope` prop to the `getRows` method of `GridDataSource`.
Use it to define the rows used to compute the aggregation.

```tsx
const dataSource = {
  getRows: async ({ aggregationRowsScope, ...otherParams }) => {
    const response = await fetchRows({
      ...otherParams,
      aggregationRowsScope,
    });
    return {
      rows: response.rows,
      rowCount: rows.length,
      // The values computed for the aggregation based on the rows scope
      aggregateRow: rows.aggregateRow,
    };
  },
};
```

## Usage with tree data

The server-side aggregation can be used with tree data. The aggregated values are acquired from the parent rows using the `getAggregatedValue` method.
The following example demonstrates that behavior.

{{"demo": "ServerSideDataGridAggregationTreeData.js", "bg": "inline"}}

## Usage with row grouping

Similar to the tree data, the server-side aggregation can be used with row grouping. The aggregated values are acquired from the parent rows using the `getAggregatedValue` method.
The following example demonstrates that behavior.

{{"demo": "ServerSideDataGridAggregationRowGrouping.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridAggregationFunctionDataSource](/x/api/data-grid/grid-aggregation-function-data-source/)
