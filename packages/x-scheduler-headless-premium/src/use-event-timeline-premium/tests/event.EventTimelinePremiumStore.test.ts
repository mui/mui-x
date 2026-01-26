import { describeSchedulerStoreEventTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

describeSchedulerStoreEventTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
