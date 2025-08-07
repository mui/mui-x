# Data Grid - Export

Export the rows in CSV or Excel formats, or use the browser's print dialog to print or save as PDF.

## Enabling export

### Default toolbar

To display the default export options, pass the `showToolbar` prop, as shown in the demo below.

```tsx
import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

export default function ExportDefaultToolbar() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid {...data} loading={loading} showToolbar />
    </div>
  );
}

```

### Custom toolbar

See the [Export component](/x/react-data-grid/components/export/) for examples of how to add export triggers to a custom toolbar.

## Export options

Following are the available export options:

- [Print](#print-export)
- [CSV](#csv-export)
- [Clipboard](#clipboard)
- [Excel](#excel-export) [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

Where relevant, the options are automatically shown in the toolbar. You can customize their respective behavior by passing an options object either to `slotsProps.toolbar` or to the Export trigger itself if you have a custom toolbar:

```tsx
// Default toolbar:
<DataGrid slotProps={{ toolbar: { csvOptions } }} />

// Custom trigger:
<ExportCsv options={csvOptions} />
```

Each export option has its own API page:

- [`printOptions`](/x/api/data-grid/grid-print-export-options/)
- [`csvOptions`](/x/api/data-grid/grid-csv-export-options/)
- [`excelOptions`](/x/api/data-grid/grid-excel-export-options/)

## Remove export options

You can remove an export option from the toolbar by setting the `disableToolbarButton` property to `true` in its options object.
In the following example, the print export is disabled.

```tsx
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function RemovePrintExport() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
          },
        }}
        showToolbar
      />
    </div>
  );
}

```

## Exported columns

By default, the export will only contain the visible columns of the Data Grid.
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

By default, the Data Grid exports the selected rows if there are any.
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

```tsx
import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import {
  DataGrid,
  GridCsvExportOptions,
  GridCsvGetRowsToExportParams,
  gridPaginatedVisibleSortedGridRowIdsSelector,
  gridSortedRowIdsSelector,
  Toolbar,
  gridExpandedSortedRowIdsSelector,
  useGridApiContext,
  GridDownloadIcon,
  ToolbarButton,
} from '@mui/x-data-grid';

const getRowsFromCurrentPage = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridPaginatedVisibleSortedGridRowIdsSelector(apiRef);

const getUnfilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridSortedRowIdsSelector(apiRef);

const getFilteredRows = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridExpandedSortedRowIdsSelector(apiRef);

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const handleExport = (options: GridCsvExportOptions) =>
    apiRef.current.exportDataAsCsv(options);

  const buttonBaseProps = {
    color: 'primary',
    size: 'small',
    startIcon: <GridDownloadIcon />,
  } as const;

  return (
    <Toolbar>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getRowsFromCurrentPage })}
      >
        Current page rows
      </ToolbarButton>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getFilteredRows })}
      >
        Filtered rows
      </ToolbarButton>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getUnfilteredRows })}
      >
        Unfiltered rows
      </ToolbarButton>
    </Toolbar>
  );
}

export default function CsvGetRowsToExport() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        pageSizeOptions={[10]}
        initialState={{
          ...data.initialState,
          filter: {
            ...data.initialState?.filter,
            filterModel: {
              items: [{ field: 'quantity', operator: '>', value: '20000' }],
            },
          },
          pagination: {
            ...data.initialState?.pagination,
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
      />
    </div>
  );
}

```

When using [Row grouping](/x/react-data-grid/row-grouping/), it can be useful to remove the groups from the CSV export.

```tsx
import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';
import {
  DataGridPremium,
  GridCsvExportOptions,
  GridCsvGetRowsToExportParams,
  gridRowTreeSelector,
  gridFilteredSortedRowIdsSelector,
  useGridApiContext,
  Toolbar,
  ToolbarButton,
  GridDownloadIcon,
} from '@mui/x-data-grid-premium';

const getRowsWithGroups = ({ apiRef }: GridCsvGetRowsToExportParams) =>
  gridFilteredSortedRowIdsSelector(apiRef);

const getRowsWithoutGroups = ({ apiRef }: GridCsvGetRowsToExportParams) => {
  const rows = gridFilteredSortedRowIdsSelector(apiRef);
  const tree = gridRowTreeSelector(apiRef);

  return rows.filter((rowId) => tree[rowId].type !== 'group');
};

const buttonBaseProps = {
  color: 'primary',
  size: 'small',
  startIcon: <GridDownloadIcon />,
} as const;

function CustomToolbar() {
  const apiRef = useGridApiContext();

  const handleExport = (options: GridCsvExportOptions) =>
    apiRef.current.exportDataAsCsv(options);

  return (
    <Toolbar>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getRowsWithGroups })}
      >
        Rows with groups
      </ToolbarButton>
      <ToolbarButton
        render={<Button {...buttonBaseProps} />}
        onClick={() => handleExport({ getRowsToExport: getRowsWithoutGroups })}
      >
        Rows without groups
      </ToolbarButton>
    </Toolbar>
  );
}

export default function CsvGetRowsToExportRowGrouping() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
        initialState={{
          ...data.initialState,
          rowGrouping: {
            ...data.initialState?.rowGrouping,
            model: ['commodity'],
          },
        }}
      />
    </div>
  );
}

```

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
// Default toolbar:
<DataGrid
  slotProps={{
    toolbar: {
      csvOptions: {
        fileName: 'customerDataBase',
        delimiter: ';',
        utf8WithBom: true,
      },
    },
  }}
/>

// Custom trigger:
<ExportCsv
  options={{
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
// Default toolbar:
<DataGrid slotProps={{ toolbar: { csvOptions: { escapeFormulas: false } } }} />

// Custom trigger:
<ExportCsv options={{ escapeFormulas: false }} />
```

## Print export

### Modify the Data Grid style

By default, the printed grid is equivalent to printing a page containing only the Data Grid.
To modify the styles used for printing, such as colors, you can either use the `@media print` media query or the `pageStyle` property of `printOptions`.

For example, if the Data Grid is in dark mode, the text color will be inappropriate for printing (too light).

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

With `pageStyle` option, you can override the main content color with a [more specific selector](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Specificity).

```jsx
// Default toolbar:
<DataGrid
  slotProps={{
    toolbar: {
      printOptions: {
        pageStyle:
          '.MuiDataGrid-root .MuiDataGrid-main { color: rgba(0, 0, 0, 0.87); }',
      },
    },
  }}
/>

// Custom trigger:
<ExportPrint options={{ pageStyle: '.MuiDataGrid-root .MuiDataGrid-main { color: rgba(0, 0, 0, 0.87); }' }} />
```

### Customize grid display

By default, the print export displays all the DataGrid. It is possible to remove the footer and the toolbar by setting respectively `hideFooter` and `hideToolbar` to `true`.

```jsx
// Default toolbar:
<DataGrid
  slotProps={{
    toolbar: {
      printOptions: {
        hideFooter: true,
        hideToolbar: true,
      },
    },
  }}
/>

// Custom trigger:
<ExportPrint options={{ hideFooter: true, hideToolbar: true }} />
```

If rows are selected when exporting, the checkboxes will not be included in the printed page. To export the checkboxes you can set `includeCheckboxes` to `true`.

```jsx
// Default toolbar:
<DataGrid
  slotProps={{
    toolbar: {
      printOptions: {
        includeCheckboxes: true,
      },
    },
  }}
/>

// Custom trigger:
<ExportPrint options={{ includeCheckboxes: true }} />
```

For more options to customize the print export, please visit the [`printOptions` API page](/x/api/data-grid/grid-print-export-options/).

## Custom export format

You can add custom export formats the Data Grid by creating a custom toolbar and export menu.
The demo below shows how to add a custom JSON export option.

```tsx
import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGrid,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  GridApi,
  Toolbar,
  ExportCsv,
  ToolbarButton,
} from '@mui/x-data-grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const getJson = (apiRef: React.RefObject<GridApi>) => {
  // Select rows and columns
  const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
  const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);

  // Format the data. Here we only keep the value
  const data = filteredSortedRowIds.map((id) => {
    const row: Record<string, any> = {};
    visibleColumnsField.forEach((field) => {
      row[field] = apiRef.current.getCellParams(id, field).value;
    });
    return row;
  });

  // Stringify with some indentation
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
  return JSON.stringify(data, null, 2);
};

const exportBlob = (blob: Blob, filename: string) => {
  // Save the blob in a json file
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  });
};

function ExportJson(props: { onMenuItemClick: () => void }) {
  const { onMenuItemClick } = props;
  const apiRef = useGridApiContext();

  return (
    <MenuItem
      onClick={() => {
        const jsonString = getJson(apiRef);
        const blob = new Blob([jsonString], {
          type: 'text/json',
        });
        exportBlob(blob, 'DataGrid_demo.json');

        // Hides the export menu after the export
        onMenuItemClick();
      }}
    >
      Download as JSON
    </MenuItem>
  );
}

function ExportMenu() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <Tooltip title="Export">
        <ToolbarButton
          ref={triggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={() => setOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
      <Menu
        id="export-menu"
        anchorEl={triggerRef.current}
        open={open}
        onClose={() => setOpen(false)}
        MenuListProps={{
          'aria-labelledby': 'export-menu-trigger',
        }}
      >
        <ExportCsv render={<MenuItem />}>Download as CSV</ExportCsv>
        <ExportJson onMenuItemClick={() => setOpen(false)} />
      </Menu>
    </React.Fragment>
  );
}

function CustomToolbar() {
  return (
    <Toolbar>
      <ExportMenu />
    </Toolbar>
  );
}

export default function CustomExport() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 4,
    maxColumns: 6,
  });

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}

