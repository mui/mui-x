import * as React from 'react';
import { DateTime } from 'luxon';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';

describe('<CalendarGrid.TimeEventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(<CalendarGrid.TimeEventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn start={eventStart} end={eventEnd}>
              <CalendarGrid.TimeEvent
                eventId="fake-id"
                occurrenceKey="fake-key"
                start={eventStart}
                end={eventEnd}
              >
                {node}
              </CalendarGrid.TimeEvent>
            </CalendarGrid.TimeColumn>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
