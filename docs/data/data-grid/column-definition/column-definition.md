# Data Grid - Column definition

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

By default, the data grid uses the field of a column to get its value.
For instance, the column with field `name` will render the value stored in `row.name`.
But for some columns, it can be useful to manually get and format the value to render.

### Value getter

Sometimes a column might not have a desired value.
You can use the `valueGetter` attribute of `GridColDef` to:

1. Transform the value

   ```tsx
   const columns: GridColDef[] = [
     {
       field: 'taxRate',
       valueGetter: (params) => {
         if (!params.value) {
           return params.value;
         }
         // Convert the decimal value to a percentage
         return params.value * 100;
       },
     },
   ];
   ```

2. Render a combination of different fields

   ```tsx
   const columns: GridColDef[] = [
     {
       field: 'fullName',
       valueGetter: (params) => {
         return `${params.row.firstName || ''} ${params.row.lastName || ''}`;
       },
     },
   ];
   ```

3. Derive a value from a complex value

   ```tsx
   const columns: GridColDef[] = [
     {
       field: 'profit',
       valueGetter: ({ row }) => {
         if (!row.gross || !row.costs) {
           return null;
         }
         return row.gross - row.costs;
       },
     },
   ];
   ```

The value returned by `valueGetter` is used for:

- Filtering
- Sorting
- Rendering (unless enhanced further by [`valueFormatter`](/x/react-data-grid/column-definition/#value-formatter) or [`renderCell`](/x/react-data-grid/column-definition/#rendering-cells))

{{"demo": "ValueGetterGrid.js", "bg": "inline", "defaultCodeOpen": false}}

### Value formatter

The value formatter allows you to convert the value before displaying it.
Common use cases include converting a JavaScript `Date` object to a date string or a `Number` into a formatted number (e.g. "1,000.50").

Note, that the value returned by `valueFormatter` is only used for rendering purposes.
Filtering and sorting are based on the raw value (`row[field]`) or the value returned by [`valueGetter`](/x/react-data-grid/column-definition/#value-getter).

In the following demo, `valueGetter` is used to convert the tax rate (e.g. `0.2`) to a decimal value (e.g. `20`),
and `valueFormatter` is used to display it as a percentage (e.g. `20%`).

{{"demo": "ValueFormatterGrid.js", "bg": "inline"}}

## Rendering cells

By default, the data grid renders the value as a string in the cell.
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

### Using hooks inside a renderer

The `renderCell` property is a function that returns a React node, not a React component.

If you want to use React hooks inside your renderer, you should wrap them inside a component.

```tsx
// ❌ Not valid
const column = {
  // ...other properties,
  renderCell: () => {
    const [count, setCount] = React.useState(0);

    return (
      <Button onClick={() => setCount((prev) => prev + 1)}>{count} click(s)</Button>
    );
  },
};

// ✅ Valid
const CountButton = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Button onClick={() => setCount((prev) => prev + 1)}>{count} click(s)</Button>
  );
};

const column = {
  // ...other properties,
  renderCell: () => <CountButton />,
};
```

:::warning
Because of pagination and virtualization, cells can be unmounted when scrolling or switching pages.
The internal state of the component returned by renderCell will be lost.

If you want the cell information to persist, you should save it either in the data grid state or in the data grid parent.
:::

### Expand cell renderer

By default, the data grid cuts the content of a cell and renders an ellipsis if the content of the cell does not fit in the cell.
As a workaround, you can create a cell renderer that will allow seeing the full content of the cell in the data grid.

{{"demo": "RenderExpandCellGrid.js", "bg": "inline"}}

:::warning
Because of pagination and virtualization, cells can be unmounted when scrolling or switching pages.
The internal state of the component returned by `renderCell` will be lost.

If you want to persist cell information, you should save it either in the data grid parent or in the row model.
Updating the row will rerender the row and so call renderCell with updated params.
:::

## Column types

To facilitate the configuration of the columns, some column types are predefined.
By default, columns are assumed to hold strings, so the default column string type will be applied. As a result, column sorting will use the string comparator, and the column content will be aligned to the left side of the cell. Some column types require that their value have a specific type.

The following are the native column types with their required value types:

| Column type          | Value type                 |
| :------------------- | :------------------------- |
| `'string'` (default) | `string`                   |
| `'number'`           | `number`                   |
| `'date'`             | `Date() object`            |
| `'dateTime'`         | `Date() object`            |
| `'boolean'`          | `boolean`                  |
| `'singleSelect'`     | A value in `.valueOptions` |
| `'actions'`          | Not applicable             |

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
  When using objects values for `valueOptions` you need to provide the `value` and `label` attributes for each option.
  However, you can customize which attribute is used as value and label by using `getOptionValue` and `getOptionLabel`, respectively.

  ```tsx
  // Without getOptionValue and getOptionLabel
  {
    valueOptions: [
      { value: 'BR', label: 'Brazil' },
      { value: 'FR', label: 'France' }
    ]
  }

  // With getOptionValue and getOptionLabel
  {
    getOptionValue: (value: any) => value.code,
    getOptionLabel: (value: any) => value.name,
    valueOptions: [
      { code: 'BR', name: 'Brazil' },
      { code: 'FR', name: 'France' }
    ]
  }
  ```

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

## Selectors

### Visible columns

Those selectors do not take into account hidden columns.

{{"component": "modules/components/SelectorsDocs.js", "category": "Visible Columns"}}

### Defined columns

Those selectors consider all the defined columns, including hidden ones.

{{"component": "modules/components/SelectorsDocs.js", "category": "Columns"}}

More information about the selectors and how to use them on the [dedicated page](/x/react-data-grid/state/#access-the-state).

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
