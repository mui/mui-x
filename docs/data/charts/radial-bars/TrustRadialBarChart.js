import * as React from 'react';
import { RadialBarChart } from '@mui/x-charts-premium/RadialBarChart';
import { europeanYouthTrust } from '../dataset/europeanYouthTrust';
import {
  EuAverageRing,
  PreviousTrustData,
  TrustLegend,
  TrustTooltip,
} from './trustRadialBarChartComponents';

const COLOR_2025 = '#1976d2';
const COLOR_2013 = '#d32f2f';

const trustFormatter = (value) => (value == null ? '' : `${value.toFixed(1)} / 10`);

const highlightScope = { highlight: 'item', fade: 'none' };

export default function TrustRadialBarChart() {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <TrustLegend currentColor={COLOR_2025} previousColor={COLOR_2013} />
      <RadialBarChart
        dataset={europeanYouthTrust}
        height={600}
        margin={{ top: 24, bottom: 24, left: 60, right: 60 }}
        hideLegend
        slots={{ tooltip: TrustTooltip }}
        series={[
          {
            dataKey: 'trust2025',
            label: '2025 trust',
            color: COLOR_2025,
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
            minRadius: '40%',
            tickInterval: [2, 4, 6, 8, 10],
          },
        ]}
        grid={{ radius: true }}
      >
        <EuAverageRing />
        <PreviousTrustData currentColor={COLOR_2025} previousColor={COLOR_2013} />
      </RadialBarChart>
    </div>
  );
}
