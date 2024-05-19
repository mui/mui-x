import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoDataSource } from '@mui/x-data-grid-generator';

const pageSizeOptions = [5, 10, 50];

const serverOptions = { useCursorPagination: false };
const dataSetOptions = {};

export default function ServerSideDataGridNoCache() {
  const { getRows, columns, initialState } = useDemoDataSource(
    dataSetOptions,
    serverOptions,
  );

  const dataSource = React.useMemo(() => {
    return {
      getRows,
    };
  }, [getRows]);

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
      },
    }),
    [initialState],
  );

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGridPro
        initialState={initialStateWithPagination}
        columns={columns}
        unstable_dataSource={dataSource}
        disableServerSideCache
        pagination
        pageSizeOptions={pageSizeOptions}
      />
    </div>
  );
}
