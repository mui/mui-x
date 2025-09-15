import * as React from 'react';
import {
  DataGridPremium,
  GridDataSource,
  GridPivotModel,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const pivotModel: GridPivotModel = {
  rows: [{ field: 'commodity' }],
  columns: [{ field: 'status' }],
  values: [{ field: 'quantity', aggFunc: 'sum' }],
};

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function ServerSideDataGridAggregationPivoting() {
  const { columns, initialState, fetchRows } = useMockServer({
    maxColumns: 20,
  });

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
          pivotModel: JSON.stringify(params.pivotModel),
        });
        const getRowsResponse = await fetchRows(
          `https://mui.com/x/api/data-grid?${urlParams.toString()}`,
        );
        return {
          rows: getRowsResponse.rows,
          rowCount: getRowsResponse.rowCount,
          aggregateRow: getRowsResponse.aggregateRow,
          pivotColumns: getRowsResponse.pivotColumns,
        };
      },
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[field],
      getPivotColumnDef: (field, columnGroupPath) => ({
        field: columnGroupPath
          .map((path) =>
            typeof path.value === 'string' ? path.value : path.value[path.field],
          )
          .concat(field)
          .join('>->'),
      }),
    }),
    [fetchRows],
  );

  const initialStateUpdated = React.useMemo(
    () => ({
      ...initialState,
      pivoting: {
        model: pivotModel,
        enabled: true,
      },
    }),
    [initialState],
  );

  return (
    <div style={{ width: '100%', height: 500 }}>
      <DataGridPremium
        columns={columns}
        dataSource={dataSource}
        showToolbar
        initialState={initialStateUpdated}
        aggregationFunctions={aggregationFunctions}
      />
    </div>
  );
}
