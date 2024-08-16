# Data Grid - Row height

<p class="description">Customize the height of your rows.</p>

## Static row height

By default, the rows have a height of 52 pixels.
This matches the normal height in the [Material Design guidelines](https://m2.material.io/components/data-tables).

Use the `rowHeight` prop to change this default value, as shown below:

{{"demo": "DenseHeightGrid.js", "bg": "inline"}}

## Variable row height

If you need some rows to have different row heights, this can be achieved using the `getRowHeight` prop.
This function is called for each visible row and if the return value is a `number` then that `number` will be set as that row's `rowHeight`.
If the return value is `null` or `undefined`, then the `rowHeight` prop will take effect for the given row.

{{"demo": "VariableRowHeightGrid.js", "bg": "inline"}}

:::warning
Changing the Data Grid density does not affect the rows with variable row height.
You can access the density factor from the params provided to the `getRowHeight` prop
:::

:::warning
Always memoize the function provided to `getRowHeight`.
The Data Grid bases on the referential value of these props to cache their values and optimize the rendering.
:::

```tsx
const getRowHeight = React.useCallback(() => { ... }, []);

<DataGridPro getRowHeight={getRowHeight} />
```

## Dynamic row height

Instead of a fixed row height, you can let the data grid calculate the height of each row based on its content.
To do so, return `"auto"` on the function passed to the `getRowHeight` prop.

```tsx
<DataGrid getRowHeight={() => 'auto'} />
```

The following demo shows this feature in action:

{{"demo": "DynamicRowHeightGrid.js", "bg": "inline", "defaultCodeOpen": false}}

The dynamic row height implementation is based on a lazy approach, which means that the rows are measured as they are rendered.
Because of this, you may see the size of the scrollbar thumb changing during scroll.
This side effect happens because a row height estimation is used while a row is not rendered, then this value is replaced once the true measurement is obtained.
You can configure the estimated value used by passing a function to the `getEstimatedRowHeight` prop.
If not provided, the default row height of `52px` is used as estimation.
It's recommended to pass this prop if the content deviates too much from the default value.
Note that, due to the implementation adopted, the virtualization of the columns is also disabled to force all columns to be rendered at the same time.

```tsx
<DataGrid getRowHeight={() => 'auto'} getEstimatedRowHeight={() => 200} />
```

{{"demo": "ExpandableCells.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
When the height of a row is set to `"auto"`, the final height will follow exactly the content size and ignore the density.
Add padding to the cells to increase the space between the content and the cell borders.

```tsx
<DataGrid
  sx={{
    '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: '8px' },
    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
    '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
  }}
/>
```

:::

## Row density

Give your users the option to change the default row density to match their preferences—compact, standard, or comfortable.
Density is calculated based on the `rowHeight` and/or `columnHeaderHeight` props, when present.
See [Density](https://mui.com/x/react-data-grid/accessibility/#density) for details.

## Row spacing

You can use the `getRowSpacing` prop to increase the spacing between rows.
This prop is called with a [`GridRowSpacingParams`](/x/api/data-grid/grid-row-spacing-params/) object.

```tsx
const getRowSpacing = React.useCallback((params: GridRowSpacingParams) => {
  return {
    top: params.isFirstVisible ? 0 : 5,
    bottom: params.isLastVisible ? 0 : 5,
  };
}, []);
```

{{"demo": "RowMarginGrid.js", "bg": "inline", "defaultCodeOpen": false}}

By default, setting `getRowSpacing` will change the `marginXXX` CSS properties of each row.
To add a border instead, set `rowSpacingType` to `"border"` and customize the color and style.

```tsx
<DataGrid
  getRowSpacing={...}
  rowSpacingType="border"
  sx={{ '& .MuiDataGrid-row': { borderTopColor: 'yellow', borderTopStyle: 'solid' } }}
/>
```

:::success
Adding a bottom margin or border to rows that also have a [detail panel](/x/react-data-grid/master-detail/) is not recommended because the detail panel relies on the bottom margin to work.

As an alternative, you can use the top spacing to define the space between rows.
It's easier to always increase the next row spacing no matter if the detail panel is expanded or not, but you can use `gridDetailPanelExpandedRowIdsSelector` to apply a spacing depending on the open state.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
