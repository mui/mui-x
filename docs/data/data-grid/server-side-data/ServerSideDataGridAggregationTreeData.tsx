import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridInitialState,
  GridDataSource,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';

const dataSetOptions = {
  dataSet: 'Employee' as const,
  rowLength: 1000,
  treeData: { maxDepth: 3, groupingField: 'name', averageChildren: 5 },
};

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function ServerSideDataGridAggregationTreeData() {
  const apiRef = useGridApiRef();
  const {
    fetchRows,
    columns,
    initialState: initState,
  } = useMockServer(dataSetOptions);

  const initialState: GridInitialState = React.useMemo(
    () => ({
      ...initState,
      aggregation: {
        model: { rating: 'avg', website: 'size' },
      },
    }),
    [initState],
  );

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          groupKeys: JSON.stringify(params.groupKeys),
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
      getGroupKey: (row) => row[dataSetOptions.treeData.groupingField],
      getChildrenCount: (row) => row.descendantCount,
      getAggregatedValue: (row, field) => row[`${field}Aggregate`],
    }),
    [fetchRows],
  );

  return (
    <div style={{ width: '100%', height: 400 }}>
      <DataGridPremium
        columns={columns}
        unstable_dataSource={dataSource}
        treeData
        apiRef={apiRef}
        initialState={initialState}
        aggregationFunctions={aggregationFunctions}
      />
    </div>
  );
}
