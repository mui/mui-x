import * as React from 'react';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-headless/event-calendar-provider';
import { adapter, createSchedulerRenderer, describeConformance } from 'test/utils/scheduler';

describe('<CalendarGrid.DayEvent />', () => {
  const { render } = createSchedulerRenderer();

  const eventStart = adapter.date();
  const eventEnd = adapter.addHours(eventStart, 1);

  describeConformance(
    <CalendarGrid.DayEvent
      eventId="fake-id"
      occurrenceKey="fake-key"
      start={eventStart}
      end={eventEnd}
      renderDragPreview={() => null}
    />,
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
