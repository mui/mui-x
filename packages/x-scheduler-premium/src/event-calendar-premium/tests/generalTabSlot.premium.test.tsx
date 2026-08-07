import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import type { SchedulerSlots } from '@mui/x-scheduler/models';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

const visibleDate = new Date('2025-07-03T00:00:00Z');

const engineering = ResourceBuilder.new().title('Engineering').build();

const event = EventBuilder.new()
  .id('event-1')
  .title('Morning Meeting')
  .singleDay('2025-07-03T10:00:00Z', 60)
  .resource(engineering)
  .build();

function CustomGeneralTab() {
  return <p>Custom general tab</p>;
}

const slots: SchedulerSlots = { eventDialogGeneralTab: CustomGeneralTab };

describe('eventDialogGeneralTab slot - premium surfaces', () => {
  const { render } = createSchedulerRenderer({ clockConfig: visibleDate });

  it('should forward the eventDialogGeneralTab slot from <EventCalendarPremium />', () => {
    render(
      <EventCalendarPremium
        events={[event]}
        resources={[engineering]}
        visibleDate={visibleDate}
        onEventsChange={() => {}}
        slots={slots}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Morning Meeting/i }));

    expect(screen.getByText('Custom general tab')).not.to.equal(null);
  });

  it('should forward the eventDialogGeneralTab slot from <EventTimelinePremium />', () => {
    render(
      <EventTimelinePremium
        events={[event]}
        resources={[engineering]}
        visibleDate={visibleDate}
        onEventsChange={() => {}}
        slots={slots}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Morning Meeting/i }));

    expect(screen.getByText('Custom general tab')).not.to.equal(null);
  });

  it('should keep the recurrence tab working when the general tab is replaced by the slot', () => {
    render(
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
