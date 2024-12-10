import * as React from 'react';
import { DemoContainer } from '@mui/x-data-grid/internals/demo';
import { Grid } from '@mui/x-data-grid';
import PrintIcon from '@mui/icons-material/Print';

export default function GridToolbarButton() {
  return (
    <DemoContainer>
      <Grid.Toolbar.Button>
        <PrintIcon fontSize="small" /> Print
      </Grid.Toolbar.Button>
    </DemoContainer>
  );
}
