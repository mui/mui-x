import * as React from 'react';
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function ControlledSelectionGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6,
  });

  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        checkboxSelection
        onSelectionModelChange={(newSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        selectionModel={selectionModel}
        {...data}
      />
    </div>
  );
}
