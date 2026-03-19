import { screen, createRenderer } from '@mui/internal-test-utils';
import * as React from 'react';
import { ChartsContainer } from '../ChartsContainer';
import { BarPlot } from './BarPlot';

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
});
