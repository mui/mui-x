import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { adapter, createSchedulerRenderer } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { describe, it, expect, beforeEach } from 'vitest';

// Matches `HOUR_HEIGHT` in DayTimeGrid.tsx.
const HOUR_HEIGHT = 46;

// The scroll position is real layout (`scrollTop` is clamped to the overflow), which jsdom does not implement.
describe.skipIf(isJSDOM)('<DayTimeGrid /> - viewConfig (visibleStartTime)', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03') });

  beforeEach(() => {
    clearWarningsCache();
  });

  // 2025-07-03 is a Thursday.
  const visibleDate = adapter.date('2025-07-03T00:00:00Z', 'default');

  function getScrollContainer() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGrid}`)!;
  }

  function renderCalendar(props: Partial<React.ComponentProps<typeof EventCalendar>> = {}) {
    // A short host so the time grid overflows and can actually scroll.
    return render(
      <div style={{ height: '400px' }}>
        <EventCalendar events={[]} visibleDate={visibleDate} view="week" {...props} />
      </div>,
    );
  }

  it('should scroll to 7 AM by default', () => {
    renderCalendar();
    expect(getScrollContainer().scrollTop).to.equal(7 * HOUR_HEIGHT);
  });

  it('should scroll to the configured hour', () => {
    renderCalendar({ viewConfig: { week: { visibleStartTime: 10 } } });
    expect(getScrollContainer().scrollTop).to.equal(10 * HOUR_HEIGHT);
  });

  it('should scroll relative to the start of the displayed hour range', () => {
    renderCalendar({ viewConfig: { week: { startTime: 8, endTime: 20, visibleStartTime: 10 } } });
    expect(getScrollContainer().scrollTop).to.equal(2 * HOUR_HEIGHT);
  });

  it('should stay at the top when visibleStartTime equals startTime', () => {
    renderCalendar({ viewConfig: { week: { startTime: 8, endTime: 20, visibleStartTime: 8 } } });
    expect(getScrollContainer().scrollTop).to.equal(0);
  });

  it('should read the config of the rendered view', () => {
    renderCalendar({
      view: 'day',
      viewConfig: { day: { visibleStartTime: 9 }, week: { visibleStartTime: 12 } },
    });
    expect(getScrollContainer().scrollTop).to.equal(9 * HOUR_HEIGHT);
  });

  it('should keep the scroll position when navigating to another period', async () => {
    const { user } = renderCalendar();
    const container = getScrollContainer();
    container.scrollTop = 300;

    await user.click(screen.getByRole('button', { name: /next week/i }));

    expect(getScrollContainer().scrollTop).to.equal(300);
  });

  it('should stay at the top and warn when visibleStartTime is outside the displayed range', () => {
    expect(() => {
      renderCalendar({ viewConfig: { week: { startTime: 8, endTime: 20, visibleStartTime: 6 } } });
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid `visibleStartTime`']);
    expect(getScrollContainer().scrollTop).to.equal(0);
  });
});
