import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsWebGLLayer } from '../../ChartsWebGLLayer';
import { ScatterWebGLPlot } from './ScatterWebGLPlot';

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

describe.skipIf(isJSDOM)('<ScatterWebGLPlot />', () => {
  const { render } = createRenderer();

  it('mounts a canvas and draws content for the visible series', async () => {
    render(
      <ChartsDataProvider
        width={200}
        height={200}
        xAxis={[{ id: 'x', min: 0, max: 5 }]}
        yAxis={[{ id: 'y', min: 0, max: 5 }]}
        series={[
          {
            type: 'scatter',
            id: 'a',
            data: [
              { id: 1, x: 1, y: 1 },
              { id: 2, x: 2, y: 2 },
              { id: 3, x: 3, y: 3 },
            ],
            markerSize: 10,
          },
        ]}
      >
        <ChartsWrapper>
          <ChartsLayerContainer>
            <ChartsWebGLLayer>
              <ScatterWebGLPlot />
            </ChartsWebGLLayer>
          </ChartsLayerContainer>
        </ChartsWrapper>
      </ChartsDataProvider>,
    );

    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).not.to.equal(null);
      expect(canvasHasContent(canvas!)).to.equal(true);
    });
  });
});
