import * as React from 'react';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  gridColumnGroupsUnwrappedModelSelector,
  GridEventListener,
  GridPivotModel,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function GridChartsIntegrationMultipleCharts() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    editable: true,
  });
  const apiRef = useGridApiRef();

  const pivotModel: GridPivotModel = {
    rows: [{ field: 'dateCreated-quarter' }],
    columns: [
      { field: 'maturityDate-year', sort: 'asc' },
      { field: 'maturityDate-quarter', sort: 'asc' },
    ],
    values: [
      { field: 'quantity', aggFunc: 'sum' },
      { field: 'feeRate', aggFunc: 'avg' },
    ],
  };

  const initialState = {
    ...data.initialState,
    pivoting: {
      model: pivotModel,
      enabled: true,
    },
    chartsIntegration: {
      charts: {
        quantity: {
          chartType: 'bar',
        },
        feeRate: {
          chartType: 'line',
        },
      },
    },
  };

  const hasInitializedPivotingSeries = React.useRef(false);
  React.useEffect(() => {
    const handleColumnVisibilityModelChange: GridEventListener<
      'columnVisibilityModelChange'
    > = () => {
      if (hasInitializedPivotingSeries.current) {
        return;
      }

      const unwrappedGroupingModel = Object.keys(
        gridColumnGroupsUnwrappedModelSelector(apiRef),
      );
      // wait until pivoting creates column grouping model
      if (unwrappedGroupingModel.length === 0) {
        return;
      }

      hasInitializedPivotingSeries.current = true;

      // add columns dynamically created by pivoting
      // they cannot be added to the initial state because they are not available at that time and will be cleaned up by the state initializer
      apiRef.current?.updateChartDimensionsData('quantity', [
        { field: 'dateCreated-quarter', hidden: false },
      ]);
      apiRef.current?.updateChartValuesData(
        'quantity',
        unwrappedGroupingModel
          .filter((field) => field.endsWith('quantity'))
          .slice(0, 5)
          .map((field, index) => ({ field, hidden: index >= 3 })),
      );
      apiRef.current?.updateChartDimensionsData('feeRate', [
        { field: 'dateCreated-quarter', hidden: false },
      ]);
      apiRef.current?.updateChartValuesData(
        'feeRate',
        unwrappedGroupingModel
          .filter((field) => field.endsWith('feeRate'))
          .slice(0, 5)
          .map((field, index) => ({ field, hidden: index >= 3 })),
      );
    };

    return apiRef.current?.subscribeEvent(
      'columnVisibilityModelChange',
      handleColumnVisibilityModelChange,
    );
  }, [apiRef]);

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 575, paddingBottom: 16 }}>
          <DataGridPremium
            {...data}
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
            initialState={initialState}
            checkboxSelection
            columnGroupHeaderHeight={35}
            experimentalFeatures={{
              charts: true,
            }}
          />
        </div>
        <div style={{ marginTop: 32, marginRight: 32, display: 'flex' }}>
          <GridChartsRendererProxy
            id="quantity"
            label="Quantity"
            renderer={ChartsRenderer}
          />
          <GridChartsRendererProxy
            id="feeRate"
            label="Fee Rate"
            renderer={ChartsRenderer}
          />
        </div>
      </div>
    </GridChartsIntegrationContextProvider>
  );
}
