import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { StandaloneWeekViewPremium } from '@mui/x-scheduler-premium/week-view-premium';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import { getSchedulerLocalization } from '@mui/x-scheduler/locales';
import { describe, it, expect } from 'vitest';

describe('<StandaloneWeekViewPremium />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: DEFAULT_TESTING_VISIBLE_DATE });

  describe('localization', () => {
    it('should use the locale text provided through the localeText prop', () => {
      render(
        <StandaloneWeekViewPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          localeText={{ dayGridLabel: 'Ganztägig' }}
        />,
      );

      expect(screen.getAllByRole('gridcell', { name: /Ganztägig/ })).not.to.have.length(0);
    });

    it('should use the locale text provided through the theme', () => {
      const localization = getSchedulerLocalization({
        dialog: {},
        event: {},
        calendar: { dayGridLabel: 'Eventos de todo el día y de varios días' },
        timeline: {},
      });

      render(
        <ThemeProvider theme={createTheme({}, localization)}>
          <StandaloneWeekViewPremium events={[]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
        </ThemeProvider>,
      );

      expect(
        screen.getAllByRole('gridcell', { name: /Eventos de todo el día y de varios días/ }),
      ).not.to.have.length(0);
    });
  });

  describe('recurring events crossing midnight', () => {
    it('should render every occurrence in the time grid, including one starting before the week', () => {
      const nightShift = EventBuilder.new()
        .title('Night shift')
        .span('2025-06-25T23:00:00Z', '2025-06-26T07:00:00Z')
        .recurrent('DAILY')
        .build();

      render(
        <StandaloneWeekViewPremium
          events={[nightShift]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        />,
      );

      expect(
        document.querySelectorAll(
          `.${eventCalendarClasses.dayTimeGridAllDayEventsGrid} .${eventCalendarClasses.dayGridEvent}`,
        ),
      ).to.have.length(0);

      // June 29 shows the end of the June 28 occurrence and the start of its own.
      const firstColumn = document.querySelector(`.${eventCalendarClasses.dayTimeGridColumn}`)!;
      expect(firstColumn.querySelectorAll(`.${eventCalendarClasses.timeGridEvent}`)).to.have.length(
        2,
      );
    });
  });
});
