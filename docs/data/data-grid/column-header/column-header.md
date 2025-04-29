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

## Header height

By default, column headers have a height of 56 pixels. This matches the height from the [Material Design guidelines](https://m2.material.io/components/data-tables).

The `columnHeaderHeight` prop can be used to override the default value.

{{"demo": "HeaderHeight.js", "bg": "inline"}}

## Styling header

You can check the [styling header](/x/react-data-grid/style/#styling-column-headers) section for more information.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
