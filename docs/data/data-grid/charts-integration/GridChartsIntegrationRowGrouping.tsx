import * as React from 'react';
import {
  DataGridPremium,
  getRowGroupingFieldFromGroupingCriteria,
  GridChartsConfigurationPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-pro/ChartsRenderer';
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
        categories: [getRowGroupingFieldFromGroupingCriteria(null)], // TODO: remove this and make the transformation in the integration hook
        series: ['filledQuantity', 'feeRate'],
        chartType: 'bar',
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
