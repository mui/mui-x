import * as React from 'react';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';

describe('<CalendarGrid.DayEventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = adapter.date();
  const eventEnd = adapter.addHours(eventStart, 1);

  describeConformance(
    <CalendarGrid.DayEventPlaceholder start={eventStart} end={eventEnd} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>
              <CalendarGrid.DayRow start={eventStart} end={eventEnd}>
                <CalendarGrid.DayCell value={eventStart}>{node}</CalendarGrid.DayCell>
              </CalendarGrid.DayRow>
            </CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
