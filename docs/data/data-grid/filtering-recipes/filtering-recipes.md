---
title: Data Grid - Filtering customization recipes
---

# Data Grid - Filtering customization recipes

<p class="description">Advanced filtering customization recipes.</p>

## Quick filter outside of the grid

Currently if you want to use the [Quick filter](/x/react-data-grid/filtering/quick-filter/) feature you need to use from the toolbar component slot.

A common use case is to have certain components positioned outside of the grid. Because of the way the grid context works this might not be a straightforward thing to do. The example below illustrates how this use case can be achieved.

{{"demo": "QuickFilterOutsideOfGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Calculating row count in advance  

The [Grid API](/x/react-data-grid/api-object/#how-to-use-the-api-object) provides the [`getFilterState`](/x/api/data-grid/grid-api/#grid-api-prop-getFilterState) method, which allows you to display the row count for predefined filters upfront without applying filters to the Data Grid:

{{"demo": "FilteredRowCount.js", "bg": "inline", "defaultCodeOpen": false}}
