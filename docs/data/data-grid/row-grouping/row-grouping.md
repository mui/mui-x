---
title: Data Grid - Row grouping
---

# Data Grid - Row grouping [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">Group rows together based on column values in the Data Grid.</p>

The Data Grid Premium provides a row grouping feature to create subsets of rows based on repeated column values or custom functions.

For example, in the demo below, movies are grouped based on their respective values in the **Company** column—try clicking the **>** on the left side of a row group to expand it:

{{"demo": "RowGroupingBasicExample.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
This document covers client-side implementation.
For row grouping on the server side, see [server-side row grouping](/x/react-data-grid/server-side-data/row-grouping/).
:::

## Initializing row grouping

To initialize row grouping, provide a model to the `initialState` prop on the `<DataGridPremium />` component.
The model's parameters correspond to the columns to be checked for repeating values.

```ts
<DataGridPremium
  initialState={{
    rowGrouping: {
      model: ['company', 'director'],
    },
  }}
/>
```

This example creates groups for the **Company** column with nested subgroups based on the **Director** column:

{{"demo": "RowGroupingInitialState.js", "bg": "inline", "defaultCodeOpen": false}}

## Controlled row grouping

Use the `rowGroupingModel` prop to control the state of the criteria used for grouping.
You can use the `onRowGroupingModelChange` prop to listen to changes to the grouping criteria and update the prop accordingly.

{{"demo": "RowGroupingControlled.js", "bg": "inline", "defaultCodeOpen": false}}

## Grouping columns

:::success
A note on terminology: **Grouping column** refers to the column that holds row groups.
This is sometimes—but not always—distinct from a **grouped column**, which is the column containing shared values that serve as the basis for row groups.
:::

### Single grouping column

By default, the Data Grid displays a single column that holds all grouped columns, no matter how many criteria are provided.
If there's only one criterion, the name of the grouping column will be the same as that of the grouped column from which it's derived.
When there are multiple criteria, the grouping column is named **Group**.

{{"demo": "RowGroupingSingleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

### Multiple grouping columns

To display a grouping column for each criterion, set the `rowGroupingColumnMode` prop to `multiple`.

{{"demo": "RowGroupingMultipleGroupingCol.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom grouping column

Use the `groupingColDef` prop to customize the rendering of the grouping column.
You can override any property from the column definition (`GridColDef`) interface, with the exceptions of the `field`, the `type`, and the properties related to inline editing.

The demo below changes the grouping column's `headerName` from **Group** to **Director (by Company)**:

{{"demo": "RowGroupingCustomGroupingColDefObject.js", "bg": "inline", "defaultCodeOpen": false}}

By default, when using the object format, the properties are applied to all grouping columns.
This means that if `rowGroupingColumnMode` is set to `multiple`, then all columns will share the same `groupingColDef` properties.

To override properties for specific grouping columns, or to apply different overrides based on the current grouping criteria, you can pass a callback function to `groupingColDef` instead of an object with its config.
The callback is called for each grouping column, and it receives the respective column's fields as parameters.

The demo below illustrates this approach to provide buttons for toggling between different grouping criteria:

{{"demo": "RowGroupingCustomGroupingColDefCallback.js", "bg": "inline", "defaultCodeOpen": false}}

### Grouping rows with custom cell renderer

By default, when rows are grouped by a column that uses a [custom cell component](/x/react-data-grid/cells/), that component is also used for the cells in the grouping column.

For example, the demo below groups together movies based on the values in the **Rating** column.
Those cells contain a custom component with a star icon, and that same component is used to fill the grouping column.

{{"demo": "RowGroupingCustomCell.js", "bg": "inline", "defaultCodeOpen": false}}

You can opt out of this default behavior by returning `params.value` from the `renderCell()` function—this ensures that the grouping rows will only display the shared value rather than the entire component.

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

The demo below uses `leafField` to display values from the **Title** column in the leaves.

{{"demo": "RowGroupingLeafWithValue.js", "bg": "inline", "defaultCodeOpen": false}}

### Hide descendant count

By default, row group cells display the number of descendant rows they contain, in parentheses.
Use the `hideDescendantCount` property of the `groupingColDef` to hide this number.

{{"demo": "RowGroupingHideDescendantCount.js", "bg": "inline", "defaultCodeOpen": false}}

### Hide grouped columns

By default, [grouped columns](#grouping-columns) remain visible when grouping is applied.
This means that when there's only one grouping criterion, the grouping column and the grouped column both display the same values, which may be redundant or unnecessary.
You can use the `useKeepGroupedColumnsHidden` utility hook to hide grouped columns.
This automatically hides grouped columns when added to the model, and displays them when removed.

:::warning
This hook is not compatible with the deprecated column property `hide`.

You can manage column visibility with `columnVisibilityModel`, `initialState`, or both together.
To do so, pass them to the hook parameters as shown below.
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

To disable grouping for a specific column, set the `groupable` property on its `GridColDef` to `false`.

In the example below, the **Director** column cannot be grouped, even though there are repeating values.
(The **Title** and **Gross** columns cannot be grouped in any examples in this doc because there are no repeating values.)

{{"demo": "RowGroupingColDefCanBeGrouped.js", "bg": "inline", "defaultCodeOpen": false}}

### Grouping non-groupable columns

To apply row grouping programmatically on non-groupable columns (columns with `groupable: false` in the `GridColDef`), you can provide the row grouping model in one of three ways:

1. Pass `rowGrouping.model` to the `initialState` prop. This [initializes grouping](/x/react-data-grid/row-grouping/#initializing-row-grouping) with the provided model.
2. Provide the `rowGroupingModel` prop. This [controls grouping](/x/react-data-grid/row-grouping/#controlled-row-grouping) with the provided model.
3. Call the API method `setRowGroupingModel`. This sets the aggregation with the provided model.

In the following example, the **Company** column is not groupable through the interface, but the `rowGroupingModel` prop is passed to generate a read-only row group.

{{"demo": "RowGroupingReadOnly.js", "bg": "inline", "defaultCodeOpen": false}}

## Using groupingValueGetter for complex grouping value

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

### Rows with missing groups

If a grouping criterion's key is `null` or `undefined` for a given row, the Data Grid will treat that row as if it doesn't have a value and exclude it from grouping.

The demo below illustrates this behavior—movies are grouped by **Cinematic Universe**, and rows with no value for this column are displayed individually before those with values are displayed in groups:

{{"demo": "RowGroupingRowsWithMissingGroups.js", "bg": "inline", "defaultCodeOpen": false}}

## Group expansion

By default, all groups are initially displayed collapsed.
You can change this behavior by setting the `defaultGroupingExpansionDepth` prop to expand all the groups up to a given depth when loading the data.
To expand the whole tree, set `defaultGroupingExpansionDepth = -1`.

{{"demo": "RowGroupingDefaultExpansionDepth.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `isGroupExpandedByDefault()` prop to expand groups by default according to more complex logic. 
This prop is a callback that receives a node as an argument.
When defined, this callback always takes priority over the `defaultGroupingExpansionDepth` prop.

```tsx
isGroupExpandedByDefault={
  node => node.groupingField === 'company' && node.groupingKey === '20th Century Fox'
}
```

The example below uses this pattern to render the Grid with the **20th Century Fox** group expanded:

{{"demo": "RowGroupingIsGroupExpandedByDefault.js", "bg": "inline", "defaultCodeOpen": false}}

Use the `setRowChildrenExpansion()` method on [the `apiRef` object](#apiref) to programmatically set the expansion of a row.
Changing the expansion of a row emits a `rowExpansionChange` event that you can listen for to react to the expansion change.

The demo below uses this pattern to implement the expansion toggle button:

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

When using `rowGroupingColumnMode = "single"`, the default behavior is to sort each grouping criterion using the column's `sortComparator`, then apply the `filterOperators` from the top-level grouping criteria.

If you're rendering leaves with the `leafField` property of the `groupingColDef`, then sorting and filtering will be applied on the leaves based on the `sortComparator` and `filterOperators` of their original column.

You can force the filtering to be applied to other grouping criteria using the `mainGroupingCriteria` property of `groupingColDef`.

{{"demo": "RowGroupingFilteringSingleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

### Multiple grouping columns

When using `rowGroupingColumnMode = "multiple"`, the default behavior is to apply the `sortComparator` and `filterOperators` of the grouping criteria of each grouping column.

If you're rendering leaves in one of those columns with the `leafField` property of `groupingColDef`, then sorting and filtering will be applied on the leaves for this grouping column based on the `sortComparator` and `filterOperators` of their original column.

If you want to render leaves but apply the sorting and filtering on the grouping criteria of the column, you can force it by setting the `mainGroupingCriteria` property `groupingColDef` to be equal to the grouping criteria.

In the example below, sorting and filtering from the **Company** grouping column are applied to the `company` field, while sorting and filtering from the **Director** grouping column are applied to the `director` field even though it has leaves.

{{"demo": "RowGroupingSortingMultipleGroupingColDef.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
If you're dynamically switching the `leafField` or `mainGroupingCriteria`, sorting and filtering models will not be cleaned up automatically, and the sorting or filtering will not be reapplied.
:::

## Automatic parent and child selection

By default, selecting a parent row also selects all of its descendants.
You can customize this behavior using the `rowSelectionPropagation` prop.
Here's how it's structured:

```ts
type GridRowSelectionPropagation = {
  descendants?: boolean; // default: true
  parents?: boolean; // default: true
};
```

When `rowSelectionPropagation.descendants` is set to `true`:

- Selecting a parent selects all of its filtered descendants automatically
- Deselecting a parent row deselects of all its filtered descendants automatically

When `rowSelectionPropagation.parents` is set to `true`:

- Selecting all the filtered descendants of a parent also selects the parent automatically
- Deselecting a descendant of a selected parent also deselects the parent automatically

The example below demonstrates the usage of the `rowSelectionPropagation` prop—use the checkboxes at the top to see how the selection behavior changes between parents and children.

{{"demo": "RowGroupingPropagateSelection.js", "bg": "inline", "defaultCodeOpen": false}}

Row selection propagation also affects the **Select all** checkbox like any other checkbox group.
Selected rows that do not pass the filtering criteria are automatically deselected when the filter is applied.
Row selection propagation is not applied to the unfiltered rows.

:::warning
Row selection propagation has some limitations:

- If `props.disableMultipleRowSelection` is set to `true`, then row selection propagation won't apply.

- Row selection propagation is a client-side feature and does not support [server-side data](/x/react-data-grid/server-side-data/).

- If you're using the state setter method `apiRef.current.setRowSelectionModel()`, you must explicitly compute the selection model with the rows that have propagation changes applied using `apiRef.current.getPropagatedRowSelectionModel()` and pass it as shown below:

  ```ts
  const selectionModelWithPropagation =
    apiRef.current.getPropagatedRowSelectionModel({
      type: 'include',
      ids: new Set([1, 2, 3]),
    });
  apiRef.current.setRowSelectionModel(selectionModelWithPropagation);
  ```

  See [the `apiRef` section below](/x/react-data-grid/row-selection/#apiref) for the signatures of these methods.

- If you're using the `keepNonExistentRowsSelected` prop, then row selection propagation will not automatically apply to the rows being added that were part of the selection model but didn't exist in the previous rows.
  Consider opening a [GitHub issue](https://github.com/mui/mui-x/issues/new?template=2.feature.yml) if you need this behavior.

:::

## Get all rows in a group

Use the `apiRef.current.getRowGroupChildren()` method to get the IDs of all rows in a group.
The results will not contain autogenerated rows such as subgroup rows or aggregation footers.

```ts
const rows: GridRowId[] = apiRef.current.getRowGroupChildren({
  groupId: params.id,

  // If true, the rows will be in the order displayed on screen
  applySorting: true,

  // If true, only the rows matching the current filters will be returned
  applyFiltering: true,
});
```

Use `getGroupRowIdFromPath()` to get row IDs from within all groups that match a given grouping criterion:

```ts
const rows = apiRef.current.getRowGroupChildren({
  groupId: getGroupRowIdFromPath([{ field: 'company', key: 'Disney Studios' }]),
});
```

{{"demo": "RowGroupingGetRowGroupChildren.js", "bg": "inline", "defaultCodeOpen": false}}

:::warning
The `apiRef.current.getRowGroupChildren()` method is not compatible with [server-side row grouping](/x/react-data-grid/server-side-data/row-grouping/) because not all rows may be available to retrieve in any given instance.
:::

## Row group panel 🚧

:::warning
This feature isn't available yet, but it is planned—you can 👍 upvote [this GitHub issue](https://github.com/mui/mui-x/issues/5235) to help us prioritize it.
Please don't hesitate to leave a comment there to describe your needs, especially if you have a use case we should address or you're facing specific pain points with your current solution.
:::

With the row group panel, users would be able to control which columns are used for grouping by dragging them inside the panel.

## Advanced use cases

The demo below provides an example of row grouping that's closer to a real-world use case for this feature, grouping a large dataset of contacts based on the types of goods they provide (via the hidden **Commodity** column).

See [Row grouping recipes](/x/react-data-grid/recipes-row-grouping/) for more advanced use cases.

{{"demo": "RowGroupingFullExample.js", "bg": "inline", "defaultCodeOpen": false}}

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
