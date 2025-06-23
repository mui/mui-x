import * as React from 'react';
import { DateTime } from 'luxon';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/joy/event-calendar';
import { CalendarEvent } from '@mui/x-scheduler/joy';

const events: CalendarEvent[] = [
  {
    id: '1',
    start: DateTime.fromISO('2025-05-26T07:30:00'),
    end: DateTime.fromISO('2025-05-26T08:15:00'),
    title: 'Footing',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-05-27T16:00:00'),
    end: DateTime.fromISO('2025-05-27T17:00:00'),
    title: 'Weekly',
  },
];

describe('EventCalendar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  // TODO: Move in a test file specific to the TimeGrid component.
  it('should render events in the correct column', () => {
    render(<EventCalendar events={events} />);

    const mondayEvent = screen.getByRole('button', { name: /Footing/i });
    const tuesdayEvent = screen.getByRole('button', { name: /Weekly/i });

    expect(mondayEvent).not.to.equal(null);
    expect(tuesdayEvent).not.to.equal(null);

    expect(mondayEvent.textContent).to.equal('Footing7:30 AM');
    expect(tuesdayEvent.textContent).to.equal('Weekly4:00 PM - 5:00 PM');

    expect(mondayEvent.getAttribute('aria-labelledby')).to.include('TimeGridHeaderCell-26');
    expect(tuesdayEvent.getAttribute('aria-labelledby')).to.include('TimeGridHeaderCell-27');

    expect(screen.getByRole('columnheader', { name: /Monday 26/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Tuesday 27/i })).not.to.equal(null);
  });
});
