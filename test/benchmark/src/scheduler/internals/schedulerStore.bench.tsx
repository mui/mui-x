import type { SchedulerEvent } from '@mui/x-scheduler-internals/models';
import { buildEventsState, getTimezoneId } from '@mui/x-scheduler-internals/internals';
import { lazy, timeBenchmark } from '../../utils/timeBenchmark';

const EVENT_COUNT = 10_000;
// The timezone of the system, as the store holds it: by its identifier.
const displayTimezone = getTimezoneId('default');

const getData = lazy(() => {
  const events: SchedulerEvent[] = Array.from({ length: EVENT_COUNT }, (_, index) => ({
    id: index,
    title: `Event ${index}`,
    start: '2025-07-01T09:00:00.000Z',
    end: '2025-07-01T10:00:00.000Z',
  }));
  const initialState = {
    ...buildEventsState({ events, displayTimezone }),
    recurringEventsPlugin: null,
  };
  const eventsWithOneChange = [...events];
  eventsWithOneChange[Math.floor(EVENT_COUNT / 2)] = {
    ...eventsWithOneChange[Math.floor(EVENT_COUNT / 2)],
    title: 'Updated event',
  };
  return { events, initialState, eventsWithOneChange };
});

timeBenchmark('Event state rebuild - 10,000 new events', () =>
  buildEventsState({ events: getData().events, displayTimezone }),
);

timeBenchmark('Event state rebuild - 10,000 new events displayed in Paris', () =>
  buildEventsState({ events: getData().events, displayTimezone: 'Europe/Paris' }),
);

timeBenchmark('Event state rebuild - one changed event among 10,000', () =>
  buildEventsState({
    events: getData().eventsWithOneChange,
    displayTimezone,
    previousState: getData().initialState,
  }),
);
