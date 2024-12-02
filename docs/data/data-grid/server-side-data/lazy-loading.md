---
title: React Data Grid - Server-side lazy loading
---

# Data Grid - Server-side lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🧪

<p class="description">Learn how to implement lazy-loading rows with a server-side data source.</p>

Lazy loading changes the way pagination works by removing page controls and loading data dynamically (in a single list) as the user scrolls through the grid.

You can enable it with the `unstable_lazyLoading` prop paired with the `unstable_dataSource` prop.

Initially, data for the first page is fetched and displayed in the grid.
The value of the total row count determines when the next page's data is loaded:

- If the total row count is known, the Data Grid is filled with skeleton rows and fetches more data if one of the skeleton rows falls into the rendering context.
  This loading strategy is often referred to as [**viewport loading**](#viewport-loading).

- If the total row count is unknown, the Data Grid fetches more data when the user scrolls to the bottom.
  This loading strategy is often referred to as [**infinite loading**](#infinite-loading).

:::info
You can provide the row count through one of the following ways:

- Pass it as the [`rowCount`](/x/api/data-grid/data-grid/#data-grid-prop-rowCount) prop
- Return `rowCount` in the `getRows()` method of the [data source](/x/react-data-grid/server-side-data/#data-source)
- Set the `rowCount` using the [`setRowCount()`](/x/api/data-grid/grid-api/#grid-api-prop-setRowCount) API method

These options are presented in order of precedence, which means if the row count is set using the API, that value is overridden once a new value is returned by the `getRows()` method unless it's `undefined`.
:::

## Viewport loading

Viewport loading mode is enabled when the row count is known (and is greater than or equal to zero).
The Grid fetches the first page immediately and adds skeleton rows to match the total row count.
Other pages are fetched once the user starts scrolling and moves a skeleton row inside the rendering context (with the index range defined by [virtualization](/x/react-data-grid/virtualization/)).

If the user scrolls too fast, the Grid loads multiple pages with one request (by adjusting `start` and `end` parameters) to reduce the server load.

The demo below shows how viewport loading mode works:

{{"demo": "ServerSideLazyLoadingViewport.js", "bg": "inline"}}

:::info
The data source demos use a `useMockServer` utility function to simulate server-side data fetching.
In a real-world scenario you would replace this with your own server-side data-fetching logic.

Open the Info section of your browser console to see the requests being made and the data being fetched in response.
:::

### Request throttling

As a user scrolls through the Grid, the rendering context changes and the Grid tries to fill in any missing rows by making a new server request.
It also throttles new data fetches to avoid making unnecessary requests.
The default throttle time is 500 milliseconds.
Use the `unstable_lazyLoadingRequestThrottleMs` prop to set a custom time, as shown below:

{{"demo": "ServerSideLazyLoadingRequestThrottle.js", "bg": "inline"}}

## Infinite loading

Infinite loading mode is enabled when the row count is unknown (either `-1` or `undefined`).
A new page is loaded when the scroll reaches the bottom of the viewport area.

You can use the `scrollEndThreshold` prop to change the area that triggers new requests.

The demo below shows how infinite loading mode works.
Page size is set to `15` and the mock server is configured to return a total of 100 rows.
When the response contains no new rows, the Grid stops requesting new data.

{{"demo": "ServerSideLazyLoadingInfinite.js", "bg": "inline"}}

## Updating the loading mode

The Grid changes the loading mode dynamically if the total row count gets updated by changing the `rowCount` prop, returning different `rowCount` in `GridGetRowsResponse` or via `setRowCount()` API.

Based on the previous and the new value for the total row count, the following scenarios are possible:

- **Unknown `rowCount` to known `rowCount`**: When the row count is set to a valid value from an unknown value, the Data Grid switches to viewport loading mode. It checks the number of already fetched rows and adds skeleton rows to match the provided row count.

- **Known `rowCount` to unknown `rowCount`**: If the row count is updated and set to `-1`, the Data Grid resets, fetches the first page, then sets itself to infinite loading mode.

- **Known `rowCount` greater than the actual row count**: This can happen either by reducing the value of the row count after more rows were already fetched, or if the row count was unknown and the Grid (while in the infinite loading mode) already fetched more rows. In this case, the Grid resets, fetches the first page, and then continues in one mode or the other depending on the new value of the `rowCount`.

:::warning
`rowCount` is expected to be static.
Changing its value can cause the Grid to reset and the cache to be cleared which may lead to performance and UX degradation.
:::

The demo below serves as a showcase of the behavior described above, and is not representative of something you would implement in a real-world scenario.

{{"demo": "ServerSideLazyLoadingModeUpdate.js", "bg": "inline"}}

## Nested lazy loading 🚧

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #14527](https://github.com/mui/mui-x/issues/14527) if you want to see it land faster.

Don't hesitate to leave a comment on the issue to help influence what gets built—especially if you already have a use case for this feature, or if you're facing a specific pain point with your current solution.
:::

When completed, it will be possible to use the `unstable_lazyLoading` flag in combination with [tree data](/x/react-data-grid/server-side-data/tree-data/) and [row grouping](/x/react-data-grid/server-side-data/row-grouping/).

## Error handling

To handle errors, use the `unstable_onDataSourceError()` prop as described in [Server-side data—Error handling](/x/react-data-grid/server-side-data/#error-handling).

You can pass the second parameter of type `GridGetRowsParams` to the `getRows()` method of the [`unstable_dataSource`](/x/api/data-grid/grid-api/#grid-api-prop-unstable_dataSource) to retry the request.
If successful, the Data Grid uses `rows` and `rowCount` data to determine if the rows should be appended at the end of the grid or if the skeleton rows should be replaced.

The following demo gives an example how to use `GridGetRowsParams` to retry a failed request.

{{"demo": "ServerSideLazyLoadingErrorHandling.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
