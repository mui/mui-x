import { describeSchedulerStoreDateTests } from 'test/utils/scheduler';
import { EventTimelinePremiumStore } from '../EventTimelinePremiumStore';

describeSchedulerStoreDateTests({
  name: 'EventTimelinePremiumStore',
  Value: EventTimelinePremiumStore,
});
