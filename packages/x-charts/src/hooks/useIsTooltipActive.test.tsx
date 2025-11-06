/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { BarChart } from '../BarChart';
import { PieChart } from '../PieChart';
import { useIsTooltipActive, useIsAnyTooltipActive } from './useIsTooltipActive';

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

function TooltipActiveCheck({ trigger }: { trigger?: 'item' | 'axis' }) {
  const isTooltipActive = useIsTooltipActive(trigger ?? 'axis');
  return <div data-testid="tooltip-active">{String(isTooltipActive)}</div>;
}

function AnyTooltipActiveCheck() {
  const isAnyTooltipActive = useIsAnyTooltipActive();
  return <div data-testid="any-tooltip-active">{String(isAnyTooltipActive)}</div>;
}

describe('useIsTooltipActive', () => {
  const { render } = createRenderer();

  describe('with axis trigger', () => {
    it('should return false when no interaction', async () => {
      render(
        <BarChart {...barChartProps}>
          <TooltipActiveCheck trigger="axis" />
        </BarChart>,
      );

      expect(screen.getByTestId('tooltip-active')).to.have.text('false');
    });

    it.skipIf(isJSDOM)(
      'should return false when brush is active and preventTooltip is true',
      async () => {
        const { container, user } = render(
          <BarChart {...barChartProps}>
            <TooltipActiveCheck trigger="axis" />
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

        expect(screen.getByTestId('tooltip-active')).to.have.text('false');
      },
    );

    it.skipIf(isJSDOM)(
      'should return true when brush is active but preventTooltip is false',
      async () => {
        const { container, user } = render(
          <BarChart
            {...barChartProps}
            brushConfig={{
              enabled: true,
              preventTooltip: false,
            }}
          >
            <TooltipActiveCheck trigger="axis" />
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

        expect(screen.getByTestId('tooltip-active')).to.have.text('false');
      },
    );
  });

  describe('with item trigger', () => {
    it('should return false when no item is hovered', async () => {
      render(
        <BarChart
          {...barChartProps}
          slotProps={{ tooltip: { trigger: 'item' } }}
          brushConfig={{ enabled: false }}
        >
          <TooltipActiveCheck trigger="item" />
        </BarChart>,
      );

      expect(screen.getByTestId('tooltip-active')).to.have.text('false');
    });

    it.skipIf(isJSDOM)('should return true when hovering over an item', async () => {
      const { container, user } = render(
        <BarChart
          series={[{ data: [10, 20, 30, 40] }]}
          xAxis={[{ data: ['A', 'B', 'C', 'D'], scaleType: 'band', position: 'none' as const }]}
          yAxis={[{ position: 'none' as const }]}
          width={100}
          height={130}
          margin={0}
          slotProps={{ tooltip: { trigger: 'item' } }}
        >
          <TooltipActiveCheck trigger="item" />
        </BarChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const bar = container.querySelector('path[d]');

      if (bar) {
        await user.pointer({
          target: bar,
        });

        expect(screen.getByTestId('tooltip-active')).to.have.text('true');
      }
    });

    it.skipIf(isJSDOM)('should work with PieChart', async () => {
      const { container, user } = render(
        <PieChart
          series={[{ data: [{ value: 10 }, { value: 15 }, { value: 20 }] }]}
          width={100}
          height={100}
          margin={0}
          slotProps={{ tooltip: { trigger: 'item' } }}
        >
          <TooltipActiveCheck trigger="item" />
        </PieChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const slice = container.querySelector('path[d]');

      if (slice) {
        await user.pointer({
          target: slice,
        });

        expect(screen.getByTestId('tooltip-active')).to.have.text('true');
      }
    });
  });

  describe('useIsAnyTooltipActive', () => {
    it('should return false when no tooltip is active', async () => {
      render(
        <BarChart {...barChartProps}>
          <AnyTooltipActiveCheck />
        </BarChart>,
      );

      expect(screen.getByTestId('any-tooltip-active')).to.have.text('false');
    });

    it.skipIf(isJSDOM)('should return true when item tooltip is active', async () => {
      const { container, user } = render(
        <BarChart
          series={[{ data: [10, 20, 30, 40] }]}
          xAxis={[{ data: ['A', 'B', 'C', 'D'], scaleType: 'band', position: 'none' as const }]}
          yAxis={[{ position: 'none' as const }]}
          width={100}
          height={130}
          margin={0}
          slotProps={{ tooltip: { trigger: 'item' } }}
        >
          <AnyTooltipActiveCheck />
        </BarChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const bar = container.querySelector('path[d]');

      if (bar) {
        await user.pointer({
          target: bar,
        });

        expect(screen.getByTestId('any-tooltip-active')).to.have.text('true');
      }
    });

    it.skipIf(isJSDOM)(
      'should return false when brush is active and preventTooltip is true',
      async () => {
        const { container, user } = render(
          <BarChart {...barChartProps}>
            <AnyTooltipActiveCheck />
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

        expect(screen.getByTestId('any-tooltip-active')).to.have.text('false');
      },
    );
  });
});
