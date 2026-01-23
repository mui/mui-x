import { describeSchedulerStoreDateTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

// Run the shared SchedulerStore date tests against EventTimelinePremiumStore
describeSchedulerStoreDateTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
