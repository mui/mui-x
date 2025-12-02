import * as React from 'react';
import { DataGridPro, GridDataSource, useGridApiRef } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import Button from '@mui/material/Button';

export default function ServerSideEditing() {
  const apiRef = useGridApiRef();
  const {
    columns,
    initialState: initState,
    fetchRows,
    editRow,
  } = useMockServer({ editable: true }, { useCursorPagination: false });

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
      updateRow: async (params) => {
        const syncedRow = await editRow(params.rowId, params.updatedRow);
        return syncedRow;
      },
    }),
    [fetchRows, editRow],
  );

  const initialState = React.useMemo(
    () => ({
      ...initState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
    }),
    [initState],
  );

  return (
    <div style={{ width: '100%' }}>
      <Button
        onClick={() => {
          apiRef.current?.dataSource.cache.clear();
        }}
      >
        Clear cache
      </Button>
      <div style={{ height: 400 }}>
        <DataGridPro
          apiRef={apiRef}
          columns={columns}
          dataSource={dataSource}
          pagination
          initialState={initialState}
          pageSizeOptions={[10, 20, 50]}
        />
      </div>
    </div>
  );
}
