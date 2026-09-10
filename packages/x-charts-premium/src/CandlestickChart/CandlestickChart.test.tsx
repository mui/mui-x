import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { CandlestickChart } from './CandlestickChart';

/**
 * Checks if a WebGL canvas has any non-transparent pixels drawn on it.
 */
function canvasHasContent(canvas: HTMLCanvasElement): boolean {
  const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
  if (!gl) {
    return false;
  }
  const pixels = new Uint8Array(gl.drawingBufferWidth * gl.drawingBufferHeight * 4);
  gl.readPixels(
    0,
    0,
    gl.drawingBufferWidth,
    gl.drawingBufferHeight,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixels,
  );
  return pixels.some((v) => v !== 0);
}

const sampleData: Array<[number, number, number, number]> = [
  [100, 110, 90, 105],
  [105, 115, 95, 110],
  [110, 120, 100, 108],
];

describe('<CandlestickChart /> - Visibility', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)(
    'should clear the canvas when the series is hidden via legend click',
    async () => {
      const { user } = render(
        <CandlestickChart
          height={300}
          width={300}
          series={[{ id: 'series-1', label: 'Series 1', data: sampleData }]}
          xAxis={[{ data: ['A', 'B', 'C'] }]}
          slotProps={{ legend: { toggleVisibilityOnClick: true } }}
        />,
      );

      const canvas = document.querySelector('canvas')!;

      // Wait for the WebGL content to be rendered
      await waitFor(() => {
        expect(canvasHasContent(canvas)).to.equal(true);
      });

      // Hide the series
      const series1Button = screen.getByRole('button', { name: /Series 1/ });
      await user.click(series1Button);

      // Canvas should be cleared
      await waitFor(() => {
        expect(canvasHasContent(canvas)).to.equal(false);
      });

      // Show the series again
      await user.click(series1Button);

      // Canvas should have content again
      await waitFor(() => {
        expect(canvasHasContent(canvas)).to.equal(true);
      });
    },
  );

  it.skipIf(isJSDOM)(
    'should not render canvas content when initialHiddenItems hides the series',
    async () => {
      render(
        <CandlestickChart
          height={300}
          width={300}
          series={[{ id: 'series-1', label: 'Series 1', data: sampleData }]}
          xAxis={[{ data: ['A', 'B', 'C'] }]}
          initialHiddenItems={[{ type: 'ohlc', seriesId: 'series-1' }]}
        />,
      );

      const canvas = document.querySelector('canvas')!;

      // Give enough time for any potential rendering
      await waitFor(() => {
        expect(canvasHasContent(canvas)).to.equal(false);
      });
    },
  );
});

describe('<CandlestickChart /> - Keyboard', () => {
  const { render } = createRenderer();

  it('should take the keyboard focus', async () => {
    const { user, container } = render(
      <CandlestickChart
        height={300}
        width={300}
        series={[{ id: 'series-1', data: sampleData }]}
        xAxis={[{ id: 'x', data: ['A', 'B', 'C'], zoom: { minSpan: 1, filterMode: 'discard' } }]}
      />,
    );

    await user.keyboard('{Tab}');

    // Without the keyboard navigation plugin the chart renders no accessibility proxy, so `Tab`
    // skips it and the keyboard interactions it hosts are unreachable.
    expect(container.contains(document.activeElement)).to.equal(true);
  });
});
