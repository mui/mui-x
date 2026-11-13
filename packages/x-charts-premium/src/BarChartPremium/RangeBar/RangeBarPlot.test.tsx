import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, it, expect, vi } from 'vitest';
import { barClasses } from '@mui/x-charts/BarChart';
import type { BarLabelProps } from '@mui/x-charts/BarChart';
import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import { ChartsContainerPremium } from '@mui/x-charts-premium/ChartsContainerPremium';
import { rangeBarClasses } from './useUtilityClasses';
import { RangeBarPlot } from './RangeBarPlot';

const LABEL_OFFSET = 4;

function getBarRect(container: HTMLElement, index: number) {
  const bar = container.querySelectorAll(`.${barClasses.element}`)[index];
  return {
    x: Number(bar.getAttribute('x')),
    y: Number(bar.getAttribute('y')),
    width: Number(bar.getAttribute('width')),
    height: Number(bar.getAttribute('height')),
  };
}

function GeometryLabel(props: BarLabelProps) {
  const { x, y, width, height, children } = props;
  return (
    <text data-x={x} data-y={y} data-width={width} data-height={height}>
      {children}
    </text>
  );
}

function getLabelGeometry(container: HTMLElement, index: number) {
  const label = container.querySelectorAll('text[data-x]')[index];
  return {
    x: Number(label.getAttribute('data-x')),
    y: Number(label.getAttribute('data-y')),
    width: Number(label.getAttribute('data-width')),
    height: Number(label.getAttribute('data-height')),
  };
}

const config = {
  width: 200,
  height: 200,
  skipAnimation: true,
  xAxis: [{ scaleType: 'band' as const, data: ['A', 'B'] }],
  yAxis: [{ min: 0, max: 10 }],
  hideLegend: true,
};

