import * as React from 'react';
import {
  DataGrid,
  GridColumnsPanelTrigger,
  GridToolbarV8 as GridToolbar,
} from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

function Toolbar() {
  return (
    <GridToolbar.Root>
      <GridColumnsPanelTrigger render={<GridToolbar.Button />}>
        <ViewColumnIcon fontSize="small" />
        Columns
      </GridColumnsPanelTrigger>
    </GridToolbar.Root>
  );
}

export default function GridToolbarColumnsPanelTrigger() {
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
