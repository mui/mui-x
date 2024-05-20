# Data Grid - Export

<p class="description">Easily export the rows in various file formats such as CSV, Excel, or PDF.</p>

## Enabling export

### Default Toolbar

To enable the export menu, pass the `GridToolbar` component in the `Toolbar` [component slot](/x/react-data-grid/components/#toolbar).

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
- [Excel](#excel-export) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')
- [Clipboard](#clipboard) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan') (🚧 Not delivered yet)

You can customize their respective behavior by passing an options object either to the `GridToolbar` or to the `GridToolbarExport` as a prop.

```tsx
<DataGrid slotProps={{ toolbar: { csvOptions } }} />

// same as

<GridToolbarExport csvOptions={csvOptions} />
```

Each export option has its own API page:

- [`csvOptions`](/x/api/data-grid/grid-csv-export-options/)
- [`printOptions`](/x/api/data-grid/grid-print-export-options/)

## Disabled format

You can remove an export format from the toolbar by setting its option property `disableToolbarButton` to `true`.
In the following example, the print export is disabled.

```jsx
<DataGrid
  slotProps={{ toolbar: { printOptions: { disableToolbarButton: true } } }}
/>
```

{{"demo": "RemovePrintExport.js", "bg": "inline", "defaultCodeOpen": false}}

## Exported columns

By default, the export will only contain the visible columns of the data grid.
There are a few ways to include or hide other columns.

- Set the `disableExport` attribute to `true` in `GridColDef` for columns you don't want to be exported.

```jsx
<DataGrid columns={[{ field: 'name', disableExport: true }, { field: 'brand' }]} />
```

- Set `allColumns` in export option to `true` to also include hidden columns. Those with `disableExport=true` will not be exported.

```jsx
<DataGrid slotProps={{ toolbar: { csvOptions: { allColumns: true } } }} />
```

- Set the exact columns to be exported in the export option. Setting `fields` overrides the other properties. Such that the exported columns are exactly those in `fields` in the same order.

```jsx
<DataGrid slotProps={{ toolbar: { csvOptions: { fields: ['name', 'brand'] } } }} />
```

## Exported rows

By default, the data grid exports the selected rows if there are any.
If not, it exports all rows except the footers (filtered and sorted rows, according to active rules), including the collapsed ones.

### Customizing the rows to export

Alternatively, you can set the `getRowsToExport` function and export any rows you want, as in the following example.
The grid exports a few [selectors](/x/react-data-grid/state/#access-the-state) that can help you get the rows for the most common use-cases:

| Selector                                       | Behavior                                                                                                                                                                                                                   |
| :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `gridRowIdsSelector`                           | The rows in their original order.                                                                                                                                                                                          |
| `gridSortedRowIdsSelector`                     | The rows after applying the sorting rules.                                                                                                                                                                                 |
| `gridFilteredSortedRowIdsSelector`             | The rows after applying the sorting rules, and the filtering rules.                                                                                                                                                        |
| `gridExpandedSortedRowIdsSelector`             | The rows after applying the sorting rules, the filtering rules, and without the collapsed rows.                                                                                                                            |
| `gridPaginatedVisibleSortedGridRowIdsSelector` | The rows after applying the sorting rules, the filtering rules, without the collapsed rows and only for the current page (**Note**: If the pagination is disabled, it will still take the value of `page` and `pageSize`). |

{{"demo": "CsvGetRowsToExport.js", "bg": "inline", "defaultCodeOpen": false}}

When using [Row grouping](/x/react-data-grid/row-grouping/), it can be useful to remove the groups from the CSV export.

{{"demo": "CsvGetRowsToExportRowGrouping.js", "bg": "inline", "defaultCodeOpen": false}}

## CSV export

### Exported cells

When the value of a field is an object or a `renderCell` is provided, the CSV export might not display the value correctly.
You can provide a [`valueFormatter`](/x/react-data-grid/column-definition/#value-formatter) with a string representation to be used.

```jsx
<DataGrid
  columns={[
    {
      field: 'progress',
      valueFormatter: (value) => `${value * 100}%`,
      renderCell: ({ value }) => <ProgressBar value={value} />,
    },
  ]}
/>
```

### File encoding

You can use `csvOptions` to specify the format of the export, such as the `delimiter` character used to separate fields, the `fileName`, or `utf8WithBom` to prefix the exported file with UTF-8 Byte Order Mark (BOM).
For more details on these options, please visit the [`csvOptions` API page](/x/api/data-grid/grid-csv-export-options/).

```jsx
<GridToolbarExport
  csvOptions={{
    fileName: 'customerDataBase',
    delimiter: ';',
    utf8WithBom: true,
  }}
/>
```

### Escape formulas

By default, the formulas in the cells are escaped.
This is to prevent the formulas from being executed when [the CSV file is opened in Excel](https://owasp.org/www-community/attacks/CSV_Injection).

If you want to keep the formulas working, you can set the `escapeFormulas` option to `false`.

```jsx
<DataGrid slotProps={{ toolbar: { csvOptions: { escapeFormulas: false } } }} />

// or

<GridToolbarExport csvOptions={{ escapeFormulas: false }} />
```

## Print export

### Modify the data grid style

By default, the printed grid is equivalent to printing a page containing only the data grid.
To modify the styles used for printing, such as colors, you can either use the `@media print` media query or the `pageStyle` property of `printOptions`.

For example, if the data grid is in dark mode, the text color will be inappropriate for printing (too light).

With media query, you have to start your `sx` object with `@media print` key, such that all the style inside are only applied when printing.

```jsx
<DataGrid
  sx={{
    '@media print': {
      '.MuiDataGrid-main': { color: 'rgba(0, 0, 0, 0.87)' },
    },
  }}
  {/* ... */}
/>
```

With `pageStyle` option, you can override the main content color with a [more specific selector](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity).

```jsx
<DataGrid
  slotProps={{
    toolbar: {
      printOptions:{
        pageStyle: '.MuiDataGrid-root .MuiDataGrid-main { color: rgba(0, 0, 0, 0.87); }',
      }
    }
  }}
  {/* ... */}
/>
```

### Customize grid display

By default, the print export displays all the DataGrid. It is possible to remove the footer and the toolbar by setting respectively `hideFooter` and `hideToolbar` to `true`.

```jsx
<GridToolbarExport
  printOptions={{
    hideFooter: true,
    hideToolbar: true,
  }}
/>
```

If rows are selected when exporting, the checkboxes will not be included in the printed page. To export the checkboxes you can set `includeCheckboxes` to `true`.

```jsx
<GridToolbarExport
  printOptions={{
    includeCheckboxes: true,
  }}
/>
```

For more options to customize the print export, please visit the [`printOptions` API page](/x/api/data-grid/grid-print-export-options/).

## Custom export format

You can add custom export formats by creating your own export menu.
To simplify its creation, you can use `<GridToolbarExportContainer />` which contains the menu logic.
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

## Excel export [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

This feature relies on [exceljs](https://github.com/exceljs/exceljs).
The Excel export allows translating columns' type and tree structure of a DataGrid to an Excel file.

Columns with types `'boolean'`, `'number'`, `'singleSelect'`, `'date'`, and `'dateTime'` are exported in their corresponding type in Excel. Please ensure the `rows` values have the correct type, you can always [convert them](/x/react-data-grid/column-definition/#converting-types) as needed.

{{"demo": "ExcelExport.js", "bg": "inline", "defaultCodeOpen": false}}

### Customization

#### Customizing the columns

You can use the `columnsStyles` property to customize the column style.
This property accepts an object in which keys are the column field and values an [exceljs style object](https://github.com/exceljs/exceljs#styles).

This can be used to specify value formatting or to add some colors.

```jsx
<GridToolbarExport
  excelOptions={{
    columnsStyles: {
      // replace the dd.mm.yyyy default date format
      recruitmentDay: { numFmt: 'dd/mm/yyyy' },
      // set this column in green
      incomes: { font: { argb: 'FF00FF00' } },
    },
  }}
/>
```

#### Customizing the document

You can customize the document using two callback functions:

- `exceljsPreProcess` called **before** adding the rows' dataset.
- `exceljsPostProcess` called **after** the dataset has been exported to the document.

Both functions receive `{ workbook, worksheet }` as input.
They are [exceljs](https://github.com/exceljs/exceljs#interface) objects and allow you to directly manipulate the Excel file.

Thanks to these two methods, you can modify the metadata of the exported spreadsheet.
You can also use it to add custom content on top or bottom of the worksheet, as follows:

```jsx
function exceljsPreProcess({ workbook, worksheet }) {
  workbook.created = new Date(); // Add metadata
  worksheet.name = 'Monthly Results'; // Modify worksheet name

  // Write on first line the date of creation
  worksheet.getCell('A1').value = `Values from the`;
  worksheet.getCell('A2').value = new Date();
}

function exceljsPostProcess({ worksheet }) {
  // Add a text after the data
  worksheet.addRow(); // Add empty row

  const newRow = worksheet.addRow();
  newRow.getCell(1).value = 'Those data are for internal use only';
}

// ...

<GridToolbarExport
  excelOptions={{
    exceljsPreProcess,
    exceljsPostProcess,
  }}
/>;
```

Since `exceljsPreProcess` is applied before adding the content of the data grid, you can use it to add some informative rows on top of the document.
The content of the data grid will start on the next row after those added by `exceljsPreProcess`.

To customize the rows after the data grid content, you should use `exceljsPostProcess`. As it is applied after adding the content, you can also use it to access the generated cells.

In the following demo, both methods are used to set a custom header and a custom footer.

{{"demo": "ExcelCustomExport.js", "bg": "inline", "defaultCodeOpen": false}}

### Using a web worker

:::warning
This feature only works with `@mui/styled-engine` v5.11.8 or newer.
Make sure that the MUI Core version you are using is also installing the correct version for this dependency.
:::

Instead of generating the Excel file in the main thread, you can delegate the task to a web worker.
This method reduces the amount of time that the main thread remains frozen, allowing to interact with the grid while the data is exported in background.
To start using web workers for the Excel export, first you need to create a file with the content below.
This file will be later used as the worker script, so it must be accessible by a direct URL.

```tsx
// in file ./worker.ts
import { setupExcelExportWebWorker } from '@mui/x-data-grid-premium';

setupExcelExportWebWorker();
```

The final step is to pass the path to the file created to `GridToolbarExport` or the API method:

```tsx
<GridToolbarExport
  excelOptions={{
    worker: () => new Worker('/worker.ts'),
  }}
/>;

// or

apiRef.current.exportDataAsExcel({
  worker: () => new Worker('/worker.ts'),
});
```

:::info
If you are using Next.js or Webpack 5, use the following syntax instead.
Make sure to pass the **relative path**, considering the current file, to the worker script.

```tsx
<GridToolbarExport
  excelOptions={{
    worker: () => new Worker(new URL('./worker.ts', import.meta.url)),
  }}
/>;

// or

apiRef.current.exportDataAsExcel({
  worker: () => new Worker(new URL('./worker.ts', import.meta.url)),
});
```

It is not necessary to make the script public because [Webpack](https://webpack.js.org/guides/web-workers/) will handle that automatically for you.
:::

Since the main thread is not locked while the data is exported, it is important to give feedback for users that something is in progress.
You can pass a callback to the `onExcelExportStateChange` prop and display a message or loader.
The following demo contains an example using a [Snackbar](/material-ui/react-snackbar/):

{{"demo": "ExcelExportWithWebWorker.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
When opening the demo above in CodeSandbox or StackBlitz you need to manually create the `worker.ts` script.
:::

:::warning
If you want to use the `exceljsPreProcess` and `exceljsPostProcess` options to customize the final spreadsheet, as shown in the [Customization](/x/react-data-grid/export/#customization) section above, you have to pass them to `setupExcelExportWebWorker` instead.
This is necessary because [functions](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#things_that_dont_work_with_structured_clone) cannot be passed to the web worker.

```tsx
// Instead of
<GridToolbarExport
  excelOptions={{
    exceljsPreProcess,
    exceljsPostProcess,
  }}
/>;

// Do the following in the ./worker.ts file
setupExcelExportWebWorker({
  exceljsPreProcess,
  exceljsPostProcess,
});
```

:::

### Escape formulas

By default, the formulas in the cells are escaped.
This is to prevent the formulas from being executed when [the file is opened in Excel](https://owasp.org/www-community/attacks/CSV_Injection).

If you want to keep the formulas working, you can set the `escapeFormulas` option to `false`.

```jsx
<DataGridPremium slotProps={{ toolbar: { excelOptions: { escapeFormulas: false } } }} />

// or

<GridToolbarExport excelOptions={{ escapeFormulas: false }} />
```

## Clipboard

The clipboard export allows you to copy the content of the data grid to the clipboard.
For more information, check the [Clipboard copy](/x/react-data-grid/clipboard/#clipboard-copy) docs.

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

:::warning
Only use this API as the last option. Give preference to the props to control the Data Grid.
:::

### CSV

{{"demo": "CsvExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

### Print

{{"demo": "PrintExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

### Excel [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

{{"demo": "ExcelExportApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [GridCsvExportOptions](/x/api/data-grid/grid-csv-export-options/)
- [GridPrintExportOptions](/x/api/data-grid/grid-print-export-options/)
- [GridExcelExportOptions](/x/api/data-grid/grid-excel-export-options/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
