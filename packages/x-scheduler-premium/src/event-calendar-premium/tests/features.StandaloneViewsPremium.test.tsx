import * as React from 'react';
import { StandaloneAgendaViewPremium } from '@mui/x-scheduler-premium/agenda-view-premium';
import { StandaloneDayViewPremium } from '@mui/x-scheduler-premium/day-view-premium';
import { StandaloneWeekViewPremium } from '@mui/x-scheduler-premium/week-view-premium';
import { StandaloneMonthViewPremium } from '@mui/x-scheduler-premium/month-view-premium';
import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';
import { StandaloneCompactThreeDayViewPremium } from '@mui/x-scheduler-premium/compact-three-day-view-premium';
import { StandaloneCompactWeekViewPremium } from '@mui/x-scheduler-premium/compact-week-view-premium';
import { recurringEventsFeature } from '@mui/x-scheduler-premium/recurring-events';
import {
  adapter,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getAllEventsByTitle,
  getEventNamePattern,
} from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';

const dailyEvent = EventBuilder.new()
  .title('Daily standup')
  .singleDay('2025-07-01T09:00:00Z', 60)
  .recurrent('DAILY', { count: 3 })
  .build();

const views = [
  { name: 'StandaloneDayViewPremium', View: StandaloneDayViewPremium, day: 2, expanded: 1 },
  { name: 'StandaloneWeekViewPremium', View: StandaloneWeekViewPremium, day: 1, expanded: 3 },
  { name: 'StandaloneMonthViewPremium', View: StandaloneMonthViewPremium, day: 1, expanded: 3 },
  { name: 'StandaloneAgendaViewPremium', View: StandaloneAgendaViewPremium, day: 1, expanded: 3 },
  {
    name: 'StandaloneCompactDayViewPremium',
    View: StandaloneCompactDayViewPremium,
    day: 2,
    expanded: 1,
  },
  {
    name: 'StandaloneCompactThreeDayViewPremium',
    View: StandaloneCompactThreeDayViewPremium,
    day: 1,
    expanded: 3,
  },
  {
    name: 'StandaloneCompactWeekViewPremium',
    View: StandaloneCompactWeekViewPremium,
    day: 1,
    expanded: 3,
  },
] as const;

describe('Standalone premium views - features', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  views.forEach(({ name, View, day, expanded }) => {
    describe(`<${name} />`, () => {
      const visibleDate = adapter.date(`2025-07-0${day}T00:00:00Z`, 'default');
      const Component = View as React.ComponentType<any>;

      it('should render a recurring event once without the recurring events feature', () => {
        expect(() => {
          render(<Component events={[dailyEvent]} visibleDate={visibleDate} />);
        }).toWarnDev('with the `recurringEvents` feature');

        // Single-day views show July 2nd, where only an expanded series has an occurrence.
        expect(screen.queryAllByLabelText(getEventNamePattern(dailyEvent.title))).to.have.length(
          expanded === 1 ? 0 : 1,
        );
      });

      it('should expand a recurring event with the recurring events feature', () => {
        render(
          <Component
            features={{ recurringEvents: recurringEventsFeature }}
            events={[dailyEvent]}
            visibleDate={visibleDate}
          />,
        );

        expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(expanded);
      });
    });
  });

  it('should warn with the view name when a feature changes after mount', () => {
    let setProps!: ReturnType<typeof render>['setProps'];
    expect(() => {
      ({ setProps } = render(
        <StandaloneDayViewPremium
          events={[dailyEvent]}
          visibleDate={adapter.date('2025-07-01T00:00:00Z', 'default')}
        />,
      ));
    }).toWarnDev('with the `recurringEvents` feature');

    expect(() => {
      setProps({ features: { recurringEvents: recurringEventsFeature } });
    }).toWarnDev(
      'The `features` prop of <StandaloneDayViewPremium /> changed after the first render',
    );
  });
});
