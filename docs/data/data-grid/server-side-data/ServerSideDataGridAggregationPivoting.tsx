import * as React from 'react';
import {
  DataGridPremium,
  DataGridPremiumProps,
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

const pivotingColDef: DataGridPremiumProps['pivotingColDef'] = (
  originalColumnField,
  columnGroupPath,
) => ({
  field: columnGroupPath.concat(originalColumnField).join('>->'),
});

export default function ServerSideDataGridAggregationPivoting() {
  const { columns, initialState, fetchRows } = useMockServer(
    {
      maxColumns: 20,
    },
    { useCursorPagination: false },
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
          groupFields: JSON.stringify(params.groupFields),
          aggregationModel: JSON.stringify(params.aggregationModel),
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
        pivotingColDef={pivotingColDef}
        aggregationFunctions={aggregationFunctions}
      />
    </div>
  );
}
