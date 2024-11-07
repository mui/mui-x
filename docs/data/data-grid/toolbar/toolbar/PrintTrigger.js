import * as React from 'react';
import PrintIcon from '@mui/icons-material/Print';
import { GridToolbarV8 as GridToolbar, useGridApiContext } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';

export function PrintTrigger() {
  const apiRef = useGridApiContext();

  return (
    <Tooltip title="Print">
      <GridToolbar.Button onClick={() => apiRef.current.exportDataAsPrint()}>
        <PrintIcon fontSize="small" />
      </GridToolbar.Button>
    </Tooltip>
  );
}
