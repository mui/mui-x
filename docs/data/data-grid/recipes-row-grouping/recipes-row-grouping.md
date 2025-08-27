---
title: Data Grid - Row grouping recipes
---

# Data Grid - Row grouping recipes [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Advanced grid customization recipes.</p>

## Toggling groups on row click

In the demo below, you can toggle the group by clicking anywhere on the grouping row:

{{"demo": "RowGroupingExpandOnRowClick.js", "bg": "inline", "defaultCodeOpen": false}}

## Pinning a grouped column

Use `GRID_ROW_GROUPING_SINGLE_GROUPING_FIELD` to pin a grouped column. In the demo below, the `Company` column is pinned:

{{"demo": "RowGroupingPinning.js", "bg": "inline", "defaultCodeOpen": false}}

## Creating and reordering groups with drag and drop

See [Toolbar component—Row grouping bar](/x/react-data-grid/components/toolbar/#row-grouping-toolbar) for an example of how to add a custom toolbar that allows users to create row groups with drag and drop.

## Sorting row groups by the number of child rows

By default, the row grouping column uses `sortComparator` of the grouping column for sorting.

To sort the row groups by the number of child rows, you can override it using `groupingColDef.sortComparator`:

{{"demo": "RowGroupingSortByChildRows.js", "bg": "inline", "defaultCodeOpen": false}}

## Displaying child row count in footer

By default, the row count in the footer is the number of top level rows that are visible after filtering.

In the demo below, a `CustomFooterRowCount` component is added to the `footerRowCount` slot. This component uses the `gridFilteredDescendantRowCountSelector` to get the number of child rows and display it alongside the number of groups.

{{"demo": "RowGroupingChildRowCount.js", "bg": "inline", "defaultCodeOpen": false}}

## Styling row group based on child condition

Use `getRowClassName` to add a custom class to the row group and then write CSS to style it.

To write a condition, use the [`apiRef.current.getRowNode`](/x/api/data-grid/grid-api/#grid-api-prop-getRowNode) to check for the targeted row type and use the [`apiRef.current.getRow`](/x/api/data-grid/grid-api/#grid-api-prop-getRow) to get the row data.

The example below demonstrates how to style a row group when any of the child rows has "Gross" value more a specific value:

{{"demo": "RowGroupingStyling.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
The styling method is not limited to the [`sx` prop](/x/react-data-grid/style/#using-the-sx-prop). You can use other styling solution like plain CSS file or CSS modules.
:::
