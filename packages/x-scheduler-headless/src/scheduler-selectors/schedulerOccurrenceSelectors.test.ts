import { describeSchedulerOccurrenceSelectorTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../use-event-calendar';

// Run the shared schedulerOccurrenceSelectors tests against EventCalendarStore
describeSchedulerOccurrenceSelectorTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
