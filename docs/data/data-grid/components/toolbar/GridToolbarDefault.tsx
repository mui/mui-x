import * as React from 'react';
import {
  DataGrid,
  Grid,
  GridToolbarButtonProps,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import Badge from '@mui/material/Badge';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import MenuItem from '@mui/material/MenuItem';

const GridToolbarRoot = styled(Grid.Toolbar.Root)(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  height: 45,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const GridToolbarSeparator = styled(Grid.Toolbar.Separator)(({ theme }) => ({
  height: 24,
  width: 1,
  margin: theme.spacing(0.25),
  backgroundColor: theme.palette.divider,
}));

const GridToolbarButton = styled(Grid.Toolbar.Button)(({ theme }) => ({
  minWidth: 0,
  color: theme.palette.action.active,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Toolbar() {
  const [downloadMenuOpen, setDownloadMenuOpen] = React.useState(false);
  const downloadMenuTriggerRef = React.useRef<HTMLButtonElement>(null);

  return (
    <GridToolbarRoot>
      <Tooltip title="Columns">
        <Grid.ColumnsPanel.Trigger render={<GridToolbarButton />}>
          <ViewColumnIcon fontSize="small" />
        </Grid.ColumnsPanel.Trigger>
      </Tooltip>

      <Tooltip title="Filters">
        <Grid.FilterPanel.Trigger
          render={(props, state) => (
            <GridToolbarButton {...(props as GridToolbarButtonProps)}>
              <Badge badgeContent={state.filterCount} color="primary" variant="dot">
                <FilterListIcon fontSize="small" />
              </Badge>
            </GridToolbarButton>
          )}
        />
      </Tooltip>

      <GridToolbarSeparator />

      <Tooltip title="Print">
        <Grid.Export.Trigger exportType="print" render={<GridToolbarButton />}>
          <PrintIcon fontSize="small" />
        </Grid.Export.Trigger>
      </Tooltip>

      <Tooltip title="Download">
        <GridToolbarButton
          ref={downloadMenuTriggerRef}
          id="export-menu-trigger"
          aria-controls="export-menu"
          aria-haspopup="true"
          aria-expanded={downloadMenuOpen ? 'true' : undefined}
          onClick={() => setDownloadMenuOpen(true)}
        >
          <FileDownloadIcon fontSize="small" />
          <ArrowDropDownIcon fontSize="small" />
        </GridToolbarButton>
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
        {/* Available to MUI X Premium users */}
        {/* <Grid.Export.Trigger exportType="excel" render={<MenuItem />}>
          Download as Excel
        </Grid.Export.Trigger> */}
      </Menu>

      <GridToolbarQuickFilter sx={{ ml: 'auto' }} />
    </GridToolbarRoot>
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
