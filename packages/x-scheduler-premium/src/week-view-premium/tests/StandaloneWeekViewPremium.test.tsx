import { createSchedulerRenderer, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { StandaloneWeekViewPremium } from '@mui/x-scheduler-premium/week-view-premium';

describe('<StandaloneWeekViewPremium />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: DEFAULT_TESTING_VISIBLE_DATE });

  describe('localization', () => {
    it('should use the locale text provided through the localeText prop', () => {
      render(
        <StandaloneWeekViewPremium
          events={[]}
          visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          localeText={{ allDay: 'Ganztägig' }}
        />,
      );

      expect(screen.getByText('Ganztägig')).toBeVisible();
    });
  });
});
