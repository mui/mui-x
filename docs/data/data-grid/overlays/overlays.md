# Data Grid - Overlays

<p class="description">The various data grid overlays.</p>

## Loading overlay

To display a loading overlay and signify that the data grid is in a loading state, set the `loading` prop to `true`.

The data grid supports 3 loading overlay variants out of the box:

- `circular-progress` (default): a circular loading spinner.
- `linear-progress`: an indeterminate linear progress bar.
- `skeleton`: an animated placeholder of the data grid.

The type of loading overlay to display can be set via `slotProps.loadingOverlay` for the following two props:

- `variant`: when `loading` and there are rows in the table.
- `noRowsVariant`: when `loading` and there are not any rows in the table.

```tsx
<DataGrid
  {...data}
  loading
  slotProps={{
    loadingOverlay: {
      variant: 'linear-progress',
      noRowsVariant: 'skeleton',
    },
  }}
/>
```

### Circular progress

A circular loading spinner, the default loading overlay.

{{"demo": "LoadingOverlay.js", "bg": "inline"}}

### Linear progress

An indeterminate linear progress bar.

{{"demo": "LoadingOverlayLinearProgress.js", "bg": "inline"}}

### Skeleton

An animated placeholder of the data grid.

{{"demo": "LoadingOverlaySkeleton.js", "bg": "inline"}}

### Custom component

If you want to customize the no-rows overlay, a component can be passed to the `loadingOverlay` slot.

In the following demo, a labeled determinate [CircularProgress](/material-ui/react-progress/#circular-determinate) component is rendered in place of the default loading overlay, with some additional _Loading rows…_ text.

{{"demo": "LoadingOverlayCustom.js", "bg": "inline"}}

## No rows overlay

The no-rows overlay is displayed when the data grid has no rows.

{{"demo": "NoRowsOverlay.js", "bg": "inline"}}

### Custom component

If you want to customize the no-rows overlay, a component can be passed to the `noRowsOverlay` slot and rendered in place.

In the following demo, an illustration is added on top of the default "No rows" message.

{{"demo": "NoRowsOverlayCustom.js", "bg": "inline"}}

## No results overlay

The no-results overlay is displayed when the data grid has no results after filtering.

{{"demo": "NoResultsOverlay.js", "bg": "inline"}}

### Custom component

If you want to customize the no results overlay, a component can be passed to the `noResults` slot and rendered in place.

In the following demo, an illustration is added on top of the default "No results found" message.

{{"demo": "NoResultsOverlayCustom.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
