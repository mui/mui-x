import * as React from 'react';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'fruits',
  children: [
    { id: 'Apple', value: 30, color: '#e53935' },
    { id: 'Banana', value: 25, color: '#fdd835' },
    { id: 'Grape', value: 20, color: '#8e24aa' },
    { id: 'Orange', value: 18, color: '#fb8c00' },
    { id: 'Kiwi', value: 15, color: '#7cb342' },
  ],
};

export default function TreemapColors() {
  return <Treemap series={{ data }} height={300} />;
}
