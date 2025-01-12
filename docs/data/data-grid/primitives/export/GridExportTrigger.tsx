import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Toolbar, Export } from '@mui/x-data-grid/primitives';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

function CustomToolbar() {
  return (
    <Toolbar.Root>
      <Tooltip title="Download as CSV">
        <Export.Csv render={<Toolbar.Button />}>
          <FileDownloadIcon fontSize="small" />
        </Export.Csv>
      </Tooltip>
      <Tooltip title="Print">
        <Export.Print render={<Toolbar.Button />}>
          <PrintIcon fontSize="small" />
        </Export.Print>
      </Tooltip>
    </Toolbar.Root>
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
      <DataGrid {...data} loading={loading} slots={{ toolbar: CustomToolbar }} />
    </div>
  );
}
