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

## Customize column menu

You can customize the column menu either by passing `slots` and `slotProps` to the column menu component or by using custom component using the `ColumnMenu` slot of the data grid component.

### Override, hide and reorder items

Column menu component accept `slots` and `slotsProps` using which you can:

- Override default items
- Hide default items
- Reorder items

**slots**: Prop accepted by column menu components `<GridColumnMenuDefault />` or `<GridColumnMenuSimple />`, could be used to override default column menu components.

Default slots supported by community package are `ColumnMenuSortItem`, `ColumnMenuFilterItem`, `ColumnMenuHideItem` and `ColumnMenuColumnsItem`. Pro package adds `ColumnMenuPinningItem` and Premium package adds `ColumnMenuAggregationItem` and `ColumnMenuGroupingItem`.

**slotsProps**: Every item has a `displayOrder` based which it will be placed before or after other items in the menu. It can be overriden using `slotsProps`.

```tsx
<GridColumnMenuDefault
  {...props}
  slotProps={{
    // change order of `Filter` item
    ColumnMenuFilterItem: { displayOrder: 25 },
  }}
/>
```

Here is the default order for each of the items, there are some gaps to be able to place items in between:

| **Slot**                  | **Package** | **Display order**       |
| ------------------------- | ----------- | ----------------------- |
| ColumnMenuSortItem        | Community   | Default: 0, Simple: 0   |
| ColumnMenuFilterItem      | Community   | Default: 10, Simple: 10 |
| ColumnMenuHideItem        | Community   | Default: 20, Simple: 20 |
| ColumnMenuColumnsItem     | Community   | Default: 30, Simple: 30 |
| ColumnMenuPinningItem     | Pro         | Default: 5, Simple: 35  |
| ColumnMenuAggregationItem | Premium     | Default: 17, Simple: 37 |
| ColumnMenuGroupingItem    | Premium     | Default: 13, Simple: 33 |

In the following demo you can see some items being overriden or reordered.

{{"demo": "ReuseColumnMenuGrid.js", "bg": "inline"}}

:::info
**Tip:** To hide/remove a default item, you can simply pass the component in `slots` as `null`
:::

### Custom component

To add more items you can opt not to use the column menu component exposed by us and pass a totally new column menu component using `ColumnMenu` grid slot.

{{"demo": "CustomColumnMenuGrid.js", "bg": "inline"}}

:::info
To conditionally render some items, you can use ColDef properties on the `currentColumn` recieved in the props.
:::

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
