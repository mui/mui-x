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
      <Grid.Toolbar.Button>New row</Grid.Toolbar.Button>
    </Grid.Toolbar.Root>
  );
}
```

Pass the component to the `toolbar` slot:

```tsx
<DataGrid slots={{ toolbar: Toolbar }} />
```

## Anatomy

The Toolbar component is comprised of the following parts:

```tsx
<Grid.Toolbar.Root>
  <Grid.Toolbar.Button />
</Grid.Toolbar.Root>
```

### Root

The top level toolbar component.

### Button

A button that can be used to perform actions from the toolbar.

## Examples

Below are some ways the Toolbar component can be used.

### Default toolbar

The demo below shows the default and recommended toolbar configuration.

This example can be used as a starting point for customizing the toolbar by adding or removing features based on specific needs.

{{"demo": "GridToolbarDefault.js", "bg": "inline"}}

### Settings menu

Allow users to customize the data grid appearance from the toolbar.

{{"demo": "GridToolbarSettingsMenu.js", "bg": "inline"}}

### Filter bar

Show active filter chips in the toolbar.

{{"demo": "GridToolbarFilterBar.js", "bg": "inline"}}

## API

- [GridToolbarRoot](/x/api/data-grid/grid-toolbar-root/)
- [GridToolbarButton](/x/api/data-grid/grid-toolbar-button/)
