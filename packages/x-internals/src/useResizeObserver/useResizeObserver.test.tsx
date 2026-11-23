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

  function TestComponent({ onResize }: { onResize: (entries: ResizeObserverEntry[]) => void }) {
    const ref = React.useRef<HTMLDivElement>(null);
    useResizeObserver(ref, onResize);
    return <div ref={ref} />;
  }

  // A layout change inside the delivery reports a "ResizeObserver loop" error.
  // React 17 renders a `setState` from the callback synchronously.
  it('should call the callback in the next frame, outside the observer delivery', () => {
    const onResize = vi.fn();
    render(<TestComponent onResize={onResize} />);

    const entries = [{} as ResizeObserverEntry];
    deliver(entries, {} as ResizeObserver);
    expect(onResize).not.toHaveBeenCalled();

    vi.advanceTimersToNextFrame();
    expect(onResize).toHaveBeenCalledTimes(1);
    expect(onResize).toHaveBeenCalledWith(entries);
  });
});
