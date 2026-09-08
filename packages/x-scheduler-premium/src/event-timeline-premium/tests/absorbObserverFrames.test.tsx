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

      // Raw frames outside act: a delivery the absorb failed to drain would land here
      // un-acted, and the console guard fails the test with the React act warning.
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });
    },
  );

  it.skipIf(isJSDOM)(
    'should absorb a resize caused by an observer-driven React update',
    async () => {
      const widths: number[] = [];

      await renderSettled(
        <ResizingBox maximumWidth={600} onResize={(width) => widths.push(width)} />,
      );

      expect(widths).toEqual([100, 200, 300, 400, 500, 600]);
    },
  );

  it.skipIf(isJSDOM)('should fail when observer-driven layout never settles', async () => {
    const view = render(<ResizingBox maximumWidth={Infinity} />);
    try {
      await expect(absorbObserverFrames()).rejects.toThrow(
        'the DOM did not settle after 10 observer frame pairs',
      );
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
