---
title: Data Grid - Filtering customization recipes
---

# Data Grid - Filtering customization recipes

<p class="description">Advanced filtering customization recipes.</p>

## Quick filter outside of the grid

The [Quick Filter](/x/react-data-grid/filtering/quick-filter/) component is typically used in the Data Grid's Toolbar component slot.

However, there may be instances where it's desirable to position certain components, such as the Quick filter, outside of the grid. Due to the grid context's structure, this task may not be straightforward. The following example demonstrates a solution to this particular use case.

{{"demo": "QuickFilterOutsideOfGrid.js", "bg": "inline", "defaultCodeOpen": false}}
