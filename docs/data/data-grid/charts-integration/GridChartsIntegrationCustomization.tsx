import * as React from 'react';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  GridSidebarValue,
  GridColDef,
  GridRowModel,
  GridPivotModel,
  DataGridPremiumProps,
  GridChartsPanelProps,
  useGridApiRef,
  GridEventListener,
  gridColumnGroupsUnwrappedModelSelector,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
  GridChartsConfigurationSection,
} from '@mui/x-charts-premium/ChartsRenderer';
import { downloads } from './dataset';

const columns: GridColDef[] = [
  { field: 'id', chartable: false },
  { field: 'timestamp', headerName: 'Timestamp', type: 'date' },
  { field: 'version', headerName: 'Version', width: 100 },
  { field: 'downloads', headerName: 'Downloads', type: 'number' },
];

const versions = Object.keys(
  downloads.versionDownloads,
) as (keyof typeof downloads.versionDownloads)[];

const rows: GridRowModel[] = [];
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

const hideColorsControl = (sections: GridChartsConfigurationSection[]) =>
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
    maxDimensions: 1,
  },
  column: {
    ...configurationOptions.column,
    customization: hideColorsControl(configurationOptions.column.customization),
    maxDimensions: 1,
  },
  line: {
    ...configurationOptions.line,
    customization: hideColorsControl(configurationOptions.line.customization),
    maxDimensions: 1,
  },
  area: {
    ...configurationOptions.area,
    customization: hideColorsControl(configurationOptions.area.customization),
    maxDimensions: 1,
  },
};

const gridPivotModel: GridPivotModel = {
  rows: [{ field: 'timestamp' }],
  columns: [{ field: 'majorVersion', sort: 'asc' }],
  values: [{ field: 'downloads', aggFunc: 'sum' }],
};

const getPivotDerivedColumns: DataGridPremiumProps['getPivotDerivedColumns'] = (
  column,
) => {
  if (column.field === 'version') {
    return [
      {
        field: 'majorVersion',
        headerName: `Major version`,
        type: 'number',
        valueGetter: (_, row) => Number(row.version.split('.')[0]),
        valueFormatter: (value: string) => `v${value}`,
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
        dimensions: ['timestamp'],
        values: [],
        chartType: 'line',
        configuration: {
          showMark: false,
          grid: 'both',
          height: 400,
        },
      },
    },
  },
};

const getColumnName: GridChartsPanelProps['getColumnName'] = (field) => {
  if (field === 'downloads') {
    return 'Downloads';
  }
  if (!field.endsWith('downloads')) {
    return undefined;
  }
  return `v${field[0]}`;
};

const dateFormatter = (value: string | Date) =>
  new Date(value).toLocaleDateString('en-US', {
    month: '2-digit',
    year: '2-digit',
  });
const downloadsFormatter = (value: number) =>
  value === 0 ? '0' : `${Math.round(value / 1000)}k`;

const onRender = (
  type: string,
  props: Record<string, any>,
  Component: React.ComponentType<any>,
) => {
  let adjustedProps = props;

  if (type === 'line' || type === 'area') {
    adjustedProps = {
      ...adjustedProps,
      xAxis: props.xAxis.map((axis: any) => ({
        ...axis,
        scaleType: 'time',
        domainLimit: 'strict',
        valueFormatter: dateFormatter,
      })),
      yAxis: props.yAxis.map((axis: any) => ({
        ...axis,
        valueFormatter: downloadsFormatter,
      })),
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
      yAxis: adjustedProps.yAxis.map((axis: any) => ({
        ...axis,
        valueFormatter: dateFormatter,
        tickInterval: (_: any, index: number) => index % 10 === 0,
      })),
    };
  }

  if (type === 'column') {
    adjustedProps = {
      ...adjustedProps,
      xAxis: adjustedProps.xAxis.map((axis: any) => ({
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
    const handleColumnsChange: GridEventListener<'columnsChange'> = () => {
      const unwrappedGroupingModel = Object.keys(
        gridColumnGroupsUnwrappedModelSelector(apiRef),
      );
      if (unwrappedGroupingModel.length === 0) {
        return;
      }

      // pick up the all major versions
      apiRef.current?.updateChartValuesData(
        'main',
        unwrappedGroupingModel.map((field) => ({ field })),
      );

      if (unsubscribe) {
        unsubscribe();
      }
    };

    const unsubscribe = apiRef.current?.subscribeEvent(
      'columnsChange',
      handleColumnsChange,
    );
  }, [apiRef]);

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 575, paddingBottom: 16 }}>
          <DataGridPremium
            apiRef={apiRef}
            columns={columns}
            rows={rows}
            showToolbar
            label="Data Grid downloads"
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
