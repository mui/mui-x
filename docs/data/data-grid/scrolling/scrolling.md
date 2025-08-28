# Data Grid - Scrolling

<p class="description">This section presents how to programmatically control the scroll.</p>

## Scrolling to specific cells

You can scroll to a specific cell by calling `apiRef.current.scrollToIndexes()`.
The only argument that must be passed is an object containing the row index and the column index of the cell to scroll.
If the row or column index is not present, the Data Grid will not do any movement in the missing axis.

The following demo explores the usage of this API:

{{"demo": "ScrollPlayground.js", "bg": "inline"}}

## Scroll restoration

You can restore scroll to a previous position by defining `initialState.scroll` values `{ top: number, left: number }`. The Data Grid will mount at the specified scroll offset in pixels.

The following demo explores the usage of scroll restoration:

{{"demo": "ScrollRestoration.js", "bg": "inline"}}

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of scrolling feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

{{"demo": "ScrollApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
