import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  withinEventCalendarToolbar,
} from 'test/utils/scheduler';
import { screen, within, waitFor } from '@mui/internal-test-utils';
import { MonthView } from '@mui/x-scheduler/month-view';
import { EventCalendarProvider } from '../../internals/components/EventCalendarProvider';
import { EventCalendar, eventCalendarClasses } from '../../event-calendar';
import { EventDialogProvider } from '../../internals/components/event-dialog';

describe('<MonthView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-01') });

  const events = [
    EventBuilder.new().startAt('2025-05-01T09:00:00Z').title('Meeting').build(),
    EventBuilder.new().startAt('2025-05-15T14:00:00Z').title('Doctor Appointment').build(),
  ];

  const standaloneDefaults = {
    events,
    resources: [],
  };

  const manyEvents = [
    EventBuilder.new().singleDay('2025-05-01T08:00:00Z').title('Event 1').build(),
    EventBuilder.new().singleDay('2025-05-01T09:00:00Z').title('Event 2').build(),
    EventBuilder.new().singleDay('2025-05-01T10:00:00Z').title('Event 3').build(),
    EventBuilder.new().singleDay('2025-05-01T11:00:00Z').title('Event 4').build(),
    EventBuilder.new().singleDay('2025-05-01T12:00:00Z').title('Event 5').build(),
    EventBuilder.new().singleDay('2025-05-01T13:00:00Z').title('Event 6').build(),
  ];

  it('should render the weekday headers, a cell for each day, and show the abbreviated month for day 1', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );
    const headerTexts = screen.getAllByRole('columnheader').map((header) => header.textContent);
    const gridCells = screen.getAllByRole('gridcell');

    expect(headerTexts).to.include.members(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(gridCells.length).to.be.at.least(31);
    expect(screen.getByText(/may 1/i)).not.to.equal(null);
  });

  it('should render events in the correct cell', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults}>
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
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
      <EventCalendarProvider
        {...standaloneDefaults}
        onViewChange={handleViewChange}
        onVisibleDateChange={handleVisibleDateChange}
      >
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );
    const button = screen.getByRole('button', { name: '15' });
    await user.click(button);

    expect(handleViewChange.calledOnce).to.equal(true);
    expect(handleViewChange.firstCall.firstArg).to.equal('day');
    expect(handleVisibleDateChange.calledOnce).to.equal(true);
    expect(handleVisibleDateChange.firstCall.firstArg).toEqualDateTime(
      adapter.date('2025-05-15T00:00:00Z', 'default'),
    );
  });

  it('should render day numbers as plain text when the day view is not enabled', () => {
    render(
      <EventCalendarProvider {...standaloneDefaults} views={['week', 'month']}>
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );
    expect(screen.queryByRole('button', { name: '15' })).to.equal(null);
    expect(screen.getByText('15')).not.to.equal(null);
  });

  it('should show "+N more..." when there are more events than fit in a cell', () => {
    render(
      <EventCalendarProvider events={manyEvents} resources={[]}>
        <EventDialogProvider>
          <MonthView />
        </EventDialogProvider>
      </EventCalendarProvider>,
    );
    expect(screen.getByText(/more/i)).not.to.equal(null);
  });

  describe('Event keyboard accessibility in "more events" popover', () => {
    async function renderAndOpenPopover() {
      const { user } = render(
        <EventCalendarProvider events={manyEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );
      const moreButton = await screen.findByRole('button', { name: /more/i });
      await user.click(moreButton);
      const popover = await screen.findByRole('presentation');
      return { user, popover };
    }

    it('should have tabindex and role="button" on events in the popover', async () => {
      const { popover } = await renderAndOpenPopover();

      const eventButtons = within(popover).getAllByRole('button');
      expect(eventButtons.length).to.be.greaterThan(0);

      eventButtons.forEach((button) => {
        expect(button).to.have.attribute('tabindex', '0');
        expect(button).to.have.attribute('role', 'button');
      });
    });

    it('should allow Enter key to activate events in the popover', async () => {
      const { user, popover } = await renderAndOpenPopover();

      const firstEventButton = within(popover).getAllByRole('button')[0];
      firstEventButton.focus();
      expect(firstEventButton).to.equal(document.activeElement);

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
    });

    it('should allow Space key to activate events in the popover', async () => {
      const { user, popover } = await renderAndOpenPopover();

      const firstEventButton = within(popover).getAllByRole('button')[0];
      firstEventButton.focus();
      expect(firstEventButton).to.equal(document.activeElement);

      await user.keyboard(' ');

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.to.equal(null);
      });
    });
  });

  describe('All day events', () => {
    const allDayEvents = [
      EventBuilder.new()
        .span('2025-05-05T00:00:00Z', '2025-05-07T23:59:59Z', { allDay: true })
        .title('Multi-day Conference')
        .build(),
      EventBuilder.new()
        .span('2025-04-28T00:00:00Z', '2025-05-06T23:59:59Z', { allDay: true }) // Previos week - Current week
        .title('Long Event')
        .build(),
      EventBuilder.new()
        .span('2025-05-12T00:00:00Z', '2025-05-14T23:59:59Z', { allDay: true })
        .title('Grid Row Test')
        .build(),
      EventBuilder.new()
        .span('2025-05-08T00:00:00Z', '2025-05-10T23:59:59Z', { allDay: true })
        .title('Three Day Event')
        .build(),
      EventBuilder.new()
        .span('2025-05-19T00:00:00Z', '2025-05-27T23:59:59Z', { allDay: true })
        .title('Multiple week event')
        .build(),
    ];

    it('should render all-day events correctly with main event in start date cell', () => {
      render(
        <EventCalendarProvider
          events={[EventBuilder.new().span('2025-05-04Z', '2025-05-07Z', { allDay: true }).build()]}
          resources={[]}
        >
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const getEventsFromDate = (date: number) => {
        return screen
          .getAllByRole('gridcell')
          .find((cell) => within(cell).queryByText(new RegExp(`^${date.toString()}`)))!
          .querySelectorAll(`.${eventCalendarClasses.dayGridEvent}`);
      };

      // Main event should render in the start date cell
      expect(getEventsFromDate(5)).toHaveLength(1);

      // Invisible events should exist in the spanned cells
      // Also check that invisible events have aria-hidden attribute
      expect(getEventsFromDate(6)).toHaveLength(1);
      expect(getEventsFromDate(6)[0]).to.have.attribute('aria-hidden', 'true');
      expect(getEventsFromDate(7)).toHaveLength(1);
      expect(getEventsFromDate(7)[0]).to.have.attribute('aria-hidden', 'true');
    });

    it('should render all-day event in first cell of week when event starts before the week', () => {
      render(
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const gridCells = screen.getAllByRole('gridcell');
      // Find the first cell of the first week in May 2025
      const firstCell = gridCells.find((cell) => within(cell).queryByText(/4/));

      // Event should render in the first cell of the week since it started before
      expect(within(firstCell!).getByText('Long Event')).not.to.equal(null);
    });

    it('should place invisible events on the same grid row as the main event', () => {
      render(
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const allEventOccurrences = screen.getAllByLabelText('Grid Row Test');
      const mainEvent = allEventOccurrences.find(
        (event) => event.getAttribute('aria-hidden') !== 'true',
      );
      const invisibleEventOccurrences = allEventOccurrences.filter(
        (event) => event.getAttribute('aria-hidden') === 'true',
      );

      // Extract grid row from style attribute
      const mainEventStyle = mainEvent?.getAttribute('style') || '';
      const mainGridRow = mainEventStyle.match(/--grid-row:\s*(\d+)/)?.[1];

      invisibleEventOccurrences.forEach((invisibleOccurrence) => {
        const invisibleStyle = invisibleOccurrence.getAttribute('style') || '';
        const invisibleGridRow = invisibleStyle.match(/--grid-row:\s*(\d+)/)?.[1];
        expect(invisibleGridRow).to.equal(mainGridRow);
      });
    });

    it('should handle multiple overlapping all-day events with different grid rows', () => {
      const overlappingEvents = [
        EventBuilder.new()
          .span('2025-05-12T00:00:00Z', '2025-05-14T23:59:59Z', { allDay: true })
          .title('Event 1')
          .build(),
        EventBuilder.new()
          .span('2025-05-13T00:00:00Z', '2025-05-15T23:59:59Z', { allDay: true })
          .title('Event 2')
          .build(),
        EventBuilder.new()
          .span('2025-05-16T00:00:00Z', '2025-05-17T23:59:59Z', { allDay: true })
          .title('Event 3')
          .build(),
      ];

      render(
        <EventCalendarProvider events={overlappingEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
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
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
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
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const eventInstances = screen.getAllByLabelText('Multiple week event');

      const visibleInstances = eventInstances.filter(
        (el) => el.getAttribute('aria-hidden') !== 'true',
      );

      expect(visibleInstances).toHaveLength(2);
    });
  });

  describe('time navigation', () => {
    it('should go to start of previous month when clicking on the Previous Month button', async () => {
      const onVisibleDateChange = spy();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="month"
        />,
      );

      const toolbar = withinEventCalendarToolbar();
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within toolbar
      await user.click(toolbar.getByRole('button', { name: /previous month/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addMonths(adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE), -1),
      );
    });

    it('should go to start of next month when clicking on the Next Month button', async () => {
      const onVisibleDateChange = spy();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="month"
        />,
      );

      const toolbar = withinEventCalendarToolbar();
      // eslint-disable-next-line testing-library/prefer-screen-queries -- scoped query within toolbar
      await user.click(toolbar.getByRole('button', { name: /next month/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addMonths(adapter.startOfMonth(DEFAULT_TESTING_VISIBLE_DATE), 1),
      );
    });
  });

  describe('aria semantics', () => {
    it('should set aria-rowcount and aria-colcount on the grid root and aria indexes on cells', () => {
      render(
        <EventCalendarProvider {...standaloneDefaults}>
          <EventDialogProvider>
            <MonthView />
          </EventDialogProvider>
        </EventCalendarProvider>,
      );

      const grid = screen.getByRole('grid');
      expect(grid.getAttribute('aria-colcount')).to.equal('7');
      const rowCountAttr = Number(grid.getAttribute('aria-rowcount'));
      expect(rowCountAttr).to.be.greaterThan(1);

      const headerRow = within(grid)
        .getAllByRole('row')
        .find((row) => row.getAttribute('aria-rowindex') === '1');
      expect(headerRow).not.to.equal(undefined);

      const headerCells = within(headerRow!).getAllByRole('columnheader');
      expect(headerCells.length).to.equal(7);
      headerCells.forEach((cell, i) => {
        expect(cell.getAttribute('aria-colindex')).to.equal(String(i + 1));
      });

      const dataRows = within(grid)
        .getAllByRole('row')
        .filter((row) => row.getAttribute('aria-rowindex') !== '1');
      dataRows.forEach((row, weekIdx) => {
        expect(row.getAttribute('aria-rowindex')).to.equal(String(weekIdx + 2));
        const dayCells = within(row).getAllByRole('gridcell');
        dayCells.forEach((cell, dayIdx) => {
          expect(cell.getAttribute('aria-colindex')).to.equal(String(dayIdx + 1));
        });
      });
    });
  });
});
