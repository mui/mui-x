# DataGrid API

<p class="description">The API documentation of the DataGrid React component. Learn more about the props and the CSS customization points.</p>

## Import

```js
import { DataGrid } from '@material-ui/data-grid';
```

## Props


| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| <span class="prop-name required">rows<abbr title="required">*</abbr></span> | <span class="prop-type">RowsProp</span> |  | Set of rows of type 'RowsProp'. |
| <span class="prop-name required">columns<abbr title="required">*</abbr></span> | <span class="prop-type">Columns</span> |   | Set of columns of type 'Columns'. |
| <span class="prop-name">columnTypes</span> | <span class="prop-type">ColumnTypesRecord</span> |   | Extend native column types with your new column types. |
| <span class="prop-name">components</span> | <span class="prop-type">GridComponentOverridesProp</span> |   | Overrideable components. |
| <span class="prop-name">loading</span> | <span class="prop-type">boolean</span> |  false | If `true`, a  loading overlay is displayed. |
| <span class="prop-name">className</span> | <span class="prop-type">string</span> |   | Css classname to add on the outer container. |
| <span class="prop-name">error</span> | <span class="prop-type">any</span> |   | An error that will turn the grid into its error state and display the error component. |
| <span class="prop-name">autoHeight</span> | <span class="prop-type">boolean</span> | false | If `true`, the grid height is dynamic and follow the number of rows in the grid. |
| <span class="prop-name">rowHeight</span> | <span class="prop-type">number</span> | 52 | Set the height in pixel of a row in the grid. |
| <span class="prop-name">headerHeight</span> | <span class="prop-type">number</span> | 56 | Set the height in pixel of the column headers in the grid. |
| <span class="prop-name">scrollbarSize</span> | <span class="prop-type">number</span> | 15 | Set the height/width of the grid inner scrollbar. |
| <span class="prop-name">columnBuffer</span> | <span class="prop-type">number</span> | 2 | Number of columns rendered outside the grid viewport. |
| <span class="prop-name">showCellRightBorder</span> | <span class="prop-type">boolean</span> | false | If `true`, the right border of the cells are displayed. |
| <span class="prop-name">showColumnRightBorder</span> | <span class="prop-type">boolean</span> | false | If `true`, the right border of the column headers are displayed. |
| <span class="prop-name">disableExtendRowFullWidth</span> | <span class="prop-type">boolean</span> | false | If `true`, rows will not be extended to fill the full width of the grid container. |
| <span class="prop-name">sortingOrder</span> | <span class="prop-type">SortDirection[]</span> | ['asc', 'desc', null] | The order of the sorting sequence. |
| <span class="prop-name">pageSize</span> | <span class="prop-type">number</span> | 100 | Set the number of rows in one page. |
| <span class="prop-name">autoPageSize</span> | <span class="prop-type">boolean</span> | false | If `true`, the pageSize is calculated according to the container size and the max number of rows to avoid rendering a vertical scroll bar. |
| <span class="prop-name">rowsPerPageOptions</span> | <span class="prop-type">number[]</span> | [25, 50, 100] | Select the pageSize dynamically using the component UI. |
| <span class="prop-name">paginationMode</span> | <span class="prop-type">FeatureMode</span> | 'client' | Pagination can be processed on the server or client-side. Set it to 'client' if you would like to handle the pagination on the client-side. Set it to 'server' if you would like to handle the pagination on the server-side. |
| <span class="prop-name">rowCount</span> | <span class="prop-type">number</span> |   |  Set the total number of rows, if it is different than the length of the value `rows` prop. |
| <span class="prop-name">page</span> | <span class="prop-type">number</span> | 1   |  Set the current page. |
| <span class="prop-name">sortingMode</span> | <span class="prop-type">FeatureMode</span> | 'client' |  Sorting can be processed on the server or client-side. Set it to 'client' if you would like to handle sorting on the client-side. Set it to 'server' if you would like to handle sorting on the server-side. |
| <span class="prop-name">hideFooter</span> | <span class="prop-type">boolean</span> | false | If `true`, the footer component is hidden. |
| <span class="prop-name">hideFooterRowCount</span> | <span class="prop-type">boolean</span> | false | If `true`, the row count in the footer is hidden. |
| <span class="prop-name">hideFooterSelectedRowCount</span> | <span class="prop-type">boolean</span> | false | If `true`, the selected row count in the footer is hidden. |
| <span class="prop-name">hideFooterPagination</span> | <span class="prop-type">boolean</span> | false | If `true`, the pagination component in the footer is hidden. |
| <span class="prop-name">checkboxSelection</span> | <span class="prop-type">boolean</span> | false | If `true`, the grid get a first column with a checkbox that allows to select rows. |
| <span class="prop-name">disableSelectionOnClick</span> | <span class="prop-type">boolean</span> | false | If `true`, the selection on click on a row or cell is disabled. |
| <span class="prop-name">logger</span> | <span class="prop-type">Logger</span> | null | Pass a custom logger in the components that implements the 'Logger' interface. |
| <span class="prop-name">logLevel</span> | <span class="prop-type">string | false</span> | false | Allows to pass the logging level or false to turn off logging. |
| <span class="prop-name">sortModel</span> | <span class="prop-type">SortModel</span> |   | Set the sort model of the grid. |
| <span class="prop-name">onCellClick</span> | <span class="prop-type">(param: CellParams) => void</span> |   | Callback fired when a click event comes from a cell element. |
| <span class="prop-name">onCellHover</span> | <span class="prop-type">(param: CellParams) => void</span> |   | Callback fired when a hover event comes from a cell element. |
| <span class="prop-name">onRowClick</span> | <span class="prop-type">(param: RowParams) => void</span> |   | Callback fired when a click event comes from a row container element. |
| <span class="prop-name">onRowHover</span> | <span class="prop-type">(param: RowParams) => void</span> |   | Callback fired when a hover event comes from a row container element. |
| <span class="prop-name">onRowSelected</span> | <span class="prop-type">(param: RowSelectedParams) => void</span> |   | Callback fired when one row is selected. |
| <span class="prop-name">onSelectionChange</span> | <span class="prop-type">(param: SelectionChangeParams) => void</span> |   | Callback fired when the selection state of one or multiple rows changes. |
| <span class="prop-name">onColumnHeaderClick</span> | <span class="prop-type">(param: ColParams) => void</span> |   | Callback fired when a click event comes from a column header element. |
| <span class="prop-name">onSortModelChange</span> | <span class="prop-type">(param: SortModelParams) => void</span> |   | Callback fired when the sort model changes before a column is sorted. |
| <span class="prop-name">onPageChange</span> | <span class="prop-type">(param: PageChangeParams) => void</span> |   | Callback fired when the current page has changed. |
| <span class="prop-name">onPageSizeChange</span> | <span class="prop-type">(param: PageChangeParams) => void</span> |   | Callback fired when the page size has changed. |
| <span class="prop-name">onError</span> | <span class="prop-type">(args: any) => void</span> |   | Callback fired when an exception is thrown in the grid, or when the `showError` API method is called. |
| <span class="prop-name">icons</span> | <span class="prop-type">IconsOptions</span> |   | Set of icons used in the grid. |

