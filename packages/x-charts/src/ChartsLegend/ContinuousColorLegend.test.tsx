import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ContinuousColorLegend, continuousColorLegendClasses } from '@mui/x-charts/ChartsLegend';
import { ChartDataProvider } from '@mui/x-charts/context';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { createTheme, ThemeProvider } from '@mui/material/styles';

describe('<ContinuousColorLegend />', () => {
  const { render } = createRenderer();

  describeConformance(<ContinuousColorLegend />, () => ({
    classes: continuousColorLegendClasses,
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
                  type: 'continuous',
                  min: -0.5,
                  max: 1.5,
                  color: (t) => `${t}`,
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
    muiName: 'MuiContinuousColorLegend',
    testComponentPropWith: 'ul',
    refInstanceof: window.HTMLUListElement,
    ThemeProvider,
    createTheme,
    // SKIP
    skip: ['themeVariants', 'componentProp', 'componentsProp'],
  }));
});
