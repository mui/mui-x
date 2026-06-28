---
productId: x-data-studio
title: Data Studio React component
packageName: '@mui/x-data-studio'
githubLabel: 'scope: data studio'
components: DataStudio
---

# Data Studio - Overview

<p class="description">Explore multiple tabular datasets in one Data Grid powered workspace, each with its own set of views.</p>

Data Studio is an MVP package for exploring related datasets without leaving the grid surface.
Each dataset can provide local rows or a Data Grid [Data Source](/x/react-data-grid/server-side-data/) for server-side data.

A dataset is the primary object: pick one from the left rail, and its **views** appear as tabs across the top — much like a Notion database.
Every dataset starts with an implicit **Table** view (its raw grid); the `+` button adds more views (Chart, Pivot table, Dashboard) scoped to that dataset.
End users can rename, duplicate, delete, and reorder the views they create.

## Built-in templates

Data Studio ships with the templates and view types built in, so the demos below pass data only — no template wiring required.

End users add a view from the `+` button in the view tab strip:

- **Spreadsheet** — a blank, free-form editable grid. Available on every plan.
- **Pivot table** — a [pivot grid](/x/react-data-grid/pivoting/) over a dataset. Premium only.
- **Chart** — a [chart](/x/react-charts/) over a dataset. Premium only.
- **Dashboard** — auto-generated KPIs and breakdowns from a dataset. Premium only.

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
