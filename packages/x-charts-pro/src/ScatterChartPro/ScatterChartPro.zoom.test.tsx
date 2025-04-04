/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen, fireEvent, act } from '@mui/internal-test-utils';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import * as sinon from 'sinon';
import { ScatterChartPro } from './ScatterChartPro';

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

  it('should zoom on wheel', async () => {
    const onZoomChange = sinon.spy();
    const { user } = render(
      <ScatterChartPro {...scatterChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(screen.queryByText('1')).not.to.equal(null);
    expect(screen.queryByText('2')).not.to.equal(null);
    expect(screen.queryByText('3')).not.to.equal(null);
    expect(screen.queryByText('10')).not.to.equal(null);
    expect(screen.queryByText('20')).not.to.equal(null);
    expect(screen.queryByText('30')).not.to.equal(null);

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
    expect(screen.queryByText('1')).to.equal(null);
    expect(screen.queryByText('2')).not.to.equal(null);
    expect(screen.queryByText('3')).to.equal(null);
    expect(screen.queryByText('10')).to.equal(null);
    expect(screen.queryByText('20')).not.to.equal(null);
    expect(screen.queryByText('30')).to.equal(null);

    // scroll back
    for (let i = 0; i < 200; i += 1) {
      fireEvent.wheel(svg, { deltaY: 1, clientX: 50, clientY: 50 });
      // Wait the animation frame
      await act(async () => new Promise((r) => requestAnimationFrame(r)));
    }

    expect(onZoomChange.callCount).to.equal(400);
    expect(screen.queryByText('1')).not.to.equal(null);
    expect(screen.queryByText('2')).not.to.equal(null);
    expect(screen.queryByText('3')).not.to.equal(null);
    expect(screen.queryByText('10')).not.to.equal(null);
    expect(screen.queryByText('20')).not.to.equal(null);
    expect(screen.queryByText('30')).not.to.equal(null);
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

      expect(screen.queryByText('1.0')).to.equal(null);
      expect(screen.queryByText('2.6')).not.to.equal(null);
      expect(screen.queryByText('2.8')).not.to.equal(null);
      expect(screen.queryByText('3.0')).not.to.equal(null);
      expect(screen.queryByText('10')).to.equal(null);
      expect(screen.queryByText('26')).not.to.equal(null);
      expect(screen.queryByText('28')).not.to.equal(null);
      expect(screen.queryByText('30')).not.to.equal(null);

      const svg = document.querySelector('svg')!;

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
      expect(screen.queryByText('1.0')).to.equal(null);
      expect(screen.queryByText('2.0')).not.to.equal(null);
      expect(screen.queryByText('2.2')).not.to.equal(null);
      expect(screen.queryByText('2.4')).not.to.equal(null);
      expect(screen.queryByText('10')).to.equal(null);
      expect(screen.queryByText('20')).not.to.equal(null);
      expect(screen.queryByText('22')).not.to.equal(null);
      expect(screen.queryByText('24')).not.to.equal(null);

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

      expect(onZoomChange.callCount).to.equal(2);
      expect(screen.queryByText('2.0')).to.equal(null);
      expect(screen.queryByText('1.0')).not.to.equal(null);
      expect(screen.queryByText('1.2')).not.to.equal(null);
      expect(screen.queryByText('1.4')).not.to.equal(null);
      expect(screen.queryByText('20')).to.equal(null);
      expect(screen.queryByText('10')).not.to.equal(null);
      expect(screen.queryByText('12')).not.to.equal(null);
      expect(screen.queryByText('14')).not.to.equal(null);
    });
  });
});
