import * as React from 'react';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsWebGLLayer } from '@mui/x-charts-premium/ChartsWebGLLayer';
import { useWebGLLayer } from '@mui/x-charts-premium/ChartsWebGLLayer/ChartsWebGLContext';

/**
 * Paints a scissored region with the given color on the WebGL canvas.
 * Resolves to the nearest `ChartsWebGLLayer` via React context, so each layer in the same
 * chart gets its own GL context.
 */
function ScissorPlot({
  color,
  x,
  y,
  size,
}: {
  color: [number, number, number];
  /** x offset as fraction of canvas width [0, 1] */
  x: number;
  /** y offset as fraction of canvas height [0, 1] */
  y: number;
  /** side length as fraction of the smaller canvas dimension [0, 1] */
  size: number;
}) {
  const layer = useWebGLLayer();
  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    drawRef.current = () => {
      const { gl } = layer!;
      // Use fractions of the actual canvas buffer so the region stays the same visual size
      // regardless of DPR, drawing area, or axis margins.
      const w = gl.canvas.width;
      const h = gl.canvas.height;
      const side = Math.min(w, h) * size;
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(Math.round(w * x), Math.round(h * y), Math.round(side), Math.round(side));
      gl.clearColor(color[0], color[1], color[2], 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.SCISSOR_TEST);
    };
  }, [layer, color, x, y, size]);

  React.useEffect(() => {
    if (!layer) {
      return undefined;
    }
    return layer.registerDraw(drawRef);
  }, [layer]);

  React.useEffect(() => {
    layer?.requestRender();
  }, [layer]);

  return null;
}

/**
 * Regression test: two `ChartsWebGLLayer`s in the same `ChartsDataProvider`.
 * Each layer provides its own React context and owns its own GL canvas; plots resolve to the
 * nearest layer. Both canvases stack at the same absolute position, but each uses a transparent
 * background so scissored regions from both layers remain visible via compositing.
 * Expected: blue rectangle (bottom-left in WebGL coords, top-left on screen) + red rectangle
 * (top-right), both visible.
 * If layer state were a chart-wide singleton (e.g. via a plugin), the second layer would
 * overwrite the first and only one color would render.
 */
export default function WebGLMultipleLayers() {
  return (
    <ChartsDataProvider height={200} width={200} series={[]} xAxis={[{ id: 'x', data: [1, 2, 3] }]}>
      <ChartsWrapper>
        <ChartsLayerContainer>
          <ChartsWebGLLayer>
            <ScissorPlot color={[0.2, 0.4, 0.9]} x={0.1} y={0.1} size={0.5} />
          </ChartsWebGLLayer>
          <ChartsWebGLLayer>
            <ScissorPlot color={[0.9, 0.2, 0.2]} x={0.4} y={0.4} size={0.5} />
          </ChartsWebGLLayer>
        </ChartsLayerContainer>
      </ChartsWrapper>
    </ChartsDataProvider>
  );
}
