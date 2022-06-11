---
title: Data Grid - Column definition
---

# Data grid - Column definition

<p class="description">Define your columns.</p>

The columns are defined with the `columns` prop which has the type `GridColDef[]`.

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

{{"demo": "BasicColumnsGrid.js", "bg": "inline"}}

:::warning
The `columns` prop should keep the same reference between two renders.
The columns are designed to be definitions, to never change once the component is mounted.
Otherwise, you take the risk of losing elements like column width or order.
You can create the array outside the render function or memoize it.
:::

## Providing content

By default, the grid uses the field of a column to get its value.
For instance, the column with field `name` will render the value stored in `row.name`.
But for some columns, it can be useful to manually get and format the value to render.

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

### Value formatter

The value formatter allows you to convert the value before displaying it.
Common use cases include converting a JavaScript `Date` object to a date string or a `Number` into a formatted number (e.g. "1,000.50").

In the following demo, a formatter is used to display the tax rate's decimal value (e.g. 0.2) as a percentage (e.g. 20%).

{{"demo": "ValueFormatterGrid.js", "bg": "inline"}}

The value generated is only used for rendering purposes.
Filtering and sorting do not rely on the formatted value.
Use the [`valueParser`](/x/react-data-grid/cells/#value-parser) to support filtering.

## Rendering cells

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
          tabIndex={params.hasFocus ? 0 : -1}
        >
          Open
        </Button>
      </strong>
    ),
  },
];
```

{{"demo": "RenderCellGrid.js", "bg": "inline", "defaultCodeOpen": false }}

:::warning
Using `renderCell`, requires paying attention to the following points.
If the type of the value returned by `valueGetter` does not correspond to the column's `type`, you should:

- handle [sorting](/x/react-data-grid/sorting/#custom-comparator) by providing `sortComparator` to the column.
- set a `valueFormatter` providing a representation for the value to be used when [exporting](/x/react-data-grid/export/#exported-cells) the data.

:::

### Styling cells

You can check the [styling cells](/x/react-data-grid/style/#styling-cells) section for more information.

### Making accessible cells

Cell content should not be in the tab sequence except if cell is focused.
You can check the [tab sequence](/x/react-data-grid/accessibility/#tab-sequence) section for more information.

### Expand cell renderer

By default, the grid cuts the content of a cell and renders an ellipsis if the content of the cell does not fit in the cell.
As a workaround, you can create a cell renderer that will allow seeing the full content of the cell in the grid.

{{"demo": "RenderExpandCellGrid.js", "bg": "inline"}}

## Column types

To facilitate the configuration of the columns, some column types are predefined.
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

Default methods, such as filtering and sorting, assume that the type of the values will match the type of the column specified in `type`.
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

  :::warning
  When using objects values for `valueOptions` you need to provide `value` and `label` fields for each option: `{ value: string, label: string }`
  :::

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

{{"demo": "ColumnTypesGrid.js", "bg": "inline"}}

## Custom column types

You can extend the native column types with your own by simply spreading the necessary properties.

The demo below defines a new column type: `usdPrice` that extends the native `number` column type.

```ts
const usdPrice: GridColTypeDef = {
  type: 'number',
  width: 130,
  valueFormatter: ({ value }) => valueFormatter.format(Number(value)),
  cellClassName: 'font-tabular-nums',
};
```

{{"demo": "CustomColumnTypesGrid.js", "bg": "inline"}}

:::info
If an unsupported column type is used, the `string` column type will be used instead.
:::

## Selectors [<span class="plan-pro"></span>](https://mui.com/store/items/mui-x-pro/)

### Visible columns

Those selectors do not take into account hidden columns.

{{"demo": "VisibleColumnsSelectorsNoSnap.js", "bg": "inline", "hideToolbar": true}}

### Defined columns

Those selectors consider all the defined columns, including hidden ones.

{{"demo": "ColumnsSelectorsNoSnap.js", "bg": "inline", "hideToolbar": true}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state).

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
