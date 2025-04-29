import * as React from 'react';
import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  ExportCsv,
  ExportExcel,
  ExportPrint,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function ExportMenu() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);

  return (
    <React.Fragment>
      <Tooltip title="Export">
        <ToolbarButton
          ref={triggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={() => setOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
      <Menu
        id="export-menu"
        anchorEl={triggerRef.current}
        open={open}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          list: {
            'aria-labelledby': 'export-menu-trigger',
          },
        }}
      >
        <ExportCsv render={<MenuItem />}>Download as CSV</ExportCsv>
        <ExportExcel render={<MenuItem />}>Download as Excel</ExportExcel>
        <ExportPrint render={<MenuItem />}>Print</ExportPrint>
      </Menu>
    </React.Fragment>
  );
}

function CustomToolbar() {
  return (
    <Toolbar>
      <ExportMenu />
    </Toolbar>
  );
}

export default function GridExportMenu() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPremium
        {...data}
        loading={loading}
        slots={{ toolbar: CustomToolbar }}
        showToolbar
      />
    </div>
  );
}
