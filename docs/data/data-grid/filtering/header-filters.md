---
title: Data Grid - Header filters
---

# Data Grid - Header filters [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Give users quick-access column filters in the Data Grid header.</p>

By default, users access the Data Grid's filtering features through the filter panel in the toolbar.
The header filter feature adds a row to the top of the Data Grid Pro that lets users quickly filter columns directly in place.
Filters added through the filter panel are synchronized with header filters, and vice versa.

In the demo below, you can switch between different operators by clicking the operator button in the header filter cell or pressing <kbd><kbd class="key">⌘ Command</kbd>+<kbd class="key">Enter</kbd></kbd> (or <kbd><kbd class="key">Ctrl</kbd>+<kbd class="key">Enter</kbd></kbd> on Windows) when focusing on a header filter cell.

{{"demo": "HeaderFilteringDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Implementing header filters

To enable header filters, pass the `headerFilters` prop to the Data Grid Pro:

```tsx
<DataGridPro headerFilters>
```

### Disabling the default filter panel

You can disable the default filter panel using the `disableColumnFilter` prop, and show only the default operator by passing `slots.headerFilterMenu` as `null`.

{{"demo": "SimpleHeaderFilteringDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

### Inline clear button

By default, the **Clear filter** button is located in the header filter menu.
To display the button in the header filter cell instead, set `slotProps.headerFilterCell.showClearIcon` to `true`:

{{"demo": "HeaderFilteringInlineClearDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Customizing header filters

You can override header filter cells individually or across the entire row.

### One header filter cell in a specific column

Use the `renderHeaderFilter()` method of the `GridColDef` to customize the header filter cell for a specific column.

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

The demo below uses the `renderHeaderFilter()` method to hide the header filter cell for the **Phone** column and customize it for the **Admin** column:

{{"demo": "CustomHeaderFilterSingleDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

### All header filter cells in every column

Use `slots.headerFilterCell` to override all header filter cells in the row with a custom component:

```tsx
<DataGridPro {...data} slots={{ headerFilterCell: MyCustomHeaderFilterCell }} />
```

The default slot component handles keyboard navigation and focus management, so your custom component should also account for these accessibility features.
The demo below shows how to do this.

{{"demo": "CustomHeaderFilterDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

:::success
Similarly, you can use `slots.headerFilterMenu` if you need to customize the header filter menu.
:::

### Header filter cells with custom filter operators

If you're using a [custom input component](/x/react-data-grid/filtering/customization/#custom-input-component) for the filter operator, you can use that same component in the header filter cell for a better user experience.
The custom input component receives the `headerFilterMenu` and `clearButton` props that you can use to render the filter operator menu and **Clear filter** button, respectively.

In the demo below, the **Rating** column uses a custom input, and you can filter by clicking on a star rating in the header filter cell:

{{"demo": "CustomHeaderFilterOperatorDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

### Header filter row height

By default, the height of the header filter row is the same as the header row (represented by `columnHeaderHeight` prop).
You can use the the `headerFilterHeight` prop to change this:

```tsx
<DataGridPro {...data} headerFilterHeight={52} />
```

## Ignore diacritics

If your dataset includes diacritics (accents such as é or à), you can configure the Data Grid's filtering feature to ignore them.
See [Quick filter—Ignore diacritics](/x/react-data-grid/filtering/quick-filter/#ignore-diacritics-accents) for details.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
