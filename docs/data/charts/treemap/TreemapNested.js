import * as React from 'react';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'tech',
  children: [
    {
      id: 'Frontend',
      children: [
        { id: 'React', value: 40 },
        { id: 'Vue', value: 18 },
        { id: 'Angular', value: 17 },
      ],
    },
    {
      id: 'Backend',
      children: [
        { id: 'Node', value: 40 },
        { id: 'Django', value: 15 },
        { id: 'Rails', value: 8 },
      ],
    },
    {
      id: 'Mobile',
      children: [
        { id: 'Flutter', value: 22 },
        { id: 'React Native', value: 20 },
      ],
    },
  ],
};

export default function TreemapNested() {
  return (
    <Treemap series={{ data, nodeOptions: { borderRadius: 2 } }} height={300} />
  );
}
