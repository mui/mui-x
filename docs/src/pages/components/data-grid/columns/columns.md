---
title: Data Grid - Columns
components: DataGrid, XGrid
---

# Data Grid - Columns

<p class="description">This section goes in details on the aspects of the columns you need to know.</p>

## Column definitions

Grid columns are definied with the `columns` prop.
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

{{"demo": "pages/components/data-grid/columns/BasicColumnsGrid.js"}}

By default, columns are ordered according to the order they are included in the `columns` array.

## Column headers

You can configure the headers with:

- `headerName`: The title of the column rendered in the column header cell.
- `description`: The description of the column rendered as tooltip if the column header name is not fully displayed.
- `hide`: Hide the column.

{{"demo": "pages/components/data-grid/columns/HeaderColumnsGrid.js"}}

For more advanced header configuration, go to the [rendering section](/components/data-grid/rendering/#header-cell).

## Column width

By default, the columns have a width of 100 pixels.
This is an arbitrary, easy to remember value.
To change the width of a column, use the `width` property available in `ColDef`.

{{"demo": "pages/components/data-grid/columns/ColumnWidthGrid.js"}}

## Column resizing <span role="img" title="Enterprise">⚡️</span>

By default, `XGrid` allows all columns to be resized by dragging the right portion of the column separator.

To prevent the resizing of a column, set `resizable: false` in the `ColDef`.
Alternatively, to disable all columns resize, set the prop `disableColumnResize={true}`.

{{"demo": "pages/components/data-grid/columns/ColumnSizingGrid.js"}}

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

{{"demo": "pages/components/data-grid/columns/ColumnTypesGrid.js"}}

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

{{"demo": "pages/components/data-grid/columns/CustomColumnTypesGrid.js"}}

## 🚧 Column groups

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #195](https://github.com/mui-org/material-ui-x/issues/195) if you want to see it land faster.

Grouping columns allows you to have multiple levels of columns in your header and the ability, if needed, to 'open and close' column groups to show and hide additional columns.

## 🚧 Column reorder <span role="img" title="Enterprise">⚡️</span>

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #194](https://github.com/mui-org/material-ui-x/issues/194) if you want to see it land faster.

Column reordering enables reordering the columns by dragging the header cells.

## 🚧 Sticky columns <span role="img" title="Enterprise">⚡️</span>

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
