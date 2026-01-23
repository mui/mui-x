import { describeSchedulerStoreDataSourceTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

// Run the shared SchedulerStore data source tests against EventTimelinePremiumStore
describeSchedulerStoreDataSourceTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
