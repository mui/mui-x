import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { ChartContainer } from './ChartContainer';

describe('<ResponsiveChartContainer />', () => {
  const { render } = createRenderer();

  describeConformance(<ChartContainer height={100} width={100} series={[]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiChartContainer',
    testComponentPropWith: 'div',
    refInstanceof: window.SVGSVGElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'reactTestRenderer', 'rootClass'],
  }));
});
