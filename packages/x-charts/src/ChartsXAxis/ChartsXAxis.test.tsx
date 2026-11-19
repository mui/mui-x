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
    ) =>
      render(
        <BarChart
          width={250}
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

    const getLabelRects = (container: HTMLElement, groupIndex: number) =>
      Array.from(
        container.querySelectorAll(`[data-group-index="${groupIndex}"] .${axisClasses.tickLabel}`),
        (label) => label.getBoundingClientRect(),
      ).sort((a, b) => a.left - b.left);

    it('should hide overlapping labels per group level', () => {
      const { container } = renderGroupedChart();

      const monthRects = getLabelRects(container, 0);
      expect(monthRects.length).to.be.greaterThan(0);
      expect(monthRects.length).to.be.lessThan(data.length);
      monthRects.slice(1).forEach((rect, index) => {
        expect(rect.left).to.be.greaterThanOrEqual(monthRects[index].right);
      });

      expect(getLabelRects(container, 1).length).to.equal(2);
    });

    it('should measure each level with its own tickLabelStyle', () => {
      const defaultCount = getLabelRects(renderGroupedChart().container, 0).length;
      const largeCount = getLabelRects(
        renderGroupedChart({}, { tickLabelStyle: { fontSize: 24 } }).container,
        0,
      ).length;

      expect(largeCount).to.be.lessThan(defaultCount);
    });

    it('should show every label with tickLabelInterval: () => true', () => {
      const { container } = renderGroupedChart({ tickLabelInterval: () => true });

      expect(getLabelRects(container, 0).length).to.equal(data.length);
      expect(getLabelRects(container, 1).length).to.equal(2);
    });
  });
});
