# Data Grid - Toolbar component

<p class="description">The Toolbar component provides a way to add custom controls and functionality to the Data Grid.</p>

{{"demo": "GridToolbarBasic.js", "bg": "inline"}}

## Usage

Import the `Grid` component. See [Grid components](/x/react-data-grid/components/overview/) for details.

```tsx
import { Grid } from '@mui/x-data-grid';
```

Create a toolbar using the `Grid.Toolbar` component.

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

Pass the component to the `toolbar` slot.

```tsx
<DataGrid slots={{ toolbar: Toolbar }} />
```

## Anatomy

The `Grid.Toolbar` component is comprised of the following parts.

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

Renders a [ToggleButton](/material-ui/react-toggle-button/) component with some overrides.

{{"demo": "GridToolbarButton.js"}}

### ToggleButtonGroup

A toggle button group that can be used to switch between multiple states.

Renders a [ToggleButtonGroup](/material-ui/react-toggle-button/) component with some overrides.

{{"demo": "GridToolbarToggleButtonGroup.js"}}

### ToggleButton

A toggle button item that can be used to switch between two states.

Renders a [ToggleButton](/material-ui/react-toggle-button/) component with some overrides.

{{"demo": "GridToolbarToggleButton.js"}}

### Separator

Separate items and groups in the toolbar.

Renders a `div` with `role="separator"`.

```tsx
<GridToolbar.Separator />
```

## Examples

Below are some ways the Toolbar component can be used.

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
