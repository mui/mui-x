import { describeSchedulerRecurringEventSelectorTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../../use-event-timeline-premium/EventTimelinePremiumStore';

// Run the shared schedulerRecurringEventSelectors tests against EventTimelinePremiumStore
describeSchedulerRecurringEventSelectorTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
