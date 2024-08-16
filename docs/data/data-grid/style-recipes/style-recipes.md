# Data Grid - Styling recipes

<p class="description">Advanced grid styling recipes.</p>

## Remove cell focus outline

The data grid cells are actionable elements and visually indicate the `focus` state by default.
You can remove the focus outline by overriding the `:focus` and `:focus-within` styles for the cells and header cells.

:::warning
Removing the visible `focus` state hurts the accessibility of the grid.
:::

{{"demo": "CellFocusNoOutline.js", "bg": "inline", "defaultCodeOpen": false}}

## Remove drag handle for columns that are not resizeable

In the MUI Data Grid, each column has a resize handle that allows users to adjust the width of the column.
However, there might be cases where you want to disable this feature for certain columns.

To hide the drag handles on columns that are not resizable, you can use the resizable property in the GridColDef object.
When the column is not resizable, the drag handle will not have the `columnSeparator--resizable` class.
We can use that to hide the separator.

{{"demo": "ColumnHeaderHideSeparator.js", "bg": "inline", "defaultCodeOpen": false}}

## Styling Cells without impacting aggregation cells [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Aggregation cells do not receive a special class, so styling cells without impacting them needs a small workaround in the `getClassName` function.

{{"demo": "StylingAllCellsButAggregation.js", "bg": "inline", "defaultCodeOpen": false}}
