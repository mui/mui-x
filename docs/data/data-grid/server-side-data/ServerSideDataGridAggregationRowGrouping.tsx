import * as React from 'react';
import {
  DataGridPremium,
  useKeepGroupedColumnsHidden,
  useGridApiRef,
  GridDataSource,
  GridGetRowsResponse,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

const VISIBLE_COLUMNS = [
  'commodity',
  'traderName',
  'quantity',
  'unitPrice',
  'filledQuantity',
];

export default function ServerSideDataGridAggregationRowGrouping() {
  const apiRef = useGridApiRef();
  const { columns, initialState, fetchRows, editRow } =
    useMockServer<GridGetRowsResponse>({
      rowLength: 100,
      maxColumns: 10,
      dataSet: 'Commodity',
      editable: true,
      visibleFields: VISIBLE_COLUMNS,
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
      updateRow: (params) => editRow(params.rowId, params.updatedRow),
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[field],
    }),
    [fetchRows, editRow],
  );

  const initialStateUpdated = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...initialState,
      aggregation: {
        model: { quantity: 'sum', unitPrice: 'avg' },
      },
      rowGrouping: {
        model: ['commodity'],
      },
    },
  });

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPremium
        apiRef={apiRef}
        columns={columns}
        dataSource={dataSource}
        initialState={initialStateUpdated}
        aggregationFunctions={aggregationFunctions}
        disablePivoting
      />
    </div>
  );
}
