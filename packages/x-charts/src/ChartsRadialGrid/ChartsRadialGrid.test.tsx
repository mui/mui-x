import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { ChartsRadialGrid, chartsRadialGridClasses } from '@mui/x-charts/ChartsRadialGrid';
import { Unstable_ChartsRadialDataProvider } from '../ChartsRadialDataProvider';

describe('<ChartsRadialGrid />', () => {
  const { render } = createRenderer();

  it('should apply className to root element', () => {
    const { container } = render(
      <Unstable_ChartsRadialDataProvider
        width={400}
        height={300}
        rotationAxis={[{ min: 0, max: 200 }]}
      >
        <ChartsRadialGrid className="custom-grid" rotation radius />
      </Unstable_ChartsRadialDataProvider>,
    );

    const root = container.querySelector(`.${chartsRadialGridClasses.root}.custom-grid`);
    expect(root).not.to.equal(null);
  });
});
