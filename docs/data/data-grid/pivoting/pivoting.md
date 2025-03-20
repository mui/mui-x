---
title: Data Grid - Pivoting
---

# Data Grid - Pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Rearrange rows and columns to view data from multiple perspectives.</p>

The Data Grid Premium's pivoting feature lets users transform the data in their grid by reorganizing rows and columns, creating dynamic cross-tabulations of data.
This makes it possible to analyze data from different angles and gain insights that would be difficult to see in the default grid view.

:::warning
The pivoting feature is currently in preview and the API is subject to change.
You can enable it using the `experimentalFeatures` prop:

```tsx
<DataGridPremium experimentalFeatures={{ pivoting: true }} />
```

:::

## Quick start

Pivoting is enabled by default and can be accessed through the icon in the toolbar.
In the demo below, the pivot panel is already open and some pivoting parameters have been set.
Use the **Pivot** switch at the top of the panel to toggle pivoting off and on.
You can drag and drop existing columns in the **Rows**, **Columns**, and **Values** dropdown menus to change how the data is pivoted.

{{"demo": "GridPivotingMultipleValues.js", "bg": "inline", "defaultCodeOpen": false}}

## Understanding pivoting

Pivoting transforms your data by reorganizing it along three key dimensions: rows, columns, and values.

### Non-pivoted data

The non-pivoted data is the data that you start with.
It is the data that you see in the Data Grid before you pivot it.

{{"demo": "GridNonPivoted.js", "bg": "inline", "defaultCodeOpen": false}}

### Rows

The **Rows** menu defines how the data will be grouped vertically after pivoting.
Each unique value in the fields selected for rows will become a new row in the pivot Data Grid.
For example, if you pivot by `product`, each unique product name will become a row in your pivot data grid.

{{"demo": "GridPivotingRows.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for rows, the rows will be grouped in the order of the selected fields.
For example, if you pivot by `product` and `size` rows, each unique combination of `product` and `size` will become a row in your pivot data grid.

### Values

The **Values** menu defines what data will be displayed in the cells of the pivot Data Grid.
These are typically numeric fields that can be aggregated (often into a sum, an average, or a total count).
For example, the demo below contains multiple rows for just two kinds of products: apples and oranges.
By selecting **Product** for the pivot rows and **Sales** for the pivot values, you can see the sum total of sales for each of the two products.

{{"demo": "GridPivotingValues.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for values, each field will add a new aggregated column to the pivot Data Grid.
For example, if you pivot by `sales` and `profit` values, the pivot data grid will have two aggregated columns: `sales` and `profit`.

### Columns

The **Columns** menu defines how the data will be grouped horizontally after pivoting.
Each unique value in the fields you select for columns will create a new column group in the pivot Data Grid.
For example, if you pivot by `region`, each unique region will become a column group in your pivot data grid.

{{"demo": "GridPivotingColumns.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for columns, the columns will be grouped in the order of the selected fields.
For example, if you pivot by `region` and `quarter` columns, each unique combination of region and quarter will become a column in your pivot data grid.

### Pivoting in action

In the demo below, the goal is to evaluate sales by region and quarter for each product and size available.
To get that, we pivot a dataset of sales to have `product` and `size` fields as **rows**, `region` and `quarter` fields
as **columns**, and `sales` and `profit` fields as aggregated **values**.

{{"demo": "GridPivotingMultipleValues.js", "bg": "inline", "defaultCodeOpen": false}}

## Implementing pivoting

### Pivot model

The pivot model is a configuration object that defines rows, columns, and values of the pivot Grid:

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

Use the `initialState` prop to initialize uncontrolled pivoting.
This is the recommended method unless you specifically need to control the state.
You can initialize the pivot model, toggle pivot panel visibility, and toggle the pivot mode as shown below:

```tsx
<DataGridPremium
  initialState={{ pivoting: { model: pivotModel, active: true, panelOpen: true } }}
/>
```

{{"demo": "GridPivotingInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled pivoting

For fully controlled pivoting state, you can use the following props:

- Pivot model:
  - `pivotModel`: Controls the current pivot configuration.
  - `onPivotModelChange`: Callback fired when the pivot model changes.
- Pivot mode toggle:
  - `pivotActive`: Controls whether pivot mode is active.
  - `onPivotActiveChange`: Callback fired when the pivot mode changes between active and inactive.
- Pivot panel:
  - `pivotPanelOpen`: Controls whether the pivot panel is open.
  - `onPivotPanelOpenChange`: Callback fired when the pivot panel is opened or closed.

{{"demo": "GridPivotingControlled.js", "bg": "inline", "defaultCodeOpen": false}}

## Using fields in the pivot model multiple times

While this is not supported yet, we are working to bring this feature to the Data Grid.

## Disable pivoting

To disable pivoting, set the `disablePivoting` prop to `true`:

```tsx
<DataGridPremium disablePivoting />
```

## Derived columns in pivot mode

In pivot mode, it's often useful to group data by a year or quarter.
The Data Grid automatically generates year and quarter columns for each **Date** column for this purpose.

In the demo below, the `transactionDate` column is represented by additional columns in the pivot mode: `transactionDate-year` and `transactionDate-quarter`:

{{"demo": "GridPivotingFinancial.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom derived columns

Use the `getPivotDerivedColumns` prop to customize derived columns.
This prop is called for each original column and returns an array of derived columns, or `undefined` if no derived columns are needed.

{{"demo": "GridGetPivotDerivedColumns.js", "bg": "inline", "defaultCodeOpen": true}}

## Sticky column groups

Depending on the pivot mode, some column groups might exceed the width of the Data Grid viewport.
To improve the user experience, you can make these column groups "sticky" so that the column group labels remain visible while scrolling horizontally.

The demo below illustrates how to do this using the `sx` prop to apply the necessary styles:

{{"demo": "GridPivotingMovies.js", "bg": "inline", "defaultCodeOpen": false}}

## Advanced demo

{{"demo": "GridPivotingCommodities.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
