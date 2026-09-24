import * as React from 'react';
import { isJSDOM } from 'test/utils/skipIf';
import {
  absorbObserverFrames,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { describe, expect, it, vi } from 'vitest';

// Resizes itself from its own ResizeObserver, so each delivery commits React state
// that produces the next delivery. Chains like this are what a fixed number of frames
// cannot cover, and unlike the timeline it chains deterministically on any machine.
function ResizingBox({
  maximumWidth,
  onResize,
}: {
  maximumWidth: number;
  onResize?: (width: number) => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(100);

  React.useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      onResize?.(entry.contentRect.width);
      if (entry.contentRect.width < maximumWidth) {
        setWidth(entry.contentRect.width + 100);
      }
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, [maximumWidth, onResize]);

  return <div ref={ref} style={{ width, height: 20 }} />;
}

describe('absorbObserverFrames', () => {
  const { render, renderSettled } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  it.skipIf(isJSDOM)(
    'should leave no observer delivery pending after a settled render',
    async () => {
      await renderSettled(
        <EventTimelinePremium
          resources={[{ id: 'r1', title: 'Engineering' }]}
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        />,
      );

      // Raw time outside act: an update the absorb failed to drain would land here
      // un-acted, and the console guard fails the test with the React act warning.
      // This has to outlast the virtualizer's `resizeThrottleMs` (100ms), because the
      // update that escapes is the trailing edge of that throttle rather than a frame.
      await new Promise<void>((resolve) => {
        setTimeout(resolve, 250);
      });
    },
  );

  it.skipIf(isJSDOM)('should absorb a chain of observer-driven resizes', async () => {
    const widths: number[] = [];

    await renderSettled(<ResizingBox maximumWidth={600} onResize={(w) => widths.push(w)} />);

    // Every step of the chain has to land inside the drain, so the whole run is acted.
    expect(widths).to.deep.equal([100, 200, 300, 400, 500, 600]);
  });

  it.skipIf(isJSDOM)('should throw when observer-driven layout never settles', async () => {
    const view = render(<ResizingBox maximumWidth={Infinity} />);
    try {
      await expect(absorbObserverFrames()).rejects.toThrow('did not settle within');
    } finally {
      view.unmount();
    }
  });

  it.skipIf(isJSDOM)('should resolve while fake timers are installed', async () => {
    // Fake timers replace the global rAF; the absorb must ride the capture instead.
    vi.useFakeTimers();
    try {
      await absorbObserverFrames();
    } finally {
      vi.useRealTimers();
    }
  });

  it.skipIf(!isJSDOM)('should no-op in jsdom even under fake timers', async () => {
    // jsdom's rAF is timer-backed, so anything but the early return would hang here.
    vi.useFakeTimers();
    try {
      await absorbObserverFrames();
    } finally {
      vi.useRealTimers();
    }
  });
});
