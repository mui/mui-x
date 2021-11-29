---
title: Data Grid - Columns
---

# Data Grid - Columns

<p class="description">This section goes in details on the aspects of the columns you need to know.</p>

## Column definitions

Grid columns are defined with the `columns` prop.
`columns` expects an array of objects.
The columns should have this type: `GridColDef[]`.

`field` is the only required property since it's the column identifier. It's also used to match with `GridRowModel` values.

```ts
interface GridColDef {
  /**
   * The column identifier. It's used to match with [[GridRowModel]] values.
   */
  field: string;
  …
}
```

{{"demo": "pages/components/data-grid/columns/BasicColumnsGrid.js", "bg": "inline"}}

By default, columns are ordered according to the order they are included in the `columns` array.

> ⚠️ The `columns` prop should keep the same reference between two renders.
> The columns are designed to be definitions, to never change once the component is mounted.
> Otherwise, you take the risk of losing the column width state (if resized).
> You can create the array outside of the render function or memoize it.

### Headers

You can configure the headers with:

- `headerName`: The title of the column rendered in the column header cell.
- `description`: The description of the column rendered as tooltip if the column header name is not fully displayed.

{{"demo": "pages/components/data-grid/columns/HeaderColumnsGrid.js", "bg": "inline"}}

### Width

By default, the columns have a width of 100px.
This is an arbitrary, easy-to-remember value.
To change the width of a column, use the `width` property available in `GridColDef`.

{{"demo": "pages/components/data-grid/columns/ColumnWidthGrid.js", "bg": "inline"}}

### Minimum width

By default, the columns have a minimum width of 50px.
This is an arbitrary, easy-to-remember value.
To change the minimum width of a column, use the `minWidth` property available in `GridColDef`.

{{"demo": "pages/components/data-grid/columns/ColumnMinWidthGrid.js", "bg": "inline"}}

### Fluid width

Column fluidity or responsiveness can be by achieved by setting the `flex` property in `GridColDef`.

The `flex` property accepts a value between 0 and ∞.
It works by dividing the remaining space in the grid among all flex columns in proportion to their `flex` value.

For example, consider a grid with a total width of 500px that has three columns: the first with `width: 200`; the second with `flex: 1`; and third with `flex: 0.5`.
The first column will be 200px wide, leaving 300px remaining. The column with `flex: 1` is twice the size of `flex: 0.5`, which means that final sizes will be: 200px, 200px, 100px.

To set a minimum width for a `flex` column set the `minWidth` property in `GridColDef`.

**Note**

- `flex` doesn't work together with `width`. If you set both `flex` and `width` in `GridColDef`, `flex` will override `width`.
- `flex` doesn't work if the combined width of the columns that have `width` is more than the width of the grid itself. If that is the case a scroll bar will be visible, and the columns that have `flex` will default back to their base value of 100px.

{{"demo": "pages/components/data-grid/columns/ColumnFluidWidthGrid.js", "bg": "inline"}}

### Hiding

Set the column definition attribute `hide` to `true` to hide the column.

```tsx
<DataGrid columns={[{ field: 'id', hide: true }]} />
```

### Resizing [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

By default, `DataGridPro` allows all columns to be resized by dragging the right portion of the column separator.

To prevent the resizing of a column, set `resizable: false` in the `GridColDef`.
Alternatively, to disable all columns resize, set the prop `disableColumnResize={true}`.

To restrict resizing a column under a certain width set the `minWidth` property in `GridColDef`.

{{"demo": "pages/components/data-grid/columns/ColumnSizingGrid.js", "disableAd": true, "bg": "inline"}}

To capture changes in the width of a column there are two callbacks that are called:

- `onColumnResize`: Called while a column is being resized.
- `onColumnWidthChange`: Called after the width of a column is changed, but not during resizing.

### Value getter

Sometimes a column might not have a corresponding value, or you might want to render a combination of different fields.

To achieve that, set the `valueGetter` attribute of `GridColDef` as in the example below.

```tsx
function getFullName(params) {
  return `${params.getValue(params.id, 'firstName') || ''} ${
    params.getValue(params.id, 'lastName') || ''
  }`;
}

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    valueGetter: getFullName,
  },
];
```

