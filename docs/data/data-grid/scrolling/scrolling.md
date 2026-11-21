# Data Grid - Scrolling

<p class="description">This section presents how to programmatically control the scroll.</p>

## Scrolling to specific cells

You can scroll to a specific cell by calling `apiRef.current.scrollToIndexes()`.
The only argument that must be passed is an object containing the row index and the column index of the cell to scroll.
If the row or column index is not present, the Data Grid will not do any movement in the missing axis.

Indexes are zero-based.
The `rowIndex` is an index into the full filtered and sorted row list, not relative to the current page, and it must fall within the range of rows displayed on the current page.
With `paginationMode="server"` the Data Grid only holds the rows of the current page, so the absolute index is `page * pageSize` plus the index of the row within the loaded rows.
The `colIndex` is an index into the visible columns.
When an index is out of bounds, the Data Grid logs a warning in development and ignores that axis. It can still scroll along the other axis.
`scrollToIndexes()` returns `true` when it requests a scroll along either axis and `false` when no scroll is requested, such as when the target cell is already in view.

When you append a row through the `rows` prop, its index can be available before the grid has calculated its scroll position.
Calling `scrollToIndexes()` during this interval can also return `false`.
Wait for the grid to update its row positions in a subsequent render before scrolling to the appended row.

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
