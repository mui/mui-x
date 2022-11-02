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

## Simple column menu

In case you like the look and feel of the old column menu, you can replace the default one with `GridColumnMenuSimple` component.

{{"demo": "SimpleColumnMenuGrid.js", "bg": "inline"}}

## Customise column menu items

You can also customise column menu based on some conditions. Every item in the menu is assigned a `slot` using which it's possible to:

- Hide/Show specific items
- Override default items (if you want to override one item and not the whole menu)
- Add new items
- Change display order for items

For that purpose you can use `getVisibleColumnMenuItems` and `columnMenuItems`.

**getVisibleColumnMenuItems**: It is available in both `GridColDef` and `componentsProps.columnMenu`, it receives list of all registered slots and should return a `filtered` and `ordered` list of items that are needed to be shown. It can be used either per-column basis by passing in `GridColDef` or for whole Grid by passing in `componentsProps.columnMenu`. If you have it in both, the preference will be given to the `GridColDef` one.

**columnMenuItems**: It could be used to override or register new items to the menu. You can simply pass the object with existing or new items and they will be updated/added to the grid.

```tsx
const columnMenuItems = {
  ['filter']: { // existing slot
    component: <MyCustomFilter />, // overriden property
    addDivider: true,
  },
  ['manageColumns']: { // override another existing slot
    addDivider: true,
  },
  ['closeMenu']: { // registering new slot
    component: <MenuCloseComponent />,
    displayName: 'MenuClose',
  }
}

// add new item in visible items and append it to the last of list
const getVisibleColumnMenuItems = (defaultItems) => [...defaultItems, 'closeMenu'];

<DataGrid 
  {...data} 
  componentProps={{ columnMenu: { getVisibleColumnMenuItems, columnMenuItems } }} 
/>
```

Currently available default slots for _DataGridCommunity_ are `filter`, `sorting`, `hideColumn` and `manageColumns`. 

{{"demo": "FilterColumnMenuGrid.js", "bg": "inline"}}

## Column menu with Pro/Premium options [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan)[<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan)

You can also access commercial features like column pinning etc from the column menu when using `DataGridPro` or `DataGridPremium`.

{{"demo": "ColumnMenuGridPro.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
