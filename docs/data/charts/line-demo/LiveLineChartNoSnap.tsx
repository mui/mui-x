import * as React from 'react';
import Button from 'node_modules/@mui/material/Button';
import { LineChart } from '@mui/x-charts/LineChart';

const dateFormatter = Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
});
const oneDay = 24 * 60 * 60 * 1000; // in milliseconds

const length = 50;
const initialFirstData = Array.from<number>({ length }).map(
  (_, __, array) => (array.at(-1) ?? 0) + randBetween(-100, 500),
);
const initialSecondData = Array.from<number>({ length }).map(
  (_, __, array) => (array.at(-1) ?? 0) + randBetween(-500, 100),
);

export default function LiveLineChartNoSnap() {
  const [running, setRunning] = React.useState(false);
  const [date, setDate] = React.useState(new Date(2000, 0, 0));
  const [firstData, setFirstData] = React.useState(initialFirstData);
  const [secondData, setSecondData] = React.useState(initialSecondData);

  React.useEffect(() => {
    if (!running) {
      return undefined;
    }
    const intervalId = setInterval(() => {
      setDate((prev) => new Date(prev.getTime() + oneDay));
      setFirstData((prev) => [
        ...prev.slice(1),
        prev.at(-1)! + randBetween(-500, 500),
      ]);
      setSecondData((prev) => [
        ...prev.slice(1),
        prev.at(-1)! + randBetween(-500, 500),
      ]);
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [running]);

  return (
    <div style={{ width: '100%' }}>
      <LineChart
        height={300}
        skipAnimation
        series={[
          { data: secondData, showMark: false },
          { data: firstData, showMark: false },
        ]}
        xAxis={[
          {
            scaleType: 'point',
            data: Array.from({ length }).map(
              (_, i) => new Date(date.getTime() + i * oneDay),
            ),
            valueFormatter: (value: Date) => dateFormatter.format(value),
          },
        ]}
        yAxis={[{ width: 50 }]}
        margin={{ right: 24 }}
      />
      <Button size="small" variant="contained" onClick={() => setRunning((p) => !p)}>
        {running ? 'stop' : 'start'}
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          setFirstData(initialFirstData);
          setSecondData(initialSecondData);
        }}
      >
        reset
      </Button>
    </div>
  );
}

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