The `ref` is forwarded to the root element.

## CSS

| Rule name | Global class | Description |
|:-----|:-------------|:------------|
| <span class="prop-name">root</span> | <span class="prop-name">.MuiDataGrid-root</span> | Styles applied to the root element. |
|  | <span class="prop-name">.MuiDataGrid-mainGridContainer</span> | Styles applied to the main container element.|
|  | <span class="prop-name">.MuiDataGrid-overlay</span> | Styles applied to the outer overlay element.|
|  | <span class="prop-name">.MuiDataGrid-columnsContainer</span> | Styles applied to the outer columns container element.|
|  | <span class="prop-name">.MuiDataGrid-colCellWrapper</span> | Styles applied to the outer columns header cells container element.|
|  | <span class="prop-name">.MuiDataGrid-colCell</span> | Styles applied to the header cell element.|
|  | <span class="prop-name">.MuiDataGrid-cell</span> | Styles applied to the cell element.|
|  | <span class="prop-name">.MuiDataGrid-colCellCheckbox</span> | Styles applied to the header checkbox cell element.|
|  | <span class="prop-name">.MuiDataGrid-cellCheckbox</span> | Styles applied to the cell checkbox element.|
|  | <span class="prop-name">.MuiDataGrid-colCellSortable</span> | Styles applied to the sortable header cell element.|
|  | <span class="prop-name">.MuiDataGrid-sortIcon</span> | Styles applied to the sort icon element.|
|  | <span class="prop-name">.MuiDataGrid-colCellCenter</span> | Styles applied to the centered header cell element.|
|  | <span class="prop-name">.MuiDataGrid-colCellRight</span> | Styles applied to the aligned right header cell element.|
|  | <span class="prop-name">.MuiDataGrid-colCellTitle</span> | Styles applied to the header cell title element.|
|  | <span class="prop-name">.MuiDataGrid-columnSeparator</span> | Styles applied to the header cell separator element.|
|  | <span class="prop-name">.MuiDataGrid-iconSeparator</span> | Styles applied to the header cell separator icon element.|
|  | <span class="prop-name">.MuiDataGrid-dataContainer</span> | Styles applied to the data container element.|
|  | <span class="prop-name">.MuiDataGrid-window</span> | Styles applied to the window element.|
|  | <span class="prop-name">.MuiDataGrid-viewport</span> | Styles applied to the viewport element.|
|  | <span class="prop-name">.MuiDataGrid-row</span> | Styles applied to the row element.|
|  | <span class="prop-name">.Mui-selected</span> | Styles applied to the selected row element.|
|  | <span class="prop-name">.MuiDataGrid-cellWithRenderer</span> | Styles applied to the customised cell element.|
|  | <span class="prop-name">.MuiDataGrid-withBorder</span> | Styles applied to the cell element that has right border displayed.|
|  | <span class="prop-name">.MuiDataGrid-cellRight</span> | Styles applied to the aligned right cell element.|
|  | <span class="prop-name">.MuiDataGrid-cellCenter</span> | Styles applied to the centered cell element.|
|  | <span class="prop-name">.MuiDataGrid-footer</span> | Styles applied to the footer element.|
|  | <span class="prop-name">.MuiDataGrid-rowCount</span> | Styles applied to the footer row count element.|
|  | <span class="prop-name">.MuiDataGrid-selectedRowCount</span> | Styles applied to the footer selected row count element.|

You can override the style of the component thanks to one of these customization points:

- With a rule name of the [`classes` object prop](/customization/components/#overriding-styles-with-classes).
- With a [global class name](/customization/components/#overriding-styles-with-global-class-names).
- With a theme and an [`overrides` property](/customization/globals/#css).

If that's not sufficient, you can check the [implementation of the component style](https://github.com/mui-org/material-ui-x/blob/master/packages/grid/_modules_/grid/components/styled-wrappers/GridRootStyles.ts) for more detail.

## Demos

- [DataGrid](/components/data-grid/#mit-version)
