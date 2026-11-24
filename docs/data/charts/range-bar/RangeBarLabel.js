import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';

export default function RangeBarLabel() {
  return (
    <BarChartPremium
      xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'] }]}
      yAxis={[{ width: 30, min: 0, max: 30 }]}
      series={[
        {
          type: 'rangeBar',
          label: 'Center',
          data: [
            [4, 12],
            [8, 20],
            [6, 15],
            [10, 24],
          ],
          barLabel: 'value',
        },
        {
          type: 'rangeBar',
          label: 'Outside',
          data: [
            [2, 9],
            [12, 25],
            [16, 7],
            [18, 26],
          ],
          barLabel: 'value',
          barLabelPlacement: 'outside',
        },
      ]}
      height={300}
    />
  );
}
