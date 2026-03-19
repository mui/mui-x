// School Calendar Nested Resources Dataset

import { SchedulerEvent, SchedulerResource } from '@mui/x-scheduler/models';

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export const resources: SchedulerResource[] = [
  {
    title: 'Academics',
    id: 'academics',
    eventColor: 'purple',
    children: [
      {
        title: 'STEM',
        id: 'stem',
        eventColor: 'blue',
        children: [
          {
            title: 'Computer Science',
            id: 'computer-science',
            eventColor: 'indigo',
          },
          { title: 'Mathematics', id: 'mathematics', eventColor: 'teal' },
        ],
      },
      {
        title: 'Humanities',
        id: 'humanities',
        eventColor: 'pink',
        children: [
          { title: 'English', id: 'english', eventColor: 'orange' },
          { title: 'History', id: 'history', eventColor: 'amber' },
        ],
      },
    ],
  },
  {
    title: 'Athletics',
    id: 'athletics',
    eventColor: 'green',
    children: [
      { title: 'Varsity', id: 'varsity', eventColor: 'lime' },
      { title: 'Intramural', id: 'intramural', eventColor: 'grey' },
    ],
  },
  { title: 'Administration', id: 'administration', eventColor: 'red' },
];

export const initialEvents: SchedulerEvent[] = [
  // =====================
  // JULY 2025
  // =====================

  // Week of Jun 30 – Jul 6
  {
    id: 'cs-1',
    start: '2025-06-30T09:00:00',
    end: '2025-06-30T10:30:00',
    title: 'Intro to Algorithms Lecture',
    resource: 'computer-science',
  },
  {
    id: 'math-1',
    start: '2025-06-30T11:00:00',
    end: '2025-06-30T12:00:00',
    title: 'Calculus III Lecture',
    resource: 'mathematics',
  },
  {
    id: 'var-1',
    start: '2025-06-30T15:00:00',
    end: '2025-06-30T17:00:00',
    title: 'Soccer Practice',
    resource: 'varsity',
  },
  {
    id: 'eng-1',
    start: '2025-07-01T10:00:00',
    end: '2025-07-01T11:30:00',
    title: 'Creative Writing Workshop',
    resource: 'english',
  },
  {
    id: 'cs-2',
    start: '2025-07-01T13:00:00',
    end: '2025-07-01T15:00:00',
    title: 'Data Structures Lab',
    resource: 'computer-science',
  },
  {
    id: 'hist-1',
    start: '2025-07-02T09:00:00',
    end: '2025-07-02T10:30:00',
    title: 'American History Seminar',
    resource: 'history',
  },
  {
    id: 'admin-1',
    start: '2025-07-02T14:00:00',
    end: '2025-07-02T16:00:00',
    title: 'Faculty Senate',
    resource: 'administration',
  },
  {
    id: 'math-2',
    start: '2025-07-03T09:00:00',
    end: '2025-07-03T10:00:00',
    title: 'Statistics Workshop',
    resource: 'mathematics',
  },
  {
    id: 'intra-1',
    start: '2025-07-03T16:00:00',
    end: '2025-07-03T18:00:00',
    title: 'Volleyball Tournament',
    resource: 'intramural',
  },
  {
    id: 'admin-2',
    start: '2025-07-04T00:00:00',
    end: '2025-07-05T00:00:00',
    title: 'Independence Day — Campus Closed',
    resource: 'administration',
    allDay: true,
    readOnly: true,
  },

  // Week of Jul 7 – Jul 13
  {
    id: 'cs-3',
    start: '2025-07-07T09:00:00',
    end: '2025-07-07T10:30:00',
    title: 'Algorithms Lecture',
    resource: 'computer-science',
  },
  {
    id: 'eng-2',
    start: '2025-07-07T11:00:00',
    end: '2025-07-07T12:30:00',
    title: 'Book Club Discussion',
    resource: 'english',
  },
  {
    id: 'var-2',
    start: '2025-07-07T15:30:00',
    end: '2025-07-07T17:30:00',
    title: 'Basketball Practice',
    resource: 'varsity',
  },
  {
    id: 'math-3',
    start: '2025-07-08T09:00:00',
    end: '2025-07-08T10:30:00',
    title: 'Calculus III Lecture',
    resource: 'mathematics',
  },
  {
    id: 'hist-2',
    start: '2025-07-08T13:00:00',
    end: '2025-07-08T14:30:00',
    title: 'Guest Lecture: Civil War',
    resource: 'history',
  },
  {
    id: 'cs-4',
    start: '2025-07-09T13:00:00',
    end: '2025-07-09T15:00:00',
    title: 'Data Structures Lab',
    resource: 'computer-science',
  },
  {
    id: 'admin-3',
    start: '2025-07-09T10:00:00',
    end: '2025-07-09T12:00:00',
    title: 'Board Meeting',
    resource: 'administration',
  },
  {
    id: 'intra-2',
    start: '2025-07-10T17:00:00',
    end: '2025-07-10T19:00:00',
    title: 'Dodgeball League',
    resource: 'intramural',
  },
  {
    id: 'var-3',
    start: '2025-07-12T09:00:00',
    end: '2025-07-12T11:00:00',
    title: 'Swimming Meet',
    resource: 'varsity',
  },

  // Week of Jul 14 – Jul 20
  {
    id: 'cs-5',
    start: '2025-07-14T09:00:00',
    end: '2025-07-14T10:30:00',
    title: 'Algorithms Lecture',
    resource: 'computer-science',
  },
  {
    id: 'math-4',
    start: '2025-07-14T11:00:00',
    end: '2025-07-14T12:00:00',
    title: 'Math Tutoring Session',
    resource: 'mathematics',
  },
  {
    id: 'eng-3',
    start: '2025-07-15T10:00:00',
    end: '2025-07-15T11:30:00',
    title: 'Essay Peer Reviews',
    resource: 'english',
  },
  {
    id: 'hist-3',
    start: '2025-07-15T14:00:00',
    end: '2025-07-15T15:30:00',
    title: 'History Seminar',
    resource: 'history',
  },
  {
    id: 'var-4',
    start: '2025-07-16T15:00:00',
    end: '2025-07-16T17:00:00',
    title: 'Soccer Practice',
    resource: 'varsity',
  },
  {
    id: 'cs-6',
    start: '2025-07-16T13:00:00',
    end: '2025-07-16T15:00:00',
    title: 'CS Faculty Meeting',
    resource: 'computer-science',
  },
  {
    id: 'admin-4',
    start: '2025-07-17T09:00:00',
    end: '2025-07-17T12:00:00',
    title: 'New Student Orientation',
    resource: 'administration',
  },
  {
    id: 'intra-3',
    start: '2025-07-18T16:00:00',
    end: '2025-07-18T18:00:00',
    title: 'Softball Game',
    resource: 'intramural',
  },
  {
    id: 'math-5',
    start: '2025-07-18T09:00:00',
    end: '2025-07-18T10:30:00',
    title: 'Statistics Workshop',
    resource: 'mathematics',
  },

  // Week of Jul 21 – Jul 27
  {
    id: 'cs-7',
    start: '2025-07-21T09:00:00',
    end: '2025-07-21T10:30:00',
    title: 'Algorithms Lecture',
    resource: 'computer-science',
  },
  {
    id: 'eng-4',
    start: '2025-07-21T11:00:00',
    end: '2025-07-21T12:30:00',
    title: 'Poetry Analysis Workshop',
    resource: 'english',
  },
  {
    id: 'hist-4',
    start: '2025-07-22T09:00:00',
    end: '2025-07-22T12:00:00',
    title: 'Museum Field Trip',
    resource: 'history',
  },
  {
    id: 'math-6',
    start: '2025-07-22T13:00:00',
    end: '2025-07-22T14:30:00',
    title: 'Calculus III Lecture',
    resource: 'mathematics',
  },
  {
    id: 'cs-8',
    start: '2025-07-23T13:00:00',
    end: '2025-07-23T15:00:00',
    title: 'Data Structures Lab',
    resource: 'computer-science',
  },
  {
    id: 'var-5',
    start: '2025-07-23T15:30:00',
    end: '2025-07-23T17:30:00',
    title: 'Basketball Game',
    resource: 'varsity',
  },
  {
    id: 'admin-5',
    start: '2025-07-24T14:00:00',
    end: '2025-07-24T16:00:00',
    title: 'Parent-Teacher Conference',
    resource: 'administration',
  },
  {
    id: 'intra-4',
    start: '2025-07-25T16:00:00',
    end: '2025-07-25T18:00:00',
    title: 'Volleyball Tournament',
    resource: 'intramural',
  },
  {
    id: 'cs-9',
    start: '2025-07-26T00:00:00',
    end: '2025-07-27T00:00:00',
    title: 'Hackathon',
    resource: 'computer-science',
    allDay: true,
  },

  // Week of Jul 28 – Jul 31
  {
    id: 'cs-10',
    start: '2025-07-28T09:00:00',
    end: '2025-07-28T10:30:00',
    title: 'Algorithms Lecture',
    resource: 'computer-science',
  },
  {
    id: 'math-7',
    start: '2025-07-28T11:00:00',
    end: '2025-07-28T12:00:00',
    title: 'Math Tutoring Session',
    resource: 'mathematics',
  },
  {
    id: 'eng-5',
    start: '2025-07-29T10:00:00',
    end: '2025-07-29T11:30:00',
    title: 'Creative Writing Workshop',
    resource: 'english',
  },
  {
    id: 'hist-5',
    start: '2025-07-29T13:00:00',
    end: '2025-07-29T14:30:00',
    title: 'History Seminar',
    resource: 'history',
  },
  {
    id: 'var-6',
    start: '2025-07-30T15:00:00',
    end: '2025-07-30T17:00:00',
    title: 'Soccer Practice',
    resource: 'varsity',
  },
  {
    id: 'admin-6',
    start: '2025-07-31T10:00:00',
    end: '2025-07-31T12:00:00',
    title: 'Summer Session Wrap-up',
    resource: 'administration',
  },
];
