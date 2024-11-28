import * as React from 'react';
import { DemoContainer } from '@mui/x-data-grid/internals/demo';
import { Grid } from '@mui/x-data-grid';
import GridViewIcon from '@mui/icons-material/GridOnOutlined';
import ListViewIcon from '@mui/icons-material/TableRowsOutlined';

export default function GridToolbarToggleButtonGroup() {
  const [view, setView] = React.useState('grid');

  return (
    <DemoContainer>
      <Grid.Toolbar.ToggleButtonGroup value={view}>
        <Grid.Toolbar.ToggleButton
          color="primary"
          value="grid"
          onChange={() => setView('grid')}
        >
          <GridViewIcon fontSize="small" /> Grid view
        </Grid.Toolbar.ToggleButton>
        <Grid.Toolbar.ToggleButton
          color="primary"
          value="list"
          onChange={() => setView('list')}
        >
          <ListViewIcon fontSize="small" /> List view
        </Grid.Toolbar.ToggleButton>
      </Grid.Toolbar.ToggleButtonGroup>
    </DemoContainer>
  );
}
