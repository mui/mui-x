import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { createDummyDataSource } from '@mui/x-data-grid-generator';

const [dataSource, { initialState, columns }] = createDummyDataSource(
  {},
  { useCursorPagination: false },
);

const initialStateWithPagination = {
  ...initialState,
  pagination: {
    paginationModel: { pageSize: 10, page: 0 },
  },
};

function ServerSideDataGrid() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns!}
        unstable_dataSource={dataSource}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}

export default ServerSideDataGrid;
