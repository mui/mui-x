import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { barClasses } from '@mui/x-charts/BarChart';
import { BarChartPro } from './BarChartPro';

const BAR_COUNT = 800;
const data = Array.from({ length: BAR_COUNT }, (_, i) => Math.sin(i / 7) * 50);
const xData = Array.from({ length: BAR_COUNT }, (_, i) => i);

const getBars = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<SVGRectElement>(`.${barClasses.element}`));

describe('<BarChartPro /> - Sampling', () => {
  const { render } = createRenderer();

  const baseProps = {
    xAxis: [{ data: xData }],
    width: 600,
    height: 400,
    skipAnimation: true,
    slotProps: { tooltip: { trigger: 'none' } },
  } as const;

  it('renders far fewer, wider bars when sampling is enabled', () => {
    const { container: sampled } = render(
      <BarChartPro {...baseProps} series={[{ data, sampling: 'bucket' }]} />,
    );
    const { container: full } = render(<BarChartPro {...baseProps} series={[{ data }]} />);

    const sampledBars = getBars(sampled);
    const fullBars = getBars(full);

    // Considerable reduction: ~1 bar per few pixels instead of one per data point.
    expect(sampledBars.length).to.be.lessThan(BAR_COUNT / 3);
    expect(fullBars.length).to.be.greaterThan(BAR_COUNT / 2);

    // Kept bars are reindexed to fill the width, so each is wider than a full-data bar.
    const sampledWidth = Number(sampledBars[0].getAttribute('width'));
    const fullWidth = Number(fullBars[0].getAttribute('width'));
    expect(sampledWidth).to.be.greaterThan(fullWidth);

    // All kept bars share the same width (uniform grid, independent of the representative index).
    const widths = sampledBars.map((bar) => Number(bar.getAttribute('width')));
    widths.forEach((width) => {
      expect(Math.abs(width - sampledWidth)).to.be.lessThan(0.5);
    });
  });

  it('leaves bars unchanged when no sampling method is set', () => {
    const { container } = render(<BarChartPro {...baseProps} series={[{ data }]} />);
    expect(getBars(container).length).to.equal(BAR_COUNT);
  });

  it('samples horizontal bars along the y-axis', () => {
    // Horizontal layout puts the category axis on y, so sampling is driven by the height.
    const { container: sampled } = render(
      <BarChartPro
        width={400}
        height={600}
        skipAnimation
        yAxis={[{ data: xData }]}
        series={[{ data, layout: 'horizontal', sampling: 'bucket' }]}
        slotProps={{ tooltip: { trigger: 'none' } }}
      />,
    );
    const { container: full } = render(
      <BarChartPro
        width={400}
        height={600}
        skipAnimation
        yAxis={[{ data: xData }]}
        series={[{ data, layout: 'horizontal' }]}
        slotProps={{ tooltip: { trigger: 'none' } }}
      />,
    );

    expect(getBars(sampled).length).to.be.lessThan(BAR_COUNT / 3);
    expect(getBars(full).length).to.be.greaterThan(BAR_COUNT / 2);
  });

  it('samples and lays out uniformly on a reversed axis', () => {
    const { container } = render(
      <BarChartPro
        {...baseProps}
        xAxis={[{ data: xData, reverse: true }]}
        series={[{ data, sampling: 'bucket' }]}
      />,
    );

    const bars = getBars(container);
    expect(bars.length).to.be.lessThan(BAR_COUNT / 3);

    // The reindexed bars keep a uniform width and span the drawing area (no clustering on one side).
    const widths = bars.map((bar) => Number(bar.getAttribute('width')));
    widths.forEach((width) => expect(Math.abs(width - widths[0])).to.be.lessThan(0.5));
    const xs = bars.map((bar) => Number(bar.getAttribute('x')));
    expect(Math.min(...xs)).to.be.lessThan(100);
    expect(Math.max(...xs)).to.be.greaterThan(400);
  });
});
