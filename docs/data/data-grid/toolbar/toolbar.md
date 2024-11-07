# Data Grid - Toolbar

<p class="description">The toolbar component provides a set way to add custom controls and functionality to the Data Grid.</p>

{{"demo": "GridToolbarBasic.js", "bg": "inline"}}

## Usage

Import the `GridToolbar` component.

```tsx
import { GridToolbar } from '@mui/x-data-grid';
```

Create a toolbar using the `GridToolbar` component.

```tsx
function Toolbar() {
  return (
    <GridToolbar.Root>
      <GridToolbar.Button>Filters</GridToolbar.Button>
    </GridToolbar.Root>
  );
}
```

Pass the toolbar component to the `toolbar` slot.

```tsx
<DataGrid slots={{ toolbar: Toolbar }} />
```

## Anatomy

```tsx
<GridToolbar.Root>
  <GridToolbar.Button />
  <GridToolbar.Separator />
  <GridToolbar.ToggleButtonGroup>
    <GridToolbar.ToggleButton>
  </GridToolbar.ToggleButtonGroup>
</GridToolbar.Root>
```

### Root

The top level toolbar component that positions items in a row. Renders a `div` with `role="toolbar"`.

### Button

A button item that can be used to perform actions from the toolbar. Renders a [Button](/material-ui/react-button/) component with some overrides.

{{"demo": "GridToolbarButton.js"}}

### ToggleButtonGroup

A toggle button group that can be used to switch between multiple states. Renders a [ToggleButtonGroup](/material-ui/react-toggle-button/) component with some overrides.

{{"demo": "GridToolbarToggleButtonGroup.js"}}

### ToggleButton

A toggle button item that can be used to switch between two states. Renders a [ToggleButton](/material-ui/react-toggle-button/) component with some overrides.

{{"demo": "GridToolbarToggleButton.js"}}

### Separator

Separate items and groups in the toolbar. Renders a `div` with `role="separator"`.

```tsx
<GridToolbar.Separator />
```

## Examples

Below are some common examples of toolbar items.

### Columns panel trigger

Toggle the visibility of the columns panel.

{{"demo": "GridToolbarColumnsPanelTrigger.js", "bg": "inline"}}

### Filter panel trigger

Toggle the visibility of the filter panel.

{{"demo": "GridToolbarFilterPanelTrigger.js", "bg": "inline"}}

### Filter bar

Show active filter chips in the toolbar.

{{"demo": "GridToolbarFilterBar.js", "bg": "inline"}}

### Print trigger

Open the print dialog. See [Print export](/x/react-data-grid/export/#print-export) for more details.

{{"demo": "GridToolbarPrintTrigger.js", "bg": "inline"}}

### Download menu

Download grid data as a CSV or Excel file. See [CSV export](/x/react-data-grid/export/#csv-export) and [Excel export](/x/react-data-grid/export/#excel-export) for more details.

{{"demo": "GridToolbarDownloadMenu.js", "bg": "inline"}}

### Density menu

Change row density. See [Density](/x/react-data-grid/accessibility/#density) for more details.

{{"demo": "GridToolbarDensityMenu.js", "bg": "inline"}}

## API

- [GridToolbar](/x/api/data-grid/data-grid/)
- [GridToolbarRoot](/x/api/data-grid/data-grid/)
- [GridToolbarButton](/x/api/data-grid/data-grid/)
- [GridToolbarToggleButtonGroup](/x/api/data-grid/data-grid/)
- [GridToolbarToggleButton](/x/api/data-grid/data-grid/)
- [GridToolbarSeparator](/x/api/data-grid/data-grid/)
