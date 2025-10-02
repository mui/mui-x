import * as React from 'react';
import { DateTime } from 'luxon';
import { CalendarGrid } from '@mui/x-scheduler/primitives/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<CalendarGrid.ExternalEvent />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(
    <CalendarGrid.ExternalEvent
      data={{ id: '1', title: 'External event', start: eventStart, end: eventEnd }}
    />,
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
