import * as React from 'react';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { isJSDOM } from 'test/utils/skipIf';
import { getInteractionStep } from './ScatterAsync';

describe('getInteractionStep', () => {
  it('is a multiple of nBatches, so the sample is a subset of batch 0', () => {
    expect(getInteractionStep(60000, 6, 2000) % 6).to.equal(0);
    expect(getInteractionStep(100000, 10, 2000) % 10).to.equal(0);
  });

  it('equals the batch-0 stride when batch 0 already fits the budget', () => {
    // count / nBatches = 1000 points in batch 0 <= budget, no coarsening.
    expect(getInteractionStep(6000, 6, 2000)).to.equal(6);
  });

  it('coarsens beyond the batch-0 stride to stay within the budget', () => {
    // Batch 0 would be 12000 points; coarsen by 6x to land near 2000.
    const step = getInteractionStep(120000, 10, 2000);
    expect(step % 10).to.equal(0);
    expect(120000 / step).to.be.at.most(2000);
  });

  it('returns 1 when there are no batches', () => {
    expect(getInteractionStep(0, 0, 2000)).to.equal(1);
  });
});

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
    // area, so the stride-based batches' union completes with one circle per point.
    await waitFor(() => {
      expect(container.querySelectorAll('circle').length).to.equal(POINT_COUNT);
    });
  });
});
