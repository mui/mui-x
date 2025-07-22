import { DateTime } from 'luxon';

export const resources: Resource[] = [
  {
    title: 'Resource A',
    events: [
      {
        id: '1',
        start: DateTime.fromISO('2027-02-22T07:30:00'),
        end: DateTime.fromISO('2027-02-22T09:00:00'),
        title: 'Event 1',
      },
      {
        id: '2',
        start: DateTime.fromISO('2027-02-22T10:00:00'),
        end: DateTime.fromISO('2027-02-22T13:15:00'),
        title: 'Event 2',
      },
    ],
  },
  {
    title: 'Resource B',
    events: [
      {
        id: '2',
        start: DateTime.fromISO('2027-02-22T11:00:00'),
        end: DateTime.fromISO('2027-02-22T17:00:00'),
        title: 'Event 3',
      },
    ],
  },
  {
    title: 'Resource C',
    events: [],
  },
  {
    title: 'Resource D',
    events: [],
  },
  {
    title: 'Resource E',
    events: [],
  },
  {
    title: 'Resource F',
    events: [],
  },
  {
    title: 'Resource G',
    events: [],
  },
  {
    title: 'Resource H',
    events: [],
  },
];

export interface Resource {
  title: string;
  events: {
    id: string;
    start: DateTime;
    end: DateTime;
    title: string;
  }[];
}
