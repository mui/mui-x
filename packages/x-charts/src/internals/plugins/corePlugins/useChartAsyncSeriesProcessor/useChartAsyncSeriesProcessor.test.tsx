import { createRenderer, screen, waitFor } from '@mui/internal-test-utils/createRenderer';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { isJSDOM } from 'test/utils/skipIf';

describe('async series processor plugin', () => {
  const { render } = createRenderer();

  function countScatterMarkers(container: HTMLElement) {
    return container.querySelectorAll('circle, path').length;
  }

  it('renders synchronously when asyncProcessing is false (default)', () => {
    const { container } = render(
      <ScatterChart
        width={400}
        height={200}
        series={[
          {
            data: [
              { id: 1, x: 0, y: 0 },
              { id: 2, x: 1, y: 1 },
            ],
          },
        ]}
      />,
    );
    // Markers paint without going through the loading overlay.
    expect(countScatterMarkers(container)).to.be.greaterThan(0);
  });

  it.skipIf(isJSDOM)('shows the loading overlay while the worker computes', async () => {
    const { container } = render(
      <ScatterChart
        width={400}
        height={200}
        asyncProcessing
        series={[
          {
            data: [
              { id: 1, x: 0, y: 0 },
              { id: 2, x: 1, y: 1 },
              { id: 3, x: 2, y: 0.5 },
            ],
          },
        ]}
      />,
    );

    // The loading overlay text comes from ChartsLoadingOverlay; we just check it's there
    // before the worker resolves. Render is fast so we look for any loading-overlay node.
    expect(screen.getByText(/loading/i)).not.to.equal(null);

    // Eventually the marks paint as the worker completes.
    await waitFor(
      () => {
        expect(countScatterMarkers(container)).to.be.greaterThan(0);
      },
      { timeout: 10_000 },
    );
  });

  it.skipIf(isJSDOM)('handles a line series end-to-end via the worker', async () => {
    const { container } = render(
      <LineChart
        width={400}
        height={200}
        asyncProcessing
        xAxis={[{ data: [0, 1, 2, 3, 4] }]}
        series={[{ data: [10, 20, 15, 25, 30] }]}
      />,
    );

    await waitFor(
      () => {
        // d3-line emits a `<path>` for the series stroke once data is processed.
        expect(container.querySelectorAll('path').length).to.be.greaterThan(0);
      },
      { timeout: 10_000 },
    );
  });
});
