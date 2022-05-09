---
title: Data Grid - Column header
---

# Data Grid - Column header

<p class="description">Customize your columns header.</p>

You can configure the headers with:

- `headerName`: The title of the column rendered in the column header cell.
- `description`: The description of the column rendered as tooltip if the column header name is not fully displayed.

{{"demo": "HeaderColumnsGrid.js", "bg": "inline"}}

## Custom header renderer

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

{{"demo": "RenderHeaderGrid.js", "bg": "inline"}}

## Styling header

You can check the [styling header](/x/react-data-grid/style/#styling-column-headers) section for more information.

## Column menu

By default, each column header displays a column menu. The column menu allows actions to be performed in the context of the target column, e.g. filtering. To disable the column menu, set the prop `disableColumnMenu={true}`.

{{"demo": "ColumnMenuGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
