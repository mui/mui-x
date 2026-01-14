import * as React from 'react';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { render } from '@mui/internal-test-utils';

describe('ChartAxisZoomSliderPreview', () => {
  it('handles two axes with zoom slider preview', () => {
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
});
