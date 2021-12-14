---
title: Data Grid - Group & Pivot
---

# Data Grid - Group & Pivot

<p class="description">Use grouping, pivoting, and more to analyze the data in depth.</p>

## Grouping Columns [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

Use grouping columns to group the rows according to one or several columns value</p>

> ⚠️ This feature is temporarily available on the Pro plan until the release of the Premium plan.
>
> To avoid future regression for users of the Pro plan, the feature needs to be explicitly activated using the `groupingColumns` experimental feature flag.
>
> ```tsx
> <DataGridPro experimentalFeatures={{ groupingColumns: true }} {...otherProps} />
> ```
>
> The feature is stable in its current form, and we encourage users willing to migrate to the Premium plan once available to start using it.

### Grouping columns definition

#### Initializing the grouping columns

To initialize the grouping columns without controlling them, provide the model to the `initialState` prop:

```ts
initialState={{
    groupingColumns: {
        model: ['director', 'category']
    }
}}
```

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

#### Controlling the grouping columns

To fully control the grouping columns, provide the model to the `groupingColumnsModel` prop.
Use it together with `onGroupingColumnsModelChange` to know when a grouping criteria is added or removed.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsControlled.js", "bg": "inline", "defaultCodeOpen": false}}

### Disable the grouping

#### Fully disable the grouping

To fully disable the grouping feature, set the `disableGroupingColumns` prop to `true`.

It will disable all the features related to the grouping columns, even if a model is provided.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

#### Disable the grouping for some columns

To block the grouping of certain columns, set the `canBeGrouped` property of `GridColDef` to `false`.
In the example below, the `director` column can not be grouped. And in all example, the `title` and `gross` columns can not be grouped.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsColDefCanBeGrouped.js", "bg": "inline", "defaultCodeOpen": false}}

#### Single grouping column

By default, the grid will create only one grouping column even if you have several grouping criteria.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsSingleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

#### Multiple grouping column

To have a grouping column for each grouping criteria, set the `groupingColumnMode` prop to `multiple`.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsMultipleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

### Grouping column customization

Use the `groupingColDef` prop to customize the rendering of the grouping column. You can override any property of the `GridColDef` interface except the `field`, the `type` and the properties related to the edition.

If you want to apply your overrides to every grouping column, use the object format of `groupingColDef`.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsCustomGroupingColDefObject.js", "bg": "inline", "defaultCodeOpen": false}}

If you want to only override properties of certain grouping columns or to apply different overrides based on the current grouping criteria, use the callback format of `groupingColDef`.
It will be called for each grouping column with the fields of the columns used to build it.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsCustomGroupingColDefCallback.js", "bg": "inline", "defaultCodeOpen": false}}

#### Show values for the leaves

By default, the leaves nodes don't render anything for their grouping cell.

If you want to display some value, you can provide a `leafField` property to the `groupingColDef`.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsLeafWithValue.js", "bg": "inline", "defaultCodeOpen": false}}

#### Hide the descendant count

You can use the `hideDescendantCount` property of the `groupingColDef` to hide the amount of descendant of a grouping row.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsHideDescendantCount.js", "bg": "inline", "defaultCodeOpen": false}}

### Complex grouping value

In most scenarios, when you need to handle complex values, you provide a `valueGetter` property to your column definition.
But sometimes, you need to keep the object format for the `renderCell` property and thus can not convert it to a serializable value in `valueGetter`.

You can then provide a `keyGetter` property in your column definition to convert this object into a serializable value.

```ts
const columns: GridColumns = [
  {
    field: 'composer',
    keyGetter: (params) => params.value.name,
  },
  // ...
];
```

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsKeyGetter.js", "bg": "inline", "defaultCodeOpen": false}}

If your column also have a `valueGetter` property, the value passed to the `keyGetter` property will be the one returned by `valueGetter`.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsKeyGetterValueGetter.js", "bg": "inline", "defaultCodeOpen": false}}

### Rows with missing groups

