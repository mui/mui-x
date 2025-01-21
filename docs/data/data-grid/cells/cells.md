# Data Grid - Cells

<p class="description">Learn how to customize the rendered elements and values of a cell.</p>

## Customizing cells

The Data Grid provides several methods for customizing the rendered elements and values of a cell, including `renderCell()`, `valueGetter()`, and `valueFormatter()`.
This document describes the key differences and specific use cases for each.

### renderCell()

Use the `renderCell()` function to render any element inside of a cell.
This is the only way to render a React component inside a cell, and also the only way to customize a cell's behavior—for example, by adding a click handler.

Though powerful, it's also expensive in terms of performance, so it should only be used as a last resort when there are no other means for implementing a specific use case.

Here's an example of a cell that uses `renderCell()` to render a button:

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    renderCell: (params: GridRenderCellParams<any, Date>) => (
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

See [Column definition—Rendering cells](/x/react-data-grid/column-definition/#rendering-cells) for more details.

### valueGetter()

Use the `valueGetter()` function to derive a cell's value from the row data.
This is the the most performant way to customize the contents of a cell, and it does so without altering the row data itself.

Common use cases include:

- Transforming a value (for example, converting a decimal value to a percentage value)
- Deriving a value from multiple fields (for example, concatenating first name and last name)
- Deriving a value from a nested field (for example, `user.address.city`)

This function is also used internally in the Data Grid to filter, sort, and render (if `renderCell()` or `valueFormatter()` are not provided).

See [Column definition—Value getter](/x/react-data-grid/column-definition/#value-getter) for more details.

### valueFormatter()

Use the `valueFormatter()` function to format a cell's value (without changing the underlying row data).

Common use cases include:

- Formatting a date to a custom display format
- Formatting a decimal value to a percentage and appending a `%` sign
- Formatting a boolean value to `Yes` or `No`

Unlike `valueGetter()`, this function only impacts rendering—_not_ internal calculations like filtering or sorting.

See [Column definition—value formatter](/x/react-data-grid/column-definition/#value-formatter) for more details.
