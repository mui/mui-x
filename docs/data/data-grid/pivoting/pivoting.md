---
title: Data Grid - Pivoting
---

# Data Grid - Pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Rearrange rows and columns to view data from multiple perspectives.</p>

Pivoting allows you to transform your data grid by reorganizing rows and columns, creating dynamic cross-tabulations of your data.
This feature enables users to analyze data from different angles and gain insights that would be difficult to see in a normal data grid view.

:::warning
The pivoting feature is currently in preview and the API is subject to change.
You can enable it using the `experimentalFeatures` prop:

```tsx
<DataGridPremium experimentalFeatures={{ pivoting: true }} />
```

:::

## Understanding the pivoting concepts

Pivoting transforms your data by reorganizing it along three key dimensions: **rows**, **columns**, and **values**.

### Non-pivoted data

The non-pivoted data is the data that you start with.
It is the data that you see in the Data Grid before you pivot it.

{{"demo": "GridNonPivoted.js", "bg": "inline", "defaultCodeOpen": false}}

### Rows

**Rows** define how your data will be grouped vertically.
Each unique value in the fields you select for rows will create a separate row in the pivot data grid.
For example, if you pivot by `product`, each unique product name will become a row in your pivot data grid.

{{"demo": "GridPivotingRows.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for rows, the rows will be grouped in the order of the selected fields.
For example, if you pivot by `region` and `product` rows, each unique combination of region and product will become a row in your pivot data grid.

### Columns

**Columns** define how your data will be grouped horizontally.
Each unique value in the fields you select for columns will create a new column in the pivot data grid.
For example, if you pivot by `region`, each unique region will become a column in your pivot data grid.

{{"demo": "GridPivotingColumns.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for columns, the columns will be grouped in the order of the selected fields.
For example, if you pivot by `region` and `quarter` columns, each unique combination of region and quarter will become a column in your pivot data grid.

### Values

**Values** define what data will be displayed in the cells of your pivot data grid.
These are typically numeric fields that can be aggregated (summed, averaged, counted, etc.).
For example, you might want to see the sum of `sales` for each combination of row and column.

{{"demo": "GridPivotingValues.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for values, the each field will add a new aggregated column to the pivot data grid.
For example, if you pivot by `sales` and `quarter` values, the pivot data grid will have two aggregated columns: `sales` and `quarter`.

### Pivoting in action

In the demo below, we pivot a dataset of sales to have `product` values as rows, `region` and `quarter` values as columns, and `sales` as aggregated values.

{{"demo": "GridPivotingBasic.js", "bg": "inline", "defaultCodeOpen": false}}

{{"demo": "GridPivotingMultipleValues.js", "bg": "inline", "defaultCodeOpen": false}}

## Commodities

{{"demo": "GridPivotingCommodities.js", "bg": "inline", "defaultCodeOpen": false}}

## Financials

{{"demo": "GridPivotingFinancial.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
