import * as React from 'react';
import { createTheme, useTheme, ThemeProvider } from '@mui/material/styles';
import { useDemoData } from '@mui/x-data-grid-generator';
import {
  DataGridPremium,
  GridChartsPanel,
  GridChartsIntegrationContextProvider,
  GridChartsRendererProxy,
  gridColumnGroupsUnwrappedModelSelector,
  GridEventListener,
  GridPivotModel,
  useGridApiRef,
  GridSidebarValue,
} from '@mui/x-data-grid-premium';
import { frFR as frFRGrid } from '@mui/x-data-grid-premium/locales';
import {
  ChartsRenderer,
  getLocalizedConfigurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
import { frFR as frFRCharts, frFRLocalText } from '@mui/x-charts-premium/locales';

const configurationOptions = getLocalizedConfigurationOptions(frFRLocalText); // localized chart configuration options

const frColumnHeaderNames = {
  commodity: 'Matière première',
  maturityDate: 'Date de maturité',
  quantity: 'Quantité',
  feeRate: 'Taux de frais',
};

export default function GridChartsIntegrationLocalization() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 1000,
    editable: true,
  });
  const apiRef = useGridApiRef();

  // Inherit the theme from the docs site (dark/light mode)
  const existingTheme = useTheme();
  const theme = React.useMemo(
    () => createTheme(frFRGrid, frFRCharts, existingTheme),
    [existingTheme],
  );

  const columns = React.useMemo(
    () =>
      data.columns.map((column) =>
        frColumnHeaderNames[column.field as keyof typeof frColumnHeaderNames]
          ? {
              ...column,
              headerName:
                frColumnHeaderNames[
                  column.field as keyof typeof frColumnHeaderNames
                ],
            }
          : column,
      ),
    [data.columns],
  );

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
    sidebar: {
      open: true,
      value: GridSidebarValue.Charts,
    },
    chartsIntegration: {
      charts: {
        main: {
          dimensions: ['commodity'],
          chartType: 'column',
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
      apiRef.current?.updateChartValuesData(
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

  return (
    <GridChartsIntegrationContextProvider>
      <ThemeProvider theme={theme}>
        <div style={{ gap: 32, width: '100%' }}>
          <div style={{ height: 575, paddingBottom: 16 }}>
            <DataGridPremium
              {...data}
              apiRef={apiRef}
              columns={columns}
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
              checkboxSelection
              columnGroupHeaderHeight={35}
              experimentalFeatures={{
                charts: true,
              }}
            />
          </div>
          <GridChartsRendererProxy id="main" renderer={ChartsRenderer} />
        </div>
      </ThemeProvider>
    </GridChartsIntegrationContextProvider>
  );
}
