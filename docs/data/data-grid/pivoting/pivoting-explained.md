---
title: Data Grid - Understanding pivoting
---

# Data Grid - Pivoting [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Rearrange rows and columns to view data from multiple perspectives.</p>

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

## Next steps

Learn more about the pivoting feature in the [Pivoting](/x/react-data-grid/pivoting/) page.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
