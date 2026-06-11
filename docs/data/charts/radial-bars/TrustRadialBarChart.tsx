import * as React from 'react';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';
import { europeanYouthTrust } from '../dataset/europeanYouthTrust';
import { EuAverageRing, PreviousTrustData } from './trustRadialBarChartComponents';

const CURRENT_COLOR = '#7fa8c9';
const PREVIOUS_COLOR = '#e8896b';

const trustFormatter = (value: number | null) =>
  value == null ? '' : `${value.toFixed(1)} / 10`;

const highlightScope = { highlight: 'item', fade: 'none' } as const;

export default function TrustRadialBarChart() {
  return (
    <RadialBarChart
      dataset={europeanYouthTrust}
      height={600}
      margin={{ top: 24, bottom: 24, left: 24, right: 24 }}
      hideLegend
      series={[
        {
          dataKey: 'trust2024',
          label: '2024/25 trust',
          color: CURRENT_COLOR,
          highlightScope,
          valueFormatter: trustFormatter,
        },
      ]}
      rotationAxis={[
        {
          scaleType: 'band',
          dataKey: 'country',
          startAngle: 0,
          endAngle: 354,
          categoryGapRatio: 0.25,
        },
      ]}
      radiusAxis={[
        {
          scaleType: 'linear',
          min: 0,
          max: 10,
          minRadius: 130,
          tickInterval: [6, 8, 10],
        },
      ]}
      grid={{ radius: true }}
    >
      <EuAverageRing />
      <PreviousTrustData
        currentColor={CURRENT_COLOR}
        previousColor={PREVIOUS_COLOR}
      />
    </RadialBarChart>
  );
}
