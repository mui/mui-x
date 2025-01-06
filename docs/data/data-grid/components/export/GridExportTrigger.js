import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <Tooltip title="Download as CSV">
        <Grid.Export.CsvTrigger render={<Grid.Toolbar.Button />}>
          <FileDownloadIcon fontSize="small" />
        </Grid.Export.CsvTrigger>
      </Tooltip>
      <Tooltip title="Print">
        <Grid.Export.PrintTrigger render={<Grid.Toolbar.Button />}>
          <PrintIcon fontSize="small" />
        </Grid.Export.PrintTrigger>
      </Tooltip>
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
