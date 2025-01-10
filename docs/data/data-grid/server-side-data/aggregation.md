---
title: React Data Grid - Server-side aggregation
---

# Data Grid - Server-side aggregation [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')🧪

<p class="description">Aggregation with server-side data source.</p>

To dynamically load tree data from the server, you must create a data source and pass the `unstable_dataSource` prop to the Data Grid, as detailed in the [Server-side data overview](/x/react-data-grid/server-side-data/).

:::info
If you're looking for aggregation on the client side, see [Aggregation](/x/react-data-grid/aggregation/).
:::

Server-side aggregation requires some additional steps to implement:

1. Pass the available aggregation functions of type `GridAggregationFunctionDataSource` to the Data Grid using the `aggregationFunctions` prop. Its default value is empty when the Data Grid is used with server-side data.

   ```tsx
   const aggregationFunctions: Record<string, GridAggregationFunctionDataSource> = {
      size: { label: 'Size' },
      sum: { label: 'Sum', columnTypes: ['number'] },
   }

   <DataGridPremium aggregationFunctions={aggregationFunctions} />
   ```

   The `GridAggregationFunctionDataSource` interface is similar to `GridAggregationFunction`, but it doesn't have `apply` or `getCellValue` properties because the computation is done on the server.

   See the [GridAggregationFunctionDataSource API page](/x/api/data-grid/grid-aggregation-function-data-source/) for more details.

2. Use `aggregationModel` passed in the `getRows` method of `GridDataSource` to fetch the aggregated values.
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

The following example demonstrates basic server-side aggregation.

{{"demo": "ServerSideDataGridAggregation.js", "bg": "inline"}}

:::info
The data source mock server (`useMockServer()`) mocks the built-in aggregation functions listed in the [built-in functions section](/x/react-data-grid/aggregation/#built-in-functions) of the client-side aggregation documentation.
Provide the function names and minimal configuration to demonstrate the aggregation, as shown in the demo.
:::

## Usage with lazy loading

Server-side aggregation can be implemented along with [server-side lazy loading](/x/react-data-grid/server-side-data/lazy-loading/) as shown in the demo below.

{{"demo": "ServerSideDataGridAggregationLazyLoading.js", "bg": "inline"}}

## Usage with row grouping

Server-side aggregation works with row grouping in a similar way as described in [Aggregation—usage with row grouping](/x/react-data-grid/aggregation/#usage-with-row-grouping).
The aggregated values are acquired from the parent rows using the `getAggregatedValue` method.

{{"demo": "ServerSideDataGridAggregationRowGrouping.js", "bg": "inline"}}

## Usage with tree data

Server-side aggregation can be used with tree data in a similar way as described in [Aggregation—usage with tree data](/x/react-data-grid/aggregation/#usage-with-tree-data).
The aggregated values are acquired from the parent rows using the `getAggregatedValue` method.

{{"demo": "ServerSideDataGridAggregationTreeData.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridAggregationFunctionDataSource](/x/api/data-grid/grid-aggregation-function-data-source/)
