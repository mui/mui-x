import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/internal-test-utils';
import { Gauge } from './Gauge';

describe('<Gauge />', () => {
  const { render } = createRenderer();

  describeConformance(<Gauge height={100} value={60} />, () => ({
    classes: {} as any,
    inheritComponent: 'svg',
    render,
    muiName: 'MuiBarChart',
    testComponentPropWith: 'div',
    refInstanceof: window.HTMLDivElement,
    only: ['mergeClassName', 'propsSpread', 'refForwarding', 'reactTestRenderer', 'rootClass'],
  }));
});
