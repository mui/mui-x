import { describeSchedulerPreferenceSelectorTests } from 'test/utils/scheduler';
import { EventCalendarStore } from '../use-event-calendar';

// Run the shared schedulerPreferenceSelectors tests against EventCalendarStore
describeSchedulerPreferenceSelectorTests({ name: 'EventCalendarStore', Value: EventCalendarStore });
