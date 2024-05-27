import * as React from 'react';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useMockServer } from '@mui/x-data-grid-generator';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import LoadingSlate from './LoadingSlateNoSnap';

function ServerSideDataGrid() {
  const [verbose, setVerbose] = React.useState(false);

  const { isInitialized, columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: false, verbose },
  );

  const dataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: encodeURIComponent(
            JSON.stringify(params.paginationModel),
          ),
          filterModel: encodeURIComponent(JSON.stringify(params.filterModel)),
          sortModel: encodeURIComponent(JSON.stringify(params.sortModel)),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
        };
      },
    }),
    [fetchRows],
  );

  const initialStateWithPagination = React.useMemo(
    () => ({
      ...initialState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
    }),
    [initialState],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={verbose}
              onChange={(e) => setVerbose(e.target.checked)}
            />
          }
          label="Verbose"
        />
      </div>
      <div style={{ height: 400 }}>
        {isInitialized ? (
          <DataGridPro
            columns={columns}
            unstable_dataSource={dataSource}
            pagination
            initialState={initialStateWithPagination}
            pageSizeOptions={[10, 20, 50]}
          />
        ) : (
          <LoadingSlate />
        )}
      </div>
    </div>
  );
}

export default ServerSideDataGrid;
