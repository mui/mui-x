import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { HeatmapPlot, heatmapClasses } from '@mui/x-charts-pro/Heatmap';
import { Heatmap } from './Heatmap';

describe('<HeatmapPlot />', () => {
  const { render } = createRenderer();

  it('should apply className to root element', () => {
    const { container } = render(
      <Heatmap
        series={[
          {
            data: [
              [0, 0, 10],
              [1, 0, 20],
            ],
          },
        ]}
        xAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
        yAxis={[{ scaleType: 'band', data: ['X'] }]}
        width={200}
        height={200}
      >
        <HeatmapPlot className="custom-heatmap" />
      </Heatmap>,
    );

    const root = container.querySelector(`.${heatmapClasses.root}.custom-heatmap`);
    expect(root).not.to.equal(null);
  });
});
