import { describeSchedulerStoreResourceTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../../../../use-event-calendar';

// Run the shared SchedulerStore resource tests against EventCalendarStore
describeSchedulerStoreResourceTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
