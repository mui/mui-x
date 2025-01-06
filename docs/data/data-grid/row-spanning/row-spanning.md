# Data Grid - Row spanning 🧪

<p class="description">Span cells across several rows.</p>

By default, each cell in a Data Grid takes up the height of one row.
The row spanning feature makes it possible for a cell to fill multiple rows in a single column.

To enable, pass the `rowSpanning` prop to the Data Grid.
The Data Grid will automatically merge consecutive cells with repeating values in the same column, as shown in the demo below—switch off the toggle button to see the actual rows:

{{"demo": "RowSpanning.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
In this demo, the `quantity` column has been deliberately excluded from the row spanning computation using the `colDef.rowSpanValueGetter` prop.

See the [Customizing row-spanning cells](#customizing-row-spanning-cells) section for more details.
:::

:::warning
Row spanning works by increasing the height of the spanned cell by a factor of `rowHeight`—it won't work properly with a variable or dynamic height.
:::

## Customizing row-spanning cells

You can customize how row spanning works using two props:

- `colDef.rowSpanValueGetter`: Controls which values are used for row spanning
- `colDef.valueGetter`: Controls both the row spanning logic and the cell value

This lets you prevent unwanted row spanning when there are repeating values that shouldn't be merged.

In the following example, `rowSpanValueGetter` is used to avoid merging `age` cells that don't belong to the same person.

{{"demo": "RowSpanningCustom.js", "bg": "inline", "defaultCodeOpen": false}}

## Usage with column spanning

Row spanning can be used in conjunction with column spanning to create cells that span multiple rows and columns simultaneously, as shown in the demo below:

{{"demo": "RowSpanningClassSchedule.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
Row spanning works well with features like [sorting](/x/react-data-grid/sorting/) and [filtering](/x/react-data-grid/filtering/), but be sure to check that everything works as expected when using it with [column spanning](/x/react-data-grid/column-spanning/).
:::

## Demo

The demo below recreates the calendar from the [column spanning documentation](/x/react-data-grid/column-spanning/#function-signature) using the row spanning feature:

{{"demo": "RowSpanningCalendar.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
