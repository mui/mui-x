# Data Grid - Styling recipes

<p class="description">Advanced grid styling recipes.</p>

## Remove cell focus outline

The data grid cells are actionable elements and visually indicate the `focus` state by default.
You can remove the focus outline by overriding the `:focus` and `:focus-within` styles for the cells and header cells.

:::warning
Removing the visible `focus` state hurts the accessibility of the grid.
:::

{{"demo": "CellFocusNoOutline.js", "bg": "inline", "defaultCodeOpen": false}}

## Styling Cells without impacting aggregation cells [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Aggregation cells do not receive a special class, so styling cells without impacting them needs a small workaround in the `getClassName` function.

{{"demo": "StylingAllCellsButAggregation.js", "bg": "inline", "defaultCodeOpen": false}}
