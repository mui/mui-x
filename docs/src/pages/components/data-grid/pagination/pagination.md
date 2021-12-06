---
title: Data Grid - Pagination
---

# Data Grid - Pagination

<p class="description">Through pagination, a segment of data can be viewed from the assigned data source.</p>

By default, the MIT `DataGrid` displays the rows with pagination, and up to 100 rows per page.

On the other hand, the commercial `DataGridPro` component displays, by default, all the rows with infinite scrolling (and virtualization) and without the 100 rows per page limitation. You need to set the `pagination` prop to enable the pagination feature in such a case.

## Basic example

{{"demo": "pages/components/data-grid/pagination/BasicPaginationGrid.js", "bg": "inline"}}

## Page size

- The default page size is `100`, you can change this value with the `pageSize` prop.
- You can configure the possible page size the user can choose from with the `rowsPerPageOptions` prop.

{{"demo": "pages/components/data-grid/pagination/SizePaginationGrid.js", "bg": "inline"}}

## Controlled pagination

While the previous demos show how the pagination can be uncontrolled, the active page can be controlled with the `page`/`onPageChange` props.

{{"demo": "pages/components/data-grid/pagination/ControlledPaginationGrid.js", "bg": "inline"}}

## Auto size

The `autoPageSize` prop allows to auto-scale the `pageSize` to match the container height and the max number of rows that can be displayed without a vertical scroll bar.
By default, this feature is off.

{{"demo": "pages/components/data-grid/pagination/AutoPaginationGrid.js", "bg": "inline"}}

## Server-side pagination

By default, pagination works on the client-side.
To switch it to server-side, set `paginationMode="server"`.
You also need to set the `rowCount` prop so that the grid knows the total number of pages.
Finally, you need to handle the `onPageChange` callback to load the rows for the corresponding page.

{{"demo": "pages/components/data-grid/pagination/ServerPaginationGrid.js", "bg": "inline"}}

**Note**: For more information regarding server-side pagination in combination with controlled selection check [here](/components/data-grid/selection/#usage-with-server-side-pagination)

## Cursor-based pagination

You can adapt the pagination for your cursor-based pagination.
To do so, you just have to keep track of the next cursor associated with each page you fetched.

{{"demo": "pages/components/data-grid/pagination/CursorPaginationGrid.js", "bg": "inline"}}

## Customization

You can customize the rendering of the pagination in the footer following [the component section](/components/data-grid/components/#pagination) of the documentation.

## Paginate > 100 rows [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The `DataGrid` component can display up to 100 rows per page.
The `DataGridPro` component removes this limitation.
The following demo displays 200 rows per page:

{{"demo": "pages/components/data-grid/pagination/200PaginationGrid.js", "disableAd": true, "bg": "inline"}}

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ Only use this API as the last option. Give preference to the props to control the grid.

{{"demo": "pages/components/data-grid/pagination/PaginationApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
