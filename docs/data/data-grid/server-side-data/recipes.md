# Data Grid - Server-side data recipes

<p class="description">Recipes for advanced data source use-cases.</p>

## Tree data nested pagination

By default, the pagination works only on the first level of the tree.
You can create the nested pagination with [row pinning](/x/react-data-grid/row-pinning/) feature as shown in the following demo.

:::warning

This demo implements nested lazy loading using row pinning, which means that certain features such as caching, row selection, and copy & paste functionality may not work as expected.

Check the [Server-side data—Nested lazy loading](/x/react-data-grid/server-side-data/lazy-loading/#nested-lazy-loading) section for updates on an internal implementation.

:::

{{"demo": "ServerSideTreeDataNestedPagination.js", "bg": "inline"}}
