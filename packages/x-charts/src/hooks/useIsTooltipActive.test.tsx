import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { useIsTooltipActive, useIsAnyTooltipActive } from './useIsTooltipActive';
import { BarChart, barElementClasses } from '../BarChart';

const barChartProps = {
  series: [
    {
      data: [10, 20, 30, 40],
    },
  ],
  xAxis: [
    {
      data: ['A', 'B', 'C', 'D'],
      position: 'none' as const,
    },
  ],
  yAxis: [{ position: 'none' as const }],
  width: 100,
  height: 100,
  margin: 0,
} as const;

const options = {
  wrapper: ({ children }: { children?: React.ReactNode }) => (
    <div style={{ width: 100, height: 100 }}>{children}</div>
  ),
};

function TooltipActiveCheck() {
  const isAnyTooltipActive = useIsAnyTooltipActive();
  const isAxisTooltipActive = useIsTooltipActive('axis');
  const isItemTooltipActive = useIsTooltipActive('item');
  return (
    <React.Fragment>
      <div data-testid="any-tooltip-active">{String(isAnyTooltipActive)}</div>
      <div data-testid="axis-tooltip-active">{String(isAxisTooltipActive)}</div>
      <div data-testid="item-tooltip-active">{String(isItemTooltipActive)}</div>
    </React.Fragment>
  );
}

describe('useIsTooltipActive', () => {
  const { render } = createRenderer();

  it('should track tooltip visibility', async () => {
    const { user, container } = render(
      <BarChart {...barChartProps} slotProps={{ tooltip: { trigger: 'none' } }}>
        <TooltipActiveCheck />
      </BarChart>,
      options,
    );

    // eslint-disable-next-line testing-library/no-container
    const bar = container.querySelector(`.${barElementClasses.root}`)!;

    await user.pointer([
      {
        target: bar,
        coords: { x: 15, y: 50 },
      },
    ]);

    expect(screen.getByTestId('any-tooltip-active')).to.have.text('false');
    expect(screen.getByTestId('axis-tooltip-active')).to.have.text('false');
    expect(screen.getByTestId('item-tooltip-active')).to.have.text('false');
  });
});
