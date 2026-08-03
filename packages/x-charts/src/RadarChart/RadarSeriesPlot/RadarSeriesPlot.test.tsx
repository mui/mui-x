import { createRenderer } from '@mui/internal-test-utils/createRenderer';
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
});
