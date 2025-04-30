---
title: Data Grid - Server-side lazy loading
---

# Data Grid - Server-side lazy loading [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Implement lazy-loading rows with server-side data in the Data Grid using the Data Source layer.</p>

## Server-side lazy loading

Lazy loading is a technique for deferring the loading of resources until they are actually needed, rather than loading everything when a page is first requested.
Lazy loading changes the way pagination works in the Data Grid by removing page controls and instead loading data dynamically (in a single list) as the user scrolls.

The Data Grid Pro can lazy-load server-side data using the [Data Source layer](/x/react-data-grid/server-side-data/#the-solution-the-data-source-layer).

:::info
For lazy loading on the client side, see [Lazy loading (client side)](/x/react-data-grid/lazy-loading/).
:::

## Prerequisites

To be able to lazy-load data from the server, you must create a Data Source and pass the `dataSource` prop to the Data Grid, as detailed in the [Server-side data overview](/x/react-data-grid/server-side-data/).

## Implementing server-side lazy loading

To enable lazy loading, pass the `lazyLoading` prop to the Data Grid along with the `dataSource` prop.

```tsx
<DataGridPro dataSource={dataSource} lazyLoading />
```

## How lazy loading works

Initially, data for the first page is fetched and displayed in the Grid.
The value of the total row count determines when the next page's data is loaded:

- **If the total row count is known**, the Data Grid is filled with skeleton rows and fetches more data if one of the skeleton rows falls into the rendering context.
  This loading strategy is referred to as [**viewport loading**](#viewport-loading).

- **If the total row count is unknown**, the Data Grid fetches more data when the user scrolls to the bottom.
  This loading strategy is referred to as [**infinite loading**](#infinite-loading).

### Providing the row count for lazy loading

You can provide the row count through one of three ways:

1. Pass it via the [`rowCount`](/x/api/data-grid/data-grid/#data-grid-prop-rowCount) prop
2. Return `rowCount` in the `getRows()` method of the Data Source
3. Set the `rowCount` using the [`setRowCount()`](/x/api/data-grid/grid-api/#grid-api-prop-setRowCount) API method

These options are presented in order of precedence, which means if the row count is set using the API, that value is overridden once a new value is returned by the `getRows()` method (unless it's `undefined`).

## Lazy loading modes

As described in [How lazy loading works](#how-lazy-loading-works) above, the Data Grid implements different strategies for lazy loading depending on whether or not the row count is known.

### Viewport loading

Viewport loading mode is enabled when the row count is known (and is greater than or equal to zero).
The Grid fetches the first page immediately and adds skeleton rows to match the total row count.
Other pages are fetched once the user starts scrolling and moves a skeleton row inside the rendering context (with the index range defined by [virtualization](/x/react-data-grid/virtualization/)).

If the user scrolls too fast, the Grid loads multiple pages with one request (by adjusting the `start` and `end` parameters) to reduce the server load.

The demo below shows how viewport loading mode works:

{{"demo": "ServerSideLazyLoadingViewport.js", "bg": "inline"}}

:::info
The Data Source demos use a `useMockServer` utility function to simulate server-side data fetching.
In a real-world scenario you would replace this with your own server-side data-fetching logic.

Open the Info section of your browser console to see the requests being made and the data being fetched in response.
:::

#### Request throttling

As a user scrolls through the Grid, the rendering context changes and the Grid tries to fill in any missing rows by making a new server request.
It also throttles new data fetches to avoid making unnecessary requests.
The default throttle time is 500 milliseconds.
Use the `lazyLoadingRequestThrottleMs` prop to set a custom time, as shown below:

{{"demo": "ServerSideLazyLoadingRequestThrottle.js", "bg": "inline"}}

### Infinite loading

Infinite loading mode is enabled when the row count is unknown (meaning its value is either `-1` or `undefined`).
A new page is loaded when the scroll reaches the bottom of the viewport area.

You can use the `scrollEndThreshold` prop to change the area that triggers new requests.

The demo below shows how infinite loading mode works.
The page size is set to `15` and the mock server is configured to return a total of 100 rows.
When the response contains no new rows, the Grid stops requesting new data.

{{"demo": "ServerSideLazyLoadingInfinite.js", "bg": "inline"}}

### Changing the loading mode

The Grid changes the loading mode dynamically if the total row count gets updated by changing the `rowCount` prop, returning a different `rowCount` in `GridGetRowsResponse`, or via the `setRowCount()` method.

Depending on the previous and new values for the total row count, the following scenarios are possible:

- **Unknown to known row count** – When the row count is set to a valid value from an unknown value, the Data Grid switches to viewport loading mode. It checks the number of already fetched rows and adds skeleton rows to match the provided row count.

- **Known to unknown row count** – If the row count is updated and set to `-1`, the Data Grid resets, fetches the first page, then sets itself to infinite loading mode.

- **Known row count greater than the actual row count** – This can happen either by reducing the value of the row count after more rows were already fetched, or if the row count was unknown and the Grid already fetched more rows while in infinite loading mode. In this case, the Grid resets, fetches the first page, and then continues in one mode or the other depending on the new value of the `rowCount`.

:::warning
`rowCount` is expected to be static.
Changing its value can cause the Grid to reset and the cache to be cleared, which can lead to performance and UX degradation.
:::

The following demo showcases how the loading mode can change as described above, and is not representative of something you would implement in a real-world scenario.

{{"demo": "ServerSideLazyLoadingModeUpdate.js", "bg": "inline"}}

## Nested lazy loading 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/14527) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With this feature, you would be able to use the `lazyLoading` flag in use cases that also involve tree data and/or row grouping.

## Error handling

To handle errors, use the `onDataSourceError()` prop as described in [Server-side data overview—Error handling](/x/react-data-grid/server-side-data/#error-handling).

You can pass the second parameter of type `GridGetRowsParams` to the `getRows()` method of the [`dataSource`](/x/api/data-grid/grid-api/#grid-api-prop-dataSource) to retry the request.
If successful, the Data Grid uses `rows` and `rowCount` data to determine if the rows should be appended at the end of the Grid or if the skeleton rows should be replaced.

The following demo provides an example how to use `GridGetRowsParams` to retry a failed request:

{{"demo": "ServerSideLazyLoadingErrorHandling.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