describe('RangeBarPlot - labels', () => {
  const { render } = createRenderer();

  it('should not render labels when `barLabel` is not set', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        series={[
          {
            type: 'rangeBar',
            data: [
              [1, 4],
              [2, 5],
            ],
          },
        ]}
      />,
    );

    expect(container.querySelectorAll(`.${barClasses.label}`)).to.have.length(0);
  });

  it('should render the range when `barLabel` is "value"', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        series={[
          {
            type: 'rangeBar',
            barLabel: 'value',
            data: [[1, 4], null],
          },
        ]}
      />,
    );

    expect(screen.getByText('1 – 4')).toBeVisible();
    expect(container.querySelectorAll(`.${rangeBarClasses.seriesLabels}`)).to.have.length(1);
    // The `null` value has no bar, hence no label.
    expect(container.querySelectorAll(`.${barClasses.label}`)).to.have.length(1);
  });

  it('should call `barLabel` with the item and the bar dimensions', () => {
    const barLabel = vi.fn(() => 'custom label');

    const { container } = render(
      <BarChartPremium
        {...config}
        series={[{ type: 'rangeBar', id: 's1', barLabel, data: [[2, 6]] }]}
      />,
    );

    const bar = getBarRect(container, 0);

    expect(screen.getByText('custom label')).toBeVisible();
    expect(barLabel.mock.lastCall).to.deep.equal([
      { seriesId: 's1', dataIndex: 0, value: [2, 6] },
      { bar: { width: bar.width, height: bar.height } },
    ]);
  });

  it('should not render a label when `barLabel` returns null', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        series={[
          {
            type: 'rangeBar',
            barLabel: (item) => (item.dataIndex === 0 ? null : 'shown'),
            data: [
              [1, 4],
              [2, 5],
            ],
          },
        ]}
      />,
    );

    expect(container.querySelectorAll(`.${barClasses.label}`)).to.have.length(1);
    expect(screen.getByText('shown')).toBeVisible();
  });

  it('should place the label at the center of the bar by default', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        series={[{ type: 'rangeBar', barLabel: 'value', data: [[2, 6]] }]}
      />,
    );

    const bar = getBarRect(container, 0);
    const label = screen.getByText('2 – 6');

    expect(Number(label.getAttribute('x'))).to.equal(bar.x + bar.width / 2);
    expect(Number(label.getAttribute('y'))).to.equal(bar.y + bar.height / 2);
  });

  it('should place the label after the end of the range with `barLabelPlacement="outside"`', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        series={[
          {
            type: 'rangeBar',
            barLabel: 'value',
            barLabelPlacement: 'outside',
            data: [
              [2, 6],
              [6, 2],
            ],
          },
        ]}
      />,
    );

    // The end is above the start: the label is placed above the top edge.
    const increasingBar = getBarRect(container, 0);
    const increasingLabel = screen.getByText('2 – 6');
    expect(Number(increasingLabel.getAttribute('y'))).to.equal(increasingBar.y - LABEL_OFFSET);
    expect(increasingLabel.getAttribute('dominant-baseline')).to.equal('auto');

    // The end is below the start: the label is placed below the bottom edge.
    const decreasingBar = getBarRect(container, 1);
    const decreasingLabel = screen.getByText('6 – 2');
    expect(Number(decreasingLabel.getAttribute('y'))).to.equal(
      decreasingBar.y + decreasingBar.height + LABEL_OFFSET,
    );
    expect(decreasingLabel.getAttribute('dominant-baseline')).to.equal('hanging');
  });

  it('should place the label after the end of the range for horizontal layout', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        xAxis={[{ min: 0, max: 10 }]}
        yAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
        series={[
          {
            type: 'rangeBar',
            layout: 'horizontal',
            barLabel: 'value',
            barLabelPlacement: 'outside',
            data: [
              [2, 6],
              [6, 2],
            ],
          },
        ]}
      />,
    );

    // The end is to the right of the start: the label is placed after the right edge.
    const increasingBar = getBarRect(container, 0);
    const increasingLabel = screen.getByText('2 – 6');
    expect(Number(increasingLabel.getAttribute('x'))).to.equal(
      increasingBar.x + increasingBar.width + LABEL_OFFSET,
    );
    expect(increasingLabel.getAttribute('text-anchor')).to.equal('start');

    // The end is to the left of the start: the label is placed before the left edge.
    const decreasingBar = getBarRect(container, 1);
    const decreasingLabel = screen.getByText('6 – 2');
    expect(Number(decreasingLabel.getAttribute('x'))).to.equal(decreasingBar.x - LABEL_OFFSET);
    expect(decreasingLabel.getAttribute('text-anchor')).to.equal('end');
  });

  it('should pass the half of the bar that contains the end to a custom `barLabel` slot with `outside` placement', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        series={[
          {
            type: 'rangeBar',
            barLabel: 'value',
            barLabelPlacement: 'outside',
            data: [
              [2, 6],
              [6, 2],
            ],
          },
        ]}
        slots={{ barLabel: GeometryLabel }}
      />,
    );

    const increasingBar = getBarRect(container, 0);
    expect(getLabelGeometry(container, 0)).to.deep.equal({
      ...increasingBar,
      height: increasingBar.height / 2,
    });

    const decreasingBar = getBarRect(container, 1);
    expect(getLabelGeometry(container, 1)).to.deep.equal({
      ...decreasingBar,
      y: decreasingBar.y + decreasingBar.height / 2,
      height: decreasingBar.height / 2,
    });
  });

  it('should pass the half of the bar that contains the end to a custom `barLabel` slot with `outside` placement for horizontal layout', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        xAxis={[{ min: 0, max: 10 }]}
        yAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
        series={[
          {
            type: 'rangeBar',
            layout: 'horizontal',
            barLabel: 'value',
            barLabelPlacement: 'outside',
            data: [
              [2, 6],
              [6, 2],
            ],
          },
        ]}
        slots={{ barLabel: GeometryLabel }}
      />,
    );

    const increasingBar = getBarRect(container, 0);
    expect(getLabelGeometry(container, 0)).to.deep.equal({
      ...increasingBar,
      x: increasingBar.x + increasingBar.width / 2,
      width: increasingBar.width / 2,
    });

    const decreasingBar = getBarRect(container, 1);
    expect(getLabelGeometry(container, 1)).to.deep.equal({
      ...decreasingBar,
      width: decreasingBar.width / 2,
    });
  });

  it('should highlight and fade labels based on the range bar highlight state', () => {
    render(
      <ChartsContainerPremium
        width={200}
        height={200}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[{ min: 0, max: 10 }]}
        highlightedItem={{ type: 'rangeBar', seriesId: 'a', dataIndex: 0 }}
        series={[
          {
            type: 'rangeBar',
            id: 'a',
            barLabel: () => 'label a',
            highlightScope: { highlight: 'item', fade: 'global' },
            data: [[1, 4]],
          },
          {
            type: 'rangeBar',
            id: 'b',
            barLabel: () => 'label b',
            highlightScope: { highlight: 'item', fade: 'global' },
            data: [[2, 5]],
          },
        ]}
      >
        <RangeBarPlot skipAnimation />
      </ChartsContainerPremium>,
    );

    expect(screen.getByText('label a').getAttribute('data-highlighted')).to.equal('true');
    expect(screen.getByText('label a').getAttribute('data-faded')).to.equal(null);
    expect(screen.getByText('label b').getAttribute('data-faded')).to.equal('true');
  });

  it('should forward `slotProps.barLabel` to the label', () => {
    const { container } = render(
      <BarChartPremium
        {...config}
        series={[{ type: 'rangeBar', barLabel: 'value', data: [[1, 4]] }]}
        slotProps={{ barLabel: { fill: 'red' } }}
      />,
    );

    const label = container.querySelector(`.${barClasses.label}`)!;
    expect(label.textContent).to.equal('1 – 4');
    expect(label.getAttribute('fill')).to.equal('red');
  });
});
