---
title: Data Grid - Virtualization
---

# Data Grid - Virtualization

<p class="description">The grid is high performing thanks to its rows and columns virtualization engine.</p>

DOM virtualization is the feature that allows the grid to handle an unlimited\* number of rows and columns.
This is a built-in feature of the rendering engine and greatly improves rendering performance.

_\*unlimited: Browsers set a limit on the number of pixels a scroll container can host: 17.5 million pixels on Firefox, 33.5 million pixels on Chrome, Edge, and Safari. A [reproduction](https://codesandbox.io/s/beautiful-silence-1yifo?file=/src/App.js)._

## Row virtualization [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

Row virtualization is the insertion and removal of rows as the grid scrolls vertically.

The grid renders twice as many rows as are visible. It isn't configurable yet.
Row virtualization is limited to 100 rows in the `DataGrid` component.

## Column virtualization

Column virtualization is the insertion and removal of columns as the grid scrolls horizontally.

- Overscanning by at least one column allows the arrow key to focus on the next (not yet visible) item.
- Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
- Overscanning more allows the built-in search feature of the browser to find more matching cells.
- Overscanning too much can negatively impact performance.

By default, 2 columns are rendered outside of the viewport. You can change this option with the `columnBuffer` prop. The following demo renders 1,000 columns in total:

{{"demo": "pages/components/data-grid/virtualization/ColumnVirtualizationGrid.js", "bg": "inline"}}

You can disable column virtualization by setting the column buffer to a higher number than the number of rendered columns, e.g. with `columnBuffer={columns.length}` or `columnBuffer={Number.MAX_SAFE_INTEGER}`.

## Disable virtualization

The virtualization can be disabled completely using the `disableVirtualization` prop.
You may want to turn it off to be able to test the grid with a headless browser, like jsdom.

```tsx
<DataGrid {...data} disableVirtualization />
```

**Note**: Disabling the virtualization will increase the size of the DOM and drastically reduce the performance. Use it only for testing purposes or on small datasets.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
