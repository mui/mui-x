import { EventTimelinePremiumProvider } from '@mui/x-scheduler-internals-premium/event-timeline-premium-provider';
import type { EventTimelinePremiumStore } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';
import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import { schedulerEventSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import {
  createSchedulerRenderer,
  EventBuilder,
  ResourceBuilder,
  SchedulerStoreRunner,
} from 'test/utils/scheduler';
import { describe, expect, it } from 'vitest';
import { schedulerRecurringEventsPlugin } from '../internals/plugins/schedulerRecurringEventsPlugin';

const resource = ResourceBuilder.new().build();
const dailyEvent = EventBuilder.new()
  .span('2025-07-01T09:00:00Z', '2025-07-01T10:00:00Z')
  .resource(resource)
  .recurrent('DAILY')
  .build();

describe('<EventTimelinePremiumProvider />', () => {
  const { render } = createSchedulerRenderer();

  it('should expand an rrule event when given the recurring events store feature', () => {
    let store!: EventTimelinePremiumStore<any, any>;
    render(
      <EventTimelinePremiumProvider
        events={[dailyEvent]}
        resources={[resource]}
        storeFeatures={{ recurringEvents: schedulerRecurringEventsPlugin }}
      >
        <SchedulerStoreRunner<EventTimelinePremiumStore<any, any>>
          context={SchedulerStoreContext}
          onMount={(mountedStore) => {
            store = mountedStore;
          }}
        />
      </EventTimelinePremiumProvider>,
    );

    expect(schedulerEventSelectors.isRecurring(store.state, dailyEvent.id)).to.equal(true);
  });
});
