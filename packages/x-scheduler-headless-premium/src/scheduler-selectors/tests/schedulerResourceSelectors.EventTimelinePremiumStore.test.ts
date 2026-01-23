import { describeSchedulerResourceSelectorTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../../use-event-timeline-premium/EventTimelinePremiumStore';

// Run the shared schedulerResourceSelectors tests against EventTimelinePremiumStore
describeSchedulerResourceSelectorTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
