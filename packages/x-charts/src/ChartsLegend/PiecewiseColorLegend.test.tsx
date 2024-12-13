import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { PiecewiseColorLegend, piecewiseColorLegendClasses } from '@mui/x-charts/ChartsLegend';
import { ChartDataProvider } from '@mui/x-charts/context';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('<PiecewiseColorLegend />', () => {
  const { render } = createRenderer();

  describeConformance(<PiecewiseColorLegend />, () => ({
    classes: piecewiseColorLegendClasses,
    inheritComponent: 'ul',
    render: (node) =>
      render(node, {
        wrapper: ({ children }) => (
          <ChartDataProvider
            height={50}
            width={50}
            series={[
              {
                type: 'line',
                label: 'Line 1',
                data: [10, 20, 30, 40, 50],
              },
            ]}
            zAxis={[
              {
                colorMap: {
                  type: 'piecewise',
                  thresholds: [new Date(1961, 0, 1), new Date(1990, 0, 1)],
                  colors: ['blue', 'gray', 'red'],
                },
              },
            ]}
          >
            {/* Has to be first as describeConformance picks the "first child" */}
            {/* https://github.com/mui/material-ui/blob/c0620e333641deda56f3cd68c7c3736098ee818c/packages-internal/test-utils/src/describeConformance.tsx#L257 */}
            {children}
            <ChartsSurface />
          </ChartDataProvider>
        ),
      }),
    muiName: 'MuiPiecewiseColorLegend',
    testComponentPropWith: 'ul',
    refInstanceof: window.HTMLUListElement,
    ThemeProvider,
    createTheme,
    // SKIP
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));
});
