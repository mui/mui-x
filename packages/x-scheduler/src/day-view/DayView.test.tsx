import { screen } from '@mui/internal-test-utils';
import { spy } from 'sinon';
import { adapter, createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

describe('<DayView />', () => {
  const { render } = createSchedulerRenderer();

  describe('time navigation', () => {
    it('should go to start of previous day when clicking on the Previous Day button', async () => {
      const onVisibleDateChange = spy();
      const visibleDate = adapter.date('2025-07-03T00:00:00Z');

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="day"
        />,
      );

      await user.click(screen.getByRole('button', { name: /previous day/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, -1),
      );
    });

    it('should go to start of next day when clicking on the Next Day button', async () => {
      const onVisibleDateChange = spy();
      const visibleDate = adapter.date('2025-07-03T00:00:00Z');

      const { user } = render(
        <EventCalendar
          events={[]}
          visibleDate={visibleDate}
          onVisibleDateChange={onVisibleDateChange}
          view="day"
        />,
      );

      await user.click(screen.getByRole('button', { name: /next day/i }));
      expect(onVisibleDateChange.lastCall.firstArg).toEqualDateTime(
        adapter.addDays(visibleDate, 1),
      );
    });
  });
});
