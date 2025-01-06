import * as React from 'react';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';

function Toolbar() {
  const [downloadMenuOpen, setDownloadMenuOpen] = React.useState(false);
  const downloadMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <Grid.Toolbar.Root>
      <Tooltip title="Columns">
        <Grid.ColumnsPanel.Trigger render={<Grid.Toolbar.Button />}>
          <ViewColumnIcon fontSize="small" />
        </Grid.ColumnsPanel.Trigger>
      </Tooltip>

      <Tooltip title="Filters">
        <Grid.FilterPanel.Trigger
          render={(props, state) => (
            <Grid.Toolbar.Button {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </Grid.Toolbar.Button>
          )}
        />
      </Tooltip>

      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

      <Tooltip title="Print">
        <Grid.Export.PrintTrigger render={<Grid.Toolbar.Button />}>
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
        >
          <FileDownloadIcon fontSize="small" />
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

      <Grid.QuickFilter.Root>
        <Grid.QuickFilter.Control
          render={({ ref, ...other }) => (
            <TextField
              {...other}
              sx={{ width: 260, ml: 'auto' }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: other.value ? (
                  <InputAdornment position="end">
                    <Grid.QuickFilter.Clear
                      edge="end"
                      size="small"
                      aria-label="Clear search"
                    >
                      <ClearIcon fontSize="small" />
                    </Grid.QuickFilter.Clear>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}
        />
      </Grid.QuickFilter.Root>
    </Grid.Toolbar.Root>
  );
}

export default function GridToolbar() {
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
