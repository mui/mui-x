/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import * as sinon from 'sinon';
import { LineChartPro } from './LineChartPro';

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
    const onZoomChange = sinon.spy();
    const { user } = render(
      <LineChartPro {...lineChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

    const svg = document.querySelector('svg')!;

    await user.pointer([
      {
        target: svg,
        coords: { x: 15, y: 50 },
      },
    ]);

    fireEvent.wheel(svg, { deltaY: -10, clientX: 15, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.callCount).to.equal(1);
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C']);

    // scroll back
    fireEvent.wheel(svg, { deltaY: 10, clientX: 15, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.callCount).to.equal(2);
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

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

    expect(onZoomChange.callCount).to.equal(3);
    expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);

    // scroll back
    fireEvent.wheel(svg, { deltaY: 10, clientX: 90, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.callCount).to.equal(4);
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);
  });

  ['MouseLeft', 'TouchA'].forEach((pointerName) => {
    it(`should pan on ${pointerName} drag`, async () => {
      const onZoomChange = sinon.spy();
      const { user } = render(
        <LineChartPro
          {...lineChartProps}
          initialZoom={[{ axisId: 'x', start: 75, end: 100 }]}
          onZoomChange={onZoomChange}
        />,
        options,
      );

      expect(getAxisTickValues('x')).to.deep.equal(['D']);

      const svg = document.querySelector('svg')!;

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

      expect(onZoomChange.callCount).to.equal(1);
      expect(getAxisTickValues('x')).to.deep.equal(['C']);

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

      expect(onZoomChange.callCount).to.equal(2);
      expect(getAxisTickValues('x')).to.deep.equal(['A']);
    });
  });

  it('should pan with area series enabled', async () => {
    const onZoomChange = sinon.spy();
    const { user } = render(
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

    expect(getAxisTickValues('x')).to.deep.equal(['D']);

    const target = document.querySelector('.MuiAreaElement-root')!;

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

    expect(onZoomChange.callCount).to.equal(1);
    expect(getAxisTickValues('x')).to.deep.equal(['C']);

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

    expect(onZoomChange.callCount).to.equal(2);
    expect(getAxisTickValues('x')).to.deep.equal(['A']);
  });

  it('should zoom on pinch', async () => {
    const onZoomChange = sinon.spy();
    const { user } = render(
      <LineChartPro {...lineChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

    const svg = document.querySelector('svg')!;

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

    expect(onZoomChange.callCount).to.be.above(0);
    expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);
  });
});
