# Data Grid - Virtualization

<p class="description">The grid is high performing thanks to its rows and columns virtualization engine.</p>

DOM virtualization is what makes it possible for the Data Grid to handle an unlimited\* number of rows and columns.
This is a built-in feature of the rendering engine and greatly improves rendering performance.

_\*unlimited: Browsers set a limit on the number of pixels a scroll container can host: 17.5 million pixels on Firefox, 33.5 million pixels on Chrome, Edge, and Safari. A [reproduction](https://codesandbox.io/s/beautiful-silence-1yifo?file=/src/App.js)._

## Row virtualization [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

Row virtualization is the insertion and removal of rows as the Data Grid scrolls vertically.

The grid renders some additional rows above and below the visible rows. You can use `rowBufferPx` prop to hint to the Data Grid the area to render, but this value may not be respected in certain situations, for example during high-speed scrolling.
Row virtualization is limited to 100 rows in the Data Grid component.

:::warning
Row virtualization does not work with the `autoHeight` prop enabled.
:::

## Column virtualization

Column virtualization is the insertion and removal of columns as the Data Grid scrolls horizontally.

- Overscanning by at least one column lets the arrow key focus on the next (not yet visible) item.
- Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
- Overscanning more lets the built-in search feature of the browser find more matching cells.
- Overscanning too much can negatively impact performance.

By default, columns coming under 150 pixels region are rendered outside of the viewport. You can change this option with the `columnBufferPx` prop. As for `rowBufferPx`, the value may be ignored in some situations. The following demo renders 1,000 columns in total:

{{"demo": "ColumnVirtualizationGrid.js", "bg": "inline"}}

You can disable column virtualization by calling `apiRef.current.unstable_setColumnVirtualization(false)`, or by setting the [`columnBufferPx`](/x/api/data-grid/data-grid/#data-grid-prop-columnBufferPx) to a high value.

:::info
Column virtualization is disabled when dynamic row height is enabled.
See [dynamic row height and column virtualization](/x/react-data-grid/row-height/#column-virtualization) to learn more.
:::

## Scrolling without render gaps

:::warning
This feature is experimental.
It may change or be removed in a future release.
:::

The virtualizer supports two layout modes that differ in how scrolling and row positioning work:

- **Uncontrolled mode** (default). The rows' positions are set relative to the native scroll container.
  A JavaScript logic updates the virtualized rows asynchronously to cover the current scroll position.\
  _(For example, the data grid uses CSS `sticky` positioning to keep headers and pinned rows in place, rendered rows are positioned inside a filler element that stretches the scroll container to the correct total height.)_\
  The downsides:
  - During fast scrolling, the native scroll update can outpace the JavaScript rendering logic, which produces brief empty row areas.

- **Controlled mode**. The rows' positions are set in absolute. A JavaScript logic updates the virtualized rows asynchronously to cover the current scroll position.
  Headers, pinned rows, and data rows always move as one unit.\
  The downsides:
  - During fast scrolling, depending on the browser, the JavaScript rendering logic can be slower than what the native scroll would be, leading to a feeling of lag.
  - Safari row position update is capped at 60Hz, even on higher refresh-rate displays, because of `requestAnimationFrames()`: [webkit#173434](https://bugs.webkit.org/show_bug.cgi?id=173434).

Use the `virtualizerLayoutMode` key inside `experimentalFeatures` to opt in to the controlled mode:

```tsx
<DataGrid experimentalFeatures={{ virtualizerLayoutMode: 'controlled' }} />
```

The demo below lets you switch between modes and scroll quickly to see the difference.
If you don't see the difference, consider setting [CPU Throttling in Chrome Dev Tools](https://developer.chrome.com/docs/devtools/settings/throttling) to simulate a lower-end device.

{{"demo": "VirtualizerLayoutMode.js", "bg": "inline"}}

## Disable virtualization

The virtualization can be disabled completely using the `disableVirtualization` prop.
You may want to turn it off to be able to test the Data Grid with a headless browser, like jsdom.

```tsx
<DataGrid {...data} disableVirtualization />
```

:::warning
Disabling the virtualization will increase the size of the DOM and drastically reduce the performance.
Use it only for testing purposes or on small datasets.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
