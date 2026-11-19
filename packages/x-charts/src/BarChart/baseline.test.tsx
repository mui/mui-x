import { createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect, vi } from 'vitest';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';
import type { BarChartProps } from '@mui/x-charts/BarChart';
import { isJSDOM } from 'test/utils/skipIf';
import { getCenter } from 'test/utils/charts/getCenter';

const config = {
  margin: 0,
  xAxis: [{ data: ['A', 'B'], position: 'none' }],
  yAxis: [{ min: 0, max: 10, position: 'none' }],
  width: 100,
  height: 100,
  skipAnimation: true,
  hideLegend: true,
} as const;

describe('BarChart - baseline', () => {
  const { render } = createRenderer();

  function getBars(props: Partial<BarChartProps> & Pick<BarChartProps, 'series'>) {
    const { container } = render(<BarChart {...config} {...props} />);

    return Array.from(container.querySelectorAll(`.${barClasses.element}`), (bar) => ({
      x: Number(bar.getAttribute('x')),
      y: Number(bar.getAttribute('y')),
      width: Number(bar.getAttribute('width')),
      height: Number(bar.getAttribute('height')),
    }));
  }

  it('should start bars from 0 by default', () => {
    const [bar] = getBars({ series: [{ data: [4, 6] }] });

    expect(bar).to.include({ y: 60, height: 40 });
  });

  it('should start bars from a number baseline', () => {
    const [above, below] = getBars({ series: [{ data: [4, 1], baseline: 2 }] });

    expect(above).to.include({ y: 60, height: 20 });
    expect(below).to.include({ y: 80, height: 10 });
  });

  it('should start bars from the axis min with `baseline: "min"`', () => {
    const [bar] = getBars({
      series: [{ data: [4, 6], baseline: 'min' }],
      yAxis: [{ min: 2, max: 10, position: 'none' }],
    });

    expect(bar).to.include({ y: 75, height: 25 });
  });

  it('should start bars from the axis max with `baseline: "max"`', () => {
    const [bar] = getBars({ series: [{ data: [4, 6], baseline: 'max' }] });

    expect(bar).to.include({ y: 0, height: 60 });
  });

  it('should render valid bars on a log scale with `baseline: "min"`', () => {
    const bars = getBars({
      series: [{ data: [10, 100], baseline: 'min' }],
      yAxis: [{ scaleType: 'log', min: 1, max: 100, position: 'none' }],
    });

    expect(bars).to.have.length(2);
    expect(bars[0]).to.include({ y: 50, height: 50 });
    expect(bars[1]).to.include({ y: 0, height: 100 });
  });

  it('should start only the bottom of a stack from the baseline', () => {
    const [bottom, , top] = getBars({
      series: [
        { data: [2, 2], stack: 'a', baseline: 1 },
        { data: [3, 3], stack: 'a', baseline: 1 },
      ],
    });

    expect(bottom).to.include({ y: 80, height: 10 });
    expect(top).to.include({ y: 50, height: 30 });
  });

  it('should support the horizontal layout', () => {
    const [bar] = getBars({
      series: [{ data: [4, 6], baseline: 2, layout: 'horizontal' }],
      xAxis: [{ min: 0, max: 10, position: 'none' }],
      yAxis: [{ data: ['A', 'B'], position: 'none' }],
    });

    expect(bar).to.include({ x: 20, width: 20 });
  });

  // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
  it.skipIf(isJSDOM)('should hit-test the bar between the baseline and the value', async () => {
    const onItemClick = vi.fn();
    const { user, container } = render(
      <BarChart
        {...config}
        series={[{ id: 's1', data: [1, 6], baseline: 4 }]}
        onItemClick={onItemClick}
      />,
    );

    const bar = container.querySelectorAll(`.${barClasses.element}`)[0];
    await user.pointer([{ keys: '[MouseLeft]', target: bar, coords: getCenter(bar) }]);

    expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'bar',
      seriesId: 's1',
      dataIndex: 0,
    });
  });
});