If the grouping key of a grouping criteria is `null` or `undefined` for a row, the grid will consider that this row do not have a value for this group. and will inline it for those groups.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsRowsWithMissingGroups.js", "bg": "inline", "defaultCodeOpen": false}}

### Group expansion

Use the `defaultGroupingExpansionDepth` prop to expand all the groups up to a given depth when loading the data.
If you want to expand the whole tree, set `defaultGroupingExpansionDepth = -1`

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsDefaultExpansionDepth.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `setRowChildrenExpansion` method on `apiRef` to programmatically set the expansion of a row.

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsSetChildrenExpansion.js", "bg": "inline", "defaultCodeOpen": false}}

### Sorting / Filtering

#### Single grouping column

When using `groupingColumnMode = "single"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the top level grouping criteria.

If you are rendering leaves with the `leafField` property of `groupColDef`, the sorting and filtering will be applied on the leaves based on the `sortComparator` and `filterOperators` of their original column.

In both cases, you can force the sorting and filtering to be applied on another grouping criteria with the `mainGroupingCriteria` property of `groupColDef`

> ⚠️ This feature is not yet compatible with `sortingMode = "server` and `filteringMode = "server"`

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsSortingSingleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

#### Multiple grouping column

When using `groupingColumnMode = "multiple"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the grouping criteria of each grouping column.

If you are rendering leaves on one of those columns with the `leafField` property of `groupColDef`, the sorting and filtering will be applied on the leaves for this grouping column based on the `sortComparator` and `filterOperators` of the leave's original column.

If you want to render leaves but apply the sorting and filtering on the grouping criteria of the column, you can force it by setting the `mainGroupingCriteria` property `groupColDef` to be equal to the grouping criteria.

In the example below:

- the sorting and filtering of the `company` grouping column is applied on the `company` field
- the sorting and filtering of the `director` grouping column is applied on the `director` field even though it has leaves

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsSortingMultipleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠️ If you are dynamically switching the `leafField` or `mainGroupingCriteria`, the sorting and filtering models will not automatically be cleaned-up and the sorting / filtering will not be re-applied.

### Full example

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsFullExample.js", "bg": "inline", "defaultCodeOpen": false}}

### apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

{{"demo": "pages/components/data-grid/group-pivot/GroupingColumnsApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

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

{{"demo": "pages/components/data-grid/group-pivot/TreeDataSimple.js", "bg": "inline", "defaultCodeOpen": false}}

### Grouping column customization

Same behavior as for the [Grouping Columns](##grouping-column-customization) except for the `leafField` and `mainGroupingCriteria` which are not applicable for the Tree Data.

### Group expansion

Same behavior as for the [Grouping Columns](#group-expansion)

### Gaps in the tree

If some entries are missing to build the full tree, the `DataGridPro` will automatically create rows to fill those gaps.

{{"demo": "pages/components/data-grid/group-pivot/TreeDataWithGap.js", "bg": "inline", "defaultCodeOpen": false}}

### Filtering

A node is included if one of the following criteria is met:

- at least one of its descendant is passing the filters
- it is passing the filters

By default, the filtering is applied to every depth of the tree.
You can limit the filtering to the top-level rows with the `disableChildrenFiltering` prop.

{{"demo": "pages/components/data-grid/group-pivot/TreeDataDisableChildrenFiltering.js", "bg": "inline", "defaultCodeOpen": false}}

### Sorting

By default, the sorting is applied to every depth of the tree.
You can limit the sorting to the top level rows with the `disableChildrenSorting` prop.

{{"demo": "pages/components/data-grid/group-pivot/TreeDataDisableChildrenSorting.js", "bg": "inline", "defaultCodeOpen": false}}

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

## 🚧 Master detail [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

> ⚠️ This feature isn't implemented yet. It's coming.
>
> 👍 Upvote [issue #211](https://github.com/mui-org/material-ui-x/issues/211) if you want to see it land faster.

The feature allows to display row details on an expandable pane.

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
