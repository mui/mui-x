import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describeConformance } from 'test/utils/describeConformance';
import { ResponsiveChartContainer } from './ResponsiveChartContainer';

describe('<ResponsiveChartContainer />', () => {
  const { render } = createRenderer();
  const testClass = 'test-class-responsive-container';
  describeConformance(
    <ResponsiveChartContainer height={100} series={[]} className={testClass} />,
    () => ({
      classes: { root: testClass },
      inheritComponent: 'div',
      muiName: 'MuiChartsResponsiveChartContainer',
      render,
      refInstanceof: window.HTMLDivElement,
      // only: ['mergeClassName', 'propsSpread', 'refForwarding', 'rootClass'],
    }),
  );
});
