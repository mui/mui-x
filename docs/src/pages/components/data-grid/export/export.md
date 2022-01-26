---
title: Data Grid - Export
---

# Data Grid - Export

<p class="description">Easily export the rows in various file formats such as CSV, Excel, or PDF.</p>

## CSV export

The easiest way to enable the CSV export is to pass the `GridToolbar` component in the `Toolbar` [component slot](/components/data-grid/components/#toolbar).

{{"demo": "pages/components/data-grid/export/ExportDefaultToolbar.js", "bg": "inline"}}

### Custom toolbar

To enable the CSV export in a custom toolbar, use the `GridToolbarExport` component.

{{"demo": "pages/components/data-grid/export/ExportCustomToolbar.js", "bg": "inline"}}

### Custom exported content

The csv export can be customized by passing a [`csvOptions`](/api/data-grid/grid-csv-export-options/) object either to the `GridToolbar` or to the `GridToolbarExport` as a prop.

The following sections describes some customizations available on this interface.

```tsx
<DataGrid componentsProps={{ toolbar: { csvOptions } }} />

// same as

<GridToolbarExport csvOptions={csvOptions} />
```

#### Exported columns

By default, the CSV will only contain the visible columns of the grid.
There are a few ways to include or hide other columns:

1. Set the exact columns to be exported in [`csvOptions`](/api/data-grid/grid-csv-export-options/).

```jsx
<DataGrid
  componentsProps={{ toolbar: { csvOptions: { fields: ['id', 'name'] } } }}
/>
```

2. Set `allColumns` in [`csvOptions`](/api/data-grid/grid-csv-export-options/) to `true` to include hidden columns, instead of only the visible ones.

```jsx
<DataGrid componentsProps={{ toolbar: { csvOptions: { allColumns: true } } }} />
```

3. Set the `disableExport` attribute to `true` in each `GridColDef`.

```jsx
<DataGrid columns={[{ field: 'id', disableExport: true }, { field: 'brand' }]} />
```

#### Exported rows

By default, if some rows are selected, the `DataGrid` exports only those.
If there's no selection, it exports all rows (filtered and sorted rows, if any rules are active), including the collapsed ones.

Alternatively, you can set the `getRowsToExport` function and export any rows you want, as in the following example.
The grid exports a few selectors that can help you get the rows for the most common use-cases:

| Selector                                       | Behavior                                                                                                                                                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gridRowIdsSelector`                           | The rows in their original order.                                                                                                                                                                                          |
| `gridSortedRowIdsSelector`                     | The rows after applying the sorting rules.                                                                                                                                                                                 |
| `gridFilteredSortedRowIdsSelector`             | The rows after applying the sorting rules and the filtering rules.                                                                                                                                                         |
| `gridVisibleSortedRowIdsSelector`              | The rows after applying the sorting rules, the filtering rules and without the collapsed rows.                                                                                                                             |
| `gridPaginatedVisibleSortedGridRowIdsSelector` | The rows after applying the sorting rules, the filtering rules, without the collapsed rows and only for the current page (**Note**: If the pagination is disabled, it will still take the value of `page` and `pageSize`). |

{{"demo": "pages/components/data-grid/export/CsvGetRowsToExport.js", "bg": "inline", "defaultCodeOpen": false}}

When using [Row grouping](/components/data-grid/group-pivot/#row-grouping), it can be useful to remove the groups from the CSV export

{{"demo": "pages/components/data-grid/export/CsvGetRowsToExportRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

#### Exported cells

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

### Remove the export button

You can remove the CSV export option from the toolbar by setting `disableToolbarButton` option to `true`.

```jsx
<DataGrid
  componentsProps={{ toolbar: { csvOptions: { disableToolbarButton: true } } }}
/>
```

### apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

{{"demo": "pages/components/data-grid/export/CsvExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## Print export

The DataGrid provides the ability to optimize the layout of the grid for print mode. It can also be used to export to PDF.

The easiest way to enable the Print export is to pass the `GridToolbar` component in the `Toolbar` [component slot](/components/data-grid/components/#toolbar).

{{"demo": "pages/components/data-grid/export/ExportDefaultToolbar.js", "bg": "inline"}}

### Custom toolbar

To enable the Print export in a custom toolbar, use the `GridToolbarExport` component.

{{"demo": "pages/components/data-grid/export/ExportCustomToolbar.js", "bg": "inline"}}

### Custom exported content

The print export can be customized by passing a [`printOptions`](/api/data-grid/grid-print-export-options/) object either to the `GridToolbar` or to the `GridToolbarExport` as a prop.

The following sections describes some customizations available on this interface.

```tsx
<DataGrid componentsProps={{ toolbar: { printOptions }}} />

// same as

<GridToolbarExport printOptions={printOptions} />
```

#### Exported columns

By default, the Print will only contain the visible columns of the grid.
There are a few ways to include or hide other columns:

1. Set the exact columns to be exported in [`printOptions`](/api/data-grid/grid-print-export-options/).

```jsx
<DataGrid
  componentsProps={{ toolbar: { printOptions: { fields: ['id', 'name'] } } }}
/>
```

2. Set `allColumns` in [`printOptions`](/api/data-grid/grid-print-export-options/) to `true` to include hidden columns, instead of only the visible ones.

```jsx
<DataGrid componentsProps={{ toolbar: { printOptions: { allColumns: true } } }} />
```

3. Set the `disableExport` attribute to true in each `GridColDef`.

```jsx
<DataGrid columns={[{ field: 'id', disableExport: true }, { field: 'brand' }]} />
```

#### Exported cells

When the value of a field is an object or a `renderCell` is provided, the Print export might not display the value correctly.
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

### Remove the export button

You can remove the Print export option from the toolbar by setting `disableToolbarButton` option to `true`.

```jsx
<DataGrid
  componentsProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
/>
```

### apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

{{"demo": "pages/components/data-grid/export/PrintExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## 🚧 Excel export [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #198](https://github.com/mui-org/material-ui-x/issues/198) if you want to see it land faster.

You will be able to export the displayed data to Excel with an API call, or using the grid UI.

## 🚧 Clipboard [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #199](https://github.com/mui-org/material-ui-x/issues/199) if you want to see it land faster.

You will be able to copy and paste items to and from the grid using the system clipboard.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
