# Data Grid - Export component

<p class="description">Components to trigger exports of the Data Grid.</p>

## Anatomy

The Export component is comprised of the following parts:

```tsx
<Grid.Export.PrintTrigger />
<Grid.Export.CsvTrigger />
<Grid.Export.ExcelTrigger />
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

- [GridExportPrintTrigger](/x/api/data-grid/grid-export-print-trigger/)
- [GridExportCsvTrigger](/x/api/data-grid/grid-export-csv-trigger/)
- [GridExportExcelTrigger](/x/api/data-grid/grid-export-excel-trigger/)
