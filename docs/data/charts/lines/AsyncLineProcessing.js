import * as React from 'react';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';

const N = 100_000;

function generate(seed) {
  let s = seed;
  const xs = new Array(N);
  const ys = new Array(N);
  for (let i = 0; i < N; i += 1) {
    xs[i] = i;
    s = (s * 9301 + 49297) % 233280;
    ys[i] = 50 + Math.sin(i / 5) * 25 + (s / 233280 - 0.5) * 5;
  }
  return { xs, ys };
}

const DATASETS = [generate(1), generate(2), generate(3)];

export default function AsyncLineProcessing() {
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
      <LineChart
        xAxis={[{ data: data.xs }]}
        series={[{ data: data.ys, showMark: false }]}
        height={300}
        asyncProcessing={asyncProcessing}
      />
    </Stack>
  );
}
