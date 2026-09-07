import * as React from 'react';
import { isJSDOM } from 'test/utils/skipIf';
import {
  absorbObserverFrames,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
} from 'test/utils/scheduler';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { describe, it, vi } from 'vitest';

describe('absorbObserverFrames', () => {
  const { renderSettled } = createSchedulerRenderer({
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
