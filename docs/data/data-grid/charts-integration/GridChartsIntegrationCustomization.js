import * as React from 'react';
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
// The import path has to include the docs folder because the demo is used in the charts docs as well
// eslint-disable-next-line import/no-useless-path-segments
import { downloads } from '../../../data/data-grid/charts-integration/dataset';

const columns = [
  { field: 'timestamp', headerName: 'Timestamp', type: 'date' },
  { field: 'v4', headerName: 'v4', type: 'number' },
  { field: 'v5', headerName: 'v5', type: 'number' },
  { field: 'v6', headerName: 'v6', type: 'number' },
  { field: 'v7', headerName: 'v7', type: 'number' },
  { field: 'v8', headerName: 'v8', type: 'number' },
];

const versions = Object.keys(downloads.versionDownloads);

const rows = downloads.timestamps.map((timestamp, index) => {
  const versionDownloads = versions.reduce(
    (acc, version) => {
      const fieldName = `v${version.split('.')[0]}`;
      acc[fieldName] += downloads.versionDownloads[version][index];
      return acc;
    },
    {
      v4: 0,
      v5: 0,
      v6: 0,
      v7: 0,
      v8: 0,
    },
  );

  return {
    id: timestamp,
    timestamp: new Date(timestamp),
    ...versionDownloads,
  };
});

const hideColorsControl = (sections) =>
  sections.map((section) => ({
    ...section,
    controls: {
      ...section.controls,
      colors: {
        ...section.controls.colors,
        isHidden: () => true,
      },
    },
  }));

const customConfiguration = {
  bar: {
    ...configurationOptions.bar,
    customization: hideColorsControl(configurationOptions.bar.customization),
  },
  column: {
    ...configurationOptions.column,
    customization: hideColorsControl(configurationOptions.column.customization),
  },
  line: {
    ...configurationOptions.line,
    customization: hideColorsControl(configurationOptions.line.customization),
  },
  area: {
    ...configurationOptions.area,
    customization: hideColorsControl(configurationOptions.area.customization),
  },
  pie: {
    ...configurationOptions.pie,
    customization: hideColorsControl(configurationOptions.pie.customization),
  },
};

const initialState = {
  sidebar: {
    open: true,
    value: GridSidebarValue.Charts,
  },
  chartsIntegration: {
    charts: {
      main: {
        categories: ['timestamp'],
        series: ['v4', 'v5', 'v6', 'v7', 'v8'],
        chartType: 'line',
        configuration: {
          showMark: false,
          height: 400,
        },
      },
    },
  },
};

const onRender = (type, props, Component) => {
  const adjustedProps =
    type === 'line' || type === 'area'
      ? {
          ...props,
          grid: {
            vertical: true,
            horizontal: true,
          },
          xAxis: props.xAxis.map((axis) => ({
            ...axis,
            scaleType: 'time',
            domainLimit: 'strict',
            valueFormatter: (value) =>
              value.toLocaleDateString('en-US', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
              }),
            tickLabelStyle: {
              angle: 90,
            },
            height: 75,
          })),
          yAxis: [
            {
              valueFormatter: (value) => `${Math.round(value / 1000)}k`,
            },
          ],
        }
      : props;
  return <Component {...adjustedProps} />;
};

export default function GridChartsIntegrationCustomization() {
  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 575 }}>
          <DataGridPremium
            columns={columns}
            rows={rows}
            showToolbar
            chartsIntegration
            slots={{
              chartsPanel: GridChartsPanel,
            }}
            slotProps={{
              chartsPanel: {
                schema: customConfiguration,
              },
            }}
            initialState={initialState}
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
