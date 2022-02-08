---
title: Data Grid - Styling
---

# Data Grid - Styling

<p class="description">The grid CSS can be easily overwritten.</p>

## Using the `sx` prop

For one-off styles, the `sx` prop can be used.
It allows to apply simple to complex customizations directly onto the `DataGrid` element.
The keys accepted can be any CSS property as well as the custom properties provided by MUI.
For more details, visit the [`sx` prop page](/system/the-sx-prop/).

```tsx
<DataGrid sx={{ m: 2 }} /> // Sets the margin to 2 times the spacing unit = 16px
```

{{"demo": "pages/components/data-grid/style/SxProp.js", "bg": "inline"}}

## Styling column headers

The `GridColDef` type has properties to apply class names and custom CSS on the header.

- `headerClassName`: to apply class names into the column header. It can also be a function, which is called with a `GridColumnHeaderParams` object.
- `headerAlign`: to align the content of the header. It must be 'left' | 'right' | 'center'.

```tsx
const columns: GridColumns = [
  {
    field: 'first',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
  },
  {
    field: 'last',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
  },
];
```

{{"demo": "pages/components/data-grid/style/StylingHeaderGrid.js", "bg": "inline"}}

## Styling rows

The `getRowClassName` prop can be used to apply a custom CSS class on each row. It's called with a `GridRowParams` object and must return a string.

```tsx
interface GridRowParams<R extends GridRowModel = GridRowModel> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: R;
  /**
   * All grid columns.
   */
  columns: GridColumns;
  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {GridCellValue} The cell value.
   */
  getValue: (id: GridRowId, field: string) => GridCellValue;
}
```

{{"demo": "pages/components/data-grid/style/StylingRowsGrid.js", "bg": "inline"}}

## Styling cells

There are multiple ways to apply a custom CSS class on a cell.

1. Using the`cellClassName` property of `GridColDef`:

This property allows to set a CSS class that is applied on every cell of the column it was defined.
It can also be a function, which is called with a `GridCellParams` object.

```tsx
const columns: GridColumns = [
  {
    field: 'name',
    cellClassName: 'super-app-theme--cell',
  },
  {
    field: 'score',
    type: 'number',
    cellClassName: (params: GridCellParams<number>) =>
      clsx('super-app', {
        negative: params.value < 0,
        positive: params.value > 0,
      }),
  },
];
```

{{"demo": "pages/components/data-grid/style/StylingCellsGrid.js", "bg": "inline", "defaultCodeOpen": false}}

2. Using the `getCellClassName` prop:

This prop is called for every cell in every column.
Different from the first option, this prop is defined at the grid level, not column level.
It is also called with a `GridCellParams` object.

{{"demo": "pages/components/data-grid/style/StylingAllCells.js", "bg": "inline"}}

## Cell alignment

Use the `align` property in `GridColDef` to change the alignment of content of the cells.
Choose between one of the following values: 'left' | 'right' | 'center'.

**Note**: You must use `headerAlign` to align the content of the header.

## Custom theme

The following demo leverages the CSS customization API to match the Ant Design specification.

{{"demo": "pages/components/data-grid/style/AntDesignGrid.js", "defaultCodeOpen": false}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
