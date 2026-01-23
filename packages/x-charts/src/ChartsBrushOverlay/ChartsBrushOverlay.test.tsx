/* eslint-disable no-promise-executor-return */
import { act, createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { BarChart } from '@mui/x-charts/BarChart';
import { brushOverlayClasses } from './ChartsBrushOverlay.classes';
import { ChartsBrushOverlay } from './ChartsBrushOverlay';

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
      position: 'none',
    },
  ],
  yAxis: [{ position: 'none' }],
  width: 100,
  height: 130,
  margin: 0,
  slotProps: { tooltip: { trigger: 'none' } },
  brushConfig: {
    enabled: true,
  },
} as const;

describe('<ChartsBrushOverlay />', () => {
  const { render } = createRenderer();

  it('should not render overlay when brush is not active', async () => {
    const { container } = render(
      <BarChart {...barChartProps}>
        <ChartsBrushOverlay />
      </BarChart>,
    );

    const overlay = container.querySelector(`.${brushOverlayClasses.root}`);
    expect(overlay).to.equal(null);
  });

  it.skipIf(isJSDOM)(
    'should render brush successfully when interacting with brush enabled',
    async () => {
      const { container, user } = render(
        <BarChart {...barChartProps}>
          <ChartsBrushOverlay />
        </BarChart>,
      );

      const svg = container.querySelector('svg')!;

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

      const overlay = container.querySelector(`.${brushOverlayClasses.root}`);
      expect(overlay).not.to.equal(null);
    },
  );
});
