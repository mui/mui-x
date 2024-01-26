---
title: Data Grid - Row definition
---

# Data Grid - Row definition

<p class="description">Define your rows.</p>

## Feeding data

The rows can be defined with the `rows` prop, which expects an array of objects.

:::warning
The `rows` prop should keep the same reference between two renders except when you want to apply new rows.
Otherwise, the Data Grid will re-apply heavy work like sorting and filtering.
:::

{{"demo": "RowsGrid.js", "bg": "inline"}}

## Row identifier

Each row must have a unique identifier.

This identifier is used internally to identify the row in the various models—for instance, the row selection model—and to track the row across updates.

By default, the Data Grid looks for a property named `id` in the data set to get that identifier.

If the row's identifier is not called `id`, then you need to use the `getRowId` prop to tell the Data Grid where it's located.

The following demo shows how to use `getRowId` to grab the unique identifier from a property named `internalId`:

```tsx
function getRowId(row) {
  return row.internalId;
}

<DataGrid getRowId={getRowId} />;
```

{{"demo": "RowsGridWithGetRowId.js", "bg": "inline", "defaultCodeOpen": false}}

If no such unique identifier exists in the data set, then you must create it by some other means, but this scenario should be avoided because it leads to issues with other features of the Data Grid.

Note that it is not necessary to create a column to display the unique identifier data.
The Data Grid pulls this information directly from the data set itself, not from anything displayed on the screen.

:::warning
Just like the `rows` prop, the `getRowId` function should keep the same JavaScript reference between two renders.
Otherwise, the Data Grid will re-apply heavy work like sorting and filtering.

It could be achieved by either defining the prop outside the component scope or by memoizing using the `React.useCallback` hook if the function reuses something from the component scope.
:::

## Styling rows

You can check the [styling rows](/x/react-data-grid/style/#styling-rows) section for more information.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
