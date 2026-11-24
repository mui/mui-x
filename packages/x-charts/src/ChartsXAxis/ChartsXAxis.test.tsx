import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { screen } from '@mui/internal-test-utils';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarChart } from '@mui/x-charts/BarChart';
import { isJSDOM } from 'test/utils/skipIf';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { describe, it, expect } from 'vitest';
import type { AxisGroup, XAxis } from '../models/axis';

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

  // https://github.com/mui/mui-x/issues/23697
  it('should not warn when the theme typography has responsive styles', () => {
    const baseTheme = createTheme();
    const theme = createTheme(baseTheme, {
      typography: {
        caption: { [baseTheme.breakpoints.up('md')]: { fontSize: '0.875rem' } },
        body1: { [baseTheme.breakpoints.up('md')]: { fontSize: '1.125rem' } },
      },
    });

    expect(() =>
      render(
        <ThemeProvider theme={theme}>
          <ChartsContainer {...defaultProps}>
            <ChartsXAxis />
          </ChartsContainer>
        </ThemeProvider>,
      ),
    ).not.toErrorDev();
  });

  // https://github.com/mui/mui-x/issues/19452
  describe.skipIf(isJSDOM)('grouped axis tick labels', () => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const data = Array.from({ length: 24 }, (_, index) => index);

    const renderGroupedChart = (
      xAxis: Partial<XAxis<'band'>> = {},
      monthGroup: Partial<AxisGroup> = {},
      width = 250,
    ) =>
      render(
        <BarChart
          width={width}
          height={150}
          series={[{ data: data.map(() => 1) }]}
          xAxis={[
            {
              scaleType: 'band',
              data,
              groups: [
                { getValue: (index: number) => months[index % 12], ...monthGroup },
                { getValue: (index: number) => 2020 + Math.floor(index / 12) },
              ],
              ...xAxis,
            },
          ]}
          hideLegend
        />,
      );

    const getLabels = (container: HTMLElement, groupIndex: number) =>
      Array.from(
        container.querySelectorAll(`[data-group-index="${groupIndex}"] .${axisClasses.tickLabel}`),
      ).sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    const getLabelRects = (container: HTMLElement, groupIndex: number) =>
      getLabels(container, groupIndex).map((label) => label.getBoundingClientRect());

    it('should show the middle label of each parent group when every label does not fit', () => {
      const { container } = renderGroupedChart();

      expect(getLabels(container, 0).map((label) => label.textContent)).to.deep.equal([
        'Jun',
        'Jun',
      ]);
      expect(getLabelRects(container, 1).length).to.equal(2);
    });

    it('should show every label of a level when they fit', () => {
      const { container } = renderGroupedChart({}, {}, 900);

      const monthRects = getLabelRects(container, 0);
      expect(monthRects.length).to.equal(data.length);
      monthRects.slice(1).forEach((rect, index) => {
        expect(rect.left).to.be.greaterThanOrEqual(monthRects[index].right);
      });
    });

    it('should measure each level with its own tickLabelStyle', () => {
      const { container } = renderGroupedChart({}, { tickLabelStyle: { fontSize: 80 } });

      expect(getLabelRects(container, 0).length).to.equal(0);
      expect(getLabelRects(container, 1).length).to.equal(2);
    });

    it('should show every label with tickLabelInterval: () => true', () => {
      const { container } = renderGroupedChart({ tickLabelInterval: () => true });

      expect(getLabelRects(container, 0).length).to.equal(data.length);
      expect(getLabelRects(container, 1).length).to.equal(2);
    });
  });
});
