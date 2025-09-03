import * as React from 'react';
import { useMockServer } from '@mui/x-data-grid-generator';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  GridSidebarValue,
  useKeepGroupedColumnsHidden,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';

const aggregationFunctions = {
  sum: { columnTypes: ['number'] },
  avg: { columnTypes: ['number'] },
  min: { columnTypes: ['number', 'date', 'dateTime'] },
  max: { columnTypes: ['number', 'date', 'dateTime'] },
  size: {},
};

export default function GridChartsIntegrationDataSource() {
  const apiRef = useGridApiRef();

  const { fetchRows, initialState, columns } = useMockServer({
    rowGrouping: true,
  });

  const dataSource = React.useMemo(() => {
    return {
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
    };
  }, [fetchRows]);

  const initialStateUpdated = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...initialState,
      rowGrouping: {
        model: ['company', 'director'],
      },
      aggregation: {
        model: { title: 'size', gross: 'sum', year: 'max' },
      },
      sidebar: {
        open: true,
        value: GridSidebarValue.Charts,
      },
      chartsIntegration: {
        charts: {
          main: {
            dimensions: ['company'],
            values: ['gross'],
            chartType: 'column',
          },
        },
      },
    },
  });

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 420, paddingBottom: 16 }}>
          <DataGridPremium
            columns={columns}
            dataSource={dataSource}
            apiRef={apiRef}
            showToolbar
            chartsIntegration
            slots={{
              chartsPanel: GridChartsPanel,
            }}
            slotProps={{
              chartsPanel: {
                schema: configurationOptions,
              },
            }}
            initialState={initialStateUpdated}
            aggregationFunctions={aggregationFunctions}
            experimentalFeatures={{
              charts: true,
            }}
          />
        </div>
        <GridChartsRendererProxy id="main" renderer={ChartsRenderer} />
      </div>
    </GridChartsIntegrationContextProvider>
  );
}
