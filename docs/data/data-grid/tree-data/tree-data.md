---
title: Data Grid - Tree data
---

# Data Grid - Tree data [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Use tree data to render grouped rows in the Data Grid.</p>

Trees are hierarchical data structures that organize data into parent-child relationships.
The Data Grid Pro can use tree data to render grouped rows with nested children.
The demo below illustrates this feature:

{{"demo": "TreeDataSimple.js", "bg": "inline", "defaultCodeOpen": false}}

## Rendering tree data

To work with tree data, pass the `treeData` and `getTreeDataPath` props to the Data Grid.
The `getTreeDataPath` function returns an array of strings representing the path to a given row.

```tsx
<DataGridPro treeData getTreeDataPath={getTreeDataPath} />
```

Both examples that follow will render a tree that looks like this:

```tsx
// - Sarah
//     - Thomas
//         - Robert
//         - Karen
```

1. Without transformation:

```tsx
const columns: GridColDef[] = [{ field: 'jobTitle', width: 250 }];

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
```

2. With transformation:

```tsx
const columns: GridColDef[] = [{ field: 'jobTitle', width: 250 }];

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
If it changes, the Data Grid assumes that the data itself has changed and recomputes the tree, causing all rows to collapse.
:::

## Customizing grouping columns with tree data

For complete details on customizing grouping columns, see [Row grouping—Grouping columns](/x/react-data-grid/row-grouping/#grouping-columns).
The implementation and behavior are the same when working with tree data, but note that the `leafField` and `mainGroupingCriteria` props are not applicable.

The demo below customizes the **Hierarchy** grouping column:

{{"demo": "TreeDataCustomGroupingColumn.js", "bg": "inline", "defaultCodeOpen": false}}

### Accessing the grouping column field

To access the grouping column field—for example, to use it with [column pinning](/x/react-data-grid/column-pinning/)—the Grid provides the `GRID_TREE_DATA_GROUPING_FIELD` constant:

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

## Group expansion with tree data

For complete details on customizing the group expansion experience, see [Row grouping—Group expansion](/x/react-data-grid/row-grouping/#group-expansion).
The implementation and behavior are the same when working with tree data.

## Automatic parent and child selection with tree data

For complete details on automatic parent and child selection, see [Row grouping—Automatic parent and child selection](/x/react-data-grid/row-grouping/#automatic-parent-and-child-selection).
The implementation and behavior are the same when working with tree data.

## Gaps in the tree

If some entries are missing to build the full tree, the Data Grid Pro will automatically create rows to fill those gaps.

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
