import * as React from 'react';
import {
  DataGridPremium,
  useGridApiRef,
  GridDataSource,
  GridInitialState,
  GRID_ROOT_GROUP_ID,
} from '@mui/x-data-grid-premium';
import { useMockServer } from '@mui/x-data-grid-generator';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function ServerSideDataGridAggregationScope() {
  const apiRef = useGridApiRef();
  const [aggregationRowsScope, setAggregationRowsScope] = React.useState<
    'filtered' | 'all'
  >('all');
  const {
    columns,
    initialState: initState,
    fetchRows,
  } = useMockServer({}, { useCursorPagination: false });

  const dataSource: GridDataSource = React.useMemo(
    () => ({
      getRows: async (params) => {
        const urlParams = new URLSearchParams({
          paginationModel: JSON.stringify(params.paginationModel),
          filterModel: JSON.stringify(params.filterModel),
          sortModel: JSON.stringify(params.sortModel),
          aggregationModel: JSON.stringify(params.aggregationModel),
          aggregationRowsScope: params.aggregationRowsScope ?? 'filtered',
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

  const initialState: GridInitialState = React.useMemo(
    () => ({
      ...initState,
      pagination: {
        paginationModel: { pageSize: 10, page: 0 },
        rowCount: 0,
      },
      filter: {
        filterModel: {
          items: [
            {
              field: 'quantity',
              value: '40000',
              operator: '>',
            },
          ],
        },
      },
      aggregation: {
        model: { commodity: 'size', quantity: 'sum' },
      },
    }),
    [initState],
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 10px' }}>
        <ToggleButtonGroup
          color="primary"
          value={aggregationRowsScope}
          exclusive
          onChange={(_, value) => {
            setAggregationRowsScope(value);
            apiRef.current.unstable_dataSource.fetchRows(GRID_ROOT_GROUP_ID, {
              aggregationRowsScope: value,
            });
          }}
          aria-label="Aggregation Rows Scope"
        >
          <ToggleButton value="filtered">Filtered</ToggleButton>
          <ToggleButton value="all">All</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div style={{ height: 400 }}>
        <DataGridPremium
          apiRef={apiRef}
          columns={columns}
          unstable_dataSource={dataSource}
          pagination
          initialState={initialState}
          pageSizeOptions={[10, 20, 50]}
          aggregationFunctions={aggregationFunctions}
          aggregationRowsScope={aggregationRowsScope}
          unstable_dataSourceCache={null}
        />
      </div>
    </div>
  );
}
