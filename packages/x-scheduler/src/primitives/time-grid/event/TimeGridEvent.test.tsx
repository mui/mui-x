import * as React from 'react';
import { DateTime } from 'luxon';
import { TimeGrid } from '@mui/x-scheduler/primitives/time-grid';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';

describe('<TimeGrid.Event />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(
    <TimeGrid.Event eventId="fake-id" occurrenceKey="fake-key" start={eventStart} end={eventEnd} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <TimeGrid.Root>
              <TimeGrid.Column start={eventStart} end={eventEnd}>
                {node}
              </TimeGrid.Column>
            </TimeGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
