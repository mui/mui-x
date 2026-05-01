import {
  initialEvents,
  resources,
  defaultVisibleDate,
} from '../../datasets/broadway';

export { resources, defaultVisibleDate };

const FETCH_DELAY_MS = 500;

function getEventsInRange(rangeStart, rangeEnd) {
  return initialEvents.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return eventEnd > rangeStart && eventStart < rangeEnd;
  });
}

export async function getEvents(start, end) {
  const events = getEventsInRange(start, end);
  return new Promise((resolve) => {
    setTimeout(() => resolve(events), FETCH_DELAY_MS);
  });
}

export async function updateEvents(_params) {
  return { success: true };
}