```

## Excel export [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

This feature relies on [exceljs](https://github.com/exceljs/exceljs).
The Excel export allows translating columns' type and tree structure of a DataGrid to an Excel file.

Columns with types `'boolean'`, `'number'`, `'singleSelect'`, `'date'`, and `'dateTime'` are exported in their corresponding type in Excel. Please ensure the `rows` values have the correct type, you can always [convert them](/x/react-data-grid/column-definition/#converting-types) as needed.

The excel export option will appear in the default toolbar export menu by passing the `showToolbar` prop to `<DataGridPremium />`, as shown in the demo below.

```tsx
import * as React from 'react';
import { DataGridPremium, GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';

const rows: GridRowsProp = [
  {
    jobTitle: 'Head of Human Resources',
    recruitmentDate: new Date(2020, 8, 12),
    contract: 'full time',
    id: 0,
  },
  {
    jobTitle: 'Head of Sales',
    recruitmentDate: new Date(2017, 3, 4),
    contract: 'full time',
    id: 1,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 11, 20),
    contract: 'full time',
    id: 2,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 10, 14),
    contract: 'part time',
    id: 3,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2017, 10, 29),
    contract: 'part time',
    id: 4,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 21),
    contract: 'full time',
    id: 5,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2020, 7, 20),
    contract: 'intern',
    id: 6,
  },
  {
    jobTitle: 'Sales Person',
    recruitmentDate: new Date(2019, 6, 28),
    contract: 'full time',
    id: 7,
  },
  {
    jobTitle: 'Head of Engineering',
    recruitmentDate: new Date(2016, 3, 14),
    contract: 'full time',
    id: 8,
  },
  {
    jobTitle: 'Tech lead front',
    recruitmentDate: new Date(2016, 5, 17),
    contract: 'full time',
    id: 9,
  },
  {
    jobTitle: 'Front-end developer',
    recruitmentDate: new Date(2019, 11, 7),
    contract: 'full time',
    id: 10,
  },
  {
    jobTitle: 'Tech lead devops',
    recruitmentDate: new Date(2021, 7, 1),
    contract: 'full time',
    id: 11,
  },
  {
    jobTitle: 'Tech lead back',
    recruitmentDate: new Date(2017, 0, 12),
    contract: 'full time',
    id: 12,
  },
  {
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2019, 2, 22),
    contract: 'intern',
    id: 13,
  },
  {
    jobTitle: 'Back-end developer',
    recruitmentDate: new Date(2018, 4, 19),
    contract: 'part time',
    id: 14,
  },
];

