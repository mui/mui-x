import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useResizeObserver } from './useResizeObserver';

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
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('should deliver the resize entries in the next animation frame', () => {
    const onResize = vi.fn();
    function TestComponent() {
      const ref = React.useRef<HTMLDivElement>(null);
      useResizeObserver(ref, onResize);
      return <div ref={ref} />;
    }
    render(<TestComponent />);
    const entries = [{} as ResizeObserverEntry];
    deliver(entries, {} as ResizeObserver);
    expect(onResize).not.toHaveBeenCalled();

    vi.advanceTimersToNextFrame();
    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onResize).toHaveBeenCalledWith(entries);
  });
});
