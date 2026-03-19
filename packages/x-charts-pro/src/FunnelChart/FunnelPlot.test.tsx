import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { FunnelPlot, funnelClasses, FunnelChart } from '@mui/x-charts-pro/FunnelChart';

describe('<FunnelPlot />', () => {
  const { render } = createRenderer();

  it('should apply className to root element', () => {
    const { container } = render(
      <FunnelChart series={[{ data: [{ value: 200 }, { value: 100 }] }]} width={200} height={200}>
        <FunnelPlot className="custom-funnel" />
      </FunnelChart>,
    );

    const root = container.querySelector(`.${funnelClasses.root}.custom-funnel`);
    expect(root).not.to.equal(null);
  });
});
