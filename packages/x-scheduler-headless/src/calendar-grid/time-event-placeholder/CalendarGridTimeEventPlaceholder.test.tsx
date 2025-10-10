import * as React from 'react';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';

describe('<CalendarGrid.TimeEventPlaceholder />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = adapter.date();
  const eventEnd = adapter.addHours(eventStart, 1);

  describeConformance(
    <CalendarGrid.TimeEventPlaceholder start={eventStart} end={eventEnd} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <CalendarGrid.Root>
              <CalendarGrid.TimeColumn start={eventStart} end={eventEnd}>
                {node}
              </CalendarGrid.TimeColumn>
            </CalendarGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
