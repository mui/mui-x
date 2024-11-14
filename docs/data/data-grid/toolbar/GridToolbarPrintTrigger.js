import * as React from 'react';
import {
  DataGrid,
  GridPrintTrigger,
  GridToolbarV8 as GridToolbar,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import PrintIcon from '@mui/icons-material/Print';

function Toolbar() {
  return (
    <GridToolbar.Root>
      <GridPrintTrigger render={<GridToolbar.Button />}>
        <PrintIcon fontSize="small" />
        Print
      </GridPrintTrigger>
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
