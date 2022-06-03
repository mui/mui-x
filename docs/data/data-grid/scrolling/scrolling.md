---
title: Data Grid - Scrolling
---

# Data grid - Scrolling

<p class="description">This section presents how to programmatically control the scroll.</p>

## Scrolling to specific cells [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

You can scroll to a specific cell by calling `apiRef.current.scrollToIndexes()`.
The only argument that must be passed is an object containing the row index and the column index of the cell to scroll.
If the row or column index is not present, the grid will not do any movement in the missing axis.

The following demo explores the usage of this API:

{{"demo": "ScrollPlayground.js", "bg": true}}

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

:::warning
Only use this API as the last option. Give preference to the props to control the grid.
:::

{{"demo": "ScrollApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
