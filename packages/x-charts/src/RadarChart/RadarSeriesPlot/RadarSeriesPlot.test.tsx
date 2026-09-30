import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { vi, describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { getCenter } from 'test/utils/charts/getCenter';
import { RadarChart, RadarSeriesPlot, radarClasses } from '@mui/x-charts/RadarChart';

describe('<RadarSeriesPlot />', () => {
  const { render } = createRenderer();

  it('should apply className to root element', () => {
    const { container } = render(
      <RadarChart
        series={[{ data: [10, 15, 20] }]}
        width={100}
        height={100}
        radar={{ metrics: ['A', 'B', 'C'] }}
      >
        <RadarSeriesPlot className="custom-radar-series" />
      </RadarChart>,
    );

    const root = container.querySelector(`.${radarClasses.seriesRoot}.custom-radar-series`);
    expect(root).not.to.equal(null);
  });

  // The interaction props now carry a click handler for the keyboard focus. It must be merged
  // with the consumer callback, not replace it.
  it.skipIf(isJSDOM)('should fire onAreaClick with the clicked rotation index', async () => {
    const onAreaClick = vi.fn();
    const { container, user } = render(
      <RadarChart
        series={[{ id: 'radar', data: [10, 15, 20, 25] }]}
        width={300}
        height={300}
        radar={{ metrics: ['A', 'B', 'C', 'D'] }}
      >
        <RadarSeriesPlot className="custom-radar-series" onAreaClick={onAreaClick} />
      </RadarChart>,
    );

    const plot = container.querySelector('.custom-radar-series')!;
    const area = plot.querySelector<SVGElement>(`.${radarClasses.seriesArea}`)!;
    const mark = plot.querySelectorAll<SVGElement>('circle')[2];

    await user.pointer([{ keys: '[MouseLeft]', target: area, coords: getCenter(mark) }]);

    expect(onAreaClick.mock.calls.length).to.equal(1);
    expect(onAreaClick.mock.lastCall?.[1]).to.deep.equal({
      type: 'radar',
      seriesId: 'radar',
      dataIndex: 2,
    });
  });
});
