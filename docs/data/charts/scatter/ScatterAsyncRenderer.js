import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import Chance from 'chance';

const POINT_COUNT_SERIES = 10000;
const NUMBER_OF_SERIES = 2;
// 2 x 10k points, using the internal threshold of 2k points per series to trigger the async renderer. This is enough to
// see the progressive paint in action without being too heavy on the CPU.
// And considering we render in batches of 1k points, this means we'll see 20 batches in total.
// Rendering is tied to rAF, so the exact number of batches and paint times will vary based on the screen refresh rate,
// At 60Hz we can expect 30 frames per second, since we skip every other frame to allow the main thread to breathe.
const POINT_COUNT = POINT_COUNT_SERIES * NUMBER_OF_SERIES;

// Gaussian-ish blobs so the progressive, batched paint is easy to see.
// Points are grouped by series: each contiguous block of `POINT_COUNT_SERIES`
// belongs to one series and is offset into its own region.
function makeData(chance) {
  const data = [];
  for (let i = 0; i < POINT_COUNT; i += 1) {
    const seriesIndex = Math.floor(i / POINT_COUNT_SERIES);
    const angle = chance.floating({ min: 0, max: 2 * Math.PI });
    const radius = Math.sqrt(chance.floating({ min: 0, max: 1 })) * 100;
    const noiseX = chance.floating({ min: -100, max: 10 });
    const noiseY = chance.floating({ min: -100, max: 10 });
    const offsetX = (seriesIndex % 2) * 50;
    const offsetY = seriesIndex * 25;
    data.push({
      x: offsetX + radius * Math.cos(angle) + noiseX,
      y: offsetY + radius * Math.sin(angle) + noiseY,
    });
  }
  return data;
}

// Calculate the two datasets outside the component so they don't have to be re-generated.
const initialData = makeData(new Chance(42));
const switchData = makeData(new Chance(43));

export default function ScatterAsyncRenderer() {
  const [isInitial, setIsInitial] = React.useState(true);
  const data = isInitial ? initialData : switchData;
  // Memoize the series so the `data` arrays keep a stable reference across
  // unrelated re-renders (for example clicking an anchor on the page).
  // Otherwise new array references would replay the progressive paint.
  const series = React.useMemo(
    () =>
      Array.from({ length: NUMBER_OF_SERIES }, (_, i) => ({
        id: `series-${i}`,
        label: `Series ${i + 1}`,
        data: data.slice(i * POINT_COUNT_SERIES, (i + 1) * POINT_COUNT_SERIES),
        markerSize: 2,
      })),
    [data],
  );

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
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsInitial(!isInitial)}
        >
          Reshuffle
        </Button>
      </Stack>
      <ScatterChart
        series={series}
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
