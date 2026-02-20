import * as React from 'react';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { ChartDataProvider } from '../ChartDataProvider';
import { ChartsWrapper } from '../ChartsWrapper';
import { ChartsWebGlLayer, useWebGLContext } from './ChartsWebGlLayer';

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
      <ChartDataProvider
        height={100}
        width={100}
        series={[]}
        xAxis={[{ id: 'x', data: [1, 2, 3] }]}
      >
        <ChartsWrapper>
          <ChartsWebGlLayer data-testid="webgl-canvas">
            <TestComponent />
          </ChartsWebGlLayer>
        </ChartsWrapper>
      </ChartDataProvider>,
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
});
