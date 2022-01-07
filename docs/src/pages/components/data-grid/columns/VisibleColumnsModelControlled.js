import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import { DataGrid } from '@mui/x-data-grid';

export default function VisibleColumnsModelControlled() {
  const { data, loading } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    maxColumns: 20,
  });

  const [visibleColumnsModel, setVisibleColumnsModel] = React.useState([
    'desk',
    'commodity',
    'quantity',
    'status',
  ]);

  return (
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid
        {...data}
        loading={loading}
        visibleColumnsModel={visibleColumnsModel}
        onVisibleColumnsModelChange={(newModel) => setVisibleColumnsModel(newModel)}
      />
    </div>
  );
}
