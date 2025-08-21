import * as React from 'react';
import { DateTime } from 'luxon';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import { WeekView } from '@mui/x-scheduler/material/week-view';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';

const allDayEvents = [
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
    start: DateTime.fromISO('2025-05-04T00:00:00'),
    end: DateTime.fromISO('2025-05-07T23:59:59'),
    title: 'Four day event',
    allDay: true,
  },
];

describe('<WeekView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-04') });

  describe('All day events', () => {
    it('should render all-day events correctly with main event in start date cell', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <WeekView />
        </StandaloneView>,
      );
      const allDayCells = screen.getAllByRole('gridcell');
      const may5Cell = allDayCells.find((cell) => {
        const labelledBy = cell.getAttribute('aria-labelledby');
        return labelledBy?.includes('DayTimeGridHeaderCell-5 DayTimeGridAllDayEventsHeaderCell');
      });

      // Main event should render in the start date cell
      expect(within(may5Cell!).getByText('Multi-day Conference')).not.to.equal(null);

      // Invisible events should exist in the spanned cells
      const allEvents = screen.getAllByLabelText('Multi-day Conference');
      expect(allEvents.length).to.be.greaterThan(1);

      // Check that invisible events have aria-hidden attribute
      const hiddenEvents = allEvents.filter(
        (event) => event.getAttribute('aria-hidden') === 'true',
      );
      expect(hiddenEvents.length).to.be.greaterThan(0);
    });

    it('should render all-day event in first cell of week when event starts before the week', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <WeekView />
        </StandaloneView>,
      );

      const allDayHeader = screen.getByRole('columnheader', { name: /all day/i });
      const allDayGrid = allDayHeader.closest('[class*="AllDayEventsGrid"]') as HTMLElement;
      const allDayRow = within(allDayGrid).getByRole('row');
      const gridCells = within(allDayRow).getAllByRole('gridcell');
      // Find the first cell of the first week in May 2025
      const firstCell = gridCells[0];

      // Event should render in the first cell of the week since it started before
      expect(within(firstCell!).getByText('Long Event')).not.to.equal(null);
    });

    it('should place invisible events on the same grid row as the main event', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <WeekView />
        </StandaloneView>,
      );

      const allEvents = screen.getAllByLabelText('Multi-day Conference');
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
          start: DateTime.fromISO('2025-05-04T00:00:00'),
          end: DateTime.fromISO('2025-05-06T23:59:59'),
          title: 'Event 1',
          allDay: true,
        },
        {
          id: 'event-2',
          start: DateTime.fromISO('2025-05-05T00:00:00'),
          end: DateTime.fromISO('2025-05-07T23:59:59'),
          title: 'Event 2',
          allDay: true,
        },
        {
          id: 'event-3',
          start: DateTime.fromISO('2025-05-08T00:00:00'),
          end: DateTime.fromISO('2025-05-09T23:59:59'),
          title: 'Event 3',
          allDay: true,
        },
      ];

      render(
        <StandaloneView events={overlappingEvents} resources={[]}>
          <WeekView />
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

      expect(event1GridRow).to.equal('1');
      expect(event2GridRow).to.equal('2');
      expect(event3GridRow).to.equal('1');
    });

    it('should render all-day events with correct grid column span', () => {
      render(
        <StandaloneView events={allDayEvents} resources={[]}>
          <WeekView />
        </StandaloneView>,
      );

      const allDayHeader = screen.getByRole('columnheader', { name: /all day/i });
      const allDayGrid = allDayHeader.closest('[class*="AllDayEventsGrid"]') as HTMLElement;
      const allDayRow = within(allDayGrid).getByRole('row');

      const mainEvent = within(allDayRow)
        .getAllByLabelText('Four day event')
        .find((el) => el.getAttribute('aria-hidden') !== 'true');
      const eventStyle = mainEvent?.getAttribute('style') || '';
      const gridColumnSpan = eventStyle.match(/--grid-column-span:\s*(\d+)/)?.[1];

      // Should span 4 columns (4 days)
      expect(gridColumnSpan).to.equal('4');
    });
  });
});
