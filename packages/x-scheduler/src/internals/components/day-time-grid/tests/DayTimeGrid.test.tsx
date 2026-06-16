import * as React from 'react';
import { waitFor } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { WeekView } from '@mui/x-scheduler/week-view';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { EventCalendarProvider } from '../../EventCalendarProvider';
import { EventDialogProvider } from '../../event-dialog';

// `hasScroll` is derived from real layout (scrollHeight vs clientHeight), which jsdom does not implement.
describe.skipIf(isJSDOM)('<DayTimeGrid /> scroll gutter', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-04') });

  function getAllDayGrid() {
    return document.querySelector(`.${eventCalendarClasses.dayTimeGridAllDayEventsGrid}`);
  }

  it('should recompute the scroll gutter when the container resizes without a re-render', async () => {
    // Let the host fit its content so the time grid body does not overflow,
    // regardless of how tall the header renders.
    render(
      <div data-testid="host" style={{ height: 'fit-content' }}>
        <EventCalendarProvider events={[]} resources={[]}>
          <EventDialogProvider>
            <WeekView />
          </EventDialogProvider>
        </EventCalendarProvider>
      </div>,
    );

    const host = document.querySelector<HTMLElement>('[data-testid="host"]')!;

    await waitFor(() => {
      expect(getAllDayGrid()).not.to.have.attribute('data-has-scroll');
    });

    // Shrink the container via the DOM so the body overflows without triggering a React re-render.
    host.style.height = '400px';

    await waitFor(() => {
      expect(getAllDayGrid()).to.have.attribute('data-has-scroll');
    });
  });
});
