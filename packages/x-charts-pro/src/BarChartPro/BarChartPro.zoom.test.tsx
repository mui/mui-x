/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import * as sinon from 'sinon';
import { BarChartPro } from './BarChartPro';

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
    const onZoomChange = sinon.spy();
    const { user } = render(
      <BarChartPro
        {...barChartProps}
        onZoomChange={onZoomChange}
        margin={{ top: 0, left: 0, right: 15, bottom: 0 }}
      />,
      options,
    );
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

    const svg = document.querySelector('svg')!;

    await user.pointer([
      {
        target: svg,
        coords: { x: 0, y: 50 },
      },
    ]);

    // we scroll on the left side of the chart to remove the D ticks
    fireEvent.wheel(svg, { deltaY: -500, clientX: 0, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.callCount).to.equal(1);
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C']);

    // scroll back
    fireEvent.wheel(svg, { deltaY: 500, clientX: 0, clientY: 50 });
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.callCount).to.equal(2);
    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);
  });

  ['MouseLeft', 'TouchA'].forEach((pointerName) => {
    it(`should pan on ${pointerName} drag`, async () => {
      const onZoomChange = sinon.spy();
      const { user } = render(
        <BarChartPro
          {...barChartProps}
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
          coords: { x: 90, y: 20 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 90, y: 20 },
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
          coords: { x: 300, y: 20 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 300, y: 20 },
        },
      ]);
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.equal(2);
      expect(getAxisTickValues('x')).to.deep.equal(['A']);
    });
  });

  it('should zoom on pinch', async () => {
    const onZoomChange = sinon.spy();
    const { user } = render(
      <BarChartPro {...barChartProps} onZoomChange={onZoomChange} />,
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

    expect(onZoomChange.callCount).to.be.above(0);
    expect(getAxisTickValues('x')).to.deep.equal(['B', 'C']);
  });
});
