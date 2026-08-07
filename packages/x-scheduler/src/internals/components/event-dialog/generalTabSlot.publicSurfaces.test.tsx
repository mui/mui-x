import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import type { SchedulerSlots } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { StandaloneMonthView } from '@mui/x-scheduler/month-view';
import { StandaloneAgendaView } from '@mui/x-scheduler/agenda-view';
import { StandaloneCompactDayView } from '@mui/x-scheduler/compact-day-view';
import { StandaloneCompactThreeDayView } from '@mui/x-scheduler/compact-three-day-view';
import { StandaloneCompactWeekView } from '@mui/x-scheduler/compact-week-view';

const visibleDate = new Date('2025-07-03T00:00:00Z');

const event = EventBuilder.new()
  .id('event-1')
  .title('Morning Meeting')
  .singleDay('2025-07-03T10:00:00Z', 60)
  .build();

function CustomGeneralTab() {
  return <p>Custom general tab</p>;
}

const slots: SchedulerSlots = { eventDialogGeneralTab: CustomGeneralTab };

/**
 * Every public component that opens an editing surface forwards `slots` down to it.
 * The compact views open the drawer, the others the dialog; both render the same form.
 */
describe('eventDialogGeneralTab slot - public surfaces', () => {
  const { render } = createSchedulerRenderer({ clockConfig: visibleDate });

  const surfaces = [
    ['EventCalendar', EventCalendar, false],
    ['StandaloneDayView', StandaloneDayView, false],
    ['StandaloneWeekView', StandaloneWeekView, false],
    ['StandaloneMonthView', StandaloneMonthView, false],
    ['StandaloneAgendaView', StandaloneAgendaView, false],
    ['StandaloneCompactDayView', StandaloneCompactDayView, true],
    ['StandaloneCompactThreeDayView', StandaloneCompactThreeDayView, true],
    ['StandaloneCompactWeekView', StandaloneCompactWeekView, true],
  ] as const;

  surfaces.forEach(([name, Component, isCompact]) => {
    it(`should forward the eventDialogGeneralTab slot from <${name} />`, () => {
      render(
        <Component
          events={[event]}
          resources={[]}
          visibleDate={visibleDate}
          onEventsChange={() => {}}
          slots={slots}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /Morning Meeting/i }));
      if (isCompact) {
        // The compact layout arms the event first and opens the drawer from its toolbar.
        fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
      }

      expect(screen.getByText('Custom general tab')).not.to.equal(null);
    });
  });

  it('should not forward slots and slotProps to the DOM', () => {
    render(
      <EventCalendar
        events={[event]}
        resources={[]}
        visibleDate={visibleDate}
        onEventsChange={() => {}}
        slots={slots}
        slotProps={{}}
      />,
    );

    // React would also log "React does not recognize the `slotProps` prop on a DOM element",
    // which the test setup turns into a failure.
    expect(document.querySelector('[slots], [slotprops]')).to.equal(null);
  });
});
