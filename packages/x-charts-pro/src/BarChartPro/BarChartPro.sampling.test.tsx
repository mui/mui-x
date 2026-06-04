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

  it('keeps bars at a readable width across the sampled-to-real zoom transition', () => {
    // A large dataset so sampling stays active across several zoom levels.
    const bigData = Array.from({ length: 4000 }, (_, i) => Math.sin(i / 11) * 50);
    const bigX = Array.from({ length: 4000 }, (_, i) => i);

    // Visible-window length is `(end - start)% * 4000`. The 45-55 window (400 points) is past the
    // point where the old zoom-scaled budget swapped to ~400 sub-pixel real bars; the pixel-limited
    // budget keeps it near the ~width/4 budget instead.
    const windows = [
      { start: 30, end: 70 }, // 1600 pts
      { start: 45, end: 55 }, // 400 pts
      { start: 48, end: 52 }, // 160 pts
      { start: 49, end: 51 }, // 80 pts — fits the budget, shown as real bars
    ];

    windows.forEach((window) => {
      const { container, unmount } = render(
        <BarChartPro
          {...baseProps}
          xAxis={[{ data: bigX, zoom: true, id: 'x' }]}
          series={[{ data: bigData, sampling: 'bucket' }]}
          initialZoom={[{ axisId: 'x', ...window }]}
        />,
      );

      const bars = getBars(container);
      const widths = bars.map((bar) => Number(bar.getAttribute('width')));

      // Never explodes into a sub-pixel forest: the count stays near the pixel budget (~width/4).
      expect(bars.length).to.be.lessThan(260);
      // Every bar stays readable — no sudden thinning at the hand-off.
      expect(Math.min(...widths)).to.be.greaterThan(2);

      unmount();
    });
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
