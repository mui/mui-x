import { describeSchedulerOccurrenceSelectorTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../../use-event-timeline-premium/EventTimelinePremiumStore';

// Run the shared schedulerOccurrenceSelectors tests against EventTimelinePremiumStore
describeSchedulerOccurrenceSelectorTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
