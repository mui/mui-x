import { screen } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { DayView } from '@mui/x-scheduler/day-view';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import type { SchedulerResource } from '@mui/x-scheduler/models';
import { EventDialogProvider } from '../internals/components/event-dialog';
import { EventCalendarProvider } from '../internals/components/EventCalendarProvider';

describe('<DayView />', () => {
  const { render } = createSchedulerRenderer();

  function renderWithProviders(
    ui: React.ReactElement,
    events: any[] = [],
    options: {
      resources?: SchedulerResource[];
      defaultVisibleResources?: Record<string, boolean>;
    } = {},
  ): ReturnType<typeof render> {
    return render(
      <EventCalendarProvider
        events={events}
        resources={options.resources ?? []}
        defaultVisibleResources={options.defaultVisibleResources}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      >
        <EventDialogProvider>{ui}</EventDialogProvider>
      </EventCalendarProvider>,
    );
  }

  function getDayTimeGrid() {
    return document.querySelector<HTMLElement>(`.${eventCalendarClasses.dayTimeGridContainer}`)!;
  }

  // The event component always renders the time element (only hidden by CSS on touch), so it is in the DOM.
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

  describe('multi-resource events', () => {
    const resourceA = ResourceBuilder.new().title('Room A').eventColor('blue').build();
    const resourceB = ResourceBuilder.new().title('Room B').eventColor('pink').build();

    it('should render the event once when at least one of its assigned resources is visible', () => {
      const event = EventBuilder.new()
        .title('Team Sync')
        .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
        .resources([resourceA, resourceB])
        .build();

      renderWithProviders(<DayView />, [event], {
        resources: [resourceA, resourceB],
        defaultVisibleResources: { [resourceB.id]: false },
      });

      expect(screen.getAllByText('Team Sync')).toHaveLength(1);
    });

    it('should not render the event when all of its assigned resources are hidden', () => {
      const event = EventBuilder.new()
        .title('Team Sync')
        .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
        .resources([resourceA, resourceB])
        .build();

      renderWithProviders(<DayView />, [event], {
        resources: [resourceA, resourceB],
        defaultVisibleResources: { [resourceA.id]: false, [resourceB.id]: false },
      });

      expect(screen.queryByText('Team Sync')).to.equal(null);
    });

    it('should derive the event color from the first resource in its assignment', () => {
      const eventAFirst = EventBuilder.new()
        .title('A First')
        .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
        .resources([resourceA, resourceB])
        .build();
      const eventBFirst = EventBuilder.new()
        .title('B First')
        .span('2025-07-03T13:00:00Z', '2025-07-03T14:00:00Z')
        .resources([resourceB, resourceA])
        .build();

      renderWithProviders(<DayView />, [eventAFirst, eventBFirst], {
        resources: [resourceA, resourceB],
      });

      const aFirstRoot = screen
        .getByText('A First')
        .closest(`.${eventCalendarClasses.timeGridEvent}`);
      const bFirstRoot = screen
        .getByText('B First')
        .closest(`.${eventCalendarClasses.timeGridEvent}`);

      expect(aFirstRoot).to.have.attribute('data-palette', 'blue');
      expect(bFirstRoot).to.have.attribute('data-palette', 'pink');
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
