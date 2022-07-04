---
title: Data Grid - Column spanning
---

# Data grid - Column spanning

<p class="description">Span cells across several columns.</p>

By default, each cell takes up the width of one column.
You can modify this behavior with column spanning.
It allows cells to span multiple columns.
This is very close to the "column spanning" in an HTML `<table>`.

To change the number of columns a cell should span, use the `colSpan` property available in `GridColDef`:

```ts
interface GridColDef {
  /**
   * Number of columns a cell should span.
   * @default 1
   */
  colSpan?: number | ((params: GridCellParams<V, R, F>) => number | undefined);
  …
}
```

:::warning
When using `colSpan`, some other features may be pointless or may not work as expected (depending on the data model).
To avoid confusing grid layout, consider disabling the following features for the column(s) that are affected by `colSpan`:

- [sorting](/x/react-data-grid/sorting/#disable-the-sorting)
- [filtering](/x/react-data-grid/filtering/#disable-the-filters)
- [column reorder](/x/react-data-grid/column-ordering/)
- [hiding columns](/x/react-data-grid/column-visibility/)
- [column pinning](/x/react-data-grid/column-pinning/#blocking-column-unpinning)

:::

## Number signature

The number signature sets **all cells in the column** to span a given number of columns.

```ts
interface GridColDef {
  colSpan?: number;
}
```

{{"demo": "ColumnSpanningNumber.js", "bg": "inline"}}

## Function signature

The function signature allows spanning only **specific cells** in the column.
The function receives [`GridCellParams`](/api/data-grid/grid-cell-params/) as argument.

```ts
interface GridColDef {
  colSpan?: (params: GridCellParams<V, R, F>) => number | undefined;
}
```

{{"demo": "ColumnSpanningFunction.js", "bg": "inline", "defaultCodeOpen": false}}

Function signature can also be useful to derive `colSpan` value from row data:

{{"demo": "ColumnSpanningDerived.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
