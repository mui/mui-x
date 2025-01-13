import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  ColumnsPanel,
  FilterPanel,
  QuickFilter,
  Export,
} from '@mui/x-data-grid';
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

function CustomToolbar() {
  const [downloadMenuOpen, setDownloadMenuOpen] = React.useState(false);
  const downloadMenuTriggerRef = React.useRef(null);

  return (
    <Toolbar.Root>
      <Tooltip title="Columns">
        <ColumnsPanel.Trigger render={<Toolbar.Button />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanel.Trigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanel.Trigger
          render={(props, state) => (
            <Toolbar.Button {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </Toolbar.Button>
          )}
        />
      </Tooltip>

      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
      <Tooltip title="Print">
        <Export.Print render={<Toolbar.Button />}>
          <PrintIcon fontSize="small" />
        </Export.Print>
      </Tooltip>

      <Tooltip title="Download">
        <Toolbar.Button
          ref={downloadMenuTriggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={downloadMenuOpen ? 'true' : undefined}
          onClick={() => setDownloadMenuOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
        </Toolbar.Button>
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
        <Export.Csv render={<MenuItem />} onClick={() => setDownloadMenuOpen(false)}>
          Download as CSV
        </Export.Csv>
        {/* Available to MUI X Premium users */}
        {/* <Export.Excel render={<MenuItem />}>
           Download as Excel
          </Export.Excel> */}
      </Menu>

      <QuickFilter.Root>
        <QuickFilter.Control
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
                    <QuickFilter.Clear
                      edge="end"
                      size="small"
                      aria-label="Clear search"
                    >
                      <ClearIcon fontSize="small" />
                    </QuickFilter.Clear>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}
        />
      </QuickFilter.Root>
    </Toolbar.Root>
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
      <DataGrid {...data} loading={loading} slots={{ toolbar: CustomToolbar }} />
    </div>
  );
}
