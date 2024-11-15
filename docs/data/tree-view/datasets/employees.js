export const EMPLOYEES_DATASET = [
  {
    id: '0',
    label: 'Sarah',
  },
  {
    id: '1',
    label: 'Thomas',
    children: [
      { id: '2', label: 'Robert' },
      { id: '3', label: 'Karen' },
      { id: '4', label: 'Nancy' },
      { id: '5', label: 'Daniel' },
      { id: '6', label: 'Christopher' },
      { id: '7', label: 'Donald' },
    ],
  },
  {
    id: '8',
    label: 'Mary',
    children: [
      {
        id: '9',
        label: 'Jennifer',
        children: [{ id: '10', label: 'Anna' }],
      },
      { id: '11', label: 'Michael' },
      {
        id: '12',
        label: 'Linda',
        children: [
          { id: '13', label: 'Elizabeth' },
          { id: '14', label: 'William' },
        ],
      },
    ],
  },
];
