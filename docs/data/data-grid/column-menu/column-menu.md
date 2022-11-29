---
title: Data Grid - Column menu
---

# Data grid - Column menu

<p class="description">Customize your columns menu.</p>

## Column menu

Each column header comes with a column menu with quickly accessible grid features like column visibility, sorting, filtering, and others.

It can be accessed by clicking on the 3-dots icon that appears on hover on a header cell.

{{"demo": "ColumnMenuGrid.js", "bg": "inline"}}

## Disable column menu

By default, each column header has the column menu enabled. To disable the column menu, set the prop `disableColumnMenu={true}`.

{{"demo": "DisabledColumnMenuGrid.js", "bg": "inline"}}

## Customize column menu

You can customize the column menu either by passing `components`, `componentsProps`, and `initialItems` props to the column menu component or by [passing a custom component to the `ColumnMenu` slot](/x/react-data-grid/components/#overriding-components) of the data grid component.

### Add, override, hide and reorder items

Column menu component accept `components`, `componentsProps` and `initialItems` using which you can:

- Add new items
- Override default items
- Hide default items
- Reorder items

**components**: Prop accepted by column menu components `<GridColumnMenuDefault />` or `<GridColumnMenuSimple />`, could be used to override default column menu components or add new components.

Default components supported by community package are `ColumnMenuSortItem`, `ColumnMenuFilterItem`, `ColumnMenuHideItem` and `ColumnMenuColumnsItem`. Pro package adds `ColumnMenuPinningItem` and Premium package adds `ColumnMenuAggregationItem` and `ColumnMenuGroupingItem`.

**componentsProps**: Every item has a `displayOrder` based which it will be placed before or after other items in the menu. It can be overriden using `componentsProps`. You can also use this to pass extra props to column menu components.

:::warning
The `components` prop uses Pascal case (`ColumnMenuFilterItem`), while `componentsProps` uses camel case (`columnMenuFilterItem`).
:::

**initialItems**: Visibility of default items is controlled using respective feature hooks, for cutom items though, use `initialItems` to show the items added by passing to `components`. All the new items will be placed in the end (default `displayOrder: 100`), unless customized by `displayOrder`.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenuDefault
      {...props}
      components={{
        // Override slot for `ColumnMenuFilterItem`
        ColumnMenuFilterItem: CustomFilterItem,
        // Hide `ColumnMenuColumnsItem`
        ColumnMenuColumnsItem: null,
        // Add new item
        ColumnMenuUserItem: CustomUserItem,
      }}
      componentsProps={{
        // Swap positions of filter and sort items
        columnMenuFilterItem: {
          displayOrder: 0, // Previously `10`
        },
        columnMenuSortItem: {
          displayOrder: 10, // Previously `0`
        },
        columnMenuUserItem: {
          // set `displayOrder` for new item
          displayOrder: 15,
          // pass additional props
          myCustomValue: 'Do custom action',
          myCustomHandler: () => alert('Custom handler fired'),
        },
      }}
      initialItems={['ColumnMenuUserItem']}
    />
  );
}
```

{{"demo": "ReuseColumnMenuGrid.js", "bg": "inline"}}

#### Display orders for default items

As a reference, here is the order for each of the default items, there are some gaps to be able to place items in between:

| **Component**             | **Package** | **Display order (default design)** | **Display order (simple design)** |
| ------------------------- | ----------- | ---------------------------------: | --------------------------------: |
| ColumnMenuSortItem        | Community   |                                  0 |                                 0 |
| ColumnMenuFilterItem      | Community   |                                 10 |                                10 |
| ColumnMenuHideItem        | Community   |                                 20 |                                20 |
| ColumnMenuColumnsItem     | Community   |                                 30 |                                30 |
| ColumnMenuPinningItem     | Pro         |                                  5 |                                35 |
| ColumnMenuAggregationItem | Premium     |                                 17 |                                37 |
| ColumnMenuGroupingItem    | Premium     |                                 13 |                                33 |

:::info
**Tip:** To hide/remove a default item, you can simply pass the component in `components` as `null`
:::

### Custom component

You can override the default column menu component and pass a custom column menu component using the `ColumnMenu` grid slot.

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

When using `DataGridPro` or `DataGridPremium` components, the column menu contains additional menu items related to Pro and Premium features:

{{"demo": "ColumnMenuGridPremium.js", "bg": "inline"}}

## Simple column menu

You can replace the default column menu with a simplified one using the `GridColumnMenuSimple` component.

{{"demo": "SimpleColumnMenuGrid.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
