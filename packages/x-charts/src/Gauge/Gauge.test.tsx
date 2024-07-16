import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { Gauge } from '@mui/x-charts/Gauge';

describe('<Gauge />', () => {
  const { render } = createRenderer();

  describeConformance(<Gauge height={100} width={100} value={60} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiGauge',
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
