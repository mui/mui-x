import * as React from 'react';
import {
  DataGridPremium,
  GridPivotModel,
  GridDataSource,
  DataGridPremiumProps,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const pivotModel: GridPivotModel = {
  rows: [{ field: 'commodity' }],
  columns: [{ field: 'status' }, { field: 'incoTerm' }],
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

export default function ServerSidePivotingDataGrid() {
  const {
    columns,
    initialState: initialStateMock,
    fetchRows,
  } = useMockServer(
    {
      rowLength: 2000,
      dataSet: 'Commodity',
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

  const initialState = React.useMemo(
    () => ({
      ...initialStateMock,
      pivoting: {
        model: pivotModel,
        enabled: true,
      },
      pagination: { paginationModel: { pageSize: 10, page: 0 } },
    }),
    [initialStateMock],
  );

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPremium
        columns={columns}
        dataSource={dataSource}
        showToolbar
        pagination
        pageSizeOptions={[10, 20, 50]}
        initialState={initialState}
        aggregationFunctions={aggregationFunctions}
        pivotingColDef={pivotingColDef}
      />
    </div>
  );
}
