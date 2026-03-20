import { screen, createRenderer } from '@mui/internal-test-utils';
import * as React from 'react';
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
