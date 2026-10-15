import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

function RtlContainer(props: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
      <div dir="rtl" style={{ width: 1000, height: 800 }}>
        {props.children}
      </div>
    </ThemeProvider>
  );
}

// Reads the laid out styles, so this only runs in the browser.
describe.skipIf(isJSDOM)('<EventCalendar /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer();

  it('should lay out overlapping time grid events from the inline start', async () => {
    const first = EventBuilder.new()
      .title('First')
      .span('2025-07-03T09:00:00Z', '2025-07-03T11:00:00Z')
      .build();
    const second = EventBuilder.new()
      .title('Second')
      .span('2025-07-03T10:00:00Z', '2025-07-03T12:00:00Z')
      .build();

    await renderSettled(
      <RtlContainer>
        <StandaloneWeekView events={[first, second]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
      </RtlContainer>,
    );

    const [firstEvent, secondEvent] = Array.from(
      document.querySelectorAll<HTMLElement>(`.${eventCalendarClasses.timeGridEvent}`),
    );
    expect(firstEvent.getBoundingClientRect().left).to.be.greaterThan(
      secondEvent.getBoundingClientRect().right - 1,
    );
  });

  it('should point the chevrons of a multi-week event to the inline end and start', async () => {
    const event = EventBuilder.new()
      .title('Trip')
      .span('2025-07-04T09:00:00Z', '2025-07-08T17:00:00Z')
      .build();

    await renderSettled(
      <RtlContainer>
        <StandaloneMonthView events={[event]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
      </RtlContainer>,
    );

    const firstPart = document.querySelector<HTMLElement>(
      `.${eventCalendarClasses.dayGridEvent}[data-ending-after-edge]`,
    )!;
    const lastPart = document.querySelector<HTMLElement>(
      `.${eventCalendarClasses.dayGridEvent}[data-starting-before-edge]`,
    )!;
    // In RTL the end of the row is on the left, so the chevron points left (its tip at x = 0).
    expect(getComputedStyle(firstPart).clipPath).to.contain('0px 50%');
    expect(getComputedStyle(firstPart).clipPath).not.to.contain('100% 50%');
    expect(getComputedStyle(lastPart).clipPath).to.contain('100% 50%');
    expect(getComputedStyle(lastPart).clipPath).not.to.contain('0px 50%');
  });
});
