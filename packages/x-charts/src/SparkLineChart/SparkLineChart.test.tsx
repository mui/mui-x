import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { SparkLineChart } from './SparkLineChart';

describe('<SparkLineChart />', () => {
  const { render } = createRenderer();

  describeConformance(<SparkLineChart height={100} data={[100, 200]} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiBarChart',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'reactTestRenderer', 'rootClass'],
  }));
});
