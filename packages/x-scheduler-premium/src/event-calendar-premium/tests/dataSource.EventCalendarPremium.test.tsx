import { screen, waitFor } from '@mui/internal-test-utils';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
} from 'test/utils/scheduler';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';
import { eventCalendarClasses } from '@mui/x-scheduler/event-calendar';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { vi, describe, it, expect } from 'vitest';

// Renders the component rather than constructing the store, to cover the
// `useExtractEventCalendarPremiumParameters` wiring.
describe('<EventCalendarPremium /> - Data Source', () => {
  const { renderSettled } = createSchedulerRenderer();

  it('should fetch the events through the data source on mount', async () => {
    const event = EventBuilder.new().title('Fetched Event').build();
    const dataSource = {
      getEvents: vi.fn(async () => [event]),
      persistEvents: async () => ({ success: true }),
    };

    await renderSettled(
      <EventCalendarPremium
        dataSource={dataSource}
        defaultView="day"
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      />,
    );

    await waitFor(() => expect(dataSource.getEvents.mock.calls.length).to.equal(1));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Fetched Event/i })).not.to.equal(null),
    );
  });

  it('should render the skeleton while events are loading and remove it once they resolve', async () => {
    const event = EventBuilder.new().title('Fetched Event').build();
    let resolveFetch: (value: SchedulerEvent[]) => void = () => {};
    const dataSource = {
      getEvents: () =>
        new Promise<SchedulerEvent[]>((resolve) => {
          resolveFetch = resolve;
        }),
      persistEvents: async () => ({ success: true }),
    };

    await renderSettled(
      <EventCalendarPremium
        dataSource={dataSource}
        defaultView="day"
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      />,
    );

    await waitFor(() => {
      expect(
        document.querySelectorAll(`.${eventCalendarClasses.eventSkeleton}`).length,
      ).to.be.greaterThan(0);
    });
    expect(screen.queryByRole('button', { name: /Fetched Event/i })).to.equal(null);

    resolveFetch([event]);

    await waitFor(() => {
      expect(document.querySelectorAll(`.${eventCalendarClasses.eventSkeleton}`).length).to.equal(
        0,
      );
    });
    expect(screen.getByRole('button', { name: /Fetched Event/i })).not.to.equal(null);
  });

  it('should not forward the dataSource prop to the root element', async () => {
    const dataSource = {
      getEvents: async () => [],
      persistEvents: async () => ({ success: true }),
    };

    await renderSettled(
      <EventCalendarPremium
        dataSource={dataSource}
        defaultView="day"
        defaultVisibleDate={DEFAULT_TESTING_VISIBLE_DATE}
      />,
    );

    // React lowercases unknown props it forwards to the DOM.
    expect(document.querySelectorAll('[datasource]').length).to.equal(0);
  });
});
