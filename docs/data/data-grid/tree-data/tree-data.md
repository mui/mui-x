---
title: Data Grid - Tree data
---

# Data Grid - Tree data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Use Tree data to handle rows with parent / child relationship.</p>

To enable the Tree data, you simply have to use the `treeData` prop as well as provide a `getTreeDataPath` prop.
The `getTreeDataPath` function returns an array of strings which represents the path to a given row.

```tsx
// The following examples will both render the same tree
// - Sarah
//     - Thomas
//         - Robert
//         - Karen

const columns: GridColDef[] = [{ field: 'jobTitle', width: 250 }];

// Without transformation
const rows: GridRowsProp = [
  { path: ['Sarah'], jobTitle: 'CEO', id: 0 },
  { path: ['Sarah', 'Thomas'], jobTitle: 'Head of Sales', id: 1 },
  { path: ['Sarah', 'Thomas', 'Robert'], jobTitle: 'Sales Person', id: 2 },
  { path: ['Sarah', 'Thomas', 'Karen'], jobTitle: 'Sales Person', id: 3 },
];

const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) => row.path;

<DataGridPro
  treeData
  getTreeDataPath={getTreeDataPath}
  rows={rows}
  columns={columns}
/>;

// With transformation
const rows: GridRowsProp = [
  { path: 'Sarah', jobTitle: 'CEO', id: 0 },
  { path: 'Sarah/Thomas', jobTitle: 'Head of Sales', id: 1 },
  { path: 'Sarah/Thomas/Robert', jobTitle: 'Sales Person', id: 2 },
  { path: 'Sarah/Thomas/Karen', jobTitle: 'Sales Person', id: 3 },
];

const getTreeDataPath: DataGridProProps['getTreeDataPath'] = (row) =>
  row.path.split('/');

<DataGridPro
  treeData
  getTreeDataPath={getTreeDataPath}
  rows={rows}
  columns={columns}
/>;
```

:::warning
The `getTreeDataPath` prop should keep the same reference between two renders.
If it changes, the data grid will consider that the data has changed and will recompute the tree resulting in collapsing all the rows.
:::

{{"demo": "TreeDataSimple.js", "bg": "inline", "defaultCodeOpen": false}}

## Custom grouping column

Same behavior as for the [Row grouping](/x/react-data-grid/row-grouping/#grouping-columns) except for the `leafField` and `mainGroupingCriteria` which are not applicable for the Tree data.

{{"demo": "TreeDataCustomGroupingColumn.js", "bg": "inline", "defaultCodeOpen": false}}

### Accessing the grouping column field

If you want to access the grouping column field, for instance, to use it with column pinning, the `GRID_TREE_DATA_GROUPING_FIELD` constant is available.

```tsx
<DataGridPro
  treeData
  initialState={{
    pinnedColumns: {
      left: [GRID_TREE_DATA_GROUPING_FIELD],
    },
  }}
  {...otherProps}
/>
```

## Group expansion

Same behavior as for the [Row grouping](/x/react-data-grid/row-grouping/#group-expansion).

## Gaps in the tree

If some entries are missing to build the full tree, the `DataGridPro` will automatically create rows to fill those gaps.

{{"demo": "TreeDataWithGap.js", "bg": "inline", "defaultCodeOpen": false}}

## Filtering

A node is included if one of the following criteria is met:

- at least one of its descendants is passing the filters
- it is passing the filters

By default, the filtering is applied to every depth of the tree.
You can limit the filtering to the top-level rows with the `disableChildrenFiltering` prop.

{{"demo": "TreeDataDisableChildrenFiltering.js", "bg": "inline", "defaultCodeOpen": false}}

## Sorting

By default, the sorting is applied to every depth of the tree.
You can limit the sorting to the top-level rows with the `disableChildrenSorting` prop.

{{"demo": "TreeDataDisableChildrenSorting.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
If you are using `sortingMode="server"`, the children of a row must always immediately follow their parent.
For instance:

```ts
// ✅ The row A.A is immediately after its parent
const validRows = [{ path: ['A'] }, { path: ['A', 'A'] }, { path: ['B'] }];

// ❌ The row A.A is not immediately after its parent
const invalidRows = [{ path: ['A'] }, { path: ['B'] }, { path: ['A', 'A'] }];
```

:::

## Children lazy-loading

Check the [Server-side tree data](/x/react-data-grid/server-side-data/tree-data/) section for more information about lazy-loading tree data children.

## Full example

{{"demo": "TreeDataFullExample.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
