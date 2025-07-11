import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { RadarChart, RadarChartProps } from '@mui/x-charts/RadarChart';
import { isJSDOM } from 'test/utils/skipIf';

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
      const onAxisClick = spy();
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
      const svg = document.querySelector<HTMLElement>('svg')!;

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 45, clientY: 15 },
        },
      ]);

      expect(onAxisClick.lastCall.args[1]).to.deep.equal({
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

      expect(onAxisClick.lastCall.args[1]).to.deep.equal({
        dataIndex: 1,
        axisValue: 'B',
        seriesValues: { s1: 3, s2: 5 },
      });
    });

    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)(
      'should provide the right context as second argument with startAngle=90',
      async () => {
        const onAxisClick = spy();
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
        const svg = document.querySelector<HTMLElement>('svg')!;

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 45, clientY: 15 },
          },
        ]);

        expect(onAxisClick.lastCall.args[1]).to.deep.equal({
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

        expect(onAxisClick.lastCall.args[1]).to.deep.equal({
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
      const onItemClick = spy();
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
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's1',
        dataIndex: 0,
      });

      await user.click(marks[1]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's1',
        dataIndex: 1,
      });

      await user.click(marks[4]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
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
      const onItemClick = spy();
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

      await user.click(marks[0]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's1',
      });

      await user.click(marks[1]);
      expect(onItemClick.lastCall.args[1]).to.deep.equal({
        type: 'radar',
        seriesId: 's2',
      });
    });
  });
});
