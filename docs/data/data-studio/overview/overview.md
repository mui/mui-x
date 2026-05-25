---
productId: x-data-studio
title: Data Studio React component
packageName: '@mui/x-data-studio'
githubLabel: 'scope: data studio'
components: DataStudio
---

# Data Studio - Overview

<p class="description">Explore multiple tabular datasets in one Data Grid powered workspace.</p>

Data Studio is an MVP package for switching between related datasets without leaving the grid surface.
Each dataset can provide local rows or a Data Grid [Data Source](/x/react-data-grid/server-side-data/) for server-side data.

By default Data Studio renders a left sidebar navigator.
Pass `layout="tabs"` to switch to the spreadsheet-style bottom tab bar shown in the demos below — datasets appear first as pinned tabs, and end users can add their own views, rename, duplicate, delete and reorder them.

For remote datasets, Data Studio uses a small client/server protocol:

- a schema endpoint returns the available data sources and Grid-ready column definitions,
- a rows endpoint accepts Data Grid `GridGetRowsParams` and returns `GridGetRowsResponse`,
- server helpers translate the same protocol to CSV rows, Knex SQL sources, MongoDB collections, or custom data sources.

## Coffee beans sales

This demo loads three Coffee Beans datasets: customers, products, and orders.
The data is embedded in a SQLite database generated from the source CSV files, and the page loads every table through the Data Studio API protocol.

{{"demo": "CoffeeBeansSales.js", "bg": "inline"}}

## Remote dataset protocol

Clients can discover all remote datasets from a schema endpoint:

```tsx
const datasets = await createDataStudioDatasetsFromAPI({
  schemaUrl: '/data-studio/coffee-beans/schema',
});
```

Servers expose the matching schema and rows endpoints:

```tsx
const server = createDataStudioServer({
  dataSources: [
    createDataStudioDataSourceFromSQLite({
      id: 'orders',
      table: 'orders',
      filename: './coffee-beans.sqlite',
      rowIdField: '__rowId',
    }),
  ],
});

export default createNextDataStudioHandler(server);
```
