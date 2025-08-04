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

  it('should allow to show / hide the weekends using the UI', async () => {
    const { user } = render(<EventCalendar events={[]} />);

    // Weekends should be visible by default
    expect(screen.getByRole('columnheader', { name: /Sunday 25/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Saturday 31/i })).not.to.equal(null);

    const settingsMenuButton1 = await screen.findByRole('button', { name: /settings/i });

    // Open the settings menu
    await user.click(settingsMenuButton1);
    await screen.findByRole('menu');
    expect(settingsMenuButton1).to.have.attribute('aria-expanded', 'true');
    // Hide the weekends
    await user.click(
      await screen.findByRole('menuitemcheckbox', {
        name: /hide weekends/i,
      }),
    );

    expect(screen.queryByRole('columnheader', { name: /Sunday 25/i })).to.equal(null);
    expect(screen.queryByRole('columnheader', { name: /Saturday 31/i })).to.equal(null);

    // Open the settings menu again
    const settingsMenuButton2 = await screen.findByRole('button', { name: /settings/i });
    await user.click(settingsMenuButton2);
    await screen.findByRole('menu');
    expect(settingsMenuButton2).to.have.attribute('aria-expanded', 'true');
    // Show the weekends again
    await user.click(
      await screen.findByRole('menuitemcheckbox', {
        name: /hide weekends/i,
      }),
    );

    expect(screen.getByRole('columnheader', { name: /Sunday 25/i })).not.to.equal(null);
    expect(screen.getByRole('columnheader', { name: /Saturday 31/i })).not.to.equal(null);
  });
});
