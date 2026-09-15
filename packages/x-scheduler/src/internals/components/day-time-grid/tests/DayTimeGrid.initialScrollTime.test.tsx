import * as React from 'react';
import { screen, waitFor } from '@mui/internal-test-utils';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { createSchedulerRenderer, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { describe, it, expect, beforeEach } from 'vitest';

// The scroll position is real layout (`scrollTop` is clamped to the overflow), which jsdom does not implement.
describe.skipIf(isJSDOM)('<DayTimeGrid /> - viewConfig (initialScrollTime)', () => {
  // `render` on purpose, not `renderSettled`: the synchronous tests assert before the first
  // ResizeObserver frame, which proves the mount layout effect scrolled on its own.
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-07-03') });

  beforeEach(() => {
    clearWarningsCache();
  });

  // Lets the deferred ResizeObserver callback run after a layout change.
  async function waitForObserverFrame() {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  }

  function getScrollContainer() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGrid}`)!;
  }

  function getFirstHeaderCell() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGridHeaderCell}`)!;
  }

  // Read the rendered row height rather than hardcoding the constant, so the assertions follow the layout.
  function getHourHeight() {
    return document
      .querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGridTimeAxisCell}`)!
      .getBoundingClientRect().height;
  }

  // The calendar is the rendered root so `setProps` targets it; the height keeps the time grid
  // short enough to overflow and actually scroll.
  function renderCalendar({
    style,
    ...props
  }: Partial<React.ComponentProps<typeof EventCalendar>> = {}) {
    return render(
      <EventCalendar
        events={[]}
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="week"
        style={{ height: 400, ...style }}
        {...props}
      />,
    );
  }

  it('should scroll to 7 AM by default', () => {
    renderCalendar();
    expect(getScrollContainer().scrollTop).to.equal(7 * getHourHeight());
  });

  it('should scroll to the configured hour', () => {
    renderCalendar({ viewConfig: { week: { initialScrollTime: 10 } } });
    expect(getScrollContainer().scrollTop).to.equal(10 * getHourHeight());
  });

  it('should scroll relative to the start of the displayed hour range', () => {
    renderCalendar({ viewConfig: { week: { startTime: 8, endTime: 20, initialScrollTime: 10 } } });
    expect(getScrollContainer().scrollTop).to.equal(2 * getHourHeight());
  });

  it('should stay at the top when initialScrollTime equals startTime', () => {
    // A range starting before 7 AM, so the default would scroll and only the explicit value stays at 0.
    renderCalendar({ viewConfig: { week: { startTime: 3, endTime: 20, initialScrollTime: 3 } } });
    expect(getScrollContainer().scrollTop).to.equal(0);
  });

  it('should clamp to the bottom when the hour cannot reach the top of the viewport', () => {
    renderCalendar({ viewConfig: { week: { startTime: 8, endTime: 20, initialScrollTime: 19 } } });
    const container = getScrollContainer();
    expect(container.scrollTop).to.be.greaterThan(0);
    expect(container.scrollTop).to.equal(container.scrollHeight - container.clientHeight);
  });

  it('should follow the rendered row height', () => {
    const style = document.createElement('style');
    style.textContent = `.${eventCalendarClasses.dayTimeGridContainer} { --hour-height: 60px !important; }`;
    document.head.appendChild(style);
    try {
      renderCalendar();
      expect(getHourHeight()).to.equal(60);
      expect(getScrollContainer().scrollTop).to.equal(7 * 60);
    } finally {
      document.head.removeChild(style);
    }
  });

  it('should scroll once the grid gets a height when it mounts hidden', async () => {
    const view = renderCalendar({ style: { display: 'none' } });
    expect(getScrollContainer().scrollTop).to.equal(0);

    view.setProps({ style: { height: 400 } });
    expect(getHourHeight()).to.be.greaterThan(0);

    await waitFor(() => {
      expect(getScrollContainer().scrollTop).to.equal(7 * getHourHeight());
    });
  });

  it('should scroll once the grid can scroll when it mounts without a fixed height', async () => {
    const view = renderCalendar({ style: { height: undefined } });
    const container = getScrollContainer();
    expect(container.scrollHeight).to.equal(container.clientHeight);
    expect(container.scrollTop).to.equal(0);

    view.setProps({ style: { height: 400 } });

    await waitFor(() => {
      expect(getScrollContainer().scrollTop).to.equal(7 * getHourHeight());
    });
  });

  it('should keep the scroll position when the container resizes', async () => {
    const view = renderCalendar();
    const container = getScrollContainer();
    const initialClientHeight = container.clientHeight;
    container.scrollTop = 300;

    view.setProps({ style: { height: 500 } });
    await waitForObserverFrame();

    expect(container.clientHeight).to.be.greaterThan(initialClientHeight);
    expect(container.scrollTop).to.equal(300);
  });

  it('should read the config of the rendered view', () => {
    renderCalendar({
      view: 'day',
      viewConfig: { day: { initialScrollTime: 9 }, week: { initialScrollTime: 12 } },
    });
    expect(getScrollContainer().scrollTop).to.equal(9 * getHourHeight());
  });

  it('should scroll again when switching between the week and day views', () => {
    const view = renderCalendar({
      viewConfig: { week: { initialScrollTime: 12 }, day: { initialScrollTime: 9 } },
    });
    expect(getScrollContainer().scrollTop).to.equal(12 * getHourHeight());

    view.setProps({ view: 'day' });
    expect(getScrollContainer().scrollTop).to.equal(9 * getHourHeight());

    view.setProps({ view: 'week' });
    expect(getScrollContainer().scrollTop).to.equal(12 * getHourHeight());
  });

  it('should keep the scroll position when navigating to another period', async () => {
    const { user } = renderCalendar();
    const container = getScrollContainer();
    container.scrollTop = 300;

    await user.click(screen.getByRole('button', { name: /next week/i }));

    expect(getFirstHeaderCell()).to.have.text('Sun6');
    expect(getScrollContainer().scrollTop).to.equal(300);
  });

  it('should keep the scroll position when the config changes after mount', () => {
    const view = renderCalendar({ viewConfig: { week: { initialScrollTime: 10 } } });
    const container = getScrollContainer();
    container.scrollTop = 300;

    view.setProps({ viewConfig: { week: { initialScrollTime: 12 } } });

    expect(getScrollContainer().scrollTop).to.equal(300);
  });

  it('should fall back to the default and warn when initialScrollTime is outside the displayed range', () => {
    expect(() => {
      renderCalendar({
        viewConfig: { week: { startTime: 3, endTime: 20, initialScrollTime: 25 } },
      });
    }).toWarnDev(['MUI X Scheduler: `viewConfig.week` received an invalid `initialScrollTime`']);
    // The default (7 AM) applies, 4 rows below the 3 AM start.
    expect(getScrollContainer().scrollTop).to.equal(4 * getHourHeight());
  });
});
