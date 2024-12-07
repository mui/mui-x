import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartsLegend, legendClasses } from '@mui/x-charts/ChartsHtmlLegend';
import { ChartDataProvider } from '@mui/x-charts/context';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';

describe('<ChartsLegend />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartsLegend />, () => ({
    classes: legendClasses,
    inheritComponent: 'div',
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
          >
            {/* Has to be first as describeConformance picks the "first child" */}
            {/* https://github.com/mui/material-ui/blob/c0620e333641deda56f3cd68c7c3736098ee818c/packages-internal/test-utils/src/describeConformance.tsx#L257 */}
            {children}
            <ChartsSurface />
          </ChartDataProvider>
        ),
      }),
    muiName: 'MuiChartsLegend',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
    // SKIP
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'themeCustomPalette',
    ],
  }));
});
