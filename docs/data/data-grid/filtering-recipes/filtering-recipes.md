---
title: Data Grid - Filtering customization recipes
---

# Data Grid - Filtering customization recipes

<p class="description">Advanced filtering customization recipes.</p>

## Quick filter outside of the grid

Currently if you want to use the [Quick filter](/x/react-data-grid/filtering/quick-filter/) feature you need to use from the toolbar component slot.

A common use case is to have certain components positioned outside of the grid. Because of the way the grid context works this might not be a straightforward thing to do. The example below illustrates how this use case can be achieved.

{{"demo": "QuickFilterOutsideOfGrid.js", "bg": "inline", "defaultCodeOpen": false}}

## Use non-native select in filter panel

If you do not want to use the native select in the filtering panel you can switch it to the `@mui/material/Select` component by using the `slotProps` property.

{{"demo": "UseNonNativeSelect.js", "bg": "inline", "defaultCodeOpen": false}}
