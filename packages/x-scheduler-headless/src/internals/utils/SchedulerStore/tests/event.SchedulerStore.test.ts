import { describeSchedulerStoreEventTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../../../../use-event-calendar';

// Run the shared SchedulerStore event tests against EventCalendarStore
describeSchedulerStoreEventTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
