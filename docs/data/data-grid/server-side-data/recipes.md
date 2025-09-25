# Data Grid - Server-side data recipes

<p class="description">Recipes for advanced data source use-cases.</p>

## Cursor-based pagination with Data Source

Cursor-based pagination uses opaque cursors instead of page numbers to navigate through data, which is essential for APIs like GitHub, Stripe, or GraphQL Relay that don't support offset-based pagination. The demo below shows how to implement cursor pagination with the Data Source by using `await params.getCursor()` to retrieve the appropriate cursor for the current page, which the Data Grid automatically manages based on the `nextCursor` returned in your `pageInfo` response. The grid handles cursor storage, prevents skipping pages, and resets cursors when filters or sorting changes.

{{"demo": "ServerSideDataSourceCursorPagination.js", "bg": "inline"}}

:::info
The demo uses `useMockServer` with `useCursorPagination: true` to simulate a cursor-based API. Open your browser's console to see the cursor values in action.
:::

## Tree data nested pagination

By default, the pagination works only on the first level of the tree.
You can create the nested pagination with [row pinning](/x/react-data-grid/row-pinning/) feature as shown in the following demo.

:::warning

This demo implements nested lazy loading using row pinning, which means that certain features such as caching, row selection, and copy & paste functionality may not work as expected.

Check the [Server-side data—Nested lazy loading](/x/react-data-grid/server-side-data/lazy-loading/#nested-lazy-loading) section for updates on an internal implementation.

:::

{{"demo": "ServerSideTreeDataNestedPagination.js", "bg": "inline"}}
