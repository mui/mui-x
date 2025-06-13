# Data Grid - Server-side data recipes

<p class="description">Recipes for some advanced use-cases.</p>

## Tree data nested pagination

By default, the pagination works only on the first level of the tree.
You can enable the nested pagination in the userland by using the pinned rows feature, as shown in the following demo.

:::warning

This demo implements nested lazy loading using row pinning, which means certain features such as caching, row selection, and copy & paste functionality may not work as expected.

Kindly check the [Server-side data—Nested lazy loading](/x/react-data-grid/server-side-data/lazy-loading/#nested-lazy-loading) section to see updates on an internal implementation.

:::

{{"demo": "ServerSideTreeDataNestedPagination.js", "bg": "inline"}}
