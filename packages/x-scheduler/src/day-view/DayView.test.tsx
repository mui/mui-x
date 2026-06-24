import { screen } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { DayView } from '@mui/x-scheduler/day-view';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { EventDialogProvider } from '../internals/components/event-dialog';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';

describe('<DayView />', () => {
  const { render } = createSchedulerRenderer();

  function renderWithProviders(
    ui: React.ReactElement,
    events: any[] = [],
  ): ReturnType<typeof render> {
    return render(
      <EventCalendarProvider
        events={events}
        resources={[]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      >
        <EventDialogProvider>{ui}</EventDialogProvider>
      </EventCalendarProvider>,
    );
  }

  function getDayTimeGrid() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGridContainer}`)!;
  }

  // The single event component renders the time element for every device (it is only hidden by CSS
  // on touch screens), so a normal DayView always exposes it in the DOM.
  it('renders the event with a time element', () => {
    const event = EventBuilder.new()
      .title('Desktop Event')
      .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
      .build();

    renderWithProviders(<DayView />, [event]);

    expect(screen.getAllByText('Desktop Event').length).to.be.greaterThan(0);

    const timeElements = getDayTimeGrid().querySelectorAll(
      `.${eventCalendarClasses.timeGridEventTime}`,
    );
    expect(timeElements.length).to.be.greaterThan(0);
  });

  describe('duration thresholds', () => {
    function getEventRoot() {
      return getDayTimeGrid().querySelector<HTMLElement>(`.${eventCalendarClasses.timeGridEvent}`)!;
    }

    it('marks a 15-minute event as under fifteen minutes and under an hour (<= 15 boundary)', () => {
      const event = EventBuilder.new().span('2025-07-03T10:00:00Z', '2025-07-03T10:15:00Z').build();
      renderWithProviders(<DayView />, [event]);

      const root = getEventRoot();
      expect(root).to.have.attribute('data-under-fifteen-minutes', 'true');
      expect(root).to.have.attribute('data-under-hour', 'true');
    });

    it('marks a 30-minute event as under an hour but not under fifteen minutes (< 30 boundary)', () => {
      const event = EventBuilder.new().span('2025-07-03T10:00:00Z', '2025-07-03T10:30:00Z').build();
      renderWithProviders(<DayView />, [event]);

      const root = getEventRoot();
      expect(root).not.to.have.attribute('data-under-fifteen-minutes');
      expect(root).to.have.attribute('data-under-hour', 'true');
    });

    it('does not mark a 60-minute event as under an hour ([30, 60) boundary)', () => {
      const event = EventBuilder.new().span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z').build();
      renderWithProviders(<DayView />, [event]);

      const root = getEventRoot();
      expect(root).not.to.have.attribute('data-under-fifteen-minutes');
      expect(root).not.to.have.attribute('data-under-hour');
    });
  });

  describe('time navigation', () => {
    it('should go to start of previous day when clicking on the Previous Day button', async () => {
      const onVisibleDateChange = spy();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="day"
        />,
      );

      await user.click(screen.getByRole('button', { name: /previous day/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, -1),
      );
    });

    it('should go to start of next day when clicking on the Next Day button', async () => {
      const onVisibleDateChange = spy();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="day"
        />,
      );

      await user.click(screen.getByRole('button', { name: /next day/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 1),
      );
    });
  });
});
