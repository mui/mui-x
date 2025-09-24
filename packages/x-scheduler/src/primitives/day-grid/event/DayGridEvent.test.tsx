import * as React from 'react';
import { DateTime } from 'luxon';
import { DayGrid } from '@mui/x-scheduler/primitives/day-grid';
import { EventCalendarProvider } from '@mui/x-scheduler/primitives/event-calendar-provider';
import { createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<DayGrid.Event />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = DateTime.now();
  const eventEnd = eventStart.plus({ hours: 1 });

  describeConformance(
    <DayGrid.Event eventId="fake-id" occurrenceKey="fake-key" start={eventStart} end={eventEnd} />,
    () => ({
      refInstanceof: window.HTMLDivElement,
      render(node) {
        return render(
          <EventCalendarProvider events={[]}>
            <DayGrid.Root>
              <DayGrid.Row start={eventStart} end={eventEnd}>
                <DayGrid.Cell value={eventStart}>{node}</DayGrid.Cell>
              </DayGrid.Row>
            </DayGrid.Root>
          </EventCalendarProvider>,
        );
      },
    }),
  );
});
