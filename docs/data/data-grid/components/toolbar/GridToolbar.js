import * as React from 'react';
import {
  DataGrid,
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
  QuickFilter,
  ExportCsv,
  ExportPrint,
  QuickFilterControl,
  QuickFilterClear,
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
    <Toolbar>
      <Tooltip title="Columns">
        <ColumnsPanelTrigger render={<ToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </ColumnsPanelTrigger>
      </Tooltip>

      <Tooltip title="Filters">
        <FilterPanelTrigger
          render={(props, state) => (
            <ToolbarButton {...props} color="default">
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </ToolbarButton>
          )}
        />
      </Tooltip>

      <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
      <Tooltip title="Print">
        <ExportPrint render={<ToolbarButton />}>
          <PrintIcon fontSize="small" />
        </ExportPrint>
      </Tooltip>

      <Tooltip title="Download">
        <ToolbarButton
          ref={downloadMenuTriggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={downloadMenuOpen ? 'true' : undefined}
          onClick={() => setDownloadMenuOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
        </ToolbarButton>
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
        <ExportCsv render={<MenuItem />} onClick={() => setDownloadMenuOpen(false)}>
          Download as CSV
        </ExportCsv>
        {/* Available to MUI X Premium users */}
        {/* <ExportExcel render={<MenuItem />}>
           Download as Excel
          </ExportExcel> */}
      </Menu>

      <QuickFilter>
        <QuickFilterControl
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
                    <QuickFilterClear
                      edge="end"
                      size="small"
                      aria-label="Clear search"
                    >
                      <ClearIcon fontSize="small" />
                    </QuickFilterClear>
                  </InputAdornment>
                ) : null,
              }}
            />
          )}
        />
      </QuickFilter>
    </Toolbar>
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
