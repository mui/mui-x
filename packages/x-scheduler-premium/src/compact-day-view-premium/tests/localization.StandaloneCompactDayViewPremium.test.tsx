import { createSchedulerRenderer, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { StandaloneCompactDayViewPremium } from '@mui/x-scheduler-premium/compact-day-view-premium';

describe('<StandaloneCompactDayViewPremium />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: DEFAULT_TESTING_VISIBLE_DATE });

  describe('localization', () => {
    // `localeText` must reach the provider. Spreading it onto the view drops every translation.
    it('should use the locale text provided through the localeText prop', () => {
      render(
        <StandaloneCompactDayViewPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          localeText={{ allDay: 'Ganztägig' }}
        />,
      );

      expect(screen.getByText('Ganztägig')).toBeVisible();
    });
  });
});
