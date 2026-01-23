import { describeSchedulerRecurringEventSelectorTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../use-event-calendar';

// Run the shared schedulerRecurringEventSelectors tests against EventCalendarStore
describeSchedulerRecurringEventSelectorTests({
  name: 'EventCalendarStore',
  Value: EventCalendarStore,
});
