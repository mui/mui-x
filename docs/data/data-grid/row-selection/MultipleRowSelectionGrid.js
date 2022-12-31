import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function MultipleRowSelectionGrid() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    maxColumns: 6,
  });

  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        {...data}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </div>
  );
}
