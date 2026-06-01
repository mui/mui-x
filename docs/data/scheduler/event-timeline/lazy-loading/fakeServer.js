import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/broadway';

export { resources, defaultVisibleDate };

const ALL_EVENTS = [...initialEvents];

function getEventsInRange(rangeStart, rangeEnd) {
  return ALL_EVENTS.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return eventEnd > rangeStart && eventStart < rangeEnd;
  });
}

export async function getEvents(start, end) {
  const events = getEventsInRange(start, end);
  return new Promise((resolve) => {
    setTimeout(() => resolve(events), 500);
  });
}

export async function persistEvents(params) {
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
