import { describeSchedulerStoreResourceTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

// Run the shared SchedulerStore resource tests against EventTimelinePremiumStore
describeSchedulerStoreResourceTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
