/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import * as sinon from 'sinon';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
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
      const onZoomChange = sinon.spy();
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
      for (let i = 0; i < 10; i += 1) {
        fireEvent.wheel(svg, { deltaY: -1, clientX: 50, clientY: 50 });
        await act(async () => new Promise((r) => requestAnimationFrame(r)));
      }

      expect(onZoomChange.callCount).to.equal(0);
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      await user.keyboard('{Control>}');
      // Wheel with Control key - should zoom
      for (let i = 0; i < 30; i += 1) {
        fireEvent.wheel(svg, { deltaY: -1, clientX: 50, clientY: 50 });
        await act(async () => new Promise((r) => requestAnimationFrame(r)));
      }
      await user.keyboard('{/Control}');

      expect(onZoomChange.callCount).to.be.greaterThan(0);
    });
  });

  describe('Pan with key modifiers', () => {
    it('should only pan on drag when Alt key is pressed', async () => {
      const onZoomChange = sinon.spy();
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

      expect(onZoomChange.callCount).to.equal(0);
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

      expect(onZoomChange.callCount).to.equal(1);
      // Should have panned to show a different tick
      expect(getAxisTickValues('x')).to.not.deep.equal(['D']);
    });

    it('should only pan on drag with multiple key modifiers', async () => {
      const onZoomChange = sinon.spy();
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

      expect(onZoomChange.callCount).to.equal(0);
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

      expect(onZoomChange.callCount).to.equal(1);
      // Should have panned to show a different tick
      expect(getAxisTickValues('x')).to.not.deep.equal(['D']);
    });
  });

  describe('Interaction modes', () => {
    it('should only pan on drag with mouse mode', async () => {
      const onZoomChange = sinon.spy();
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

      expect(onZoomChange.callCount).to.equal(1);
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

      expect(onZoomChange.callCount).to.equal(1);
      expect(getAxisTickValues('x')).to.deep.equal(['C']);
    });

    it('should only zoom when specific interactions are enabled', async () => {
      const onZoomChange = sinon.spy();
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
      for (let i = 0; i < 30; i += 1) {
        fireEvent.wheel(svg, { deltaY: -1, clientX: 50, clientY: 50 });
        await act(async () => new Promise((r) => requestAnimationFrame(r)));
      }

      expect(onZoomChange.callCount).to.equal(0);
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

      expect(onZoomChange.callCount).to.be.greaterThan(0);
      // Should have zoomed in to show fewer ticks
      expect(getAxisTickValues('x').length).to.be.lessThan(4);
    });
  });

  describe('Zoom and Pan with reversed axis', () => {
    it('should zoom at the correct position with reversed x-axis', async () => {
      const onZoomChange = sinon.spy();
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

      expect(onZoomChange.callCount).to.be.greaterThan(0);

      const ticksAfterZoom = getAxisTickValues('x');
      expect(ticksAfterZoom).to.deep.equal(['B', 'C', 'D']);
    });

    it('should pan in the correct direction with reversed x-axis on drag', async () => {
      const onZoomChange = sinon.spy();
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

      expect(onZoomChange.callCount).to.be.greaterThan(0);

      const ticksAfterDrag = getAxisTickValues('x');
      expect(ticksAfterDrag).to.deep.equal(['C', 'D']);
    });
  });
});
