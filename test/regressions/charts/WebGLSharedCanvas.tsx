import * as React from 'react';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsWebGLLayer } from '@mui/x-charts-premium/ChartsWebGLLayer';
import { useWebGLLayer } from '@mui/x-charts-premium/ChartsWebGLLayer/ChartsWebGLContext';

/**
 * Draws a blue rectangle using scissor test.
 * Positioned at the top-left quadrant.
 */
function BluePlot() {
  const layer = useWebGLLayer();
  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    drawRef.current = () => {
      const { gl } = layer!;
      // Scissor values are fractions of the canvas buffer so the painted region stays
      // the same visual size regardless of DPR, drawing area, or axis margins.
      const w = gl.canvas.width;
      const h = gl.canvas.height;
      const side = Math.min(w, h) * 0.5;
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(Math.round(w * 0.1), Math.round(h * 0.1), Math.round(side), Math.round(side));
      gl.clearColor(0.2, 0.4, 0.9, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.SCISSOR_TEST);
    };
  }, [layer]);

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
 * Draws a red rectangle using scissor test.
 * Overlaps the blue rectangle to verify both are visible
 * and that the red one renders on top (DOM order).
 */
function RedPlot() {
  const layer = useWebGLLayer();
  const drawRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    drawRef.current = () => {
      const { gl } = layer!;
      const w = gl.canvas.width;
      const h = gl.canvas.height;
      const side = Math.min(w, h) * 0.5;
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(Math.round(w * 0.4), Math.round(h * 0.4), Math.round(side), Math.round(side));
      gl.clearColor(0.9, 0.2, 0.2, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.disable(gl.SCISSOR_TEST);
    };
  }, [layer]);

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
 * Regression test: two WebGL plots sharing one ChartsWebGLLayer canvas.
 * Expected result: a blue rectangle partially overlapped by a red rectangle.
 * If the shared rendering is broken, only one rectangle would be visible.
 */
export default function WebGLSharedCanvas() {
  return (
    <ChartsDataProvider height={200} width={200} series={[]} xAxis={[{ id: 'x', data: [1, 2, 3] }]}>
      <ChartsWrapper>
        <ChartsLayerContainer>
          <ChartsWebGLLayer>
            <BluePlot />
            <RedPlot />
          </ChartsWebGLLayer>
        </ChartsLayerContainer>
      </ChartsWrapper>
    </ChartsDataProvider>
  );
}
