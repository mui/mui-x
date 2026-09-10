import { screen, waitFor, within } from '@mui/internal-test-utils';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
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

      await openPreferencesMenu(user);
      await toggleShowEmptyDaysInAgenda(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`)).to.have.length(0);
      expect(screen.getByRole('status')).to.have.text('No upcoming events');

      await openPreferencesMenu(user);
      await toggleShowEmptyDaysInAgenda(user);
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).to.equal(null));

      expect(document.querySelectorAll(`.${eventCalendarClasses.agendaViewRow}`)).to.have.length(
        12,
      );
      expect(screen.queryByRole('status')).to.equal(null);
    });
  });

  it('should reference resolvable header IDs in each event aria-labelledby', () => {
    const event = EventBuilder.new().title('My Event').build();

    render(
      <EventCalendar events={[event]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} view="agenda" />,
    );

    const eventButton = screen.getByRole('button', { name: /My Event/i });
    const tokens = (eventButton.getAttribute('aria-labelledby') ?? '').split(' ').filter(Boolean);
    expect(tokens.length).to.be.greaterThan(0);
    tokens.forEach((token) => {
      expect(document.getElementById(token), `aria-labelledby token "${token}"`).not.to.equal(null);
    });
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

    it('renders the second week separator before the Sunday when weekStartsOn=0', () => {
      render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          view="agenda"
          preferences={{ showWeekNumber: true, weekStartsOn: 0 }}
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

    it('shows "Week 2" for Jan 5 2025 when weekStartsOn=0', () => {
      const visibleDate = adapter.date('2025-01-05T00:00:00Z', 'default');

      render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          view="agenda"
          preferences={{ showWeekNumber: true, weekStartsOn: 0 }}
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
