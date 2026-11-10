import { screen } from '@mui/internal-test-utils';
import { CalendarGrid } from '@mui/x-scheduler-internals/calendar-grid';
import { EventCalendarProvider } from '@mui/x-scheduler-internals/event-calendar-provider';
import {
  adapter,
  createSchedulerRenderer,
  describeConformance,
  setSystemTimezone,
} from 'test/utils/scheduler';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';
import { buildTemporalPlainDate } from '@mui/x-scheduler-internals/internals';

describe('<CalendarGrid.CurrentTimeIndicator />', () => {
  const { render } = createSchedulerRenderer();

  const day = adapter.now('default');

  describeConformance(<CalendarGrid.CurrentTimeIndicator />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(
        <EventCalendarProvider events={[]}>
          <CalendarGrid.Root>
            <CalendarGrid.TimeColumn value={buildTemporalPlainDate(adapter, day, 'default')}>
              {node}
            </CalendarGrid.TimeColumn>
          </CalendarGrid.Root>
        </EventCalendarProvider>,
      );
    },
  }));

  describe('position', () => {
    const { render: renderAtNow } = createSchedulerRenderer({
      clockConfig: new Date('2025-05-04T14:30:00Z'),
    });

    // Browsers cannot change their timezone through process.env.TZ.
    it.skipIf(!isJSDOM)(
      'should place the indicator at the time of day of the display timezone, on any day',
      () => {
        setSystemTimezone('UTC');
        // Another day than today, to check that only the time of day of now is used.
        const columnDay = adapter.date('2025-05-06T12:00:00Z', 'America/New_York');

        renderAtNow(
          <EventCalendarProvider events={[]} displayTimezone="America/New_York">
            <CalendarGrid.Root>
              <CalendarGrid.TimeColumn
                value={buildTemporalPlainDate(adapter, columnDay, 'America/New_York')}
              >
                <CalendarGrid.CurrentTimeIndicator data-testid="indicator" />
              </CalendarGrid.TimeColumn>
            </CalendarGrid.Root>
          </EventCalendarProvider>,
        );

        // 14:30 UTC is 10:30 in New York.
        const indicator = screen.getByTestId('indicator');
        expect(parseFloat(indicator.style.getPropertyValue('--y-position'))).to.be.closeTo(
          (10.5 / 24) * 100,
          0.01,
        );
      },
    );
  });
});
