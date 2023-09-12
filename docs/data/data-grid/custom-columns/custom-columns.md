# Data Grid - Custom columns

<p class="description">Define custom column types.</p>

The columns are defined with the `columns` prop which has the type `GridColDef[]`.

`field` is the only required property since it's the column identifier. It's also used to match with `GridRowModel` values.

## Sparkline

Sparkline are mini-charts optimized for grid cell.
They can be integrated inside your data grid using the [`@mui/x-charts` package](/x/react-charts/).

{{"demo": "SparklineColumn.js", "bg": "inline"}}

## API

- [DataGrid](/x/api/data-grid/data-grid/)
- [DataGridPro](/x/api/data-grid/data-grid-pro/)
- [DataGridPremium](/x/api/data-grid/data-grid-premium/)
