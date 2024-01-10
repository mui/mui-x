import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const defaultSeries = [
  { data: [2, 5.5, 2, 8.5, 1.5, 5], area: true, stack: '1' },
  { data: [2, 5.5, 2, 8.5, 1.5, 5], area: true, stack: '1' },
  { data: [2, 5.5, 2, 8.5, 1.5, 5], area: true, stack: '1' },
  { data: [2, 5.5, 2, 8.5, 1.5, 5], area: true, stack: '1' },
];

export default function LineAnimation() {
  const [series, setSeries] = React.useState(defaultSeries);
  const [nbSeries, setNbSeries] = React.useState(4);
  return (
    <React.Fragment>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={series.slice(0, nbSeries)}
        width={500}
        height={300}
      />
      <button
        onClick={() =>
          setSeries((prev) =>
            prev.map((item) => ({
              ...item,
              data: item.data.map((v) => Math.max(0.5, v - 4 + 8 * Math.random())),
            })),
          )
        }
      >
        randomoize
      </button>
      <button onClick={() => setNbSeries((prev) => prev - 1)}>remove</button>
    </React.Fragment>
  );
}
