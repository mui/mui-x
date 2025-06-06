import * as React from 'react';
import { expect } from 'chai';
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

  it('should render events', () => {
    render(<EventCalendar events={events} />);

    const mondayEvent = screen.getByRole('button', { name: 'Monday 26' });
    const tuesDayEvent = screen.getByRole('button', { name: 'Tuesday 27' });

    expect(mondayEvent).not.to.equal(null);
    expect(tuesDayEvent).not.to.equal(null);

    expect(mondayEvent.textContent).to.equal('Footing7:30 AM - 8:15 AM');
    expect(tuesDayEvent.textContent).to.equal('Weekly4:00 PM - 5:00 PM');
  });
});
