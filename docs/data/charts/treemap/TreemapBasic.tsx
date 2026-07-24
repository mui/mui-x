import * as React from 'react';
import { Treemap } from '@mui/x-charts-premium/Treemap';

export default function TreemapBasic() {
  return (
    <Treemap
      series={{
        data: {
          label: 'root',
          children: [
            { label: 'Documents', value: 40 },
            { label: 'Photos', value: 30 },
            { label: 'Music', value: 20 },
            { label: 'Videos', value: 18 },
            { label: 'Apps', value: 12 },
            { label: 'Other', value: 6 },
          ],
        },
      }}
      height={300}
    />
  );
}
