# Data Grid - Export component

<p class="description">Components to trigger exports of the Data Grid.</p>

## Basic usage

The demo below shows how to use the Export component to trigger exports.

{{"demo": "GridExportTrigger.js", "bg": "inline"}}

## Anatomy

The Export component contains the following parts:

```tsx
<Grid.Export.PrintTrigger />
<Grid.Export.CsvTrigger />
<Grid.Export.ExcelTrigger />
```

### PrintTrigger

A button that triggers a print export.

Renders the `baseButton` slot.

### CsvTrigger

A button that triggers a CSV export.

Renders the `baseButton` slot.

### ExcelTrigger

A button that triggers an Excel export.

Renders the `baseButton` slot.

## Recipes

Below are some ways the Export component can be used.

### Toolbar export menu

Display export options within a menu on the toolbar.

{{"demo": "GridExportMenu.js", "bg": "inline"}}

## Accessibility

### ARIA

- The element rendered by the `PrintTrigger`, `CsvTrigger` and `ExcelTrigger` components should have a text label, or an `aria-label` attribute set.

## API

- [GridExportPrintTrigger](/x/api/data-grid/grid-export-print-trigger/)
- [GridExportCsvTrigger](/x/api/data-grid/grid-export-csv-trigger/)
- [GridExportExcelTrigger](/x/api/data-grid/grid-export-excel-trigger/)
