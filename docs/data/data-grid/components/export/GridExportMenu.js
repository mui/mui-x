import * as React from 'react';
import { DataGridPremium, Grid } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function ExportMenu() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef(null);

  return (
    <React.Fragment>
      <Grid.Toolbar.Button
        ref={triggerRef}
        id="export-menu-trigger"
        aria-controls="export-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={() => setOpen(true)}
        size="small"
      >
        <FileDownloadIcon fontSize="small" />
        Export
        <ArrowDropDownIcon fontSize="small" sx={{ ml: -0.5, mr: -0.25 }} />
      </Grid.Toolbar.Button>
      <Menu
        id="export-menu"
        anchorEl={triggerRef.current}
        open={open}
        onClose={() => setOpen(false)}
        MenuListProps={{
          'aria-labelledby': 'export-menu-trigger',
        }}
      >
        <Grid.Export.CsvTrigger render={<MenuItem />}>
          Download as CSV
        </Grid.Export.CsvTrigger>
        <Grid.Export.ExcelTrigger render={<MenuItem />}>
          Download as Excel
        </Grid.Export.ExcelTrigger>
        <Grid.Export.PrintTrigger render={<MenuItem />}>
          Print
        </Grid.Export.PrintTrigger>
      </Menu>
    </React.Fragment>
  );
}

function Toolbar() {
  return (
    <Grid.Toolbar.Root>
      <ExportMenu />
    </Grid.Toolbar.Root>
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
      <DataGridPremium {...data} loading={loading} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
