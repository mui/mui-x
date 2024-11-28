import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Grid.Export.Trigger exportType="csv" render={<Grid.Toolbar.Button />}>
        <FileDownloadIcon fontSize="small" />
        CSV
      </Grid.Export.Trigger>
      <Grid.Export.Trigger exportType="print" render={<Grid.Toolbar.Button />}>
        <PrintIcon fontSize="small" />
        Print
      </Grid.Export.Trigger>
    </Grid.Toolbar.Root>
  );
}

export default function GridExportTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} loading={loading} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
