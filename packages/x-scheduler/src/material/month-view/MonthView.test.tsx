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

const allDayEvents: CalendarEvent[] = [
  {
    id: 'all-day-1',
    start: DateTime.fromISO('2025-05-05T00:00:00'),
    end: DateTime.fromISO('2025-05-07T23:59:59'),
    title: 'Multi-day Conference',
    allDay: true,
  },
  {
    id: 'all-day-2',
    start: DateTime.fromISO('2025-04-28T00:00:00'), // Previous week
    end: DateTime.fromISO('2025-05-06T23:59:59'), // Current week
    title: 'Long Event',
    allDay: true,
  },
  {
    id: 'all-day-3',
    start: DateTime.fromISO('2025-05-12T00:00:00'),
    end: DateTime.fromISO('2025-05-14T23:59:59'),
    title: 'Grid Row Test',
    allDay: true,
  },
  {
    id: 'all-day-4',
    start: DateTime.fromISO('2025-05-14T00:00:00'),
    end: DateTime.fromISO('2025-05-16T23:59:59'),
    title: 'Three Day Event',
    allDay: true,
  },
  {
    id: 'all-day-5',
    start: DateTime.fromISO('2025-05-06T00:00:00'),
    end: DateTime.fromISO('2025-05-16T23:59:59'),
    title: 'Multiple week event',
    allDay: true,
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

  describe('All day events', () => {
    it('should render all-day events correctly with main event in start date cell', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <MonthView />
        </StandaloneView>,
      );

      const gridCells = screen.getAllByRole('gridcell');
      const may5Cell = gridCells.find((cell) => within(cell).queryByText(/5/));

      // Main event should render in the start date cell
      expect(within(may5Cell!).getByText('Multi-day Conference')).not.to.equal(null);

      // Invisible events should exist in the spanned cells
      const eventInstances = screen.getAllByLabelText('Multi-day Conference');
      expect(eventInstances.length).to.be.greaterThan(1);

      // Check that invisible events have aria-hidden attribute
      const hiddenEvents = eventInstances.filter(
        (event) => event.getAttribute('aria-hidden') === 'true',
      );
      expect(hiddenEvents.length).to.be.greaterThan(0);

      const visibleEvents = eventInstances.filter(
        (event) => event.getAttribute('aria-hidden') !== 'true',
      );
      expect(visibleEvents).to.have.length(1);
    });

    it('should render all-day event in first cell of week when event starts before the week', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <MonthView />
        </StandaloneView>,
      );

      const gridCells = screen.getAllByRole('gridcell');
      // Find the first cell of the first week in May 2025
      const firstCell = gridCells.find((cell) => within(cell).queryByText(/4/));

      // Event should render in the first cell of the week since it started before
      expect(within(firstCell!).getByText('Long Event')).not.to.equal(null);
    });

    it('should place invisible events on the same grid row as the main event', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <MonthView />
        </StandaloneView>,
      );

      const allEvents = screen.getAllByLabelText('Grid Row Test');
      const mainEvent = allEvents.find((event) => event.getAttribute('aria-hidden') !== 'true');
      const invisibleEvents = allEvents.filter(
        (event) => event.getAttribute('aria-hidden') === 'true',
      );

      // Extract grid row from style attribute
      const mainEventStyle = mainEvent?.getAttribute('style') || '';
      const mainGridRow = mainEventStyle.match(/--grid-row:\s*(\d+)/)?.[1];

      invisibleEvents.forEach((invisibleEvent) => {
        const invisibleStyle = invisibleEvent.getAttribute('style') || '';
        const invisibleGridRow = invisibleStyle.match(/--grid-row:\s*(\d+)/)?.[1];
        expect(invisibleGridRow).to.equal(mainGridRow);
      });
    });

    it('should handle multiple overlapping all-day events with different grid rows', () => {
      const overlappingEvents = [
        {
          id: 'event-1',
          start: DateTime.fromISO('2025-05-12T00:00:00'),
          end: DateTime.fromISO('2025-05-14T23:59:59'),
          title: 'Event 1',
          allDay: true,
        },
        {
          id: 'event-2',
          start: DateTime.fromISO('2025-05-13T00:00:00'),
          end: DateTime.fromISO('2025-05-15T23:59:59'),
          title: 'Event 2',
          allDay: true,
        },
        {
          id: 'event-3',
          start: DateTime.fromISO('2025-05-16T00:00:00'),
          end: DateTime.fromISO('2025-05-17T23:59:59'),
          title: 'Event 3',
          allDay: true,
        },
      ];

      render(
        <StandaloneView events={overlappingEvents} resources={[]}>
          <MonthView />
        </StandaloneView>,
      );

      const event1Elements = screen.getAllByLabelText('Event 1');
      const event2Elements = screen.getAllByLabelText('Event 2');
      const event3Elements = screen.getAllByLabelText('Event 3');

      const event1Main = event1Elements.find((el) => el.getAttribute('aria-hidden') !== 'true');
      const event2Main = event2Elements.find((el) => el.getAttribute('aria-hidden') !== 'true');
      const event3Main = event3Elements.find((el) => el.getAttribute('aria-hidden') !== 'true');

      // Extract grid rows
      const event1Style = event1Main?.getAttribute('style') || '';
      const event2Style = event2Main?.getAttribute('style') || '';
      const event3Style = event3Main?.getAttribute('style') || '';
      const event1GridRow = event1Style.match(/--grid-row:\s*(\d+)/)?.[1];
      const event2GridRow = event2Style.match(/--grid-row:\s*(\d+)/)?.[1];
      const event3GridRow = event3Style.match(/--grid-row:\s*(\d+)/)?.[1];

      // Rows in the month view always have +1 since row 1 is occupied by the day number
      expect(event1GridRow).to.equal('2');
      expect(event2GridRow).to.equal('3');
      expect(event3GridRow).to.equal('2');
    });

    it('should render all-day events with correct grid column span', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <MonthView />
        </StandaloneView>,
      );

      const mainEvent = screen
        .getAllByLabelText('Three Day Event')
        .find((el) => el.getAttribute('aria-hidden') !== 'true');
      const eventStyle = mainEvent?.getAttribute('style') || '';
      const gridColumnSpan = eventStyle.match(/--grid-column-span:\s*(\d+)/)?.[1];

      // Should span 3 columns (3 days)
      expect(gridColumnSpan).to.equal('3');
    });

    it('should render one visible event per row if event spans across multiple weeks', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <MonthView />
        </StandaloneView>,
      );

      const eventInstances = screen.getAllByLabelText('Multiple week event');

      const visibleInstances = eventInstances.filter(
        (el) => el.getAttribute('aria-hidden') !== 'true',
      );

      expect(visibleInstances).toHaveLength(2);
    });
  });
});
