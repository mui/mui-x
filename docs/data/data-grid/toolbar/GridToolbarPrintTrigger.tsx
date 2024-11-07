import * as React from 'react';
import {
  DataGrid,
  GridToolbarV8 as GridToolbar,
  useGridApiContext,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import PrintIcon from '@mui/icons-material/Print';

function PrintTrigger() {
  const apiRef = useGridApiContext();

  return (
    <GridToolbar.Button onClick={() => apiRef.current.exportDataAsPrint()}>
      <PrintIcon fontSize="small" />
      Print
    </GridToolbar.Button>
  );
}

function Toolbar() {
  return (
    <GridToolbar.Root>
      <PrintTrigger />
    </GridToolbar.Root>
  );
}

export default function GridToolbarPrintTrigger() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid {...data} slots={{ toolbar: Toolbar }} />
    </div>
  );
}
