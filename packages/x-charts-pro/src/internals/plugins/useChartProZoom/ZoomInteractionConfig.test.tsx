/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import * as sinon from 'sinon';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

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

      const svg = document.querySelector('svg')!;

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

      const svg = document.querySelector('svg')!;

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

      const svg = document.querySelector('svg')!;

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

      const svg = document.querySelector('svg')!;

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

      const svg = document.querySelector('svg')!;

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

  describe('Brush zoom', () => {
    it('should zoom into the brushed area', async () => {
      const onZoomChange = sinon.spy();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: ['brush'],
            pan: [], // Disable panning to avoid conflicts
          }}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      const svg = document.querySelector('svg')!;

      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 50 },
        },
        {
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.be.greaterThan(0);
      expect(getAxisTickValues('x')).to.deep.equal(['B']);
    });

    it('should not zoom if brush is too small', async () => {
      const onZoomChange = sinon.spy();
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

      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      const svg = document.querySelector('svg')!;

      // Make a very small brush (less than 5 pixels) - just a single point
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      // Should not zoom because there was no brush movement
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);
    });

    it('should work with key modifiers', async () => {
      const onZoomChange = sinon.spy();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: [{ type: 'brush', requiredKeys: ['Shift'] }],
            pan: [],
          }}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      const svg = document.querySelector('svg')!;

      // Try brushing without Shift key - should not work
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 50 },
        },
        {
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.equal(0);
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

      // Try brushing with Shift key - should work
      await user.keyboard('{Shift>}');
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 15, y: 50 },
        },
        {
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);
      await user.keyboard('{/Shift}');
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.be.greaterThan(0);
    });
  });

  describe('Double tap reset', () => {
    it('should reset zoom to default on double tap', async () => {
      const onZoomChange = sinon.spy();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 50, end: 75 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: ['doubleTapReset'],
          }}
        />,
        options,
      );

      // Should start zoomed in
      expect(getAxisTickValues('x')).to.deep.equal(['C']);

      const svg = document.querySelector('svg')!;

      // Double tap to reset
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);

      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.be.greaterThan(0);
      // Should have reset to show all ticks
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);
    });

    it('should work with key modifiers', async () => {
      const onZoomChange = sinon.spy();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 50, end: 75 }]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: [{ type: 'doubleTapReset', requiredKeys: ['Control'] }],
          }}
        />,
        options,
      );

      // Should start zoomed in
      expect(getAxisTickValues('x')).to.deep.equal(['C']);

      const svg = document.querySelector('svg')!;

      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.equal(0);

      // Try double tap with Control key - should reset
      await user.keyboard('{Control>}');
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);
      await user.keyboard('{/Control}');
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.be.greaterThan(0);
      expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);
    });

    it('should reset all axes when multiple axes are zoomed', async () => {
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
            },
          ]}
          yAxis={[{ zoom: true, id: 'y' }]}
          width={100}
          height={130}
          margin={0}
          slotProps={{ tooltip: { trigger: 'none' } }}
          initialZoom={[
            { axisId: 'x', start: 50, end: 75 },
            { axisId: 'y', start: 25, end: 50 },
          ]}
          onZoomChange={onZoomChange}
          zoomInteractionConfig={{
            zoom: ['doubleTapReset'],
          }}
        />,
        options,
      );

      const svg = document.querySelector('svg')!;

      // Double tap to reset both axes
      await user.pointer([
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[MouseLeft>]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
        {
          keys: '[/MouseLeft]',
          target: svg,
          coords: { x: 50, y: 50 },
        },
      ]);
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.be.greaterThan(0);

      // Verify the callback was called with reset values for both axes
      const lastCall = onZoomChange.lastCall.args[0];
      expect(lastCall).to.be.an('array').with.lengthOf(2);

      // Check that both axes are reset to full range (0-100)
      const xAxis = lastCall.find((z: any) => z.axisId === 'x');
      const yAxis = lastCall.find((z: any) => z.axisId === 'y');

      expect(xAxis).to.not.equal(undefined);
      expect(yAxis).to.not.equal(undefined);
      expect(xAxis.start).to.equal(0);
      expect(xAxis.end).to.equal(100);
      expect(yAxis.start).to.equal(0);
      expect(yAxis.end).to.equal(100);
    });
  });
});
