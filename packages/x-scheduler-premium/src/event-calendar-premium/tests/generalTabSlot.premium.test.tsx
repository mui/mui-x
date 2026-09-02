import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type {
  EventDialogGeneralTabPropsOverrides,
  SchedulerSlotProps,
  SchedulerSlots,
} from '@mui/x-scheduler/models';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { StandaloneDayViewPremium } from '@mui/x-scheduler-premium/day-view-premium';
import { StandaloneWeekViewPremium } from '@mui/x-scheduler-premium/week-view-premium';
import { StandaloneMonthViewPremium } from '@mui/x-scheduler-premium/month-view-premium';
import { StandaloneAgendaViewPremium } from '@mui/x-scheduler-premium/agenda-view-premium';
import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';
import { StandaloneCompactThreeDayViewPremium } from '@mui/x-scheduler-premium/compact-three-day-view-premium';
import { StandaloneCompactWeekViewPremium } from '@mui/x-scheduler-premium/compact-week-view-premium';
import { describe, it, expect } from 'vitest';

const visibleDate = new Date('2025-07-03T00:00:00Z');

const engineering = ResourceBuilder.new().title('Engineering').build();

const event = EventBuilder.new()
  .id('event-1')
  .title('Morning Meeting')
  .singleDay('2025-07-03T10:00:00Z', 60)
  .resource(engineering)
  .build();

function CustomGeneralTab(props: { marker?: string }) {
  return <p>{props.marker ? `Custom general tab ${props.marker}` : 'Custom general tab'}</p>;
}

// The overrides interface is only populated through module augmentation on the consumer side.
const slots: SchedulerSlots = {
  eventDialogGeneralTab:
    CustomGeneralTab as React.ComponentType<EventDialogGeneralTabPropsOverrides>,
};
const slotProps: SchedulerSlotProps = {
  // The overrides interface is only populated through module augmentation on the consumer side.
  eventDialogGeneralTab: { marker: 'via slotProps' } as EventDialogGeneralTabPropsOverrides,
};

/**
 * Every premium public component that opens an editing surface forwards `slots` and `slotProps`
 * down to it. The compact views open the drawer, the others the dialog; both render the same form.
 */
describe('eventDialogGeneralTab slot - premium surfaces', () => {
  const { renderSettled } = createSchedulerRenderer({ clockConfig: visibleDate });

  const surfaces = [
    ['EventCalendarPremium', EventCalendarPremium, false],
    ['EventTimelinePremium', EventTimelinePremium, false],
    ['StandaloneDayViewPremium', StandaloneDayViewPremium, false],
    ['StandaloneWeekViewPremium', StandaloneWeekViewPremium, false],
    ['StandaloneMonthViewPremium', StandaloneMonthViewPremium, false],
    ['StandaloneAgendaViewPremium', StandaloneAgendaViewPremium, false],
    ['StandaloneCompactDayViewPremium', StandaloneCompactDayViewPremium, true],
    ['StandaloneCompactThreeDayViewPremium', StandaloneCompactThreeDayViewPremium, true],
    ['StandaloneCompactWeekViewPremium', StandaloneCompactWeekViewPremium, true],
  ] as const;

  surfaces.forEach(([name, Component, isCompact]) => {
    it(`should forward the eventDialogGeneralTab slot and its slot props from <${name} />`, async () => {
      await renderSettled(
        <Component
          events={[event]}
          resources={[engineering]}
          visibleDate={visibleDate}
          onEventsChange={() => {}}
          slots={slots}
          slotProps={slotProps}
        />,
      );

      fireEvent.click(screen.getByRole('button', { name: /Morning Meeting/i }));
      if (isCompact) {
        // The compact layout arms the event first and opens the drawer from its toolbar.
        fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
      }

      expect(screen.getByText('Custom general tab via slotProps')).not.to.equal(null);
    });
  });

  it('should keep the recurrence tab working when the general tab is replaced by the slot', async () => {
    await renderSettled(
      <EventCalendarPremium
        events={[event]}
        resources={[engineering]}
        visibleDate={visibleDate}
        onEventsChange={() => {}}
        slots={slots}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Morning Meeting/i }));
    const generalPanel = screen.getByRole('tabpanel', { name: /general/i });
    expect(generalPanel).not.to.have.attribute('hidden');

    fireEvent.click(screen.getByRole('tab', { name: /recurrence/i }));

    // The General panel is hidden rather than unmounted, so its validators stay registered.
    expect(generalPanel).to.have.attribute('hidden');
    expect(screen.getByText('Custom general tab')).not.to.equal(null);
  });
});
