import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DataGridPremium, Grid } from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const GridToolbarRoot = styled(Grid.Toolbar.Root)(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  height: 45,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const GridToolbarButton = styled(Grid.Toolbar.Button)(({ theme }) => ({
  minWidth: 0,
  color: theme.palette.action.active,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function ExportMenu() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <React.Fragment>
      <GridToolbarButton
        ref={triggerRef}
        id="export-menu-trigger"
        aria-controls="export-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={() => setOpen(true)}
        startIcon={<FileDownloadIcon fontSize="small" />}
        endIcon={<ArrowDropDownIcon fontSize="small" />}
      >
        Export
      </GridToolbarButton>
      <Menu
        id="export-menu"
        anchorEl={triggerRef.current}
        open={open}
        onClose={() => setOpen(false)}
        MenuListProps={{
          'aria-labelledby': 'export-menu-trigger',
        }}
      >
        <Grid.Export.Trigger exportType="csv" render={<MenuItem />}>
          Download as CSV
        </Grid.Export.Trigger>
        <Grid.Export.Trigger exportType="excel" render={<MenuItem />}>
          Download as Excel
        </Grid.Export.Trigger>
        <Grid.Export.Trigger exportType="print" render={<MenuItem />}>
          Print
        </Grid.Export.Trigger>
      </Menu>
    </React.Fragment>
  );
}

function Toolbar() {
  return (
    <GridToolbarRoot>
      <ExportMenu />
    </GridToolbarRoot>
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
