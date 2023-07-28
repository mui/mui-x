---
title: Data Grid - Multi filters
---

# Data Grid - Multi filters [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)

<p class="description">Apply multiple filters at the same time.</p>

Multi filters allow filtering rows by multiple columns with multiple criteria.
The following demo lets you filter the rows according to several criteria at the same time.

{{"demo": "BasicExampleDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## One filter per column

You can also limit to only one filter per column while still allowing to filter other columns. For this, use the [`filterColumns`](/x/api/data-grid/grid-filter-form/) and [`getColumnForNewFilter`](/x/api/data-grid/grid-filter-panel/) props available in `slotProps.filterPanel`.

### Use cases

- Sometimes it's a limitation of some server-side filtering APIs to only allow one filter per column.
- You can also write custom logic to prevent some columns from being shown as possible filters.

This demo implements a basic use case to prevent showing multiple filters for one column.

{{"demo": "DisableMultiFiltersDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable action buttons

To disable `Add filter` or `Remove all` buttons, pass `disableAddFilterButton` or `disableRemoveAllButton` to `componentsProps.filterPanel`.

{{"demo": "DisableActionButtonsDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [GridFilterPanel](/x/api/data-grid/grid-filter-panel/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
