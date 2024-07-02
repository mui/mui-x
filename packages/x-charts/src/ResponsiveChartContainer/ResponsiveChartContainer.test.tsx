import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { test } from 'mocha';
import { ResponsiveChartContainer } from './ResponsiveChartContainer';

describe('<ResponsiveChartContainer />', () => {
  const { render } = createRenderer();
  const testClass = 'test-class-responsive-container';

  test('should pass className prop to root component', () => {
    const { container } = render(
      <ResponsiveChartContainer height={100} series={[]} className={testClass} />,
    );
    expect(container.firstElementChild?.classList.contains(testClass)).to.equal(true);
  });
});
