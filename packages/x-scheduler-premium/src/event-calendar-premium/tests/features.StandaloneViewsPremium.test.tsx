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
  createDate,
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE_STR,
  EventBuilder,
  getAllEventsByTitle,
} from 'test/utils/scheduler';
import { fireEvent, screen } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';

const dailyEvent = EventBuilder.new()
  .title('Daily standup')
  .singleDay('2025-07-01T09:00:00Z', 60)
  .recurrent('DAILY', { count: 3 })
  .build();

const seriesStart = createDate('2025-07-01T00:00:00Z');
const secondDay = createDate('2025-07-02T00:00:00Z');

// Single-day views show July 2nd with the feature, where only an expanded series has an occurrence.
const views = [
  {
    name: 'StandaloneDayViewPremium',
    View: StandaloneDayViewPremium,
    isCompact: false,
    expandedVisibleDate: secondDay,
    expanded: 1,
  },
  {
    name: 'StandaloneWeekViewPremium',
    View: StandaloneWeekViewPremium,
    isCompact: false,
    expandedVisibleDate: seriesStart,
    expanded: 3,
  },
  {
    name: 'StandaloneMonthViewPremium',
    View: StandaloneMonthViewPremium,
    isCompact: false,
    expandedVisibleDate: seriesStart,
    expanded: 3,
  },
  {
    name: 'StandaloneAgendaViewPremium',
    View: StandaloneAgendaViewPremium,
    isCompact: false,
    expandedVisibleDate: seriesStart,
    expanded: 3,
  },
  {
    name: 'StandaloneCompactDayViewPremium',
    View: StandaloneCompactDayViewPremium,
    isCompact: true,
    expandedVisibleDate: secondDay,
    expanded: 1,
  },
  {
    name: 'StandaloneCompactThreeDayViewPremium',
    View: StandaloneCompactThreeDayViewPremium,
    isCompact: true,
    expandedVisibleDate: seriesStart,
    expanded: 3,
  },
  {
    name: 'StandaloneCompactWeekViewPremium',
    View: StandaloneCompactWeekViewPremium,
    isCompact: true,
    expandedVisibleDate: seriesStart,
    expanded: 3,
  },
] as const;

describe('Standalone premium views - features', () => {
  const { render } = createSchedulerRenderer({
    clockConfig: new Date(DEFAULT_TESTING_VISIBLE_DATE_STR),
  });

  views.forEach(({ name, View, isCompact, expandedVisibleDate, expanded }) => {
    describe(`<${name} />`, () => {
      const Component = View as React.ComponentType<any>;

      it('should render a recurring event once without the recurring events feature', () => {
        expect(() => {
          render(<Component events={[dailyEvent]} visibleDate={seriesStart} />);
        }).toWarnDev('Recurring events are not enabled');

        expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(1);
      });

      it('should expand a recurring event with the recurring events feature', () => {
        render(
          <Component
            features={{ recurringEvents: recurringEventsFeature }}
            events={[dailyEvent]}
            visibleDate={expandedVisibleDate}
          />,
        );

        expect(getAllEventsByTitle(dailyEvent.title)).to.have.length(expanded);
      });

      it('should show the recurrence tab with the recurring events feature', () => {
        render(
          <Component
            features={{ recurringEvents: recurringEventsFeature }}
            events={[dailyEvent]}
            visibleDate={expandedVisibleDate}
            onEventsChange={() => {}}
          />,
        );

        fireEvent.click(getAllEventsByTitle(dailyEvent.title)[0]);
        if (isCompact) {
          // The compact layout arms the event first and opens the drawer from its toolbar.
          fireEvent.click(screen.getByRole('button', { name: 'Edit event' }));
        }

        expect(screen.getByRole('tab', { name: 'Recurrence' })).not.to.equal(null);
      });

      it('should warn with the view name when a feature changes after mount', () => {
        let setProps!: ReturnType<typeof render>['setProps'];
        expect(() => {
          ({ setProps } = render(<Component events={[dailyEvent]} visibleDate={seriesStart} />));
        }).toWarnDev('Recurring events are not enabled');

        expect(() => {
          setProps({ features: { recurringEvents: recurringEventsFeature } });
        }).toWarnDev(`The \`features\` prop of <${name} /> changed after the first render`);
      });
    });
  });
});
