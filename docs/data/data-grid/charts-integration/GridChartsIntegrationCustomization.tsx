import * as React from 'react';
import {
  DataGridPremium,
  GridChartsConfigurationPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  gridColumnGroupsUnwrappedModelSelector,
  GridEventListener,
  GridPivotModel,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import {
  ChartsRenderer,
  configurationOptions,
  GridChartsConfigurationSection,
} from '@mui/x-charts-premium/ChartsRenderer';
import { LineChart, LineChartProps } from '@mui/x-charts/LineChart';
import { useDemoData } from '@mui/x-data-grid-generator';

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

export default function GridChartsIntegrationCustomization() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    editable: true,
  });
  const apiRef = useGridApiRef();

  const pivotModel: GridPivotModel = {
    rows: [{ field: 'commodity' }],
    columns: [
      { field: 'maturityDate-year', sort: 'asc' },
      { field: 'maturityDate-quarter', sort: 'asc' },
    ],
    values: [
      { field: 'quantity', aggFunc: 'sum' },
      { field: 'feeRate', aggFunc: 'avg' },
    ],
  };

  const initialState = {
    ...data.initialState,
    pivoting: {
      model: pivotModel,
      enabled: true,
    },
    chartsIntegration: {
      configurationPanel: {
        open: true,
      },
      charts: {
        main: {
          categories: ['commodity'],
          chartType: 'line',
          configuration: {
            colors: 'mangoFusionPalette',
          },
        },
      },
    },
  };

  const hasInitializedPivotingSeries = React.useRef(false);
  React.useEffect(() => {
    const handleColumnVisibilityModelChange: GridEventListener<
      'columnVisibilityModelChange'
    > = () => {
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
      // pick up the first 5 dyamically created columns with quantity in the name and enable first 3
      apiRef.current?.updateSeries(
        'main',
        unwrappedGroupingModel
          .filter((field) => field.endsWith('quantity'))
          .slice(0, 5)
          .map((field, index) => ({ field, hidden: index >= 3 })),
      );
    };

    return apiRef.current?.subscribeEvent(
      'columnVisibilityModelChange',
      handleColumnVisibilityModelChange,
    );
  }, [apiRef]);

  const onRender = React.useCallback(
    (
      type: string,
      props: Record<string, any>,
      Component: React.ComponentType<any>,
    ) => {
      if (type !== 'line') {
        return <Component {...props} />;
      }

      return (
        <LineChart
          {...(props as LineChartProps)}
          grid={{ vertical: true, horizontal: true }}
        />
      );
    },
    [],
  );

  return (
    <GridChartsIntegrationContextProvider>
      <div style={{ gap: 32, width: '100%' }}>
        <div style={{ height: 575 }}>
          <DataGridPremium
            {...data}
            apiRef={apiRef}
            showToolbar
            chartsIntegration
            slots={{
              chartsConfigurationPanel: GridChartsConfigurationPanel,
            }}
            slotProps={{
              chartsConfigurationPanel: {
                schema: customConfiguration,
              },
            }}
            initialState={initialState}
            checkboxSelection
            columnGroupHeaderHeight={35}
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
