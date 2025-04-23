/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, fireEvent, act } from '@mui/internal-test-utils';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import * as sinon from 'sinon';
import { ScatterChartPro } from './ScatterChartPro';

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

describeSkipIf(isJSDOM)('<ScatterChartPro /> - Zoom', () => {
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

  // eslint-disable-next-line mocha/no-top-level-hooks
  beforeEach(() => {
    // TODO: Remove beforeEach/afterEach after vitest becomes our main runner
    if (window?.document?.body?.style) {
      window.document.body.style.margin = '0';
    }
  });

  // eslint-disable-next-line mocha/no-top-level-hooks
  afterEach(() => {
    if (window?.document?.body?.style) {
      window.document.body.style.margin = '8px';
    }
  });

  it('should zoom on wheel', async function test() {
    this.timeout(10000);
    const onZoomChange = sinon.spy();
    const { user } = render(
      <ScatterChartPro {...scatterChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);
    expect(getAxisTickValues('y')).to.deep.equal(['10', '20', '30']);

    const svg = document.querySelector('svg')!;

    await user.pointer([
      {
        target: svg,
        coords: { x: 50, y: 50 },
      },
    ]);

    // scroll, we scroll exactly in the center of the svg
    // This will leave only x2 and y20 visible
    for (let i = 0; i < 200; i += 1) {
      fireEvent.wheel(svg, { deltaY: -1, clientX: 50, clientY: 50 });
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
    }

    expect(onZoomChange.callCount).to.equal(200);
    expect(getAxisTickValues('x')).to.deep.equal(['2']);
    expect(getAxisTickValues('y')).to.deep.equal(['20']);

    // scroll back
    for (let i = 0; i < 200; i += 1) {
      fireEvent.wheel(svg, { deltaY: 1, clientX: 50, clientY: 50 });
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
    }

    expect(onZoomChange.callCount).to.equal(400);
    expect(getAxisTickValues('x')).to.deep.equal(['1', '2', '3']);
    expect(getAxisTickValues('y')).to.deep.equal(['10', '20', '30']);
  });

  ['MouseLeft', 'TouchA'].forEach((pointerName) => {
    it(`should pan on ${pointerName} drag`, async () => {
      const onZoomChange = sinon.spy();
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

      const svg = document.querySelector('svg')!;

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

      expect(onZoomChange.callCount).to.equal(1);
      expect(getAxisTickValues('x')).to.deep.equal(['2.0', '2.2', '2.4']);
      expect(getAxisTickValues('y')).to.deep.equal(['20', '22', '24']);

      // we drag all the way to the left so 1 should be visible
      await user.pointer([
        {
          keys: `[${pointerName}>]`,
          target: svg,
          coords: { x: 15, y: 300 },
        },
        {
          pointerName: pointerName === 'MouseLeft' ? undefined : pointerName,
          target: svg,
          coords: { x: 300, y: 5 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 300, y: 5 },
        },
      ]);
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));

      expect(onZoomChange.callCount).to.equal(2);
      expect(getAxisTickValues('x')).to.deep.equal(['1.0', '1.2', '1.4']);
      expect(getAxisTickValues('y')).to.deep.equal(['10', '12', '14']);
    });
  });
});
