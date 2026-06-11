import * as React from 'react';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';
import { europeanYouthTrust } from '../dataset/europeanYouthTrust';

const highlightScope = { highlight: 'item', fade: 'global' } as const;

export default function TrustRadialBarChart() {
  return (
    <RadialBarChart
      dataset={europeanYouthTrust}
      height={500}
      series={[
        {
          dataKey: 'trust2024',
          label: '2024/25 trust',
          color: '#7fa8c9',
          highlightScope,
          valueFormatter: (v) => (v == null ? '' : `${v.toFixed(1)} / 10`),
        },
        {
          dataKey: 'trust2013',
          label: '2013 trust',
          color: '#e8896b',
          highlightScope,
          valueFormatter: (v) => (v == null ? '' : `${v.toFixed(1)} / 10`),
        },
      ]}
      rotationAxis={[
        { scaleType: 'band', dataKey: 'country', categoryGapRatio: 0.3 },
      ]}
      radiusAxis={[{ scaleType: 'linear', max: 10, minRadius: 40, position: 'none' }]}
      grid={{ radius: true }}
    />
  );
}
