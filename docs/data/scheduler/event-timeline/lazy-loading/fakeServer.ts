import type { SchedulerEvent, SchedulerEventId } from '@mui/x-scheduler-internals/models';
import { initialEvents, resources, defaultVisibleDate } from '../../datasets/broadway';

export { resources, defaultVisibleDate };

const ALL_EVENTS: SchedulerEvent[] = [...initialEvents];

/** Parses an event date as local time, including the date-only strings of all-day events. */
const toDate = (value: string): Date => new Date(value.length === 10 ? `${value}T00:00:00` : value);

function getEventsInRange(rangeStart: Date, rangeEnd: Date): SchedulerEvent[] {
  return ALL_EVENTS.filter((event) => {
    const eventStart = toDate(event.start);
    const eventEnd = toDate(event.end);
    return eventEnd > rangeStart && eventStart < rangeEnd;
  });
}

export async function getEvents(start: Date, end: Date): Promise<SchedulerEvent[]> {
  const events = getEventsInRange(start, end);
  return new Promise((resolve) => {
    setTimeout(() => resolve(events), 500);
  });
}

export async function persistEvents(params: {
  deleted: SchedulerEventId[];
  updated: SchedulerEvent[];
  created: SchedulerEvent[];
}): Promise<{ success: boolean }> {
  const { deleted, updated, created } = params;

  for (const id of deleted) {
    const index = ALL_EVENTS.findIndex((event) => event.id === id);
    if (index === -1) {
      console.warn(`fakeServer: cannot delete event "${id}" — not found.`);
      return { success: false };
    }
    ALL_EVENTS.splice(index, 1);
  }

  for (const event of updated) {
    const index = ALL_EVENTS.findIndex((existing) => existing.id === event.id);
    if (index === -1) {
      console.warn(`fakeServer: cannot update event "${event.id}" — not found.`);
      return { success: false };
    }
    ALL_EVENTS[index] = event;
  }

  for (const event of created) {
    ALL_EVENTS.push(event);
  }

  return { success: true };
}
