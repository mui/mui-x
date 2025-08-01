import * as React from 'react';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  GridSidebarValue,
  useGridApiRef,
  gridColumnGroupsUnwrappedModelSelector,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
// The import path has to include the docs folder because the demo is used in the charts docs as well
// eslint-disable-next-line import/no-useless-path-segments
import { downloads } from '../../../data/data-grid/charts-integration/dataset';

const columns = [
  { field: 'id', chartable: false },
  { field: 'timestamp', headerName: 'Timestamp', type: 'date' },
  { field: 'version', headerName: 'Version', width: 100 },
  { field: 'downloads', headerName: 'Downloads', type: 'number' },
];

const versions = Object.keys(downloads.versionDownloads);

const rows = [];
for (let i = 0; i < downloads.timestamps.length; i += 1) {
  for (let j = 0; j < versions.length; j += 1) {
    rows.push({
      id: `${i}-${j}`,
      timestamp: new Date(downloads.timestamps[i]),
      version: versions[j],
      downloads: downloads.versionDownloads[versions[j]][i],
    });
  }
}

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

const gridPivotModel = {
  rows: [{ field: 'timestamp' }],
  columns: [{ field: 'majorVersion', sort: 'asc' }],
  values: [{ field: 'downloads', aggFunc: 'sum' }],
};

const getPivotDerivedColumns = (column) => {
  if (column.field === 'version') {
    return [
      {
        field: 'majorVersion',
        headerName: `Major version`,
        type: 'number',
        valueGetter: (_, row) => Number(row.version.split('.')[0]),
        valueFormatter: (value) => `v${value}`,
      },
    ];
  }
  return undefined;
};

const initialState = {
  sidebar: {
    open: true,
    value: GridSidebarValue.Charts,
  },
  pivoting: {
    enabled: true,
    model: gridPivotModel,
  },
  chartsIntegration: {
    charts: {
      main: {
        categories: ['timestamp'],
        series: [],
        chartType: 'line',
        configuration: {
          showMark: false,
          height: 400,
        },
      },
    },
  },
};

const getColumnName = (field) => {
  if (!field.endsWith('downloads')) {
    return undefined;
  }
  return `v${field[0]}`;
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
  const apiRef = useGridApiRef();

  const hasInitializedPivotingSeries = React.useRef(false);
  React.useEffect(() => {
    const handleMount = () => {
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
      // pick up the all major versions
      apiRef.current?.updateSeries(
        'main',
        unwrappedGroupingModel.map((field) => ({ field })),
      );
    };

    return apiRef.current?.subscribeEvent('rootMount', handleMount);
  }, [apiRef]);

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 575 }}>
          <DataGridPremium
            apiRef={apiRef}
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
                getColumnName,
              },
            }}
            getPivotDerivedColumns={getPivotDerivedColumns}
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
