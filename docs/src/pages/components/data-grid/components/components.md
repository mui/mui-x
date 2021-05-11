---
title: Data Grid - Components
components: DataGrid, XGrid
---

# Data Grid - Components

<p class="description">The grid is highly customizable. Override components using the <code>components</code> prop.</p>

As part of the customization API, the grid allows you to replace and override nested components with the `components` prop.
The prop accepts an object of type [`GridSlotsComponent`](/api/data-grid/#slots).
If you wish to pass some props in a custom component, you can do it using the `componentsProps` prop. This prop is of type `GridSlotsComponentsProps`.

As an example, you could override the column menu with some props as below.

```jsx
<DataGrid
  rows={rows}
  columns={columns}
  components={{
    ColumnMenu: MyCustomColumnMenu,
  }}
  componentsProps={{
    columnMenu: { background: 'red', counter: rows.length },
  }}
/>
```

**Note** The casing is different between the `components` and `componentsProps` prop.

## ColumnMenu

As mentioned above, the column menu is a customizable component that can be recomposed easily and customised on each column.

{{"demo": "pages/components/data-grid/components/CustomColumnMenu.js", "bg": "inline"}}

Below is our default `GridColumnMenu`.

```tsx
export const GridColumnMenu = React.forwardRef<
  HTMLUListElement,
  GridColumnMenuProps
>(function GridColumnMenu(props: GridColumnMenuProps, ref) {
  const { hideMenu, currentColumn } = props;

  return (
    <GridColumnMenuContainer ref={ref} {...props}>
      <SortGridMenuItems onClick={hideMenu} column={currentColumn!} />
      <GridFilterMenuItem onClick={hideMenu} column={currentColumn!} />
      <HideGridColMenuItem onClick={hideMenu} column={currentColumn!} />
      <GridColumnsMenuItem onClick={hideMenu} column={currentColumn!} />
    </GridColumnMenuContainer>
  );
});
```

## Toolbar

To enable the toolbar you need to add the `Toolbar: GridToolbar` to the grid `components` prop.
This demo showcases how this can be achieved.

{{"demo": "pages/components/data-grid/components/ToolbarGrid.js", "bg": "inline"}}

Alternatively, you can compose your own toolbar.

```jsx
function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridColumnsToolbarButton />
      <GridFilterToolbarButton />
    </GridToolbarContainer>
  );
}
```

{{"demo": "pages/components/data-grid/components/CustomToolbarGrid.js", "bg": "inline"}}

## Loading overlay

By default, the loading overlay displays a circular progress.
This demo replaces it with a linear progress.

{{"demo": "pages/components/data-grid/components/CustomLoadingOverlayGrid.js", "bg": "inline"}}

## No rows overlay

In the following demo, an illustration is added on top of the default "No Rows" message.

{{"demo": "pages/components/data-grid/components/CustomEmptyOverlayGrid.js", "bg": "inline"}}

## Footer

The grid exposes props to hide specific elements of the UI:

- `hideFooter`: If `true`, the footer component is hidden.
- `hideFooterRowCount`: If `true`, the row count in the footer is hidden.
- `hideFooterSelectedRowCount`: If `true`, the selected row count in the footer is hidden.
- `hideFooterPagination`: If `true`, the pagination component in the footer is hidden.

By default, pagination uses the [TablePagination](/components/pagination/#table-pagination) component that is optimized for handling tabular data.
This demo replaces it with the [Pagination](/components/pagination/) component.

{{"demo": "pages/components/data-grid/components/CustomPaginationGrid.js", "bg": "inline"}}

## Icons

As any component slot, every icon can be customised. However, it is not yet possible to use the `componentsProps` with icons.

{{"demo": "pages/components/data-grid/components/CustomSortIcons.js", "bg": "inline"}}

```jsx
<DataGrid
  rows={rows}
  columns={columns}
  components={{
    ColumnSortedDescendingIcon: SortedDescendingIcon,
    ColumnSortedAscendingIcon: SortedAscendingIcon,
  }}
/>
```
