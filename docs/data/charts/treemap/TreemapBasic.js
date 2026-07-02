import * as React from 'react';
import { Treemap } from '@mui/x-charts-pro/Treemap';

const data = {
  id: 'languages',
  children: [
    { id: 'JavaScript', value: 62 },
    { id: 'Python', value: 51 },
    { id: 'TypeScript', value: 39 },
    { id: 'Java', value: 30 },
    { id: 'C#', value: 27 },
    { id: 'Go', value: 14 },
    { id: 'Rust', value: 12 },
  ],
};

export default function TreemapBasic() {
  return <Treemap series={{ data }} height={300} />;
}
