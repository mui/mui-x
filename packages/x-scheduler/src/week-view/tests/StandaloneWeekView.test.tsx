import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createSchedulerRenderer, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { StandaloneWeekView } from '@mui/x-scheduler/week-view';
import { esES } from '@mui/x-scheduler/locales';

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
