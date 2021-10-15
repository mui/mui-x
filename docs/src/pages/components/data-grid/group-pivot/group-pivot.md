---
title: Data Grid - Group & Pivot
---

# Data Grid - Group & Pivot

<p class="description">Use grouping, pivoting and more to analyse the data in depth.</p>

## Tree data [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

Tree data allows to display data with parent / child relationships.

### Basic example

To enable the Tree Data, you must use the `treeData` prop as well as provide a `getTreeDataPath` prop.
The `getTreeDataPath` function returns an array of strings which represents the path to a given element of the tree.

```tsx
// Without transformation
const rows: GridRows = [
    { id: 0, path: ['A'] },
    { id: 1, path: ['A', 'A'] },
    { id: 2, path: ['A', 'B'] },
    { id: 3, path: ['A', 'C'] },
    { id: 4, path: ['A', 'B', 'A'] },
    { id: 5, path: ['B'] }
];

<DataGridPro
    treeData
    getTreeDataPath={(row) => row.path}
    rows={rows}
    {/* ...other props */}
/>

// With transformation
const rows: GridRows = [
    { id: 0, path: 'A' },
    { id: 1, path: 'A.A' },
    { id: 2, path: 'A.B' },
    { id: 3, path: 'A.C' },
    { id: 4, path: 'A.B.A' },
    { id: 5, path: 'B' }
];

<DataGridPro
    treeData
    getTreeDataPath={(row) => row.path.split('.')}
    rows={rows}
    {/* ...other props */}
/>
```

{{"demo": "pages/components/data-grid/group-pivot/BasicTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom grouping column

Use the `groupingColDef` prop to customize the rendering of the grouping column.

{{"demo": "pages/components/data-grid/group-pivot/CustomGroupingColumnTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

### Group expansion

Use the `defaultGroupingExpansionDepth` prop to expand all the groups up to a given depth when loading the data.
If you want to expand the whole tree, set `defaultGroupingExpansionDepth = -1`

{{"demo": "pages/components/data-grid/group-pivot/DefaultGroupingExpansionDepthTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `UNSTABLE_setRowExpansion` method on `apiRef` to programmatically set the expansion of a row.

{{"demo": "pages/components/data-grid/group-pivot/SetRowExpansionTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

### Gaps in the tree

If some entries are missing to build the full tree, the `DataGridPro` will automatically create rows to fill those gaps.

{{"demo": "pages/components/data-grid/group-pivot/FillerTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

### Filtering

A node is included if one of the following criteria is met:

- at least one of its descendant is passing the filters
- it is passing the filters

By default, the filtering is applied to every depth of the tree.
You can limit the filtering to the top level rows by with the `disableChildrenFiltering`.

{{"demo": "pages/components/data-grid/group-pivot/DisableChildrenFilteringTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

### Sorting

By default, the sorting is applied to every depth of the tree.
You can limit the filtering to the top level rows by with the `disableChildrenSorting`.

{{"demo": "pages/components/data-grid/group-pivot/DisableChildrenSortingTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

## 🚧 Master detail [<span class="pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #211](https://github.com/mui-org/material-ui-x/issues/211) if you want to see it land faster.

The feature allows to display row details on an expandable pane.

## 🚧 Grouping [<span class="premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #212](https://github.com/mui-org/material-ui-x/issues/212) if you want to see it land faster.

Group rows together that share a column value, this creates a visible header for each group and allows the end-user to collapse groups that they don't want to see.

## 🚧 Aggregation [<span class="premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #213](https://github.com/mui-org/material-ui-x/issues/213) if you want to see it land faster.

When grouping, you will be able to apply an aggregation function to populate the group row with values.

## 🚧 Pivoting [<span class="premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #214](https://github.com/mui-org/material-ui-x/issues/214) if you want to see it land faster.

Pivoting will allow you to take a columns values and turn them into columns.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
