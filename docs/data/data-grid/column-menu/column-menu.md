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

## Customise column menu items

You can also customise column menu based on some conditions. Every item in the menu is assigned a `key` which serves as a unique identifier of that item using which it's possible to:

- Hide/Show specific items
- Override default items (if you want to override some items and not the whole menu)
- Add new items
- Configure custom display order for items

For that purpose you can use `getVisibleColumnMenuItems` and `columnMenuItems`.

**getVisibleColumnMenuItems**: It is available in both `GridColDef` and `componentsProps.columnMenu`, it receives keys of all registered items and should return a _filtered_ and _ordered_ list of keys that are needed to be shown. It can be used either per-column basis by passing in `GridColDef` or for the whole Grid by passing in `componentsProps.columnMenu`. If you have it in both, the preference will be given to the `GridColDef` one.

**columnMenuItems**: It could be used to override or register new items to the menu. You can simply pass the object with existing or new items and they will be updated/added to the grid.

### Hide/Show Specific Items:

For every column menu component there's a default order of items configured by default called `visibleMenuItems`, for default column menu it's: `['sorting', 'divider', 'filter', 'divider', 'hideColumn', 'divider', 'manageColumns']`

Using `getVisibleColumnMenuItems` method, you can override this order based on configured items for the column menu.

```tsx
const getVisibleColumnMenuItems = () => ['sorting', 'filter']; // only show `sort` & `filter`

return (
  <DataGrid
    {...data}
    componentsProps={{ columnMenu: { getVisibleColumnMenuItems } }}
  />
);
```

### Override default items and add new items:

Using `componentsProps.columnMenu.columnMenuItems`, you can:

1. Override Existing Items
2. Add new Items

```tsx
const columnMenuItems = {
  filter: <MyCustomFilter />, // override existing item
  closeMenu: <MenuCloseComponent />, // add new item
};

// add new item in visible items and append it to the last of list
const getVisibleColumnMenuItems = (defaultItems) => [...defaultItems, 'closeMenu'];

<DataGrid
  {...data}
  componentProps={{ columnMenu: { getVisibleColumnMenuItems, columnMenuItems } }}
/>;
```

If you're using TypeScript, for new items that you are adding, you'll need to specify new items you are registering, using [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation).

```tsx
declare module '@mui/x-data-grid' {
  interface GridColumnMenuKeysOverrides {
    closeMenu: true;
  }
}
```

### Default column menu items

Default `keys` for **DataGrid** are `filter`, `sorting`, `hideColumn`, `divider` and `manageColumns`, wheras **DataGridPro** adds `pinning` and **DataGridPremium** adds `grouping` and `aggregation` on top of them.

Here's a demo overriding some existing items, adding some new items and displaying different items for a column.

{{"demo": "FilterColumnMenuGrid.js", "bg": "inline"}}

## Column menu with Pro/Premium options [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)[<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

You can access commercial features like column pinning etc from the column menu when using `DataGridPro` or `DataGridPremium`.

{{"demo": "ColumnMenuGridPro.js", "bg": "inline"}}

## Simple column menu

You can replace the default column menu with a simplified one using `GridColumnMenuSimple` component.

{{"demo": "SimpleColumnMenuGrid.js", "bg": "inline"}}

For _Pro_ and _Premium_ packages you have specific `slot` for each of the column menu item using which you can import simple variant or pass on your own component, or you can also use [column menu customizing](#customise-column-menu-items) to use your custom component based on item `key`.

Here's a list of column menu items and their overridable slots for Commercial features.

| **Item**                | **Package** | **Key**       | **Slot**                     | **Default**                     |
| ----------------------- | ----------- | ------------- | ---------------------------- | ------------------------------- |
| Pinning                 | Pro         | 'pinning'     | 'ColumnMenuPinningItem'      | GridColumnPinningMenuItems      |
| Groupable (not grouped) | Premium     | 'grouping'    | 'ColumnMenuRowGroupableItem' | GridRowGroupableColumnMenuItems |
| Grouping (grouped)      | Premium     | 'grouping'    | 'ColumnMenuRowGroupingItem'  | GridRowGroupingColumnMenuItems  |
| Aggregation             | Premium     | 'aggregation' | 'ColumnMenuAggregationItem'  | GridAggregationColumnMenuItem   |

This example is using simple Column Menu for basic menu and overriding some slots for premium items and customizing the display order and the items shown.

```tsx
<DataGridPremium
  {...data}
  componentsProps={{
    columnMenu: {
      getVisibleColumnMenuItems: () => [
        'pinning',
        'sorting',
        'filter',
        'aggregation',
      ],
    },
  }}
  components={{
    ColumnMenu: GridColumnMenuSimple,
    ColumnMenuPinningItem: GridColumnPinningMenuItemsSimple,
    ColumnMenuAggregationItem: SomeCustomAggregationComponent,
  }}
/>
```

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
