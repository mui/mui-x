---
title: Data Grid - Multi-filters
---

# Data Grid - Multi-filters [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')

<p class="description">Let end users apply multiple filters to the Data Grid simultaneously.</p>

By default, it's only possible to apply one filter at a time to the Data Grid.
With the Data Grid Pro, end users can simultaneously apply multiple filters with multiple criteria for more fine-grained data analysis.

The following demo lets you filter rows according to several different criteria.
You can add more filters with the **Add Filter** button on the filter panel.

{{"demo": "BasicExampleDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Implementing multi-filters

The multi-filter feature is available by default on the Data Grid Pro.

### One filter per column

You can limit to only one filter per column while still allowing to filter other columns. For this, use the [`filterColumns`](/x/api/data-grid/grid-filter-form/) and [`getColumnForNewFilter`](/x/api/data-grid/grid-filter-panel/) props available in `slotProps.filterPanel`.

### Use cases

- Sometimes it's a limitation of some server-side filtering APIs to only allow one filter per column.
- You can also write custom logic to prevent some columns from being shown as possible filters.

This demo implements a basic use case to prevent showing multiple filters for one column.

{{"demo": "DisableMultiFiltersDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## Disable action buttons

To disable the **Add Filter** or **Remove All** buttons, pass `disableAddFilterButton` or `disableRemoveAllButton`, respectively, to `componentsProps.filterPanel` as shown below:

{{"demo": "DisableActionButtonsDataGridPro.js", "bg": "inline", "defaultCodeOpen": false}}

## API

- [GridFilterPanel](/x/api/data-grid/grid-filter-panel/)
- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
