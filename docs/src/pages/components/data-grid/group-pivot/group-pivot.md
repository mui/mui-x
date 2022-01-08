---
title: Data Grid - Group & Pivot
---

# Data Grid - Group & Pivot

<p class="description">Use grouping, pivoting, and more to analyze the data in depth.</p>

## Tree Data [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

Tree Data allows to display data with parent/child relationships.

To enable the Tree Data, you simply have to use the `treeData` prop as well as provide a `getTreeDataPath` prop.
The `getTreeDataPath` function returns an array of strings which represents the path to a given row.

```tsx
// The following examples will both render the same tree
// - Sarah
//     - Thomas
//         - Robert
//         - Karen

const columns: GridColumns = [{ field: 'jobTitle', width: 250 }];

// Without transformation
const rows: GridRowsProp = [
  { path: ['Sarah'], jobTitle: 'CEO', id: 0 },
  { path: ['Sarah', 'Thomas'], jobTitle: 'Head of Sales', id: 1 },
  { path: ['Sarah', 'Thomas', 'Robert'], jobTitle: 'Sales Person', id: 2 },
  { path: ['Sarah', 'Thomas', 'Karen'], jobTitle: 'Sales Person', id: 3 },
];

<DataGridPro
  treeData
  getTreeDataPath={(row) => row.path}
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

<DataGridPro
  treeData
  getTreeDataPath={(row) => row.path.split('/')}
  rows={rows}
  columns={columns}
/>;
```

