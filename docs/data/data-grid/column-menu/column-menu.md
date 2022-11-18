---
title: Data Grid - Column menu
---

# Data grid - Column menu

<p class="description">Customize your columns menu.</p>

## Column menu

Each column header comes with a column menu with quickly accessible grid features like column visibility, sorting, filtering, and others.

It can be accessed by clicking on 3-dots icon that appear on hover on a header cell.

{{"demo": "ColumnMenuGrid.js", "bg": "inline"}}

## Disable column menu

By default, each column header has the column menu enabled. To disable the column menu, set the prop `disableColumnMenu={true}`.

{{"demo": "DisabledColumnMenuGrid.js", "bg": "inline"}}

## Customise column menu

You can customise column menu either by passing `slots` in default component or by passing your own component for slot `ColumnMenu`, you can blend existing menu items with your custom components for a custom look and feel.

### Hide/reorder some column menu items

Grid exports a variable called `gridColumnMenuSlots` for default and `gridColumnMenuSimpleSlots` for simple menu which contains all the available slots for the active grid package. You can use this with default column menu components to:

- Hide items
- Reorder items

{{"demo": "ReuseColumnMenuGrid.js", "bg": "inline"}}

### Custom component

You can also opt not to use the column menu component exposed by us and pass a totally new component with your custom logic. You can add more items to the menu and obviously can blend in some existing items if you want.

To conditionally render some items, you can use ColDef properties on the `currentColumn` (the column whose menu is currently open) which you recieve in the props.

{{"demo": "CustomColumnMenuGrid.js", "bg": "inline"}}

Here's the list of default available items for each package and column menu design:

| **Package** | **Design** |                                                     **Available Items**                                                     |
| :---------: | :--------: | :-------------------------------------------------------------------------------------------------------------------------: |
|  Community  |  default   |             GridColumnMenuFilterItem, GridColumnMenuSortItem, GridColumnMenuHideItem, GridColumnMenuColumnsItem             |
|  Community  |   simple   | GridColumnMenuFilterItemSimple, GridColumnMenuSortItemSimple, GridColumnMenuHideItemSimple, GridColumnMenuColumnsItemSimple |
|     Pro     |  default   |                                                  GridColumnMenuPinningItem                                                  |
|     Pro     |   simple   |                                               GridColumnMenuPinningItemSimple                                               |
|   Premium   |  default   |                   GridColumnMenuAggregationItem, GridColumnMenuRowGroupItem, GridColumnMenuRowUngroupItem                   |
|   Premium   |   simple   |          GridColumnMenuAggregationItemSimple, GridColumnMenuRowGroupItemSimple, GridColumnMenuRowUngroupItemSimple          |

## Column menu with Pro/Premium options [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)[<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

You can access commercial features like column pinning etc from the column menu when using `DataGridPro` or `DataGridPremium`.

{{"demo": "ColumnMenuGridPremium.js", "bg": "inline"}}

## Simple column menu

You can replace the default column menu with a simplified one using `GridColumnMenuSimple` component.

{{"demo": "SimpleColumnMenuGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
