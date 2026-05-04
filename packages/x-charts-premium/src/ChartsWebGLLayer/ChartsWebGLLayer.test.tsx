import * as React from 'react';
import { createRenderer, waitFor } from '@mui/internal-test-utils';
import { ChartsDataProvider } from '../ChartsDataProvider';
import { ChartsWrapper } from '../ChartsWrapper';
import { ChartsWebGLLayer } from './ChartsWebGLLayer';
import { useWebGLContext } from './ChartsWebGLContext';

describe('<WebGLProvider />', () => {
  const { render } = createRenderer();

  // Needs WebGL2 (browser only) and StrictMode-driven double mount; skipped under
  // the conditional non-strict browser experiment.
  // eslint-disable-next-line vitest/no-disabled-tests
  it.skip('should handle WebGL context restoration', async () => {
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
});
