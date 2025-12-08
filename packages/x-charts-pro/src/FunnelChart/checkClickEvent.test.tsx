import { createRenderer } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { isJSDOM } from 'test/utils/skipIf';
import { CHART_SELECTOR } from '../tests/constants';

const config = {
  series: [
    {
      id: 'big',
      data: [
        {
          value: 200,
          label: 'A',
        },
        {
          value: 100,
          label: 'B',
        },
      ],
    },
    {
      id: 'small',
      data: [
        {
          value: 100,
          label: 'C',
        },
        {
          value: 50,
          label: 'D',
        },
      ],
    },
  ],
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  width: 400,
  height: 400,
  hideLegend: true,
} as const;

// Plot as follow to simplify click position
//
// A,C | A C C C A
// B,D |   B D B

describe('FunnelChart - click event', () => {
  const { render } = createRenderer();

  describe('onAxisClick', () => {
    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)('should provide the right context as second argument', async () => {
      const onAxisClick = vi.fn();
      const { user } = render(
        <div
          style={{
            width: 400,
            height: 400,
          }}
        >
          <FunnelChart {...config} onAxisClick={onAxisClick} />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 90, clientY: 100 },
        },
      ]);

      expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
        dataIndex: 0,
        axisValue: 0,
        seriesValues: { big: 200, small: 100 },
      });

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 120, clientY: 300 },
        },
      ]);

      expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
        dataIndex: 1,
        axisValue: 1,
        seriesValues: { big: 100, small: 50 },
      });
    });

    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)(
      'should provide the right context as second argument with layout="horizontal"',
      async () => {
        const onAxisClick = vi.fn();
        const { user } = render(
          <div
            style={{
              width: 400,
              height: 400,
            }}
          >
            <FunnelChart
              {...config}
              series={config.series.map((v) => ({ ...v, layout: 'horizontal' }))}
              onAxisClick={onAxisClick}
            />
          </div>,
        );
        const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 50, clientY: 100 },
          },
        ]);

        expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
          dataIndex: 0,
          axisValue: 0,
          seriesValues: { big: 200, small: 100 },
        });

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 300, clientY: 140 },
          },
        ]);

        expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
          dataIndex: 1,
          axisValue: 1,
          seriesValues: { big: 100, small: 50 },
        });
      },
    );

    // can't do Pointer event with JSDom https://github.com/jsdom/jsdom/issues/2527
    it.skipIf(isJSDOM)(
      'should provide the correct axis values when using category axis',
      async () => {
        const onAxisClick = vi.fn();
        const { user } = render(
          <div
            style={{
              width: 400,
              height: 400,
            }}
          >
            <FunnelChart
              {...config}
              onAxisClick={onAxisClick}
              categoryAxis={{ categories: ['First', 'Second'] }}
            />
          </div>,
        );
        const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 90, clientY: 100 },
          },
        ]);

        expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
          dataIndex: 0,
          axisValue: 'First',
          seriesValues: { big: 200, small: 100 },
        });

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 120, clientY: 300 },
          },
        ]);

        expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
          dataIndex: 1,
          axisValue: 'Second',
          seriesValues: { big: 100, small: 50 },
        });
      },
    );
  });

  describe('onItemClick', () => {
    it('should add cursor="pointer" to bar elements', () => {
      render(<FunnelChart {...config} onItemClick={() => {}} />);
      const paths = document.querySelectorAll<HTMLElement>('path.MuiFunnelSection-root');

      expect(Array.from(paths).map((rectangle) => rectangle.getAttribute('cursor'))).to.deep.equal([
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
            width: 400,
            height: 400,
          }}
        >
          <FunnelChart {...config} onItemClick={onItemClick} />
        </div>,
      );

      const pathsBig = document.querySelectorAll<HTMLElement>('path.MuiFunnelSection-series-big');
      const pathsSmall = document.querySelectorAll<HTMLElement>(
        'path.MuiFunnelSection-series-small',
      );

      await user.click(pathsBig[0]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'funnel',
        seriesId: 'big',
        dataIndex: 0,
      });

      await user.click(pathsBig[1]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'funnel',
        seriesId: 'big',
        dataIndex: 1,
      });

      await user.click(pathsSmall[0]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'funnel',
        seriesId: 'small',
        dataIndex: 0,
      });
      await user.click(pathsSmall[1]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'funnel',
        seriesId: 'small',
        dataIndex: 1,
      });
    });
  });
});
