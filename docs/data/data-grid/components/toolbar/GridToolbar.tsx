import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DemoContainer } from '@mui/x-data-grid/internals/demo';
import { Grid, GridToolbarQuickFilter } from '@mui/x-data-grid';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import FilterListIcon from '@mui/icons-material/FilterList';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import GridViewIcon from '@mui/icons-material/ViewModule';
import ListViewIcon from '@mui/icons-material/ViewList';

const GridToolbarRoot = styled(Grid.Toolbar.Root)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  height: 45,
  width: '100%',
  padding: theme.spacing(0.5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
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

export default function GridToolbar() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  return (
    <DemoContainer>
      <GridToolbarRoot>
        <GridToolbarButton aria-label="Columns">
          <ViewColumnIcon fontSize="small" />
        </GridToolbarButton>

        <GridToolbarButton aria-label="Filters">
          <FilterListIcon fontSize="small" />
        </GridToolbarButton>

        <GridToolbarSeparator />

        <GridToolbarButton aria-label="Print">
          <PrintIcon fontSize="small" />
        </GridToolbarButton>

        <GridToolbarButton aria-label="Download">
          <FileDownloadIcon fontSize="small" />
        </GridToolbarButton>

        <GridToolbarQuickFilter sx={{ ml: 'auto', mr: 0.25 }} />

        <Grid.Toolbar.ToggleButtonGroup value={view} size="small" color="primary">
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
      </GridToolbarRoot>
    </DemoContainer>
  );
}
