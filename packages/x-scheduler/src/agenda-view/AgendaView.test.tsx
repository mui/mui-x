import { screen, waitFor } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
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
});
