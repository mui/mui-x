# Data Grid - Cells

<p class="description">Learn how to customize the rendered elements and values of a cell.</p>

## Customizing cells

The Data Grid provides several methods for customizing the rendered elements and values of a cell, including `renderCell()`, `valueGetter()`, and `valueFormatter()`.
This document describes the key differences and specific use cases for each.

### renderCell() function

The `renderCell()` function gives you the most flexibility by letting you render any element inside of a cell.
This is the only way to render a React component inside a cell, and also the only way to customize a cell's behavior—for example, by adding a click handler.

Though powerful, it's also expensive, so it should only be used as a last resort when there are no other means for implementing a specific use case.

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

See [Column definition—rendering cells](/x/react-data-grid/column-definition/#rendering-cells) for more details.

### valueGetter() function

The `valueGetter()` function allows you to derive the cell value from the row data.
It is the most performant way to customize the cell content.
It is also the only way to customize the cell value without changing the row data.
It should be used when you need to derive the cell value from the row data. Common use cases are:

- Transforming the value (for example convert a decimal value to a percentage value)
- Deriving the value from multiple fields (for example concatenating first name and last name)
- Deriving the value from a nested field (for example `user.address.city`)

This value is also used internally in the Grid to filter, sort, and render (if no `renderCell` or `valueFormatter` is provided).
You can learn more about it in [Column definition—value getter](/x/react-data-grid/column-definition/#value-getter).

### valueFormatter() function

The `valueFormatter()` function allows you to format the cell value.
It could be used to customize the cell value without changing the row data.
It should be used when you need to format the cell value.

A few common use cases are:

- Formatting a date to a custom display format
- Formatting a decimal value to percentage and show `%` sign
- Formatting a boolean value to `Yes` or `No`

It only impacts the rendering part and does not impact the internal calculations like filtering or sorting.
Learn more in [Column definition—value formatter](/x/react-data-grid/column-definition/#value-formatter).
