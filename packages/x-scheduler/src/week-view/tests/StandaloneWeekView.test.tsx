import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { fr } from 'date-fns/locale/fr';
import { createDateLocaleTheme, deDE, esES, frFR } from '@mui/x-scheduler/locales';
import { describe, it, expect } from 'vitest';

describe('<StandaloneWeekView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: DEFAULT_TESTING_VISIBLE_DATE });

  describe('localization', () => {
    it('should use the locale text provided through the localeText prop', () => {
      render(
        <StandaloneWeekView
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          localeText={{ allDay: 'Ganztägig' }}
        />,
      );

      expect(screen.getByText('Ganztägig')).toBeVisible();
    });

    it('should use the default locale text when the localeText prop is not provided', () => {
      render(<StandaloneWeekView events={[]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />);

      expect(screen.getByText('All day')).toBeVisible();
    });

    it('should use the locale text provided through the theme', () => {
      render(
        <ThemeProvider theme={createTheme({}, esES)}>
          <StandaloneWeekView events={[]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
        </ThemeProvider>,
      );

      expect(screen.getByText('Todo el día')).toBeVisible();
    });

    it('should name events with the locale text provided through the theme', () => {
      const event = EventBuilder.new()
        .title('Correr')
        .startAt('2025-07-03T07:30:00')
        .endAt('2025-07-03T08:30:00')
        .build();

      render(
        <ThemeProvider theme={createTheme({}, esES)}>
          <StandaloneWeekView events={[event]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
        </ThemeProvider>,
      );

      expect(
        screen.getByRole('button', {
          name: 'Correr, de 7:30 AM a 8:30 AM, Thursday, July 3rd, 2025',
        }),
      ).not.to.equal(null);
    });

    it('should keep the English event name for a locale that does not translate it', () => {
      const event = EventBuilder.new()
        .title('Laufen')
        .startAt('2025-07-03T07:30:00')
        .endAt('2025-07-03T08:30:00')
        .build();

      render(
        <ThemeProvider theme={createTheme({}, deDE)}>
          <StandaloneWeekView events={[event]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
        </ThemeProvider>,
      );

      expect(
        screen.getByRole('button', {
          name: 'Laufen, 7:30 AM to 8:30 AM, Thursday, July 3rd, 2025',
        }),
      ).not.to.equal(null);
    });

    it('should format the date of the event name with the date locale', () => {
      const event = EventBuilder.new()
        .title('Courir')
        .startAt('2025-07-03T07:30:00')
        .endAt('2025-07-03T08:30:00')
        .build();

      render(
        <ThemeProvider theme={createTheme({}, frFR, createDateLocaleTheme(fr))}>
          <StandaloneWeekView events={[event]} visibleDate={DEFAULT_TESTING_VISIBLE_DATE} />
        </ThemeProvider>,
      );

      expect(
        screen.getByRole('button', { name: 'Courir, de 7:30 AM à 8:30 AM, jeudi 3 juillet 2025' }),
      ).not.to.equal(null);
    });

    it('should override the theme locale text with the localeText prop', () => {
      render(
        <ThemeProvider theme={createTheme({}, esES)}>
          <StandaloneWeekView
            events={[]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
            localeText={{ allDay: 'Ganztägig' }}
          />
        </ThemeProvider>,
      );

      expect(screen.getByText('Ganztägig')).toBeVisible();
    });
  });
});
