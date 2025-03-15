# Data Grid - Virtualization

<p class="description">The grid is high performing thanks to its rows and columns virtualization engine.</p>

DOM virtualization is the feature that allows the Data Grid to handle an unlimited\* number of rows and columns.
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

- Overscanning by at least one column allows the arrow key to focus on the next (not yet visible) item.
- Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
- Overscanning more allows the built-in search feature of the browser to find more matching cells.
- Overscanning too much can negatively impact performance.

By default, columns coming under 150 pixels region are rendered outside of the viewport. You can change this option with the `columnBufferPx` prop. As for `rowBufferPx`, the value may be ignored in some situations. The following demo renders 1,000 columns in total:

{{"demo": "ColumnVirtualizationGrid.js", "bg": "inline"}}

You can disable column virtualization by calling `apiRef.current.unstable_setColumnVirtualization(false)`, or by setting the [`columnBufferPx`](/x/api/data-grid/data-grid/#data-grid-prop-columnBufferPx) to a high value.

:::info
Column virtualization is disabled when dynamic row height is enabled.
See [dynamic row height and column virtualization](/x/react-data-grid/row-height/#column-virtualization) to learn more.
:::

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
