/* eslint-disable no-promise-executor-return */
import * as React from 'react';
import { createRenderer, act } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { vi } from 'vitest';
import { LineChartPro, type LineChartProProps } from '../LineChartPro/LineChartPro';
import { chartAxisZoomSliderThumbClasses } from './internals/chartAxisZoomSliderThumbClasses';
import { chartAxisZoomSliderTrackClasses } from './internals/chartAxisZoomSliderTrackClasses';

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

describe.skipIf(isJSDOM)('<ChartZoomSlider />', () => {
  const { render } = createRenderer();

  const lineChartProps: LineChartProProps = {
    series: [
      {
        data: [10, 20, 30, 40],
      },
    ],
    xAxis: [
      {
        scaleType: 'point',
        data: ['A', 'B', 'C', 'D'],
        zoom: {
          slider: {
            enabled: true,
          },
        },
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

  it('should pan when using the slider track', async () => {
    const onZoomChange = vi.fn();
    const { user } = render(
      <LineChartPro
        {...lineChartProps}
        onZoomChange={onZoomChange}
        initialZoom={[{ axisId: 'x', start: 50, end: 100 }]}
      />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['C', 'D']);

    // Get the zoom slider thumb elements
    const sliderTrack = document.querySelector(`.${chartAxisZoomSliderTrackClasses.active}`)!;

    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: sliderTrack,
        coords: { x: 50, y: 0 },
      },
      {
        target: sliderTrack,
        coords: { x: 20, y: 0 },
      },
      {
        keys: '[/MouseLeft]',
        target: sliderTrack,
        coords: { x: 20, y: 0 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.equal(1);
    // The visible area should have shifted left
    expect(getAxisTickValues('x')).to.deep.equal(['B']);
  });

  it('should zoom pulling the slider thumb', async () => {
    const onZoomChange = vi.fn();
    const { user } = render(
      <LineChartPro {...lineChartProps} onZoomChange={onZoomChange} />,
      options,
    );

    expect(getAxisTickValues('x')).to.deep.equal(['A', 'B', 'C', 'D']);

    // Find the slider elements
    const startThumb = document.querySelector(`.${chartAxisZoomSliderThumbClasses.start}`)!;
    const endThumb = document.querySelector(`.${chartAxisZoomSliderThumbClasses.end}`)!;

    // Move the start thumb to zoom in from the left
    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: startThumb,
        coords: { x: 0, y: 0 },
      },
      {
        target: startThumb,
        coords: { x: 40, y: 0 },
      },
      {
        keys: '[/MouseLeft]',
        target: startThumb,
        coords: { x: 40, y: 0 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.be.above(0);
    expect(getAxisTickValues('x')).to.not.include('A');

    // Reset zoom change spy
    onZoomChange.mockClear();

    // Move the end thumb to zoom in from the right
    await user.pointer([
      {
        keys: '[MouseLeft>]',
        target: endThumb,
        coords: { x: 0, y: 0 },
      },
      {
        target: endThumb,
        coords: { x: 60, y: 0 },
      },
      {
        keys: '[/MouseLeft]',
        target: endThumb,
        coords: { x: 60, y: 0 },
      },
    ]);
    await act(async () => new Promise((r) => requestAnimationFrame(r)));

    expect(onZoomChange.mock.calls.length).to.be.above(0);
    expect(getAxisTickValues('x')).to.not.include('D');
  });
});
