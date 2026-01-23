import { describeSchedulerStoreDateTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../../../../use-event-calendar';

// Run the shared SchedulerStore date tests against EventCalendarStore
describeSchedulerStoreDateTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