const columns: GridColDef[] = [
  { field: 'jobTitle', headerName: 'Job Title', width: 200 },
  {
    field: 'recruitmentDate',
    headerName: 'Recruitment Date',
    type: 'date',
    width: 150,
  },
  {
    field: 'contract',
    headerName: 'Contract Type',
    type: 'singleSelect',
    valueOptions: ['full time', 'part time', 'intern'],
    width: 150,
  },
];

export default function ExcelExport() {
  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGridPremium rows={rows} columns={columns} showToolbar />
    </div>
  );
}

```

The export option can be added to custom toolbars using the [Export Excel component](/x/react-data-grid/components/export/#export-excel).

### Customization

#### Customizing the columns

You can use the `columnsStyles` property to customize the column style.
This property accepts an object in which keys are the column field and values an [exceljs style object](https://github.com/exceljs/exceljs#styles).

This can be used to specify value formatting or to add some colors.

```jsx
// Default toolbar:
<DataGridPremium
  slotProps={{
    toolbar: {
      excelOptions: {
        columnsStyles: {
          // replace the dd.mm.yyyy default date format
          recruitmentDay: { numFmt: 'dd/mm/yyyy' },
          // set this column in green
          incomes: { font: { argb: 'FF00FF00' } },
        },
      },
    },
  }}
