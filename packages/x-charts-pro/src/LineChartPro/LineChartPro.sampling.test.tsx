import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { lineClasses } from '@mui/x-charts/LineChart';
import { LineChartPro } from './LineChartPro';

// Count the drawing commands of the main line path (the one carrying `lineClasses.line`).
const linePointCount = (container: HTMLElement) => {
  const paths = Array.from(container.querySelectorAll<SVGPathElement>('path[data-series]'));
  const line = paths.find((p) => p.classList.contains(lineClasses.line));
  return ((line?.getAttribute('d') ?? '').match(/[MLC]/g) ?? []).length;
};

describe('<LineChartPro /> - Sampling', () => {
  const { render } = createRenderer();
  const range = (n: number) => Array.from({ length: n }, (_, i) => i);

  it('samples a static (non-zoomable) axis at full range', () => {
    const dataLength = 1024;
    const { container } = render(
      <LineChartPro
        series={[{ data: range(dataLength), showMark: false }]}
        xAxis={[{ data: range(dataLength) }]}
        yAxis={[{ position: 'none' }]}
        width={400}
        height={200}
        margin={0}
        sampling="minmax"
        skipAnimation
      />,
    );

    const rendered = linePointCount(container);
    expect(rendered).to.be.greaterThan(0);
    expect(rendered).to.be.lessThan(dataLength / 2);
  });

  it('renders every point when sampling is disabled (default)', () => {
    const dataLength = 1024;
    const { container } = render(
      <LineChartPro
        series={[{ data: range(dataLength), showMark: false }]}
        xAxis={[{ data: range(dataLength) }]}
        yAxis={[{ position: 'none' }]}
        width={400}
        height={200}
        margin={0}
        sampling="none"
        skipAnimation
      />,
    );

    expect(linePointCount(container)).to.equal(dataLength);
  });
});
