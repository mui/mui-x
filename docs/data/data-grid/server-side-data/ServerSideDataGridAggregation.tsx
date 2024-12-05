import * as React from 'react';
import { DataGridPremium, GridDataSource } from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function ServerSideDataGridAggregation() {
  const { columns, initialState, fetchRows } = useMockServer(
    {},
    { useCursorPagination: false },
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          aggregationModel: JSON.stringify(params.aggregationModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          aggregateRow: getRowsResponse.aggregateRow,
        };
      },
      getAggregatedValue: (row, field) => {
        return row[`${field}Aggregate`];
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
      aggregation: {
        model: { commodity: 'size', quantity: 'sum' },
      },
    }),
    [initialState],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPremium
        columns={columns}
        unstable_dataSource={dataSource}
        pagination
        initialState={initialStateWithPagination}
        pageSizeOptions={[10, 20, 50]}
        aggregationFunctions={aggregationFunctions}
      />
    </div>
  );
}
