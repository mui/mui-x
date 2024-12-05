import * as React from 'react';
import {
  DataGridPremium,
  useKeepGroupedColumnsHidden,
  useGridApiRef,
  GridDataSource,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function ServerSideDataGridAggregationRowGrouping() {
  const apiRef = useGridApiRef();
  const {
    columns,
    initialState: initState,
    fetchRows,
  } = useMockServer({ rowGrouping: true });

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
      getGroupKey: (row) => row.group,
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[`${field}Aggregate`],
    }),
    [fetchRows],
  );

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...initState,
      rowGrouping: {
        model: ['company', 'director'],
      },
      aggregation: {
        model: { title: 'size', gross: 'sum', year: 'max' },
      },
    },
  });

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPremium
        apiRef={apiRef}
        columns={columns}
        unstable_dataSource={dataSource}
        initialState={initialState}
        aggregationFunctions={aggregationFunctions}
      />
    </div>
  );
}
