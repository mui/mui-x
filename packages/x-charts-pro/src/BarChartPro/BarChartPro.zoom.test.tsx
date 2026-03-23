/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { vi } from 'vitest';
import { BarChartPro } from './BarChartPro';
import { chartsSvgLayerClasses } from '../ChartsSvgLayer';

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

describe.skipIf(isJSDOM)('<BarChartPro /> - Zoom', () => {
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

  it('should zoom on wheel', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <BarChartPro
        {...barChartProps}
        onZoomChange={onZoomChange}
        margin={{ top: 0, left: 0, right: 15, bottom: 0 }}
      />,
      options,
    );
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    await user.pointer([
      {
        target: layerContainer,
        coords: { x: 0, y: 50 },
      },
    ]);

    // we scroll on the left side of the chart to remove the D ticks
    fireEvent.wheel(layerContainer, { deltaY: -500, clientX: 0, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(1);
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C']);

    // scroll back
    fireEvent.wheel(layerContainer, { deltaY: 500, clientX: 0, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(2);
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);
  });

  ['MouseLeft', 'TouchA'].forEach((pointerName) => {
    it(`should pan on ${pointerName} drag`, async () => {
      const onZoomChange = vi.fn();
      const { user, container } = render(
        <BarChartPro
          {...barChartProps}
          initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
          onZoomChange={onZoomChange}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['D']);

      const layerContainer = container.querySelector<HTMLElement>(
        `.${chartsSvgLayerClasses.root}`,
      )!.parentElement!;

      // we drag one position so C should be visible
      await user.pointer([
        {
          keys: `[${pointerName}>]`,
          target: layerContainer,
          coords: { x: 15, y: 20 },
        },
        {
          pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
          target: layerContainer,
          coords: { x: 90, y: 20 },
        },
        {
          keys: `[/${pointerName}]`,
          target: layerContainer,
          coords: { x: 90, y: 20 },
        },
      ]);
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(1);
      expect(getAxisTickValues('x')).to.deep.equal(['C']);

      // we drag all the way to the left so A should be visible
      await user.pointer([
        {
          keys: `[${pointerName}>]`,
          target: layerContainer,
          coords: { x: 15, y: 20 },
        },
        {
          pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
          target: layerContainer,
          coords: { x: 300, y: 20 },
        },
        {
          keys: `[/${pointerName}]`,
          target: layerContainer,
          coords: { x: 300, y: 20 },
        },
      ]);
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(2);
      expect(getAxisTickValues('x')).to.deep.equal(['A']);
    });
  });

  it('should zoom on pinch', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <BarChartPro {...barChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    await user.pointer([
      {
        keys: '[TouchA>]',
        target: layerContainer,
        coords: { x: 55, y: 45 },
      },
      {
        keys: '[TouchB>]',
        target: layerContainer,
        coords: { x: 45, y: 55 },
      },
      {
        pointerName: 'TouchA',
        target: layerContainer,
        coords: { x: 75, y: 25 },
      },
      {
        pointerName: 'TouchB',
        target: layerContainer,
        coords: { x: 25, y: 75 },
      },
      {
        keys: '[/TouchA]',
        target: layerContainer,
        coords: { x: 75, y: 25 },
      },
      {
        keys: '[/TouchB]',
        target: layerContainer,
        coords: { x: 25, y: 75 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.be.above(0);
    expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);
  });

  it('should zoom on tap and drag', async () => {
    const onZoomChange = vi.fn();
    const { user, container } = render(
      <BarChartPro
        {...barChartProps}
        onZoomChange={onZoomChange}
        zoomInteractionConfig={{
          zoom: ['tapAndDrag'],
        }}
      />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

    const layerContainer = container.querySelector<HTMLElement>(
      `.${chartsSvgLayerClasses.root}`,
    )!.parentElement!;

    // Perform tap and drag gesture - tap once, then drag vertically up to zoom in
    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: layerContainer,
        coords: { x: 50, y: 50 },
      },
      {
        keys: '[/MouseLeft]',
        target: layerContainer,
        coords: { x: 50, y: 50 },
      },
      {
        keys: '[MouseLeft>]',
        target: layerContainer,
        coords: { x: 50, y: 50 },
      },
      {
        target: layerContainer,
        coords: { x: 50, y: 80 },
      },
      {
        keys: '[/MouseLeft]',
        target: layerContainer,
        coords: { x: 50, y: 80 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.be.above(0);
    // Should have zoomed in to show fewer ticks
    expect(getAxisTickValues('x').length).to.be.lessThan(4);
  });
});
