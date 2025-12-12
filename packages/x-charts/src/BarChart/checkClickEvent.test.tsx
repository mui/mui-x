import { createRenderer } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { BarChart } from '@mui/x-charts/BarChart';
import { isJSDOM } from 'test/utils/skipIf';
import { CHART_SELECTOR } from '../tests/constants';

const config = {
  dataset: [
    { x: 'A', v1: 4, v2: 2 },
    { x: 'B', v1: 1, v2: 1 },
  ],
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  xAxis: [{ position: 'none' }],
  yAxis: [{ position: 'none' }],
  width: 400,
  height: 400,
} as const;

// Plot as follow to simplify click position
//
// | X
// | X
// | X X
// | X X X X
// ---A---B-

describe('BarChart - click event', () => {
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
          <BarChart
            {...config}
            series={[
              { dataKey: 'v1', id: 's1' },
              { dataKey: 'v2', id: 's2' },
            ]}
            xAxis={[{ dataKey: 'x' }]}
            onAxisClick={onAxisClick}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 198, clientY: 60 },
        },
      ]);

      expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
        dataIndex: 0,
        axisValue: 'A',
        seriesValues: { s1: 4, s2: 2 },
      });

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 201, clientY: 60 },
        },
      ]);

      expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
        dataIndex: 1,
        axisValue: 'B',
        seriesValues: { s1: 1, s2: 1 },
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
            <BarChart
              {...config}
              layout="horizontal"
              series={[
                { dataKey: 'v1', id: 's1' },
                { dataKey: 'v2', id: 's2' },
              ]}
              yAxis={[{ scaleType: 'band', dataKey: 'x' }]}
              onAxisClick={onAxisClick}
            />
          </div>,
        );
        const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 60, clientY: 198 },
          },
        ]);

        expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
          dataIndex: 0,
          axisValue: 'A',
          seriesValues: { s1: 4, s2: 2 },
        });

        await user.pointer([
          {
            keys: '[MouseLeft]',
            target: svg,
            coords: { clientX: 60, clientY: 201 },
          },
        ]);

        expect(onAxisClick.mock.lastCall?.[1]).to.deep.equal({
          dataIndex: 1,
          axisValue: 'B',
          seriesValues: { s1: 1, s2: 1 },
        });
      },
    );
  });

  describe('onItemClick', () => {
    it('should add cursor="pointer" to bar elements', () => {
      render(
        <BarChart
          {...config}
          series={[
            { dataKey: 'v1', id: 's1' },
            { dataKey: 'v2', id: 's2' },
          ]}
          xAxis={[{ dataKey: 'x' }]}
          onItemClick={() => {}}
        />,
      );
      const rectangles = document.querySelectorAll<HTMLElement>('rect.MuiBarElement-root');

      expect(
        Array.from(rectangles).map((rectangle) => rectangle.getAttribute('cursor')),
      ).to.deep.equal(['pointer', 'pointer', 'pointer', 'pointer']);
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
          <BarChart
            {...config}
            series={[
              { dataKey: 'v1', id: 's1' },
              { dataKey: 'v2', id: 's2' },
            ]}
            xAxis={[{ dataKey: 'x' }]}
            onItemClick={onItemClick}
          />
        </div>,
      );

      const rectangles = document.querySelectorAll<HTMLElement>('rect.MuiBarElement-root');

      await user.click(rectangles[0]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'bar',
        seriesId: 's1',
        dataIndex: 0,
      });

      await user.click(rectangles[1]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'bar',
        seriesId: 's1',
        dataIndex: 1,
      });

      await user.click(rectangles[2]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'bar',
        seriesId: 's2',
        dataIndex: 0,
      });
    });
  });
});
