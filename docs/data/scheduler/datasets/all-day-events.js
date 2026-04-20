// All-day Events Dataset
// Non-realistic set focused on edge cases of all-day events positioning.

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export const initialEvents = [
  {
    id: '1',
    start: '2025-06-30T09:00:00',
    end: '2025-06-30T09:00:00',
    title: 'Event 1',
    allDay: true,
    resource: 'A',
  },
  {
    id: '2',
    start: '2025-06-30T00:00:00',
    end: '2025-06-30T23:59:59',
    title: 'Event 2',
    allDay: true,
    resource: 'B',
  },
  {
    id: '3',
    start: '2025-06-30T00:00:00',
    end: '2025-07-01T00:00:00',
    title: 'Event 3',
    allDay: true,
    resource: 'C',
  },
  {
    id: '4',
    start: '2025-06-15T00:00:00',
    end: '2025-07-01T00:00:00',
    title: 'Event 4',
    allDay: true,
    resource: 'A',
  },
  {
    id: '5',
    start: '2025-07-01T00:00:00',
    end: '2025-07-22T00:00:00',
    title: 'Event 5',
    allDay: true,
    resource: 'E',
  },
  {
    id: '6',
    start: '2025-06-29T00:00:00',
    end: '2025-06-29T00:00:00',
    title: 'Event 6',
    allDay: true,
    resource: 'B',
  },
  {
    id: '7',
    start: '2025-07-02T00:00:00',
    end: '2025-07-04T00:00:00',
    title: 'Event 7',
    allDay: true,
    resource: 'C',
  },
  {
    id: '8',
    start: '2025-07-02T00:00:00',
    end: '2025-07-03T00:00:00',
    title: 'Event 8',
    allDay: true,
    resource: 'C',
  },
];

export const resources = [
  { title: 'Resource A', id: 'A', eventColor: 'purple' },
  { title: 'Resource B', id: 'B', eventColor: 'teal' },
  { title: 'Resource C', id: 'C', eventColor: 'lime' },
  { title: 'Resource D', id: 'D', eventColor: 'orange' },
  { title: 'Resource E', id: 'E', eventColor: 'indigo' },
];
