import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { createRenderer } from '@mui/internal-test-utils';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';

describe('ChartAxisZoomSliderPreview', () => {
  const { render } = createRenderer();

  it('handles two axes with zoom slider preview in a bar chart', () => {
    const { container } = render(
      <BarChartPro
        xAxis={[
          { data: ['A', 'B', 'C'], zoom: { slider: { enabled: true, preview: true } } },
          {
            scaleType: 'band',
            id: 'x2',
            position: 'bottom',
            data: ['A', 'B', 'C'],
            zoom: { slider: { enabled: true, preview: true } },
          },
        ]}
        series={[{ data: [1, 2, 3] }, { xAxisId: 'x2', data: [1, 2, 3] }]}
        height={400}
      />,
    );

    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('handles two axes with zoom slider preview in an area chart', () => {
    const { container } = render(
      <LineChartPro
        xAxis={[
          { data: [1, 2, 4], zoom: { slider: { enabled: true, preview: true } } },
          {
            id: 'x2',
            position: 'bottom',
            data: [1, 2, 4],
            zoom: { slider: { enabled: true, preview: true } },
          },
        ]}
        series={[
          { data: [1, 2, 4], area: true },
          { xAxisId: 'x2', data: [1, 2, 4], area: true },
        ]}
        height={400}
      />,
    );

    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('handles two axes with zoom slider preview in a scatter chart', () => {
    const { container } = render(
      <ScatterChartPro
        xAxis={[
          { zoom: { slider: { enabled: true, preview: true } } },
          { id: 'x2', position: 'bottom', zoom: { slider: { enabled: true, preview: true } } },
        ]}
        series={[
          {
            data: [
              { x: 1, y: 1 },
              { x: 2, y: 2 },
              { x: 3, y: 3 },
            ],
          },
          {
            xAxisId: 'x2',
            data: [
              { x: 1, y: 2 },
              { x: 2, y: 3 },
              { x: 3, y: 4 },
            ],
          },
        ]}
        height={400}
      />,
    );

    expect(container.querySelector('svg')).not.toBeNull();
  });
});
