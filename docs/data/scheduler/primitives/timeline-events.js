import { DateTime } from 'luxon';

export const boundaries = {
  start: DateTime.fromISO('2027-01-31T00:00:00'),
  end: DateTime.fromISO('2027-02-20T00:00:00'),
};

export const resources = [
  {
    title: 'Room 1',
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2027-02-01T00:00:00'),
        end: DateTime.fromISO('2027-02-03T00:00:00'),
        title: 'Event 1',
      },
      {
        id: '2',
        start: DateTime.fromISO('2027-02-04T00:00:00'),
        end: DateTime.fromISO('2027-02-05T00:00:00'),
        title: 'Event 2',
      },
      {
        id: '2',
        start: DateTime.fromISO('2027-02-08T00:00:00'),
        end: DateTime.fromISO('2027-02-12T00:00:00'),
        title: 'Event 3',
      },
      {
        id: '2',
        start: DateTime.fromISO('2027-02-15T00:00:00'),
        end: DateTime.fromISO('2027-02-17T00:00:00'),
        title: 'Event 3',
      },
    ],
  },
  {
    title: 'Room 2',
    events: [
      {
        id: '5',
        start: DateTime.fromISO('2027-02-01T00:00:00'),
        end: DateTime.fromISO('2027-02-19T00:00:00'),
        title: 'Event 5',
      },
    ],
  },
  {
    title: 'Room 3',
    events: [],
  },
  {
    title: 'Room 4',
    events: [
      {
        id: '6',
        start: DateTime.fromISO('2027-02-01T00:00:00'),
        end: DateTime.fromISO('2027-02-02T00:00:00'),
        title: 'Event 6',
      },
    ],
  },
];
