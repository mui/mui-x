# Data Grid - Toolbar component

<p class="description">The Toolbar component enables adding custom actions and controls to the data grid.</p>

{{"demo": "GridToolbar.js"}}

## Usage

Import `Grid` from the data grid package:

```tsx
import { Grid } from '@mui/x-data-grid';
```

Build a toolbar component using the `Grid.Toolbar` parts:

```tsx
function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Grid.FilterPanel.Trigger render={<Grid.Toolbar.Button />}>
        Filters
      </Grid.FilterPanel.Trigger>
    </Grid.Toolbar.Root>
  );
}
```

Pass the component to the `toolbar` slot:

```tsx
<DataGrid slots={{ toolbar: Toolbar }} />
```

## Anatomy

`Grid.Toolbar` is comprised of the following parts:

```tsx
<Grid.Toolbar.Root>
  <Grid.Toolbar.Button />
  <Grid.Toolbar.Separator />
  <Grid.Toolbar.ToggleButtonGroup>
    <Grid.Toolbar.ToggleButton />
  </Grid.Toolbar.ToggleButtonGroup>
</Grid.Toolbar.Root>
```

### Root

The top level component that positions items in a row.

Renders a `div` with `role="toolbar"`.

### Button

A button item that can be used to perform actions from the toolbar.

See [ButtonBase API](/material-ui/api/button-base/) for available props.

{{"demo": "GridToolbarButton.js"}}

### ToggleButtonGroup

A toggle button group that can be used to switch between multiple states.

See [ToggleButtonGroup API](/material-ui/api/toggle-button/) for available props.

{{"demo": "GridToolbarToggleButtonGroup.js"}}

### ToggleButton

A toggle button item that can be used to switch between two states.

See [ToggleButton API](/material-ui/api/toggle-button-group/) for available props.

{{"demo": "GridToolbarToggleButton.js"}}

### Separator

Separate items and groups in the toolbar.

Renders a `div` with `role="separator"`.

```tsx
<GridToolbar.Separator />
```

## Examples

Below are some ways the Toolbar component can be used.

### Default toolbar

The demo below shows the default and recommended toolbar configuration.

This example can be used as a starting point for customizing the toolbar by adding or removing features based on specific needs.

{{"demo": "GridToolbarDefault.js", "bg": "inline"}}

### Filter bar

Show active filter chips in the toolbar.

{{"demo": "GridToolbarFilterBar.js", "bg": "inline"}}

## API

- [GridToolbar](/x/api/data-grid/data-grid/)
- [GridToolbarRoot](/x/api/data-grid/data-grid/)
- [GridToolbarButton](/x/api/data-grid/data-grid/)
- [GridToolbarToggleButtonGroup](/x/api/data-grid/data-grid/)
- [GridToolbarToggleButton](/x/api/data-grid/data-grid/)
- [GridToolbarSeparator](/x/api/data-grid/data-grid/)
