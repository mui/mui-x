import {
  SchedulerEvent,
  SchedulerEventId,
} from '@mui/x-scheduler-internals/models';
import { initialEvents, resources, defaultVisibleDate } from '../../datasets/broadway';

export { resources, defaultVisibleDate };

const FETCH_DELAY_MS = 500;

function getEventsInRange(rangeStart: Date, rangeEnd: Date): SchedulerEvent[] {
  return initialEvents.filter((event) => {
    const eventStart = new Date(event.start as string);
    const eventEnd = new Date(event.end as string);
    return eventEnd > rangeStart && eventStart < rangeEnd;
  });
}

export async function getEvents(start: Date, end: Date): Promise<SchedulerEvent[]> {
  const events = getEventsInRange(start, end);
  return new Promise((resolve) => {
    setTimeout(() => resolve(events), FETCH_DELAY_MS);
  });
}

export async function updateEvents(_params: {
  deleted: SchedulerEventId[];
  updated: SchedulerEventId[];
  created: SchedulerEventId[];
}): Promise<{ success: boolean }> {
  return { success: true };
}
