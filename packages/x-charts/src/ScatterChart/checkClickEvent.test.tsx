import { createRenderer } from '@mui/internal-test-utils';
import { vi } from 'vitest';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { isJSDOM } from 'test/utils/skipIf';
import { CHART_SELECTOR } from '../tests/constants';

const config = {
  dataset: [
    { id: 1, x: 0, y: 10 },
    { id: 2, x: 10, y: 10 },
    { id: 3, x: 10, y: 0 },
    { id: 4, x: 0, y: 0 },
    { id: 5, x: 5, y: 5 },
  ],
  margin: { top: 0, left: 0, bottom: 0, right: 0 },
  xAxis: [{ position: 'none' }],
  yAxis: [{ position: 'none' }],
  width: 100,
  height: 100,
} as const;

// Plot on series as a dice 5
//
// 1...2
// .....
// ..5..
// .....
// 4...3

describe('ScatterChart - click event', () => {
  const { render } = createRenderer();

  // svg.createSVGPoint not supported by JSDom https://github.com/jsdom/jsdom/issues/300
  describe.skipIf(isJSDOM)('onItemClick - using voronoi', () => {
    it('should provide the right context as second argument when clicking svg', async () => {
      const onItemClick = vi.fn();
      const { user } = render(
        <div
          style={{
            width: 100,
            height: 100,
          }}
        >
          <ScatterChart
            {...config}
            series={[{ id: 's1', data: config.dataset }]}
            onItemClick={onItemClick}
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 10, clientY: 10 },
        },
      ]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'scatter',
        dataIndex: 0,
        seriesId: 's1',
      });

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 30, clientY: 30 },
        },
      ]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'scatter',
        dataIndex: 4,
        seriesId: 's1',
      });

      expect(onItemClick.mock.calls.length).to.equal(2);
    });

    it('should provide the right context as second argument when clicking mark', async () => {
      const onItemClick = vi.fn();
      const { user } = render(
        <div
          style={{
            width: 100,
            height: 100,
          }}
        >
          <ScatterChart
            {...config}
            series={[{ id: 's1', data: config.dataset }]}
            onItemClick={onItemClick}
          />
        </div>,
      );
      const marks = document.querySelectorAll<HTMLElement>('circle');

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: marks[1],
          coords: {
            clientX: 99,
            clientY: 2,
          },
        },
      ]);
      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'scatter',
        dataIndex: 1,
        seriesId: 's1',
      });
      expect(onItemClick.mock.calls.length).to.equal(1); // Make sure voronoi + item click does not duplicate event triggering
    });
  });

  describe('onItemClick - disabling voronoi', () => {
    it('should not call onItemClick when clicking the SVG', async () => {
      const onItemClick = vi.fn();
      const { user } = render(
        <div
          style={{
            width: 100,
            height: 100,
          }}
        >
          <ScatterChart
            {...config}
            series={[{ id: 's1', data: config.dataset }]}
            onItemClick={onItemClick}
            disableVoronoi
          />
        </div>,
      );
      const svg = document.querySelector<HTMLElement>(CHART_SELECTOR)!;

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: svg,
          coords: { clientX: 10, clientY: 10 },
        },
      ]);
      expect(onItemClick.mock.calls.length).to.equal(0);
    });

    it('should provide the right context as second argument when clicking mark', async () => {
      const onItemClick = vi.fn();
      const { user } = render(
        <div
          style={{
            width: 100,
            height: 100,
          }}
        >
          <ScatterChart
            {...config}
            series={[{ id: 's1', data: config.dataset }]}
            onItemClick={onItemClick}
            disableVoronoi
          />
        </div>,
      );
      const marks = document.querySelectorAll<HTMLElement>('circle');

      await user.pointer([
        {
          keys: '[MouseLeft]',
          target: marks[1],
          coords: {
            clientX: 99,
            clientY: 2,
          },
        },
      ]);

      expect(onItemClick.mock.lastCall?.[1]).to.deep.equal({
        type: 'scatter',
        dataIndex: 1,
        seriesId: 's1',
      });
      expect(onItemClick.mock.calls.length).to.equal(1); // Make sure voronoi + item click does not duplicate event triggering
    });
  });
});
