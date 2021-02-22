---
title: Data Grid - Rendering
components: DataGrid, XGrid
---

# Data Grid - Rendering

<p class="description">The grid is highly customizable. Take advantage of a React-first implementation.</p>

## Column definitions

This section is an extension of the main [column definitions documentation](/components/data-grid/columns/#column-definitions) that focuses on the rendering and the customization of the rendering with `GridColDef`.

### Value getter

Sometimes a column might not have a corresponding value and you just want to render a combination of different fields.

To do that, you can set the `valueGetter` attribute of `GridColDef` as in the example below:

**Note**: You need to set a `sortComparator` for the column sorting to work when setting the `valueGetter` attribute.

```tsx
function getFullName(params: ValueGetterParams) {
  return `${params.getValue('firstName') || ''} ${
    params.getValue('lastName') || ''
  }`;
}

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    width: 160,
    valueGetter: getFullName,
    sortComparator: (v1, v2, cellParams1, cellParams2) =>
      getFullName(cellParams1).localeCompare(getFullName(cellParams2)),
  },
];
```

{{"demo": "pages/components/data-grid/rendering/ValueGetterGrid.js", "defaultCodeOpen": false, "bg": "inline"}}

The value generated is used for filtering, sorting, rendering, etc unless overridden by a more specific configuration.

### Value formatter

The value formatters allow you to format values for display as a string.
For instance, you might want to format a JavaScript date object into a string year.

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    valueFormatter: (params: ValueFormatterParams) =>
      (params.value as Date).getFullYear(),
  },
];
```

{{"demo": "pages/components/data-grid/rendering/ValueFormatterGrid.js", "defaultCodeOpen": false, "bg": "inline"}}

The value generated is used for filtering, sorting, rendering in the cell and outside, etc unless overridden by a more specific configuration.

### Render cell

By default, the grid render the value as a string in the cell.
It resolves the rendered output in the following order:

1. `renderCell() => ReactElement`
1. `valueFormatter() => string`
1. `valueGetter() => string`
1. `row[field]`

The `renderCell` method of the column definitions is similar to `valueFormatter`.
However, it trades to be able to only render in a cell in exchange for allowing to return a React node (instead of a string).

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    headerName: 'Year',
    renderCell: (params: GridCellParams) => (
      <strong>
        {(params.value as Date).getFullYear()}
        <Button
          variant="contained"
          color="primary"
          size="small"
          style={{ marginLeft: 16 }}
        >
          Open
        </Button>
      </strong>
    ),
  },
];
```

{{"demo": "pages/components/data-grid/rendering/RenderCellGrid.js", "defaultCodeOpen": false, "bg": "inline"}}

### Render header

You can customize the look of each header with the `renderHeader` method.
It takes precedence over the `headerName` property.

```tsx
const columns: GridColDef[] = [
  {
    field: 'date',
    width: 150,
    type: 'date',
    renderHeader: (params: GridColParams) => (
      <strong>
        {'Birthday '}
        <span role="img" aria-label="enjoy">
          🎂
        </span>
      </strong>
    ),
  },
];
```

{{"demo": "pages/components/data-grid/rendering/RenderHeaderGrid.js", "defaultCodeOpen": false, "bg": "inline"}}

### Styling header

The `GridColDef` type has properties to apply class names and custom CSS on the header.

- `headerClassName`: to apply class names into the column header.
- `headerAlign`: to align the content of the header. It must be 'left' | 'right' | 'center'.

```tsx
const columns: GridColumns = [
  {
    field: 'first',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
  },
  {
    field: 'last',
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
  },
];
```

{{"demo": "pages/components/data-grid/rendering/StylingHeaderGrid.js", "defaultCodeOpen": false, "bg": "inline"}}

### Styling cells

The `GridColDef` type has properties to apply class names and custom CSS on the cells.

- `cellClassName`: to apply class names on every cell. It can also be a function.
- `align`: to align the content of the cells. It must be 'left' | 'right' | 'center'. (Note you must use `headerAlign` to align the content of the header.)

```tsx
const columns: GridColumns = [
  {
    field: 'name',
    cellClassName: 'super-app-theme--cell',
  },
  {
    field: 'score',
    type: 'number',
    cellClassName: (params: GridCellClassParams) =>
      clsx('super-app', {
        negative: (params.value as number) < 0,
        positive: (params.value as number) > 0,
      }),
  },
];
```

{{"demo": "pages/components/data-grid/rendering/StylingCellsGrid.js", "defaultCodeOpen": false, "bg": "inline"}}

## Layout

By default, the grid has no intrinsic dimensions. It occupies the space its parent leaves.

> ⚠️ When using % (**percentage**) for your height or width.<br> ><br>
> You need to make sure the container you are putting the grid into also has an intrinsic dimension.
> The browsers fit the element according to a percentage of the parent dimension.
> If the parent has no dimensions, then the % will be zero.

### Flex layout

