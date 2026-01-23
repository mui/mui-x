import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import { WeekView } from '@mui/x-scheduler/week-view';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar/eventCalendarClasses';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';

const multiDayEvent = EventBuilder.new()
  .span('2025-05-05T00:00:00Z', '2025-05-07T23:59:59Z')
  .allDay()
  .build();
const longEvent = EventBuilder.new()
  .span('2025-04-28T00:00:00Z', '2025-05-06T23:59:59Z') // Previous - current week
  .allDay()
  .build();
const fourDayEvent = EventBuilder.new()
  .span('2025-05-04T00:00:00Z', '2025-05-07T23:59:59Z')
  .allDay()
  .build();
const allDayEvents = [multiDayEvent, longEvent, fourDayEvent];

describe('<WeekView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-04Z') });

  describe('All day events', () => {
    it('should render all-day events correctly with main event in start date cell', () => {
      render(
        <EventCalendarProvider
          events={[EventBuilder.new().span('2025-05-05Z', '2025-05-07Z', { allDay: true }).build()]}
          resources={[]}
        >
          <WeekView />
        </EventCalendarProvider>,
      );

      const getEventsFromDate = (date: number) => {
        return screen
          .getAllByRole('gridcell')
          .find((cell) => {
            const labelledBy = cell.getAttribute('aria-labelledby');
            return labelledBy?.includes(
              `DayTimeGridHeaderCell-${date} DayTimeGridAllDayEventsHeaderCell`,
            );
          })!
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
          <WeekView />
        </EventCalendarProvider>,
      );

      const allDayHeader = screen.getByRole('columnheader', { name: /all day/i });
      // Get the parent container that has the role="row" as a direct child
      const allDayGridContainer = allDayHeader.parentElement;
      const allDayRow = within(allDayGridContainer!).getByRole('row');
      const gridCells = within(allDayRow).getAllByRole('gridcell');
      // Find the first cell of the first week in May 2025
      const firstCell = gridCells[0];

      // Event should render in the first cell of the week since it started before
      expect(within(firstCell!).getByText(longEvent.title)).not.to.equal(null);
    });

    it('should place invisible events on the same grid row as the main event', () => {
      render(
        <EventCalendarProvider events={allDayEvents} resources={[]}>
          <WeekView />
        </EventCalendarProvider>,
      );

      const allEvents = screen.getAllByLabelText(multiDayEvent.title);
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
      const event1 = EventBuilder.new()
        .span('2025-05-04T00:00:00Z', '2025-05-06T23:59:59Z')
        .allDay()
        .build();
      const event2 = EventBuilder.new()
        .span('2025-05-05T00:00:00Z', '2025-05-07T23:59:59Z')
        .allDay()
        .build();
      const event3 = EventBuilder.new()
        .span('2025-05-08T00:00:00Z', '2025-05-09T23:59:59Z')
        .allDay()
        .build();
      const overlappingEvents = [event1, event2, event3];

      render(
        <EventCalendarProvider events={overlappingEvents} resources={[]}>
          <WeekView />
        </EventCalendarProvider>,
      );

      const event1Elements = screen.getAllByLabelText(event1.title);
      const event2Elements = screen.getAllByLabelText(event2.title);
      const event3Elements = screen.getAllByLabelText(event3.title);

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
          <WeekView />
        </EventCalendarProvider>,
      );

      const allDayHeader = screen.getByRole('columnheader', { name: /all day/i });
      // Get the parent container that has the role="row" as a direct child
      const allDayGridContainer = allDayHeader.parentElement;
      const allDayRow = within(allDayGridContainer!).getByRole('row');

      const mainEvent = within(allDayRow)
        .getAllByLabelText(fourDayEvent.title)
        .find((el) => el.getAttribute('aria-hidden') !== 'true');
      const eventStyle = mainEvent?.getAttribute('style') || '';
      const gridColumnSpan = eventStyle.match(/--grid-column-span:\s*(\d+)/)?.[1];

      // Should span 4 columns (4 days)
      expect(gridColumnSpan).to.equal('4');
    });
  });

  describe('time navigation', () => {
    it('should go to start of previous week when clicking on the Previous Week button', async () => {
      const onVisibleDateChange = spy();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE} // Thursday
          onVisibleDateChange={onVisibleDateChange}
          view="week"
        />,
      );

      await user.click(screen.getByRole('button', { name: /previous week/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addWeeks(adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE), -1),
      );
    });

    it('should go to start of next week when clicking on the Next Week button', async () => {
      const onVisibleDateChange = spy();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE} // Thursday
          onVisibleDateChange={onVisibleDateChange}
          view="week"
        />,
      );

      await user.click(screen.getByRole('button', { name: /next week/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addWeeks(adapter.startOfWeek(DEFAULT_TESTING_VISIBLE_DATE), 1),
      );
    });
  });

  describe('current time indicator', () => {
    it('renders one indicator per day when today is in view', () => {
      const visibleDate = adapter.date('2025-05-04T00:00:00Z', 'default');
      render(<EventCalendar events={[]} visibleDate={visibleDate} view="week" />);

      // The current time indicator is rendered once per day column when today is in view
      // Check that the data-current attribute is on the today column
      const todayColumn = document.querySelector('[data-current]');
      expect(todayColumn).not.to.equal(null);
    });

    it("doesn't render the current time indicator if today is not in view", () => {
      const visibleDate = adapter.date('2025-05-18T00:00:00Z', 'default');
      render(<EventCalendar events={[]} visibleDate={visibleDate} view="week" />);

      const indicators = document.querySelectorAll('[data-current-time]');
      expect(indicators.length).to.equal(0);

      const todayColumn = document.querySelector('[data-current]');
      expect(todayColumn).to.equal(null);
    });

    it('hides hour labels close to the indicator', () => {
      // 12:10 => the 12 hour label should be hidden
      const visibleDate = adapter.date('2025-05-04T12:10:00Z', 'default');

      render(<EventCalendar events={[]} visibleDate={visibleDate} view="week" />);

      // Time labels that should be hidden now use data-hidden attribute
      const hiddenLabels = document.querySelectorAll('time[data-hidden]');
      expect(hiddenLabels.length).to.be.greaterThan(0);
    });

    it('respects flag: hides indicator when showCurrentTimeIndicator is false', () => {
      const visibleDate = adapter.date('2025-05-04T00:00:00Z', 'default');

      render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          showCurrentTimeIndicator={false}
          view="week"
        />,
      );

      const indicators = document.querySelectorAll('[data-current-time]');
      expect(indicators.length).to.equal(0);
      const hiddenLabels = document.querySelectorAll('time[data-hidden]');
      expect(hiddenLabels.length).to.equal(0);
    });
  });
});
