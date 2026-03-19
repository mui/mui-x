import { screen, createRenderer } from '@mui/internal-test-utils';
import * as React from 'react';
import { ChartContainer } from '../ChartContainer';
import { BarPlot } from './BarPlot';

describe('BarPlot', () => {
  const { render } = createRenderer();

  it('series `barLabel` prop works', () => {
    render(
      <ChartContainer
        series={[{ type: 'bar', data: [1], barLabel: () => 'Bar label from prop' }]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[]}
      >
        <BarPlot />
      </ChartContainer>,
    );

    expect(screen.getByText('Bar label from prop')).toBeVisible();
  });
});
