import * as React from 'react';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'root',
  children: [
    { id: 'Europe', value: 45 },
    { id: 'Asia', value: 60 },
    { id: 'Americas', value: 38 },
    { id: 'Africa', value: 22 },
    { id: 'Oceania', value: 10 },
  ],
};

export default function TreemapHighlight() {
  return (
    <Treemap
      series={{ data, nodeOptions: { highlight: 'item', fade: 'global' } }}
      height={300}
    />
  );
}
