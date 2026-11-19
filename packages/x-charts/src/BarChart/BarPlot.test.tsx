import { screen, createRenderer } from '@mui/internal-test-utils';
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { ChartsContainer } from '../ChartsContainer';
import { BarPlot } from './BarPlot';
import { barClasses } from './barClasses';

describe('BarPlot', () => {
  const { render } = createRenderer();

  it('series `barLabel` prop works', () => {
    render(
      <ChartsContainer
        series={[{ type: 'bar', data: [1], barLabel: () => 'Bar label from prop' }]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[]}
      >
        <BarPlot />
      </ChartsContainer>,
    );

    expect(screen.getByText('Bar label from prop')).toBeVisible();
  });

  it('should render the value when `barLabel` is "value", except for 0', () => {
    const { container } = render(
      <ChartsContainer
        series={[{ type: 'bar', data: [4, 0], barLabel: 'value' }]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
        yAxis={[{ min: 0, max: 10 }]}
      >
        <BarPlot skipAnimation />
      </ChartsContainer>,
    );

    const labels = container.querySelectorAll(`.${barClasses.label}`);
    expect(labels).to.have.length(1);
    expect(labels[0].textContent).to.equal('4');
  });

  it('should call `barLabel` with the item and the bar dimensions', () => {
    const barLabel = vi.fn(() => 'custom label');

    const { container } = render(
      <ChartsContainer
        series={[{ type: 'bar', id: 's1', data: [4], barLabel }]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[{ min: 0, max: 10 }]}
      >
        <BarPlot skipAnimation />
      </ChartsContainer>,
    );

    const bar = container.querySelector(`.${barClasses.element}`)!;

    expect(screen.getByText('custom label')).toBeVisible();
    expect(barLabel.mock.lastCall).to.deep.equal([
      { seriesId: 's1', dataIndex: 0, value: 4 },
      {
        bar: {
          width: Number(bar.getAttribute('width')),
          height: Number(bar.getAttribute('height')),
        },
      },
    ]);
  });

  it('should highlight and fade labels based on the bar highlight state', () => {
    render(
      <ChartsContainer
        series={[
          {
            type: 'bar',
            id: 'a',
            data: [1],
            barLabel: () => 'label a',
            highlightScope: { highlight: 'item', fade: 'global' },
          },
          {
            type: 'bar',
            id: 'b',
            data: [2],
            barLabel: () => 'label b',
            highlightScope: { highlight: 'item', fade: 'global' },
          },
        ]}
        highlightedItem={{ type: 'bar', seriesId: 'a', dataIndex: 0 }}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[{ min: 0, max: 10 }]}
      >
        <BarPlot skipAnimation />
      </ChartsContainer>,
    );

    expect(screen.getByText('label a').getAttribute('data-highlighted')).to.equal('true');
    expect(screen.getByText('label a').getAttribute('data-faded')).to.equal(null);
    expect(screen.getByText('label b').getAttribute('data-faded')).to.equal('true');
  });

  it('should apply className to root element', () => {
    const { container } = render(
      <ChartsContainer
        series={[{ type: 'bar', data: [1] }]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
      >
        <BarPlot className="custom-bar-plot" />
      </ChartsContainer>,
    );

    const root = container.querySelector(`.${barClasses.root}.custom-bar-plot`);
    expect(root).not.to.equal(null);
  });
});
