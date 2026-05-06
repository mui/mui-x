import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { BarChartPremium } from '../BarChartPremium';

describe('<BarWebGLPlot />', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('should render a WebGL canvas when renderer="webgl"', () => {
    const { container } = render(
      <BarChartPremium
        width={400}
        height={300}
        renderer="webgl"
        series={[{ data: [1, 2, 3, 4, 5] }]}
      />,
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).not.to.equal(null);
  });

  it('should not render a WebGL canvas with the default renderer', () => {
    const { container } = render(
      <BarChartPremium width={400} height={300} series={[{ data: [1, 2, 3, 4, 5] }]} />,
    );

    const canvas = container.querySelector('canvas');
    expect(canvas).to.equal(null);
  });

  it.skipIf(isJSDOM)('should render without crashing for multiple stacked series', () => {
    expect(() =>
      render(
        <BarChartPremium
          width={400}
          height={300}
          renderer="webgl"
          series={[
            { data: [1, 2, 3, 4, 5], stack: 'a' },
            { data: [2, 3, 4, 5, 6], stack: 'a' },
          ]}
        />,
      ),
    ).not.to.throw();
  });

  it.skipIf(isJSDOM)('should render without crashing for horizontal layout', () => {
    expect(() =>
      render(
        <BarChartPremium
          width={400}
          height={300}
          renderer="webgl"
          layout="horizontal"
          series={[{ data: [1, 2, 3, 4, 5] }]}
          yAxis={[{ scaleType: 'band', data: ['a', 'b', 'c', 'd', 'e'] }]}
        />,
      ),
    ).not.to.throw();
  });
});
