import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import {
  chartsRadialGridClasses,
  ChartsRadialGrid,
  type ChartsRadialGridProps,
} from '@mui/x-charts/ChartsRadialGrid';
import { Unstable_ChartsRadialDataProvider } from '../ChartsRadialDataProvider';
import type { RadiusAxis, RotationAxis } from '../models';

describe('<ChartsRadialGrid />', () => {
  const { render } = createRenderer();

  it('should apply className to root element', () => {
    const { container } = testRadialGrid(render, { radialGrid: { className: 'custom-grid' } });

    const root = container.querySelector(`.${chartsRadialGridClasses.root}.custom-grid`);
    expect(root).not.to.equal(null);
  });

  it('should not render rotation lines when rotation prop is not set', () => {
    const { getRadiusLinesCount, getRotationLinesCount } = testRadialGrid(render, {
      radialGrid: { radius: true },
    });

    expect(getRotationLinesCount()).to.equal(0);
    expect(getRadiusLinesCount()).to.be.greaterThan(0);
  });

  it('should not render radius lines when radius prop is not set', () => {
    const { getRadiusLinesCount, getRotationLinesCount } = testRadialGrid(render, {
      radialGrid: { rotation: true },
    });

    expect(getRotationLinesCount()).to.be.greaterThan(0);
    expect(getRadiusLinesCount()).to.equal(0);
  });

  it('should use the rotation axis tickNumber to control the number of rotation lines', () => {
    const { getRotationLinesCount } = testRadialGrid(render, {
      radialGrid: { rotation: true },
      rotationAxis: { tickNumber: 10 },
    });

    expect(getRotationLinesCount()).to.equal(10);
  });

  it('should use the radius axis tickNumber to control the number of radius lines', () => {
    const { getRadiusLinesCount } = testRadialGrid(render, {
      radialGrid: { radius: true },
      radiusAxis: { tickNumber: 10 },
    });

    expect(getRadiusLinesCount()).to.equal(10);
  });
});

/**
 * Helper function to test the radial grid with different props and return useful queries.
 */
function testRadialGrid(
  render: ReturnType<typeof createRenderer>['render'],
  props: Partial<{
    radialGrid: Partial<ChartsRadialGridProps>;
    rotationAxis: Partial<RotationAxis>;
    radiusAxis: Partial<RadiusAxis>;
  }>,
) {
  const { container } = render(
    <Unstable_ChartsRadialDataProvider
      width={400}
      height={300}
      rotationAxis={[{ min: 0, max: 200, ...props.rotationAxis }]}
      radiusAxis={[{ min: 0, max: 100, ...props.radiusAxis }]}
    >
      <svg>
        <ChartsRadialGrid {...props.radialGrid} />
      </svg>
    </Unstable_ChartsRadialDataProvider>,
  );

  const getRadiusLinesCount = () =>
    container.querySelectorAll(`.${chartsRadialGridClasses.radiusLine}`).length;
  const getRotationLinesCount = () =>
    container.querySelectorAll(`.${chartsRadialGridClasses.rotationLine}`).length;

  return { container, getRadiusLinesCount, getRotationLinesCount };
}
