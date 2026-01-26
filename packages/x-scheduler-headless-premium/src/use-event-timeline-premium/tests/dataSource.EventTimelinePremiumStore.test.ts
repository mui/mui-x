import { describeSchedulerStoreDataSourceTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

describeSchedulerStoreDataSourceTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
