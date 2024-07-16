import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';

describe('<ResponsiveChartContainer />', () => {
  const { render } = createRenderer();

  describeConformance(<ResponsiveChartContainer height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiResponsiveChartContainer',
    testComponentPropWith: 'div',
    refInstanceof: window.SVGSVGElement,
    skip: [
      'componentProp',
      'componentsProp',
      'slotPropsProp',
      'slotPropsCallback',
      'slotsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'themeCustomPalette',
    ],
  }));
});
