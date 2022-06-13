---
title: Data Grid - Column dimensions
---

# Data grid - Column dimensions

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
It works by dividing the remaining space in the grid among all flex columns in proportion to their `flex` value.

For example, consider a grid with a total width of 500px that has three columns: the first with `width: 200`; the second with `flex: 1`; and the third with `flex: 0.5`.
The first column will be 200px wide, leaving 300px remaining. The column with `flex: 1` is twice the size of `flex: 0.5`, which means that final sizes will be: 200px, 200px, 100px.

To set a minimum and maximum width for a `flex` column set the `minWidth` and the `maxWidth` property in `GridColDef`.

:::info
Before using fluid width, note that:

- `flex` doesn't work together with `width`. If you set both `flex` and `width` in `GridColDef`, `flex` will override `width`.
- `flex` doesn't work if the combined width of the columns that have `width` is more than the width of the grid itself. If that is the case a scroll bar will be visible, and the columns that have `flex` will default back to their base value of 100px.

:::

{{"demo": "ColumnFluidWidthGrid.js", "bg": "inline"}}

## Resizing [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

By default, `DataGridPro` allows all columns to be resized by dragging the right portion of the column separator.

To prevent the resizing of a column, set `resizable: false` in the `GridColDef`.
Alternatively, to disable all columns resize, set the prop `disableColumnResize={true}`.

To restrict resizing a column under a certain width set the `minWidth` property in `GridColDef`.

To restrict resizing a column above a certain width set the `maxWidth` property in `GridColDef`.

{{"demo": "ColumnSizingGrid.js", "disableAd": true, "bg": "inline"}}

To capture changes in the width of a column there are two callbacks that are called:

- `onColumnResize`: Called while a column is being resized.
- `onColumnWidthChange`: Called after the width of a column is changed, but not during resizing.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
