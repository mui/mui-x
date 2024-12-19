import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Grid.Export.CsvTrigger render={<Grid.Toolbar.Button size="small" />}>
        <FileDownloadIcon fontSize="small" />
        CSV
      </Grid.Export.CsvTrigger>
      <Grid.Export.PrintTrigger render={<Grid.Toolbar.Button size="small" />}>
        <PrintIcon fontSize="small" />
        Print
      </Grid.Export.PrintTrigger>
    </Grid.Toolbar.Root>
  );
}

export default function GridExportTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
