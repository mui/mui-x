import * as React from 'react';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const N = 50_000;

function generate(seed: number) {
  let s = seed;
  const data = new Array<{ id: number; x: number; y: number }>(N);
  for (let i = 0; i < N; i += 1) {
    s = (s * 9301 + 49297) % 233280;
    const x = s / 233280;
    s = (s * 9301 + 49297) % 233280;
    const y = s / 233280;
    data[i] = { id: i, x, y };
  }
  return data;
}

const DATASETS = [generate(1), generate(2), generate(3)];

export default function AsyncScatterProcessing() {
  const [datasetIndex, setDatasetIndex] = React.useState(0);
  const [asyncProcessing, setAsyncProcessing] = React.useState(true);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 100);
    return () => clearInterval(id);
  }, []);

  const data = DATASETS[datasetIndex];

  return (
    <Stack spacing={2} alignItems="flex-start">
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <FormControlLabel
          control={
            <Switch
              checked={asyncProcessing}
              onChange={(event) => setAsyncProcessing(event.target.checked)}
            />
          }
          label="asyncProcessing"
        />
        <Button
          variant="outlined"
          onClick={() => setDatasetIndex((i) => (i + 1) % DATASETS.length)}
        >
          Reload data ({N.toLocaleString()} pts)
        </Button>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          counter: {tick} (smooth = main thread free)
        </Typography>
      </Stack>
      <ScatterChart
        series={[{ data, markerSize: 2 }]}
        height={300}
        asyncProcessing={asyncProcessing}
      />
    </Stack>
  );
}
