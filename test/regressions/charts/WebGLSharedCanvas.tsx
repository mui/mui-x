import * as React from 'react';
import { ChartsDataProviderPremium } from '@mui/x-charts-premium/ChartsDataProviderPremium';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsLayerContainer } from '@mui/x-charts/ChartsLayerContainer';
import { ChartsWebGLLayer } from '@mui/x-charts-premium/ChartsWebGLLayer';
import { useWebGLLayer } from '@mui/x-charts-premium/internals';
/**
 * Draws a blue rectangle using scissor test.
 * Positioned at the top-left quadrant.
 */
function BluePlot() {
  const layer = useWebGLLayer();
  const drawRef = React.useRef<(() => void) | null>(null);

  drawRef.current = () => {
    const { gl } = layer!;
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(10, 10, 80, 80);
    gl.clearColor(0.2, 0.4, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);
  };

  React.useEffect(() => {
    if (!layer) {
      return undefined;
    }
    return layer.webGLRegisterDraw(drawRef);
  }, [layer]);

  React.useEffect(() => {
    layer?.webGLRequestRender();
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

  drawRef.current = () => {
    const { gl } = layer!;
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(50, 50, 80, 80);
    gl.clearColor(0.9, 0.2, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.SCISSOR_TEST);
  };

  React.useEffect(() => {
    if (!layer) {
      return undefined;
    }
    return layer.webGLRegisterDraw(drawRef);
  }, [layer]);

  React.useEffect(() => {
    layer?.webGLRequestRender();
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
    <div style={{ width: 300, height: 300 }}>
      <ChartsDataProviderPremium
        height={200}
        width={200}
        series={[]}
        xAxis={[{ id: 'x', data: [1, 2, 3] }]}
      >
        <ChartsWrapper>
          <ChartsLayerContainer>
            <ChartsWebGLLayer>
              <BluePlot />
              <RedPlot />
            </ChartsWebGLLayer>
          </ChartsLayerContainer>
        </ChartsWrapper>
      </ChartsDataProviderPremium>
    </div>
  );
}
