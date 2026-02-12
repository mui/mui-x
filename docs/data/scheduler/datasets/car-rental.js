// Fake data of a car rental company

export const defaultVisibleDate = new Date('2025-07-01T00:00:00');

export const initialEvents = [
  {
    id: 'rental-1',
    start: '2025-06-29T09:00:00',
    end: '2025-07-03T10:00:00',
    title: 'Rental - John Doe',
    resource: 'fiat-500',
  },
  {
    id: 'rental-2',
    start: '2025-07-01T11:00:00',
    end: '2025-07-04T17:00:00',
    title: 'Rental - Jane Smith',
    resource: 'volkswagen-id3',
  },
  {
    id: 'rental-3',
    start: '2025-07-05T09:00:00',
    end: '2025-07-05T14:00:00',
    title: 'Rental - Jimmy Lee',
    resource: 'volkswagen-id3',
  },
  {
    id: 'rental-4',
    start: '2025-06-30T09:00:00',
    end: '2025-06-30T18:00:00',
    title: 'Rental - Alice Johnson',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-5',
    start: '2025-07-01T11:00:00',
    end: '2025-07-02T17:00:00',
    title: 'Rental - Ronald Brown',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-6',
    start: '2025-07-03T09:00:00',
    end: '2025-07-03T18:00:00',
    title: 'Rental - Alice Johnson',
    resource: 'peugeot-3008',
  },
  {
    id: 'rental-7',
    start: '2025-06-29T14:00:00',
    end: '2025-07-01T09:00:00',
    title: 'Rental - Nina White',
    resource: 'cupra-leon',
  },
  {
    id: 'rental-8',
    start: '2025-07-01T14:00:00',
    end: '2025-07-01T18:00:00',
    title: 'Rental - Bob Brown',
    resource: 'cupra-leon',
  },
];

export const resources = [
  { title: 'Fiat 500', id: 'fiat-500', eventColor: 'indigo' },
  { title: 'Volkswagen ID3', id: 'volkswagen-id3', eventColor: 'blue' },
  { title: 'Peugeot 3008', id: 'peugeot-3008', eventColor: 'teal' },
  { title: 'Cupra Leon', id: 'cupra-leon', eventColor: 'orange' },
];
