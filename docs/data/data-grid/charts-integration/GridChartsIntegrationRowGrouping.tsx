import * as React from 'react';
import {
  DataGridPremium,
  GridChartsConfigurationPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function GridChartsIntegrationRowGrouping() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 20,
    editable: true,
  });

  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        ...data.initialState?.rowGrouping,
        model: ['commodity'],
      },
      aggregation: {
        ...data.initialState?.aggregation,
        model: {
          filledQuantity: 'avg',
          feeRate: 'sum',
        },
      },
      chartsIntegration: {
        configurationPanel: {
          open: true,
        },
        categories: ['commodity'],
        series: ['filledQuantity', 'feeRate'],
        chartType: 'column',
      },
    },
  });

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 400 }}>
          <DataGridPremium
            {...data}
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
          />
        </div>
        <GridChartsRendererProxy renderer={ChartsRenderer} />
      </div>
    </GridChartsIntegrationContextProvider>
  );
}
