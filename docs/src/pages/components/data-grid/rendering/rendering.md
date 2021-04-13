---
title: Data Grid - Rendering
components: DataGrid, XGrid
---

# Data Grid - Rendering

<p class="description">The grid is highly customizable. Take advantage of a React-first implementation.</p>

## Layout

By default, the grid has no intrinsic dimensions. It occupies the space its parent leaves.

> ⚠️ When using % (**percentage**) for your height or width.
> You need to make sure the container you are putting the grid into also has an intrinsic dimension.
> The browsers fit the element according to a percentage of the parent dimension.
> If the parent has no dimensions, then the % will be zero.

### Flex layout

It's recommended to use a flex container to render the grid. This allows a flexible layout, resizes well, and works on all devices.

{{"demo": "pages/components/data-grid/rendering/FlexLayoutGrid.js", "bg": "inline"}}

### Predefined dimensions

You can predefine dimensions for the parent of the grid.

{{"demo": "pages/components/data-grid/rendering/FixedSizeGrid.js", "bg": "inline"}}

### Auto height

The `autoHeight` prop allows the grid to size according to its content.
This means that the number of rows will drive the height of the grid and consequently, they will all be rendered and visible to the user at the same time.

> ⚠️ This is not recommended for large datasets as row virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.

{{"demo": "pages/components/data-grid/rendering/AutoHeightGrid.js", "bg": "inline"}}

## Virtualization

DOM virtualization is the feature that allows the grid to handle an unlimited\* number of rows and columns.
This is a built-in feature of the rendering engine and greatly improves rendering performance.

_unlimited\*: Browsers set a limit on the number of pixels a scroll container can host: 17.5 million pixels on Firefox, 33.5 million pixels on Chrome, Edge, and Safari. A [reproduction](https://codesandbox.io/s/beautiful-silence-1yifo?file=/src/App.js)._

### Row virtualization [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-pro/)

Row virtualization is the insertion and removal of rows as the grid scrolls vertically.

The grid renders twice as many rows as are visible. It isn't configurable yet.
Row virtualization is limited to 100 rows in the `DataGrid` component.

### Column virtualization

Column virtualization is the insertion and removal of columns as the grid scrolls horizontally.

- Overscanning by at least one column allows the arrow key to focus on the next (not yet visible) item.
- Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
- Overscanning more allows the built-in search feature of the browser to find more matching cells.
- Overscanning too much can negatively impact performance.

By default, 2 columns are rendered outside of the viewport. You can change this option with the `columnBuffer` prop. The following demo renders 1,000 columns in total:

{{"demo": "pages/components/data-grid/rendering/ColumnVirtualizationGrid.js", "bg": "inline"}}

You can disable column virtualization by setting the column buffer to a higher number than the number of rendered columns, e.g. with `columnBuffer={columns.length}` or `columnBuffer={Number.MAX_SAFE_INTEGER}`.

## Components prop

As part of the customization API, the grid allows you to replace and override nested components with the `components` prop.
The prop accepts an object of type [GridSlotsComponent](/api/data-grid/#slots) .

### Toolbar

To enable the toolbar you need to add the `Toolbar: GridToolbar` to the grid `components` prop.
This demo showcases how this can be achieved.

{{"demo": "pages/components/data-grid/rendering/ToolbarGrid.js", "bg": "inline"}}

Alternatively, you can compose your own toolbar.

```jsx
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridColumnsToolbarButton />
      <GridFilterToolbarButton />
    </GridToolbarContainer>
  );
}
```

{{"demo": "pages/components/data-grid/rendering/CustomToolbarGrid.js", "bg": "inline"}}

### Loading overlay

By default, the loading overlay displays a circular progress.
This demo replaces it with a linear progress.

{{"demo": "pages/components/data-grid/rendering/CustomLoadingOverlayGrid.js", "bg": "inline"}}

### No rows overlay

In the following demo, an illustration is added on top of the default "No Rows" message.

{{"demo": "pages/components/data-grid/rendering/CustomEmptyOverlayGrid.js", "bg": "inline"}}

### Footer

The grid exposes props to hide specific elements of the UI:

- `hideFooter`: If `true`, the footer component is hidden.
- `hideFooterRowCount`: If `true`, the row count in the footer is hidden.
- `hideFooterSelectedRowCount`: If `true`, the selected row count in the footer is hidden.
- `hideFooterPagination`: If `true`, the pagination component in the footer is hidden.

By default, pagination uses the [TablePagination](/components/pagination/#table-pagination) component that is optimized for handling tabular data.
This demo replaces it with the [Pagination](/components/pagination/) component.

{{"demo": "pages/components/data-grid/rendering/CustomPaginationGrid.js", "bg": "inline"}}

## Customization example

The following grid leverages the CSS customization API to match the Ant Design specification.

{{"demo": "pages/components/data-grid/rendering/AntDesignGrid.js"}}
