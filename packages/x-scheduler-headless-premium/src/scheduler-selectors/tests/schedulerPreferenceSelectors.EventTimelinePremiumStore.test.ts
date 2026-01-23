import { describeSchedulerPreferenceSelectorTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../../use-event-timeline-premium/EventTimelinePremiumStore';

// Run the shared schedulerPreferenceSelectors tests against EventTimelinePremiumStore
describeSchedulerPreferenceSelectorTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
