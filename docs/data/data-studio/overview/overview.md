---
productId: x-data-studio
title: Data Studio React component
packageName: '@mui/x-data-studio'
githubLabel: 'scope: data studio'
components: DataStudio
---

# Data Studio - Overview

<p class="description">Explore multiple tabular dataSources in one Data Grid powered workspace.</p>

Data Studio is an MVP package for switching between related dataSources without leaving the grid surface.
Each dataSource can provide local rows or a Data Grid [Data Source](/x/react-data-grid/server-side-data/) for server-side data.

By default Data Studio renders a left sidebar navigator.
Pass `layout="tabs"` to switch to the spreadsheet-style bottom tab bar shown in the demos below — dataSources appear first as pinned tabs, and end users can add their own views, rename, duplicate, delete and reorder them.

## Built-in templates

Data Studio ships with the templates and view types built in, so the demos below pass data only — no template wiring required.

End users start a new Sheet from the composer or from a Data Source's preview actions:

- **Spreadsheet** — a blank, free-form editable grid. Available on every plan.
- **Pivot table** — a [pivot grid](/x/react-data-grid/pivoting/) over a Data Source. Premium only.
- **Chart** — a [chart](/x/react-charts/) over a Data Source. Premium only.

To extend the defaults, pass `sheetTemplates` (or `viewTypes`) an array to add a custom entry, or a `(defaults) => defaults` function to remove or reorder the built-in ones.

For remote dataSources, Data Studio uses a small client/server protocol:

- a schema endpoint returns the available data sources and Grid-ready column definitions,
- a rows endpoint accepts Data Grid `GridGetRowsParams` and returns `GridGetRowsResponse`,
- server helpers translate the same protocol to CSV rows, Knex SQL sources, MongoDB collections, or custom data sources.

## Coffee beans sales

This demo loads three Coffee Beans dataSources: customers, products, and orders.
The data is embedded in a SQLite database generated from the source CSV files, and the page loads every table through the Data Studio API protocol.

{{"demo": "CoffeeBeansSales.js", "bg": "inline"}}

## Remote dataSource protocol

Clients can discover all remote dataSources from a schema endpoint:

```tsx
const dataSources = await createDataStudioDataSourcesFromAPI({
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
