import * as React from 'react';
import { Treemap } from '@mui/x-charts-premium/Treemap';

const data = {
  label: 'root',
  children: [
    { label: 'Documents', value: 40 },
    { label: 'Photos', value: 30 },
    { label: 'Music', value: 20 },
    { label: 'Videos', value: 18 },
    { label: 'Apps', value: 12 },
    { label: 'Other', value: 6 },
  ],
};

export default function TreemapLabels() {
  return <Treemap series={{ data }} height={300} />;
}
