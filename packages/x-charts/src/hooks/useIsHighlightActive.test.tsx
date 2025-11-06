/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { act, createRenderer, screen } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { BarChart } from '../BarChart';
import { LineChart } from '../LineChart';
import {
  useIsHighlightActive,
  useIsXHighlightActive,
  useIsYHighlightActive,
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
    preventHighlight: true,
  },
} as const;

function HighlightActiveCheck() {
  const isHighlightActive = useIsHighlightActive();
  return <div data-testid="highlight-active">{String(isHighlightActive)}</div>;
}

function XHighlightActiveCheck() {
  const isXHighlightActive = useIsXHighlightActive();
  return <div data-testid="x-highlight-active">{String(isXHighlightActive)}</div>;
}

function YHighlightActiveCheck() {
  const isYHighlightActive = useIsYHighlightActive();
  return <div data-testid="y-highlight-active">{String(isYHighlightActive)}</div>;
}

function CombinedHighlightCheck() {
  const isHighlightActive = useIsHighlightActive();
  const isXHighlightActive = useIsXHighlightActive();
  const isYHighlightActive = useIsYHighlightActive();
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

  describe('combined highlight check', () => {
    it('should return false when no interaction', async () => {
      render(
        <BarChart
          {...barChartProps}
          brushConfig={{ enabled: false }}
          slotProps={{ tooltip: { trigger: 'none' } }}
        >
          <HighlightActiveCheck />
        </BarChart>,
      );

      expect(screen.getByTestId('highlight-active')).to.have.text('false');
    });

    it('should return true when hovering over chart', async () => {
      const { container, user } = render(
        <BarChart
          {...barChartProps}
          brushConfig={{ enabled: false }}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        >
          <HighlightActiveCheck />
        </BarChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const svg = container.querySelector('svg')!;

      await user.pointer({
        target: svg,
        coords: { clientX: 50, clientY: 50 },
      });

      expect(screen.getByTestId('highlight-active')).to.have.text('true');
    });

    it.skipIf(isJSDOM)(
      'should return false when brush is active and preventHighlight is true',
      async () => {
        const { container, user } = render(
          <BarChart {...barChartProps}>
            <HighlightActiveCheck />
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

        expect(screen.getByTestId('highlight-active')).to.have.text('false');
      },
    );

    it.skipIf(isJSDOM)(
      'should return true when brush is active but preventHighlight is false',
      async () => {
        const { container, user } = render(
          <BarChart
            {...barChartProps}
            brushConfig={{
              enabled: true,
              preventHighlight: false,
            }}
          >
            <HighlightActiveCheck />
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

        expect(screen.getByTestId('highlight-active')).to.have.text('false');
      },
    );

    it('should work with LineChart', async () => {
      const { container, user } = render(
        <LineChart
          series={[{ data: [1, 2, 3, 4] }]}
          xAxis={[{ data: ['A', 'B', 'C', 'D'], position: 'none' as const }]}
          yAxis={[{ position: 'none' as const }]}
          width={100}
          height={130}
          margin={0}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        >
          <HighlightActiveCheck />
        </LineChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const svg = container.querySelector('svg')!;

      await user.pointer({
        target: svg,
        coords: { clientX: 50, clientY: 50 },
      });

      expect(screen.getByTestId('highlight-active')).to.have.text('true');
    });
  });

  describe('useIsXHighlightActive', () => {
    it('should return false when no X interaction', async () => {
      render(
        <BarChart
          {...barChartProps}
          brushConfig={{ enabled: false }}
          slotProps={{ tooltip: { trigger: 'none' } }}
        >
          <XHighlightActiveCheck />
        </BarChart>,
      );

      expect(screen.getByTestId('x-highlight-active')).to.have.text('false');
    });

    it('should return true when hovering over X axis area', async () => {
      const { container, user } = render(
        <BarChart
          {...barChartProps}
          brushConfig={{ enabled: false }}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        >
          <XHighlightActiveCheck />
        </BarChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const svg = container.querySelector('svg')!;

      await user.pointer({
        target: svg,
        coords: { clientX: 50, clientY: 50 },
      });

      expect(screen.getByTestId('x-highlight-active')).to.have.text('true');
    });
  });

  describe('useIsYHighlightActive', () => {
    it('should return false when no Y interaction', async () => {
      render(
        <BarChart
          {...barChartProps}
          brushConfig={{ enabled: false }}
          slotProps={{ tooltip: { trigger: 'none' } }}
        >
          <YHighlightActiveCheck />
        </BarChart>,
      );

      expect(screen.getByTestId('y-highlight-active')).to.have.text('false');
    });

    it('should return true when hovering over Y axis area', async () => {
      const { container, user } = render(
        <BarChart
          {...barChartProps}
          brushConfig={{ enabled: false }}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        >
          <YHighlightActiveCheck />
        </BarChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const svg = container.querySelector('svg')!;

      await user.pointer({
        target: svg,
        coords: { clientX: 50, clientY: 50 },
      });

      expect(screen.getByTestId('y-highlight-active')).to.have.text('true');
    });
  });

  describe('combined X and Y highlight', () => {
    it('should track both X and Y highlights independently', async () => {
      render(
        <BarChart
          {...barChartProps}
          brushConfig={{ enabled: false }}
          slotProps={{ tooltip: { trigger: 'none' } }}
        >
          <CombinedHighlightCheck />
        </BarChart>,
      );

      expect(screen.getByTestId('highlight-active')).to.have.text('false');
      expect(screen.getByTestId('x-highlight-active')).to.have.text('false');
      expect(screen.getByTestId('y-highlight-active')).to.have.text('false');
    });

    it('should activate both X and Y highlights on hover', async () => {
      const { container, user } = render(
        <BarChart
          {...barChartProps}
          brushConfig={{ enabled: false }}
          slotProps={{ tooltip: { trigger: 'axis' } }}
        >
          <CombinedHighlightCheck />
        </BarChart>,
      );

      // eslint-disable-next-line testing-library/no-container
      const svg = container.querySelector('svg')!;

      await user.pointer({
        target: svg,
        coords: { clientX: 50, clientY: 50 },
      });

      expect(screen.getByTestId('highlight-active')).to.have.text('true');
      expect(screen.getByTestId('x-highlight-active')).to.have.text('true');
      expect(screen.getByTestId('y-highlight-active')).to.have.text('true');
    });
  });
});
