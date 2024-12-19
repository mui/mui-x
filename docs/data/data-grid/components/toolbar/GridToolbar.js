import * as React from 'react';
import { DemoContainer } from '@mui/x-data-grid/internals/demo';
import { Grid } from '@mui/x-data-grid';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GridViewIcon from '@mui/icons-material/ViewModule';
import ListViewIcon from '@mui/icons-material/ViewList';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';

export default function GridToolbar() {
  const [view, setView] = React.useState('grid');
  return (
    <DemoContainer>
      <Grid.Toolbar.Root sx={demoStyles}>
        <Grid.Toolbar.Button aria-label="Quick filter" size="small">
          <SearchIcon fontSize="small" />
        </Grid.Toolbar.Button>

        <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5 }} />
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

        <ToggleButtonGroup
          value={view}
          color="primary"
          size="small"
          sx={{ ml: 'auto' }}
        >
          <Grid.Toolbar.Button
            aria-label="Grid view"
            render={<ToggleButton value="grid" onChange={() => setView('grid')} />}
          >
            <GridViewIcon fontSize="small" />
          </Grid.Toolbar.Button>
          <Grid.Toolbar.Button
            aria-label="List view"
            render={<ToggleButton value="list" onChange={() => setView('list')} />}
          >
            <ListViewIcon fontSize="small" />
          </Grid.Toolbar.Button>
        </ToggleButtonGroup>
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
