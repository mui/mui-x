import {
  areaElementClasses,
  LineChart,
  lineElementClasses,
} from '@mui/x-charts/LineChart';
import { dataset } from '../dataset/gdpPerCapitaEvolution';

export default function CSSCustomization() {
  return (
    <LineChart
      dataset={dataset}
      sx={{
        [`& .${lineElementClasses.root}`]: {
          strokeDasharray: '10 5',
          strokeWidth: 4,
        },
        [`& .${areaElementClasses.root}[data-series="Germany"]`]: {
          fill: "url('#myGradient')",
          filter: 'none', // Remove the default filtering
        },
      }}
      xAxis={[
        {
          id: 'Years',
          dataKey: 'date',
          scaleType: 'time',
          valueFormatter: (date) => date.getFullYear().toString(),
        },
      ]}
      yAxis={[
        {
          width: 60,
        },
      ]}
      series={[
        {
          id: 'France',
          label: 'France',
          dataKey: 'fr',
          stack: 'total',
          area: true,
          showMark: false,
        },
        {
          id: 'Germany',
          label: 'Germany',
          dataKey: 'dl',
          stack: 'total',
          area: true,
          showMark: false,
        },
        {
          id: 'United Kingdom',
          label: 'United Kingdom',
          dataKey: 'gb',
          stack: 'total',
          area: true,
          showMark: false,
        },
      ]}
      experimentalFeatures={{ preferStrictDomainInLineCharts: true }}
      height={300}
    >
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(90)">
          <stop offset="5%" stopColor="gold" />
          <stop offset="95%" stopColor="red" />
        </linearGradient>
      </defs>
    </LineChart>
  );
}
