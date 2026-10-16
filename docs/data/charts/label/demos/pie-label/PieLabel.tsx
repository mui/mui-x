import { PieChart } from '@mui/x-charts/PieChart';

export default function PieLabel() {
  return (
    // @focus-start @padding 2
    <PieChart
      {...props}
      series={[
        {
          data: [
            { id: 0, value: 10, label: (location) => `${location}+A` },
            { id: 1, value: 15, label: (location) => `${location}+B` },
            { id: 2, value: 20, label: (location) => `${location}+C` },
          ],
          type: 'pie',
          arcLabel: 'label',
        },
      ]}
    />
    // @focus-end
  );
}

const props = {
  width: 200,
  height: 200,
};
