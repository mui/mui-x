import { createRenderer } from '@mui/internal-test-utils/createRenderer';
import { screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { describe, it, expect } from 'vitest';

describe('<ChartsYAxis />', () => {
  const { render } = createRenderer();

  const defaultProps = {
    width: 400,
    height: 300,
    series: [{ type: 'line', data: [1, 2, 3, 4, 5] }],
    yAxis: [{ id: 'test-y-axis', label: 'Downloads', data: [1, 2, 3, 4, 5] }],
  } as const;

  it('should not crash when axisId is invalid', () => {
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

  /* Text measurement always returns 0 in JSDOM, so labels are never shortened there. */
  describe.skipIf(isJSDOM)('tick label shortening', () => {
    const shorteningProps = {
      width: 400,
      height: 160,
      margin: { top: 10, bottom: 10 },
      series: [{ type: 'line', data: [0, 40] }],
      yAxis: [
        {
          id: 'test-y-axis',
          width: 52,
          min: 0,
          max: 40,
          valueFormatter: (value: number) => `${value} °C`,
        },
      ],
    } as const;

    it('does not shorten the top tick label when it fits the axis width', () => {
      const { container } = render(
        <ChartsContainer {...shorteningProps}>
          <ChartsYAxis axisId="test-y-axis" />
        </ChartsContainer>,
      );

      const labels = Array.from(
        container.querySelectorAll(`.${axisClasses.tickLabel}`),
        (label) => label.textContent,
      );

      expect(labels.length).to.be.greaterThan(0);
      expect(labels.every((label) => !label?.includes('…'))).to.equal(true);
      expect(labels).to.include('40 °C');
    });
  });

  it('should apply className to root element', () => {
    const { container } = render(
      <ChartsContainer {...defaultProps}>
        <ChartsYAxis className="custom-y-axis" />
      </ChartsContainer>,
    );

    const root = container.querySelector(`.${axisClasses.root}.custom-y-axis`);
    expect(root).not.to.equal(null);
  });
});
