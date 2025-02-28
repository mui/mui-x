import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartDataProviderPro } from '@mui/x-charts-pro/ChartDataProviderPro';

describe('<ChartDataProviderPro />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartDataProviderPro height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartDataProviderPro',
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
