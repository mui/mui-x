import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { barClasses } from '@mui/x-charts/BarChart';
import { BarChartPro } from './BarChartPro';

describe('<BarChartPro /> - Sampling', () => {
  const { render } = createRenderer();

  const countBars = (container: HTMLElement) =>
    container.querySelectorAll(`.${barClasses.element}`).length;

  const range = (length: number) => Array.from({ length }, (_, i) => i);

  it('renders one bar per data point when bars are wide enough', () => {
    const { container } = render(
      <BarChartPro
        series={[{ data: range(8) }]}
        xAxis={[{ data: range(8).map(String) }]}
        yAxis={[{ position: 'none' }]}
        width={2000}
        height={200}
        skipAnimation
      />,
    );

    expect(countBars(container)).to.equal(8);
  });

  it('subsamples bars when they would be thinner than the minimum width', () => {
    const dataLength = 256;
    const { container } = render(
      <BarChartPro
        series={[{ data: range(dataLength) }]}
        xAxis={[{ data: range(dataLength).map(String) }]}
        yAxis={[{ position: 'none' }]}
        width={200}
        height={200}
        skipAnimation
      />,
    );

    const rendered = countBars(container);
    expect(rendered).to.be.lessThan(dataLength);
    // 200px / 256 bars is well under the 4px minimum, so it collapses by a large factor.
    expect(rendered).to.be.lessThan(dataLength / 4);
    expect(rendered).to.be.greaterThan(0);
  });

  it('renders every bar when sampling is disabled', () => {
    const dataLength = 256;
    const { container } = render(
      <BarChartPro
        series={[{ data: range(dataLength) }]}
        xAxis={[{ data: range(dataLength).map(String) }]}
        yAxis={[{ position: 'none' }]}
        width={200}
        height={200}
        sampling={false}
        skipAnimation
      />,
    );

    expect(countBars(container)).to.equal(dataLength);
  });
});
