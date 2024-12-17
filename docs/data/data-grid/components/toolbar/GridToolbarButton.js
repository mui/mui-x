import * as React from 'react';
import { DemoContainer } from '@mui/x-data-grid/internals/demo';
import { Grid } from '@mui/x-data-grid';
import SettingsIcon from '@mui/icons-material/Settings';

export default function GridToolbarButton() {
  return (
    <DemoContainer>
      <Grid.Toolbar.Button>
        <SettingsIcon />
      </Grid.Toolbar.Button>
    </DemoContainer>
  );
}
