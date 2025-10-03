import * as React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const pivotModel = {
  rows: [{ field: 'commodity' }, { field: 'traderName' }],
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

const pivotingColDef = (originalColumnField, columnGroupPath) => ({
  field: columnGroupPath.concat(originalColumnField).join('>->'),
});

export default function ServerSidePivotingGroupExpansion() {
  const {
    columns,
    initialState: initialStateMock,
    fetchRows,
  } = useMockServer({
    rowLength: 5,
    dataSet: 'Commodity',
    maxColumns: 20,
  });

  const dataSource = React.useMemo(
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
    }),
    [initialStateMock],
  );

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGridPremium
        columns={columns}
        dataSource={dataSource}
        showToolbar
        initialState={initialState}
        aggregationFunctions={aggregationFunctions}
        pivotingColDef={pivotingColDef}
        defaultGroupingExpansionDepth={-1}
      />
    </div>
  );
}
