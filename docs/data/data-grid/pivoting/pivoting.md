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

## Quick start

The pivoting feature is enabled by default and can be accessed from the toolbar.

{{"demo": "GridPivotingMultipleValues.js", "bg": "inline", "defaultCodeOpen": false}}

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
For example, if you pivot by `product` and `size` rows, each unique combination of `product` and `size` will become a row in your pivot data grid.

### Values

**Values** define what data will be displayed in the cells of your pivot data grid.
These are typically numeric fields that can be aggregated (summed, averaged, counted, etc.).
For example, you might want to see the sum of `sales` for each combination of row and column.

{{"demo": "GridPivotingValues.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for values, the each field will add a new aggregated column to the pivot data grid.
For example, if you pivot by `sales` and `profit` values, the pivot data grid will have two aggregated columns: `sales` and `profit`.

### Columns

**Columns** define how your data will be grouped horizontally.
Each unique value in the fields you select for columns will create a new column group in the pivot data grid.
For example, if you pivot by `region`, each unique region will become a column group in your pivot data grid.

{{"demo": "GridPivotingColumns.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for columns, the columns will be grouped in the order of the selected fields.
For example, if you pivot by `region` and `quarter` columns, each unique combination of region and quarter will become a column in your pivot data grid.

### Pivoting in action

In the demo below, we want to check our sales by region and quarter for each product and size available.
To get that, we pivot a dataset of sales to have `product` and `size` fields as **rows**, `region` and `quarter` fields
as **columns**, and `sales` and `profit` fields as aggregated **values**.

{{"demo": "GridPivotingMultipleValues.js", "bg": "inline", "defaultCodeOpen": false}}

## Getting started with pivoting

### Pivot model

The pivot model is a configuration object that defines rows, columns, and values of the pivot data grid:

```tsx
interface GridPivotModel {
  rows: Array<{
    field: string;
    hidden?: boolean;
  }>;
  columns: Array<{
    field: string;
    sort?: 'asc' | 'desc';
    hidden?: boolean;
  }>;
  values: Array<{
    field: string;
    aggFunc: string;
    hidden?: boolean;
  }>;
}
```

### Initialize pivoting

The easiest way to initialize pivoting is with an uncontrolled mode using the `initialState` prop.
You can initialize the pivot model, pivot panel visibility, and enable the pivot mode:

```tsx
<DataGridPremium
  initialState={{ pivoting: { model: pivotModel, enabled: true, panelOpen: true } }}
/>
```

{{"demo": "GridPivotingInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled pivoting

For fully controlled pivoting state, there are the following controlled props:

- Pivot model:
  - `pivotModel`: Controls the current pivot configuration.
  - `onPivotModelChange`: Callback fired when the pivot model changes.
- Pivot mode toggle:
  - `pivotActive`: Controls whether pivot mode is active.
  - `onPivotActiveChange`: Callback fired when pivot mode is active/inactive.
- Pivot panel:
  - `pivotPanelOpen`: Controls whether the pivot panel is open.
  - `onPivotPanelOpenChange`: Callback fired when the pivot panel is opened/closed.

{{"demo": "GridPivotingControlled.js", "bg": "inline", "defaultCodeOpen": false}}

## Using fields in the pivot model multiple times

While this is not supported yet, we are working to bring this feature to the Data Grid.

## Disable pivoting

To disable the pivoting feature, set the `disablePivoting` prop to `true`:

```tsx
<DataGridPremium disablePivoting />
```

## Derived columns in pivot mode

In pivot mode, it's often useful to group data by a year or quarter.
Data Grid automatically generates year and quarter columns for each `date` column.

In the demo below, the `transactionDate` column is represented by additional columns in the pivot mode: `transactionDate-year` and `transactionDate-quarter`:

{{"demo": "GridPivotingFinancial.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom derived columns

To customize the derived columns, use the `getPivotDerivedColumns` prop.
It is called for each original column and should return an array of derived columns, or `undefined` if no derived columns are needed.

{{"demo": "GridGetPivotDerivedColumns.js", "bg": "inline", "defaultCodeOpen": true}}

## Sticky column groups

Depending on the pivot mode, some column groups might exceed the width of the Data Grid viewport.
To improve the user experience, you can make these column groups "sticky" so that the column group labels are visible while scrolling horizontally.

In the demo below, the `sx` prop is used to make the column groups sticky:

{{"demo": "GridPivotingMovies.js", "bg": "inline", "defaultCodeOpen": false}}

## Advanced demo

{{"demo": "GridPivotingCommodities.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
