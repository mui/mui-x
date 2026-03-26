import { LineChart } from '@mui/x-charts/LineChart';

export default function LinePointerInteraction() {
  return (
    <LineChart
      height={400}
      width={500}
      margin={0}
      xAxis={[{ data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
      yAxis={[{ min: 0, max: 10 }]}
      series={[
        {
          data: [5, 8, 3, 7, 2, 9, 4, 6, 1, 5, 3],
          label: 'Series C',
          area: true,
          highlightScope: { highlight: 'series', fade: 'global' },
        },
        {
          data: [2, 5.5, 2, 8.5, 1.5, 5, 1, 4, 3, 8, 2],
          label: 'Series A',
          highlightScope: { highlight: 'series', fade: 'global' },
        },
        {
          data: [8, 2, 5, 1, 7, 3, 9, 2, 6, 3, 7],
          label: 'Series B',
          highlightScope: { highlight: 'series', fade: 'global' },
        },
      ]}
      experimentalFeatures={{ enablePositionBasedPointerInteraction: true }}
    />
  );
}
