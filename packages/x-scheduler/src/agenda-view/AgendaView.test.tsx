import { screen, waitFor, within } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { EventCalendar, eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { StandaloneAgendaView } from '@mui/x-scheduler/agenda-view';
import { SchedulerEvent } from '@mui/x-scheduler/models';

describe('<AgendaView />', () => {
  const { render } = createSchedulerRenderer();

  // Regression test for https://github.com/mui/mui-x/pull/22676#pullrequestreview-4424947060
  // The standalone views render `EventSkeleton`, which reads `SharedComponentsStyledContext`.
  // `EventCalendarProvider` (the wrapper used by every standalone view) must supply that
  // context, otherwise rendering the data-source loading state throws.
  it('should render the skeleton in a standalone view while events are loading', async () => {
    const dataSource = {
      getEvents: () => new Promise<SchedulerEvent[]>(() => {}),
      persistEvents: async () => ({ success: true }),
    };

    render(
      <StandaloneAgendaView
        dataSource={dataSource}
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      />,
    );

    await waitFor(() => {
      expect(
        document.querySelectorAll(`.${eventCalendarClasses.eventSkeleton}`).length,
      ).to.be.greaterThan(0);
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

  describe('time navigation', () => {
    it('should go to previous agenda period (12 days) when clicking on the Previous Agenda button', async () => {
      const onVisibleDateChange = spy();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="agenda"
        />,
      );

      await user.click(screen.getByRole('button', { name: /previous agenda/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(DEFAULT_TESTING_VISIBLE_DATE, -12),
      );
    });

    it('should go to next agenda period (12 days) when clicking on the Next Agenda button', async () => {
      const onVisibleDateChange = spy();

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          onVisibleDateChange={onVisibleDateChange}
          view="agenda"
        />,
      );

      await user.click(screen.getByRole('button', { name: /next agenda/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
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
