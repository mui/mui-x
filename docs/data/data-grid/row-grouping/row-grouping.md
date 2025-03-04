---
title: Data Grid - Row grouping
---

# Data Grid - Row grouping [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Group rows together based on column values in the Data Grid.</p>

The Data Grid Premium provides a row grouping feature which makes it possible to create subsets of rows based on repeated column values or custom functions.

For example, in the demo below, movies are grouped based on their respective values in the production company column:

{{"demo": "RowGroupingBasicExample.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
This document covers client-side implementation.
For row grouping on the server side, see [server-side row grouping](/x/react-data-grid/server-side-data/row-grouping/).
:::

## Initializing row grouping

To initialize row grouping, provide a model to the `initialState` prop.
The model's parameters must correspond to the columns to be checked for repeating values.

```ts
<DataGridPremium
  initialState={{
    rowGrouping: {
      model: ['company', 'director'],
    },
  }}
/>
```

This example groups all movies matching the same company name, followed by a second group matching the director's name.

{{"demo": "RowGroupingInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

## Controlled row grouping

Use the `rowGroupingModel` prop to control the state of the criteria used for grouping.
You can use the `onRowGroupingModelChange` prop to listen to changes to the grouping criteria and update the prop accordingly.

{{"demo": "RowGroupingControlled.js", "bg": "inline", "defaultCodeOpen": false}}

## Grouping columns

### Single grouping column

By default, the Data Grid displays a single column holding all grouping columns.
If you have multiple grouping criteria, this column name will be set to **Group**.

{{"demo": "RowGroupingSingleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

### Multiple grouping columns

To display a column for each grouping criterion, set the `rowGroupingColumnMode` prop to `multiple`.

{{"demo": "RowGroupingMultipleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom grouping column

Use the `groupingColDef` prop to customize the rendering of the grouping column.
You can override the header name and any other property of the `GridColDef` interface, with the exceptions of the `field`, the `type`, and the properties related to inline edition.

{{"demo": "RowGroupingCustomGroupingColDefObject.js", "bg": "inline", "defaultCodeOpen": false}}

By default, when using the object format, the properties are applied to all grouping columns.
This means that if `rowGroupingColumnMode` is set to `multiple`, all the columns will share the same `groupingColDef` properties.

To override properties for specific grouping columns, or to apply different overrides based on the current grouping criteria, you can pass a callback function to `groupingColDef` instead of an object with its config.
The callback is called for each grouping column, and it receives the respective column's fields as parameters.

{{"demo": "RowGroupingCustomGroupingColDefCallback.js", "bg": "inline", "defaultCodeOpen": false}}

### Grouping rows with custom cell renderer

By default, when rows are grouped by a column with a custom cell component (`GridColDef['renderCell']`), the same custom cell component is used in the grouping column.

{{"demo": "RowGroupingCustomCell.js", "bg": "inline", "defaultCodeOpen": false}}

You can opt out of this default behavior by returning `params.value` in `renderCell` for grouping rows instead:

```tsx
const ratingColDef: GridColDef = {
  // ...
  renderCell: (params) => {
    if (params.rowNode.type === 'group') {
      return params.value;
    }

    return (
      // ...
    );
  },
};
```

{{"demo": "RowGroupingCustomCellDefault.js", "bg": "inline", "defaultCodeOpen": false}}

### Show values for leaves

By default, grouped rows display no value in their grouping column cells—these cells are called **leaves**.
To display a value in a leaf, provide the `leafField` property to the `groupingColDef`.

{{"demo": "RowGroupingLeafWithValue.js", "bg": "inline", "defaultCodeOpen": false}}

### Hide descendant count

Use the `hideDescendantCount` property of the `groupingColDef` to hide the number of descendants of a grouping row.

{{"demo": "RowGroupingHideDescendantCount.js", "bg": "inline", "defaultCodeOpen": false}}

### Hide grouped columns

By default, the columns used to group rows remain visible.
For instance, when grouping based on a column called `"director"`, there are actually two columns with the title **Director**:

1. The _grouped_ column – the column from which the rows are grouped
2. The _grouping_ column – the column with which you can toggle the groups

You can use the `useKeepGroupedColumnsHidden` utility hook to hide the grouped columns.
This hook automatically hides the columns when added to the model, and displays them when removed.

:::warning
This hook is not compatible with the deprecated column property `hide`.

You can manage column visibility with `columnVisibilityModel`, `initialState`, or both together.
To do so, pass them to the hook parameters.
:::

The two examples below show how to use `columnVisibilityModel` and `initialState` with the `useKeepGroupedColumnsHidden` hook.
You can mix the two examples to support both at the same time.

```tsx
// Usage with the initial state
const apiRef = useGridApiRef();

const initialState = useKeepGroupedColumnsHidden({
  apiRef,
  initialState: {
    rowGrouping: {
      model: ['company'],
    },
    columns: {
      // Other hidden columns
      columnVisibilityModel: { gross: false },
    },
  },
});

return <DataGridPremium {...data} apiRef={apiRef} initialState={initialState} />;
```

```tsx
// Usage with the controlled model
const apiRef = useGridApiRef();

const [rowGroupingModel, setRowGroupingModel] = React.useState([
  'company',
  'director',
]);

const initialState = useKeepGroupedColumnsHidden({
  apiRef,
  rowGroupingModel,
});

return (
  <DataGridPremium
    {...data}
    apiRef={apiRef}
    initialState={initialState}
    rowGroupingModel={rowGroupingModel}
  />
);
```

{{"demo": "RowGroupingUseKeepGroupedColumnsHidden.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable row grouping

### For all columns

To disable row grouping for all columns, set the `disableRowGrouping` prop to `true`.
This disables all features related to row grouping, even if a model is provided.

{{"demo": "RowGroupingDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

### For specific columns

To disable grouping on a given column, set the `groupable` property on its respective column definition (`GridColDef`) to `false`.
In the example below, the `director` column cannot be grouped.
In all examples, the `title` and `gross` columns cannot be grouped.

{{"demo": "RowGroupingColDefCanBeGrouped.js", "bg": "inline", "defaultCodeOpen": false}}

### Grouping non-groupable columns

To apply row grouping programmatically on non-groupable columns (columns with `groupable: false` in the [column definition](/x/api/data-grid/grid-col-def/)), you can provide the row grouping model in one of three ways:

1. Pass `rowGrouping.model` to the `initialState` prop. This [initializes grouping](/x/react-data-grid/row-grouping/#initializing-row-grouping) with the provided model.
2. Provide the `rowGroupingModel` prop. This [controls grouping](/x/react-data-grid/row-grouping/#controlled-row-grouping) with the provided model.
3. Call the API method `setRowGroupingModel`. This sets the aggregation with the provided model.

In the following example, the `company` column is not groupable through the interface, but the `rowGroupingModel` prop is passed to generate a read-only row group.

{{"demo": "RowGroupingReadOnly.js", "bg": "inline", "defaultCodeOpen": false}}

## Complex grouping values

The grouping value must be either a string, a number, `null`, or `undefined`.
If your cell value is more complex, pass a `groupingValueGetter` property to the column definition to convert it into a valid value.

```ts
const columns: GridColDef[] = [
  {
    field: 'composer',
    groupingValueGetter: (value) => value.name,
  },
  // ...
];
```

{{"demo": "RowGroupingGroupingValueGetter.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
If your column also has a `valueGetter` property, the value passed to the `groupingValueGetter` method will still be the row value from the `row[field]`.
:::

## Rows with missing groups

If a grouping criterion's key is `null` or `undefined` for a given row, the Data Grid will consider that this row doesn't have a value for this group, and will inline it for those groups.
The demo below illustrates this behavior:

{{"demo": "RowGroupingRowsWithMissingGroups.js", "bg": "inline", "defaultCodeOpen": false}}

## Group expansion

By default, all groups are initially displayed collapsed.
You can change this behavior by setting the `defaultGroupingExpansionDepth` prop to expand all the groups up to a given depth when loading the data.
To expand the whole tree, set `defaultGroupingExpansionDepth = -1`.

{{"demo": "RowGroupingDefaultExpansionDepth.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `isGroupExpandedByDefault()` prop to expand groups by default according to more complex logic. This prop is a callback that receives a node as an argument.
When defined, this callback always takes priority over the `defaultGroupingExpansionDepth` prop.

```tsx
isGroupExpandedByDefault={
  node => node.groupingField === 'company' && node.groupingKey === '20th Century Fox'
}
```

{{"demo": "RowGroupingIsGroupExpandedByDefault.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `setRowChildrenExpansion()` method on `apiRef` to programmatically set the expansion of a row. Changing the expansion of a row emits a `rowExpansionChange` event that you can listen for to react to the expansion change.

{{"demo": "RowGroupingSetChildrenExpansion.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
The `apiRef.current.setRowChildrenExpansion()` method is not compatible with [server-side tree data](/x/react-data-grid/server-side-data/tree-data/) or [server-side row grouping](/x/react-data-grid/server-side-data/row-grouping/).
Use `apiRef.current.dataSource.fetchRows()` instead.
:::

### Customize grouping cell indent

Use the `--DataGrid-cellOffsetMultiplier` CSS variable to change the default cell indentation, as shown here:

```tsx
<DataGridPremium
  sx={{
    // default value is 2
    '--DataGrid-cellOffsetMultiplier': 6,
  }}
/>
```

{{"demo": "RowGroupingCustomCellIndent.js", "bg": "inline", "defaultCodeOpen": false}}

## Sorting and filtering

### Single grouping column

When using `rowGroupingColumnMode = "single"`, the default behavior is to:

- sort each grouping criterion using the column's `sortComparator`
- apply the `filterOperators` of the top-level grouping criteria

If you are rendering leaves with the `leafField` property of the `groupingColDef`, sorting and filtering will be applied on the leaves based on the `sortComparator` and `filterOperators` of their original column.

You can force the filtering to be applied to other grouping criteria with the `mainGroupingCriteria` property of `groupingColDef`.

{{"demo": "RowGroupingFilteringSingleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

### Multiple grouping columns

When using `rowGroupingColumnMode = "multiple"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the grouping criteria of each grouping column.

If you are rendering leaves on one of those columns with the `leafField` property of `groupingColDef`, sorting and filtering will be applied on the leaves for this grouping column based on the `sortComparator` and `filterOperators` of the leave's original column.

If you want to render leaves but apply the sorting and filtering on the grouping criteria of the column, you can force it by setting the `mainGroupingCriteria` property `groupingColDef` to be equal to the grouping criteria.

In the example below:

- the sorting and filtering of the `company` grouping column is applied on the `company` field
- the sorting and filtering of the `director` grouping column is applied on the `director` field even though it has leaves

{{"demo": "RowGroupingSortingMultipleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
If you are dynamically switching the `leafField` or `mainGroupingCriteria`, the sorting and filtering models will not be cleaned up automatically, and the sorting/filtering will not be re-applied.
:::

## Automatic parent and children selection

By default, selecting a parent row selects all its descendants automatically.
You can customize this behavior by using the `rowSelectionPropagation` prop.

Here's how it's structured:

```ts
type GridRowSelectionPropagation = {
  descendants?: boolean; // default: true
  parents?: boolean; // default: true
};
```

When `rowSelectionPropagation.descendants` is set to `true`.

- Selecting a parent selects all its filtered descendants automatically.
- Deselecting a parent row deselects all its filtered descendants automatically.

When `rowSelectionPropagation.parents` is set to `true`.

- Selecting all the filtered descendants of a parent selects the parent automatically.
- Deselecting a descendant of a selected parent deselects the parent automatically.

The example below demonstrates the usage of the `rowSelectionPropagation` prop.

{{"demo": "RowGroupingPropagateSelection.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
The row selection propagation also affects the "Select all" checkbox like any other group checkbox.
:::

:::info
The selected rows that do not pass the filtering criteria are automatically deselected when the filter is applied. Row selection propagation is not applied to the unfiltered rows.
:::

:::warning
If `props.disableMultipleRowSelection` is set to `true`, the row selection propagation doesn't apply.
:::

:::warning
Row selection propagation is a client-side feature and is not supported with the [server-side data source](/x/react-data-grid/server-side-data/).
:::

## Get all rows in a group

You can use the `apiRef.current.getRowGroupChildren` method to get the id of all rows contained in a group.
It will not contain the autogenerated rows (that is the subgroup rows or the aggregation footers).

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

:::warning
The `apiRef.current.getRowGroupChildren` method is not compatible with the [server-side row grouping](/x/react-data-grid/server-side-data/row-grouping/) since all the rows might not be available to get at a given instance.
:::

## Row group panel 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/5235) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With the row group panel, users would be able to control which columns are used for grouping by dragging them inside the panel.

## Full example

{{"demo": "RowGroupingFullExample.js", "bg": "inline", "defaultCodeOpen": false}}

## Advanced use cases

See [Row grouping recipes](/x/react-data-grid/recipes-row-grouping/) for more advanced use cases.

## apiRef

The Data Grid exposes a set of methods via the `apiRef` object that are used in the implementation of the row grouping feature.
The reference below describes the relevant functions.
See [API object](/x/react-data-grid/api-object/) for more details.

:::warning
This API should only be used as a last resort—give preference to props for controlling the Data Grid.
:::

{{"demo": "RowGroupingApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
