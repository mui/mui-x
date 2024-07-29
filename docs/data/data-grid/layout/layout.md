# Data Grid - Layout

<p class="description">The data grid offers multiple layout modes.</p>

:::error
By default, the Data Grid has **no intrinsic dimensions**.
Instead, it takes up the space given by its parent.
The Data Grid will raise an error in the console if its container has no intrinsic dimensions.
:::

## Percentage dimensions

When using percentages (%) for height or width, make sure that the Data Grid's parent container has intrinsic dimensions.
Browsers adjust the element based on a percentage of its parent's size.
If the parent has no size, the percentage will be zero.

## Predefined dimensions

You can predefine dimensions for the parent of the data grid.

{{"demo": "FixedSizeGrid.js", "bg": "inline"}}

## Auto height

The `autoHeight` prop enables the Data Grid to adjust its size based on its content.
This means that the Data Grid's height will be determined by the number of rows, ensuring that all rows will be visible to the user simultaneously.

:::warning
This is not recommended for large datasets as row virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.
:::

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
