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
  gridColumnGroupsUnwrappedModelSelector,
  gridPivotModelSelector,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';

const initialPivotModel = {
  rows: [{ field: 'commodity' }],
  columns: [{ field: 'incoTerm' }],
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

export default function GridChartsIntegrationDataSource() {
  const apiRef = useGridApiRef();

  const { fetchRows, initialState, columns } = useMockServer(
    {
      rowLength: 1000,
      dataSet: 'Commodity',
      maxColumns: 20,
    },
    { useCursorPagination: false },
  );

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
    };
  }, [fetchRows]);

  const initialStateUpdated = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...initialState,
      pivoting: {
        model: initialPivotModel,
        enabled: true,
      },
      sidebar: {
        open: true,
        value: GridSidebarValue.Charts,
      },
      chartsIntegration: {
        charts: {
          main: {
            dimensions: ['commodity'],
            values: [],
            chartType: 'column',
          },
        },
      },
    },
  });

  const hasInitializedPivotingSeries = React.useRef(false);
  React.useEffect(() => {
    const handleColumnsChange = () => {
      if (!apiRef.current || hasInitializedPivotingSeries.current) {
        return;
      }

      const unwrappedGroupingModel = Object.keys(
        gridColumnGroupsUnwrappedModelSelector(apiRef),
      );
      // wait until pivoting creates column grouping model
      if (unwrappedGroupingModel.length === 0) {
        return;
      }

      const pivotModel = gridPivotModelSelector(apiRef);
      const targetField = pivotModel.values.find(
        (value) => value.hidden !== true,
      )?.field;

      hasInitializedPivotingSeries.current = true;

      if (targetField) {
        apiRef.current.updateChartValuesData(
          'main',
          unwrappedGroupingModel
            .filter((field) => field.endsWith(targetField))
            .map((field) => ({ field })),
        );
      }
    };

    return apiRef.current?.subscribeEvent('columnsChange', handleColumnsChange);
  }, [apiRef]);

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 600, paddingBottom: 16 }}>
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
            pivotingColDef={pivotingColDef}
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
