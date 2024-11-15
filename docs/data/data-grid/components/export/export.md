# Data Grid - Export component

<p class="description">Components to trigger exports of the Data Grid.</p>

## Anatomy

The `Grid.Export` component is comprised of the following parts.

```tsx
<Grid.Export.Trigger />
```

### Trigger

A button that triggers an export.

The `exportType` prop can be set to `print`, `csv` or `excel`[<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan').

## Examples

Below are some ways the Export component can be used.

### Toolbar export buttons

Display export options as buttons on the toolbar.

{{"demo": "GridExportTrigger.js", "bg": "inline"}}

### Toolbar export menu

Display export options within a menu on the toolbar.

{{"demo": "GridExportMenu.js", "bg": "inline"}}

## API

- [Grid](/x/api/data-grid/data-grid/)
- [GridExport](/x/api/data-grid/data-grid/)
- [GridExportTrigger](/x/api/data-grid/data-grid/)
