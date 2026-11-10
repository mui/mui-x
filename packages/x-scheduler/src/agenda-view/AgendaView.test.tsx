import { screen, waitFor, within } from '@mui/internal-test-utils';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  ResourceBuilder,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { vi, describe, it, expect } from 'vitest';
import { openPreferencesMenu, toggleShowEmptyDaysInAgenda } from '../internals/utils/test-utils';

describe('<AgendaView />', () => {
  const { render } = createSchedulerRenderer();

  describe('empty state', () => {
    it('should render the empty state instead of day rows when hiding empty days and no event is in the horizon', () => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          defaultPreferences={{ showEmptyDaysInAgenda: false }}
        />,
      );

      expect(document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`)).to.have.length(0);
      expect(screen.getByRole('status')).to.have.class(eventCalendarClasses.agendaViewEmptyState);
      expect(screen.getByRole('status')).to.have.text('No upcoming events');
    });

    it('should render the day rows and no empty state when showing empty days and no event is in the horizon', () => {
      render(
        <EventCalendar events={[]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} view="agenda" />,
      );

      expect(document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`)).to.have.length(
        12,
      );
      expect(screen.queryByRole('status')).to.equal(null);
    });

    it('should toggle between the empty state and the day rows when changing the preference from the UI', async () => {
      const { user } = render(
        <EventCalendar events={[]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} view="agenda" />,
      );

      async function toggleEmptyDaysFromMenu() {
        await openPreferencesMenu(user);
        await toggleShowEmptyDaysInAgenda(user);
        await user.keyboard('{Escape}');
        await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));
      }

      await toggleEmptyDaysFromMenu();
      expect(document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`)).to.have.length(0);
      expect(screen.getByRole('status')).to.have.text('No upcoming events');

      await toggleEmptyDaysFromMenu();
      expect(document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`)).to.have.length(
        12,
      );
      expect(screen.queryByRole('status')).to.equal(null);
    });
  });

  it('should mark only the day header of today with aria-current="date"', () => {
    const today = adapter.now('default');
    const event = EventBuilder.new()
      .title('Today event')
      .singleDay(new Date().toISOString())
      .build();

    render(<EventCalendar events={[event]} visibleDate={today} view="agenda" />);

    // The side panel's mini calendar marks today too.
    const currentElements = Array.from(document.querySelectorAll('[aria-current]')).filter(
      (element) => !element.closest(`.${eventCalendarClasses.miniCalendar}`),
    );
    expect(currentElements.length).to.equal(1);
    expect(currentElements[0]).to.have.attribute('aria-current', 'date');
    expect(currentElements[0]).to.have.class(eventCalendarClasses.agendaViewDayHeaderCell);
    expect(currentElements[0]).to.have.attribute(
      'aria-label',
      new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(
        today,
      ),
    );
  });

  // Browsers cannot change their timezone through process.env.TZ.
  it.skipIf(!isJSDOM)(
    'should show an event on two days of the display timezone as a multi-day event, whatever the timezone of the system',
    () => {
      // Pacific/Apia skipped December 30th, 2011. On a system there, `adapter.isSameDay()` reads
      // December 30th and 31st as the same day in the other timezones.
      setSystemTimezone('Pacific/Apia');
      const event = EventBuilder.new()
        .title('Trip')
        .span('2011-12-30T15:00:00Z', '2011-12-31T15:00:00Z')
        .build();

      render(
        <EventCalendar
          events={[event]}
          visibleDate={new Date('2011-12-30T15:00:00Z')}
          displayTimezone="America/New_York"
          view="agenda"
        />,
      );

      const parts = screen.getAllByRole('button', { name: /^Trip/ });
      expect(parts).to.have.length(2);
      const [firstDay, secondDay] = parts;
      expect(firstDay).to.have.text('Ends Dec 31Trip');
      expect(firstDay).to.have.attribute('data-ending-after-edge');
      expect(firstDay).not.to.have.attribute('data-starting-before-edge');
      expect(secondDay).to.have.attribute('data-starting-before-edge');
      expect(secondDay).not.to.have.attribute('data-ending-after-edge');
    },
  );

  it('should label each day with its month and year', () => {
    render(<EventCalendar events={[]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} view="agenda" />);

    const labels = document.querySelectorAll(
      `.${eventCalendarClasses.agendaViewYearAndMonthLabel}`,
    );
    expect(labels[0]).to.have.text('July 2025');
  });

  it('should name each event with its title, time range and date', () => {
    const event = EventBuilder.new().title('My Event').build();

    render(
      <EventCalendar events={[event]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} view="agenda" />,
    );

    const eventButton = screen.getByRole('button', {
      name: 'My Event, 12:00 AM to 1:00 AM, Thursday, July 3, 2025',
    });
    expect(eventButton).not.to.have.attribute('aria-labelledby');
  });

  it('should label all-day events with the `allDay` locale text', () => {
    const event = EventBuilder.new().title('Conference').fullDay('2025-07-03').build();

    render(
      <EventCalendar
        events={[event]}
        visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        view="agenda"
        localeText={{ allDay: 'Ganztägig' }}
      />,
    );

    expect(screen.getByText('Ganztägig')).toBeVisible();
  });

  describe('multi-resource events', () => {
    const resourceA = ResourceBuilder.new().title('Room A').build();
    const resourceB = ResourceBuilder.new().title('Room B').build();

    it('should render the event once when at least one of its assigned resources is visible', () => {
      const event = EventBuilder.new().title('Team Sync').resources([resourceA, resourceB]).build();

      render(
        <EventCalendar
          events={[event]}
          resources={[resourceA, resourceB]}
          defaultVisibleResources={{ [resourceB.id]: false }}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
        />,
      );

      expect(screen.getAllByText('Team Sync')).toHaveLength(1);
    });

    it('should not render the event when all of its assigned resources are hidden', () => {
      const event = EventBuilder.new().title('Team Sync').resources([resourceA, resourceB]).build();

      render(
        <EventCalendar
          events={[event]}
          resources={[resourceA, resourceB]}
          defaultVisibleResources={{ [resourceA.id]: false, [resourceB.id]: false }}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
        />,
      );

      expect(screen.queryByText('Team Sync')).to.equal(null);
    });
  });

  describe('time navigation', () => {
    it('should go to previous agenda period (12 days) when clicking on the Previous Agenda button', async () => {
      const onVisibleDateChange = vi.fn();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="agenda"
        />,
      );

      await user.click(screen.getByRole('button', { name: /previous agenda/i }));
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(
        adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, -12),
      );
    });

    it('should go to next agenda period (12 days) when clicking on the Next Agenda button', async () => {
      const onVisibleDateChange = vi.fn();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="agenda"
        />,
      );

      await user.click(screen.getByRole('button', { name: /next agenda/i }));
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(
        adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 12),
      );
    });
  });

  describe('viewConfig.agenda.dayCount', () => {
    it('should render dayCount day rows', () => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          viewConfig={{ agenda: { dayCount: 5 } }}
        />,
      );

      expect(document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`)).to.have.length(5);
    });

    it('should move by dayCount days when clicking on the Next and Previous Agenda buttons', async () => {
      const onVisibleDateChange = vi.fn();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="agenda"
          viewConfig={{ agenda: { dayCount: 5 } }}
        />,
      );

      await user.click(screen.getByRole('button', { name: /next agenda/i }));
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(
        adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, 5),
      );

      await user.click(screen.getByRole('button', { name: /previous agenda/i }));
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(
        adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, -5),
      );
    });

    it("should render the month and move by one month when dayCount is 'month'", async () => {
      const onVisibleDateChange = vi.fn();
      const visibleDate = adapter.date('2025-07-15T00:00:00Z', 'default');

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="agenda"
          viewConfig={{ agenda: { dayCount: 'month' } }}
        />,
      );

      expect(document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`)).to.have.length(
        31,
      );

      await user.click(screen.getByRole('button', { name: /next agenda/i }));
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(
        adapter.date('2025-08-01T00:00:00Z', 'default'),
      );

      await user.click(screen.getByRole('button', { name: /previous agenda/i }));
      expect(onVisibleDateChange.mock.lastCall?.[0]).toEqualDateTime(
        adapter.date('2025-06-01T00:00:00Z', 'default'),
      );
    });
  });

  describe('week number label', () => {
    it('does not render week number rows when showWeekNumber is not set', () => {
      render(
        <EventCalendar events={[]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} view="agenda" />,
      );

      const separators = document.querySelectorAll(
        `.${eventCalendarClasses.agendaViewWeekNumberRow}`,
      );
      expect(separators).to.have.length(0);
    });

    it('renders week number rows when showWeekNumber is enabled', () => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          preferences={{ showWeekNumber: true }}
        />,
      );

      const separators = document.querySelectorAll(
        `.${eventCalendarClasses.agendaViewWeekNumberRow}`,
      );
      expect(separators.length).to.be.at.least(2);
    });

    it('renders the second week separator before the Sunday when weekStartsOn=7', () => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          preferences={{ showWeekNumber: true, weekStartsOn: 7 }}
        />,
      );

      const separators = document.querySelectorAll(
        `.${eventCalendarClasses.agendaViewWeekNumberRow}`,
      );
      expect(separators.length).to.be.at.least(2);
      const nextRow = separators[1].nextElementSibling as HTMLElement;
      expect(within(nextRow).getByText('6')).not.to.equal(null);
    });

    it('renders the second week separator before the Monday when weekStartsOn=1', () => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          preferences={{ showWeekNumber: true, weekStartsOn: 1 }}
        />,
      );

      const separators = document.querySelectorAll(
        `.${eventCalendarClasses.agendaViewWeekNumberRow}`,
      );
      expect(separators.length).to.be.at.least(2);
      const nextRow = separators[1].nextElementSibling as HTMLElement;
      expect(within(nextRow).getByText('7')).not.to.equal(null);
    });

    it('renders the second week separator before the Saturday when weekStartsOn=6', () => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          preferences={{ showWeekNumber: true, weekStartsOn: 6 }}
        />,
      );

      const separators = document.querySelectorAll(
        `.${eventCalendarClasses.agendaViewWeekNumberRow}`,
      );
      expect(separators.length).to.be.at.least(2);
      const nextRow = separators[1].nextElementSibling as HTMLElement;
      expect(within(nextRow).getByText('5')).not.to.equal(null);
    });

    it('shows "Week 2" for Jan 5 2025 when weekStartsOn=7', () => {
      const visibleDate = adapter.date('2025-01-05T00:00:00Z', 'default');

      render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          view="agenda"
          preferences={{ showWeekNumber: true, weekStartsOn: 7 }}
        />,
      );

      expect(screen.getByText('Week 2')).not.to.equal(null);
    });

    it('shows "Week 1" for Jan 5 2025 when weekStartsOn=1 (regression)', () => {
      const visibleDate = adapter.date('2025-01-05T00:00:00Z', 'default');

      render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          view="agenda"
          preferences={{ showWeekNumber: true, weekStartsOn: 1 }}
        />,
      );

      expect(screen.getByText('Week 1')).not.to.equal(null);
    });
  });
});
