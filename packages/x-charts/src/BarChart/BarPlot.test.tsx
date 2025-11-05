import { screen, createRenderer } from '@mui/internal-test-utils';
import * as React from 'react';
import { ChartContainer } from '../ChartContainer';
import { BarPlot } from './BarPlot';

describe('BarPlot', () => {
  const { render } = createRenderer();

  it('`barLabel` prop works', () => {
    render(
      <ChartContainer
        series={[{ type: 'bar', data: [1] }]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[]}
      >
        <BarPlot barLabel={() => 'Bar label from prop'} />
      </ChartContainer>,
    );

    expect(screen.getByText('Bar label from prop')).toBeVisible();
  });

  it('prioritizes `barLabel` from series over `barLabel` prop', () => {
    render(
      <ChartContainer
        series={[{ type: 'bar', data: [1], barLabel: () => 'Bar label from series' }]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[]}
      >
        <BarPlot barLabel={() => 'Bar label from prop'} />
      </ChartContainer>,
    );

    expect(screen.getByText('Bar label from series')).toBeVisible();
  });

  it("defaults to `barLabel` prop when `barLabel` from series isn't defined", () => {
    render(
      <ChartContainer
        series={[
          { type: 'bar', data: [1] },
          { type: 'bar', data: [1], barLabel: () => 'Bar label from 2nd series' },
        ]}
        width={100}
        height={100}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[]}
      >
        <BarPlot barLabel={() => 'Bar label from prop'} />
      </ChartContainer>,
    );

    expect(screen.getByText('Bar label from prop')).toBeVisible();
    expect(screen.getByText('Bar label from 2nd series')).toBeVisible();
  });
});
