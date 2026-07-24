import { createRenderer } from '@mui/internal-test-utils';
import { RadarChart } from '@mui/x-charts/RadarChart';

describe('<RadarChart /> - experimentalFeatures', () => {
  const { render } = createRenderer();

  it('should not forward experimentalFeatures to the DOM', async () => {
    const { container } = render(
      <RadarChart
        height={100}
        width={100}
        series={[{ id: 'A', data: [1, 2, 3] }]}
        radar={{ metrics: ['M1', 'M2', 'M3'] }}
        experimentalFeatures={{}}
      />,
    );

    expect(container.querySelector('[experimentalfeatures]')).to.equal(null);
  });
});
