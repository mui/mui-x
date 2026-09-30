import { waitFor } from '@mui/internal-test-utils';
import { createSchedulerRenderer, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { StandaloneAgendaViewPremium } from '@mui/x-scheduler-premium/agenda-view-premium';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { describe, it, expect } from 'vitest';

describe('<StandaloneAgendaViewPremium /> - Data Source', () => {
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
      <StandaloneAgendaViewPremium
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
});
