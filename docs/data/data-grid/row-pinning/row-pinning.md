---
title: Data Grid - Row pinning
---

# Data Grid - Row pinning [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Implement pinning to keep rows in the Data Grid visible at all times.</p>

Pinned rows (also known as sticky, frozen, and locked) are visible at all times while scrolling the Data Grid vertically.
With the Data Grid Pro, you can pin rows to the top or bottom of the grid.

## Implementing row pinning

Use the `pinnedRows` prop to define the rows to be pinned to the `top` or `bottom` of the Data Grid, as shown below:

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

### Pinned row data formatting

The data format for pinned rows is the same as for the `rows` prop (see [Feeding data](/x/react-data-grid/row-definition/#feeding-data)).

Pinned rows data should also meet [Row identifier](/x/react-data-grid/row-definition/#row-identifier) requirements.

{{"demo": "RowPinning.js", "bg": "inline"}}

:::warning
As with the `rows` prop, `pinnedRows` should keep the same reference between two renders.
Otherwise the Data Grid will reapply heavy work like sorting and filtering.
:::

## Controlling pinned rows

You can control which rows are pinned by making dynamic changes to `pinnedRows`.

The demo below uses the `actions` column type to provide buttons that let the user pin a row to the top or bottom of the Grid.

{{"demo": "RowPinningWithActions.js", "bg": "inline", "defaultCodeOpen": false}}

## Pinned rows appearance

By default, the pinned rows sections are separated from non-pinned rows with a border and a shadow that appears when there is scroll.
You can change the appearance by setting the [`pinnedRowsSectionSeparator`](/x/api/data-grid/data-grid-pro/#data-grid-pro-prop-pinnedRowsSectionSeparator) prop to `'border'` or `'border-and-shadow'`.

{{"demo": "RowPinningSectionSeparator.js", "bg": "inline"}}

## Usage with other features

Pinned rows are not affected by sorting, filtering, or pagination—they remain pinned regardless of how these features are applied.

{{"demo": "RowPinningWithPagination.js", "bg": "inline", "defaultCodeOpen": false}}

Pinned rows do not support the following features:

- selection
- row grouping
- tree data
- row reordering
- master-detail row panels

When there are pinned rows present in a Grid, you can still use these features with rows that aren't pinned.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
