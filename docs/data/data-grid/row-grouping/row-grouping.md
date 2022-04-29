---
title: Data Grid - Row Grouping
---

# Data Grid - Row grouping [<span class="plan-premium"></span>](https://mui.com/store/items/material-ui-pro/)

<p class="description">Group your rows according to some column values.</p>

For when you need to group rows based on repeated column values, and/or custom functions.
In the following example, we're grouping all movies based on their production `company`

{{"demo": "RowGroupingBasicExample.js", "bg": "inline", "defaultCodeOpen": false}}

## Set grouping criteria

### Initialize the row grouping

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

{{"demo": "RowGroupingInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled row grouping

If you need to control the state of the criteria used for grouping, use the `rowGroupingModel` prop.
You can use the `onRowGroupingModelChange` prop to listen to changes to the grouping criteria and update the prop accordingly.

{{"demo": "RowGroupingControlled.js", "bg": "inline", "defaultCodeOpen": false}}

## Grouping columns

### Single grouping column

By default, the grid will display a single column holding all grouped columns.
If you have multiple grouped columns, this column name will be set to "Group".

{{"demo": "RowGroupingSingleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

### Multiple grouping columns

To display a column for each grouping criterion, set the `rowGroupingColumnMode` prop to `multiple`.

{{"demo": "RowGroupingMultipleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom grouping column

To customize the rendering of the grouping column, use the `groupingColDef` prop.
You can override the **headerName** or any property of the `GridColDef` interface, except the `field`, the `type`, and the properties related to inline edition.

{{"demo": "RowGroupingCustomGroupingColDefObject.js", "bg": "inline", "defaultCodeOpen": false}}

By default, when using the object format, the properties will be applied to all Grouping columns. This means that if you have `rowGroupingColumnMode` set to `multiple`, all the columns will share the same `groupingColDef` properties.

If you wish to override properties of specific grouping columns or to apply different overrides based on the current grouping criteria, you can pass a callback function to `groupingColDef`, instead of an object with its config.
The callback is called for each grouping column, and it receives the respective column's "fields" as parameter.

{{"demo": "RowGroupingCustomGroupingColDefCallback.js", "bg": "inline", "defaultCodeOpen": false}}

### Show values for the leaves

By default, the grouped rows display no value on their grouping columns' cells. We're calling those cells "leaves".

If you want to display some value, you can provide a `leafField` property to the `groupingColDef`.

{{"demo": "RowGroupingLeafWithValue.js", "bg": "inline", "defaultCodeOpen": false}}

### Hide the descendant count

Use the `hideDescendantCount` property of the `groupingColDef` to hide the number of descendants of a grouping row.

{{"demo": "RowGroupingHideDescendantCount.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable the row grouping

### For all columns

You can disable row grouping by setting `disableRowGrouping` prop to true.

It will disable all the features related to the row grouping, even if a model is provided.

{{"demo": "RowGroupingDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

### For some columns

In case you need to disable grouping on specific column(s), set the `groupable` property on the respective column definition (`GridColDef`) to `false`.
In the example below, the `director` column can not be grouped. And in all example, the `title` and `gross` columns can not be grouped.

{{"demo": "RowGroupingColDefCanBeGrouped.js", "bg": "inline", "defaultCodeOpen": false}}

## Using `groupingValueGetter` for complex grouping value

The grouping value has to be either a `string`, a `number`, `null`, or `undefined`.
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

{{"demo": "RowGroupingGroupingValueGetter.js", "bg": "inline", "defaultCodeOpen": false}}

**Note**: If your column also has a `valueGetter` property, the value passed to the `groupingValueGetter` method will still be the row value from the `row[field]`.

## Rows with missing groups

If the grouping key of a grouping criteria is `null` or `undefined` for a row, the grid will consider that this row does not have a value for this group. and will inline it for those groups.

{{"demo": "RowGroupingRowsWithMissingGroups.js", "bg": "inline", "defaultCodeOpen": false}}

## Group expansion

By default, all groups are initially displayed collapsed. You can change this behavior by setting the `defaultGroupingExpansionDepth` prop to expand all the groups up to a given depth when loading the data.
If you want to expand the whole tree, set `defaultGroupingExpansionDepth = -1`

{{"demo": "RowGroupingDefaultExpansionDepth.js", "bg": "inline", "defaultCodeOpen": false}}

If you want to expand groups by default according to a more complex logic, use the `isGroupExpandedByDefault` prop which is a callback receiving the node as an argument.
When defined, this callback will always have priority over the `defaultGroupingExpansionDepth` prop.

```tsx
isGroupExpandedByDefault={
  node => node.groupingField === 'company' && node.groupingKey === '20th Century Fox'
}
```

{{"demo": "RowGroupingIsGroupExpandedByDefault.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `setRowChildrenExpansion` method on `apiRef` to programmatically set the expansion of a row.

{{"demo": "RowGroupingSetChildrenExpansion.js", "bg": "inline", "defaultCodeOpen": false}}

## Sorting / Filtering

### Single grouping column

When using `rowGroupingColumnMode = "single"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the top-level grouping criteria.

If you are rendering leaves with the `leafField` property of `groupColDef`, the sorting and filtering will be applied on the leaves based on the `sortComparator` and `filterOperators` of their original column.

In both cases, you can force the sorting and filtering to be applied on another grouping criteria with the `mainGroupingCriteria` property of `groupColDef`

> ⚠️ This feature is not yet compatible with `sortingMode = "server"` and `filteringMode = "server"`

{{"demo": "RowGroupingSortingSingleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

### Multiple grouping columns

When using `rowGroupingColumnMode = "multiple"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the grouping criteria of each grouping column.

If you are rendering leaves on one of those columns with the `leafField` property of `groupColDef`, the sorting and filtering will be applied on the leaves for this grouping column based on the `sortComparator` and `filterOperators` of the leave's original column.

If you want to render leaves but apply the sorting and filtering on the grouping criteria of the column, you can force it by setting the `mainGroupingCriteria` property `groupColDef` to be equal to the grouping criteria.

In the example below:

- the sorting and filtering of the `company` grouping column is applied on the `company` field
- the sorting and filtering of the `director` grouping column is applied on the `director` field even though it has leaves

{{"demo": "RowGroupingSortingMultipleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

> ⚠️ If you are dynamically switching the `leafField` or `mainGroupingCriteria`, the sorting and filtering models will not automatically be cleaned-up and the sorting/filtering will not be re-applied.

## Get the rows in a group

You can use the `apiRef.current.getRowGroupChildren` method to get the id of all rows contained in a group.
It will not contain the autogenerated rows (i.e. the subgroup rows or the aggregation footers).

```ts
const rows: GridRowId[] = apiRef.current.getRowGroupChildren({
  groupId: params.id,

  // If true, the rows will be in the order displayed on screen
  applySorting: true,

  // If true, only the rows matching the current filters will be returned
  applyFiltering: true,
});
```

If you want to get the row ids of a group given its grouping criteria, use `getGroupRowIdFromPath`

```ts
const rows = apiRef.current.getRowGroupChildren({
  groupId: getGroupRowIdFromPath([{ field: 'company', key: 'Disney Studios' }]),
});
```

{{"demo": "RowGroupingGetRowGroupChildren.js", "bg": "inline", "defaultCodeOpen": false}}

## Full example

{{"demo": "RowGroupingFullExample.js", "bg": "inline", "defaultCodeOpen": false}}

## apiRef [<span class="plan-pro"></span>](https://mui.com/store/items/material-ui-pro/)

{{"demo": "RowGroupingApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
