import * as React from 'react';
import { DateTime } from 'luxon';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/material/event-calendar';

describe('EventCalendar - Visible Resources', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26') });

  const sampleResources = [
    { id: '1', name: 'Sport' },
    { id: '2', name: 'Work' },
    { id: '3', name: 'Personal' },
  ];

  const sampleEvents = [
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
      title: 'Weekly meeting',
      resource: '2',
    },
    {
      id: '3',
      start: DateTime.fromISO('2025-05-28T10:00:00'),
      end: DateTime.fromISO('2025-05-28T11:00:00'),
      title: 'Doctor appointment',
      resource: '3',
    },
  ];

  it('should initialize with all resources visible by default (uncontrolled)', () => {
    render(
      <EventCalendar
        events={sampleEvents}
        resources={sampleResources}
      />,
    );

    // All resource checkboxes should be checked
    expect(screen.getByRole('checkbox', { name: /Sport/i })).to.have.attribute('data-checked');
    expect(screen.getByRole('checkbox', { name: /Work/i })).to.have.attribute('data-checked');
    expect(screen.getByRole('checkbox', { name: /Personal/i })).to.have.attribute('data-checked');

    // All events should be visible
    expect(screen.queryByRole('button', { name: /Running/i })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: /Weekly meeting/i })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: /Doctor appointment/i })).not.to.equal(null);
  });

  it('should initialize with specified visible resources (uncontrolled)', () => {
    render(
      <EventCalendar
        events={sampleEvents}
        resources={sampleResources}
        defaultVisibleResources={['1', '3']} // Only Sport and Personal visible
      />,
    );

    // Only specified resource checkboxes should be checked
    expect(screen.getByRole('checkbox', { name: /Sport/i })).to.have.attribute('data-checked');
    expect(screen.getByRole('checkbox', { name: /Work/i })).not.to.have.attribute('data-checked');
    expect(screen.getByRole('checkbox', { name: /Personal/i })).to.have.attribute('data-checked');

    // Only events from visible resources should be visible
    expect(screen.queryByRole('button', { name: /Running/i })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: /Weekly meeting/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: /Doctor appointment/i })).not.to.equal(null);
  });

  it('should work in controlled mode', () => {
    const onVisibleResourcesChange = vitest.fn();
    const { rerender } = render(
      <EventCalendar
        events={sampleEvents}
        resources={sampleResources}
        visibleResources={['1', '2']} // Only Sport and Work visible
        onVisibleResourcesChange={onVisibleResourcesChange}
      />,
    );

    // Only specified resource checkboxes should be checked
    expect(screen.getByRole('checkbox', { name: /Sport/i })).to.have.attribute('data-checked');
    expect(screen.getByRole('checkbox', { name: /Work/i })).to.have.attribute('data-checked');
    expect(screen.getByRole('checkbox', { name: /Personal/i })).not.to.have.attribute('data-checked');

    // Only events from visible resources should be visible
    expect(screen.queryByRole('button', { name: /Running/i })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: /Weekly meeting/i })).not.to.equal(null);
    expect(screen.queryByRole('button', { name: /Doctor appointment/i })).to.equal(null);

    // Change controlled visible resources
    rerender(
      <EventCalendar
        events={sampleEvents}
        resources={sampleResources}
        visibleResources={['3']} // Only Personal visible
        onVisibleResourcesChange={onVisibleResourcesChange}
      />,
    );

    // Updated resource checkboxes state
    expect(screen.getByRole('checkbox', { name: /Sport/i })).not.to.have.attribute('data-checked');
    expect(screen.getByRole('checkbox', { name: /Work/i })).not.to.have.attribute('data-checked');
    expect(screen.getByRole('checkbox', { name: /Personal/i })).to.have.attribute('data-checked');

    // Only events from visible resources should be visible
    expect(screen.queryByRole('button', { name: /Running/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: /Weekly meeting/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: /Doctor appointment/i })).not.to.equal(null);
  });

  it('should call onVisibleResourcesChange when resources are toggled in controlled mode', async () => {
    const onVisibleResourcesChange = vitest.fn();
    const { user } = render(
      <EventCalendar
        events={sampleEvents}
        resources={sampleResources}
        visibleResources={['1', '2', '3']} // All visible initially
        onVisibleResourcesChange={onVisibleResourcesChange}
      />,
    );

    const workCheckbox = screen.getByRole('checkbox', { name: /Work/i });
    
    // Click to hide Work resource
    await user.click(workCheckbox);

    // Callback should be called with updated visible resources
    expect(onVisibleResourcesChange).to.have.been.calledWith(['1', '3']);
  });

  it('should not call onVisibleResourcesChange in uncontrolled mode', async () => {
    const onVisibleResourcesChange = vitest.fn();
    const { user } = render(
      <EventCalendar
        events={sampleEvents}
        resources={sampleResources}
        defaultVisibleResources={['1', '2', '3']} // All visible initially
        onVisibleResourcesChange={onVisibleResourcesChange}
      />,
    );

    const workCheckbox = screen.getByRole('checkbox', { name: /Work/i });
    
    // Click to hide Work resource
    await user.click(workCheckbox);

    // Callback should be called even in uncontrolled mode
    expect(onVisibleResourcesChange).to.have.been.calledWith(['1', '3']);
  });
});