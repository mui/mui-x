import { LineChart } from '@mui/x-charts/LineChart';
import {
  worldElectricityProduction,
  keyToLabel,
  colors,
} from '../dataset/worldElectricityProduction';

const stackStrategy = {
  stack: 'total',
  area: true,
  stackOffset: 'none', // To stack 0 on top of others
};

const customize = {
  height: 350,
  hideLegend: true,
  experimentalFeatures: { preferStrictDomainInLineCharts: true },
};

export default function LineDataset() {
  return (
    <LineChart
      xAxis={[{ dataKey: 'year', valueFormatter: (value) => value.toString() }]}
      yAxis={[{ width: 50 }]}
      series={Object.keys(keyToLabel).map((key) => ({
        dataKey: key,
        label: keyToLabel[key],
        color: colors[key],
        ...stackStrategy,
      }))}
      dataset={worldElectricityProduction}
      {...customize}
    />
  );
}
