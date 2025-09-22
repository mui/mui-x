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
    maxCategories: 1,
  },
  column: {
    ...configurationOptions.column,
    customization: hideColorsControl(configurationOptions.column.customization),
    maxCategories: 1,
  },
  line: {
    ...configurationOptions.line,
    customization: hideColorsControl(configurationOptions.line.customization),
    maxCategories: 1,
  },
  area: {
    ...configurationOptions.area,
    customization: hideColorsControl(configurationOptions.area.customization),
    maxCategories: 1,
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
  if (field === 'downloads') {
    return field;
  }
  if (!field.endsWith('downloads')) {
    return undefined;
  }
  return `v${field[0]}`;
};

const dateFormatter = (value) =>
  new Date(value).toLocaleDateString('en-US', {
    month: '2-digit',
    year: '2-digit',
  });
const downloadsFormatter = (value) =>
  value === 0 ? '0' : `${Math.round(value / 1000)}k`;

const onRender = (type, props, Component) => {
  let adjustedProps = props;

  if (type === 'line' || type === 'area') {
    adjustedProps = {
      ...adjustedProps,
      grid: {
        vertical: true,
        horizontal: true,
      },
      xAxis: props.xAxis.map((axis) => ({
        ...axis,
        scaleType: 'time',
        domainLimit: 'strict',
        valueFormatter: dateFormatter,
      })),
      yAxis: [
        {
          valueFormatter: downloadsFormatter,
        },
      ],
    };
  }

  if (type === 'bar') {
    adjustedProps = {
      ...adjustedProps,
      xAxis: [
        {
          valueFormatter: downloadsFormatter,
        },
      ],
      yAxis: adjustedProps.yAxis.map((axis) => ({
        ...axis,
        valueFormatter: dateFormatter,
        tickInterval: (_, index) => index % 10 === 0,
      })),
    };
  }

  if (type === 'column') {
    adjustedProps = {
      ...adjustedProps,
      xAxis: adjustedProps.xAxis.map((axis) => ({
        ...axis,
        valueFormatter: dateFormatter,
      })),
      yAxis: [
        {
          valueFormatter: downloadsFormatter,
        },
      ],
    };
  }

  return <Component {...adjustedProps} />;
};

export default function GridChartsIntegrationCustomization() {
  const apiRef = useGridApiRef();

  React.useEffect(() => {
    const handleMount = () => {
      const unwrappedGroupingModel = Object.keys(
        gridColumnGroupsUnwrappedModelSelector(apiRef),
      );
      if (unwrappedGroupingModel.length === 0) {
        return;
      }

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
            experimentalFeatures={{
              chartsIntegration: true,
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
