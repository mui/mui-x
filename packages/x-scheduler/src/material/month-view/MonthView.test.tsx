import * as React from 'react';
import { DateTime } from 'luxon';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { spy } from 'sinon';
import { MonthView } from '@mui/x-scheduler/material/month-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';

const events: CalendarEvent[] = [
  {
    id: '1',
    start: DateTime.fromISO('2025-05-01T09:00:00'),
    end: DateTime.fromISO('2025-05-01T10:00:00'),
    title: 'Meeting',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-05-15T14:00:00'),
    end: DateTime.fromISO('2025-05-15T15:00:00'),
    title: 'Doctor Appointment',
  },
];

describe('<MonthView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-01') });

  const standaloneDefaults = {
    events,
    resources: [],
  };

  it('should render the weekday headers, a cell for each day, and show the abbreviated month for day 1', () => {
    render(
      <StandaloneView {...standaloneDefaults}>
        <MonthView />
      </StandaloneView>,
    );
    const headerTexts = screen.getAllByRole('columnheader').map((header) => header.textContent);
    const gridCells = screen.getAllByRole('gridcell');

    expect(headerTexts).to.include.members(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(gridCells.length).to.be.at.least(31);
    expect(screen.getByText(/may 1/i)).not.to.equal(null);
  });

  it('should render events in the correct cell', () => {
    render(
      <StandaloneView {...standaloneDefaults}>
        <MonthView />
      </StandaloneView>,
    );

    const gridCells = screen.getAllByRole('gridcell');
    const may1Cell = gridCells.find((cell) => within(cell).queryByText(/may 1/i));
    const may15Cell = gridCells.find((cell) => within(cell).queryByText(/15/));

    expect(within(may1Cell!).getByText('Meeting')).not.to.equal(null);
    expect(within(may15Cell!).getByText('Doctor Appointment')).not.to.equal(null);
  });

  it('should move to the day view when a day is clicked', async () => {
    const handleViewChange = spy();
    const handleVisibleDateChange = spy();
    const { user } = render(
      <StandaloneView
        {...standaloneDefaults}
        onViewChange={handleViewChange}
        onVisibleDateChange={handleVisibleDateChange}
      >
        <MonthView />
      </StandaloneView>,
    );
    const button = screen.getByRole('button', { name: '15' });
    await user.click(button);

    expect(handleViewChange.calledOnce).to.equal(true);
    expect(handleViewChange.firstCall.firstArg).to.equal('day');
    expect(handleVisibleDateChange.calledOnce).to.equal(true);
    expect(handleVisibleDateChange.firstCall.firstArg).toEqualDateTime(
      DateTime.fromISO('2025-05-15T00:00:00'),
    );
  });

  it('should render day numbers as plain text when the day view is not enabled', () => {
    render(
      <StandaloneView {...standaloneDefaults} views={['week', 'month']}>
        <MonthView />
      </StandaloneView>,
    );
    expect(screen.queryByRole('button', { name: '15' })).to.equal(null);
    expect(screen.getByText('15')).not.to.equal(null);
  });

  it('should show "+N more..." when there are more events than fit in a cell', () => {
    const manyEvents = [
      {
        id: '1',
        start: DateTime.fromISO('2025-05-01T08:00:00'),
        end: DateTime.fromISO('2025-05-01T09:00:00'),
        title: 'Breakfast',
      },
      {
        id: '2',
        start: DateTime.fromISO('2025-05-01T09:30:00'),
        end: DateTime.fromISO('2025-05-01T10:30:00'),
        title: 'Team Standup',
      },
      {
        id: '3',
        start: DateTime.fromISO('2025-05-01T11:00:00'),
        end: DateTime.fromISO('2025-05-01T12:00:00'),
        title: 'Client Call',
      },
      {
        id: '4',
        start: DateTime.fromISO('2025-05-01T13:00:00'),
        end: DateTime.fromISO('2025-05-01T14:00:00'),
        title: 'Lunch',
      },
      {
        id: '5',
        start: DateTime.fromISO('2025-05-01T15:00:00'),
        end: DateTime.fromISO('2025-05-01T16:00:00'),
        title: 'Design Review',
      },
    ];
    render(
      <StandaloneView events={manyEvents} resources={[]}>
        <MonthView />
      </StandaloneView>,
    );
    expect(screen.getByText(/more/i)).not.to.equal(null);
  });
});
