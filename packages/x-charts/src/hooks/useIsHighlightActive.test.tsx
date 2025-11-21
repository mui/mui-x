import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { BarChart, barElementClasses } from '../BarChart';
import {
  useIsAnyAxisHighlightActive,
  useIsXAxisHighlightActive,
  useIsYAxisHighlightActive,
} from './useIsHighlightActive';

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
  slotProps: { tooltip: { trigger: 'none' as const } },
} as const;

const options = {
  wrapper: ({ children }: { children?: React.ReactNode }) => (
    <div style={{ width: 100, height: 100 }}>{children}</div>
  ),
};

function CombinedHighlightCheck() {
  const isHighlightActive = useIsAnyAxisHighlightActive();
  const isXHighlightActive = useIsXAxisHighlightActive();
  const isYHighlightActive = useIsYAxisHighlightActive();
  return (
    <div>
      <div data-testid="highlight-active">{String(isHighlightActive)}</div>
      <div data-testid="x-highlight-active">{String(isXHighlightActive)}</div>
      <div data-testid="y-highlight-active">{String(isYHighlightActive)}</div>
    </div>
  );
}

describe('useIsHighlightActive', () => {
  const { render } = createRenderer();

  it('should track both X and Y highlights independently', async () => {
    const { user, container } = render(
      <BarChart {...barChartProps}>
        <CombinedHighlightCheck />
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

    expect(screen.getByTestId('highlight-active')).to.have.text('true');
    expect(screen.getByTestId('x-highlight-active')).to.have.text('true');
    expect(screen.getByTestId('y-highlight-active')).to.have.text('true');
  });
});
