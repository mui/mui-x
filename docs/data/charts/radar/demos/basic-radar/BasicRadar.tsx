import { RadarChart } from '@mui/x-charts/RadarChart';

export default function BasicRadar() {
  return (
    // @focus-start @padding 2
    <RadarChart
      height={300}
      series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
      radar={{
        max: 120,
        metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
      }}
    />
    // @focus-end
  );
}
