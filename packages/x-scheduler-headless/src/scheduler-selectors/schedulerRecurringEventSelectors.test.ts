import { describeSchedulerRecurringEventSelectorTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../use-event-calendar';

describeSchedulerRecurringEventSelectorTests({
  name: 'EventCalendarStore',
  Value: EventCalendarStore,
});
