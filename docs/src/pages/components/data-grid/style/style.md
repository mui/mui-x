---
title: Data Grid - Styling
components: DataGrid, XGrid
---

# Data Grid - Styling

<p class="description">The grid css can be easily overwritten.</p>

## Styling column headers

The `GridColDef` type has properties to apply class names and custom CSS on the header.

- `headerClassName`: to apply class names into the column header.
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
interface GridRowParams {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The HTMLElement row element.
   */
  element?: HTMLElement | null;
  /**
   * A function that let you get data from other columns.
   * @param field
   */
  getValue: (field: string) => GridCellValue;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel;
  /**
   * All grid columns.
   */
  columns: any;
  /**
   * The row index of the row that the current cell belongs to.
   */
  rowIndex: number;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  api: any;
}
```

{{"demo": "pages/components/data-grid/style/StylingRowsGrid.js", "bg": "inline"}}

## Styling cells

The `GridColDef` type has properties to apply class names and custom CSS on the cells.

- `cellClassName`: to apply class names on every cell. It can also be a function.
- `align`: to align the content of the cells. It must be 'left' | 'right' | 'center'. (Note you must use `headerAlign` to align the content of the header.)

```tsx
const columns: GridColumns = [
  {
    field: 'name',
    cellClassName: 'super-app-theme--cell',
  },
  {
    field: 'score',
    type: 'number',
    cellClassName: (params: GridCellClassParams) =>
      clsx('super-app', {
        negative: (params.value as number) < 0,
        positive: (params.value as number) > 0,
      }),
  },
];
```

{{"demo": "pages/components/data-grid/style/StylingCellsGrid.js", "bg": "inline"}}

## Custom theme

The following demo leverages the CSS customization API to match the Ant Design specification.

{{"demo": "pages/components/data-grid/style/AntDesignGrid.js", "defaultCodeOpen": false}}
