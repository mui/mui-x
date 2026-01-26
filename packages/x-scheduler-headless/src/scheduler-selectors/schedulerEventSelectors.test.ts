import { describeSchedulerEventSelectorTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../use-event-calendar';

// Run the shared schedulerEventSelectors tests against EventCalendarStore
describeSchedulerEventSelectorTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
