---
title: Data Grid - Header filters
---

# Data Grid - Header filters [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Quickly accessible per-column filters on grid header.</p>

:::warning

To use header filters, you need to upgrade to the [Pro plan](/x/introduction/licensing/#pro-plan) or above.

:::

Header filters add a new header row that lets users quickly filter the columns. The filters added on the filter panel are synchronized with the header filters and vice versa.

You can switch between different operators by clicking the operator button in the header filter cell or pressing <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> (or <kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Enter</kbd></kbd> on macOS) when focusing on a header filter cell.

{{"demo": "HeaderFilteringDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Simple header filters

You can disable the default filter panel using `disableColumnFilter` prop and only show the default operator by passing `slots.headerFilterMenu` as `null`.

{{"demo": "SimpleHeaderFilteringDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Customize header filters

There are multiple ways to customize header filters.

### `renderHeaderFilter` method

You can use the `renderHeaderFilter` method of the `GridColDef` to customize the header filter cell for a specific column.

```tsx
const columns: GridColDef[] = [
  {
    field: 'isAdmin',
    renderHeaderFilter: (params: GridHeaderFilterCellProps) => (
      <MyCustomHeaderFilter {...params} />
    ),
  },
];
```

The following demo uses the `renderHeaderFilter` method to customize the header filter cell for the `isAdmin` column and hide the filter cell for the `phone` column.

{{"demo": "CustomHeaderFilterSingleDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

### Customize using `filterOperators`

If the filter operator has a [custom `InputComponent`](https://mui.com/x/react-data-grid/filtering/#custom-input-component), the same component is being used for the header filter.

When rendered as a header filter, the `InputComponent` also receives the `headerFilterMenu` and `clearButton` props that contain the filter operator menu and clear button.

{{"demo": "CustomHeaderFilterOperatorDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

### `headerFilterCell` slot

You can use `slots.headerFilterCell` to customize the header filter cell completely. Since the default slot component handles keyboard navigation and focus management, you may have to handle them yourself if you are using a custom component.

Additionally, `slots.headerFilterMenu` could also be used to customize the menu of the header filter cell.

```tsx
<DataGridPro {...data} slots={{ headerFilterCell: MyCustomHeaderFilterCell }} />
```

{{"demo": "CustomHeaderFilterDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

### Custom header filter height

By default, the height of the header filter row is the same as the header row (represented by `columnHeaderHeight` prop).
You can customize the height of the header filter cell using the `headerFilterHeight` prop.

```tsx
<DataGridPro {...data} headerFilterHeight={52} />
```

## Ignore diacritics (accents)

You can ignore diacritics (accents) when filtering the rows. See [Quick filter - Ignore diacritics (accents)](/x/react-data-grid/filtering/quick-filter/#ignore-diacritics-accents).

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
