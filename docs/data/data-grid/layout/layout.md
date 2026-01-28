# Data Grid - Layout

<p class="description">The Data Grid offers multiple layout modes.</p>

:::error
The Data Grid has no intrinsic dimensions: you must set the dimensions using one of the approaches below or else it may not display correctly.
By default, the Data Grid fills the space of its parent container, so that container must have intrinsic dimensions.
In other words, if the container has no child elements, then it still must have non-zero dimensions.
:::

## Flex parent container

:::success
When to use:

- You want the Data Grid to take its content height, but with a minimum or maximum height constraints.
- You want the Data Grid height to be dynamic, and use row virtualization when rows do not fit the Data Grid viewport.

When not to use:

- You want the Data Grid to always take the height of its content, with no vertical scrollbar, and no row virtualization.
  In this case, use the [`autoHeight`](/x/react-data-grid/layout/#auto-height) prop.

:::

The Data Grid can be placed inside a flex container with `flex-direction: column`.
Without setting the minimum and maximum height, the Data Grid takes as much space as it needs to display all rows.

:::warning
Consider setting `maxHeight` on the flex parent container, otherwise row virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.
:::

{{"demo": "FlexGrid.js", "bg": "inline"}}

### Minimum and maximum height

In the demo below, the Data Grid is placed inside a flex container with a minimum height of `200px` and a maximum height of `400px` and adapts its height when the number of rows changes.

{{"demo": "MinMaxHeightGrid.js", "bg": "inline"}}

## Percentage dimensions

When using percentages (%) for height or width, make sure that the Data Grid's parent container has intrinsic dimensions.
Browsers adjust the element based on a percentage of its parent's size.
If the parent has no size, the percentage will be zero.

## Predefined dimensions

You can predefine dimensions for the parent of the Data Grid.

{{"demo": "FixedSizeGrid.js", "bg": "inline"}}

## Overlay height

When data grid has no content, overlays (such as
["Loading"](/x/react-data-grid/overlays/#loading-overlay) or
["No rows"](/x/react-data-grid/overlays/#no-rows-overlay))
take the height of two rows by default.

To customize the overlay height, use the `--DataGrid-overlayHeight` CSS variable.

{{"demo": "GridOverlayHeight.js", "bg": "inline"}}

## Auto height

:::success
When to use:

- You don't need to set a minimum or maximum height for the Data Grid
- You want the Data Grid to always take the height of its content, with no vertical scrollbar, and no row virtualization.

When not to use:

- You need to set a minimum or maximum height for the Data Grid, or want the Data Grid height to be dynamic.
  In this case, use the [flex parent container](/x/react-data-grid/layout/#flex-parent-container) instead.

:::

The `autoHeight` prop enables the Data Grid to adjust its size based on its content.
This means that the Data Grid's height will be determined by the number of rows, ensuring that all rows will be visible to the user simultaneously.

{{"demo": "AutoHeightGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
