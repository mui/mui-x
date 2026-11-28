---
title: Data Grid - Filtering customization recipes
---

# Data Grid - Filtering customization recipes

<p class="description">Advanced filtering customization recipes.</p>

## Persisting filters in local storage

You can persist the filters in the local storage to keep the filters applied after the page is reloaded.

In the demo below, the [`React.useSyncExternalStore` hook](https://react.dev/reference/react/useSyncExternalStore) is used to synchronize the filters with the local storage.

{{"component": "file://./demos/filtering-local-storage/index.ts", "bg": "inline", "collapseToEmpty": true}}

## Save and manage filters from the panel

Create a custom filter panel by wrapping the `GridFilterPanel` component and pass it to the `slots.filterPanel` prop.

In the demo below, the custom component lets users to save and manage filters, which are stored in local storage.
For a more scalable approach, you can replace local storage with a server-side database.

{{"component": "file://./demos/filter-presets-panel/index.ts", "bg": "inline", "collapseToEmpty": true}}

## Quick filter outside of the grid

The [Quick Filter](/x/react-data-grid/filtering/quick-filter/) component is typically used in the Data Grid's Toolbar component slot.

Some use cases may call for placing components like the Quick Filter outside of the Grid.
This requires certain considerations due to the Grid's context structure.
The following example shows how to accomplish this:

{{"component": "file://./demos/quick-filter-outside-of-grid/index.ts", "bg": "inline", "collapseToEmpty": true}}

## Calculating filtered rows in advance

The [Grid API](/x/react-data-grid/api-object/#how-to-use-the-api-object) provides the [`getFilterState`](/x/api/data-grid/grid-api/#grid-api-prop-getFilterState) method, which lets you display the row count for predefined filters upfront without applying filters to the Data Grid:

{{"component": "file://./demos/filtered-row-count/index.ts", "bg": "inline", "collapseToEmpty": true}}

## Pasting values into `is any of`

If you need to paste a bulk list of values into the filter panel, you can wrap the built-in `isAnyOf` operator and keep the default input component.

The demo below accepts pasted array literals such as `["Sugar", "Soybeans", "Wheat"]` and `['Cocoa', 'Rough']`.

{{"component": "file://./demos/paste-list-into-is-any-of/index.ts", "bg": "inline", "collapseToEmpty": true}}
