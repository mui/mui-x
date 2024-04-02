import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoDataSource } from '@mui/x-data-grid-generator';

function ServerSideDataGrid() {
  const { getRows, columns, initialState } = useDemoDataSource(
    {},
    { useCursorPagination: false },
  );

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
      },
    }),
    [initialState],
  );

  const dataSource = React.useMemo(() => {
    return {
      getRows,
    };
  }, [getRows]);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        columns={columns}
        unstable_dataSource={dataSource}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
      />
    </div>
  );
}

export default ServerSideDataGrid;
