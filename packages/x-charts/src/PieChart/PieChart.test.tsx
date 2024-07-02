import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { test } from 'mocha';
import { PieChart } from './PieChart';

describe('<PieChart />', () => {
  const { render } = createRenderer();
  const testClass = 'test-class';

  test('should pass className prop to root component', () => {
    const { container } = render(
      <PieChart
        height={100}
        series={[
          {
            data: [
              { id: 'A', value: 100 },
              { id: 'B', value: 200 },
            ],
          },
        ]}
        className={testClass}
      />,
    );
    expect(container.firstElementChild?.classList.contains(testClass)).to.equal(true);
  });
});
