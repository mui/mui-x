/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { vi } from 'vitest';
import { ScatterChartPro } from './ScatterChartPro';
import { CHART_SELECTOR } from '../tests/constants';

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

describe.skipIf(isJSDOM)('<ScatterChartPro /> - Zoom', () => {
  const { render } = createRenderer();

  const scatterChartProps = {
    series: [
      {
        data: [
          {
            x: 1,
            y: 10,
          },
          {
            x: 2,
            y: 20,
          },
          {
            x: 1,
            y: 30,
          },
          {
            x: 3,
            y: 30,
          },
          {
            x: 3,
            y: 10,
          },
        ],
      },
    ],
    xAxis: [
      {
        zoom: true,
        height: 30,
        id: 'x',
      },
    ],
    yAxis: [
      {
        zoom: true,
        width: 30,
        id: 'y',
        position: 'right',
      },
    ],
    width: 130,
    height: 130,
    margin: 10,
    slotProps: { tooltip: { trigger: 'none' } },
  } as const;

  const options = {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <div style={{ width: 130, height: 130 }}>{children}</div>
    ),
  };

  it('should zoom on wheel', async () => {
    const onZoomChange = vi.fn();
    const { user } = render(
      <ScatterChartPro {...scatterChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);
    expect(getAxisTickValues('y')).to.deep.equal(['10', '20', '30']);

    const svg = document.querySelector(CHART_SELECTOR)!;

    await user.pointer([
      {
        target: svg,
        coords: { x: 80, y: 50 },
      },
    ]);

    // scroll, we scroll exactly in the center of the chart
    // This will leave only x=2 and y=20 ticks visible
    fireEvent.wheel(svg, { deltaY: -100, clientX: 80, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(1);
    expect(getAxisTickValues('x')).to.deep.equal(['2']);
    expect(getAxisTickValues('y')).to.deep.equal(['20']);

    // scroll back
    fireEvent.wheel(svg, { deltaY: 100, clientX: 80, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(2);
    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);
    expect(getAxisTickValues('y')).to.deep.equal(['10', '20', '30']);
  });

  ['MouseLeft', 'TouchA'].forEach((pointerName) => {
    it(`should pan on ${pointerName} drag`, async () => {
      const onZoomChange = vi.fn();
      const { user } = render(
        <ScatterChartPro
          {...scatterChartProps}
          initialZoom={[
            { axisId: 'x', start: 75, end: 100 },
            { axisId: 'y', start: 75, end: 100 },
          ]}
          onZoomChange={onZoomChange}
        />,
        options,
      );

      const svg = document.querySelector(CHART_SELECTOR)!;

      expect(getAxisTickValues('x')).to.deep.equal(['2.6', '2.8', '3.0']);
      expect(getAxisTickValues('y')).to.deep.equal(['26', '28', '30']);

      // we drag one position
      await user.pointer([
        {
          keys: `[${pointerName}>]`,
          target: svg,
          coords: { x: 15, y: 85 },
        },
        {
          pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
          target: svg,
          coords: { x: 100, y: 5 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 100, y: 5 },
        },
      ]);
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(1);
      expect(getAxisTickValues('x')).to.deep.equal(['2.0', '2.2', '2.4']);
      expect(getAxisTickValues('y')).to.deep.equal(['20', '22', '24']);

      // we drag all the way to the left so 1 should be visible
      await user.pointer([
        {
          keys: `[${pointerName}>]`,
          target: svg,
          coords: { x: 15, y: 85 },
        },
        {
          pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
          target: svg,
          coords: { x: 300, y: -200 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 300, y: -200 },
        },
      ]);
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.mock.calls.length).to.equal(2);
      expect(getAxisTickValues('x')).to.deep.equal(['1.0', '1.2', '1.4']);
      expect(getAxisTickValues('y')).to.deep.equal(['10', '12', '14']);
    });
  });

  it('should zoom on pinch', async () => {
    const onZoomChange = vi.fn();
    const { user } = render(
      <ScatterChartPro {...scatterChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);
    expect(getAxisTickValues('y')).to.deep.equal(['10', '20', '30']);

    const svg = document.querySelector(CHART_SELECTOR)!;

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
    expect(getAxisTickValues('x')).to.deep.equal(['2.0']);
    expect(getAxisTickValues('y')).to.deep.equal(['20']);
  });

  it('should zoom on tap and drag', async () => {
    const onZoomChange = vi.fn();
    const { user } = render(
      <ScatterChartPro
        {...scatterChartProps}
        onZoomChange={onZoomChange}
        zoomInteractionConfig={{
          zoom: ['tapAndDrag'],
          pan: [],
        }}
      />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);

    const svg = document.querySelector(CHART_SELECTOR)!;

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
    expect(getAxisTickValues('x').length).to.be.lessThan(3);
  });
});
