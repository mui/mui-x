import * as React from 'react';
import { Treemap } from '@mui/x-charts-pro/Treemap';

export default function TreemapColors() {
  return (
    <Treemap
      series={{
        data: {
          id: 'portfolio',
          children: [
            { id: 'Stocks', value: 45, color: '#112e81' },
            { id: 'Bonds', value: 25, color: '#4647ae' },
            { id: 'Real estate', value: 15, color: '#4382df' },
            { id: 'Cash', value: 10, color: '#7fb2dd' },
            { id: 'Crypto', value: 5, color: '#aaccd6' },
          ],
        },
      }}
      height={300}
    />
  );
}
