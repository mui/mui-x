/* eslint-disable no-promise-executor-return */

import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { vi } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { CHART_SELECTOR } from '../../../tests/constants';

describe.skipIf(isJSDOM)('ZoomInteractionConfig Keys and Modes', () => {
  const { render } = createRenderer();

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
        height: 30,
        id: 'x',
      },
    ],
    yAxis: [{ position: 'none' }],
    width: 100,
    height: 130,
    margin: 0,
    slotProps: { tooltip: { trigger: 'none' } },
  } as const;

  const options = {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <div style={{ width: 100, height: 130 }}>{children}</div>
    ),
  };

  const getAxisTickValues = (axis: 'x' | 'y'): string[] => {
    const axisData = Array.from(
      document.querySelectorAll(
        `.MuiChartsAxis-direction${axis.toUpperCase()} .MuiChartsAxis-tickContainer`,
      ),
    )
      .map((v) => v.textContent)
      .filter(Boolean);

    return axisData as string[];
  };

  describe('Wheel zoom with key modifiers', () => {
    it('should zoom on wheel with Control key pressed', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: [{ type: 'wheel', requiredKeys: ['Control'] }],
          }}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      const svg = document.querySelector(CHART_SELECTOR)!;

      await user.pointer([
        {
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);

      // Wheel without modifier keys - should not zoom
      fireEvent.wheel(svg, { deltaY: -10, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(0);
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      await user.keyboard('{Control>}');
      // Wheel with Control key - should zoom
      fireEvent.wheel(svg, { deltaY: -30, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
      await user.keyboard('{/Control}');

      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);
    });
  });

  describe('Pan with key modifiers', () => {
    it('should only pan on drag when Alt key is pressed', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            pan: [{ type: 'drag', requiredKeys: ['Alt'] }],
          }}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['D']);

      const svg = document.querySelector(CHART_SELECTOR)!;

      // Drag without Alt key - should not pan
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 20 },
        },
        {
          target: svg,
          coords: { x: 90, y: 20 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 90, y: 20 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(0);
      expect(getAxisTickValues('x')).to.deep.equal(['D']);

      // Drag with Alt key - should pan
      await user.keyboard('{Alt>}');
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 20 },
        },
        {
          target: svg,
          coords: { x: 90, y: 20 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 90, y: 20 },
        },
      ]);
      await user.keyboard('{/Alt}');
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(1);
      // Should have panned to show a different tick
      expect(getAxisTickValues('x')).to.not.deep.equal(['D']);
    });

    it('should only pan on drag with multiple key modifiers', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            pan: [{ type: 'drag', requiredKeys: ['Shift', 'Control'] }],
          }}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['D']);

      const svg = document.querySelector(CHART_SELECTOR)!;

      // Drag with only Shift key - should not pan
      await user.keyboard('{Shift>}');
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 20 },
        },
        {
          target: svg,
          coords: { x: 90, y: 20 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 90, y: 20 },
        },
      ]);
      await user.keyboard('{/Shift}');
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(0);
      expect(getAxisTickValues('x')).to.deep.equal(['D']);

      // Drag with both Shift and Control keys - should pan
      await user.keyboard('{Shift>}{Control>}');
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 20 },
        },
        {
          target: svg,
          coords: { x: 90, y: 20 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 90, y: 20 },
        },
      ]);
      await user.keyboard('{/Control}{/Shift}');
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(1);
      // Should have panned to show a different tick
      expect(getAxisTickValues('x')).to.not.deep.equal(['D']);
    });
  });

  describe('Interaction modes', () => {
    it('should only pan on drag with mouse mode', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            pan: [{ type: 'drag', pointerMode: 'mouse' }],
          }}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['D']);

      const svg = document.querySelector(CHART_SELECTOR)!;

      // Mouse drag - should pan
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 20 },
        },
        {
          target: svg,
          coords: { x: 90, y: 20 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 90, y: 20 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(1);
      // Should have panned to show a different tick
      expect(getAxisTickValues('x')).to.deep.equal(['C']);

      // Mouse drag with touch mode - should not pan
      await user.pointer([
        {
          keys: '[TouchA>]',
          target: svg,
          coords: { x: 15, y: 20 },
        },
        {
          pointerName: 'TouchA',
          target: svg,
          coords: { x: 90, y: 20 },
        },
        {
          keys: '[/TouchA]',
          target: svg,
          coords: { x: 90, y: 20 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(1);
      expect(getAxisTickValues('x')).to.deep.equal(['C']);
    });

    it('should only zoom when specific interactions are enabled', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: ['pinch'], // Only enable pinch zoom, disable wheel zoom
          }}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      const svg = document.querySelector('svg:not([aria-hidden="true"])')!;

      // Wheel - should not zoom since only pinch is enabled
      fireEvent.wheel(svg, { deltaY: -30, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(0);
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      // Pinch - should zoom
      await user.pointer([
        {
          keys: '[TouchA>]',
          target: svg,
          coords: { x: 55, y: 45 },
        },
        {
          keys: '[TouchB>]',
          target: svg,
          coords: { x: 45, y: 55 },
        },
        {
          pointerName: 'TouchA',
          target: svg,
          coords: { x: 75, y: 25 },
        },
        {
          pointerName: 'TouchB',
          target: svg,
          coords: { x: 25, y: 75 },
        },
        {
          keys: '[/TouchA]',
          target: svg,
          coords: { x: 75, y: 25 },
        },
        {
          keys: '[/TouchB]',
          target: svg,
          coords: { x: 25, y: 75 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);
      // Should have zoomed in to show fewer ticks
      expect(getAxisTickValues('x').length).to.be.lessThan(4);
    });
  });

  describe('Zoom and Pan with reversed axis', () => {
    it('should zoom at the correct position with reversed x-axis', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          series={[
            {
              data: [10, 20, 30, 40],
            },
          ]}
          xAxis={[
            {
              data: ['A', 'B', 'C', 'D'],
              zoom: true,
              height: 30,
              id: 'x',
              reverse: true, // Reversed axis
            },
          ]}
          yAxis={[{ position: 'none' }]}
          width={100}
          height={130}
          margin={0}
          slotProps={{ tooltip: { trigger: 'none' } }}
          onZoomChange={onZoomChange}
        />,
        options,
      );

      // The reverse property affects scale mapping, not tick order
      // Ticks still render in data order: A, B, C, D
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      const svg = document.querySelector(CHART_SELECTOR)!;

      await user.pointer([
        {
          target: svg,
          coords: { x: 25, y: 50 },
        },
      ]);

      // Zoom in the <-- left side
      // For `[D, C, B, A]` should zoom towards B, C, D
      fireEvent.wheel(svg, { deltaY: -500, clientX: 15, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);

      const ticksAfterZoom = getAxisTickValues('x');
      expect(ticksAfterZoom).to.deep.equal(['B', 'C', 'D']);
    });

    it('should pan in the correct direction with reversed x-axis on drag', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          series={[
            {
              data: [10, 20, 30, 40],
            },
          ]}
          xAxis={[
            {
              data: ['A', 'B', 'C', 'D'],
              zoom: true,
              height: 30,
              id: 'x',
              reverse: true,
            },
          ]}
          yAxis={[{ position: 'none' }]}
          width={100}
          height={130}
          margin={0}
          slotProps={{ tooltip: { trigger: 'none' } }}
          initialZoom={[{ axisId: 'x', start: 25, end: 75 }]}
          onZoomChange={onZoomChange}
        />,
        options,
      );

      // With zoom at 25-75%, we see the middle range which is B and C
      expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);

      const svg = document.querySelector(CHART_SELECTOR)!;

      // Drag from left to right (positive direction)
      // Drag --> should pan towards left side of data [D, C, B, A], showing C and D
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 50 },
        },
        {
          target: svg,
          coords: { x: 85, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 85, y: 50 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);

      const ticksAfterDrag = getAxisTickValues('x');
      expect(ticksAfterDrag).to.deep.equal(['C', 'D']);
    });
  });

  describe('Zoom on brush', () => {
    it('should zoom into the brushed area on x-axis', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: ['brush'],
            pan: [],
          }}
        />,
        options,
      );

      const initialTicks = getAxisTickValues('x');
      expect(initialTicks).to.deep.equal(['A', 'B', 'C', 'D']);

      const svg = document.querySelector(CHART_SELECTOR)!;

      // Brush from middle to right side
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          target: svg,
          coords: { x: 90, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 90, y: 50 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(1);

      const ticksAfterZoom = getAxisTickValues('x');
      // Should have zoomed in, so 'A' should not be visible anymore
      expect(ticksAfterZoom).to.deep.equal(['C', 'D']);
    });
  });

  describe('Pan on wheel (side scrolling)', () => {
    it('should pan horizontally on wheel scroll', async () => {
      const onZoomChange = vi.fn();
      render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 25, end: 75 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: [], // Disable zoom to avoid conflict
            pan: ['wheel'],
          }}
        />,
        options,
      );

      const svg = document.querySelector(CHART_SELECTOR)!;
      expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);

      // Simulate wheel scroll
      fireEvent.wheel(svg, { deltaX: 100, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // Should trigger zoom change (pan)
      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);
      expect(getAxisTickValues('x')).to.deep.equal(['C', 'D']);
    });

    it('should pan diagonally on wheel scroll with xy', async () => {
      const onZoomChange = vi.fn();
      render(
        <ScatterChartPro
          {...barChartProps}
          initialZoom={[
            { axisId: 'x', start: 25, end: 75 },
            { axisId: 'y', start: 25, end: 75 },
          ]}
          series={[
            {
              data: [
                { x: 10, y: 10 },
                { x: 20, y: 20 },
                { x: 30, y: 30 },
                { x: 40, y: 40 },
              ],
            },
          ]}
          yAxis={[{ id: 'y', zoom: true, width: 30 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: [], // Disable zoom to avoid conflict
            pan: [{ type: 'wheel', allowedDirection: 'xy' }],
          }}
        />,
        options,
      );

      const svg = document.querySelector(CHART_SELECTOR)!;
      expect(getAxisTickValues('x')).to.deep.equal(['10', '20']);
      expect(getAxisTickValues('y')).to.deep.equal(['10', '20']);

      // Simulate wheel scroll
      fireEvent.wheel(svg, {
        // X <-- scroll right
        deltaX: -100,
        // Y v-- scroll down
        deltaY: 100,
        clientX: 50,
        clientY: 50,
      });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // Should trigger zoom change (pan)
      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);
      expect(getAxisTickValues('x')).to.deep.equal(['0', '10']);
      expect(getAxisTickValues('y')).to.deep.equal(['0', '10']);
    });

    it('should not pan when required keys are not pressed', async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 25, end: 75 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: [], // Disable zoom to avoid conflict
            pan: [{ type: 'wheel', requiredKeys: ['Alt'] }],
          }}
        />,
        options,
      );

      const svg = document.querySelector(CHART_SELECTOR)!;
      expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);

      // Simulate wheel scroll without Alt key
      fireEvent.wheel(svg, { deltaX: 100, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // Should not trigger zoom change because Alt key is required but not pressed
      expect(onZoomChange.mock.calls.length).to.equal(0);

      // Simulate wheel scroll with Alt key
      await user.keyboard('{Alt>}');
      fireEvent.wheel(svg, { deltaX: 100, clientX: 50, clientY: 50 });
      await user.keyboard('{/Alt}');
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // Should trigger zoom change (pan)
      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);
      expect(getAxisTickValues('x')).to.deep.equal(['C', 'D']);
    });

    it('should pan to the correct side when axis is reversed', async () => {
      const onZoomChange = vi.fn();
      render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 25, end: 75 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: [], // Disable zoom to avoid conflict
            pan: ['wheel'],
          }}
          xAxis={[
            {
              data: ['A', 'B', 'C', 'D'],
              zoom: true,
              height: 30,
              id: 'x',
              reverse: true,
            },
          ]}
        />,
        options,
      );

      const svg = document.querySelector(CHART_SELECTOR)!;
      expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);

      // Simulate wheel scroll to the right (positive deltaX)
      fireEvent.wheel(svg, { deltaX: 100, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // With reversed axis, should pan to show higher value ticks
      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B']);
    });

    it('should be enabled by default when only x-axis has zoom', async () => {
      const onZoomChange = vi.fn();
      render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 25, end: 75 }]}
          onZoomChange={onZoomChange}
        />,
        options,
      );

      const svg = document.querySelector(CHART_SELECTOR)!;
      expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);

      // Simulate wheel scroll - should pan because only x-axis has zoom
      fireEvent.wheel(svg, { deltaX: 100, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // Should trigger pan
      expect(onZoomChange.mock.calls.length).to.be.greaterThan(0);
      expect(getAxisTickValues('x')).to.not.deep.equal(['B', 'C']);
    });

    it('should be disabled by default when both axes have zoom', async () => {
      const onZoomChange = vi.fn();
      render(
        <ScatterChartPro
          series={[
            {
              data: [
                { x: 10, y: 10 },
                { x: 20, y: 20 },
                { x: 30, y: 30 },
                { x: 40, y: 40 },
              ],
            },
          ]}
          xAxis={[{ id: 'x', zoom: true, height: 30 }]}
          yAxis={[{ id: 'y', zoom: true, width: 30 }]}
          initialZoom={[
            { axisId: 'x', start: 25, end: 75 },
            { axisId: 'y', start: 25, end: 75 },
          ]}
          onZoomChange={onZoomChange}
          width={130}
          height={130}
          margin={10}
        />,
        options,
      );

      const svg = document.querySelector(CHART_SELECTOR)!;
      const initialXTicks = getAxisTickValues('x');

      // Simulate wheel scroll - should NOT pan because both axes have zoom
      fireEvent.wheel(svg, { deltaX: 100, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // Should not trigger pan
      expect(onZoomChange.mock.calls.length).to.equal(0);
      expect(getAxisTickValues('x')).to.deep.equal(initialXTicks);
    });

    it('should be disabled by default when only y-axis has zoom', async () => {
      const onZoomChange = vi.fn();
      render(
        <BarChartPro
          {...barChartProps}
          xAxis={[
            {
              data: ['A', 'B', 'C', 'D'],
              height: 30,
              id: 'x',
            },
          ]}
          yAxis={[
            {
              zoom: true,
              width: 30,
              id: 'y',
            },
          ]}
          initialZoom={[{ axisId: 'y', start: 25, end: 75 }]}
          onZoomChange={onZoomChange}
        />,
        options,
      );

      const svg = document.querySelector(CHART_SELECTOR)!;
      const initialXTicks = getAxisTickValues('x');

      // Simulate wheel scroll - should NOT pan because x-axis doesn't have zoom
      fireEvent.wheel(svg, { deltaX: 100, clientX: 50, clientY: 50 });
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // Should not trigger pan
      expect(onZoomChange.mock.calls.length).to.equal(0);
      expect(getAxisTickValues('x')).to.deep.equal(initialXTicks);
    });
  });
});
