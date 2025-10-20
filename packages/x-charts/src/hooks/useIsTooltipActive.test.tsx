import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { BarChart } from '../BarChart';
import { useIsTooltipActive } from './useIsTooltipActive';

const barChartProps = {
  series: [
    {
      data: [10, 20, 30, 40],
    },
  ],
  xAxis: [
    {
      data: ['A', 'B', 'C', 'D'],
      zoom: true,
      position: 'none' as const,
    },
  ],
  yAxis: [{ position: 'none' as const }],
  width: 100,
  height: 130,
  margin: 0,
  slotProps: { tooltip: { trigger: 'none' as const } },
  brushConfig: {
    enabled: true,
    preventTooltip: true,
  },
} as const;

function TooltipActiveCheck() {
  const isTooltipActive = useIsTooltipActive();
  return <div data-testid="tooltip-active">{String(isTooltipActive)}</div>;
}

describe('useIsTooltipActive', () => {
  const { render } = createRenderer();

  it('should return true when brush is not active', async () => {
    const { getByTestId } = render(
      <BarChart {...barChartProps}>
        <TooltipActiveCheck />
      </BarChart>,
    );

    expect(getByTestId('tooltip-active')).to.have.text('true');
  });

  it.skipIf(isJSDOM)(
    'should return false when brush is active and preventTooltip is true',
    async () => {
      const { container, getByTestId, user } = render(
        <BarChart {...barChartProps}>
          <TooltipActiveCheck />
        </BarChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const svg = container.querySelector('svg')!;

      // Initiate brush by clicking and dragging
      await user.pointer([
        {
          keys: `[MouseLeft>]`,
          target: svg,
          coords: { clientX: 30, clientY: 30 },
        },
        {
          target: svg,
          coords: { clientX: 50, clientY: 30 },
        },
      ]);

      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(getByTestId('tooltip-active')).to.have.text('false');
    },
  );

  it.skipIf(isJSDOM)(
    'should return true when brush is active but preventTooltip is false',
    async () => {
      const { container, getByTestId, user } = render(
        <BarChart
          {...barChartProps}
          brushConfig={{
            enabled: true,
            preventTooltip: false,
          }}
        >
          <TooltipActiveCheck />
        </BarChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const svg = container.querySelector('svg')!;

      // Initiate brush by clicking and dragging
      await user.pointer([
        {
          keys: `[MouseLeft>]`,
          target: svg,
          coords: { clientX: 30, clientY: 30 },
        },
        {
          target: svg,
          coords: { clientX: 50, clientY: 30 },
        },
      ]);

      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(getByTestId('tooltip-active')).to.have.text('true');
    },
  );
});
