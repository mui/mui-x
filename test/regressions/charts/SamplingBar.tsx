import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';

type SamplingMethod = 'none' | 'minmax' | 'm4' | 'lttb';

// Deterministic peaky signal so sampling differences (min/max envelope per
// bucket, dropped bars) are visible in the screenshot.
const DATA_LENGTH = 1024;
const data = Array.from({ length: DATA_LENGTH }, (_, i) => {
  const wave = Math.sin(i / 11) + 0.5 * Math.sin(i / 2.3);
  const spike = i % 97 === 0 ? 4 : 0;
  return wave + spike;
});
const xData = Array.from({ length: DATA_LENGTH }, (_, i) => String(i));

// Bars always use the min/max envelope, so the line algorithm is ignored. Cover
// `none` plus one sampled method to keep the screenshot focused.
const SAMPLINGS: SamplingMethod[] = ['none', 'minmax'];
const ZOOMS = [
  { label: '0-100', start: 0, end: 100 },
  { label: '50-100', start: 50, end: 100 },
  { label: '90-100', start: 90, end: 100 },
];

function Cell({
  sampling,
  zoom,
}: {
  sampling: SamplingMethod;
  zoom: (typeof ZOOMS)[number];
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="caption">{`${sampling} · ${zoom.label}`}</Typography>
      <BarChartPro
        series={[{ data }]}
        xAxis={[{ data: xData, zoom: true, id: 'x' }]}
        yAxis={[{ position: 'none' }]}
        width={300}
        height={160}
        margin={0}
        sampling={sampling}
        zoomData={[{ axisId: 'x', start: zoom.start, end: zoom.end }]}
        skipAnimation
      />
    </Box>
  );
}

export default function SamplingBar() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {SAMPLINGS.map((sampling) => (
        <Box key={sampling} sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          {ZOOMS.map((zoom) => (
            <Cell key={zoom.label} sampling={sampling} zoom={zoom} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
