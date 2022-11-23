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

You can customize the column menu either by passing `slots` and `initialItems` to the column menu component or by using custom component using the `ColumnMenu` slot of the data grid component.

### Hide, reorder and add new items

Grid exports a variable called `gridColumnMenuSlots` for default and `gridColumnMenuSimpleSlots` for simple menu which contains all the available slots for the active grid package. You can use this to:

- Hide default items
- Add new items
- Reorder items

Here's how `gridColumnMenuSlots` looks like:

```tsx
interface GridColumnMenuSlot {
  component: React.JSXElementConstructor<any>;
  displayOrder: number;
}

type GridColumnMenuSlots = { [key: string]: GridColumnMenuSlot };

// default slots for column menu
const gridColumnMenuSlots: GridColumnMenuSlots = {
  ColumnMenuSortItem: { component: GridColumnMenuSortItem, displayOrder: 0 },
  ColumnMenuPinningItem: { component: GridColumnMenuPinningItem, displayOrder: 5 }, // pro and premium only slot
  ColumnMenuFilterItem: { component: GridColumnMenuFilterItem, displayOrder: 10 },
  ColumnMenuGroupingItem: { component: GroupingItem, displayOrder: 13 }, // premium only slot
  ColumnMenuAggregationItem: {
    component: GridColumnMenuAggregationItem,
    displayOrder: 17,
  }, // premium only slot
  ColumnMenuHideItem: { component: GridColumnMenuHideItem, displayOrder: 20 },
  ColumnMenuColumnsItem: { component: GridColumnMenuColumnsItem, displayOrder: 30 },
};
```

**displayOrder**: Every item has a `displayOrder` based which it will be placed before or after other items in the menu. Default order is shown in above code snippet, there's a gap between default items to allow the users to add more items in between.

**slots**: Prop accepted by column menu components `<GridColumnMenuDefault />` or `<GridColumnMenuSimple />`, the default value used is `gridColumnMenuSlots` but you can override it.

**initialItems**: Rendering of default items take place from respective hooks, based on certain conditions or feature flags, pass `initialItems` to column menu components `<GridColumnMenuDefault />` or `<GridColumnMenuSimple />` to add custom items.

```diff
<GridColumnMenuDefault
  {...props}
  slots={slots} // define `CustomComponent` in slots
+  initialItems={[slots.CustomComponent]}
/>
```

In the following demo you can see a new item being added and default items being overriden or reordered.

{{"demo": "ReuseColumnMenuGrid.js", "bg": "inline"}}

:::info
**Tip:** To hide/remove a default item, you can simply filter it from `slots` before passing to column menu component
:::

### Custom component

You can also opt not to use the column menu component exposed by us and pass a totally new component with your custom logic using `ColumnMenu` slot.

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
