import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { BarChart, barClasses } from '@mui/x-charts/BarChart';

type Bin = { x0: number; x1: number; count: number };

/**
 * Split `values` into `binCount` equal-width bins.
 * Each bin reports its [x0, x1) range and how many values fall into it.
 *
 * Feed the returned array to a BarChart whose x-axis uses
 * `scaleType: 'band'` and zero gaps, so adjacent bars touch like a histogram.
 */
function computeBins(values: number[], binCount: number): Bin[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = (max - min) / binCount;
  const bins: Bin[] = Array.from({ length: binCount }, (_, i) => ({
    x0: min + i * step,
    x1: min + (i + 1) * step,
    count: 0,
  }));
  for (const value of values) {
    const index = Math.min(Math.floor((value - min) / step), binCount - 1);
    bins[index].count += 1;
  }
  return bins;
}

// ---------------------------------------------------------------------------
// Replace this section with your own data source — an array of numbers from
// your API, file, or calculation. Anything `computeBins` can iterate over.
//
// The demo synthesizes 1,000 samples from a normal distribution (μ=50, σ=12)
// with a seeded random generator so the chart is deterministic across SSR
// and client hydration.
function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const random = createSeededRandom(42);
const data = Array.from({ length: 1000 }, () => {
  const u = 1 - random();
  const v = random();
  return 50 + 12 * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
});
// ---------------------------------------------------------------------------

export default function HistogramBarChart() {
  const [binCount, setBinCount] = React.useState(20);

  const dataset = React.useMemo(
    () =>
      computeBins(data, binCount).map((bin) => ({
        bin: `${bin.x0.toFixed(1)}–${bin.x1.toFixed(1)}`,
        count: bin.count,
      })),
    [binCount],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <BarChart
        dataset={dataset}
        xAxis={[
          {
            dataKey: 'bin',
            scaleType: 'band',
            categoryGapRatio: 0,
            barGapRatio: 0,
            tickLabelStyle: { fontSize: 10 },
          },
        ]}
        yAxis={[{ label: 'count', width: 50 }]}
        series={[{ dataKey: 'count', label: 'Frequency' }]}
        height={300}
        sx={{ [`& .${barClasses.root}`]: { shapeRendering: 'crispEdges' } }}
      />
      <Typography id="histogram-bin-count" gutterBottom>
        Bin count
      </Typography>
      <Slider
        value={binCount}
        onChange={(event, value) => setBinCount(value as number)}
        valueLabelDisplay="auto"
        min={5}
        max={60}
        aria-labelledby="histogram-bin-count"
      />
    </Box>
  );
}
