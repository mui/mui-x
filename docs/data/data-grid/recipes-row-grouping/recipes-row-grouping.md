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

See [Toolbar component—Row grouping bar](/x/react-data-grid/components/toolbar/#row-grouping-toolbar) for an example of how to add a custom toolbar that lets users create row groups by dragging and dropping.

## Sorting row groups by the number of child rows

By default, the row grouping column uses `sortComparator` of the grouping column for sorting.

To sort the row groups by the number of child rows, you can override it using `groupingColDef.sortComparator`:

{{"demo": "RowGroupingSortByChildRows.js", "bg": "inline", "defaultCodeOpen": false}}

## Displaying child row count in footer

By default, the row count in the footer is the number of top level rows that are visible after filtering.

In the demo below, a `CustomFooterRowCount` component is added to the `footerRowCount` slot. This component uses the `gridFilteredDescendantRowCountSelector` to get the number of child rows and display it alongside the number of groups.

{{"demo": "RowGroupingChildRowCount.js", "bg": "inline", "defaultCodeOpen": false}}

## Styling row groups based on child conditions

You can check the [styling row groups](/x/react-data-grid/style/#styling-row-groups) section for more information.

## Grouping multiple fields into a single column

Provide [`groupingValueGetter()`](/x/react-data-grid/row-grouping/#using-groupingvaluegetter-for-complex-grouping-value) with a separator constant to combine multiple columns into one and provide a custom [`renderCell()`](/x/react-data-grid/cells/#rendercell) to control the output interface.

The following demo shows how to create multiple grouping columns (`label` and `priority`) into a single grouping column.

Take a look at the second column definition in the `columns` array:

- The `field` is set to `label`, which is one of the grouping columns.
- The `groupingValueGetter` combines the `label` and `priority` fields into a single string separated by a constant effectively changing the grouping criteria for this column.
- The `renderCell` splits the string and displays the `priority` field as a colored `Chip` when the row type is a group.

{{"demo": "RowGroupingMultipleFields.js", "bg": "inline"}}
