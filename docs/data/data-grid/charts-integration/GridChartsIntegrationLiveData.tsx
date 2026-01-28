import * as React from 'react';
import { interval } from 'rxjs';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  GridColDef,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import { randomInt } from '@mui/x-data-grid-generator';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
import { BarChartPro, BarChartProProps } from '@mui/x-charts-pro/BarChartPro';
import { AxisConfig } from '@mui/x-charts/models';

const columns: GridColDef[] = [
  { field: 'id' },
  { field: 'process', headerName: 'Process', width: 150 },
  {
    field: 'cpu',
    headerName: 'CPU',
    width: 100,
    type: 'number',
    valueFormatter: (value) => `${value}%`,
  },
  {
    field: 'memory',
    headerName: 'Memory',
    width: 100,
    type: 'number',
    valueFormatter: (value) => `${value} MB`,
  },
];

const processDefinitions = [
  { name: 'chrome', minCpu: 20, maxCpu: 80, minMemory: 950, maxMemory: 1000 },
  { name: 'finder', minCpu: 0, maxCpu: 5, minMemory: 250, maxMemory: 300 },
  { name: 'mail', minCpu: 0, maxCpu: 5, minMemory: 375, maxMemory: 400 },
  { name: 'terminal', minCpu: 3, maxCpu: 10, minMemory: 120, maxMemory: 160 },
  { name: 'adobe', minCpu: 50, maxCpu: 90, minMemory: 3700, maxMemory: 3900 },
  { name: 'firefox', minCpu: 3, maxCpu: 20, minMemory: 670, maxMemory: 700 },
  { name: 'slack', minCpu: 1, maxCpu: 10, minMemory: 480, maxMemory: 500 },
  { name: 'chrome', minCpu: 3, maxCpu: 30, minMemory: 770, maxMemory: 790 },
  { name: 'spotify', minCpu: 1, maxCpu: 10, minMemory: 220, maxMemory: 250 },
  { name: 'chrome', minCpu: 12, maxCpu: 25, minMemory: 350, maxMemory: 400 },
  { name: 'chrome', minCpu: 20, maxCpu: 30, minMemory: 550, maxMemory: 600 },
];

const customConfigurationOptions = Object.fromEntries(
  Object.entries(configurationOptions).filter(([key]) => key === 'column'),
);

export default function GridChartsIntegrationLiveData() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    const subscription = interval(1000).subscribe(() => {
      apiRef.current?.updateRows(generateRows());
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [apiRef]);

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 420, paddingBottom: 16 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={columns}
            rows={generateRows()}
            showToolbar
            chartsIntegration
            slots={{
              chartsPanel: GridChartsPanel,
            }}
            slotProps={{
              chartsPanel: {
                schema: customConfigurationOptions,
              },
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                },
              },
              chartsIntegration: {
                charts: {
                  left: {
                    dimensions: ['process'],
                    values: ['cpu'],
                    chartType: 'column',
                    configuration: {
                      grid: 'horizontal',
                      colors: 'blueberryTwilightPalette',
                    },
                  },
                  right: {
                    dimensions: ['process'],
                    values: ['memory'],
                    chartType: 'column',
                    configuration: {
                      grid: 'horizontal',
                      colors: 'mangoFusionPalette',
                    },
                  },
                },
              },
              sorting: {
                sortModel: [{ field: 'cpu', sort: 'desc' }],
              },
            }}
            experimentalFeatures={{
              charts: true,
            }}
          />
        </div>
        <div style={{ marginTop: 32, marginRight: 32, display: 'flex' }}>
          <GridChartsRendererProxy
            id="left"
            label="CPU"
            renderer={ChartsRenderer}
            onRender={getOnRender(100, '%')}
          />
          <GridChartsRendererProxy
            id="right"
            label="Memory"
            renderer={ChartsRenderer}
            onRender={getOnRender(4096, 'MB')}
          />
        </div>
      </div>
    </GridChartsIntegrationContextProvider>
  );
}

function generateRows() {
  return processDefinitions.map((process, index) => ({
    id: index,
    process: process.name,
    cpu: randomInt(process.minCpu, process.maxCpu),
    memory: randomInt(process.minMemory, process.maxMemory),
  }));
}

function getOnRender(max: number, unit: string) {
  return function onRender(
    type: string,
    props: Record<string, any>,
    Component: React.ComponentType<any>,
  ) {
    if (type !== 'column') {
      return <Component {...props} />;
    }

    const series = props.series.map((seriesItem: AxisConfig) => ({
      ...seriesItem,
      label: `${seriesItem.label} (${unit})`,
    }));

    const yAxis = [
      {
        min: 0,
        max,
        valueFormatter: (value: number) => `${value} ${unit}`,
        width: 60,
      },
    ];

    return (
      <BarChartPro {...(props as BarChartProProps)} series={series} yAxis={yAxis} />
    );
  };
}
