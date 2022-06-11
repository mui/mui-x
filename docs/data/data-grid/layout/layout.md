---
title: Data Grid - Layout
---

# Data grid - Layout

<p class="description">The data grid offers multiple layout mode.</p>

:::error
By default, the grid has **no intrinsic dimensions**. It occupies the space its parent leaves.
The grid will raise an error in the console if its container has no intrinsic dimensions.
:::

## Percentage dimensions

When using % (percentage) for your height or width, you need to make sure the container you are putting the grid into also has an intrinsic dimension.
The browsers fit the element according to a percentage of the parent dimension.
If the parent has no dimensions, then the % will be zero.

## Flex layout

It's recommended to use a flex container to render the grid. This allows a flexible layout, resizes well, and works on all devices.

{{"demo": "FlexLayoutGrid.js", "bg": "inline"}}

## Predefined dimensions

You can predefine dimensions for the parent of the grid.

{{"demo": "FixedSizeGrid.js", "bg": "inline"}}

## Auto height

The `autoHeight` prop allows the grid to size according to its content.
This means that the number of rows will drive the height of the grid and consequently, they will all be rendered and visible to the user at the same time.

:::warning
This is not recommended for large datasets as row virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.
:::

{{"demo": "AutoHeightGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
