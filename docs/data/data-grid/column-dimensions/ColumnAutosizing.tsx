import * as React from 'react';
import { Button } from '@mui/material';
import { useGridApiRef } from '@mui/x-data-grid';
import { DataGridPro, GridApiPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ColumnAutosizing() {
  const apiRef = useGridApiRef<GridApiPro>();
  const { data } = useDemoData({ dataSet: 'Commodity', rowLength: 1000 });

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={() => apiRef.current.autosizeColumns({ includeHeader: false })}>
        Autosize columns
      </Button>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPro
          apiRef={apiRef}
          density='compact'
          {...data}
        />
      </div>
    </div>
  );
}
