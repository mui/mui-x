# Data Grid - Row spanning

<p class="description">Span cells across several rows.</p>

Each cell takes up the height of one row.
Row spanning lets you change this default behavior, so cells can span multiple rows.
This is very close to the "row spanning" in an HTML `<table>`.

To enable, pass the `unstable_rowSpanning` prop to the Data Grid.

The Data Grid will automatically merge cells with the same value in a specified column.

In the following example, the row spanning causes the cells with the same values in a column to be merged.

{{"demo": "RowSpanning.js", "bg": "inline", "defaultCodeOpen": false}}

## Customizing row spanned cells

You could customize the value used in row spanning computation using `colDef.rowSpanValueGetter` prop and both the value used in row spanning computation and the value used in cell using `colDef.valueGetter` prop.

This could be useful when there _are_ some repeating values but they belong to different groups.

In the following example, `rowSpanValueGetter` is used to avoid merging `age` cells that do not belong to the same person.

{{"demo": "RowSpanningCustom.js", "bg": "inline", "defaultCodeOpen": false}}

## Demo

Here's the calender demo that you can see in the column spanning [documentation](/x/react-data-grid/column-spanning/#function-signature), but implemented with row spanning.

{{"demo": "RowSpanningCalender.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
