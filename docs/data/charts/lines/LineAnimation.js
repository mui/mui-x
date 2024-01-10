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
  return (
    <React.Fragment>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={series}
        width={500}
        height={300}
      />
      <button
        onClick={() =>
          setSeries((prev) =>
            prev.map((item) => ({
              ...item,
              data: item.data.map((v) => v + 2 * Math.random()),
            })),
          )
        }
      >
        randomoize
      </button>
    </React.Fragment>
  );
}
