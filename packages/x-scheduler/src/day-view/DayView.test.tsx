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

  // DayView no longer wraps the grid in a renderer provider — the desktop variant comes from the
  // default value of DayTimeGridInternalRenderersContext. This is the mirror of the touch test in
  // CompactDayView and guards that default.
  it('renders the desktop event variant (with a time element) without a renderer provider', () => {
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
    const resourceA = ResourceBuilder.new().title('Room A').build();
    const resourceB = ResourceBuilder.new().title('Room B').build();

    it('renders an event assigned to multiple resources when at least one is visible', () => {
      const event = EventBuilder.new()
        .title('Team Sync')
        .span('2025-07-03T10:00:00Z', '2025-07-03T11:00:00Z')
        .resources([resourceA, resourceB])
        .build();

      renderWithProviders(<DayView />, [event], {
        resources: [resourceA, resourceB],
        defaultVisibleResources: { [resourceB.id]: false },
      });

      expect(screen.getAllByText('Team Sync').length).to.be.greaterThan(0);
    });

    it('does not render an event when all of its assigned resources are hidden', () => {
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
