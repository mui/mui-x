---
title: React Server-side row grouping
---

# Data Grid - Server-side row grouping [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

<p class="description">Lazy-loaded row grouping with server-side data source.</p>

To dynamically load row grouping data from the server, including lazy-loading of children, create a data source and pass the `unstable_dataSource` prop to the Data Grid, as detailed in the [overview](/x/react-data-grid/server-side-data/).

Just like [tree data](/x/react-data-grid/server-side-data/tree-data/), you need to pass some additional properties to support the row grouping feature:

- `getGroupKey`: Pass the group key for the row.
- `getChildrenCount`: Pass the number of children for the row. If the children count is not available for some reason, but there are some children, return -1.

Apart from the `groupKeys` parameter, the `getRows` callback would recieve an additional parameter `groupFields` which refers to the current `rowGroupingModel`, use it on the server side to extract the appropriate data chunk for a specific `getRows` call.

```tsx
const customDataSource: GridDataSource = {
  getRows: async (params) => {
    // Fetch the data from the server
  },
  getGroupKey: (row) => {
    // Return the group key for the row, e.g. `name`
    return row.name;
  },
  getChildrenCount: (row) => {
    // Return the number of children for the row
    return row.childrenCount;
  },
};
```

The following demo showcases how to implement server-side row grouping with a custom data source.

{{"demo": "ServerSideRowGroupingDataGrid.js", "bg": "inline"}}

:::warning
In the case of complex data, you might need to implement a custom `colDef.groupingValueGetter` to get the grouping value for the row which will then be passed in `groupKeys` parameter when calling `getRows`.

If you use it, make sure the backend understands the `groupKeys` parameters as provided by the `groupingValueGetter` to get the grouping value for the subsequent children rows.
:::

## Error handling

If an error occurs during a `getRows` call, the Data Grid will display an error message in the row group cell. `unstable_onDataSourceError` is also triggered with the error and the fetch params.

The following example demonstrates error handling by displaying both a toast notification and the default error message in the grouping cell. For simplicity, caching has been disabled in this example.

{{"demo": "ServerSideRowGroupingErrorHandling.js", "bg": "inline"}}

## Group expansion

The group expansion works in a similar way to the [data source tree data](/x/react-data-grid/server-side-data/tree-data/#group-expansion).
The following demo expands all the groups using `defaultGroupingExpansionDepth='-1'`.

{{"demo": "ServerSideRowGroupingGroupExpansion.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
