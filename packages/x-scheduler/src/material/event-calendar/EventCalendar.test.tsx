import * as React from 'react';
import { DateTime } from 'luxon';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';

describe('EventCalendar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  // TODO: Move in a test file specific to the TimeGrid component.
  it('should render events in the correct column', () => {
    render(
      <EventCalendar
        events={[
          {
            id: '1',
            start: DateTime.fromISO('2025-05-26T07:30:00'),
            end: DateTime.fromISO('2025-05-26T08:15:00'),
            title: 'Running',
          },
          {
            id: '2',
            start: DateTime.fromISO('2025-05-27T16:00:00'),
            end: DateTime.fromISO('2025-05-27T17:00:00'),
            title: 'Weekly',
          },
        ]}
      />,
    );

    const mondayEvent = screen.getByRole('button', { name: /Running/i });
    const tuesdayEvent = screen.getByRole('button', { name: /Weekly/i });

    expect(mondayEvent).not.to.equal(null);
    expect(tuesdayEvent).not.to.equal(null);

    expect(mondayEvent.textContent).to.equal('Running7:30 AM');
    expect(tuesdayEvent.textContent).to.equal('Weekly4:00 PM - 5:00 PM');

    expect(mondayEvent.getAttribute('aria-labelledby')).to.include('TimeGridHeaderCell-26');
    expect(tuesdayEvent.getAttribute('aria-labelledby')).to.include('TimeGridHeaderCell-27');

    expect(screen.getByRole('columnheader', { name: /Monday 26/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Tuesday 27/i })).not.to.equal(null);
  });

  it('should allow to show / hide resources using the UI', async () => {
    const { user } = render(
      <EventCalendar
        events={[
          {
            id: '1',
            start: DateTime.fromISO('2025-05-26T07:30:00'),
            end: DateTime.fromISO('2025-05-26T08:15:00'),
            title: 'Running',
            resource: '1',
          },
          {
            id: '2',
            start: DateTime.fromISO('2025-05-27T16:00:00'),
            end: DateTime.fromISO('2025-05-27T17:00:00'),
            title: 'Weekly',
            resource: '2',
          },
        ]}
        resources={[
          { id: '1', name: 'Sport' },
          { id: '2', name: 'Work' },
        ]}
      />,
    );

    const workResourceToggleButton = screen.getByRole('checkbox', { name: /Work/i });
    const sportResourceToggleButton = screen.getByRole('checkbox', { name: /Sport/i });

    expect(workResourceToggleButton).to.have.attribute('data-checked');
    expect(sportResourceToggleButton).to.have.attribute('data-checked');
    expect(screen.queryByRole('button', { name: /Running/i })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: /Weekly/i })).not.to.equal(null);

    await user.click(workResourceToggleButton);
    expect(workResourceToggleButton).not.to.have.attribute('data-checked');
    expect(screen.queryByRole('button', { name: /Weekly/i })).to.equal(null);

    await user.click(sportResourceToggleButton);
    expect(sportResourceToggleButton).not.to.have.attribute('data-checked');
    expect(screen.queryByRole('button', { name: /Running/i })).to.equal(null);

    await user.click(workResourceToggleButton);
    expect(workResourceToggleButton).to.have.attribute('data-checked');
    expect(screen.getByRole('button', { name: /Weekly/i })).not.to.equal(null);
  });
});