It's recommended to use a flex container to render the grid. This allows a flexible layout, resizes well, and works on all devices.

{{"demo": "pages/components/data-grid/rendering/FlexLayoutGrid.js", "bg": "inline"}}

### Predefined dimensions

You can predefine dimensions for the parent of the grid.

{{"demo": "pages/components/data-grid/rendering/FixedSizeGrid.js", "bg": "inline"}}

### Auto height

The `autoHeight` prop allows the grid to size according to its content.
This means that the number of rows will drive the height of the grid and consequently, they will all be rendered and visible to the user at the same time.

> ⚠️ This is not recommended for large datasets as row virtualization will not be able to improve performance by limiting the number of elements rendered in the DOM.

{{"demo": "pages/components/data-grid/rendering/AutoHeightGrid.js", "bg": "inline"}}

## Density

You can change the density of the rows and the column header.

### Density selector

To enable the density selector you need to compose a toolbar containing the `GridDensitySelector` component, and apply it using the `Toolbar` key in the grid `components` prop.

The user can change the density of the data grid by using the density selector from the toolbar.

{{"demo": "pages/components/data-grid/rendering/DensitySelectorGrid.js", "bg": "inline"}}

To hide the density selector add the `disableDensitySelector` prop to the data grid.

### Density prop

The vertical density of the data grid can be set using the `density` prop. The `density` prop applies the values determined by the `rowHeight` and `headerHeight` props, if supplied. The user can override this setting with the toolbar density selector, if provided.

{{"demo": "pages/components/data-grid/rendering/DensitySelectorSmallGrid.js", "bg": "inline"}}

## Virtualization

DOM virtualization is the feature that allows the grid to handle an unlimited\* number of rows and columns.
This is a built-in feature of the rendering engine and greatly improves rendering performance.

_unlimited\*: Browsers set a limit on the number of pixels a scroll container can host: 17.5 million pixels on Firefox, 33.5 million pixels on Chrome, Edge, and Safari. A [reproduction](https://codesandbox.io/s/beautiful-silence-1yifo?file=/src/App.js)._

### Row virtualization [<span class="pro"></span>](https://material-ui.com/store/items/material-ui-x/)

Row virtualization is the insertion and removal of rows as the grid scrolls vertically.

The grid renders twice as many rows as are visible. It isn't configurable yet.
Row virtualization is limited to 100 rows in the `DataGrid` component.

### Column virtualization

Column virtualization is the insertion and removal of columns as the grid scrolls horizontally.

- Overscanning by at least one column allows the arrow key to focus on the next (not yet visible) item.
- Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
- Overscanning more allows the built-in search feature of the browser to find more matching cells.
- Overscanning too much can negatively impact performance.

By default, 2 columns are rendered outside of the viewport. You can change this option with the `columnBuffer` prop. The following demo renders 1,000 columns in total:

{{"demo": "pages/components/data-grid/rendering/ColumnVirtualizationGrid.js", "bg": "inline"}}

You can disable column virtualization by setting the column buffer to a higher number than the number of rendered columns, e.g. with `columnBuffer={columns.length}` or `columnBuffer={Number.MAX_SAFE_INTEGER}`.

## Components prop

As part of the customization API, the grid allows you to replace and override nested components with the `components` prop.
The prop accepts an object of type [GridSlotsComponent](/api/data-grid/#slots) .

### Toolbar

To enable the toolbar you need to add the `Toolbar: GridToolbar` to the grid `components` prop.
This demo showcases how this can be achieve.

{{"demo": "pages/components/data-grid/rendering/ToolbarGrid.js", "bg": "inline"}}

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

{{"demo": "pages/components/data-grid/rendering/CustomToolbarGrid.js", "bg": "inline"}}

### Loading overlay

By default, the loading overlay displays a circular progress.
This demo replaces it with a linear progress.

{{"demo": "pages/components/data-grid/rendering/CustomLoadingOverlayGrid.js", "bg": "inline"}}

### No rows overlay

In the following demo, an illustration is added on top of the default "No Rows" message.

{{"demo": "pages/components/data-grid/rendering/CustomEmptyOverlayGrid.js", "bg": "inline"}}

### Footer

The grid exposes props to hide specific elements of the UI:

- `hideFooter`: If `true`, the footer component is hidden.
- `hideFooterRowCount`: If `true`, the row count in the footer is hidden.
- `hideFooterSelectedRowCount`: If `true`, the selected row count in the footer is hidden.
- `hideFooterPagination`: If `true`, the pagination component in the footer is hidden.

By default, pagination uses the [TablePagination](/components/pagination/#table-pagination) component that is optimized for handling tabular data.
This demo replaces it with the [Pagination](/components/pagination/) component.

{{"demo": "pages/components/data-grid/rendering/CustomPaginationGrid.js", "bg": "inline"}}

## Customization example

The following grid leverages the CSS customization API to match the Ant Design specification.

{{"demo": "pages/components/data-grid/rendering/AntDesignGrid.js"}}
