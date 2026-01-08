import { BarChart } from '@mui/x-charts/BarChart';

export default function GroupedAxes() {
  return (
    <BarChart
      xAxis={[
        {
          data,
          scaleType: 'band',
          tickSize: 8,
          height: 36,
          groups: [
            { getValue: getMonth },
            { getValue: getQuarter },
            { getValue: getYear },
          ],
          valueFormatter,
        },
      ]}
      {...chartConfig}
    />
  );
}

const getMonth = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short' });
const getQuarter = (date: Date) => `Q${Math.floor(date.getMonth() / 3) + 1}`;

const getYear = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric' });

const valueFormatter = (v: Date) =>
  v.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

const data = [
  new Date(2014, 11, 1),
  new Date(2015, 0, 1),
  new Date(2015, 1, 1),
  new Date(2015, 2, 1),
  new Date(2015, 3, 1),
  new Date(2015, 4, 1),
  new Date(2015, 5, 1),
  new Date(2015, 6, 1),
  new Date(2015, 7, 1),
  new Date(2015, 8, 1),
  new Date(2015, 9, 1),
  new Date(2015, 10, 1),
  new Date(2015, 11, 1),
  new Date(2016, 0, 1),
];
const a = [
  3190, 4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800, 2040,
];
const b = [
  1200, 2400, 1398, 9800, 3908, 4800, 3800, 4300, 2181, 2500, 2100, 3000, 2000, 2040,
];

const getPercents = (array: number[]) =>
  array.map((v, index) => (100 * v) / (a[index] + b[index]));

const chartConfig = {
  height: 200,
  margin: { left: 0 },
  series: [
    {
      data: getPercents(a),
      label: 'Income',
      valueFormatter: (value: number | null) => `${(value ?? 0).toFixed(0)}%`,
    },
    {
      data: getPercents(b),
      label: 'Expenses',
      valueFormatter: (value: number | null) => `${(value ?? 0).toFixed(0)}%`,
    },
  ],
  yAxis: [
    {
      valueFormatter: (value: number | null) => `${(value ?? 0).toFixed(0)}%`,
    },
  ],
} as const;
