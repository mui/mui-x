---
title: Data Grid - Pivoting
---

# Data Grid - Pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') 🧪

<p class="description">Rearrange rows and columns to view data from multiple perspectives.</p>

The Data Grid Premium's pivoting feature lets users transform the data in their grid by reorganizing rows and columns, creating dynamic cross-tabulations of data.
This makes it possible to analyze data from different angles and gain insights that would be difficult to see in the default grid view.

## Quick start

Pivoting is enabled by default and can be accessed through the icon in the toolbar.
In the demo below, the pivot panel is already open and some pivoting parameters have been set.
Use the **Pivot** switch at the top of the panel to toggle pivoting off and on.
You can drag and drop existing columns in the **Rows**, **Columns**, and **Values** dropdown menus to change how the data is pivoted.

{{"demo": "GridPivotingMultipleValues.js", "bg": "inline", "defaultCodeOpen": false}}

## Understanding pivoting

Pivoting gets its name from the idea of rotating the data: you take a flat list of sales with columns for product, region, and sales—and reorganize it to compare the values more easily.
By pivoting, you can turn unique product names into rows, regions into columns, and aggregate the sales values to see the total sales per product per region

You can try the given example in the following demo.
The demo's flat dataset is used throughout this page to showcase key pivoting features.

{{"demo": "GridNonPivoted.js", "bg": "inline", "defaultCodeOpen": false}}

### Rows

The **Rows** menu defines how the data will be grouped vertically after pivoting.
Each unique value in the fields selected for rows will become a new row in the pivot Data Grid.
For example, if you pivot by **Product**, each unique product name will become a row in the pivot Data Grid.

{{"demo": "GridPivotingRows.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for rows, the rows will be grouped in the order of the selected fields.
For example, if you pivot with both **Product** and **Size** selected for rows, then each unique combination of the two will become a row in the pivot Data Grid.

### Values

The **Values** menu defines what data will be displayed in the cells of the pivot Data Grid.
These are typically numeric fields that can be aggregated (often into a sum, an average, or a total count).
For example, the demo below contains multiple rows for just two kinds of products: apples and oranges.
By selecting **Product** for the pivot rows and **Sales** for the pivot values, you can see the sum total of sales for each of the two products.

{{"demo": "GridPivotingValues.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for values, each field will add a new aggregated column to the pivot Data Grid.
For example, if you pivot with **Sales** and **Profit** for values, the pivot Data Grid will contain two corresponding aggregated columns.

### Columns

The **Columns** menu defines how the data will be grouped horizontally after pivoting.
Each unique value in the fields you select for columns will create a new column group in the pivot Data Grid.
For example, if you pivot by **Region** in the demo below, each unique region becomes a column group in the pivot Data Grid.

{{"demo": "GridPivotingColumns.js", "bg": "inline", "defaultCodeOpen": false}}

If multiple fields are selected for columns, the columns will be grouped in the order of the selected fields.
For example, if you pivot with **Region** and **Quarter** for columns, each unique combination of the two will become a column in the pivot Grid.
Try selecting the **Quarter** checkbox in the **Columns** section in the demo above to see this.

### Pivoting in action

In the demo below, the goal is to evaluate sales by region and quarter for each product and size available.
To accomplish this, the dataset can be pivoted with **Product** and **Size** for rows; **Region** and **Quarter** for columns; and **Sales** and **Profit** for aggregated values.

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

In the demo below, the **Transaction Date** column is represented by additional columns in pivot mode: **Transaction Date (Year)** and **Transaction Date (Quarter)**:

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
