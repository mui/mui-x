---
title: Data Grid - Rendering
components: DataGrid, XGrid
---

# Data Grid - Rendering

<p class="description">The grid is highly customizable. Take advantage of a React first implementation.</p>

## Column definitions

### Header cell

## Layout

By default, the grid has no intrinsic dimensions, it occupies the space its parent leaves.

### Flex layout

It's recommanded to use a flex container to render the grid. It allows flexible layout, resize well, and works on all devices.

{{"demo": "pages/components/data-grid/rendering/FlexLayoutGrid.js"}}

### Predefiend dimensions

You can predefine dimensions for the parent of the grid

{{"demo": "pages/components/data-grid/rendering/FixedSizeGrid.js"}}

### Auto height

The `autoHeight` prop allows to size the grid according to its content.
This means that the number of rows will drive the height of the grid and consequently, they all be rendered and visible to the user at the same time.

> ⚠️ This is not recommended for large dataset as row virtualization will not be able to improve performance by limiting the number of elements rendered on the DOM.

{{"demo": "pages/components/data-grid/rendering/AutoHeightGrid.js"}}

## Virtualization

DOM virtualization is the feature that allows the grid to handle an unlimited\* number of rows and columns.
This feature is built-in the rendering engine and greatly improve rendering performance.

_unlimited\*: Browsers set a limit on the number of pixels a scrollbar can contain: 17.5 million pixels on Firefox, 33.5 million pixels on Chrome, Edge, and Safari. A [reproduction](https://codesandbox.io/s/beautiful-silence-1yifo?file=/src/App.js)._

### Row virtualization <span role="img" title="Enterprise">⚡️</span>

Row virtualization is the insertion and removal of rows as the grid scrolls vertically.

The grid renders twice as many rows that are visible. It's not configurable yet.
Row virtualization is limited to 100 rows in the `DataGrid` component.

### Column virtualization

Column virtualization is the insertion and removal of columns as the grid scrolls horizontally.

- Overscanning by at least one column allows the arrow key to focus on the next (not yet visible) item.
- Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
- Overscanning more allows the built-in search feature of the browser to find more matching cells.
- Overscanning too much can negatively impact performance.

By default, 2 columns are rendered outside of the viewport. You can change this option with the `columnBuffer` prop. The following demo renders 1,000 columns:

{{"demo": "pages/components/data-grid/rendering/ColumnVirtualizationGrid.js"}}

You can disable column virtualization by setting the column buffer to a higher number than the number of rendered columns, e.g. with `columnBuffer={columns.length}` or `columnBuffer={Number.MAX_SAFE_INTEGER}`.

## Components

As part of the customization API, the grid allows to replace and override the following components:

- `header`: The component rendered above the column header bar.
- `loadingOverlay`: The component rendered when the loading react prop is set to true.
- `noRowsOverlay`: The component rendered when the rows react prop is empty or [].
- `footer`: The component rendered below the viewport.
- `pagination`: The component rendered for the pagination feature.

### Pagination

By default, the pagination uses the [TablePagination](/components/pagination/#table-pagination) component that is optimized for handling tabular data. This demo replaces it with the [Pagination](/components/pagination/) component.

{{"demo": "pages/components/data-grid/rendering/CustomPaginationGrid.js"}}

## Customization example

The following grid leverages the Ant Design specification.
