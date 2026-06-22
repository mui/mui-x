import { BarChart } from '@mui/x-charts/BarChart';

export default function GroupedAxesTickSize() {
  return (
    <BarChart
      xAxis={[
        {
          data,
          height: 32,
          groups: [
            {
              getValue: getMonth,
              tickSize: 0,
            },
            {
              getValue: formatQuarterYear,
              tickSize: 32,
            },
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

const formatQuarterYear = (date: Date) => {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  const year = date.getFullYear().toString().slice(-2);
  return `Q${quarter} '${year}`;
};

const valueFormatter = (v: Date) =>
  v.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

const data = [
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
];
const a = [4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800];
const b = [2400, 1398, 9800, 3908, 4800, 3800, 4300, 2181, 2500, 2100, 3000, 2000];

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