{{"demo": "pages/components/data-grid/columns/ValueGetterGrid.js", "bg": "inline"}}

The value generated is used for filtering, sorting, rendering, etc. unless overridden by a more specific configuration.

### Value setter

The value setter is to be used when editing rows and it is the counterpart of the value getter.
It allows to customize how the entered value is stored in the row.
A common use case for it is when the data is a nested structure.
Refer to the [cell editing](/components/data-grid/editing/#saving-nested-structures) documentation to see an example using it.

```tsx
function setFullName(params: GridValueSetterParams) {
  const [firstName, lastName] = params.value!.toString().split(' ');
  return { ...params.row, firstName, lastName };
}

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    valueSetter: setFullName,
  },
];
```

### Value formatter

The value formatter allows you to convert the value before displaying it.
Common use cases include converting a JavaScript `Date` object to a date string or a `Number` into a formatted number (e.g. "1,000.50").

In the following demo, a formatter is used to display the tax rate's decimal value (e.g. 0.2) as a percentage (e.g. 20%).

{{"demo": "pages/components/data-grid/columns/ValueFormatterGrid.js", "bg": "inline"}}

The value generated is only used for rendering purposes.
Filtering and sorting will not relay on the formatted value.
Use the [`valueParser`](/components/data-grid/columns/#value-parser) to support filtering.

### Value parser

The value parser allows you to convert the user-entered value to another one used for filtering or editing.
Common use cases include parsing date strings to JavaScript `Date` objects or formatted numbers (e.g. "1,000.50") into `Number`.
It can be understood as the inverse of [`valueFormatter`](/components/data-grid/columns/#value-formatter).

In the following demo, the tax rate is displayed as a percentage (e.g. 20%) but a decimal number is used as value (e.g. 0.2).

{{"demo": "pages/components/data-grid/columns/ValueParserGrid.js", "bg": "inline"}}

### Render cell

By default, the grid render the value as a string in the cell.
It resolves the rendered output in the following order:

1. `renderCell() => ReactElement`
2. `valueFormatter() => string`
3. `valueGetter() => string`
4. `row[field]`

The `renderCell` method of the column definitions is similar to `valueFormatter`.
However, it trades to be able to only render in a cell in exchange for allowing to return a React node (instead of a string).

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    renderCell: (params: GridRenderCellParams<Date>) => (
      <strong>
        {params.value.getFullYear()}
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
        >
          Open
        </Button>
      </strong>
    ),
  },
];
```

{{"demo": "pages/components/data-grid/columns/RenderCellGrid.js", "bg": "inline"}}

**Note**: It is recommended to also set a `valueFormatter` providing a representation for the value to be used when [exporting](/components/data-grid/export/#export-custom-rendered-cells) the data.

#### Render edit cell

The `renderCell` render function allows customizing the rendered in "view mode" only.
For the "edit mode", set the `renderEditCell` function to customize the edit component.
Check the [editing page](/components/data-grid/editing) for more details about editing.

#### Expand cell renderer

By default, the grid cuts the content of a cell and renders an ellipsis if the content of the cell does not fit in the cell.
As a workaround, you can create a cell renderer that will allow seeing the full content of the cell in the grid.

{{"demo": "pages/components/data-grid/columns/RenderExpandCellGrid.js", "bg": "inline"}}

### Render header

You can customize the look of each header with the `renderHeader` method.
It takes precedence over the `headerName` property.

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    width: 150,
    type: 'date',
    renderHeader: (params: GridColumnHeaderParams) => (
      <strong>
        {'Birthday '}
        <span role="img" aria-label="enjoy">
          🎂
        </span>
      </strong>
    ),
  },
];
```

{{"demo": "pages/components/data-grid/columns/RenderHeaderGrid.js", "bg": "inline"}}

### Styling header

You can check the [styling header](/components/data-grid/style/#styling-column-headers) section for more information.

### Styling cells

You can check the [styling cells](/components/data-grid/style/#styling-cells) section for more information.

## Column types

To facilitate configuration of the columns, some column types are predefined.
By default, columns are assumed to hold strings, so the default column string type will be applied. As a result, column sorting will use the string comparator, and the column content will be aligned to the left side of the cell.

The following are the native column types:

- `'string'` (default)
- `'number'`
- `'date'`
- `'dateTime'`
- `'boolean'`
- `'singleSelect'`
- `'actions'`

### Converting types

Default methods, such as filtering and sorting, assume that the type of the values will match the type of the column specified in `type` (e.g. the values of a `number` column will be numbers).
For example, values of column with `type: 'dateTime'` are expecting to be stored as a `Date()` objects.
If for any reason, your data type is not the correct one, you can use `valueGetter` to parse the value to the correct type.

```tsx
{
  field: 'lastLogin',
  type: 'dateTime',
  valueGetter: ({ value }) => value && new Date(value),
}
```

### Special properties

To use most of the column types, you only need to define the `type` property in your column definition.
However, some types require additional properties to be set to make them work correctly:

- If the column type is `'singleSelect'`, you also need to set the `valueOptions` property in the respective column definition. These values are options used for filtering and editing.

  ```tsx
  {
    field: 'country',
    type: 'singleSelect',
    valueOptions: ['United Kingdom', 'Spain', 'Brazil']
  }
  ```

- If the column type is `'actions'`, you need to provide a `getActions` function that returns an array of actions available for each row (React elements).
  You can add the `showInMenu` prop on the returned React elements to signal the data grid to group these actions inside a row menu.

  ```tsx
  {
    field: 'actions',
    type: 'actions',
    getActions: (params: GridRowParams) => [
      <GridActionsCellItem icon={...} onClick={...} label="Delete" />,
      <GridActionsCellItem icon={...} onClick={...} label="Print" showInMenu />,
    ]
  }
  ```

{{"demo": "pages/components/data-grid/columns/ColumnTypesGrid.js", "bg": "inline"}}

## Custom column types

You can extend the native column types with your own by simply spreading the necessary properties.

The demo below defines a new column type: `usdPrice` that extends the native `number` column type.

```jsx
const usdPrice: GridColTypeDef = {
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

To enable the the toolbar you need to add `Toolbar: GridToolbar` to the grid `components` prop.

In addition, the column selector can be shown by using the "Show columns" menu item in the column menu.

The user can choose which columns are visible using the column selector from the toolbar.

To disable the column selector, set the prop `disableColumnSelector={true}`.

{{"demo": "pages/components/data-grid/columns/ColumnSelectorGrid.js", "bg": "inline"}}

## Column reorder [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

By default, `DataGridPro` allows all column reordering by dragging the header cells and moving them left or right.

{{"demo": "pages/components/data-grid/columns/ColumnOrderingGrid.js", "disableAd": true, "bg": "inline"}}

To disable reordering on all columns, set the prop `disableColumnReorder={true}`.

To disable reordering in a specific column, set the `disableReorder` property to true in the `GridColDef` of the respective column.

{{"demo": "pages/components/data-grid/columns/ColumnOrderingDisabledGrid.js", "disableAd": true, "bg": "inline"}}

In addition, column reordering emits the following events that can be imported:

- `columnHeaderDragStart`: emitted when dragging of a header cell starts.
- `columnHeaderDragEnter`: emitted when the cursor enters another header cell while dragging.
- `columnHeaderDragOver`: emitted when dragging a header cell over another header cell.
- `columnHeaderDragEnd`: emitted when dragging of a header cell stops.

## 🚧 Column groups

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #195](https://github.com/mui-org/material-ui-x/issues/195) if you want to see it land faster.

Grouping columns allows you to have multiple levels of columns in your header and the ability, if needed, to 'open and close' column groups to show and hide additional columns.

## 🚧 Column pinning [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #193](https://github.com/mui-org/material-ui-x/issues/193) if you want to see it land faster.

Pinned (or frozen, locked, or sticky) columns are columns that are visible at all times while the user scrolls the grid horizontally.

## 🚧 Column spanning

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #192](https://github.com/mui-org/material-ui-x/issues/192) if you want to see it land faster.

Each cell takes up the width of one column.
Column spanning allows to change this default behavior.
It allows cells to span multiple columns.
This is very close to the "column spanning" in an HTML `<table>`.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
