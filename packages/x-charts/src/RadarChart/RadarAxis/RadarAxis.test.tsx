import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { RadarChart, RadarAxis, radarClasses } from '@mui/x-charts/RadarChart';

describe('<RadarAxis />', () => {
  const { render } = createRenderer();

  it('should apply className to root element', () => {
    const { container } = render(
      <RadarChart
        series={[{ data: [10, 15, 20] }]}
        width={100}
        height={100}
        radar={{ metrics: ['A', 'B', 'C'] }}
      >
        <RadarAxis metric="A" className="custom-radar-axis" />
      </RadarChart>,
    );

    const root = container.querySelector(`.${radarClasses.axisRoot}.custom-radar-axis`);
    expect(root).not.to.equal(null);
  });
});
