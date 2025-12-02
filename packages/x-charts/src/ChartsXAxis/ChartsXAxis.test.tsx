import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { screen } from '@mui/internal-test-utils';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { isJSDOM } from 'test/utils/skipIf';

describe('<ChartsXAxis />', () => {
  const { render } = createRenderer();

  const defaultProps = {
    width: 400,
    height: 300,
    series: [{ type: 'line', data: [1, 2, 3, 4, 5] }],
    xAxis: [{ scaleType: 'linear', id: 'test-x-axis', label: 'Downloads', data: [1, 2, 3, 4, 5] }],
  } as const;

  it.skipIf(!isJSDOM)('should not crash when axisId is invalid', () => {
    const expectedError =
      'MUI X Charts: No axis found. The axisId "invalid-axis-id" is probably invalid.';

    expect(() =>
      render(
        <ChartContainer {...defaultProps}>
          <ChartsXAxis axisId="invalid-axis-id" />
        </ChartContainer>,
      ),
    ).toWarnDev(expectedError);
  });

  it('should render with valid axisId', () => {
    render(
      <ChartContainer {...defaultProps}>
        <ChartsXAxis axisId="test-x-axis" />
      </ChartContainer>,
    );

    expect(screen.getByText('Downloads')).toBeTruthy();
  });
});
