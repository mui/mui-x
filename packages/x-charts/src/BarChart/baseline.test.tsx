import { createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';
import type { BarChartProps } from '@mui/x-charts/BarChart';
import { isJSDOM } from 'test/utils/skipIf';
import { getCenter } from 'test/utils/charts/getCenter';
import { getBarExtent } from '../internals/createGetBarDimensions';

const config = {
  margin: 0,
  xAxis: [{ data: ['A', 'B'], position: 'none' }],
  yAxis: [{ min: 0, max: 10, position: 'none' }],
  width: 100,
  height: 100,
  skipAnimation: true,
  hideLegend: true,
} as const;

const OFFSET_WARNING =
  'MUI X Charts: The `baseline` of the bar series in the stack "a" is ignored because the stack does not use the \'diverging\' stack offset.';

/** Bounds of a clip path made of `M`, `h`, `v` and `a` commands with relative endpoints. */
function getClipPathBounds(d: string) {
  let x = 0;
  let y = 0;
  const xs: number[] = [];
  const ys: number[] = [];
  for (const [, command, rawArgs] of d.matchAll(/([MhvaZ])([^MhvaZ]*)/g)) {
    const args = rawArgs
      .trim()
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    if (command === 'M') {
      [x, y] = args;
    } else if (command === 'h') {
      x += args[0];
    } else if (command === 'v') {
      y += args[0];
    } else if (command === 'a') {
      x += args[5];
      y += args[6];
    }
    xs.push(x);
    ys.push(y);
  }
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys),
  };
}

const STACK_CLAMP_WARNING =
  'MUI X Charts: A stacked bar series has a `baseline` outside the range between 0 and the value of a bar at the bottom of the stack.';

