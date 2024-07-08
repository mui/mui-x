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

## Sorting row groups by the number of child rows

By default, the row grouping column uses `sortComparator` of the grouping column for sorting.

To sort the row groups by the number of child rows, you can override it using `groupingColDef.sortComparator`:

{{"demo": "RowGroupingSortByChildRows.js", "bg": "inline", "defaultCodeOpen": false}}

## Dispaying child row count in footer

By default, the row count in the footer is the number of top level rows that are visible after filtering.

In the demo below, a `CustomFooterRowCount` component is added to the `footerRowCount` slot. This component uses the `gridFilteredDescendantRowCountSelector` to get the number of child rows and display it alongside the number of groups.

{{"demo": "RowGroupingChildRowCount.js", "bg": "inline", "defaultCodeOpen": false}}
