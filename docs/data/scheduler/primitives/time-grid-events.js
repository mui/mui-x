import { DateTime } from 'luxon';

export const days = [
  {
    date: DateTime.fromISO('2027-02-22'),
    events: [
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
    ],
  },
  {
    date: DateTime.fromISO('2027-02-23'),
    events: [
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
    ],
  },
  {
    date: DateTime.fromISO('2027-02-24'),
    events: [
      {
        id: '5',
        start: DateTime.fromISO('2027-02-24T08:00:00'),
        end: DateTime.fromISO('2027-02-24T17:00:00'),
        title: 'Scheduler deep dive',
        resource: 'work',
      },
    ],
  },
  {
    date: DateTime.fromISO('2027-02-25'),
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2027-02-25T07:30:00'),
        end: DateTime.fromISO('2027-02-25T08:15:00'),
        title: 'Running',
        resource: 'personal',
      },
    ],
  },
  {
    date: DateTime.fromISO('2027-02-26'),
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2027-02-26T15:00:00'),
        end: DateTime.fromISO('2027-02-26T15:45:00'),
        title: 'Retrospective',
        resource: 'work',
      },
    ],
  },
];
