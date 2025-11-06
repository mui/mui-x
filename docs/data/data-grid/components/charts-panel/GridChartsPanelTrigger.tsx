import {
  DataGridPremium,
  Toolbar,
  ToolbarButton,
  ChartsPanelTrigger,
  GridChartsPanel,
  GridChartsIcon,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
} from '@mui/x-data-grid-premium';
import { useDemoData } from '@mui/x-data-grid-generator';
import Tooltip from '@mui/material/Tooltip';
import { configurationOptions } from '@mui/x-charts-premium/ChartsRenderer';

function CustomToolbar() {
  return (
    <Toolbar>
      <Tooltip title="Charts">
        <ChartsPanelTrigger render={<ToolbarButton />}>
          <GridChartsIcon fontSize="small" />
        </ChartsPanelTrigger>
      </Tooltip>
    </Toolbar>
  );
}

export default function GridChartsPanelTrigger() {
  const { data, loading } = useDemoData({
    dataSet: 'Employee',
    rowLength: 10,
    maxColumns: 10,
  });

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ height: 400, width: '100%' }}>
        <DataGridPremium
          {...data}
          loading={loading}
          chartsIntegration
          slots={{ toolbar: CustomToolbar, chartsPanel: GridChartsPanel }}
          slotProps={{
            chartsPanel: {
              schema: configurationOptions,
            },
          }}
          showToolbar
          initialState={{
            ...data.initialState,
            chartsIntegration: {
              charts: {
                main: {
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
      <GridChartsRendererProxy id="main" renderer={() => null} />
    </GridChartsIntegrationContextProvider>
  );
}
