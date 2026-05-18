import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import Chance from 'chance';

const POINT_COUNT_SERIES = 10000;
const NUMBER_OF_SERIES = 2;
const POINT_COUNT = POINT_COUNT_SERIES * NUMBER_OF_SERIES;

// Gaussian-ish blobs so the progressive, batched paint is easy to see.
// Points are grouped by series: each contiguous block of `POINT_COUNT_SERIES`
// belongs to one series and is offset into its own region.
function makeData(chance) {
  const data = [];
  for (let i = 0; i < POINT_COUNT; i += 1) {
    const seriesIndex = Math.floor(i / POINT_COUNT_SERIES);
    const angle = chance.floating({ min: 0, max: 2 * Math.PI });
    const radius = Math.sqrt(chance.floating({ min: 0, max: 1 })) * 40;
    const offsetX = (seriesIndex % 2) * 50;
    const offsetY = seriesIndex * 25;
    data.push({
      x: offsetX + radius * Math.cos(angle) + 10,
      y: offsetY + radius * Math.sin(angle) + 10,
    });
  }
  return data;
}

export default function ScatterAsyncRenderer() {
  const [seed, setSeed] = React.useState(42);
  // Recomputed only when reshuffled: regenerating the points on every render
  // would dominate the demo. A new dataset re-triggers the async processing,
  // so the progressive, batched paint plays again.
  const data = React.useMemo(() => makeData(new Chance(seed)), [seed]);

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'center' }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {POINT_COUNT.toLocaleString()} points — default `svg-single` renderer
        </Typography>
        <Button variant="outlined" size="small" onClick={() => setSeed(seed + 1)}>
          Reshuffle
        </Button>
      </Stack>
      <ScatterChart
        series={Array.from({ length: NUMBER_OF_SERIES }, (_, i) => ({
          id: `series-${i}`,
          label: `Series ${i + 1}`,
          data: data.slice(i * POINT_COUNT_SERIES, (i + 1) * POINT_COUNT_SERIES),
        }))}
        height={400}
        // `svg-single` is the default. Above the internal threshold it
        // automatically switches to the async, batched implementation: every
        // batch group mounts immediately and its points are painted
        // progressively as the series/axes processors settle.
        renderer="svg-single"
      />
    </Stack>
  );
}
