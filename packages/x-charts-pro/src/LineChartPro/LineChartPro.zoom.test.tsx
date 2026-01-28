/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { vi } from 'vitest';
import { LineChartPro } from './LineChartPro';
import { CHART_SELECTOR } from '../tests/constants';

const getAxisTickValues = (axis: 'x' | 'y', container: HTMLElement): string[] => {
  const axisData = Array.from(
    container.querySelectorAll(
      `.MuiChartsAxis-direction${axis.toUpperCase()} .MuiChartsAxis-tickContainer`,
    ),
  )
    .map((v) => v.textContent)
    .filter(Boolean);

  return axisData as string[];
};

describe.skipIf(isJSDOM)('<LineChartPro /> - Zoom', () => {
  const { render } = createRenderer();

  const lineChartProps = {
    series: [
      {
        data: [10, 20, 30, 40],
      },
    ],
    xAxis: [
      {
        scaleType: 'point',
        data: ['A', 'B', 'C', 'D'],
        zoom: true,
        height: 30,
        id: 'x',
      },
    ],
    yAxis: [{ position: 'none' }],
    width: 100,
    height: 130,
    margin: 5,
    slotProps: { tooltip: { trigger: 'none' } },
  } as const;

  const options = {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <div style={{ width: 100, height: 130 }}>{children}</div>
    ),
  };

  it('should zoom on wheel', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <LineChartPro {...lineChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x', container)).to.deep.equal(['A', 'B', 'C', 'D']);

    const svg = container.querySelector(CHART_SELECTOR)!;

    await user.pointer([
      {
        target: svg,
        coords: { x: 15, y: 50 },
      },
    ]);

    fireEvent.wheel(svg, { deltaY: -10, clientX: 15, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(1);
    expect(getAxisTickValues('x', container)).to.deep.equal(['A', 'B', 'C']);

    // scroll back
    fireEvent.wheel(svg, { deltaY: 10, clientX: 15, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(2);
    expect(getAxisTickValues('x', container)).to.deep.equal(['A', 'B', 'C', 'D']);

    // zoom on the right side
    // TODO: Fix this test. When zooming on the right side, D should stay visible and A disappear.
    await user.pointer([
      {
        target: svg,
        coords: { x: 90, y: 50 },
      },
    ]);

    fireEvent.wheel(svg, { deltaY: -10, clientX: 90, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(3);
    expect(getAxisTickValues('x', container)).to.deep.equal(['B', 'C']);

    // scroll back
    fireEvent.wheel(svg, { deltaY: 10, clientX: 90, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(4);
    expect(getAxisTickValues('x', container)).to.deep.equal(['A', 'B', 'C', 'D']);
  });

  ['MouseLeft', 'TouchA'].forEach((pointerName) => {
    it(`should pan on ${pointerName} drag`, async () => {
      const onZoomChange = vi.fn();
      const { user, container } = render(
        <LineChartPro
          {...lineChartProps}
          initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
          onZoomChange={onZoomChange}
        />,
        options,
      );

      expect(getAxisTickValues('x', container)).to.deep.equal(['D']);

      const svg = container.querySelector(CHART_SELECTOR)!;

      // we drag one position so C should be visible
      await user.pointer([
        {
          keys: `[${pointerName}>]`,
          target: svg,
          coords: { x: 15, y: 20 },
        },
        {
          pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
          target: svg,
          coords: { x: 135, y: 20 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 135, y: 20 },
        },
      ]);
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(1);
      expect(getAxisTickValues('x', container)).to.deep.equal(['C']);

      // we drag all the way to the left so A should be visible
      await user.pointer([
        {
          keys: `[${pointerName}>]`,
          target: svg,
          coords: { x: 15, y: 20 },
        },
        {
          pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
          target: svg,
          coords: { x: 400, y: 20 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 400, y: 20 },
        },
      ]);
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(2);
      expect(getAxisTickValues('x', container)).to.deep.equal(['A']);
    });
  });

  it('should pan with area series enabled', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <LineChartPro
        {...lineChartProps}
        series={[
          {
            data: [10, 20, 30, 40],
            area: true,
          },
        ]}
        initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
        onZoomChange={onZoomChange}
      />,
      options,
    );

    expect(getAxisTickValues('x', container)).to.deep.equal(['D']);

    const target = container.querySelector('.MuiAreaElement-root')!;

    // We drag from right to left to pan the view
    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target,
        coords: { x: 50, y: 50 },
      },
      {
        target,
        coords: { x: 150, y: 50 },
      },
      {
        keys: '[/MouseLeft]',
        target,
        coords: { x: 150, y: 50 },
      },
    ]);
    // Wait the animation frame
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(1);
    expect(getAxisTickValues('x', container)).to.deep.equal(['C']);

    // Continue dragging to see more data points
    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target,
        coords: { x: 50, y: 50 },
      },
      {
        target,
        coords: { x: 250, y: 50 },
      },
      {
        keys: '[/MouseLeft]',
        target,
        coords: { x: 250, y: 50 },
      },
    ]);
    // Wait the animation frame
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(2);
    expect(getAxisTickValues('x', container)).to.deep.equal(['A']);
  });

  it('should zoom on pinch', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <LineChartPro {...lineChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x', container)).to.deep.equal(['A', 'B', 'C', 'D']);

    const svg = container.querySelector(CHART_SELECTOR)!;

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
        coords: { x: 65, y: 25 },
      },
      {
        pointerName: 'TouchB',
        target: svg,
        coords: { x: 25, y: 65 },
      },
      {
        keys: '[/TouchA]',
        target: svg,
        coords: { x: 65, y: 25 },
      },
      {
        keys: '[/TouchB]',
        target: svg,
        coords: { x: 25, y: 65 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.be.above(0);
    expect(getAxisTickValues('x', container)).to.deep.equal(['B', 'C']);
  });

  it('should zoom on tap and drag', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <LineChartPro
        {...lineChartProps}
        onZoomChange={onZoomChange}
        zoomInteractionConfig={{
          zoom: ['tapAndDrag'],
        }}
      />,
      options,
    );

    expect(getAxisTickValues('x', container)).to.deep.equal(['A', 'B', 'C', 'D']);

    const svg = container.querySelector(CHART_SELECTOR)!;

    // Perform tap and drag gesture - tap once, then drag vertically up to zoom in
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
        target: svg,
        coords: { x: 50, y: 80 },
      },
      {
        keys: '[/MouseLeft]',
        target: svg,
        coords: { x: 50, y: 80 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.be.above(0);
    // Should have zoomed in to show fewer ticks
    expect(getAxisTickValues('x', container).length).to.be.lessThan(4);
  });

  it('should handle extreme deltaY values without breaking zoom (regression test for deltaY < -100)', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <LineChartPro
        {...lineChartProps}
        onZoomChange={onZoomChange}
        zoomInteractionConfig={{
          zoom: ['tapAndDrag'],
        }}
      />,
      options,
    );

    expect(getAxisTickValues('x', container)).to.deep.equal(['A', 'B', 'C', 'D']);

    const svg = container.querySelector(CHART_SELECTOR)!;

    // Simulate the problematic scenario:
    // 1. Small drag down (positive deltaY) - this should zoom out slightly
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
        target: svg,
        coords: { x: 50, y: 60 }, // Small drag down
      },
      {
        keys: '[/MouseLeft]',
        target: svg,
        coords: { x: 50, y: 60 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    // No issue yet, should still show some ticks
    expect(getAxisTickValues('x', container).length).toBeGreaterThan(0);

    // 2. Then a very large drag up (large negative deltaY) - this would cause deltaY < -100
    // This used to break the zoom because scaleRatio would become negative
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
        target: svg,
        coords: { x: 50, y: -1000 }, // Very large drag up
      },
      {
        keys: '[/MouseLeft]',
        target: svg,
        coords: { x: 50, y: -1000 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    // When the issue happens, the ticks are gone.
    expect(getAxisTickValues('x', container).length).toBeGreaterThan(0);
  });

  it('should pan on press and drag', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <LineChartPro
        {...lineChartProps}
        initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
        onZoomChange={onZoomChange}
        zoomInteractionConfig={{
          pan: ['pressAndDrag'],
        }}
      />,
      options,
    );

    expect(getAxisTickValues('x', container)).to.deep.equal(['D']);

    const svg = container.querySelector(CHART_SELECTOR)!;

    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: svg,
        coords: { x: 15, y: 20 },
      },
    ]);

    await act(async () => new Promise((r) => setTimeout(r, 510))); // wait for press delay

    // we drag one position so C should be visible
    await user.pointer([
      {
        target: svg,
        coords: { x: 135, y: 20 },
      },
      {
        keys: '[/MouseLeft]',
        target: svg,
        coords: { x: 135, y: 20 },
      },
    ]);
    // Wait the animation frame
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(1);
    expect(getAxisTickValues('x', container)).to.deep.equal(['C']);
  });

  it('should not pan on press and drag if there is no press', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <LineChartPro
        {...lineChartProps}
        initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
        onZoomChange={onZoomChange}
        zoomInteractionConfig={{
          pan: ['pressAndDrag'],
        }}
      />,
      options,
    );

    expect(getAxisTickValues('x', container)).to.deep.equal(['D']);

    const svg = container.querySelector(CHART_SELECTOR)!;

    // we drag one position so C should be visible
    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: svg,
        coords: { x: 15, y: 20 },
      },
      {
        target: svg,
        coords: { x: 135, y: 20 },
      },
      {
        keys: '[/MouseLeft]',
        target: svg,
        coords: { x: 135, y: 20 },
      },
    ]);
    // Wait the animation frame
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(0);
    expect(getAxisTickValues('x', container)).to.deep.equal(['D']); // no change
  });
});
