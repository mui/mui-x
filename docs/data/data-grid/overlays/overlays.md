# Data Grid - Overlays

<p class="description">The various Data Grid overlays.</p>

## Loading overlay

To display a loading overlay and signify that the Data Grid is in a loading state, set the `loading` prop to `true`.

The Data Grid supports 3 loading overlay variants out of the box:

- `skeleton`: an animated placeholder of the Data Grid.
- `linear-progress`: an indeterminate linear progress bar.
- `circular-progress`: a circular loading spinner.

The type of loading overlay to display can be set via `slotProps.loadingOverlay` for the following two props:

- `variant` (default: `linear-progress`): when `loading` and there are rows in the table.
- `noRowsVariant` (default: `skeleton`): when `loading` and there are not any rows in the table.

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

### Skeleton

An animated placeholder of the Data Grid.

{{"component": "file://./demos/loading-overlay-skeleton/index.ts", "bg": "inline"}}

### Linear progress

An indeterminate linear progress bar.

{{"component": "file://./demos/loading-overlay-linear-progress/index.ts", "bg": "inline"}}

### Circular progress

A circular loading spinner.

{{"component": "file://./demos/loading-overlay-circular-progress/index.ts", "bg": "inline"}}

### Custom component

If you want to customize the no-rows overlay, a component can be passed to the `loadingOverlay` slot.

In the following demo, a labeled determinate [CircularProgress](/material-ui/react-progress/#circular-determinate) component is rendered in place of the default loading overlay, with some additional _Loading rows…_ text.

{{"component": "file://./demos/loading-overlay-custom/index.ts", "bg": "inline"}}

## No columns overlay

The no-columns overlay is displayed when the Data Grid has no columns, or when all columns are hidden.

The "Manage columns" button is displayed when all columns are hidden and `disableColumnSelector` is `false`.

{{"component": "file://./demos/no-columns-overlay/index.ts", "bg": "inline"}}

### Custom component

If you want to customize the no-columns overlay, a component can be passed to the `noColumnsOverlay` slot and rendered in place.

In the following demo, an illustration is added on top of the default "No columns" message.

{{"component": "file://./demos/no-columns-overlay-custom/index.ts", "bg": "inline"}}

## No rows overlay

The no-rows overlay is displayed when the Data Grid has no rows.

{{"component": "file://./demos/no-rows-overlay/index.ts", "bg": "inline"}}

### Custom component

If you want to customize the no-rows overlay, a component can be passed to the `noRowsOverlay` slot and rendered in place.

In the following demo, an illustration is added on top of the default "No rows" message.

{{"component": "file://./demos/no-rows-overlay-custom/index.ts", "bg": "inline"}}

## No results overlay

The no-results overlay is displayed when the Data Grid has no results after filtering.

{{"component": "file://./demos/no-results-overlay/index.ts", "bg": "inline"}}

### Custom component

If you want to customize the no results overlay, a component can be passed to the `noResults` slot and rendered in place.

In the following demo, an illustration is added on top of the default "No results found" message.

{{"component": "file://./demos/no-results-overlay-custom/index.ts", "bg": "inline"}}

## Empty pivot overlay

The empty pivot overlay is displayed when pivot mode is enabled but fields have been added to the rows section.

{{"component": "file://./demos/empty-pivot-overlay/index.ts", "bg": "inline"}}

### Custom component

To customize the empty pivot overlay, pass a custom component to the `emptyPivotOverlay` slot.

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
