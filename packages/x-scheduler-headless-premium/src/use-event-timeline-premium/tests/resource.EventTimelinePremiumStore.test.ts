import { describeSchedulerStoreResourceTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

describeSchedulerStoreResourceTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
