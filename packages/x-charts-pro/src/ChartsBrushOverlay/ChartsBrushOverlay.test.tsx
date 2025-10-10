import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

const { render } = createRenderer();

describe('<ChartsBrushOverlay />', () => {
  it.skipIf(isJSDOM)('should not render overlay when brush is not active', async () => {
    const { container } = render(
      <BarChartPro
        width={400}
        height={300}
        series={[{ data: [1, 2, 3] }]}
        xAxis={[{ data: ['A', 'B', 'C'], scaleType: 'band' }]}
      />,
    );

    const overlay = container.querySelector('[data-testid="charts-brush-overlay"]');
    expect(overlay).to.equal(null);
  });

  it.skipIf(isJSDOM)('should render chart successfully with brush enabled', async () => {
    const { container } = render(
      <BarChartPro
        width={400}
        height={300}
        series={[{ data: [1, 2, 3] }]}
        xAxis={[{ data: ['A', 'B', 'C'], scaleType: 'band' }]}
        zoomInteractionConfig={{
          zoom: [{ type: 'brush' }],
        }}
      />,
    );

    const svg = container.querySelector('svg');
    expect(svg).not.to.equal(null);
  });
});