describe('BarChart - baseline', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    clearWarningsCache();
  });

  function getBars(props: Partial<BarChartProps> & Pick<BarChartProps, 'series'>) {
    const { container } = render(<BarChart {...config} {...props} />);

    return Array.from(container.querySelectorAll(`.${barClasses.element}`), (bar) => ({
      x: Number(bar.getAttribute('x')),
      y: Number(bar.getAttribute('y')),
      width: Number(bar.getAttribute('width')),
      height: Number(bar.getAttribute('height')),
    }));
  }

  function getBarsAndClipBounds(props: Partial<BarChartProps> & Pick<BarChartProps, 'series'>) {
    const { container } = render(<BarChart {...config} borderRadius={4} {...props} />);
    const bars = Array.from(container.querySelectorAll(`.${barClasses.element}`), (bar) => ({
      left: Number(bar.getAttribute('x')),
      top: Number(bar.getAttribute('y')),
      right: Number(bar.getAttribute('x')) + Number(bar.getAttribute('width')),
      bottom: Number(bar.getAttribute('y')) + Number(bar.getAttribute('height')),
    }));
    const clips = Array.from(container.querySelectorAll('clipPath path'), (path) =>
      getClipPathBounds(path.getAttribute('d') ?? ''),
    );
    return { bars, clips };
  }

  function expectClipToCoverBars({ bars, clips }: ReturnType<typeof getBarsAndClipBounds>) {
    expect(clips).to.have.length(1);
    const [clip] = clips;
    bars.forEach((bar) => {
      expect(clip.left).to.be.at.most(bar.left);
      expect(clip.right).to.be.at.least(bar.right);
      expect(clip.top).to.be.at.most(bar.top);
      expect(clip.bottom).to.be.at.least(bar.bottom);
    });
  }

  it('should treat values missing from a shorter series as null', () => {
    expect(getBarExtent([0, 0], undefined, 50, false)).to.deep.equal([50, 50]);
  });

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

  it('should draw a zero value from the baseline to 0', () => {
    const [, zero] = getBars({ series: [{ data: [1, 0], baseline: 2 }] });

    expect(zero).to.include({ y: 80, height: 20 });
  });

  it('should keep 0 in the domain with `baseline: "min"` on a linear axis', () => {
    const [, five] = getBars({
      series: [{ data: [0, 5, 10], baseline: 'min' }],
      xAxis: [{ data: ['A', 'B', 'C'], position: 'none' }],
      yAxis: [{ position: 'none' }],
    });

    expect(five).to.include({ y: 50, height: 50 });
  });

  it('should warn when bars start from 0 on a log scale', () => {
    expect(() =>
      getBars({
        series: [{ data: [10, 100] }],
        yAxis: [{ scaleType: 'log', position: 'none' }],
      }),
    ).toWarnDev(
      'uses a log scale, but the bar series of id "auto-generated-id-0" starts its bars from 0.',
    );
  });

  it('should skip zero values on a log scale with `baseline: "min"`', () => {
    const bars = getBars({
      series: [{ data: [0, 10, 100], baseline: 'min' }],
      xAxis: [{ data: ['A', 'B', 'C'], position: 'none' }],
      yAxis: [{ scaleType: 'log', min: 1, max: 100, position: 'none' }],
    });

    expect(bars).to.have.length(2);
    expect(bars[0]).to.include({ y: 50, height: 50 });
  });

  it('should grow `minBarSize` away from the baseline', () => {
    const [bar] = getBars({
      series: [{ data: [3.9], baseline: 4, layout: 'horizontal', minBarSize: 10 }],
      xAxis: [{ min: 0, max: 10, position: 'none' }],
      yAxis: [{ data: ['A'], position: 'none' }],
    });

    expect(bar).to.include({ x: 30, width: 10 });
  });

  it('should round the corners away from the baseline', () => {
    const { container } = render(
      <BarChart {...config} series={[{ data: [1, 6], baseline: 4 }]} borderRadius={4} />,
    );

    const paths = Array.from(container.querySelectorAll('clipPath path'), (path) =>
      path.getAttribute('d'),
    );
    expect(paths).to.deep.equal([
      'M5,60 v26 a4,4 0 0 0 4,4 h32 a4,4 0 0 0 4,-4 v-26 Z',
      'M55,60 v-16 a4,4 0 0 1 4,-4 h32 a4,4 0 0 1 4,4 v16 Z',
    ]);
  });

  describe('stacking', () => {
    it('should start a log-scale stack from the axis min', () => {
      const [bottom, top] = getBars({
        series: [
          { data: [10], stack: 'a', baseline: 'min' },
          { data: [90], stack: 'a' },
        ],
        xAxis: [{ data: ['A'], position: 'none' }],
        yAxis: [{ scaleType: 'log', min: 1, max: 100, position: 'none' }],
      });

      expect(bottom).to.include({ y: 50, height: 50 });
      expect(top).to.include({ y: 0, height: 50 });
    });

    it('should not move the bottom bar past its value with `baseline: "max"`', () => {
      let bars: ReturnType<typeof getBars> = [];
      expect(() => {
        bars = getBars({
          series: [
            { data: [2], stack: 'a', baseline: 'max' },
            { data: [3], stack: 'a' },
          ],
          xAxis: [{ data: ['A'], position: 'none' }],
        });
      }).toWarnDev(STACK_CLAMP_WARNING);

      expect(bars[0]).to.include({ y: 80, height: 0 });
      expect(bars[1]).to.include({ y: 50, height: 30 });
    });

    it('should not move the bottom bar past its value with a number baseline', () => {
      let bars: ReturnType<typeof getBars> = [];
      expect(() => {
        bars = getBars({
          series: [
            { data: [0.5], stack: 'a', baseline: 1 },
            { data: [3], stack: 'a' },
          ],
          xAxis: [{ data: ['A'], position: 'none' }],
        });
      }).toWarnDev(STACK_CLAMP_WARNING);

      expect(bars[0]).to.include({ y: 95, height: 0 });
      expect(bars[1]).to.include({ y: 65, height: 30 });
    });

    it('should not extend positive bars through negative ones with `baseline: "min"`', () => {
      let bars: ReturnType<typeof getBars> = [];
      expect(() => {
        bars = getBars({
          series: [
            { data: [5], stack: 'a', baseline: 'min' },
            { data: [-3], stack: 'a' },
          ],
          xAxis: [{ data: ['A'], position: 'none' }],
          yAxis: [{ min: -10, max: 10, position: 'none' }],
        });
      }).toWarnDev(STACK_CLAMP_WARNING);

      expect(bars[0]).to.include({ y: 25, height: 25 });
      expect(bars[1]).to.include({ y: 65, height: 0 });
    });

    it('should keep the clip path on a stack whose baseline is clamped', () => {
      let result: ReturnType<typeof getBarsAndClipBounds> = { bars: [], clips: [] };
      expect(() => {
        result = getBarsAndClipBounds({
          series: [
            { data: [2], stack: 'a', baseline: 'max' },
            { data: [3], stack: 'a' },
          ],
          xAxis: [{ data: ['A'], position: 'none' }],
        });
      }).toWarnDev(STACK_CLAMP_WARNING);

      expectClipToCoverBars(result);
    });

    it('should keep the clip path on a mixed-sign stack whose baseline is clamped', () => {
      let result: ReturnType<typeof getBarsAndClipBounds> = { bars: [], clips: [] };
      expect(() => {
        result = getBarsAndClipBounds({
          series: [
            { data: [5], stack: 'a', baseline: 2 },
            { data: [-3], stack: 'a' },
          ],
          xAxis: [{ data: ['A'], position: 'none' }],
          yAxis: [{ min: -10, max: 10, position: 'none' }],
        });
      }).toWarnDev(STACK_CLAMP_WARNING);

      expectClipToCoverBars(result);
    });

    it('should keep the clip path on a negative stack whose baseline is clamped', () => {
      let result: ReturnType<typeof getBarsAndClipBounds> = { bars: [], clips: [] };
      expect(() => {
        result = getBarsAndClipBounds({
          series: [
            { data: [-2], stack: 'a', baseline: 'min' },
            { data: [-3], stack: 'a' },
          ],
          xAxis: [{ data: ['A'], position: 'none' }],
          yAxis: [{ min: -10, max: 0, position: 'none' }],
        });
      }).toWarnDev(STACK_CLAMP_WARNING);

      expectClipToCoverBars(result);
    });

    it('should keep the clip path on a horizontal stack whose baseline is clamped', () => {
      let result: ReturnType<typeof getBarsAndClipBounds> = { bars: [], clips: [] };
      expect(() => {
        result = getBarsAndClipBounds({
          series: [
            { data: [2], stack: 'a', baseline: -5, layout: 'horizontal' },
            { data: [3], stack: 'a', layout: 'horizontal' },
          ],
          xAxis: [{ min: -10, max: 10, position: 'none' }],
          yAxis: [{ data: ['A'], position: 'none' }],
        });
      }).toWarnDev(STACK_CLAMP_WARNING);

      expectClipToCoverBars(result);
    });

    it.each([
      { stackOffset: 'silhouette', data: [[2], [2]] },
      { stackOffset: 'wiggle', data: [[2], [2]] },
      { stackOffset: 'none', data: [[3], [-3], [2]] },
    ] as const)(
      'should ignore the baseline with the $stackOffset stack offset',
      ({ stackOffset, data }) => {
        const series = (baseline?: number) =>
          data.map((values) => ({ data: values, stack: 'a', stackOffset, baseline }));
        const props = {
          xAxis: [{ data: ['A'], position: 'none' as const }],
          yAxis: [{ min: -10, max: 10, position: 'none' as const }],
        };

        const expected = getBars({ ...props, series: series() });
        let bars: ReturnType<typeof getBars> = [];
        expect(() => {
          bars = getBars({ ...props, series: series(1) });
        }).toWarnDev(OFFSET_WARNING);

        expect(bars).to.deep.equal(expected);
      },
    );

    it('should share the baseline across the series of a stack', () => {
      const bars = getBars({
        series: [
          { data: [null, 10], stack: 'a', baseline: 'min' },
          { data: [100, 100], stack: 'a' },
        ],
        yAxis: [{ scaleType: 'log', min: 1, max: 1000, position: 'none' }],
      });

      expect(bars.map((bar) => bar.y + bar.height)).to.deep.equal([100, 100, 67]);
    });

    it('should warn when the series of a stack have different baselines', () => {
      expect(() =>
        getBars({
          series: [
            { data: [2, 2], stack: 'a', baseline: 1 },
            { data: [3, 3], stack: 'a', baseline: 2 },
          ],
        }),
      ).toWarnDev(
        'MUI X Charts: The bar series of the stack "a" have different `baseline` values.',
      );
    });
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
