# Data Grid - Server-side data recipes

<p class="description">Recipes for advanced data source use-cases.</p>

## Cursor-based pagination

Cursor-based pagination requires the cursor from the previous page's response to fetch the next page. Unlike offset pagination where you can jump to any page independently, each page request depends on the cursor returned from the earlier response.

There are two approaches to implement:

1. **Blocking approach**: Users can only navigate to the next page after the current response arrives with its cursor
2. **Non-blocking approach**: Allow users to click next immediately, but queue the request until the previous cursor becomes available

### Blocking approach

The following example demonstrates the blocking approach by controlling the `paginationModel` state.
It is only updated when the previous page's response arrives, ensuring that the cursor is always available for the next request.

{{"demo": "ServerSideCursorBlocking.js", "bg": "inline"}}

### Non-blocking approach

The following example demonstrates the non-blocking approach using a custom cache with two key methods:

- **`pushKey()`**: Tracks request order before responses arrive, allowing immediate pagination
- **`getLast()`**: Waits for the previous page's cursor to resolve before making the actual request

The cache is cleared whenever the filter or sort model changes to ensure data consistency.

For error handling, the example simulates a server error when requesting page 8.
When an error occurs, the cache entry for that request is deleted, and the `paginationModel` is reverted to the previous page to maintain a consistent state.

{{"demo": "ServerSideCursorNonBlocking.js", "bg": "inline"}}

## Tree data nested pagination

By default, the pagination works only on the first level of the tree.
You can create the nested pagination with [row pinning](/x/react-data-grid/row-pinning/) feature as shown in the following demo.

:::warning

This demo implements nested lazy loading using row pinning, which means that certain features such as caching, row selection, and copy & paste functionality may not work as expected.

Check the [Server-side data—Nested lazy loading](/x/react-data-grid/server-side-data/lazy-loading/#nested-lazy-loading) section for updates on an internal implementation.

:::

{{"demo": "ServerSideTreeDataNestedPagination.js", "bg": "inline"}}
