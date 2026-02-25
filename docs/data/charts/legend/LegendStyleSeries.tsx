import {
  LineChart,
  LineChartProps,
  lineElementClasses,
} from '@mui/x-charts/LineChart';
import { legendClasses } from '@mui/x-charts/ChartsLegend';
import { labelMarkClasses } from '@mui/x-charts/ChartsLabel';

const monthlySalesData = [
  { month: 'Jan', productA: 120, productB: 90 },
  { month: 'Feb', productA: 130, productB: 100 },
  { month: 'Mar', productA: 125, productB: 110 },
  { month: 'Apr', productA: 150, productB: 95 },
  { month: 'May', productA: 160, productB: 105 },
  { month: 'Jun', productA: 170, productB: 115 },
  { month: 'Jul', productA: 165, productB: 120 },
  { month: 'Aug', productA: 175, productB: 130 },
  { month: 'Sep', productA: 180, productB: 125 },
  { month: 'Oct', productA: 190, productB: 135 },
  { month: 'Nov', productA: 200, productB: 140 },
  { month: 'Dec', productA: 210, productB: 145 },
];

const settings = {
  series: [
    {
      data: monthlySalesData.map((d) => d.productA),
      label: 'Product A',
      id: 'a',
    },
    {
      data: monthlySalesData.map((d) => d.productB),
      label: 'Product B',
      id: 'b',
    },
  ],
  xAxis: [
    {
      scaleType: 'point',
      data: monthlySalesData.map((d) => d.month),
    },
  ],
  yAxis: [{ width: 50, label: 'Sales' }],
  height: 300,
  margin: { right: 24 },
} satisfies LineChartProps;

export default function LegendStyleSeries() {
  return (
    <LineChart
      {...settings}
      sx={{
        [`.${lineElementClasses.root}, .${labelMarkClasses.fill}`]: {
          strokeWidth: 1,
        },
        [`.${lineElementClasses.root}[data-series="a"], .${legendClasses.item}[data-series="a"] .${labelMarkClasses.fill}`]:
          {
            strokeDasharray: '5 5',
          },
        [`.${lineElementClasses.root}[data-series="b"], .${legendClasses.item}[data-series="b"] .${labelMarkClasses.fill}`]:
          {
            strokeDasharray: '3 2',
          },
        [`.${labelMarkClasses.root}`]: {
          width: 24,
        },
      }}
    />
  );
}
