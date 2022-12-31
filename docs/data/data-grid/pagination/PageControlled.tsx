import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function PageControlled() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        paginationModel={paginationModel}
        onPaginationModelChange={(newPaginationModel) =>
          setPaginationModel(newPaginationModel)
        }
        rowsPerPageOptions={[5]}
        pagination
        {...data}
      />
    </div>
  );
}
