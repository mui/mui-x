import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

describe('<ChartContainer />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartContainer height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartContainer',
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
