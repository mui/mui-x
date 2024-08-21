# Data Grid - Row spanning

<p class="description">Span cells across several rows.</p>

Each cell takes up the height of one row.
Row spanning lets you change this default behavior, so cells can span multiple rows.
This is very close to the "row spanning" in an HTML `<table>`.

To enable, pass the `unstable_rowSpanning` prop to the Data Grid.
The Data Grid will automatically merge consecutive cells with the repeating values in the same column.

In the following example, the row spanning causes the cells with the same values in a column to be merged.
Switch off the toggle button to see actual rows.

{{"demo": "RowSpanning.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
In the above demo, the `quantity` column has been delibrately excluded from row spanning computation by using `colDef.rowSpanValueGetter` prop.

See the [Customizing row spanned cells](#customizing-row-spanned-cells) section for more details.
:::

:::warning
The row spanning generally works with features like [sorting](/x/react-data-grid/sorting/) and [filtering](/x/react-data-grid/filtering/), be sure to check if everything works as expected when using it in combination with features like [column spanning](/x/react-data-grid/column-spanning/).
:::

## Customizing row spanned cells

You could customize the value used in row spanning computation using `colDef.rowSpanValueGetter` prop and both the value used in row spanning computation and the value used in cell using `colDef.valueGetter` prop.

This could be useful when there _are_ some repeating values but should not be row spanned due to belonging to different entities.

In the following example, `rowSpanValueGetter` is used to avoid merging `age` cells that do not belong to the same person.

{{"demo": "RowSpanningCustom.js", "bg": "inline", "defaultCodeOpen": false}}

## Usage with column spanning

Row spanning could be used in conjunction with column spanning to achieve cells that span both rows and columns.

The following weekly university class schedule uses cells that span both rows and columns.

{{"demo": "RowSpanningClassSchedule.js", "bg": "inline", "defaultCodeOpen": false}}

## Demo

Here's the familiar calender demo that you might have seen in the column spanning [documentation](/x/react-data-grid/column-spanning/#function-signature), implemented with the row spanning.

{{"demo": "RowSpanningCalender.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
