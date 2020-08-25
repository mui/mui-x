---
title: Data Grid - Paging
components: DataGrid, XGrid
---

# Data Grid - Pagination

<p class="description">Through paging, a segment of data can be viewed from the assigned data source.</p>

By default, the MIT `DataGrid` displays the rows with pagination, and up to 100 rows per page.

On the other hand, the commercial `XGrid` component displays, by default, all the rows with infinite scrolling (and virtualization) and without the 100 rows per page limitation. You need to set the `pagination` prop to enable the pagination feature in such a case.

## Basic example

{{"demo": "pages/components/data-grid/pagination/BasicPaginationGrid.js"}}

## Page size

- The default page size is `100`, you can change this value with the `pageSize` prop.
- You can configure the possible page size the end-users can choose from with the `rowsPerPageOptions` prop.

{{"demo": "pages/components/data-grid/pagination/SizePaginationGrid.js"}}

## Controlled pagination

While the previous demos show how the pagination can be uncontrolled, the active page can be controlled with the `page`/`onPageChange` props.

{{"demo": "pages/components/data-grid/pagination/ControlledPaginationGrid.js"}}

## Auto size

The `autoPageSize` prop allows to auto-scale the `pageSize` to match the container height and the max number of rows that can be displayed without a vertical scroll bar.
By default, this feature is off.

{{"demo": "pages/components/data-grid/pagination/AutoPaginationGrid.js"}}

## Custom pagination component

Head to the [rendering section](/components/data-grid/rendering/#pagination) of the documentation for customizing the pagination component.

## Server-side pagination

- https://ej2.syncfusion.com/react/demos/#/material/grid/paging
- https://devexpress.github.io/devextreme-reactive/react/grid/docs/guides/paging/
- https://www.telerik.com/kendo-react-ui/components/grid/paging/
- https://ag-grid.com/javascript-grid-pagination/
- https://github.com/tannerlinsley/react-table/blob/master/docs/api/usePagination.md
- https://www.jqwidgets.com/react/react-grid/#https://www.jqwidgets.com/react/react-grid/react-grid-paging.htm
- https://js.devexpress.com/Demos/WidgetsGallery/Demo/DataGrid/RecordPaging/React/Light/
- http://tabulator.info/docs/4.5/page
