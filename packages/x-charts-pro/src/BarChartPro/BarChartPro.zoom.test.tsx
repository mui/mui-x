/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen, fireEvent } from '@mui/internal-test-utils';
import { describeSkipIf, isJSDOM, testSkipIf } from 'test/utils/skipIf';
import * as sinon from 'sinon';
import { BarChartPro } from './BarChartPro';

describeSkipIf(isJSDOM)('<BarChartPro /> - Zoom', () => {
  const { render } = createRenderer();

  const barChartProps = {
    series: [
      {
        data: [10, 20, 30, 40],
      },
    ],
    xAxis: [
      {
        scaleType: 'band',
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
      <BarChartPro {...barChartProps} onZoomChange={onZoomChange} />,
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
      await new Promise((r) => requestAnimationFrame(r));
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
      await new Promise((r) => requestAnimationFrame(r));
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
        <BarChartPro
          {...barChartProps}
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
          coords: { x: 90, y: 20 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 90, y: 20 },
        },
      ]);
      // Wait the animation frame
      await new Promise((r) => requestAnimationFrame(r));

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
          coords: { x: 300, y: 20 },
        },
        {
          keys: `[/${pointerName}]`,
          target: svg,
          coords: { x: 300, y: 20 },
        },
      ]);
      // Wait the animation frame
      await new Promise((r) => requestAnimationFrame(r));

      expect(onZoomChange.callCount).to.equal(2);
      expect(screen.queryByText('A')).not.to.equal(null);
      expect(screen.queryByText('B')).to.equal(null);
      expect(screen.queryByText('C')).to.equal(null);
      expect(screen.queryByText('D')).to.equal(null);
    });
  });

  // Technically it should work, but it's not working in the test environment
  // https://github.com/pmndrs/use-gesture/discussions/430
  testSkipIf(true)('should zoom on pinch', async () => {
    const { user } = render(<BarChartPro {...barChartProps} />, options);

    expect(screen.queryByText('A')).not.to.equal(null);
    expect(screen.queryByText('B')).not.to.equal(null);
    expect(screen.queryByText('C')).not.to.equal(null);
    expect(screen.queryByText('D')).not.to.equal(null);

    const svg = document.querySelector('svg')!;

    await user.pointer({
      keys: '[TouchA]',
      target: svg,
      coords: { x: 50, y: 50 },
    });

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

    expect(screen.queryByText('A')?.textContent).to.equal(null);
    expect(screen.queryByText('B')).not.to.equal(null);
    expect(screen.queryByText('C')).not.to.equal(null);
    expect(screen.queryByText('D')).to.equal(null);
  });
});
