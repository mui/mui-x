import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { blueberryTwilightPalette } from '@mui/x-charts/colorPalettes';

const defaultSeries = [
  { data: [2, 2], area: true, stack: '1' },
  { data: [2, 2], area: true, stack: '1' },
  { data: [2, 2], area: true, stack: '1' },
  { data: [2, 2], area: true, stack: '1' },
  { data: [2, 2], area: true, stack: '1' },
  { data: [2, 2], area: true, stack: '1' },
].map((item, index) => ({
  ...item,
  id: index.toString(),
  color: index === 3 ? 'red' : blueberryTwilightPalette('light')[index],
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
          xAxis={[{ data: [1, 10] }]}
          series={[...series.slice(0, Math.min(nbSeries, 4)), ...series.slice(4, 5)]}
          // width={500}
          height={800}
        />
      </div>
      <div>
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
          randomize
        </button>
        <button onClick={() => setNbSeries((prev) => prev - 1)}>remove</button>
        <button onClick={() => setNbSeries((prev) => prev + 1)}>add</button>
      </div>
    </div>
  );
}
