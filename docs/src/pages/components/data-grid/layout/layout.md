---
title: Data Grid - Layout
components: DataGrid, XGrid
---

# Data Grid - Layout

<p class="description">The data grid offers multiple layout mode.</p>

By default, the grid has no intrinsic dimensions. It occupies the space its parent leaves.

> ⚠️ When using % (**percentage**) for your height or width.
> You need to make sure the container you are putting the grid into also has an intrinsic dimension.
> The browsers fit the element according to a percentage of the parent dimension.
> If the parent has no dimensions, then the % will be zero.

## Flex layout

It's recommended to use a flex container to render the grid. This allows a flexible layout, resizes well, and works on all devices.

{{"demo": "pages/components/data-grid/layout/FlexLayoutGrid.js", "bg": "inline"}}

## Predefined dimensions

You can predefine dimensions for the parent of the grid.

{{"demo": "pages/components/data-grid/layout/FixedSizeGrid.js", "bg": "inline"}}

## Auto height

The `autoHeight` prop allows the grid to size according to its content.
This means that the number of rows will drive the height of the grid and consequently, they will all be rendered and visible to the user at the same time.

> ⚠️ This is not recommended for large datasets as row virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.

{{"demo": "pages/components/data-grid/layout/AutoHeightGrid.js", "bg": "inline"}}
