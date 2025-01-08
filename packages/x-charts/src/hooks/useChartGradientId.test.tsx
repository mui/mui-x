import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { useChartGradientId, useChartGradientIdObjectBound } from './useChartGradientId';
import { ChartDataProvider } from '../context';

function UseGradientId() {
  const id = useChartGradientId('test-id', 'x');
  return <div>{id}</div>;
}

function UseGradientIdObjectBound() {
  const id = useChartGradientIdObjectBound('test-id', 'z');
  return <div>{id}</div>;
}

describe('useChartGradientId', () => {
  const { render } = createRenderer();

  it('should properly generate a correct id', () => {
    render(
      <ChartDataProvider series={[]} height={100} width={100}>
        <UseGradientId />
      </ChartDataProvider>,
    );

    expect(screen.getByText(/:\w+:-gradient-x-test-id/)).toBeVisible();
  });

  describe('useChartGradientIdObjectBound', () => {
    it('should properly generate a correct id', () => {
      render(
        <ChartDataProvider series={[]} height={100} width={100}>
          <UseGradientIdObjectBound />
        </ChartDataProvider>,
      );

      expect(screen.getByText(/:\w+:-gradient-z-test-id-object-bound/)).toBeVisible();
    });
  });
});
