import * as React from 'react';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { ChartsDataProvider } from '../ChartsDataProvider';
import { ChartsWrapper } from '../ChartsWrapper';
import { ChartsWebGLLayer } from './ChartsWebGLLayer';
import { useWebGLContext, useWebGLLayer } from './ChartsWebGLContext';

describe('<WebGLProvider />', () => {
  const { render } = createRenderer();

  it.skipIf(isJSDOM)('should handle WebGL context restoration', async () => {
    let contextValue: WebGL2RenderingContext | null = null;

    function TestComponent() {
      const context = useWebGLContext();

      React.useEffect(() => {
        contextValue = context;
      }, [context]);

      return null;
    }

    render(
      <ChartsDataProvider
        height={100}
        width={100}
        series={[]}
        xAxis={[{ id: 'x', data: [1, 2, 3] }]}
      >
        <ChartsWrapper>
          <ChartsWebGLLayer data-testid="webgl-canvas">
            <TestComponent />
          </ChartsWebGLLayer>
        </ChartsWrapper>
      </ChartsDataProvider>,
    );

    expect(contextValue).to.be.instanceOf(WebGL2RenderingContext);

    // Get the WEBGL_lose_context extension
    const extension = contextValue!.getExtension('WEBGL_lose_context');

    // Simulate context loss
    extension!.loseContext();
    expect(contextValue!.isContextLost()).to.equal(true);

    // Wait for lost context to stop being provided
    await waitFor(() => {
      expect(contextValue).to.equal(null);
    });

    // Simulate context restoration
    extension!.restoreContext();

    // Wait for context to be restored
    await waitFor(() => {
      expect(contextValue).to.be.instanceOf(WebGL2RenderingContext);
      expect(contextValue!.isContextLost()).to.equal(false);
    });
  });

  it.skipIf(isJSDOM)('should only draw once the canvas has been sized', async () => {
    /* Sizes of the drawing buffer at the time of each draw. */
    const draws: [number, number][] = [];

    function TestComponent() {
      const layer = useWebGLLayer();
      const drawRef = React.useRef<(() => void) | null>(null);

      React.useEffect(() => {
        if (!layer) {
          return undefined;
        }

        drawRef.current = () => {
          draws.push([layer.gl.drawingBufferWidth, layer.gl.drawingBufferHeight]);
        };

        const unregister = layer.registerDraw(drawRef);
        layer.requestRender();

        return unregister;
      }, [layer]);

      return null;
    }

    render(
      <ChartsDataProvider
        height={300}
        width={500}
        series={[]}
        xAxis={[{ id: 'x', data: [1, 2, 3] }]}
      >
        <ChartsWrapper>
          <ChartsWebGLLayer data-testid="webgl-canvas">
            <TestComponent />
          </ChartsWebGLLayer>
        </ChartsWrapper>
      </ChartsDataProvider>,
    );

    const canvas = screen.getByTestId('webgl-canvas') as HTMLCanvasElement;

    await waitFor(() => {
      expect(draws.length).to.be.greaterThan(0);
    });

    /* Let any follow-up draw triggered by the resize observer land. */
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });

    /* A single draw, at the size the canvas ends up with. Drawing before the resize observer sizes
     * the canvas would both waste a render and be discarded, as sizing resets the drawing buffer. */
    expect(draws).to.deep.equal([[canvas.width, canvas.height]]);
  });
});
