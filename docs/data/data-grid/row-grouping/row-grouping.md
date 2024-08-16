---
title: Data Grid - Row grouping
---

# Data Grid - Row grouping [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Group your rows according to some column values.</p>

For when you need to group rows based on repeated column values, and/or custom functions.
In the following example, movies are grouped based on their production `company`:

{{"demo": "RowGroupingBasicExample.js", "bg": "inline", "defaultCodeOpen": false}}

## Grouping criteria

### Initialize the row grouping

The easiest way to get started with the feature is to provide its model to the `initialState` prop:

```ts
<DataGridPremium
  initialState={{
    rowGrouping: {
      model: ['company', 'director'],
    },
  }}
/>
```

The basic parameters are the columns you want to check for repeating values.
This example groups all the movies matching the same company name, followed by a second group matching the director's name.

{{"demo": "RowGroupingInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

### Controlled row grouping

If you need to control the state of the criteria used for grouping, use the `rowGroupingModel` prop.
You can use the `onRowGroupingModelChange` prop to listen to changes to the grouping criteria and update the prop accordingly.

{{"demo": "RowGroupingControlled.js", "bg": "inline", "defaultCodeOpen": false}}

## Grouping columns

### Single grouping column

By default, the data grid will display a single column holding all grouping columns.
If you have multiple grouping criteria, this column name will be set to "Group."

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

### Show values for the leaves

By default, the grouped rows display no value on their grouping columns' cells. Those cells are called "leaves."

If you want to display some value, you can provide a `leafField` property to the `groupingColDef`.

{{"demo": "RowGroupingLeafWithValue.js", "bg": "inline", "defaultCodeOpen": false}}

### Hide the descendant count

Use the `hideDescendantCount` property of the `groupingColDef` to hide the number of descendants of a grouping row.

{{"demo": "RowGroupingHideDescendantCount.js", "bg": "inline", "defaultCodeOpen": false}}

### Hide the grouped columns

By default, the columns used to group the rows remains visible.
For instance if you group by `"director"`, you have two columns titled **Director**:

- The grouped column (the column from which you grouped the rows)
- The grouping column on which you can toggle the groups

To automatically hide the grouped columns, use the `useKeepGroupedColumnsHidden` utility hook.
The hook automatically hides the columns when added to the model, and displays them when removed from it.

:::warning
This hook is not compatible with the deprecated column property `hide`.

You can manage column visibility with `columnVisibilityModel`, `initialState`, or both together.
To do so, pass them to the hook parameters.
:::

Below are two examples about how to use `columnVisibilityModel` or `initialState` with `useKeepGroupedColumnsHidden` hook.
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

## Disable the row grouping

### For all columns

You can disable row grouping by setting the `disableRowGrouping` prop to true.

It will disable all the features related to the row grouping, even if a model is provided.

{{"demo": "RowGroupingDisabled.js", "bg": "inline", "defaultCodeOpen": false}}

### For some columns

In case you need to disable grouping on specific column(s), set the `groupable` property on the respective column definition (`GridColDef`) to `false`.
In the example below, the `director` column cannot be grouped. In all examples, the `title` and `gross` columns cannot be grouped.

{{"demo": "RowGroupingColDefCanBeGrouped.js", "bg": "inline", "defaultCodeOpen": false}}

### Grouping non-groupable columns programmatically

To apply row grouping programmatically on non-groupable columns (columns with `groupable: false` in the [column definition](/x/api/data-grid/grid-col-def/)), you can provide row grouping model in one of the following ways:

1. Pass `rowGrouping.model` to the `initialState` prop. This will [initialize the grouping](/x/react-data-grid/row-grouping/#initialize-the-row-grouping) with the provided model.
2. Provide the `rowGroupingModel` prop. This will [control the grouping](/x/react-data-grid/row-grouping/#controlled-row-grouping) with the provided model.
3. Call the API method `setRowGroupingModel`. This will set the aggregation with the provided model.

In the following example, the column `company` is not groupable from the UI but the `rowGroupingModel` prop is passed to generate a read-only row group.

{{"demo": "RowGroupingReadOnly.js", "bg": "inline", "defaultCodeOpen": false}}

## Using `groupingValueGetter` for complex grouping value

The grouping value has to be either a `string`, a `number`, `null`, or `undefined`.
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

If the grouping key of a grouping criteria is `null` or `undefined` for a row, the data grid will consider that this row does not have a value for this group. and will inline it for those groups.

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

Use the `setRowChildrenExpansion` method on `apiRef` to programmatically set the expansion of a row. Changing the expansion of a row emits a `rowExpansionChange` event, listen to it to react to the expansion change.

{{"demo": "RowGroupingSetChildrenExpansion.js", "bg": "inline", "defaultCodeOpen": false}}

### Customize grouping cell indent

To change the default cell indent, you can use the `--DataGrid-cellOffsetMultiplier` CSS variable:

```tsx
<DataGridPremium
  sx={{
    // default value is 2
    '--DataGrid-cellOffsetMultiplier': 6,
  }}
/>
```

{{"demo": "RowGroupingCustomCellIndent.js", "bg": "inline", "defaultCodeOpen": false}}

## Sorting / Filtering

### Single grouping column

When using `rowGroupingColumnMode = "single"`, the default behavior is to:

- sort each grouping criteria using the `sortComparator` of the column
- apply the `filterOperators` of the top-level grouping criteria

If you are rendering leaves with the `leafField` property of `groupingColDef`, the sorting and filtering will be applied on the leaves based on the `sortComparator` and `filterOperators` of their original column.

You can force the filtering to be applied on another grouping criteria with the `mainGroupingCriteria` property of `groupingColDef`

:::warning
This feature is not yet compatible with `sortingMode = "server"` and `filteringMode = "server"`.
:::

{{"demo": "RowGroupingFilteringSingleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

### Multiple grouping columns

When using `rowGroupingColumnMode = "multiple"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the grouping criteria of each grouping column.

If you are rendering leaves on one of those columns with the `leafField` property of `groupingColDef`, the sorting and filtering will be applied on the leaves for this grouping column based on the `sortComparator` and `filterOperators` of the leave's original column.

If you want to render leaves but apply the sorting and filtering on the grouping criteria of the column, you can force it by setting the `mainGroupingCriteria` property `groupingColDef` to be equal to the grouping criteria.

In the example below:

- the sorting and filtering of the `company` grouping column is applied on the `company` field
- the sorting and filtering of the `director` grouping column is applied on the `director` field even though it has leaves

{{"demo": "RowGroupingSortingMultipleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
If you are dynamically switching the `leafField` or `mainGroupingCriteria`, the sorting and filtering models will not be cleaned up automatically, and the sorting/filtering will not be re-applied.
:::

## Get the rows in a group

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

## Row group panel 🚧

:::warning
This feature isn't implemented yet. It's coming.

👍 Upvote [issue #5235](https://github.com/mui/mui-x/issues/5235) if you want to see it land faster.

Don't hesitate to leave a comment on the same issue to influence what gets built. Especially if you already have a use case for this component, or if you are facing a pain point with your current solution.
:::

With this panel, your users will be able to control which columns are used for grouping just by dragging them inside the panel.

## Accessibility changes in v8

The Data Grid v8 with row grouping feature will improve the accessibility and will be more aligned with the WAI-ARIA authoring practices.

You can start using the new accessibility features by enabling `ariaV8` experimental feature flag:

```tsx
<DataGridPremium experimentalFeatures={{ ariaV8: true }} />
```

:::warning
The value of `ariaV8` should be constant and not change during the lifetime of the Data Grid.
:::

{{"demo": "RowGroupingAriaV8.js", "bg": "inline", "defaultCodeOpen": false}}

## Full example

{{"demo": "RowGroupingFullExample.js", "bg": "inline", "defaultCodeOpen": false}}

## Advanced use cases

See [Row grouping recipes](/x/react-data-grid/recipes-row-grouping/) for more advanced use cases.

## apiRef

The grid exposes a set of methods that enables all of these features using the imperative `apiRef`. To know more about how to use it, check the [API Object](/x/react-data-grid/api-object/) section.

{{"demo": "RowGroupingApiNoSnap.js", "bg": "inline", "hideToolbar": true}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
