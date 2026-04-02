import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { screen } from '@mui/internal-test-utils';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';

describe('<ChartsXAxis />', () => {
  const { render } = createRenderer();

  const defaultProps = {
    width: 400,
    height: 300,
    series: [{ type: 'line', data: [1, 2, 3, 4, 5] }],
    xAxis: [{ scaleType: 'linear', id: 'test-x-axis', label: 'Downloads', data: [1, 2, 3, 4, 5] }],
  } as const;

  it('should not crash when axisId is invalid', () => {
    const expectedError =
      'MUI X Charts: No axis found. The axisId "invalid-axis-id" is probably invalid.';

    expect(() =>
      render(
        <ChartsContainer {...defaultProps}>
          <ChartsXAxis axisId="invalid-axis-id" />
        </ChartsContainer>,
      ),
    ).toWarnDev(expectedError);
  });

  it('should render with valid axisId', () => {
    render(
      <ChartsContainer {...defaultProps}>
        <ChartsXAxis axisId="test-x-axis" />
      </ChartsContainer>,
    );

    expect(screen.getByText('Downloads')).toBeTruthy();
  });

  it('should apply className to root element', () => {
    const { container } = render(
      <ChartsContainer {...defaultProps}>
        <ChartsXAxis className="custom-x-axis" />
      </ChartsContainer>,
    );

    const root = container.querySelector(`.${axisClasses.root}.custom-x-axis`);
    expect(root).not.to.equal(null);
  });
});
