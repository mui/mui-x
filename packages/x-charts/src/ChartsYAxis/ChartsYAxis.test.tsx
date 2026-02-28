import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { screen } from '@mui/internal-test-utils';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { isJSDOM } from 'test/utils/skipIf';

describe('<ChartsYAxis />', () => {
  const { render } = createRenderer();

  const defaultProps = {
    width: 400,
    height: 300,
    series: [{ type: 'line', data: [1, 2, 3, 4, 5] }],
    yAxis: [{ id: 'test-y-axis', label: 'Downloads', data: [1, 2, 3, 4, 5] }],
  } as const;

  it.skipIf(!isJSDOM)('should not crash when axisId is invalid', () => {
    const expectedError =
      'MUI X Charts: No axis found. The axisId "invalid-axis-id" is probably invalid.';

    expect(() =>
      render(
        <ChartsContainer {...defaultProps}>
          <ChartsYAxis axisId="invalid-axis-id" />
        </ChartsContainer>,
      ),
    ).toWarnDev(expectedError);
  });

  it('should render with valid axisId', () => {
    render(
      <ChartsContainer {...defaultProps}>
        <ChartsYAxis axisId="test-y-axis" />
      </ChartsContainer>,
    );

    expect(screen.getByText('Downloads')).toBeTruthy();
  });
});
