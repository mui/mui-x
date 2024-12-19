import * as React from 'react';
import { DataGrid, Grid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';

function Toolbar() {
  const [downloadMenuOpen, setDownloadMenuOpen] = React.useState(false);
  const downloadMenuTriggerRef = React.useRef(null);

  return (
    <Grid.Toolbar.Root>
      <Tooltip title="Columns">
        <Grid.ColumnsPanel.Trigger render={<Grid.Toolbar.Button size="small" />}>
          <ViewColumnIcon fontSize="small" />
        </Grid.ColumnsPanel.Trigger>
      </Tooltip>

      <Tooltip title="Filters">
        <Grid.FilterPanel.Trigger
          render={(props, state) => (
            <Grid.Toolbar.Button {...props} size="small">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </Grid.Toolbar.Button>
          )}
        />
      </Tooltip>

      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
      <Tooltip title="Print">
        <Grid.Export.PrintTrigger render={<Grid.Toolbar.Button size="small" />}>
          <PrintIcon fontSize="small" />
        </Grid.Export.PrintTrigger>
      </Tooltip>

      <Tooltip title="Download">
        <Grid.Toolbar.Button
          ref={downloadMenuTriggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={downloadMenuOpen ? 'true' : undefined}
          onClick={() => setDownloadMenuOpen(true)}
          size="small"
        >
          <FileDownloadIcon fontSize="small" />
          <ArrowDropDownIcon fontSize="small" sx={{ ml: -1, mr: -0.5 }} />
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
        <Grid.Export.CsvTrigger
          render={<MenuItem />}
          onClick={() => setDownloadMenuOpen(false)}
        >
          Download as CSV
        </Grid.Export.CsvTrigger>
        {/* Available to MUI X Premium users */}
        {/* <Grid.Export.ExcelTrigger render={<MenuItem />}>
           Download as Excel
          </Grid.Export.ExcelTrigger> */}
      </Menu>

      <GridToolbarQuickFilter sx={{ ml: 'auto' }} />
    </Grid.Toolbar.Root>
  );
}

export default function GridToolbarDefault() {
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
