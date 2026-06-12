import * as React from 'react';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';
import { europeanYouthTrust } from '../dataset/europeanYouthTrust';
import {
  EuAverageRing,
  PreviousTrustData,
  TrustLegend,
  TrustTooltip,
} from './trustRadialBarChartComponents';

const CURRENT_COLOR = '#1976d2';
const PREVIOUS_COLOR = '#d32f2f';

const trustFormatter = (value) => (value == null ? '' : `${value.toFixed(1)} / 10`);

const highlightScope = { highlight: 'item', fade: 'none' };

export default function TrustRadialBarChart() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <TrustLegend currentColor={CURRENT_COLOR} previousColor={PREVIOUS_COLOR} />
      <RadialBarChart
        dataset={europeanYouthTrust}
        height={600}
        margin={{ top: 24, bottom: 24, left: 24, right: 24 }}
        hideLegend
        slots={{ tooltip: TrustTooltip }}
        series={[
          {
            dataKey: 'trust2025',
            label: '2025 trust',
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
            tickInterval: [2, 4, 6, 8, 10],
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
    </div>
  );
}
