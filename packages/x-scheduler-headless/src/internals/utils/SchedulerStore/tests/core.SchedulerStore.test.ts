import { describeSchedulerStoreCoreTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../../../../use-event-calendar';

// Run the shared SchedulerStore core tests against EventCalendarStore
describeSchedulerStoreCoreTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
