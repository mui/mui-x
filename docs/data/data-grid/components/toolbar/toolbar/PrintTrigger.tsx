import * as React from 'react';
import PrintIcon from '@mui/icons-material/Print';
import { Grid, useGridApiContext } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

export function PrintTrigger() {
  const apiRef = useGridApiContext();

  return (
    <Tooltip title="Print">
      <Grid.Toolbar.Button onClick={() => apiRef.current.exportDataAsPrint()}>
        <PrintIcon fontSize="small" />
      </Grid.Toolbar.Button>
    </Tooltip>
  );
}
