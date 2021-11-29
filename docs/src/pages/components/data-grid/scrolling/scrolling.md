---
title: Data Grid - Scrolling
---

# Data Grid - Scrolling

<p class="description">This section presents how to programmatically control the scroll.</p>

## Scrolling to specific cells [<span class="plan-pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

You can scroll to a specific cell by calling `apiRef.current.scrollToIndexes()`.
The only argument that must be passed is an object containing the row index and the column index of the cell to scroll.
If the row or column index is not present, the grid will not do any movement in the missing axis.

The following demo explores the usage of this API:

{{"demo": "pages/components/data-grid/scrolling/ScrollPlayground.js", "bg": true}}

## apiRef [<span class="plan-pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

{{"demo": "pages/components/data-grid/scrolling/ScrollApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
