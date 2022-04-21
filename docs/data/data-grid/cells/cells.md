---
title: Data Grid - Cells
---

# Data Grid - Cells

<p class="description">Define how your cell content is accessed, renderer and updated.</p>

## Cell content

### Value getter

Sometimes a column might not have a corresponding value, or you might want to render a combination of different fields.

To achieve that, set the `valueGetter` attribute of `GridColDef` as in the example below.

```tsx
function getFullName(params) {
  return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
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

{{"demo": "ValueGetterGrid.js", "bg": "inline"}}

The value generated is used for filtering, sorting, rendering, etc. unless overridden by a more specific configuration.

### Value setter

The value setter is to be used when editing rows and it is the counterpart of the value getter.
This enables you to customize how the entered value is stored in the row.
A common use case for it is when the data is a nested structure.
Refer to the [cell editing](/x/react-data-grid/editing/#saving-nested-structures) documentation to see an example using it.

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

{{"demo": "ValueFormatterGrid.js", "bg": "inline"}}

The value generated is only used for rendering purposes.
Filtering and sorting do not rely on the formatted value.
Use the [`valueParser`](/x/react-data-grid/cells/#value-parser) to support filtering.

### Value parser

The value parser allows you to convert the user-entered value to another one used for filtering or editing.
Common use cases include parsing date strings to JavaScript `Date` objects or formatted numbers (e.g. "1,000.50") into `Number`.
It can be understood as the inverse of [`valueFormatter`](/x/react-data-grid/cells/#value-formatter).

In the following demo, the tax rate is displayed as a percentage (e.g. 20%) but a decimal number is used as value (e.g. 0.2).

{{"demo": "ValueParserGrid.js", "bg": "inline"}}

## Cell renderers

### Render cell

By default, the grid renders the value as a string in the cell.
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

{{"demo": "RenderCellGrid.js", "bg": "inline"}}

**Note**: It is recommended to also set a `valueFormatter` providing a representation for the value to be used when [exporting](/x/react-data-grid/export/#exported-cells) the data.

> ⚠️ When using `renderCell` with object cell values
> remember to handle [sorting](/x/react-data-grid/sorting/#custom-comparator).
> Otherwise, sorting won't work.

### Render edit cell

The `renderCell` render function allows customizing the rendered in "view mode" only.
For the "edit mode", set the `renderEditCell` function to customize the edit component.
Check the [editing page](/x/react-data-grid/editing/) for more details about editing.

### Expand cell renderer

By default, the grid cuts the content of a cell and renders an ellipsis if the content of the cell does not fit in the cell.
As a workaround, you can create a cell renderer that will allow seeing the full content of the cell in the grid.

{{"demo": "RenderExpandCellGrid.js", "bg": "inline"}}

## Styling cells

You can check the [styling cells](/x/react-data-grid/style/#styling-cells) section for more information.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
