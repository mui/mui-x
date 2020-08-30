---
title: Data Grid - Rendering
components: DataGrid, XGrid
---

# Data Grid - Rendering

<p class="description">Start</p>

## Components

As part of our customization API, the grid allows to replace and override the following components:

- `header`: The component rendered above the column header bar.
- `loadingOverlay`: The component rendered when the loading react prop is set to true.
- `noRowsOverlay`: The component rendered when the rows react prop is empty or [].
- `footer`: The component rendered below the viewport.
- `pagination`: The component rendered for the pagination feature.

### Pagination

By default, the pagination uses the [TablePagination](/components/pagination/#table-pagination) component that is optimized for handling tabular data. This demo replaces it with the [Pagination](/components/pagination/) component.

{{"demo": "pages/components/data-grid/rendering/CustomPaginationGrid.js"}}
