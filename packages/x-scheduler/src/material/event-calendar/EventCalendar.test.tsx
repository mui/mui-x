import * as React from 'react';
import { DateTime } from 'luxon';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';
import { openSettingsMenu, toggleHideWeekends } from '../internals/utils/test-utils';

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

    expect(mondayEvent.getAttribute('aria-labelledby')).to.include('DayTimeGridHeaderCell-26');
    expect(tuesdayEvent.getAttribute('aria-labelledby')).to.include('DayTimeGridHeaderCell-27');

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

  it('should allow to show / hide the weekends using the UI in the week view', async () => {
    const { user } = render(<EventCalendar events={[]} />);

    // Weekends should be visible by default
    expect(screen.getByRole('columnheader', { name: /Sunday 25/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Saturday 31/i })).not.to.equal(null);

    // Hide the weekends
    await openSettingsMenu(user);
    await toggleHideWeekends(user);

    expect(screen.queryByRole('columnheader', { name: /Sunday 25/i })).to.equal(null);
    expect(screen.queryByRole('columnheader', { name: /Saturday 31/i })).to.equal(null);

    // Show the weekends again
    await openSettingsMenu(user);
    await toggleHideWeekends(user);

    expect(screen.getByRole('columnheader', { name: /Sunday 25/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Saturday 31/i })).not.to.equal(null);
  });

  it('should allow to show / hide the weekends using the UI in the month view', async () => {
    const { user } = render(<EventCalendar events={[]} defaultView="month" />);

    // Weekends should be visible by default
    expect(screen.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Saturday/i })).not.to.equal(null);

    // Hide the weekends
    await openSettingsMenu(user);
    await toggleHideWeekends(user);

    expect(screen.queryByRole('columnheader', { name: /Sunday/i })).to.equal(null);
    expect(screen.queryByRole('columnheader', { name: /Saturday/i })).to.equal(null);

    // Show the weekends again
    await openSettingsMenu(user);
    await toggleHideWeekends(user);

    expect(screen.getByRole('columnheader', { name: /Sunday/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Saturday/i })).not.to.equal(null);
  });

  it('should allow to show / hide the weekends using the UI in the agenda view', async () => {
    const { user } = render(<EventCalendar events={[]} defaultView="agenda" />);

    // Weekends should be visible by default
    expect(screen.getByLabelText(/Saturday 31/i)).not.to.equal(null);
    expect(screen.getByLabelText(/Sunday 1/i)).not.to.equal(null);

    // Hide the weekends
    await openSettingsMenu(user);
    await toggleHideWeekends(user);

    expect(screen.queryByLabelText(/Saturday 31/i)).to.equal(null);
    expect(screen.queryByLabelText(/Sunday 1/i)).to.equal(null);

    // Show the weekends again
    await openSettingsMenu(user);
    await toggleHideWeekends(user);

    expect(screen.getByLabelText(/Saturday 31/i)).not.to.equal(null);
    expect(screen.getByLabelText(/Sunday 1/i)).not.to.equal(null);
  });
});
