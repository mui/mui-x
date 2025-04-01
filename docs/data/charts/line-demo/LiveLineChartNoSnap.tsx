import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const dateFormatter = Intl.DateTimeFormat(undefined, {
  month: '2-digit',
  day: '2-digit',
});
const oneDay = 24 * 60 * 60 * 1000; // in milliseconds

const length = 16;
const firstDataSeed = randBetween(0, 5000);
const secondDataSeed = randBetween(0, 5000);
const initialFirstData = Array.from<number>({ length }).map(
  (_, __, array) => (array.at(-1) ?? firstDataSeed) + randBetween(-500, 500),
);
const initialSecondData = Array.from<number>({ length }).map(
  (_, __, array) => (array.at(-1) ?? secondDataSeed) + randBetween(-500, 500),
);

export default function LiveLineChartNoSnap() {
  const [date, setDate] = React.useState(new Date(2000, 0, 0));
  const [firstData, setFirstData] = React.useState(initialFirstData);
  const [secondData, setSecondData] = React.useState(initialSecondData);

  React.useEffect(() => {
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
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <LineChart
      height={300}
      series={[{ data: secondData }, { data: firstData }]}
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
  );
}

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
