---
title: Data Grid - Row pinning
---

# Data Grid - Row pinning [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Pin rows to keep them visible at all times.</p>

Pinned (or frozen, locked, or floating) rows are those visible at all times while the user scrolls the data grid vertically.

You can pin rows at the top or bottom of the Data Grid by passing pinned rows data through the `pinnedRows` prop:

```tsx
const pinnedRows: GridPinnedRowsProp = {
  top: [{ id: 0, brand: 'Nike' }],
  bottom: [
    { id: 1, brand: 'Adidas' },
    { id: 2, brand: 'Puma' },
  ],
};

<DataGridPro pinnedRows={pinnedRows} />;
```

The data format for pinned rows is the same as for the `rows` prop (see [Feeding data](/x/react-data-grid/row-definition/#feeding-data)).

Pinned rows data should also meet [Row identifier](/x/react-data-grid/row-definition/#row-identifier) requirements.

{{"demo": "RowPinning.js", "bg": "inline"}}

:::warning
Just like the `rows` prop, `pinnedRows` prop should keep the same reference between two renders.
Otherwise, the Data Grid will re-apply heavy work like sorting and filtering.
:::

## Controlling pinned rows

You can control which rows are pinned by changing `pinnedRows`.

In the demo below we use `actions` column type to add buttons to pin a row either at the top or bottom and change `pinnedRows` prop dynamically.

{{"demo": "RowPinningWithActions.js", "bg": "inline", "defaultCodeOpen": false}}

## Usage with other features

Pinned rows are not affected by sorting and filtering.

Pagination does not impact pinned rows as well - they stay pinned regardless the page number or page size.

{{"demo": "RowPinningWithPagination.js", "bg": "inline", "defaultCodeOpen": false}}

:::info
Pinned rows do not support the following features:

- selection
- row grouping
- tree data
- row reordering
- master detail

but you can still use these features with the rows that aren't pinned.
:::

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
