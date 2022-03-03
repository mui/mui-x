---
title: Data Grid - Export
---

# Data Grid - Export

<p class="description">Easily export the rows in various file formats such as CSV, Excel, or PDF.</p>

## Enabling export

### Default Toolbar

To enable the export menu, pass the `GridToolbar` component in the `Toolbar` [component slot](/components/data-grid/components/#toolbar).

{{"demo": "ExportDefaultToolbar.js", "bg": "inline"}}

### Custom Toolbar

The export menu is provided in a stand-alone component named `GridToolbarExport`. You can use it in a custom toolbar component as follows.

```jsx
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}
```

{{"demo": "ExportCustomToolbar.js", "bg": "inline", "defaultCodeOpen": false}}

## Export options

By default, the export menu displays all the available export formats, according to your license, which are

- [Print](#print-export)
- [CSV](#csv-export)
- [Excel](#excel-export) [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/) (🚧 Not delivered yet)
- [Clipboard](#clipboard) [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/) (🚧 Not delivered yet)

You can customize their respective behavior by passing an options object either to the `GridToolbar` or to the `GridToolbarExport` as a prop.

```tsx
<DataGrid componentsProps={{ toolbar: { csvOptions } }} />
// same as
<GridToolbarExport csvOptions={csvOptions} />
```

Each export option has its own API page:

- [`csvOptions`](/api/data-grid/grid-csv-export-options/)
- [`printOptions`](/api/data-grid/grid-print-export-options/)

## Disabled format

You can remove an export format from the toolbar by setting its option property `disableToolbarButton` to `true`.
In the following example, the print export is disabled.

```jsx
<DataGrid
  componentsProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
/>
```

{{"demo": "RemovePrintExport.js", "bg": "inline", "defaultCodeOpen": false}}

## Exported columns

By default, the export will only contain the visible columns of the grid.
There are a few ways to include or hide other columns.

- Set the exact columns to be exported in the export option

```jsx
<DataGrid
  componentsProps={{ toolbar: { csvOptions: { fields: ['name', 'brand'] } } }}
/>
```

- Set `allColumns` in export option to `true` to also include hidden columns.

```jsx
<DataGrid componentsProps={{ toolbar: { csvOptions: { allColumns: true } } }} />
```

- Set the `disableExport` attribute to `true` in each `GridColDef`.

```jsx
<DataGrid columns={[{ field: 'name', disableExport: true }, { field: 'brand' }]} />
```

## Exported rows

> ⚠️ This section only applies to the CSV and the Excel export.
> The print export always prints rows in their current state.

By default, the grid exports the selected rows if there are any.
If not, it exports all rows (filtered and sorted rows, according to active rules), including the collapsed ones.

Alternatively, you can set the `getRowsToExport` function and export any rows you want, as in the following example.
The grid exports a few [selectors](/components/data-grid/state/#access-the-state) that can help you get the rows for the most common use-cases:

| Selector                                       | Behavior                                                                                                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gridRowIdsSelector`                           | The rows in their original order.                                                                                                                                                                                          |
| `gridSortedRowIdsSelector`                     | The rows after applying the sorting rules.                                                                                                                                                                                 |
| `gridFilteredSortedRowIdsSelector`             | The rows after applying the sorting rules, and the filtering rules.                                                                                                                                                        |
| `gridVisibleSortedRowIdsSelector`              | The rows after applying the sorting rules, the filtering rules, and without the collapsed rows.                                                                                                                            |
| `gridPaginatedVisibleSortedGridRowIdsSelector` | The rows after applying the sorting rules, the filtering rules, without the collapsed rows and only for the current page (**Note**: If the pagination is disabled, it will still take the value of `page` and `pageSize`). |

{{"demo": "CsvGetRowsToExport.js", "bg": "inline", "defaultCodeOpen": false}}
When using [Row grouping](/components/data-grid/group-pivot/#row-grouping), it can be useful to remove the groups from the CSV export

{{"demo": "CsvGetRowsToExportRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

## CSV export

### Exported cells

When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.
You can provide a [`valueFormatter`](/components/data-grid/columns/#value-formatter) with a string representation to be used.

```jsx
<DataGrid
  columns={[
    {
      field: 'progress',
      valueFormatter: ({ value }) => `${value * 100}%`,
      renderCell: ({ value }) => <ProgressBar value={value} />,
    },
  ]}
/>
```

### File encoding

You can use `csvOptions` to specify the format of the export, such as the `delimiter` character used to separate fields, the `fileName`, or `utf8WithBom` to prefix the exported file with UTF-8 Byte Order Mark (BOM).
For more details on these options, please visit the [`csvOptions` api page](/api/data-grid/grid-csv-export-options/).

```jsx
<GridToolbarExport
  csvOptions={{
    fileName: 'customerDataBase',
    delimiter: ';',
    utf8WithBom: true,
  }}
/>
```

## Print export

### Customize grid display

By default, the print export display all the DataGrid. It is possible to remove the footer and the toolbar by setting respectively `hideFooter` and `hideToolbar` to `true`.

```jsx
<GridToolbarExport
  printOptions={{
    hideFooter: true,
    hideToolbar: true,
  }}
/>
```

For more option to customize the print export, please visit the [`printOptions` api page](/api/data-grid/grid-print-export-options/).

## Custom export format

You can add custom export formats by creating your own export menu.
To simplify its creation, we export `<GridToolbarExportContainer />` which contains the menu logic.
The default `<GridToolbarExport />` is defined as follow:

```jsx
const GridToolbarExport = ({ csvOptions, printOptions, ...other }) => (
  <GridToolbarExportContainer {...other}>
    <GridCsvExportMenuItem options={csvOptions} />
    <GridPrintExportMenuItem options={printOptions} />
  </GridToolbarExportContainer>
);
```

Each child of the `<GridToolbarExportContainer />` receives a prop `hideMenu` to close the export menu after the export.
The demo below shows how to add a JSON export.

{{"demo": "CustomExport.js", "bg": "inline", "defaultCodeOpen": false}}

## 🚧 Excel export [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #198](https://github.com/mui/material-ui-x/issues/198) if you want to see it land faster.
> You will be able to export the displayed data to Excel with an API call, or using the grid UI.

## 🚧 Clipboard [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #199](https://github.com/mui/material-ui-x/issues/199) if you want to see it land faster.
> You will be able to copy and paste items to and from the grid using the system clipboard.

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

### CSV

{{"demo": "CsvExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

### Print

{{"demo": "PrintExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [csvOptions](/api/data-grid/grid-csv-export-options/)
- [printOptions](/api/data-grid/grid-print-export-options/)
- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
