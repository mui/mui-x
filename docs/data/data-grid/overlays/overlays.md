# Data Grid - Overlays

<p class="description">The various data grid overlays.</p>

## Loading overlay

To display a loading overlay and signify that the data grid is in a loading state, set the `loading` prop to `true`.

{{"demo": "LoadingOverlay.js", "bg": "inline"}}

### Custom component

If you want to customize the no rows overlay, a component can be passed to the `loadingOverlay` slot. In the following demo, a [LinearProgress](/material-ui/react-progress/#linear) component is rendered in place of the default circular loading spinner.

{{"demo": "LoadingOverlayCustom.js", "bg": "inline"}}

## No rows overlay

The no rows overlay is displayed when the data grid has no rows.

{{"demo": "NoRowsOverlay.js", "bg": "inline"}}

### Custom component

If you want to customize the no rows overlay, a component can be passed to the `noRowsOverlay` slot and rendered in place. In the following demo, an illustration is added on top of the default "No rows" message.

{{"demo": "NoRowsOverlayCustom.js", "bg": "inline"}}

## No results overlay

The no results overlay is displayed when the data grid has no results after filtering.

{{"demo": "NoResultsOverlay.js", "bg": "inline"}}

### Custom component

If you want to customize the no results overlay, a component can be passed to the `noResults` slot and rendered in place. In the following demo, an illustration is added on top of the default "No results found" message.

{{"demo": "NoResultsOverlayCustom.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
