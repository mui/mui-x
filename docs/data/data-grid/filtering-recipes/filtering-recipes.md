---
title: Data Grid - Filtering customization recipes
---

# Data Grid - Filtering customization recipes

<p class="description">Advanced filtering customization recipes.</p>

## Quick filter outside of the grid

The [Quick Filter](/x/react-data-grid/filtering/quick-filter/) component is typically used in the Data Grid's Toolbar component slot.

Some use cases may call for placing components like the Quick Filter outside of the Grid.
This requires certain considerations due to the Grid's context structure.
The following example shows how to accomplish this:

{{"demo": "QuickFilterOutsideOfGrid.js", "bg": "inline", "defaultCodeOpen": false}}
