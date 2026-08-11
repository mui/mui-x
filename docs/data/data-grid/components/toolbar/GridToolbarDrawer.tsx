import * as React from 'react';
import {
  DataGrid,
  GridPortalWrapper,
  Toolbar,
  ToolbarButton,
  ToolbarRoot,
  ColumnsPanelTrigger,
  FilterPanelTrigger,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';

function CustomToolbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <Toolbar>
      <Tooltip title="About this dataset">
        <ToolbarButton onClick={() => setDrawerOpen(true)}>
          <InfoOutlinedIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>

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

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 280 } } }}
      >
        {/* GridPortalWrapper provides the Data Grid CSS variables that ToolbarRoot relies on. */}
        <GridPortalWrapper>
          <ToolbarRoot sx={{ justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 'medium', paddingLeft: 1 }}>
              About this dataset
            </Typography>
            <IconButton
              size="small"
              aria-label="Close"
              onClick={() => setDrawerOpen(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ToolbarRoot>
        </GridPortalWrapper>
        <Box sx={{ padding: 2 }}>
          <Typography variant="body2">
            The drawer header reuses the toolbar styles, so it stays in sync with the
            Data Grid.
          </Typography>
        </Box>
      </Drawer>
    </Toolbar>
  );
}

export default function GridToolbarDrawer() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 10,
    visibleFields: ['commodity', 'quantity', 'unitPrice'],
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
