import { BarChart } from '@mui/x-charts/BarChart';

function barLabel(item, context) {
  if ((item.value ?? 0) > 10) {
    return 'High';
  }
  return context.bar.height < 60 ? null : item.value?.toString();
}

export default function CustomLabels() {
  return (
    <BarChart
      series={[
        {
          data: [4, 2, 5, 4, 1],
          stack: 'A',
          label: 'Series A1',
          barLabel,
        },
        {
          data: [2, 8, 1, 3, 1],
          stack: 'A',
          label: 'Series A2',
          barLabel,
        },
        {
          data: [14, 6, 5, 8, 9],
          label: 'Series B1',
          barLabel,
        },
        {
          data: [14, 6, 5, 8, 9],
          label: 'Series B1',
          barLabel,
        },
      ]}
      height={350}
      margin={{ left: 0 }}
    />
  );
}