{{"demo": "pages/components/data-grid/group-pivot/BasicTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom grouping column

Use the `groupingColDef` prop to customize the rendering of the grouping column.

{{"demo": "pages/components/data-grid/group-pivot/CustomGroupingColumnTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

#### Accessing the grouping column field

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

### Group expansion

Use the `defaultGroupingExpansionDepth` prop to expand all the groups up to a given depth when loading the data.
If you want to expand the whole tree, set `defaultGroupingExpansionDepth = -1`

{{"demo": "pages/components/data-grid/group-pivot/DefaultGroupingExpansionDepthTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `setRowChildrenExpansion` method on `apiRef` to programmatically set the expansion of a row.

{{"demo": "pages/components/data-grid/group-pivot/SetRowExpansionTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

### Gaps in the tree

If some entries are missing to build the full tree, the `DataGridPro` will automatically create rows to fill those gaps.

{{"demo": "pages/components/data-grid/group-pivot/TreeDataWithGap.js", "bg": "inline", "defaultCodeOpen": false}}

### Filtering

A node is included if one of the following criteria is met:

- at least one of its descendant is passing the filters
- it is passing the filters

By default, the filtering is applied to every depth of the tree.
You can limit the filtering to the top-level rows with the `disableChildrenFiltering` prop.

{{"demo": "pages/components/data-grid/group-pivot/DisableChildrenFilteringTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

### Sorting

By default, the sorting is applied to every depth of the tree.
You can limit the sorting to the top level rows with the `disableChildrenSorting` prop.

{{"demo": "pages/components/data-grid/group-pivot/DisableChildrenSortingTreeData.js", "bg": "inline", "defaultCodeOpen": false}}

> If you are using `sortingMode="server"`, you need to always put the children of a row after its parent.
> For instance:
>
> ```ts
> // ✅ The row A.A is immediately after its parent
> const validRows = [{ path: ['A'] }, { path: ['A', 'A'] }, { path: ['B'] }];
>
> // ❌ The row A.A is not immediately after its parent
> const invalidRows = [{ path: ['A'] }, { path: ['B'] }, { path: ['A', 'A'] }];
> ```

### Full example

{{"demo": "pages/components/data-grid/group-pivot/TreeDataFullExample.js", "bg": "inline", "defaultCodeOpen": false}}

## Master detail [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

The master detail allows to expand a row to display additional information inside a panel.
To start using this feature, pass a function to the `getDetailPanelContent` prop with the content to be rendered inside the panel.
Any valid React element can be used as the row detail, even another grid.

The height of the detail panel content needs to be provided upfront.
The grid assumes the value of 500px by default.
However, this can be configured by passing a function to the `getDetailPanelHeight` prop.
Both props are called with a [`GridRowParams`](/api/data-grid/grid-row-params/) object, allowing to return a different value for each row.

```tsx
<DataGridPro
  getDetailPanelContent={({ row }) => <div>Row ID: {row.id}</div>}
  getDetailPanelHeight={({ row }) => 100} // Optional, default is 500px.
/>
```

To expand a row, click in the "i" icon or press <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> inside one of the cells of the row.
Returning `null` or `undefined` as the value of `getDetailPanelContent` will prevent the respective row from being expanded.

{{"demo": "pages/components/data-grid/group-pivot/BasicDetailPanels.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠ Always memoize the function provided to `getDetailPanelContent` and `getDetailPanelHeight`.
> The grid bases on the referential value of these props to cache their values and optimize the rendering.
>
> ```tsx
> const getDetailPanelContent = React.useCallback(() => { ... }, []);
>
> <DataGridPro getDetailPanelContent={getDetailPanelContent} />
> ```

> ⚠ Depending on the height of the detail panel, you may see a blank space when scrolling.
> This is caused because the grid uses a lazy approach to update the rendered rows.
> Set `rowThreshold` to 0 to fix it:
>
> ```tsx
> <DataGridPro rowThreshold={0} />
> ```

### Controlling the detail panels

To control which rows are expanded, pass a list of row ids to the `detailPanelExpandedRowIds` prop.
The `onDetailPanelExpandedRowIds` prop can be used to detect when a row is expanded or collapsed.

On the other hand, if you only want to initialize the grid with some rows already expanded, use the `initialState` prop as follow:

```tsx
<DataGridPro initialState={{ detailPanel: { expandedRowIds: [1, 2, 3] } }}>
```

{{"demo": "pages/components/data-grid/group-pivot/ControlMasterDetail.js", "bg": "inline", "defaultCodeOpen": false}}

### Using a form as detail panel

As an alternative to the built-in [row editing](/components/data-grid/editing/#row-editing), a form component can be rendered inside the detail panel, allowing to edit the current row values.

The following demo integrates with [react-hook-form](https://react-hook-form.com/), but other form libraries can also be used instead.

{{"demo": "pages/components/data-grid/group-pivot/FormDetailPanel.js", "bg": "inline", "defaultCodeOpen": false}}

### Customize the detail panel toggle

To change the icon used for the toggle, you can provide a different component for the [icon slot](/components/data-grid/components/#icons) as follow:

```tsx
<DataGridPro components={{ DetailPanelToggleIcon: CustomIcon }}>
```

Although, if this is not sufficient, the entire toggle component can be overriden.
To fully customize it, define a column with `field: GRID_DETAIL_PANEL_TOGGLE_FIELD`.
The new toggle component can be provided via `renderCell`.
It is recommended to first spread `GRID_DETAIL_PANEL_TOGGLE_COL_DEF` when defining the column, since it provides a good set of default values to start with.

```tsx
<DataGridPro
  columns={[
    {
      ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF, // Already contains the right field
      renderCell: (params) => <CustomDetailPanelToggle {...params}>
    },
  ]}
/>
```

This approach can also be used to change the location of the toggle column, as showed below.
The grid detects the special field and does not add a second column.

{{"demo": "pages/components/data-grid/group-pivot/CustomizeDetailPanelToggle.js", "bg": "inline", "defaultCodeOpen": false}}

**Note**: As any ordinary cell renderer, the `value` prop is also available and it corresponds to the state of the row: `true` when expanded and `false` when collapsed.

### Disable detail panel content scroll

By default, the detail panel has as width the sum of the widths of all columns.
This means that, when a horizontal scrollbar is present, scrolling it will also scroll the panel content.
To avoid this behavior, set the size of the detail panel to the outer size of the grid.
Use `apiRef.current.getRootDimensions()` to get the latest dimension values.
Finally, to prevent the panel from scrolling, set `position: sticky` and `left: 0`.

The following demo demonstrates how this can be achieved.
Notice that the toggle column is pinned to make sure that it will always be visible when scrolled.

{{"demo": "pages/components/data-grid/group-pivot/FullWidthDetailPanel.js", "bg": "inline", "defaultCodeOpen": false}}

### apiRef

{{"demo": "pages/components/data-grid/group-pivot/DetailPanelApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## 🚧 Grouping [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #212](https://github.com/mui-org/material-ui-x/issues/212) if you want to see it land faster.

Group rows together that share a column value, this creates a visible header for each group and allows the end-user to collapse groups that they don't want to see.

## 🚧 Aggregation [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #213](https://github.com/mui-org/material-ui-x/issues/213) if you want to see it land faster.

When grouping, you will be able to apply an aggregation function to populate the group row with values.

## 🚧 Pivoting [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #214](https://github.com/mui-org/material-ui-x/issues/214) if you want to see it land faster.

Pivoting will allow you to take a columns values and turn them into columns.

## API

- [DataGrid](/api/data-grid/data-grid/)
- [DataGridPro](/api/data-grid/data-grid-pro/)
