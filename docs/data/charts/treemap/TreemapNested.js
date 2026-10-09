import * as React from 'react';
import { Treemap } from '@mui/x-charts-premium/Treemap';

const data = {
  label: 'tech',
  children: [
    {
      label: 'Frontend',
      children: [
        { label: 'React', value: 40 },
        { label: 'Vue', value: 18 },
        { label: 'Angular', value: 17 },
      ],
    },
    {
      label: 'Backend',
      children: [
        { label: 'Node', value: 40 },
        { label: 'Django', value: 15 },
        { label: 'Rails', value: 8 },
      ],
    },
    {
      label: 'Mobile',
      children: [
        { label: 'Flutter', value: 22 },
        { label: 'React Native', value: 20 },
      ],
    },
  ],
};

export default function TreemapNested() {
  return <Treemap series={{ data }} height={300} />;
}
