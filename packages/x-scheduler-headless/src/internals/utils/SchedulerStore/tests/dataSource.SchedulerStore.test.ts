import { describeSchedulerStoreDataSourceTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../../../../use-event-calendar';

// Run the shared SchedulerStore data source tests against EventCalendarStore
describeSchedulerStoreDataSourceTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
