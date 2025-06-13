import * as React from 'react';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGridPremium,
  GridChartsConfigurationPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-pro/ChartsRenderer';

export default function GridChartsIntegrationBasic() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 20,
    editable: true,
  });

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 370 }}>
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
            initialState={{
              chartsIntegration: {
                configurationPanel: {
                  open: true,
                },
                categories: ['name'],
                series: ['salary'],
                chartType: 'column',
              },
            }}
          />
        </div>
        <GridChartsRendererProxy renderer={ChartsRenderer} />
      </div>
    </GridChartsIntegrationContextProvider>
  );
}
