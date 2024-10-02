---
title: React Data Grid - Server-side lazy loading
---

# Data Grid - Server-side lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Row lazy-loading with server-side data source.</p>

Lazy Loading changes the way pagination works by removing page controls and loading data dynamically (in a single list) as the user scrolls through the grid.

It is enabled by adding `lazyLoading` prop in combination with `unstable_dataSource` prop.

Initially, the first page data is fetched and displayed in the grid. What triggers the loading of next page data depends on the value of the total row count.

If the total row count is known, the grid will be filled with skeleton rows and will fetch more data if one of the skeleton rows falls into the rendering context.

If the total row count is unknown, the grid will fetch more data when the user scrolls to the bottom of the grid. This loading strategy is often referred to as **infinite loading**.

:::info
Row count can be provided either by returning the `rowCount` in the response of the `getRows` method in `unstable_dataSource`, via the `rowCount` prop or by calling [`setRowCount`](/x/api/data-grid/grid-api/#grid-api-prop-setRowCount) API.
:::

:::warning
Order of precedence for the row count:

- `rowCount` prop
- `rowCount` returned by the `getRows` method
- row count set using the `setRowCount` API

This means that, if the row count is set using the API, the value will be overridden once a new value is returned by the `getRows` method, even if it is `undefined`.
:::

## Viewport loading

The viewport loading mode is enabled when the row count is known (`rowCount >= 0`). Grid will fetch the first page and add skeleton rows to match the total row count. Other pages are fetched once the user starts scrolling and moves a skeleton row inside the rendering context (index range defined by [Virtualization](/x/react-data-grid/virtualization/)).

If the user scrolls too fast, the grid loads multiple pages with one request (by adjusting `start` and `end` param) in order to reduce the server load.

The demo below shows the viewport loading mode.

{{"demo": "ServerSideLazyLoadingViewport.js", "bg": "inline"}}

:::info
The data source demos use a utility function `useMockServer` to simulate the server-side data fetching.
In a real-world scenario, you should replace this with your own server-side data-fetching logic.

Open info section of the browser console to see the requests being made and the data being fetched in response.
:::

## Infinite loading

The infinite loading mode is enabled when the row count is unknown (`-1` or `undefined`). New page is loaded when the scroll reaches the bottom of the viewport area.

The area which triggers the new request can be changed using `scrollEndThreshold`.

The demo below shows the infinite loading mode. Page size is set to `15` and the mock server is configured to return a total of `100` rows. Once the response does not contain any new rows, the grid will stop requesting new data.

{{"demo": "ServerSideLazyLoadingInfinite.js", "bg": "inline"}}

## Updating the loading mode

The grid will dynamically change the loading mode if the total row count gets updated in any of the three ways described above.

Based on the previous and the new value for the total row count, the following scenarios are possible:

- **Unknown `rowCount` to known `rowCount`**: If row count is not unknown anymore, the grid will switch to the viewport loading mode. It will check the amount of allready fetched rows and will add skeleton rows to match the total row count.

- **Known `rowCount` to unknown `rowCount`**: If the row count is updated and set to `-1`, the grid will reset, fetch the first page and set itself in the infinite loading mode.

- **Known `rowCount` greater than the actual row count**: This can happen either by reducing the value of the row count after more rows were already fetched or if the row count was unknown and the grid in the inifite loading mode already fetched more rows. In this case, the grid will reset, fetch the first page and continue in one of the modes depending on the new value of the `rowCount`.

:::warning
`rowCount` is expected to be static. Changing its value can cause the grid to reset and the cache to be cleared which leads to poor performance and user experience.
:::

The demo below serves more as a showcase of the behavior described above and is not representing something you would implement in a real-world scenario.

{{"demo": "ServerSideLazyLoadingModeUpdate.js", "bg": "inline"}}

## Nested rows 🚧

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #14527](https://github.com/mui/mui-x/issues/14527) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this feature, or if you are facing a pain point with your current solution.
:::

When completed, it will be possible to use `lazyLoading` flag in combination with `treeData` and `rowGroupingModel`.

## Error handling

To handle errors, use `unstable_onDataSourceError` prop as described in the [Error handling](/x/react-data-grid/server-side-data/#error-handling) section of the data source overview page.

Second parameter of type `GridGetRowsParams` can be passed to `getRows` method of the [`unstable_dataSource`](/x/api/data-grid/grid-api/#grid-api-prop-unstable_dataSource) to retry the request. If successful, the grid will use `rows` and `rowCount` data to determine if the rows should be appended at the end of the grid or the skeleton rows should be replaced.

The following demo gives an example how to use `GridGetRowsParams` to retry a failed request.

{{"demo": "ServerSideLazyLoadingErrorHandling.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
