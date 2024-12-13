import * as React from 'react';
import { styled } from '@mui/material/styles';
import { DataGrid, Grid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import FilterListIcon from '@mui/icons-material/FilterList';

const GridToolbarRoot = styled(Grid.Toolbar.Root)(({ theme }) => ({
  flex: 0,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.25),
  padding: theme.spacing(0.5),
  height: 45,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const GridToolbarButton = styled(Grid.Toolbar.Button)(({ theme }) => ({
  minWidth: 0,
  color: theme.palette.action.active,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

function Toolbar() {
  return (
    <GridToolbarRoot>
      <Grid.FilterPanel.Trigger
        render={
          <GridToolbarButton startIcon={<FilterListIcon fontSize="small" />} />
        }
      >
        Filters
      </Grid.FilterPanel.Trigger>
    </GridToolbarRoot>
  );
}

export default function GridFilterPanelTrigger() {
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
