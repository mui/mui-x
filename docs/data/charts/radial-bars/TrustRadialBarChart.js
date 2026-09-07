import * as React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
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
    <div style={{ width: '100%' }}>
      <Typography variant="h6" align="center">
        Trust in others across Europe
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary">
        Average rating (0–10), 2013 vs 2025
      </Typography>
      <Box sx={{ position: 'relative', mt: { xs: 1, sm: 2 } }}>
        <Box sx={{ height: { xs: 340, sm: 550 } }}>
          <RadialBarChart
            dataset={europeanYouthTrust}
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
            <PreviousTrustData
              currentColor={COLOR_2025}
              previousColor={COLOR_2013}
            />
          </RadialBarChart>
        </Box>
        <TrustLegend currentColor={COLOR_2025} previousColor={COLOR_2013} />
      </Box>
      <Typography
        variant="caption"
        align="center"
        color="text.secondary"
        component="p"
        sx={{ mt: 2 }}
      >
        Source:{' '}
        <Link
          href="https://ec.europa.eu/eurostat/databrowser/view/ilc_pw03/default/table"
          target="_blank"
          rel="noopener"
        >
          Eurostat
        </Link>
      </Typography>
    </div>
  );
}
