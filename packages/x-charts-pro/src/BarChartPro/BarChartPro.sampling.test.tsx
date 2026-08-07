import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { barClasses } from '@mui/x-charts/BarChart';
import { BarChartPro } from './BarChartPro';

describe('<BarChartPro /> - Sampling', () => {
  const { render } = createRenderer();

  const countBars = (container: HTMLElement) =>
    container.querySelectorAll(`.${barClasses.element}`).length;

  const range = (length: number) => Array.from({ length }, (_, i) => i);

  // Regression: https://github.com/mui/mui-x/issues/23031 — sampling used to require zoom.
  it('samples a static (non-zoomable) axis at full range', () => {
    const dataLength = 256;
    const { container } = render(
      <BarChartPro
        series={[{ data: range(dataLength) }]}
        xAxis={[{ data: range(dataLength).map(String) }]}
        yAxis={[{ position: 'none' }]}
        width={200}
        height={200}
        margin={0}
        sampling="minmax"
        skipAnimation
      />,
    );

    const rendered = countBars(container);
    expect(rendered).to.be.greaterThan(0);
    expect(rendered).to.be.lessThan(dataLength / 2);
  });

  it('renders one bar per data point when bars are wide enough', () => {
    const { container } = render(
      <BarChartPro
        series={[{ data: range(8) }]}
        xAxis={[{ data: range(8).map(String), zoom: true }]}
        yAxis={[{ position: 'none' }]}
        width={2000}
        height={200}
        margin={0}
        sampling="minmax"
        skipAnimation
      />,
    );

    expect(countBars(container)).to.equal(8);
  });

  it('samples bars when they would be thinner than the minimum width', () => {
    const dataLength = 256;
    const { container } = render(
      <BarChartPro
        series={[{ data: range(dataLength) }]}
        xAxis={[{ data: range(dataLength).map(String), zoom: true }]}
        yAxis={[{ position: 'none' }]}
        width={200}
        height={200}
        margin={0}
        sampling="minmax"
        skipAnimation
      />,
    );

    const rendered = countBars(container);
    expect(rendered).to.be.greaterThan(0);
    expect(rendered).to.be.lessThan(dataLength / 2);
  });

  // Regression #22997: reversing a sampled axis should mirror the bars, not shift them off-screen.
  it('mirrors sampled bucket geometry on a reversed band axis', () => {
    const width = 200;

    const geometryOf = (container: HTMLElement) =>
      Array.from(container.querySelectorAll(`.${barClasses.element}`))
        .map((bar) => ({
          x: Number(bar.getAttribute('x')),
          width: Number(bar.getAttribute('width')),
        }))
        .sort((a, b) => a.x - b.x);

    const props = (reverse: boolean) =>
      ({
        series: [{ data: range(256) }],
        xAxis: [{ data: range(256).map(String), zoom: true, reverse }],
        yAxis: [{ position: 'none' }],
        width,
        height: 200,
        margin: 0,
        sampling: 'minmax',
        skipAnimation: true,
      }) as const;

    const { container, setProps } = render(<BarChartPro {...props(false)} />);
    const normal = geometryOf(container);

    setProps(props(true));
    const reversed = geometryOf(container);

    expect(normal.length).to.be.greaterThan(0); // sampling is active
    expect(reversed.length).to.equal(normal.length);

    reversed.forEach(({ x, width: w }, i) => {
      // Stays on-screen (the bug pushed buckets off the right edge).
      expect(x).to.be.greaterThanOrEqual(0);
      expect(x + w).to.be.lessThanOrEqual(width + 0.5);
      // Mirrors the non-reversed bar: [x, x+w] maps to [width - (x+w), width - x].
      const mirror = normal[normal.length - 1 - i];
      expect(width - (x + w)).to.be.closeTo(mirror.x, 1);
    });
  });

  it('renders every bar when sampling is disabled (default)', () => {
    const dataLength = 256;
    const { container } = render(
      <BarChartPro
        series={[{ data: range(dataLength) }]}
        xAxis={[{ data: range(dataLength).map(String), zoom: true }]}
        yAxis={[{ position: 'none' }]}
        width={200}
        height={200}
        margin={0}
        sampling="none"
        skipAnimation
      />,
    );

    expect(countBars(container)).to.equal(dataLength);
  });
});
