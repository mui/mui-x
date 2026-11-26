import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useResizeObserver', () => {
  const { render } = createRenderer();

  let deliver: ResizeObserverCallback;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          deliver = callback;
        }

        observe() {}

        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.doUnmock('@base-ui/utils/reactVersion');
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  // The hook reads the environment and the React version at module load.
  async function mountInProduction(reactMajor: number) {
    vi.stubEnv('NODE_ENV', 'production');
    vi.doMock('@base-ui/utils/reactVersion', () => ({
      isReactVersionAtLeast: (version: number) => reactMajor >= version,
    }));
    vi.resetModules();
    const { useResizeObserver } = await import('./useResizeObserver');

    const onResize = vi.fn();
    function TestComponent() {
      const ref = React.useRef<HTMLDivElement>(null);
      useResizeObserver(ref, onResize);
      return <div ref={ref} />;
    }
    const { unmount } = render(<TestComponent />);
    deliver([], {} as ResizeObserver);
    return { onResize, unmount };
  }

  it('should call the callback in the next frame on React 17', async () => {
    const { onResize } = await mountInProduction(17);
    expect(onResize).not.toHaveBeenCalled();

    vi.advanceTimersToNextFrame();
    expect(onResize).toHaveBeenCalledTimes(1);
  });

  it('should not call the callback after unmount when the observer delivers twice in a frame', async () => {
    const { onResize, unmount } = await mountInProduction(17);
    deliver([], {} as ResizeObserver);
    unmount();

    vi.advanceTimersToNextFrame();
    expect(onResize).not.toHaveBeenCalled();
  });

  it.each([18, 19])(
    'should call the callback inside the observer delivery on React %i',
    async (major) => {
      const { onResize } = await mountInProduction(major);
      expect(onResize).toHaveBeenCalledTimes(1);
    },
  );
});
