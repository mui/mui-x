import { BarChartPremium } from '@mui/x-charts-premium/BarChartPremium';
import { temperatureBerlinPorto } from '../dataset/temperatureBerlinPorto';

export default function RangeBarCustomLabels() {
  return (
    <BarChartPremium
      xAxis={[
        { data: temperatureBerlinPorto.months.map((month) => month.slice(0, 3)) },
      ]}
      yAxis={[{ width: 40, valueFormatter: (value: number) => `${value}°C` }]}
      series={[
        {
          type: 'rangeBar',
          label: 'Porto, Portugal',
          data: temperatureBerlinPorto.porto,
          barLabel: (item, context) => {
            if (item.value === null || context.bar.height < 90) {
              return null;
            }
            return `${(item.value[1] - item.value[0]).toFixed(1)}°C`;
          },
        },
      ]}
      height={300}
    />
  );
}
