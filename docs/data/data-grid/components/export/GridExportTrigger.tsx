import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  ExportCsv,
  ExportPrint,
  ToolbarButton,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Download as CSV">
        <ExportCsv render={<ToolbarButton />}>
          <FileDownloadIcon fontSize="small" />
        </ExportCsv>
      </Tooltip>
      <Tooltip title="Print">
        <ExportPrint render={<ToolbarButton />}>
          <PrintIcon fontSize="small" />
        </ExportPrint>
      </Tooltip>
    </Toolbar>
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
      <DataGrid
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}
