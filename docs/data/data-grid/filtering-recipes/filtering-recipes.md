---
title: Data Grid - Filtering customization recipes
---

# Data Grid - Filtering customization recipes

<p class="description">Advanced filtering customization recipes.</p>

## Persisting filters in local storage

You can persist the filters in the local storage to keep the filters applied after the page is reloaded.

In the demo below, the [`React.useSyncExternalStore` hook](https://react.dev/reference/react/useSyncExternalStore) is used to synchronize the filters with the local storage.

{{"demo": "FilteringLocalStorage.js", "bg": "inline", "defaultCodeOpen": false}}

## Quick filter outside of the grid

The [Quick Filter](/x/react-data-grid/filtering/quick-filter/) component is typically used in the Data Grid's Toolbar component slot.

Some use cases may call for placing components like the Quick Filter outside of the Grid.
This requires certain considerations due to the Grid's context structure.
The following example shows how to accomplish this:

{{"demo": "QuickFilterOutsideOfGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Calculating filtered rows in advance

The [Grid API](/x/react-data-grid/api-object/#how-to-use-the-api-object) provides the [`getFilterState`](/x/api/data-grid/grid-api/#grid-api-prop-getFilterState) method, which allows you to display the row count for predefined filters upfront without applying filters to the Data Grid:

{{"demo": "FilteredRowCount.js", "bg": "inline", "defaultCodeOpen": false}}
