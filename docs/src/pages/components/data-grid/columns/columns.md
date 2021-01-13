---
title: Data Grid - Columns
components: DataGrid, XGrid
---

# Data Grid - Columns

<p class="description">This section goes in details on the aspects of the columns you need to know.</p>

## Column definitions

Grid columns are defined with the `columns` prop.
`columns` expects an array of objects.
The columns should have this type: `ColDef[]`.

`field` is the only required property since it's the column identifier. It's also used to match with `RowData` values.

```ts
interface ColDef {
  /**
   * The column identifier. It's used to match with [[RowData]] values.
   */
  field: string;
  …
}
```

{{"demo": "pages/components/data-grid/columns/BasicColumnsGrid.js", "bg": "inline"}}

By default, columns are ordered according to the order they are included in the `columns` array.

## Column headers

You can configure the headers with:

- `headerName`: The title of the column rendered in the column header cell.
- `description`: The description of the column rendered as tooltip if the column header name is not fully displayed.
- `hide`: Hide the column.

{{"demo": "pages/components/data-grid/columns/HeaderColumnsGrid.js", "bg": "inline"}}

For more advanced header configuration, go to the [rendering section](/components/data-grid/rendering/#header-cell).

## Column width

By default, the columns have a width of 100 pixels.
This is an arbitrary, easy to remember value.
To change the width of a column, use the `width` property available in `ColDef`.

{{"demo": "pages/components/data-grid/columns/ColumnWidthGrid.js", "bg": "inline"}}

### Fluid width

Each column has a fixed width of 100 pixels by default, but column fluidity (responsiveness) can be by achieved by setting the `flex` property in `ColDef`.

The `flex` property accepts a value between 0 and ∞.

The `flex` property works by dividing the remaining space in the grid among all flex columns in proportion to their `flex` value.
For example, consider a grid with a total width of 500px that has three columns: the first with `width: 200`; the second with `flex: 1`; and third with `flex: 0.5`.
The first column will be 200px wide, leaving 300px remaining. The column with `flex: 1` is twice the size of `flex: 0.5`, which means that final sizes will be: 200px, 200px, 100px.

Note that `flex` doesn't work together with `width`. If you set both `flex` and `width` in `ColDef`, `flex` will override `width`.

In addition, `flex` does not work if the combined width of the columns that have `width` is more than the width of the grid itself. If that is the case a scroll bar will be visible, and the columns that have `flex` will default back to their base value of 100px.

{{"demo": "pages/components/data-grid/columns/ColumnFluidWidthGrid.js", "bg": "inline"}}

## Column resizing [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-x/)

By default, `XGrid` allows all columns to be resized by dragging the right portion of the column separator.

To prevent the resizing of a column, set `resizable: false` in the `ColDef`.
Alternatively, to disable all columns resize, set the prop `disableColumnResize={true}`.

{{"demo": "pages/components/data-grid/columns/ColumnSizingGrid.js", "disableAd": true, "bg": "inline"}}

<!--
- https://ag-grid.com/javascript-grid-resizing/
- https://demos.telerik.com/kendo-ui/grid/column-resizing
- https://www.telerik.com/kendo-react-ui/components/grid/columns/resizing/
- https://elastic.github.io/eui/#/tabular-content/data-grid
- https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/column-resizing/
- http://schrodinger.github.io/fixed-data-table-2/example-resize.html
- https://ej2.syncfusion.com/react/demos/#/material/grid/column-resizing
- https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/ColumnResizing/React/Light/
- https://www.jqwidgets.com/react/react-grid/#https://www.jqwidgets.com/react/react-grid/react-grid-columnsresize.htm
-->

## Column types

To facilitate configuration of the columns, some column types are predefined.
By default, columns are assumed to hold strings, so the default column string type will be applied. As a result, column sorting will use the string comparator, and the column content will be aligned to the left side of the cell.

The following are the native column types:

- `'string'` (default)
- `'number'`
- `'date'`
- `'dateTime'`

To apply a column type, you need to define the type property in your column definition.

{{"demo": "pages/components/data-grid/columns/ColumnTypesGrid.js", "bg": "inline"}}

## Custom column types

You can extend the native column types with your own by simply spreading the necessary properties.

The demo below defines a new column type: `usdPrice` that extends the native `number` column type.

```jsx
const usdPrice: ColTypeDef = {
  type: 'number',
  width: 130,
  valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
  cellClassName: 'font-tabular-nums',
};
```

{{"demo": "pages/components/data-grid/columns/CustomColumnTypesGrid.js", "bg": "inline"}}

## Column menu

By default, each column header displays a column menu. The column menu allows actions to be performed in the context of the target column, e.g. filtering. To disable the column menu, set the prop `disableColumnMenu={true}`.

{{"demo": "pages/components/data-grid/columns/ColumnMenuGrid.js", "bg": "inline"}}

## Column selector

To enable the column selector in the toolbar you need to add the `showToolbar` prop to the data grid.

In addition, the column selector can be shown by using the "Show columns" menu item in the column menu.

The user can choose which columns are visible using the column selector from the toolbar.

To disable the column selector, set the prop `disableColumnSelector={true}`.

{{"demo": "pages/components/data-grid/columns/ColumnSelectorGrid.js", "bg": "inline"}}

## Column reorder [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-x/)

By default, `XGrid` allows all column reordering by dragging the header cells and moving them left or right.

To disable column reordering, set the prop `disableColumnReorder={true}`.

In addition, column reordering emits the following events that can be imported:

- `COL_REORDER_START`: emitted when dragging of a header cell starts.
- `COL_REORDER_DRAG_ENTER`: emitted when the cursor enters another header cell while dragging.
- `COL_REORDER_DRAG_OVER`: emitted when dragging a header cell over another header cell.
- `COL_REORDER_DRAG_OVER_HEADER`: emitted when dragging a header cell over the `ColumnsHeader` component.
- `COL_REORDER_STOP`: emitted when dragging of a header cell stops.

{{"demo": "pages/components/data-grid/columns/ColumnOrderingGrid.js", "disableAd": true, "bg": "inline"}}

## 🚧 Column groups

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #195](https://github.com/mui-org/material-ui-x/issues/195) if you want to see it land faster.

Grouping columns allows you to have multiple levels of columns in your header and the ability, if needed, to 'open and close' column groups to show and hide additional columns.

## 🚧 Column pinning [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-x/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #193](https://github.com/mui-org/material-ui-x/issues/193) if you want to see it land faster.

Sticky (or frozen, locked, or pinned) columns are columns that are visible at all times while the user scrolls the grid horizontally.

## 🚧 Column spanning

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #192](https://github.com/mui-org/material-ui-x/issues/192) if you want to see it land faster.

Each cell takes up the width of one column.
Column spanning allows to change this default behavior.
It allows cells to span multiple columns.
This is very close to the "column spanning" in an HTML `<table>`.
