import { describeSchedulerResourceSelectorTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../use-event-calendar';

// Run the shared schedulerResourceSelectors tests against EventCalendarStore
describeSchedulerResourceSelectorTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
