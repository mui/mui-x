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
- You can configure the possible page size the user can choose from with the `rowsPerPageOptions` prop.

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

By default, pagination works on the client-side.
To switch it to server-side, set `paginationMode="server"`.
You also need to set the `rowCount` prop to so the grid know the total number of pages.
Finally, you need to handle the `onPageChange` callback to load the rows for the corresponding page.

{{"demo": "pages/components/data-grid/pagination/ServerPaginationGrid.js"}}

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative apiRef.

> ⚠️ Only use this API when you have no alternative. Always start from the declarative API that the grid exposes.

- `setPageSize`: Set the number of rows in one page.
- `setPage`: Set the displayed page.
- `onPageChange`: Callback fired after a new page has been displayed.
- `onPageSizeChange`: Callback fired after the page size was changed.

Below is an example of how you can reset the page using the imperative `setPage` method.

{{"demo": "pages/components/data-grid/pagination/ApiRefPaginationGrid.js"}}

## Paginate > 100 rows <span role="img" title="Enterprise">⚡️</span>

The `DataGrid` component can display up to 100 rows per page.
The `XGrid` component removes this limitation.
The following demo displays 200 rows per page:

{{"demo": "pages/components/data-grid/pagination/200PaginationGrid.js", "disableAd": true}}
