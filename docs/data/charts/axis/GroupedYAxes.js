import { BarChart } from '@mui/x-charts/BarChart';

export default function GroupedYAxes() {
  return (
    <BarChart
      layout="horizontal"
      yAxis={[
        {
          data: categoryData,
          scaleType: 'band',
          width: 120,
          groups: [
            // Extract main category
            { getValue: (category) => category[1] },
            // Extract subcategory
            {
              getValue: (category) => category[0],
              tickSize: 120,
              tickLabelStyle: {
                angle: -90,
                textAnchor: 'middle',
              },
            },
          ],
          valueFormatter: (value) => value.join(' - '),
        },
      ]}
      {...chartConfig}
    />
  );
}

const categoryData = [
  ['Technology', 'Software'],
  ['Technology', 'Hardware'],
  ['Technology', 'AI/ML'],
  ['Finance', 'Banking'],
  ['Finance', 'Insurance'],
  ['Finance', 'Investment'],
  ['Healthcare', 'Pharmaceuticals'],
  ['Healthcare', 'Medical Devices'],
  ['Healthcare', 'Telemedicine'],
];

const salesData = [150, 120, 200, 180, 90, 160, 140, 110, 85];
const profitData = [45, 35, 80, 65, 25, 55, 50, 40, 30];

const chartConfig = {
  height: 400,
  xAxis: [{ valueFormatter: (value) => `${value}K` }],
  series: [
    {
      data: salesData,
      label: 'Sales',
      valueFormatter: (value) => `${value}K`,
    },
    {
      data: profitData,
      label: 'Profit',
      valueFormatter: (value) => `${value}K`,
    },
  ],
};
