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

You can customize the column menu either by passing `components` and `componentsProps` props to the column menu component or by [passing a custom component](/x/react-data-grid/components/#overriding-components) to the `ColumnMenu` slot of the data grid component.

**components**: Prop accepted by column menu components `<GridColumnMenuDefault />` or `<GridColumnMenuSimple />`, could be used to override default column menu components or add new components.

**componentsProps**: Every item has a `displayOrder` based which it will be placed before or after other items in the menu. It can be overriden using `componentsProps`. You can also use this to pass extra props to custom column menu components.

:::warning
The `components` prop uses pascal case (`ColumnMenuFilterItem`), while `componentsProps` uses camel case (`columnMenuFilterItem`).
:::

### Adding a menu item

To add a new menu item, pass it in `components` prop. You can also set the `displayOrder` (default `100`) or pass new props to the components using `componentsProps` prop.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenuDefault
      {...props}
      components={{
        // Add new item
        ColumnMenuUserItem: CustomUserItem,
      }}
      componentsProps={{
        columnMenuUserItem: {
          // set `displayOrder` for new item
          displayOrder: 15,
          // pass additional props
          myCustomValue: 'Do custom action',
          myCustomHandler: () => alert('Custom handler fired'),
        },
      }}
    />
  );
}
```

### Overriding default menu items

Use the `components` prop to override default menu items.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenuDefault
      {...props}
      components={{
        // Override `ColumnMenuFilterItem` component
        ColumnMenuFilterItem: CustomFilterItem,
      }}
    />
  );
}
```

### Hiding a menu item

To hide a menu item, you can set the component in `components` as `null`.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenuDefault
      {...props}
      components={{
        // Hide `ColumnMenuColumnsItem`
        ColumnMenuColumnsItem: null,
      }}
    />
  );
}
```

### Reordering menu items

You can pass `displayOrder` for the specific item in `componentsProps` to re-order.

```tsx
function CustomColumnMenu(props: GridColumnMenuProps) {
  return (
    <GridColumnMenuDefault
      {...props}
      componentsProps={{
        // Swap positions of filter and sort items
        columnMenuFilterItem: {
          displayOrder: 0, // Previously `10`
        },
        columnMenuSortItem: {
          displayOrder: 10, // Previously `0`
        },
      }}
    />
  );
}
```

The following demo implements adding, overriding, hiding and re-ordering of some column menu items.

{{"demo": "ReuseColumnMenuGrid.js", "bg": "inline"}}

### Column menu components and their configurations

As a reference, here are the default `components` supported by each column menu design along with the item components being used and default `displayOrder`.

{{"demo": "ColumnMenuGridReferences.js", "bg": "inline", "hideToolbar": true}}

### Custom component

You can also customize column menu by [passing a custom component](/x/react-data-grid/components/#overriding-components) to the `ColumnMenu` slot of the data grid component. If you want some default items rendered, you can import them and use in your custom component.

{{"demo": "CustomColumnMenuGrid.js", "bg": "inline"}}

:::info
<strong>Tip</strong>: In column menu component and items, you recieve a prop `colDef` corresponding to the current column, you can use this to conditionally render some items or change some logic.
:::

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
