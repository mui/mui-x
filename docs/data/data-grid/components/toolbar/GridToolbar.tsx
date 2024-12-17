import * as React from 'react';
import { DemoContainer } from '@mui/x-data-grid/internals/demo';
import { Grid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GridViewIcon from '@mui/icons-material/ViewModule';
import ListViewIcon from '@mui/icons-material/ViewList';
import Divider from '@mui/material/Divider';

export default function GridToolbar() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  return (
    <DemoContainer>
      <Grid.Toolbar.Root sx={demoStyles}>
        <Grid.Toolbar.Button aria-label="Columns" size="small">
          <ViewColumnIcon fontSize="small" />
        </Grid.Toolbar.Button>

        <Grid.Toolbar.Button aria-label="Filters" size="small">
          <FilterListIcon fontSize="small" />
        </Grid.Toolbar.Button>

        <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />

        <Grid.Toolbar.Button aria-label="Print" size="small">
          <PrintIcon fontSize="small" />
        </Grid.Toolbar.Button>

        <Grid.Toolbar.Button aria-label="Download" size="small">
          <FileDownloadIcon fontSize="small" />
        </Grid.Toolbar.Button>

        <GridToolbarQuickFilter sx={{ ml: 'auto', mr: 0.25 }} />

        <Grid.Toolbar.ToggleButtonGroup value={view} color="primary" size="small">
          <Grid.Toolbar.ToggleButton
            value="grid"
            aria-label="Grid view"
            onChange={() => setView('grid')}
          >
            <GridViewIcon fontSize="small" />
          </Grid.Toolbar.ToggleButton>
          <Grid.Toolbar.ToggleButton
            value="list"
            aria-label="List view"
            onChange={() => setView('list')}
          >
            <ListViewIcon fontSize="small" />
          </Grid.Toolbar.ToggleButton>
        </Grid.Toolbar.ToggleButtonGroup>
      </Grid.Toolbar.Root>
    </DemoContainer>
  );
}

const demoStyles = {
  flex: 1,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 1,
};
