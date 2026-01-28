import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';

import { BarChartPro } from './BarChartPro';

describe('<BarChartPro /> - Grid', () => {
  const { render } = createRenderer();

  const barChartProps = {
    series: [{ data: [10, 20, 30, 40] }],
    xAxis: [{ data: ['A', 'B', 'C', 'D'], zoom: true, height: 30, id: 'x' }],
    yAxis: [{ position: 'none' }],
    height: 130,
    slotProps: { tooltip: { trigger: 'none' } },
  } as const;

  const options = {
    wrapper: ({ children }: { children?: React.ReactNode }) => (
      <div style={{ width: 100, height: 130 }}>{children}</div>
    ),
  };

  it('should only display grid inside the drawing area', async () => {
    const { setProps } = render(
      <BarChartPro
        {...barChartProps}
        width={200}
        zoomData={[]}
        margin={{ top: 0, left: 50, right: 50, bottom: 0 }}
        grid={{ vertical: true }}
      />,
      options,
    );

    // Without zoom, 5 vertical lines (the 4 ticks + 1 at the end of the axis)
    expect(Array.from(document.querySelectorAll(`.MuiChartsGrid-verticalLine`)).length).to.equal(5);

    // With small zoom, first and last line should be removed
    setProps({ zoomData: [{ axisId: 'x', start: 10, end: 90 }] });
    expect(Array.from(document.querySelectorAll(`.MuiChartsGrid-verticalLine`)).length).to.equal(3);
  });
});
