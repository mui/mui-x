import { randomInt } from '@mui/x-data-grid-generator/services';

export const initialItems = [
  { id: '1', label: 'Amy Harris', childrenCount: randomInt(1, 5) },
  { id: '2', label: 'Sam Smith', childrenCount: randomInt(1, 5) },
  { id: '3', label: 'Jordan Miles', childrenCount: randomInt(1, 5) },
  { id: '4', label: 'Amalia Brown', childrenCount: randomInt(1, 5) },
];