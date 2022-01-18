---
title: Data Grid - Group & Pivot
---

# Data Grid - Group & Pivot

<p class="description">Use grouping, pivoting, and more to analyze the data in depth.</p>

## Row grouping [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

For when you need to group rows based on repeated column values, and/or custom functions.
On the following example, we're grouping all movies based on their production `company`

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingBasicExample.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠️ This feature is temporarily available on the Pro plan until the release of the Premium plan.
>
> To avoid future regression for users of the Pro plan, the feature needs to be explicitly activated using the `rowGrouping` experimental feature flag.
>
> ```tsx
> <DataGridPro experimentalFeatures={{ rowGrouping: true }} {...otherProps} />
> ```
>
> The feature is stable in its current form, and we encourage users willing to migrate to the Premium plan once available to start using it.

### Set grouping criteria

#### Initialize the row grouping

The easiest way to get started with the feature is to provide its model to the `initialState` prop:

```ts
initialState={{
    rowGrouping: {
        model: ['company', 'director'],
    }
}}
```

The basic parameters are the columns you want to check for repeating values.
In this example, we want to group all the movies matching the same company name, followed by a second group matching the director's name.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

#### Controlled row grouping

If you need to control the state of the criteria used for grouping, use the `rowGroupingModel` prop.
You can use the `onRowGroupingModelChange` prop to listen to changes to the page size and update the prop accordingly.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingControlled.js", "bg": "inline", "defaultCodeOpen": false}}

### Grouping columns

#### Single grouping column

By default, the grid will display a single column holding all grouped columns.
If you have multiple grouped columns, this column name will be set to "Group".

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingSingleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

#### Multiple grouping column

To display a column for each grouping criterion, set the `rowGroupingColumnMode` prop to `multiple`.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingMultipleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

#### Custom grouping column

To customize the rendering of the grouping column, use the `groupingColDef` prop.
You can override the **headerName** or any property of the `GridColDef` interface, except the `field`, the `type` and the properties related to inline edition.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingCustomGroupingColDefObject.js", "bg": "inline", "defaultCodeOpen": false}}

By default, when using the object format, the properties will be applied to all Grouping columns. This means that if you have `rowGroupingColumnMode` set to `multiple`, all the columns will share the same `groupingColDef` properties.

If you wish to override properties of specific grouping columns or to apply different overrides based on the current grouping criteria, you can pass a callback function to `groupingColDef`, instead of an object with its config.
The callback is called for each grouping column, and it receives the respective column's "fields" as parameter.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingCustomGroupingColDefCallback.js", "bg": "inline", "defaultCodeOpen": false}}

#### Show values for the leaves

By default, the grouped rows display no value on their grouping columns' cells. We're calling those cells "leaves".

If you want to display some value, you can provide a `leafField` property to the `groupingColDef`.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingLeafWithValue.js", "bg": "inline", "defaultCodeOpen": false}}

#### Hide the descendant count

Use the `hideDescendantCount` property of the `groupingColDef` to hide the number of descendants of a grouping row.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingHideDescendantCount.js", "bg": "inline", "defaultCodeOpen": false}}

### Disable the row grouping

#### For all columns

You can disable row grouping by setting `disableRowGrouping` prop to true.

It will disable all the features related to the row grouping, even if a model is provided.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

#### For some columns

In case you need to disable grouping on specific column(s), set the `groupable` property on the respective column definition (`GridColDef`) to `false`.
In the example below, the `director` column can not be grouped. And in all example, the `title` and `gross` columns can not be grouped.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingColDefCanBeGrouped.js", "bg": "inline", "defaultCodeOpen": false}}

### Using `groupingValueGetter` for complex grouping value

The grouping value has to be either a `string`, a `number`, `null` or `undefined`.
If your cell value is more complex, pass a `groupingValueGetter` property to the column definition to convert it into a valid value.

```ts
const columns: GridColumns = [
  {
    field: 'composer',
    groupingValueGetter: (params) => params.value.name,
  },
  // ...
];
```

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingGroupingValueGetter.js", "bg": "inline", "defaultCodeOpen": false}}

**Note**: If your column also have a `valueGetter` property, the value passed to the `groupingValueGetter` method will still be the row value from the `row[field]`.

### Rows with missing groups

If the grouping key of a grouping criteria is `null` or `undefined` for a row, the grid will consider that this row does not have a value for this group. and will inline it for those groups.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingRowsWithMissingGroups.js", "bg": "inline", "defaultCodeOpen": false}}

### Group expansion

By default, all groups are initially displayed collapsed. You can change this behaviour by setting the `defaultGroupingExpansionDepth` prop to expand all the groups up to a given depth when loading the data.
If you want to expand the whole tree, set `defaultGroupingExpansionDepth = -1`

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingDefaultExpansionDepth.js", "bg": "inline", "defaultCodeOpen": false}}

If you want to expand groups by default according to a more complex logic, use the `isGroupExpandedByDefault` prop which is a callback receiving the node as an argument.
When defined, this callback will always have the priority over the `defaultGroupingExpansionDepth` prop.

```tsx
isGroupExpandedByDefault={
  node => node.groupingField === 'company' && node.groupingKey === '20th Century Fox'
}
```

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingIsGroupExpandedByDefault.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `setRowChildrenExpansion` method on `apiRef` to programmatically set the expansion of a row.

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingSetChildrenExpansion.js", "bg": "inline", "defaultCodeOpen": false}}

### Sorting / Filtering

#### Single grouping column

When using `rowGroupingColumnMode = "single"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the top level grouping criteria.

If you are rendering leaves with the `leafField` property of `groupColDef`, the sorting and filtering will be applied on the leaves based on the `sortComparator` and `filterOperators` of their original column.

In both cases, you can force the sorting and filtering to be applied on another grouping criteria with the `mainGroupingCriteria` property of `groupColDef`

> ⚠️ This feature is not yet compatible with `sortingMode = "server` and `filteringMode = "server"`

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingSortingSingleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

#### Multiple grouping column

When using `rowGroupingColumnMode = "multiple"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the grouping criteria of each grouping column.

If you are rendering leaves on one of those columns with the `leafField` property of `groupColDef`, the sorting and filtering will be applied on the leaves for this grouping column based on the `sortComparator` and `filterOperators` of the leave's original column.

If you want to render leaves but apply the sorting and filtering on the grouping criteria of the column, you can force it by setting the `mainGroupingCriteria` property `groupColDef` to be equal to the grouping criteria.

In the example below:

- the sorting and filtering of the `company` grouping column is applied on the `company` field
- the sorting and filtering of the `director` grouping column is applied on the `director` field even though it has leaves

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingSortingMultipleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠️ If you are dynamically switching the `leafField` or `mainGroupingCriteria`, the sorting and filtering models will not automatically be cleaned-up and the sorting / filtering will not be re-applied.

### Full example

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingFullExample.js", "bg": "inline", "defaultCodeOpen": false}}

### apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

{{"demo": "pages/components/data-grid/group-pivot/RowGroupingApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

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

### Custom grouping column

Same behavior as for the [Row grouping](#grouping-columns) except for the `leafField` and `mainGroupingCriteria` which are not applicable for the Tree Data.

{{"demo": "pages/components/data-grid/group-pivot/TreeDataCustomGroupingColumn.js", "bg": "inline", "defaultCodeOpen": false}}

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

Same behavior as for the [Row grouping](#group-expansion).

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
