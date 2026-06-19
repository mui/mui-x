import * as React from 'react';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { isJSDOM } from 'test/utils/skipIf';

// rAF-driven progressive reveal: browser only.
describe.skipIf(isJSDOM)('ScatterAsync - progressive renderer', () => {
  const { render } = createRenderer();

  const POINT_COUNT = 2500;
  const data = Array.from({ length: POINT_COUNT }, (_, i) => ({
    id: i,
    x: i % 100,
    y: Math.floor(i / 100),
  }));

  const props = {
    series: [{ data }],
    xAxis: [{ position: 'none' }],
    yAxis: [{ position: 'none' }],
    width: 200,
    height: 200,
    margin: 0,
    // Force the progressive renderer regardless of point count.
    renderer: 'svg-progressive',
  } as const;

  it('progressively paints every point across reveal frames', async () => {
    const { container } = render(<ScatterChart {...props} />);

    // The reveal ramps across animation frames; every point is in the drawing
    // area, so the strided batches' union completes with one circle per point.
    await waitFor(() => {
      expect(container.querySelectorAll('circle').length).to.equal(POINT_COUNT);
    });
  });
});
