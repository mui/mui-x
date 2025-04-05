/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen, fireEvent, act } from '@mui/internal-test-utils';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import * as sinon from 'sinon';
import { LineChartPro } from './LineChartPro';

describeSkipIf(isJSDOM)('<LineChartPro /> - Zoom', () => {
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
      <LineChartPro {...lineChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(screen.queryByText('A')).not.to.equal(null);
    expect(screen.queryByText('B')).not.to.equal(null);
    expect(screen.queryByText('C')).not.to.equal(null);
    expect(screen.queryByText('D')).not.to.equal(null);

    const svg = document.querySelector('svg')!;

    await user.pointer([
      {
        target: svg,
        coords: { x: 50, y: 50 },
      },
    ]);

    // scroll, we scroll exactly in the center of the svg
    // And we do it 200 times which is the lowest number to trigger a zoom where both A and D are not visible
    for (let i = 0; i < 200; i += 1) {
      fireEvent.wheel(svg, { deltaY: -1, clientX: 50, clientY: 50 });
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
    }

    expect(onZoomChange.callCount).to.equal(200);
    expect(screen.queryByText('A')).to.equal(null);
    expect(screen.queryByText('B')).not.to.equal(null);
    expect(screen.queryByText('C')).not.to.equal(null);
    expect(screen.queryByText('D')).to.equal(null);

    // scroll back
    for (let i = 0; i < 200; i += 1) {
      fireEvent.wheel(svg, { deltaY: 1, clientX: 50, clientY: 50 });
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
    }

    expect(onZoomChange.callCount).to.equal(400);
    expect(screen.queryByText('A')).not.to.equal(null);
    expect(screen.queryByText('B')).not.to.equal(null);
    expect(screen.queryByText('C')).not.to.equal(null);
    expect(screen.queryByText('D')).not.to.equal(null);
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

      expect(screen.queryByText('A')).to.equal(null);
      expect(screen.queryByText('B')).to.equal(null);
      expect(screen.queryByText('C')).to.equal(null);
      expect(screen.queryByText('D')).not.to.equal(null);

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
      expect(screen.queryByText('A')).to.equal(null);
      expect(screen.queryByText('B')).to.equal(null);
      expect(screen.queryByText('C')).not.to.equal(null);
      expect(screen.queryByText('D')).to.equal(null);

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
      expect(screen.queryByText('A')).not.to.equal(null);
      expect(screen.queryByText('B')).to.equal(null);
      expect(screen.queryByText('C')).to.equal(null);
      expect(screen.queryByText('D')).to.equal(null);
    });
  });
});
