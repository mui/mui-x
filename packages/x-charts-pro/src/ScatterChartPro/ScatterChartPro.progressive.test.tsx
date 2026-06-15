import * as React from 'react';
import { createRenderer, act, waitFor } from '@mui/internal-test-utils';
import { scatterClasses } from '@mui/x-charts/ScatterChart';
import { type ZoomData } from '@mui/x-charts/internals';
import { ScatterChartPro } from './ScatterChartPro';

describe('<ScatterChartPro /> - Progressive rendering', () => {
  const { render } = createRenderer();

  // 1500 points span 2 batches (batch size is 1000), so the first-batch cap is observable.
  const data = Array.from({ length: 1500 }, (_, i) => ({
    x: 10 + (i % 80),
    y: 10 + (Math.floor(i / 80) % 80),
  }));

  const countMarkers = () => document.querySelectorAll(`.${scatterClasses.marker}`).length;

  const fullZoom: ZoomData[] = [
    { axisId: 'x', start: 0, end: 100 },
    { axisId: 'y', start: 0, end: 100 },
  ];

  it('caps the reveal to the first batch while zooming and reveals the rest once it settles', async () => {
    const { setProps } = render(
      <ScatterChartPro
        width={500}
        height={500}
        skipAnimation
        renderer="svg-progressive"
        series={[{ data }]}
        xAxis={[{ id: 'x', zoom: true, min: 0, max: 100 }]}
        yAxis={[{ id: 'y', zoom: true, min: 0, max: 100 }]}
        zoomData={fullZoom}
      />,
    );

    await waitFor(() => expect(countMarkers()).to.equal(1500));

    // Changing the zoom marks the chart as interacting, capping the reveal to the first batch.
    await act(async () => {
      setProps({
        zoomData: [
          { axisId: 'x', start: 0, end: 95 },
          { axisId: 'y', start: 0, end: 100 },
        ],
      });
    });
    expect(countMarkers()).to.equal(1000);

    // After the interaction settles, the remaining batches are revealed again.
    await waitFor(() => expect(countMarkers()).to.equal(1500));
  });
});
