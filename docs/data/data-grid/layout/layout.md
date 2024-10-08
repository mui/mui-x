# Data Grid - Layout

<p class="description">The data grid offers multiple layout modes.</p>

:::error
By default, the Data Grid has **no intrinsic dimensions**.
Instead, it takes up the space given by its parent.
The Data Grid will raise an error in the console if its container has no intrinsic dimensions.
:::

## Flex parent container

The Data Grid can be placed inside a flex container with `flex-direction: column`.
Without setting the minimum and maximum height, the Data Grid takes as much space as it needs to display all rows.

:::warning
Consider setting `maxHeight` on the flex parent container, otherwise row virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.
:::

{{"demo": "FlexGrid.js", "bg": "inline"}}

:::success
The flex parent in the demo above is effectively equivalent [`autoHeight`](/x/react-data-grid/layout/#auto-height) prop, but with the added benefit of being able to set the minimum and maximum height of the parent container.
:::

### Minimum and maximum height

In the demo below, the Data Grid is placed inside a flex container with a minimum height of `200px` and a maximum height of `400px` and adapts its height when the number of rows changes.

{{"demo": "MinMaxHeightGrid.js", "bg": "inline"}}

## Percentage dimensions

When using percentages (%) for height or width, make sure that the Data Grid's parent container has intrinsic dimensions.
Browsers adjust the element based on a percentage of its parent's size.
If the parent has no size, the percentage will be zero.

## Predefined dimensions

You can predefine dimensions for the parent of the data grid.

{{"demo": "FixedSizeGrid.js", "bg": "inline"}}

## Auto height

:::error
This prop is deprecated, use the [flex parent container](/x/react-data-grid/layout/#flex-parent-container) instead.
:::

The `autoHeight` prop enables the Data Grid to adjust its size based on its content.
This means that the Data Grid's height will be determined by the number of rows, ensuring that all rows will be visible to the user simultaneously.

{{"demo": "AutoHeightGrid.js", "bg": "inline"}}

### Overlay height

When `autoHeight` is enabled, grid overlays (such as
["Loading"](/x/react-data-grid/overlays/#loading-overlay) or
["No rows"](/x/react-data-grid/overlays/#no-rows-overlay))
take the height of two rows by default.

To customize the overlay height, use the `--DataGrid-overlayHeight` CSS variable.

{{"demo": "AutoHeightOverlayNoSnap.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