/>

// Custom trigger:
<ExportExcel
  options={{
    columnsStyles: {
      recruitmentDay: { numFmt: 'dd/mm/yyyy' },
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

// Default toolbar:
<DataGridPremium
  slotProps={{
    toolbar: {
      excelOptions: {
        exceljsPreProcess,
        exceljsPostProcess,
      },
    },
  }}
/>

// Custom trigger:
<ExportExcel
  options={{
    exceljsPreProcess,
    exceljsPostProcess,
  }}
/>
```

Since `exceljsPreProcess` is applied before adding the content of the Data Grid, you can use it to add some informative rows on top of the document.
The content of the Data Grid will start on the next row after those added by `exceljsPreProcess`.

To customize the rows after the Data Grid content, you should use `exceljsPostProcess`. As it is applied after adding the content, you can also use it to access the generated cells.

In the following demo, both methods are used to set a custom header and a custom footer.

```tsx
import * as React from 'react';
import {
  DataGridPremium,
  GridExceljsProcessInput,
  GridColDef,
  DataGridPremiumProps,
  GridExcelExportOptions,
} from '@mui/x-data-grid-premium';

const rows = [
  {
    id: 1,
    path: ['Column', 'Column groups'],
    plan: 'Community',
    developed: false,
  },
  {
    id: 2,
    path: ['Column', 'Column spanning'],
    plan: 'Community',
    developed: false,
  },
  {
    id: 3,
    path: ['Column', 'Column resizing'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 4,
    path: ['Column', 'Column reorder'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 5,
    path: ['Column', 'Column pinning'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 6,
    path: ['Row', 'Row sorting'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 7,
    path: ['Row', 'Row height'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 8,
    path: ['Row', 'Row spanning'],
    plan: 'Community',
    developed: false,
  },
  {
    id: 9,
    path: ['Row', 'Row reordering'],
    plan: 'Pro',
    developed: false,
  },
  {
    id: 10,
    path: ['Row', 'Row pinning'],
    plan: 'Pro',
    developed: false,
  },

  {
    id: 11,
    path: ['Selection', 'Single row selection'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 12,
    path: ['Selection', 'Checkbox selection'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 13,
    path: ['Selection', 'Multiple row selection'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 14,
    path: ['Selection', 'Cell range selection'],
    plan: 'Premium',
    developed: false,
  },
  {
    id: 15,
    path: ['Filtering', 'Quick filter'],
    plan: 'Community',
    developed: false,
  },
  {
    id: 16,
    path: ['Filtering', 'Column filters'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 17,
    path: ['Filtering', 'Multi-column filtering'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 18,
    path: ['Pagination', 'Pagination'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 19,
    path: ['Pagination', 'Pagination > 100 rows per page'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 20,
    path: ['Editing', 'Row editing'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 21,
    path: ['Editing', 'Cell editing'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 22,
    path: ['Import & export', 'CSV export'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 23,
    path: ['Import & export', 'Print'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 24,
    path: ['Import & export', 'Clipboard'],
    plan: 'Pro',
    developed: false,
  },
  {
    id: 25,
    path: ['Import & export', 'Excel export'],
    plan: 'Premium',
    developed: true,
  },
  {
    id: 26,
    path: ['Rendering', 'Customizable components'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 27,
    path: ['Rendering', 'Column virtualization'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 28,
    path: ['Rendering', 'Row virtualization > 100 rows'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 29,
    path: ['Group & Pivot', 'Tree data'],
    plan: 'Pro',
    developed: true,
  },
  {
    id: 30,
    path: ['Group & Pivot', 'Master-detail row panels'],
    plan: 'Pro',
    developed: false,
  },
  {
    id: 31,
    path: ['Group & Pivot', 'Grouping'],
    plan: 'Premium',
    developed: true,
  },
  {
    id: 32,
    path: ['Group & Pivot', 'Aggregation'],
    plan: 'Premium',
    developed: false,
  },
  {
    id: 33,
    path: ['Group & Pivot', 'Pivoting'],
    plan: 'Premium',
    developed: false,
  },
  {
    id: 34,
    path: ['Misc', 'Accessibility'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 35,
    path: ['Misc', 'Keyboard navigation'],
    plan: 'Community',
    developed: true,
  },
  {
    id: 36,
    path: ['Misc', 'Localization'],
    plan: 'Community',
    developed: true,
  },
];

const columns: GridColDef[] = [
  {
    field: 'plan',
    type: 'singleSelect',
    valueOptions: ['Community', 'Pro', 'Premium'],
  },
  {
    field: 'developed',
    type: 'boolean',
  },
];

const groupingColDef = {
  headerName: 'Feature',
};

const exceljsPreProcess = async ({
  workbook,
  worksheet,
}: GridExceljsProcessInput) => {
  // Set document meta data
  workbook.creator = 'MUI-X team';
  workbook.created = new Date();

  // Customize default excel properties
  worksheet.properties.defaultRowHeight = 30;

  // Create a custom file header
  worksheet.mergeCells('A1:C2');
  worksheet.getCell('A1').value =
    'This is an helping document for the MUI-X team.\nPlease refer to the doc for up to date data.';

  worksheet.getCell('A1').border = {
    bottom: { style: 'medium', color: { argb: 'FF007FFF' } },
  };

  worksheet.getCell('A1').font = {
    name: 'Arial Black',
    size: 14,
  };
  worksheet.getCell('A1').alignment = {
    vertical: 'top',
    horizontal: 'center',
    wrapText: true,
  };
  worksheet.addRow([]);
};
const exceljsPostProcess = async ({ worksheet }: GridExceljsProcessInput) => {
  // add a text after the data
  worksheet.addRow({}); // Add empty row

  worksheet.addRow(['Those data are for internal use only']);
};

const excelOptions: GridExcelExportOptions = {
  exceljsPreProcess,
  exceljsPostProcess,
};

const getTreeDataPath: DataGridPremiumProps['getTreeDataPath'] = (row) => row.path;

export default function ExcelCustomExport() {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        treeData
        getTreeDataPath={getTreeDataPath}
        rows={rows}
        columns={columns}
        groupingColDef={groupingColDef}
        defaultGroupingExpansionDepth={-1}
        showToolbar
        slotProps={{ toolbar: { excelOptions } }}
      />
    </div>
  );
}

```

### Using a web worker

:::warning
This feature only works with `@mui/styled-engine` v5.11.8 or newer.
Make sure that the Material UI version you are using is also installing the correct version for this dependency.
:::

Instead of generating the Excel file in the main thread, you can delegate the task to a web worker.
This method reduces the amount of time that the main thread remains frozen, allowing to interact with the grid while the data is exported in background.
To start using web workers for the Excel export, first you need to create a file with the content below.
This file will be later used as the worker script, so it must be accessible by a direct URL.

```tsx
// in file ./worker.ts
import { setupExcelExportWebWorker } from '@mui/x-data-grid-premium/setupExcelExportWebWorker';

setupExcelExportWebWorker();
```

The final step is to pass the path to the file created to excel options or the API method:

```tsx
// Default toolbar:
<DataGridPremium
  slotProps={{
    toolbar: {
      excelOptions: {
        worker: () => new Worker('/worker.ts'),
      },
    },
  }}
/>;

// Custom trigger:
<ExportExcel
  options={{
    worker: () => new Worker('/worker.ts'),
  }}
/>;

// API method:
apiRef.current.exportDataAsExcel({
  worker: () => new Worker('/worker.ts'),
});
```

:::info
If you are using Next.js or webpack 5, use the following syntax instead.
Make sure to pass the **relative path**, considering the current file, to the worker script.

```tsx
// Default toolbar:
<DataGridPremium
  slotProps={{
    toolbar: {
      excelOptions: {
        worker: () => new Worker(new URL('./worker.ts', import.meta.url)),
      },
    },
  }}
/>;

// Custom trigger:
<ExportExcel
  options={{
    worker: () => new Worker(new URL('./worker.ts', import.meta.url)),
  }}
/>;

// API method:
apiRef.current.exportDataAsExcel({
  worker: () => new Worker(new URL('./worker.ts', import.meta.url)),
});
```

It is not necessary to make the script public because [webpack](https://webpack.js.org/guides/web-workers/) will handle that automatically for you.
:::

Since the main thread is not locked while the data is exported, it is important to give feedback for users that something is in progress.
You can pass a callback to the `onExcelExportStateChange` prop and display a message or loader.
The following demo contains an example using a [Snackbar](/material-ui/react-snackbar/):

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Slide, { SlideProps } from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

export default function ExcelExportWithWebWorker() {
  const [inProgress, setInProgress] = React.useState(false);

  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 50_000,
    editable: true,
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <Snackbar open={inProgress} TransitionComponent={SlideTransition}>
        <Alert severity="info" icon={<CircularProgress size={24} />}>
          Exporting Excel file...
        </Alert>
      </Snackbar>
      <DataGridPremium
        {...data}
        loading={loading}
        rowHeight={38}
        checkboxSelection
        showToolbar
        onExcelExportStateChange={(newState) =>
          setInProgress(newState === 'pending')
        }
        slotProps={{
          toolbar: {
            excelOptions: {
              worker: () =>
                new Worker(new URL('./excelExportWorker.ts', import.meta.url)),
            },
          },
        }}
      />
    </Box>
  );
}

```

:::info
When opening the demo above in CodeSandbox or StackBlitz you need to manually create the `worker.ts` script.
:::

:::warning
If you want to use the `exceljsPreProcess` and `exceljsPostProcess` options to customize the final spreadsheet, as shown in the [Customization](/x/react-data-grid/export/#customization) section above, you have to pass them to `setupExcelExportWebWorker` instead.
This is necessary because [functions](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#things_that_dont_work_with_structured_clone) cannot be passed to the web worker.

```tsx
// Instead of:
<DataGridPremium
  slotProps={{
    toolbar: {
      excelOptions: {
        exceljsPreProcess,
        exceljsPostProcess,
      },
    },
  }}
/>;

// Do the following in the ./worker.ts file:
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
// Default toolbar:
<DataGridPremium slotProps={{ toolbar: { excelOptions: { escapeFormulas: false } } }} />

// or
<ExportExcel options={{ escapeFormulas: false }} />
```

## Clipboard

The clipboard export allows you to copy the content of the Data Grid to the clipboard.
For more information, check the [Clipboard copy](/x/react-data-grid/clipboard/#clipboard-copy) docs.

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used internally in the implementation of the export feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort when the Data Grid's built-in props aren't sufficient for your specific use case.
:::

### CSV

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-csv-export-api.json';

export default function CsvExportApiNoSnap() {
  return <ApiDocs api={api} />;
}

```

### Print

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-print-export-api.json';

export default function PrintExportApiNoSnap() {
  return <ApiDocs api={api} />;
}

```

### Excel [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

```jsx
import * as React from 'react';
import ApiDocs from 'docsx/src/modules/components/ApiDocs';
import api from 'docsx/pages/x/api/data-grid/grid-excel-export-api.json';

export default function ExcelExportApiNoSnap() {
  return <ApiDocs premiumApi={api} />;
}

```

## API

- [GridCsvExportOptions](/x/api/data-grid/grid-csv-export-options/)
- [GridPrintExportOptions](/x/api/data-grid/grid-print-export-options/)
- [GridExcelExportOptions](/x/api/data-grid/grid-excel-export-options/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
