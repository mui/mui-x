import * as React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { mangoFusionPalette } from '@mui/x-charts/colorPalettes';

const defaultSeries = [
  { data: [4, 5, 1, 2, 3, 3, 2], area: true, stack: '1' },
  { data: [7, 4, 6, 7, 2, 3, 5], area: true, stack: '1' },
  { data: [6, 4, 1, 2, 6, 3, 3], area: true, stack: '1' },
  { data: [4, 7, 6, 1, 2, 7, 7], area: true, stack: '1' },
  { data: [2, 2, 1, 7, 1, 5, 3], area: true, stack: '1' },
  { data: [6, 6, 1, 6, 7, 1, 1], area: true, stack: '1' },
  { data: [7, 6, 1, 6, 4, 4, 6], area: true, stack: '1' },
  { data: [4, 3, 1, 6, 6, 3, 5], area: true, stack: '1' },
  { data: [7, 6, 2, 7, 4, 2, 7], area: true, stack: '1' },
  // { data: [5, 3, 4, 4, 4, 4, 7], area: true, stack: '1' },
].map((item, index) => ({
  ...item,
  id: index.toString(),
  color: index === 3 ? 'red' : mangoFusionPalette('light')[index],
}));

export default function LineAnimation() {
  const [series, setSeries] = React.useState(defaultSeries);
  const [nbSeries, setNbSeries] = React.useState(3);
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <LineChart
          xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7] }]}
          series={[
            ...series.slice(0, Math.min(nbSeries, 8)),
            ...series.slice(8, 10),
          ]}
          height={400}
        />
      </div>
      <Stack spacing={1} direction="row">
        <Button
          variant="outlined"
          onClick={() =>
            setSeries((prev) =>
              prev.map((item) => ({
                ...item,
                data: item.data.map((v) => Math.max(0.5, v - 4 + 8 * Math.random())),
              })),
            )
          }
        >
          randomize
        </Button>
        <Button
          variant="outlined"
          onClick={() => setNbSeries((prev) => prev - 1)}
          disabled={nbSeries === 0}
        >
          remove
        </Button>
        <Button
          variant="outlined"
          onClick={() => setNbSeries((prev) => prev + 1)}
          disabled={nbSeries === 8}
        >
          add
        </Button>
      </Stack>
    </div>
  );
}
