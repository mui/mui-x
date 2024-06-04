# Data Grid - Overlays

<p class="description">The various data grid overlays.</p>

## Loading overlay

To display a loading overlay and signify that the data grid is in a loading state, set the `loading` prop to `true`.

{{"demo": "LoadingOverlay.js", "bg": "inline"}}

### Variants

The data grid supports 3 loading overlay variants out of the box:

- `circular-progress` (default): a circular loading spinner.
- `linear-progress`: an indeterminate linear progress bar.
- `skeleton`: an animated placeholder of the data grid.

The type of loading overlay to display can be set via `slotProps.loadingOverlay` for the following two props:

- `variant`: when `loading` and there are rows in the table.
- `noRowsVariant`: when `loading` and there are not any rows in the table.

In the following demo, we are showing a skeleton overlay when there are no rows, and a linear progress bar when more are loading:

{{"demo": "LoadingOverlayVariants.js", "bg": "inline"}}

## No rows overlay

The no rows overlay is displayed when the data grid has no rows.

{{"demo": "NoRowsOverlay.js", "bg": "inline"}}

## No results overlay

The no results overlay is displayed when the data grid has no results after filtering.

{{"demo": "NoResultsOverlay.js", "bg": "inline"}}

## Custom overlays

You can customize the rendering of the overlays as shown in [the component section](/x/react-data-grid/components/#component-slots) of the documentation.

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
