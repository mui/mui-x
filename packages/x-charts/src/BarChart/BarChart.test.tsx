import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { BarChart } from './BarChart';

describe('<BarChart />', () => {
  const { render } = createRenderer();

  describeConformance(<BarChart height={100} series={[{ data: [100, 200] }]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiBarChart',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'reactTestRenderer', 'rootClass'],
  }));
});
