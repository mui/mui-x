import * as React from 'react';
import {
  DataGridPremium,
  GridChartsConfigurationPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  gridColumnGroupsUnwrappedModelSelector,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function GridChartsIntegrationPivoting() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    editable: true,
  });
  const apiRef = useGridApiRef();

  const pivotModel = {
    rows: [{ field: 'commodity' }],
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
      categories: ['commodity'],
      chartType: 'column',
    },
  };

  const hasInitializedPivotingSeries = React.useRef(false);
  React.useEffect(() => {
    const handleColumnVisibilityModelChange = () => {
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
      // pick up the first 5 dyamically created columns with quantity in the name and enable first 3
      apiRef.current?.updateSeries(
        unwrappedGroupingModel
          .filter((field) => field.endsWith('quantity'))
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
        <div style={{ height: 575 }}>
          <DataGridPremium
            {...data}
            apiRef={apiRef}
            showToolbar
            chartsIntegration
            slots={{
              chartsConfigurationPanel: GridChartsConfigurationPanel,
            }}
            slotProps={{
              chartsConfigurationPanel: {
                schema: configurationOptions,
              },
            }}
            initialState={initialState}
            checkboxSelection
            columnGroupHeaderHeight={35}
          />
        </div>
        <GridChartsRendererProxy renderer={ChartsRenderer} />
      </div>
    </GridChartsIntegrationContextProvider>
  );
}
