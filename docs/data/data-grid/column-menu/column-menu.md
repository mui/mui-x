---
title: Data Grid - Column menu
---

# Data grid - Column menu

<p class="description">Customize your columns menu.</p>

## Column menu

Each header comes with a column menu using which displays quickly accessible grid features like visibility of columns, sorting, filtering and others.

It can be accessed by clicking on 3-dots icon that appear on hover on a header cell.

{{"demo": "ColumnMenuGrid.js", "bg": "inline"}}

## Disabled column menu

By default, each column header displays a column menu. The column menu allows actions to be performed in the context of the target column, e.g. filtering. To disable the column menu, set the prop `disableColumnMenu={true}`.

{{"demo": "DisabledColumnMenuGrid.js", "bg": "inline"}}

## Column menu with Pro/Premium options [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)[<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

You can also access commercial features like column pinning etc from the column menu when using `DataGridPro` or `DataGridPremium`.

{{"demo": "ColumnMenuGridPro.js", "bg": "inline"}}

## Simple column menu

In case you like the look and feel of the old column menu, you can replace the default one with `GridColumnMenuSimple` component.

{{"demo": "SimpleColumnMenuGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
