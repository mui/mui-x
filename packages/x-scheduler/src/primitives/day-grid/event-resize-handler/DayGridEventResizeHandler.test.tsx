import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<DayGrid.EventResizeHandler />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(<DayGrid.EventResizeHandler side="start" />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <DayGrid.Root>
            <DayGrid.Row start={eventStart} end={eventEnd}>
              <DayGrid.Cell value={eventStart}>
                <DayGrid.Event
                  eventId="fake-id"
                  occurrenceKey="fake-key"
                  start={eventStart}
                  end={eventEnd}
                >
                  {node}
                </DayGrid.Event>
              </DayGrid.Cell>
            </DayGrid.Row>
          </DayGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));
});
