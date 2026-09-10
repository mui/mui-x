import { screen, waitFor } from '@mui/internal-test-utils';
import { StandaloneAgendaViewPremium } from '@mui/x-scheduler-premium/agenda-view-premium';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { createSchedulerRenderer, DEFAULT_TESTING_VISIBLE_DATE } from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';

describe('<StandaloneAgendaViewPremium /> - Lazy loading', () => {
  const { render } = createSchedulerRenderer();

  // Regression tests for https://github.com/mui/mui-x/issues/23565
  it('should render the loading skeletons when hiding empty days while events are loading', async () => {
    const dataSource = {
      getEvents: () => new Promise<SchedulerEvent[]>(() => {}),
      persistEvents: async () => ({ success: true }),
    };

    render(
      <StandaloneAgendaViewPremium
        dataSource={dataSource}
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        defaultPreferences={{ showEmptyDaysInAgenda: false }}
      />,
    );

    await waitFor(() => {
      expect(
        document.querySelectorAll(`.${eventCalendarClasses.eventSkeleton}`).length,
      ).to.be.greaterThan(0);
    });
    expect(screen.queryByText('No upcoming events')).to.equal(null);
  });

  it('should replace the loading skeletons with the empty state once the data source resolves without events', async () => {
    const dataSource = {
      getEvents: async () => [] as SchedulerEvent[],
      persistEvents: async () => ({ success: true }),
    };

    render(
      <StandaloneAgendaViewPremium
        dataSource={dataSource}
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
        defaultPreferences={{ showEmptyDaysInAgenda: false }}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('No upcoming events')).not.to.equal(null);
    });
    expect(document.querySelectorAll(`.${eventCalendarClasses.eventSkeleton}`)).to.have.length(0);
  });
});
