import { describeSchedulerStoreEventTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

// Run the shared SchedulerStore event tests against EventTimelinePremiumStore
describeSchedulerStoreEventTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
