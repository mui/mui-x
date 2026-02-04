import { useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  GridSidebarValue,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';

export default function GridChartsIntegrationBasic() {
  const { data } = useDemoData({
    dataSet: 'Employee',
    rowLength: 20,
    editable: true,
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
            initialState={{
              sidebar: {
                open: true,
                value: GridSidebarValue.Charts,
              },
              chartsIntegration: {
                charts: {
                  main: {
                    dimensions: ['name'],
                    values: ['salary'],
                    chartType: 'column',
                  },
                },
              },
            }}
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
