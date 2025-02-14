# Data Grid - Server-side filter

<p class="description">Filter rows on the server.</p>

Filtering can be run server-side by setting the `filterMode` prop to `server`, and implementing the `onFilterModelChange` handler.

The example below demonstrates how to achieve server-side filtering.

{{"demo": "ServerFilterGrid.js", "bg": "inline"}}

:::success
You can combine server-side filtering with [server-side sorting](/x/react-data-grid/sorting/#server-side-sorting) and [server-side pagination](/x/react-data-grid/pagination/#server-side-pagination) to avoid fetching more data than needed, since it's already processed outside of the Data Grid.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
