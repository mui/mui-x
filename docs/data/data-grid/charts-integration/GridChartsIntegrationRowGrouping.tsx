import * as React from 'react';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
  GridSidebarValue,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
import { useDemoData } from '@mui/x-data-grid-generator';

// make sure that the commodity labels are not overlapping on the initial load
// this is just for the demo
// the logic needs an update to cover other possible configurations
const onRender = (
  type: string,
  props: Record<string, any>,
  Component: React.ComponentType<any>,
) => {
  if (type === 'pie') {
    return <Component {...props} />;
  }

  const axisProp = type === 'bar' ? 'yAxis' : 'xAxis';
  const adjustedProps = {
    ...props,
    [axisProp]: props[axisProp].map((axisProps: Record<string, any>) => ({
      ...axisProps,
      groups: axisProps.groups?.map(
        (axisGroup: { getValue: (value: any) => string }, index: number) => ({
          ...axisGroup,
          getValue: (value: string[]) => {
            const targetIndex = axisProps.groups.length - 1 - index;
            if (targetIndex === 0) {
              return value[0];
            }

            return value[targetIndex][0];
          },
        }),
      ),
    })),
  };

  return <Component {...adjustedProps} />;
};

export default function GridChartsIntegrationRowGrouping() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100,
    editable: true,
  });

  const apiRef = useGridApiRef();

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      ...data.initialState,
      rowGrouping: {
        ...data.initialState?.rowGrouping,
        model: ['status', 'commodity'],
      },
      aggregation: {
        ...data.initialState?.aggregation,
        model: {
          filledQuantity: 'avg',
          feeRate: 'sum',
        },
      },
      sidebar: {
        open: true,
        value: GridSidebarValue.Charts,
      },
      chartsIntegration: {
        charts: {
          main: {
            dimensions: ['status', 'commodity'],
            values: ['filledQuantity', 'feeRate'],
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
            {...data}
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
            experimentalFeatures={{
              charts: true,
            }}
          />
        </div>
        <GridChartsRendererProxy
          id="main"
          renderer={ChartsRenderer}
          onRender={onRender}
        />
      </div>
    </GridChartsIntegrationContextProvider>
  );
}
