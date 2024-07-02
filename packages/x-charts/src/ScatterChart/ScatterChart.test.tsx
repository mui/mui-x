import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { test } from 'mocha';
import { ScatterChart } from './ScatterChart';

describe('<ScatterChart />', () => {
  const { render } = createRenderer();
  const testClass = 'test-class';

  test('should pass className prop to root component', () => {
    const { container } = render(
      <ScatterChart
        height={100}
        series={[
          {
            data: [
              { id: 'A', x: 100, y: 10 },
              { id: 'B', x: 200, y: 20 },
            ],
          },
        ]}
        className={testClass}
      />,
    );
    expect(container.firstElementChild?.classList.contains(testClass)).to.equal(true);
  });
});
