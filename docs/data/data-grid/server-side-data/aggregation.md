---
title: Data Grid - Server-side aggregation
---

# Data Grid - Server-side aggregation [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Implement aggregation with server-side data in the Data Grid using the Data Source layer.</p>

The Data Grid Premium provides tools to give end users the ability to aggregate and compare row values.
The Grid can aggregate server-side data using the [Data Source layer](/x/react-data-grid/server-side-data/#the-solution-the-data-source-layer).

:::info
For aggregation on the client side, see [Aggregation (client side)](/x/react-data-grid/aggregation/).
:::

The demo below shows how to use the methods and patterns described in this document to implement server-side aggregation.

{{"demo": "ServerSideDataGridAggregation.js", "bg": "inline"}}

:::info
The Data Source mock server (`useMockServer()`) mocks the built-in aggregation functions listed in [Aggregation (client-side)—Built-in functions](/x/react-data-grid/aggregation/#built-in-functions).
Provide the function names and minimal configuration to demonstrate the aggregation, as shown in the demo.
:::

## Prerequisites

Server-side aggregation is an extension of its client-side counterpart, so we recommend reviewing [Aggregation (client side)](/x/react-data-grid/aggregation/) to understand the underlying data structures and core implementation before proceeding.

To be able to use aggregation functions with server-side data, you must create a Data Source and pass the `dataSource` prop to the Data Grid as detailed in the [Server-side data overview](/x/react-data-grid/server-side-data/).

## Implementing server-side aggregation

Compared to client-side aggregation, server-side aggregation requires some additional steps to implement:

### 1. Pass aggregation functions

Pass the available aggregation functions of type `GridAggregationFunctionDataSource` to the Data Grid using the `aggregationFunctions` prop.
Its default value is empty when the Data Grid is used with server-side data.

```tsx
const aggregationFunctions: Record<string, GridAggregationFunctionDataSource> = {
   size: { label: 'Size' },
   sum: { label: 'Sum', columnTypes: ['number'] },
}

<DataGridPremium aggregationFunctions={aggregationFunctions} />
```

The `GridAggregationFunctionDataSource` interface is similar to `GridAggregationFunction`, but it doesn't have `apply()` or `getCellValue()` properties because the computation is done on the server.

Visit the [GridAggregationFunctionDataSource API page](/x/api/data-grid/grid-aggregation-function-data-source/) to see its signature.

### 2. Fetch aggregated values

Use `aggregationModel` passed in the `getRows()` method of the `GridDataSource` to fetch the aggregated values.
For the root level footer aggregation row, pass `aggregateRow` containing the aggregated values in the `GetRowsResponse`.

```diff
   const dataSource = {
   getRows: async ({
      sortModel,
      filterModel,
      paginationModel,
+    aggregationModel,
   }) => {
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

### 3. Pass the getter method

Pass the getter method `getAggregatedValue()` in `GridDataSource` that defines how to get the aggregated value for a parent row (including the `aggregateRow`).

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

## Usage with lazy loading

The demo below shows to how implement server-side aggregation with [server-side lazy loading](/x/react-data-grid/server-side-data/lazy-loading/).

{{"demo": "ServerSideDataGridAggregationLazyLoading.js", "bg": "inline"}}

## Usage with row grouping

Server-side aggregation works with row grouping similarly to how it's described in [Aggregation (client-side)—usage with row grouping](/x/react-data-grid/aggregation/#usage-with-row-grouping).
The aggregated values are acquired from the parent rows using the `getAggregatedValue()` method.

{{"demo": "ServerSideDataGridAggregationRowGrouping.js", "bg": "inline"}}

## Usage with tree data

Server-side aggregation can be used with tree data similarly to how it's described in [Aggregation (client-side)—usage with tree data](/x/react-data-grid/aggregation/#usage-with-tree-data).
The aggregated values are acquired from the parent rows using the `getAggregatedValue()` method.

{{"demo": "ServerSideDataGridAggregationTreeData.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
- [GridAggregationFunctionDataSource](/x/api/data-grid/grid-aggregation-function-data-source/)
