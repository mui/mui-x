import { createRenderer } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { RadarChart, type RadarChartProps } from '@mui/x-charts/RadarChart';
import { isJSDOM } from 'test/utils/skipIf';
import { CHART_SELECTOR } from '../tests/constants';

const config: RadarChartProps = {
  series: [
    { id: 's1', data: [2, 3, 4, 5] },
    { id: 's2', data: [6, 5, 2, 1] },
  ],
  radar: {
    metrics: ['A', 'B', 'C', 'D'],
  },
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  width: 100,
  height: 100,
} as const;

describe('RadarChart - click event', () => {
  const { render } = createRenderer();

  describe('onAxisClick', () => {
    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)('should provide the right context as second argument', async () => {
      const onAxisClick = vi.fn();
      const { user } = render(
        <div
          style={{
            width: 100,
            height: 100,
          }}
        >
          <RadarChart {...config} onAxisClick={onAxisClick} />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 45, clientY: 15 },
        },
      ]);

      expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
        dataIndex: 0,
        axisValue: 'A',
        seriesValues: { s1: 2, s2: 6 },
      });

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 80, clientY: 45 },
        },
      ]);

      expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
        dataIndex: 1,
        axisValue: 'B',
        seriesValues: { s1: 3, s2: 5 },
      });
    });

    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)(
      'should provide the right context as second argument with startAngle=90',
      async () => {
        const onAxisClick = vi.fn();
        const { user } = render(
          <div
            style={{
              width: 100,
              height: 100,
            }}
          >
            <RadarChart
              {...config}
              radar={{ ...config.radar, startAngle: 90 }}
              onAxisClick={onAxisClick}
            />
          </div>,
        );
        const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 45, clientY: 15 },
          },
        ]);

        expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
          dataIndex: 3,
          axisValue: 'D',
          seriesValues: { s1: 5, s2: 1 },
        });

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 80, clientY: 45 },
          },
        ]);

        expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
          dataIndex: 0,
          axisValue: 'A',
          seriesValues: { s1: 2, s2: 6 },
        });
      },
    );
  });

  describe('onMarkClick', () => {
    it('should add cursor="pointer" to mark elements', () => {
      render(<RadarChart {...config} onMarkClick={() => {}} />);
      const marks = document.querySelectorAll<HTMLElement>('circle.MuiRadarSeriesPlot-mark');

      expect(Array.from(marks).map((rectangle) => rectangle.getAttribute('cursor'))).to.deep.equal([
        'pointer',
        'pointer',
        'pointer',
        'pointer',
        'pointer',
        'pointer',
        'pointer',
        'pointer',
      ]);
    });

    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)('should provide the right context as second argument', async () => {
      const onItemClick = vi.fn();
      const { user } = render(
        <div
          style={{
            width: 100,
            height: 100,
          }}
        >
          <RadarChart {...config} onMarkClick={onItemClick} />
        </div>,
      );

      const marks = document.querySelectorAll<HTMLElement>('circle.MuiRadarSeriesPlot-mark');

      await user.click(marks[0]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's1',
        dataIndex: 0,
      });

      await user.click(marks[1]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's1',
        dataIndex: 1,
      });

      await user.click(marks[4]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's2',
        dataIndex: 0,
      });
    });
  });

  describe('onAreaClick', () => {
    it('should add cursor="pointer" to mark elements', () => {
      render(<RadarChart {...config} onAreaClick={() => {}} />);
      const marks = document.querySelectorAll<HTMLElement>('path.MuiRadarSeriesPlot-area');

      expect(Array.from(marks).map((rectangle) => rectangle.getAttribute('cursor'))).to.deep.equal([
        'pointer',
        'pointer',
      ]);
    });

    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)('should provide the right context as second argument', async () => {
      const onItemClick = vi.fn();
      const { user } = render(
        <div
          style={{
            width: 100,
            height: 100,
          }}
        >
          <RadarChart {...config} onAreaClick={onItemClick} />
        </div>,
      );

      const marks = document.querySelectorAll<HTMLElement>('path.MuiRadarSeriesPlot-area');

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: marks[0],
          coords: { clientX: 50, clientY: 45 },
        },
      ]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's1',
        dataIndex: 0,
      });

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: marks[1],
          coords: { clientX: 50, clientY: 55 },
        },
      ]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's2',
        dataIndex: 2,
      });
    });
  });
});
