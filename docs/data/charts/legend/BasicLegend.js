import { ScatterChart } from '@mui/x-charts/ScatterChart';
import dataset from '../dataset/random/scatterParallel.json';

export default function BasicLegend() {
  return (
    <ScatterChart
      series={[
        { label: 'Var A', datasetKeys: { id: 'id', x: 'x1', y: 'y1' } },
        { label: 'Var B', datasetKeys: { id: 'id', x: 'x2', y: 'y2' } },
      ]}
      dataset={dataset}
      height={300}
    />
  );
}
