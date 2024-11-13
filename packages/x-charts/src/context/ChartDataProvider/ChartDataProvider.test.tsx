import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartDataProvider } from '@mui/x-charts/context/ChartDataProvider';

describe('<ChartDataProvider />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartDataProvider height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartDataProvider',
    testComponentPropWith: 'div',
    refInstanceof: window.SVGSVGElement,
    skip: [
      'mergeClassName',
      'propsSpread',
      'rootClass',
      'refForwarding',
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
