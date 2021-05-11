---
title: Data Grid - Components
components: DataGrid, XGrid
---

# Data Grid - Components

<p class="description">The grid is highly customizable. Override components using the <code>components</code> prop.</p>

As part of the customization API, the grid allows you to replace and override nested components with the `components` prop.
The prop accepts an object of type [GridSlotsComponent](/api/data-grid/#slots) .

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
