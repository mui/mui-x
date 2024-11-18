import * as React from 'react';
import { DataGrid, Grid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';

function Toolbar() {
  const [downloadMenuOpen, setDownloadMenuOpen] = React.useState(false);
  const downloadMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Grid.Toolbar.Root>
      <GridToolbarQuickFilter sx={{ mr: 'auto' }} />

      <Tooltip title="Columns">
        <Grid.ColumnsPanel.Trigger render={<Grid.Toolbar.Button />}>
          <ViewColumnIcon fontSize="small" />
        </Grid.ColumnsPanel.Trigger>
      </Tooltip>

      <Tooltip title="Filters">
        <Grid.FilterPanel.Trigger render={<Grid.Toolbar.Button />}>
          <FilterListIcon fontSize="small" />
        </Grid.FilterPanel.Trigger>
      </Tooltip>

      <Grid.Toolbar.Separator />

      <Tooltip title="Print">
        <Grid.Export.Trigger exportType="print" render={<Grid.Toolbar.Button />}>
          <PrintIcon fontSize="small" />
        </Grid.Export.Trigger>
      </Tooltip>

      <Tooltip title="Download">
        <Grid.Toolbar.Button
          ref={downloadMenuTriggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={downloadMenuOpen ? 'true' : undefined}
          onClick={() => setDownloadMenuOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
          <ArrowDropDownIcon fontSize="small" />
        </Grid.Toolbar.Button>
      </Tooltip>

      <Menu
        id="export-menu"
        anchorEl={downloadMenuTriggerRef.current}
        open={downloadMenuOpen}
        onClose={() => setDownloadMenuOpen(false)}
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
      </Menu>
    </Grid.Toolbar.Root>
  );
}

export default function GridToolbarBasic() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
