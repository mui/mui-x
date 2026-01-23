import { describeSchedulerOtherSelectorTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../use-event-calendar';

// Run the shared schedulerOtherSelectors tests against EventCalendarStore
describeSchedulerOtherSelectorTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
