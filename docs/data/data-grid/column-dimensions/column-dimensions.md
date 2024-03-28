# Data Grid - Column dimensions

<p class="description">Customize the dimensions and resizing behavior of your columns.</p>

## Column width

By default, the columns have a width of 100px.
This is an arbitrary, easy-to-remember value.
To change the width of a column, use the `width` property available in `GridColDef`.

{{"demo": "ColumnWidthGrid.js", "bg": "inline"}}

### Minimum width

By default, the columns have a minimum width of 50px.
This is an arbitrary, easy-to-remember value.
To change the minimum width of a column, use the `minWidth` property available in `GridColDef`.

{{"demo": "ColumnMinWidthGrid.js", "bg": "inline"}}

### Fluid width

Column fluidity or responsiveness can be achieved by setting the `flex` property in `GridColDef`.

The `flex` property accepts a value between 0 and ∞.
It works by dividing the remaining space in the data grid among all flex columns in proportion to their `flex` value.

For example, consider a grid with a total width of 500px that has three columns: the first with `width: 200`; the second with `flex: 1`; and the third with `flex: 0.5`.
The first column will be 200px wide, leaving 300px remaining. The column with `flex: 1` is twice the size of `flex: 0.5`, which means that final sizes will be: 200px, 200px, 100px.

To set a minimum and maximum width for a `flex` column set the `minWidth` and the `maxWidth` property in `GridColDef`.

:::warning
Before using fluid width, note that:

- `flex` doesn't work together with `width`. If you set both `flex` and `width` in `GridColDef`, `flex` will override `width`.
- `flex` doesn't work if the combined width of the columns that have `width` is more than the width of the data grid itself. If that is the case a scroll bar will be visible, and the columns that have `flex` will default back to their base value of 100px.

:::

{{"demo": "ColumnFluidWidthGrid.js", "bg": "inline"}}

## Resizing

By default, Data Grid allows all columns to be resized by dragging the right portion of the column separator.

To prevent the resizing of a column, set `resizable: false` in the `GridColDef`.
Alternatively, to disable all columns resize, set the prop `disableColumnResize={true}`.

To restrict resizing a column under a certain width set the `minWidth` property in `GridColDef`.

To restrict resizing a column above a certain width set the `maxWidth` property in `GridColDef`.

{{"demo": "ColumnSizingGrid.js", "disableAd": true, "bg": "inline"}}

To capture changes in the width of a column there are two callbacks that are called:

- `onColumnResize`: Called while a column is being resized.
- `onColumnWidthChange`: Called after the width of a column is changed, but not during resizing.

## Autosizing

Data Grid allows to autosize the columns' dimensions based on their content. Autosizing is enabled by default. To turn it off, pass the `disableAutosize` prop to the Data Grid.

Autosizing can be used by one of the following methods:

- Adding the `autosizeOnMount` prop,
- Double-clicking a column header separator on the grid,
- Calling the `apiRef.current.autosizeColumns(options)` API method.

You can pass options directly to the API method when you call it. To configure autosize for the other two methods, provide the options in the `autosizeOptions` prop.

Note that for the separator double-click method, the `autosizeOptions.columns` will be replaced by the respective column user double-clicked on.

In all the cases, the `colDef.minWidth` and `colDef.maxWidth` options will be respected.

```tsx
<DataGrid
  {...otherProps}
  autosizeOptions={{
    columns: ['name', 'status', 'createdBy'],
    includeOutliers: true,
    includeHeaders: false,
  }}
/>
```

{{"demo": "ColumnAutosizing.js", "disableAd": true, "bg": "inline"}}

:::warning
The Data Grid can only autosize based on the currently rendered cells.

DOM access is required to accurately calculate dimensions, so unmounted cells (when [virtualization](/x/react-data-grid/virtualization/) is on) cannot be sized. If you need a bigger row sample, [open an issue](https://github.com/mui/mui-x/issues) to discuss it further.
:::

### Autosizing asynchronously

The `autosizeColumns` method from the `apiRef` can be used as well to adjust the column size on specified events, for example when receiving row data from the server.

{{"demo": "ColumnAutosizingAsync.js", "disableAd": true, "bg": "inline"}}

:::warning
This example uses `ReactDOM.flushSync`. If used incorrectly it can hurt the performance of your application. Please refer to the official [React docs](https://react.dev/reference/react-dom/flushSync) for further information.
:::

### Autosizing with dynamic row height

Column autosizing is compatible with the [Dynamic row height](/x/react-data-grid/row-height/#dynamic-row-height) feature.

{{"demo": "ColumnAutosizingDynamicRowHeight.js", "disableAd": true, "bg": "inline"}}

:::warning
When autosizing columns with long content, consider setting the `maxWidth` for the column to avoid it becoming too wide.
:::

### Autosizing with grouped rows [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

When using [row grouping](/x/react-data-grid/row-grouping/) you can utilize the `autosizeColumns` method to adjust the column width of the expanded rows dynamically.
The demo below shows how you can subscribe to the `rowExpansionChange` event. The provided handler function then calls the `autosizeColumns` method from the gridApi.

{{"demo": "ColumnAutosizingGroupedRows.js", "disableAd": true, "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
