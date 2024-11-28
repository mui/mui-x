---
title: React Data Grid - Server-side lazy loading
---

# Data Grid - Server-side lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Row lazy-loading with server-side data source.</p>

Lazy Loading changes the way pagination works by removing page controls and loading data dynamically (in a single list) as the user scrolls through the grid.

It is enabled by adding `unstable_lazyLoading` prop in combination with `unstable_dataSource` prop.

Initially, the first page data is fetched and displayed in the grid. What triggers the loading of next page data depends on the value of the total row count.

If the total row count is known, the Data Grid gets filled with skeleton rows and fetches more data if one of the skeleton rows falls into the rendering context.
This loading strategy is often referred to as [**viewport loading**](#viewport-loading).

If the total row count is unknown, the Data Grid fetches more data when the user scrolls to the bottom. This loading strategy is often referred to as [**infinite loading**](#infinite-loading).

:::info
Row count can be provided in either of the following ways.

- Pass as [`rowCount`](/x/api/data-grid/data-grid/#data-grid-prop-rowCount) prop
- Return `rowCount` in the `getRows` method of the [data source](/x/react-data-grid/server-side-data/#data-source)
- Set the `rowCount` using the [`setRowCount`](/x/api/data-grid/grid-api/#grid-api-prop-setRowCount) API method.

The above list is given in the order of precedence, which means if the row count is set using the API, that value gets overridden once a new value is returned by the `getRows` method, unless if it is `undefined`.
:::

## Viewport loading

The viewport loading mode is enabled when the row count is known (`rowCount >= 0`). Grid fetches the first page immediately and adds skeleton rows to match the total row count. Other pages are fetched once the user starts scrolling and moves a skeleton row inside the rendering context (index range defined by [Virtualization](/x/react-data-grid/virtualization/)).

If the user scrolls too fast, the grid loads multiple pages with one request (by adjusting `start` and `end` param) in order to reduce the server load.

The demo below shows the viewport loading mode.

{{"demo": "ServerSideLazyLoadingViewport.js", "bg": "inline"}}

:::info
The data source demos use a utility function `useMockServer` to simulate the server-side data fetching.
In a real-world scenario, you should replace this with your own server-side data-fetching logic.

Open info section of the browser console to see the requests being made and the data being fetched in response.
:::

### Request throttling

While user is scrolling through the grid, rendering context changes and the Data Grid tries to fill in any missing rows by making a new server request.
The Data Grid throttles new data fetches on the rendering context change to avoid doing unnecessary requests.
The default throttle time is 500 milliseconds, use `unstable_lazyLoadingRequestThrottleMs` prop to customize it, as the following example demonstrates.

{{"demo": "ServerSideLazyLoadingRequestThrottle.js", "bg": "inline"}}

## Infinite loading

The infinite loading mode is enabled when the row count is unknown (`-1` or `undefined`). New page is loaded when the scroll reaches the bottom of the viewport area.

The area which triggers the new request can be changed using `scrollEndThreshold`.

The demo below shows the infinite loading mode. Page size is set to `15` and the mock server is configured to return a total of `100` rows. Once the response does not contain any new rows, the grid stops requesting new data.

{{"demo": "ServerSideLazyLoadingInfinite.js", "bg": "inline"}}

## Updating the loading mode

The grid changes the loading mode dynamically if the total row count gets updated in any of the three ways described above.

Based on the previous and the new value for the total row count, the following scenarios are possible:

- **Unknown `rowCount` to known `rowCount`**: When the row count is set to a valid value from an unknown value, the Data Grid switches to the viewport loading mode. It checks the number of already fetched rows and adds skeleton rows to match the provided row count.

- **Known `rowCount` to unknown `rowCount`**: If the row count is updated and set to `-1`, the Data Grid resets, fetches the first page, and sets itself in the infinite loading mode.

- **Known `rowCount` greater than the actual row count**: This can happen either by reducing the value of the row count after more rows were already fetched or if the row count was unknown and the grid in the inifite loading mode already fetched more rows. In this case, the grid resets, fetches the first page and continues in one of the modes depending on the new value of the `rowCount`.

:::warning
`rowCount` is expected to be static. Changing its value can cause the grid to reset and the cache to be cleared which may lead to performance and UX degradation.
:::

The demo below serves more as a showcase of the behavior described above and is not representing something you would implement in a real-world scenario.

{{"demo": "ServerSideLazyLoadingModeUpdate.js", "bg": "inline"}}

## Nested lazy loading 🚧

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #14527](https://github.com/mui/mui-x/issues/14527) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this feature, or if you are facing a pain point with your current solution.
:::

When completed, it would be possible to use `unstable_lazyLoading` flag in combination with [Tree data](/x/react-data-grid/server-side-data/tree-data/) and [Row grouping](/x/react-data-grid/server-side-data/row-grouping/).

## Error handling

To handle errors, use `unstable_onDataSourceError` prop as described in the [Error handling](/x/react-data-grid/server-side-data/#error-handling) section of the data source overview page.

Second parameter of type `GridGetRowsParams` can be passed to `getRows` method of the [`unstable_dataSource`](/x/api/data-grid/grid-api/#grid-api-prop-unstable_dataSource) to retry the request.
If successful, the Data Grid uses `rows` and `rowCount` data to determine if the rows should be appended at the end of the grid or if the skeleton rows should be replaced.

The following demo gives an example how to use `GridGetRowsParams` to retry a failed request.

{{"demo": "ServerSideLazyLoadingErrorHandling.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
