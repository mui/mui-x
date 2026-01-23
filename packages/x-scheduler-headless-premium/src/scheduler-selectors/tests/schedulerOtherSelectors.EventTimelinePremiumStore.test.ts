import { describeSchedulerOtherSelectorTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../../use-event-timeline-premium/EventTimelinePremiumStore';

// Run the shared schedulerOtherSelectors tests against EventTimelinePremiumStore
describeSchedulerOtherSelectorTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
