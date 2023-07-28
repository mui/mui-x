# Data Grid - Layout

<p class="description">The data grid offers multiple layout modes.</p>

:::error
By default, the Data Grid has **no intrinsic dimensions**.
Instead, it takes up the space given by its parent.
The grid will raise an error in the console if its container has no intrinsic dimensions.
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

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
