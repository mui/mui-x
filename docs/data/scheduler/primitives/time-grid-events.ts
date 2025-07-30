import { SchedulerValidDate } from '@mui/x-scheduler/primitives/models';
import { DateTime } from 'luxon';

export interface Event {
  id: string;
  start: DateTime;
  end: DateTime;
  title: string;
  resource: string;
}

export const initialEvents = [
  {
    id: '1',
    start: DateTime.fromISO('2027-02-22T07:30:00'),
    end: DateTime.fromISO('2027-02-22T08:15:00'),
    title: 'Running',
    resource: 'personal',
  },
  {
    id: '2',
    start: DateTime.fromISO('2027-02-22T16:00:00'),
    end: DateTime.fromISO('2027-02-22T17:00:00'),
    title: 'Weekly',
    resource: 'work',
  },
  {
    id: '3',
    start: DateTime.fromISO('2027-02-23T10:00:00'),
    end: DateTime.fromISO('2027-02-23T11:00:00'),
    title: 'Backlog grooming',
    resource: 'work',
  },
  {
    id: '4',
    start: DateTime.fromISO('2027-02-23T19:00:00'),
    end: DateTime.fromISO('2027-02-23T22:00:00'),
    title: 'Pizza party',
    resource: 'personal',
  },
  {
    id: '3',
    start: DateTime.fromISO('2027-02-23T10:00:00'),
    end: DateTime.fromISO('2027-02-23T11:00:00'),
    title: 'Backlog grooming',
    resource: 'work',
  },
  {
    id: '4',
    start: DateTime.fromISO('2027-02-23T19:00:00'),
    end: DateTime.fromISO('2027-02-23T22:00:00'),
    title: 'Pizza party',
    resource: 'personal',
  },
  {
    id: '5',
    start: DateTime.fromISO('2027-02-24T08:00:00'),
    end: DateTime.fromISO('2027-02-24T17:00:00'),
    title: 'Scheduler deep dive',
    resource: 'work',
  },
  {
    id: '6',
    start: DateTime.fromISO('2027-02-25T07:30:00'),
    end: DateTime.fromISO('2027-02-25T08:15:00'),
    title: 'Running',
    resource: 'personal',
  },
  {
    id: '7',
    start: DateTime.fromISO('2027-02-26T15:00:00'),
    end: DateTime.fromISO('2027-02-26T15:45:00'),
    title: 'Retrospective',
    resource: 'work',
  },
];

export function groupEventsByDay(eventsToGroup: Event[]) {
  const groupedEvents: Record<
    string,
    {
      date: DateTime;
      events: Event[];
    }
  > = {};

  const { start, end } = getEventsDateRange(eventsToGroup);

  let day = start;
  while (day <= end) {
    const dateKey = day.toFormat('yyyy-MM-dd');
    groupedEvents[dateKey] = { date: day, events: [] };
    day = day.plus({ days: 1 });
  }

  eventsToGroup.forEach((event) => {
    const dateKey = event.start.toFormat('yyyy-MM-dd');
    groupedEvents[dateKey].events.push(event);
  });

  return Object.values(groupedEvents).sort((a, b) => a.date.toMillis() - b.date.toMillis());
}

export function groupEventsByResource(eventsToGroup: Event[]) {
  const groupedEvents: Record<string, { resource: string; events: Event[] }> = {};

  eventsToGroup.forEach((event) => {
    if (!groupedEvents[event.resource]) {
      groupedEvents[event.resource] = { resource: event.resource, events: [] };
    }
    groupedEvents[event.resource].events.push(event);
  });

  return Object.values(groupedEvents).sort((a, b) => a.resource.localeCompare(b.resource));
}

export function getEventsDateRange(eventsToGroup: Event[]) {
  let start: SchedulerValidDate | null = null;
  let end: SchedulerValidDate | null = null;
  for (const event of eventsToGroup) {
    if (!start || event.start < start) {
      start = event.start;
    }
    if (!end || event.end > end) {
      end = event.end;
    }
  }

  if (!start || !end) {
    throw new Error('No events provided to get date range');
  }

  return { start: start.startOf('day'), end: end.endOf('day') };
}
