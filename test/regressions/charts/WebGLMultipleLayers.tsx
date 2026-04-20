import * as React from 'react';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsWebGLLayer, useWebGLLayer } from '@mui/x-charts-premium/ChartsWebGLLayer';

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
  x: number;
  y: number;
  size: number;
}) {
  const layer = useWebGLLayer();
  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    drawRef.current = () => {
      const { gl } = layer!;
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(x, y, size, size);
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
    <ChartsDataProvider
      height={200}
      width={200}
      series={[]}
      xAxis={[{ id: 'x', data: [1, 2, 3] }]}
    >
      <ChartsWrapper>
        <ChartsLayerContainer>
          <ChartsWebGLLayer>
            <ScissorPlot color={[0.2, 0.4, 0.9]} x={0} y={0} size={40} />
          </ChartsWebGLLayer>
          <ChartsWebGLLayer>
            <ScissorPlot color={[0.9, 0.2, 0.2]} x={80} y={80} size={40} />
          </ChartsWebGLLayer>
        </ChartsLayerContainer>
      </ChartsWrapper>
    </ChartsDataProvider>
  );
}
