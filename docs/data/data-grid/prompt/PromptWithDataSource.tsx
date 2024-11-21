import * as React from 'react';
import {
  DataGridPremium,
  Unstable_GridToolbarPromptControl as GridToolbarPromptControl,
  GridToolbar,
  GridDataSource,
} from '@mui/x-data-grid-premium';
import { mockPromptResolver, useMockServer } from '@mui/x-data-grid-generator';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const VISIBLE_FIELDS = [
  'name',
  'email',
  'position',
  'company',
  'salary',
  'phone',
  'country',
  'dateCreated',
  'isAdmin',
];

function ToolbarWithPromptInput() {
  return (
    <Stack gap={0.5} sx={{ px: 0.5 }}>
      <GridToolbar />
      <Box sx={{ px: 0.5 }}>
        <GridToolbarPromptControl onPrompt={mockPromptResolver} allowDataSampling />
      </Box>
    </Stack>
  );
}

export default function PromptWithDataSource() {
  const { columns, initialState, fetchRows } = useMockServer(
    { dataSet: 'Employee', visibleFields: VISIBLE_FIELDS, maxColumns: 16 },
    { useCursorPagination: false },
  );

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
    <div style={{ height: 500, width: '100%' }}>
      <DataGridPremium
        columns={columns}
        unstable_dataSource={dataSource}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
        slots={{
          toolbar: ToolbarWithPromptInput,
        }}
      />
    </div>
  );
}
