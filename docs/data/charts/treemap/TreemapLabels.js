import * as React from 'react';
import { Treemap } from '@mui/x-charts-premium/Treemap';

const data = {
  id: 'root',
  children: [
    { id: 'Documents', value: 40 },
    { id: 'Photos', value: 30 },
    { id: 'Music', value: 20 },
    { id: 'Videos', value: 18 },
    { id: 'Apps', value: 12 },
    { id: 'Other', value: 6 },
  ],
};

export default function TreemapLabels() {
  return <Treemap series={{ data }} height={300} />;
}
