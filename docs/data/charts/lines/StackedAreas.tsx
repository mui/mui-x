import { LineChart } from '@mui/x-charts/LineChart';
import { dataset } from '../dataset/gdpPerCapitaEvolution';

export default function StackedAreas() {
  return (
    <div style={{ width: '100%' }}>
      <LineChart
        dataset={dataset}
        xAxis={[
          {
            id: 'Years',
            dataKey: 'date',
            scaleType: 'time',
            valueFormatter: (date) => date.getFullYear().toString(),
          },
        ]}
        yAxis={[{ width: 70 }]}
        series={[
          {
            id: 'France',
            label: 'French GDP per capita',
            dataKey: 'fr',
            stack: 'total',
            area: true,
          },
          {
            id: 'Germany',
            label: 'German GDP per capita',
            dataKey: 'dl',
            stack: 'total',
            area: true,
          },
          {
            id: 'United Kingdom',
            label: 'UK GDP per capita',
            dataKey: 'gb',
            stack: 'total',
            area: true,
          },
        ]}
        experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
        height={300}
      />
    </div>
  );
}
